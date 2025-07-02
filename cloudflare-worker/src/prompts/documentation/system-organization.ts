/*
 * Copyright (c) 2024 Ignis AI Labs LLC.
 * All Rights Reserved.
 * 
 * This file is proprietary and confidential.
 * Unauthorized copying or distribution is prohibited.
 */

export const SYSTEM_ORGANIZATION = `<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
See LICENSE-PROPRIETARY.md for full terms.
-->

# Shadow Clone System Organization

## Overview

The Shadow Clone system is meticulously organized to ensure consistent, high-quality execution across all modes and agent types. This document provides a comprehensive overview of the system's organizational structure and enforcement mechanisms.

## Core Organizational Principles

### 1. **Wave-0 First Philosophy**
- ALL projects begin with mandatory pre-execution planning in wave-0
- NO implementation occurs before wave-0 completion
- Planning documents establish the foundation for all subsequent work

### 2. **File Organization Enforcement**
- Strict directory structure enforced by \`file_organization_rules.md\`
- Source code NEVER placed in \`.waves/\` directory
- All planning documents organized in \`.waves/wave-0/\`
- Implementation deliverables properly distributed across project directories

### 3. **Agent Behavioral Consistency**
- Core rules injected into ALL agents via \`core_agent_rules.md\`
- Mode-specific rules layered on top of core rules
- File reservation system prevents all conflicts
- Quality standards enforced at every level

## System Directory Structure

\`\`\`
shadow-clone/
├── .shadow/                          # System framework (protected)
│   ├── agent_rules/                 # Agent behavioral protocols
│   │   ├── core_agent_rules.md     # Universal rules (ALL agents)
│   │   ├── team_lead_rules.md      # Team leadership protocols
│   │   ├── development_agent_rules.md
│   │   ├── qa_agent_rules.md
│   │   ├── security_agent_rules.md
│   │   └── [role-specific rules]
│   ├── coordination_rules/          # System coordination protocols
│   │   ├── file_organization_rules.md  # MASTER file placement rules
│   │   ├── wave_coordination.md        # Wave execution protocols
│   │   ├── workspace_structure.md      # Directory organization
│   │   ├── integration_rules.md        # Integration protocols
│   │   └── quality_gates.md            # Quality enforcement
│   ├── mode_configs/                # Mode-specific configurations
│   │   ├── shadow-clone-feature.md     # Feature development mode
│   │   ├── shadow-clone-debug.md       # Debug mode
│   │   ├── shadow-clone-refactor.md    # Refactoring mode
│   │   ├── shadow-clone-optimize.md    # Optimization mode
│   │   ├── shadow-clone-audit.md       # Security audit mode
│   │   └── shadow-clone-research.md    # Research mode
│   ├── execution_phases/            # System execution pipeline
│   │   ├── phase1_initialization.md
│   │   ├── phase2_team_formation.md
│   │   ├── phase3_wave_planning.md
│   │   ├── phase4_deployment.md
│   │   └── phase5_execution.md
│   └── templates/                   # System templates
├── .waves/                          # Execution runtime (dynamic)
│   ├── wave-0/                     # MANDATORY pre-execution
│   ├── wave-1/                     # First implementation wave
│   ├── wave-2/                     # Second implementation wave
│   ├── wave-3/                     # Third implementation wave
│   └── FINAL_DELIVERABLES/         # Consolidated outputs
└── [project directories]            # Actual implementation files

\`\`\`

## Rule Injection Hierarchy

### 1. Core Rules (All Agents)
- Loaded from: \`.shadow/agent_rules/core_agent_rules.md\`
- Includes: File organization reference, quality standards, coordination protocols
- Applied to: EVERY agent regardless of role or mode

### 2. Role-Specific Rules
- Loaded from: \`.shadow/agent_rules/{role}_agent_rules.md\`
- Includes: Role-specific behaviors and responsibilities
- Applied to: Agents assigned to specific roles

### 3. Mode-Specific Configuration
- Loaded from: \`.shadow/mode_configs/shadow-clone-{mode}.md\`
- Includes: Mode objectives, wave structure, deliverables
- Applied to: All agents operating in that mode

### 4. Coordination Rules
- Loaded from: \`.shadow/coordination_rules/\`
- Includes: File organization, wave coordination, quality gates
- Applied to: System-wide coordination and validation

## Wave-0 Enforcement

### Required Wave-0 Files
Every project MUST create these files in \`.waves/wave-0/\`:

1. **project_analysis.md** - Understanding of the project
2. **requirements.md** - Extracted requirements
3. **architecture_plan.md** - High-level design
4. **team_formation.md** - Agent assignments
5. **wave_plan.md** - Execution strategy
6. **risk_assessment.md** - Risk analysis
7. **setup_complete.md** - Completion checkpoint

### Mode-Specific Wave-0 Files
Each mode adds specific planning documents:

- **Feature Mode**: feature_analysis.md, impact_assessment.md, security_review.md
- **Debug Mode**: issue_analysis.md, root_cause_analysis.md, debug_strategy.md
- **Refactor Mode**: code_analysis.md, refactor_goals.md, risk_assessment.md
- **Optimize Mode**: performance_baseline.md, optimization_scope.md, metrics_plan.md
- **Audit Mode**: audit_scope.md, vulnerability_analysis.md, security_frameworks.md
- **Research Mode**: research_objectives.md, methodology.md, domain_analysis.md

## Quality Enforcement Mechanisms

### 1. Pre-Execution Validation
- Wave-0 completion verified before wave-1
- All required planning documents must exist
- Quality of planning assessed against standards

### 2. File Placement Validation
- Automatic checks for proper file organization
- Source code placement verified
- Planning document structure validated

### 3. Agent Compliance Monitoring
- File reservation system enforcement
- Quality standard compliance tracking
- Coordination protocol adherence

### 4. Post-Wave Quality Gates
- Deliverable completeness verification
- Integration readiness assessment
- Documentation quality checks

## System Integration Points

### 1. Agent Initialization
\`\`\`
1. Load core_agent_rules.md
2. Load role-specific rules
3. Load mode configuration
4. Load file_organization_rules.md reference
5. Initialize agent with complete ruleset
\`\`\`

### 2. Wave Execution
\`\`\`
1. Verify wave-0 completion (if wave > 0)
2. Load wave coordination rules
3. Initialize file reservation system
4. Execute wave with monitoring
5. Validate against quality gates
\`\`\`

### 3. Mode Selection
\`\`\`
1. Identify project mode
2. Load mode-specific configuration
3. Apply mode-specific wave-0 requirements
4. Configure agents for mode objectives
\`\`\`

## Continuous Improvement

### System Evolution
- Rules updated based on execution feedback
- New modes added as needed
- Quality standards continuously raised
- Coordination protocols refined

### Documentation Maintenance
- All changes documented in appropriate files
- Version control for rule modifications
- Impact analysis for system changes
- Backward compatibility considerations

## Summary

The Shadow Clone system's organization ensures:

1. **Consistent Planning**: Wave-0 enforces thorough planning before implementation
2. **Clear Structure**: File organization rules maintain project clarity
3. **Quality Excellence**: Multiple enforcement mechanisms ensure high standards
4. **Scalable Execution**: Modular rules support various project types
5. **Conflict Prevention**: File reservation system eliminates conflicts

This organizational structure is the foundation of Shadow Clone's ability to deliver complex projects with teams of AI agents working in perfect coordination.`;
