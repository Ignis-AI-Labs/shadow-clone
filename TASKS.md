# Shadow Clone - Task Tracker

**Last updated:** February 2026

Task IDs follow the format `{Component}-P{Priority}-{Number}`.

- **Components:** B (Backend/MCP Server), D (Docs), I (Infra)
- **Priority:** P0 = Foundation, P1 = Quality, P2 = Features, P3 = Community

---

## Backend (MCP Server)

| ID | Task | Status | Depends on | PR |
|----|------|--------|------------|-----|
| B-P0-01 | Open-source pivot: strip auth layer | IN PROGRESS | -- | -- |
| B-P1-01 | Zod schema validation for tool inputs | OPEN | B-P0-01 | [#9](https://github.com/ElijahMoses/shadow-clone/pull/9) (needs revision) |
| B-P1-02 | Unit test infrastructure (Jest/Vitest) | OPEN | B-P0-01 | -- |
| B-P1-03 | Tool handler tests | OPEN | B-P1-02 | -- |
| B-P1-04 | Utility tests (rate limiter, validation, logger) | OPEN | B-P1-02 | -- |
| B-P1-05 | Improved error messaging & diagnostics | OPEN | B-P1-01 | -- |
| B-P2-01 | Remove axios dependency (unused after auth removal) | OPEN | B-P0-01 | -- |
| B-P2-02 | Prompt quality improvements | OPEN | -- | -- |

## Docs

| ID | Task | Status | Depends on | PR |
|----|------|--------|------------|-----|
| D-P0-01 | Update all docs for open-source model | IN PROGRESS | B-P0-01 | -- |
| D-P1-01 | README rewrite for open-source users | IN PROGRESS | B-P0-01 | -- |
| D-P1-02 | Contributing guide for new prompts | OPEN | D-P0-01 | -- |
| D-P1-03 | Example workflows and tutorials | OPEN | D-P0-01 | -- |

## Infra

| ID | Task | Status | Depends on | PR |
|----|------|--------|------------|-----|
| I-P1-01 | CI pipeline (build + lint + test on PRs) | OPEN | B-P1-02 | -- |
| I-P1-02 | Code coverage reporting | OPEN | I-P1-01 | -- |
| I-P2-01 | npm publish automation | OPEN | I-P1-01 | -- |

---

## Dependency Graph

```
B-P0-01 (Open-source pivot) [IN PROGRESS]
├── B-P1-01 (Zod validation) [OPEN]
│   └── B-P1-05 (Error messaging) [OPEN]
├── B-P1-02 (Test infrastructure) [OPEN]
│   ├── B-P1-03 (Tool handler tests) [OPEN]
│   └── B-P1-04 (Utility tests) [OPEN]
├── B-P2-01 (Remove axios) [OPEN]
├── D-P0-01 (Docs update) [IN PROGRESS]
│   ├── D-P1-02 (Prompt contributing guide) [OPEN]
│   └── D-P1-03 (Example workflows) [OPEN]
└── D-P1-01 (README rewrite) [IN PROGRESS]

B-P1-02 (Test infrastructure) [OPEN]
└── I-P1-01 (CI pipeline) [OPEN]
    └── I-P1-02 (Coverage) [OPEN]
        └── I-P2-01 (npm publish) [OPEN]
```

---

## Closed/Obsolete PRs

The following PRs were part of the auth/NFT security hardening effort and are obsolete after the open-source pivot:

| PR | Title | Status |
|----|-------|--------|
| [#6](https://github.com/ElijahMoses/shadow-clone/pull/6) | Security Hardening & Code Refactoring | Obsolete (auth removed) |
| [#7](https://github.com/ElijahMoses/shadow-clone/pull/7) | Wallet Verification & Audit Logging | Obsolete (auth removed) |
| [#8](https://github.com/ElijahMoses/shadow-clone/pull/8) | Browser-Based Auth Foundation | Obsolete (auth removed) |
| [#9](https://github.com/ElijahMoses/shadow-clone/pull/9) | Zod Schema Validation | **Needs revision** for auth-free context |
| [#10](https://github.com/ElijahMoses/shadow-clone/pull/10) | MCP-Only Security Access | Obsolete (prompts are open) |
| [#11](https://github.com/ElijahMoses/shadow-clone/pull/11) | Docs Update | Obsolete (docs rewritten) |

---

## How to Use This File

1. Pick a task with status `OPEN` whose dependencies are `DONE` or `IN PROGRESS`
2. Create a feature branch: `{author}/{type}-{description}`
3. Reference the task ID in your PR (e.g., "Implements B-P1-01")
4. Update this file when task status changes
