# Shadow Clone System Flow Map

## Overview
This document maps the complete flow of the Shadow Clone system, showing how all components connect and which files are called in each mode.

## Directory Structure

```
.shadow-local/
├── agent_rules/              # Simplified agent behavior rules
│   ├── core_rules.md        # Universal rules (all agents)
│   ├── technical_rules.md   # Dev, QA, DevOps, Security
│   ├── analytical_rules.md  # Planning, Research, Audit, Docs
│   ├── leadership_rules.md  # Team Lead, Record Keeper
│   └── agent_template.md    # Template for new agents
│
├── coordination_rules/       # Simplified system coordination
│   ├── core_system_rules.md          # Initialization, validation, quality
│   ├── file_and_workspace_rules.md   # File org, git operations
│   ├── wave_execution_protocol.md    # Wave planning and execution
│   └── constitution_protocol.md      # Context preservation
│
├── templates/               # Simplified document templates
│   ├── project-execution-template.md    # Planning and execution
│   ├── team-agent-templates.md         # Agent configurations
│   ├── security-assessment-template.md  # Security documentation
│   ├── quality-validation-template.md   # Quality assurance
│   ├── compliance-remediation-template.md # Compliance planning
│   └── automation-scan-template.md      # Tool results
│
├── execution_phases/        # 7-phase execution model
│   ├── phase1_analysis.md
│   ├── phase2_team_formation.md
│   ├── phase3_wave_planning.md
│   ├── phase4_setup.md
│   ├── phase5_execution.md
│   ├── phase6_integration.md
│   └── phase7_quality.md
│
├── testing/                 # Test configurations
│   └── test_mode.md        # Test execution protocols
│
└── shadow-clone-prompt.md   # Main orchestration prompt

```

## Mode Flows

### 1. Planning Mode
**Purpose**: Create comprehensive project plan without implementation

**File Flow**:
```
START → shadow-clone-prompt.md
  ↓
Load coordination_rules/core_system_rules.md
  ↓
Load coordination_rules/wave_execution_protocol.md
  ↓
Execute phases 1-3 only:
  - phase1_analysis.md
  - phase2_team_formation.md  
  - phase3_wave_planning.md
  ↓
Use templates/project-execution-template.md
  ↓
Generate .waves/wave-0/ planning documents
```

### 2. Execution Mode
**Purpose**: Full implementation with all phases

**File Flow**:
```
START → shadow-clone-prompt.md
  ↓
Load all coordination_rules/*.md
  ↓
Execute all 7 phases sequentially:
  - phase1_analysis.md
  - phase2_team_formation.md
  - phase3_wave_planning.md
  - phase4_setup.md
  - phase5_execution.md
  - phase6_integration.md
  - phase7_quality.md
  ↓
For each agent, load:
  - agent_rules/core_rules.md
  - agent_rules/[function]_rules.md
  ↓
Use relevant templates as needed
  ↓
Update constitution_protocol.md
```

### 3. Audit Mode
**Purpose**: Security assessment and compliance review

**File Flow**:
```
START → shadow-clone-prompt.md
  ↓
Load coordination_rules/core_system_rules.md
  ↓
Load agent_rules/analytical_rules.md (Audit section)
  ↓
Load agent_rules/technical_rules.md (Security section)
  ↓
Use templates:
  - security-assessment-template.md
  - compliance-remediation-template.md
  - automation-scan-template.md
  ↓
Generate audit report
```

### 4. Resume Mode
**Purpose**: Continue from previous state

**File Flow**:
```
START → shadow-clone-prompt.md
  ↓
Load CONSTITUTION.md (check previous state)
  ↓
Load coordination_rules/constitution_protocol.md
  ↓
Identify last completed phase
  ↓
Resume from appropriate phase file
  ↓
Continue normal execution flow
```

### 5. Status Mode
**Purpose**: Report current project state

**File Flow**:
```
START → shadow-clone-prompt.md
  ↓
Read CONSTITUTION.md
  ↓
Check .waves/ directory structure
  ↓
Report:
  - Current phase
  - Completion percentage
  - Active agents
  - Blockers
```

### 6. Health Mode
**Purpose**: System diagnostics

**File Flow**:
```
START → shadow-clone-prompt.md
  ↓
Load coordination_rules/core_system_rules.md
  ↓
Check all required files exist
  ↓
Validate:
  - File structure
  - Rule accessibility
  - Template availability
  - Phase file integrity
```

### 7. Repair Mode
**Purpose**: Fix system issues

**File Flow**:
```
START → shadow-clone-prompt.md
  ↓
Run health check first
  ↓
Load coordination_rules/file_and_workspace_rules.md
  ↓
Identify issues
  ↓
Apply fixes:
  - Restore missing files
  - Fix permissions
  - Rebuild structure
  - Update references
```

## Agent Creation Pipeline

### Standard Agent Creation Flow:
```
1. Determine agent type needed
     ↓
2. Load agent_rules/core_rules.md (always)
     ↓
3. Load functional rules:
   - Technical role → agent_rules/technical_rules.md
   - Analytical role → agent_rules/analytical_rules.md
   - Leadership role → agent_rules/leadership_rules.md
     ↓
4. Add specific task assignment
     ↓
5. Inject into agent identity
```

## Critical File Dependencies

### Files That Must Always Exist:
1. `shadow-clone-prompt.md` - Main orchestrator
2. `agent_rules/core_rules.md` - Universal agent behavior
3. `coordination_rules/core_system_rules.md` - System requirements
4. `coordination_rules/file_and_workspace_rules.md` - File management
5. All 7 `execution_phases/*.md` files - Phase definitions

### Files Created During Execution:
1. `.waves/wave-0/*.md` - Planning documents
2. `.waves/constitution.md` - Project memory
3. `.waves/wave-N/*.md` - Wave-specific artifacts
4. Agent state files (as needed)

## Update Requirements

### Files Needing Updates for New Structure:
1. **shadow-clone-prompt.md** - Update all file references
2. **execution_phases/*.md** - Update coordination rule references
3. **CONSTITUTION.md** - Update file lists
4. **cloudflare-worker/src/prompts/` .ts files** - Update hardcoded paths

### Reference Updates Needed:
- OLD: `coordination_rules/initialization_checklist.md`
- NEW: `coordination_rules/core_system_rules.md`

- OLD: `coordination_rules/file_organization_rules.md`
- NEW: `coordination_rules/file_and_workspace_rules.md`

- OLD: `coordination_rules/wave_coordination.md`
- NEW: `coordination_rules/wave_execution_protocol.md`

- OLD: `agent_rules/[role]_agent_rules.md`
- NEW: `agent_rules/[function]_rules.md`

- OLD: `templates/[many specific templates].md`
- NEW: `templates/[6 consolidated templates].md`

## Testing Checklist

### Verify Each Mode:
- [ ] Planning mode creates wave-0 documents
- [ ] Execution mode runs all 7 phases
- [ ] Resume mode correctly loads state
- [ ] Audit mode generates security report
- [ ] Status mode shows accurate state
- [ ] Health mode validates structure
- [ ] Repair mode fixes issues

### Verify File Loading:
- [ ] Coordination rules load correctly
- [ ] Agent rules inject properly
- [ ] Templates are accessible
- [ ] Phase files execute in order

### Verify Integrations:
- [ ] CloudFlare worker serves correct files
- [ ] Git operations follow new rules
- [ ] Constitution updates properly
- [ ] File reservations work

This map provides a complete view of how the Shadow Clone system flows through different modes and which files are involved at each step.