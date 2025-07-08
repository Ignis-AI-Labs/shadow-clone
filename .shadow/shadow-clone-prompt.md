# Shadow Clone System

The Shadow Clone orchestrator loads all components from the API for centralized rule management and seamless updates.

**🗾 Master Craftsman Philosophy**: Every agent is a domain master capable of handling entire projects independently, but when masters collaborate with proper coordination, they create something far superior through collective expertise.

## 🚨 CRITICAL: Configuration

```python
base_url = "https://api.ignislabs.ai/api/prompts"
load_method = fetch_from_api
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

## File Structure (Simplified)

The system uses the following simplified file structure:

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
system_core_rules = fetch_from_api(f"{base_url}/coordination-rules/system-core-rules")
wave_coordination_protocol = fetch_from_api(f"{base_url}/coordination-rules/wave-coordination-protocol")

# Apply the loaded rules (simplified)
apply_rules(system_core_rules)
apply_rules(wave_coordination_protocol)

# Create mandatory wave-0 directory
create_directory(f"{waves_directory}/wave-0/")
```

### Phase 2: Team Configuration

```python
# Load team templates
team_templates = fetch_from_api(f"{base_url}/templates/team-agent-templates")

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
# Load wave coordination rules
wave_rules = fetch_from_api(f"{base_url}/coordination-rules/wave-coordination-protocol")

waves = plan_waves(
    teams=teams,
    wave_strategy=wave_strategy,
    wave_count=wave_count,
    rules=wave_rules
)
```

### Phase 4: Agent Deployment with Rule Injection

**CRITICAL: Rule injection is essential for agent coordination**

```python
# Load core rules and templates
agent_templates = fetch_from_api(f"{base_url}/templates/team-agent-templates")
core_rules = fetch_from_api(f"{base_url}/agent-rules/core-rules")

for wave in waves:
    agents_to_deploy = []
    
    for team in wave.teams:
        # VERIFY: Record Keeper is present (context is sacred)
        assert has_record_keeper(team), f"CRITICAL: Team {team.name} missing Record Keeper!"
        for agent in team.agents:
            # MANDATORY RULE INJECTION PROTOCOL
            if agent.role in ["development", "qa", "devops", "security"]:
                role_rules = fetch_from_api(f"{base_url}/agent-rules/technical-rules")
            elif agent.role in ["planning", "research", "audit", "documentation"]:
                role_rules = fetch_from_api(f"{base_url}/agent-rules/specialized-agent-rules")
            elif agent.role in ["team_lead", "record_keeper"]:
                role_rules = fetch_from_api(f"{base_url}/agent-rules/leadership-rules")
            else:
                # Default to technical rules for unknown roles
                role_rules = fetch_from_api(f"{base_url}/agent-rules/technical-rules")
            
            # Include fetched rule content in agent prompt
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
# Load mode-specific configuration
if mode == "EXECUTION":
    execute_standard_mode()
elif mode == "PLANNING":
    plan_config = fetch_from_api(f"{base_url}/mode-configs/shadow-clone-plan")
    execute_planning_mode(plan_config)
elif mode == "FEATURE":
    feature_config = fetch_from_api(f"{base_url}/mode-configs/shadow-clone-feature")
    execute_feature_mode(feature_config)
elif mode == "AUDIT":
    audit_config = fetch_from_api(f"{base_url}/mode-configs/shadow-clone-audit")
    execute_audit_mode(audit_config)
elif mode == "DEBUG":
    debug_config = fetch_from_api(f"{base_url}/mode-configs/shadow-clone-debug")
    execute_debug_mode(debug_config)
elif mode == "OPTIMIZE":
    optimize_config = fetch_from_api(f"{base_url}/mode-configs/shadow-clone-optimize")
    execute_optimize_mode(optimize_config)
elif mode == "REFACTOR":
    refactor_config = fetch_from_api(f"{base_url}/mode-configs/shadow-clone-refactor")
    execute_refactor_mode(refactor_config)
elif mode == "RESEARCH":
    research_config = fetch_from_api(f"{base_url}/mode-configs/shadow-clone-research")
    execute_research_mode(research_config)
```

### Phase 6: Integration & Quality Assurance

```python
# Integration and quality rules already loaded in Phase 1
# system_core_rules contains quality gates
# wave_coordination_protocol contains integration rules

results = integrate_deliverables(waves, wave_execution_protocol)
validate_quality(results, system_core_rules)
```

### Phase 7: Final Quality & Development Branch Commit

```python
# Git commit protocol already loaded in Phase 1

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

## Critical Success Factors

### 1. Rule Content Fetching
- **MUST** fetch complete rule content from API
- **MUST** include full rule text in agent Task() prompts
- **MUST** verify all rules are successfully fetched

### 2. API Endpoint Structure
- Base URL: `https://api.ignislabs.ai/api/prompts`
- Categories use kebab-case: `/agent-rules/`, `/mode-configs/`
- Files omit extension: `core-rules` not `core-rules.md`

### 3. API Dependencies
- Requires valid API access
- Handles API errors gracefully
- Falls back safely if endpoints unavailable

### 4. Production Validation
- Verify all API calls succeed
- Check agent prompts contain fetched rules
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

The Shadow Clone System ensures consistent, centralized rule management across all deployments. Every agent receives the latest rules and configurations, maintaining system integrity and enabling seamless updates.

**Every agent is a master. Every master is essential. No weak links allowed.**