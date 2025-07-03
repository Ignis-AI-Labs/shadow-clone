<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
See LICENSE-PROPRIETARY.md for full terms.
-->

# Shadow Clone Module Loader Specification

## Overview
The module loader ensures proper loading and injection of all system components while maintaining the "no weak links" principle.

## Core Loading Functions

### 1. Load Agent Rules
```python
def load_agent_rules(agent_role, project_type=None):
    """
    Loads and combines agent rules ensuring proper hierarchy:
    1. Core rules (base layer - never overridden)
    2. Role rules (enhancements)
    3. Project rules (additional context)
    """
    rules = {
        "core": load_module(".shadow/agent_rules/core_agent_rules.md"),
        "role": load_module(f".shadow/agent_rules/{agent_role}_rules.md"),
        "project": None
    }
    
    if project_type and exists(f".shadow/agent_rules/{project_type}_rules.md"):
        rules["project"] = load_module(f".shadow/agent_rules/{project_type}_rules.md")
    
    return rules
```

### 2. Load Team Configuration
```python
def load_team_configuration(project_type, team_size):
    """
    Loads appropriate team template based on project needs
    """
    team_templates = load_module(".shadow/templates/team_templates.md")
    
    if project_type == "software":
        return team_templates.software_development_masters
    elif project_type == "research":
        return team_templates.research_project_masters
    elif project_type == "security":
        return team_templates.security_audit_masters
    # ... other types
    
    # Dynamic team creation for custom needs
    return create_custom_team(team_size)
```

### 3. Load Wave Coordination
```python
def load_wave_coordination():
    """
    Loads wave coordination protocols
    """
    return {
        "protocols": load_module(".shadow/coordination_rules/wave_coordination.md"),
        "mode_ops": load_module(".shadow/coordination_rules/mode_operations.md"),
        "workspace": load_module(".shadow/coordination_rules/workspace_structure.md")
    }
```

### 4. Compose Agent Identity
```python
def compose_agent_identity(agent_config):
    """
    Creates complete agent identity with all rules properly injected
    CRITICAL: This ensures no weak links in the system
    """
    # Load all rule components
    rules = load_agent_rules(agent_config.role, agent_config.project_type)
    
    # Compose identity with proper hierarchy
    identity = f"""
# AGENT IDENTITY COMPOSITION

## LAYER 1: CORE BEHAVIORAL DNA (UNIVERSAL - NEVER OVERRIDDEN)
{rules["core"]}

## LAYER 2: ROLE SPECIALIZATION (ENHANCES CORE)
{rules["role"]}

## LAYER 3: PROJECT CONTEXT (ADDITIONAL GUIDELINES)
{rules["project"] if rules["project"] else "# No project-specific rules"}

## LAYER 4: SPECIFIC ASSIGNMENT
TEAM: {agent_config.team}
WAVE: {agent_config.wave}
OBJECTIVE: {agent_config.objective}
DELIVERABLES: {agent_config.deliverables}
RESERVED FILES: {agent_config.files}

## IDENTITY VERIFICATION
I understand that:
- I am a master craftsman, not a subordinate
- I am equally important as all other team members
- Quality is non-negotiable
- I share responsibility for system integrity
- There are no weak links - we all operate at master level
"""
    return identity
```

### 5. Validate Rule Injection
```python
def validate_rule_injection(agent_identity):
    """
    Ensures agent has received all mandatory rules
    """
    required_components = [
        "CORE BEHAVIORAL DNA",
        "ROLE SPECIALIZATION",
        "SPECIFIC ASSIGNMENT",
        "IDENTITY VERIFICATION"
    ]
    
    for component in required_components:
        if component not in agent_identity:
            raise Exception(f"Missing mandatory component: {component}")
    
    # Verify no weak links principle
    if "no weak links" not in agent_identity.lower():
        raise Exception("Agent identity missing 'no weak links' principle")
    
    return True
```

## Module Loading Protocol

### 1. Initialization Phase
```python
# Load system-wide configurations
system_config = {
    "core_rules": load_module(".shadow/agent_rules/core_agent_rules.md"),
    "templates": load_module(".shadow/templates/"),
    "coordination": load_wave_coordination()
}
```

### 2. Team Configuration Phase
```python
# Load team templates with project context
teams = []
for team_spec in project_teams:
    team_template = load_team_configuration(
        project_type=project_type,
        team_size=team_spec.size
    )
    teams.append(configure_team(team_template, team_spec))
```

### 3. Agent Deployment Phase
```python
# Deploy agents with complete rule injection
for team in teams:
    for agent in team.agents:
        # Compose complete identity
        identity = compose_agent_identity({
            "role": agent.role,
            "project_type": project_type,
            "team": team.name,
            "wave": team.wave,
            "objective": agent.objective,
            "deliverables": agent.deliverables,
            "files": agent.reserved_files
        })
        
        # Validate before deployment
        validate_rule_injection(identity)
        
        # Deploy with confidence - no weak links
        deploy_agent(identity)
```

## Error Handling

### Missing Module Handling
```python
def load_module_safe(path, required=True):
    """
    Safely loads modules with fallback options
    """
    if exists(path):
        return load_module(path)
    elif required:
        raise Exception(f"Required module missing: {path}")
    else:
        return load_default_module(path)
```

### Rule Injection Failures
```python
def handle_injection_failure(agent, error):
    """
    Ensures system integrity when injection fails
    """
    log_error(f"Rule injection failed for {agent}: {error}")
    
    # Never deploy an agent without proper rules
    abort_deployment(agent)
    
    # System cannot have weak links
    raise Exception("Cannot proceed with improperly configured agent")
```

## Module Cache Management

### Efficient Loading
```python
module_cache = {}

def load_module(path):
    """
    Caches modules for efficient reuse
    """
    if path not in module_cache:
        module_cache[path] = read_file(path)
    return module_cache[path]
```

### Cache Invalidation
```python
def invalidate_cache(path=None):
    """
    Clears cache when modules are updated
    """
    if path:
        module_cache.pop(path, None)
    else:
        module_cache.clear()
```

## Success Metrics

### Injection Verification
- 100% of agents receive core rules
- 100% of agents receive role rules
- 100% of agents understand master craftsman identity
- 0 weak links in the system

### Performance Metrics
- Module loading time < 100ms
- Cache hit rate > 90%
- Zero failed deployments due to missing rules
- Complete system initialization < 5 seconds

## Integration Example

```python
# Complete example of module loading for agent deployment

# 1. Initialize system
system = ModuleLoader()
system.load_core_components()

# 2. Configure project
project = system.analyze_project(project_plan)
teams = system.configure_teams(project.type, team_composition)

# 3. Deploy agents with guaranteed rule injection
for wave in system.plan_waves(teams):
    for team in wave.teams:
        for agent in team.agents:
            # This ensures no weak links
            identity = system.compose_agent_identity(agent)
            system.validate_rule_injection(identity)
            system.deploy_agent(identity)

# 4. Execute with confidence
system.execute_waves()  # All agents properly configured
```

## Remember
The module loader is the guardian of system integrity. It ensures every agent receives proper behavioral DNA, maintaining the "no weak links" principle throughout the Shadow Clone System.