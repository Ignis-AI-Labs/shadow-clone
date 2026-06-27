# Shadow Clone OpenCode plugin

The OpenCode end of the bidirectional echo review loop (see `../AGENTS.md`, Rule 9).

When GLM 5.2 is the **Builder**, this plugin gives it a first-class **`echo_review`**
tool. GLM calls it after each work unit; the tool hands the work to the Claude (Opus)
**Reviewer** via `~/.claude/sc/ask-claude.sh` and returns Claude's review, ending in
a `VERDICT: APPROVE | REVISE | BLOCK` line.

## What it provides

- **Tool `echo_review`** (`echo.js`) — args: `context` (what you did) and `files`
  (paths changed). Returns the review text. The plugin delegates to the shared
  bridge script, so the review logic has one source of truth.
- **Command `/echo`** (`command/echo.md`) — puts GLM into paired-review mode: it calls
  `echo_review` after each work unit and loops on the verdict.

## Install (global — works in any project)

Run the installer, which copies `echo.js` into OpenCode's global plugin directory
(`~/.config/opencode/plugin/`) **and** `command/echo.md` into the command directory
(`~/.config/opencode/command/`):

```bash
./install.sh
```

Then, inside an OpenCode session, run `/echo` to enter paired-review mode. GLM will
call `echo_review` after each work unit.

> **Why a copy, not a symlink?** OpenCode resolves the plugin's
> `@opencode-ai/plugin` import relative to the file's *real* path. That package
> lives in `~/.config/opencode/node_modules`, so the plugin must physically sit in
> `~/.config/opencode/plugin/`. A symlink pointing back into this repo resolves the
> import from the wrong tree and the plugin silently fails to load. Re-run
> `./install.sh` after editing `echo.js`. (Note: the directory is `plugin/`,
> singular, in OpenCode 1.17.x — not `plugins/`.)

## Requirements

- `claude` CLI on PATH (the Reviewer).
- `~/.claude/sc/ask-claude.sh` present (the shared bridge that `echo_review` calls).
- The project has an `AGENTS.md` at its root (the shared law).

The `/echo` command is bundled here and installed by `install.sh` — no separate setup.
