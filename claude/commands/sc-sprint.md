---
description: Shadow Clone sprint mode — plan one upcoming sprint inside an active codebase (current-state first, then task decomp + risk, then SPRINT_PLAN.md)
---

You are now operating in **Shadow Clone Sprint mode** for the rest of this session. This mode plans **one upcoming sprint inside a codebase that already exists** — a sub-day quick flow, the smallest unit in the Shadow Clone hierarchy (**sprint** (hours) → **plan** (day) → **roadmap** (week)). It is the right mode when:

- The repo is live; people are committing to it.
- The architecture is already chosen.
- You are framing a bounded chunk of work that fits inside a working day — typically under an hour of focused AI-augmented execution.

It is **not** the right mode for greenfield project planning — for that, exit and use `/sc-plan`. It is also not the right mode for multi-sprint or week-scale planning — for that, use `/sc-roadmap`.

The deliverable is `.waves/wave-2/deliverables/SPRINT_PLAN.md`.

## Step 1 — Capture context (ask before starting)

Use the **AskUserQuestion** tool to ask the user, in one batch:

1. **Sprint goal** (header `Goal`) — one sentence: what does this sprint ship? Free-text.
2. **Sprint length** (header `Length`) — options: `< 1 hour (Recommended)`, `1-2 hours`, `Half-day`, `Full day`. **Bias hard toward the shortest realistic option.** A sprint is a *quick flow*, not a calendar week — multiple sprints run inside a single working day. `< 1 hour` is the typical AI-augmented sprint (single-PR or single-focused-change); `1-2 hours` for a small batch / multi-PR cluster; `Half-day` for heavier multi-feature work; `Full day` only as overflow when staging is genuinely careful. If scope doesn't fit `Full day`, this isn't a sprint anymore — surface that to the user and recommend `/sc-plan` instead. Never inflate sprint length to fit ambitious scope; cut scope or escalate to a plan.
3. **Team size** (header `Team`) — options: `Solo`, `2-3`, `4-7`, `8+`.
4. **Risk tolerance** (header `Risk`) — options: `Low (live system, careful rollouts)`, `Standard (normal release cadence)`, `High (experimental area, OK to break things)`.

Wait for the answers. Echo a one-line scope confirmation, then proceed to Wave 0.

## Step 2 — Run the methodology

# Sprint Mode Configuration

<mode_overview>
  <purpose>
    Sprint Mode produces a focused, executable plan for one upcoming sprint in an
    already-running codebase. Unlike Planning Mode (greenfield), Sprint Mode starts
    by reading the system that exists and frames the sprint within it.
  </purpose>

  <why_important>
    Sprints fail when the plan was written without looking at the code. The
    architecture, the in-flight branches, the recent incidents, the half-finished
    refactors — all of that is invisible to a planner who works only from the
    sprint goal. This mode forces the agent team to ground every task in the
    real current state.
  </why_important>

  <critical_protocol>
    <sprint_plan_location>
      CRITICAL: SPRINT_PLAN.md MUST be created at
      .waves/wave-2/deliverables/SPRINT_PLAN.md. This is the only valid location.
    </sprint_plan_location>

    <file_organization>
      Sprint Mode uses EXACTLY 3 waves with ONE deliverable per wave:
      - Wave 0: CURRENT_STATE.md      in .waves/wave-0/deliverables/
      - Wave 1: TASK_DECOMP.md        in .waves/wave-1/deliverables/
      - Wave 2: SPRINT_PLAN.md        in .waves/wave-2/deliverables/
    </file_organization>
  </critical_protocol>
</mode_overview>

<wave_structure>
  <wave_0>
    <name>Current State Read</name>
    <purpose>
      Establish the ground truth of the codebase as it exists today, so every task
      in Wave 1 is anchored in real code paths, real recent commits, and real
      in-flight work — not in a wishful sketch.
    </purpose>

    <team_composition>
      - Code Cartographer: Maps the architecture relevant to the sprint goal (directories, key modules, public APIs).
      - History Reader: Surveys recent commits, open PRs, and unfinished refactors that the sprint will collide with.
      - Constraints Surveyor: Identifies platform, deployment, data-migration, and on-call constraints in effect.
      - Record Keeper: Consolidates findings into CURRENT_STATE.md.
    </team_composition>

    <deliverables>
      <deliverable path=".waves/wave-0/deliverables/CURRENT_STATE.md">
        Single document capturing:
        - The architectural slice the sprint will touch (with file paths)
        - Recent activity in that slice: last 20-30 commits, open PRs, branches in flight
        - Known in-flight refactors or migrations the sprint must navigate around
        - Active constraints: deploy windows, freeze periods, dependencies on other teams
        - Open questions the team should resolve before Wave 1 starts
      </deliverable>
    </deliverables>

    <instructions>
      1. Read the code first. Cite files and line ranges, not summaries from memory.
      2. Run `git log --since='30 days ago' -- <relevant paths>` to surface recent activity.
      3. List every open PR that touches the sprint's surface area.
      4. Flag any uncommitted work in `git status` that affects the plan.
      5. Consolidate into CURRENT_STATE.md and explicitly mark any open question.
    </instructions>
  </wave_0>

  <wave_1>
    <name>Task Decomposition &amp; Risk Identification</name>
    <purpose>
      Break the sprint goal into concrete tasks with dependencies, sizes, and risks,
      grounded in the current state surfaced in Wave 0.
    </purpose>

    <team_composition>
      - Decomposition Lead: Breaks the sprint goal into discrete tasks (each one a coherent PR).
      - Dependency Mapper: Identifies inter-task dependencies and cross-team dependencies.
      - Risk Auditor: Surfaces risks specific to changing live code (breakage, migrations, rollback).
      - Estimator: Sizes each task against the team's actual capacity (Sprint Length × Team Size).
      - Record Keeper: Consolidates into TASK_DECOMP.md.
    </team_composition>

    <deliverables>
      <deliverable path=".waves/wave-1/deliverables/TASK_DECOMP.md">
        Consolidated document containing:
        - Task table: ID, title, scope, estimate, dependencies, owner candidates
        - Dependency graph (text or mermaid) showing serial vs. parallel paths
        - Risk register: each risk with severity, trigger, and mitigation
        - Out-of-scope list: things the sprint goal could imply but is NOT going to do
        - Done criteria for the sprint as a whole
      </deliverable>
    </deliverables>

    <instructions>
      1. Tasks are PR-sized. If a single "task" exceeds the chosen sprint length (i.e., one person can't ship it inside the `Length` window), split it.
      2. Every task lists the files or modules it will touch (verify against Wave 0's map).
      3. Risks must include rollback strategy when the change is irreversible by default (DB migrations, public-API contracts, third-party integrations).
      4. The estimate must respect the user's stated Team Size × Sprint Length — flag overflow rather than silently fitting it.
      5. Explicitly list what is OUT of scope; defending the boundary is half the work.
    </instructions>
  </wave_1>

  <wave_2>
    <name>Sprint Plan Synthesis</name>
    <purpose>
      Synthesize current-state findings (Wave 0) and task decomposition (Wave 1)
      into a single SPRINT_PLAN.md the team can execute against.
    </purpose>

    <team_composition>
      - Sprint Architect: Assembles the final plan with sprint goal, phases, and milestones.
      - Quality Planner: Defines acceptance criteria and the definition of done per task.
      - Rollback Strategist: Documents the rollback path for every risky change.
      - Record Keeper: Finalizes SPRINT_PLAN.md and a structured task list.
    </team_composition>

    <deliverables>
      <deliverable path=".waves/wave-2/deliverables/SPRINT_PLAN.md">
        CRITICAL: The only valid location for SPRINT_PLAN.md.
        Complete sprint blueprint including:
        1. Sprint Goal (one paragraph)
        2. Current State Summary (3-5 sentences, linking to CURRENT_STATE.md)
        3. Task List (structured table, see format below)
        4. Dependency Graph (text or mermaid)
        5. Risk Register (with mitigations and rollback)
        6. Done Criteria
        7. Out of Scope
        8. Checkpoint Plan — cadence matches sprint length: continuous/rolling for `< 1 hour` and `1-2 hours` (no formal checkpoint, just final report), a single mid-sprint checkpoint for `Half-day`, start + end checkpoints for `Full day`. Specifies what gets reported at each checkpoint.
      </deliverable>
    </deliverables>

    <instructions>
      1. Read both prior deliverables before drafting; reference them by relative link.
      2. Pull the task table into SPRINT_PLAN.md verbatim from TASK_DECOMP.md.
      3. Make the rollback strategy concrete: command-line steps, not "we'll revert."
      4. The Checkpoint Plan answers "what does the team report at each checkpoint?" in one sentence. Cadence matches sprint length: continuous/rolling for `< 1 hour` and `1-2 hours` (just the final report), a single mid-sprint checkpoint for `Half-day`, start + end checkpoints for `Full day`.
    </instructions>
  </wave_2>
</wave_structure>

<sprint_guidelines>
  <principle>
    Ground every task in the code that exists. If a task can't cite a file path or
    module name from Wave 0, it is not yet a real task — it is a wish.
  </principle>

  <principle>
    Plan for rollback before you plan for ship. Every change to live code gets a
    rollback story; "revert the commit" only works for code-only changes with no
    data migration and no external API surface.
  </principle>

  <principle>
    Capacity is a hard constraint, not an aspiration. If Sprint Length × Team Size
    cannot fit the decomposition, flag the overflow to the user before Wave 2.
    Don't quietly squeeze.
  </principle>

  <principle>
    Out-of-scope is a deliverable. The list of things the sprint will NOT do is
    just as important as the list of things it will. Defending it from scope
    creep is how the sprint actually ships.
  </principle>

  <activities_to_perform>
    - Read the code paths relevant to the sprint goal end-to-end
    - Survey recent commits, open PRs, and in-flight refactors
    - Decompose the sprint goal into PR-sized tasks with dependencies
    - Estimate each task against the team's real capacity
    - Surface risks specific to changing live code
    - Define a rollback strategy for every risky change
    - Document the out-of-scope list
    - Specify a checkpoint plan (cadence matching the sprint length per the rules above) to keep the sprint visible
  </activities_to_perform>

  <workspace_organization>
    <structure>
      .waves/wave-0/
        deliverables/     # ONLY CURRENT_STATE.md
        drafts/           # Work-in-progress
        rk-operations/    # ONLY: AGENT_ASSIGNMENTS.md, RECORD_KEEPER_LOG.md, WAVE_COMPLETE.md

      .waves/wave-1/
        deliverables/     # ONLY TASK_DECOMP.md
        drafts/
        rk-operations/

      .waves/wave-2/
        deliverables/     # ONLY SPRINT_PLAN.md — final deliverable
        drafts/
        rk-operations/
    </structure>
  </workspace_organization>
</sprint_guidelines>

<task_table_format>
  <rule>The task table in TASK_DECOMP.md and SPRINT_PLAN.md uses this exact shape:</rule>
  <format>
    | ID | Title | Scope (files/modules) | Estimate | Depends on | Owner | Status |
    |----|-------|-----------------------|----------|------------|-------|--------|
    Use component prefixes: B (Backend), F (Frontend), S (Shared), I (Infra).
    Use status values: Open / Claimed / In Progress / Review / Done.
  </format>
  <rule>Estimates use person-hours (or fractions of a half-day for `Half-day` / `Full day` sprints), not story points. The total must fit Sprint Length × Team Size with at least 20% buffer.</rule>
</task_table_format>

<success_criteria>
  <criterion>Every task in SPRINT_PLAN.md is grounded in a file path or module from CURRENT_STATE.md</criterion>
  <criterion>Total estimate fits the team's capacity with a documented buffer</criterion>
  <criterion>Every risky change has a concrete rollback strategy</criterion>
  <criterion>Out-of-scope list is explicit</criterion>
  <criterion>Done criteria are testable, not aspirational</criterion>
  <criterion>The team can execute against the plan without a follow-up planning meeting</criterion>
</success_criteria>

---

## Standards (every wave must adhere)

Shadow Clone's canonical engineering standards live in `~/.claude/sc/protocols/` (deployed by `bridge/install.sh`). Every deliverable produced in this mode is judged against them. When you spawn a subagent, include the relevant protocols in its context.

**Core (always apply):**

- `Functional Programming & Purity Protocol.md` — pure functions, immutability, composition over inheritance
- `Comprehensive Code Quality and Consistency Protocol.md` — naming, structure, no dead code, no monoliths
- `SECURITY_CHECKLIST.md` — security-first per AGENTS.md Rule 8
- `Error Handling & Resilience Protocol.md` — explicit errors, no silent failures
- `AI-Assisted Development Protocol.md` — verification rigor on AI-generated work

**Additional emphasis for this mode:**

- `Testing & Quality Assurance Protocol.md` — integration tests for every shipped change
- `DevOps & Deployment Protocol.md` — rollback plans, deploy windows, release discipline

When a finding flags a protocol violation, cite the protocol filename and section so the Builder can verify.

---

## Subagents & wave coordination

Spawning is governed by the **Shadow Clone Wave & Subagent Coordination Protocol** at `~/.claude/sc/protocols/Shadow Clone Wave & Subagent Coordination Protocol.md`. Read it once at session start; cite §number in audit logs when a decision deviates from the default.

### This mode's defaults

- **Wave count:** declared in `<wave_structure>` above. Hard ceiling at 5 waves.
- **Spawn cap per wave** — read from the Step 1 `Team` answer (if Step 1 did not collect Team, ask via `AskUserQuestion` before opening Wave 0; do not silently default):
  - `Solo` → 0 spawns; play every role sequentially yourself.
  - `2-3` → up to 2 specialist clones in parallel; you play the Record Keeper.
  - `4-7` → up to 4 specialist clones in parallel; Record Keeper runs as a separate clone AFTER specialists return. Per-wave concurrent peak is 4 (under the §1 hard cap of 5).
  - `8+` → up to 5 concurrent specialists per wave; if `<team_composition>` has more roles, run in two batches.
- **Always-present role:** Record Keeper. Never merged, never dropped. Authors the wave's deliverable.

### Procedure (lives in the Protocol)

Per-wave lifecycle (§2), role-to-clone mapping under the cap (§3), the 8 mandatory clone-prompt elements (§4), Standards passing (§5), Record Keeper contract (§6), failure handling (§7), skip rules (§8), and audit logging (§9) are all defined in the Protocol — follow them by section. Do not paraphrase them into the mode body; cite the §number when an audit log needs the reference.

## Closing each wave

After each wave's deliverable is written, briefly report to the user: what was produced, where it landed, what the next wave will do. If `/sc-echo` is active in the session, dispatch a review before declaring the wave done.

---

Acknowledge that Sprint mode is active and ask any clarifying questions inline, then begin Wave 0.
