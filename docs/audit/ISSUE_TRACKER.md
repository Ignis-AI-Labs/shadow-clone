# ISSUE TRACKER

Tracks all issues per **Rule 7** of [`../../AGENTS.md`](../../AGENTS.md).

States: **Open** · **In Progress** · **Resolved** · **Deferred** · **False Positive**

---

## Open

_None yet._

---

## In Progress

_None yet._

---

## Resolved

- **Issue ID**: INFRA-001
- **Discovered By**: Builder (Claude) — from the live process table
- **Date Discovered**: 2026-06-24
- **Source**: Runtime error (wedged sessions reported by the human)
- **Severity**: High
- **Location**: `~/.claude/sc/ask-glm.sh`, `~/.claude/sc/ask-claude.sh` (pre-fix, monolithic)
- **Description**: The original bridges invoked the reviewer (`opencode` / `claude -p`)
  with no timeout, so a stalled reviewer hung forever — one review was wedged 27h,
  permanently blocking the Claude session that launched it. Compounding factors:
  (1) three divergent copies of the bridge (repo-absent, `~/.claude/sc`, `~/.sc`)
  meant different repos ran different code; (2) `timeout -k 10` (in the newer copy)
  killed only the direct child, orphaning `opencode`/`claude` grandchildren;
  (3) a reviewer could re-invoke a bridge, recursing and self-deadlocking on the
  global lock; (4) a single global lock serialized every repo, so one wedge stalled
  all parallel work.
- **Evidence**: `PID 3018360`/`3018369` — `bash ask-glm.sh → opencode run` at
  `1-03:00:00+` ELAPSED with no bounding timeout.

- **Fixed By**: Builder (Claude)
- **Date Fixed**: 2026-06-24
- **Fix Description**: Consolidated the bridge into one canonical, in-repo source
  (`bridge/`, installed to `~/.claude/sc` with `~/.sc` symlinked) ending the drift.
  Added `lib/reap.sh` (reviewer runs in its own process group; on timeout or
  interrupt the whole subtree is SIGTERM→SIGKILL'd — no orphans), `lib/guard.sh`
  (re-entrancy guard: a reviewer can never start another review), and rewrote
  `lib/run-review.sh` to serialize per-project (same repo queues, different repos run
  in parallel) and degrade to `VERDICT: ERROR` instead of hanging.
- **Verification**: 8/8 behavioral tests (timeout reaps the whole tree with zero
  orphans; same-repo serializes at ~4s while different repos parallelize at ~2s; the
  guard refuses nested reviews). Confirmed live: an `ai-6` review and an `msra` review
  ran concurrently without blocking, and the 27h zombie tree was reaped.

- **Issue ID**: ECHO-001
- **Discovered By**: Reviewer (GLM 5.2 via `/sc-echo` round 3)
- **Date Discovered**: 2026-06-28
- **Source**: `/sc-echo` paired-review of the `echo` → `sc-echo` system-wide rename
- **Severity**: Low
- **Location**: `opencode-plugin/sc-echo.js` — file-header JSDoc (top of file)
- **Description**: F2 of the rename review updated the inline `execute` JSDoc and the
  tool `description` to include `VERDICT: …|ERROR`, but the top-of-file header comment
  still listed only `APPROVE|REVISE|BLOCK`. A reader scanning the header only would
  miss the transport-signal and could loop on a bridge failure — the exact failure
  mode F2 was meant to prevent.

- **Fixed By**: Builder (Claude)
- **Date Fixed**: 2026-06-28
- **Fix Description**: Updated the file-header JSDoc to list
  `APPROVE|REVISE|BLOCK|ERROR` with the same ERROR semantics noted in the inline
  JSDoc (surface to human, do not loop).
- **Verification**: `node --check` passes; fix applied after the 3-round /sc-echo cap
  had elapsed (REVISE at round 3), so the Reviewer did not re-verify the patched
  header. Manual review only.

- **Issue ID**: ECHO-002
- **Discovered By**: Reviewer (GLM 5.2 via `/sc-echo` round 3)
- **Date Discovered**: 2026-06-28
- **Source**: `/sc-echo` paired-review of the `echo` → `sc-echo` system-wide rename
- **Severity**: Info
- **Location**: `opencode-plugin/sc-echo.js` — `execute()` callback, `ctx.directory`
- **Description**: `const dir = ctx.directory || directory;` throws TypeError if the
  SDK ever calls `execute(args)` without a context object. Likely a no-op under the
  current OpenCode contract, but a silent-failure-path Rule 3 wants explicit.

- **Fixed By**: Builder (Claude)
- **Date Fixed**: 2026-06-28
- **Fix Description**: Guarded the access with `ctx?.directory` so a missing context
  falls back to the session `directory` instead of throwing.
- **Verification**: `node --check` passes; fix applied after the 3-round /sc-echo cap.
  Manual review only.

---

## Deferred

- **Issue ID**: PROC-001
- **Discovered By**: User (Elijah)
- **Date Discovered**: 2026-06-24
- **Source**: Code review of repo history (both this workspace and `Ignis-AI-Labs/echo`)
- **Severity**: Medium
- **Location**: pre-2026-06-24 git history — `main` in both this workspace
  and the OSS mirror, plus the lone `bugfix/echo-graceful-lifecycle` branch
- **Description**: Rule 2 violation. Every commit went directly to `main` (and
  the one branch that did exist, `bugfix/echo-graceful-lifecycle`, used the now-
  retired `[type]/[description]` form). No personal `<who>/dev` branches, no PR
  flow. Silent deviation — never flagged in-line.
- **Resolution**: Deferred (historical-only). Going forward, Rule 2 is amended
  to the personal `<who>/dev` → `dev` → `main` model and enforced strictly;
  this entry is the flag that the prior period was non-conforming. The lifecycle
  branch is being migrated to `efficio/dev` as part of the new flow.

- **Issue ID**: ECHO-003
- **Discovered By**: Reviewer (GLM 5.2 via `/sc-echo` round 3 of Phase C port)
- **Date Discovered**: 2026-06-28
- **Source**: `/sc-echo` paired-review of the 7-mode Phase C port
- **Severity**: Info (Low)
- **Location**: `claude/commands/sc-plan.md` — `task_list_requirement` (~lines 337-347) vs `file_creation_discipline` (~lines 280-307)
- **Description**: Pre-existing internal tension (inherited verbatim from
  `mcp-server/src/prompts/content/mode_plan.ts`, not introduced by the port).
  `task_list_requirement` directs saving `TASKS-backend.md` / `TASKS-frontend.md` /
  `TASKS-shared.md` without specifying a path, while `file_creation_discipline`
  mandates "NEVER create files outside the designated wave structure." A reader
  could be confused about where task lists land relative to `.waves/`.
- **Resolution**: Deferred. Reviewer marked "Low priority; defer if desired"
  during the round-3 APPROVE. Fix in a future touch — either specify
  `.waves/wave-2/deliverables/TASKS-*.md` as the path, or add an explicit
  task-list exemption to `file_creation_discipline`. Either way, fix in both
  the slash command AND the upstream `mcp-server/src/prompts/content/mode_plan.ts`
  so they don't re-diverge.

---

## False Positive

_None yet._
