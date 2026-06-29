---
description: Shadow Clone roadmap mode — plan a multi-sprint horizon for an active codebase (current state → workstreams + sequencing → ROADMAP.md)
---

You are now operating in **Shadow Clone Roadmap mode** for the rest of this session. This mode plans a **multi-sprint horizon** — the largest unit in the Shadow Clone hierarchy (**sprint** (hours) → **plan** (day) → **roadmap** (week)). Typically 1 week of AI-augmented sprint sequencing, up to a few weeks for multi-subsystem or cross-team work. It is the right mode when:

- The horizon spans more than one sprint.
- Multiple workstreams may run in parallel.
- You need to sequence work, identify cross-team dependencies, and set decision gates.

It is **not** the right mode for greenfield project planning (use `/sc-plan`) or for a single upcoming sprint (use `/sc-sprint`).

The deliverable is `.waves/wave-2/deliverables/ROADMAP.md`.

## Step 1 — Capture context (ask before starting)

Use the **AskUserQuestion** tool to ask the user, in one batch:

1. **Strategic objective** (header `Objective`) — one to three sentences: what does this horizon achieve? Free-text.
2. **Horizon** (header `Horizon`) — options: `Days`, `1 week (Recommended)`, `2-4 weeks`, `Open-ended`. **Bias toward the shorter realistic option.** Roadmaps sit at the top of the Shadow Clone hierarchy: longer than a plan (day-scale) and a sprint (sub-day). The week is the natural roadmap unit — long enough to sequence multiple sprints and plans with explicit decision gates, short enough that AI-augmented teams can actually execute against it. `Days` fits a small multi-step initiative; `1 week` is the typical case; `2-4 weeks` for multi-subsystem or cross-team work; `Open-ended` for strategic direction without a fixed end date. Never default to "1 quarter" or "6 months" — those are legacy human cadences. AI compresses horizons dramatically; the hierarchy is sprint (hours) → plan (day) → roadmap (week).
3. **Parallel workstreams** (header `Streams`) — options: `1 (single thread)`, `2-3`, `4-5`, `6+ (large org)`.
4. **Output emphasis** (header `Output`) — options: `ROADMAP.md (single doc)`, `ROADMAP.md + per-sprint backlog stubs`, `ROADMAP.md + decision matrix`.

5. **Team size** (header `Team`) — options: `Solo`, `2-3`, `4-7`, `8+`. Drives the per-wave subagent spawn cap (see the Subagents section below).

Wait for the answers. Echo a one-line scope confirmation, then proceed to Wave 0.

## Step 2 — Run the methodology

# Roadmap Mode Configuration

<mode_overview>
  <purpose>
    Roadmap Mode produces a multi-sprint plan for an existing codebase: which
    workstreams run, in what order, with what dependencies, and against what
    decision gates. Unlike Sprint Mode (one sprint, bounded), Roadmap Mode
    operates at the strategic horizon and produces sprint-sequenced output.
  </purpose>

  <why_important>
    Long-horizon plans fail when they are written without grounding in the
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
      constraints that shape what is achievable in the horizon. Every workstream
      named in Wave 1 must anchor to something Wave 0 surfaced.
    </purpose>

    <team_composition>
      - System Cartographer: Maps the architecture at the level relevant to the horizon (services, data flow, integration points).
      - State-of-the-Union Reader: Surveys the recent 1-3 months of activity — major shipped initiatives, in-flight refactors, technical debt registry.
      - Constraints Surveyor: Identifies headcount, deployment, compliance, and external-dependency constraints in effect for the horizon.
      - Stakeholder Mapper: Identifies the human stakeholders for each likely workstream (engineering owners, product, design, security).
      - Record Keeper: Consolidates findings into STRATEGIC_CONTEXT.md.
    </team_composition>

    <deliverables>
      <deliverable path=".waves/wave-0/deliverables/STRATEGIC_CONTEXT.md">
        Single document capturing:
        - The system map at horizon-relevant granularity (services, data flow, key integrations)
        - Recent activity: major shipped initiatives in the last 1-3 months (matches the State-of-the-Union Reader's window above), in-flight refactors, known tech debt
        - Hard constraints: headcount, freeze periods, compliance milestones, third-party SLAs
        - Stakeholder map: who owns what surface area
        - Open strategic questions the team must resolve before Wave 1
      </deliverable>
    </deliverables>

    <instructions>
      1. Read the system at a higher level than Sprint Mode would — services and contracts, not individual files. Still cite real names.
      2. Read recent project memory / commit history at the horizon scale. Lookback windows by horizon option: `Days` → last 2-4 weeks; `1 week` → last 1-2 months; `2-4 weeks` → last 2-3 months; `Open-ended` → last 3-6 months.
      3. List every known constraint with a date or owner attached.
      4. Map stakeholders by surface area so Wave 1 can attribute workstreams to real humans.
      5. Surface any strategic question that should be answered before workstream selection.
    </instructions>
  </wave_0>

  <wave_1>
    <name>Workstreams &amp; Dependencies</name>
    <purpose>
      Decompose the strategic objective into discrete workstreams, identify the
      dependencies between them, and assess each one's size against the horizon.
    </purpose>

    <team_composition>
      - Workstream Lead: Names each workstream, with goal, success criteria, and owner.
      - Dependency Architect: Maps inter-workstream dependencies and the cross-team coordination required.
      - Sequencing Planner: Determines which workstreams run in parallel vs. serial, and identifies critical path.
      - Risk Auditor: Identifies horizon-scale risks — initiative churn, dependency on external launches, regulatory deadlines.
      - Record Keeper: Consolidates into WORKSTREAMS.md.
    </team_composition>

    <deliverables>
      <deliverable path=".waves/wave-1/deliverables/WORKSTREAMS.md">
        Consolidated document containing:
        - Workstream table: ID, name, objective, success criteria, owner, rough sprint count (for `Days` horizons use half-day or hour increments instead — see Wave 1 instruction 1)
        - Dependency graph (mermaid or text) showing the critical path
        - Parallel vs. serial assessment: which workstreams can ship concurrently
        - Risk register at the horizon level (each risk has trigger, mitigation, and owner)
        - Capacity check: total sprint count across workstreams vs. horizon × team count
        - Out-of-scope list: initiatives that look attractive but are NOT in this horizon
      </deliverable>
    </deliverables>

    <instructions>
      1. Each workstream is sized in sprints, not days. **Carve-out for the `Days` horizon**: at that scale a sprint may be a single day or even hours, so size workstreams in half-day or hour increments instead — the unit rule is "smaller than the horizon's smallest natural slice." If a single workstream is bigger than half the horizon, split it.
      2. Every workstream cites the surface area from STRATEGIC_CONTEXT.md it will touch.
      3. The dependency graph is the heart of this wave — it determines what Wave 2 can sequence.
      4. Capacity check: total sprint count across workstreams must fit the horizon × parallel-stream count. Flag overflow rather than quietly fitting.
      5. The out-of-scope list defends the horizon from accumulating drift.
    </instructions>
  </wave_1>

  <wave_2>
    <name>Roadmap Synthesis</name>
    <purpose>
      Synthesize the strategic context (Wave 0) and the workstreams (Wave 1) into
      a single ROADMAP.md that commits to a sprint sequence with decision gates.
    </purpose>

    <team_composition>
      - Roadmap Architect: Assembles the sprint-by-sprint sequence with parallel/serial structure.
      - Gate Designer: Identifies decision points and re-evaluation gates (e.g., "after Sprint 3, decide whether to continue Workstream B").
      - Quality Planner: Defines milestone-level success criteria.
      - Communication Planner: Specifies what gets reported and when (weekly summary, end-of-sprint review, gate decisions).
      - Record Keeper: Finalizes ROADMAP.md and any optional companion artifacts (per-sprint stubs, decision matrix).
    </team_composition>

    <deliverables>
      <deliverable path=".waves/wave-2/deliverables/ROADMAP.md">
        CRITICAL: The only valid location for ROADMAP.md.
        Complete roadmap including:
        1. Strategic Objective (one paragraph)
        2. Horizon &amp; Capacity Summary (3-5 sentences, linking STRATEGIC_CONTEXT.md)
        3. Workstream Table (verbatim from WORKSTREAMS.md)
        4. Sprint Sequence (which workstreams run in which sprints, with start/end)
        5. Dependency &amp; Critical Path (mermaid or text)
        6. Decision Gates (when to re-evaluate, what data is required at each gate)
        7. Risk Register at the horizon level
        8. Communication Plan (what gets reported, to whom, how often)
        9. Out of Scope (initiatives explicitly NOT pursued this horizon)
      </deliverable>
    </deliverables>

    <instructions>
      1. The Sprint Sequence is the most important section — it is the part the team executes against.
      2. Every decision gate names the data required to make the call ("after Sprint 3, decide on Workstream B continuation based on customer-validation interviews").
      3. The Communication Plan must answer: what is reported at end of each sprint, what is reported at each gate, who is the audience.
      4. Optional companion artifacts (per-sprint stubs, decision matrix) are produced only if the user requested that output emphasis in Step 1.
    </instructions>
  </wave_2>
</wave_structure>

<roadmap_guidelines>
  <principle>
    The critical path determines the horizon's success or failure. Identify it
    explicitly in Wave 1 and protect it in Wave 2's sequencing.
  </principle>

  <principle>
    Decision gates beat fixed plans. A roadmap that commits to 8 sprints of work
    without a re-evaluation point is a wishlist, not a plan. Insert at least one
    gate per major workstream and one at the horizon's midpoint.
  </principle>

  <principle>
    Capacity is the constraint, not a variable. If the workstream count cannot
    fit the horizon at the stated parallel-stream count, the roadmap MUST flag
    the overflow — either cut scope, extend horizon, or grow capacity. Don't
    pretend.
  </principle>

  <principle>
    Out-of-scope is a feature. The list of initiatives explicitly NOT pursued
    this horizon is what defends the roadmap from drift. Treat it as a real
    deliverable.
  </principle>

  <activities_to_perform>
    - Read the system at horizon-relevant granularity (services, contracts, data flow)
    - Survey the recent 1-3 months of shipped work and in-flight initiatives
    - Decompose the strategic objective into workstreams with owners
    - Map inter-workstream dependencies and identify the critical path
    - Sequence workstreams into sprints with explicit parallel/serial structure
    - Insert decision gates with data requirements
    - Run a capacity check; flag overflow rather than mask it
    - Document out-of-scope initiatives
    - Specify the communication plan for the horizon
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
  <rule>The workstream table in WORKSTREAMS.md and ROADMAP.md uses this exact shape:</rule>
  <format>
    | ID | Name | Objective | Success Criteria | Owner | Sprints | Depends on | Status |
    |----|------|-----------|------------------|-------|---------|------------|--------|
    Use status values: Proposed / Committed / In Progress / Completed / Dropped.
    Sprints column lists which sprint indices the workstream occupies (e.g. "S1-S3" or "S2, S5-S6").
  </format>
</workstream_table_format>

<success_criteria>
  <criterion>Every workstream in ROADMAP.md is anchored to a surface area named in STRATEGIC_CONTEXT.md</criterion>
  <criterion>The critical path is explicitly identified and protected in the sprint sequence</criterion>
  <criterion>At least one decision gate exists per major workstream</criterion>
  <criterion>Capacity check is honest — overflow is flagged, not hidden</criterion>
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

- `Architecture & System Design Protocol.md` — long-horizon architecture decisions
- `Multi Agent Protocol.md` — workstream coordination, communication contracts
- `DevOps & Deployment Protocol.md` — production discipline across the horizon

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
