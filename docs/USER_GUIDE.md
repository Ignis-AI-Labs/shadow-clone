# Shadow Clone — User Guide

If you've installed Shadow Clone and are wondering *"what do I actually
do with this?"* — start here. This guide walks you from your first
project to advanced workflows so the system becomes second nature.

For just installing it, see the [**README**](../README.md). For the live
command catalog, run `/sc-help` inside Claude Code.

---

## Table of contents

1. [What Shadow Clone is, in one screen](#1-what-shadow-clone-is-in-one-screen)
2. [Your first 15 minutes](#2-your-first-15-minutes)
3. [Workflow recipes (common journeys)](#3-workflow-recipes-common-journeys)
4. [How the system works (the why)](#4-how-the-system-works-the-why)
5. [Power tips](#5-power-tips)
6. [Where to go from here](#6-where-to-go-from-here)

---

## 1 — What Shadow Clone is, in one screen

Shadow Clone turns Claude Code into a **coordinated team of specialists**
that plan, build, review, and self-audit. Everything ships as `/sc-*`
slash commands. No accounts, no API keys, no cloud round-trip — the
commands live at `~/.claude/commands/` after install.

You get three altitudes of planning, six execution modes, and a
paired-review loop where a *second AI model* checks every completed
work unit against your project's rules:

| Group | Commands | When to reach for it |
|---|---|---|
| **Activation** | `/sc`, `/sc-help`, `/sc-bootstrap` | Set up a project. List the catalog. Verify install. |
| **Planning** | `/sc-sprint`, `/sc-plan`, `/sc-roadmap` | One milestone / whole project / multi-milestone pipeline |
| **Execution** | `/sc-feature`, `/sc-refactor`, `/sc-debug`, `/sc-optimize`, `/sc-research`, `/sc-audit`, `/sc-test-audit` | Build, restructure, investigate, profile, research, audit, audit-tests |
| **Rapid** | `/sc-quick-fix`, `/sc-tests`, `/sc-docs` | Small focused change / generate tests / generate docs — single-pass, no multi-wave overhead |
| **Quality gate** | `/sc-echo` | Turn on paired review — a second model judges every work unit |
| **Lifecycle** | `/sc-update` | Check for and apply Shadow Clone updates |

Every mode produces concrete deliverables (markdown files) to
`.waves/wave-N/deliverables/` in your project. You don't have to take
notes — Shadow Clone takes them for you.

**The core idea**: instead of asking your AI "do this thing," you give
it a *methodology* to follow. The slash command is the methodology;
your AI runs it. Deliverables get reviewed by a peer model before
they're declared done.

---

## 2 — Your first 15 minutes

### Step 1 — Activate Shadow Clone in your project

Open your project folder in Claude Code, then type:

```
/sc
```

`/sc` asks you 3–5 questions (project type, stack, team size, stakes),
picks the relevant protocols for your situation, and writes:

- `AGENTS.md` — your project's law (Reviewer judges against this)
- `CLAUDE.md` — context pointer for any AI assistant
- `docs/audit/ISSUE_TRACKER.md` — live issue log
- `.waves/` — where mode deliverables land

It also surfaces a branching migration plan if your current branches
don't match the conventions (you can ignore or adopt).

### Step 2 — Pick a task and choose the right mode

Match what you want to do to the right command:

| You want to… | Command | What you'll get |
|---|---|---|
| Build a new feature | `/sc-feature` | Three-wave implementation (research → plan → deliver) |
| Investigate a bug | `/sc-debug` | Hypothesis-then-test root-cause analysis |
| Plan a project from scratch | `/sc-plan` | A full MASTER_PLAN.md as a DAG of phases |
| Plan one sprint inside an active codebase | `/sc-sprint` | A SPRINT_PLAN.md with a task DAG and pipeline diagram |
| Sequence multiple milestones | `/sc-roadmap` | A ROADMAP.md with workstreams and decision gates |
| Restructure code without breaking behavior | `/sc-refactor` | Safe restructure plan + execution |
| Profile and fix a performance issue | `/sc-optimize` | Measure-first methodology with before/after |
| Investigate something open-ended | `/sc-research` | Cited findings + actionable recommendations |
| Audit a codebase for security/quality | `/sc-audit` | Audit blueprint, then security-checklist scan |
| Find test coverage gaps | `/sc-test-audit` | Coverage diagnostic (read-only, no test generation) |

Type the command in Claude Code and answer the preamble questions when
asked. Most modes ask 3–5 context questions before they begin.

### Step 3 — Turn on paired review

Once you have a feel for the basic flow, turn on `/sc-echo`:

```
/sc-echo
```

Now every coherent work unit (a finished feature, a bug fix, a focused
refactor) gets dispatched to a second AI model — by default GLM 5.2 via
OpenCode — for an independent review against your `AGENTS.md`. You see
a verdict line:

```
VERDICT: APPROVE | REVISE | BLOCK | ERROR
```

If REVISE or BLOCK, the Builder addresses every finding and re-dispatches.
Three rounds maximum. After three without APPROVE, residuals are logged
to `docs/audit/ISSUE_TRACKER.md` and surfaced to you — no silent ship.

This is Shadow Clone's quality gate. It catches things solo AI loops
don't.

### Step 4 — Let it run

Modes run autonomously through their three waves. You'll see progress
narration but you don't have to babysit each step. Most modes complete
in a few minutes of model time.

### Step 5 — Review the deliverable

Open `.waves/wave-2/deliverables/` (or `wave-N` for whichever wave was
last). You'll find a markdown file — MASTER_PLAN.md, SPRINT_PLAN.md,
FEATURE_REPORT.md, etc. — that captures what was decided, what was
built, and what's outstanding. The deliverable is your hand-off; you
can paste it into Linear/Jira, share it with the team, or feed it into
the next mode.

---

## 3 — Workflow recipes (common journeys)

### Greenfield: idea → first sprint

```
/sc                  # scaffold AGENTS.md + the protocols list
/sc-plan             # turn your idea into a MASTER_PLAN.md
/sc-roadmap          # sequence the milestones (optional, for bigger projects)
/sc-sprint           # decompose the next milestone into PR-sized tasks
/sc-echo             # turn on paired review for the execution work
/sc-feature          # start building, one task at a time
```

You'll end with a DAG of work, a sprint plan, and live paired review
for every commit.

### Adding a feature to an existing codebase

```
/sc-feature          # multi-wave implementation team
```

If the feature touches an area you don't know well, prepend
`/sc-research` first to gather context before planning.

### Debugging a tricky bug

```
/sc-debug
```

The mode does hypothesis-then-test root-cause analysis — it doesn't
just patch the symptom. Useful when the bug has resisted obvious fixes.

### Refactoring without breaking things

```
/sc-refactor
```

The prime directive is behavior preservation. The mode produces a
restructure plan + execution that preserves the test suite's pass/fail
profile.

### Performance investigation

```
/sc-optimize
```

Measure-first methodology — establishes a baseline, identifies the
bottleneck, applies a targeted fix, re-measures. Won't fall into
micro-optimization rabbit holes.

### Security audit

```
/sc-audit
```

Produces an audit blueprint scoped to your project, then chains into
the security checklist scan. Findings get logged to
`docs/audit/ISSUE_TRACKER.md` with severity + suggested fix. Per the
**Gnosis Verification Protocol**, only verified findings count toward
verdicts; speculation goes to a separate Research Questions section.

### Open-ended research / tech selection

```
/sc-research
```

For "should we use X or Y," "what's the state of the art in Z," "how do
people solve this." Returns cited evidence + recommendations.

### Coverage diagnosis (don't write tests yet — just find the holes)

```
/sc-test-audit
```

Read-only. Maps your source surface against existing tests, flags
missing integration tests, surfaces security-sensitive paths without
coverage. Doesn't generate tests for you; tells you where to focus.

---

## 4 — How the system works (the why)

### Waves

Every mode runs in **three waves**: research → plan → deliver. Each
wave produces one deliverable to `.waves/wave-N/deliverables/`. The
sequencing means later waves can cite earlier ones, and you always
have an audit trail of what was decided when.

### Specialists and the Record Keeper

Inside each wave, the lead clone spawns up to 5 specialist clones in
parallel — UX expert, security architect, performance engineer, etc.
Each one writes their analysis. Then a **Record Keeper** runs (always
after the specialists complete) and synthesizes their work into the
wave's deliverable. The 5-concurrent cap reflects the empirical finding
that coordination saturates around 4 direct reports per orchestrator;
beyond that you get noise.

### Protocols

The 15 canonical protocols at `~/.claude/sc/protocols/` are the
engineering standards every mode adheres to. They're not advice — they're
load-bearing. The Reviewer judges against them. Key ones:

- **Functional Programming & Purity Protocol** — pure functions, immutability, composition
- **Comprehensive Code Quality and Consistency Protocol** — naming, structure, no dead code, no monoliths
- **SECURITY_CHECKLIST** — comprehensive security audit checklist
- **Error Handling & Resilience Protocol** — explicit errors, no silent failures
- **AI-Assisted Development Protocol** — verification rigor on AI-generated work
- **Gnosis Verification Protocol** — a bug not verified is not a bug; it's a question (the discipline that makes the audit loop trustworthy)

You can adapt the protocols to your stack — they live in your repo as
markdown files, edit them like any other doc.

### Paired-review (the `/sc-echo` loop)

When `/sc-echo` is on, every work unit goes to a second model with the
git diff, the changed files, and your `AGENTS.md`. The Reviewer returns
findings + a verdict. The Builder addresses every genuine finding and
re-dispatches. Up to three rounds.

This is the part that makes Shadow Clone different from a single AI
assistant. A single model has a blind spot; a peer model can see it.

### The Gnosis verification gate

Inside `/sc-echo` and `/sc-audit`, a finding must be **verified** —
backed by a reproduction, a failing test, or a closed mechanical
observation — before it can be reported as a defect. Speculation goes
to a separate Research Questions section that doesn't affect verdicts.
This is why your time isn't wasted chasing phantom bugs.

---

## 5 — Power tips

### Mix modes for compound effect

The most effective Shadow Clone users chain modes:

```
/sc-research  → understand the problem space
/sc-plan      → turn understanding into a DAG of phases
/sc-sprint    → take the next phase, decompose into tasks
/sc-feature   → execute task #1 with the planning context already loaded
/sc-echo      → catch issues before they ship
/sc-test-audit → find the coverage gaps for the next iteration
```

### Customize your AGENTS.md

The Reviewer judges against `AGENTS.md`. Whatever rules you put there
become the standard. Tighten them as your project matures — strict
size limits, mandatory test types, accessibility requirements, anything
material. The stronger the rules, the sharper the review.

### Adapt the protocols

`~/.claude/sc/protocols/*.md` are markdown files. Edit them. If your
stack has different conventions (Python rather than TS, Rust rather
than Bash), the protocols' principles still apply — adapt the examples
to your language. Re-run `bash bridge/install.sh` to redeploy.

### Understand the 3-round echo cap

`/sc-echo` runs up to 3 rounds per work unit. After 3 without APPROVE,
open findings get logged to `docs/audit/ISSUE_TRACKER.md` (Rule 7) and
surfaced to you. The cap exists to prevent infinite loops over
disagreements between Builder and Reviewer. If you keep hitting the
cap, your `AGENTS.md` is probably ambiguous — tighten it.

### Solo vs. team-size

When you set up a project via `/sc`, you pick a team size: Solo, 2–3,
4–7, or 8+. Solo means the lead clone plays every role sequentially
itself (no parallel spawns). 4–7 caps at 4 concurrent specialists +
Record Keeper after. Pick honestly — Solo is faster for small tasks;
larger team sizes are richer for complex multi-domain work.

---

## 6 — Where to go from here

| Resource | What it has |
|---|---|
| **`/sc-help`** (run it in Claude Code) | Live catalog of all commands with status |
| **[README](../README.md)** | Install guide + system overview + repo layout |
| **[commands/sc-*.md](../commands/)** | Source of truth for every command — read these to see exactly what each mode does |
| **[protocols/*.md](../protocols/)** | The 15 engineering standards every mode cites |
| **[Gnosis Verification Protocol](../protocols/Gnosis%20Verification%20Protocol.md)** | The verification discipline that makes the review loop trustworthy |
| **[CONTRIBUTING.md](../CONTRIBUTING.md)** | How to add your own modes, contribute protocols, or improve existing commands |
| **[docs/audit/POSITIVE_FINDINGS.md](audit/POSITIVE_FINDINGS.md)** | Verified-correct design properties — read these to understand what's load-bearing |

The protocols and command sources are the deepest documentation. They
were written for AI agents to follow — which makes them precise and
unambiguous, ideal for humans who want to understand exactly how each
mode behaves.

---

## Questions, bugs, ideas?

- Issues: <https://github.com/Ignis-AI-Labs/shadow-clone/issues>
- Discussions: <https://github.com/Ignis-AI-Labs/shadow-clone/discussions>
- Contributing: see [CONTRIBUTING.md](../CONTRIBUTING.md)

Shadow Clone is free, MIT-licensed, and built openly. We're not selling
anything. The system gets better when people use it and tell us what
broke or what was missing.
