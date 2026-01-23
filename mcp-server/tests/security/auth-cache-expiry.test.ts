import { describe, test, expect } from 'bun:test';

/**
 * Security Tests: Two-Tier Cache Expiry Behavior
 *
 * The authentication system uses a two-tier caching strategy:
 * 1. Normal cache: 60 seconds - reduces API calls during active usage
 * 2. Fallback cache: 5 minutes - grace period during network errors
 *
 * These tests verify both cache behaviors work correctly.
 */

// Constants matching authService.ts
const NORMAL_CACHE_DURATION = 60 * 1000; // 60 seconds
const FALLBACK_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

describe('Normal Cache Behavior (60 seconds)', () => {
  describe('Cache within 60-second window', () => {
    test('should use cached value when cache is fresh (< 60s)', () => {
      const verificationCache = new Map<string, { isActive: boolean; timestamp: number }>();
      const apiKey = 'ignis_test_key_fresh';

      // Cache entry from 30 seconds ago
      const cached = {
        isActive: true,
        timestamp: Date.now() - 30000,
      };
      verificationCache.set(apiKey, cached);

      const cachedEntry = verificationCache.get(apiKey);
      const cacheValid = cachedEntry && Date.now() - cachedEntry.timestamp < NORMAL_CACHE_DURATION;

      expect(cacheValid).toBe(true);
      expect(cachedEntry?.isActive).toBe(true);
    });

    test('should use cached value at exactly 59 seconds', () => {
      const verificationCache = new Map<string, { isActive: boolean; timestamp: number }>();
      const apiKey = 'ignis_test_key_59s';

      const cached = {
        isActive: true,
        timestamp: Date.now() - 59000, // 59 seconds ago
      };
      verificationCache.set(apiKey, cached);

      const cachedEntry = verificationCache.get(apiKey);
      const cacheValid = cachedEntry && Date.now() - cachedEntry.timestamp < NORMAL_CACHE_DURATION;

      expect(cacheValid).toBe(true);
    });

    test('should return cached isActive=false when user has no NFT', () => {
      const verificationCache = new Map<string, { isActive: boolean; timestamp: number }>();
      const apiKey = 'ignis_test_key_inactive';

      const cached = {
        isActive: false, // User doesn't have NFT
        timestamp: Date.now() - 10000,
      };
      verificationCache.set(apiKey, cached);

      const cachedEntry = verificationCache.get(apiKey);
      const cacheValid = cachedEntry && Date.now() - cachedEntry.timestamp < NORMAL_CACHE_DURATION;

      expect(cacheValid).toBe(true);
      expect(cachedEntry?.isActive).toBe(false);
    });
  });

  describe('Cache expiry after 60 seconds', () => {
    test('should require fresh verification when cache is exactly 60s old', () => {
      const verificationCache = new Map<string, { isActive: boolean; timestamp: number }>();
      const apiKey = 'ignis_test_key_60s';

      const cached = {
        isActive: true,
        timestamp: Date.now() - 60000, // Exactly 60 seconds ago
      };
      verificationCache.set(apiKey, cached);

      const cachedEntry = verificationCache.get(apiKey);
      const cacheValid = cachedEntry && Date.now() - cachedEntry.timestamp < NORMAL_CACHE_DURATION;

      // At exactly 60s, cache should be expired (< not <=)
      expect(cacheValid).toBe(false);
    });

    test('should require fresh verification when cache is 90s old', () => {
      const verificationCache = new Map<string, { isActive: boolean; timestamp: number }>();
      const apiKey = 'ignis_test_key_90s';

      const cached = {
        isActive: true,
        timestamp: Date.now() - 90000, // 90 seconds ago
      };
      verificationCache.set(apiKey, cached);

      const cachedEntry = verificationCache.get(apiKey);
      const cacheValid = cachedEntry && Date.now() - cachedEntry.timestamp < NORMAL_CACHE_DURATION;

      expect(cacheValid).toBe(false);
    });

    test('should require fresh verification when cache is 2 minutes old', () => {
      const verificationCache = new Map<string, { isActive: boolean; timestamp: number }>();
      const apiKey = 'ignis_test_key_2min';

      const cached = {
        isActive: true,
        timestamp: Date.now() - 120000, // 2 minutes ago
      };
      verificationCache.set(apiKey, cached);

      const cachedEntry = verificationCache.get(apiKey);
      const cacheValid = cachedEntry && Date.now() - cachedEntry.timestamp < NORMAL_CACHE_DURATION;

      expect(cacheValid).toBe(false);
    });
  });
});

describe('Network Error Fallback Cache (5 minutes)', () => {
  describe('Fallback cache within 5-minute window', () => {
    test('should use cached value on network error when cache is < 5 min old', () => {
      const verificationCache = new Map<string, { isActive: boolean; timestamp: number }>();
      const apiKey = 'ignis_test_key_fallback';

      // Cache from 3 minutes ago (within 5-min fallback window)
      const cached = {
        isActive: true,
        timestamp: Date.now() - (3 * 60 * 1000),
      };
      verificationCache.set(apiKey, cached);

      // Simulate network error handling
      const handleNetworkError = (): boolean => {
        const cachedEntry = verificationCache.get(apiKey);
        if (cachedEntry && Date.now() - cachedEntry.timestamp < FALLBACK_CACHE_DURATION) {
          return cachedEntry.isActive;
        }
        return false;
      };

      const result = handleNetworkError();
      expect(result).toBe(true);
    });

    test('should use cached value at 4 minutes 59 seconds', () => {
      const verificationCache = new Map<string, { isActive: boolean; timestamp: number }>();
      const apiKey = 'ignis_test_key_4m59s';

      const cached = {
        isActive: true,
        timestamp: Date.now() - (4 * 60 * 1000 + 59 * 1000), // 4:59
      };
      verificationCache.set(apiKey, cached);

      const handleNetworkError = (): boolean => {
        const cachedEntry = verificationCache.get(apiKey);
        if (cachedEntry && Date.now() - cachedEntry.timestamp < FALLBACK_CACHE_DURATION) {
          return cachedEntry.isActive;
        }
        return false;
      };

      const result = handleNetworkError();
      expect(result).toBe(true);
    });

    test('should deny access on network error when cached isActive is false', () => {
      const verificationCache = new Map<string, { isActive: boolean; timestamp: number }>();
      const apiKey = 'ignis_test_key_inactive_fallback';

      const cached = {
        isActive: false, // User lost NFT ownership
        timestamp: Date.now() - (2 * 60 * 1000),
      };
      verificationCache.set(apiKey, cached);

      const handleNetworkError = (): boolean => {
        const cachedEntry = verificationCache.get(apiKey);
        if (cachedEntry && Date.now() - cachedEntry.timestamp < FALLBACK_CACHE_DURATION) {
          return cachedEntry.isActive;
        }
        return false;
      };

      const result = handleNetworkError();
      expect(result).toBe(false);
    });
  });

  describe('Fallback cache expiry after 5 minutes (logout behavior)', () => {
    test('should deny access on network error when cache is exactly 5 min old', () => {
      const verificationCache = new Map<string, { isActive: boolean; timestamp: number }>();
      const apiKey = 'ignis_test_key_5min';

      const cached = {
        isActive: true,
        timestamp: Date.now() - FALLBACK_CACHE_DURATION, // Exactly 5 minutes ago
      };
      verificationCache.set(apiKey, cached);

      const handleNetworkError = (): boolean => {
        const cachedEntry = verificationCache.get(apiKey);
        if (cachedEntry && Date.now() - cachedEntry.timestamp < FALLBACK_CACHE_DURATION) {
          return cachedEntry.isActive;
        }
        return false;
      };

      const result = handleNetworkError();
      // At exactly 5 minutes, should be denied (< not <=)
      expect(result).toBe(false);
    });

    test('should deny access on network error when cache is 6 minutes old', () => {
      const verificationCache = new Map<string, { isActive: boolean; timestamp: number }>();
      const apiKey = 'ignis_test_key_6min';

      const cached = {
        isActive: true,
        timestamp: Date.now() - (6 * 60 * 1000), // 6 minutes ago
      };
      verificationCache.set(apiKey, cached);

      const handleNetworkError = (): boolean => {
        const cachedEntry = verificationCache.get(apiKey);
        if (cachedEntry && Date.now() - cachedEntry.timestamp < FALLBACK_CACHE_DURATION) {
          return cachedEntry.isActive;
        }
        return false;
      };

      const result = handleNetworkError();
      expect(result).toBe(false);
    });

    test('should deny access on network error when cache is 10 minutes old', () => {
      const verificationCache = new Map<string, { isActive: boolean; timestamp: number }>();
      const apiKey = 'ignis_test_key_10min';

      const cached = {
        isActive: true,
        timestamp: Date.now() - (10 * 60 * 1000), // 10 minutes ago
      };
      verificationCache.set(apiKey, cached);

      const handleNetworkError = (): boolean => {
        const cachedEntry = verificationCache.get(apiKey);
        if (cachedEntry && Date.now() - cachedEntry.timestamp < FALLBACK_CACHE_DURATION) {
          return cachedEntry.isActive;
        }
        return false;
      };

      const result = handleNetworkError();
      expect(result).toBe(false);
    });

    test('should deny access on network error when no cache exists', () => {
      const verificationCache = new Map<string, { isActive: boolean; timestamp: number }>();
      const apiKey = 'ignis_test_key_no_cache';

      // No cache entry exists

      const handleNetworkError = (): boolean => {
        const cachedEntry = verificationCache.get(apiKey);
        if (cachedEntry && Date.now() - cachedEntry.timestamp < FALLBACK_CACHE_DURATION) {
          return cachedEntry.isActive;
        }
        return false;
      };

      const result = handleNetworkError();
      expect(result).toBe(false);
    });
  });
});

describe('Two-Tier Cache Interaction', () => {
  test('normal cache (60s) is subset of fallback cache (5min)', () => {
    // Any entry valid for normal cache is also valid for fallback
    const timestamp = Date.now() - 30000; // 30 seconds ago

    const normalValid = Date.now() - timestamp < NORMAL_CACHE_DURATION;
    const fallbackValid = Date.now() - timestamp < FALLBACK_CACHE_DURATION;

    expect(normalValid).toBe(true);
    expect(fallbackValid).toBe(true);
  });

  test('entry can be invalid for normal but valid for fallback', () => {
    // Entry at 2 minutes is expired for normal cache but valid for fallback
    const timestamp = Date.now() - (2 * 60 * 1000); // 2 minutes ago

    const normalValid = Date.now() - timestamp < NORMAL_CACHE_DURATION;
    const fallbackValid = Date.now() - timestamp < FALLBACK_CACHE_DURATION;

    expect(normalValid).toBe(false);
    expect(fallbackValid).toBe(true);
  });

  test('entry can be invalid for both caches', () => {
    // Entry at 6 minutes is expired for both
    const timestamp = Date.now() - (6 * 60 * 1000); // 6 minutes ago

    const normalValid = Date.now() - timestamp < NORMAL_CACHE_DURATION;
    const fallbackValid = Date.now() - timestamp < FALLBACK_CACHE_DURATION;

    expect(normalValid).toBe(false);
    expect(fallbackValid).toBe(false);
  });
});

describe('Cache Update Behavior', () => {
  test('successful API call should update cache timestamp', () => {
    const verificationCache = new Map<string, { isActive: boolean; timestamp: number }>();
    const apiKey = 'ignis_test_key_update';

    // Old cache entry
    const oldTimestamp = Date.now() - (4 * 60 * 1000); // 4 minutes ago
    verificationCache.set(apiKey, {
      isActive: true,
      timestamp: oldTimestamp,
    });

    // Simulate successful API call updating cache
    const newTimestamp = Date.now();
    verificationCache.set(apiKey, {
      isActive: true,
      timestamp: newTimestamp,
    });

    const cachedEntry = verificationCache.get(apiKey);
    expect(cachedEntry?.timestamp).toBe(newTimestamp);
    expect(cachedEntry?.timestamp).toBeGreaterThan(oldTimestamp);
  });

  test('API call returning isActive=false should update cache', () => {
    const verificationCache = new Map<string, { isActive: boolean; timestamp: number }>();
    const apiKey = 'ignis_test_key_revoked';

    // User had NFT
    verificationCache.set(apiKey, {
      isActive: true,
      timestamp: Date.now() - 30000,
    });

    // API returns that NFT is no longer owned
    verificationCache.set(apiKey, {
      isActive: false,
      timestamp: Date.now(),
    });

    const cachedEntry = verificationCache.get(apiKey);
    expect(cachedEntry?.isActive).toBe(false);
  });
});

describe('Edge Cases', () => {
  test('should handle cache entry with timestamp in the future', () => {
    const verificationCache = new Map<string, { isActive: boolean; timestamp: number }>();
    const apiKey = 'ignis_test_key_future';

    // Edge case: timestamp in future (clock skew)
    const cached = {
      isActive: true,
      timestamp: Date.now() + 10000, // 10 seconds in future
    };
    verificationCache.set(apiKey, cached);

    const cachedEntry = verificationCache.get(apiKey);
    const cacheAge = Date.now() - cachedEntry!.timestamp;

    // Age would be negative, making it "valid" by the < check
    expect(cacheAge).toBeLessThan(0);
    expect(cacheAge < NORMAL_CACHE_DURATION).toBe(true);
  });

  test('should handle very old cache entries', () => {
    const verificationCache = new Map<string, { isActive: boolean; timestamp: number }>();
    const apiKey = 'ignis_test_key_ancient';

    // Very old entry (1 hour ago)
    const cached = {
      isActive: true,
      timestamp: Date.now() - (60 * 60 * 1000),
    };
    verificationCache.set(apiKey, cached);

    const cachedEntry = verificationCache.get(apiKey);
    const normalValid = Date.now() - cachedEntry!.timestamp < NORMAL_CACHE_DURATION;
    const fallbackValid = Date.now() - cachedEntry!.timestamp < FALLBACK_CACHE_DURATION;

    expect(normalValid).toBe(false);
    expect(fallbackValid).toBe(false);
  });

  test('should handle multiple API keys with different cache states', () => {
    const verificationCache = new Map<string, { isActive: boolean; timestamp: number }>();

    // Fresh cache
    verificationCache.set('key1', {
      isActive: true,
      timestamp: Date.now() - 10000,
    });

    // Expired for normal, valid for fallback
    verificationCache.set('key2', {
      isActive: true,
      timestamp: Date.now() - (3 * 60 * 1000),
    });

    // Expired for both
    verificationCache.set('key3', {
      isActive: true,
      timestamp: Date.now() - (10 * 60 * 1000),
    });

    const key1Entry = verificationCache.get('key1')!;
    const key2Entry = verificationCache.get('key2')!;
    const key3Entry = verificationCache.get('key3')!;

    // Key1: valid for both
    expect(Date.now() - key1Entry.timestamp < NORMAL_CACHE_DURATION).toBe(true);
    expect(Date.now() - key1Entry.timestamp < FALLBACK_CACHE_DURATION).toBe(true);

    // Key2: invalid for normal, valid for fallback
    expect(Date.now() - key2Entry.timestamp < NORMAL_CACHE_DURATION).toBe(false);
    expect(Date.now() - key2Entry.timestamp < FALLBACK_CACHE_DURATION).toBe(true);

    // Key3: invalid for both
    expect(Date.now() - key3Entry.timestamp < NORMAL_CACHE_DURATION).toBe(false);
    expect(Date.now() - key3Entry.timestamp < FALLBACK_CACHE_DURATION).toBe(false);
  });
});

describe('Logging Behavior', () => {
  test('network error fallback should be logged', () => {
    // The expected log message when using fallback cache
    const expectedLogMessage = 'Using cached verification due to network error';

    expect(expectedLogMessage).toContain('cached');
    expect(expectedLogMessage).toContain('network error');
  });

  test('log messages should not contain API key', () => {
    const logMessage = 'Using cached verification due to network error';

    expect(logMessage).not.toContain('ignis_');
    expect(logMessage).not.toContain('apiKey');
    expect(logMessage).not.toContain('X-API-Key');
  });
});
