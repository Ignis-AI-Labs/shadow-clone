# Agent Roles

Shadow Clone simulates teams of specialized agents, each with specific expertise and responsibilities.

## The Record Keeper

Every Shadow Clone project has one **Record Keeper** - the coordinator that manages everything.

### Responsibilities
- Plans each wave's objectives
- Assigns tasks to specialist agents
- Maintains project context
- Tracks progress and dependencies
- Creates documentation
- Ensures deliverables meet standards

### When Active
- Present in every wave
- First to act (planning)
- Last to act (summary)

Think of the Record Keeper as the tech lead overseeing the project.

## Specialist Agents

Specialist agents are deployed based on the task. Each brings domain expertise.

### Frontend Specialists

| Agent | Expertise | Typical Tasks |
|-------|-----------|---------------|
| React Expert | React patterns, hooks, state | Component architecture, performance |
| UI Designer | Styling, UX, accessibility | Layout, responsive design, a11y |
| Frontend Architect | App structure, routing | Project setup, module organization |

### Backend Specialists

| Agent | Expertise | Typical Tasks |
|-------|-----------|---------------|
| API Designer | REST/GraphQL, endpoints | Route design, response formats |
| Database Architect | Schema design, queries | Models, migrations, optimization |
| Backend Engineer | Server logic, integrations | Business logic, third-party APIs |

### Quality Specialists

| Agent | Expertise | Typical Tasks |
|-------|-----------|---------------|
| Test Engineer | Testing strategies, coverage | Unit tests, integration tests |
| Security Auditor | OWASP, vulnerabilities | Security review, penetration testing |
| Performance Analyst | Profiling, optimization | Bottleneck identification, fixes |
| Code Reviewer | Best practices, patterns | Code quality, consistency |

### Support Specialists

| Agent | Expertise | Typical Tasks |
|-------|-----------|---------------|
| Documentation Writer | Technical writing | API docs, user guides |
| DevOps Engineer | CI/CD, deployment | Pipeline setup, infrastructure |

## Team Composition

Different tools deploy different team combinations:

### shadow_clone_orchestrate (mode: "feature")

```
Record Keeper
├── Frontend Team
│   ├── React Expert
│   ├── UI Designer
│   └── Frontend Architect
├── Backend Team
│   ├── API Designer
│   ├── Database Architect
│   └── Backend Engineer
├── Quality Team
│   ├── Test Engineer
│   └── Code Reviewer
└── Documentation Writer
```

### shadow_clone_orchestrate (mode: "audit")

```
Record Keeper
├── Security Auditor (Lead)
├── Security Auditor (OWASP)
├── Security Auditor (Infrastructure)
├── Code Reviewer (Security Focus)
└── Test Engineer (Security Tests)
```

### deploy_agent_team (teamType: "frontend")

```
Record Keeper
├── React Expert
├── UI Designer
└── Frontend Architect
```

### deploy_specialist_agent

```
Record Keeper
└── Single Specialist (your choice)
```

## Agent Behavior

Each agent follows consistent patterns:

### Analysis Phase
1. Review assigned task
2. Examine existing code/context
3. Identify dependencies
4. Plan approach

### Execution Phase
1. Implement solution
2. Follow best practices
3. Handle edge cases
4. Document decisions

### Completion Phase
1. Verify deliverables
2. Run quality checks
3. Report to Record Keeper
4. Hand off to next wave

## Parallel Execution

Within a wave, agents work in parallel (up to 10 simultaneously):

```
Wave 2 Execution:
┌────────────────────────────────────────────────────┐
│                   Record Keeper                     │
│                  (coordinates)                      │
└──────────────────────┬─────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
    ┌─────────┐   ┌─────────┐   ┌─────────┐
    │ Agent 1 │   │ Agent 2 │   │ Agent 3 │
    │(Frontend)│  │(Backend)│   │(Database)│
    └────┬────┘   └────┬────┘   └────┬────┘
         │             │             │
         └─────────────┼─────────────┘
                       │
                       ▼
              ┌──────────────┐
              │ Record Keeper │
              │ (consolidates)│
              └──────────────┘
```

## Customizing Agent Deployment

### Limit Team Size

```
shadow_clone_orchestrate(
  maxAgentsPerWave: 5  # Fewer agents, more focused
)
```

### Choose Specific Team

```
deploy_agent_team(
  teamType: "backend",  # Only backend specialists
  teamSize: 3
)
```

### Single Expert

```
deploy_specialist_agent(
  specialization: "security_auditor",
  task: "Review authentication implementation"
)
```

## Agent Communication

Agents don't directly talk to each other. Instead:

1. Each agent produces deliverables
2. Record Keeper collects all outputs
3. Next wave agents receive consolidated context
4. Wave summaries maintain continuity

This prevents conflicts and ensures clean handoffs.

## Getting Agent Templates

Want to see exactly how agents are defined? Use:

```
get_agent_template(templateType: "core_rules")
get_agent_template(templateType: "agent_template")
get_agent_template(templateType: "team_templates")
```

These show the underlying prompt engineering that creates agent behaviors.

---

## Related Topics

- [Wave System](wave-system.md) - How agents are deployed across waves
- [Tools Overview](../tools/overview.md) - Which tools deploy which agents
- [Prompt Engineering](prompt-engineering.md) - How agent behaviors are created
