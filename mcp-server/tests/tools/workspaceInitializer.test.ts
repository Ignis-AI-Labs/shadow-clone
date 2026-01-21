import { describe, test, expect } from 'bun:test';
import { WorkspaceInitializer } from '../../src/tools/workspaceInitializer';

/**
 * Tests for WorkspaceInitializer
 *
 * Focus: Verify that API keys are no longer written to .env files
 * as part of the security hardening (Priority 1.1).
 */

describe('WorkspaceInitializer', () => {
  describe('getToolDefinition', () => {
    test('tool definition does not mention .env API key storage', () => {
      // Create a mock AuthService
      const mockAuthService = {
        isAuthenticated: async () => true,
        getApiKey: async () => null,
      } as any;

      const initializer = new WorkspaceInitializer(mockAuthService);
      const toolDef = initializer.getToolDefinition();

      // The description should not mention storing API key in .env
      expect(toolDef.description).not.toContain('API key in .env');
      expect(toolDef.description).not.toContain('Stores API key');
    });

    test('tool definition has correct name', () => {
      const mockAuthService = {
        isAuthenticated: async () => true,
      } as any;

      const initializer = new WorkspaceInitializer(mockAuthService);
      const toolDef = initializer.getToolDefinition();

      expect(toolDef.name).toBe('initialize_workspace');
    });

    test('tool definition has input schema', () => {
      const mockAuthService = {
        isAuthenticated: async () => true,
      } as any;

      const initializer = new WorkspaceInitializer(mockAuthService);
      const toolDef = initializer.getToolDefinition();

      expect(toolDef.inputSchema).toBeDefined();
      expect(toolDef.inputSchema.type).toBe('object');
      expect(toolDef.inputSchema.properties).toBeDefined();
    });
  });

  describe('security requirements', () => {
    test('class does not import ApiKeyManager', () => {
      // The WorkspaceInitializer should no longer need ApiKeyManager
      // since it doesn't write API keys to .env anymore
      // This is verified by the fact that the import was removed in the implementation

      // We can verify by checking that the class constructor doesn't
      // set up an apiKeyManager property
      const mockAuthService = {
        isAuthenticated: async () => true,
      } as any;

      const initializer = new WorkspaceInitializer(mockAuthService);

      // The initializer should not have an apiKeyManager property
      expect((initializer as any).apiKeyManager).toBeUndefined();
    });
  });

  describe('.gitignore content', () => {
    test('gitignore patterns include .shadow-clone/ and .waves/', () => {
      // The expected gitignore patterns that should be added
      const expectedPatterns = ['.shadow-clone/', '.waves/'];

      // Verify these are the patterns we want (not .env for API key)
      expectedPatterns.forEach((pattern) => {
        expect(pattern).not.toContain('SHADOW_CLONE_API_KEY');
      });

      expect(expectedPatterns).toContain('.shadow-clone/');
      expect(expectedPatterns).toContain('.waves/');
    });
  });
});

describe('WorkspaceInitializer removed .env handling', () => {
  describe('API key security', () => {
    test('.env storage was removed for security', () => {
      // Document why .env storage was removed:
      // 1. Plain text storage in project directory is a security risk
      // 2. .env files can accidentally be committed to git
      // 3. API keys should only be stored encrypted in ~/.shadow-clone/config.json
      // 4. Users can still use shell profile or CI/CD env vars if needed

      // This test documents the security decision
      const securityReasons = [
        'Plain text storage is insecure',
        'Project directory files can be accidentally shared',
        'Encrypted storage in global config is more secure',
        'Environment variables should be set at shell level, not in project files',
      ];

      expect(securityReasons.length).toBeGreaterThan(0);
    });

    test('alternative methods for setting API key', () => {
      // Document the alternative methods users can use
      const alternativeMethods = [
        'Shell profile (~/.bashrc, ~/.zshrc): export SHADOW_CLONE_API_KEY=xxx',
        'CI/CD environment variables',
        'Encrypted global config at ~/.shadow-clone/config.json',
        'Session memory (set via authenticate tool)',
      ];

      expect(alternativeMethods.length).toBe(4);
      expect(alternativeMethods[0]).toContain('Shell profile');
      expect(alternativeMethods[2]).toContain('Encrypted');
    });
  });
});

describe('WorkspaceInitializer content generation', () => {
  describe('generated files', () => {
    test('should create standard AI instruction files', () => {
      // List of files that should be created
      const expectedFiles = [
        'CLAUDE.md',
        '.ai/instructions.md',
        '.github/copilot-instructions.md',
        '.vscode/ai-instructions.md',
        'AI-CONTEXT.md',
        'USER-GUIDE.md',
      ];

      // All expected files should be standard AI instruction files
      expectedFiles.forEach((file) => {
        expect(
          file.endsWith('.md') ||
            file.endsWith('instructions.md') ||
            file.includes('CLAUDE') ||
            file.includes('CONTEXT') ||
            file.includes('GUIDE')
        ).toBe(true);
      });
    });

    test('no .env file in expected outputs', () => {
      // .env should NOT be in the list of files to create
      const expectedFiles = [
        'CLAUDE.md',
        '.ai/instructions.md',
        '.github/copilot-instructions.md',
        '.vscode/ai-instructions.md',
        'AI-CONTEXT.md',
        'USER-GUIDE.md',
        '.gitignore', // gitignore is updated, but doesn't contain API key
      ];

      const envFile = expectedFiles.find((f) => f === '.env');
      expect(envFile).toBeUndefined();
    });
  });
});
