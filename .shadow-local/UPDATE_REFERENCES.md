# Reference Update Guide

This document tracks all the reference updates needed to sync with our simplified file structure.

## Coordination Rules Updates

### Old → New Mappings
```
initialization_checklist.md → core_system_rules.md
system_validation_rules.md → core_system_rules.md
quality_gates.md → core_system_rules.md
mode_validation_rules.md → core_system_rules.md

file_organization_rules.md → file_and_workspace_rules.md
workspace_structure.md → file_and_workspace_rules.md
git_commit_protocol.md → file_and_workspace_rules.md

wave_coordination.md → wave_execution_protocol.md
integration_rules.md → wave_execution_protocol.md
mode_operations.md → wave_execution_protocol.md

constitution_protocol.md → constitution_protocol.md (unchanged)
```

## Agent Rules Updates

### Old → New Mappings
```
core_agent_rules.md → core_rules.md

development_agent_rules.md → technical_rules.md
qa_agent_rules.md → technical_rules.md
devops_agent_rules.md → technical_rules.md
security_agent_rules.md → technical_rules.md

planning_agent_rules.md → analytical_rules.md
research_agent_rules.md → analytical_rules.md
audit_agent_rules.md → analytical_rules.md
documentation_agent_rules.md → analytical_rules.md

team_lead_rules.md → leadership_rules.md
record_keeper_agent_rules.md → leadership_rules.md
```

## Template Updates

### Old → New Mappings
```
master-project-plan-template.md → project-execution-template.md
wave-execution-plan-template.md → project-execution-template.md
planning-consolidation-template.md → project-execution-template.md

agent_templates.md → team-agent-templates.md
team_templates.md → team-agent-templates.md
module_loader.md → team-agent-templates.md

security-audit-report-template.md → security-assessment-template.md
vulnerability-report-template.md → security-assessment-template.md
vulnerability-register-template.md → security-assessment-template.md
risk-assessment-matrix-template.md → security-assessment-template.md

quality-assurance-report-template.md → quality-validation-template.md
false-positive-analysis-template.md → quality-validation-template.md
false-positive-validation-checklist.md → quality-validation-template.md

compliance-matrix-template.md → compliance-remediation-template.md
remediation-roadmap-template.md → compliance-remediation-template.md

automated-scan-results-template.md → automation-scan-template.md
```

## Files That Need Updates

### 1. shadow-clone-prompt.md
- Update agent rules mappings (lines 44-49)
- Update coordination rules mappings (lines 58-61)
- Update initialization sequence references (lines 90-97)

### 2. execution_phases/*.md files
- phase1_analysis.md
- phase2_team_config.md
- phase3_wave_planning.md
- phase4_deployment.md
- phase5_execution.md
- phase6_integration.md
- phase7_quality.md

### 3. CONSTITUTION.md (if exists in .shadow-local)
- Update file lists
- Update references to old file names

### 4. Any test files in testing/
- Update references to use new file names

## Update Strategy

1. Start with shadow-clone-prompt.md as it's the main orchestrator
2. Update each execution phase file
3. Update any configuration files
4. Test each mode to ensure proper file loading
5. Document any issues found

## Example Updates

### In shadow-clone-prompt.md:
```python
# OLD
initialization_checklist = read_file(f"{base_path}/coordination_rules/initialization_checklist.md")

# NEW
core_system_rules = read_file(f"{base_path}/coordination_rules/core_system_rules.md")
```

### In execution phase files:
```markdown
# OLD
Load coordination_rules/file_organization_rules.md

# NEW
Load coordination_rules/file_and_workspace_rules.md
```

### For agent rules:
```markdown
# OLD
Load agent_rules/development_agent_rules.md

# NEW
Load agent_rules/technical_rules.md (Development section)
```