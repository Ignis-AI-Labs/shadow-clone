# Shadow Clone - Task Tracker

**Last updated:** February 2026

Tasks are split into domain-specific files. Click below to find work:

| Domain | File | Prefix | Scope |
|--------|------|--------|-------|
| Backend (MCP Server) | [TASKS-backend.md](TASKS-backend.md) | `B-*` | MCP server, tools, prompts, TypeScript |
| Frontend (Dashboard) | [TASKS-frontend.md](TASKS-frontend.md) | `F-*` | Dashboard UI, prompt editor, gallery |
| Shared (Docs/Infra) | [TASKS-shared.md](TASKS-shared.md) | `S-*` | Documentation, CI/CD, npm publish |

## Task ID Format

`{Component}-P{Priority}-{Number}`

- **Components:** B (Backend), F (Frontend), S (Shared)
- **Priority:** P0 = Foundation, P1 = Quality, P2 = Features, P3 = Community

## How to Claim a Task

1. Open the domain file above
2. Find a task with status `OPEN` whose dependencies are met
3. Put your name in the **Assignee** column
4. Push to your `{name}/dev` branch and PR into `dev`
5. Reference the task ID in your PR (e.g., "Implements B-P1-01")

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
