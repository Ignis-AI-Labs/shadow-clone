/**
 * Validation Polling Service
 *
 * Factory function for background validation polling.
 * Periodically checks API key validity and triggers logout on failure.
 */

import axios from 'axios';
import { logger, logAudit } from '../../utils/logger.js';
import type { SessionStore } from './sessionStore.js';
import type { VerificationCache } from './verificationCache.js';

/**
 * Dependencies for validation polling
 */
export interface ValidationPollingDeps {
  apiEndpoint: string;
  sessionStore: SessionStore;
  verificationCache: VerificationCache;
  onSessionInvalid: () => Promise<void>;
}

/**
 * Validation polling service interface
 */
export interface ValidationPollingService {
  /** Start the polling interval */
  start: () => void;
  /** Stop the polling interval */
  stop: () => void;
  /** Check if polling is currently active */
  isActive: () => boolean;
  /** Perform an immediate validation check */
  checkNow: () => Promise<void>;
}

/** Polling interval (1 minute) */
const POLL_INTERVAL_MS = 60000;

/** Maximum consecutive failures before logout */
const MAX_CONSECUTIVE_FAILURES = 3;

/** Timeout for individual check requests */
const CHECK_TIMEOUT_MS = 10000;

/** API key prefix length for logging */
const API_KEY_PREFIX_LENGTH = 8;

/**
 * Create a validation polling service
 *
 * Uses closure pattern to encapsulate state.
 * Polls the backend every minute and logs out after 3 consecutive failures.
 *
 * @param deps - Service dependencies
 * @returns ValidationPollingService instance
 */
export function createValidationPolling(deps: ValidationPollingDeps): ValidationPollingService {
  let intervalHandle: NodeJS.Timeout | null = null;
  let consecutiveFailures = 0;

  async function performCheck(): Promise<void> {
    const apiKey = deps.sessionStore.getApiKey();
    if (!apiKey) {
      logger.info('Validation check skipped - no API key present');
      stop();
      return;
    }

    const apiKeyPrefix = apiKey.substring(0, API_KEY_PREFIX_LENGTH);

    try {
      const response = await axios.post<{ valid: boolean; isActive: boolean }>(
        `${deps.apiEndpoint}/shadow-clone-licenses/validate`,
        { apiKey },
        {
          headers: {
            'X-API-Key': apiKey,
            'User-Agent': 'Shadow-Clone-MCP/0.1.0'
          },
          timeout: CHECK_TIMEOUT_MS
        }
      );

      // Reset failure counter on successful API call
      consecutiveFailures = 0;

      const isValid = response.data.valid === true;
      const isActive = response.data.isActive !== false;

      // Update the verification cache with fresh data
      deps.verificationCache.set(apiKey, isValid && isActive);

      if (!isValid || !isActive) {
        logger.warn('Validation polling detected invalid/inactive session', {
          apiKeyPrefix,
          valid: isValid,
          active: isActive
        });

        logAudit('AUTH_SESSION_REVOKED', 'success', {
          userId: deps.sessionStore.getUserId(),
          reason: !isValid ? 'api_key_invalid' : 'api_key_inactive'
        });

        // Stop polling before logout to prevent race conditions
        stop();

        // Logout without notifying backend (since we just validated against it)
        await deps.onSessionInvalid();

        logger.info('Auto-logout completed due to failed validation check');
      } else {
        logger.debug?.('Validation polling check passed', { apiKeyPrefix });
        logAudit('AUTH_VALIDATION_POLL_SUCCESS', 'success', {
          userId: deps.sessionStore.getUserId(),
          apiKeyPrefix
        });
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number }; message?: string; code?: string };

      // Increment failure counter
      consecutiveFailures++;

      logger.warn('Validation polling API call failed', {
        apiKeyPrefix,
        consecutiveFailures,
        maxFailures: MAX_CONSECUTIVE_FAILURES,
        status: axiosError.response?.status,
        code: axiosError.code,
        message: axiosError.message
      });

      logAudit('AUTH_VALIDATION_POLL_FAILURE', 'failure', {
        userId: deps.sessionStore.getUserId(),
        apiKeyPrefix,
        consecutiveFailures,
        reason: axiosError.code || 'network_error',
        status: axiosError.response?.status
      });

      // If we've hit max consecutive failures, logout
      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        logger.error('Max consecutive validation failures reached - logging out', {
          apiKeyPrefix,
          consecutiveFailures
        });

        logAudit('AUTH_SESSION_REVOKED', 'success', {
          userId: deps.sessionStore.getUserId(),
          reason: 'validation_failures_exceeded'
        });

        // Stop polling before logout
        stop();

        // Logout - don't notify backend since we can't reach it anyway
        await deps.onSessionInvalid();

        logger.info('Auto-logout completed due to consecutive validation failures');
      }
    }
  }

  function start(): void {
    if (intervalHandle) {
      logger.info('Validation polling already active');
      return;
    }

    // Reset failure counter when starting
    consecutiveFailures = 0;

    logger.info('Starting validation polling', {
      intervalMs: POLL_INTERVAL_MS,
      maxFailures: MAX_CONSECUTIVE_FAILURES
    });

    logAudit('AUTH_VALIDATION_POLL_START', 'success', {
      intervalMs: POLL_INTERVAL_MS,
      maxFailures: MAX_CONSECUTIVE_FAILURES
    });

    // Start the polling interval
    intervalHandle = setInterval(() => {
      performCheck().catch((error) => {
        logger.error('Validation polling check failed', {
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      });
    }, POLL_INTERVAL_MS);

    // Perform an immediate check as well
    performCheck().catch((error) => {
      logger.error('Initial validation check failed', {
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    });
  }

  function stop(): void {
    if (intervalHandle) {
      clearInterval(intervalHandle);
      intervalHandle = null;
      consecutiveFailures = 0;
      logger.info('Validation polling stopped');
      logAudit('AUTH_VALIDATION_POLL_STOP', 'success', {});
    }
  }

  return {
    start,
    stop,
    isActive: () => intervalHandle !== null,
    checkNow: performCheck
  };
}
