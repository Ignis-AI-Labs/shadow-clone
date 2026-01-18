# Shadow Clone API Integration Guide

This guide documents the Shadow Clone API endpoints used for authentication and license verification.

> **Note:** The MCP Server embeds all prompts directly - no API calls needed for prompt content. These endpoints are primarily for authentication and future integrations.

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