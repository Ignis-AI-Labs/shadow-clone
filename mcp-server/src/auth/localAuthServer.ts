/**
 * Local HTTP Server for Browser-Based Authentication
 *
 * This module provides a secure browser-based authentication flow
 * where users can enter their API key on a locally-served webpage,
 * keeping the key hidden from the MCP client.
 */

import * as http from 'http';
import * as crypto from 'crypto';
import { getAuthFormPage, getSuccessPage, getErrorPage } from './authPages.js';
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
 * Local HTTP server for browser-based authentication
 */
export class LocalAuthServer {
  private server: http.Server | null = null;
  private port: number = 0;
  private csrfToken: string = '';
  private authPromise: Promise<AuthResult> | null = null;
  private authResolve: ((result: AuthResult) => void) | null = null;
  private timeoutHandle: NodeJS.Timeout | null = null;
  private shutdownHandle: NodeJS.Timeout | null = null;
  private validateApiKey: ValidateApiKeyFn;

  private static readonly PORT_RANGE_START = 49152;
  private static readonly PORT_RANGE_END = 65535;
  private static readonly MAX_PORT_RETRIES = 10;
  private static readonly DEFAULT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
  private static readonly SHUTDOWN_DELAY_MS = 2000; // 2 seconds for page to load

  constructor(validateApiKey: ValidateApiKeyFn) {
    this.validateApiKey = validateApiKey;
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
    this.csrfToken = '';
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

    // Route requests
    if (req.method === 'GET' && url.pathname === '/') {
      this.handleGetForm(res);
    } else if (req.method === 'POST' && url.pathname === '/auth') {
      this.handlePostAuth(req, res);
    } else if (req.method === 'GET' && url.pathname === '/status') {
      this.handleGetStatus(res);
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
      'X-Content-Type-Options': 'nosniff'
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
}
