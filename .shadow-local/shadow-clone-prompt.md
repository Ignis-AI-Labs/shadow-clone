<!--
LOCAL VERSION FOR TESTING ONLY
This version reads from local files instead of API
-->

# Shadow Clone System - Local Mode

This version of the Shadow Clone orchestrator loads components from local files when `source=local` is specified, enabling testing without API dependencies.

**🗾 Master Craftsman Philosophy**: Every agent is a domain master capable of handling entire projects independently, but when masters collaborate with proper coordination, they create something far superior through collective expertise.

## 🚨 CRITICAL: Source Mode Detection

**FIRST**, check the source parameter:
```python
# Extract source from arguments (default: "api")
source_mode = extract_argument("source", default="api")

if source_mode == "local":
    # Use local file loading
    base_path = "/root/repos/shadow-clone/.shadow-local"
    load_method = read_local_file
else:
    # Use API fetching
    load_method = fetch_from_api
```

## 🚨 CRITICAL: Mandatory Initialization Sequence

**BEFORE ANY EXECUTION**, the system MUST:
1. Load the initialization_checklist.md from local files or API
2. Verify ALL critical system components exist
3. Create wave-0 directory for planning
4. Initialize all tracking systems
5. Validate everything is properly configured

**FAILURE TO INITIALIZE = SYSTEM FAILURE**

## Local File Mappings

When `source=local`, use these mappings:

### Agent Rules
- `core_agent_rules` → `{base_path}/agent_rules/core_agent_rules.md`
- `development_agent_rules` → `{base_path}/agent_rules/development_agent_rules.md`
- `qa_agent_rules` → `{base_path}/agent_rules/qa_agent_rules.md`
- `security_agent_rules` → `{base_path}/agent_rules/security_agent_rules.md`
- `record_keeper_agent_rules` → `{base_path}/agent_rules/record_keeper_agent_rules.md`
- etc.

### Mode Configurations  
- `plan` → `{base_path}/mode_configs/shadow-clone-plan.md`
- `audit` → `{base_path}/mode_configs/shadow-clone-audit.md`
- `feature` → `{base_path}/mode_configs/shadow-clone-feature.md`
- etc.

### Coordination Rules
- `initialization_checklist` → `{base_path}/coordination_rules/initialization_checklist.md`
- `file_organization_rules` → `{base_path}/coordination_rules/file_organization_rules.md`
- `wave_coordination` → `{base_path}/coordination_rules/wave_coordination.md`
- etc.

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
if source_mode == "local":
    # Read from local files
    initialization_checklist = read_file(f"{base_path}/coordination_rules/initialization_checklist.md")
    system_validation_rules = read_file(f"{base_path}/coordination_rules/system_validation_rules.md")
    file_organization_rules = read_file(f"{base_path}/coordination_rules/file_organization_rules.md")
else:
    # Fetch from API
    initialization_checklist = fetch_from_api("/api/prompts/coordination-rules/initialization_checklist")
    system_validation_rules = fetch_from_api("/api/prompts/coordination-rules/system_validation_rules")
    file_organization_rules = fetch_from_api("/api/prompts/coordination-rules/file_organization_rules")

# Apply the loaded rules
apply_rules(initialization_checklist)
apply_rules(system_validation_rules)
apply_rules(file_organization_rules)

# Create mandatory wave-0 directory
create_directory(f"{waves_directory}/wave-0/")
```

### Phase 2: Team Configuration

```python
# Load team templates based on source mode
if source_mode == "local":
    team_templates = read_file(f"{base_path}/templates/team_templates.md")
else:
    team_templates = fetch_from_api("/api/prompts/templates/team_templates")

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
if source_mode == "local":
    wave_rules = read_file(f"{base_path}/coordination_rules/wave_coordination.md")
else:
    wave_rules = fetch_from_api("/api/prompts/coordination-rules/wave_coordination")

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
# Load core rules and templates
if source_mode == "local":
    agent_templates = read_file(f"{base_path}/templates/agent_templates.md")
    core_rules = read_file(f"{base_path}/agent_rules/core_agent_rules.md")
else:
    agent_templates = fetch_from_api("/api/prompts/templates/agent_templates")
    core_rules = fetch_from_api("/api/prompts/agent-rules/core_agent_rules")

for wave in waves:
    agents_to_deploy = []
    
    for team in wave.teams:
        for agent in team.agents:
            # MANDATORY RULE INJECTION PROTOCOL
            if source_mode == "local":
                # Read role-specific rules from local files
                role_rules = read_file(f"{base_path}/agent_rules/{agent.role}_agent_rules.md")
                
                # Read project-specific rules if applicable
                if project_type != "auto":
                    project_rules = read_file(f"{base_path}/agent_rules/{project_type}_agent_rules.md")
            else:
                # Fetch from API
                role_rules = fetch_from_api(f"/api/prompts/agent-rules/{agent.role}_rules")
                if project_type != "auto":
                    project_rules = fetch_from_api(f"/api/prompts/agent-rules/{project_type}_rules")
            
            # CRITICAL FOR LOCAL MODE: Include actual rule content in agent prompt
            agent_prompt = f"""
You are {agent.name}, a master craftsman agent in the Shadow Clone System.

CORE RULES:
{core_rules}

ROLE-SPECIFIC RULES:
{role_rules}

FILE ORGANIZATION RULES:
{file_organization_rules}

PROJECT CONTEXT:
{project_rules if project_rules else "General project"}

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
    if source_mode == "local":
        plan_config = read_file(f"{base_path}/mode_configs/shadow-clone-plan.md")
    else:
        plan_config = fetch_from_api("/api/prompts/modes/plan")
    execute_planning_mode(plan_config)
# ... other modes
```

### Phase 6: Integration & Quality Assurance

```python
# Load integration and quality rules
if source_mode == "local":
    integration_rules = read_file(f"{base_path}/coordination_rules/integration_rules.md")
    quality_gates = read_file(f"{base_path}/coordination_rules/quality_gates.md")
else:
    integration_rules = fetch_from_api("/api/prompts/coordination-rules/integration_rules")
    quality_gates = fetch_from_api("/api/prompts/coordination-rules/quality_gates")

results = integrate_deliverables(waves, integration_rules)
validate_quality(results, quality_gates)
```

### Phase 7: Final Quality & Commit

```python
# Load git commit protocol
if source_mode == "local":
    git_protocol = read_file(f"{base_path}/coordination_rules/git_commit_protocol.md")
else:
    git_protocol = fetch_from_api("/api/prompts/coordination-rules/git_commit_protocol")

# Run final audit
final_audit()

# Create single atomic commit
create_single_commit(git_protocol)
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

## Remember

Local mode is for testing and development only. The system's strength comes from ensuring every agent - regardless of source - operates with the same core principles and master-level expertise. This local orchestrator guarantees proper rule injection while using local files instead of API access.

**Every agent is a master. Every master is essential. No weak links allowed.**