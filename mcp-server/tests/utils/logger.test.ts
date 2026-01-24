import { describe, test, expect } from 'bun:test';

/**
 * Tests for logger sensitive data masking patterns
 *
 * These tests verify that the regex patterns in logger.ts correctly mask
 * sensitive data like API keys, authorization tokens, etc.
 *
 * Note: We test the patterns directly rather than through the logger
 * to avoid side effects and keep tests fast and isolated.
 */

// Copy of the sensitive patterns from logger.ts for testing
const sensitivePatterns = [
  // JSON API key patterns
  { pattern: /apiKey":\s*"[^"]+"/g, replacement: 'apiKey":"***"' },
  { pattern: /encryptedApiKey":\s*"[^"]+"/g, replacement: 'encryptedApiKey":"***"' },
  // Query string/env patterns
  { pattern: /api_key=\S+/g, replacement: 'api_key=***' },
  { pattern: /SHADOW_CLONE_API_KEY=\S+/g, replacement: 'SHADOW_CLONE_API_KEY=***' },
  // Header patterns
  { pattern: /authorization:\s*[^\s,}]+/gi, replacement: 'authorization: ***' },
  { pattern: /X-API-Key:\s*[^\s,}]+/gi, replacement: 'X-API-Key: ***' },
  // API key prefix patterns (ignis_ and sk-)
  { pattern: /ignis_[a-zA-Z0-9_-]+/g, replacement: 'ignis_***' },
  { pattern: /sk-[a-zA-Z0-9]+/g, replacement: 'sk-***' },
];

// Helper to apply masking (same logic as logger.ts)
function applyMasking(input: string): string {
  let result = input;
  sensitivePatterns.forEach(({ pattern, replacement }) => {
    // Reset lastIndex for global patterns
    pattern.lastIndex = 0;
    result = result.replace(pattern, replacement);
  });
  return result;
}

describe('Logger sensitive data masking', () => {
  describe('JSON apiKey pattern', () => {
    test('masks apiKey in JSON', () => {
      const input = '{"apiKey": "ignis_secret_key_123"}';
      const result = applyMasking(input);
      expect(result).toBe('{"apiKey":"***"}');
    });

    test('masks apiKey with different spacing', () => {
      const input = '{"apiKey":"no_space_key"}';
      const result = applyMasking(input);
      expect(result).toBe('{"apiKey":"***"}');
    });

    test('masks apiKey in larger JSON object', () => {
      const input = '{"userId": "123", "apiKey": "secret", "status": "active"}';
      const result = applyMasking(input);
      expect(result).toContain('apiKey":"***"');
      expect(result).toContain('"userId": "123"');
      expect(result).toContain('"status": "active"');
    });
  });

  describe('JSON encryptedApiKey pattern', () => {
    test('masks encryptedApiKey in JSON', () => {
      const input = '{"encryptedApiKey": "v2:abc123xyz"}';
      const result = applyMasking(input);
      expect(result).toBe('{"encryptedApiKey":"***"}');
    });

    test('masks encryptedApiKey without space', () => {
      const input = '{"encryptedApiKey":"v2:encrypted_data"}';
      const result = applyMasking(input);
      expect(result).toBe('{"encryptedApiKey":"***"}');
    });
  });

  describe('api_key query string pattern', () => {
    test('masks api_key in query string (greedy match)', () => {
      // Note: Pattern uses \S+ which matches until whitespace
      const input = 'url?api_key=secret123&other=value';
      const result = applyMasking(input);
      // The pattern eats everything until whitespace
      expect(result).toBe('url?api_key=***');
    });

    test('masks api_key at end of string', () => {
      const input = 'api_key=my_secret_key';
      const result = applyMasking(input);
      expect(result).toBe('api_key=***');
    });

    test('masks api_key followed by space', () => {
      const input = 'api_key=secret123 other=value';
      const result = applyMasking(input);
      expect(result).toBe('api_key=*** other=value');
    });
  });

  describe('SHADOW_CLONE_API_KEY env pattern', () => {
    test('masks SHADOW_CLONE_API_KEY', () => {
      const input = 'SHADOW_CLONE_API_KEY=ignis_prod_key_xyz';
      const result = applyMasking(input);
      expect(result).toBe('SHADOW_CLONE_API_KEY=***');
    });

    test('masks in log message context', () => {
      const input = 'Environment variable set: SHADOW_CLONE_API_KEY=secret123';
      const result = applyMasking(input);
      expect(result).toBe('Environment variable set: SHADOW_CLONE_API_KEY=***');
    });
  });

  describe('authorization header pattern', () => {
    test('masks authorization header first word only', () => {
      // Note: Pattern [^\s,}]+ only matches first word after colon
      const input = 'authorization: Bearer token123';
      const result = applyMasking(input);
      // Only "Bearer" is matched, "token123" remains
      expect(result).toBe('authorization: *** token123');
    });

    test('masks single token authorization', () => {
      const input = 'authorization: token123';
      const result = applyMasking(input);
      expect(result).toBe('authorization: ***');
    });

    test('case insensitive matching', () => {
      const input = 'Authorization: secret';
      const result = applyMasking(input);
      expect(result).toBe('authorization: ***');
    });

    test('does not mask JSON string authorization (no colon-space pattern)', () => {
      // JSON format "authorization": "value" doesn't match the header pattern
      const input = '{"headers": {"authorization": "Bearer xyz"}}';
      const result = applyMasking(input);
      // The pattern expects colon-space, not colon-quote
      expect(result).toBe('{"headers": {"authorization": "Bearer xyz"}}');
    });
  });

  describe('X-API-Key header pattern', () => {
    test('masks X-API-Key header', () => {
      const input = 'X-API-Key: ignis_my_api_key';
      const result = applyMasking(input);
      expect(result).toBe('X-API-Key: ***');
    });

    test('masks x-api-key header (lowercase)', () => {
      const input = 'x-api-key: secret_key_value';
      const result = applyMasking(input);
      expect(result).toBe('X-API-Key: ***');
    });

    test('masks in request headers context', () => {
      const input = 'Headers: { X-API-Key: my_secret, Content-Type: application/json }';
      const result = applyMasking(input);
      expect(result).toContain('X-API-Key: ***');
      expect(result).toContain('Content-Type: application/json');
    });
  });

  describe('ignis_ prefix pattern', () => {
    test('masks ignis_ prefixed keys', () => {
      const input = 'API key: ignis_abc123xyz';
      const result = applyMasking(input);
      expect(result).toBe('API key: ignis_***');
    });

    test('masks ignis_ with underscores and hyphens', () => {
      const input = 'key: ignis_test-key_123-abc';
      const result = applyMasking(input);
      expect(result).toBe('key: ignis_***');
    });

    test('masks multiple ignis_ keys', () => {
      const input = 'keys: ignis_key1, ignis_key2';
      const result = applyMasking(input);
      expect(result).toBe('keys: ignis_***, ignis_***');
    });

    test('does not mask partial match without prefix', () => {
      const input = 'ligniskey';
      const result = applyMasking(input);
      expect(result).toBe('ligniskey');
    });
  });

  describe('sk- prefix pattern (OpenAI style)', () => {
    test('masks sk- prefixed keys', () => {
      const input = 'OpenAI key: sk-abc123xyz';
      const result = applyMasking(input);
      expect(result).toBe('OpenAI key: sk-***');
    });

    test('masks sk- until non-alphanumeric (hyphen stops match)', () => {
      // Pattern [a-zA-Z0-9]+ doesn't include hyphen
      const input = 'sk-proj-abcdefghijklmnop';
      const result = applyMasking(input);
      // Only "proj" is matched, "-abcdefghijklmnop" remains
      expect(result).toBe('sk-***-abcdefghijklmnop');
    });

    test('masks sk- at word boundary', () => {
      // Note: Pattern matches 'sk-' anywhere, including in 'ask-'
      // This is a known limitation of the current pattern
      const input = 'ask-question';
      const result = applyMasking(input);
      // The 'sk-' in 'ask-question' matches
      expect(result).toBe('ask-***');
    });

    test('masks full sk- key without hyphens', () => {
      const input = 'sk-abcdefghijklmnop123456789';
      const result = applyMasking(input);
      expect(result).toBe('sk-***');
    });
  });

  describe('combined patterns', () => {
    test('masks apiKey and env variable patterns', () => {
      const input = JSON.stringify({
        apiKey: 'ignis_secret_key',
        env: 'SHADOW_CLONE_API_KEY=env_secret',
      });
      const result = applyMasking(input);

      expect(result).toContain('apiKey":"***"');
      expect(result).toContain('SHADOW_CLONE_API_KEY=***');
      expect(result).not.toContain('env_secret');
    });

    test('masks ignis_ keys in values', () => {
      const input = JSON.stringify({
        key: 'ignis_test_key_123',
        anotherKey: 'ignis_another_key',
      });
      const result = applyMasking(input);

      expect(result).toContain('ignis_***');
      expect(result).not.toContain('test_key_123');
      expect(result).not.toContain('another_key');
    });

    test('preserves non-sensitive data', () => {
      const input = JSON.stringify({
        userId: '12345',
        status: 'active',
        apiKey: 'secret',
        timestamp: '2024-01-01',
      });
      const result = applyMasking(input);

      expect(result).toContain('"userId":"12345"');
      expect(result).toContain('"status":"active"');
      expect(result).toContain('"timestamp":"2024-01-01"');
      expect(result).toContain('apiKey":"***"');
    });
  });

  describe('edge cases', () => {
    test('handles empty string', () => {
      const input = '';
      const result = applyMasking(input);
      expect(result).toBe('');
    });

    test('handles string with no sensitive data', () => {
      const input = 'This is a normal log message with no secrets';
      const result = applyMasking(input);
      expect(result).toBe('This is a normal log message with no secrets');
    });

    test('handles nested JSON', () => {
      const input = '{"outer": {"inner": {"apiKey": "nested_secret"}}}';
      const result = applyMasking(input);
      expect(result).toContain('apiKey":"***"');
      expect(result).not.toContain('nested_secret');
    });
  });
});
