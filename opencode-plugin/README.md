# Shadow Clone OpenCode plugin

The OpenCode end of the bidirectional echo review loop (see `../AGENTS.md`, Rule 9).

When GLM 5.2 is the **Builder**, this plugin gives it a first-class **`sc_echo_review`**
tool. GLM calls it after each work unit; the tool hands the work to the Claude (Opus)
**Reviewer** via `~/.claude/sc/ask-claude.sh` and returns Claude's review, ending in
a `VERDICT: APPROVE | REVISE | BLOCK` line.

## What it provides

- **Tool `sc_echo_review`** (`sc-echo.js`) — args: `context` (what you did) and `files`
  (paths changed). Returns the review text. The plugin delegates to the shared
  bridge script, so the review logic has one source of truth.
- **Command `/sc-echo`** (`command/sc-echo.md`) — puts GLM into paired-review mode: it calls
  `sc_echo_review` after each work unit and loops on the verdict.

## Install (global — works in any project)

Run the installer, which copies `sc-echo.js` into OpenCode's global plugin directory
(`~/.config/opencode/plugin/`) **and** `command/sc-echo.md` into the command directory
(`~/.config/opencode/command/`):

```bash
./install.sh
```

Then, inside an OpenCode session, run `/sc-echo` to enter paired-review mode. GLM will
call `sc_echo_review` after each work unit.

> **Why a copy, not a symlink?** OpenCode resolves the plugin's
> `@opencode-ai/plugin` import relative to the file's *real* path. That package
> lives in `~/.config/opencode/node_modules`, so the plugin must physically sit in
> `~/.config/opencode/plugin/`. A symlink pointing back into this repo resolves the
> import from the wrong tree and the plugin silently fails to load. Re-run
> `./install.sh` after editing `sc-echo.js`. (Note: the directory is `plugin/`,
> singular, in OpenCode 1.17.x — not `plugins/`.)

## Requirements

- `claude` CLI on PATH (the Reviewer).
- `~/.claude/sc/ask-claude.sh` present (the shared bridge that `sc_echo_review` calls).
- The project has an `AGENTS.md` at its root (the shared law).

The `/sc-echo` command is bundled here and installed by `install.sh` — no separate setup.
