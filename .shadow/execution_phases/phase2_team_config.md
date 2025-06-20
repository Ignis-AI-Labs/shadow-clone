# Phase 2: Team Configuration

## Module Interface
- **Inputs**: 
  - Project context from Phase 1
  - `num_teams` parameter
  - `team_composition` parameter
  - Team templates from `.shadow/templates/team_templates.md`
- **Outputs**: 
  - Configured teams with assigned roles
  - Agent allocation per team
  - Team working directories
  - Team-specific contexts
- **Dependencies**: 
  - `team_templates.md`
  - Project type configurations
  - Agent rule files

## Phase Objectives
1. Determine optimal team structure based on project analysis
2. Configure teams with appropriate master craftsmen
3. Allocate agents according to team_composition settings
4. Prepare team contexts for agent deployment
5. Ensure balanced expertise distribution

## Execution Steps

### 1. Load Team Templates
```python
team_templates = load_module(".shadow/templates/team_templates.md")

# Select appropriate template based on project type
if project_context.type == "software" or project_context.type == "new":
    base_teams = team_templates.software_development_masters
elif project_context.type == "audit":
    base_teams = team_templates.security_audit_masters
elif project_context.type == "research":
    base_teams = team_templates.research_investigation_masters
elif project_context.type == "optimize":
    base_teams = team_templates.code_optimization_masters
else:
    base_teams = team_templates.software_development_masters  # Default
```

### 2. Dynamic Team Count Determination
If `num_teams` is "dynamic":
```python
def determine_team_count(project_context):
    complexity = project_context.complexity
    scope = project_context.scope
    
    if complexity == "simple" and scope == "small":
        return 2  # Minimal teams
    elif complexity == "simple" and scope == "medium":
        return 3
    elif complexity == "medium" and scope == "small":
        return 3
    elif complexity == "medium" and scope == "medium":
        return 4
    elif complexity == "complex" or scope == "large":
        return 5
    else:
        return 6  # Maximum for very complex projects
```

### 3. Team Composition Control
```python
def allocate_agents_to_teams(num_teams, team_composition, total_agents=15):
    if team_composition == "auto":
        # Use predefined allocations from templates
        return template_based_allocation(num_teams)
    
    elif team_composition == "balanced":
        # Distribute evenly
        agents_per_team = total_agents // num_teams
        remainder = total_agents % num_teams
        
        allocation = [agents_per_team] * num_teams
        # Distribute remainder to first teams
        for i in range(remainder):
            allocation[i] += 1
        
        return allocation
    
    elif isinstance(team_composition, str):
        # Parse custom specification
        if team_composition.startswith("[") and team_composition.endswith("]"):
            # Format: "[4,3,2,5]"
            return parse_array_format(team_composition)
        elif ":" in team_composition:
            # Format: "frontend:4,backend:3,testing:2"
            return parse_named_format(team_composition)
        else:
            # Format: JSON-like dictionary
            return parse_dict_format(team_composition)
```

### 4. Team Configuration Creation
```python
def configure_teams(base_teams, allocation, project_context):
    configured_teams = []
    
    for idx, (team_template, agent_count) in enumerate(zip(base_teams, allocation)):
        team = {
            "id": f"team_{idx + 1}",
            "name": team_template.name,
            "domain": team_template.domain,
            "agent_count": agent_count,
            "agents": [],
            "working_directory": f"{project_context.workspace}/.waves/team_{idx + 1}",
            "deliverables": team_template.deliverables,
            "dependencies": team_template.dependencies
        }
        
        # Configure individual agents within team
        for agent_idx in range(agent_count):
            agent = configure_agent(team, agent_idx, agent_count)
            team["agents"].append(agent)
        
        configured_teams.append(team)
    
    return configured_teams
```

### 5. Agent Role Distribution
```python
def configure_agent(team, agent_idx, total_agents_in_team):
    # Role distribution based on team size
    if total_agents_in_team == 1:
        role = "master"
        responsibilities = "all"
    
    elif total_agents_in_team == 2:
        if agent_idx == 0:
            role = "lead"
            responsibilities = "coordination_and_primary"
        else:
            role = "specialist"
            responsibilities = "supporting_and_qa"
    
    elif total_agents_in_team == 3:
        if agent_idx == 0:
            role = "lead"
            responsibilities = "coordination"
        elif agent_idx == 1:
            role = "implementation"
            responsibilities = "core_development"
        else:
            role = "qa"
            responsibilities = "quality_assurance"
    
    elif total_agents_in_team == 4:
        roles = ["lead", "senior_implementation", "junior_implementation", "qa_documentation"]
        role = roles[agent_idx]
    
    else:  # 5+ agents
        if agent_idx == 0:
            role = "lead"
        elif agent_idx < total_agents_in_team - 2:
            role = f"implementation_{agent_idx}"
        elif agent_idx == total_agents_in_team - 2:
            role = "qa"
        else:
            role = "documentation"
    
    return {
        "id": f"{team['id']}_agent_{agent_idx + 1}",
        "role": role,
        "responsibilities": responsibilities,
        "status": "configured",
        "reserved_files": [],  # Will be assigned in Phase 4
        "rule_sets": [
            "core_agent_rules",
            f"{role}_rules",
            f"{team['domain']}_rules"
        ]
    }
```

### 6. Team Context Preparation
```python
def prepare_team_contexts(configured_teams, project_context):
    for team in configured_teams:
        team["context"] = {
            "project": project_context.summary,
            "project_type": project_context.type,
            "team_objective": determine_team_objective(team, project_context),
            "quality_standards": {
                "code_coverage": 80,
                "peer_review": "mandatory",
                "documentation": "comprehensive",
                "security_scan": "required"
            },
            "coordination": {
                "convergence_frequency": "every_2_hours",
                "state_reporting": "continuous",
                "handoff_protocol": "validated"
            }
        }
```

### 7. Workspace Preparation
```python
def prepare_team_workspaces(configured_teams, workspace_dir):
    for team in configured_teams:
        # Create team directory
        create_directory(team["working_directory"])
        
        # Create team structure
        create_directory(f"{team['working_directory']}/src")
        create_directory(f"{team['working_directory']}/tests")
        create_directory(f"{team['working_directory']}/docs")
        create_directory(f"{team['working_directory']}/config")
        
        # Initialize team documentation
        create_file(f"{team['working_directory']}/README.md", f"""
        # {team['name']}
        
        ## Team Objective
        {team['context']['team_objective']}
        
        ## Team Members
        - Total Agents: {team['agent_count']}
        - Roles: {[agent['role'] for agent in team['agents']]}
        
        ## Deliverables
        {team['deliverables']}
        """)
```

## Deliverables
1. **Configured Teams List**: Complete team structures with agents
2. **Team Workspaces**: Initialized directories for each team
3. **Agent Allocations**: Specific role assignments
4. **Team Contexts**: Prepared contexts for agent deployment
5. **Coordination Plan**: How teams will work together

## Quality Gates
Before proceeding to Phase 3:
- ✓ All teams have at least one agent
- ✓ Total agent count matches expected
- ✓ Each team has clear objectives
- ✓ Workspaces successfully created
- ✓ No role conflicts or gaps
- ✓ Dependencies between teams identified

## Configuration Examples

### Example 1: Auto Configuration
```
num_teams=4 team_composition="auto"
Result:
- Requirements Team: 2 agents
- Architecture Team: 2 agents  
- Implementation Team: 4 agents
- QA/DevOps Team: 3 agents
```

### Example 2: Custom Named Configuration
```
team_composition="security:4,performance:2,quality:3,documentation:1"
Result:
- Security Team: 4 agents (Lead + 3 specialists)
- Performance Team: 2 agents (Lead + specialist)
- Quality Team: 3 agents (Lead + Implementation + QA)
- Documentation Team: 1 agent (Master)
```

### Example 3: Balanced Configuration
```
num_teams=5 team_composition="balanced" (15 agents total)
Result: Each team gets 3 agents with consistent role distribution
```

## Success Metrics
- Team configuration time: <5 seconds
- Optimal agent distribution achieved
- All teams have required expertise
- No single points of failure (except single-agent teams)