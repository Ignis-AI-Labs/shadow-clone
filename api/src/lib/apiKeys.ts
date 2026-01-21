import crypto from 'crypto';

/**
 * Generate a secure API key
 * Format: sc-{random 48 chars}
 */
export function generateApiKey(): string {
  const randomBytes = crypto.randomBytes(36); // 36 bytes = 48 base64 chars
  const key = randomBytes.toString('base64url'); // URL-safe base64
  return `sc-${key}`;
}

/**
 * Hash an API key for storage
 * We store the hash, not the raw key
 */
export function hashApiKey(apiKey: string): string {
  return crypto
    .createHash('sha256')
    .update(apiKey)
    .digest('hex');
}

/**
 * Validate API key format
 */
export function isValidKeyFormat(apiKey: string): boolean {
  // Must start with 'sc-' and be reasonable length
  return apiKey.startsWith('sc-') && apiKey.length >= 32 && apiKey.length <= 100;
}

/**
 * Generate a secure admin token for internal API access
 * This should be set as ADMIN_SECRET in environment
 */
export function generateAdminSecret(): string {
  return crypto.randomBytes(32).toString('hex');
}
