/**
 * Verification Cache
 *
 * Factory function for caching NFT verification results.
 * Reduces API calls by caching verification results with TTL.
 */

import type { CacheEntry } from '../types.js';

/**
 * Verification cache interface
 */
export interface VerificationCache {
  /** Get cache entry for an API key */
  get: (apiKey: string) => CacheEntry | null;
  /** Set cache entry for an API key */
  set: (apiKey: string, isActive: boolean) => void;
  /** Clear all cached entries */
  clear: () => void;
  /** Check if cache entry is still valid (within normal TTL) */
  isValid: (apiKey: string) => boolean;
  /** Check if cache entry is still valid (within extended TTL for network errors) */
  isValidExtended: (apiKey: string) => boolean;
}

/** Normal cache duration (1 minute) */
const CACHE_DURATION_MS = 60000;

/** Extended cache duration for network error fallback (5 minutes) */
const EXTENDED_CACHE_DURATION_MS = 5 * 60 * 1000;

/**
 * Create a verification cache for NFT ownership checks
 *
 * Uses closure pattern to encapsulate state.
 * Provides two TTL modes: normal (1 min) and extended (5 min) for network errors.
 *
 * @returns VerificationCache instance
 */
export function createVerificationCache(): VerificationCache {
  const cache = new Map<string, CacheEntry>();

  return {
    get(apiKey: string): CacheEntry | null {
      return cache.get(apiKey) ?? null;
    },

    set(apiKey: string, isActive: boolean): void {
      cache.set(apiKey, {
        isActive,
        timestamp: Date.now()
      });
    },

    clear(): void {
      cache.clear();
    },

    isValid(apiKey: string): boolean {
      const entry = cache.get(apiKey);
      if (!entry) return false;
      return Date.now() - entry.timestamp < CACHE_DURATION_MS;
    },

    isValidExtended(apiKey: string): boolean {
      const entry = cache.get(apiKey);
      if (!entry) return false;
      return Date.now() - entry.timestamp < EXTENDED_CACHE_DURATION_MS;
    }
  };
}
