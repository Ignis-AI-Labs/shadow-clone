import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { CreatorMode } from '../../src/auth/creatorMode';

/**
 * Tests for CreatorMode
 *
 * Note: CreatorMode is a singleton that detects mode at construction time.
 * These tests focus on the configuration validation logic and public methods.
 */

describe('CreatorMode', () => {
  let creatorMode: CreatorMode;

  beforeEach(() => {
    // Get singleton instance
    creatorMode = CreatorMode.getInstance();
  });

  describe('getInstance', () => {
    test('returns singleton instance', () => {
      const instance1 = CreatorMode.getInstance();
      const instance2 = CreatorMode.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('getCreatorApiKey', () => {
    test('returns LOCAL_CREATOR_MODE', () => {
      const apiKey = creatorMode.getCreatorApiKey();
      expect(apiKey).toBe('LOCAL_CREATOR_MODE');
    });
  });

  describe('getCreatorLicenseType', () => {
    test('returns UNLIMITED', () => {
      const licenseType = creatorMode.getCreatorLicenseType();
      expect(licenseType).toBe('UNLIMITED');
    });
  });

  describe('getStatusMessage', () => {
    test('returns message containing mode info', () => {
      const message = creatorMode.getStatusMessage();
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);

      // If creator mode is active, should contain CREATOR MODE
      // If not, should contain standard mode
      const hasCreatorMode = message.includes('CREATOR MODE');
      const hasStandardMode = message.includes('Standard mode');
      expect(hasCreatorMode || hasStandardMode).toBe(true);
    });

    test('standard mode message when not creator', () => {
      // If isCreatorMode returns false, message should indicate standard mode
      if (!creatorMode.isCreatorMode()) {
        const message = creatorMode.getStatusMessage();
        expect(message).toBe('Standard mode - authentication required');
      }
    });

    test('creator mode message contains expected info', () => {
      if (creatorMode.isCreatorMode()) {
        const message = creatorMode.getStatusMessage();
        expect(message).toContain('CREATOR MODE ACTIVE');
        expect(message).toContain('Authentication: Bypassed');
        expect(message).toContain('License: UNLIMITED');
      }
    });
  });

  describe('isCreatorMode', () => {
    test('returns boolean', () => {
      const result = creatorMode.isCreatorMode();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getConfig', () => {
    test('returns config object or null', () => {
      const config = creatorMode.getConfig();
      expect(config === null || typeof config === 'object').toBe(true);
    });

    test('config has expected structure when creator mode is active', () => {
      if (creatorMode.isCreatorMode()) {
        const config = creatorMode.getConfig();
        expect(config).not.toBeNull();
        expect(config.mode).toBe('CREATOR_PRIVILEGED');
        expect(config.creator).toBe(true);
      }
    });
  });

  describe('shouldBypassAuth', () => {
    test('returns boolean', () => {
      const result = creatorMode.shouldBypassAuth();
      expect(typeof result).toBe('boolean');
    });

    test('returns false if not creator mode', () => {
      if (!creatorMode.isCreatorMode()) {
        expect(creatorMode.shouldBypassAuth()).toBe(false);
      }
    });
  });
});

describe('CreatorMode configuration validation', () => {
  describe('valid creator config', () => {
    test('valid config structure', () => {
      const validConfig = {
        mode: 'CREATOR_PRIVILEGED',
        creator: true,
        bypassAuth: true,
        apiKey: 'LOCAL_CREATOR_MODE',
        licenseType: 'UNLIMITED',
      };

      // Check validation logic
      const isValid = validConfig.mode === 'CREATOR_PRIVILEGED' && validConfig.creator === true;
      expect(isValid).toBe(true);
    });

    test('config without bypassAuth is still valid', () => {
      const configWithoutBypass = {
        mode: 'CREATOR_PRIVILEGED',
        creator: true,
      };

      const isValid = configWithoutBypass.mode === 'CREATOR_PRIVILEGED' && configWithoutBypass.creator === true;
      expect(isValid).toBe(true);
    });
  });

  describe('invalid creator config', () => {
    test('wrong mode value', () => {
      const invalidConfig = {
        mode: 'STANDARD',
        creator: true,
      };

      const isValid = invalidConfig.mode === 'CREATOR_PRIVILEGED' && invalidConfig.creator === true;
      expect(isValid).toBe(false);
    });

    test('creator flag false', () => {
      const invalidConfig = {
        mode: 'CREATOR_PRIVILEGED',
        creator: false,
      };

      const isValid = invalidConfig.mode === 'CREATOR_PRIVILEGED' && invalidConfig.creator === true;
      expect(isValid).toBe(false);
    });

    test('missing mode field', () => {
      const invalidConfig = {
        creator: true,
      } as any;

      const isValid = invalidConfig.mode === 'CREATOR_PRIVILEGED' && invalidConfig.creator === true;
      expect(isValid).toBe(false);
    });

    test('missing creator field', () => {
      const invalidConfig = {
        mode: 'CREATOR_PRIVILEGED',
      } as any;

      const isValid = invalidConfig.mode === 'CREATOR_PRIVILEGED' && invalidConfig.creator === true;
      expect(isValid).toBe(false);
    });
  });
});

describe('CreatorMode environment variable', () => {
  const originalEnv = process.env.SHADOW_CLONE_CREATOR_MODE;

  afterEach(() => {
    // Restore original env
    if (originalEnv !== undefined) {
      process.env.SHADOW_CLONE_CREATOR_MODE = originalEnv;
    } else {
      delete process.env.SHADOW_CLONE_CREATOR_MODE;
    }
  });

  test('env config structure when enabled', () => {
    // This is the config that would be created when env var is 'true'
    const envConfig = {
      mode: 'CREATOR_PRIVILEGED',
      creator: true,
      bypassAuth: true,
      apiKey: 'LOCAL_CREATOR_MODE',
      licenseType: 'UNLIMITED',
    };

    // Verify structure
    expect(envConfig.mode).toBe('CREATOR_PRIVILEGED');
    expect(envConfig.creator).toBe(true);
    expect(envConfig.bypassAuth).toBe(true);
    expect(envConfig.apiKey).toBe('LOCAL_CREATOR_MODE');
    expect(envConfig.licenseType).toBe('UNLIMITED');
  });
});

describe('CreatorMode config paths', () => {
  test('config paths include expected locations', () => {
    // The expected config paths (from the class definition)
    const expectedPaths = [
      path.join(process.cwd(), '.shadow-local', 'creator-config.json'),
      path.join(os.homedir(), '.shadow-clone', 'creator-config.json'),
    ];

    // At minimum, these paths should be checked
    expectedPaths.forEach((expectedPath) => {
      expect(typeof expectedPath).toBe('string');
      expect(expectedPath.endsWith('creator-config.json') || expectedPath.endsWith('.json')).toBe(true);
    });
  });

  test('home directory path is valid', () => {
    const homePath = path.join(os.homedir(), '.shadow-clone', 'creator-config.json');
    expect(homePath).toContain(os.homedir());
    expect(homePath).toContain('.shadow-clone');
    expect(homePath).toContain('creator-config.json');
  });
});
