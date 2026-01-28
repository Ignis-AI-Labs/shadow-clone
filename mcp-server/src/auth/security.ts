/**
 * Security Utilities for Auth Module
 *
 * Pure functions and factory functions for security-related operations:
 * - CSRF token generation/validation
 * - Ethereum address validation
 * - ERC-712 signature verification
 * - Nonce replay protection
 */

import * as crypto from 'crypto';
import { ethers } from 'ethers';
import type { ERC712Domain, ERC712AuthMessage } from './types.js';

/**
 * Server-defined ERC-712 domain
 * This is the authoritative domain configuration - client domain is ignored
 */
export const ERC712_DOMAIN: Readonly<ERC712Domain> = {
  name: 'Shadow Clone',
  version: '1',
  chainId: 1
} as const;

/**
 * Content-Security-Policy header for all HTML responses
 */
export const CSP_HEADER = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "connect-src 'self'",
  "img-src 'self' data:",
].join('; ');

/**
 * ERC-712 type field definition
 */
type ERC712TypeField = { name: string; type: string };

/**
 * ERC-712 types for Auth message
 */
export const AUTH_TYPES: Record<string, ERC712TypeField[]> = {
  Auth: [
    { name: 'wallet', type: 'address' },
    { name: 'nonce', type: 'string' },
    { name: 'deadline', type: 'uint256' }
  ]
};

/**
 * ERC-712 types for Regenerate message
 */
export const REGENERATE_TYPES: Record<string, ERC712TypeField[]> = {
  Regenerate: [
    { name: 'wallet', type: 'address' },
    { name: 'nonce', type: 'string' },
    { name: 'deadline', type: 'uint256' },
    { name: 'action', type: 'string' }
  ]
};

/**
 * ERC-712 types for Revoke message
 */
export const REVOKE_TYPES: Record<string, ERC712TypeField[]> = {
  Revoke: [
    { name: 'wallet', type: 'address' },
    { name: 'nonce', type: 'string' },
    { name: 'deadline', type: 'uint256' },
    { name: 'action', type: 'string' }
  ]
};

/**
 * Generate a cryptographically secure CSRF token
 *
 * @returns 64-character hex string
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Validate CSRF token matches expected value
 *
 * @param token - The token from the request
 * @param expected - The expected token value
 * @returns true if tokens match
 */
export function validateCsrfToken(token: string | undefined, expected: string): boolean {
  return typeof token === 'string' && token === expected;
}

/**
 * Validate Ethereum address format
 *
 * @param address - The address to validate
 * @returns true if address is valid 0x-prefixed 40-character hex string
 */
export function validateEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Check if a deadline timestamp has expired
 *
 * @param deadline - Unix timestamp (seconds)
 * @returns true if deadline has passed
 */
export function isDeadlineExpired(deadline: number): boolean {
  const now = Math.floor(Date.now() / 1000);
  return deadline < now;
}

/**
 * Verify ERC-712 typed data signature
 *
 * @param domain - ERC-712 domain parameters
 * @param types - ERC-712 type definitions
 * @param message - The message that was signed
 * @param signature - The signature to verify
 * @returns Recovered address or null if verification fails
 */
export function verifyERC712Signature(
  domain: ERC712Domain,
  types: Record<string, Array<{ name: string; type: string }>>,
  message: ERC712AuthMessage,
  signature: string
): string | null {
  try {
    return ethers.verifyTypedData(domain, types, message, signature);
  } catch {
    return null;
  }
}

/**
 * Mask an API key for display (show first 8 and last 4 characters)
 *
 * @param apiKey - The full API key
 * @returns Masked key like "ignis_ab...xyz9"
 */
export function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 12) {
    return apiKey.slice(0, 4) + '...' + apiKey.slice(-4);
  }
  return apiKey.slice(0, 8) + '...' + apiKey.slice(-4);
}

/**
 * Nonce tracker interface for replay protection
 */
export interface NonceTracker {
  /** Check if a nonce has already been used */
  isUsed: (nonce: string) => boolean;
  /** Mark a nonce as used with its expiry deadline */
  markUsed: (nonce: string, deadline: number) => void;
  /** Clear all tracked nonces */
  cleanup: () => void;
}

/**
 * Create a nonce tracker for replay protection
 *
 * Uses closure pattern to encapsulate state.
 * Nonces are automatically cleaned up when their deadline expires.
 *
 * @returns NonceTracker instance
 */
export function createNonceTracker(): NonceTracker {
  const usedNonces = new Map<string, number>(); // nonce -> expiry timestamp

  return {
    isUsed(nonce: string): boolean {
      // Clean up expired nonces first
      const now = Math.floor(Date.now() / 1000);
      for (const [n, expiry] of usedNonces) {
        if (expiry < now) {
          usedNonces.delete(n);
        }
      }
      return usedNonces.has(nonce);
    },

    markUsed(nonce: string, deadline: number): void {
      usedNonces.set(nonce, deadline);
    },

    cleanup(): void {
      usedNonces.clear();
    }
  };
}
