# Shadow Clone API Integration Guide

This guide explains how to integrate with the Shadow Clone API for VS Code extensions and other applications.

## ⚠️ IMPORTANT: Endpoint Migration Required

**The API endpoints have been updated. All endpoints now use hyphens (-) instead of underscores (_).**

### Migration Examples:
- ❌ OLD: `/api/prompts/agent_rules/core_rules`
- ✅ NEW: `/api/prompts/agent-rules/core-rules`

## API Base Configuration

### Production Endpoint
```
Base URL: https://api.ignislabs.ai
```

## Authentication

All requests MUST include the shadow clone license key in the header:

```
X-API-Key: sc-{64-character-license-key}
```

Example:
```
X-API-Key: sc--mPHsUrZf4J1y0u_1kRgcf7BQ3tYOsnqpAwC562D6MxB2APifDYs9BERAqKwyISu
```

## Response Format

- **Content Endpoints**: Return plain text (markdown) with `Content-Type: text/plain; charset=UTF-8`
- **List Endpoints**: Return JSON with `Content-Type: application/json`

## Complete Endpoint Reference (20 Total)

### Core Endpoints (3)

| Endpoint | Response Type | Description |
|----------|---------------|-------------|
| `GET /api/prompts/shadow-clone` | Text/Markdown | Main Shadow Clone prompt |
| `GET /api/prompts/license` | Text | License information |
| `GET /api/prompts` | JSON | List all available prompts |

**Note:** The `/api/prompts/manifest` endpoint has been removed as it's no longer needed within the worker.

### Mode Endpoints (8)

| Endpoint | Response Type | Description |
|----------|---------------|-------------|
| `GET /api/prompts/modes` | JSON | List all available modes |
| `GET /api/prompts/modes/audit` | Text/Markdown | Audit mode configuration |
| `GET /api/prompts/modes/debug` | Text/Markdown | Debug mode configuration |
| `GET /api/prompts/modes/feature` | Text/Markdown | Feature development mode |
| `GET /api/prompts/modes/optimize` | Text/Markdown | Optimization mode |
| `GET /api/prompts/modes/plan` | Text/Markdown | Planning mode |
| `GET /api/prompts/modes/refactor` | Text/Markdown | Refactoring mode |
| `GET /api/prompts/modes/research` | Text/Markdown | Research mode |

### Agent Rules Endpoints (4)

| Endpoint | Response Type | Description |
|----------|---------------|-------------|
| `GET /api/prompts/agent-rules` | JSON | List all agent rules |
| `GET /api/prompts/agent-rules/README` | Text/Markdown | Agent rules documentation |
| `GET /api/prompts/agent-rules/agent-template` | Text/Markdown | Agent template structure |
| `GET /api/prompts/agent-rules/core-rules` | Text/Markdown | Core behavioral rules |

### Template Endpoints (5)

| Endpoint | Response Type | Description |
|----------|---------------|-------------|
| `GET /api/prompts/templates` | JSON | List all templates |
| `GET /api/prompts/templates/master-plan-template` | Text/Markdown | Master plan template |
| `GET /api/prompts/templates/security-audit-report-template` | Text/Markdown | Security audit report |
| `GET /api/prompts/templates/mode-completion-template` | Text/Markdown | Mode completion summary |
| `GET /api/prompts/templates/team-agent-templates` | Text/Markdown | Team agent configurations |

## VS Code Extension Implementation

### 1. Configuration
```typescript
interface ShadowCloneConfig {
  apiEndpoint: string;  // Default: "https://api.ignislabs.ai"
  apiKey: string;       // User's shadow clone license key
}
```

### 2. API Client Implementation
```typescript
class ShadowCloneAPI {
  private baseUrl: string;
  private apiKey: string;

  constructor(config: ShadowCloneConfig) {
    this.baseUrl = config.apiEndpoint;
    this.apiKey = config.apiKey;
  }

  private async fetchEndpoint(path: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        'X-API-Key': this.apiKey
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key');
      }
      if (response.status === 404) {
        throw new Error(`Endpoint not found: ${path}`);
      }
      throw new Error(`API error: ${response.status}`);
    }

    return response.text();
  }

  // Main prompt
  async getMainPrompt(): Promise<string> {
    return this.fetchEndpoint('/api/prompts/shadow-clone');
  }

  // Get specific mode
  async getMode(mode: string): Promise<string> {
    return this.fetchEndpoint(`/api/prompts/modes/${mode}`);
  }

  // Get agent rule
  async getAgentRule(rule: string): Promise<string> {
    return this.fetchEndpoint(`/api/prompts/agent-rules/${rule}`);
  }

  // Get template
  async getTemplate(template: string): Promise<string> {
    return this.fetchEndpoint(`/api/prompts/templates/${template}`);
  }

  // List all prompts (returns JSON)
  async listPrompts(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/prompts`, {
      headers: { 'X-API-Key': this.apiKey }
    });
    return response.json();
  }

  // List modes (returns JSON)
  async listModes(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/prompts/modes`, {
      headers: { 'X-API-Key': this.apiKey }
    });
    return response.json();
  }
}
```

### 3. Extension Commands Implementation
```typescript
// Example: Execute Shadow Clone with Plan Mode
async function executeShadowClonePlan(task: string) {
  const api = new ShadowCloneAPI({
    apiEndpoint: vscode.workspace.getConfiguration('shadowClone').get('apiEndpoint'),
    apiKey: vscode.workspace.getConfiguration('shadowClone').get('apiKey')
  });

  try {
    // Fetch main prompt and plan mode
    const mainPrompt = await api.getMainPrompt();
    const planMode = await api.getMode('plan');
    
    // Combine prompts
    const fullPrompt = `${mainPrompt}\n\n${planMode}`;
    
    // Create command for AI
    const command = `shadow-clone plan "${task}"`;
    
    // Send to AI integration (Claude, GPT, etc.)
    // This part depends on your AI integration
    await sendToAI(fullPrompt, command);
    
  } catch (error) {
    vscode.window.showErrorMessage(`Shadow Clone Error: ${error.message}`);
  }
}
```

### 4. Caching Strategy
```typescript
class CachedShadowCloneAPI extends ShadowCloneAPI {
  private cache = new Map<string, { content: string; timestamp: number }>();
  private cacheTTL = 3600000; // 1 hour

  async fetchEndpoint(path: string): Promise<string> {
    const cached = this.cache.get(path);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.content;
    }

    const content = await super.fetchEndpoint(path);
    this.cache.set(path, { content, timestamp: Date.now() });
    return content;
  }
}
```

## Error Handling

### Authentication Errors (401)
```json
{"error": "Unauthorized"}
```
**Action**: Prompt user to check their API key

### Not Found Errors (404)
```json
{"error": "Prompt not found"}
```
**Action**: Check endpoint spelling, refer to endpoint list above

### Network Errors
**Action**: Implement retry logic with exponential backoff

## Usage Examples

### Get Main Prompt Only
```bash
curl -X GET https://api.ignislabs.ai/api/prompts/shadow-clone \
  -H "X-API-Key: sc-your-key"
```

### Get Plan Mode Configuration
```bash
curl -X GET https://api.ignislabs.ai/api/prompts/modes/plan \
  -H "X-API-Key: sc-your-key"
```

### List All Available Endpoints
```bash
curl -X GET https://api.ignislabs.ai/api/prompts \
  -H "X-API-Key: sc-your-key"
```

## VS Code Extension Migration Instructions

### For Extension Developers:

If you're updating the VS Code extension to use these corrected endpoints, here are the key changes:

1. **Update all endpoint paths to use hyphens (-) instead of underscores (_)**
   ```typescript
   // ❌ OLD
   const ENDPOINTS = {
     agentRules: '/api/prompts/agent_rules/core_rules',
     // ...
   };
   
   // ✅ NEW
   const ENDPOINTS = {
     agentRules: '/api/prompts/agent-rules/core-rules',
     // ...
   };
   ```

2. **Remove references to the manifest endpoint**
   ```typescript
   // ❌ Remove this
   async getManifest(): Promise<string> {
     return this.fetchEndpoint('/api/prompts/manifest');
   }
   ```

3. **Update any hardcoded paths in:**
   - API client classes
   - Configuration files
   - Test files
   - Documentation

4. **Search and replace patterns:**
   - Find: `agent_rules` → Replace: `agent-rules`
   - Find: `core_rules` → Replace: `core-rules`
   - Find: `/manifest` → Remove endpoint entirely

## Important Notes

1. **Simplified Endpoints**: Only the endpoints listed above are available. These removed endpoints no longer exist:
   - `/api/prompts/coordination-rules/*` (removed)
   - `/api/prompts/execution-phases/*` (removed)
   - `/api/prompts/testing/*` (removed)
   - `/api/prompts/manifest` (removed)

2. **Text Responses**: Most endpoints return plain text markdown, NOT JSON

3. **License Key Required**: All endpoints require valid shadow clone license

4. **20 Total Endpoints**: See complete list above - that's everything available

## Testing Your Integration

Use the test script:
```bash
cd /root/repos/IAS-Holder-Portal/api
SHADOW_CLONE_API_KEY=your-key node test-shadow-clone-endpoints.js
```

Or test individual endpoints:
```bash
# Test main prompt
curl -I https://api.ignislabs.ai/api/prompts/shadow-clone \
  -H "X-API-Key: sc-your-key"

# Should return: HTTP/2 200
```