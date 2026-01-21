import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { encrypt, decryptWithMigration, EncryptedData } from './encryption.js';
import { logger } from '../utils/logger.js';

/**
 * API Key Manager - Handles caching and persistence of API keys
 *
 * Storage hierarchy (in order of preference):
 * 1. Environment variable (SHADOW_CLONE_API_KEY) - runtime only, not persisted
 * 2. Global config file (~/.shadow-clone/config.json) - AES-256-GCM encrypted
 * 3. In-memory cache (session only)
 *
 * Security: API keys are encrypted at rest using AES-256-GCM with machine-derived keys.
 * The .env file storage has been removed for security reasons.
 */
export class ApiKeyManager {
  private static instance: ApiKeyManager;
  private memoryCache: string | null = null;
  private lastValidationTime: number = 0;
  private validationInterval = 5 * 60 * 1000; // 5 minutes

  // File paths
  private globalConfigDir = path.join(os.homedir(), '.shadow-clone');
  private globalConfigFile = path.join(this.globalConfigDir, 'config.json');

  private constructor() {
    this.ensureConfigDirectory();
  }

  static getInstance(): ApiKeyManager {
    if (!ApiKeyManager.instance) {
      ApiKeyManager.instance = new ApiKeyManager();
    }
    return ApiKeyManager.instance;
  }

  /**
   * Get API key from all available sources
   */
  async getApiKey(): Promise<string | null> {
    // 1. Check environment variable first (highest priority)
    if (process.env.SHADOW_CLONE_API_KEY) {
      return process.env.SHADOW_CLONE_API_KEY;
    }

    // 2. Check global config (encrypted)
    const globalKey = await this.getFromGlobalConfig();
    if (globalKey) {
      return globalKey;
    }

    // 3. Check memory cache (last resort)
    return this.memoryCache;
  }

  /**
   * Save API key to storage locations
   * @param apiKey - Plain text API key
   * @param encryptedPayload - Optional pre-encrypted payload to use directly
   */
  async saveApiKey(apiKey: string, encryptedPayload?: string): Promise<void> {
    // Always save to memory first
    this.memoryCache = apiKey;

    // Set in current process environment
    process.env.SHADOW_CLONE_API_KEY = apiKey;

    // Save to global config (encrypted)
    await this.saveToGlobalConfig(apiKey, encryptedPayload);

    // Reset validation timer
    this.lastValidationTime = Date.now();
  }

  /**
   * Check if API key needs revalidation
   */
  needsValidation(): boolean {
    return Date.now() - this.lastValidationTime > this.validationInterval;
  }

  /**
   * Mark validation as completed
   */
  markValidated(): void {
    this.lastValidationTime = Date.now();
  }

  /**
   * Clear API key from all storage locations
   */
  async clearApiKey(): Promise<void> {
    this.memoryCache = null;
    delete process.env.SHADOW_CLONE_API_KEY;

    // Clear from global config
    await this.clearGlobalConfig();
  }

  /**
   * Get from global config file (handles v1 to v2 migration)
   */
  private async getFromGlobalConfig(): Promise<string | null> {
    try {
      if (!fs.existsSync(this.globalConfigFile)) {
        return null;
      }

      const content = fs.readFileSync(this.globalConfigFile, 'utf8');
      const config = JSON.parse(content);

      if (config.apiKey) {
        // Decrypt and check for migration
        const { plaintext, needsMigration } = decryptWithMigration(config.apiKey);

        // Auto-migrate v1 to v2 if needed
        if (needsMigration) {
          logger.info('Migrating API key storage from v1 to v2 format');
          await this.saveToGlobalConfig(plaintext);
        }

        return plaintext;
      }
    } catch (error) {
      logger.error('Error reading global config', {
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    return null;
  }

  /**
   * Save to global config file (AES-256-GCM encrypted)
   * @param apiKey - Plain text API key (used if encryptedPayload not provided)
   * @param encryptedPayload - Optional pre-encrypted payload to use directly
   */
  private async saveToGlobalConfig(apiKey: string, encryptedPayload?: string): Promise<void> {
    try {
      this.ensureConfigDirectory();

      let config: Record<string, unknown> = {};

      if (fs.existsSync(this.globalConfigFile)) {
        try {
          const content = fs.readFileSync(this.globalConfigFile, 'utf8');
          config = JSON.parse(content);
        } catch {
          // Invalid JSON, start fresh
          config = {};
        }
      }

      // Use provided encrypted payload or encrypt the API key
      const payload = encryptedPayload ?? encrypt(apiKey).payload;
      config.apiKey = payload;
      config.lastUpdated = new Date().toISOString();
      config.version = '2.0.0';

      fs.writeFileSync(this.globalConfigFile, JSON.stringify(config, null, 2));

      // Set restrictive permissions (Unix-like systems)
      if (process.platform !== 'win32') {
        fs.chmodSync(this.globalConfigFile, 0o600);
      }
    } catch (error) {
      logger.error('Error saving to global config', {
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Clear global config
   */
  private async clearGlobalConfig(): Promise<void> {
    try {
      if (fs.existsSync(this.globalConfigFile)) {
        const content = fs.readFileSync(this.globalConfigFile, 'utf8');
        const config = JSON.parse(content);

        delete config.apiKey;
        config.lastCleared = new Date().toISOString();

        fs.writeFileSync(this.globalConfigFile, JSON.stringify(config, null, 2));
      }
    } catch (error) {
      logger.error('Error clearing global config', {
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Ensure config directory exists
   */
  private ensureConfigDirectory(): void {
    if (!fs.existsSync(this.globalConfigDir)) {
      fs.mkdirSync(this.globalConfigDir, { recursive: true });

      // Set restrictive permissions (Unix-like systems)
      if (process.platform !== 'win32') {
        fs.chmodSync(this.globalConfigDir, 0o700);
      }
    }
  }

  /**
   * Get user-friendly storage location info
   */
  async getStorageInfo(): Promise<{ locations: string[]; current: string | null }> {
    const locations = [
      `Environment: SHADOW_CLONE_API_KEY`,
      `Global: ${this.globalConfigFile}`,
      `Memory: ${this.memoryCache ? 'Cached' : 'Not cached'}`,
    ];

    let current = null;
    if (process.env.SHADOW_CLONE_API_KEY) {
      current = 'Environment variable';
    } else if (fs.existsSync(this.globalConfigFile)) {
      const globalKey = await this.getFromGlobalConfig();
      if (globalKey) current = 'Global config (encrypted)';
    } else if (this.memoryCache) {
      current = 'Memory cache';
    }

    return { locations, current };
  }
}
