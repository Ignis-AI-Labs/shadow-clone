/**
 * Logout Handlers
 *
 * Handler functions for the logout flow.
 * These handle logout page, local logout, and revoke routes.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import * as http from 'http';
import * as https from 'https';
import type { LogoutType, LogoutResult, ERC712RevokeMessage, RevokeResponse } from '../types.js';
import type { NonceTracker } from '../security.js';
import { parseJsonBody } from '../../utils/httpParser.js';
import {
  REVOKE_TYPES,
  ERC712_DOMAIN,
  validateCsrfToken,
  validateEthereumAddress,
  isDeadlineExpired,
  verifyERC712Signature,
  maskApiKey,
  CSP_HEADER
} from '../security.js';
import { getLogoutPage, getLogoutSuccessPage } from '../authPages.js';
import { logger } from '../../utils/logger.js';

/**
 * Logout session info
 */
export interface LogoutSession {
  apiKey: string;
  walletAddress?: string;
}

/**
 * Dependencies for logout handlers
 */
export interface LogoutHandlerDeps {
  apiEndpoint: string;
  csrfToken: string;
  session: LogoutSession;
  nonceTracker: NonceTracker;
  onLogoutComplete: (type: LogoutType) => Promise<void>;
  resolveLogout: (result: LogoutResult) => void;
  scheduleShutdown: () => void;
}

/**
 * Handle GET /logout - Serve logout page
 */
export function handleLogoutPage(
  res: ServerResponse,
  deps: { csrfToken: string; session: LogoutSession }
): void {
  const maskedKey = maskApiKey(deps.session.apiKey);
  const html = getLogoutPage(deps.csrfToken, maskedKey, deps.session.walletAddress);

  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': CSP_HEADER
  });
  res.end(html);
}

/**
 * Handle GET /logout/success - Serve logout success page
 */
export function handleLogoutSuccessPage(
  res: ServerResponse,
  type: LogoutType | null
): void {
  if (!type || (type !== 'local' && type !== 'revoked')) {
    res.writeHead(302, { 'Location': '/' });
    res.end();
    return;
  }

  const html = getLogoutSuccessPage(type);
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': CSP_HEADER
  });
  res.end(html);
}

/**
 * Handle POST /logout/get-key - Get the full API key for copying
 */
export async function handleLogoutGetKey(
  req: IncomingMessage,
  res: ServerResponse,
  deps: LogoutHandlerDeps
): Promise<void> {
  try {
    const body = await parseJsonBody(req);
    const csrf_token = body.csrf_token as string | undefined;

    // Validate CSRF token
    if (!validateCsrfToken(csrf_token, deps.csrfToken)) {
      sendJsonError(res, 403, 'Invalid request. Please refresh and try again.');
      return;
    }

    if (!deps.session.apiKey) {
      sendJsonError(res, 400, 'No active logout session');
      return;
    }

    sendJsonResponse(res, 200, {
      success: true,
      apiKey: deps.session.apiKey
    });
  } catch (error) {
    logger.error('Error handling get key request:', error);
    sendJsonError(res, 500, 'An unexpected error occurred.');
  }
}

/**
 * Handle POST /logout/local - Local logout (clear local storage only)
 */
export async function handleLogoutLocal(
  req: IncomingMessage,
  res: ServerResponse,
  deps: LogoutHandlerDeps
): Promise<void> {
  try {
    const body = await parseJsonBody(req);
    const csrf_token = body.csrf_token as string | undefined;

    // Validate CSRF token
    if (!validateCsrfToken(csrf_token, deps.csrfToken)) {
      sendJsonError(res, 403, 'Invalid request. Please refresh and try again.');
      return;
    }

    logger.info('Processing local logout');

    // Call logout callback to clear auth data BEFORE responding
    await deps.onLogoutComplete('local');

    sendJsonResponse(res, 200, { success: true });

    // Resolve the logout promise
    deps.resolveLogout({
      success: true,
      type: 'local'
    });

    // Schedule shutdown
    deps.scheduleShutdown();
  } catch (error) {
    logger.error('Error handling local logout:', error);
    sendJsonError(res, 500, 'An unexpected error occurred.');
  }
}

/**
 * Handle POST /logout/revoke - Revoke API key permanently (requires wallet signature)
 */
export async function handleLogoutRevoke(
  req: IncomingMessage,
  res: ServerResponse,
  deps: LogoutHandlerDeps
): Promise<void> {
  try {
    const body = await parseJsonBody(req);
    const message = body.message as ERC712RevokeMessage | undefined;
    const signature = body.signature as string | undefined;
    const csrf_token = body.csrf_token as string | undefined;

    // Validate CSRF token
    if (!validateCsrfToken(csrf_token, deps.csrfToken)) {
      sendJsonError(res, 403, 'Invalid request. Please refresh and try again.');
      return;
    }

    if (!deps.session.apiKey) {
      sendJsonError(res, 400, 'No active logout session');
      return;
    }

    // Validate required fields
    if (!message || !signature) {
      sendJsonError(res, 400, 'Missing required fields: message or signature');
      return;
    }

    // Validate message fields
    if (!message.wallet || !message.nonce || !message.deadline || message.action !== 'revoke') {
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

    // Check for nonce replay on revoke
    if (deps.nonceTracker.isUsed(message.nonce)) {
      sendJsonError(res, 401, 'This signature has already been used. Please sign again.');
      return;
    }

    logger.info('Processing revoke logout', {
      address: address.slice(0, 10) + '...'
    });

    // Verify ERC-712 signature locally
    const recoveredAddress = verifyERC712Signature(
      ERC712_DOMAIN,
      REVOKE_TYPES,
      message,
      signature
    );

    if (!recoveredAddress || recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      sendJsonError(res, 401, 'Invalid signature.');
      return;
    }

    // Mark nonce as used
    deps.nonceTracker.markUsed(message.nonce, message.deadline);

    // Forward to backend
    try {
      const backendResponse = await forwardRevokeToBackend(
        deps.apiEndpoint,
        deps.session.apiKey,
        message,
        signature
      );

      if (backendResponse.success) {
        // Call logout callback to clear auth data
        await deps.onLogoutComplete('revoked');

        sendJsonResponse(res, 200, { success: true });

        // Resolve the logout promise
        deps.resolveLogout({
          success: true,
          type: 'revoked'
        });

        // Schedule shutdown
        deps.scheduleShutdown();
      } else {
        sendJsonError(res, 401, backendResponse.message || 'Revocation failed');
      }
    } catch (backendError) {
      logger.error('Backend revoke request failed:', backendError);
      sendJsonError(res, 500, 'Failed to communicate with backend. Please try again.');
    }
  } catch (error) {
    logger.error('Error handling revoke logout:', error);
    sendJsonError(res, 500, 'An unexpected error occurred.');
  }
}

/**
 * Forward revoke request to backend API
 */
export function forwardRevokeToBackend(
  apiEndpoint: string,
  apiKey: string,
  message: ERC712RevokeMessage,
  signature: string
): Promise<RevokeResponse> {
  return new Promise((resolve, reject) => {
    const url = new URL(`${apiEndpoint}/shadow-clone-licenses/revoke`);

    const postData = JSON.stringify({
      apiKey,
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
        'X-API-Key': apiKey,
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
              message: 'Revoke endpoint not available yet'
            });
            return;
          }

          const jsonResponse = JSON.parse(data);
          resolve(jsonResponse as RevokeResponse);
        } catch {
          reject(new Error('Failed to parse backend response'));
        }
      });
    });

    request.on('error', (error) => {
      logger.error('Backend revoke request failed:', error);
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
