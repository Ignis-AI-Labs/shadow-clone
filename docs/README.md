# docs/

This directory now holds only:

- **`audit/`** — the live Rule-7 issue tracker. `/sc-echo` writes here when a
  paired-review loop hits its 3-round cap with open findings.
- **`.archive/`** — historical documentation from the MCP-only era of Shadow
  Clone (pre-`/sc-*` slash-command pivot). Kept for reference, not for users.

The current user-facing documentation lives in:

- **Project root `README.md`** — install, overview, command catalog
- **`CLAUDE.md`** / **`AGENTS.md`** — operating agreements for AI assistants
- **`protocols/`** — the canonical engineering protocols (deployed to
  `~/.claude/sc/protocols/` by `bridge/install.sh`)
- **`claude/commands/sc*.md`** — every Shadow Clone slash command, in source
  form (deployed to `~/.claude/commands/`)
- **`/sc-help`** — run this command for the live catalog of all `/sc-*` commands
