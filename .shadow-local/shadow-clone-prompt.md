<!--
LOCAL VERSION FOR TESTING ONLY
This version reads from local files instead of API
-->

# Shadow Clone System - Local Version

This LOCAL version of the Shadow Clone orchestrator always loads components from local files in the `.shadow-local/` directory. This version is for testing and development only.

**🗾 Master Craftsman Philosophy**: Every agent is a domain master capable of handling entire projects independently, but when masters collaborate with proper coordination, they create something far superior through collective expertise.

## System Constants
```python
# Deployment Limits
MAX_AGENTS_PER_DEPLOYMENT = 10
MIN_RECORD_KEEPERS = 3
RECORD_KEEPER_SCALING = lambda total_agents: max(MIN_RECORD_KEEPERS, math.ceil(total_agents / 5))

# Critical Files
CONSTITUTION_FILE = "CONSTITUTION.md"
CORE_RULES_PATH = ".shadow-local/agent_rules/core_rules.md"
```

## 🚨 CRITICAL: Local Mode Configuration

**This is the LOCAL version** - Always uses local files:
```python
# LOCAL VERSION - Fixed configuration
base_path = "/{current_dir}/.shadow-local"
load_method = read_local_file
source_mode = "local"  # Always local for this version
```


## 🔑 SACRED RULE: Record Keeper is Mandatory

**CONTEXT IS SACRED** - Every team MUST include a Record Keeper agent:
- System will FAIL if any team lacks a Record Keeper
- Record Keeper maintains CONSTITUTION.md as single source of truth
- Deployed WITH the team (never separately)
- Has same tools and access as other agents
- Preserves project memory across all waves

**CRITICAL**: All Record Keeper protocols, responsibilities, and procedures are defined in `.shadow-local/agent_rules/core_rules.md` under "The Record Keeper - Central Convergence Authority" section. This ensures ALL agents have consistent understanding of the Record Keeper role and workflow.

## System Coordination Rules

### Pre-Execution Requirements
- Valid git repository with **MANDATORY CLEAN WORKING TREE**
- CONSTITUTION.md exists and is readable
- .shadow-local/ directory structure intact
- Sufficient disk space for artifacts


### Workspace Structure
```
project/
├── .shadow-local/          # System files (this directory)
│   ├── agent_rules/        # Agent behavior definitions
│   ├── templates/          # Document templates
│   ├── mode_configs/       # Execution mode configurations
│   └── shadow-clone-prompt.md # This file
├── .waves/                 # Active wave execution
│   ├── wave-0/            # Planning wave (mandatory)
│   │   ├── deliverables/
│   │   ├── research/
│   │   ├── drafts/
│   │   └── WAVE_STATUS.md
│   └── wave-N/            # Implementation waves
│       ├── AGENT_ROSTER.md
│       ├── COMPLETION_STATUS.md
│       ├── RECORD_KEEPER_STATUS.md
│       ├── RECORD_KEEPER_LOG.md
│       └── checkpoints/
├── .waves-archive/         # Historical waves
│   ├── [mode]-[date]/     # e.g., feature-2025-07-10-1430
│   └── README.md          # Archive index
├── src/                   # Source code
└── CONSTITUTION.md        # Project memory (Record Keeper only)
```

### File Operations & Reservation System

#### File Locking Protocol
Before modifying ANY file, agents MUST:
1. Check for existing reservation
2. Add reservation header: `RESERVED: [AgentName] @ [ISO-8601 timestamp]`
3. Work on the file
4. Remove reservation when complete
5. One agent per file at any time

#### File Placement Rules (STRICT)
**Wave Folder Isolation:**
- ALL agent work: `.waves/wave-N/` ONLY
- NO files created outside assigned wave
- NO modification of previous wave files
- NO work in project root during execution


**Violations = IMMEDIATE FAILURE:**
- Creating files in project root
- Modifying other wave files
- Working outside wave folder
- Skipping file reservation

### Git Workflow & Branch Strategy

#### Branch Management
- **ALWAYS work on development branches**
- Format: `dev-[mode]-[description]` (e.g., `dev-feature-auth-system`)
- Main/master/production branches are READ-ONLY
- Create dev branch if on protected branch

#### Commit Protocol
- NO commits during wave execution
- Clean working tree between waves
- Single atomic commit per wave with descriptive message
- Format: "Wave N: [summary of changes]"

#### Merge Process
1. Complete all waves on dev branch
2. Run all tests and quality checks
3. Notify user that development is complete
4. User reviews changes on dev branch
5. User manually merges to main after approval
6. Educational opportunity for git best practices

### Quality Gates

#### Code Standards
- Production-ready code only
- No commented-out code blocks
- Proper error handling throughout
- Security vulnerabilities = immediate stop
- Follow language-specific best practices

#### Testing Requirements
- 100% test pass rate before wave completion
- Integration tests for all APIs
- Security scan must pass
- Performance within requirements
- No regression in existing functionality

#### Documentation Standards
- All public APIs documented
- Architecture decisions recorded in ADRs
- Complex logic explained inline
- README updated with new features
- User guides for new functionality

### Wave Execution Patterns (Two-Phase Record Keeper Model)

#### Wave Execution Flow
Each wave follows this THREE-PHASE pattern:
1. **Pre-Wave**: Record Keeper deploys FIRST to lay foundations
2. **Main Wave**: Team agents execute with clear requirements
3. **Post-Wave**: Record Keeper deploys AGAIN to gather and finalize

#### Wave 0 - Planning (MANDATORY)
**Purpose:** Define project scope and approach
**Team:** Record Keeper Collective (3+), Planning Strategist, Research Analyst, System Architect
**Execution:**
- Phase 1: RK Collective orchestrates planning and creates templates
- Phase 2: Planning team develops project vision and approach
- Phase 3: RK Collective gathers outputs and updates Constitution
**Outputs:**
- Requirements breakdown
- Wave structure definition
- Agent assignments
- Technical approach
- Risk assessment

#### Wave 1-N - Implementation
**Purpose:** Build solution incrementally
**Execution:**
- Phase 1: Record Keeper defines deliverables for each agent
- Phase 2: Implementation team builds assigned components
- Phase 3: Record Keeper validates and integrates deliverables
**Patterns:**
- **Sequential**: Dependencies between tasks
- **Parallel**: Independent tasks (max 10 agents)
- **Mixed**: Optimize for efficiency

#### Final Wave - Convergence
**Purpose:** Finalize and validate everything
**Team:** Record Keeper Collective (3+), Audit Specialist, Technical Writer, DevOps
**Execution:**
- Phase 1: RK Collective prepares final validation checklist
- Phase 2: Convergence team performs final quality checks
- Phase 3: RK Collective creates MODE COMPLETION SUMMARY
**Critical:** RK Collective's Post-Wave phase creates final mode summary

### Wave Execution Anti-Patterns (AVOID)
- **Skipping Wave 0**: Leads to coordination failures
- **Deploying Record Keeper Alone**: Context preservation fails
- **Committing During Waves**: Breaks atomicity
- **Parallel File Edits**: Causes conflicts
- **Ignoring Quality Gates**: Technical debt accumulation

### Wave Dependency Enforcement (CRITICAL)

**NO WAVE PROCEEDS WITHOUT PREVIOUS WAVE SUCCESS**

#### Wave Transition Requirements
Before ANY wave can start, the system MUST verify:

1. **Previous Wave Completion**
   ```python
   # MANDATORY check before wave N starts
   previous_wave_status = check_wave_completion(wave_number - 1)
   if not previous_wave_status.complete:
       print(f"❌ CRITICAL: Wave {wave_number-1} incomplete")
       print(f"❌ Cannot proceed to Wave {wave_number}")
       print("\nMissing from previous wave:")
       for item in previous_wave_status.missing:
           print(f"  - {item}")
       sys.exit(1)
   ```

2. **Deliverables Verification**
   - Required deliverables must exist
   - Files must have actual content (>0 bytes)
   - Record Keeper must have finalized wave
   - `WAVE_COMPLETE.md` must exist

3. **Planning Mode Specific**
   - Wave-0 MUST produce wave_plan.md
   - Each planning wave MUST build on previous
   - NO wave can skip if dependencies missing
   - Final wave CANNOT start without all planning done

4. **Enforcement Mechanism**
   ```yaml
   wave_dependencies:
     wave-0: 
       required_outputs: [project_vision.md, scope_assessment.md, wave_plan.md]
       blocks: ALL subsequent waves
     wave-N:
       requires: wave-(N-1) complete
       validates: deliverables exist
       blocks: wave-(N+1)
   ```

**VIOLATION = IMMEDIATE HALT**
- System refuses to deploy next wave
- Clear error about what's missing
- Forces proper completion before proceeding

### Mode Transitions & Wave Archiving

#### Sprint Lifecycle
When transitioning between modes or starting new sprints:

1. **Pre-Transition Checklist**
   - Ensure all waves complete
   - Run final quality validation
   - Update CONSTITUTION.md
   - Commit changes to dev branch

2. **Archive Protocol**
   ```bash
   # Archive format: .waves-archive/[mode]-[YYYY-MM-DD-HHMM]/
   mv .waves/ .waves-archive/feature-2025-07-10-1430/
   ```
   - Create archive README with summary
   - Update CONSTITUTION.md with reference
   - Start fresh .waves/ directory

3. **Mode Transition Map**
   - Research → Plan: Archive findings, prepare planning
   - Plan → Feature: Archive plans, create feature branch
   - Feature → Debug: Maintain branch, focus on fixes
   - Debug → Optimize: Archive logs, baseline performance
   - Any → Audit: Full archive, separate audit branch

### Agent Communication Protocol

#### Status Reporting (to Record Keeper)
```
Agent: [Name]
Wave: [N]
Status: [Working/Blocked/Complete]
Files: [Reserved files list]
Blockers: [Issues preventing progress]
Next: [Planned next steps]
```

#### Handoff Protocol
1. Complete all assigned work
2. Report completion to Record Keeper
3. Update status to "Complete"
4. Release all file reservations
5. Document deliverables location
6. Clear next steps for receiver

### Record Keeper Recovery System

Record Keeper recovery protocols and prevention measures are defined in `.shadow-local/agent_rules/core_rules.md`. All agents must understand these protocols to ensure system resilience.

### Emergency Protocols

#### System Failures
1. Stop all work immediately
2. Document failure in RECORD_KEEPER_LOG.md
3. Alert Record Keeper Collective
4. Create recovery plan
5. Resume from last stable state

#### Critical Blockers
1. 15-minute self-resolution attempt
2. Consult parallel agents
3. Escalate to Record Keeper Collective
4. Document resolution
5. Update CONSTITUTION.md

### User Interaction Commands

#### Deployment Commands
- `"Execute"`, `"Start"`, `"Begin"`, `"Go"` - Start execution
- `"Execute but [modification]"` - Start with changes
- `"Show me the plan"` - Review before starting

#### During Execution
- `"Status"` - Current progress
- `"Pause"` - Halt execution
- `"Resume"` - Continue
- `"Skip to Wave N"` - Jump to wave
- `"Show constitution"` - View project state


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

### Common Functions

```python
def verify_git_clean():
    """Enforce professional git practices - no uncommitted changes allowed"""
    git_status = run_command("git status --porcelain")
    if git_status.strip():
        print("❌ CRITICAL FAILURE: Uncommitted changes detected")
        print("❌ Shadow Clone enforces clean git state")
        print("\nOptions:")
        print("1. Commit: git add . && git commit -m 'Your message'")
        print("2. Stash: git stash")
        print("3. Discard: git reset --hard HEAD (CAUTION)")
        sys.exit(1)

def load_rules():
    """Load rules once for reuse"""
    return {
        "core": read_file(f"{base_path}/agent_rules/core_rules.md"),
        "specialized": read_file(f"{base_path}/agent_rules/specialized_agent_rules.md")
    }

def get_rk_focus_duties(phase):
    """Get focus-specific duties for each RK type"""
    duties = {
        "pre": {
            "orchestration": "Define objectives, assign tasks, create AGENT_ASSIGNMENTS.md, set protocols, make decisions",
            "technical": "Define deliverables, create DELIVERABLES_REQUIRED.md, set integration points and quality gates",
            "progress": "Set up trackers, create timeline, initialize logs, define dependencies, set checkpoints",
            "general": "Support documentation, create templates, assist coordination, maintain backups"
        },
        "post": {
            "orchestration": "Review deliverables, assess quality, document decisions, identify next items, lead closure",
            "technical": "Validate deliverables, update Constitution, document integration, assess quality, log debt",
            "progress": "Update trackers, calculate metrics, create summary, document lessons, prepare handoff",
            "general": "Support finalization, gather deliverables, assist Constitution updates, create backups"
        }
    }
    
    focus_name = {
        "orchestration": "LEAD RECORD KEEPER",
        "technical": "TECHNICAL RECORD KEEPER",
        "progress": "PROGRESS RECORD KEEPER",
        "general": "ADDITIONAL RECORD KEEPER"
    }
    
    return {
        focus: f"Your focus as {focus_name[focus]}:\n- " + duties[phase][focus].replace(", ", "\n- ")
        for focus in duties[phase]
    }

def create_rk_prompt(rk_agent, wave, phase, num_rk, rules=None):
    """Generate Record Keeper prompt for pre/post wave phases"""
    if not rules:
        rules = load_rules()
    
    focus_duties = get_rk_focus_duties(phase)[rk_agent.get('focus', 'general')]
    
    phase_duties = {
        "pre": """
Collective Pre-Wave Duties - CREATE ONLY 3 FILES:
1. DELIVERABLES_REQUIRED.md - What each agent must deliver
2. AGENT_ASSIGNMENTS.md - Who does what
3. RECORD_KEEPER_LOG.md - Start logging activities

DO NOT CREATE: CONSTITUTION.md, tracking dashboards, templates, or any other files!
REMEMBER: You are part of the RK Collective that LEADS this wave.""",
        "post": """
Collective Post-Wave Duties - CREATE ONLY 1 FILE:
1. Review all agent deliverables
2. Update CONSTITUTION.md with outcomes
3. Create WAVE_COMPLETE.md to mark completion

DO NOT CREATE: Multiple tracking files, summaries, or dashboards!
REMEMBER: Keep documentation minimal and focused."""
    }
    
    return f"""
You are {rk_agent['name']} in the Record Keeper Collective for Wave {wave.number}.

CRITICAL: You are in {phase.upper()}-WAVE PHASE - Part of {num_rk} RKs orchestrating this wave.

{focus_duties}

{phase_duties.get(phase, '')}

CORE RULES (INCLUDING RECORD KEEPER COLLECTIVE MODEL):
{rules['core']}

ROLE-SPECIFIC RULES:
{rules['specialized']}

WAVE: {wave.number} ({phase.upper()}-WAVE PHASE)
WORKSPACE: {waves_directory}/wave-{wave.number}/
COLLECTIVE SIZE: {num_rk} Record Keepers

{"Coordinate with other RKs. Mark complete ONLY after your focus area is ready." if phase == "pre" else "Review all deliverables thoroughly. Mark complete ONLY after full wave closure."}
"""

def create_agent_prompt(agent, wave, team, sub_wave_id=None, rules=None):
    """Generate consistent agent prompt with all required rules"""
    if not rules:
        rules = load_rules()
    
    wave_info = f"WAVE: {wave.number}"
    if sub_wave_id:
        wave_info += f" (Sub-wave: {sub_wave_id})"
    
    return f"""
You are {agent.name}, a master craftsman agent in the Shadow Clone System.

{wave_info}
WORKSPACE: {waves_directory}/wave-{wave.number}/ (USE ONLY THIS FOLDER)

PRE-WAVE PREPARATION BY RK COLLECTIVE:
- DELIVERABLES_REQUIRED.md - Your specific deliverables
- AGENT_ASSIGNMENTS.md - Your role and responsibilities
- Report ALL progress to the Record Keeper Collective

CORE RULES:
{rules['core']}

ROLE-SPECIFIC RULES:
{rules['specialized']}

SYSTEM COORDINATION:
- ALL work in {waves_directory}/wave-{wave.number}/
- File reservation required before editing
- Report all progress to RK Collective
- Follow quality gates and git workflow

PROJECT TYPE: {project_type if project_type != "auto" else "General project"}
TEAM CONTEXT: {team.context}
YOUR ASSIGNMENT: {agent.assignment}

REMINDER: Follow the agent template structure EXACTLY. Include your Workspace field.
QUALITY COMMITMENT: "I am a master of my craft. There are no weak links in our system."
"""

def initialize_system():
    """Standard system initialization"""
    # Verify all system components exist
    verify_components_exist([
        ".shadow-local/agent_rules/core_rules.md",
        ".shadow-local/agent_rules/specialized_agent_rules.md",
        ".shadow-local/templates/",
        ".shadow-local/mode_configs/"
    ])
    
    # Create wave-0 directory structure
    create_wave_directory(0)
    
    # Initialize tracking systems
    initialize_tracking_systems(wave=0)
    
    # Validate git branch strategy (never on main/master)
    ensure_development_branch()

def configure_teams_with_rk(project_type, num_teams, team_composition):
    """Configure teams ensuring RK Collective is included"""
    team_templates = read_file(f"{base_path}/templates/team-agent-templates.md")
    
    teams = configure_teams(
        project_type=project_type,
        num_teams=num_teams,
        team_composition=team_composition,
        templates=team_templates
    )
    
    # Ensure Record Keeper Collective in every team
    for team in teams:
        if not has_record_keeper(team):
            add_record_keeper_to_team(team)
    
    return teams

def execute_mode(mode):
    """Execute mode with appropriate configuration"""
    mode_configs = {
        "PLANNING": "shadow-clone-plan.md",
        "FEATURE": "shadow-clone-feature.md",
        "AUDIT": "shadow-clone-audit.md",
        "DEBUG": "shadow-clone-debug.md",
        "OPTIMIZE": "shadow-clone-optimize.md",
        "REFACTOR": "shadow-clone-refactor.md",
        "RESEARCH": "shadow-clone-research.md"
    }
    
    if mode == "EXECUTION":
        execute_standard_mode()
    elif mode in mode_configs:
        config = read_file(f"{base_path}/mode_configs/{mode_configs[mode]}")
        globals()[f"execute_{mode.lower()}_mode"](config)

def finalize_and_commit(mode, project_descriptor):
    """Handle final quality checks and git commit"""
    # Ensure we're on a development branch
    current_branch = get_current_branch()
    if current_branch in ["main", "master", "production"]:
        dev_branch_name = f"dev-{mode.lower()}-{project_descriptor}"
        create_and_switch_branch(dev_branch_name)
        print(f"NOTICE: Created development branch '{dev_branch_name}' for safe development")
    
    # Run final audit
    final_audit()
    
    # Create single atomic commit
    create_single_commit()
    
    # Provide merge guidance
    print(f"""
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

def create_record_keeper_collective(num_record_keepers):
    """Create the Record Keeper Collective with appropriate roles"""
    collective = []
    
    # Core RKs
    collective.append({
        "name": "Lead Record Keeper",
        "role": "record_keeper",
        "focus": "orchestration"
    })
    collective.append({
        "name": "Technical Record Keeper", 
        "role": "record_keeper",
        "focus": "technical"
    })
    collective.append({
        "name": "Progress Record Keeper",
        "role": "record_keeper", 
        "focus": "progress"
    })
    
    # Additional RKs if needed
    for i in range(3, num_record_keepers):
        collective.append({
            "name": f"Record Keeper {i+1}",
            "role": "record_keeper",
            "focus": "general"
        })
    
    return collective

def enforce_wave_dependencies(wave, mode, waves_directory):
    """Enforce wave dependency requirements"""
    if wave.number > 0:
        # Check previous wave completion
        prev_wave_path = f"{waves_directory}/wave-{wave.number - 1}"
        wave_complete_file = f"{prev_wave_path}/WAVE_COMPLETE.md"
        
        if not os.path.exists(wave_complete_file):
            print(f"❌ CRITICAL FAILURE: Wave {wave.number - 1} not complete")
            print(f"❌ Cannot proceed to Wave {wave.number}")
            print(f"❌ Missing: {wave_complete_file}")
            print("\nWave dependency enforcement prevents proceeding.")
            sys.exit(1)
        
        # For planning mode, check specific deliverables
        if mode == "PLANNING" and wave.number == 1:
            required_files = ["project_vision.md", "scope_assessment.md", "wave_plan.md"]
            missing_files = []
            for req_file in required_files:
                if not os.path.exists(f"{prev_wave_path}/deliverables/{req_file}"):
                    missing_files.append(req_file)
            
            if missing_files:
                print(f"❌ Wave-0 incomplete - missing required deliverables:")
                for mf in missing_files:
                    print(f"  - {mf}")
                sys.exit(1)

def deploy_wave_agents(wave, all_main_agents, needs_sub_waves, num_sub_waves, rules):
    """Deploy agents handling sub-waves if needed"""
    if needs_sub_waves:
        # Split agents into batches of 10
        for sub_wave_idx in range(num_sub_waves):
            sub_wave_letter = chr(ord('a') + sub_wave_idx)
            wave_id = f"{wave.number}{sub_wave_letter}"
            
            if sub_wave_idx > 0:
                print(f"=== Wave {wave_id}: Main Team Deployment (Continuation) ===")
            
            # Get agents for this sub-wave
            start_idx = sub_wave_idx * 10
            end_idx = min(start_idx + 10, len(all_main_agents))
            sub_wave_agents = all_main_agents[start_idx:end_idx]
            
            print(f"  Deploying {len(sub_wave_agents)} agents in this sub-wave")
            
            agents_to_deploy = []
            for team, agent in sub_wave_agents:
                agent_prompt = create_agent_prompt(agent, wave, team, wave_id, rules)
                agents_to_deploy.append({
                    "name": agent.name,
                    "prompt": agent_prompt
                })
            
            deploy_agents_in_batches(agents_to_deploy, batch_size=10)
            wait_for_sub_wave_completion(wave_id)
    else:
        # Standard deployment (≤10 agents)
        print(f"=== Wave {wave.number}: Main Team Deployment ===")
        
        agents_to_deploy = []
        for team, agent in all_main_agents:
            agent_prompt = create_agent_prompt(agent, wave, team, None, rules)
            agents_to_deploy.append({
                "name": agent.name,
                "prompt": agent_prompt
            })
        
        deploy_agents_in_batches(agents_to_deploy, batch_size=10)
        wait_for_main_team_completion(wave)
```

### Phase 1: MANDATORY System Initialization & Project Analysis

```python
# Use common git verification function
verify_git_clean()

# Initialize system with standard checks
initialize_system()
```

### Phase 2: Team Configuration

```python
# Configure teams with mandatory Record Keeper
teams = configure_teams_with_rk(project_context.type, num_teams, team_composition)
```

### Phase 3: Wave Planning

```python
waves = plan_waves(teams, wave_strategy, wave_count)
```

### Phase 4: Agent Deployment with Rule Injection (Two-Phase RK Model)

```python
# Use previously loaded rules
rules = load_rules()  # Already defined in common functions

for wave in waves:
    # Calculate total agents and determine if sub-waves needed
    total_agents_in_wave = sum(len(team.agents) for team in wave.teams)
    # Exclude RK from main count as they deploy separately
    non_rk_agents = total_agents_in_wave - sum(1 for team in wave.teams 
                                               for agent in team.agents 
                                               if agent.role == "record_keeper")
    
    # Calculate number of Record Keepers needed
    num_record_keepers = RECORD_KEEPER_SCALING(total_agents_in_wave)
    
    # Determine sub-waves needed
    needs_sub_waves = non_rk_agents > 10
    num_sub_waves = math.ceil(non_rk_agents / 10) if needs_sub_waves else 1
    
    print(f"Wave {wave.number}: {total_agents_in_wave} total agents")
    if needs_sub_waves:
        print(f"  Splitting into {num_sub_waves} sub-waves due to 10-agent limit")
    
    # PHASE 1: Deploy RK Collective Pre-Wave (only at start of wave/sub-wave batch)
    sub_wave_letter = 'a' if needs_sub_waves else ''
    wave_id = f"{wave.number}{sub_wave_letter}"
    
    print(f"=== Wave {wave_id}: Pre-Wave Record Keeper Collective Phase ===")
    
    # Create Record Keeper Collective
    record_keeper_collective = create_record_keeper_collective(num_record_keepers)
    
    # Deploy Record Keeper Collective with Pre-Wave duties (IN PARALLEL)
    rk_agents_to_deploy = []
    for rk_agent in record_keeper_collective:
        pre_wave_prompt = create_rk_prompt(rk_agent, wave, "pre", num_record_keepers, rules)
        rk_agents_to_deploy.append({
            "name": rk_agent['name'] + " (Pre-Wave)",
            "prompt": pre_wave_prompt
        })
    
    # Deploy all RKs at once as a team
    deploy_agents_in_batches(rk_agents_to_deploy, batch_size=10)
    
    # Wait for Pre-Wave Record Keeper Collective to complete
    wait_for_agents_completion(record_keeper_collective)
    
    # PHASE 2: Deploy Main Team (Record Keepers already handle leadership)
    print(f"=== Wave {wave.number}: Main Team Deployment ===")
    
    # Enforce wave dependencies
    enforce_wave_dependencies(wave, mode, waves_directory)
    
    # Collect all non-RK agents
    all_main_agents = []
    for team in wave.teams:
        for agent in team.agents:
            # Skip Record Keeper and Team Lead roles (RK Collective handles both)
            if agent.role in ["record_keeper", "team_lead"]:
                continue
            all_main_agents.append((team, agent))
    
    # Deploy agents (handles sub-waves automatically)
    deploy_wave_agents(wave, all_main_agents, needs_sub_waves, num_sub_waves, rules)
    
    # PHASE 3: Deploy Record Keeper Collective AGAIN (Post-Wave)
    # Only after ALL sub-waves complete
    if needs_sub_waves:
        final_wave_id = f"{wave.number}{chr(ord('a') + num_sub_waves - 1)}"
        print(f"=== Wave {final_wave_id}: Post-Wave Record Keeper Collective Phase ===")
    else:
        print(f"=== Wave {wave.number}: Post-Wave Record Keeper Collective Phase ===")
    
    # Deploy same RK Collective for Post-Wave (IN PARALLEL)
    rk_post_agents = []
    for rk_agent in record_keeper_collective:
        # Add sub-wave info if needed
        post_prompt = create_rk_prompt(rk_agent, wave, "post", num_record_keepers, rules)
        if needs_sub_waves:
            post_prompt = post_prompt.replace(
                "CRITICAL: You are in POST-WAVE PHASE",
                f"CRITICAL: You are in POST-WAVE PHASE\nThis wave was split into {num_sub_waves} sub-waves due to 10-agent limit."
            )
        
        rk_post_agents.append({
            "name": rk_agent['name'] + " (Post-Wave)",
            "prompt": post_prompt
        })
    
    # Deploy all Post-Wave RKs at once as a team
    deploy_agents_in_batches(rk_post_agents, batch_size=10)
    
    # Wait for Post-Wave Record Keeper Collective to complete
    wait_for_agents_completion(record_keeper_collective)
    print(f"=== Wave {wave.number} Complete ===\n")
```

### Phase 5: Mode-Specific Execution

```python
execute_mode(mode)  # Mode loading handled internally
```

### Phase 6: Integration & Quality Assurance

```python
results = integrate_deliverables(waves)
validate_quality(results)
```

### Phase 7: Final Quality & Development Branch Commit

```python
finalize_and_commit(mode, project_descriptor)
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