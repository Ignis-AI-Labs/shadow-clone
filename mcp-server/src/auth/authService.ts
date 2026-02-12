import axios from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { logger } from '../utils/logger.js';
import { ApiKeyManager } from './apiKeyManager.js';
import { CreatorMode } from './creatorMode.js';
import { encrypt, decryptWithMigration } from './encryption.js';

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

export class AuthService {
  private authData: AuthData | null = null;
  private authFilePath: string;
  private apiEndpoint: string;
  private verificationCache: Map<string, { isActive: boolean; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60000; // 1 minute cache to avoid hammering the API
  private apiKeyManager: ApiKeyManager;
  private creatorMode: CreatorMode;

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
        logger.info('Found cached API key, attempting authentication...');
        const result = await this.authenticate(cachedKey);
        if (!result.success) {
          logger.warn('Cached API key is invalid or expired');
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
          },
          timeout: 10000
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
          return {
            success: false,
            message: 'Your NFT license is not found in the connected wallet. Please ensure you own an active Shadow Clone NFT.'
          };
        }
        
        return { 
          success: true, 
          licenseType: response.data.licenseType 
        };
      }
      
      return { success: false, message: 'Invalid API key' };
    } catch (error: unknown) {
      // Sanitize error logging to avoid leaking sensitive data
      const axiosError = error as { response?: { status?: number }; message?: string; code?: string };
      logger.error('Authentication failed', {
        status: axiosError.response?.status,
        code: axiosError.code,
        message: axiosError.message,
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
        // Check if we need to revalidate
        if (this.apiKeyManager.needsValidation()) {
          logger.info('Revalidating cached API key...');
          const result = await this.authenticate(cachedKey);
          if (!result.success) {
            logger.warn('Cached API key is no longer valid. Please visit dashboard.ignislabs.ai to get a new API key.');
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
      const response = await axios.post(
        `${this.apiEndpoint}/shadow-clone-licenses/validate`,
        { apiKey },
        {
          headers: {
            'X-API-Key': apiKey,
            'User-Agent': 'Shadow-Clone-MCP/0.1.0'
          },
          timeout: 5000 // 5 second timeout for verification
        }
      );
      
      const isActive = response.data.valid && response.data.isActive !== false;
      
      // Update cache
      this.verificationCache.set(apiKey, {
        isActive,
        timestamp: Date.now()
      });
      
      // If NFT ownership changed, clear auth data
      if (!isActive && this.authData) {
        logger.info('NFT ownership lost, clearing authentication');
        this.authData = null;
        await this.clearAuth();
      }
      
      return isActive;
    } catch (error: unknown) {
      // Sanitize error logging to avoid leaking sensitive data
      const axiosError = error as { response?: { status?: number }; message?: string; code?: string };
      logger.error('NFT verification failed', {
        status: axiosError.response?.status,
        code: axiosError.code,
        message: axiosError.message,
      });

      // On network errors, use cached value if available and recent (within 5 minutes)
      if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
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

  async makeAuthenticatedRequest(url: string, options: any = {}): Promise<any> {
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
}