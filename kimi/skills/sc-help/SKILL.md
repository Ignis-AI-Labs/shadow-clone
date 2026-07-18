---
name: sc-help
description: "Show the catalog of installed Shadow Clone Kimi skills and what each one does"
type: prompt
whenToUse: When the user asks what Shadow Clone skills or commands are available
---

Show the user the following catalog **exactly** as written below, then ask if they
want to use any of them. Do not invent skills; do not omit the "Status" column.

# Shadow Clone skill catalog (Kimi)

Every Shadow Clone surface is a skill: the umbrella `/skill:sc`, plus the
`/skill:sc-<name>` mode family. They all live as directories under
`~/.kimi-code/skills/sc-*/SKILL.md` once `kimi/install.sh` has run —
`bash scripts/sc-doctor.sh` verifies the install.

## System

| Skill | What it does | Status |
|---|---|---|
| `/skill:sc` | Activate Shadow Clone — walks the user through project init: detects existing setup, asks Type / Stack / Team / Stakes, derives a protocol shortlist, and writes (with user-gated overwrites) `AGENTS.md`, `CLAUDE.md`, `docs/audit/ISSUE_TRACKER.md`, and the `.waves/` scaffold. Surfaces a branching migration plan if non-conforming branches exist. | ✅ Available |
| `/skill:sc-bootstrap` | Verify the install is complete (bridge + protocols + reviewer persona + Kimi skills) and tell you the smallest next step to complete it. | ✅ Available |
| `/skill:sc-update` | Check for and apply Shadow Clone updates — detects the install path and walks you through the right update route. | ✅ Available |
| `/skill:sc-help` | Show this catalog. | ✅ Available |
| `/skill:sc-echo [claude\|opencode\|grok\|kimi]` | Enter paired-review mode — a second model reviews each completed work unit against `AGENTS.md`, returning `VERDICT: APPROVE \| REVISE \| BLOCK \| ERROR`. Loop up to 3 rounds per unit. Default reviewer when Kimi builds: Claude (`ask-claude.sh`). | ✅ Available |

## Orchestration modes

Each skill asks a short batch of context questions (3-5, via `AskUserQuestion`)
up front before starting Wave 0. Every mode adheres to the canonical engineering standards
deployed to `~/.claude/sc/protocols/` (see "Coding standards" below).

| Skill | What it does | Status |
|---|---|---|
| `/skill:sc-plan` | **Greenfield** plan mode — produces MASTER_PLAN.md as a DAG of phases with explicit prerequisites, parallel branches, and load-bearing items. No timelines; work gets done when it gets done. | ✅ Available |
| `/skill:sc-sprint` | **Active-codebase** sprint — one milestone, decomposed into a PR-sized task DAG (prerequisites, parallel-with, load-bearing flags). Produces SPRINT_PLAN.md with a pipeline diagram. No durations; phase-triggered check-ins. | ✅ Available |
| `/skill:sc-roadmap` | **Multi-milestone pipeline** — Wave 0 strategic context, Wave 1 workstream DAG with prerequisites + parallelism + load-bearing flags, Wave 2 ROADMAP.md with decision gates. No timelines; the pipeline is shaped by the graph, not the calendar. | ✅ Available |
| `/skill:sc-feature` | Feature mode — multi-wave implementation team for a focused capability. | ✅ Available |
| `/skill:sc-refactor` | Refactor mode — safe restructure team with behavior-preserving discipline. | ✅ Available |
| `/skill:sc-debug` | Debug mode — investigation team, root-cause analysis, hypothesis-then-test. | ✅ Available |
| `/skill:sc-optimize` | Optimize mode — performance team, measure-first, micro-vs-macro tradeoff awareness. | ✅ Available |
| `/skill:sc-research` | Research mode — open-ended investigation team for tech selection or spike work. | ✅ Available |
| `/skill:sc-audit` | Audit mode — planning team that produces an audit blueprint, then chains into the security checklist scan. | ✅ Available |
| `/skill:sc-test-audit` | Diagnose test-suite coverage gaps in an existing project — maps source surface against existing tests, flags missing integration tests where they make sense, surfaces security-sensitive paths without coverage. Read-only; does not run tests, does not generate them. | ✅ Available |

## Rapid utilities

Smaller, single-purpose helpers for focused work that doesn't justify a full mode.

| Skill | What it does | Status |
|---|---|---|
| `/skill:sc-quick-fix` | Targeted single-issue fix — minimal team, no waves, fastest path to a small, focused change. Gnosis-gated diagnosis, scope-guarded edits, verification per the user's chosen rigor. | ✅ Available |
| `/skill:sc-tests` | Generate meaningful tests for the work currently in scope — surface-first contract discovery, framework-aware, no coverage theater. Cites `Testing & Quality Assurance Protocol.md`. | ✅ Available |
| `/skill:sc-docs` | Generate documentation for the work currently in scope — audience-aware, anti-marketing voice, source-of-truth-first. Cites `Documentation Standards for Software Teams.md`. | ✅ Available |
| `/skill:sc-cleaner` | Repo organization + archival sweep — evidence-gated, plan-first. Inventories stale/backup/misplaced files, writes `CLEANUP_PLAN.md`, and on approval moves them into `archive/` (mirroring structure; `git mv` for tracked files, preserving history). Never deletes files (empty dirs only, gated); fully reversible. | ✅ Available |

## Helper scripts (not skills)

These are bash scripts in `scripts/` — run with `bash scripts/<name>.sh`:

| Script | What it does |
|---|---|
| `scripts/sc-doctor.sh` | Verify the Shadow Clone install is healthy — checks every deployed path (including the Kimi skills), required CLIs, and the protocols deployment. |
| `scripts/sc-update.sh` | Pull the latest release source, re-run the bridge installer, re-verify with sc-doctor. |
| `scripts/sc-last-verdict.sh` | Print the verdict line from the most recent echo review in `.sc/exchange/`. |

## Coding standards

The canonical engineering standards live in `protocols/` in the repo and are
deployed to `~/.claude/sc/protocols/` by `bridge/install.sh`. Every `/skill:sc-*`
mode requires adherence to them; when a `/skill:sc-echo` review flags a protocol
violation, the finding cites the protocol filename.

**Core standards (apply to every mode):**

- `Functional Programming & Purity Protocol.md`
- `Comprehensive Code Quality and Consistency Protocol.md`
- `SECURITY_CHECKLIST.md`
- `Error Handling & Resilience Protocol.md`
- `AI-Assisted Development Protocol.md`
- `Gnosis Verification Protocol.md` — **load-bearing** evidence gate: a bug that has not been verified is not a bug

**Operational protocols (govern HOW Shadow Clone runs):**

- `Multi Agent Protocol.md` — orchestrator-worker theory and concurrency caps
- `Shadow Clone Wave & Subagent Coordination Protocol.md` — wave lifecycle,
  role-to-clone mapping, team-size capping (hard cap **5 concurrent specialists**),
  Record Keeper contract, failure modes, audit logging

**Additional protocols (referenced by relevant modes):**

- `Architecture & System Design Protocol.md`
- `Code Efficiency & Performance Protocol.md`
- `Testing & Quality Assurance Protocol.md`
- `Documentation Standards for Software Teams.md`
- `Audit Protocol.md`
- `Dependency & Supply Chain Management Protocol.md`
- `DevOps & Deployment Protocol.md`

## Status legend

- ✅ **Available** — installed by `kimi/install.sh` and ready to use.

For the list of *currently installed* Kimi skills on this machine, look at
`~/.kimi-code/skills/`. Anything there is invokable as `/skill:<directory-name>`.
