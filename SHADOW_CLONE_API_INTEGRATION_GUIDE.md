# Shadow Clone API Integration Guide

This guide explains how the Shadow Clone VS Code extension should call the prompts from the IGNIS API server.

## API Base Configuration

### Production Endpoint
```
Base URL: https://api.ignislabs.ai
```

### Development/Testing Endpoint
```
Base URL: https://api.elijah-02b.workers.dev
```

## Authentication

All requests MUST include the shadow clone license key in the header:

```
X-API-Key: sc-{64-character-license-key}
```

Example:
```
X-API-Key: ***REDACTED-KEY***
```

## Available Endpoints

### 1. Main Shadow Clone Prompt
```
GET /api/prompts/shadow-clone
```

**Response:**
```json
{
  "success": true,
  "content": "<!--\n╔═══════════════════════════════════════════════════════════════╗\n║                           PROPRIETARY AND CONFIDENTIAL         ║\n...",
  "version": "2.0.0",
  "lastUpdated": "2024-12-27"
}
```

### 2. List Available Modes
```
GET /api/prompts/modes
```

**Response:**
```json
{
  "success": true,
  "modes": ["audit", "debug", "feature", "optimize", "refactor", "research", "plan"],
  "count": 7
}
```

### 3. Get Specific Mode Configuration
```
GET /api/prompts/modes/{mode}
```

**Available modes:**
- `audit` - Security audit mode
- `debug` - Debugging mode
- `feature` - Feature development mode
- `optimize` - Optimization mode
- `refactor` - Refactoring mode
- `research` - Research mode
- `plan` - Planning mode

**Example:**
```
GET /api/prompts/modes/feature
```

**Response:**
```json
{
  "success": true,
  "name": "feature",
  "description": "feature mode configuration",
  "content": "<!--\nCOPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.\n..."
}
```

### 4. Get Agent Rules
```
GET /api/prompts/agent-rules/{role}
```

**Available roles:**
- `core_agent_rules` - Universal behavioral rules for all agents
- `development_agent_rules` - Development-specific rules
- `qa_agent_rules` - QA and testing rules
- `devops_agent_rules` - DevOps and infrastructure rules
- `security_agent_rules` - Security-specific rules
- `documentation_agent_rules` - Documentation rules
- `team_lead_rules` - Team lead coordination rules
- `audit_agent_rules` - Audit-specific rules
- `research_agent_rules` - Research-specific rules

**Example:**
```
GET /api/prompts/agent-rules/core_agent_rules
```

**Response:**
```json
{
  "success": true,
  "role": "core_agent_rules",
  "content": "<!--\nCOPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.\n..."
}
```

### 5. List Coordination Rules
```
GET /api/prompts/coordination-rules
```

**Response:**
```json
{
  "success": true,
  "rules": ["wave_coordination", "integration_rules", "quality_gates", "mode_operations", "workspace_structure"],
  "count": 5
}
```

### 6. Get Specific Coordination Rule
```
GET /api/prompts/coordination-rules/{rule}
```

**Available rules:**
- `wave_coordination` - Wave execution coordination
- `integration_rules` - Integration protocols
- `quality_gates` - Quality assurance gates
- `mode_operations` - Mode-specific operations
- `workspace_structure` - Workspace organization

**Example:**
```
GET /api/prompts/coordination-rules/wave_coordination
```

### 7. Get Templates
```
GET /api/prompts/templates/{template}
```

**Available templates:**
- `agent_templates` - Agent configuration templates
- `team_templates` - Team structure templates
- `wave-execution-plan-template` - Wave planning template
- `security-audit-report-template` - Security audit report format
- `vulnerability-report-template` - Vulnerability reporting
- `risk-assessment-matrix-template` - Risk assessment matrix
- `compliance-matrix-template` - Compliance tracking
- Plus additional security and QA templates

**Example:**
```
GET /api/prompts/templates/agent_templates
```

### 8. Get Execution Phases
```
GET /api/prompts/execution-phases/{phase}
```

**Available phases:**
- `phase1_analysis` - Project analysis phase
- `phase2_team_config` - Team configuration
- `phase3_wave_planning` - Wave planning
- `phase4_deployment` - Agent deployment
- `phase5_execution` - Execution phase
- `phase6_integration` - Integration phase
- `phase7_quality` - Quality assurance
- `wave_execution_protocol` - Wave execution protocol

**Example:**
```
GET /api/prompts/execution-phases/phase1_analysis
```

## Integration Examples

### JavaScript/TypeScript Example
```javascript
const IGNIS_API_BASE = 'https://api.ignislabs.ai';
const API_KEY = 'sc-your-license-key-here';

async function fetchShadowClonePrompt() {
  const response = await fetch(`${IGNIS_API_BASE}/api/prompts/shadow-clone`, {
    headers: {
      'X-API-Key': API_KEY
    }
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch prompt');
  }
  
  return data.content;
}

// Fetch mode-specific configuration
async function fetchModeConfig(mode) {
  const response = await fetch(`${IGNIS_API_BASE}/api/prompts/modes/${mode}`, {
    headers: {
      'X-API-Key': API_KEY
    }
  });
  
  const data = await response.json();
  return data.content;
}

// Fetch agent rules
async function fetchAgentRules(role) {
  const response = await fetch(`${IGNIS_API_BASE}/api/prompts/agent-rules/${role}`, {
    headers: {
      'X-API-Key': API_KEY
    }
  });
  
  const data = await response.json();
  return data.content;
}
```

### cURL Examples
```bash
# Main prompt
curl -X GET https://api.ignislabs.ai/api/prompts/shadow-clone \
  -H "X-API-Key: sc-your-license-key"

# Feature mode
curl -X GET https://api.ignislabs.ai/api/prompts/modes/feature \
  -H "X-API-Key: sc-your-license-key"

# Core agent rules
curl -X GET https://api.ignislabs.ai/api/prompts/agent-rules/core_agent_rules \
  -H "X-API-Key: sc-your-license-key"
```

## Error Handling

### Authentication Errors
```json
{
  "success": false,
  "error": "Missing X-API-Key header"
}
```

```json
{
  "success": false,
  "error": "Invalid license key"
}
```

```json
{
  "success": false,
  "error": "License holder is no longer active or not a tripleOG holder"
}
```

### Not Found Errors
```json
{
  "success": false,
  "error": "Invalid mode. Available modes: audit, debug, feature, optimize, refactor, research, plan"
}
```

## Migration from Old System

### Old System (Cloudflare Worker)
The old system used:
- Base URL: `https://shadow-clone-api.elijah-02b.workers.dev`
- Different endpoint structure
- Different authentication method

### New System (IGNIS API)
The new system uses:
- Base URL: `https://api.ignislabs.ai`
- Standardized `/api/prompts/*` endpoints
- Shadow clone license key authentication
- Same response format for easy migration

## VS Code Extension Integration

The VS Code extension should:

1. **Store the API configuration:**
   ```json
   {
     "shadowClone.apiEndpoint": "https://api.ignislabs.ai",
     "shadowClone.apiKey": "sc-user-license-key"
   }
   ```

2. **Fetch prompts dynamically:** Instead of bundling prompts, fetch them from the API when needed

3. **Cache prompts locally:** To avoid repeated API calls, cache prompts with a reasonable TTL (e.g., 1 hour)

4. **Handle errors gracefully:** Show meaningful error messages when API calls fail

5. **Support offline mode:** Fall back to cached prompts if API is unavailable

## Important Notes

1. **API Key Security:** Never commit API keys to source control. Store them securely in VS Code settings or environment variables.

2. **Rate Limiting:** While not currently implemented, be prepared for potential rate limiting in the future.

3. **Content Format:** All prompt content is returned in the `content` field as a string. The extension should parse this as needed.

4. **Versioning:** Check the `version` field to ensure compatibility with the extension.

5. **Dynamic Loading:** The main shadow clone prompt references other modules using placeholders like `{API_ENDPOINT}` and `{KEY}`. The extension should replace these with actual values.

## Testing

Use the provided test script to verify all endpoints:
```bash
./api/test-shadow-clone-endpoints.sh sc-your-license-key
```

This will test all endpoints and report their status.