# Shadow Clone

> **Free, open-source AI orchestration delivered as Claude Code slash commands.**

Shadow Clone teaches your AI assistant how to run like a coordinated expert
team — planning at three altitudes (sprint / plan / roadmap), executing in
focused modes (feature, refactor, debug, optimize, research, audit), and
keeping itself honest with a built-in paired-review loop driven by a second
model.

Everything ships as `/sc-*` slash commands. No accounts. No API keys. No
cloud round-trip. Install once and it lives at `~/.claude/commands/`.

---

## Install

```bash
git clone https://github.com/Ignis-AI-Labs/shadow-clone.git
cd shadow-clone
bash bridge/install.sh
bash scripts/sc-doctor.sh        # verify the install is healthy
```

`install.sh` deploys:

| What | Where |
|---|---|
| 13 slash commands (`sc*.md`) | `~/.claude/commands/` |
| Bridge scripts + helpers     | `~/.claude/sc/` |
| 14 canonical protocols       | `~/.claude/sc/protocols/` |
| Paired-review reviewer agent | `~/.config/opencode/agent/sc-echo-reviewer.md` |
| Bridge config (first run)    | `~/.config/sc/config` (from `config.example`) |

Existing user config is never overwritten — re-run `install.sh` whenever you
edit anything in this repo.

### Optional — install OpenCode for paired review

The paired-review loop (`/sc-echo`) uses a second AI model to audit each
finished work unit. By default that's **GLM 5.2 via [OpenCode](https://opencode.ai/)**,
running read-only. The bridge invokes it for you, but you need OpenCode
on your PATH:

```bash
curl -fsSL https://opencode.ai/install | bash
```

Without OpenCode, every other `/sc-*` command still works — only `/sc-echo`
is gated on the reviewer.

---

## Quick start

Inside Claude Code, run the umbrella command from any project root:

```
/sc
```

It walks you through Type / Stack / Team / Stakes, derives the right protocol
shortlist, and writes (with user-gated overwrites) `AGENTS.md`, `CLAUDE.md`,
the `docs/audit/ISSUE_TRACKER.md` scaffold, and the `.waves/` directory.
Then you're ready to use any other `/sc-*` mode.

```
/sc-help        # catalog of every Shadow Clone command
```

---

## The command surface

13 commands. Run `/sc-help` for the full live catalog with statuses.

### System

| Command | What it does |
|---|---|
| `/sc` | Walk through project init — detects existing setup, asks Type / Stack / Team / Stakes, writes `AGENTS.md` / `CLAUDE.md` / `docs/audit/ISSUE_TRACKER.md` / `.waves/` scaffold. Surfaces a branching migration plan if non-conforming branches exist. |
| `/sc-help` | Show the catalog of all `/sc-*` commands. |
| `/sc-echo` | Enter paired-review mode — every completed work unit is judged by a second model against `AGENTS.md`; up to 3 rounds per unit; verdicts are `APPROVE` / `REVISE` / `BLOCK` / `ERROR`. |

### Planning (three altitudes)

| Command | What it does |
|---|---|
| `/sc-sprint` | **One milestone**, decomposed into a PR-sized task DAG with prerequisites, parallel-with, and load-bearing flags. Produces `SPRINT_PLAN.md` with a pipeline diagram. |
| `/sc-plan` | **Project plan** — a multi-phase DAG that gets a fresh project from zero to its end-state. Produces `MASTER_PLAN.md`. |
| `/sc-roadmap` | **Multi-milestone pipeline** — workstreams and decision gates across an initiative. Produces `ROADMAP.md`. |

> All three are **DAG-based, not timeline-based**. Work gets done when it gets
> done; the pipeline is shaped by prerequisites, parallel branches, and
> load-bearing nodes — not by week numbers.

### Execution modes

| Command | What it does |
|---|---|
| `/sc-feature` | Multi-wave implementation team for a focused capability. |
| `/sc-refactor` | Safe restructure team with behavior-preserving discipline. |
| `/sc-debug` | Investigation team — hypothesis-then-test root-cause analysis. |
| `/sc-optimize` | Performance team — measure-first, micro-vs-macro tradeoff awareness. |
| `/sc-research` | Open-ended investigation team for tech selection or spike work. |
| `/sc-audit` | Audit-planning team that produces an audit blueprint, then chains into the security checklist scan. |
| `/sc-test-audit` | Read-only diagnostic — maps source surface against existing tests, flags missing integration tests, surfaces security-sensitive paths without coverage. |

Every mode runs in **three waves** (research → plan → deliver), each producing
one deliverable to `.waves/wave-N/deliverables/`.

---

## The paired-review loop (`/sc-echo`)

`/sc-echo` is Shadow Clone's quality gate. Once turned on, every coherent work
unit you finish is automatically dispatched to a second AI model for review
**before** you tell the user it's done. The Reviewer reads the diff, the full
text of each changed file, and your project's `AGENTS.md`, then returns a
verdict line:

```
VERDICT: APPROVE | REVISE | BLOCK | ERROR
```

- **APPROVE** — done; report and move on.
- **REVISE** / **BLOCK** — fix every finding, re-dispatch. Counts as one round.
- **ERROR** — the bridge could not complete; surface to user, don't loop.

Up to **3 rounds** per work unit. After 3 without `APPROVE`, open findings are
logged to `docs/audit/ISSUE_TRACKER.md` (the live Rule-7 tracker) and reported
to the user — no silent shipping.

---

## Protocols (engineering standards)

14 canonical protocols live in `protocols/` and deploy to `~/.claude/sc/protocols/`.
Every mode references them by absolute path. The shortlist:

**Core** (every mode):

- `Functional Programming & Purity Protocol.md`
- `Comprehensive Code Quality and Consistency Protocol.md`
- `SECURITY_CHECKLIST.md`
- `Error Handling & Resilience Protocol.md`
- `AI-Assisted Development Protocol.md`

**Operational** (how Shadow Clone runs):

- `Multi Agent Protocol.md` — orchestrator-worker theory and concurrency caps
- `Shadow Clone Wave & Subagent Coordination Protocol.md` — wave lifecycle,
  role-to-clone mapping, team-size capping, mandatory clone-prompt contents,
  Record Keeper contract, failure modes, audit logging. Hard cap **5
  concurrent specialists per wave**.

**Additional** (referenced by relevant modes):

- `Architecture & System Design Protocol.md`
- `Code Efficiency & Performance Protocol.md`
- `Testing & Quality Assurance Protocol.md`
- `Documentation Standards for Software Teams.md`
- `Audit Protocol.md`
- `Dependency & Supply Chain Management Protocol.md`
- `DevOps & Deployment Protocol.md`

---

## Repository layout

```
shadow-clone/
├── claude/commands/sc*.md      → deploys to ~/.claude/commands/
├── protocols/                  → deploys to ~/.claude/sc/protocols/
├── bridge/
│   ├── install.sh              → the deploy entry point
│   ├── ask-glm.sh              → Claude → second-model review bridge
│   ├── ask-claude.sh           → second-model → Claude review bridge
│   ├── sc-init.sh              → per-project AGENTS.md / CLAUDE.md scaffold
│   ├── lib/                    → bridge internals (guards, reapers, chunking)
│   ├── templates/              → AGENTS.md / CLAUDE.md / ISSUE_TRACKER.md seeds
│   └── agent/sc-echo-reviewer.md → OpenCode reviewer persona
├── opencode-plugin/sc-echo.js  → OpenCode plugin counterpart (registers sc_echo_review tool)
├── scripts/
│   ├── sc-doctor.sh            → source-driven health check
│   └── sc-last-verdict.sh      → print latest /sc-echo verdict
├── mcp-server/                 → legacy MCP server (still functional; secondary delivery channel)
├── web/                        → marketing/onboarding site
└── docs/
    ├── audit/                  → live Rule-7 ISSUE_TRACKER.md
    └── .archive/               → historical MCP-era docs (reference only)
```

---

## Secondary delivery channel — MCP server

The original Shadow Clone shipped as an MCP server. That implementation still
exists at `mcp-server/` and remains a valid way to use the same prompt content
inside any MCP-compatible client (Claude Desktop, VS Code, etc.). The
slash-command path above is the primary, recommended surface; the MCP server
is kept as a secondary option for users with MCP-only environments.

```bash
cd mcp-server
npm install
npm run build
```

See `mcp-server/README.md` for MCP-specific configuration.

---

## Branching

```
main           ← Production (default branch)
dev            ← Integration (all PRs target here)
{author}/dev   ← Your working branch (commit here, PR into dev)
```

See `CONTRIBUTING.md` for full conventions.

---

## Contributing

We welcome contributions — new modes, additional protocols, improved review
heuristics, bug fixes, docs.

- Branch and commit conventions: `CONTRIBUTING.md`
- Task tracking: `TASKS.md` + the domain files it links to
- Every PR runs through `/sc-echo` against `AGENTS.md` before merge

## License

MIT — see `LICENSE`.

---

Built by [Ignis AI Labs](https://ignislabs.ai). Made for AI developers who
want their assistants to act like the team they wish they had.
