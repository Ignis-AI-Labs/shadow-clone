# Tasks — Plugin (slash commands + bridge + protocols)

**Last updated:** 2026-06-29

The plugin surface lives at:

- `claude/commands/sc*.md` — every `/sc-*` slash command
- `bridge/` — install + paired-review (`/sc-echo`) bridge
- `protocols/` — the 14 canonical engineering protocols
- `opencode-plugin/sc-echo.js` — OpenCode counterpart for the reviewer
- `scripts/` — `sc-doctor.sh`, `sc-last-verdict.sh`

This is the **primary** delivery surface for Shadow Clone.

## How to Claim a Task
Edit this file on `dev`. Put your handle in the **Assignee** column, flip status to `IN PROGRESS`, push the claim commit **before** writing implementation code.

| ID | Task | Status | Assignee | Depends on | Notes |
|---|---|---|---|---|---|
| P-P0-01 | Phase A — paired-review bridge (`/sc-echo`) | DONE | @eli | — | commits `fcfd413` → `6bf9f6a` |
| P-P0-02 | Phase B — `/sc` umbrella init + protocol-aware scaffold | DONE | @eli | P-P0-01 | commit `f5bd12f` |
| P-P0-03 | Phase C — port 7 orchestration modes to `/sc-*` slash commands | DONE | @eli | P-P0-01 | commit `6ae5bba` |
| P-P0-04 | Wave & Subagent Coordination Protocol (SCWS-v1.0) | DONE | @eli | P-P0-03 | commit `140cb89` |
| P-P0-05 | `/sc-sprint` + `/sc-roadmap` (active-codebase planning) | DONE | @eli | P-P0-03 | commit `9de3ed5` |
| P-P0-06 | `/sc-test-audit` diagnostic | DONE | @eli | P-P0-03 | commit `8d78cd3` |
| P-P0-07 | Strip timelines; reframe planning around milestones + DAG | DONE | @eli | P-P0-05 | commit `3e5c9bc` |
| P-P1-01 | End-to-end exercise every `/sc-*` mode on a real project (verify deliverables land correctly, AskUserQuestion paths work, `.waves/` scaffold is honored) | OPEN |  | P-P0-07 |  |
| P-P1-02 | Security audit of the plugin surface itself — review `bridge/*.sh` for shell-quoting / re-entrancy / path-traversal; verify exchange logs have safe permissions; confirm no command leaks user input as code | OPEN |  | P-P0-01 |  |
| P-P1-03 | `/sc-quick-fix` — targeted single-issue fix, minimal team | OPEN |  | — | rapid utility |
| P-P1-04 | `/sc-tests` — generate integration tests per `protocols/Testing & Quality Assurance Protocol.md` | OPEN |  | — | rapid utility |
| P-P1-05 | `/sc-docs` — generate documentation per `protocols/Documentation Standards for Software Teams.md` | OPEN |  | — | rapid utility |
| P-P2-01 | Workflow continuity — `/sc-resume` (pick up mid-wave from `.waves/` audit), `/sc-abort` (clean teardown) | OPEN |  | P-P0-07 |  |
| P-P2-02 | Closing-layer commands — `/sc-ship` (release-prep + rollback plan), `/sc-retro` (retrospective on completed sprint/plan) | OPEN |  | P-P0-05 |  |
| P-P3-01 | Swarm tier — exhaustive multi-agent commands (`/sc-swarm-search`, `/sc-swarm-research`, `/sc-swarm-audit`) running multiple waves in parallel for up to ~100 subagents. Requires a Swarm Coordination Protocol that supplements SCWS-v1.0. | OPEN |  | P-P0-04, P-P1-02 |  |
