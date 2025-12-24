# Tools Overview

Shadow Clone provides 17 tools organized into categories based on complexity and use case.

## Tool Categories

| Category | Tools | Best For |
|----------|-------|----------|
| **Orchestration** | `shadow_clone_orchestrate`, `shadow_clone_plan` | Large projects, full features |
| **Teams** | `deploy_agent_team`, `deploy_specialist_agent` | Focused team deployment |
| **Rapid** | `quick_fix`, `code_review_team`, `generate_tests`, `execute_single_wave`, `create_documentation`, `architecture_consultant` | Quick, targeted tasks |
| **Utility** | `authenticate`, `api_key_status`, `check_for_updates`, `initialize_workspace`, `show_commands`, `get_agent_template` | System management |

## Decision Tree: Which Tool Should I Use?

```
Start
  │
  ├─ Need to authenticate?
  │    └─ YES → authenticate
  │
  ├─ Building something new?
  │    ├─ Full project/large feature?
  │    │    └─ shadow_clone_orchestrate (mode: "feature")
  │    ├─ Need plan first?
  │    │    └─ shadow_clone_plan
  │    ├─ Single component/module?
  │    │    └─ deploy_agent_team
  │    └─ Very specific task?
  │         └─ deploy_specialist_agent
  │
  ├─ Fixing something?
  │    ├─ Quick bug fix?
  │    │    └─ quick_fix
  │    ├─ Complex debugging?
  │    │    └─ shadow_clone_orchestrate (mode: "debug")
  │    └─ Performance issue?
  │         └─ shadow_clone_orchestrate (mode: "optimize")
  │
  ├─ Reviewing/auditing?
  │    ├─ Code quality?
  │    │    └─ code_review_team
  │    ├─ Security?
  │    │    └─ shadow_clone_orchestrate (mode: "audit")
  │    └─ Architecture?
  │         └─ architecture_consultant
  │
  ├─ Testing?
  │    └─ generate_tests
  │
  ├─ Documentation?
  │    └─ create_documentation
  │
  └─ Understanding code?
       └─ shadow_clone_orchestrate (mode: "research")
```

## Quick Reference

### For Big Projects

| What You Want | Tool | Time Estimate |
|--------------|------|---------------|
| Complete feature with planning | `shadow_clone_plan` → `shadow_clone_orchestrate` | Hours |
| Feature without planning | `shadow_clone_orchestrate` (mode: "feature") | Hours |
| Full security audit | `shadow_clone_orchestrate` (mode: "audit") | Hours |
| Major refactoring | `shadow_clone_orchestrate` (mode: "refactor") | Hours |

### For Quick Tasks

| What You Want | Tool | Time Estimate |
|--------------|------|---------------|
| Fix a bug | `quick_fix` | Minutes |
| Review specific files | `code_review_team` | Minutes |
| Add tests to a file | `generate_tests` | Minutes |
| Get architecture advice | `architecture_consultant` | Minutes |
| Document an API | `create_documentation` | Minutes |

### For Focused Work

| What You Want | Tool | Time Estimate |
|--------------|------|---------------|
| Frontend component | `deploy_agent_team` (frontend) | ~30 min |
| Backend endpoint | `deploy_agent_team` (backend) | ~30 min |
| Database schema | `deploy_agent_team` (database) | ~30 min |
| Expert opinion | `deploy_specialist_agent` | ~15 min |

## Tool Complexity Levels

### Level 1: Simple (Single Response)

These tools return immediate help:
- `quick_fix`
- `deploy_specialist_agent`
- `architecture_consultant`
- `create_documentation`

### Level 2: Moderate (Team Response)

These tools simulate small teams:
- `deploy_agent_team`
- `code_review_team`
- `generate_tests`
- `execute_single_wave`

### Level 3: Complex (Multi-Wave)

These tools run full orchestrations:
- `shadow_clone_orchestrate`
- `shadow_clone_plan`

## Combining Tools

Tools work well together:

### Planning → Building

```
1. shadow_clone_plan → Creates MASTER_PLAN.md
2. Review the plan
3. shadow_clone_orchestrate → Implements the plan
```

### Building → Testing → Reviewing

```
1. deploy_agent_team (frontend) → Creates component
2. generate_tests → Adds test coverage
3. code_review_team → Reviews for quality
```

### Audit → Fix → Verify

```
1. shadow_clone_orchestrate (audit) → Finds issues
2. quick_fix → Fixes each issue
3. code_review_team (security) → Verifies fixes
```

## Authentication Required

All tools except `authenticate`, `api_key_status`, `check_for_updates`, and `show_commands` require authentication.

---

## Detailed Tool Documentation

- [Orchestration Tools](orchestration.md) - Full project execution
- [Team Tools](teams.md) - Focused team deployment
- [Rapid Tools](rapid.md) - Quick targeted operations
- [Utility Tools](utility.md) - System management
- [Complete Reference](../reference/all-tools.md) - Every parameter documented
