import { AuthService } from '../auth/authService.js';
import { ApiKeyManager } from '../auth/apiKeyManager.js';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export class ApiKeyStatus {
  private apiKeyManager: ApiKeyManager;

  constructor(private authService: AuthService) {
    this.apiKeyManager = ApiKeyManager.getInstance();
  }

  getToolDefinition(): ToolDefinition {
    return {
      name: 'api_key_status',
      description: `Check Shadow Clone API key status and cache locations - Shows where API keys are stored, cache status, and authentication state. This tool returns information about key storage, it does NOT execute any operations.`,
      inputSchema: {
        type: 'object',
        properties: {
          showKey: {
            type: 'boolean',
            description: 'Whether to show the actual API key (default: false, shows masked version)'
          }
        },
        required: []
      }
    };
  }

  async checkStatus(args: any): Promise<string> {
    const showKey = args.showKey || false;

    // Get current authentication status
    const isAuthenticated = await this.authService.isAuthenticated();
    const currentKey = await this.apiKeyManager.getApiKey();

    // Check storage locations
    const globalConfigFile = path.join(os.homedir(), '.shadow-clone', 'config.json');

    // Check environment variable
    const hasEnvVar = !!process.env.SHADOW_CLONE_API_KEY;

    // Check global config
    const hasGlobalConfig = fs.existsSync(globalConfigFile);
    let globalConfigHasKey = false;

    if (hasGlobalConfig) {
      try {
        const configContent = JSON.parse(fs.readFileSync(globalConfigFile, 'utf-8'));
        globalConfigHasKey = !!configContent.apiKey;
      } catch (e) {}
    }

    // Check if creator mode is active
    const isCreatorMode = this.authService.isCreatorMode();

    // Check if browser auth is pending
    const isBrowserAuthPending = this.authService.isBrowserAuthPending();
    const browserAuthUrl = this.authService.getBrowserAuthUrl();

    // Get basic storage info from manager
    const storageInfo = await this.apiKeyManager.getStorageInfo();
    
    let response = `# Shadow Clone API Key Status

## Authentication State
- **Authenticated**: ${isAuthenticated ? '✅ Yes' : '❌ No'}
- **Creator Mode**: ${isCreatorMode ? '✅ ACTIVE (Privileged Access)' : '❌ Inactive'}
- **Browser Auth Pending**: ${isBrowserAuthPending ? `✅ Yes - Open: ${browserAuthUrl}` : '❌ No'}
${currentKey ? `- **Current Key**: ${showKey ? currentKey : maskApiKey(currentKey)}` : '- **Current Key**: Not set'}
- **Key Source**: ${storageInfo.current || 'None'}

## Key Storage Locations (Priority Order)

### 1. Environment Variable
- **Variable**: SHADOW_CLONE_API_KEY
- **Status**: ${hasEnvVar ? '✅ Set' : '❌ Not set'}
${hasEnvVar && process.env.SHADOW_CLONE_API_KEY ? `- **Value**: ${showKey ? process.env.SHADOW_CLONE_API_KEY : maskApiKey(process.env.SHADOW_CLONE_API_KEY)}` : ''}

### 2. Global Config (Encrypted)
- **Path**: ${globalConfigFile}
- **Status**: ${hasGlobalConfig ? '✅ Found' : '❌ Not found'}
${hasGlobalConfig ? `- **Has Key**: ${globalConfigHasKey ? '✅ Yes (AES-256-GCM encrypted)' : '❌ No'}` : ''}

### 3. Memory Cache
- **Status**: ${storageInfo.current === 'Memory cache' ? '✅ Cached' : '❌ Not cached'}
- **Session Only**: This cache is cleared when the server restarts

## Setting Your API Key

### Option 1: Use the authenticate tool (Recommended)
\`\`\`bash
# In your AI assistant - this opens a secure browser page
authenticate()
\`\`\`
This opens a local webpage where you can securely enter your API key.
Your key is never exposed to the MCP client and is stored encrypted.

### Option 2: Set environment variable
\`\`\`bash
# Windows PowerShell
$env:SHADOW_CLONE_API_KEY = "your-api-key-here"

# macOS/Linux
export SHADOW_CLONE_API_KEY="your-api-key-here"
\`\`\`

## Notes
${isCreatorMode ? `
### 🎉 Creator Mode Active!
You have creator privileges! Authentication is bypassed and all features are unlocked.
` : `
### Get Your API Key
Visit https://dashboard.ignislabs.ai to get your Shadow Clone API key.
`}

- API keys are revalidated every 5 minutes when used
- The authenticate tool saves keys to global config (encrypted) for persistence
- Environment variables take highest priority
- Global config works across all projects`;

    return response;
  }
}

function maskApiKey(key: string): string {
  if (!key || key.length < 8) return '***';
  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
}