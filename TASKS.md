# Shadow Clone — Task Tracker

**Last updated:** 2026-06-30

Tasks are split into domain-specific files. Click below to find work:

| Domain | File | Prefix | Scope |
|---|---|---|---|
| Backend (MCP server) | [TASKS-backend.md](TASKS-backend.md) | `B-*` | `mcp-server/` — the secondary delivery surface |
| Frontend (Web UI)    | [TASKS-frontend.md](TASKS-frontend.md) | `F-*` | `web/` — onboarding/marketing site |
| Shared (Docs / Infra / CI) | [TASKS-shared.md](TASKS-shared.md) | `S-*` | Docs, CI/CD, install, distribution |
| Plugin (slash commands)    | [TASKS-plugin.md](TASKS-plugin.md) | `P-*` | `commands/`, `bridge/`, `protocols/` — the **primary** surface |

## Task ID Format

`{Component}-P{Priority}-{Number}`

- **Components:** P (Plugin), B (Backend), F (Frontend), S (Shared)
- **Priority:** P0 = Foundation, P1 = Quality, P2 = Features, P3 = Community

## How to Claim a Task

1. Open the domain file above
2. Find an `OPEN` task whose dependencies are met
3. Put your handle in the **Assignee** column, flip status to `IN PROGRESS`
4. Push the claim commit **before** writing implementation code
   (see `protocols/Multi Agent Protocol.md`)
5. Reference the task ID in your PR (e.g. "Implements P-P1-04")

## History

The auth/NFT-licensing system was removed in commit `ad5341e` ("open-source
pivot"). PRs #6–#11 were the original closed-source security/auth track and
are all closed. The slash-command pivot replaces the MCP-only delivery
model; the MCP server remains as a secondary surface but new work targets
the `/sc-*` plugin path.
