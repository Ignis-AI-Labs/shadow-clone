# Agent Rules System

## Overview
This directory contains modular behavioral rule sets that are injected into individual agent identities. This separates orchestration logic (in main prompt) from agent behavioral requirements.

## Rule Categories

### Core Rules (Always Injected)
- **`core_agent_rules.md`** - Universal rules every agent must follow
  - Sovereignty model and constitutional reporting
  - File coordination and conflict prevention protocols
  - State reporting requirements
  - Convergence session participation
  - Quality standards and communication protocols

### Role-Specific Rules (Injected Based on Agent Type)
- **`team_lead_rules.md`** - Additional rules for team lead agents
- **`development_agent_rules.md`** - Rules for development agents (frontend, backend, etc.)
- **`qa_agent_rules.md`** - Rules for quality assurance and testing agents
- **`devops_agent_rules.md`** - Rules for DevOps and infrastructure agents
- **`security_agent_rules.md`** - Rules for security assessment agents
- **`documentation_agent_rules.md`** - Rules for documentation specialists

### Project-Type Rules (Injected Based on Project Mode)
- **`audit_agent_rules.md`** - Additional rules for audit project agents
- **`research_agent_rules.md`** - Rules for research investigation agents

## Rule Injection Protocol

### How Rules Are Injected
When creating individual agents, the Shadow Clone System injects relevant rule sets:

```
AGENT IDENTITY COMPOSITION:
1. Core Agent Rules (always included)
2. Role-Specific Rules (based on agent specialization)
3. Project-Type Rules (based on project mode)
4. Custom Agent Assignment (specific task and context)
```

### Example Agent Identity Construction

**Frontend Development Agent**:
```
Load: core_agent_rules.md
Load: development_agent_rules.md
Add: [Specific agent assignment with file reservations and tasks]
```

**Team Lead Agent**:
```
Load: core_agent_rules.md
Load: team_lead_rules.md
Load: development_agent_rules.md (if also doing development work)
Add: [Specific team coordination assignment]
```

**Security Audit Agent**:
```
Load: core_agent_rules.md
Load: security_agent_rules.md
Load: audit_agent_rules.md
Add: [Specific audit scope and methodologies]
```

## Benefits of Modular Rules

### Maintainability
- **Single Source of Truth**: Core rules defined once, used everywhere
- **Easy Updates**: Change rule once, affects all relevant agents
- **Clear Separation**: Orchestration logic separate from behavioral rules

### Flexibility
- **Role Customization**: Different agent types get appropriate rule sets
- **Project Adaptation**: Rules adapt to different project types
- **Scalability**: Easy to add new rule sets for new agent types

### Consistency
- **Universal Standards**: All agents follow same core protocols
- **Specialization**: Role-specific rules ensure proper specialization
- **Quality Assurance**: Consistent quality standards across all agents

## Adding New Rule Sets

### Creating New Role Rules
1. Create new file: `.shadow/agent_rules/[role]_agent_rules.md`
2. Follow the established format and structure
3. Focus on behavioral requirements specific to that role
4. Update injection protocol in main Shadow Clone prompt

### Creating Project-Type Rules
1. Create new file: `.shadow/agent_rules/[project_type]_agent_rules.md`
2. Define project-specific behavioral requirements
3. Ensure compatibility with core and role-specific rules
4. Document when these rules should be injected

## Rule Priority and Conflicts

### Priority Order
1. **Core Rules**: Universal requirements, highest priority
2. **Project-Type Rules**: Project-specific requirements
3. **Role-Specific Rules**: Specialization requirements
4. **Custom Assignment**: Specific task instructions

### Conflict Resolution
- Core rules always take precedence
- Project-type rules override role-specific where conflicts exist
- Custom assignments provide specific implementation guidance
- Escalate unresolvable conflicts to constitutional authority

## Usage in Main Prompt

The main Shadow Clone prompt references this system:

```markdown
**Enhanced Task Assignment Template (Multi-Agent Teams)**
For each agent, inject appropriate rule sets:

RULE INJECTION:
- Core Rules: Load .shadow/agent_rules/core_agent_rules.md
- Role Rules: Load .shadow/agent_rules/[agent_role]_agent_rules.md  
- Project Rules: Load .shadow/agent_rules/[project_type]_agent_rules.md

AGENT ASSIGNMENT:
[Specific task, file reservations, and context]
```

This creates consistent, well-behaved agents while keeping the main orchestration prompt focused and manageable. 