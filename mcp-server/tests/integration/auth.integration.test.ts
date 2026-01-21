import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ApiKeyManager } from '../../src/auth/apiKeyManager';
import { AuthService } from '../../src/auth/authService';

/**
 * Integration tests for authentication with real backend
 *
 * These tests require a valid API key set via environment variable:
 *   TEST_API_KEY=your_api_key bun test tests/integration/
 *
 * Tests are skipped if TEST_API_KEY is not set.
 */

const TEST_API_KEY = process.env.TEST_API_KEY;
const globalConfigDir = path.join(os.homedir(), '.shadow-clone');
const globalConfigFile = path.join(globalConfigDir, 'config.json');
const authFilePath = path.join(globalConfigDir, 'mcp-auth.json');

// Backup storage for original files
let originalConfigFile: string | null = null;
let originalAuthFile: string | null = null;

describe.skipIf(!TEST_API_KEY)('Authentication Integration Tests', () => {
  let apiKeyManager: ApiKeyManager;
  let authService: AuthService;

  beforeAll(async () => {
    // Backup existing config files
    if (fs.existsSync(globalConfigFile)) {
      originalConfigFile = fs.readFileSync(globalConfigFile, 'utf8');
    }
    if (fs.existsSync(authFilePath)) {
      originalAuthFile = fs.readFileSync(authFilePath, 'utf8');
    }

    // Clear existing state
    apiKeyManager = ApiKeyManager.getInstance();
    await apiKeyManager.clearApiKey();
    delete process.env.SHADOW_CLONE_API_KEY;
  });

  afterAll(async () => {
    // Restore original config files
    if (originalConfigFile !== null) {
      fs.writeFileSync(globalConfigFile, originalConfigFile);
    }
    if (originalAuthFile !== null) {
      fs.writeFileSync(authFilePath, originalAuthFile);
    }

    // Clean up env
    delete process.env.SHADOW_CLONE_API_KEY;
  });

  describe('authenticate() with real backend', () => {
    test('successfully authenticates with valid API key', async () => {
      authService = new AuthService();

      const result = await authService.authenticate(TEST_API_KEY!);

      expect(result.success).toBe(true);
      expect(result.licenseType).toBeDefined();
      console.log(`  ✓ License type: ${result.licenseType}`);
    });

    test('returns error for invalid API key', async () => {
      authService = new AuthService();

      const result = await authService.authenticate('ignis_invalid_fake_key_12345');

      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
      console.log(`  ✓ Error message: ${result.message}`);
    });
  });

  describe('encrypted storage after authentication', () => {
    test('config.json and mcp-auth.json have identical encrypted API key', async () => {
      authService = new AuthService();
      await authService.authenticate(TEST_API_KEY!);

      const configContent = fs.readFileSync(globalConfigFile, 'utf8');
      const authContent = fs.readFileSync(authFilePath, 'utf8');

      const config = JSON.parse(configContent);
      const auth = JSON.parse(authContent);

      // Both files should have the exact same encrypted value
      expect(config.apiKey).toBe(auth.encryptedApiKey);
      console.log('  ✓ Both files have identical encrypted value');
    });

    test('config.json contains v2 encrypted API key', async () => {
      // Authenticate first
      authService = new AuthService();
      await authService.authenticate(TEST_API_KEY!);

      // Check config file
      expect(fs.existsSync(globalConfigFile)).toBe(true);

      const content = fs.readFileSync(globalConfigFile, 'utf8');
      const config = JSON.parse(content);

      // Should have v2 encrypted format
      expect(config.apiKey).toStartWith('v2:');
      expect(config.version).toBe('2.0.0');

      // Should NOT contain plaintext key
      expect(config.apiKey).not.toContain(TEST_API_KEY);
      expect(content).not.toContain(TEST_API_KEY);

      console.log(`  ✓ config.json has encrypted key: ${config.apiKey.substring(0, 30)}...`);
    });

    test('mcp-auth.json contains encryptedApiKey field', async () => {
      // Check auth file
      expect(fs.existsSync(authFilePath)).toBe(true);

      const content = fs.readFileSync(authFilePath, 'utf8');
      const authData = JSON.parse(content);

      // Should have encryptedApiKey (v2 format), not plain apiKey
      expect(authData.encryptedApiKey).toBeDefined();
      expect(authData.encryptedApiKey).toStartWith('v2:');
      expect(authData.apiKey).toBeUndefined();

      // Should have other auth fields
      expect(authData.userId).toBeDefined();
      expect(authData.licenseType).toBeDefined();
      expect(authData.lastVerified).toBeDefined();

      // Should NOT contain plaintext key
      expect(content).not.toContain(TEST_API_KEY);

      console.log(`  ✓ mcp-auth.json has encryptedApiKey: ${authData.encryptedApiKey.substring(0, 30)}...`);
      console.log(`  ✓ License type: ${authData.licenseType}`);
    });
  });

  describe('session persistence', () => {
    test('API key persists in encrypted config after authentication', async () => {
      // Re-authenticate to ensure we have a key stored
      authService = new AuthService();
      await authService.authenticate(TEST_API_KEY!);

      // Clear only the env var (not the config file)
      delete process.env.SHADOW_CLONE_API_KEY;

      // Get key - should come from encrypted config file
      const retrievedKey = await apiKeyManager.getApiKey();

      expect(retrievedKey).toBe(TEST_API_KEY);
      console.log('  ✓ Successfully retrieved key from encrypted storage');
    });

    test('isAuthenticated() returns true after reload', async () => {
      // Ensure we're authenticated first
      authService = new AuthService();
      await authService.authenticate(TEST_API_KEY!);

      // Create fresh AuthService instance (simulates restart)
      const freshAuthService = new AuthService();

      // Clear env var to ensure it reads from file
      delete process.env.SHADOW_CLONE_API_KEY;

      // Should still be authenticated
      const isAuth = await freshAuthService.isAuthenticated();

      expect(isAuth).toBe(true);
      console.log('  ✓ Still authenticated after simulated restart');
    });
  });

  describe('NFT ownership verification', () => {
    test('getApiKey() returns the correct key', async () => {
      authService = new AuthService();
      const key = await authService.getApiKey();

      expect(key).toBe(TEST_API_KEY);
    });

    test('getLicenseType() returns valid license type', async () => {
      authService = new AuthService();
      const licenseType = await authService.getLicenseType();

      expect(licenseType).toBeDefined();
      expect(typeof licenseType).toBe('string');
      console.log(`  ✓ License type: ${licenseType}`);
    });

    test('getWalletAddress() returns wallet address', async () => {
      authService = new AuthService();
      const wallet = await authService.getWalletAddress();

      // Wallet may or may not be set depending on license
      if (wallet) {
        expect(typeof wallet).toBe('string');
        console.log(`  ✓ Wallet address: ${wallet}`);
      } else {
        console.log('  ℹ No wallet address associated');
      }
    });
  });

  describe('round-trip encryption', () => {
    test('full cycle: authenticate → verify encrypted → clear env → verify retrieval', async () => {
      // Step 1: Authenticate (saves encrypted to both files)
      authService = new AuthService();
      const authResult = await authService.authenticate(TEST_API_KEY!);
      expect(authResult.success).toBe(true);

      // Step 2: Verify files are encrypted (not plaintext)
      const configContent = fs.readFileSync(globalConfigFile, 'utf8');
      expect(configContent).not.toContain(TEST_API_KEY);
      expect(configContent).toContain('v2:');

      const authContent = fs.readFileSync(authFilePath, 'utf8');
      expect(authContent).not.toContain(TEST_API_KEY);
      expect(authContent).toContain('v2:');

      // Step 3: Clear only env var (simulates restart without full clear)
      delete process.env.SHADOW_CLONE_API_KEY;

      // Step 4: Verify we can retrieve from encrypted config
      const retrievedKey = await apiKeyManager.getApiKey();
      expect(retrievedKey).toBe(TEST_API_KEY);

      console.log('  ✓ Full round-trip encryption cycle passed');
    });

    test('clearApiKey removes from all storage', async () => {
      // First ensure we have a key
      authService = new AuthService();
      await authService.authenticate(TEST_API_KEY!);

      // Now clear everything
      await apiKeyManager.clearApiKey();
      delete process.env.SHADOW_CLONE_API_KEY;

      // Key should be null (cleared from config too)
      const retrievedKey = await apiKeyManager.getApiKey();
      expect(retrievedKey).toBeNull();

      console.log('  ✓ clearApiKey successfully removes from all storage');
    });
  });
});

// Info message when tests are skipped
if (!TEST_API_KEY) {
  console.log('\n⚠️  Integration tests skipped: TEST_API_KEY not set');
  console.log('   Run with: TEST_API_KEY=your_key bun test tests/integration/\n');
}
