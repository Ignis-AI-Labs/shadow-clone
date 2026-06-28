---
description: Show the catalog of Shadow Clone /sc-* commands and what each one does
---

Show the user the following catalog **exactly** as written below, then ask if they
want to use any of them. Do not invent commands; do not omit the "Status" column.

# Shadow Clone command catalog

Every Shadow Clone surface is a slash command prefixed `/sc-`. The umbrella entry
point is `/sc` itself. The commands below all live as files under
`~/.claude/commands/sc-*.md` once `bridge/install.sh` has run — `bash scripts/sc-doctor.sh`
verifies the install.

## System

| Command | What it does | Status |
|---|---|---|
| `/sc` | Activate Shadow Clone — walks the user through project init by asking inline questions (project type, language, conventions) and writing a local `CLAUDE.md` / `AGENTS.md` adapted from the canonical `protocols/` library. | 🚧 Phase B |
| `/sc-help` | Show this catalog. | ✅ Available |
| `/sc-echo` | Enter paired-review mode — a second model reviews each completed work unit against `AGENTS.md`, returning `VERDICT: APPROVE \| REVISE \| BLOCK \| ERROR`. Loop up to 3 rounds per unit. | ✅ Available |

## Orchestration modes (Phase C)

These mirror Shadow Clone's seven prompt modes. Each one deploys the appropriate
specialist agent team and runs the work in waves.

| Command | What it does | Status |
|---|---|---|
| `/sc-plan` | Plan mode — wave planning, master plan template, scope decomposition before any code is written. | 🚧 Phase C |
| `/sc-feature` | Feature mode — multi-wave implementation team for a focused capability. | 🚧 Phase C |
| `/sc-refactor` | Refactor mode — safe restructure team with behavior-preserving discipline. | 🚧 Phase C |
| `/sc-debug` | Debug mode — investigation team, root-cause analysis, hypothesis-then-test. | 🚧 Phase C |
| `/sc-optimize` | Optimize mode — performance team, measure-first, micro-vs-macro tradeoff awareness. | 🚧 Phase C |
| `/sc-research` | Research mode — open-ended investigation team for tech selection or spike work. | 🚧 Phase C |
| `/sc-audit` | Audit mode — planning team that produces an audit blueprint, then chains into the security checklist scan. | 🚧 Phase C |

## Rapid utilities (Phase C)

| Command | What it does | Status |
|---|---|---|
| `/sc-quick-fix` | Targeted single-issue fix — minimal team, fastest path to a small, focused change. | 🚧 Phase C |
| `/sc-tests` | Generate integration tests per `protocols/TESTING.md` for the work currently in scope. | 🚧 Phase C |
| `/sc-docs` | Generate documentation per `protocols/WRITING.md` for the work currently in scope. | 🚧 Phase C |

## Helper scripts (not slash commands)

These are bash scripts in `scripts/` — they're run with `bash scripts/<name>.sh`, not via a slash command.

| Script | What it does |
|---|---|
| `scripts/sc-doctor.sh` | Verify the Shadow Clone install is healthy — checks every deployed path and required CLI, warns on stale files from prior installs. |
| `scripts/sc-last-verdict.sh` | Print the verdict line from the most recent `/sc-echo` review in `.sc/exchange/`. |

## Status legend

- ✅ **Available** — installed by `bridge/install.sh` and ready to use.
- 🚧 **Phase B / Phase C** — planned per `UNIFICATION_PLAN.md`, not yet built.

For the latest list of *currently installed* slash commands on this machine, look at
`~/.claude/commands/sc-*.md`. Anything in that directory is invokable as
`/<filename-without-.md>`.
