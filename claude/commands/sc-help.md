---
description: Show the catalog of Shadow Clone /sc and /sc-* commands and what each one does
---

Show the user the following catalog **exactly** as written below, then ask if they
want to use any of them. Do not invent commands; do not omit the "Status" column.

# Shadow Clone command catalog

Every Shadow Clone surface is a slash command: the umbrella `/sc`, plus the
`/sc-<name>` mode family. They all live as files under
`~/.claude/commands/sc*.md` once `bridge/install.sh` has run — `bash scripts/sc-doctor.sh`
verifies the install.

## System

| Command | What it does | Status |
|---|---|---|
| `/sc` | Activate Shadow Clone — walks the user through project init: detects existing setup, asks Type / Stack / Team / Stakes, derives a protocol shortlist, and writes (with user-gated overwrites) `AGENTS.md`, `CLAUDE.md`, `docs/audit/ISSUE_TRACKER.md`, and the `.waves/` scaffold. Surfaces a branching migration plan if non-conforming branches exist. | ✅ Available |
| `/sc-help` | Show this catalog. | ✅ Available |
| `/sc-echo` | Enter paired-review mode — a second model reviews each completed work unit against `AGENTS.md`, returning `VERDICT: APPROVE \| REVISE \| BLOCK \| ERROR`. Loop up to 3 rounds per unit. | ✅ Available |

## Orchestration modes

Each command asks a short batch of context questions (3-5, via `AskUserQuestion`)
up front before starting Wave 0. Every mode adheres to the canonical engineering standards
deployed to `~/.claude/sc/protocols/` (see "Coding standards" below).

| Command | What it does | Status |
|---|---|---|
| `/sc-plan` | **Greenfield** plan mode — wave planning, MASTER_PLAN.md, scope decomposition before any code is written. Best for new projects. | ✅ Available |
| `/sc-sprint` | **Active-codebase** sprint plan — Wave 0 reads current state, Wave 1 decomposes + risks, Wave 2 produces SPRINT_PLAN.md. | ✅ Available |
| `/sc-roadmap` | **Multi-sprint horizon** plan — Wave 0 strategic context, Wave 1 workstreams + dependencies, Wave 2 ROADMAP.md with decision gates. | ✅ Available |
| `/sc-feature` | Feature mode — multi-wave implementation team for a focused capability. | ✅ Available |
| `/sc-refactor` | Refactor mode — safe restructure team with behavior-preserving discipline. | ✅ Available |
| `/sc-debug` | Debug mode — investigation team, root-cause analysis, hypothesis-then-test. | ✅ Available |
| `/sc-optimize` | Optimize mode — performance team, measure-first, micro-vs-macro tradeoff awareness. | ✅ Available |
| `/sc-research` | Research mode — open-ended investigation team for tech selection or spike work. | ✅ Available |
| `/sc-audit` | Audit mode — planning team that produces an audit blueprint, then chains into the security checklist scan. | ✅ Available |
| `/sc-test-audit` | Diagnose test-suite coverage gaps in an existing project — maps source surface against existing tests, flags missing integration tests where they make sense, surfaces security-sensitive paths without coverage. Read-only; does not run tests, does not generate them. | ✅ Available |

## Rapid utilities

These are smaller, single-purpose helpers — still on the roadmap (not yet built).

| Command | What it does | Status |
|---|---|---|
| `/sc-quick-fix` | Targeted single-issue fix — minimal team, fastest path to a small, focused change. | 🚧 Phase C |
| `/sc-tests` | Generate integration tests per `protocols/TESTING.md` for the work currently in scope. | 🚧 Phase C |
| `/sc-docs` | Generate documentation per `protocols/WRITING.md` for the work currently in scope. | 🚧 Phase C |

## Helper scripts (not slash commands)

These are bash scripts in `scripts/` — they're run with `bash scripts/<name>.sh`, not via a slash command.

| Script | What it does |
|---|---|
| `scripts/sc-doctor.sh` | Verify the Shadow Clone install is healthy — checks every deployed path, required CLI, and protocols deployment; warns on stale files from prior installs. |
| `scripts/sc-last-verdict.sh` | Print the verdict line from the most recent `/sc-echo` review in `.sc/exchange/`. |

## Coding standards

The canonical engineering standards live in `protocols/` in the repo and are deployed to `~/.claude/sc/protocols/` by `bridge/install.sh`. Every `/sc-*` mode command requires adherence to them.

**Core standards (apply to every mode):**

- `Functional Programming & Purity Protocol.md`
- `Comprehensive Code Quality and Consistency Protocol.md`
- `SECURITY_CHECKLIST.md`
- `Error Handling & Resilience Protocol.md`
- `AI-Assisted Development Protocol.md`

**Operational protocols (govern HOW Shadow Clone runs):**

- `Multi Agent Protocol.md` — orchestrator-worker theory and numeric caps (upstream allows ≤5-7 reports, 3-5 concurrent sweet spot)
- `Shadow Clone Wave & Subagent Coordination Protocol.md` — Shadow-Clone-specific operational rules: wave lifecycle, role-to-clone mapping, team-size capping, mandatory clone-prompt contents, Record Keeper contract, failure modes, audit logging. This protocol **tightens** the upstream range to a hard **5 concurrent specialists** per wave, with the Record Keeper running strictly after specialists (not counted against the concurrent cap).

**Additional protocols (referenced by relevant modes):**

- `Architecture & System Design Protocol.md`
- `Code Efficiency & Performance Protocol.md`
- `Testing & Quality Assurance Protocol.md`
- `Documentation Standards for Software Teams.md`
- `Audit Protocol.md`
- `Dependency & Supply Chain Management Protocol.md`
- `DevOps & Deployment Protocol.md`

Each mode's body lists its core + additional emphasis. When a `/sc-echo` review flags a protocol violation, the finding cites the protocol filename so the Builder can verify.

## Status legend

- ✅ **Available** — installed by `bridge/install.sh` and ready to use.
- 🚧 **Phase B / Phase C** — planned per `UNIFICATION_PLAN.md`, not yet built.

For the latest list of *currently installed* slash commands on this machine, look at
`~/.claude/commands/sc*.md`. Anything in that directory is invokable as
`/<filename-without-.md>`.
