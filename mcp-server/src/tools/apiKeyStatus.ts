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
    
    // Check storage locations manually
    const globalConfigDir = path.join(os.homedir(), '.shadow-clone');
    const globalConfigFile = path.join(globalConfigDir, 'config.json');
    const localEnvFile = path.join(process.cwd(), '.env');
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    
    // Check environment variable
    const hasEnvVar = !!process.env.SHADOW_CLONE_API_KEY;
    
    // Check local .env file
    const hasLocalEnv = fs.existsSync(localEnvFile);
    let localEnvHasKey = false;
    let isGitignored = false;
    
    if (hasLocalEnv) {
      try {
        const envContent = fs.readFileSync(localEnvFile, 'utf-8');
        localEnvHasKey = envContent.includes('SHADOW_CLONE_API_KEY');
        
        if (fs.existsSync(gitignorePath)) {
          const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
          isGitignored = gitignoreContent.includes('.env');
        }
      } catch (e) {}
    }
    
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
    
    // Get basic storage info from manager
    const storageInfo = await this.apiKeyManager.getStorageInfo();
    
    let response = `# Shadow Clone API Key Status

## Authentication State
- **Authenticated**: ${isAuthenticated ? '✅ Yes' : '❌ No'}
- **Creator Mode**: ${isCreatorMode ? '✅ ACTIVE (Privileged Access)' : '❌ Inactive'}
${currentKey ? `- **Current Key**: ${showKey ? currentKey : maskApiKey(currentKey)}` : '- **Current Key**: Not set'}
- **Key Source**: ${storageInfo.current || 'None'}

## Key Storage Locations (Priority Order)

### 1. Environment Variable
- **Variable**: SHADOW_CLONE_API_KEY
- **Status**: ${hasEnvVar ? '✅ Set' : '❌ Not set'}
${hasEnvVar && process.env.SHADOW_CLONE_API_KEY ? `- **Value**: ${showKey ? process.env.SHADOW_CLONE_API_KEY : maskApiKey(process.env.SHADOW_CLONE_API_KEY)}` : ''}

### 2. Local .env File
- **Path**: ${localEnvFile}
- **Status**: ${hasLocalEnv ? '✅ Found' : '❌ Not found'}
${hasLocalEnv ? `- **Has Key**: ${localEnvHasKey ? '✅ Yes' : '❌ No'}` : ''}
${hasLocalEnv ? `- **Git Ignored**: ${isGitignored ? '✅ Yes' : '⚠️ No (add to .gitignore!)'}` : ''}

### 3. Global Config
- **Path**: ${globalConfigFile}
- **Status**: ${hasGlobalConfig ? '✅ Found' : '❌ Not found'}
${hasGlobalConfig ? `- **Has Key**: ${globalConfigHasKey ? '✅ Yes' : '❌ No'}` : ''}

### 4. Memory Cache
- **Status**: ${storageInfo.current === 'Memory cache' ? '✅ Cached' : '❌ Not cached'}
- **Session Only**: This cache is cleared when the server restarts

## Setting Your API Key

If you need to set or update your API key, use one of these methods:

### Option 1: Use the authenticate tool (Recommended)
\`\`\`bash
# In your AI assistant
authenticate("your-api-key-here")
\`\`\`

### Option 2: Set environment variable
\`\`\`bash
# Windows PowerShell
$env:SHADOW_CLONE_API_KEY = "your-api-key-here"

# macOS/Linux
export SHADOW_CLONE_API_KEY="your-api-key-here"
\`\`\`

### Option 3: Create .env file
Create a \`.env\` file in your project root:
\`\`\`
SHADOW_CLONE_API_KEY=your-api-key-here
\`\`\`

### Option 4: Global config
The authenticate tool will automatically save to global config for persistence across projects.

## Notes
${isCreatorMode ? `
### 🎉 Creator Mode Active!
You have creator privileges! Authentication is bypassed and all features are unlocked.
` : `
### Get Your API Key
Visit https://dashboard.ignislabs.ai to get your Shadow Clone API key.
`}

- API keys are cached for 5 minutes after validation
- The authenticate tool saves keys to global config for persistence
- Environment variables take highest priority
- Local .env files are project-specific
- Global config works across all projects`;

    return response;
  }
}

function maskApiKey(key: string): string {
  if (!key || key.length < 8) return '***';
  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
}