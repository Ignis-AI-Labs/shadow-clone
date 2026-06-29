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

- **Issue ID**: SCWS-001
- **Discovered By**: Reviewer (GLM 5.2 via `/sc-echo` round 3 of wave/subagent protocol work)
- **Date Discovered**: 2026-06-29
- **Source**: `/sc-echo` paired-review of the Shadow Clone Wave & Subagent Coordination Protocol introduction
- **Severity**: Medium
- **Location**: `protocols/Shadow Clone Wave & Subagent Coordination Protocol.md` §3 — `4-7 / Standard` table row
- **Description**: §1 was reworded to state the Record Keeper "runs strictly after specialists … RK is never concurrent," but §3's Standard row still framed the cap as "4 + 1 = 5 total," invoking concurrent counting and contradicting §1 — the exact contradiction F2 was meant to eliminate, left half-applied.

- **Fixed By**: Builder (Claude)
- **Date Fixed**: 2026-06-29
- **Fix Description**: Rewrote §3 Standard row's parenthetical to "per-wave peak concurrency = 4 specialists; RK is never concurrent with them — see §1." Removed the "4 + 1 = 5 total" framing.
- **Verification**: Manual read of §1 and §3 — both now state concurrency in specialist-only terms. Fix applied after the 3-round /sc-echo cap; the reviewer did not re-verify.

- **Issue ID**: SCWS-002
- **Discovered By**: Reviewer (GLM 5.2 via `/sc-echo` round 3 of wave/subagent protocol work)
- **Date Discovered**: 2026-06-29
- **Source**: `/sc-echo` paired-review of the Shadow Clone Wave & Subagent Coordination Protocol introduction
- **Severity**: Low
- **Location**: `protocols/Shadow Clone Wave & Subagent Coordination Protocol.md` §2 wave lifecycle (steps 6-7) vs. each mode's `## Closing each wave` section
- **Description**: Round 2 attempted to remove a closing-instruction duplication by deleting it from the mode-level Subagents block, but §2 steps 6-7 still spelled out the wave-close summary + `/sc-echo` dispatch — duplicating the mode body's `## Closing each wave` section. F4 was unresolved.
- **Fixed By**: Builder (Claude)
- **Date Fixed**: 2026-06-29
- **Fix Description**: Collapsed §2 steps 6-7 into a single step 6 that cross-references "the mode body's `## Closing each wave` section" as the single source of truth.
- **Verification**: Manual read of §2 and any one mode body's Closing section — only one place now describes the close-wave behavior. Fix applied after the 3-round /sc-echo cap; the reviewer did not re-verify.

- **Issue ID**: SC-001
- **Discovered By**: Reviewer (GLM 5.2 via `/sc-echo` rounds 1-3 of the `/sc` umbrella init work)
- **Date Discovered**: 2026-06-29
- **Source**: `/sc-echo` paired-review of the `/sc` slash-command introduction
- **Severity**: Low / Info
- **Location**: `claude/commands/sc-help.md` intro paragraph (and `claude/commands/sc.md` frontmatter description)
- **Description**: Two cosmetic phrasing stalenesses surfaced in R3 of the `/sc` review: the sc-help intro paragraph still said "Every Shadow Clone surface is a slash command prefixed `/sc-`. The umbrella entry point is `/sc` itself." — the first sentence is false given `/sc` exists. And `sc.md`'s frontmatter description ended with "the `/sc-*` command surface" rather than "/sc and /sc-*".
- **Fixed By**: Builder (Claude)
- **Date Fixed**: 2026-06-29
- **Fix Description**: Rewrote sc-help intro to "Every Shadow Clone surface is a slash command: the umbrella `/sc`, plus the `/sc-<name>` mode family." Updated sc.md frontmatter description to mention both `/sc` and `/sc-*`.
- **Verification**: Manual read; fix applied after the 3-round /sc-echo cap. Also during R3 the reviewer flagged that `bridge/install.sh`'s glob might not have been updated alongside `sc-doctor`'s — verified locally: install.sh:73 already uses `sc*.md` (changed in R2), so the "lockstep" claim was correct; the reviewer just couldn't see install.sh in the R3 dispatch.

- **Issue ID**: SP-001
- **Discovered By**: Reviewer (GLM 5.2 via `/sc-echo` round 3 of the planning-hierarchy recalibration)
- **Date Discovered**: 2026-06-29
- **Source**: `/sc-echo` paired-review of the sprint(hours) → plan(day) → roadmap(week) hierarchy recalibration
- **Severity**: Medium / Low
- **Location**: `claude/commands/sc-roadmap.md` — STRATEGIC_CONTEXT deliverable description (`in the last 1-2 horizons`) and Wave 0 instruction 2 (lookback only covered `1 week` and `2-4 weeks` options)
- **Description**: After recalibrating roadmap horizons to `Days / 1 week (Rec) / 2-4 weeks / Open-ended`, two downstream references were stale: (a) the STRATEGIC_CONTEXT deliverable said to survey "the last 1-2 horizons" of shipped initiatives — for a 1-week horizon that resolves to 1-2 weeks, contradicting the State-of-the-Union Reader's "recent 1-3 months" and Wave 0 instruction 2's "1-2 months"; (b) Wave 0 instruction 2's lookback windows only mapped `1 week` and `2-4 weeks`, leaving `Days` and `Open-ended` without guidance.
- **Fixed By**: Builder (Claude)
- **Date Fixed**: 2026-06-29
- **Fix Description**: Aligned STRATEGIC_CONTEXT deliverable to "the last 1-3 months" with an inline reference back to the role description so the three lookback windows agree. Extended Wave 0 instruction 2 to map all four horizon options: `Days` → last 2-4 weeks, `1 week` → 1-2 months, `2-4 weeks` → 2-3 months, `Open-ended` → 3-6 months.
- **Verification**: Manual read; fix applied after the 3-round /sc-echo cap. The reviewer did not re-verify.

- **Issue ID**: PLAN-TL-001
- **Discovered By**: Reviewer (GLM 5.2 via `/sc-echo` rounds 1-3 of the timeline-removal refactor)
- **Date Discovered**: 2026-06-29
- **Source**: `/sc-echo` paired-review of the strip-timelines-and-reframe-around-DAG refactor across the three planning modes
- **Severity**: Mixed (Medium / Low / Info)
- **Location**: `claude/commands/sc-sprint.md`, `claude/commands/sc-plan.md`, `claude/commands/sc-roadmap.md` — multiple stale cross-references after replacing time-based options with milestone / DAG / load-bearing framing
- **Description**: After replacing the Length / Horizon questions with milestone-based ones and dropping all duration concepts, ~15 stale cross-references survived in unchanged-by-this-Step lines: Communication Planner "weekly summary, end-of-sprint review"; "after Sprint 3" gate examples; duplicated DAG sections (Wave 1 dependency graph vs. Wave 2 Pipeline canonical); "Capacity check" success criterion; "the heart of this wave: dependency graph" (should be milestone pipeline); 14 `horizon` references in non-Step-1 prose; sc-sprint's Step 1 had near-identical Goal + Milestone free-text prompts; sc-plan's Objective example was self-referential.
- **Fixed By**: Builder (Claude)
- **Date Fixed**: 2026-06-29
- **Fix Description**: Three rounds of /sc-echo addressed 16 of 17 findings within the loop; one additional `horizon` straggler (Wave 1 instruction 5 "defends the horizon") was caught by the round-3 reviewer and fixed post-cap. A final local grep sweep then caught and fixed 4 more stragglers (mode-overview "long-horizon," Wave 1 instruction "size against the horizon," team_composition "horizon-relevant granularity," activities_to_perform "horizon-relevant granularity" + "capacity check; flag overflow," communication-plan "for the horizon," Standards section "long-horizon architecture decisions" / "production discipline across the horizon," "multi-sprint plan" in mode_overview, "per-sprint backlog stubs" / "per-sprint stubs" in Wave 2). Final state: `grep -niE 'horizon|sprint length|sprint count|multi-sprint|per-sprint' claude/commands/sc-{plan,sprint,roadmap}.md` returns 0 matches. The three planning modes now use only milestone / DAG / load-bearing / prerequisite / parallel-with vocabulary.
- **Verification**: Local grep sweep returned 0 matches across all three planning modes; sc-doctor 13/13 commands OK; bridge/install.sh deploys cleanly. Fix applied after the 3-round /sc-echo cap; the reviewer did not re-verify the additional post-cap stragglers.

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
