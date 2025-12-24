# Team Tools

Deploy focused teams of specialists for targeted work without full orchestration.

## deploy_agent_team

Deploy a specialized team for a specific task.

### When to Use

- Building a single component or module
- Need focused expertise in one area
- Task is too small for full orchestration
- Want control over team composition

### Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `teamType` | Yes | string | Type of team to deploy |
| `task` | Yes | string | Specific task description |
| `outputDirectory` | No | string | Where to place deliverables |
| `teamSize` | No | number | Number of agents (1-5, default: 3) |

### Team Types

#### frontend
React, Vue, Angular specialists for UI work.

```
deploy_agent_team(
  teamType: "frontend",
  task: "Create a responsive data table component with sorting, filtering, pagination, and row selection. Use React and styled-components.",
  teamSize: 3
)
```

#### backend
API, server, and business logic specialists.

```
deploy_agent_team(
  teamType: "backend",
  task: "Create a REST API for user management with CRUD operations, input validation, and proper error responses. Use Express.js.",
  teamSize: 3
)
```

#### database
Schema design, queries, and optimization specialists.

```
deploy_agent_team(
  teamType: "database",
  task: "Design a schema for an e-commerce product catalog with categories, variants, inventory tracking, and pricing tiers.",
  teamSize: 2
)
```

#### testing
Test engineers for comprehensive coverage.

```
deploy_agent_team(
  teamType: "testing",
  task: "Create comprehensive tests for the payment processing module. Include unit tests, integration tests, and edge case coverage.",
  teamSize: 3
)
```

#### documentation
Technical writers for clear documentation.

```
deploy_agent_team(
  teamType: "documentation",
  task: "Document the REST API endpoints in src/api/. Create OpenAPI spec and developer guide with examples.",
  teamSize: 2
)
```

#### devops
CI/CD and infrastructure specialists.

```
deploy_agent_team(
  teamType: "devops",
  task: "Set up GitHub Actions workflow for automated testing, building, and deployment to AWS ECS.",
  teamSize: 2
)
```

#### mobile
iOS and Android specialists.

```
deploy_agent_team(
  teamType: "mobile",
  task: "Create a React Native component for biometric authentication with fallback to PIN.",
  teamSize: 3
)
```

#### security
Security-focused implementation.

```
deploy_agent_team(
  teamType: "security",
  task: "Implement rate limiting, request signing, and API key rotation for the public API.",
  teamSize: 3
)
```

---

## deploy_specialist_agent

Deploy a single expert agent for highly focused tasks.

### When to Use

- Need specific expertise
- Task is small and focused
- Want expert opinion/review
- Quick targeted help

### Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `specialization` | Yes | string | Agent expertise area |
| `task` | Yes | string | Specific task for the agent |
| `context` | No | string | Additional context (file paths, requirements) |
| `deliverables` | No | array | Expected outputs |

### Specializations

#### react_expert
Deep React knowledge - hooks, patterns, performance.

```
deploy_specialist_agent(
  specialization: "react_expert",
  task: "Optimize the UserDashboard component - it re-renders unnecessarily and causes performance issues",
  context: "Component is in src/components/UserDashboard.jsx, uses Redux for state",
  deliverables: ["Optimized component", "Explanation of changes"]
)
```

#### api_designer
REST and GraphQL API design expertise.

```
deploy_specialist_agent(
  specialization: "api_designer",
  task: "Design the API contract for a booking system",
  context: "Need endpoints for availability checking, booking creation, and cancellation",
  deliverables: ["OpenAPI specification", "Example requests/responses"]
)
```

#### database_architect
Schema design and query optimization.

```
deploy_specialist_agent(
  specialization: "database_architect",
  task: "Optimize slow queries in the reporting module",
  context: "PostgreSQL database, queries in src/reports/queries.sql take 30+ seconds",
  deliverables: ["Optimized queries", "Index recommendations", "Explanation"]
)
```

#### test_engineer
Testing strategies and implementation.

```
deploy_specialist_agent(
  specialization: "test_engineer",
  task: "Add test coverage to the authentication service",
  context: "Jest framework, service in src/services/auth.js, currently 20% coverage",
  deliverables: ["Unit tests", "Integration tests", "Coverage report"]
)
```

#### performance_analyst
Performance profiling and optimization.

```
deploy_specialist_agent(
  specialization: "performance_analyst",
  task: "Identify why the homepage takes 5 seconds to load",
  context: "Next.js app, seems to be API-related but not sure",
  deliverables: ["Performance analysis", "Bottleneck identification", "Optimization plan"]
)
```

#### security_auditor
Security review and vulnerability assessment.

```
deploy_specialist_agent(
  specialization: "security_auditor",
  task: "Review the password reset flow for vulnerabilities",
  context: "Implementation in src/auth/passwordReset.js",
  deliverables: ["Security assessment", "Vulnerability list", "Remediation steps"]
)
```

#### code_reviewer
Code quality and best practices.

```
deploy_specialist_agent(
  specialization: "code_reviewer",
  task: "Review the new payment integration code before merge",
  context: "PR #234, adds Stripe integration",
  deliverables: ["Code review", "Suggested improvements", "Approval/concerns"]
)
```

#### documentation_writer
Technical documentation.

```
deploy_specialist_agent(
  specialization: "documentation_writer",
  task: "Create user documentation for the admin panel",
  context: "Admin panel in src/admin/, used by non-technical staff",
  deliverables: ["User guide", "Feature walkthrough", "FAQ"]
)
```

---

## Choosing Between Team and Specialist

| Scenario | Use This |
|----------|----------|
| Build a component | `deploy_agent_team` |
| Review existing code | `deploy_specialist_agent` |
| Create new module | `deploy_agent_team` |
| Optimize one thing | `deploy_specialist_agent` |
| Multiple related tasks | `deploy_agent_team` |
| Single focused task | `deploy_specialist_agent` |

---

## Related Topics

- [Tools Overview](overview.md) - All tool categories
- [Rapid Tools](rapid.md) - Quick targeted operations
- [Agent Roles](../concepts/agent-roles.md) - Understanding specialists
