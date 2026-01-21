import { describe, test, expect } from 'bun:test';
import {
  deriveKey,
  encrypt,
  decrypt,
  isV1Format,
  decryptV1,
  migrateV1ToV2,
  decryptWithMigration,
} from '../../src/auth/encryption';

// Constants for testing
const V1_XOR_KEY = 'shadow-clone-2024';

/**
 * Helper: Create v1 (XOR) encrypted data for testing migration
 */
function createV1EncryptedData(plaintext: string): string {
  let encrypted = '';
  for (let i = 0; i < plaintext.length; i++) {
    encrypted += String.fromCharCode(
      plaintext.charCodeAt(i) ^ V1_XOR_KEY.charCodeAt(i % V1_XOR_KEY.length)
    );
  }
  return Buffer.from(encrypted, 'binary').toString('base64');
}

describe('encryption module', () => {
  describe('deriveKey', () => {
    test('returns a Buffer', () => {
      const key = deriveKey();
      expect(key).toBeInstanceOf(Buffer);
    });

    test('returns 32 bytes (256 bits)', () => {
      const key = deriveKey();
      expect(key.length).toBe(32);
    });

    test('returns consistent key across multiple calls', () => {
      const key1 = deriveKey();
      const key2 = deriveKey();
      expect(key1.equals(key2)).toBe(true);
    });

    test('returns non-zero key', () => {
      const key = deriveKey();
      const isAllZeros = key.every((byte) => byte === 0);
      expect(isAllZeros).toBe(false);
    });
  });

  describe('encrypt', () => {
    test('returns correct structure with version 2', () => {
      const result = encrypt('test-api-key');
      expect(result).toHaveProperty('version', 2);
      expect(result).toHaveProperty('payload');
      expect(typeof result.payload).toBe('string');
    });

    test('payload starts with v2: prefix', () => {
      const result = encrypt('test-api-key');
      expect(result.payload.startsWith('v2:')).toBe(true);
    });

    test('produces different output each time (random IV)', () => {
      const plaintext = 'same-api-key';
      const result1 = encrypt(plaintext);
      const result2 = encrypt(plaintext);
      expect(result1.payload).not.toBe(result2.payload);
    });

    test('handles empty string', () => {
      const result = encrypt('');
      expect(result.version).toBe(2);
      expect(result.payload.startsWith('v2:')).toBe(true);
    });

    test('handles unicode characters', () => {
      const unicodeText = 'こんにちは🔐キー';
      const result = encrypt(unicodeText);
      expect(result.version).toBe(2);
      expect(result.payload.startsWith('v2:')).toBe(true);
    });

    test('handles special characters', () => {
      const specialChars = 'key=abc&token=xyz!@#$%^&*()_+-=[]{}|;:,.<>?';
      const result = encrypt(specialChars);
      expect(result.version).toBe(2);
      expect(result.payload.startsWith('v2:')).toBe(true);
    });

    test('handles long strings (10KB+)', () => {
      const longString = 'a'.repeat(10 * 1024);
      const result = encrypt(longString);
      expect(result.version).toBe(2);
      expect(result.payload.startsWith('v2:')).toBe(true);
    });
  });

  describe('decrypt', () => {
    test('round-trip: decrypt(encrypt(x)) === x', () => {
      const original = 'ignis_test_api_key_12345';
      const encrypted = encrypt(original);
      const decrypted = decrypt(encrypted.payload);
      expect(decrypted).toBe(original);
    });

    test('round-trip with empty string', () => {
      const original = '';
      const encrypted = encrypt(original);
      const decrypted = decrypt(encrypted.payload);
      expect(decrypted).toBe(original);
    });

    test('round-trip with unicode', () => {
      const original = 'こんにちは🔐キー';
      const encrypted = encrypt(original);
      const decrypted = decrypt(encrypted.payload);
      expect(decrypted).toBe(original);
    });

    test('round-trip with special characters', () => {
      const original = 'key=abc&token=xyz!@#$%^&*()';
      const encrypted = encrypt(original);
      const decrypted = decrypt(encrypted.payload);
      expect(decrypted).toBe(original);
    });

    test('round-trip with long string', () => {
      const original = 'x'.repeat(10 * 1024);
      const encrypted = encrypt(original);
      const decrypted = decrypt(encrypted.payload);
      expect(decrypted).toBe(original);
    });

    test('throws on missing v2: prefix', () => {
      expect(() => decrypt('invalid_data')).toThrow('Invalid v2 encrypted payload format');
    });

    test('throws on truncated data (too short)', () => {
      expect(() => decrypt('v2:abc')).toThrow();
    });

    test('throws on tampered ciphertext', () => {
      const encrypted = encrypt('test-key');
      const payload = encrypted.payload;

      // Decode, tamper middle bytes, re-encode
      const decoded = Buffer.from(payload.slice(3), 'base64');
      const middleIndex = Math.floor(decoded.length / 2);
      decoded[middleIndex] = decoded[middleIndex] ^ 0xff; // Flip bits
      const tampered = 'v2:' + decoded.toString('base64');

      expect(() => decrypt(tampered)).toThrow();
    });

    test('throws on tampered auth tag (last 16 bytes)', () => {
      const encrypted = encrypt('test-key');
      const payload = encrypted.payload;

      // Decode, tamper auth tag, re-encode
      const decoded = Buffer.from(payload.slice(3), 'base64');
      decoded[decoded.length - 1] = decoded[decoded.length - 1] ^ 0xff;
      const tampered = 'v2:' + decoded.toString('base64');

      expect(() => decrypt(tampered)).toThrow();
    });

    test('throws on tampered IV (first 12 bytes)', () => {
      const encrypted = encrypt('test-key');
      const payload = encrypted.payload;

      // Decode, tamper IV, re-encode
      const decoded = Buffer.from(payload.slice(3), 'base64');
      decoded[0] = decoded[0] ^ 0xff;
      const tampered = 'v2:' + decoded.toString('base64');

      expect(() => decrypt(tampered)).toThrow();
    });
  });

  describe('isV1Format', () => {
    test('returns true for data without v2: prefix', () => {
      const v1Data = Buffer.from('some-data').toString('base64');
      expect(isV1Format(v1Data)).toBe(true);
    });

    test('returns false for data with v2: prefix', () => {
      const v2Data = 'v2:' + Buffer.from('some-data').toString('base64');
      expect(isV1Format(v2Data)).toBe(false);
    });

    test('returns true for empty string', () => {
      expect(isV1Format('')).toBe(true);
    });

    test('returns false for actual v2 encrypted data', () => {
      const encrypted = encrypt('test');
      expect(isV1Format(encrypted.payload)).toBe(false);
    });
  });

  describe('decryptV1', () => {
    test('decrypts XOR-encrypted data correctly', () => {
      const original = 'ignis_test_key_123';
      const v1Encrypted = createV1EncryptedData(original);
      const decrypted = decryptV1(v1Encrypted);
      expect(decrypted).toBe(original);
    });

    test('decrypts another XOR-encrypted value', () => {
      const original = 'another_api_key_456';
      const v1Encrypted = createV1EncryptedData(original);
      const decrypted = decryptV1(v1Encrypted);
      expect(decrypted).toBe(original);
    });

    test('handles special characters in v1 format', () => {
      const original = 'key_with_special!@#$';
      const v1Encrypted = createV1EncryptedData(original);
      const decrypted = decryptV1(v1Encrypted);
      expect(decrypted).toBe(original);
    });

    test('handles malformed input without throwing', () => {
      // Buffer.from with base64 is lenient, so decryptV1 won't throw
      // It will return some decoded value (not useful, but won't crash)
      const invalidBase64 = '!!!not-valid-base64!!!';
      expect(() => decryptV1(invalidBase64)).not.toThrow();
    });
  });

  describe('migrateV1ToV2', () => {
    test('returns v2 format structure', () => {
      const original = 'test_api_key';
      const v1Encrypted = createV1EncryptedData(original);
      const migrated = migrateV1ToV2(v1Encrypted);

      expect(migrated.version).toBe(2);
      expect(migrated.payload.startsWith('v2:')).toBe(true);
    });

    test('preserves plaintext after migration', () => {
      const original = 'ignis_migration_test_key';
      const v1Encrypted = createV1EncryptedData(original);
      const migrated = migrateV1ToV2(v1Encrypted);
      const decrypted = decrypt(migrated.payload);

      expect(decrypted).toBe(original);
    });

    test('migrated data can be decrypted', () => {
      const original = 'complex_key_!@#$%^&*()';
      const v1Encrypted = createV1EncryptedData(original);
      const migrated = migrateV1ToV2(v1Encrypted);

      expect(() => decrypt(migrated.payload)).not.toThrow();
      expect(decrypt(migrated.payload)).toBe(original);
    });
  });

  describe('decryptWithMigration', () => {
    test('flags v1 data as needing migration', () => {
      const original = 'v1_test_key';
      const v1Encrypted = createV1EncryptedData(original);
      const result = decryptWithMigration(v1Encrypted);

      expect(result.needsMigration).toBe(true);
      expect(result.plaintext).toBe(original);
    });

    test('does not flag v2 data as needing migration', () => {
      const original = 'v2_test_key';
      const encrypted = encrypt(original);
      const result = decryptWithMigration(encrypted.payload);

      expect(result.needsMigration).toBe(false);
      expect(result.plaintext).toBe(original);
    });

    test('correctly decrypts v1 data', () => {
      const original = 'ignis_v1_api_key_xyz';
      const v1Encrypted = createV1EncryptedData(original);
      const result = decryptWithMigration(v1Encrypted);

      expect(result.plaintext).toBe(original);
    });

    test('correctly decrypts v2 data', () => {
      const original = 'ignis_v2_api_key_abc';
      const encrypted = encrypt(original);
      const result = decryptWithMigration(encrypted.payload);

      expect(result.plaintext).toBe(original);
    });

    test('handles empty string in v1 format', () => {
      const v1Encrypted = createV1EncryptedData('');
      const result = decryptWithMigration(v1Encrypted);

      expect(result.needsMigration).toBe(true);
      expect(result.plaintext).toBe('');
    });

    test('handles empty string in v2 format', () => {
      const encrypted = encrypt('');
      const result = decryptWithMigration(encrypted.payload);

      expect(result.needsMigration).toBe(false);
      expect(result.plaintext).toBe('');
    });
  });
});
