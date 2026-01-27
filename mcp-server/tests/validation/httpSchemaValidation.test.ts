import { describe, test, expect } from 'bun:test';
import {
  ethereumAddress,
  erc712RegenerateMessageSchema,
  erc712RevokeMessageSchema,
  regenerateRequestSchema,
  logoutGetKeyRequestSchema,
  logoutLocalRequestSchema,
  logoutRevokeRequestSchema,
  pasteKeyRequestSchema
} from '../../src/schemas/httpSchemas';
import { validateHttpRequest, validateDeadline } from '../../src/utils/httpValidation';

describe('HTTP Schema Validation', () => {
  // Valid test data
  const validAddress = '0x1234567890123456789012345678901234567890';
  const futureDeadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
  const pastDeadline = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago

  describe('ethereumAddress validator', () => {
    test('accepts valid Ethereum address', () => {
      const result = ethereumAddress.safeParse(validAddress);
      expect(result.success).toBe(true);
    });

    test('accepts lowercase address', () => {
      const result = ethereumAddress.safeParse('0xabcdef1234567890abcdef1234567890abcdef12');
      expect(result.success).toBe(true);
    });

    test('accepts uppercase address', () => {
      const result = ethereumAddress.safeParse('0xABCDEF1234567890ABCDEF1234567890ABCDEF12');
      expect(result.success).toBe(true);
    });

    test('accepts mixed case address', () => {
      const result = ethereumAddress.safeParse('0xAbCdEf1234567890AbCdEf1234567890AbCdEf12');
      expect(result.success).toBe(true);
    });

    test('rejects address without 0x prefix', () => {
      const result = ethereumAddress.safeParse('1234567890123456789012345678901234567890');
      expect(result.success).toBe(false);
    });

    test('rejects address with wrong length (too short)', () => {
      const result = ethereumAddress.safeParse('0x123456789012345678901234567890123456789');
      expect(result.success).toBe(false);
    });

    test('rejects address with wrong length (too long)', () => {
      const result = ethereumAddress.safeParse('0x12345678901234567890123456789012345678901');
      expect(result.success).toBe(false);
    });

    test('rejects address with invalid characters', () => {
      const result = ethereumAddress.safeParse('0xGHIJKL7890123456789012345678901234567890');
      expect(result.success).toBe(false);
    });

    test('rejects empty string', () => {
      const result = ethereumAddress.safeParse('');
      expect(result.success).toBe(false);
    });
  });

  describe('erc712RegenerateMessageSchema', () => {
    test('accepts valid regenerate message', () => {
      const result = erc712RegenerateMessageSchema.safeParse({
        wallet: validAddress,
        nonce: 'abc123',
        deadline: futureDeadline,
        action: 'regenerate'
      });
      expect(result.success).toBe(true);
    });

    test('rejects invalid wallet address', () => {
      const result = erc712RegenerateMessageSchema.safeParse({
        wallet: 'invalid',
        nonce: 'abc123',
        deadline: futureDeadline,
        action: 'regenerate'
      });
      expect(result.success).toBe(false);
    });

    test('rejects empty nonce', () => {
      const result = erc712RegenerateMessageSchema.safeParse({
        wallet: validAddress,
        nonce: '',
        deadline: futureDeadline,
        action: 'regenerate'
      });
      expect(result.success).toBe(false);
    });

    test('rejects wrong action (revoke instead of regenerate)', () => {
      const result = erc712RegenerateMessageSchema.safeParse({
        wallet: validAddress,
        nonce: 'abc123',
        deadline: futureDeadline,
        action: 'revoke'
      });
      expect(result.success).toBe(false);
    });

    test('rejects missing action', () => {
      const result = erc712RegenerateMessageSchema.safeParse({
        wallet: validAddress,
        nonce: 'abc123',
        deadline: futureDeadline
      });
      expect(result.success).toBe(false);
    });

    test('rejects negative deadline', () => {
      const result = erc712RegenerateMessageSchema.safeParse({
        wallet: validAddress,
        nonce: 'abc123',
        deadline: -1,
        action: 'regenerate'
      });
      expect(result.success).toBe(false);
    });

    test('rejects non-integer deadline', () => {
      const result = erc712RegenerateMessageSchema.safeParse({
        wallet: validAddress,
        nonce: 'abc123',
        deadline: 123.456,
        action: 'regenerate'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('erc712RevokeMessageSchema', () => {
    test('accepts valid revoke message', () => {
      const result = erc712RevokeMessageSchema.safeParse({
        wallet: validAddress,
        nonce: 'abc123',
        deadline: futureDeadline,
        action: 'revoke'
      });
      expect(result.success).toBe(true);
    });

    test('rejects wrong action (regenerate instead of revoke)', () => {
      const result = erc712RevokeMessageSchema.safeParse({
        wallet: validAddress,
        nonce: 'abc123',
        deadline: futureDeadline,
        action: 'regenerate'
      });
      expect(result.success).toBe(false);
    });

    test('rejects invalid wallet address', () => {
      const result = erc712RevokeMessageSchema.safeParse({
        wallet: 'not-an-address',
        nonce: 'abc123',
        deadline: futureDeadline,
        action: 'revoke'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('regenerateRequestSchema', () => {
    test('accepts valid regenerate request', () => {
      const result = regenerateRequestSchema.safeParse({
        message: {
          wallet: validAddress,
          nonce: 'abc123',
          deadline: futureDeadline,
          action: 'regenerate'
        },
        signature: '0xsignature123',
        csrf_token: 'token123'
      });
      expect(result.success).toBe(true);
    });

    test('rejects missing signature', () => {
      const result = regenerateRequestSchema.safeParse({
        message: {
          wallet: validAddress,
          nonce: 'abc123',
          deadline: futureDeadline,
          action: 'regenerate'
        },
        csrf_token: 'token123'
      });
      expect(result.success).toBe(false);
    });

    test('rejects empty signature', () => {
      const result = regenerateRequestSchema.safeParse({
        message: {
          wallet: validAddress,
          nonce: 'abc123',
          deadline: futureDeadline,
          action: 'regenerate'
        },
        signature: '',
        csrf_token: 'token123'
      });
      expect(result.success).toBe(false);
    });

    test('rejects missing csrf_token', () => {
      const result = regenerateRequestSchema.safeParse({
        message: {
          wallet: validAddress,
          nonce: 'abc123',
          deadline: futureDeadline,
          action: 'regenerate'
        },
        signature: '0xsignature123'
      });
      expect(result.success).toBe(false);
    });

    test('rejects invalid message', () => {
      const result = regenerateRequestSchema.safeParse({
        message: {
          wallet: 'invalid',
          nonce: 'abc123',
          deadline: futureDeadline,
          action: 'regenerate'
        },
        signature: '0xsignature123',
        csrf_token: 'token123'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('logoutGetKeyRequestSchema', () => {
    test('accepts valid request', () => {
      const result = logoutGetKeyRequestSchema.safeParse({
        csrf_token: 'valid-token'
      });
      expect(result.success).toBe(true);
    });

    test('rejects missing csrf_token', () => {
      const result = logoutGetKeyRequestSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    test('rejects empty csrf_token', () => {
      const result = logoutGetKeyRequestSchema.safeParse({
        csrf_token: ''
      });
      expect(result.success).toBe(false);
    });
  });

  describe('logoutLocalRequestSchema', () => {
    test('accepts valid request', () => {
      const result = logoutLocalRequestSchema.safeParse({
        csrf_token: 'valid-token'
      });
      expect(result.success).toBe(true);
    });

    test('rejects missing csrf_token', () => {
      const result = logoutLocalRequestSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('logoutRevokeRequestSchema', () => {
    test('accepts valid revoke request', () => {
      const result = logoutRevokeRequestSchema.safeParse({
        message: {
          wallet: validAddress,
          nonce: 'abc123',
          deadline: futureDeadline,
          action: 'revoke'
        },
        signature: '0xsignature123',
        csrf_token: 'token123'
      });
      expect(result.success).toBe(true);
    });

    test('rejects missing message', () => {
      const result = logoutRevokeRequestSchema.safeParse({
        signature: '0xsignature123',
        csrf_token: 'token123'
      });
      expect(result.success).toBe(false);
    });

    test('rejects wrong action in message', () => {
      const result = logoutRevokeRequestSchema.safeParse({
        message: {
          wallet: validAddress,
          nonce: 'abc123',
          deadline: futureDeadline,
          action: 'regenerate' // Should be 'revoke'
        },
        signature: '0xsignature123',
        csrf_token: 'token123'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('pasteKeyRequestSchema', () => {
    test('accepts valid paste key request', () => {
      const result = pasteKeyRequestSchema.safeParse({
        apiKey: 'sk_test_1234567890',
        csrf_token: 'token123'
      });
      expect(result.success).toBe(true);
    });

    test('accepts paste key request with wallet address', () => {
      const result = pasteKeyRequestSchema.safeParse({
        apiKey: 'sk_test_1234567890',
        csrf_token: 'token123',
        walletAddress: validAddress
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.walletAddress).toBe(validAddress);
      }
    });

    test('rejects API key too short', () => {
      const result = pasteKeyRequestSchema.safeParse({
        apiKey: 'short',
        csrf_token: 'token123'
      });
      expect(result.success).toBe(false);
    });

    test('rejects empty API key', () => {
      const result = pasteKeyRequestSchema.safeParse({
        apiKey: '',
        csrf_token: 'token123'
      });
      expect(result.success).toBe(false);
    });

    test('rejects missing API key', () => {
      const result = pasteKeyRequestSchema.safeParse({
        csrf_token: 'token123'
      });
      expect(result.success).toBe(false);
    });

    test('rejects invalid wallet address', () => {
      const result = pasteKeyRequestSchema.safeParse({
        apiKey: 'sk_test_1234567890',
        csrf_token: 'token123',
        walletAddress: 'not-an-address'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('validateDeadline utility', () => {
    test('accepts future deadline', () => {
      const future = Math.floor(Date.now() / 1000) + 3600;
      expect(validateDeadline(future)).toBe(true);
    });

    test('accepts current time as deadline', () => {
      const now = Math.floor(Date.now() / 1000);
      expect(validateDeadline(now)).toBe(true);
    });

    test('rejects past deadline', () => {
      const past = Math.floor(Date.now() / 1000) - 3600;
      expect(validateDeadline(past)).toBe(false);
    });

    test('rejects deadline 1 second in the past', () => {
      const past = Math.floor(Date.now() / 1000) - 1;
      expect(validateDeadline(past)).toBe(false);
    });
  });

  describe('validateHttpRequest utility', () => {
    test('returns success with valid data', () => {
      const result = validateHttpRequest(logoutGetKeyRequestSchema, {
        csrf_token: 'valid-token'
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ csrf_token: 'valid-token' });
      expect(result.error).toBeUndefined();
    });

    test('returns error for invalid data', () => {
      const result = validateHttpRequest(logoutGetKeyRequestSchema, {});
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.data).toBeUndefined();
    });

    test('validates CSRF token when expectedCsrfToken provided', () => {
      const result = validateHttpRequest(
        logoutGetKeyRequestSchema,
        { csrf_token: 'valid-token' },
        'valid-token'
      );
      expect(result.success).toBe(true);
    });

    test('fails when CSRF token does not match expected', () => {
      const result = validateHttpRequest(
        logoutGetKeyRequestSchema,
        { csrf_token: 'wrong-token' },
        'expected-token'
      );
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid request');
    });

    test('provides path in error messages', () => {
      const result = validateHttpRequest(regenerateRequestSchema, {
        message: {
          wallet: 'invalid',
          nonce: 'abc',
          deadline: futureDeadline,
          action: 'regenerate'
        },
        signature: 'sig',
        csrf_token: 'token'
      });
      expect(result.success).toBe(false);
      expect(result.error).toContain('message.wallet');
    });

    test('handles multiple validation errors', () => {
      const result = validateHttpRequest(regenerateRequestSchema, {
        message: {
          wallet: 'invalid',
          nonce: '',
          deadline: -1,
          action: 'wrong'
        },
        signature: '',
        csrf_token: ''
      });
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      // Should contain multiple error paths
      expect(result.error!.split(';').length).toBeGreaterThan(1);
    });

    test('handles non-object input gracefully', () => {
      const result = validateHttpRequest(logoutGetKeyRequestSchema, 'not-an-object');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('handles null input gracefully', () => {
      const result = validateHttpRequest(logoutGetKeyRequestSchema, null);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('handles undefined input gracefully', () => {
      const result = validateHttpRequest(logoutGetKeyRequestSchema, undefined);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Type inference', () => {
    test('infers correct types from schemas', () => {
      const validRegenMessage = {
        wallet: validAddress,
        nonce: 'test',
        deadline: futureDeadline,
        action: 'regenerate' as const
      };

      const parseResult = erc712RegenerateMessageSchema.safeParse(validRegenMessage);
      if (parseResult.success) {
        // TypeScript should infer these types correctly
        const data = parseResult.data;
        expect(typeof data.wallet).toBe('string');
        expect(typeof data.nonce).toBe('string');
        expect(typeof data.deadline).toBe('number');
        expect(data.action).toBe('regenerate');
      }
    });
  });
});
