/**
 * Authentication Service
 *
 * Core authentication service that manages API key validation,
 * NFT license verification, and session persistence.
 *
 * This class composes functional services for session management,
 * caching, and validation polling, maintaining backward compatibility
 * while improving testability.
 */

import axios from 'axios';
import { logger, logAudit } from '../utils/logger.js';
import { ApiKeyManager } from './apiKeyManager.js';
import { CreatorMode } from './creatorMode.js';
import { LocalAuthServer, LogoutResult, LogoutCallbackFn, LogoutType } from './localAuthServer.js';

// Re-export the config types
export type { AuthData } from './types.js';

// Import functional services
import {
  createSessionStore,
  createVerificationCache,
  createValidationPolling,
  authenticate as authenticateWithBackend,
  verifyNFTOwnership,
  callBackendRevoke,
  type SessionStore,
  type VerificationCache,
  type ValidationPollingService
} from './services/index.js';

interface AuthenticatedRequestOptions {
  method?: string;
  headers?: Record<string, string>;
  data?: unknown;
  timeout?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface AuthenticatedRequestResponse {
  data: any;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

/**
 * Authentication service for managing user sessions
 */
export class AuthService {
  private static instance: AuthService | null = null;
  private initialized: boolean = false;

  // Dependencies
  private apiKeyManager: ApiKeyManager;
  private creatorMode: CreatorMode;
  private apiEndpoint: string;

  // Functional services (composed via factory functions)
  private sessionStore: SessionStore;
  private verificationCache: VerificationCache;
  private validationPolling: ValidationPollingService | null = null;

  // Browser auth server
  private localAuthServer: LocalAuthServer | null = null;

  private constructor() {
    this.apiEndpoint = process.env.SHADOW_CLONE_API_ENDPOINT || 'https://api.ignislabs.ai';
    this.apiKeyManager = ApiKeyManager.getInstance();
    this.creatorMode = CreatorMode.getInstance();
    this.sessionStore = createSessionStore(this.apiKeyManager);
    this.verificationCache = createVerificationCache();
  }

  /**
   * Factory method for async initialization
   * This ensures loadAuthData() and checkCachedApiKey() are properly awaited
   */
  static async create(): Promise<AuthService> {
    if (AuthService.instance && AuthService.instance.initialized) {
      return AuthService.instance;
    }

    const service = new AuthService();
    await service.initialize();
    AuthService.instance = service;
    return service;
  }

  /**
   * Get the singleton instance (without initialization check)
   */
  static getInstance(): AuthService | null {
    return AuthService.instance;
  }

  /**
   * Async initialization that was previously in constructor
   */
  private async initialize(): Promise<void> {
    if (this.initialized) return;

    // Check for creator mode first
    if (this.creatorMode.isCreatorMode()) {
      logger.info('Creator Mode Active - Authentication bypassed');
      logAudit('AUTH_CREATOR_MODE', 'success', {
        licenseType: this.creatorMode.getCreatorLicenseType()
      });
      this.initialized = true;
      return;
    }

    // Try to load from session store first
    const authData = await this.sessionStore.load();

    if (authData) {
      // Validate the loaded session
      logger.info('Found stored auth data, validating...');
      const result = await this.authenticate(authData.apiKey);
      if (result.success) {
        logger.info('Stored auth data validated successfully');
        this.startValidationPolling();
      }
    } else {
      // Try to get cached API key from ApiKeyManager
      await this.checkCachedApiKey();
    }

    this.initialized = true;
  }

  private async checkCachedApiKey() {
    // Try to get cached API key if we don't have auth data
    if (!this.sessionStore.hasSession()) {
      const cachedKey = await this.apiKeyManager.getApiKey();
      if (cachedKey) {
        const apiKeyPrefix = cachedKey.substring(0, 8);
        logger.info('Found cached API key, attempting authentication...');
        logAudit('AUTH_CACHED_KEY_FOUND', 'success', { apiKeyPrefix });

        const result = await this.authenticate(cachedKey);
        if (result.success) {
          this.startValidationPolling();
        } else {
          logger.warn('Cached API key is invalid or expired');
          logAudit('AUTH_CACHED_KEY_INVALID', 'failure', {
            apiKeyPrefix,
            reason: result.message || 'invalid_or_expired'
          });
          await this.apiKeyManager.clearApiKey();
        }
      }
    }
  }

  /**
   * Authenticate with an API key
   */
  async authenticate(apiKey: string): Promise<{
    success: boolean;
    licenseType?: string;
    userId?: string;
    walletAddress?: string;
    message?: string;
  }> {
    // Creator mode always succeeds
    if (this.creatorMode.isCreatorMode()) {
      return {
        success: true,
        licenseType: 'UNLIMITED',
        message: 'Creator mode - authentication bypassed'
      };
    }

    // Delegate to functional service
    return authenticateWithBackend(
      apiKey,
      this.apiEndpoint,
      this.sessionStore,
      this.verificationCache,
      this.apiKeyManager
    );
  }

  /**
   * Check if user is currently authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    // Creator mode is always authenticated
    if (this.creatorMode.isCreatorMode()) {
      return true;
    }

    // Check if we have a session
    if (!this.sessionStore.hasSession()) {
      await this.sessionStore.load();

      if (!this.sessionStore.hasSession()) {
        // Try cached key
        const cachedKey = await this.apiKeyManager.getApiKey();
        if (cachedKey) {
          // Check if we need to revalidate
          if (this.apiKeyManager.needsValidation()) {
            const apiKeyPrefix = cachedKey.substring(0, 8);
            logger.info('Revalidating cached API key...');
            logAudit('AUTH_REVALIDATION_START', 'success', { apiKeyPrefix });

            const result = await this.authenticate(cachedKey);
            if (!result.success) {
              logger.warn('Cached API key is no longer valid. Please visit dashboard.ignislabs.ai to get a new API key.');
              logAudit('AUTH_CACHED_KEY_INVALID', 'failure', {
                apiKeyPrefix,
                reason: 'revalidation_failed'
              });
              await this.apiKeyManager.clearApiKey();
              return false;
            }
            this.apiKeyManager.markValidated();
          }
        } else {
          return false;
        }
      }
    }

    // Check verification cache first
    const apiKey = this.sessionStore.getApiKey();
    if (apiKey && this.verificationCache.isValid(apiKey)) {
      const entry = this.verificationCache.get(apiKey);
      return entry?.isActive ?? false;
    }

    // Need to verify NFT ownership
    return verifyNFTOwnership(
      this.apiEndpoint,
      this.sessionStore,
      this.verificationCache
    );
  }

  /**
   * Check if there's a local session (auth data or cached API key)
   * This does NOT verify NFT ownership - use for logout flow
   * where we just need to know if there's something to logout from
   */
  async hasLocalSession(): Promise<boolean> {
    // Creator mode is always considered to have a session
    if (this.creatorMode.isCreatorMode()) {
      return true;
    }

    // Check session store
    await this.sessionStore.load();
    if (this.sessionStore.hasSession()) {
      return true;
    }

    // Check if there's a cached API key
    const cachedKey = await this.apiKeyManager.getApiKey();
    return cachedKey !== null;
  }

  /**
   * Get current API key
   */
  async getApiKey(): Promise<string | null> {
    if (this.creatorMode.isCreatorMode()) {
      return this.creatorMode.getCreatorApiKey();
    }

    // Check session store first
    if (this.sessionStore.hasSession()) {
      return this.sessionStore.getApiKey();
    }

    // Try to load from disk
    await this.sessionStore.load();
    if (this.sessionStore.hasSession()) {
      return this.sessionStore.getApiKey();
    }

    // Otherwise try cached key
    return await this.apiKeyManager.getApiKey();
  }

  /**
   * Get current license type
   */
  async getLicenseType(): Promise<string | null> {
    if (this.creatorMode.isCreatorMode()) {
      return this.creatorMode.getCreatorLicenseType();
    }
    await this.sessionStore.load();
    return this.sessionStore.getLicenseType();
  }

  /**
   * Get current wallet address associated with the license
   */
  async getWalletAddress(): Promise<string | null> {
    if (this.creatorMode.isCreatorMode()) {
      return 'LOCAL';
    }
    await this.sessionStore.load();
    return this.sessionStore.getWalletAddress();
  }

  /**
   * Make an authenticated request to the API
   */
  async makeAuthenticatedRequest(
    url: string,
    options: AuthenticatedRequestOptions = {}
  ): Promise<AuthenticatedRequestResponse> {
    const apiKey = await this.getApiKey();
    if (!apiKey) {
      throw new Error('Not authenticated');
    }

    return axios({
      ...options,
      url,
      headers: {
        ...options.headers,
        'X-API-Key': apiKey,
        'User-Agent': 'Shadow-Clone-MCP/0.1.0'
      }
    });
  }

  /**
   * Get the API endpoint
   */
  getApiEndpoint(): string {
    return this.apiEndpoint;
  }

  /**
   * Clear verification cache to force fresh NFT check
   */
  clearVerificationCache(): void {
    this.verificationCache.clear();
  }

  /**
   * Check if creator mode is active
   */
  isCreatorMode(): boolean {
    return this.creatorMode.isCreatorMode();
  }

  /**
   * Start browser-based authentication flow
   * Launches a local HTTP server where the user can enter their API key
   * @returns URL for the user to open in their browser
   */
  async startBrowserAuth(): Promise<{ url: string; port: number }> {
    // Cancel any existing browser auth
    if (this.localAuthServer) {
      await this.cancelBrowserAuth();
    }

    // Create validation function that wraps authenticate
    const validateApiKey = async (apiKey: string) => {
      const result = await this.authenticate(apiKey);
      return {
        success: result.success,
        licenseType: result.licenseType,
        userId: result.userId,
        walletAddress: result.walletAddress,
        message: result.message
      };
    };

    // Create and start the local auth server
    this.localAuthServer = new LocalAuthServer(validateApiKey, this.apiEndpoint);

    // Register callback to start validation polling on success
    this.localAuthServer.setAuthCompleteCallback((result) => {
      if (result.success) {
        logger.info('Browser auth completed successfully, starting validation polling');
        this.startValidationPolling();
      }
    });

    const { port, url } = await this.localAuthServer.start();

    logger.info('Browser auth started', { url });
    logAudit('AUTH_BROWSER_AUTH_START', 'success', { url, port });

    return { url, port };
  }

  /**
   * Wait for browser authentication to complete
   * @notice This method is not used in the server, but kept for sometime. To be removed later
   * @param timeoutMs - Maximum time to wait (default: 5 minutes)
   * @returns Authentication result
   */
  async waitForBrowserAuth(timeoutMs?: number): Promise<{
    success: boolean;
    licenseType?: string;
    message?: string;
  }> {
    if (!this.localAuthServer) {
      return {
        success: false,
        message: 'No browser authentication in progress'
      };
    }

    try {
      const result = await this.localAuthServer.waitForAuth(timeoutMs);

      if (result.success) {
        // Start validation polling after successful auth
        this.startValidationPolling();
        return {
          success: true,
          licenseType: result.licenseType
        };
      } else {
        return {
          success: false,
          message: result.error || 'Authentication failed'
        };
      }
    } finally {
      this.localAuthServer = null;
    }
  }

  /**
   * Cancel any pending browser authentication
   */
  async cancelBrowserAuth(): Promise<void> {
    if (this.localAuthServer) {
      await this.localAuthServer.shutdown();
      this.localAuthServer = null;
      logger.info('Browser auth cancelled');
      logAudit('AUTH_BROWSER_AUTH_CANCEL', 'success', {});
    }
  }

  /**
   * Check if browser authentication is in progress
   */
  isBrowserAuthPending(): boolean {
    return this.localAuthServer !== null && this.localAuthServer.isRunning();
  }

  /**
   * Get the current browser auth URL if authentication is pending
   */
  getBrowserAuthUrl(): string | null {
    if (this.localAuthServer && this.localAuthServer.isRunning()) {
      return this.localAuthServer.getUrl();
    }
    return null;
  }

  /**
   * Start browser-based logout flow
   * Launches a local HTTP server where the user can choose logout options
   * @returns URL for the user to open in their browser
   */
  async startBrowserLogout(): Promise<{ url: string; port: number }> {
    // Cancel any existing browser auth/logout
    if (this.localAuthServer) {
      await this.cancelBrowserAuth();
    }

    // Get current API key and wallet address
    const apiKey = await this.getApiKey();
    if (!apiKey) {
      throw new Error('No active session to logout from');
    }

    const walletAddress = await this.getWalletAddress();

    // Create validation function that wraps authenticate
    const validateApiKey = async (key: string) => {
      const result = await this.authenticate(key);
      return {
        success: result.success,
        licenseType: result.licenseType,
        userId: this.sessionStore.getUserId() || undefined,
        walletAddress: this.sessionStore.getWalletAddress() || undefined,
        message: result.message
      };
    };

    // Create logout callback that clears auth data immediately when user confirms logout in browser
    const logoutCallback: LogoutCallbackFn = async (type: LogoutType) => {
      // Stop validation polling
      this.stopValidationPolling();

      // Clear verification cache
      this.verificationCache.clear();

      // Clear API key from ApiKeyManager
      await this.apiKeyManager.clearApiKey();

      // Clear session store
      await this.sessionStore.clear();

      logAudit('AUTH_BROWSER_LOGOUT_SUCCESS', 'success', { type });
      logger.info(`Browser logout completed: ${type}`);
    };

    // Create and start the local auth server in logout mode with callback
    this.localAuthServer = new LocalAuthServer(validateApiKey, this.apiEndpoint);
    const { port, url } = await this.localAuthServer.startLogout(
      apiKey,
      walletAddress || undefined,
      logoutCallback
    );

    logger.info('Browser logout started', { url });
    logAudit('AUTH_BROWSER_LOGOUT_START', 'success', { url, port });

    return { url, port };
  }

  /**
   * Wait for browser logout to complete
   * @param timeoutMs - Maximum time to wait (default: 5 minutes)
   * @returns Logout result
   */
  async waitForBrowserLogout(timeoutMs?: number): Promise<LogoutResult> {
    if (!this.localAuthServer) {
      return {
        success: false,
        type: 'cancelled',
        error: 'No browser logout in progress'
      };
    }

    try {
      const result = await this.localAuthServer.waitForLogout(timeoutMs);
      // Auth data is already cleared by the logout callback - just return result
      return result;
    } finally {
      this.localAuthServer = null;
    }
  }

  /**
   * Cancel any pending browser logout
   */
  async cancelBrowserLogout(): Promise<void> {
    if (this.localAuthServer) {
      await this.localAuthServer.shutdown();
      this.localAuthServer = null;
      logger.info('Browser logout cancelled');
      logAudit('AUTH_BROWSER_LOGOUT_CANCEL', 'success', {});
    }
  }

  /**
   * Check if browser logout is in progress
   */
  isBrowserLogoutPending(): boolean {
    return this.localAuthServer !== null && this.localAuthServer.isRunning();
  }

  /**
   * Logout and clear local session
   * Clears all local caches. Backend revocation now requires wallet signature,
   * so use browser-based logout (startBrowserLogout) for permanent revocation.
   * @param notifyBackend - Deprecated: backend revoke requires wallet signature (default: false)
   */
  async logout(notifyBackend: boolean = false): Promise<{ success: boolean; message: string }> {
    // Creator mode doesn't have real sessions
    if (this.creatorMode.isCreatorMode()) {
      return {
        success: true,
        message: 'Creator mode - no session to revoke'
      };
    }

    const userId = this.sessionStore.getUserId();
    const apiKey = this.sessionStore.getApiKey();
    const apiKeyPrefix = apiKey?.substring(0, 8);

    // 0. Stop validation polling first to prevent race conditions
    this.stopValidationPolling();

    // 1. Clear verification cache
    this.verificationCache.clear();

    // 2. Clear API key from ApiKeyManager
    await this.apiKeyManager.clearApiKey();

    // 3. Call backend /revoke endpoint (graceful - don't fail if unavailable)
    if (notifyBackend && apiKey) {
      await callBackendRevoke(this.apiEndpoint, apiKey);
    }

    // 4. Clear session store
    await this.sessionStore.clear();

    // 5. Log audit event locally
    logAudit('AUTH_LOGOUT', 'success', { userId, apiKeyPrefix });

    logger.info('User logged out successfully', { userId, apiKeyPrefix });

    return { success: true, message: 'Logged out successfully' };
  }

  /**
   * Start validation polling - checks API key validity every minute
   * If validation fails, automatically logs out the user
   */
  startValidationPolling(): void {
    // Don't start polling in creator mode
    if (this.creatorMode.isCreatorMode()) {
      logger.info('Validation polling skipped - creator mode active');
      return;
    }

    // Don't start if already polling
    if (this.validationPolling?.isActive()) {
      logger.info('Validation polling already active');
      return;
    }

    this.validationPolling = createValidationPolling({
      apiEndpoint: this.apiEndpoint,
      sessionStore: this.sessionStore,
      verificationCache: this.verificationCache,
      onSessionInvalid: async () => {
        await this.logout(false);
      }
    });

    this.validationPolling.start();
  }

  /**
   * Stop validation polling
   */
  stopValidationPolling(): void {
    if (this.validationPolling) {
      this.validationPolling.stop();
      this.validationPolling = null;
    }
  }

  /**
   * Check if validation polling is currently active
   */
  isValidationPollingActive(): boolean {
    return this.validationPolling?.isActive() ?? false;
  }

  /**
   * Get auth status summary
   */
  async getStatus(): Promise<{
    isAuthenticated: boolean;
    isCreatorMode: boolean;
    licenseType: string | null;
    userId: string | null;
    walletAddress: string | null;
    validationPollingActive: boolean;
  }> {
    return {
      isAuthenticated: await this.isAuthenticated(),
      isCreatorMode: this.isCreatorMode(),
      licenseType: await this.getLicenseType(),
      userId: this.sessionStore.getUserId(),
      walletAddress: await this.getWalletAddress(),
      validationPollingActive: this.isValidationPollingActive()
    };
  }

  /**
   * For testing: Reset the singleton instance
   */
  static resetInstance(): void {
    if (AuthService.instance) {
      AuthService.instance.stopValidationPolling();
      AuthService.instance = null;
    }
  }
}
