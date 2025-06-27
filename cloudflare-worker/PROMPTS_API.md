# Shadow Clone Prompts API

This document describes the authenticated API endpoints for fetching Shadow Clone prompts and configurations.

## Authentication

All endpoints require authentication via API key:

```
X-API-Key: your-api-key-here
```

## Endpoints

### Get Main Shadow Clone Prompt

Fetch the main Shadow Clone orchestration prompt.

**Endpoint:** `GET /api/prompts/shadow-clone`

**Response:**
```json
{
  "success": true,
  "prompt": "<!-- Full Shadow Clone prompt content -->",
  "version": "1.0.0",
  "lastUpdated": "2024-12-27"
}
```

### List Available Modes

Get a list of all available Shadow Clone modes.

**Endpoint:** `GET /api/prompts/modes`

**Response:**
```json
{
  "success": true,
  "modes": [
    {
      "name": "audit",
      "description": "Deep dive into existing codebases to identify issues, security vulnerabilities, performance bottlenecks, and improvement opportunities."
    },
    {
      "name": "debug",
      "description": "Identify, isolate, and fix bugs through comprehensive debugging strategies."
    },
    {
      "name": "feature",
      "description": "Build new features with complete implementation including frontend, backend, tests, and documentation."
    },
    {
      "name": "optimize",
      "description": "Maximize system performance through comprehensive optimization strategies."
    },
    {
      "name": "refactor",
      "description": "Transform codebases for better maintainability, scalability, and developer experience."
    },
    {
      "name": "research",
      "description": "Conduct thorough research on technologies, architectures, or implementation approaches."
    }
  ],
  "version": "1.0.0"
}
```

### Get Specific Mode Configuration

Fetch the configuration for a specific Shadow Clone mode.

**Endpoint:** `GET /api/prompts/modes/:mode`

**Parameters:**
- `mode` - The mode name (e.g., `audit`, `debug`, `feature`, `optimize`, `refactor`, `research`)

**Response:**
```json
{
  "success": true,
  "mode": "feature",
  "config": "# Shadow Clone Feature Mode\n\nMode: Feature Development Excellence\n\n...",
  "version": "1.0.0"
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "API key required"
}
```

### 404 Not Found
```json
{
  "error": "Mode not found",
  "availableModes": ["audit", "debug", "feature", "optimize", "refactor", "research"]
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to fetch prompt",
  "message": "Error details"
}
```

## Usage Example (VS Code Extension)

```typescript
async function fetchShadowClonePrompt(apiKey: string): Promise<string> {
  const response = await fetch('https://api.shadowclone.ai/api/prompts/shadow-clone', {
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch prompt: ${response.statusText}`);
  }

  const data = await response.json();
  return data.prompt;
}

async function fetchModeConfig(apiKey: string, mode: string): Promise<string> {
  const response = await fetch(`https://api.shadowclone.ai/api/prompts/modes/${mode}`, {
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch mode config: ${response.statusText}`);
  }

  const data = await response.json();
  return data.config;
}
```

## Security Notes

1. All endpoints require valid API key authentication
2. API keys are validated against the user database
3. Prompts contain proprietary content and should be handled securely
4. The VS Code extension should store API keys securely using VS Code's secret storage API
5. Prompts should never be logged or exposed in error messages

## Integration with VS Code Extension

The VS Code extension can use these endpoints to:

1. Fetch the main Shadow Clone prompt when the user runs a Shadow Clone command
2. List available modes in a quick pick menu
3. Fetch specific mode configurations based on user selection
4. Pass the complete prompt and configuration to Claude as part of the command execution

This ensures that:
- Prompts are always up-to-date
- Only authenticated users can access Shadow Clone functionality
- Prompts can be updated centrally without updating the extension
- Usage can be tracked and monitored