/*
 * Copyright (c) 2024 Ignis AI Labs LLC.
 * All Rights Reserved.
 * 
 * This file is proprietary and confidential.
 * Unauthorized copying or distribution is prohibited.
 */

export const INITIALIZATION_CHECKLIST = `<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
See LICENSE-PROPRIETARY.md for full terms.
-->

# MANDATORY System Initialization Checklist

## 🚨 CRITICAL: This Checklist MUST Be Completed Before ANY Execution

**FAILURE TO COMPLETE = SYSTEM FAILURE**

This checklist ensures ALL critical system components are loaded and validated before any Shadow Clone execution begins. Skipping ANY item renders the entire system ineffective.

## Pre-Initialization Validation

### ✓ System File Verification
\`\`\`python
REQUIRED_SYSTEM_FILES = [
    # Core Rules
    ".shadow/agent_rules/core_agent_rules.md",
    ".shadow/coordination_rules/file_organization_rules.md",
    ".shadow/coordination_rules/wave_coordination.md",
    ".shadow/coordination_rules/workspace_structure.md",
    ".shadow/coordination_rules/initialization_checklist.md",  # This file
    
    # Execution Framework
    ".shadow/execution_phases/phase1_initialization.md",
    ".shadow/execution_phases/phase2_team_formation.md",
    ".shadow/execution_phases/phase3_wave_planning.md",
    ".shadow/execution_phases/phase4_deployment.md",
    ".shadow/execution_phases/phase5_execution.md",
    
    # Mode Configurations
    ".shadow/mode_configs/shadow-clone-feature.md",
    ".shadow/mode_configs/shadow-clone-debug.md",
    ".shadow/mode_configs/shadow-clone-refactor.md",
    ".shadow/mode_configs/shadow-clone-optimize.md",
    ".shadow/mode_configs/shadow-clone-audit.md",
    ".shadow/mode_configs/shadow-clone-research.md"
]

# MUST verify ALL files exist before proceeding
for file in REQUIRED_SYSTEM_FILES:
    if not exists(file):
        raise SystemError(f"CRITICAL: Missing required system file: {file}")
\`\`\`

## Phase 1: Core System Loading

### 1.1 Load Fundamental Rules
- [ ] Load \`core_agent_rules.md\` → ALL agents get these rules
- [ ] Load \`file_organization_rules.md\` → Wave-0 and file placement enforcement
- [ ] Load \`wave_coordination.md\` → Wave execution protocols
- [ ] Load \`workspace_structure.md\` → Directory organization rules
- [ ] Verify all rules loaded successfully

### 1.2 Validate Rule Content
- [ ] Confirm wave-0 requirements are present
- [ ] Verify file reservation protocols loaded
- [ ] Check quality standards are defined
- [ ] Ensure coordination protocols are complete

## Phase 2: Mode and Configuration Loading

### 2.1 Identify Project Mode
- [ ] Parse user request for mode indicators
- [ ] Default to appropriate mode if not specified
- [ ] Load corresponding mode configuration file
- [ ] Verify mode-specific wave-0 requirements

### 2.2 Load Role-Specific Rules
- [ ] Identify required agent roles for the mode
- [ ] Load each role's specific rules file
- [ ] Merge with core agent rules
- [ ] Validate no rule conflicts

## Phase 3: Workspace Initialization

### 3.1 Create Required Directories
- [ ] Verify/create \`.waves/\` directory
- [ ] Create \`.waves/wave-0/\` directory (MANDATORY)
- [ ] Initialize file tracking systems
- [ ] Set up coordination infrastructure

### 3.2 Initialize Tracking Files
- [ ] Create/verify \`file_registry.md\`
- [ ] Create/verify \`file_reservations.md\`
- [ ] Create/verify \`agent_registry.md\`
- [ ] Create/verify \`constitution.md\`

## Phase 4: Pre-Execution Validation

### 4.1 Wave-0 Enforcement
- [ ] Verify wave-0 directory exists
- [ ] Check for existing wave-0 completion marker
- [ ] If new project, enforce wave-0 execution first
- [ ] Block any implementation without wave-0 completion

### 4.2 System Integrity Checks
- [ ] All required modules loaded
- [ ] No critical rules missing
- [ ] File organization rules active
- [ ] Quality gates configured

## Phase 5: Agent Initialization

### 5.1 Agent Rule Injection
For EACH agent being deployed:
- [ ] Inject core_agent_rules.md
- [ ] Inject role-specific rules
- [ ] Inject mode configuration
- [ ] Add file organization reference
- [ ] Include this initialization checklist reference

### 5.2 Agent Validation
- [ ] Verify each agent has complete ruleset
- [ ] Confirm file organization understanding
- [ ] Check wave-0 awareness
- [ ] Validate coordination protocol knowledge

## Critical Validation Points

### 🛑 STOP Points - Cannot Proceed If:
1. **Missing System Files**: Any required .shadow/ file is missing
2. **No Wave-0 Directory**: .waves/wave-0/ doesn't exist for new projects
3. **Incomplete Rules**: Core rules not fully loaded
4. **Mode Not Identified**: No mode configuration loaded
5. **Agents Not Configured**: Agents lack required rule injections

### ⚠️ Warning Conditions:
1. Partial rule loading detected
2. Outdated rule versions found
3. Conflicting configurations
4. Missing optional enhancements

## Execution Sequence

\`\`\`python
def initialize_shadow_clone_system():
    """
    MANDATORY initialization sequence
    """
    # Step 1: Load this checklist
    checklist = load_file(".shadow/coordination_rules/initialization_checklist.md")
    
    # Step 2: Verify all system files
    verify_system_files(REQUIRED_SYSTEM_FILES)
    
    # Step 3: Load core rules
    core_rules = load_file(".shadow/agent_rules/core_agent_rules.md")
    file_org_rules = load_file(".shadow/coordination_rules/file_organization_rules.md")
    wave_coord_rules = load_file(".shadow/coordination_rules/wave_coordination.md")
    
    # Step 4: Identify and load mode
    mode = identify_project_mode(user_request)
    mode_config = load_file(f".shadow/mode_configs/shadow-clone-{mode}.md")
    
    # Step 5: Create workspace structure
    create_directory(".waves/wave-0/")  # MANDATORY
    
    # Step 6: Initialize agents with COMPLETE rulesets
    for agent in agents_to_deploy:
        agent.rules = merge_rules(
            core_rules,
            role_specific_rules[agent.role],
            mode_config,
            file_org_rules,
            wave_coord_rules
        )
    
    # Step 7: Validate everything
    if not validate_initialization():
        raise SystemError("Initialization validation failed!")
    
    # Step 8: Enforce wave-0 if new project
    if is_new_project() and not wave_0_complete():
        execute_wave_0_planning()
    
    return "System initialized successfully"
\`\`\`

## Post-Initialization Verification

### Runtime Checks (Continuous)
- Monitor file placement compliance
- Track wave-0 completion status
- Verify agent rule adherence
- Check coordination protocol usage

### Quality Enforcement
- Pre-wave validation gates
- Post-wave compliance checks
- File organization audits
- Rule violation tracking

## Failure Recovery

If initialization fails at ANY point:
1. **Log Failure**: Record exactly what failed
2. **Rollback**: Undo any partial initialization
3. **Report**: Clear error message to user
4. **Prevent Execution**: Block all agent activities
5. **Require Fix**: Demand issue resolution before retry

## Summary

**THIS CHECKLIST IS NOT OPTIONAL**

Every Shadow Clone execution MUST:
1. Load ALL required system files
2. Initialize complete rule sets
3. Create proper workspace structure
4. Enforce wave-0 planning
5. Validate everything before proceeding

**Remember**: The system's effectiveness depends on COMPLETE initialization. Partial loading = System failure.`;
