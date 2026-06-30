---
description: Shadow Clone roadmap mode — sequence multiple milestones into a workstream pipeline with prerequisites, parallel branches, and load-bearing nodes; no timelines
---

You are now operating in **Shadow Clone Roadmap mode** for the rest of this session. This mode sequences **multiple milestones into a workstream pipeline** — the largest unit in the Shadow Clone hierarchy: **sprint (one milestone) → plan (several phases to a project milestone) → roadmap (sequenced milestones across an initiative)**. Every roadmap is a DAG of milestones with explicit prerequisites, parallel branches, and load-bearing nodes — *not* a timeline. **Work gets done when it gets done**; the roadmap maps the path from point A → B → C → initiative complete. (For the `Strategic / continuous` shape — see Step 1 — the "pipeline" is a stream of re-evaluation gates rather than a terminal commit; the DAG still applies, it just has no terminal node.)

It is the right mode when:

- The objective decomposes into multiple distinct milestones (more than one sprint).
- Some milestones can run in parallel; others gate downstream work.
- You need to identify cross-team dependencies and explicit decision gates.

It is **not** the right mode for greenfield project planning (use `/sc-plan`) or for a single upcoming sprint (use `/sc-sprint`).

The deliverable is `.waves/wave-2/deliverables/ROADMAP.md`.

## Step 1 — Capture context (ask before starting)

Use the **AskUserQuestion** tool to ask the user, in one batch:

1. **Strategic objective** (header `Objective`) — one to three sentences: what does this roadmap achieve? Free-text.
2. **Milestone shape** (header `Shape`) — options: `Single chain (A→B→C, mostly serial)`, `Parallel tracks merging (multiple branches converge on the objective)`, `Fan-out then converge (one foundation milestone gates many parallel milestones, then a final integration)`, `Strategic / continuous (no fixed end-state; ongoing milestone stream)`. Drives the shape of the DAG in Wave 1 — serial chains get tight critical-path framing; parallel tracks get explicit branch/merge nodes; fan-out gets a load-bearing root flagged; continuous gets explicit re-evaluation gates instead of a terminal node. **No duration collected**; work gets done when it gets done.
3. **Parallel workstreams** (header `Streams`) — options: `1 (single thread)`, `2-3`, `4-5`, `6+ (large org)`.
4. **Output emphasis** (header `Output`) — options: `ROADMAP.md (single doc)`, `ROADMAP.md + per-milestone backlog stubs`, `ROADMAP.md + decision matrix`.

5. **Team size** (header `Team`) — options: `Solo`, `2-3`, `4-7`, `8+`. Drives the per-wave subagent spawn cap (see the Subagents section below).

Wait for the answers. Echo a one-line scope confirmation, then proceed to Wave 0.

## Step 2 — Run the methodology

# Roadmap Mode Configuration

<mode_overview>
  <purpose>
    Roadmap Mode produces a multi-milestone plan for an existing codebase: which
    workstreams run, in what order, with what dependencies, and against what
    decision gates. Unlike Sprint Mode (one sprint = one milestone, bounded),
    Roadmap Mode operates at the strategic scope and produces milestone-sequenced output.
  </purpose>

  <why_important>
    Large-scope roadmaps fail when they are written without grounding in the
    current system or without explicit sequencing decisions. This mode forces
    both: Wave 0 reads the system, Wave 1 names every workstream and its
    dependencies, Wave 2 commits to a sequence with explicit decision gates.
  </why_important>

  <critical_protocol>
    <roadmap_location>
      CRITICAL: ROADMAP.md MUST be created at
      .waves/wave-2/deliverables/ROADMAP.md. This is the only valid location.
    </roadmap_location>

    <file_organization>
      Roadmap Mode uses EXACTLY 3 waves with ONE deliverable per wave:
      - Wave 0: STRATEGIC_CONTEXT.md  in .waves/wave-0/deliverables/
      - Wave 1: WORKSTREAMS.md        in .waves/wave-1/deliverables/
      - Wave 2: ROADMAP.md            in .waves/wave-2/deliverables/
    </file_organization>
  </critical_protocol>
</mode_overview>

<wave_structure>
  <wave_0>
    <name>Strategic Context</name>
    <purpose>
      Establish the current state of the codebase and the organizational
      constraints that shape what is achievable in this roadmap. Every workstream
      named in Wave 1 must anchor to something Wave 0 surfaced.
    </purpose>

    <team_composition>
      - System Cartographer: Maps the architecture at the level relevant to this roadmap (services, data flow, integration points).
      - State-of-the-Union Reader: Surveys the recent 1-3 months of activity — major shipped initiatives, in-flight refactors, technical debt registry.
      - Constraints Surveyor: Identifies headcount, deployment, compliance, and external-dependency constraints in effect for the roadmap.
      - Stakeholder Mapper: Identifies the human stakeholders for each likely workstream (engineering owners, product, design, security).
      - Record Keeper: Consolidates findings into STRATEGIC_CONTEXT.md.
    </team_composition>

    <deliverables>
      <deliverable path=".waves/wave-0/deliverables/STRATEGIC_CONTEXT.md">
        Single document capturing:
        - The system map at roadmap-relevant granularity (services, data flow, key integrations)
        - Recent activity: major shipped initiatives in the last 1-3 months (matches the State-of-the-Union Reader's window above), in-flight refactors, known tech debt
        - Hard constraints: headcount, freeze periods, compliance milestones, third-party SLAs
        - Stakeholder map: who owns what surface area
        - Open strategic questions the team must resolve before Wave 1
      </deliverable>
    </deliverables>

    <instructions>
      1. Read the system at a higher level than Sprint Mode would — services and contracts, not individual files. Still cite real names.
      2. Read recent project memory / commit history at a scale relevant to the objective — look back as far as is needed to ground every workstream Wave 1 will name. **Soft floor**: at minimum, read the integration history of every surface area Wave 1 will touch, plus the last major change to each. If the objective builds on shipped capabilities, read their integration history. No fixed calendar window — but never less than what grounds a named workstream.
      3. List every known constraint with a date or owner attached.
      4. Map stakeholders by surface area so Wave 1 can attribute workstreams to real humans.
      5. Surface any strategic question that should be answered before workstream selection.
    </instructions>
  </wave_0>

  <wave_1>
    <name>Workstreams &amp; Dependencies</name>
    <purpose>
      Decompose the strategic objective into discrete workstreams, identify the
      dependencies between them, and assess each one's size against the roadmap.
    </purpose>

    <team_composition>
      - Workstream Lead: Names each workstream, with goal, success criteria, and owner.
      - Dependency Architect: Maps inter-workstream dependencies and the cross-team coordination required.
      - Sequencing Planner: Determines which workstreams run in parallel vs. serial, and identifies critical path.
      - Risk Auditor: Identifies roadmap-scale risks — initiative churn, dependency on external launches, regulatory deadlines.
      - Record Keeper: Consolidates into WORKSTREAMS.md.
    </team_composition>

    <deliverables>
      <deliverable path=".waves/wave-1/deliverables/WORKSTREAMS.md">
        Consolidated document containing:
        - Workstream table: ID, name, objective, success criteria, owner, milestone list (the ordered milestones inside this workstream), prerequisites (workstream IDs that must complete first), parallel-with (workstream IDs that can run alongside), load-bearing flag
        - Pipeline diagram (mermaid `graph LR` or text-flow) showing the milestone DAG with parallel branches and the critical path highlighted
        - Parallel vs. serial assessment: which workstreams can run concurrently and which gate downstream work
        - Risk register at the roadmap level (each risk has trigger, mitigation, and owner)
        - Pipeline check: the DAG supports the team's parallelism — no single workstream serializes the entire roadmap; load-bearing nodes are explicit
        - Out-of-scope list: initiatives that look attractive but are NOT in this roadmap
      </deliverable>
    </deliverables>

    <instructions>
      1. Each workstream is a sequence of milestones — size it by the milestone count, not by duration. If a single workstream has more milestones than half the roadmap's total, split it so the pipeline stays balanced.
      2. Every workstream cites the surface area from STRATEGIC_CONTEXT.md it will touch.
      3. The milestone pipeline is the heart of this wave — it determines what Wave 2 can sequence.
      4. Pipeline check: the milestone DAG must support the team's parallelism. If most workstreams serialize through one load-bearing node, flag the bottleneck and restructure — don't pretend the team can absorb it. There is no time-based capacity check; the question is "does the graph flow?"
      5. The out-of-scope list defends the roadmap from accumulating drift.
    </instructions>
  </wave_1>

  <wave_2>
    <name>Roadmap Synthesis</name>
    <purpose>
      Synthesize the strategic context (Wave 0) and the workstreams (Wave 1) into
      a single ROADMAP.md that commits to a milestone pipeline with decision gates.
    </purpose>

    <team_composition>
      - Roadmap Architect: Assembles the milestone pipeline — explicit DAG with parallel branches, load-bearing nodes marked, critical path highlighted.
      - Gate Designer: Identifies decision points and re-evaluation gates anchored at milestone transitions (e.g. "after Workstream B's load-bearing milestone M2 completes, decide whether to continue B or merge into C").
      - Quality Planner: Defines milestone-level success criteria.
      - Communication Planner: Specifies what gets reported and at which milestone transitions and decision gates (e.g. load-bearing-node completion, gate decision, workstream merge, terminal milestone). Event-anchored, not calendar-anchored.
      - Record Keeper: Finalizes ROADMAP.md and any optional companion artifacts (per-milestone stubs, decision matrix).
    </team_composition>

    <deliverables>
      <deliverable path=".waves/wave-2/deliverables/ROADMAP.md">
        CRITICAL: The only valid location for ROADMAP.md.
        Complete roadmap including:
        1. Strategic Objective (one paragraph)
        2. Scope &amp; Pipeline Summary (3-5 sentences: the objective, the milestone shape, the team's parallelism — links STRATEGIC_CONTEXT.md)
        3. Workstream Table (verbatim from WORKSTREAMS.md)
        4. Milestone Pipeline &amp; Critical Path — single canonical DAG (mermaid `graph LR` preferred) showing every milestone across every workstream with prerequisites and parallel branches explicit; the critical path (longest chain of load-bearing nodes) marked visually. This embeds and extends Wave 1's pipeline diagram; do NOT redraw it separately.
        5. Decision Gates (milestone triggers + the data required at each gate)
        6. Risk Register at the roadmap level
        7. Communication Plan (what gets reported, to whom, at which milestone transitions and decision gates — event-anchored, not calendar-anchored)
        8. Out of Scope (initiatives explicitly NOT pursued in this roadmap)
      </deliverable>
    </deliverables>

    <instructions>
      1. The Milestone Pipeline is the most important section — it is the part the team executes against. Make the DAG visual (mermaid `graph LR` preferred) so prerequisites and parallel branches read at a glance.
      2. Every decision gate names the milestone trigger and the data required to make the call (e.g. "after Workstream B's load-bearing milestone M2 completes, decide on continuation based on customer-validation interviews").
      3. The Communication Plan must answer: what is reported at each milestone transition, what is reported at each decision gate, and who is the audience for each.
      4. Optional companion artifacts (per-milestone stubs, decision matrix) are produced only if the user requested that output emphasis in Step 1.
    </instructions>
  </wave_2>
</wave_structure>

<roadmap_guidelines>
  <principle>
    The critical path determines the roadmap's success or failure. Identify it
    explicitly in Wave 1 and protect it in Wave 2's sequencing.
  </principle>

  <principle>
    Decision gates beat fixed plans. A roadmap that commits to 8 sprints of work
    without a re-evaluation point is a wishlist, not a plan. Insert at least one
    gate per major workstream and one at the roadmap's midpoint.
  </principle>

  <principle>
    Parallelism, not duration, is the constraint. If the milestone DAG forces
    most of the team to wait on one load-bearing node, the roadmap MUST flag
    the bottleneck — either cut scope, restructure the graph, or grow capacity.
    Don't pretend the team can absorb a serialized pipeline.
  </principle>

  <principle>
    Out-of-scope is a feature. The list of initiatives explicitly NOT pursued
    in this roadmap is what defends it from drift. Treat it as a real
    deliverable.
  </principle>

  <activities_to_perform>
    - Read the system at roadmap-relevant granularity (services, contracts, data flow)
    - Survey the recent 1-3 months of shipped work and in-flight initiatives
    - Decompose the strategic objective into workstreams with owners
    - Map inter-workstream dependencies and identify the critical path
    - Sequence workstreams into sprints with explicit parallel/serial structure
    - Insert decision gates with data requirements
    - Run the pipeline check; flag bottlenecks rather than mask them
    - Document out-of-scope initiatives
    - Specify the communication plan for the roadmap
  </activities_to_perform>

  <workspace_organization>
    <structure>
      .waves/wave-0/
        deliverables/     # ONLY STRATEGIC_CONTEXT.md
        drafts/
        rk-operations/    # ONLY: AGENT_ASSIGNMENTS.md, RECORD_KEEPER_LOG.md, WAVE_COMPLETE.md

      .waves/wave-1/
        deliverables/     # ONLY WORKSTREAMS.md
        drafts/
        rk-operations/

      .waves/wave-2/
        deliverables/     # ONLY ROADMAP.md — final deliverable
        drafts/
        rk-operations/
    </structure>
  </workspace_organization>
</roadmap_guidelines>

<workstream_table_format>
  <rule>The workstream table in WORKSTREAMS.md and ROADMAP.md uses this exact shape — a DAG of milestones, no time columns:</rule>
  <format>
    | ID | Name | Objective | Success Criteria | Owner | Milestones | Prerequisites | Parallel-with | Load-bearing? | Status |
    |----|------|-----------|------------------|-------|------------|---------------|---------------|---------------|--------|
    Status values: Proposed / Committed / In Progress / Completed / Dropped.
    Milestones column: ordered list of milestone names that mark progress through this workstream (e.g. "scaffold → tests pass → integration verified → shipped").
    Prerequisites: workstream IDs that must reach `Completed` before this one can start.
    Parallel-with: workstream IDs this one can run alongside without contention.
    Load-bearing?: `Yes` if this workstream gates 2+ downstream workstreams; `No` otherwise.
  </format>
  <rule>Never add a Sprints / Duration / Timeline column. The roadmap is a graph of milestones with explicit prerequisites and parallelism — not a calendar.</rule>
</workstream_table_format>

<success_criteria>
  <criterion>Every workstream in ROADMAP.md is anchored to a surface area named in STRATEGIC_CONTEXT.md</criterion>
  <criterion>The critical path (chain of load-bearing milestones) is explicitly identified and visible in the Milestone Pipeline DAG</criterion>
  <criterion>At least one decision gate exists per major workstream</criterion>
  <criterion>The pipeline check is honest — serialization bottlenecks and load-bearing-node failures are flagged, not hidden</criterion>
  <criterion>Out-of-scope list is explicit and substantial</criterion>
  <criterion>Communication plan answers what, when, and to whom</criterion>
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

- `Architecture & System Design Protocol.md` — long-scope architecture decisions
- `Multi Agent Protocol.md` — workstream coordination, communication contracts
- `DevOps & Deployment Protocol.md` — production discipline across the roadmap

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

Acknowledge that Roadmap mode is active and ask any clarifying questions inline, then begin Wave 0.
