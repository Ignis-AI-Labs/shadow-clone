# Shadow Clone - Task Tracker

**Last updated:** February 2026

Task IDs follow the format `{Component}-P{Priority}-{Number}`.

- **Components:** B (Backend/MCP Server), F (Frontend), D (Docs), I (Infra)
- **Priority:** P0 = Foundation, P1 = Critical security, P2 = Integration hardening, P3 = Differentiation/compliance, P4 = Testing/quality

---

## Backend (MCP Server)

| ID | Task | Status | Depends on | PR |
|----|------|--------|------------|-----|
| B-P0-01 | API key encryption (AES-256-GCM) | DONE | -- | [#1](https://github.com/ElijahMoses/shadow-clone/pull/1) |
| B-P1-01 | Browser-based auth foundation | IN REVIEW | B-P0-01 | [#8](https://github.com/ElijahMoses/shadow-clone/pull/8) |
| B-P1-02 | Wallet verification & audit logging | IN REVIEW | B-P1-01 | [#7](https://github.com/ElijahMoses/shadow-clone/pull/7) |
| B-P1-03 | Security hardening & code refactoring | IN REVIEW | B-P1-02 | [#6](https://github.com/ElijahMoses/shadow-clone/pull/6) |
| B-P1-04 | Zod schema validation for tool inputs | IN REVIEW | B-P0-01 | [#9](https://github.com/ElijahMoses/shadow-clone/pull/9) |
| B-P1-05 | Session management & revocation | OPEN | B-P1-01 | -- |
| B-P1-06 | Distributed rate limiting (Redis) | OPEN | B-P1-04 | -- |
| B-P2-01 | Lock down to MCP-only access | IN REVIEW | B-P1-03 | [#10](https://github.com/ElijahMoses/shadow-clone/pull/10) |
| B-P2-02 | Error messaging & diagnostics | OPEN | B-P2-01 | -- |

## Frontend

| ID | Task | Status | Depends on | PR |
|----|------|--------|------------|-----|
| F-P0-01 | Dashboard scaffolding (Next.js) | OPEN | -- | -- |
| F-P0-02 | API key management UI | OPEN | F-P0-01 | -- |
| F-P3-01 | User macro editor | OPEN | F-P0-01 | -- |

## Docs

| ID | Task | Status | Depends on | PR |
|----|------|--------|------------|-----|
| D-P0-01 | Branch reorganization & developer protocol | DONE | -- | -- |
| D-P2-01 | MCP integration setup guide | IN REVIEW | -- | [#11](https://github.com/ElijahMoses/shadow-clone/pull/11) |
| D-P3-01 | Security whitepaper (orchestration vs injection) | OPEN | B-P1-03 | -- |
| D-P3-02 | API documentation (OpenAPI spec) | OPEN | B-P2-02 | -- |

## Infra

| ID | Task | Status | Depends on | PR |
|----|------|--------|------------|-----|
| I-P1-01 | CI pipeline (build + lint on PRs) | OPEN | D-P0-01 | -- |
| I-P1-02 | ~~Branch protection rules~~ | N/A (fork-based workflow) | -- | -- |
| I-P4-01 | Test infrastructure setup (Jest/Vitest) | OPEN | I-P1-01 | -- |
| I-P4-02 | Code coverage reporting | OPEN | I-P4-01 | -- |

---

## Dependency Graph

```
B-P0-01 (API key encryption) [DONE]
├── B-P1-01 (Browser auth) [IN REVIEW]
│   ├── B-P1-02 (Wallet verification) [IN REVIEW]
│   │   └── B-P1-03 (Security hardening) [IN REVIEW]
│   │       └── B-P2-01 (MCP-only access) [IN REVIEW]
│   │           └── B-P2-02 (Error messaging) [OPEN]
│   └── B-P1-05 (Session management) [OPEN]
├── B-P1-04 (Zod validation) [IN REVIEW]
│   └── B-P1-06 (Rate limiting) [OPEN]
│
D-P0-01 (Branch reorg) [DONE]
└── I-P1-01 (CI pipeline) [OPEN]
    └── I-P4-01 (Test infra) [OPEN]
        └── I-P4-02 (Coverage) [OPEN]
```

### Critical Path

The longest dependency chain is:

```
B-P0-01 → B-P1-01 → B-P1-02 → B-P1-03 → B-P2-01 → B-P2-02
```

Unblocking B-P1-01 (browser auth, PR #8) is the highest-leverage review.

---

## How to Use This File

1. Pick a task with status `OPEN` whose dependencies are `DONE`
2. Create a feature branch: `{author}/{type}-{description}`
3. Reference the task ID in your PR (e.g., "Implements B-P1-05")
4. Update this file when task status changes
