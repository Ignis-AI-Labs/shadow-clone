export const PHASE4_DEPLOYMENT = `<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
See LICENSE-PROPRIETARY.md for full terms.
-->

# Phase 4: Agent Deployment with Rule Injection

## Module Interface
- **Inputs**: 
  - Wave assignments from Phase 3
  - Agent templates from \`.shadow/templates/agent_templates.md\`
  - All agent rule files from \`.shadow/agent_rules/\`
  - Team contexts from Phase 2
  - File reservation system
- **Outputs**: 
  - Deployed agents with complete identities
  - File reservations per agent
  - Agent state tracking files
  - Team coordination structures
  - Quality verification reports
- **Dependencies**: 
  - Core agent rules (mandatory)
  - Role-specific rules (mandatory)
  - Project-type rules (conditional)
  - Agent templates
  - Validation framework

## Phase Objectives
1. Deploy all agents with proper rule injection
2. Ensure no weak links through validation
3. Assign exclusive file reservations
4. Initialize agent state tracking
5. Verify deployment quality

## CRITICAL: Rule Injection Protocol

### Mandatory Rule Layers
Every agent MUST receive these rule layers in order:

1. **Core Rules** (Universal - Never Override)
   - Master craftsman mindset
   - Quality standards (90% minimum)
   - Coordination protocols
   - File sovereignty rules
   - No weak links enforcement

2. **Role Rules** (Specialization)
   - Role-specific expertise
   - Specialized workflows
   - Domain best practices
   - Role quality metrics

3. **Project Rules** (Context - When Applicable)
   - Project-type guidelines
   - Industry standards
   - Compliance requirements
   - Special considerations

4. **Team Context** (Coordination)
   - Team objectives
   - Peer relationships
   - Dependencies
   - Deliverables

## Execution Steps

### 1. Load Agent Infrastructure
\`\`\`python
# Load all required components
agent_templates = load_module(".shadow/templates/agent_templates.md")
core_rules = load_module(".shadow/agent_rules/core_agent_rules.md")

# Validate core rules include "No Weak Links" enforcement
if "No Weak Links Enforcement Protocol" not in core_rules:
    raise CriticalError("Core rules missing No Weak Links enforcement!")

# Initialize tracking systems
file_reservation_system = initialize_file_reservations()
agent_registry = initialize_agent_registry()
validation_framework = load_validation_framework()
\`\`\`

### 2. Wave-by-Wave Deployment
\`\`\`python
for wave in wave_assignments:
    print(f"Deploying Wave {wave['number']}: {wave['objective']}")
    
    # Initialize wave tracking
    wave_dir = f"{workspace_dir}/.waves/wave_{wave['number']}"
    create_directory(wave_dir)
    create_directory(f"{wave_dir}/team_reports")
    
    # Deploy all teams in this wave
    for team in wave["teams"]:
        deploy_team_agents(team, wave, core_rules)
\`\`\`

### 3. Agent Identity Composition
\`\`\`python
def compose_agent_identity(agent, team, wave, project_type):
    """
    CRITICAL FUNCTION: This ensures no weak links in the system
    """
    # 1. Load Universal Excellence (MANDATORY)
    identity = {
        "core_rules": load_module(".shadow/agent_rules/core_agent_rules.md"),
        "layers": ["core"]
    }
    
    # 2. Load Role Specialization (MANDATORY)
    role_file = determine_role_file(agent["role"])
    if not exists(f".shadow/agent_rules/{role_file}"):
        # Use closest match or default
        role_file = find_closest_role_match(agent["role"])
    
    identity["role_rules"] = load_module(f".shadow/agent_rules/{role_file}")
    identity["layers"].append("role")
    
    # 3. Load Project Context (CONDITIONAL)
    project_rules_file = f".shadow/agent_rules/{project_type}_agent_rules.md"
    if exists(project_rules_file):
        identity["project_rules"] = load_module(project_rules_file)
        identity["layers"].append("project")
    
    # 4. Add Team Context (MANDATORY)
    identity["team_context"] = {
        "team_name": team["name"],
        "team_objective": team["context"]["team_objective"],
        "wave_number": wave["number"],
        "peer_agents": [a["id"] for a in team["agents"] if a["id"] != agent["id"]],
        "dependencies": team["dependencies"],
        "deliverables": agent["deliverables"]
    }
    
    # 5. Add Specific Assignment
    identity["assignment"] = {
        "agent_id": agent["id"],
        "role": agent["role"],
        "responsibilities": agent["responsibilities"],
        "working_directory": f"{team['working_directory']}/agent_{agent['id']}",
        "reserved_files": [],  # Will be populated next
        "state_file": f"{wave_dir}/team_reports/{agent['id']}_state.md"
    }
    
    return identity

def determine_role_file(role):
    """Map agent roles to rule files"""
    role_mapping = {
        "lead": "team_lead_rules.md",
        "team_lead": "team_lead_rules.md",
        "implementation": "development_agent_rules.md",
        "senior_implementation": "development_agent_rules.md",
        "junior_implementation": "development_agent_rules.md",
        "qa": "qa_agent_rules.md",
        "quality": "qa_agent_rules.md",
        "devops": "devops_agent_rules.md",
        "security": "security_agent_rules.md",
        "documentation": "documentation_agent_rules.md",
        "audit": "audit_agent_rules.md",
        "research": "research_agent_rules.md"
    }
    
    # Direct mapping
    if role in role_mapping:
        return role_mapping[role]
    
    # Try to match by keywords
    role_lower = role.lower()
    for key, value in role_mapping.items():
        if key in role_lower:
            return value
    
    # Default to development rules
    return "development_agent_rules.md"
\`\`\`

### 4. File Reservation Assignment
\`\`\`python
def assign_file_reservations(agent, team, existing_reservations):
    """
    Assign exclusive file access to prevent conflicts
    """
    reserved_files = []
    
    # Team lead gets integration files
    if agent["role"] == "lead":
        reserved_files.extend([
            f"{team['working_directory']}/README.md",
            f"{team['working_directory']}/integration.md",
            f"{team['working_directory']}/team_coordination.md"
        ])
    
    # Assign based on responsibilities
    if "frontend" in team["name"].lower():
        if agent["role"] == "implementation":
            reserved_files.extend(glob(f"{team['working_directory']}/src/components/*.js"))
        elif agent["role"] == "qa":
            reserved_files.extend(glob(f"{team['working_directory']}/tests/frontend/*.test.js"))
    
    elif "backend" in team["name"].lower():
        if agent["role"] == "implementation":
            reserved_files.extend(glob(f"{team['working_directory']}/src/api/*.py"))
        elif agent["role"] == "qa":
            reserved_files.extend(glob(f"{team['working_directory']}/tests/api/*.test.py"))
    
    # Ensure no conflicts
    for file in reserved_files[:]:
        if file in existing_reservations:
            reserved_files.remove(file)
            log_warning(f"File {file} already reserved, skipping for {agent['id']}")
    
    # Update global reservations
    for file in reserved_files:
        existing_reservations[file] = agent["id"]
    
    return reserved_files
\`\`\`

### 5. Quality Validation
\`\`\`python
def validate_agent_deployment(agent_identity):
    """
    CRITICAL: Enforce "No Weak Links" principle
    """
    validation_results = {
        "passed": True,
        "checks": [],
        "failures": []
    }
    
    # Check 1: Core rules present
    if "core_rules" not in agent_identity or not agent_identity["core_rules"]:
        validation_results["failures"].append("Missing core rules - CRITICAL")
        validation_results["passed"] = False
    else:
        validation_results["checks"].append("✓ Core rules present")
    
    # Check 2: No Weak Links enforcement
    if "No Weak Links Enforcement Protocol" not in str(agent_identity.get("core_rules", "")):
        validation_results["failures"].append("No Weak Links protocol missing - CRITICAL")
        validation_results["passed"] = False
    else:
        validation_results["checks"].append("✓ No Weak Links protocol active")
    
    # Check 3: Role rules present
    if "role_rules" not in agent_identity or not agent_identity["role_rules"]:
        validation_results["failures"].append("Missing role-specific rules")
        validation_results["passed"] = False
    else:
        validation_results["checks"].append("✓ Role rules loaded")
    
    # Check 4: Team context complete
    required_context = ["team_name", "team_objective", "wave_number", "deliverables"]
    context = agent_identity.get("team_context", {})
    for field in required_context:
        if field not in context:
            validation_results["failures"].append(f"Missing team context: {field}")
            validation_results["passed"] = False
    
    if all(field in context for field in required_context):
        validation_results["checks"].append("✓ Team context complete")
    
    # Check 5: Assignment valid
    assignment = agent_identity.get("assignment", {})
    if not assignment.get("agent_id") or not assignment.get("role"):
        validation_results["failures"].append("Invalid agent assignment")
        validation_results["passed"] = False
    else:
        validation_results["checks"].append("✓ Valid assignment")
    
    # Check 6: Working directory exists
    if assignment.get("working_directory"):
        create_directory(assignment["working_directory"])
        validation_results["checks"].append("✓ Working directory prepared")
    
    return validation_results
\`\`\`

### 6. Agent Deployment Execution
\`\`\`python
def deploy_agent(agent_identity, validation_results):
    """
    Deploy agent only if validation passes
    """
    if not validation_results["passed"]:
        raise WeakLinkError(f"Cannot deploy agent - validation failed: {validation_results['failures']}")
    
    # Create agent deployment package
    deployment = {
        "identity": agent_identity,
        "validation": validation_results,
        "deployed_at": timestamp(),
        "status": "active"
    }
    
    # Initialize agent state file
    state_file = agent_identity["assignment"]["state_file"]
    create_file(state_file, f"""
## Agent State Report
**Agent**: {agent_identity['assignment']['agent_id']}
**Role**: {agent_identity['assignment']['role']}
**Team**: {agent_identity['team_context']['team_name']}
**Wave**: {agent_identity['team_context']['wave_number']}
**Deployed**: {deployment['deployed_at']}

### Identity Verification
- Core Rules: ✓ Loaded
- Role Rules: ✓ Loaded ({agent_identity['assignment']['role']})
- Project Rules: {'✓ Loaded' if 'project' in agent_identity['layers'] else 'N/A'}
- No Weak Links: ✓ Enforced

### Current Status
- Status: Ready
- Progress: 0%
- Blockers: None

### Reserved Files
{chr(10).join('- ' + f for f in agent_identity['assignment']['reserved_files'])}

### Quality Commitment
I am a master craftsman in my domain. I will maintain 90%+ quality standards.
There are no weak links in our system. Every agent operates at master level.
""")
    
    # Register agent
    agent_registry[agent_identity["assignment"]["agent_id"]] = deployment
    
    # Log successful deployment
    log_info(f"Successfully deployed {agent_identity['assignment']['agent_id']} with {len(agent_identity['layers'])} rule layers")
    
    return deployment
\`\`\`

### 7. Team Deployment Completion
\`\`\`python
def finalize_team_deployment(team, deployed_agents):
    """
    Finalize team setup after all agents deployed
    """
    # Create team coordination file
    team_coord_file = f"{team['working_directory']}/team_coordination.md"
    create_file(team_coord_file, f"""
# {team['name']} Coordination

## Team Composition
Total Agents: {len(deployed_agents)}

### Agent Roster
{chr(10).join(f"- {a['identity']['assignment']['agent_id']}: {a['identity']['assignment']['role']}" for a in deployed_agents)}

## Coordination Protocols
- Convergence Frequency: {team['context']['coordination']['convergence_frequency']}
- State Reporting: {team['context']['coordination']['state_reporting']}
- Handoff Protocol: {team['context']['coordination']['handoff_protocol']}

## Quality Standards
- Minimum Quality Score: 90%
- Peer Review: Mandatory
- Testing: >80% coverage
- Documentation: Comprehensive

## File Reservations
{generate_file_reservation_summary(deployed_agents)}

## No Weak Links Verification
All agents have been deployed with:
- ✓ Core behavioral rules (including No Weak Links enforcement)
- ✓ Role-specific expertise rules
- ✓ Project context (where applicable)
- ✓ Team coordination protocols
- ✓ Quality gate requirements

This team is ready for Wave {team['wave_number']} execution.
""")
\`\`\`

## Deployment Package Structure

Each deployed agent receives:
\`\`\`
{
  "identity": {
    "core_rules": [Universal behavioral DNA],
    "role_rules": [Specialized expertise],
    "project_rules": [Context-specific guidelines],
    "team_context": {
      "team_name": "...",
      "team_objective": "...",
      "peer_agents": [...],
      "dependencies": [...],
      "deliverables": [...]
    },
    "assignment": {
      "agent_id": "...",
      "role": "...",
      "responsibilities": "...",
      "working_directory": "...",
      "reserved_files": [...],
      "state_file": "..."
    }
  },
  "validation": {
    "passed": true,
    "checks": ["✓ Core rules", "✓ No Weak Links", ...],
    "failures": []
  }
}
\`\`\`

## Deliverables
1. **Deployed Agents**: All agents with validated identities
2. **File Reservations**: Complete reservation registry
3. **Agent State Files**: Initialized tracking files
4. **Team Coordination Files**: Team-level organization
5. **Deployment Report**: Success metrics and validation results

## Quality Gates
Before proceeding to Phase 5:
- ✓ 100% of agents pass validation
- ✓ No weak links detected
- ✓ All file reservations conflict-free
- ✓ State tracking initialized
- ✓ Team coordination structures in place
- ✓ Quality commitments documented

## Error Handling
- **Validation Failure**: Stop deployment, fix issues, re-validate
- **File Conflicts**: Reassign files, update reservations
- **Missing Rules**: Use closest match with warning
- **Resource Issues**: Scale down team size if needed

## Success Metrics
- Agent deployment success rate: 100% (no weak links)
- Validation pass rate: 100%
- File conflict rate: 0%
- Average deployment time per agent: <2 seconds
- Rule injection completeness: 100%`;