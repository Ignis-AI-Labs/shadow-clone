# Old File References Report

## Summary

Found references to old removed files in various locations throughout the codebase. These need to be updated to use the new consolidated files.

## References Found

### 1. In .shadow-local/templates/README.md
- **Lines 8-23**: Lists all old template files that were consolidated
- References: master-project-plan-template.md, wave-execution-plan-template.md, planning-consolidation-template.md, agent_templates.md, team_templates.md, module_loader.md, security-audit-report-template.md, vulnerability-report-template.md, vulnerability-register-template.md, risk-assessment-matrix-template.md, quality-assurance-report-template.md, false-positive-analysis-template.md, false-positive-validation-checklist.md, compliance-matrix-template.md, remediation-roadmap-template.md, automated-scan-results-template.md

### 2. In .shadow-local/coordination_rules/README.md
- **Lines 8-14**: Lists all old coordination rules files that were consolidated
- References: initialization_checklist.md, system_validation_rules.md, quality_gates.md, mode_validation_rules.md, file_organization_rules.md, workspace_structure.md, git_commit_protocol.md, wave_coordination.md, integration_rules.md, mode_operations.md

### 3. In .shadow-local/execution_phases/phase1_analysis.md
- **Lines 50-52**: References to file_organization_rules.md, wave_coordination.md, workspace_structure.md
- **Line 191**: Reference to git_commit_protocol.md

### 4. In .shadow-local/execution_phases/phase3_wave_planning.md
- **Line 23**: Reference to wave_coordination.md
- **Line 38**: Loading wave_coordination.md
- **Line 43**: Reference to quality_gates

### 5. In .shadow-local/execution_phases/phase5_execution.md
- **Line 141**: Reference to wave_coordination function
- **Line 226**: Reference to quality_gates
- **Line 250**: Reference to quality_gates

### 6. In .shadow-local/execution_phases/phase6_integration.md
- **Line 13**: Reference to quality_gates.md
- **Line 45**: Loading quality_gates.md
- **Line 192**: Reference to quality_gates
- **Line 224**: Reference to quality_gates

### 7. In .shadow-local/execution_phases/phase7_quality.md
- **Line 429**: Reference to git_commit_protocol.md
- **Line 432**: Loading git_commit_protocol.md

### 8. In .shadow-local/shadow-clone-prompt.md
- **Lines 44-48**: References to core_agent_rules.md, development_agent_rules.md, qa_agent_rules.md, security_agent_rules.md, record_keeper_agent_rules.md
- **Lines 59-60**: References to file_organization_rules.md, wave_coordination.md
- **Lines 91-92, 96-97**: Loading system_validation_rules.md, file_organization_rules.md
- **Lines 130, 132**: Loading wave_coordination.md
- **Lines 150, 153**: Loading core_agent_rules.md
- **Lines 231-234**: Loading integration_rules.md, quality_gates.md

### 9. In cloudflare-worker TypeScript files

#### coordination-rules/initialization-checklist.ts
- **Lines 30-32**: References to file_organization_rules.md, wave_coordination.md, workspace_structure.md
- **Lines 60-63**: Loading these files
- **Lines 160-161**: Loading file_organization_rules.md, wave_coordination.md

#### coordination-rules/mode-operations.ts
- **Line 106**: Reference to wave_coordination.md

#### coordination-rules/system-validation.ts
- **Lines 61-62**: References to file_organization_rules, wave_coordination_rules

#### coordination-rules/workspace-structure.ts
- **Lines 17-21**: References to core_agent_rules.md, team_lead_rules.md, development_agent_rules.md, qa_agent_rules.md, security_agent_rules.md
- **Lines 24-26**: References to wave_coordination.md, mode_operations.md, workspace_structure.md

#### documentation/initialization-sequence.ts
- **Lines 26-29**: References to core_agent_rules.md, file_organization_rules.md, wave_coordination.md, system_validation_rules.md
- **Lines 64-65, 67**: File paths for these files
- **Lines 77-78**: Loading these files

#### documentation/system-organization.ts
- **Lines 46-50**: References to all agent rules files
- **Lines 53-57**: References to all coordination rules files

#### execution-phases/phase2-team-config.ts
- **Lines 14, 21, 36**: References to team_templates.md

#### execution-phases/phase4-deployment.ts
- **Lines 72, 107**: Loading core_agent_rules.md
- **Lines 151-158**: References to various agent rules files

### 10. In CONSTITUTION.md
- **Lines 96-101**: References to coordination rules files
- **Line 215**: Reference to file_organization_rules.md
- **Line 241**: Reference to core_agent_rules.md
- **Line 276**: Reference to file_organization_rules.md
- **Line 435**: Reference to core_agent_rules.md
- **Lines 493-494**: Lists all agent rules and coordination rules files

## Recommended Actions

1. Update all references in .shadow-local files to use the new consolidated files:
   - core_system_rules.md (replaces initialization_checklist.md, system_validation_rules.md, quality_gates.md, mode_validation_rules.md)
   - file_and_workspace_rules.md (replaces file_organization_rules.md, workspace_structure.md, git_commit_protocol.md)
   - wave_execution_protocol.md (replaces wave_coordination.md, integration_rules.md, mode_operations.md)

2. Update agent rules references to use the new consolidated agent rules structure

3. Update template references to use the new consolidated templates

4. Update the cloudflare-worker TypeScript files to reference the new file structure

5. Update CONSTITUTION.md to reflect the new simplified structure