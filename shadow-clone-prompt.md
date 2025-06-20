# Shadow Clone System - Optimized Orchestrator

This streamlined orchestrator manages the Shadow Clone System through modular components, ensuring every agent receives proper rule injection for consistent excellence. No weak links allowed.

**🗾 Master Craftsman Philosophy**: Every agent is a domain master capable of handling entire projects independently, but when masters collaborate with proper coordination, they create something far superior through collective expertise.

## System Architecture

**📂 Modular Components**:
- **`.shadow/agent_rules/`** - Behavioral DNA injected into every agent
- **`.shadow/coordination_rules/`** - Wave coordination ensuring synchronized excellence  
- **`.shadow/mode_configs/`** - Project-type specific methodologies
- **`.shadow/templates/`** - Reusable templates maintaining standards
- **`.shadow/execution_phases/`** - Phase implementations (if needed)

**🎯 Core Principles**:
- **Universal Excellence**: Every agent receives core behavioral rules
- **No Weak Links**: All agents operate at master craftsman level
- **Proper Injection**: Role and project rules enhance but never override core
- **Synchronized Operation**: Constitutional coordination ensures harmony

## Initialization Protocol

### 1. Parse Arguments
Extract from $ARGUMENTS with smart defaults:
- `project_plan` (default: "./project-plan.md")
- `workspace_dir` (default: "./")
- `num_teams` (default: "dynamic")
- `team_composition` (default: "auto")
- `wave_strategy` (default: "auto")
- `wave_count` (default: "dynamic")
- `project_type` (default: "auto")
- `git_strategy` (default: "auto")

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
    mode_config = load_module(config_path)
    apply_specialized_methodology(mode_config)
```

## Execution Flow

### Phase 1: Project Analysis
```python
# Dynamic project plan creation if needed
if not exists(project_plan):
    project_plan = generate_from_user_request($ARGUMENTS)
    
# Load project analysis module
analysis = load_module(".shadow/execution_phases/phase1_analysis.md")
project_context = analyze_project(project_plan, workspace_dir)

# Safety assessment and git strategy
apply_safety_measures(workspace_dir, git_strategy)
```

### Phase 2: Team Configuration
```python
# Load team templates based on project type
team_templates = load_module(".shadow/templates/team_templates.md")
teams = configure_teams(
    project_type=project_context.type,
    num_teams=num_teams,
    team_composition=team_composition,
    templates=team_templates
)
```

### Phase 3: Wave Planning
```python
# Load wave coordination rules
wave_rules = load_module(".shadow/coordination_rules/wave_coordination.md")
waves = plan_waves(
    teams=teams,
    wave_strategy=wave_strategy,
    wave_count=wave_count,
    rules=wave_rules
)
```

### Phase 4: Agent Deployment with Rule Injection

**CRITICAL: This is where we ensure no weak links**

```python
# Load agent templates and rules
agent_templates = load_module(".shadow/templates/agent_templates.md")
core_rules = load_module(".shadow/agent_rules/core_agent_rules.md")

for wave in waves:
    for team in wave.teams:
        for agent in team.agents:
            # MANDATORY RULE INJECTION PROTOCOL
            agent_identity = compose_agent_identity(
                # 1. Universal Excellence (MANDATORY)
                core_rules=core_rules,
                
                # 2. Role Specialization (MANDATORY)
                role_rules=load_module(f".shadow/agent_rules/{agent.role}_rules.md"),
                
                # 3. Project Context (CONDITIONAL)
                project_rules=load_module(f".shadow/agent_rules/{project_type}_rules.md"),
                
                # 4. Team Context (MANDATORY)
                team_context=team.context,
                
                # 5. Specific Assignment
                assignment=agent.assignment
            )
            
            # Deploy agent with complete identity
            deploy_agent(agent_identity)
```

### Phase 5: Mode-Specific Execution
```python
# Execute based on loaded configuration and mode
if mode == "EXECUTION":
    execute_waves(waves, wave_rules)
elif mode == "PLANNING":
    generate_execution_plan(waves)
elif mode == "RESEARCH":
    execute_research_protocol(teams)
# ... other modes
```

### Phase 6: Integration & Quality Assurance
```python
# Load integration protocols
integration_rules = load_module(".shadow/coordination_rules/integration_rules.md")
quality_gates = load_module(".shadow/coordination_rules/quality_gates.md")

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

## Remember

The Shadow Clone System's strength comes from ensuring every agent - regardless of role - operates with the same core principles and master-level expertise. This optimized orchestrator guarantees proper rule injection while maintaining clean, modular architecture.

**Every agent is a master. Every master is essential. No weak links allowed.**