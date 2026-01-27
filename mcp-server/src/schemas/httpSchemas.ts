import { z } from 'zod';

// ============================================================================
// Shared validators for HTTP request validation
// ============================================================================

/**
 * Ethereum address validator (0x + 40 hex chars)
 */
export const ethereumAddress = z.string().regex(
  /^0x[a-fA-F0-9]{40}$/,
  'Invalid Ethereum address format'
);

/**
 * CSRF token validator
 */
export const csrfToken = z.string().min(1, 'CSRF token required');

/**
 * Signature validator
 */
export const signature = z.string().min(1, 'Signature required');

/**
 * Nonce validator
 */
export const nonce = z.string().min(1, 'Nonce required');

/**
 * Deadline validator (Unix timestamp)
 */
export const deadline = z.number().int().positive('Deadline must be positive');

// ============================================================================
// ERC-712 Message Schemas
// ============================================================================

/**
 * ERC-712 Regenerate message schema
 */
export const erc712RegenerateMessageSchema = z.object({
  wallet: ethereumAddress,
  nonce: nonce,
  deadline: deadline,
  action: z.literal('regenerate')
});

/**
 * ERC-712 Revoke message schema
 */
export const erc712RevokeMessageSchema = z.object({
  wallet: ethereumAddress,
  nonce: nonce,
  deadline: deadline,
  action: z.literal('revoke')
});

/**
 * ERC-712 Auth message schema (for wallet-auth)
 */
export const erc712AuthMessageSchema = z.object({
  wallet: ethereumAddress,
  nonce: nonce,
  deadline: deadline
});

// ============================================================================
// HTTP Request Body Schemas
// ============================================================================

/**
 * POST /auth form data schema
 */
export const authRequestSchema = z.object({
  apiKey: z.string().min(10, 'API key too short'),
  csrf_token: csrfToken
});

/**
 * POST /wallet-auth request body schema
 */
export const walletAuthRequestSchema = z.object({
  message: erc712AuthMessageSchema,
  signature: signature,
  csrf_token: csrfToken
});

/**
 * POST /regenerate request body schema
 */
export const regenerateRequestSchema = z.object({
  message: erc712RegenerateMessageSchema,
  signature: signature,
  csrf_token: csrfToken
});

/**
 * POST /logout/get-key request body schema
 */
export const logoutGetKeyRequestSchema = z.object({
  csrf_token: csrfToken
});

/**
 * POST /logout/local request body schema
 */
export const logoutLocalRequestSchema = z.object({
  csrf_token: csrfToken
});

/**
 * POST /logout/revoke request body schema
 */
export const logoutRevokeRequestSchema = z.object({
  message: erc712RevokeMessageSchema,
  signature: signature,
  csrf_token: csrfToken
});

/**
 * POST /paste-key form data schema
 */
export const pasteKeyRequestSchema = z.object({
  apiKey: z.string().min(10, 'API key too short'),
  csrf_token: csrfToken,
  walletAddress: ethereumAddress.optional()
});

// ============================================================================
// Type exports (inferred from schemas)
// ============================================================================

export type ERC712AuthMessage = z.infer<typeof erc712AuthMessageSchema>;
export type ERC712RegenerateMessage = z.infer<typeof erc712RegenerateMessageSchema>;
export type ERC712RevokeMessage = z.infer<typeof erc712RevokeMessageSchema>;
export type AuthRequest = z.infer<typeof authRequestSchema>;
export type WalletAuthRequest = z.infer<typeof walletAuthRequestSchema>;
export type RegenerateRequest = z.infer<typeof regenerateRequestSchema>;
export type LogoutGetKeyRequest = z.infer<typeof logoutGetKeyRequestSchema>;
export type LogoutLocalRequest = z.infer<typeof logoutLocalRequestSchema>;
export type LogoutRevokeRequest = z.infer<typeof logoutRevokeRequestSchema>;
export type PasteKeyRequest = z.infer<typeof pasteKeyRequestSchema>;
