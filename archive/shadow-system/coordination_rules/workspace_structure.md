<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
See LICENSE-PROPRIETARY.md for full terms.
-->

# Workspace Structure Rules

## Enhanced Workspace Organization

```
workspace_dir/
├── README.md              # Project overview
├── .shadow/               # Shadow Clone system files
│   ├── agent_rules/      # Modular agent behavioral rules
│   │   ├── README.md     # Agent rules system documentation
│   │   ├── core_agent_rules.md # Universal rules for all agents
│   │   ├── team_lead_rules.md  # Rules for team lead agents
│   │   ├── development_agent_rules.md # Rules for dev agents
│   │   ├── qa_agent_rules.md   # Rules for QA agents
│   │   ├── security_agent_rules.md # Rules for security agents
│   │   └── [additional role-specific rules]
│   ├── coordination_rules/ # Wave and mode coordination rules
│   │   ├── initialization_checklist.md # MANDATORY startup checklist
│   │   ├── system_validation_rules.md # Continuous validation enforcement
│   │   ├── file_organization_rules.md # MANDATORY file placement rules
│   │   ├── wave_coordination.md # Wave execution and coordination protocols
│   │   ├── mode_operations.md   # Mode-specific operation procedures
│   │   ├── workspace_structure.md # This file - workspace organization
│   │   └── integration_rules.md # Integration protocols
│   ├── mode_configs/     # Modular configuration files
│   │   ├── shadow-clone-audit.md
│   │   ├── shadow-clone-feature.md
│   │   ├── shadow-clone-refactor.md
│   │   ├── shadow-clone-optimize.md
│   │   ├── shadow-clone-debug.md
│   │   └── shadow-clone-research.md
│   ├── templates/        # System templates and patterns
│   ├── SYSTEM_ORGANIZATION.md  # Comprehensive system overview
│   └── INITIALIZATION_SEQUENCE.md # Detailed startup sequence
├── .waves/                # Wave execution runtime files
│   ├── constitution.md   # Project constitution - central coordination authority
│   ├── wave_plan.md      # Wave assignments and timeline
│   ├── wave_status.md    # Overall wave progress
│   ├── file_registry.md  # Master registry of all project files
│   ├── file_reservations.md # Current file locks and reservations
│   ├── agent_registry.md # Registry of all sovereign agents and their domains
│   ├── convergence_schedule.md # Scheduled data convergence points
│   ├── diplomatic_log.md # Cross-team coordination and dependency resolution
│   ├── git_status.md     # Git branch management and safety
│   ├── safety_log.md     # Backup and safety operations log
│   ├── wave_0/           # Pre-execution planning phase (MANDATORY)
│   │   ├── project_analysis.md # Initial project understanding
│   │   ├── requirements.md # Extracted requirements
│   │   ├── architecture_plan.md # High-level architecture
│   │   ├── team_formation.md # Team and agent assignments
│   │   ├── wave_plan.md # Execution strategy
│   │   ├── risk_assessment.md # Risk analysis
│   │   └── setup_complete.md # Pre-execution checkpoint
│   ├── wave_1/           # Wave 1 coordination
│   │   ├── team_reports/ # Individual agent state files
│   │   ├── dependencies.md # Cross-team dependency tracking
│   │   └── integration_queue.md # Ready deliverables awaiting integration
│   ├── wave_2/           # Wave 2 coordination
│   │   ├── team_reports/ # Individual agent state files
│   │   ├── dependencies.md # Cross-team dependency tracking
│   │   └── integration_queue.md # Ready deliverables awaiting integration
│   └── instance_coordination.md # Multi-instance management
├── .backup/              # Safety backups (for existing codebases)
├── src/                  # Source code
├── tests/                # Test suites
├── docs/                 # Documentation
├── outputs/              # Final deliverables
└── [mode-specific directories as defined in modular configs]
```

## Directory Responsibilities

### .shadow/ - System Framework
- **agent_rules/**: Behavioral protocols injected into agent identities
- **coordination_rules/**: Wave coordination and mode operation procedures
  - **file_organization_rules.md**: MANDATORY file placement and wave-0 requirements
- **mode_configs/**: Project-type specific configurations and methodologies
- **templates/**: Standardized templates and patterns

### .waves/ - Execution Runtime
- **Constitutional files**: Central coordination and authority structures
- **Wave directories**: Individual wave coordination and state management
- **Registry files**: Agent and file tracking systems
- **Coordination logs**: Inter-team communication and dependency resolution

### Project Directories
- **src/**: Primary source code and implementation
- **tests/**: Test suites and quality assurance
- **docs/**: Documentation and specifications
- **outputs/**: Final deliverables and integration results
- **.backup/**: Safety backups for existing codebases

## Initialization Requirements

### Essential Files for System Operation
1. **Constitutional Authority**: `.waves/constitution.md` - Central coordination
2. **Wave Planning**: `.waves/wave_plan.md` - Wave assignments and timeline
3. **Agent Registry**: `.waves/agent_registry.md` - Sovereign agent tracking
4. **File Coordination**: `.waves/file_registry.md` and `.waves/file_reservations.md`
5. **Safety Systems**: `.waves/safety_log.md` and `.backup/` directory

### Module Loading Order
1. Load core agent rules for all agents
2. Load role-specific rules based on agent types
3. Load project-type rules based on mode
4. Initialize constitutional authority structure
5. Establish wave coordination infrastructure
6. Activate file reservation and coordination systems 