<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
See LICENSE-PROPRIETARY.md for full terms.
-->

# Phase 3: Wave Planning and Assignment

## Module Interface
- **Inputs**: 
  - Configured teams from Phase 2
  - `wave_strategy` parameter
  - `wave_count` parameter
  - Wave coordination rules
  - Project dependencies
- **Outputs**: 
  - Wave assignments for all teams
  - Wave execution timeline
  - Dependency graph
  - Handoff specifications
  - Convergence schedule
- **Dependencies**: 
  - `wave_coordination.md`
  - Team configuration data
  - Project timeline constraints

## Phase Objectives
1. Organize teams into execution waves for optimal parallelization
2. Respect dependencies between teams
3. Balance workload across waves
4. Define clear handoff points
5. Establish convergence and coordination protocols

## Execution Steps

### 1. Load Wave Coordination Rules
```python
wave_rules = load_module(".shadow/coordination_rules/wave_coordination.md")

# Extract coordination protocols
convergence_protocol = wave_rules.convergence_protocol
handoff_protocol = wave_rules.handoff_protocol
quality_gates = wave_rules.quality_gates
```

### 2. Analyze Team Dependencies
```python
def analyze_dependencies(teams):
    dependency_graph = {}
    
    for team in teams:
        team_deps = []
        
        # Common dependency patterns
        if team["name"] == "Implementation Team":
            team_deps.extend(["Requirements Team", "Architecture Team"])
        elif team["name"] == "Testing Team":
            team_deps.append("Implementation Team")
        elif team["name"] == "DevOps Team":
            team_deps.extend(["Implementation Team", "Testing Team"])
        elif team["name"] == "Documentation Team":
            team_deps.append("Implementation Team")
        
        # Filter to only include teams that exist
        existing_deps = [dep for dep in team_deps if dep in [t["name"] for t in teams]]
        dependency_graph[team["name"]] = existing_deps
    
    return dependency_graph
```

### 3. Wave Strategy Implementation
```python
def apply_wave_strategy(teams, wave_strategy, wave_count, dependency_graph):
    if wave_strategy == "auto":
        return auto_wave_assignment(teams, dependency_graph)
    
    elif wave_strategy == "manual":
        # Read wave assignments from project plan
        return manual_wave_assignment(teams, project_plan)
    
    elif wave_strategy == "dependency":
        return dependency_based_assignment(teams, dependency_graph)
    
    elif wave_strategy == "balanced":
        return balanced_wave_assignment(teams, wave_count, dependency_graph)

def auto_wave_assignment(teams, dependency_graph):
    # Topological sort based on dependencies
    waves = []
    assigned = set()
    
    while len(assigned) < len(teams):
        current_wave = []
        
        for team in teams:
            if team["name"] in assigned:
                continue
            
            # Check if all dependencies are satisfied
            deps = dependency_graph.get(team["name"], [])
            if all(dep in assigned for dep in deps):
                current_wave.append(team)
        
        if not current_wave:
            # Handle circular dependencies
            unassigned = [t for t in teams if t["name"] not in assigned]
            current_wave = [unassigned[0]]  # Force progress
        
        waves.append(current_wave)
        for team in current_wave:
            assigned.add(team["name"])
    
    return waves

def balanced_wave_assignment(teams, target_wave_count, dependency_graph):
    # Start with dependency-based assignment
    initial_waves = dependency_based_assignment(teams, dependency_graph)
    
    # Attempt to rebalance to target wave count
    if len(initial_waves) <= target_wave_count:
        return initial_waves
    
    # Merge waves while respecting dependencies
    return merge_waves(initial_waves, target_wave_count, dependency_graph)
```

### 4. Dynamic Wave Sizing
```python
def determine_wave_count(project_complexity, team_count):
    if wave_count != "dynamic":
        return int(wave_count)
    
    # Dynamic calculation based on project characteristics
    if project_complexity == "simple":
        return min(2, team_count)  # 2-3 waves
    elif project_complexity == "medium":
        return min(4, team_count)  # 3-5 waves  
    elif project_complexity == "complex":
        return min(6, team_count)  # 4-8 waves
    
    # Never more waves than teams
    return min(suggested_waves, team_count)
```

### 5. Wave Assignment Creation
```python
def create_wave_assignments(waves, project_context):
    wave_assignments = []
    
    for wave_idx, teams_in_wave in enumerate(waves):
        wave = {
            "number": wave_idx + 1,
            "name": f"Wave {wave_idx + 1}",
            "objective": determine_wave_objective(wave_idx, teams_in_wave, project_context),
            "teams": teams_in_wave,
            "duration": estimate_wave_duration(teams_in_wave),
            "prerequisites": [],
            "deliverables": [],
            "success_criteria": []
        }
        
        # Set prerequisites from previous waves
        if wave_idx > 0:
            wave["prerequisites"] = gather_prerequisites(wave_assignments[:wave_idx])
        
        # Define deliverables
        for team in teams_in_wave:
            wave["deliverables"].extend(team["deliverables"])
        
        # Set success criteria
        wave["success_criteria"] = [
            "All team deliverables complete",
            "Quality gates passed",
            "Integration tests passing",
            "Documentation updated",
            "Ready for handoff"
        ]
        
        wave_assignments.append(wave)
    
    return wave_assignments
```

### 6. Convergence Schedule Planning
```python
def plan_convergence_schedule(wave_assignments):
    convergence_schedule = []
    
    for wave in wave_assignments:
        # Pre-wave convergence
        convergence_schedule.append({
            "type": "pre_wave",
            "wave": wave["number"],
            "timing": "T-30min",
            "participants": [team["name"] for team in wave["teams"]],
            "agenda": [
                "Confirm prerequisites available",
                "Review wave objectives",
                "Distribute file reservations",
                "Clarify dependencies"
            ]
        })
        
        # Mid-wave convergence (for waves > 2 hours)
        if wave["duration"] > 120:  # minutes
            convergence_schedule.append({
                "type": "mid_wave",
                "wave": wave["number"],
                "timing": "T+50%",
                "participants": [team["name"] for team in wave["teams"]],
                "agenda": [
                    "Progress check",
                    "Blocker identification",
                    "Resource reallocation",
                    "Timeline adjustment"
                ]
            })
        
        # Post-wave convergence
        convergence_schedule.append({
            "type": "post_wave",
            "wave": wave["number"],
            "timing": "T+complete",
            "participants": "all_teams",
            "agenda": [
                "Deliverable validation",
                "Quality gate review",
                "Handoff preparation",
                "Next wave briefing"
            ]
        })
    
    return convergence_schedule
```

### 7. Handoff Specification
```python
def specify_handoffs(wave_assignments):
    handoff_specs = []
    
    for i in range(len(wave_assignments) - 1):
        current_wave = wave_assignments[i]
        next_wave = wave_assignments[i + 1]
        
        handoff = {
            "from_wave": current_wave["number"],
            "to_wave": next_wave["number"],
            "handoff_items": [],
            "validation_required": True,
            "rollback_plan": "available"
        }
        
        # Identify specific handoffs
        for current_team in current_wave["teams"]:
            for next_team in next_wave["teams"]:
                if current_team["name"] in dependency_graph.get(next_team["name"], []):
                    handoff["handoff_items"].append({
                        "from": current_team["name"],
                        "to": next_team["name"],
                        "artifacts": current_team["deliverables"],
                        "validation": f"Must pass {next_team['name']} acceptance criteria"
                    })
        
        handoff_specs.append(handoff)
    
    return handoff_specs
```

## Wave Assignment Template

```markdown
WAVE: [Wave Number]
OBJECTIVE: [Primary sprint goal]
DURATION: [Estimated completion time]
TEAMS: [List of teams in this wave]

PREREQUISITES:
- Wave [N-1] deliverables: [Specific outputs needed]
- External dependencies: [Any external requirements]

DELIVERABLES:
- [Output 1]: [Description and location]
- [Output 2]: [Description and location]

SUCCESS CRITERIA:
- [Criterion 1]: [How to measure completion]
- [Criterion 2]: [Quality standards]

HANDOFF TO NEXT WAVE:
- [What gets passed to Wave N+1]
- [Location of handoff materials]
```

## Deliverables
1. **Wave Assignment Plan**: Complete wave structure with teams
2. **Dependency Graph**: Visual/documented dependencies
3. **Convergence Schedule**: Timed coordination points
4. **Handoff Specifications**: Detailed transition requirements
5. **Timeline Estimate**: Overall project timeline

## Quality Gates
Before proceeding to Phase 4:
- ✓ All teams assigned to waves
- ✓ Dependencies respected (no circular dependencies)
- ✓ Workload reasonably balanced
- ✓ Convergence points scheduled
- ✓ Handoff protocols defined
- ✓ Timeline realistic and agreed

## Example Wave Configurations

### Example 1: Simple Web Application (3 waves)
```
Wave 1: Foundation
- Requirements Team (2 agents)
- Architecture Team (2 agents)
Duration: 2 hours

Wave 2: Implementation
- Frontend Team (3 agents)
- Backend Team (3 agents)
Duration: 4 hours

Wave 3: Integration & Deployment
- Testing Team (2 agents)
- DevOps Team (2 agents)
Duration: 3 hours
```

### Example 2: Security Audit (4 waves)
```
Wave 1: Reconnaissance
- Recon Team (2 agents)
Duration: 1 hour

Wave 2: Vulnerability Assessment
- Web Security Team (3 agents)
- Infrastructure Team (2 agents)
Duration: 3 hours

Wave 3: Exploitation & Validation
- Penetration Team (3 agents)
Duration: 2 hours

Wave 4: Reporting & Remediation
- Documentation Team (2 agents)
- Remediation Team (2 agents)
Duration: 2 hours
```

## Success Metrics
- Dependency conflicts: 0
- Wave balance (workload variance): <20%
- Parallelization efficiency: >70%
- Clear handoff specifications: 100%
- Realistic timeline: Achievable with buffer