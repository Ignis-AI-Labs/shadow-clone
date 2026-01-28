/**
 * Shared Type Definitions for Auth Module
 *
 * This module contains all shared interfaces and types used across
 * the authentication subsystem.
 */

/**
 * ERC-712 Domain for typed data signing
 */
export interface ERC712Domain {
  name: string;
  version: string;
  chainId: number;
}

/**
 * ERC-712 Auth message type for wallet authentication
 */
export interface ERC712AuthMessage {
  wallet: string;
  nonce: string;
  deadline: number;
}

/**
 * ERC-712 Regenerate message type for key regeneration
 */
export interface ERC712RegenerateMessage {
  wallet: string;
  nonce: string;
  deadline: number;
  action: 'regenerate';
}

/**
 * ERC-712 Revoke message type for key revocation
 */
export interface ERC712RevokeMessage {
  wallet: string;
  nonce: string;
  deadline: number;
  action: 'revoke';
}

/**
 * Result of browser-based authentication
 */
export interface AuthResult {
  success: boolean;
  apiKey?: string;
  licenseType?: string;
  userId?: string;
  walletAddress?: string;
  error?: string;
}

/**
 * Logout type - determines how the logout was performed
 */
export type LogoutType = 'local' | 'revoked' | 'cancelled';

/**
 * Result of browser-based logout
 */
export interface LogoutResult {
  success: boolean;
  type: LogoutType;
  error?: string;
}

/**
 * Callback type for logout completion
 */
export type LogoutCallbackFn = (type: LogoutType) => Promise<void>;

/**
 * Callback type for API key validation
 */
export type ValidateApiKeyFn = (apiKey: string) => Promise<{
  success: boolean;
  licenseType?: string;
  userId?: string;
  walletAddress?: string;
  message?: string;
}>;

/**
 * Wallet authentication response from backend
 */
export interface WalletAuthResponse {
  success: boolean;
  apiKey?: string;
  licenseType?: string;
  walletAddress?: string;
  userId?: string;
  message?: string;
  notImplemented?: boolean;
  isNewKey?: boolean;
  warning?: string;
}

/**
 * Regenerate response from backend
 */
export interface RegenerateResponse {
  success: boolean;
  apiKey?: string;
  licenseType?: string;
  walletAddress?: string;
  message?: string;
}

/**
 * Revoke response from backend
 */
export interface RevokeResponse {
  success: boolean;
  message?: string;
}

/**
 * Server mode - determines which routes are active
 */
export type ServerMode = 'auth' | 'logout';

/**
 * Pending key delivery entry for token-based key transfer
 */
export interface PendingKey {
  apiKey: string;
  license: string;
}

/**
 * Wallet authentication request data (ERC-712 format)
 */
export interface WalletAuthRequest {
  domain?: ERC712Domain;
  types?: Record<string, Array<{ name: string; type: string }>>;
  message: ERC712AuthMessage;
  signature: string;
  csrf_token: string;
}

/**
 * Auth data stored in session
 */
export interface AuthData {
  apiKey: string;
  userId: string;
  licenseType: string;
  walletAddress?: string;
  lastVerified: number;
}

/**
 * Stored auth data format (encrypted)
 */
export interface StoredAuthData {
  encryptedApiKey?: string;
  apiKey?: string; // v1 format (plain text) - for migration
  userId: string;
  licenseType: string;
  walletAddress?: string;
  lastVerified: number;
}

/**
 * Verification cache entry
 */
export interface CacheEntry {
  isActive: boolean;
  timestamp: number;
}
