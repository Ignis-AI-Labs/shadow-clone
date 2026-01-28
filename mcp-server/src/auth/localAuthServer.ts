/**
 * Local HTTP Server for Browser-Based Authentication
 *
 * This module provides a secure browser-based authentication flow
 * where users can enter their API key on a locally-served webpage,
 * keeping the key hidden from the MCP client.
 * 
 * Supports both traditional API key entry and wallet-based authentication.
 */

import * as http from 'http';
import * as https from 'https';
import * as crypto from 'crypto';
import { ethers } from 'ethers';
import {
  getAuthFormPage,
  getSuccessPage,
  getErrorPage,
  getExistingKeyPage,
  getRegenerateSuccessPage,
  getNewKeySuccessPage,
  getLogoutPage,
  getLogoutSuccessPage
} from './authPages.js';
import { logger } from '../utils/logger.js';

/**
 * Result of browser-based authentication
 */
export interface AuthResult {
  success: boolean;
  apiKey?: string;
  licenseType?: string;
  userId?: string;
  walletAddress?: string;
  error?: string;
}

/**
 * Callback type for API key validation
 */
export type ValidateApiKeyFn = (apiKey: string) => Promise<{
  success: boolean;
  licenseType?: string;
  userId?: string;
  walletAddress?: string;
  message?: string;
}>;

/**
 * Callback type for logout completion
 */
export type LogoutCallbackFn = (type: LogoutType) => Promise<void>;

/**
 * ERC-712 Domain type
 */
export interface ERC712Domain {
  name: string;
  version: string;
  chainId: number;
}

/**
 * ERC-712 Auth message type
 */
export interface ERC712AuthMessage {
  wallet: string;
  nonce: string;
  deadline: number;
}

/**
 * Wallet authentication request data (ERC-712 format)
 */
export interface WalletAuthRequest {
  domain?: ERC712Domain;
  types?: Record<string, Array<{ name: string; type: string }>>;
  message: ERC712AuthMessage;
  signature: string;
  csrf_token: string;
}

/**
 * Wallet authentication response from backend
 */
export interface WalletAuthResponse {
  success: boolean;
  apiKey?: string;
  licenseType?: string;
  walletAddress?: string;
  userId?: string;
  message?: string;
  notImplemented?: boolean;
  isNewKey?: boolean;  // false means existing key (masked)
  warning?: string;    // Warning message for new keys (e.g., "save this key")
}

/**
 * ERC-712 Revoke message type
 */
export interface ERC712RevokeMessage {
  wallet: string;
  nonce: string;
  deadline: number;
  action: 'revoke';
}

/**
 * ERC-712 Regenerate message type
 */
export interface ERC712RegenerateMessage {
  wallet: string;
  nonce: string;
  deadline: number;
  action: 'regenerate';
}

/**
 * Revoke response from backend
 */
export interface RevokeResponse {
  success: boolean;
  message?: string;
}

/**
 * Regenerate response from backend
 */
export interface RegenerateResponse {
  success: boolean;
  apiKey?: string;
  licenseType?: string;
  walletAddress?: string;
  message?: string;
}

/**
 * Logout result type
 */
export type LogoutType = 'local' | 'revoked' | 'cancelled';

/**
 * Result of browser-based logout
 */
export interface LogoutResult {
  success: boolean;
  type: LogoutType;
  error?: string;
}

/**
 * Server mode - determines which routes are active
 */
export type ServerMode = 'auth' | 'logout';

/**
 * Pending key delivery entry for token-based key transfer
 */
interface PendingKeyDelivery {
  apiKey: string;
  license: string;
  expires: number;
}

/**
 * Local HTTP server for browser-based authentication
 */
export class LocalAuthServer {
  private server: http.Server | null = null;
  private port: number = 0;
  private csrfToken: string = '';
  private authPromise: Promise<AuthResult> | null = null;
  private authResolve: ((result: AuthResult) => void) | null = null;
  private logoutPromise: Promise<LogoutResult> | null = null;
  private logoutResolve: ((result: LogoutResult) => void) | null = null;
  private timeoutHandle: NodeJS.Timeout | null = null;
  private shutdownHandle: NodeJS.Timeout | null = null;
  private validateApiKey: ValidateApiKeyFn;
  private apiEndpoint: string;
  private mode: ServerMode = 'auth';
  private currentApiKey: string | null = null;
  private currentWalletAddress: string | null = null;
  private logoutCallback: LogoutCallbackFn | null = null;

  // Token-based key delivery storage
  private pendingKeyDelivery = new Map<string, PendingKeyDelivery>();
  private static readonly KEY_DELIVERY_EXPIRY_MS = 60000; // 60 second expiry

  // Nonce replay protection
  private usedNonces = new Map<string, number>(); // nonce -> expiry timestamp

  // Server-defined ERC-712 domain
  private static readonly EXPECTED_DOMAIN: ERC712Domain = {
    name: 'Shadow Clone',
    version: '1',
    chainId: 1
  };

  private static readonly PORT_RANGE_START = 49152;
  private static readonly PORT_RANGE_END = 65535;
  private static readonly MAX_PORT_RETRIES = 10;
  private static readonly DEFAULT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
  private static readonly SHUTDOWN_DELAY_MS = 2000; // 2 seconds for page to load

  // Content-Security-Policy header for all HTML responses
  private static readonly CSP_HEADER = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src https://fonts.gstatic.com",
    "connect-src 'self'",
    "img-src 'self' data:",
  ].join('; ');

  constructor(validateApiKey: ValidateApiKeyFn, apiEndpoint?: string) {
    this.validateApiKey = validateApiKey;
    this.apiEndpoint = apiEndpoint || process.env.SHADOW_CLONE_API_ENDPOINT || 'https://api.ignislabs.ai';
  }

  /**
   * Store API key for secure delivery via token
   * Returns a one-time token that can be used to retrieve the key
   */
  private storeKeyForDelivery(apiKey: string, license: string): string {
    const token = crypto.randomUUID();
    this.pendingKeyDelivery.set(token, {
      apiKey,
      license,
      expires: Date.now() + LocalAuthServer.KEY_DELIVERY_EXPIRY_MS
    });
    return token;
  }

  /**
   * Retrieve API key by token and delete it (one-time use)
   */
  private retrieveKeyByToken(token: string): { apiKey: string; license: string } | null {
    const entry = this.pendingKeyDelivery.get(token);
    if (!entry || entry.expires < Date.now()) {
      this.pendingKeyDelivery.delete(token);
      return null;
    }
    this.pendingKeyDelivery.delete(token); // One-time use
    return { apiKey: entry.apiKey, license: entry.license };
  }

  /**
   * Check if a nonce has already been used
   */
  private isNonceUsed(nonce: string): boolean {
    // Clean up expired nonces
    const now = Math.floor(Date.now() / 1000);
    for (const [n, expiry] of this.usedNonces) {
      if (expiry < now) this.usedNonces.delete(n);
    }
    return this.usedNonces.has(nonce);
  }

  /**
   * Mark a nonce as used
   */
  private markNonceUsed(nonce: string, deadline: number): void {
    this.usedNonces.set(nonce, deadline);
  }

  /**
   * Start the local authentication server
   * @returns The URL where the user should open their browser
   */
  async start(): Promise<{ port: number; url: string }> {
    if (this.server) {
      throw new Error('Auth server is already running');
    }

    // Generate CSRF token
    this.csrfToken = crypto.randomBytes(32).toString('hex');

    // Create HTTP server
    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    // Find an available port
    this.port = await this.findAvailablePort();

    // Bind to localhost only for security
    await new Promise<void>((resolve, reject) => {
      this.server!.listen(this.port, '127.0.0.1', () => {
        resolve();
      });
      this.server!.once('error', reject);
    });

    const url = `http://localhost:${this.port}`;
    logger.info(`Local auth server started at ${url}`);

    return { port: this.port, url };
  }

  /**
   * Start the local server in logout mode
   * @param apiKey - The current API key to potentially show/revoke
   * @param walletAddress - The wallet address associated with the key (optional)
   * @param logoutCallback - Callback to execute when logout is confirmed (clears auth data)
   * @returns The URL where the user should open their browser
   */
  async startLogout(
    apiKey: string,
    walletAddress?: string,
    logoutCallback?: LogoutCallbackFn
  ): Promise<{ port: number; url: string }> {
    if (this.server) {
      throw new Error('Auth server is already running');
    }

    // Set mode to logout
    this.mode = 'logout';
    this.currentApiKey = apiKey;
    this.currentWalletAddress = walletAddress || null;
    this.logoutCallback = logoutCallback || null;

    // Generate CSRF token
    this.csrfToken = crypto.randomBytes(32).toString('hex');

    // Create HTTP server
    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    // Find an available port
    this.port = await this.findAvailablePort();

    // Bind to localhost only for security
    await new Promise<void>((resolve, reject) => {
      this.server!.listen(this.port, '127.0.0.1', () => {
        resolve();
      });
      this.server!.once('error', reject);
    });

    const url = `http://localhost:${this.port}/logout`;
    logger.info(`Local logout server started at ${url}`);

    return { port: this.port, url };
  }

  /**
   * Wait for browser logout to complete
   * @param timeoutMs - Maximum time to wait for logout
   */
  waitForLogout(timeoutMs: number = LocalAuthServer.DEFAULT_TIMEOUT_MS): Promise<LogoutResult> {
    if (!this.server) {
      return Promise.reject(new Error('Server not started'));
    }

    if (this.mode !== 'logout') {
      return Promise.reject(new Error('Server not in logout mode'));
    }

    // Create promise if not exists
    if (!this.logoutPromise) {
      this.logoutPromise = new Promise<LogoutResult>((resolve) => {
        this.logoutResolve = resolve;
      });

      // Set timeout
      this.timeoutHandle = setTimeout(() => {
        if (this.logoutResolve) {
          this.logoutResolve({
            success: false,
            type: 'cancelled',
            error: 'Logout timed out. Please try again.'
          });
        }
        this.shutdown();
      }, timeoutMs);
    }

    return this.logoutPromise;
  }

  /**
   * Wait for browser authentication to complete
   * @param timeoutMs - Maximum time to wait for authentication
   */
  waitForAuth(timeoutMs: number = LocalAuthServer.DEFAULT_TIMEOUT_MS): Promise<AuthResult> {
    if (!this.server) {
      return Promise.reject(new Error('Auth server not started'));
    }

    // Create promise if not exists
    if (!this.authPromise) {
      this.authPromise = new Promise<AuthResult>((resolve) => {
        this.authResolve = resolve;
      });

      // Set timeout
      this.timeoutHandle = setTimeout(() => {
        if (this.authResolve) {
          this.authResolve({
            success: false,
            error: 'Authentication timed out. Please try again.'
          });
        }
        this.shutdown();
      }, timeoutMs);
    }

    return this.authPromise;
  }

  /**
   * Shutdown the local auth server
   */
  async shutdown(): Promise<void> {
    // Clear timeout
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }

    if (this.shutdownHandle) {
      clearTimeout(this.shutdownHandle);
      this.shutdownHandle = null;
    }

    // Close server
    if (this.server) {
      await new Promise<void>((resolve) => {
        this.server!.close(() => {
          resolve();
        });
      });
      this.server = null;
      logger.info('Local auth server shut down');
    }

    // Reset state
    this.authPromise = null;
    this.authResolve = null;
    this.logoutPromise = null;
    this.logoutResolve = null;
    this.logoutCallback = null;
    this.csrfToken = '';
    this.mode = 'auth';
    this.currentApiKey = null;
    this.currentWalletAddress = null;
  }

  /**
   * Check if the server is running
   */
  isRunning(): boolean {
    return this.server !== null && this.server.listening;
  }

  /**
   * Get the current server URL
   */
  getUrl(): string | null {
    if (!this.isRunning()) return null;
    return `http://localhost:${this.port}`;
  }

  /**
   * Find an available port in the dynamic port range
   */
  private async findAvailablePort(): Promise<number> {
    for (let i = 0; i < LocalAuthServer.MAX_PORT_RETRIES; i++) {
      const port = this.getRandomPort();
      const available = await this.isPortAvailable(port);
      if (available) {
        return port;
      }
    }
    throw new Error('Could not find an available port for auth server');
  }

  /**
   * Get a random port in the dynamic port range
   */
  private getRandomPort(): number {
    return Math.floor(
      Math.random() * (LocalAuthServer.PORT_RANGE_END - LocalAuthServer.PORT_RANGE_START + 1)
    ) + LocalAuthServer.PORT_RANGE_START;
  }

  /**
   * Check if a port is available
   */
  private isPortAvailable(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const testServer = http.createServer();
      testServer.listen(port, '127.0.0.1', () => {
        testServer.close(() => resolve(true));
      });
      testServer.once('error', () => resolve(false));
    });
  }

  /**
   * Handle incoming HTTP requests
   */
  private handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    const url = new URL(req.url || '/', `http://localhost:${this.port}`);

    // Add CORS headers for wallet auth requests (restricted to localhost for security)
    res.setHeader('Access-Control-Allow-Origin', `http://localhost:${this.port}`);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // Route requests
    if (req.method === 'GET' && url.pathname === '/') {
      this.handleGetForm(res);
    } else if (req.method === 'POST' && url.pathname === '/auth') {
      this.handlePostAuth(req, res);
    } else if (req.method === 'POST' && url.pathname === '/wallet-auth') {
      this.handleWalletAuth(req, res);
    } else if (req.method === 'POST' && url.pathname === '/paste-key') {
      this.handlePasteKey(req, res);
    } else if (req.method === 'POST' && url.pathname === '/regenerate') {
      this.handleRegenerate(req, res);
    } else if (req.method === 'GET' && url.pathname === '/existing-key') {
      this.handleExistingKeyPage(res, url);
    } else if (req.method === 'GET' && url.pathname === '/new-key-success') {
      this.handleNewKeySuccessPage(res, url);
    } else if (req.method === 'POST' && url.pathname === '/get-key-by-token') {
      this.handleGetKeyByToken(req, res);
    } else if (req.method === 'GET' && url.pathname === '/regenerate-success') {
      this.handleRegenerateSuccessPage(res, url);
    } else if (req.method === 'GET' && url.pathname === '/success') {
      this.handleSuccessPage(res);
    } else if (req.method === 'GET' && url.pathname === '/status') {
      this.handleGetStatus(res);
    } else if (req.method === 'GET' && url.pathname === '/logout') {
      this.handleLogoutPage(res);
    } else if (req.method === 'POST' && url.pathname === '/logout/get-key') {
      this.handleLogoutGetKey(req, res);
    } else if (req.method === 'POST' && url.pathname === '/logout/local') {
      this.handleLogoutLocal(req, res);
    } else if (req.method === 'POST' && url.pathname === '/logout/revoke') {
      this.handleLogoutRevoke(req, res);
    } else if (req.method === 'GET' && url.pathname === '/logout/success') {
      this.handleLogoutSuccessPage(res, url);
    } else {
      this.sendNotFound(res);
    }
  }

  /**
   * Serve the authentication form
   */
  private handleGetForm(res: http.ServerResponse): void {
    const html = getAuthFormPage(this.csrfToken);
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': LocalAuthServer.CSP_HEADER
    });
    res.end(html);
  }

  /**
   * Handle authentication form submission
   */
  private async handlePostAuth(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    try {
      // Parse form data
      const formData = await this.parseFormData(req);
      const apiKey = formData.get('apiKey');
      const csrfToken = formData.get('csrf_token');

      // Validate CSRF token
      if (!csrfToken || csrfToken !== this.csrfToken) {
        const html = getErrorPage('Invalid request. Please refresh and try again.');
        res.writeHead(403, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
      }

      // Validate API key presence
      if (!apiKey || typeof apiKey !== 'string' || apiKey.length < 10) {
        const html = getErrorPage('Please enter a valid API key.');
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
      }

      // Validate API key with backend
      const result = await this.validateApiKey(apiKey);

      if (result.success) {
        // Send success page
        const html = getSuccessPage(result.licenseType || 'Active');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);

        // Resolve the auth promise
        if (this.authResolve) {
          this.authResolve({
            success: true,
            apiKey,
            licenseType: result.licenseType,
            userId: result.userId,
            walletAddress: result.walletAddress
          });
        }

        // Schedule shutdown after a brief delay to let the page load
        this.shutdownHandle = setTimeout(() => {
          this.shutdown();
        }, LocalAuthServer.SHUTDOWN_DELAY_MS);
      } else {
        // Send error page
        const html = getErrorPage(result.message || 'Authentication failed. Please check your API key.');
        res.writeHead(401, { 'Content-Type': 'text/html' });
        res.end(html);
      }
    } catch (error) {
      logger.error('Error handling auth request:', error);
      const html = getErrorPage('An unexpected error occurred. Please try again.');
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(html);
    }
  }

  /**
   * Handle status check request
   */
  private handleGetStatus(res: http.ServerResponse): void {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    });
    res.end(JSON.stringify({
      running: true,
      waiting: this.authResolve !== null
    }));
  }

  /**
   * Handle wallet-based authentication
   * Verifies ERC-712 signature and forwards to backend for API key retrieval
   */
  private async handleWalletAuth(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    try {
      // Parse JSON body
      const body = await this.parseJsonBody(req);
      const domain = body.domain as ERC712Domain | undefined;
      const message = body.message as ERC712AuthMessage | undefined;
      const signature = body.signature as string | undefined;
      const csrf_token = body.csrf_token as string | undefined;

      // Validate CSRF token
      if (!csrf_token || csrf_token !== this.csrfToken) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: false, 
          message: 'Invalid request. Please refresh and try again.' 
        }));
        return;
      }

      // Validate required fields (ERC-712 format)
      if (!message || !signature) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: false, 
          message: 'Missing required fields: message or signature' 
        }));
        return;
      }

      // Validate ERC-712 message fields
      if (!message.wallet || !message.nonce || !message.deadline) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: false, 
          message: 'Invalid message format: missing wallet, nonce, or deadline' 
        }));
        return;
      }

      const address = message.wallet;

      // Validate Ethereum address format
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: false, 
          message: 'Invalid Ethereum address format' 
        }));
        return;
      }

      // Check deadline expiry
      const now = Math.floor(Date.now() / 1000);
      if (message.deadline < now) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Signature expired. Please sign again.'
        }));
        return;
      }

      // Check for nonce replay
      if (this.isNonceUsed(message.nonce)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'This signature has already been used. Please sign again.'
        }));
        return;
      }

      logger.info('Processing ERC-712 wallet authentication request', {
        address: address.slice(0, 10) + '...'
      });

      // Always use server-defined domain, ignore client domain
      const verificationDomain = LocalAuthServer.EXPECTED_DOMAIN;

      // ERC-712 types for verification
      const verificationTypes = {
        Auth: [
          { name: 'wallet', type: 'address' },
          { name: 'nonce', type: 'string' },
          { name: 'deadline', type: 'uint256' }
        ]
      };

      // Verify ERC-712 signature locally before forwarding to backend
      const recoveredAddress = this.verifyERC712Signature(
        verificationDomain,
        verificationTypes,
        message,
        signature
      );

      if (!recoveredAddress) {
        logger.warn('Local ERC-712 signature verification failed', {
          address: address.slice(0, 10) + '...'
        });
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Invalid signature. Please try again.'
        }));
        return;
      }

      // Verify recovered address matches claimed address
      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        logger.warn('ERC-712 signature address mismatch', {
          claimed: address.slice(0, 10) + '...',
          recovered: recoveredAddress.slice(0, 10) + '...'
        });
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Signature does not match claimed wallet address.'
        }));
        return;
      }

      logger.info('Local ERC-712 signature verification passed', {
        address: address.slice(0, 10) + '...'
      });

      // Mark nonce as used after successful verification
      this.markNonceUsed(message.nonce, message.deadline);

      // Forward to backend API (with full ERC-712 payload)
      try {
        // Removed unused clientDomain parameter
        const backendResponse = await this.forwardWalletAuthToBackend(address, message, signature);

        if (backendResponse.success && backendResponse.apiKey) {
          // Check if this is an existing key (masked) or a new key
          if (backendResponse.isNewKey === false) {
            // Existing key scenario - return page URL for client to redirect
            logger.info('Existing API key found for wallet, showing options page', {
              address: address.slice(0, 10) + '...',
              maskedKey: backendResponse.apiKey.slice(0, 15) + '...'
            });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: true,
              existingKey: true,
              maskedKey: backendResponse.apiKey,
              walletAddress: address,
              redirectUrl: `/existing-key?masked=${encodeURIComponent(backendResponse.apiKey)}&wallet=${encodeURIComponent(address)}`
            }));
            return;
          }

          // New key - validate and show save key page
          const validationResult = await this.validateApiKey(backendResponse.apiKey);

          if (validationResult.success) {
            // Store key securely and return token instead of key in URL
            const token = this.storeKeyForDelivery(
              backendResponse.apiKey,
              validationResult.licenseType || 'Active'
            );

            // Return success with redirect to new key page using token (not key in URL)
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: true,
              isNewKey: true,
              token, // Client will use this to fetch key securely
              licenseType: validationResult.licenseType,
              walletAddress: address,
              redirectUrl: `/new-key-success?token=${encodeURIComponent(token)}`
            }));

            // Don't resolve auth promise yet - wait for user to copy key
            return;
          } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: false,
              message: validationResult.message || 'API key validation failed'
            }));
          }
        } else {
          res.writeHead(backendResponse.notImplemented ? 200 : 401, {
            'Content-Type': 'application/json'
          });
          res.end(JSON.stringify(backendResponse));
        }
      } catch (backendError) {
        // Backend endpoint not available - return graceful fallback
        // Use generic message that doesn't leak implementation details
        logger.info('Wallet auth backend not available, returning fallback response');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          notImplemented: true,
          message: 'Wallet authentication is currently unavailable. Please use your API key.',
          walletAddress: address
        }));
      }
    } catch (error) {
      logger.error('Error handling wallet auth request:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: false, 
        message: 'An unexpected error occurred. Please try again.' 
      }));
    }
  }

  /**
   * Verify ERC-712 signature locally before forwarding to backend
   * Fails fast on invalid signatures to reduce unnecessary backend calls
   */
  private verifyERC712Signature(
    domain: ERC712Domain,
    types: Record<string, Array<{ name: string; type: string }>>,
    message: ERC712AuthMessage,
    signature: string
  ): string | null {
    try {
      const recoveredAddress = ethers.verifyTypedData(domain, types, message, signature);
      return recoveredAddress;
    } catch {
      return null;
    }
  }

  /**
   * Forward wallet authentication to backend API (ERC-712 format)
   * Removed unused clientDomain parameter
   */
  private forwardWalletAuthToBackend(
    address: string,
    message: ERC712AuthMessage,
    signature: string
  ): Promise<WalletAuthResponse> {
    return new Promise((resolve, reject) => {
      const url = new URL(`${this.apiEndpoint}/wallet-auth`);

      // Backend only needs message and signature
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
        timeout: 30000 // 30 second timeout
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
              // Endpoint not implemented yet
              resolve({
                success: false,
                notImplemented: true,
                message: 'Wallet authentication endpoint not available yet'
              });
              return;
            }
            
            const jsonResponse = JSON.parse(data);
            resolve(jsonResponse as WalletAuthResponse);
          } catch (parseError) {
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
   * Handle paste key form submission (existing key scenario)
   */
  private async handlePasteKey(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    try {
      const formData = await this.parseFormData(req);
      const apiKey = formData.get('apiKey');
      const csrfToken = formData.get('csrf_token');
      const walletAddress = formData.get('walletAddress');

      // Validate CSRF token
      if (!csrfToken || csrfToken !== this.csrfToken) {
        const html = getErrorPage('Invalid request. Please refresh and try again.');
        res.writeHead(403, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
      }

      // Validate Ethereum address format if provided
      if (walletAddress && !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        const html = getErrorPage('Invalid wallet address format.');
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
      }

      // Validate API key presence
      if (!apiKey || typeof apiKey !== 'string' || apiKey.length < 10) {
        const html = getErrorPage('Please enter a valid API key.');
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
      }

      // Validate API key with backend
      const result = await this.validateApiKey(apiKey);

      if (result.success) {
        // Send success page
        const html = getSuccessPage(result.licenseType || 'Active');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);

        // Resolve the auth promise
        if (this.authResolve) {
          this.authResolve({
            success: true,
            apiKey,
            licenseType: result.licenseType,
            userId: result.userId,
            walletAddress: walletAddress || result.walletAddress
          });
        }

        // Schedule shutdown
        this.shutdownHandle = setTimeout(() => {
          this.shutdown();
        }, LocalAuthServer.SHUTDOWN_DELAY_MS);
      } else {
        const html = getErrorPage(result.message || 'Invalid API key. Please check and try again.');
        res.writeHead(401, { 'Content-Type': 'text/html' });
        res.end(html);
      }
    } catch (error) {
      logger.error('Error handling paste key request:', error);
      const html = getErrorPage('An unexpected error occurred. Please try again.');
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(html);
    }
  }

  /**
   * Handle regenerate API key request
   */
  private async handleRegenerate(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    try {
      const body = await this.parseJsonBody(req);
      const message = body.message as ERC712RegenerateMessage | undefined;
      const signature = body.signature as string | undefined;
      const csrf_token = body.csrf_token as string | undefined;

      // Validate CSRF token
      if (!csrf_token || csrf_token !== this.csrfToken) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Invalid request. Please refresh and try again.'
        }));
        return;
      }

      // Validate required fields
      if (!message || !signature) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Missing required fields: message or signature'
        }));
        return;
      }

      // Validate message fields
      if (!message.wallet || !message.nonce || !message.deadline || message.action !== 'regenerate') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Invalid message format'
        }));
        return;
      }

      const address = message.wallet;

      // Validate Ethereum address format
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Invalid Ethereum address format'
        }));
        return;
      }

      // Check deadline expiry
      const now = Math.floor(Date.now() / 1000);
      if (message.deadline < now) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Signature expired. Please sign again.'
        }));
        return;
      }

      // Check for nonce replay on regenerate
      if (this.isNonceUsed(message.nonce)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'This signature has already been used. Please sign again.'
        }));
        return;
      }

      logger.info('Processing regenerate request', {
        address: address.slice(0, 10) + '...'
      });

      // Mark nonce as used
      this.markNonceUsed(message.nonce, message.deadline);

      // Forward to backend
      try {
        const backendResponse = await this.forwardRegenerateToBackend(address, message, signature);

        if (backendResponse.success && backendResponse.apiKey) {
          // Store key securely and return token instead of key in URL
          const token = this.storeKeyForDelivery(
            backendResponse.apiKey,
            backendResponse.licenseType || 'Active'
          );

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            token, // Client will use this to redirect to regenerate-success page
            licenseType: backendResponse.licenseType || 'Active',
            walletAddress: address
          }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            message: backendResponse.message || 'Regeneration failed'
          }));
        }
      } catch (backendError) {
        logger.error('Backend regenerate request failed:', backendError);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Failed to communicate with backend. Please try again.'
        }));
      }
    } catch (error) {
      logger.error('Error handling regenerate request:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      }));
    }
  }

  /**
   * Handle existing key page request
   */
  private handleExistingKeyPage(res: http.ServerResponse, url: URL): void {
    const maskedKey = url.searchParams.get('masked') || '';
    const walletAddress = url.searchParams.get('wallet') || '';

    if (!maskedKey || !walletAddress) {
      res.writeHead(302, { 'Location': '/' });
      res.end();
      return;
    }

    const html = getExistingKeyPage(this.csrfToken, maskedKey, walletAddress);
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': LocalAuthServer.CSP_HEADER
    });
    res.end(html);
  }

  /**
   * Handle new key success page request
   */
  private handleNewKeySuccessPage(res: http.ServerResponse, url: URL): void {
    const token = url.searchParams.get('token') || '';

    if (!token) {
      res.writeHead(302, { 'Location': '/' });
      res.end();
      return;
    }

    // Pass token to page - the page will fetch the key via POST /get-key-by-token
    const html = getNewKeySuccessPage(token, this.csrfToken);
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': LocalAuthServer.CSP_HEADER
    });
    res.end(html);
  }

  /**
   * Handle secure key retrieval by token
   */
  private async handleGetKeyByToken(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    try {
      const body = await this.parseJsonBody(req);
      const token = body.token as string | undefined;
      const csrf_token = body.csrf_token as string | undefined;

      // Validate CSRF token
      if (!csrf_token || csrf_token !== this.csrfToken) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Invalid request. Please refresh and try again.'
        }));
        return;
      }

      if (!token) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Missing token'
        }));
        return;
      }

      const keyData = this.retrieveKeyByToken(token);
      if (!keyData) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Token expired or invalid. Please restart the authentication process.'
        }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        apiKey: keyData.apiKey,
        license: keyData.license
      }));
    } catch (error) {
      logger.error('Error handling get key by token request:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        message: 'An unexpected error occurred.'
      }));
    }
  }

  /**
   * Handle regenerate success page request
   */
  private handleRegenerateSuccessPage(res: http.ServerResponse, url: URL): void {
    const token = url.searchParams.get('token') || '';

    if (!token) {
      res.writeHead(302, { 'Location': '/' });
      res.end();
      return;
    }

    // Pass token to page - the page will fetch the key via POST /get-key-by-token
    const html = getRegenerateSuccessPage(token, this.csrfToken);
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': LocalAuthServer.CSP_HEADER
    });
    res.end(html);
  }

  /**
   * Handle success page request
   */
  private handleSuccessPage(res: http.ServerResponse): void {
    const html = getSuccessPage('Active');
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': LocalAuthServer.CSP_HEADER
    });
    res.end(html);
  }

  /**
   * Forward regenerate request to backend API
   */
  private forwardRegenerateToBackend(
    address: string,
    message: ERC712RegenerateMessage,
    signature: string
  ): Promise<RegenerateResponse> {
    return new Promise((resolve, reject) => {
      const url = new URL(`${this.apiEndpoint}/shadow-clone-licenses/regenerate`);

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
          } catch (parseError) {
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
   * Handle logout page request
   */
  private handleLogoutPage(res: http.ServerResponse): void {
    if (this.mode !== 'logout' || !this.currentApiKey) {
      res.writeHead(302, { 'Location': '/' });
      res.end();
      return;
    }

    // Mask the API key for display
    const maskedKey = this.maskApiKey(this.currentApiKey);
    const html = getLogoutPage(this.csrfToken, maskedKey, this.currentWalletAddress || undefined);
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': LocalAuthServer.CSP_HEADER
    });
    res.end(html);
  }

  /**
   * Handle request to get the full API key (for copy before logout)
   */
  private async handleLogoutGetKey(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    try {
      const body = await this.parseJsonBody(req);
      const csrf_token = body.csrf_token as string | undefined;

      // Validate CSRF token
      if (!csrf_token || csrf_token !== this.csrfToken) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Invalid request. Please refresh and try again.'
        }));
        return;
      }

      if (this.mode !== 'logout' || !this.currentApiKey) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'No active logout session'
        }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        apiKey: this.currentApiKey
      }));
    } catch (error) {
      logger.error('Error handling get key request:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        message: 'An unexpected error occurred.'
      }));
    }
  }

  /**
   * Handle local logout (clear local storage only, keep key valid)
   */
  private async handleLogoutLocal(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    try {
      const body = await this.parseJsonBody(req);
      const csrf_token = body.csrf_token as string | undefined;

      // Validate CSRF token
      if (!csrf_token || csrf_token !== this.csrfToken) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Invalid request. Please refresh and try again.'
        }));
        return;
      }

      if (this.mode !== 'logout') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'No active logout session'
        }));
        return;
      }

      logger.info('Processing local logout');

      // Call logout callback to clear auth data BEFORE responding
      if (this.logoutCallback) {
        await this.logoutCallback('local');
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));

      // Resolve the logout promise
      if (this.logoutResolve) {
        this.logoutResolve({
          success: true,
          type: 'local'
        });
      }

      // Schedule shutdown
      this.shutdownHandle = setTimeout(() => {
        this.shutdown();
      }, LocalAuthServer.SHUTDOWN_DELAY_MS);
    } catch (error) {
      logger.error('Error handling local logout:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        message: 'An unexpected error occurred.'
      }));
    }
  }

  /**
   * Handle revoke logout (requires wallet signature)
   */
  private async handleLogoutRevoke(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    try {
      const body = await this.parseJsonBody(req);
      const message = body.message as ERC712RevokeMessage | undefined;
      const signature = body.signature as string | undefined;
      const csrf_token = body.csrf_token as string | undefined;

      // Validate CSRF token
      if (!csrf_token || csrf_token !== this.csrfToken) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Invalid request. Please refresh and try again.'
        }));
        return;
      }

      if (this.mode !== 'logout' || !this.currentApiKey) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'No active logout session'
        }));
        return;
      }

      // Validate required fields
      if (!message || !signature) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Missing required fields: message or signature'
        }));
        return;
      }

      // Validate message fields
      if (!message.wallet || !message.nonce || !message.deadline || message.action !== 'revoke') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Invalid message format'
        }));
        return;
      }

      const address = message.wallet;

      // Validate Ethereum address format
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Invalid Ethereum address format'
        }));
        return;
      }

      // Check deadline expiry
      const now = Math.floor(Date.now() / 1000);
      if (message.deadline < now) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Signature expired. Please sign again.'
        }));
        return;
      }

      // Check for nonce replay on revoke
      if (this.isNonceUsed(message.nonce)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'This signature has already been used. Please sign again.'
        }));
        return;
      }

      logger.info('Processing revoke logout', {
        address: address.slice(0, 10) + '...'
      });

      // Mark nonce as used
      this.markNonceUsed(message.nonce, message.deadline);

      // Forward to backend
      try {
        const backendResponse = await this.forwardRevokeToBackend(
          this.currentApiKey,
          address,
          message,
          signature
        );

        if (backendResponse.success) {
          // Call logout callback to clear auth data
          if (this.logoutCallback) {
            await this.logoutCallback('revoked');
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));

          // Resolve the logout promise
          if (this.logoutResolve) {
            this.logoutResolve({
              success: true,
              type: 'revoked'
            });
          }

          // Schedule shutdown
          this.shutdownHandle = setTimeout(() => {
            this.shutdown();
          }, LocalAuthServer.SHUTDOWN_DELAY_MS);
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            message: backendResponse.message || 'Revocation failed'
          }));
        }
      } catch (backendError) {
        logger.error('Backend revoke request failed:', backendError);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Failed to communicate with backend. Please try again.'
        }));
      }
    } catch (error) {
      logger.error('Error handling revoke logout:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        message: 'An unexpected error occurred.'
      }));
    }
  }

  /**
   * Handle logout success page request
   */
  private handleLogoutSuccessPage(res: http.ServerResponse, url: URL): void {
    const type = url.searchParams.get('type') as 'local' | 'revoked' | null;

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
      'Content-Security-Policy': LocalAuthServer.CSP_HEADER
    });
    res.end(html);
  }

  /**
   * Forward revoke request to backend API
   */
  private forwardRevokeToBackend(
    apiKey: string,
    address: string,
    message: ERC712RevokeMessage,
    signature: string
  ): Promise<RevokeResponse> {
    return new Promise((resolve, reject) => {
      const url = new URL(`${this.apiEndpoint}/shadow-clone-licenses/revoke`);

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
          } catch (parseError) {
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
   * Mask an API key for display (show first 8 and last 4 characters)
   */
  private maskApiKey(apiKey: string): string {
    if (apiKey.length <= 12) {
      return apiKey.slice(0, 4) + '...' + apiKey.slice(-4);
    }
    return apiKey.slice(0, 8) + '...' + apiKey.slice(-4);
  }

  /**
   * Send 404 response
   */
  private sendNotFound(res: http.ServerResponse): void {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }

  /**
   * Parse URL-encoded form data from request body
   */
  private parseFormData(req: http.IncomingMessage): Promise<Map<string, string>> {
    return new Promise((resolve, reject) => {
      let body = '';
      const maxSize = 1024 * 10; // 10KB max

      req.on('data', (chunk: Buffer) => {
        body += chunk.toString();
        if (body.length > maxSize) {
          req.destroy();
          reject(new Error('Request body too large'));
        }
      });

      req.on('end', () => {
        const formData = new Map<string, string>();
        const params = new URLSearchParams(body);
        for (const [key, value] of params) {
          formData.set(key, value);
        }
        resolve(formData);
      });

      req.on('error', reject);
    });
  }

  /**
   * Parse JSON body from request
   */
  private parseJsonBody(req: http.IncomingMessage): Promise<Record<string, unknown>> {
    return new Promise((resolve, reject) => {
      let body = '';
      const maxSize = 1024 * 50; // 50KB max for SIWE messages

      req.on('data', (chunk: Buffer) => {
        body += chunk.toString();
        if (body.length > maxSize) {
          req.destroy();
          reject(new Error('Request body too large'));
        }
      });

      req.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve(jsonData);
        } catch (error) {
          reject(new Error('Invalid JSON body'));
        }
      });

      req.on('error', reject);
    });
  }
}
