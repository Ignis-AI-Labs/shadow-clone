import axios from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { logger, logAudit } from '../utils/logger.js';
import { ApiKeyManager } from './apiKeyManager.js';
import { CreatorMode } from './creatorMode.js';
import { encrypt, decryptWithMigration } from './encryption.js';
import { LocalAuthServer, AuthResult } from './localAuthServer.js';

interface AuthData {
  apiKey: string; // Stored encrypted in file, decrypted in memory
  userId: string;
  licenseType: string;
  walletAddress?: string;
  lastVerified: number;
}

interface StoredAuthData {
  encryptedApiKey?: string; // v2 format
  apiKey?: string; // v1 format (plain text) - for migration
  userId: string;
  licenseType: string;
  walletAddress?: string;
  lastVerified: number;
}

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

export class AuthService {
  private authData: AuthData | null = null;
  private authFilePath: string;
  private apiEndpoint: string;
  private verificationCache: Map<string, { isActive: boolean; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60000; // 1 minute cache to avoid hammering the API
  private apiKeyManager: ApiKeyManager;
  private creatorMode: CreatorMode;
  private localAuthServer: LocalAuthServer | null = null;

  // Validation polling properties
  private validationPollingInterval: NodeJS.Timeout | null = null;
  private readonly VALIDATION_POLL_INTERVAL = 60000; // 1 minute polling interval
  private consecutiveValidationFailures: number = 0;
  private readonly MAX_CONSECUTIVE_FAILURES = 3; // Logout after 3 consecutive failures (3 minutes)

  // Configuration constants
  private readonly API_KEY_PREFIX_LENGTH = 8;
  private readonly API_TIMEOUT_MS = 5000;
  private readonly EXTENDED_CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Store auth data in user's home directory
    const configDir = path.join(os.homedir(), '.shadow-clone');
    this.authFilePath = path.join(configDir, 'mcp-auth.json');
    this.apiEndpoint = process.env.SHADOW_CLONE_API_ENDPOINT || 'https://api.ignislabs.ai';
    this.apiKeyManager = ApiKeyManager.getInstance();
    this.creatorMode = CreatorMode.getInstance();
    
    // Check for creator mode first
    if (this.creatorMode.isCreatorMode()) {
      logger.info('🚀 Creator Mode Active - Authentication bypassed');
      logAudit('AUTH_CREATOR_MODE', 'success', {
        licenseType: this.creatorMode.getCreatorLicenseType(),
      });
      this.authData = {
        apiKey: this.creatorMode.getCreatorApiKey(),
        userId: 'creator',
        licenseType: this.creatorMode.getCreatorLicenseType(),
        walletAddress: 'LOCAL',
        lastVerified: Date.now()
      };
    } else {
      this.loadAuthData();
      this.checkCachedApiKey();
    }
  }
  
  private async checkCachedApiKey() {
    // Try to get cached API key if we don't have auth data
    if (!this.authData) {
      const cachedKey = await this.apiKeyManager.getApiKey();
      if (cachedKey) {
        const apiKeyPrefix = cachedKey.substring(0, this.API_KEY_PREFIX_LENGTH);
        logger.info('Found cached API key, attempting authentication...');
        logAudit('AUTH_CACHED_KEY_FOUND', 'success', { apiKeyPrefix });
        
        const result = await this.authenticate(cachedKey);
        if (!result.success) {
          logger.warn('Cached API key is invalid or expired');
          logAudit('AUTH_CACHED_KEY_INVALID', 'failure', {
            apiKeyPrefix,
            reason: result.message || 'invalid_or_expired',
          });
          await this.apiKeyManager.clearApiKey();
        }
      }
    }
  }

  private async ensureConfigDir() {
    const configDir = path.dirname(this.authFilePath);
    try {
      await fs.mkdir(configDir, { recursive: true });
    } catch (error) {
      logger.error('Failed to create config directory:', error);
    }
  }

  private async loadAuthData() {
    try {
      const data = await fs.readFile(this.authFilePath, 'utf-8');
      const storedData: StoredAuthData = JSON.parse(data);

      // Handle v2 format (encrypted API key)
      if (storedData.encryptedApiKey) {
        const { plaintext, needsMigration } = decryptWithMigration(storedData.encryptedApiKey);
        this.authData = {
          apiKey: plaintext,
          userId: storedData.userId,
          licenseType: storedData.licenseType,
          walletAddress: storedData.walletAddress,
          lastVerified: storedData.lastVerified,
        };

        // Re-save if migration was needed (v1 XOR to v2 AES)
        if (needsMigration) {
          logger.info('Migrating mcp-auth.json from v1 to v2 encryption format');
          const encrypted = encrypt(plaintext);
          await this.saveAuthData(encrypted.payload);
          // Sync to config.json so both files have the same encrypted value
          await this.apiKeyManager.saveApiKey(plaintext, encrypted.payload);
        }
      }
      // Handle v1 format (plain text API key) - migrate to v2
      else if (storedData.apiKey) {
        logger.info('Migrating mcp-auth.json from plain text to encrypted format');
        this.authData = {
          apiKey: storedData.apiKey,
          userId: storedData.userId,
          licenseType: storedData.licenseType,
          walletAddress: storedData.walletAddress,
          lastVerified: storedData.lastVerified,
        };
        // Encrypt once and save to both files
        const encrypted = encrypt(storedData.apiKey);
        await this.saveAuthData(encrypted.payload);
        // Sync to config.json so both files have the same encrypted value
        await this.apiKeyManager.saveApiKey(storedData.apiKey, encrypted.payload);
      } else {
        this.authData = null;
      }

      // Auth data persists until NFT ownership changes
      // No automatic expiration based on time
    } catch (error) {
      // File doesn't exist or is invalid
      this.authData = null;
    }
  }

  private async saveAuthData(encryptedPayload: string) {
    if (!this.authData) return;

    try {
      await this.ensureConfigDir();

      const storedData: StoredAuthData = {
        encryptedApiKey: encryptedPayload,
        userId: this.authData.userId,
        licenseType: this.authData.licenseType,
        walletAddress: this.authData.walletAddress,
        lastVerified: this.authData.lastVerified,
      };

      await fs.writeFile(this.authFilePath, JSON.stringify(storedData, null, 2));
      // Set restrictive permissions (owner read/write only)
      await fs.chmod(this.authFilePath, 0o600);
    } catch (error) {
      logger.error('Failed to save auth data', {
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private async clearAuth() {
    try {
      await fs.unlink(this.authFilePath);
    } catch (error) {
      // File might not exist
    }
  }

  async authenticate(apiKey: string): Promise<{ success: boolean; licenseType?: string; message?: string }> {
    // Creator mode always succeeds
    if (this.creatorMode.isCreatorMode()) {
      return {
        success: true,
        licenseType: 'UNLIMITED',
        message: 'Creator mode - authentication bypassed'
      };
    }
    
    try {
      const response = await axios.post(
        `${this.apiEndpoint}/shadow-clone-licenses/validate`,
        { apiKey },
        {
          headers: {
            'X-API-Key': apiKey,
            'User-Agent': 'Shadow-Clone-MCP/0.1.0'
          }
        }
      );

      if (response.data.valid) {
        const isActive = response.data.isActive !== false;

        this.authData = {
          apiKey,
          userId: response.data.userId,
          licenseType: response.data.licenseType,
          walletAddress: response.data.walletAddress,
          lastVerified: Date.now()
        };

        // Encrypt once, use for both storage files
        const encrypted = encrypt(apiKey);

        await this.saveAuthData(encrypted.payload);

        // Save API key to all cache locations (pass same encrypted payload)
        await this.apiKeyManager.saveApiKey(apiKey, encrypted.payload);
        
        // Cache the verification result
        this.verificationCache.set(apiKey, {
          isActive,
          timestamp: Date.now()
        });
        
        if (!isActive) {
          logAudit('AUTH_LOGIN_FAILURE', 'failure', {
            userId: response.data.userId,
            reason: response.data.message ? response.data.message : 'API key is not active',
          });
          return {
            success: false,
            message: response.data.message ? response.data.message : 'API key is not active'
          };
        }
        
        logAudit('AUTH_LOGIN_SUCCESS', 'success', {
          userId: response.data.userId,
          licenseType: response.data.licenseType,
        });
        
        return { 
          success: true, 
          licenseType: response.data.licenseType 
        };
      }
      
      logAudit('AUTH_LOGIN_FAILURE', 'failure', { reason: 'invalid_api_key' });
      return { success: false, message: 'Invalid API key' };
    } catch (error: unknown) {
      // Sanitize error logging to avoid leaking sensitive data
      const axiosError = error as { response?: { status?: number }; message?: string; code?: string };
      logger.error('Authentication failed', {
        status: axiosError.response?.status,
        code: axiosError.code,
        message: axiosError.message,
      });

      logAudit('AUTH_LOGIN_FAILURE', 'failure', {
        reason: axiosError.response?.status === 401 ? 'invalid_credentials' : 
                axiosError.response?.status === 403 ? 'access_denied' : 'auth_error',
      });

      if (axiosError.response?.status === 401) {
        return { success: false, message: 'Invalid API key. Please check your credentials.' };
      } else if (axiosError.response?.status === 403) {
        return { success: false, message: 'Access denied. Your license may have expired.' };
      }

      return { success: false, message: 'Authentication failed. Please try again.' };
    }
  }

  async isAuthenticated(): Promise<boolean> {
    // Creator mode is always authenticated
    if (this.creatorMode.isCreatorMode()) {
      return true;
    }
    
    await this.loadAuthData();
    
    // If no auth data, try to authenticate with cached key
    if (!this.authData) {
      const cachedKey = await this.apiKeyManager.getApiKey();
      if (cachedKey) {
        const apiKeyPrefix = cachedKey.substring(0, this.API_KEY_PREFIX_LENGTH);
        // Check if we need to revalidate
        if (this.apiKeyManager.needsValidation()) {
          logger.info('Revalidating cached API key...');
          logAudit('AUTH_REVALIDATION_START', 'success', { apiKeyPrefix });
          
          const result = await this.authenticate(cachedKey);
          if (!result.success) {
            logger.warn('Cached API key is no longer valid. Please visit dashboard.ignislabs.ai to get a new API key.');
            logAudit('AUTH_CACHED_KEY_INVALID', 'failure', {
              apiKeyPrefix,
              reason: 'revalidation_failed',
            });
            await this.apiKeyManager.clearApiKey();
            return false;
          }
          this.apiKeyManager.markValidated();
        }
        // If we successfully authenticated or validation isn't needed yet
        if (this.authData) {
          return await this.verifyNFTOwnership();
        }
      }
      return false;
    }
    
    // Check real-time NFT ownership
    return await this.verifyNFTOwnership();
  }
  
  private async verifyNFTOwnership(): Promise<boolean> {
    if (!this.authData?.apiKey) return false;
    
    const apiKey = this.authData.apiKey;
    
    // Check cache first
    const cached = this.verificationCache.get(apiKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.isActive;
    }
    
    try {
      const response = await axios.post<{ valid: boolean; isActive: boolean }>(
        `${this.apiEndpoint}/shadow-clone-licenses/validate`,
        { apiKey },
        {
          headers: {
            'X-API-Key': apiKey,
            'User-Agent': 'Shadow-Clone-MCP/0.1.0'
          },
          timeout: this.API_TIMEOUT_MS // 5 second timeout for verification
        }
      );
      
      // Handle backend-requested session invalidation
      if (response.data.valid === false) {
        logger.info('Backend requested session invalidation');
        logAudit('AUTH_SESSION_REVOKED', 'success', {
          userId: this.authData?.userId,
          reason: 'backend_requested',
        });
        // Logout without calling backend again (to avoid loop)
        await this.logout(false);
        return false;
      }
      
      const isActive = response.data.valid && response.data.isActive !== false;
      const apiKeyPrefix = apiKey.substring(0, this.API_KEY_PREFIX_LENGTH);
      
      // Update cache
      this.verificationCache.set(apiKey, {
        isActive,
        timestamp: Date.now()
      });
      
      // If NFT ownership changed, clear auth data
      if (!isActive && this.authData) {
        logger.info('NFT ownership lost, clearing authentication');
        logAudit('AUTH_NFT_LOST', 'success', {
          userId: this.authData.userId,
          reason: 'nft_ownership_changed',
        });
        this.authData = null;
        await this.clearAuth();
      } else if (isActive) {
        logAudit('AUTH_NFT_VERIFY_SUCCESS', 'success', {
          userId: this.authData?.userId,
          apiKeyPrefix,
        });
      }
      
      return isActive;
    } catch (error: unknown) {
      // Sanitize error logging to avoid leaking sensitive data
      const axiosError = error as { response?: { status?: number }; message?: string; code?: string };
      const apiKeyPrefix = apiKey.substring(0, this.API_KEY_PREFIX_LENGTH);
      
      logger.error('NFT verification failed', {
        status: axiosError.response?.status,
        code: axiosError.code,
        message: axiosError.message,
      });
      
      logAudit('AUTH_NFT_VERIFY_FAILURE', 'failure', {
        userId: this.authData?.userId,
        apiKeyPrefix,
        reason: axiosError.code || 'network_error',
        status: axiosError.response?.status,
      });

      // On network errors, use cached value if available and recent (within 5 minutes)
      if (cached && Date.now() - cached.timestamp < this.EXTENDED_CACHE_DURATION_MS) {
        logger.info('Using cached verification due to network error');
        return cached.isActive;
      }

      return false;
    }
  }

  async getApiKey(): Promise<string | null> {
    await this.loadAuthData();
    
    // If we have auth data, return it
    if (this.authData?.apiKey) {
      return this.authData.apiKey;
    }
    
    // Otherwise try to get cached key
    return await this.apiKeyManager.getApiKey();
  }

  async getLicenseType(): Promise<string | null> {
    await this.loadAuthData();
    return this.authData?.licenseType || null;
  }

  async makeAuthenticatedRequest(url: string, options: AuthenticatedRequestOptions = {}): Promise<AuthenticatedRequestResponse> {
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
   * Get current wallet address associated with the license
   */
  async getWalletAddress(): Promise<string | null> {
    await this.loadAuthData();
    return this.authData?.walletAddress || null;
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
        userId: this.authData?.userId,
        walletAddress: this.authData?.walletAddress,
        message: result.message
      };
    };

    // Create and start the local auth server
    this.localAuthServer = new LocalAuthServer(validateApiKey, this.apiEndpoint);
    const { port, url } = await this.localAuthServer.start();

    logger.info('Browser auth started', { url });
    logAudit('AUTH_BROWSER_AUTH_START', 'success', { url, port });

    return { url, port };
  }

  /**
   * Wait for browser authentication to complete
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
   * Logout and revoke current session
   * Clears all local caches and optionally notifies backend
   * @param notifyBackend - Call backend /revoke endpoint (default: true)
   */
  async logout(notifyBackend: boolean = true): Promise<{ success: boolean; message: string }> {
    // Creator mode doesn't have real sessions
    if (this.creatorMode.isCreatorMode()) {
      return {
        success: true,
        message: 'Creator mode - no session to revoke'
      };
    }

    const userId = this.authData?.userId;
    const apiKey = this.authData?.apiKey;
    const apiKeyPrefix = apiKey?.substring(0, 8);

    // 0. Stop validation polling first to prevent race conditions
    this.stopValidationPolling();

    // 1. Clear verification cache
    this.clearVerificationCache();

    // 2. Clear API key from ApiKeyManager
    await this.apiKeyManager.clearApiKey();

    // 3. Call backend /revoke endpoint (graceful - don't fail if unavailable)
    if (notifyBackend && apiKey) {
      await this.callBackendRevoke(apiKey, apiKeyPrefix);
    }

    // 4. Clear local auth data (mcp-auth.json)
    await this.clearAuth();
    this.authData = null;

    // 5. Log audit event locally
    logAudit('AUTH_LOGOUT', 'success', { userId, apiKeyPrefix });

    logger.info('User logged out successfully', { userId, apiKeyPrefix });

    return { success: true, message: 'Logged out successfully' };
  }

  /**
   * Call backend to revoke the session
   * This is a graceful operation - failures are logged but don't block logout
   */
  private async callBackendRevoke(apiKey: string, apiKeyPrefix?: string): Promise<void> {
    try {
      await axios.post(
        `${this.apiEndpoint}/shadow-clone-licenses/revoke`,
        { apiKey },
        {
          headers: {
            'X-API-Key': apiKey,
            'User-Agent': 'Shadow-Clone-MCP/0.1.0'
          },
          timeout: this.API_TIMEOUT_MS // 5 second timeout
        }
      );
      logger.info('Backend session revoked', { apiKeyPrefix });
    } catch (error) {
      // Graceful failure - backend may not have endpoint yet
      const axiosError = error as { response?: { status?: number }; message?: string; code?: string };
      logger.warn('Backend revocation failed (non-blocking)', {
        apiKeyPrefix,
        status: axiosError.response?.status,
        message: axiosError.message,
      });
    }
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
    if (this.validationPollingInterval) {
      logger.info('Validation polling already active');
      return;
    }

    // Reset failure counter when starting
    this.consecutiveValidationFailures = 0;

    logger.info('Starting validation polling', { 
      intervalMs: this.VALIDATION_POLL_INTERVAL,
      maxFailures: this.MAX_CONSECUTIVE_FAILURES
    });
    
    logAudit('AUTH_VALIDATION_POLL_START', 'success', {
      intervalMs: this.VALIDATION_POLL_INTERVAL,
      maxFailures: this.MAX_CONSECUTIVE_FAILURES,
    });

    // Start the polling interval
    this.validationPollingInterval = setInterval(() => {
      this.performValidationCheck().catch((error) => {
        logger.error('Validation polling check failed', {
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      });
    }, this.VALIDATION_POLL_INTERVAL);

    // Perform an immediate check as well
    this.performValidationCheck().catch((error) => {
      logger.error('Initial validation check failed', {
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    });
  }

  /**
   * Stop validation polling
   */
  stopValidationPolling(): void {
    if (this.validationPollingInterval) {
      clearInterval(this.validationPollingInterval);
      this.validationPollingInterval = null;
      this.consecutiveValidationFailures = 0;
      logger.info('Validation polling stopped');
      logAudit('AUTH_VALIDATION_POLL_STOP', 'success', {});
    }
  }

  /**
   * Check if validation polling is currently active
   */
  isValidationPollingActive(): boolean {
    return this.validationPollingInterval !== null;
  }

  /**
   * Perform a validation check - called by the polling interval
   * Bypasses cache and directly calls the backend API
   * If validation fails, triggers logout
   */
  private async performValidationCheck(): Promise<void> {
    // Skip if creator mode
    if (this.creatorMode.isCreatorMode()) {
      return;
    }

    // Skip if no auth data or API key
    if (!this.authData?.apiKey) {
      logger.info('Validation check skipped - no API key present');
      this.stopValidationPolling();
      return;
    }

    const apiKey = this.authData.apiKey;
    const apiKeyPrefix = apiKey.substring(0, this.API_KEY_PREFIX_LENGTH);

    try {
      const response = await axios.post<{ valid: boolean; isActive: boolean }>(
        `${this.apiEndpoint}/shadow-clone-licenses/validate`,
        { apiKey },
        {
          headers: {
            'X-API-Key': apiKey,
            'User-Agent': 'Shadow-Clone-MCP/0.1.0'
          },
          timeout: 10000 // 10 second timeout for polling check
        }
      );

      // Reset failure counter on successful API call
      this.consecutiveValidationFailures = 0;

      const isValid = response.data.valid === true;
      const isActive = response.data.isActive !== false;

      // Update the verification cache with fresh data
      this.verificationCache.set(apiKey, {
        isActive: isValid && isActive,
        timestamp: Date.now()
      });

      if (!isValid || !isActive) {
        logger.warn('Validation polling detected invalid/inactive session', {
          apiKeyPrefix,
          valid: isValid,
          active: isActive,
        });

        logAudit('AUTH_SESSION_REVOKED', 'success', {
          userId: this.authData?.userId,
          reason: !isValid ? 'api_key_invalid' : 'api_key_inactive',
        });

        // Stop polling before logout to prevent race conditions
        this.stopValidationPolling();

        // Logout without notifying backend (since we just validated against it)
        await this.logout(false);
        
        logger.info('Auto-logout completed due to failed validation check');
      } else {
        logger.debug?.('Validation polling check passed', { apiKeyPrefix });
        logAudit('AUTH_VALIDATION_POLL_SUCCESS', 'success', {
          userId: this.authData?.userId,
          apiKeyPrefix,
        });
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number }; message?: string; code?: string };
      
      // Increment failure counter
      this.consecutiveValidationFailures++;

      logger.warn('Validation polling API call failed', {
        apiKeyPrefix,
        consecutiveFailures: this.consecutiveValidationFailures,
        maxFailures: this.MAX_CONSECUTIVE_FAILURES,
        status: axiosError.response?.status,
        code: axiosError.code,
        message: axiosError.message,
      });
      
      logAudit('AUTH_VALIDATION_POLL_FAILURE', 'failure', {
        userId: this.authData?.userId,
        apiKeyPrefix,
        consecutiveFailures: this.consecutiveValidationFailures,
        reason: axiosError.code || 'network_error',
        status: axiosError.response?.status,
      });

      // If we've hit max consecutive failures, logout
      if (this.consecutiveValidationFailures >= this.MAX_CONSECUTIVE_FAILURES) {
        logger.error('Max consecutive validation failures reached - logging out', {
          apiKeyPrefix,
          consecutiveFailures: this.consecutiveValidationFailures,
        });

        logAudit('AUTH_SESSION_REVOKED', 'success', {
          userId: this.authData?.userId,
          reason: 'validation_failures_exceeded',
        });

        // Stop polling before logout
        this.stopValidationPolling();

        // Logout - don't notify backend since we can't reach it anyway
        await this.logout(false);
        
        logger.info('Auto-logout completed due to consecutive validation failures');
      }
    }
  }
}