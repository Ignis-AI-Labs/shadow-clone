# Rapid Tools

Quick, targeted operations that deliver immediate results without full orchestration.

## quick_fix

Rapid problem-solving for urgent fixes.

### When to Use

- Bug needs immediate fix
- Small logic errors
- Quick style/formatting issues
- Performance hotfixes
- Security patches

### Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `issueType` | Yes | string | Type of issue |
| `description` | Yes | string | Issue description |
| `filePath` | No | string | Affected file(s) |
| `urgency` | No | string | Priority level |

### Issue Types

- `bug` - Functional bugs and errors
- `style` - Styling and formatting issues
- `logic` - Logic errors and incorrect behavior
- `performance` - Performance problems
- `security` - Security vulnerabilities

### Urgency Levels

- `low` - Fix when convenient
- `medium` - Fix soon
- `high` - Fix today
- `critical` - Fix immediately

### Examples

```
quick_fix(
  issueType: "bug",
  description: "Form submit button doesn't work when email contains '+' character",
  filePath: "src/components/SignupForm.jsx",
  urgency: "high"
)
```

```
quick_fix(
  issueType: "security",
  description: "SQL injection vulnerability in search endpoint",
  filePath: "src/api/search.js",
  urgency: "critical"
)
```

```
quick_fix(
  issueType: "performance",
  description: "N+1 query issue when loading user list",
  filePath: "src/services/userService.js",
  urgency: "medium"
)
```

---

## code_review_team

Deploy a review team for code analysis.

### When to Use

- Pre-PR code review
- Security review before deployment
- Quality gate checks
- Architecture validation

### Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `reviewType` | Yes | string | Focus area for review |
| `files` | Yes | array | Files or directories to review |
| `standards` | No | string | Specific standards to check |

### Review Types

- `security` - Security vulnerabilities and risks
- `performance` - Performance issues and optimizations
- `quality` - Code quality and best practices
- `architecture` - Design patterns and structure
- `comprehensive` - All of the above

### Examples

```
code_review_team(
  reviewType: "security",
  files: ["src/api/auth/", "src/api/payments/"],
  standards: "OWASP Top 10"
)
```

```
code_review_team(
  reviewType: "comprehensive",
  files: ["src/services/orderService.js", "src/services/paymentService.js"]
)
```

```
code_review_team(
  reviewType: "architecture",
  files: ["src/"],
  standards: "Clean Architecture principles"
)
```

---

## generate_tests

Create tests for existing code.

### When to Use

- Increasing test coverage
- Adding tests to legacy code
- Creating test suite for new features
- Security testing

### Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `testType` | Yes | string | Type of tests to generate |
| `targetFiles` | Yes | array | Files to test |
| `framework` | No | string | Testing framework to use |
| `coverage` | No | number | Target coverage percentage (0-100) |

### Test Types

- `unit` - Unit tests for individual functions
- `integration` - Integration tests for modules
- `e2e` - End-to-end tests for flows
- `performance` - Performance/load tests
- `security` - Security-focused tests

### Examples

```
generate_tests(
  testType: "unit",
  targetFiles: ["src/services/UserService.js"],
  framework: "jest",
  coverage: 85
)
```

```
generate_tests(
  testType: "integration",
  targetFiles: ["src/api/users/", "src/api/orders/"],
  framework: "supertest"
)
```

```
generate_tests(
  testType: "e2e",
  targetFiles: ["src/pages/Checkout.jsx"],
  framework: "cypress",
  coverage: 90
)
```

---

## execute_single_wave

Run one focused wave without full orchestration.

### When to Use

- Single-phase work
- Research without implementation
- Planning without execution
- Documentation sprint

### Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `waveType` | Yes | string | Type of wave |
| `scope` | Yes | string | What to focus on |
| `inputs` | No | array | Input files or data |
| `maxAgents` | No | number | Number of agents (1-10) |

### Wave Types

- `research` - Analyze and investigate
- `planning` - Create plans and specs
- `implementation` - Build features
- `testing` - Create and run tests
- `documentation` - Write docs
- `review` - Review and audit

### Examples

```
execute_single_wave(
  waveType: "research",
  scope: "Analyze authentication patterns in the codebase and recommend improvements",
  maxAgents: 4
)
```

```
execute_single_wave(
  waveType: "documentation",
  scope: "Document all public API endpoints in src/api/v2/",
  inputs: ["src/api/v2/"],
  maxAgents: 3
)
```

---

## create_documentation

Generate documentation for existing code.

### When to Use

- API documentation
- User guides
- Developer documentation
- Architecture docs
- Inline code comments

### Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `docType` | Yes | string | Documentation type |
| `scope` | Yes | string | What to document |
| `format` | No | string | Output format |
| `audience` | No | string | Target audience |

### Documentation Types

- `api` - API reference documentation
- `user_guide` - End-user documentation
- `developer` - Developer/contributor docs
- `architecture` - System architecture docs
- `inline` - Code comments and JSDoc

### Formats

- `markdown` - Markdown files
- `html` - HTML documentation
- `openapi` - OpenAPI/Swagger spec
- `jsdoc` - JSDoc comments

### Audiences

- `developers` - Technical audience
- `users` - End users
- `architects` - Technical decision makers
- `general` - Mixed audience

### Examples

```
create_documentation(
  docType: "api",
  scope: "src/api/v2/",
  format: "openapi",
  audience: "developers"
)
```

```
create_documentation(
  docType: "user_guide",
  scope: "Admin dashboard features",
  format: "markdown",
  audience: "users"
)
```

---

## architecture_consultant

Get expert architecture guidance.

### When to Use

- Design decisions
- System design review
- Scalability planning
- Migration planning
- Pattern recommendations

### Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `consultationType` | Yes | string | Type of consultation |
| `context` | Yes | string | Current system description |
| `constraints` | No | string | Limitations or requirements |
| `goals` | No | array | Specific goals to achieve |

### Consultation Types

- `design_review` - Review existing design
- `pattern_recommendation` - Suggest patterns
- `scalability_analysis` - Scaling assessment
- `migration_planning` - Migration strategy

### Examples

```
architecture_consultant(
  consultationType: "scalability_analysis",
  context: "Monolithic Node.js e-commerce platform with 50k daily users",
  constraints: "Must maintain 99.9% uptime during any migration",
  goals: ["Handle 10x traffic", "Sub-second response times", "Horizontal scaling"]
)
```

```
architecture_consultant(
  consultationType: "migration_planning",
  context: "Legacy PHP application, want to move to microservices",
  constraints: "Team of 4 developers, 6-month timeline",
  goals: ["Gradual migration", "Zero downtime", "Maintainable services"]
)
```

---

## Related Topics

- [Tools Overview](overview.md) - All tool categories
- [Team Tools](teams.md) - Focused team deployment
- [Complete Reference](../reference/all-tools.md) - All parameters
