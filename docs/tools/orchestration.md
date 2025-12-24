# Orchestration Tools

The most powerful Shadow Clone tools - for full project execution with wave-based orchestration.

## shadow_clone_orchestrate

Full multi-wave project execution with teams of specialized agents.

### When to Use

- Building complete features
- Complex debugging across multiple files
- System-wide refactoring
- Comprehensive security audits
- Performance optimization projects
- Research and analysis

### Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `mode` | Yes | string | Execution mode (see below) |
| `projectDescription` | Yes | string | Detailed description of what to accomplish |
| `projectPlan` | No | string | Path to existing project plan file |
| `wavesDirectory` | No | string | Output directory (default: `./.waves/`) |
| `maxAgentsPerWave` | No | number | Agent limit per wave (default: 10, max: 20) |

### Execution Modes

#### mode: "feature"
Build new functionality from scratch.
- **Teams**: Frontend, Backend, Database, API, Testing
- **Output**: Working code, tests, documentation

```
shadow_clone_orchestrate(
  mode: "feature",
  projectDescription: "Build a real-time notification system with WebSocket support, notification preferences, and a React notification center component"
)
```

#### mode: "debug"
Systematic bug identification and fixing.
- **Teams**: Debuggers, Testers, Code Analysts
- **Output**: Fixed code, regression tests, root cause report

```
shadow_clone_orchestrate(
  mode: "debug",
  projectDescription: "Users report intermittent 500 errors on checkout. Errors occur randomly and logs show database connection timeouts."
)
```

#### mode: "refactor"
Improve code quality without changing functionality.
- **Teams**: Refactoring specialists, Test maintainers
- **Output**: Cleaned code, migration guide, updated tests

```
shadow_clone_orchestrate(
  mode: "refactor",
  projectDescription: "Refactor the user service from class-based to functional approach. Maintain all existing functionality and API contracts."
)
```

#### mode: "optimize"
Enhance performance and efficiency.
- **Teams**: Performance analysts, Optimization engineers
- **Output**: Optimized code, benchmarks, performance report

```
shadow_clone_orchestrate(
  mode: "optimize",
  projectDescription: "Dashboard page takes 8 seconds to load. Optimize database queries, add caching, and implement lazy loading for charts."
)
```

#### mode: "audit"
Security and compliance assessment.
- **Teams**: Security auditors, Compliance checkers
- **Output**: Security report, vulnerability fixes, compliance matrix

```
shadow_clone_orchestrate(
  mode: "audit",
  projectDescription: "Perform OWASP Top 10 security audit on the authentication and payment modules. Include penetration testing recommendations."
)
```

#### mode: "research"
Analyze codebases without making changes.
- **Teams**: Code researchers, Documentation analysts
- **Output**: Research findings, recommendations, architecture docs

```
shadow_clone_orchestrate(
  mode: "research",
  projectDescription: "Analyze the legacy order processing system. Document architecture, identify technical debt, and recommend modernization approach."
)
```

### Output Structure

```
.waves/
├── wave-0/
│   ├── PROJECT_FOUNDATION.md
│   ├── TECHNICAL_RESEARCH.md
│   └── MASTER_PLAN.md
├── wave-1/
│   ├── WAVE_PLAN.md
│   ├── [implementation files]
│   └── WAVE_COMPLETE.md
├── wave-2/
│   └── ...
└── WAVE_STATUS.md
```

---

## shadow_clone_plan

Planning-only mode - creates comprehensive project plans without writing code.

### When to Use

- Starting a new project
- Evaluating technical approaches
- Creating implementation roadmaps
- Documenting architecture decisions

### Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `projectVision` | Yes | string | Project idea, goals, and requirements |
| `wavesDirectory` | No | string | Output directory (default: `./.waves/`) |

### Example

```
shadow_clone_plan(
  projectVision: "Create a SaaS platform for project management with:
    - Team workspaces with role-based permissions
    - Kanban and list views for tasks
    - Real-time collaboration features
    - Integration with GitHub and Slack
    - Usage analytics and reporting
    Tech stack: Next.js, PostgreSQL, Redis, WebSockets"
)
```

### Output Structure

```
.waves/
├── wave-0/
│   ├── PROJECT_FOUNDATION.md    # Requirements analysis
│   ├── TECHNICAL_RESEARCH.md    # Tech stack decisions
│   └── MASTER_PLAN.md           # Implementation blueprint
└── WAVE_STATUS.md
```

### What You Get

**PROJECT_FOUNDATION.md**
- Requirements breakdown
- User stories
- Constraints and assumptions
- Success criteria

**TECHNICAL_RESEARCH.md**
- Technology evaluation
- Architecture patterns
- Best practices research
- Risk assessment

**MASTER_PLAN.md**
- Phased implementation plan
- Component breakdown
- Timeline (phases, not dates)
- Dependencies
- Testing strategy

### Workflow: Plan → Build

1. Run `shadow_clone_plan` with your vision
2. Review the generated `MASTER_PLAN.md`
3. Adjust requirements if needed
4. Run `shadow_clone_orchestrate` with mode: "feature"
5. Reference the plan in your description

```
shadow_clone_orchestrate(
  mode: "feature",
  projectDescription: "Implement the project management platform as specified in .waves/wave-0/MASTER_PLAN.md. Start with Phase 1: Core workspace and task management."
)
```

---

## Tips for Orchestration

### Be Specific

**Good:**
```
Build a user authentication system with:
- Email/password login with bcrypt hashing
- JWT tokens with 24-hour expiry
- Refresh token rotation
- Password reset via email
- Account lockout after 5 failed attempts
```

**Vague:**
```
Build login functionality
```

### Reference Existing Code

```
projectDescription: "Add two-factor authentication to the existing auth system in src/auth/.
Match the patterns in userService.js.
Use the existing email service for sending codes."
```

### Specify Constraints

```
projectDescription: "Build notification system with constraints:
- Must work with existing PostgreSQL schema
- Max 50ms response time
- Support 10k concurrent WebSocket connections
- Must be backwards compatible with v2 API"
```

---

## Related Topics

- [Wave System](../concepts/wave-system.md) - How waves work
- [Agent Roles](../concepts/agent-roles.md) - Who does what
- [Complete Reference](../reference/all-tools.md) - All parameters
