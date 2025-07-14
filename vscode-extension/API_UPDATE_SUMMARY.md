# VSCode Extension API Update Summary

## Changes Made

### 1. Updated Main Prompt Endpoint
- **OLD**: `/api/prompts/shadow-clone`
- **NEW**: `/api/prompts/shadow-clone-prompt`
- **Files Updated**:
  - `src/services/promptService.ts` (2 occurrences)
  - `src/commands/injectCommand.ts` (all command injections)

### 2. API Structure Changes
The current optimized API structure (v0.4.0):
- **Agent Rules**: 3 files (core_rules, agent_template, README)
- **Coordination Rules**: REMOVED - functionality merged into main prompt
- **Templates**: 4 files (MASTER_PLAN, SECURITY_AUDIT, mode-completion, team-agent)
- **Total Files**: 18 (down from 69+)

## Testing Checklist

1. **Authentication**: Verify API key authentication still works
2. **Command Injection**: Test each macro command:
   - Deploy
   - Debug
   - Feature
   - Refactor
   - Optimize
   - Audit
   - Research
   - Plan
   - Resume

3. **API Calls**: Verify the extension correctly tells Claude to fetch:
   - Main prompt: `curl -X GET {api}/api/prompts/shadow-clone-prompt -H "X-API-Key: {key}"`
   - Mode configs: `curl -X GET {api}/api/prompts/modes/{mode} -H "X-API-Key: {key}"`

## Potential Issues to Watch

1. **Parameter Naming**: The extension uses `project_type` in some places, but the new system uses `mode`. This might need adjustment.

2. **Mode vs Project Type**: Commands like this might need updating:
   ```
   project_type=audit → mode=audit
   ```

3. **Agent Rules**: The system uses consolidated rules:
   - `/api/prompts/agent_rules/core_rules`
   - `/api/prompts/agent_rules/agent_template`

## How the Extension Works

The VSCode extension doesn't directly execute the Shadow Clone system. Instead, it:
1. Builds a command that tells Claude to fetch prompts from the API
2. Injects this command into the terminal or editor
3. The user executes it in Claude, which then fetches and runs the actual prompts

## Next Steps

1. Test the extension with the new API endpoints deployed to Cloudflare
2. Verify all command types work correctly
3. Check if parameter naming needs to be standardized (mode vs project_type)
4. Update any documentation or help text if needed