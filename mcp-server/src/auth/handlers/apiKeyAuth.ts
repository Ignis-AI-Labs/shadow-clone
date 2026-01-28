/**
 * API Key Authentication Handlers
 *
 * Pure handler functions for API key form authentication.
 * These handle POST /auth and POST /paste-key routes.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import type { ValidateApiKeyFn, AuthResult } from '../types.js';
import { parseFormData } from '../../utils/httpParser.js';
import { validateCsrfToken, validateEthereumAddress, CSP_HEADER } from '../security.js';
import { getSuccessPage, getErrorPage } from '../authPages.js';
import { logger } from '../../utils/logger.js';

/**
 * Dependencies for API key auth handlers
 */
export interface ApiKeyAuthDeps {
  validateApiKey: ValidateApiKeyFn;
  csrfToken: string;
  onAuthSuccess: (result: AuthResult) => void;
  scheduleShutdown: () => void;
}

/**
 * Handle POST /auth - API key form submission
 */
export async function handlePostAuth(
  req: IncomingMessage,
  res: ServerResponse,
  deps: ApiKeyAuthDeps
): Promise<void> {
  try {
    const formData = await parseFormData(req);
    const apiKey = formData.get('apiKey');
    const csrfToken = formData.get('csrf_token');

    // Validate CSRF token
    if (!validateCsrfToken(csrfToken, deps.csrfToken)) {
      sendErrorResponse(res, 403, 'Invalid request. Please refresh and try again.');
      return;
    }

    // Validate API key presence
    if (!apiKey || typeof apiKey !== 'string' || apiKey.length < 10) {
      sendErrorResponse(res, 400, 'Please enter a valid API key.');
      return;
    }

    // Validate API key with backend
    const result = await deps.validateApiKey(apiKey);

    if (result.success) {
      // Send success page
      sendSuccessResponse(res, result.licenseType || 'Active');

      // Resolve the auth promise
      deps.onAuthSuccess({
        success: true,
        apiKey,
        licenseType: result.licenseType,
        userId: result.userId,
        walletAddress: result.walletAddress
      });

      // Schedule shutdown after a brief delay to let the page load
      deps.scheduleShutdown();
    } else {
      sendErrorResponse(res, 401, result.message || 'Authentication failed. Please check your API key.');
    }
  } catch (error) {
    logger.error('Error handling auth request:', error);
    sendErrorResponse(res, 500, 'An unexpected error occurred. Please try again.');
  }
}

/**
 * Handle POST /paste-key - Paste API key form submission (existing key scenario)
 */
export async function handlePasteKey(
  req: IncomingMessage,
  res: ServerResponse,
  deps: ApiKeyAuthDeps
): Promise<void> {
  try {
    const formData = await parseFormData(req);
    const apiKey = formData.get('apiKey');
    const csrfToken = formData.get('csrf_token');
    const walletAddress = formData.get('walletAddress');

    // Validate CSRF token
    if (!validateCsrfToken(csrfToken, deps.csrfToken)) {
      sendErrorResponse(res, 403, 'Invalid request. Please refresh and try again.');
      return;
    }

    // Validate Ethereum address format if provided
    if (walletAddress && !validateEthereumAddress(walletAddress)) {
      sendErrorResponse(res, 400, 'Invalid wallet address format.');
      return;
    }

    // Validate API key presence
    if (!apiKey || typeof apiKey !== 'string' || apiKey.length < 10) {
      sendErrorResponse(res, 400, 'Please enter a valid API key.');
      return;
    }

    // Validate API key with backend
    const result = await deps.validateApiKey(apiKey);

    if (result.success) {
      // Send success page
      sendSuccessResponse(res, result.licenseType || 'Active');

      // Resolve the auth promise
      deps.onAuthSuccess({
        success: true,
        apiKey,
        licenseType: result.licenseType,
        userId: result.userId,
        walletAddress: walletAddress || result.walletAddress
      });

      // Schedule shutdown
      deps.scheduleShutdown();
    } else {
      sendErrorResponse(res, 401, result.message || 'Invalid API key. Please check and try again.');
    }
  } catch (error) {
    logger.error('Error handling paste key request:', error);
    sendErrorResponse(res, 500, 'An unexpected error occurred. Please try again.');
  }
}

/**
 * Send error response with HTML page
 */
function sendErrorResponse(res: ServerResponse, status: number, message: string): void {
  const html = getErrorPage(message);
  res.writeHead(status, {
    'Content-Type': 'text/html',
    'Content-Security-Policy': CSP_HEADER
  });
  res.end(html);
}

/**
 * Send success response with HTML page
 */
function sendSuccessResponse(res: ServerResponse, licenseType: string): void {
  const html = getSuccessPage(licenseType);
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Security-Policy': CSP_HEADER
  });
  res.end(html);
}
