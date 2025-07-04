# Cloudflare Upload Manifest

## Summary
The .shadow directory has been cleaned up and updated to match the simplified structure of .shadow-local.
All API endpoints have been updated to reference the consolidated files.

## Files to Upload (31 total)

### Main Orchestrator
- `/shadow-clone-prompt.md` - API version with updated endpoints

### Agent Rules (4 files)
- `/agent_rules/README.md`
- `/agent_rules/core_rules.md`
- `/agent_rules/specialized_agent_rules.md` 
- `/agent_rules/agent_template.md`

### Coordination Rules (3 files)
- `/coordination_rules/README.md`
- `/coordination_rules/system_core_rules.md`
- `/coordination_rules/wave_coordination_protocol.md`

### Execution Phases (8 files)
- `/execution_phases/phase1_analysis.md`
- `/execution_phases/phase2_team_config.md`
- `/execution_phases/phase3_wave_planning.md`
- `/execution_phases/phase4_deployment.md`
- `/execution_phases/phase5_execution.md`
- `/execution_phases/phase6_integration.md`
- `/execution_phases/phase7_quality.md`
- `/execution_phases/wave_execution_protocol.md`

### Mode Configurations (7 files)
- `/mode_configs/shadow-clone-audit.md`
- `/mode_configs/shadow-clone-debug.md`
- `/mode_configs/shadow-clone-feature.md`
- `/mode_configs/shadow-clone-optimize.md`
- `/mode_configs/shadow-clone-plan.md`
- `/mode_configs/shadow-clone-refactor.md`
- `/mode_configs/shadow-clone-research.md`

### Templates (7 files)
- `/templates/README.md`
- `/templates/automation-scan-template.md`
- `/templates/compliance-remediation-template.md`
- `/templates/project-execution-template.md`
- `/templates/quality-validation-template.md`
- `/templates/security-assessment-template.md`
- `/templates/team-agent-templates.md`

### Testing (1 file)
- `/testing/test_mode.md`

## API Endpoint Structure
All endpoints follow the pattern:
`https://api.ignislabs.ai/api/prompts/{category}/{filename_without_extension}`

### Updated Consolidated Endpoints:
- **Agent Rules**: Now uses 3 consolidated files instead of 8+ individual role files
- **Coordination Rules**: Now uses 2 consolidated files instead of 8 separate files
- **Templates**: Reduced to 6 essential templates from 20+ 

## Benefits of New Structure
1. **Simpler**: 31 files instead of 69
2. **Consolidated**: Related rules are in single files
3. **Consistent**: Same structure as local testing version
4. **Efficient**: Fewer API calls needed
5. **Maintainable**: Easier to update and manage

## Upload Process
1. Upload all files to Cloudflare maintaining the directory structure
2. Ensure API endpoints match the file paths (without .md extension)
3. Test with a simple API call to verify access
4. Update any API gateway configurations if needed