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

Pick the path that matches you. The first one assumes you've never opened
a terminal; the second is for users who already have Claude Code open and
just want to type a couple of slash commands.

> **Quickest path for power users:**
> ```bash
> git clone --depth 1 --branch v0.2.5 https://github.com/Ignis-AI-Labs/shadow-clone.git
> cd shadow-clone && bash bridge/install.sh && bash scripts/sc-doctor.sh
> ```
> Then in Claude Code, run `/sc`. Skip the rest of this section.

---

### Path A — Step-by-step guide (assumes no prior terminal experience)

You will switch between two windows during this install: a **terminal**
(black-background text window) and **Claude Code** (the AI assistant). I'll
say which window every block of text goes into.

#### Step 1 — Install Claude Code (if you don't have it)

Download it from **[claude.com/code](https://claude.com/code)** and follow
the installer for your operating system. When you're done, you should be
able to open Claude Code as an app.

#### Step 2 — Install Git (if you don't have it)

Open the link for your OS, download the installer, and accept the defaults:

- **Mac:** [git-scm.com/download/mac](https://git-scm.com/download/mac) — easiest is `brew install git` if you have Homebrew, otherwise the installer.
- **Windows:** [git-scm.com/download/win](https://git-scm.com/download/win) — this also installs **Git Bash**, which is the terminal you'll use on Windows.
- **Linux:** Use your package manager — `sudo apt install git` (Ubuntu/Debian), `sudo dnf install git` (Fedora), or `sudo pacman -S git` (Arch).

#### Step 3 — Open your terminal

This is the black-background window where you type commands.

- **Mac:** Press `Cmd+Space` to open Spotlight, type **`Terminal`**, press Enter.
- **Windows:** Open the Start menu, type **`Git Bash`**, click it. *Use Git Bash, not PowerShell or Command Prompt.*
- **Linux:** Look for an app called **Terminal**, **Konsole**, or **GNOME Terminal** in your applications menu.

You'll see a window with a prompt that ends in `$` or `>`. That's where
the commands go.

#### Step 4 — Paste this exact block **into the terminal** and press Enter

Click into the terminal window first so it's focused. Then copy this
whole block (all four lines) and paste it. On Mac use `Cmd+V`; on
Windows Git Bash use `Shift+Insert` or right-click → Paste; on Linux use
`Ctrl+Shift+V`.

```bash
git clone --depth 1 --branch v0.2.5 https://github.com/Ignis-AI-Labs/shadow-clone.git
cd shadow-clone
bash bridge/install.sh
bash scripts/sc-doctor.sh
```

You'll see a lot of text scroll by. The install is done when you see:

```
sc-doctor: all checks passed.
```

If you see `sc-doctor: N check(s) failed.` instead, scroll up to find
the FAIL line and jump to **Troubleshooting** below.

#### Step 5 — Open Claude Code and open any folder

Open the Claude Code app. From its file menu, **open a folder** — any
folder is fine, even an empty one. You need a folder open before slash
commands work.

#### Step 6 — Type this **into Claude Code's chat input** (NOT the terminal)

Switch to Claude Code's window. In the chat box at the bottom, type:

```
/sc-help
```

and press Enter. You should see a list of all 14 Shadow Clone commands
with `✅ Available` next to each. That confirms everything is wired up.

If you see `Unknown command: /sc-help`, restart Claude Code (close it
fully, open it again, reopen the folder), then try `/sc-help` once more.

#### Step 7 — Try `/sc` to set up a real project

Open the folder you actually want to work in (one with your code), and
in Claude Code's chat type:

```
/sc
```

It will ask you 3–5 questions about your project (what kind, what
stack, team size, stakes). Pick the answer that fits — or type your own
if none of the multiple-choice options match. When it's done, your
project has `AGENTS.md`, `CLAUDE.md`, a `docs/audit/ISSUE_TRACKER.md`
scaffold, and a `.waves/` directory. You're ready.

#### Step 8 (optional) — Install OpenCode for `/sc-echo` paired review

`/sc-echo` sends each completed unit of work to a second AI model for an
independent review. It requires **OpenCode**, a separate free CLI.

**Paste this into the terminal** (not Claude Code):

```bash
curl -fsSL https://opencode.ai/install | bash
opencode auth login
```

Follow the login prompts. After this, `/sc-echo` works inside Claude
Code. Skip this step if you don't want paired-review — every other
`/sc-*` command works without it.

---

### Path B — From inside Claude Code (no terminal, partial features)

If you already have Claude Code open and don't want to use a terminal,
you can install just the slash commands directly. **This does not give
you `/sc-echo` paired review** — that needs the full install above.

In Claude Code's chat box, type each line below and press Enter:

```
/plugin marketplace add Ignis-AI-Labs/shadow-clone
/plugin install shadow-clone@ignis-labs
/sc-bootstrap
```

`/sc-bootstrap` will tell you exactly which pieces are installed and
which are missing. If it says "plugin-only install" and you want the
full feature set, follow **Path A** above — the two paths are
complementary; they don't conflict.

---

### Troubleshooting

**`Marketplace "ignis-labs" not found`**
You ran `/plugin install` before `/plugin marketplace add`. Run the
`add` command first, then the `install` command.

**`Failed to clone repository: ... Permission denied (publickey)`**
This was a v0.2.4 bug — `/plugin install` was using SSH instead of HTTPS.
v0.2.5 fixes it. If you still see this on v0.2.5, remove and re-add the
marketplace so Claude Code refreshes the cached manifest:
```
/plugin marketplace remove ignis-labs
/plugin marketplace add Ignis-AI-Labs/shadow-clone
/plugin install shadow-clone@ignis-labs
```

**`bash: command not found` or `git: command not found`** (in the terminal)
You skipped Step 2 (Git install). Go back and install Git for your OS.

**`Unknown command: /sc-help`** (in Claude Code)
Claude Code didn't pick up the slash commands. Restart Claude Code fully
(quit and reopen), open a folder, then try again. If it still doesn't
work, run `bash scripts/sc-doctor.sh` from the terminal inside the
`shadow-clone` folder — it'll print which file is missing.

**`sc-doctor: N check(s) failed.`** (after the install)
Scroll up in the terminal to find the FAIL line. Most common cause is
running `bridge/install.sh` from somewhere other than the `shadow-clone`
folder. Do `cd shadow-clone` first, then re-run.

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

### Data egress and privacy (paired-review)

When `/sc-echo` is active, every review sends a payload to whichever model
provider the reviewer is configured for. That payload contains:

- The **full text** of every file you list in the dispatch (`<paths>` arg)
- The **`git diff HEAD`** of those files (uncommitted changes)
- Your **project's `AGENTS.md`** (as the "law" the reviewer judges against)
- The **`<context>`** string you wrote describing the work

Where that payload lands:

- **On disk** in `<project>/.sc/exchange/<timestamp>-request.md` (request) and
  `<timestamp>-response.md` (reviewer reply). Both are full transcripts.
- **In transit** to the provider running `SC_REVIEWER_MODEL` — by default
  `zai-coding-plan/glm-5.2` via OpenCode (Z.AI), or Anthropic when you use
  the Claude-as-reviewer path.

Two practical consequences:

1. **`.sc/` should be in your repo's `.gitignore`.** The bridge emits a one-time
   warning if it isn't. Set `SC_QUIET_GITIGNORE=1` to silence the warning if
   you've decided otherwise. The bundled `AGENTS.md` template ignores it for
   you when you scaffold via `/sc`.
2. **Files containing secrets shouldn't be reviewed.** A `.env` or a key file
   sent through `/sc-echo` ends up in the request log and at the provider.
   The file-containment filter blocks paths outside your project root, but
   it does NOT redact secret-pattern strings — that's on you.

Shadow Clone itself makes **no** outbound network calls in the bridge layer.
The egress described above is via the reviewer CLIs (`opencode` / `claude`)
that you installed separately; both are independent products. The MCP server
makes exactly one outbound call (`npm view`) when you invoke
`check_for_updates`, and never otherwise.

---

## Protocols (engineering standards)

15 canonical protocols live in `protocols/` and deploy to `~/.claude/sc/protocols/`.
Every mode references them by absolute path. The shortlist:

**Core** (every mode):

- `Functional Programming & Purity Protocol.md`
- `Comprehensive Code Quality and Consistency Protocol.md`
- `SECURITY_CHECKLIST.md`
- `Error Handling & Resilience Protocol.md`
- `AI-Assisted Development Protocol.md`
- `Gnosis Verification Protocol.md` — **load-bearing.** A bug that has not been verified is not a bug — it is a question. Every mode that produces findings (audit, code review, paired-review) must back each finding with a reproduction, a failing test, or a closed mechanical observation. Speculation goes in a `Research Questions` section that does NOT affect verdicts. Overrides any prior "flag-then-fix" guidance.

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
├── commands/sc*.md      → deploys to ~/.claude/commands/
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
