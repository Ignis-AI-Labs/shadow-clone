# Cloudflare Upload Manifest

## Summary
The .shadow directory contains the production-ready Shadow Clone system with optimized file structure.
All files have been consolidated for maximum efficiency while maintaining system functionality.

## Files to Upload (21 total)

### Core System Files (2 files)
- `/shadow-clone-prompt.md` - Main orchestrator with API endpoints
- `/LICENSE` - System license file

### Agent Rules (4 files)
- `/agent_rules/README.md`
- `/agent_rules/core_rules.md`
- `/agent_rules/specialized_agent_rules.md` 
- `/agent_rules/agent_template.md`

### Coordination Rules (3 files)
- `/coordination_rules/README.md`
- `/coordination_rules/system_core_rules.md`
- `/coordination_rules/wave_coordination_protocol.md`

### Mode Configurations (7 files)
- `/mode_configs/shadow-clone-audit.md`
- `/mode_configs/shadow-clone-debug.md`
- `/mode_configs/shadow-clone-feature.md`
- `/mode_configs/shadow-clone-optimize.md`
- `/mode_configs/shadow-clone-plan.md`
- `/mode_configs/shadow-clone-refactor.md`
- `/mode_configs/shadow-clone-research.md`

### Templates (4 files)
- `/templates/MASTER_PLAN_TEMPLATE.md`
- `/templates/SECURITY_AUDIT_REPORT_TEMPLATE.md`
- `/templates/mode-completion-template.md`
- `/templates/team-agent-templates.md`

### Testing (1 file)
- `/testing/test_mode.md`

## API Endpoint Structure
All endpoints follow the pattern:
`https://api.ignislabs.ai/api/prompts/{category}/{filename_without_extension}`

### Example Endpoints:
- **Main Orchestrator**: `https://api.ignislabs.ai/api/prompts/shadow-clone-prompt`
- **Agent Rules**: `https://api.ignislabs.ai/api/prompts/agent_rules/core_rules`
- **Mode Configs**: `https://api.ignislabs.ai/api/prompts/mode_configs/shadow-clone-feature`
- **Templates**: `https://api.ignislabs.ai/api/prompts/templates/project-execution-template`

### Key Optimizations:
- **Agent Rules**: Consolidated from 8+ individual files to 4 focused files
- **Coordination Rules**: Streamlined from 8 files to 3 essential protocols
- **Templates**: Reduced from 20+ to 7 core templates
- **Removed Execution Phases**: Integrated into main orchestrator for efficiency

## Benefits of Optimized Structure
1. **Reduced Complexity**: 24 files instead of 69+ (65% reduction)
2. **Faster Loading**: Fewer API calls required for system initialization
3. **Better Performance**: Consolidated rules reduce redundancy
4. **Easier Maintenance**: Single source of truth for each component
5. **Parallel Execution**: Optimized for concurrent agent deployment
6. **Clear Hierarchy**: Logical grouping of related functionality

## Upload Process
1. **Pre-Upload Checklist**:
   - Verify all 24 files exist in .shadow directory
   - Ensure shadow-clone-prompt.md has correct API endpoints
   - Check that all mode configs are present
   - Confirm templates match production requirements

2. **Upload Steps**:
   - Upload entire .shadow directory structure to Cloudflare
   - Maintain exact directory hierarchy as shown above
   - Set appropriate caching headers for static content
   - Configure CORS if needed for cross-origin access

3. **Post-Upload Verification**:
   - Test main orchestrator endpoint: `GET /api/prompts/shadow-clone-prompt`
   - Verify random sampling of other endpoints
   - Check response times are under 100ms
   - Confirm all files are accessible without authentication

4. **API Gateway Configuration**:
   - Route pattern: `/api/prompts/{path+}`
   - Remove .md extension from URLs automatically
   - Enable gzip compression for responses
   - Set up monitoring for 404 errors