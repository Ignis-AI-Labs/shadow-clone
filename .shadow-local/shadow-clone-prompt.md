<!--
LOCAL VERSION FOR TESTING ONLY
This version reads from local files instead of API
-->

# Shadow Clone System - Local Version

This LOCAL version of the Shadow Clone orchestrator always loads components from local files in the `.shadow-local/` directory. This version is for testing and development only.

**🗾 Master Craftsman Philosophy**: Every agent is a domain master capable of handling entire projects independently, but when masters collaborate with proper coordination, they create something far superior through collective expertise.

## 🚨 CRITICAL: Local Mode Configuration

**This is the LOCAL version** - Always uses local files:
```python
# LOCAL VERSION - Fixed configuration
base_path = "/root/repos/shadow-clone/.shadow-local"
load_method = read_local_file
source_mode = "local"  # Always local for this version
```

## 🚨 CRITICAL: Mandatory Initialization Sequence

**BEFORE ANY EXECUTION**, the system MUST:
1. Load the system_core_rules.md from local files or API
2. Verify ALL critical system components exist
3. Create wave-0 directory for planning
4. Initialize all tracking systems
5. Validate everything is properly configured

**FAILURE TO INITIALIZE = SYSTEM FAILURE**

## 🔑 SACRED RULE: Record Keeper is Mandatory

**CONTEXT IS SACRED** - Every team MUST include a Record Keeper agent:
- Record Keeper maintains CONSTITUTION.md as single source of truth
- Deployed WITH the team (never separately)
- Has same tools and access as other agents
- Preserves project memory across all waves
- System will FAIL if any team lacks a Record Keeper

## Local File Structure (Simplified)

This LOCAL version uses the following simplified file structure:

### Agent Rules (3 files total)
- `core_rules.md` - Universal rules for all agents
- `specialized_agent_rules.md` - All agent specializations (Technical, Analytical, Leadership)
- `agent_template.md` - Template for new agent types

### Coordination Rules (2 files total)
- `system_core_rules.md` - System requirements, file operations, quality gates
- `wave_coordination_protocol.md` - Wave execution flow and protocols

### Templates (6 files total)
- `project-execution-template.md` - Planning and execution
- `team-agent-templates.md` - Agent and team configurations
- `security-assessment-template.md` - Security documentation
- `quality-validation-template.md` - Quality assurance
- `compliance-remediation-template.md` - Compliance planning
- `automation-scan-template.md` - Tool results

### Mode Configurations (7 modes)
- `shadow-clone-plan.md` - Planning mode
- `shadow-clone-feature.md` - Feature development
- `shadow-clone-audit.md` - Security audit
- `shadow-clone-debug.md` - Debugging
- `shadow-clone-optimize.md` - Performance optimization
- `shadow-clone-refactor.md` - Code refactoring
- `shadow-clone-research.md` - Research tasks

## Base Arguments Configuration

**Parse these from the command:**
```
ARGUMENTS:
project_plan=./project-plan.md
workspace_dir=./
waves_directory=./.waves/
num_teams=dynamic
team_composition=auto
wave_strategy=auto
wave_count=dynamic
project_type=auto
git_strategy=auto
source=local  # CRITICAL: Determines local vs API mode
```

## Execution Flow

### Phase 1: MANDATORY System Initialization & Project Analysis

**🚨 CRITICAL: NO EXECUTION WITHOUT INITIALIZATION**

```python
# STEP 0: MANDATORY INITIALIZATION CHECKLIST
# LOCAL VERSION - Always read from local files
system_core_rules = read_file(f"{base_path}/coordination_rules/system_core_rules.md")
# Load consolidated coordination rules
wave_coordination_protocol = read_file(f"{base_path}/coordination_rules/wave_coordination_protocol.md")

# Apply the loaded rules (simplified)
apply_rules(system_core_rules)
apply_rules(wave_coordination_protocol)
apply_rules(wave_execution_protocol)

# Create mandatory wave-0 directory
create_directory(f"{waves_directory}/wave-0/")
```

### Phase 2: Team Configuration

```python
# Load team templates - LOCAL VERSION
team_templates = read_file(f"{base_path}/templates/team-agent-templates.md")

teams = configure_teams(
    project_type=project_context.type,
    num_teams=num_teams,
    team_composition=team_composition,
    templates=team_templates
)

# CRITICAL: Record Keeper is MANDATORY for every team
# Context is sacred - ensure every team has a Record Keeper
for team in teams:
    if not has_record_keeper(team):
        add_record_keeper_to_team(team)
```

### Phase 3: Wave Planning

```python
# Load wave coordination rules - LOCAL VERSION
wave_rules = read_file(f"{base_path}/coordination_rules/wave_coordination_protocol.md")

waves = plan_waves(
    teams=teams,
    wave_strategy=wave_strategy,
    wave_count=wave_count,
    rules=wave_rules
)
```

### Phase 4: Agent Deployment with Rule Injection

**CRITICAL: This is where LOCAL MODE differs most!**

```python
# Load core rules and templates - LOCAL VERSION
agent_templates = read_file(f"{base_path}/templates/team-agent-templates.md")
core_rules = read_file(f"{base_path}/agent_rules/core_rules.md")

for wave in waves:
    agents_to_deploy = []
    
    for team in wave.teams:
        # VERIFY: Record Keeper is present (context is sacred)
        assert has_record_keeper(team), f"CRITICAL: Team {team.name} missing Record Keeper!"
        for agent in team.agents:
            # MANDATORY RULE INJECTION PROTOCOL - LOCAL VERSION
            # Map roles to new simplified structure
            if agent.role in ["development", "qa", "devops", "security"]:
                role_rules = read_file(f"{base_path}/agent_rules/technical_rules.md")
            elif agent.role in ["planning", "research", "audit", "documentation"]:
                role_rules = read_file(f"{base_path}/agent_rules/specialized_agent_rules.md")
            elif agent.role in ["team_lead", "record_keeper"]:
                role_rules = read_file(f"{base_path}/agent_rules/leadership_rules.md")
            else:
                # Default to technical rules for unknown roles
                role_rules = read_file(f"{base_path}/agent_rules/technical_rules.md")
            
            # CRITICAL FOR LOCAL MODE: Include actual rule content in agent prompt
            agent_prompt = f"""
You are {agent.name}, a master craftsman agent in the Shadow Clone System.

CORE RULES:
{core_rules}

ROLE-SPECIFIC RULES:
{role_rules}

FILE AND WORKSPACE RULES:
{system_core_rules}

PROJECT TYPE:
{project_type if project_type != "auto" else "General project"}

TEAM CONTEXT:
{team.context}

WAVE: {wave.number}
WORKSPACE: {waves_directory}/wave-{wave.number}/

YOUR ASSIGNMENT:
{agent.assignment}

QUALITY COMMITMENT: "I am a master of my craft. There are no weak links in our system."
"""
            
            agents_to_deploy.append({
                "name": agent.name,
                "prompt": agent_prompt
            })
    
    # Deploy all agents in parallel (respecting 10-agent limit)
    deploy_agents_in_batches(agents_to_deploy, batch_size=10)
```

### Phase 5: Mode-Specific Execution

```python
# Load mode-specific configuration - LOCAL VERSION
if mode == "EXECUTION":
    execute_standard_mode()
elif mode == "PLANNING":
    plan_config = read_file(f"{base_path}/mode_configs/shadow-clone-plan.md")
    execute_planning_mode(plan_config)
elif mode == "FEATURE":
    feature_config = read_file(f"{base_path}/mode_configs/shadow-clone-feature.md")
    execute_feature_mode(feature_config)
elif mode == "AUDIT":
    audit_config = read_file(f"{base_path}/mode_configs/shadow-clone-audit.md")
    execute_audit_mode(audit_config)
elif mode == "DEBUG":
    debug_config = read_file(f"{base_path}/mode_configs/shadow-clone-debug.md")
    execute_debug_mode(debug_config)
elif mode == "OPTIMIZE":
    optimize_config = read_file(f"{base_path}/mode_configs/shadow-clone-optimize.md")
    execute_optimize_mode(optimize_config)
elif mode == "REFACTOR":
    refactor_config = read_file(f"{base_path}/mode_configs/shadow-clone-refactor.md")
    execute_refactor_mode(refactor_config)
elif mode == "RESEARCH":
    research_config = read_file(f"{base_path}/mode_configs/shadow-clone-research.md")
    execute_research_mode(research_config)
```

### Phase 6: Integration & Quality Assurance

```python
# Load integration and quality rules - LOCAL VERSION
# Integration rules are now part of wave_execution_protocol
# Quality gates are now part of system_core_rules
# Both were already loaded in Phase 1

results = integrate_deliverables(waves, wave_execution_protocol)
validate_quality(results, system_core_rules)
```

### Phase 7: Final Quality & Development Branch Commit

```python
# Git commit protocol is now part of system_core_rules - LOCAL VERSION
# Already loaded in Phase 1

# CRITICAL: Ensure we're on a development branch
current_branch = get_current_branch()
if current_branch in ["main", "master", "production"]:
    # Create and switch to dev branch
    dev_branch_name = f"dev-{mode.lower()}-{project_descriptor}"
    create_and_switch_branch(dev_branch_name)
    print(f"NOTICE: Created development branch '{dev_branch_name}' for safe development")

# Run final audit
final_audit()

# Create single atomic commit (using system_core_rules)
create_single_commit(system_core_rules)

# Provide merge guidance
print("""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 DEVELOPMENT COMPLETE - READY FOR REVIEW

Your changes are safely committed to the development branch.

NEXT STEPS:
1. Test your changes thoroughly in the dev branch
2. Review all modifications and ensure quality
3. When satisfied, merge to main/production:
   
   git checkout main
   git merge {dev_branch_name}
   git push origin main

This workflow ensures production stability and control.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
""")
```

## Critical Success Factors for Local Mode

### 1. Rule Content Injection
- **MUST** read actual file content, not just references
- **MUST** include full rule text in agent Task() prompts
- **MUST** verify all rules are loaded before deployment

### 2. File Path Resolution
- All paths relative to repository root
- Use Read tool to load `.md` files
- Handle missing files gracefully

### 3. No API Dependencies
- No curl commands when source=local
- No API authentication needed
- All content from local `.shadow-local/` directory

### 4. Testing Validation
- Verify no API calls made in local mode
- Check agent prompts contain actual rules
- Ensure wave-0 planning compliance
- Validate single commit protocol

## Git Workflow Philosophy

### Why Development Branches Matter
Shadow Clone empowers non-developers to create production-quality software, but with great power comes the need for safe practices:

1. **Protection**: Main/production branches are sacred - they represent what users see
2. **Learning**: Using dev branches teaches real-world development workflows
3. **Safety**: Mistakes on dev branches don't affect production
4. **Confidence**: Test thoroughly before merging gives peace of mind

### The Educational Journey
This system replaces millions of dollars of development work by:
- Teaching proper version control habits
- Demonstrating professional development workflows
- Building confidence through safe experimentation
- Providing clear merge instructions when ready

### From Idea to Production
The complete workflow:
1. **Idea**: Define what you want to build
2. **Development**: Shadow Clone creates it on a dev branch
3. **Testing**: You verify everything works as expected
4. **Review**: Understand what was built and why
5. **Merge**: You control when it goes to production
6. **Success**: Your idea is now live!

## Remember

Local mode is for testing and development only. The system's strength comes from ensuring every agent - regardless of source - operates with the same core principles and master-level expertise. This local orchestrator guarantees proper rule injection while using local files instead of API access.

**Every agent is a master. Every master is essential. No weak links allowed.**