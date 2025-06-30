# Shadow Clone Prompts Integration Guide for Ignis API

## Overview
This guide explains how to integrate Shadow Clone prompts into the Ignis Labs API so they can be served from `api.ignislabs.ai` using the existing D1 database authentication.

## Files Being Provided
1. `.shadow/` directory - Contains mode configurations
2. `shadow-clone-prompt.md` - Main orchestrator prompt
3. Cloudflare Worker prompt files at `cloudflare-worker/src/prompts/` (full structured prompt system)

## Required API Endpoints

The following endpoints must be added to the Ignis API to match what the VS Code extension expects:

### 1. Main Prompt
```
GET /api/prompts/shadow-clone
Response: {
  "success": true,
  "content": "<shadow-clone-prompt.md content>",
  "version": "2.0.0",
  "lastUpdated": "2024-12-27"
}
```

### 2. Mode List
```
GET /api/prompts/modes
Response: {
  "success": true,
  "modes": ["audit", "debug", "feature", "optimize", "refactor", "research", "plan"],
  "count": 7
}
```

### 3. Specific Mode
```
GET /api/prompts/modes/:mode
Example: GET /api/prompts/modes/feature
Response: {
  "success": true,
  "name": "feature",
  "description": "feature mode configuration",
  "content": "<mode content from .shadow/mode_configs/>"
}
```

### 4. Agent Rules
```
GET /api/prompts/agent-rules/:role
Example: GET /api/prompts/agent-rules/core_agent_rules
Response: {
  "success": true,
  "role": "core_agent_rules",
  "content": "<agent rule content>"
}
```

Available roles:
- core_agent_rules
- development_agent_rules
- qa_agent_rules
- devops_agent_rules
- security_agent_rules
- documentation_agent_rules
- team_lead_rules
- audit_agent_rules
- research_agent_rules

### 5. Coordination Rules
```
GET /api/prompts/coordination-rules
Response: {
  "success": true,
  "rules": ["wave_coordination", "integration_rules", "quality_gates", "mode_operations", "workspace_structure"],
  "count": 5
}

GET /api/prompts/coordination-rules/:rule
Example: GET /api/prompts/coordination-rules/wave_coordination
Response: {
  "success": true,
  "rule": "wave_coordination",
  "content": "<coordination rule content>"
}
```

### 6. Templates
```
GET /api/prompts/templates/:template
Example: GET /api/prompts/templates/agent_templates
Response: {
  "success": true,
  "template": "agent_templates",
  "content": "<template content>"
}
```

Available templates:
- agent_templates
- team_templates
- wave-execution-plan-template
- security-audit-report-template

### 7. Execution Phases
```
GET /api/prompts/execution-phases/:phase
Example: GET /api/prompts/execution-phases/phase1_analysis
Response: {
  "success": true,
  "phase": "phase1_analysis",
  "content": "<phase content>"
}
```

Available phases:
- phase1_analysis
- phase2_team_config
- phase3_wave_planning
- phase4_deployment
- phase5_execution
- phase6_integration
- phase7_quality
- wave_execution_protocol

## Authentication Requirements

All endpoints must:
1. Check for `X-API-Key` header
2. Validate the API key against the D1 database (same as existing Ignis API endpoints)
3. Return 401 if unauthorized

## File Mapping

### From `.shadow/mode_configs/`:
- `shadow-clone-audit.md` → `/api/prompts/modes/audit`
- `shadow-clone-debug.md` → `/api/prompts/modes/debug`
- `shadow-clone-feature-development.md` → `/api/prompts/modes/feature`
- `shadow-clone-optimize.md` → `/api/prompts/modes/optimize`
- `shadow-clone-refactor.md` → `/api/prompts/modes/refactor`
- `shadow-clone-research-mode.md` → `/api/prompts/modes/research`
- `shadow-clone-plan-mode.md` → `/api/prompts/modes/plan`

### From `shadow-clone-prompt.md`:
- Main content → `/api/prompts/shadow-clone`

### From `cloudflare-worker/src/prompts/`:
Use the structured TypeScript files for all other endpoints (agent rules, coordination rules, templates, execution phases).

## Testing the Integration

After deployment, test each endpoint:

```bash
# Set your API key
API_KEY="your-valid-ignis-api-key"

# Test main prompt
curl -X GET https://api.ignislabs.ai/api/prompts/shadow-clone \
  -H "X-API-Key: $API_KEY"

# Test modes list
curl -X GET https://api.ignislabs.ai/api/prompts/modes \
  -H "X-API-Key: $API_KEY"

# Test specific mode
curl -X GET https://api.ignislabs.ai/api/prompts/modes/feature \
  -H "X-API-Key: $API_KEY"

# Test agent rules
curl -X GET https://api.ignislabs.ai/api/prompts/agent-rules/core_agent_rules \
  -H "X-API-Key: $API_KEY"

# Test coordination rules
curl -X GET https://api.ignislabs.ai/api/prompts/coordination-rules \
  -H "X-API-Key: $API_KEY"

# Test template
curl -X GET https://api.ignislabs.ai/api/prompts/templates/agent_templates \
  -H "X-API-Key: $API_KEY"

# Test execution phase
curl -X GET https://api.ignislabs.ai/api/prompts/execution-phases/phase1_analysis \
  -H "X-API-Key: $API_KEY"
```

## Implementation Notes

1. **Use existing D1 authentication** - Don't create new auth, use the same system as other Ignis endpoints
2. **CORS headers** - Include `Access-Control-Allow-Origin: *` for browser compatibility
3. **Content-Type** - Always return `application/json`
4. **Error responses** - Return proper 404s with available options when invalid paths are requested
5. **Structure** - The prompt content should be returned in the `content` field of the JSON response

## Success Criteria

The integration is successful when:
1. All endpoints return proper JSON responses
2. Authentication works with existing Ignis API keys
3. VS Code extension can fetch prompts without errors
4. Users can run Shadow Clone commands in Claude Code

## File Structure in Ignis API

After integration, your Ignis API should have:
```
src/
├── prompts/                    # Add this directory
│   ├── shadow-clone-prompt.ts
│   ├── constants.ts
│   ├── modes/
│   ├── agent-rules/
│   ├── coordination-rules/
│   ├── templates/
│   └── execution-phases/
├── handlers/
│   ├── prompts.ts             # Add prompt handlers
│   └── ... (existing handlers)
└── index.ts                   # Update with new routes
```

Remember: The VS Code extension v0.3.2 expects these endpoints at `api.ignislabs.ai`, not the Cloudflare Worker URL.