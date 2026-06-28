# echo bridge

The canonical implementation of the echo paired-review loop (AGENTS.md Rule 9). This
directory is the **single source of truth**; `install.sh` deploys it.

## Layout

```
bridge/
  ask-glm.sh        Claude builds → GLM (OpenCode) reviews
  ask-claude.sh     other model builds → Claude (claude -p) reviews
  sc-init.sh       scaffold AGENTS.md + CLAUDE.md into a project
  install.sh        deploy everything (see below)
  config.example    tunables, seeded to ~/.config/sc/config
  agent/            sc-echo-reviewer.md — the read-only OpenCode reviewer persona
  templates/        AGENTS.md + CLAUDE.md used by sc-init.sh
  lib/
    guard.sh        re-entrancy guard (a reviewer can't start a review)
    reap.sh         run the reviewer in its own process group; reap the whole tree
    run-review.sh   timeout + retries + per-project lock + graceful ERROR
    build-request.sh  assemble the review request (diff, files, AGENTS.md)
    chunk-review.sh   split oversized work units across passes, aggregate verdicts
```

## Install

```bash
bash bridge/install.sh
```

Deploys to `~/.claude/sc/` (the path AGENTS.md and the OpenCode plugin reference),
points `~/.sc → ~/.claude/sc` for back-compat, installs the reviewer agent, and
seeds `~/.config/sc/config` (never overwriting an existing one). Re-run after edits.

## Lifecycle guarantees

A review can **never hang or leak processes**:

- **Bounded** — each attempt is killed after `SC_TIMEOUT` (default 300s).
- **No orphans** — the reviewer runs under `setsid`; on timeout or interrupt its
  whole process group gets `SIGTERM` then `SIGKILL` after `SC_KILL_GRACE`.
- **Never wedges the loop** — on failure the bridge emits `VERDICT: ERROR` (a
  parseable non-approval), it does not block.
- **Parallel across repos** — `SC_SERIALIZE=project` (default) queues reviews
  within one repo but lets different repos run at the same time.
- **No re-entrancy** — a reviewer that tries to start another review is refused.

See `config.example` for every tunable.
