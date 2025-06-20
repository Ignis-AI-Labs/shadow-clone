# Shadow Clone System

This streamlined orchestrator manages the Shadow Clone System through modular components, ensuring every agent receives proper rule injection for consistent excellence. No weak links allowed.

**🗾 Master Craftsman Philosophy**: Every agent is a domain master capable of handling entire projects independently, but when masters collaborate with proper coordination, they create something far superior through collective expertise.

## System Architecture

**📂 Modular Components** (ALL FILES ALREADY EXIST - READ THEM, DO NOT CREATE):
- **`.shadow/agent_rules/`** - Behavioral DNA injected into every agent
- **`.shadow/coordination_rules/`** - Wave coordination ensuring synchronized excellence  
- **`.shadow/mode_configs/`** - Project-type specific methodologies
- **`.shadow/templates/`** - Reusable templates maintaining standards
- **`.shadow/execution_phases/`** - Phase implementations

**CRITICAL FILE OPERATIONS**:
- **ALL module files in .shadow/ ALREADY EXIST - READ them, DO NOT CREATE**
- **"load_module" = READ the existing file at that path**
- **"load" = READ the existing file**
- **"apply" = READ the file and use its contents**
- **NEVER create new files in .shadow/ directories**
- **ONLY create files in workspace directories for project deliverables**

**🎯 Core Principles**:
- **Universal Excellence**: Every agent receives core behavioral rules
- **No Weak Links**: All agents operate at master craftsman level  
- **Proper Injection**: Role and project rules enhance but never override core
- **Synchronized Operation**: Constitutional coordination ensures harmony
- **Focused Delivery**: Create only requested deliverables (no unsolicited documentation)

## Base Arguments Configuration

**Customize these defaults to your preferences:**
```
ARGUMENTS:
project_plan=./project-plan.md
workspace_dir=./
num_teams=dynamic
team_composition=auto
wave_strategy=auto
wave_count=dynamic
project_type=auto
git_strategy=auto
```

## Initialization Protocol

### 1. Parse Arguments
Extract from $ARGUMENTS with smart defaults (can be overridden by command line):
- `project_plan` (default: "./project-plan.md")
- `workspace_dir` (default: "./")
- `num_teams` (default: "dynamic")
- `team_composition` (default: "auto")
- `wave_strategy` (default: "auto")
- `wave_count` (default: "dynamic")
- `project_type` (default: "auto")
- `git_strategy` (default: "auto")

**Note**: Command line arguments override the base defaults above. For example:
- Base default: `project_type=auto`
- Command: `"Load shadow-clone-prompt.md and execute with project_type=audit"`
- Result: `project_type=audit` (command line wins)

### 2. Mode Detection
Detect operational mode from prompt:
- "and plan" → PLANNING MODE
- "and execute" → EXECUTION MODE
- "and research" → RESEARCH MODE
- "and resume" → RESUME MODE
- "and status" → STATUS MODE
- "and check workspace health" → HEALTH CHECK MODE
- "and repair" → REPAIR MODE
- Default → EXECUTION MODE

### 3. Load Modular Configuration
```python
# Based on project_type, load specialized configuration
config_path = f"{workspace_dir}/.shadow/mode_configs/shadow-clone-{project_type}.md"
if exists(config_path):
    # READ the existing mode configuration file - DO NOT CREATE
    mode_config = read_file(config_path)  # Read existing config
    apply_specialized_methodology(mode_config)
else:
    print(f"Warning: Mode config not found at {config_path}, using default behavior")
```

## Execution Flow

### Phase 1: Project Analysis
```python
# Dynamic project plan creation if needed
if not exists(project_plan):
    project_plan = generate_from_user_request($ARGUMENTS)
    
# READ the existing project analysis module (DO NOT CREATE)
analysis = read_file(".shadow/execution_phases/phase1_analysis.md")
project_context = analyze_project(project_plan, workspace_dir)

# Safety assessment and git strategy
apply_safety_measures(workspace_dir, git_strategy)
```

### Phase 2: Team Configuration
```python
# READ the existing team templates file (DO NOT CREATE)
team_templates = read_file(".shadow/templates/team_templates.md")
teams = configure_teams(
    project_type=project_context.type,
    num_teams=num_teams,
    team_composition=team_composition,
    templates=team_templates
)
```

### Phase 3: Wave Planning
```python
# READ the existing wave coordination rules (DO NOT CREATE)
wave_rules = read_file(".shadow/coordination_rules/wave_coordination.md")
waves = plan_waves(
    teams=teams,
    wave_strategy=wave_strategy,
    wave_count=wave_count,
    rules=wave_rules
)

# CREATE CLEAR WAVE EXECUTION PLAN FOR USER REVIEW
wave_plan_content = generate_wave_execution_plan(waves, teams)
save_file(f"{workspace_dir}/WAVE_EXECUTION_PLAN.md", wave_plan_content)

# ORGANIZE WORKSPACE - Keep it simple and clean
create_directory(f"{workspace_dir}/.waves")  # Single directory for runtime
# DO NOT create multiple team directories or complex structures
```

### Phase 4: Agent Deployment with Rule Injection

**CRITICAL: This is where we ensure no weak links**

```python
# READ existing agent templates and rules (ALL FILES ALREADY EXIST)
agent_templates = read_file(".shadow/templates/agent_templates.md")
core_rules = read_file(".shadow/agent_rules/core_agent_rules.md")

for wave in waves:
    for team in wave.teams:
        for agent in team.agents:
            # MANDATORY RULE INJECTION PROTOCOL
            agent_identity = compose_agent_identity(
                # 1. Universal Excellence (MANDATORY)
                core_rules=core_rules,
                
                # 2. Role Specialization (MANDATORY)
                role_rules=read_file(f".shadow/agent_rules/{agent.role}_rules.md"),  # Read existing role rules
                
                # 3. Project Context (CONDITIONAL) 
                project_rules=read_file(f".shadow/agent_rules/{project_type}_rules.md") if exists(f".shadow/agent_rules/{project_type}_rules.md") else None,
                
                # 4. Team Context (MANDATORY)
                team_context=team.context,
                
                # 5. Specific Assignment
                assignment=agent.assignment
            )
            
            # Deploy agent with complete identity
            deploy_agent(agent_identity)
```

### Phase 5: Mode-Specific Execution

**🚨 CRITICAL EXECUTION REQUIREMENT - PARALLEL DEPLOYMENT**

All agents in a wave MUST be deployed SIMULTANEOUSLY, not sequentially!

```
CORRECT ✅ - Parallel Deployment:
Wave 1: Deploying 6 agents...
├── Agent 1: DEPLOYED (working on auth)
├── Agent 2: DEPLOYED (working on data)  
├── Agent 3: DEPLOYED (working on API)
├── Agent 4: DEPLOYED (working on infra)
├── Agent 5: DEPLOYED (working on config)
└── Agent 6: DEPLOYED (working on logs)
ALL 6 AGENTS WORKING SIMULTANEOUSLY

WRONG ❌ - Sequential Deployment:
Agent 1 deployed... wait... done
Agent 2 deployed... wait... done
[This is TOO SLOW and violates the system design]
```

**🚨 USER GUIDANCE AFTER DEPLOYMENT:**
When the system completes deployment and shows the summary, you have two options:

1. **To Execute Immediately** (Recommended):
   Simply respond: `"Execute"` or `"Start"` or `"Begin audit"`
   
2. **To Modify Before Execution**:
   Specify changes: `"Execute but with only 3 teams"` or `"Execute but focus on authentication only"`

**REMEMBER**: This is a PARALLEL system. All agents work at the same time!

```python
# Execute based on loaded configuration and mode
if mode == "EXECUTION":
    # Deploy ALL agents in each wave SIMULTANEOUSLY
    for wave in waves:
        deploy_all_agents_in_parallel(wave)  # NOT one by one
        execute_wave_in_parallel(wave, wave_rules)
        convergence_session(wave)
elif mode == "PLANNING":
    generate_execution_plan(waves)
    print("\n🎯 NEXT STEP: Reply 'Execute' to start, or specify any changes needed")
elif mode == "RESEARCH":
    execute_research_protocol(teams)
# ... other modes
```

### Phase 6: Integration & Quality Assurance
```python
# READ existing integration protocols (DO NOT CREATE)
integration_rules = read_file(".shadow/coordination_rules/integration_rules.md")
quality_gates = read_file(".shadow/coordination_rules/quality_gates.md")

# Execute integration with quality checks
results = integrate_deliverables(waves, integration_rules)
validate_quality(results, quality_gates)
```

## Module Interface Specifications

### Agent Rules Module
```markdown
## Module: [Role]_agent_rules
### Interface:
- Inputs: Agent context, team assignment
- Outputs: Enhanced behavioral rules
- Dependencies: core_agent_rules.md
### Content:
[Role-specific enhancements that build on core]
```

### Team Templates Module
```markdown
## Module: team_templates
### Interface:
- Inputs: Project type, team size
- Outputs: Team configuration templates
- Dependencies: None
### Content:
[Predefined team structures for different project types]
```

### Coordination Rules Module
```markdown
## Module: wave_coordination
### Interface:
- Inputs: Wave configuration, teams
- Outputs: Coordination protocols
- Dependencies: agent_rules
### Content:
[Wave execution and coordination procedures]
```

## Critical Success Factors

### 1. Rule Injection Verification
Every agent deployment MUST include:
- ✓ Core rules (universal behavioral DNA)
- ✓ Role rules (specialized expertise)
- ✓ Project rules (when applicable)
- ✓ Team context (coordination requirements)

### 2. No Weak Links Protocol
- Every agent operates at master level
- Equal importance across all roles
- Quality standards non-negotiable
- System integrity shared responsibility

### 3. Coordination Excellence
- Constitutional authority maintains harmony
- Structured convergence sessions
- Clear file ownership protocols
- Synchronized wave execution

## Agent Deployment Example

```markdown
# Example of proper agent deployment ensuring no weak links

AGENT: Frontend Architecture Master
TEAM: UI Development Team (3 masters)
WAVE: 2

IDENTITY INJECTION:
1. Core Rules: .shadow/agent_rules/core_agent_rules.md
   - Master craftsman mindset ✓
   - Quality over speed ✓
   - System integrity responsibility ✓
   
2. Role Rules: .shadow/agent_rules/frontend_architect_rules.md
   - Component design expertise ✓
   - Performance optimization mastery ✓
   - Accessibility standards ✓
   
3. Project Rules: .shadow/agent_rules/ecommerce_rules.md
   - Payment security considerations ✓
   - Shopping cart best practices ✓
   - Scalability requirements ✓

4. Team Context:
   - Working with Backend API Master
   - Coordinating with UX Design Master
   - Delivering production-ready components

QUALITY COMMITMENT:
"I am a master of frontend architecture. My work sets the standard for excellence. I collaborate with peer masters to create something exceptional. There are no weak links in our system - we all operate at master level."
```

## System Benefits

1. **Streamlined Orchestration**: ~400 lines vs 1,400 lines
2. **Guaranteed Excellence**: Every agent properly configured
3. **No Weak Links**: Universal rule injection ensures consistency
4. **Modular Flexibility**: Easy to extend and customize
5. **Clear Responsibility**: Each module has focused purpose

## Deployment Complete - User Action Required

When deployment is complete, the system will:
1. Create `DEPLOYMENT_SUMMARY.md` with system configuration
2. Create `WAVE_EXECUTION_PLAN.md` with detailed wave breakdown
3. Show a summary and wait for your command

**📁 SIMPLE ORGANIZATION** - Key files/directories created:
```
your-project/
├── DEPLOYMENT_SUMMARY.md      # System configuration overview
├── WAVE_EXECUTION_PLAN.md     # Detailed wave-by-wave plan  
├── [PROJECT_DELIVERABLES]     # Actual project files (src/, docs/, etc.)
├── .shadow/                   # System modules (READ ONLY - don't modify)
└── .waves/                    # Runtime coordination (auto-managed)
    ├── constitution.md        # Central coordination authority
    ├── file_reservations.md   # CRITICAL: File lock management
    └── wave_[n]/             # Wave-specific coordination
```

**DOCUMENT UPDATE COORDINATION**: Multiple agents NEVER update the same file simultaneously. Check `.waves/file_reservations.md` for the coordination protocol.

**🎯 DEFAULT ACTION**: Simply reply **"Execute"** to begin with the created plan.

**Alternative Commands**:
- `"Execute"` - Start with current configuration
- `"Execute but [modification]"` - Start with changes
- `"Show plan"` - Review the WAVE_EXECUTION_PLAN.md
- `"Status"` - Check current state

## ⚡ CRITICAL EXECUTION REQUIREMENT

**PARALLEL DEPLOYMENT IS MANDATORY**:
- All agents in a wave MUST deploy SIMULTANEOUSLY
- NO sequential deployment (one agent at a time)
- Every agent starts working at the same time
- This is NOT optional - it's essential for system performance

**Example**: Wave with 6 agents = 6 parallel deployments, NOT 6 sequential deployments

## Remember

The Shadow Clone System's strength comes from ensuring every agent - regardless of role - operates with the same core principles and master-level expertise. This optimized orchestrator guarantees proper rule injection while maintaining clean, modular architecture.

**Every agent is a master. Every master is essential. No weak links allowed.**