/**
 * Key Delivery Store
 *
 * Factory function for secure token-based API key delivery.
 * Keys are stored temporarily with expiring tokens that can only be used once.
 */

import * as crypto from 'crypto';
import type { PendingKey } from './types.js';

/**
 * Key delivery store interface
 */
export interface KeyDeliveryStore {
  /** Store an API key and return a one-time retrieval token */
  store: (apiKey: string, license: string) => string;
  /** Retrieve and consume an API key by token (one-time use) */
  retrieve: (token: string) => PendingKey | null;
}

/**
 * Internal storage entry with expiry
 */
interface PendingKeyDelivery {
  apiKey: string;
  license: string;
  expires: number;
}

/** Token expiry time in milliseconds (60 seconds) */
const KEY_DELIVERY_EXPIRY_MS = 60000;

/**
 * Create a key delivery store for secure token-based key transfer
 *
 * Uses closure pattern to encapsulate state.
 * Tokens expire after 60 seconds and can only be used once.
 *
 * @returns KeyDeliveryStore instance
 */
export function createKeyDeliveryStore(): KeyDeliveryStore {
  const pending = new Map<string, PendingKeyDelivery>();

  return {
    store(apiKey: string, license: string): string {
      const token = crypto.randomUUID();
      pending.set(token, {
        apiKey,
        license,
        expires: Date.now() + KEY_DELIVERY_EXPIRY_MS
      });
      return token;
    },

    retrieve(token: string): PendingKey | null {
      const entry = pending.get(token);

      // Not found or expired
      if (!entry || entry.expires < Date.now()) {
        pending.delete(token);
        return null;
      }

      // One-time use - delete after retrieval
      pending.delete(token);
      return { apiKey: entry.apiKey, license: entry.license };
    }
  };
}
