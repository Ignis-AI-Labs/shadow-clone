/**
 * Wallet Authentication Handlers
 *
 * Handler functions for ERC-712 wallet authentication.
 * These handle POST /wallet-auth and POST /regenerate routes.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import * as http from 'http';
import * as https from 'https';
import type {
  ValidateApiKeyFn,
  AuthResult,
  ERC712AuthMessage,
  ERC712RegenerateMessage,
  WalletAuthResponse,
  RegenerateResponse
} from '../types.js';
import type { NonceTracker } from '../security.js';
import type { KeyDeliveryStore } from '../keyDelivery.js';
import { parseJsonBody } from '../../utils/httpParser.js';
import {
  ERC712_DOMAIN,
  AUTH_TYPES,
  REGENERATE_TYPES,
  validateCsrfToken,
  validateEthereumAddress,
  isDeadlineExpired,
  verifyERC712Signature
} from '../security.js';
import { logger } from '../../utils/logger.js';

/**
 * Dependencies for wallet auth handlers
 */
export interface WalletAuthDeps {
  apiEndpoint: string;
  validateApiKey: ValidateApiKeyFn;
  csrfToken: string;
  nonceTracker: NonceTracker;
  keyDeliveryStore: KeyDeliveryStore;
  onAuthSuccess: (result: AuthResult) => void;
  scheduleShutdown: () => void;
}

/**
 * Handle POST /wallet-auth - ERC-712 wallet authentication
 */
export async function handleWalletAuth(
  req: IncomingMessage,
  res: ServerResponse,
  deps: WalletAuthDeps
): Promise<void> {
  try {
    const body = await parseJsonBody(req);
    const message = body.message as ERC712AuthMessage | undefined;
    const signature = body.signature as string | undefined;
    const csrf_token = body.csrf_token as string | undefined;

    // Validate CSRF token
    if (!validateCsrfToken(csrf_token, deps.csrfToken)) {
      sendJsonError(res, 403, 'Invalid request. Please refresh and try again.');
      return;
    }

    // Validate required fields (ERC-712 format)
    if (!message || !signature) {
      sendJsonError(res, 400, 'Missing required fields: message or signature');
      return;
    }

    // Validate ERC-712 message fields
    if (!message.wallet || !message.nonce || !message.deadline) {
      sendJsonError(res, 400, 'Invalid message format: missing wallet, nonce, or deadline');
      return;
    }

    const address = message.wallet;

    // Validate Ethereum address format
    if (!validateEthereumAddress(address)) {
      sendJsonError(res, 400, 'Invalid Ethereum address format');
      return;
    }

    // Check deadline expiry
    if (isDeadlineExpired(message.deadline)) {
      sendJsonError(res, 401, 'Signature expired. Please sign again.');
      return;
    }

    // Check for nonce replay
    if (deps.nonceTracker.isUsed(message.nonce)) {
      sendJsonError(res, 401, 'This signature has already been used. Please sign again.');
      return;
    }

    logger.info('Processing ERC-712 wallet authentication request', {
      address: address.slice(0, 10) + '...'
    });

    // Verify ERC-712 signature locally before forwarding to backend
    const recoveredAddress = verifyERC712Signature(
      ERC712_DOMAIN,
      AUTH_TYPES,
      message,
      signature
    );

    if (!recoveredAddress) {
      logger.warn('Local ERC-712 signature verification failed', {
        address: address.slice(0, 10) + '...'
      });
      sendJsonError(res, 401, 'Invalid signature. Please try again.');
      return;
    }

    // Verify recovered address matches claimed address
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      logger.warn('ERC-712 signature address mismatch', {
        claimed: address.slice(0, 10) + '...',
        recovered: recoveredAddress.slice(0, 10) + '...'
      });
      sendJsonError(res, 401, 'Signature does not match claimed wallet address.');
      return;
    }

    logger.info('Local ERC-712 signature verification passed', {
      address: address.slice(0, 10) + '...'
    });

    // Mark nonce as used after successful verification
    deps.nonceTracker.markUsed(message.nonce, message.deadline);

    // Forward to backend API
    try {
      const backendResponse = await forwardWalletAuthToBackend(deps.apiEndpoint, message, signature);

      if (backendResponse.success && backendResponse.apiKey) {
        // Check if this is an existing key (masked) or a new key
        if (backendResponse.isNewKey === false) {
          // Existing key scenario - return page URL for client to redirect
          logger.info('Existing API key found for wallet, showing options page', {
            address: address.slice(0, 10) + '...',
            maskedKey: backendResponse.apiKey.slice(0, 15) + '...'
          });

          sendJsonResponse(res, 200, {
            success: true,
            existingKey: true,
            maskedKey: backendResponse.apiKey,
            walletAddress: address,
            redirectUrl: `/existing-key?masked=${encodeURIComponent(backendResponse.apiKey)}&wallet=${encodeURIComponent(address)}`
          });
          return;
        }

        // New key - validate and show save key page
        const validationResult = await deps.validateApiKey(backendResponse.apiKey);

        if (validationResult.success) {
          // Store key securely and return token instead of key in URL
          const token = deps.keyDeliveryStore.store(
            backendResponse.apiKey,
            validationResult.licenseType || 'Active'
          );

          // Return success with redirect to new key page using token
          sendJsonResponse(res, 200, {
            success: true,
            isNewKey: true,
            token,
            licenseType: validationResult.licenseType,
            walletAddress: address,
            redirectUrl: `/new-key-success?token=${encodeURIComponent(token)}`
          });

          // Don't resolve auth promise yet - wait for user to copy key
          return;
        } else {
          sendJsonError(res, 401, validationResult.message || 'API key validation failed');
        }
      } else {
        res.writeHead(backendResponse.notImplemented ? 200 : 401, {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(backendResponse));
      }
    } catch {
      // Backend endpoint not available - return graceful fallback
      logger.info('Wallet auth backend not available, returning fallback response');
      sendJsonResponse(res, 200, {
        success: false,
        notImplemented: true,
        message: 'Wallet authentication is currently unavailable. Please use your API key.',
        walletAddress: address
      });
    }
  } catch (error) {
    logger.error('Error handling wallet auth request:', error);
    sendJsonError(res, 500, 'An unexpected error occurred. Please try again.');
  }
}

/**
 * Handle POST /regenerate - Regenerate API key request
 */
export async function handleRegenerate(
  req: IncomingMessage,
  res: ServerResponse,
  deps: WalletAuthDeps
): Promise<void> {
  try {
    const body = await parseJsonBody(req);
    const message = body.message as ERC712RegenerateMessage | undefined;
    const signature = body.signature as string | undefined;
    const csrf_token = body.csrf_token as string | undefined;

    // Validate CSRF token
    if (!validateCsrfToken(csrf_token, deps.csrfToken)) {
      sendJsonError(res, 403, 'Invalid request. Please refresh and try again.');
      return;
    }

    // Validate required fields
    if (!message || !signature) {
      sendJsonError(res, 400, 'Missing required fields: message or signature');
      return;
    }

    // Validate message fields
    if (!message.wallet || !message.nonce || !message.deadline || message.action !== 'regenerate') {
      sendJsonError(res, 400, 'Invalid message format');
      return;
    }

    const address = message.wallet;

    // Validate Ethereum address format
    if (!validateEthereumAddress(address)) {
      sendJsonError(res, 400, 'Invalid Ethereum address format');
      return;
    }

    // Check deadline expiry
    if (isDeadlineExpired(message.deadline)) {
      sendJsonError(res, 401, 'Signature expired. Please sign again.');
      return;
    }

    // Check for nonce replay on regenerate
    if (deps.nonceTracker.isUsed(message.nonce)) {
      sendJsonError(res, 401, 'This signature has already been used. Please sign again.');
      return;
    }

    logger.info('Processing regenerate request', {
      address: address.slice(0, 10) + '...'
    });

    // Mark nonce as used
    deps.nonceTracker.markUsed(message.nonce, message.deadline);

    // Forward to backend
    try {
      const backendResponse = await forwardRegenerateToBackend(deps.apiEndpoint, message, signature);

      if (backendResponse.success && backendResponse.apiKey) {
        // Store key securely and return token instead of key in URL
        const token = deps.keyDeliveryStore.store(
          backendResponse.apiKey,
          backendResponse.licenseType || 'Active'
        );

        sendJsonResponse(res, 200, {
          success: true,
          token,
          licenseType: backendResponse.licenseType || 'Active',
          walletAddress: address
        });
      } else {
        sendJsonError(res, 401, backendResponse.message || 'Regeneration failed');
      }
    } catch (backendError) {
      logger.error('Backend regenerate request failed:', backendError);
      sendJsonError(res, 500, 'Failed to communicate with backend. Please try again.');
    }
  } catch (error) {
    logger.error('Error handling regenerate request:', error);
    sendJsonError(res, 500, 'An unexpected error occurred. Please try again.');
  }
}

/**
 * Forward wallet authentication to backend API
 */
export function forwardWalletAuthToBackend(
  apiEndpoint: string,
  message: ERC712AuthMessage,
  signature: string
): Promise<WalletAuthResponse> {
  return new Promise((resolve, reject) => {
    const url = new URL(`${apiEndpoint}/wallet-auth`);

    const postData = JSON.stringify({
      message,
      signature
    });

    const options: https.RequestOptions = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Shadow-Clone-MCP/0.1.0'
      },
      timeout: 30000
    };

    const protocol = url.protocol === 'https:' ? https : http;

    const request = protocol.request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          if (response.statusCode === 404) {
            resolve({
              success: false,
              notImplemented: true,
              message: 'Wallet authentication endpoint not available yet'
            });
            return;
          }

          const jsonResponse = JSON.parse(data);
          resolve(jsonResponse as WalletAuthResponse);
        } catch {
          reject(new Error('Failed to parse backend response'));
        }
      });
    });

    request.on('error', (error) => {
      logger.error('Backend wallet auth request failed:', error);
      reject(error);
    });

    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Backend request timeout'));
    });

    request.write(postData);
    request.end();
  });
}

/**
 * Forward regenerate request to backend API
 */
export function forwardRegenerateToBackend(
  apiEndpoint: string,
  message: ERC712RegenerateMessage,
  signature: string
): Promise<RegenerateResponse> {
  return new Promise((resolve, reject) => {
    const url = new URL(`${apiEndpoint}/shadow-clone-licenses/regenerate`);

    const postData = JSON.stringify({
      message,
      signature
    });

    const options: https.RequestOptions = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Shadow-Clone-MCP/0.1.0'
      },
      timeout: 30000
    };

    const protocol = url.protocol === 'https:' ? https : http;

    const request = protocol.request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          if (response.statusCode === 404) {
            resolve({
              success: false,
              message: 'Regenerate endpoint not available yet'
            });
            return;
          }

          const jsonResponse = JSON.parse(data);
          resolve(jsonResponse as RegenerateResponse);
        } catch {
          reject(new Error('Failed to parse backend response'));
        }
      });
    });

    request.on('error', (error) => {
      logger.error('Backend regenerate request failed:', error);
      reject(error);
    });

    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Backend request timeout'));
    });

    request.write(postData);
    request.end();
  });
}

/**
 * Send JSON error response
 */
function sendJsonError(res: ServerResponse, status: number, message: string): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: false, message }));
}

/**
 * Send JSON success response
 */
function sendJsonResponse(res: ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}
