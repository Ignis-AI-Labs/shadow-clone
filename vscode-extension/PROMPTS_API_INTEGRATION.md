# Shadow Clone Prompts API Integration Guide

This guide explains how to integrate the Shadow Clone prompts API with the VS Code extension to dynamically fetch prompts and configurations.

## Overview

Instead of hardcoding Shadow Clone prompts in the extension, the prompts are now served via authenticated API endpoints from the Cloudflare Worker. This provides:

- **Dynamic Updates**: Prompts can be updated without releasing a new extension version
- **Security**: Only authenticated users can access prompts
- **Centralized Management**: Single source of truth for all prompts
- **Usage Tracking**: Monitor which modes are being used

## API Endpoints

### Base URL
- Development: `http://localhost:8787`
- Production: `https://api.shadowclone.ai`

### Available Endpoints
1. `GET /api/prompts/shadow-clone` - Main orchestration prompt
2. `GET /api/prompts/modes` - List all available modes
3. `GET /api/prompts/modes/:mode` - Get specific mode configuration

All endpoints require `X-API-Key` header for authentication.

## Implementation Steps

### 1. Add Prompt Fetching Service

Create `src/services/promptService.ts`:

```typescript
import * as vscode from 'vscode';
import { API_BASE_URL } from '../utils/constants';

export interface ShadowClonePrompt {
  prompt: string;
  version: string;
  lastUpdated: string;
}

export interface ModeConfig {
  mode: string;
  config: string;
  version: string;
}

export interface AvailableMode {
  name: string;
  description: string;
}

export class PromptService {
  private apiKey: string | undefined;

  constructor() {
    this.loadApiKey();
  }

  private async loadApiKey(): Promise<void> {
    // Get API key from secure storage
    const secrets = vscode.workspace.getConfiguration('shadowClone').get('apiKey');
    if (secrets) {
      this.apiKey = secrets as string;
    } else {
      // Try to get from VS Code secret storage
      const secretStorage = vscode.workspace.getConfiguration().get('shadowClone.secretStorage');
      if (secretStorage) {
        this.apiKey = await vscode.authentication.getSession('shadow-clone', ['api'], { createIfNone: false })
          ?.then(session => session.accessToken);
      }
    }
  }

  private async fetchWithAuth(endpoint: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error('API key not configured. Please authenticate first.');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to fetch: ${response.statusText}`);
    }

    return response.json();
  }

  async getShadowClonePrompt(): Promise<ShadowClonePrompt> {
    const data = await this.fetchWithAuth('/api/prompts/shadow-clone');
    return {
      prompt: data.prompt,
      version: data.version,
      lastUpdated: data.lastUpdated
    };
  }

  async getAvailableModes(): Promise<AvailableMode[]> {
    const data = await this.fetchWithAuth('/api/prompts/modes');
    return data.modes;
  }

  async getModeConfig(mode: string): Promise<ModeConfig> {
    const data = await this.fetchWithAuth(`/api/prompts/modes/${mode}`);
    return {
      mode: data.mode,
      config: data.config,
      version: data.version
    };
  }

  async getCompletePromptWithMode(mode?: string): Promise<string> {
    // Fetch main prompt
    const mainPrompt = await this.getShadowClonePrompt();
    
    if (!mode) {
      return mainPrompt.prompt;
    }

    // Fetch mode config and combine
    const modeConfig = await this.getModeConfig(mode);
    return `${mainPrompt.prompt}\n\n---\n\n## Selected Mode Configuration\n\n${modeConfig.config}`;
  }
}
```

### 2. Update Claude Launcher

Modify `src/commands/claudeLauncher.ts` to fetch prompts dynamically:

```typescript
import { PromptService } from '../services/promptService';

export async function launchShadowClone(
  context: vscode.ExtensionContext,
  projectPath?: string,
  options?: ShadowCloneOptions
) {
  const promptService = new PromptService();
  
  try {
    // Show mode selection if not specified
    let selectedMode = options?.mode;
    
    if (!selectedMode) {
      const modes = await promptService.getAvailableModes();
      const quickPickItems = modes.map(mode => ({
        label: mode.name,
        description: mode.description,
        value: mode.name
      }));
      
      const selected = await vscode.window.showQuickPick(quickPickItems, {
        placeHolder: 'Select Shadow Clone mode',
        title: 'Shadow Clone Mode Selection'
      });
      
      if (!selected) {
        return;
      }
      
      selectedMode = selected.value;
    }
    
    // Fetch the complete prompt with mode
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: 'Fetching Shadow Clone configuration...',
      cancellable: false
    }, async (progress) => {
      const completePrompt = await promptService.getCompletePromptWithMode(selectedMode);
      
      // Launch Claude with the fetched prompt
      await launchClaudeWithPrompt(completePrompt, projectPath, options);
    });
    
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to launch Shadow Clone: ${error.message}`);
  }
}
```

### 3. Add Caching for Better Performance

Create `src/services/promptCache.ts`:

```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class PromptCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }
}
```

### 4. Update Extension Configuration

Add configuration options in `package.json`:

```json
{
  "contributes": {
    "configuration": {
      "title": "Shadow Clone",
      "properties": {
        "shadowClone.promptApi.cacheEnabled": {
          "type": "boolean",
          "default": true,
          "description": "Enable caching of Shadow Clone prompts"
        },
        "shadowClone.promptApi.cacheTTL": {
          "type": "number",
          "default": 300,
          "description": "Cache TTL in seconds for Shadow Clone prompts"
        },
        "shadowClone.promptApi.baseUrl": {
          "type": "string",
          "default": "https://api.shadowclone.ai",
          "description": "Base URL for Shadow Clone API"
        }
      }
    }
  }
}
```

### 5. Add Error Handling and Fallbacks

```typescript
export class PromptServiceWithFallback extends PromptService {
  private fallbackPrompts: Map<string, string> = new Map();

  constructor() {
    super();
    this.initializeFallbacks();
  }

  private initializeFallbacks() {
    // Store minimal fallback prompts for offline scenarios
    this.fallbackPrompts.set('main', 'Load shadow-clone-prompt.md from the project directory');
    this.fallbackPrompts.set('feature', 'Load shadow-clone-prompt.md with project_type=feature');
    // ... other fallbacks
  }

  async getCompletePromptWithMode(mode?: string): Promise<string> {
    try {
      return await super.getCompletePromptWithMode(mode);
    } catch (error) {
      // Check if offline or API unavailable
      if (error.message.includes('fetch') || error.message.includes('network')) {
        vscode.window.showWarningMessage(
          'Unable to fetch prompts from API. Using fallback instructions.'
        );
        
        const fallback = this.fallbackPrompts.get(mode || 'main');
        if (fallback) {
          return fallback;
        }
      }
      
      throw error;
    }
  }
}
```

## Testing

1. **Unit Tests**: Test prompt fetching with mocked API responses
2. **Integration Tests**: Test with local Cloudflare Worker
3. **Error Scenarios**: Test API failures, network issues, invalid API keys

## Security Considerations

1. **API Key Storage**: Use VS Code's secret storage API
2. **HTTPS Only**: Always use HTTPS in production
3. **Error Messages**: Never expose API keys or sensitive data in errors
4. **Rate Limiting**: Implement client-side rate limiting to prevent abuse

## Benefits

1. **Dynamic Updates**: Update prompts without extension releases
2. **A/B Testing**: Test different prompt versions
3. **Analytics**: Track which modes are most used
4. **Licensing**: Ensure only licensed users access prompts
5. **Version Control**: Manage prompt versions centrally

## Migration Path

1. Phase 1: Add API integration alongside existing prompts
2. Phase 2: Test with beta users
3. Phase 3: Migrate all users to API-based prompts
4. Phase 4: Remove hardcoded prompts from extension

## Monitoring

Track:
- API response times
- Cache hit rates
- Error rates
- Mode usage statistics
- User authentication success rates