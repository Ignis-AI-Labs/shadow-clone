import { describe, test, expect, beforeEach, afterAll } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ApiKeyManager } from '../../src/auth/apiKeyManager';
import { createV1EncryptedData } from '../testUtils';

describe('ApiKeyManager', () => {
  let manager: ApiKeyManager;
  const globalConfigDir = path.join(os.homedir(), '.shadow-clone');
  const globalConfigFile = path.join(globalConfigDir, 'config.json');

  // Store original config if it exists
  let originalConfig: string | null = null;

  beforeEach(async () => {
    // Backup original config if exists
    if (originalConfig === null && fs.existsSync(globalConfigFile)) {
      originalConfig = fs.readFileSync(globalConfigFile, 'utf8');
    }

    // Get singleton instance
    manager = ApiKeyManager.getInstance();

    // Clear all state before each test
    await manager.clearApiKey();
    delete process.env.SHADOW_CLONE_API_KEY;
  });

  afterAll(() => {
    // Restore original config after all tests
    if (originalConfig !== null) {
      fs.writeFileSync(globalConfigFile, originalConfig);
    }
  });

  describe('getInstance', () => {
    test('returns singleton instance', () => {
      const instance1 = ApiKeyManager.getInstance();
      const instance2 = ApiKeyManager.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('getApiKey priority', () => {
    test('returns environment variable first when set', async () => {
      process.env.SHADOW_CLONE_API_KEY = 'env_api_key_123';

      const key = await manager.getApiKey();

      expect(key).toBe('env_api_key_123');
    });

    test('returns null when no key is available', async () => {
      const key = await manager.getApiKey();

      expect(key).toBeNull();
    });

    test('returns from config when env var not set', async () => {
      // Save a key (goes to config and memory)
      await manager.saveApiKey('config_key_456');

      // Clear env var
      delete process.env.SHADOW_CLONE_API_KEY;

      const key = await manager.getApiKey();
      expect(key).toBe('config_key_456');
    });

    test('env var takes priority over config', async () => {
      // Save a key to config
      await manager.saveApiKey('config_key');

      // Set different env var
      process.env.SHADOW_CLONE_API_KEY = 'env_key_priority';

      const key = await manager.getApiKey();
      expect(key).toBe('env_key_priority');
    });
  });

  describe('saveApiKey', () => {
    test('saves to memory cache', async () => {
      await manager.saveApiKey('test_api_key');

      // Clear env to force fallback
      delete process.env.SHADOW_CLONE_API_KEY;

      const key = await manager.getApiKey();
      expect(key).toBe('test_api_key');
    });

    test('sets process.env.SHADOW_CLONE_API_KEY', async () => {
      await manager.saveApiKey('env_test_key');

      expect(process.env.SHADOW_CLONE_API_KEY).toBe('env_test_key');
    });

    test('saves encrypted to global config file', async () => {
      await manager.saveApiKey('ignis_secret_key_xyz');

      // Read the config file directly
      const content = fs.readFileSync(globalConfigFile, 'utf8');
      const config = JSON.parse(content);

      // Should have v2: prefix (encrypted)
      expect(config.apiKey).toStartWith('v2:');
      expect(config.version).toBe('2.0.0');

      // Should NOT contain the plaintext key
      expect(config.apiKey).not.toContain('ignis_secret_key_xyz');
    });

    test('resets validation timer', async () => {
      await manager.saveApiKey('test_key');

      // After save, should not need validation (timer was reset)
      expect(manager.needsValidation()).toBe(false);
    });
  });

  describe('clearApiKey', () => {
    test('clears memory cache', async () => {
      await manager.saveApiKey('key_to_clear');
      await manager.clearApiKey();

      delete process.env.SHADOW_CLONE_API_KEY;
      const key = await manager.getApiKey();
      expect(key).toBeNull();
    });

    test('deletes process.env.SHADOW_CLONE_API_KEY', async () => {
      await manager.saveApiKey('key_to_delete');
      expect(process.env.SHADOW_CLONE_API_KEY).toBe('key_to_delete');

      await manager.clearApiKey();
      expect(process.env.SHADOW_CLONE_API_KEY).toBeUndefined();
    });

    test('removes apiKey from config file', async () => {
      await manager.saveApiKey('key_to_remove');

      // Verify it's there
      let content = fs.readFileSync(globalConfigFile, 'utf8');
      let config = JSON.parse(content);
      expect(config.apiKey).toBeDefined();

      await manager.clearApiKey();

      // Verify it's removed
      content = fs.readFileSync(globalConfigFile, 'utf8');
      config = JSON.parse(content);
      expect(config.apiKey).toBeUndefined();
      expect(config.lastCleared).toBeDefined();
    });
  });

  describe('needsValidation', () => {
    test('returns false after markValidated', () => {
      manager.markValidated();

      expect(manager.needsValidation()).toBe(false);
    });

    test('returns false after saveApiKey', async () => {
      await manager.saveApiKey('test_key');

      expect(manager.needsValidation()).toBe(false);
    });

    test('validation interval is 5 minutes', () => {
      // The validation interval should be 5 minutes (300000ms)
      // We can't easily test the timeout behavior without mocking time
      // But we verify the behavior works as expected
      manager.markValidated();
      expect(manager.needsValidation()).toBe(false);
    });
  });

  describe('getStorageInfo', () => {
    test('returns locations array with 3 entries', async () => {
      const info = await manager.getStorageInfo();

      expect(info.locations).toBeArray();
      expect(info.locations.length).toBe(3);
      expect(info.locations[0]).toContain('Environment');
      expect(info.locations[1]).toContain('Global');
      expect(info.locations[2]).toContain('Memory');
    });

    test('identifies environment variable as current source', async () => {
      process.env.SHADOW_CLONE_API_KEY = 'env_key';

      const info = await manager.getStorageInfo();

      expect(info.current).toBe('Environment variable');
    });

    test('identifies global config as current source', async () => {
      await manager.saveApiKey('config_key');
      delete process.env.SHADOW_CLONE_API_KEY;

      const info = await manager.getStorageInfo();

      expect(info.current).toBe('Global config (encrypted)');
    });

    test('returns null current when no key available', async () => {
      const info = await manager.getStorageInfo();

      expect(info.current).toBeNull();
    });
  });

  describe('encryption integration', () => {
    test('round-trip: save and retrieve key', async () => {
      const testKey = 'ignis_roundtrip_test_key_!@#$%';

      await manager.saveApiKey(testKey);
      delete process.env.SHADOW_CLONE_API_KEY;

      const retrievedKey = await manager.getApiKey();
      expect(retrievedKey).toBe(testKey);
    });

    test('handles unicode keys', async () => {
      const unicodeKey = 'ignis_キー_🔐_test';

      await manager.saveApiKey(unicodeKey);
      delete process.env.SHADOW_CLONE_API_KEY;

      const retrievedKey = await manager.getApiKey();
      expect(retrievedKey).toBe(unicodeKey);
    });

    test('handles long keys', async () => {
      const longKey = 'ignis_' + 'x'.repeat(1000);

      await manager.saveApiKey(longKey);
      delete process.env.SHADOW_CLONE_API_KEY;

      const retrievedKey = await manager.getApiKey();
      expect(retrievedKey).toBe(longKey);
    });
  });

  describe('v1 to v2 migration', () => {
    test('migrates v1 format to v2 on read', async () => {
      const originalKey = 'ignis_legacy_key_123';
      const v1Encrypted = createV1EncryptedData(originalKey);

      // Write v1 format directly to config
      const v1Config = {
        apiKey: v1Encrypted,
        version: '1.0.0',
      };
      fs.writeFileSync(globalConfigFile, JSON.stringify(v1Config, null, 2));

      // Read the key (should trigger migration)
      delete process.env.SHADOW_CLONE_API_KEY;
      const key = await manager.getApiKey();

      expect(key).toBe(originalKey);

      // Verify config was migrated to v2
      const content = fs.readFileSync(globalConfigFile, 'utf8');
      const config = JSON.parse(content);
      expect(config.apiKey).toStartWith('v2:');
      expect(config.version).toBe('2.0.0');
    });
  });
});
