# Complete Tool Reference

All Shadow Clone tools with full parameter documentation.

---

## Orchestration Tools

### shadow_clone_orchestrate

Full multi-wave project execution.

| Parameter | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `mode` | Yes | string | - | Execution mode |
| `projectDescription` | Yes | string | - | What to accomplish |
| `projectPlan` | No | string | - | Path to plan file |
| `wavesDirectory` | No | string | `./.waves/` | Output directory |
| `maxAgentsPerWave` | No | number | 10 | Agents per wave (max: 20) |

**Modes**: `plan`, `feature`, `debug`, `optimize`, `refactor`, `audit`, `research`

```
shadow_clone_orchestrate(
  mode: "feature",
  projectDescription: "Build user authentication with JWT",
  wavesDirectory: "./.waves/"
)
```

---

### shadow_clone_plan

Planning-only mode.

| Parameter | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `projectVision` | Yes | string | - | Project idea and goals |
| `wavesDirectory` | No | string | `./.waves/` | Output directory |

```
shadow_clone_plan(
  projectVision: "SaaS project management platform with real-time features"
)
```

---

## Team Tools

### deploy_agent_team

Deploy a specialized team.

| Parameter | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `teamType` | Yes | string | - | Type of team |
| `task` | Yes | string | - | Task description |
| `outputDirectory` | No | string | - | Output location |
| `teamSize` | No | number | 3 | Number of agents (1-5) |

**Team Types**: `frontend`, `backend`, `database`, `testing`, `documentation`, `devops`, `mobile`, `security`

```
deploy_agent_team(
  teamType: "backend",
  task: "Create REST API for user management",
  teamSize: 3
)
```

---

### deploy_specialist_agent

Deploy a single expert.

| Parameter | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `specialization` | Yes | string | - | Expert type |
| `task` | Yes | string | - | Task description |
| `context` | No | string | - | Additional context |
| `deliverables` | No | array | - | Expected outputs |

**Specializations**: `react_expert`, `api_designer`, `database_architect`, `test_engineer`, `performance_analyst`, `security_auditor`, `code_reviewer`, `documentation_writer`

```
deploy_specialist_agent(
  specialization: "security_auditor",
  task: "Review password reset flow",
  context: "Code in src/auth/",
  deliverables: ["Security report", "Fix recommendations"]
)
```

---

## Rapid Tools

### quick_fix

Fast problem-solving.

| Parameter | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `issueType` | Yes | string | - | Type of issue |
| `description` | Yes | string | - | Issue description |
| `filePath` | No | string | - | Affected file(s) |
| `urgency` | No | string | `medium` | Priority level |

**Issue Types**: `bug`, `style`, `logic`, `performance`, `security`

**Urgency Levels**: `low`, `medium`, `high`, `critical`

```
quick_fix(
  issueType: "bug",
  description: "Login fails with special characters in email",
  filePath: "src/auth/login.js",
  urgency: "high"
)
```

---

### code_review_team

Deploy review team.

| Parameter | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `reviewType` | Yes | string | - | Focus area |
| `files` | Yes | array | - | Files to review |
| `standards` | No | string | - | Standards to check |

**Review Types**: `security`, `performance`, `quality`, `architecture`, `comprehensive`

```
code_review_team(
  reviewType: "security",
  files: ["src/api/auth/", "src/api/payments/"],
  standards: "OWASP Top 10"
)
```

---

### generate_tests

Create tests for code.

| Parameter | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `testType` | Yes | string | - | Type of tests |
| `targetFiles` | Yes | array | - | Files to test |
| `framework` | No | string | - | Testing framework |
| `coverage` | No | number | - | Target coverage (0-100) |

**Test Types**: `unit`, `integration`, `e2e`, `performance`, `security`

```
generate_tests(
  testType: "unit",
  targetFiles: ["src/services/authService.js"],
  framework: "jest",
  coverage: 85
)
```

---

### execute_single_wave

Run one focused wave.

| Parameter | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `waveType` | Yes | string | - | Type of wave |
| `scope` | Yes | string | - | What to focus on |
| `inputs` | No | array | - | Input files/data |
| `maxAgents` | No | number | 5 | Number of agents (1-10) |

**Wave Types**: `research`, `planning`, `implementation`, `testing`, `documentation`, `review`

```
execute_single_wave(
  waveType: "documentation",
  scope: "Document API endpoints in src/api/v2/",
  maxAgents: 3
)
```

---

### create_documentation

Generate documentation.

| Parameter | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `docType` | Yes | string | - | Documentation type |
| `scope` | Yes | string | - | What to document |
| `format` | No | string | `markdown` | Output format |
| `audience` | No | string | `developers` | Target audience |

**Doc Types**: `api`, `user_guide`, `developer`, `architecture`, `inline`

**Formats**: `markdown`, `html`, `openapi`, `jsdoc`

**Audiences**: `developers`, `users`, `architects`, `general`

```
create_documentation(
  docType: "api",
  scope: "src/api/v2/",
  format: "openapi",
  audience: "developers"
)
```

---

### architecture_consultant

Expert architecture guidance.

| Parameter | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `consultationType` | Yes | string | - | Type of consultation |
| `context` | Yes | string | - | Current system |
| `constraints` | No | string | - | Limitations |
| `goals` | No | array | - | Specific goals |

**Consultation Types**: `design_review`, `pattern_recommendation`, `scalability_analysis`, `migration_planning`

```
architecture_consultant(
  consultationType: "scalability_analysis",
  context: "Monolithic Node.js app with 50k daily users",
  constraints: "99.9% uptime required",
  goals: ["10x traffic", "Sub-second response"]
)
```

---

## Utility Tools

### authenticate

Authenticate with API key.

| Parameter | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `apiKey` | Yes | string | - | Your API key |

```
authenticate(
  apiKey: "ignis_YOUR_API_KEY"
)
```

---

### api_key_status

Check authentication status.

| Parameter | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `showKey` | No | boolean | false | Show actual key |

```
api_key_status()
```

---

### check_for_updates

Check for newer versions.

No parameters required.

```
check_for_updates()
```

---

### initialize_workspace

Set up workspace with config files.

| Parameter | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `projectPath` | No | string | `.` | Project directory |
| `includeTypes` | No | array | all | File types to create |
| `overwrite` | No | boolean | false | Overwrite existing |

**Include Types**: `claude`, `github`, `vscode`, `general`

```
initialize_workspace(
  projectPath: "./my-project",
  includeTypes: ["claude", "github"]
)
```

---

### show_commands

Display command reference.

| Parameter | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `category` | No | string | `all` | Filter by category |

**Categories**: `orchestration`, `teams`, `rapid`, `documentation`, `all`

```
show_commands(category: "rapid")
```

---

### get_agent_template

Access internal templates.

| Parameter | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `templateType` | Yes | string | - | Template type |

**Template Types**: `core_rules`, `agent_template`, `team_templates`

```
get_agent_template(templateType: "core_rules")
```

---

## Tool Categories Summary

| Category | Tools | Purpose |
|----------|-------|---------|
| **Orchestration** | 2 | Full project execution |
| **Team** | 2 | Focused team deployment |
| **Rapid** | 6 | Quick targeted operations |
| **Utility** | 6 | System and helper tools |

---

## Related Topics

- [Parameters Reference](parameters.md)
- [Error Codes](error-codes.md)
- [Tools Overview](../tools/overview.md)
