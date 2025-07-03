# Shadow Clone Local Mode Guide

## Purpose
This guide documents how to use Shadow Clone in local mode for testing and development without API dependencies.

## Local File Mappings

### Agent Rules
| API Path | Local Path |
|----------|------------|
| `/api/prompts/agent-rules/core_agent_rules` | `.shadow-local/agent_rules/core_agent_rules.md` |
| `/api/prompts/agent-rules/development_agent_rules` | `.shadow-local/agent_rules/development_agent_rules.md` |
| `/api/prompts/agent-rules/qa_agent_rules` | `.shadow-local/agent_rules/qa_agent_rules.md` |
| `/api/prompts/agent-rules/devops_agent_rules` | `.shadow-local/agent_rules/devops_agent_rules.md` |
| `/api/prompts/agent-rules/security_agent_rules` | `.shadow-local/agent_rules/security_agent_rules.md` |
| `/api/prompts/agent-rules/documentation_agent_rules` | `.shadow-local/agent_rules/documentation_agent_rules.md` |
| `/api/prompts/agent-rules/team_lead_rules` | `.shadow-local/agent_rules/team_lead_rules.md` |
| `/api/prompts/agent-rules/audit_agent_rules` | `.shadow-local/agent_rules/audit_agent_rules.md` |
| `/api/prompts/agent-rules/research_agent_rules` | `.shadow-local/agent_rules/research_agent_rules.md` |
| `/api/prompts/agent-rules/planning_agent_rules` | `.shadow-local/agent_rules/planning_agent_rules.md` |
| `/api/prompts/agent-rules/record_keeper_agent_rules` | `.shadow-local/agent_rules/record_keeper_agent_rules.md` |

### Mode Configurations
| API Path | Local Path |
|----------|------------|
| `/api/prompts/modes/audit` | `.shadow-local/mode_configs/shadow-clone-audit.md` |
| `/api/prompts/modes/debug` | `.shadow-local/mode_configs/shadow-clone-debug.md` |
| `/api/prompts/modes/feature` | `.shadow-local/mode_configs/shadow-clone-feature.md` |
| `/api/prompts/modes/optimize` | `.shadow-local/mode_configs/shadow-clone-optimize.md` |
| `/api/prompts/modes/refactor` | `.shadow-local/mode_configs/shadow-clone-refactor.md` |
| `/api/prompts/modes/research` | `.shadow-local/mode_configs/shadow-clone-research.md` |
| `/api/prompts/modes/plan` | `.shadow-local/mode_configs/shadow-clone-plan.md` |

### Coordination Rules
| API Path | Local Path |
|----------|------------|
| `/api/prompts/coordination-rules/initialization_checklist` | `.shadow-local/coordination_rules/initialization_checklist.md` |
| `/api/prompts/coordination-rules/system_validation_rules` | `.shadow-local/coordination_rules/system_validation_rules.md` |
| `/api/prompts/coordination-rules/file_organization_rules` | `.shadow-local/coordination_rules/file_organization_rules.md` |
| `/api/prompts/coordination-rules/wave_coordination` | `.shadow-local/coordination_rules/wave_coordination.md` |
| `/api/prompts/coordination-rules/integration_rules` | `.shadow-local/coordination_rules/integration_rules.md` |
| `/api/prompts/coordination-rules/quality_gates` | `.shadow-local/coordination_rules/quality_gates.md` |
| `/api/prompts/coordination-rules/mode_operations` | `.shadow-local/coordination_rules/mode_operations.md` |
| `/api/prompts/coordination-rules/workspace_structure` | `.shadow-local/coordination_rules/workspace_structure.md` |
| `/api/prompts/coordination-rules/constitution_protocol` | `.shadow-local/coordination_rules/constitution_protocol.md` |
| `/api/prompts/coordination-rules/git_commit_protocol` | `.shadow-local/coordination_rules/git_commit_protocol.md` |

### Templates
| API Path | Local Path |
|----------|------------|
| `/api/prompts/templates/agent_templates` | `.shadow-local/templates/agent_templates.md` |
| `/api/prompts/templates/team_templates` | `.shadow-local/templates/team_templates.md` |
| `/api/prompts/templates/wave-execution-plan-template` | `.shadow-local/templates/wave-execution-plan-template.md` |
| `/api/prompts/templates/master-project-plan-template` | `.shadow-local/templates/master-project-plan-template.md` |
| `/api/prompts/templates/planning-consolidation-template` | `.shadow-local/templates/planning-consolidation-template.md` |
| `/api/prompts/templates/security-audit-report-template` | `.shadow-local/templates/security-audit-report-template.md` |
| `/api/prompts/templates/vulnerability-report-template` | `.shadow-local/templates/vulnerability-report-template.md` |
| `/api/prompts/templates/risk-assessment-matrix-template` | `.shadow-local/templates/risk-assessment-matrix-template.md` |
| `/api/prompts/templates/compliance-matrix-template` | `.shadow-local/templates/compliance-matrix-template.md` |

### Execution Phases
| API Path | Local Path |
|----------|------------|
| `/api/prompts/execution-phases/phase1_analysis` | `.shadow-local/execution_phases/phase1_analysis.md` |
| `/api/prompts/execution-phases/phase2_team_config` | `.shadow-local/execution_phases/phase2_team_config.md` |
| `/api/prompts/execution-phases/phase3_wave_planning` | `.shadow-local/execution_phases/phase3_wave_planning.md` |
| `/api/prompts/execution-phases/phase4_deployment` | `.shadow-local/execution_phases/phase4_deployment.md` |
| `/api/prompts/execution-phases/phase5_execution` | `.shadow-local/execution_phases/phase5_execution.md` |
| `/api/prompts/execution-phases/phase6_integration` | `.shadow-local/execution_phases/phase6_integration.md` |
| `/api/prompts/execution-phases/phase7_quality` | `.shadow-local/execution_phases/phase7_quality.md` |
| `/api/prompts/execution-phases/wave_execution_protocol` | `.shadow-local/execution_phases/wave_execution_protocol.md` |

## Usage

### Command Format
```
Load /root/repos/shadow-clone/.shadow-local/shadow-clone-prompt.md and execute with mode=plan source=local
```

### Key Differences in Local Mode
1. **No API calls** - All content loaded from local files
2. **File reading** - Use Read tool to load rule content
3. **Agent deployment** - Include actual rule content in Task() prompts
4. **Path resolution** - All paths relative to repository root

### Implementation Notes
When `source=local`:
1. Replace all `fetch_from_api()` calls with `read_local_file()`
2. Map API endpoints to local file paths using the table above
3. Read file content and inject directly into agent prompts
4. No curl commands or API authentication needed

### Testing Protocol
1. Load the local shadow-clone prompt
2. Specify `source=local` in arguments
3. Execute test mode as normal
4. Verify no API calls are made
5. Check that all rules are properly injected