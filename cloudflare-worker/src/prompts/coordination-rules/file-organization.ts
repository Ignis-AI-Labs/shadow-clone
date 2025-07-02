/*
 * Copyright (c) 2024 Ignis AI Labs LLC.
 * All Rights Reserved.
 * 
 * This file is proprietary and confidential.
 * Unauthorized copying or distribution is prohibited.
 */

export const FILE_ORGANIZATION_RULES = `<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
See LICENSE-PROPRIETARY.md for full terms.
-->

# File Organization Rules - Master Reference

## 🎯 CRITICAL: Unified File Organization Protocol

**FUNDAMENTAL PRINCIPLE**: All agents, regardless of mode or wave, MUST follow these file organization rules to maintain system integrity and prevent conflicts.

## Wave Directory Structure

### Complete Wave Organization
\`\`\`
.waves/
├── wave-0/                    # Pre-execution setup and analysis
│   ├── project_analysis.md   # Initial project understanding
│   ├── requirements.md       # Extracted requirements
│   ├── architecture_plan.md  # High-level architecture decisions
│   ├── team_formation.md     # Team and agent assignments
│   ├── wave_plan.md         # Wave execution strategy
│   ├── risk_assessment.md    # Identified risks and mitigations
│   └── setup_complete.md     # Checkpoint before wave-1
├── wave-1/                    # First execution wave
│   ├── team_reports/         # Individual team deliverables
│   ├── dependencies.md       # Cross-team dependencies
│   └── integration_queue.md  # Ready for integration
├── wave-2/                    # Second execution wave
│   ├── team_reports/         # Individual team deliverables
│   ├── dependencies.md       # Cross-team dependencies
│   └── integration_queue.md  # Ready for integration
├── wave-3/                    # Third execution wave
│   ├── team_reports/         # Individual team deliverables
│   ├── dependencies.md       # Cross-team dependencies
│   └── integration_queue.md  # Ready for integration
├── FINAL_DELIVERABLES/        # Consolidated final outputs
│   ├── README.md             # Project overview
│   ├── architecture.md       # Final architecture
│   ├── deployment.md         # Deployment instructions
│   └── [project outputs]     # Actual deliverables
├── constitution.md            # Project constitutional authority
├── agent_registry.md          # All agents and their roles
├── file_registry.md           # Master file tracking
├── file_reservations.md       # Current file locks
├── convergence_schedule.md    # Coordination points
├── diplomatic_log.md          # Cross-team coordination
├── git_status.md              # Version control state
└── safety_log.md              # Backup and recovery log
\`\`\`

## Wave-0: Pre-Execution Organization

### Purpose of Wave-0
Wave-0 is the **mandatory pre-execution phase** where all planning, analysis, and setup activities occur BEFORE any implementation begins.

### Wave-0 Required Files
1. **project_analysis.md** - Initial understanding of the project
2. **requirements.md** - Extracted and organized requirements
3. **architecture_plan.md** - High-level design decisions
4. **team_formation.md** - Agent assignments and team structure
5. **wave_plan.md** - Execution strategy for subsequent waves
6. **risk_assessment.md** - Potential issues and mitigation strategies
7. **setup_complete.md** - Checkpoint confirming readiness for wave-1

### Wave-0 Rules
- **NO IMPLEMENTATION CODE** in wave-0
- **NO SOURCE FILES** created in wave-0
- **ONLY PLANNING DOCUMENTS** allowed
- **ALL AGENTS** must contribute to wave-0 analysis
- **MANDATORY COMPLETION** before wave-1 begins

## File Placement Rules

### 1. Document Type Rules
\`\`\`
Planning Documents      → .waves/wave-0/
Team Reports           → .waves/wave-N/team_reports/
Source Code            → src/ (NEVER in .waves/)
Tests                  → tests/ (NEVER in .waves/)
Documentation          → docs/ (project docs)
Configuration          → Project root or config/
Build Outputs          → dist/ or build/
Temporary Files        → .tmp/ or temp/
\`\`\`

### 2. Wave-Specific Rules
- **Wave-0**: ONLY planning and analysis documents
- **Wave-1 to N**: Team reports and coordination files ONLY
- **Source Files**: NEVER placed in .waves/ directory
- **Final Outputs**: Consolidated in FINAL_DELIVERABLES/

### 3. File Naming Conventions
\`\`\`
Planning Files:        {purpose}_plan.md
Team Reports:          {team_name}_report.md
State Files:           {agent_name}_state.md
Dependencies:          dependencies_{wave_number}.md
Integration:           integration_{component}.md
\`\`\`

## Agent File Access Rules

### Read Access
- **Constitutional Files**: All agents can read
- **Wave-0 Files**: All agents can read after completion
- **Team Reports**: Can read from same wave or previous waves
- **Source Files**: Can read any file with proper reservation

### Write Access
- **Own State File**: Always have write access
- **Team Reports**: Only team members can write
- **Reserved Files**: Exclusive write access when reserved
- **Wave-0 Files**: Write during pre-execution phase only

### Reservation Required
- **ALL source code files** (src/*, tests/*, etc.)
- **Configuration files** (*.json, *.yaml, etc.)
- **Documentation files** (docs/*, README.md)
- **NEVER for .waves/ files** (managed by system)

## Mode-Specific Organization

### Feature Mode
\`\`\`
.waves/wave-0/
├── feature_analysis.md      # Feature requirements breakdown
├── impact_assessment.md      # Code impact analysis
└── implementation_plan.md    # Step-by-step plan
\`\`\`

### Debug Mode
\`\`\`
.waves/wave-0/
├── issue_analysis.md         # Problem root cause analysis
├── reproduction_steps.md     # How to reproduce the issue
└── fix_strategy.md          # Proposed solution approach
\`\`\`

### Refactor Mode
\`\`\`
.waves/wave-0/
├── code_analysis.md         # Current code structure analysis
├── refactor_targets.md      # What needs refactoring
└── refactor_plan.md         # How to refactor safely
\`\`\`

### Audit Mode
\`\`\`
.waves/wave-0/
├── audit_scope.md           # What to audit
├── initial_findings.md      # Preliminary observations
└── audit_plan.md            # Systematic audit approach
\`\`\`

## Quality Enforcement

### Pre-Wave-1 Checkpoint
Before ANY implementation begins:
1. ✓ Wave-0 directory exists with all required files
2. ✓ Project analysis is complete and comprehensive
3. ✓ Requirements are clearly documented
4. ✓ Architecture decisions are made
5. ✓ Teams are formed and assigned
6. ✓ Wave execution plan is detailed
7. ✓ All agents have contributed to planning

### File Organization Violations
**AUTOMATIC FAILURE** conditions:
- Source code in .waves/ directory
- Missing wave-0 planning documents
- Implementation before planning completion
- Files outside proper directory structure
- Unregistered file modifications
- Bypassing reservation system

## Integration Rules

### How Files Flow Through Waves
1. **Wave-0**: Generate all planning documents
2. **Wave-1**: Read wave-0 plans, implement foundations
3. **Wave-2**: Read wave-1 outputs, build on foundations
4. **Wave-3**: Read wave-2 outputs, finalize and integrate
5. **FINAL**: Consolidate all outputs in FINAL_DELIVERABLES/

### Cross-Wave References
- Always use relative paths from project root
- Reference wave files as: \`.waves/wave-N/filename.md\`
- Reference source files as: \`src/path/to/file.ext\`
- Never use absolute paths

## Enforcement and Compliance

### Agent Injection
These rules are **AUTOMATICALLY INJECTED** into:
- All agent prompts via core_agent_rules.md
- All mode configurations
- All wave coordination protocols
- Quality gate validations

### Validation Checks
The system performs automatic validation:
- Pre-wave file structure verification
- Post-wave organization compliance
- Real-time file placement monitoring
- Final deliverable structure validation

### Non-Compliance Handling
1. **Warning**: First violation logged
2. **Block**: Second violation prevents progress
3. **Rollback**: Third violation triggers rollback
4. **Abort**: Persistent violations abort execution

## Summary for Agents

**REMEMBER**: 
- Wave-0 = Planning ONLY (no code)
- Waves 1-N = Implementation (with planning from wave-0)
- Source code NEVER goes in .waves/
- Always check file_reservations.md before modifying files
- Follow the structure or face system enforcement

**SUCCESS FORMULA**:
1. Plan thoroughly in wave-0
2. Implement systematically in waves 1-N
3. Keep files in proper directories
4. Respect the reservation system
5. Deliver excellence`;
