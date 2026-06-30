# Parameters Reference

Detailed documentation for all Shadow Clone parameters.

---

## Execution Modes

Used with `shadow_clone_orchestrate`.

| Mode | Purpose | Typical Waves | Output Focus |
|------|---------|---------------|--------------|
| `plan` | Create project plans | 1 | Documentation only |
| `feature` | Build new functionality | 3-5 | Working code + tests |
| `debug` | Fix bugs systematically | 2-3 | Fixes + regression tests |
| `optimize` | Improve performance | 2-4 | Optimized code + benchmarks |
| `refactor` | Improve code quality | 2-4 | Cleaned code + tests |
| `audit` | Security assessment | 2-3 | Report + fixes |
| `research` | Analyze without changing | 1-2 | Analysis + recommendations |

### Mode: plan
Creates comprehensive project planning without implementation.

**Output**: PROJECT_FOUNDATION.md, TECHNICAL_RESEARCH.md, MASTER_PLAN.md

**Use when**: Starting a new project, evaluating approaches

### Mode: feature
Full feature implementation across multiple waves.

**Output**: Working code, tests, documentation

**Use when**: Building new functionality from scratch

### Mode: debug
Systematic debugging with root cause analysis.

**Output**: Fixed code, regression tests, root cause report

**Use when**: Complex bugs spanning multiple files

### Mode: optimize
Performance analysis and improvement.

**Output**: Optimized code, benchmarks, performance report

**Use when**: Slow code, memory issues, scaling problems

### Mode: refactor
Code quality improvement without behavior change.

**Output**: Cleaned code, migration guide, updated tests

**Use when**: Technical debt, architecture improvements

### Mode: audit
Security and compliance assessment.

**Output**: Security report, vulnerability fixes, compliance matrix

**Use when**: Security review, compliance checks, pre-release audit

### Mode: research
Analysis and investigation without code changes.

**Output**: Research findings, recommendations, architecture docs

**Use when**: Understanding legacy code, evaluating options

---

## Team Types

Used with `deploy_agent_team`.

| Team | Specialization | Typical Size |
|------|----------------|--------------|
| `frontend` | React, Vue, Angular, CSS | 2-4 |
| `backend` | APIs, servers, business logic | 2-4 |
| `database` | Schema, queries, optimization | 2-3 |
| `testing` | Unit, integration, e2e tests | 2-4 |
| `documentation` | API docs, guides, comments | 2-3 |
| `devops` | CI/CD, infrastructure | 2-3 |
| `mobile` | iOS, Android, React Native | 2-4 |
| `security` | Security implementation | 2-3 |

### Team: frontend
UI specialists for component development.

**Expertise**: React, Vue, Angular, CSS, accessibility, responsive design

**Good for**: Building components, UI features, styling

### Team: backend
Server-side development specialists.

**Expertise**: Node.js, Express, APIs, business logic, middleware

**Good for**: API endpoints, services, server logic

### Team: database
Data layer specialists.

**Expertise**: SQL, NoSQL, schema design, query optimization, migrations

**Good for**: Schema design, query optimization, data modeling

### Team: testing
Quality assurance specialists.

**Expertise**: Jest, Mocha, Cypress, testing strategies, coverage

**Good for**: Test suites, coverage improvement, test automation

### Team: documentation
Technical writing specialists.

**Expertise**: API docs, user guides, code comments, diagrams

**Good for**: API documentation, user guides, README files

### Team: devops
Infrastructure and deployment specialists.

**Expertise**: CI/CD, Docker, Kubernetes, AWS, GitHub Actions

**Good for**: Pipelines, deployment scripts, infrastructure

### Team: mobile
Mobile development specialists.

**Expertise**: React Native, iOS, Android, mobile UX

**Good for**: Mobile components, native features

### Team: security
Security implementation specialists.

**Expertise**: Auth, encryption, secure coding, vulnerability fixes

**Good for**: Security features, hardening, secure implementations

---

## Agent Specializations

Used with `deploy_specialist_agent`.

| Specialization | Expertise | Use Case |
|----------------|-----------|----------|
| `react_expert` | React patterns, hooks, performance | React optimization |
| `api_designer` | REST, GraphQL, API design | API contracts |
| `database_architect` | Schema, queries, scaling | Database optimization |
| `test_engineer` | Testing strategies, coverage | Test creation |
| `performance_analyst` | Profiling, optimization | Performance issues |
| `security_auditor` | Vulnerabilities, secure code | Security review |
| `code_reviewer` | Best practices, quality | Code review |
| `documentation_writer` | Technical writing | Documentation |

---

## Issue Types

Used with `quick_fix`.

| Type | Description | Examples |
|------|-------------|----------|
| `bug` | Functional errors | Crash, wrong output, logic error |
| `style` | Formatting issues | CSS problems, layout bugs |
| `logic` | Incorrect behavior | Wrong calculation, bad condition |
| `performance` | Speed/memory issues | Slow query, memory leak |
| `security` | Vulnerabilities | XSS, injection, auth bypass |

---

## Urgency Levels

Used with `quick_fix`.

| Level | Meaning | Response |
|-------|---------|----------|
| `low` | Minor issue | Fix when convenient |
| `medium` | Should fix soon | Fix within a day |
| `high` | Blocking work | Fix today |
| `critical` | Production down | Fix immediately |

---

## Review Types

Used with `code_review_team`.

| Type | Focus | Output |
|------|-------|--------|
| `security` | Vulnerabilities | Security issues, fixes |
| `performance` | Speed, memory | Bottlenecks, optimizations |
| `quality` | Best practices | Code smells, improvements |
| `architecture` | Design patterns | Structure issues, recommendations |
| `comprehensive` | All of above | Complete review |

---

## Test Types

Used with `generate_tests`.

| Type | Scope | Typical Framework |
|------|-------|-------------------|
| `unit` | Individual functions | Jest, Mocha |
| `integration` | Module interaction | Supertest, TestContainers |
| `e2e` | Full user flows | Cypress, Playwright |
| `performance` | Load, speed | k6, Artillery |
| `security` | Vulnerability testing | OWASP ZAP |

---

## Wave Types

Used with `execute_single_wave`.

| Type | Purpose | Output |
|------|---------|--------|
| `research` | Investigate, analyze | Findings, recommendations |
| `planning` | Design, plan | Plans, specs |
| `implementation` | Build, code | Working code |
| `testing` | Test, verify | Test suites |
| `documentation` | Document | Docs, comments |
| `review` | Review, audit | Reports, fixes |

---

## Documentation Types

Used with `create_documentation`.

| Type | Output | Audience |
|------|--------|----------|
| `api` | API reference | Developers |
| `user_guide` | End-user docs | Users |
| `developer` | Contributor docs | Contributors |
| `architecture` | System design | Architects |
| `inline` | Code comments | Developers |

---

## Output Formats

Used with `create_documentation`.

| Format | Description | Use Case |
|--------|-------------|----------|
| `markdown` | Markdown files | General documentation |
| `html` | HTML pages | Standalone docs |
| `openapi` | OpenAPI/Swagger | REST API docs |
| `jsdoc` | JSDoc comments | JavaScript/TypeScript |

---

## Consultation Types

Used with `architecture_consultant`.

| Type | Purpose | Output |
|------|---------|--------|
| `design_review` | Review current design | Issues, recommendations |
| `pattern_recommendation` | Suggest patterns | Pattern analysis |
| `scalability_analysis` | Scaling assessment | Scaling plan |
| `migration_planning` | Migration strategy | Migration roadmap |

---

## Template Types

Used with `get_agent_template`.

| Type | Content |
|------|---------|
| `core_rules` | Fundamental agent behavior |
| `agent_template` | Individual agent role template |
| `team_templates` | Team composition rules |

---

## Related Topics

- [All Tools Reference](all-tools.md)
- [Error Codes](error-codes.md)
- [Tools Overview](../tools/overview.md)
