/**
 * Local HTTP Server for Browser-Based Authentication
 *
 * This module provides a secure browser-based authentication flow
 * where users can enter their API key on a locally-served webpage,
 * keeping the key hidden from the MCP client.
 *
 * Supports both traditional API key entry and wallet-based authentication.
 *
 * This class delegates to functional handler modules for request processing,
 * maintaining backward compatibility while improving testability.
 */

import * as http from 'http';
import {
  getAuthFormPage,
  getSuccessPage,
  getExistingKeyPage,
  getRegenerateSuccessPage,
  getNewKeySuccessPage
} from './authPages.js';
import { logger } from '../utils/logger.js';
import { parseJsonBody } from '../utils/httpParser.js';

// Import types from types.ts
import type {
  AuthResult,
  LogoutResult,
  LogoutType,
  ValidateApiKeyFn,
  LogoutCallbackFn,
  ServerMode
} from './types.js';

// Re-export types for backward compatibility
export type {
  AuthResult,
  LogoutResult,
  LogoutType,
  ValidateApiKeyFn,
  LogoutCallbackFn,
  ERC712Domain,
  ERC712AuthMessage,
  ERC712RegenerateMessage,
  ERC712RevokeMessage,
  WalletAuthRequest,
  WalletAuthResponse,
  RegenerateResponse,
  RevokeResponse,
  ServerMode
} from './types.js';

// Import functional modules
import { generateCsrfToken, createNonceTracker, CSP_HEADER, type NonceTracker } from './security.js';
import { createKeyDeliveryStore, type KeyDeliveryStore } from './keyDelivery.js';
import { handlePostAuth, handlePasteKey } from './handlers/apiKeyAuth.js';
import { handleWalletAuth, handleRegenerate } from './handlers/walletAuth.js';
import {
  handleLogoutPage,
  handleLogoutSuccessPage,
  handleLogoutGetKey,
  handleLogoutLocal,
  handleLogoutRevoke,
  type LogoutSession
} from './handlers/logout.js';

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
  private authCompleteCallback: ((result: AuthResult) => void) | null = null;

  // Functional modules (composed via factory functions)
  private nonceTracker: NonceTracker;
  private keyDeliveryStore: KeyDeliveryStore;

  // Server configuration constants
  private static readonly PORT_RANGE_START = 49152;
  private static readonly PORT_RANGE_END = 65535;
  private static readonly MAX_PORT_RETRIES = 10;
  private static readonly DEFAULT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
  private static readonly SHUTDOWN_DELAY_MS = 2000; // 2 seconds for page to load

  constructor(validateApiKey: ValidateApiKeyFn, apiEndpoint?: string) {
    this.validateApiKey = validateApiKey;
    this.apiEndpoint = apiEndpoint || process.env.SHADOW_CLONE_API_ENDPOINT || 'https://api.ignislabs.ai';

    // Initialize functional modules
    this.nonceTracker = createNonceTracker();
    this.keyDeliveryStore = createKeyDeliveryStore();
  }

  /**
   * Set callback to be called when authentication completes
   */
  setAuthCompleteCallback(callback: (result: AuthResult) => void): void {
    this.authCompleteCallback = callback;
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
    this.csrfToken = generateCsrfToken();

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
    this.csrfToken = generateCsrfToken();

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
    // Clear timeouts
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
    this.authCompleteCallback = null;

    // Cleanup functional modules
    this.nonceTracker.cleanup();
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
   * Schedule server shutdown after a brief delay
   */
  private scheduleShutdown(): void {
    this.shutdownHandle = setTimeout(() => {
      this.shutdown();
    }, LocalAuthServer.SHUTDOWN_DELAY_MS);
  }

  /**
   * Handle incoming HTTP requests
   */
  private handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    const url = new URL(req.url || '/', `http://localhost:${this.port}`);

    // Add CORS headers for wallet auth requests (restricted to localhost)
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
      handlePostAuth(req, res, this.getAuthHandlerDeps());
    } else if (req.method === 'POST' && url.pathname === '/wallet-auth') {
      handleWalletAuth(req, res, this.getWalletAuthDeps());
    } else if (req.method === 'POST' && url.pathname === '/paste-key') {
      handlePasteKey(req, res, this.getAuthHandlerDeps());
    } else if (req.method === 'POST' && url.pathname === '/regenerate') {
      handleRegenerate(req, res, this.getWalletAuthDeps());
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
      this.handleLogoutPageRoute(res);
    } else if (req.method === 'POST' && url.pathname === '/logout/get-key') {
      this.handleLogoutGetKeyRoute(req, res);
    } else if (req.method === 'POST' && url.pathname === '/logout/local') {
      this.handleLogoutLocalRoute(req, res);
    } else if (req.method === 'POST' && url.pathname === '/logout/revoke') {
      this.handleLogoutRevokeRoute(req, res);
    } else if (req.method === 'GET' && url.pathname === '/logout/success') {
      this.handleLogoutSuccessRoute(res, url);
    } else {
      this.sendNotFound(res);
    }
  }

  /**
   * Get dependencies for API key auth handlers
   */
  private getAuthHandlerDeps() {
    return {
      validateApiKey: this.validateApiKey,
      csrfToken: this.csrfToken,
      onAuthSuccess: (result: AuthResult) => {
        if (this.authResolve) {
          this.authResolve(result);
        }
        // Notify callback for validation polling start
        if (this.authCompleteCallback) {
          this.authCompleteCallback(result);
        }
      },
      scheduleShutdown: () => this.scheduleShutdown()
    };
  }

  /**
   * Get dependencies for wallet auth handlers
   */
  private getWalletAuthDeps() {
    return {
      apiEndpoint: this.apiEndpoint,
      validateApiKey: this.validateApiKey,
      csrfToken: this.csrfToken,
      nonceTracker: this.nonceTracker,
      keyDeliveryStore: this.keyDeliveryStore,
      onAuthSuccess: (result: AuthResult) => {
        if (this.authResolve) {
          this.authResolve(result);
        }
        // Notify callback for validation polling start
        if (this.authCompleteCallback) {
          this.authCompleteCallback(result);
        }
      },
      scheduleShutdown: () => this.scheduleShutdown()
    };
  }

  /**
   * Get logout session info
   */
  private getLogoutSession(): LogoutSession {
    return {
      apiKey: this.currentApiKey || '',
      walletAddress: this.currentWalletAddress || undefined
    };
  }

  /**
   * Get dependencies for logout handlers
   */
  private getLogoutHandlerDeps() {
    return {
      apiEndpoint: this.apiEndpoint,
      csrfToken: this.csrfToken,
      session: this.getLogoutSession(),
      nonceTracker: this.nonceTracker,
      onLogoutComplete: async (type: LogoutType) => {
        if (this.logoutCallback) {
          await this.logoutCallback(type);
        }
      },
      resolveLogout: (result: LogoutResult) => {
        if (this.logoutResolve) {
          this.logoutResolve(result);
        }
      },
      scheduleShutdown: () => this.scheduleShutdown()
    };
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
      'Content-Security-Policy': CSP_HEADER
    });
    res.end(html);
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
      'Content-Security-Policy': CSP_HEADER
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

    const html = getNewKeySuccessPage(token, this.csrfToken);
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
   * Handle secure key retrieval by token
   */
  private async handleGetKeyByToken(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    try {
      const body = await parseJsonBody(req);
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

      const keyData = this.keyDeliveryStore.retrieve(token);
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

    const html = getRegenerateSuccessPage(token, this.csrfToken);
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
   * Handle success page request
   */
  private handleSuccessPage(res: http.ServerResponse): void {
    const html = getSuccessPage('Active');
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
   * Handle logout page route
   */
  private handleLogoutPageRoute(res: http.ServerResponse): void {
    if (this.mode !== 'logout' || !this.currentApiKey) {
      res.writeHead(302, { 'Location': '/' });
      res.end();
      return;
    }

    handleLogoutPage(res, {
      csrfToken: this.csrfToken,
      session: this.getLogoutSession()
    });
  }

  /**
   * Handle logout get key route
   */
  private handleLogoutGetKeyRoute(req: http.IncomingMessage, res: http.ServerResponse): void {
    if (this.mode !== 'logout') {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'No active logout session' }));
      return;
    }

    handleLogoutGetKey(req, res, this.getLogoutHandlerDeps());
  }

  /**
   * Handle logout local route
   */
  private handleLogoutLocalRoute(req: http.IncomingMessage, res: http.ServerResponse): void {
    if (this.mode !== 'logout') {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'No active logout session' }));
      return;
    }

    handleLogoutLocal(req, res, this.getLogoutHandlerDeps());
  }

  /**
   * Handle logout revoke route
   */
  private handleLogoutRevokeRoute(req: http.IncomingMessage, res: http.ServerResponse): void {
    if (this.mode !== 'logout') {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'No active logout session' }));
      return;
    }

    handleLogoutRevoke(req, res, this.getLogoutHandlerDeps());
  }

  /**
   * Handle logout success page route
   */
  private handleLogoutSuccessRoute(res: http.ServerResponse, url: URL): void {
    const type = url.searchParams.get('type') as LogoutType | null;
    handleLogoutSuccessPage(res, type);
  }

  /**
   * Send 404 response
   */
  private sendNotFound(res: http.ServerResponse): void {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}
