# Tasks — Backend (MCP server)

**Last updated:** 2026-06-29

The MCP server at `mcp-server/` is the **secondary** delivery surface (the
slash-command plugin in `claude/commands/` is primary). Work here keeps the
MCP path functional for users on MCP-only environments (Claude Desktop,
some VS Code setups, etc.).

## How to Claim a Task
Edit this file on `dev`. Put your handle in the **Assignee** column. Push the claim commit before writing implementation code.

| ID | Task | Status | Assignee | Depends on | Notes |
|---|---|---|---|---|---|
| B-P0-01 | Open-source pivot — strip auth/NFT licensing layer | DONE | @eli | — | commit `ad5341e` |
| B-P1-01 | Zod schema validation for tool inputs | DONE | @eli | B-P0-01 | commit `726264c` |
| B-P1-02 | Unit test infrastructure (Vitest/Jest) | OPEN |  | B-P0-01 |  |
| B-P1-03 | Tool handler tests | OPEN |  | B-P1-02 |  |
| B-P1-04 | Utility tests (validation, logger) | OPEN |  | B-P1-02 |  |
| B-P1-05 | Improved error messaging & diagnostics | OPEN |  | B-P1-01 |  |
| B-P2-01 | Audit & remove unused deps (post-auth-removal) | OPEN |  | B-P0-01 |  |
| B-P2-02 | Keep MCP prompt content in sync with `protocols/` source of truth | OPEN |  | — | the slash-command modes are now canonical; MCP prompts should pull from the same protocol files where practical |
