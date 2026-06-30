# Shadow Clone Unification Plan

**Status:** Decision made 2026-06-28. Not yet implemented.
**Owner:** Elijah (lead). Author: Claude (paired-review session in `ai-6`).
**Audience:** Whoever (human or agent) picks up the work in `shadow-clone` next.

---

## TL;DR

Three Ignis AI Labs repos collapse into **one product** named **Shadow Clone**.

- **`coding-standards`** — canonical universal source of truth. Stays. *Copied-and-adapted* into every consuming repo per its own `USAGE.md`. Not referenced, not symlinked — inlined.
- **`ai6`** — review/audit/security-scan infrastructure (bridges, libs, slash commands). **Migrates into `shadow-clone`**. After migration the GitHub repo gets a deprecation pointer.
- **`shadow-clone`** — the *home*. Receives ai6's infrastructure, adopts `coding-standards` as its law, restructures its 7 prompt-modes into slash commands, replaces its web-UI input flow with **AI-asks-questions inline in chat**.

The unified product surface is a **suite of slash commands** summonable in Claude Code / OpenCode. No web bounce for inputs. Shadow Clone becomes the high-level skill people invoke to handle anything — plan, feature, refactor, debug, optimize, research, audit, paired review, security scan.

---

## Why these three belong together

| Repo | Role in the combined system |
|---|---|
| **coding-standards** | The *law*. Universal standards (GNOSIS, KISS, SECURITY, FUNCTIONAL, PLANNING, WRITING, TESTING, BRANCHING, WORKFLOW, TODO, FUND_FLOW_PROOF) + the audit-grade SECURITY_CHECKLIST. Consumed by every project at init time. |
| **shadow-clone (new home)** | The *orchestrator + verifier* the user summons. Plans, builds, refactors, audits, reviews. Pulls the standards at init, asks the user adaptation questions, writes a project-local `CLAUDE.md`, then runs the right specialist macro **plus** a real second-model review at wave completion. |
| **ai6 (migrating in)** | The *verifier mechanism* — bash bridges, OpenCode plugin, security-scan orchestrator, exchange log. Becomes a subsystem of shadow-clone, accessed via shadow-clone's slash commands. |

What was previously "Shadow Clone orchestrates / ai6 verifies" becomes one product where the verifier is built in.

---

## Architectural model

### 1. Coding standards are *consumed*, not referenced

Per `coding-standards/USAGE.md`: **copy and adapt, never reference.** When shadow-clone initializes a project:

1. Read every file in `coding-standards/standards/`.
2. **Ask the user inline** (slash-command body, not a web form):
   - Solo project or team? (WORKFLOW.md / TODO.md applicability)
   - Primary language/framework? (drives idiom for FUNCTIONAL/TESTING)
   - Any conventions that should override the canonical? (capture as project-local overrides)
   - On-chain / value-moving? (FUND_FLOW_PROOF applicability)
   - What TODO domains? (NETWORK, AUTH, UI, etc.)
3. Generate a project-local `CLAUDE.md` (and `AGENTS.md`) that **inlines** the adapted standards. No link back to `coding-standards`.
4. Layer Shadow Clone's bidirectional-review protocol (ex-ai6 Rule 9) on top as a project-local addition.

### 2. Surface = slash commands. Inputs = conversational

Every shadow-clone capability is a slash command. Where the old Shadow Clone MCP tools expected pre-filled inputs (prompted by a web form), the new slash command's body literally instructs:

> *Before doing anything, ask the user these N questions, wait for the answers, then proceed.*

This is the "AI-asks-questions" UX. It works in any AI assistant that supports slash commands. No UI bounce. The coding-standards USAGE.md already prescribes exactly this pattern ("Ask the user questions when context is missing").

### 3. Suggested slash command set (`/sc-*` prefix — redirect if preferred)

| Command | What it does | Built from |
|---|---|---|
| `/sc-init` | Pulls coding-standards, asks adaptation questions, writes project-local `CLAUDE.md`/`AGENTS.md`, sets up `<who>/dev` branching | New (replaces ai6's `ai6-init.sh`) |
| `/sc-plan` | Plan mode — wave planning, master plan template | Existing shadow-clone plan mode |
| `/sc-feature` | Feature mode — team deployment, multi-wave execution | Existing shadow-clone feature mode |
| `/sc-debug` | Debug mode — investigation team, root-cause analysis | Existing shadow-clone debug mode |
| `/sc-refactor` | Refactor mode — safe restructure team | Existing shadow-clone refactor mode |
| `/sc-optimize` | Optimize mode — performance team | Existing shadow-clone optimize mode |
| `/sc-research` | Research mode — investigation team | Existing shadow-clone research mode |
| `/sc-review` | Paired review — second model reviews each work unit | ex-ai6 `/ai6` |
| `/sc-audit` | Audit mode (planning) → security checklist scan (execution) | shadow-clone audit mode **chained to** ex-ai6 `/ai6-security` |
| `/sc-quick-fix` | Targeted single-issue fix | Existing shadow-clone `quick_fix` |
| `/sc-tests` | Generate integration tests per TESTING.md | Existing shadow-clone `generate_tests` |
| `/sc-docs` | Create documentation per WRITING.md | Existing shadow-clone `create_documentation` |

The MCP server can stay as a non-Claude-Code surface (continues to expose the same capabilities as MCP tools for users in other clients). The web UI is **de-emphasized** — primary surface is slash commands.

---

## Branching protocol

The canonical **`coding-standards/standards/BRANCHING.md`** applies — it's stricter and more complete than what we built in ai6 Rule 2. Adopt it verbatim:

- Three branch classes only: `main` / `dev` / `<name>/dev`. **No** `feature/`, `bugfix/`, `hotfix/`, `release/`, or any other topic branch — ever.
- One `<name>/dev` per contributor (human or agent); kept forever; example: `eli/dev`, `claude/dev`.
- All work happens on your `<name>/dev`. Branch from `dev`, PR back to `dev`.
- **Contributors do not merge their own PRs.** Seniors / leads merge.
- **Never `git push` without explicit permission.** Local commits are safe; pushes are coordinated.
- **Verify before push**: type-check (`tsc --noEmit`) AND framework/production build. Both must pass.
- **No manual production deploys.** Production = merge to `main` through platform Git integration only.
- No `--no-verify`, no `--no-gpg-sign`, no skipping pre-commit hooks unless explicitly asked.
- Archive before deleting: tag as `archive/<branch-name>` first.

### Behavioral changes this implies for AI agents

What I (Claude) was doing in `ai6` was looser than this. Going forward in `shadow-clone`:
- Open PRs, **wait for the human lead** to merge — do not self-merge unless explicitly told to for a specific PR.
- Don't push without explicit instruction. Commits accumulate locally; the human triggers the push.
- Run both type-check and build before any push the human asks for; report results.

---

## File mapping (ai6 → shadow-clone)

| Source (ai6) | Destination (shadow-clone) | Notes |
|---|---|---|
| `bin/ask-glm.sh` | `bin/ask-glm.sh` | Bridge, as-is |
| `bin/ask-claude.sh` | `bin/ask-claude.sh` | Bridge, as-is |
| `bin/ai6-init.sh` | `bin/sc-init.sh` | Rewritten to pull coding-standards + ask questions |
| `bin/ai6-security-scan.sh` | `bin/sc-security-scan.sh` | Rename only |
| `bin/lib/build-request.sh` | `bin/lib/build-request.sh` | As-is |
| `bin/lib/run-review.sh` | `bin/lib/run-review.sh` | As-is |
| `bin/lib/chunk-review.sh` | `bin/lib/chunk-review.sh` | As-is |
| `bin/lib/security-scan.sh` | `bin/lib/security-scan.sh` | As-is |
| `security/SECURITY_CHECKLIST.md` | **Pulled from `coding-standards`** at init time | ai6's copy is 2 commits behind; canonical lives in coding-standards |
| `claude/commands/ai6.md` | `claude/commands/sc-review.md` | Reworked surface text |
| `claude/commands/ai6-security.md` | `claude/commands/sc-audit.md` | Reworked, optionally chained with shadow-clone audit mode |
| `opencode/agent/ai6-reviewer.md` | `opencode/agent/sc-reviewer.md` | Rename |
| `opencode/agent/ai6-security-reviewer.md` | `opencode/agent/sc-security-reviewer.md` | Rename |
| `opencode/command/ai6.md` | `opencode/command/sc-review.md` | Rename |
| `opencode/command/ai6-security.md` | `opencode/command/sc-audit.md` | Rename |
| `opencode/plugin/ai6.js` | `opencode/plugin/sc.js` | Tool name → `sc_review` |
| `install.sh` | `install.sh` (unified — installs everything: bridges, slash commands, MCP server build) | Combines ai6 install + shadow-clone npm/MCP setup |
| `AGENTS.md` (ai6's Rules 1-8) | **Discarded.** Replaced by coding-standards copy-and-adapt | ai6 Rule 9 (review protocol) preserved as a project-local addition |
| `docs/audit/ISSUE_TRACKER.md` | `docs/audit/ISSUE_TRACKER.md` | Format from coding-standards' implied audit pattern |

Whatever exists in shadow-clone today (`.shadow/`, `mcp-server/`, `web/`, `protocols/`) **is preserved**. The migration is additive — ai6's pieces land in `bin/`, `claude/commands/`, `opencode/` (none of which currently exist at the top of shadow-clone, so no collision).

---

## Phased plan

| Phase | Scope | Owner | Notes |
|---|---|---|---|
| **A** — Migrate ai6 infra | Copy bridges/libs/slash commands into shadow-clone with renames per the file mapping; unified `install.sh`; do **not** touch shadow-clone's existing protocol files yet | Agent on `eli/dev` in shadow-clone | Pre-req: clean `eli/dev` WIP (below) |
| **B** — Adopt coding-standards as law | Replace shadow-clone's `CLAUDE.md`/`CONSTITUTION.md` with a copy-and-adapt of every file in `coding-standards/standards/`, asking the user the USAGE.md adaptation questions. Layer the review protocol on top. | Agent | Run `/sc-init` against shadow-clone itself once it exists |
| **C** — Convert modes to slash commands | Each `.shadow/mode_configs/*` becomes a `claude/commands/sc-<mode>.md` + matching OpenCode command. Mode prompts stay as the body; the body adds the AI-asks-questions preamble for missing inputs. | Agent | One commit per command for reviewability |
| **D** — Wire ai6 review into modes | At every mode's wave-completion checkpoint, dispatch `/sc-review`; the audit mode chains into `/sc-audit` (the actual scan) instead of just returning audit-plan prompts. | Agent | Tests the whole loop |
| **E** — Deprecate ai6 repo | Archive `Ignis-AI-Labs/ai6`'s slash commands; replace its README with a "moved to shadow-clone" pointer; tag `archive/pre-shadow-clone-migration`. | Lead | After A-D land on shadow-clone `main` |

Each phase is its own PR (`eli/dev` → `dev` via PR, `dev` → `main` via PR, both merged by the lead). Each phase should pass `/sc-review` (or fall back to `~/.ai6/ask-glm.sh` until the migration is done) before merge.

---

## Pre-Phase-A decisions (resolved 2026-06-28)

1. **Dirty `eli/dev` tree** — committed as a single "pre-unification WIP" snapshot on `eli/dev`. Phase A starts on top of that commit.
2. **`mihir/*` topic branches** — solo development for now; archive-tag every `mihir/*` as `archive/mihir-<topic>` (preserves history), cherry-pick anything still useful into `eli/dev`, then delete the origin branches. Salvage candidate: the generic-security commit `e33f402` ("open url safely, check for symlinks, typed creator config, clamp cache time"); the rest is obsolete (auth: removed by open-source pivot; schema validation: already on `eli/dev` as `726264c`; logger stderr fix: already on `eli/dev` as `2778040`; Axiom telemetry: deliberately not ported, hardcoded credential).
3. **Slash command prefix** — `/sc-*` (e.g. `/sc-plan`, `/sc-review`, `/sc-audit`).
4. **Web UI fate** — kept and de-emphasized. No removal in this unification; revisit after the slash-command surface proves out.
5. **MCP server distribution** — kept and de-emphasized. Serves non-Claude-Code / non-OpenCode AI clients via npm; same capabilities exposed as slash commands for Claude Code / OpenCode users.
6. **`AGENTS.md` vs `CLAUDE.md`** — write both at `/sc-init` time. `CLAUDE.md` is the canonical project law; `AGENTS.md` mirrors it for OpenCode.

---

## Out of scope for this unification

- **Modifying coding-standards.** It is canonical and we adopt it as-is.
- **Building a new orchestration framework.** Shadow Clone's existing waves / mode model stays.
- **Reverse direction (shadow-clone into ai6).** ai6 is the smaller surface and gets absorbed.
- **Multi-tenant / cloud-hosted features.** CLI / slash-command first; the existing optional web/MCP surfaces are kept but de-emphasized.

---

## Where this document lives

Created at `ai-6/docs/UNIFICATION_PLAN.md` (this file). When the migration starts, this should be the first thing committed into `shadow-clone/docs/UNIFICATION_PLAN.md` so the receiving session has the full spec.
