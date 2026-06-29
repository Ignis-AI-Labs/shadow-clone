# Tasks — Shared (Docs / Infra / CI)

**Last updated:** 2026-06-29

## How to Claim a Task
Edit this file on `dev`. Put your handle in the **Assignee** column, flip status to `IN PROGRESS`, push the claim commit before writing implementation code.

### Docs

| ID | Task | Status | Assignee | Depends on | Notes |
|---|---|---|---|---|---|
| S-P0-01 | Archive MCP-era docs & rewrite the public docs tree | DONE | @eli | B-P0-01 | this commit batch |
| S-P1-01 | README rewrite for the `/sc-*` slash-command system | DONE | @eli | B-P0-01 | this commit batch |
| S-P1-02 | Contributing guide tailored to the plugin surface (claim flow, protocol references, `/sc-echo` gate) | OPEN |  | S-P1-01 |  |
| S-P1-03 | Worked examples per `/sc-*` mode — short narratives showing the question batch, wave deliverables, and final artifact | OPEN |  | S-P1-01 |  |
| S-P1-04 | Migration guide for users coming from the MCP-only era | OPEN |  | S-P1-01 |  |

### Infra & CI

| ID | Task | Status | Assignee | Depends on | Notes |
|---|---|---|---|---|---|
| S-P1-05 | CI pipeline — `bridge/install.sh` smoke test + `scripts/sc-doctor.sh` on PRs | OPEN |  | — |  |
| S-P1-06 | Lint sweep across `claude/commands/*.md` (frontmatter, AskUserQuestion preambles, Standards block, Closing) | OPEN |  | — |  |
| S-P1-07 | `mcp-server/` test runner + coverage report in CI | OPEN |  | B-P1-02 |  |
| S-P2-01 | Distribution — one-line install via `curl -fsSL ... \| bash` once `bridge/install.sh` is stable | OPEN |  | S-P1-05 |  |
| S-P2-02 | Optional npm publish for the MCP server | OPEN |  | B-P1-02 |  |
