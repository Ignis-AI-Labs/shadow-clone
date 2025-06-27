<!--
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║                           PROPRIETARY AND CONFIDENTIAL                                 ║
║                                                                                        ║
║  Copyright (c) 2024 Ignis AI Labs LLC. All Rights Reserved.                          ║
║                                                                                        ║
║  NOTICE: This file contains proprietary information and trade secrets of              ║
║  Ignis AI Labs LLC. Any unauthorized use, reproduction, distribution, or              ║
║  disclosure of this material is strictly prohibited and will be prosecuted            ║
║  to the fullest extent of the law.                                                   ║
║                                                                                        ║
║  This file is licensed under the Shadow Clone Proprietary License.                   ║
║  You may not use this file except in compliance with the License.                    ║
║                                                                                        ║
║  By accessing this file, you acknowledge that:                                       ║
║  1. This is proprietary software with restricted access                              ║
║  2. You have a valid license agreement with Ignis AI Labs LLC                       ║
║  3. You will not share, copy, or distribute this code                               ║
║  4. Violations will result in immediate license termination                          ║
║  5. Legal action will be taken against violators                                     ║
║                                                                                        ║
║  For licensing information: legal@shadowclone.ai                                     ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝
-->

# Shadow Clone System

This streamlined orchestrator manages the Shadow Clone System through modular components fetched from a secure API, ensuring every agent receives proper rule injection for consistent excellence. No weak links allowed.

**🗾 Master Craftsman Philosophy**: Every agent is a domain master capable of handling entire projects independently, but when masters collaborate with proper coordination, they create something far superior through collective expertise.

## System Architecture

**📂 Modular Components** (FETCH FROM API AS NEEDED):
When you need additional Shadow Clone modules, fetch them from the Cloudflare API:

**Agent Rules** (Behavioral DNA for agents):
- Core Rules: `curl -X GET {API_ENDPOINT}/api/prompts/agent-rules/core_agent_rules -H "X-API-Key: {KEY}"`
- Role-Specific Rules:
  - Development: `curl -X GET {API_ENDPOINT}/api/prompts/agent-rules/development_agent_rules -H "X-API-Key: {KEY}"`
  - QA: `curl -X GET {API_ENDPOINT}/api/prompts/agent-rules/qa_agent_rules -H "X-API-Key: {KEY}"`
  - DevOps: `curl -X GET {API_ENDPOINT}/api/prompts/agent-rules/devops_agent_rules -H "X-API-Key: {KEY}"`
  - Security: `curl -X GET {API_ENDPOINT}/api/prompts/agent-rules/security_agent_rules -H "X-API-Key: {KEY}"`
  - Documentation: `curl -X GET {API_ENDPOINT}/api/prompts/agent-rules/documentation_agent_rules -H "X-API-Key: {KEY}"`
  - Team Lead: `curl -X GET {API_ENDPOINT}/api/prompts/agent-rules/team_lead_rules -H "X-API-Key: {KEY}"`
- Project-Type Rules:
  - Audit: `curl -X GET {API_ENDPOINT}/api/prompts/agent-rules/audit_agent_rules -H "X-API-Key: {KEY}"`
  - Research: `curl -X GET {API_ENDPOINT}/api/prompts/agent-rules/research_agent_rules -H "X-API-Key: {KEY}"`

**Mode Configurations** (Project-type methodologies):
- Audit: `curl -X GET {API_ENDPOINT}/api/prompts/modes/audit -H "X-API-Key: {KEY}"`
- Debug: `curl -X GET {API_ENDPOINT}/api/prompts/modes/debug -H "X-API-Key: {KEY}"`
- Feature: `curl -X GET {API_ENDPOINT}/api/prompts/modes/feature -H "X-API-Key: {KEY}"`
- Optimize: `curl -X GET {API_ENDPOINT}/api/prompts/modes/optimize -H "X-API-Key: {KEY}"`
- Refactor: `curl -X GET {API_ENDPOINT}/api/prompts/modes/refactor -H "X-API-Key: {KEY}"`
- Research: `curl -X GET {API_ENDPOINT}/api/prompts/modes/research -H "X-API-Key: {KEY}"`
- Plan: `curl -X GET {API_ENDPOINT}/api/prompts/modes/plan -H "X-API-Key: {KEY}"`

**Coordination Rules** (Wave and integration protocols):
- Wave Coordination: `curl -X GET {API_ENDPOINT}/api/prompts/coordination-rules/wave_coordination -H "X-API-Key: {KEY}"`
- Integration Rules: `curl -X GET {API_ENDPOINT}/api/prompts/coordination-rules/integration_rules -H "X-API-Key: {KEY}"`
- Quality Gates: `curl -X GET {API_ENDPOINT}/api/prompts/coordination-rules/quality_gates -H "X-API-Key: {KEY}"`
- Mode Operations: `curl -X GET {API_ENDPOINT}/api/prompts/coordination-rules/mode_operations -H "X-API-Key: {KEY}"`
- Workspace Structure: `curl -X GET {API_ENDPOINT}/api/prompts/coordination-rules/workspace_structure -H "X-API-Key: {KEY}"`

**Templates** (Reusable structures and reports):
- Agent Templates: `curl -X GET {API_ENDPOINT}/api/prompts/templates/agent_templates -H "X-API-Key: {KEY}"`
- Team Templates: `curl -X GET {API_ENDPOINT}/api/prompts/templates/team_templates -H "X-API-Key: {KEY}"`
- Wave Execution Plan: `curl -X GET {API_ENDPOINT}/api/prompts/templates/wave-execution-plan-template -H "X-API-Key: {KEY}"`
- Security Templates:
  - Security Audit Report: `curl -X GET {API_ENDPOINT}/api/prompts/templates/security-audit-report-template -H "X-API-Key: {KEY}"`
  - Vulnerability Report: `curl -X GET {API_ENDPOINT}/api/prompts/templates/vulnerability-report-template -H "X-API-Key: {KEY}"`
  - Risk Assessment Matrix: `curl -X GET {API_ENDPOINT}/api/prompts/templates/risk-assessment-matrix-template -H "X-API-Key: {KEY}"`
  - Compliance Matrix: `curl -X GET {API_ENDPOINT}/api/prompts/templates/compliance-matrix-template -H "X-API-Key: {KEY}"`

**Execution Phases** (Step-by-step implementation):
- Phase 1 Analysis: `curl -X GET {API_ENDPOINT}/api/prompts/execution-phases/phase1_analysis -H "X-API-Key: {KEY}"`
- Phase 2 Team Config: `curl -X GET {API_ENDPOINT}/api/prompts/execution-phases/phase2_team_config -H "X-API-Key: {KEY}"`
- Phase 3 Wave Planning: `curl -X GET {API_ENDPOINT}/api/prompts/execution-phases/phase3_wave_planning -H "X-API-Key: {KEY}"`
- Phase 4 Deployment: `curl -X GET {API_ENDPOINT}/api/prompts/execution-phases/phase4_deployment -H "X-API-Key: {KEY}"`
- Phase 5 Execution: `curl -X GET {API_ENDPOINT}/api/prompts/execution-phases/phase5_execution -H "X-API-Key: {KEY}"`
- Phase 6 Integration: `curl -X GET {API_ENDPOINT}/api/prompts/execution-phases/phase6_integration -H "X-API-Key: {KEY}"`
- Phase 7 Quality: `curl -X GET {API_ENDPOINT}/api/prompts/execution-phases/phase7_quality -H "X-API-Key: {KEY}"`
- Wave Execution Protocol: `curl -X GET {API_ENDPOINT}/api/prompts/execution-phases/wave_execution_protocol -H "X-API-Key: {KEY}"`

**CRITICAL API OPERATIONS**:
- **"load_module"** = Fetch from API at specified endpoint
- **"load"** = Fetch from API 
- **"apply"** = Fetch from API and use its contents
- **All modules served from secure Cloudflare API**
- **No local prompt files to ensure security**

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
waves_directory=./.waves/
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
- `waves_directory` (default: "./.waves/")
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
# Based on project_type or mode, fetch specialized configuration from API
if mode != "EXECUTION":
    # Fetch mode-specific config
    mode_config = fetch_from_api(f"/api/prompts/modes/{mode}")
    apply_specialized_methodology(mode_config)
elif project_type != "auto":
    # Fetch project-type config
    project_config = fetch_from_api(f"/api/prompts/modes/{project_type}")
    apply_specialized_methodology(project_config)
```

## Execution Flow

### Phase 1: Project Analysis
```python
# Dynamic project plan creation if needed
if not exists(project_plan):
    project_plan = generate_from_user_request($ARGUMENTS)
    
# Fetch and apply project analysis module from API
analysis_module = fetch_from_api("/api/prompts/execution-phases/phase1_analysis")
project_context = analyze_project(project_plan, workspace_dir)

# Safety assessment and git strategy
apply_safety_measures(workspace_dir, git_strategy)
```

### Phase 2: Team Configuration
```python
# Fetch team templates from API
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
# Fetch wave coordination rules from API
wave_rules = fetch_from_api("/api/prompts/coordination-rules/wave_coordination")
waves = plan_waves(
    teams=teams,
    wave_strategy=wave_strategy,
    wave_count=wave_count,
    rules=wave_rules
)

# CREATE CLEAR WAVE EXECUTION PLAN FOR USER REVIEW
# CRITICAL: Include sub-wave splitting for >10 agents
wave_plan_content = generate_wave_execution_plan(waves, teams, max_agents_per_batch=10)
save_file(f"{workspace_dir}/WAVE_EXECUTION_PLAN.md", wave_plan_content)

# ORGANIZE WORKSPACE - Keep it simple and clean
create_directory(f"{waves_directory}")  # Single directory for all deliverables
```

### Phase 4: Agent Deployment with Rule Injection

**CRITICAL: This is where we ensure no weak links**

**DEPLOYMENT STRATEGY**:
- Collect ALL agents for the wave first (across all teams)
- Deploy in batches of up to 10 agents maximum
- Teams are organizational units - deploy AGENTS, not teams
- Example: 4 teams × 3 agents = 12 agents total = 2 deployment batches

```python
# Fetch core rules and templates from API
agent_templates = fetch_from_api("/api/prompts/templates/agent_templates")
core_rules = fetch_from_api("/api/prompts/agent-rules/core_agent_rules")

for wave in waves:
    agents_to_deploy = []  # Collect ALL agents for this wave
    
    for team in wave.teams:
        for agent in team.agents:
            # MANDATORY RULE INJECTION PROTOCOL
            # Fetch role-specific rules from API
            role_rules = fetch_from_api(f"/api/prompts/agent-rules/{agent.role}_rules")
            
            # Fetch project-specific rules if applicable
            project_rules = None
            if project_type != "auto":
                project_rules = fetch_from_api(f"/api/prompts/agent-rules/{project_type}_rules")
            
            agent_identity = compose_agent_identity(
                # 1. Universal Excellence (MANDATORY)
                core_rules=core_rules,
                
                # 2. Role Specialization (MANDATORY)
                role_rules=role_rules,
                
                # 3. Project Context (CONDITIONAL) 
                project_rules=project_rules,
                
                # 4. Team Context (MANDATORY)
                team_context=team.context,
                
                # 5. Specific Assignment
                assignment=agent.assignment
            )
            
            # Collect agent for batch deployment
            agents_to_deploy.append(agent_identity)
    
    # CRITICAL: Deploy ALL agents in the wave simultaneously (respecting 10-agent limit)
    if len(agents_to_deploy) <= 10:
        deploy_all_agents_parallel(agents_to_deploy)  # Single batch
    else:
        # Split into sub-waves of 10 agents each
        for i in range(0, len(agents_to_deploy), 10):
            batch = agents_to_deploy[i:i+10]
            deploy_all_agents_parallel(batch)  # Deploy batch of up to 10
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
# Fetch integration protocols from API
integration_rules = fetch_from_api("/api/prompts/coordination-rules/integration_rules")
quality_gates = fetch_from_api("/api/prompts/coordination-rules/quality_gates")

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
- Dependencies: core_agent_rules
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

## 📁 Wave Folder Organization (MANDATORY FOR ALL MODES)

### Universal Deliverable Structure
**⚠️ CRITICAL**: This folder structure applies to ALL Shadow Clone modes (audit, feature, refactor, optimize, research, etc.)

All agent deliverables MUST be organized into wave-specific folders within the configured waves directory:

**🎯 WAVES DIRECTORY: `$waves_directory`** (default: `./.waves/` in current workspace)

This is NOT optional - it's a core system requirement for proper agent coordination!

**To use a custom location**, specify in your command:
```
"Load shadow-clone-prompt.md and execute with waves_directory=/my/custom/path/.waves/"
```

```
$waves_directory/
├── wave-1/
│   ├── [agent-1-deliverables]
│   ├── [agent-2-deliverables]
│   ├── [shared-documents]
│   └── WAVE_1_SUMMARY.md
├── wave-2/
│   ├── [agent-deliverables]
│   └── WAVE_2_SUMMARY.md
├── wave-3/
│   └── [final-deliverables]
└── FINAL_DELIVERABLES.md
```

### Wave Folder Rules
1. **USE CONFIGURED PATH**: Always use `$waves_directory` (default: `./.waves/`)
2. **Automatic Creation**: Each wave gets its own folder (`$waves_directory/wave-1/`, etc.)
3. **Agent Organization**: Each agent saves work in the current wave folder
4. **Shared Documents**: Documents accessed by multiple agents go in the wave folder root
5. **Sub-waves**: For waves >10 agents, use sub-folders (`$waves_directory/wave-1a/`, etc.)
6. **Final Consolidation**: Master deliverables may be copied to `$waves_directory` root after all waves complete

### Mode-Specific Examples

Mode-specific examples and folder structures are provided in each mode configuration file. When loading a mode, refer to its specific documentation for:
- Expected deliverable structure
- Wave organization patterns
- Mode-specific templates and reports
- Example outputs and workflows

Fetch the appropriate mode configuration from the API to see detailed examples for your use case.

## Agent Deployment Example

```markdown
# Example of proper agent deployment ensuring no weak links

AGENT: Frontend Architecture Master
TEAM: UI Development Team (3 masters)
WAVE: 2

IDENTITY INJECTION:
1. Core Rules: Fetched from /api/prompts/agent-rules/core_agent_rules
   - Master craftsman mindset ✓
   - Quality over speed ✓
   - System integrity responsibility ✓
   
2. Role Rules: Fetched from /api/prompts/agent-rules/frontend_architect_rules
   - Component design expertise ✓
   - Performance optimization mastery ✓
   - Accessibility standards ✓
   
3. Project Rules: Fetched from /api/prompts/agent-rules/ecommerce_rules
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

1. **Streamlined Orchestration**: ~600 lines of focused coordination
2. **Guaranteed Excellence**: Every agent properly configured
3. **No Weak Links**: Universal rule injection ensures consistency
4. **Modular Flexibility**: Easy to extend and customize via API
5. **Security First**: All prompts served from secure API
6. **Clear Responsibility**: Each module has focused purpose

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
└── $waves_directory/          # All agent deliverables
    ├── constitution.md        # Central coordination authority
    ├── file_reservations.md   # CRITICAL: File lock management
    ├── wave-[n]/             # Wave-specific deliverables
    └── [ALL_REPORTS]         # All audit reports and deliverables
```

**DOCUMENT UPDATE COORDINATION**: Multiple agents NEVER update the same file simultaneously. Check `$waves_directory/file_reservations.md` for the coordination protocol.

## 📋 DEPLOYMENT FORMAT - CRITICAL FOR SUCCESS

When deploying agents, use this EXACT format to ensure parallel execution:

**For waves with ≤10 agents (single batch):**
```
🚀 WAVE 1 DEPLOYMENT - [X] AGENTS IN PARALLEL

Deploying all [X] agents simultaneously:

[Use X parallel Task() calls - one per agent, NOT one per team]
```

**For waves with >10 agents (multiple batches):**
```
🚀 WAVE 1A DEPLOYMENT - FIRST 10 AGENTS

Deploying first 10 agents simultaneously:

[Use 10 parallel Task() calls]

🚀 WAVE 1B DEPLOYMENT - REMAINING [X] AGENTS  

Deploying remaining [X] agents simultaneously:

[Use X parallel Task() calls]
```

**REMEMBER**: Count AGENTS, not teams! A team with 3 agents = 3 Task() calls.

**🎯 DEFAULT ACTION**: Simply reply **"Execute"** to begin with the created plan.

**Alternative Commands**:
- `"Execute"` - Start with current configuration
- `"Execute but [modification]"` - Start with changes
- `"Show plan"` - Review the WAVE_EXECUTION_PLAN.md
- `"Status"` - Check current state

## ⚡ CRITICAL EXECUTION REQUIREMENT

**PARALLEL DEPLOYMENT IS MANDATORY**:
- All agents in a wave MUST deploy SIMULTANEOUSLY (up to 10 agents per batch)
- NO sequential deployment (one agent at a time)
- NO team-by-team deployment - deploy ALL agents at once
- Maximum 10 agents per deployment due to system constraints
- For waves with >10 agents, split into sub-waves (e.g., Wave 1A, Wave 1B)

**IMPORTANT CLARIFICATION - Teams vs Agents**:
- **Teams** = Organizational groupings (e.g., "Authentication Team")
- **Agents** = Individual workers that need deployment (e.g., "Session Security Specialist")
- Deploy AGENTS, not teams!

**Examples**:
- Wave with 6 agents across 2 teams = 6 parallel Task deployments
- Wave with 12 agents across 4 teams = Split into:
  - Wave 1A: 10 agents (parallel deployment)
  - Wave 1B: 2 agents (parallel deployment)
- WRONG: Deploy Team 1, then Team 2, then Team 3 ❌
- RIGHT: Deploy all 10 agents from all teams at once ✓

## Remember

The Shadow Clone System's strength comes from ensuring every agent - regardless of role - operates with the same core principles and master-level expertise. This optimized orchestrator guarantees proper rule injection while maintaining clean, modular architecture through secure API access.

**Every agent is a master. Every master is essential. No weak links allowed.**