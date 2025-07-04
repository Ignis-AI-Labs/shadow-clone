# Shadow Clone Pipeline Verification

## System Architecture Overview

The Shadow Clone system has two primary execution paths:
1. **API Mode** (default) - Fetches files from CloudFlare Worker API
2. **Local Mode** - Reads files directly from `.shadow-local/` directory

## Entry Point
- **Main Orchestrator**: `shadow-clone-prompt.md`
- Triggered by: Loading the test file with execution parameters
- Key Parameter: `source=local` or `source=api`

## Execution Flow Pipeline

### 1. System Initialization
**Location**: `shadow-clone-prompt.md` lines 28-37
**Files Loaded**:
- ✅ `coordination_rules/core_system_rules.md` (was initialization_checklist.md)
- ✅ `coordination_rules/file_and_workspace_rules.md` (was file_organization_rules.md)
- ✅ `coordination_rules/wave_execution_protocol.md` (was wave_coordination.md)

**Issues Found**:
- Lines 90-97 still reference old file names in code blocks
- Need to update to new simplified structure

### 2. Team Configuration
**Location**: `shadow-clone-prompt.md` lines 106-121
**Files Loaded**:
- ❌ `templates/team_templates.md` - Should be `team-agent-templates.md`

### 3. Wave Planning
**Location**: `shadow-clone-prompt.md` lines 123-138
**Files Loaded**:
- ❌ `coordination_rules/wave_coordination.md` - Should be `wave_execution_protocol.md`

### 4. Agent Deployment
**Location**: `shadow-clone-prompt.md` lines 140-207
**Files Loaded**:
- ❌ `templates/agent_templates.md` - Should be `team-agent-templates.md`
- ❌ `agent_rules/core_agent_rules.md` - Should be `core_rules.md`
- ❌ `agent_rules/{role}_agent_rules.md` - Should map to new structure:
  - development → technical_rules.md
  - qa → technical_rules.md
  - devops → technical_rules.md
  - security → technical_rules.md
  - planning → analytical_rules.md
  - research → analytical_rules.md
  - audit → analytical_rules.md
  - documentation → analytical_rules.md
  - team_lead → leadership_rules.md
  - record_keeper → leadership_rules.md

### 5. Mode-Specific Execution
**Location**: `shadow-clone-prompt.md` lines 209-222
**Mode Configurations**: Located in `mode_configs/` directory
- `shadow-clone-plan.md`
- `shadow-clone-audit.md`
- `shadow-clone-feature.md`
- `shadow-clone-debug.md`
- `shadow-clone-optimize.md`
- `shadow-clone-refactor.md`
- `shadow-clone-research.md`

### 6. Integration & Quality
**Location**: `shadow-clone-prompt.md` lines 224-237
**Files Loaded**:
- ❌ `coordination_rules/integration_rules.md` - Should be part of `wave_execution_protocol.md`
- ❌ `coordination_rules/quality_gates.md` - Should be part of `core_system_rules.md`

### 7. Final Commit
**Location**: `shadow-clone-prompt.md` lines 239-250
**Files Loaded**:
- ❌ `coordination_rules/git_commit_protocol.md` - Should be part of `file_and_workspace_rules.md`

## Execution Phase Files

The `execution_phases/` directory contains documentation, not executable code:
- `phase1_analysis.md` - Documents analysis requirements
- `phase2_team_config.md` - Documents team formation
- `phase3_wave_planning.md` - Documents wave planning
- `phase4_deployment.md` - Documents agent deployment
- `phase5_execution.md` - Documents execution protocols
- `phase6_integration.md` - Documents integration steps
- `phase7_quality.md` - Documents quality assurance

These serve as specifications but are NOT directly loaded by the orchestrator.

## Critical Updates Needed

### 1. Update shadow-clone-prompt.md
- Fix all file references to use new simplified structure
- Update agent rule loading logic to use functional groupings
- Remove references to deleted files

### 2. Update Agent Rule Loading
Current pattern:
```python
role_rules = read_file(f"{base_path}/agent_rules/{agent.role}_agent_rules.md")
```

Should be:
```python
if agent.role in ["development", "qa", "devops", "security"]:
    role_rules = read_file(f"{base_path}/agent_rules/technical_rules.md")
elif agent.role in ["planning", "research", "audit", "documentation"]:
    role_rules = read_file(f"{base_path}/agent_rules/analytical_rules.md")
elif agent.role in ["team_lead", "record_keeper"]:
    role_rules = read_file(f"{base_path}/agent_rules/leadership_rules.md")
```

### 3. Template References
- Change `team_templates.md` → `team-agent-templates.md`
- Change `agent_templates.md` → `team-agent-templates.md`

### 4. Coordination Rule References
- Remove separate loading of integration_rules, quality_gates, git_commit_protocol
- These are now consolidated into the simplified files

## Verification Checklist

- [ ] All file paths in shadow-clone-prompt.md updated
- [ ] Agent rule loading logic updated for functional groupings
- [ ] Template references corrected
- [ ] Coordination rule consolidation reflected
- [ ] Mode configurations checked for old references
- [ ] Execution phase documentation updated
- [ ] Test mode file updated with correct paths