import * as crypto from 'crypto';
import * as os from 'os';

/**
 * AES-256-GCM Encryption Service
 *
 * Provides cryptographically secure encryption for API key storage.
 * Key derivation uses machine-specific identifiers via scrypt.
 *
 * Storage format (v2):
 * - Prefix: "v2:"
 * - Payload: base64(IV + ciphertext + authTag)
 * - IV: 12 bytes (AES-GCM standard nonce)
 * - Auth Tag: 16 bytes (AES-GCM standard)
 */

// Constants
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // AES-GCM standard nonce size
const AUTH_TAG_LENGTH = 16; // AES-GCM standard tag size
const KEY_LENGTH = 32; // 256 bits for AES-256
const SCRYPT_COST = 16384; // N parameter for scrypt (CPU/memory cost)
const SCRYPT_BLOCK_SIZE = 8; // r parameter
const SCRYPT_PARALLELIZATION = 1; // p parameter
const STATIC_SALT = 'shadow-clone-v2-2024'; // Static salt component

// Version prefix for encrypted data
const V2_PREFIX = 'v2:';
const V1_XOR_KEY = 'shadow-clone-2024'; // Legacy XOR key for migration

/**
 * Encrypted data interface
 */
export interface EncryptedData {
  version: 2;
  payload: string; // base64 encoded: IV + ciphertext + authTag
}

/**
 * Derive a 256-bit encryption key from machine-specific identifiers
 * Uses scrypt for key derivation (CPU/memory-hard, resists brute force)
 *
 * Key derivation inputs:
 * - os.hostname() - Machine's hostname
 * - os.homedir() - User's home directory path
 * - Static salt component
 *
 * This makes the key unique per machine/user combination.
 * If the config file is moved to another machine, decryption will fail.
 */
export function deriveKey(): Buffer {
  const machineIdentifier = `${os.hostname()}:${os.homedir()}`;
  const salt = `${STATIC_SALT}:${machineIdentifier}`;

  // Use scrypt for key derivation
  return crypto.scryptSync(
    machineIdentifier,
    salt,
    KEY_LENGTH,
    {
      N: SCRYPT_COST,
      r: SCRYPT_BLOCK_SIZE,
      p: SCRYPT_PARALLELIZATION,
    }
  );
}

/**
 * Encrypt a plaintext string using AES-256-GCM
 *
 * @param plaintext - The string to encrypt
 * @returns Encrypted data object with version and payload
 */
export function encrypt(plaintext: string): EncryptedData {
  const key = deriveKey();

  // Generate random IV (nonce) for each encryption
  const iv = crypto.randomBytes(IV_LENGTH);

  // Create cipher
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  // Encrypt the plaintext
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);

  // Get the authentication tag
  const authTag = cipher.getAuthTag();

  // Combine: IV + ciphertext + authTag
  const combined = Buffer.concat([iv, encrypted, authTag]);

  return {
    version: 2,
    payload: V2_PREFIX + combined.toString('base64'),
  };
}

/**
 * Decrypt an encrypted payload using AES-256-GCM
 *
 * @param payload - The v2 encrypted payload string (with "v2:" prefix)
 * @returns Decrypted plaintext string
 * @throws Error if decryption fails (wrong key, tampered data, etc.)
 */
export function decrypt(payload: string): string {
  if (!payload.startsWith(V2_PREFIX)) {
    throw new Error('Invalid v2 encrypted payload format');
  }

  const key = deriveKey();

  // Remove prefix and decode base64
  const combined = Buffer.from(payload.slice(V2_PREFIX.length), 'base64');

  // Validate minimum length (IV + authTag, ciphertext can be 0 bytes for empty string)
  const minLength = IV_LENGTH + AUTH_TAG_LENGTH;
  if (combined.length < minLength) {
    throw new Error('Encrypted payload too short');
  }

  // Extract components
  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(combined.length - AUTH_TAG_LENGTH);
  const ciphertext = combined.subarray(IV_LENGTH, combined.length - AUTH_TAG_LENGTH);

  // Create decipher
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  // Set the authentication tag
  decipher.setAuthTag(authTag);

  // Decrypt
  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}

/**
 * Check if a stored value is in v1 (XOR) format
 *
 * V1 format is plain base64 without the "v2:" prefix.
 * It's not perfectly distinguishable, but v2 data always starts with "v2:".
 *
 * @param value - The stored encrypted value
 * @returns true if the value appears to be v1 format
 */
export function isV1Format(value: string): boolean {
  // V2 format always starts with "v2:"
  // V1 format is plain base64
  return !value.startsWith(V2_PREFIX);
}

/**
 * Decrypt v1 (XOR) encrypted data
 *
 * This is the legacy decryption for migration purposes.
 * Uses simple XOR with hardcoded key - NOT cryptographically secure.
 *
 * @param encoded - Base64 encoded XOR-encrypted data
 * @returns Decrypted plaintext
 */
export function decryptV1(encoded: string): string {
  try {
    // Base64 decode
    const encrypted = Buffer.from(encoded, 'base64').toString('binary');

    let result = '';
    for (let i = 0; i < encrypted.length; i++) {
      result += String.fromCharCode(
        encrypted.charCodeAt(i) ^ V1_XOR_KEY.charCodeAt(i % V1_XOR_KEY.length)
      );
    }

    return result;
  } catch {
    // If decoding fails, return as-is
    return encoded;
  }
}

/**
 * Migrate v1 (XOR) encrypted data to v2 (AES-256-GCM) format
 *
 * @param v1Encoded - The v1 base64-encoded XOR-encrypted value
 * @returns New v2 encrypted data
 */
export function migrateV1ToV2(v1Encoded: string): EncryptedData {
  // Decrypt using v1 method
  const plaintext = decryptV1(v1Encoded);

  // Re-encrypt using v2 method
  return encrypt(plaintext);
}

/**
 * Safely decrypt data, handling both v1 and v2 formats
 *
 * This function auto-detects the format and decrypts accordingly.
 * Use this for reading stored data during the migration period.
 *
 * @param value - The encrypted value (v1 or v2 format)
 * @returns Object with plaintext and whether migration is needed
 */
export function decryptWithMigration(value: string): { plaintext: string; needsMigration: boolean } {
  if (isV1Format(value)) {
    // V1 format - decrypt and flag for migration
    return {
      plaintext: decryptV1(value),
      needsMigration: true,
    };
  }

  // V2 format - decrypt normally
  return {
    plaintext: decrypt(value),
    needsMigration: false,
  };
}
