/**
 * API Validator
 *
 * Pure async functions for API key validation and NFT verification.
 */

import axios from 'axios';
import type { SessionStore } from './sessionStore.js';
import type { VerificationCache } from './verificationCache.js';
import type { ApiKeyManager } from '../apiKeyManager.js';
import type { AuthData } from '../types.js';
import { encrypt } from '../encryption.js';
import { logger, logAudit } from '../../utils/logger.js';

/**
 * Authentication result
 */
export interface AuthenticateResult {
  success: boolean;
  licenseType?: string;
  userId?: string;
  walletAddress?: string;
  message?: string;
}

/** Timeout for API calls (30 seconds) */
const API_TIMEOUT_MS = 30000;

/** API key prefix length for logging */
const API_KEY_PREFIX_LENGTH = 8;

/** Extended cache duration for network error fallback (5 minutes) */
const EXTENDED_CACHE_DURATION_MS = 5 * 60 * 1000;

/**
 * Authenticate with an API key
 *
 * Validates the key with the backend and stores the session on success.
 *
 * @param apiKey - The API key to authenticate
 * @param apiEndpoint - Backend API endpoint
 * @param sessionStore - Session store for persistence
 * @param verificationCache - Cache for verification results
 * @param apiKeyManager - API key manager for key storage
 * @returns Authentication result
 */
export async function authenticate(
  apiKey: string,
  apiEndpoint: string,
  sessionStore: SessionStore,
  verificationCache: VerificationCache,
  apiKeyManager: ApiKeyManager
): Promise<AuthenticateResult> {
  try {
    const response = await axios.post(
      `${apiEndpoint}/shadow-clone-licenses/validate`,
      { apiKey },
      {
        headers: {
          'X-API-Key': apiKey,
          'User-Agent': 'Shadow-Clone-MCP/0.1.0'
        },
        timeout: API_TIMEOUT_MS
      }
    );

    if (!response.data.valid) {
      logAudit('AUTH_LOGIN_FAILURE', 'failure', { reason: 'invalid_api_key' });
      return { success: false, message: 'Invalid API key' };
    }

    const isActive = response.data.isActive !== false;

    const authData: AuthData = {
      apiKey,
      userId: response.data.userId,
      licenseType: response.data.licenseType,
      walletAddress: response.data.walletAddress,
      lastVerified: Date.now()
    };

    // Store in memory
    sessionStore.set(authData);

    // Encrypt once, use for both storage files
    const encrypted = encrypt(apiKey);

    // Save to persistent storage
    await sessionStore.save(authData);

    // Save API key to all cache locations (pass same encrypted payload)
    await apiKeyManager.saveApiKey(apiKey, encrypted.payload);

    // Cache the verification result
    verificationCache.set(apiKey, isActive);

    if (!isActive) {
      logAudit('AUTH_LOGIN_FAILURE', 'failure', {
        userId: response.data.userId,
        reason: response.data.message || 'API key is not active'
      });
      return {
        success: false,
        message: response.data.message || 'API key is not active'
      };
    }

    logAudit('AUTH_LOGIN_SUCCESS', 'success', {
      userId: response.data.userId,
      licenseType: response.data.licenseType
    });

    return {
      success: true,
      licenseType: response.data.licenseType,
      userId: response.data.userId,
      walletAddress: response.data.walletAddress
    };
  } catch (error: unknown) {
    const axiosError = error as { response?: { status?: number }; message?: string; code?: string };

    logger.error('Authentication failed', {
      status: axiosError.response?.status,
      code: axiosError.code,
      message: axiosError.message
    });

    logAudit('AUTH_LOGIN_FAILURE', 'failure', {
      reason: axiosError.response?.status === 401 ? 'invalid_credentials' :
              axiosError.response?.status === 403 ? 'access_denied' : 'auth_error'
    });

    if (axiosError.response?.status === 401) {
      return { success: false, message: 'Invalid API key. Please check your credentials.' };
    } else if (axiosError.response?.status === 403) {
      return { success: false, message: 'Access denied. Your license may have expired.' };
    }

    return { success: false, message: 'Authentication failed. Please try again.' };
  }
}

/**
 * Verify NFT ownership for the current session
 *
 * @param apiEndpoint - Backend API endpoint
 * @param sessionStore - Session store with current auth data
 * @param verificationCache - Cache for verification results
 * @returns true if NFT ownership is valid
 */
export async function verifyNFTOwnership(
  apiEndpoint: string,
  sessionStore: SessionStore,
  verificationCache: VerificationCache
): Promise<boolean> {
  const apiKey = sessionStore.getApiKey();
  if (!apiKey) return false;

  // Check cache first
  if (verificationCache.isValid(apiKey)) {
    const entry = verificationCache.get(apiKey);
    return entry?.isActive ?? false;
  }

  const apiKeyPrefix = apiKey.substring(0, API_KEY_PREFIX_LENGTH);

  try {
    const response = await axios.post<{ valid: boolean; isActive: boolean }>(
      `${apiEndpoint}/shadow-clone-licenses/validate`,
      { apiKey },
      {
        headers: {
          'X-API-Key': apiKey,
          'User-Agent': 'Shadow-Clone-MCP/0.1.0'
        },
        timeout: API_TIMEOUT_MS
      }
    );

    // Handle backend-requested session invalidation
    if (response.data.valid === false) {
      logger.info('Backend requested session invalidation');
      logAudit('AUTH_SESSION_REVOKED', 'success', {
        userId: sessionStore.getUserId(),
        reason: 'backend_requested'
      });
      sessionStore.set(null);
      await sessionStore.clear();
      return false;
    }

    const isActive = response.data.valid && response.data.isActive !== false;

    // Update cache
    verificationCache.set(apiKey, isActive);

    // If NFT ownership changed, clear auth data
    if (!isActive) {
      logger.info('NFT ownership lost, clearing authentication');
      logAudit('AUTH_NFT_LOST', 'success', {
        userId: sessionStore.getUserId(),
        reason: 'nft_ownership_changed'
      });
      sessionStore.set(null);
      await sessionStore.clear();
    } else {
      logAudit('AUTH_NFT_VERIFY_SUCCESS', 'success', {
        userId: sessionStore.getUserId(),
        apiKeyPrefix
      });
    }

    return isActive;
  } catch (error: unknown) {
    const axiosError = error as { response?: { status?: number }; message?: string; code?: string };

    logger.error('NFT verification failed', {
      status: axiosError.response?.status,
      code: axiosError.code,
      message: axiosError.message
    });

    logAudit('AUTH_NFT_VERIFY_FAILURE', 'failure', {
      userId: sessionStore.getUserId(),
      apiKeyPrefix,
      reason: axiosError.code || 'network_error',
      status: axiosError.response?.status
    });

    // On network errors, use cached value if available and recent (within 5 minutes)
    if (verificationCache.isValidExtended(apiKey)) {
      logger.info('Using cached verification due to network error');
      const entry = verificationCache.get(apiKey);
      return entry?.isActive ?? false;
    }

    return false;
  }
}

/**
 * Call backend to revoke the session
 *
 * This is a graceful operation - failures are logged but don't block logout.
 *
 * @param apiEndpoint - Backend API endpoint
 * @param apiKey - The API key to revoke
 */
export async function callBackendRevoke(apiEndpoint: string, apiKey: string): Promise<void> {
  const apiKeyPrefix = apiKey.substring(0, API_KEY_PREFIX_LENGTH);

  try {
    await axios.post(
      `${apiEndpoint}/shadow-clone-licenses/revoke`,
      { apiKey },
      {
        headers: {
          'X-API-Key': apiKey,
          'User-Agent': 'Shadow-Clone-MCP/0.1.0'
        },
        timeout: 5000 // Shorter timeout for revoke
      }
    );
    logger.info('Backend session revoked', { apiKeyPrefix });
  } catch (error) {
    // Graceful failure - backend may not have endpoint yet
    const axiosError = error as { response?: { status?: number }; message?: string; code?: string };
    logger.warn('Backend revocation failed (non-blocking)', {
      apiKeyPrefix,
      status: axiosError.response?.status,
      message: axiosError.message
    });
  }
}
