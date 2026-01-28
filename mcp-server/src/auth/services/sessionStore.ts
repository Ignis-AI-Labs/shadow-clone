/**
 * Session Store
 *
 * Factory function for auth data persistence.
 * Handles loading, saving, and clearing auth session data.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { encrypt, decryptWithMigration } from '../encryption.js';
import type { ApiKeyManager } from '../apiKeyManager.js';
import type { AuthData, StoredAuthData } from '../types.js';
import { logger } from '../../utils/logger.js';

/**
 * Session store interface
 */
export interface SessionStore {
  /** Load auth data from persistent storage */
  load: () => Promise<AuthData | null>;
  /** Save auth data to persistent storage */
  save: (data: AuthData) => Promise<void>;
  /** Clear auth data from persistent storage */
  clear: () => Promise<void>;
  /** Get current in-memory auth data */
  get: () => AuthData | null;
  /** Set in-memory auth data */
  set: (data: AuthData | null) => void;
  /** Get current API key (convenience method) */
  getApiKey: () => string | null;
  /** Get current license type (convenience method) */
  getLicenseType: () => string | null;
  /** Get current wallet address (convenience method) */
  getWalletAddress: () => string | null;
  /** Get current user ID (convenience method) */
  getUserId: () => string | null;
  /** Check if there's an active session */
  hasSession: () => boolean;
}

/**
 * Create a session store for auth data persistence
 *
 * Uses closure pattern to encapsulate state.
 * Data is encrypted at rest using AES-256-GCM.
 *
 * @param apiKeyManager - API key manager for syncing key storage
 * @returns SessionStore instance
 */
export function createSessionStore(apiKeyManager: ApiKeyManager): SessionStore {
  const configDir = path.join(os.homedir(), '.shadow-clone');
  const authFilePath = path.join(configDir, 'mcp-auth.json');
  let authData: AuthData | null = null;

  async function ensureConfigDir(): Promise<void> {
    try {
      await fs.mkdir(configDir, { recursive: true });
    } catch {
      // Directory might already exist
    }
  }

  return {
    async load(): Promise<AuthData | null> {
      try {
        const data = await fs.readFile(authFilePath, 'utf-8');
        const stored: StoredAuthData = JSON.parse(data);

        // Handle v2 format (encrypted API key)
        if (stored.encryptedApiKey) {
          const { plaintext, needsMigration } = decryptWithMigration(stored.encryptedApiKey);
          authData = {
            apiKey: plaintext,
            userId: stored.userId,
            licenseType: stored.licenseType,
            walletAddress: stored.walletAddress,
            lastVerified: stored.lastVerified
          };

          // Re-save if migration was needed (v1 XOR to v2 AES)
          if (needsMigration) {
            logger.info('Migrating mcp-auth.json from v1 to v2 encryption format');
            const encrypted = encrypt(plaintext);
            await this.save(authData);
            // Sync to config.json so both files have the same encrypted value
            await apiKeyManager.saveApiKey(plaintext, encrypted.payload);
          }
        }
        // Handle v1 format (plain text API key) - migrate to v2
        else if (stored.apiKey) {
          logger.info('Migrating mcp-auth.json from plain text to encrypted format');
          authData = {
            apiKey: stored.apiKey,
            userId: stored.userId,
            licenseType: stored.licenseType,
            walletAddress: stored.walletAddress,
            lastVerified: stored.lastVerified
          };
          // Encrypt once and save to both files
          const encrypted = encrypt(stored.apiKey);
          await this.save(authData);
          // Sync to config.json so both files have the same encrypted value
          await apiKeyManager.saveApiKey(stored.apiKey, encrypted.payload);
        } else {
          authData = null;
        }

        return authData;
      } catch {
        // File doesn't exist or is invalid
        authData = null;
        return null;
      }
    },

    async save(data: AuthData): Promise<void> {
      authData = data;

      try {
        await ensureConfigDir();

        const encrypted = encrypt(data.apiKey);
        const stored: StoredAuthData = {
          encryptedApiKey: encrypted.payload,
          userId: data.userId,
          licenseType: data.licenseType,
          walletAddress: data.walletAddress,
          lastVerified: data.lastVerified
        };

        await fs.writeFile(authFilePath, JSON.stringify(stored, null, 2));
        // Set restrictive permissions (owner read/write only)
        await fs.chmod(authFilePath, 0o600);
      } catch (error) {
        logger.error('Failed to save auth data', {
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    },

    async clear(): Promise<void> {
      authData = null;
      try {
        await fs.unlink(authFilePath);
      } catch {
        // File might not exist
      }
    },

    get: () => authData,
    set: (data) => { authData = data; },
    getApiKey: () => authData?.apiKey ?? null,
    getLicenseType: () => authData?.licenseType ?? null,
    getWalletAddress: () => authData?.walletAddress ?? null,
    getUserId: () => authData?.userId ?? null,
    hasSession: () => authData?.apiKey != null
  };
}
