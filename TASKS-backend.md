# Tasks — Backend (MCP Server)

**Last updated:** February 2026

## How to Claim a Task
Edit this file on the `dev` branch. Put your name in the **Assignee** column. Push to your `{name}/dev` branch and PR into `dev`.

| ID | Task | Status | Assignee | Depends on | PR |
|----|------|--------|----------|------------|-----|
| B-P0-01 | Open-source pivot: strip auth layer | DONE | Eli | -- | -- |
| B-P1-01 | Zod schema validation for tool inputs | OPEN | | B-P0-01 | [#9](https://github.com/ElijahMoses/shadow-clone/pull/9) (needs revision) |
| B-P1-02 | Unit test infrastructure (Jest/Vitest) | OPEN | | B-P0-01 | -- |
| B-P1-03 | Tool handler tests | OPEN | | B-P1-02 | -- |
| B-P1-04 | Utility tests (rate limiter, validation, logger) | OPEN | | B-P1-02 | -- |
| B-P1-05 | Improved error messaging & diagnostics | OPEN | | B-P1-01 | -- |
| B-P2-01 | Remove axios dependency (unused after auth removal) | OPEN | | B-P0-01 | -- |
| B-P2-02 | Prompt quality improvements | OPEN | | -- | -- |
