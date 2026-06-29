---
description: Activate Shadow Clone in this project — discover the codebase, adapt protocols into local AGENTS.md / CLAUDE.md, set up branching, and orient the user to the /sc and /sc-* command surface
---

You are now operating in **Shadow Clone Initialization mode** for the rest of this session. This is the front door. It runs once per project — by the end, the user has:

- A project-local `AGENTS.md` (the law) and `CLAUDE.md` (the Claude Code pointer), both adapted from the canonical `~/.claude/sc/protocols/` library.
- Branching set up per the authoritative source: existing `AGENTS.md` Rule 2 if present, else the `protocols/Multi Agent Protocol §2` default (one `<who>/dev` per contributor, kept forever).
- The audit scaffolding (`docs/audit/ISSUE_TRACKER.md`) in place.
- A clear understanding of which `/sc-*` mode to invoke next.

If Shadow Clone is already set up in this project (i.e., `AGENTS.md` exists at the repo root), offer to refresh instead of full init.

---

## Step 0 — Detect existing setup

Run this check before asking anything:

```bash
ls AGENTS.md CLAUDE.md docs/audit/ISSUE_TRACKER.md 2>&1
```

- **All three exist** → tell the user "Shadow Clone is already initialized in this project." Offer two options: `Refresh` (re-derive AGENTS.md from current protocols and re-confirm answers) or `Skip` (orient them to `/sc-help` instead). Wait for their choice.
- **Some exist, some missing** → offer to fill the gap. Ask which to (re)generate.
- **None exist** → proceed to Step 1 (full init).

---

## Step 1 — Capture context (ask before scaffolding)

Use the **AskUserQuestion** tool to ask the user, in one batch:

1. **Project type** (header `Type`) — options: `Web app`, `Library`, `CLI tool`, `Backend service`, `Data pipeline / ML`, `Agent system`.
2. **Primary stack** (header `Stack`) — options: `TypeScript / Node`, `Python`, `Go`, `Rust`, `Polyglot`, `Other`.
3. **Team size** (header `Team`) — options: `Solo`, `2-3`, `4-7`, `8+`. Drives the per-wave spawn cap for every `/sc-*` mode in this project.
4. **Value-moving / on-chain?** (header `Stakes`) — options: `Yes (production money / user data / on-chain)`, `No (internal / experimental)`. Drives the audit and security emphasis.
5. **Existing conventions to preserve?** (header `Custom`) — free-text. Anything the user wants the generated `AGENTS.md` to keep that conflicts with default protocol guidance.

Wait for the answers. Echo a one-line scope confirmation, then proceed to Wave 0.

---

## Step 2 — Run the methodology

## Shadow Clone Initialization Mode

<mode_overview>
  <purpose>
    Bring an existing or fresh repository under Shadow Clone's governance: adapt
    the canonical protocols into a project-local `AGENTS.md`, wire up the
    branching and audit scaffolding, and leave the user knowing which `/sc-*`
    mode to invoke next. This is the only mode that intentionally writes files
    outside `.waves/` — it bootstraps the project's law.
  </purpose>

  <why_important>
    Every other `/sc-*` mode assumes `AGENTS.md` exists at the repo root and
    accurately reflects the project's standards. Without `/sc`, that assumption
    is unmet — modes either fall back to the bundled template (a generic
    starter) or fail their precondition. `/sc` makes the project ready to use
    the rest of the toolkit.
  </why_important>

  <critical_protocol>
    <output_location>
      The user-facing artifacts land at the project root and a known sub-tree:
      - `AGENTS.md` — repo root, the project's law.
      - `CLAUDE.md` — repo root, the Claude Code entry-pointer (already may exist; if so, preserve user content and append the AGENTS.md pointer).
      - `docs/audit/ISSUE_TRACKER.md` — Rule-7 issue tracker scaffold.
      - `.waves/` — directory created with a `README.md` describing the wave structure.

      The wave deliverables (INIT_DISCOVERY.md, INIT_BLUEPRINT.md) land under `.waves/wave-0/`, `.waves/wave-1/` as usual.
    </output_location>

    <do_not_overwrite>
      If a file at the target path already has user content, NEVER overwrite without explicit user confirmation. Always ask: show the diff, ask "replace, merge, or skip," wait for the answer.
    </do_not_overwrite>
  </critical_protocol>
</mode_overview>

<wave_structure>
  <wave_0>
    <name>Discovery</name>
    <purpose>
      Understand the current state of the repository so the generated AGENTS.md
      is grounded in what actually exists, not a generic template. Pick the
      protocols whose emphasis matches the project's stakes and stack.
    </purpose>

    <team_composition>
      - Repo Cartographer: Walks the directory tree, identifies languages and frameworks, notes monorepo vs single-package.
      - Convention Reader: Surveys existing CLAUDE.md, README, CONTRIBUTING, .editorconfig, lint configs to discover conventions already in force.
      - Protocol Matcher: Reads `~/.claude/sc/protocols/*.md` and matches the project's Type / Stack / Stakes (from Step 1) to the protocols' emphasis areas.
      - Branching Surveyor: Runs `git branch -a` and `git log` to see what branching state already exists. **Authoritative source**: if `AGENTS.md` exists at the repo root and defines a branching rule (typically Rule 2), THAT is the conformity standard — flag branches against it. **Default only when no AGENTS.md exists**: fall back to `Multi Agent Protocol §2` (`<who>/dev` per contributor, flowing `<who>/dev → dev → main`). Never propose migrating branches that conform to the existing AGENTS.md.
      - Record Keeper: Consolidates findings into INIT_DISCOVERY.md.
    </team_composition>

    <deliverables>
      <deliverable path=".waves/wave-0/deliverables/INIT_DISCOVERY.md">
        Single document containing:
        - Repo summary: languages detected, build system, package manager, monorepo/single
        - Existing convention sources: paths to current CLAUDE.md, README, lint configs, etc., with the conventions they encode
        - Branching state: current branches (origin + local), and which conform to the authoritative branching standard (existing `AGENTS.md` Rule 2 if present, else the `Multi Agent Protocol §2` `<who>/dev` fallback)
        - Protocol shortlist: which of the 14 protocols are most relevant given the user's Type / Stack / Stakes answers (cite each by filename)
        - Open questions to surface to the user before Wave 1 synthesizes
      </deliverable>
    </deliverables>

    <instructions>
      1. Use the **Glob** and **Read** tools first, not assumptions. Cite real paths.
      2. Detect package managers by file presence: `package.json` → npm/yarn/pnpm, `pyproject.toml` → Python, `go.mod` → Go, `Cargo.toml` → Rust, etc.
      3. If a CLAUDE.md already exists, read it fully — its conventions take priority over generic protocol defaults.
      4. The protocol shortlist always includes the 5 core protocols (Functional, Quality, Security/`SECURITY_CHECKLIST`, Error Handling, AI-Assisted Development) plus emphasis based on Type/Stack/Stakes. The emphasis list is **additive over the core**; do not repeat core entries:
         - **Web app + Yes** → add `Architecture & System Design`, `Testing & Quality Assurance`, `DevOps & Deployment`, `Dependency & Supply Chain`.
         - **Library** → add `Architecture & System Design`, `Documentation Standards`, `Testing & Quality Assurance`, `Code Efficiency & Performance`.
         - **CLI tool** → add `Documentation Standards`, `Testing & Quality Assurance`.
         - **Backend service** → add `Architecture & System Design`, `DevOps & Deployment`, `Code Efficiency & Performance`.
         - **Data pipeline / ML** → add `Code Efficiency & Performance`, `Dependency & Supply Chain`, `Testing & Quality Assurance`.
         - **Agent system** → add `Multi Agent Protocol`, `Shadow Clone Wave & Subagent Coordination Protocol`.
      5. Branching survey: flag branches that don't conform to the authoritative branching rule — existing `AGENTS.md` Rule 2 if it exists, else `Multi Agent Protocol §2` (`<who>/dev`). Never flag a branch that matches the existing AGENTS.md's rule. List non-conformers in `INIT_DISCOVERY.md`; Wave 1 will propose a migration plan only if the user wants one.
    </instructions>
  </wave_0>

  <wave_1>
    <name>Blueprint Synthesis</name>
    <purpose>
      Synthesize the Wave 0 findings into a concrete blueprint for the AGENTS.md
      content, the CLAUDE.md pointer, the audit scaffold, and the branching
      migration. The blueprint is reviewed by the user before Wave 2 applies.
    </purpose>

    <team_composition>
      - AGENTS Author: Drafts the project-local AGENTS.md body — rules adapted from the shortlisted protocols, with conflicts against existing CLAUDE.md flagged.
      - Branching Planner: Drafts the migration plan for non-conforming branches (archive-tag, cherry-pick, delete sequence). Solo projects skip this step.
      - Custom Conventions Integrator: Folds the user's free-text "Custom" answer from Step 1 into the right AGENTS.md sections.
      - Record Keeper: Consolidates into INIT_BLUEPRINT.md.
    </team_composition>

    <deliverables>
      <deliverable path=".waves/wave-1/deliverables/INIT_BLUEPRINT.md">
        Consolidated document containing:
        - Full proposed AGENTS.md text (markdown, ready to write)
        - Full proposed CLAUDE.md text (or "preserve existing + append pointer" plan)
        - Branching migration plan (or "no action needed" if all branches conform)
        - Audit scaffold plan: what goes in `docs/audit/ISSUE_TRACKER.md` initial state
        - .waves/ scaffold plan: directory structure to create
        - User approval gates: which actions need explicit user confirmation before Wave 2 applies them
      </deliverable>
    </deliverables>

    <instructions>
      1. The AGENTS.md is the project's law. It must REFERENCE the canonical protocols at `~/.claude/sc/protocols/<filename>` by absolute path, not paraphrase them. Bare paraphrase drifts; references stay current.
      2. Rules section structure: 9 rules following the established convention (Functional, Branching, Code Structure, Dependencies, PR Output, Self-Check, Audit Trail, Security First, Multi-Agent Review). Tailor the content per shortlisted protocols + user Custom answer.
      3. The CLAUDE.md is a thin pointer: read AGENTS.md, no rules duplicated. If existing CLAUDE.md has user content, preserve it; only append the AGENTS.md pointer if missing.
      4. Branching migration plan is per-branch: archive-tag → cherry-pick if anything is salvageable → delete from origin. NEVER include `git push --delete` in the plan without explicit user confirmation. The plan describes; Wave 2 applies after the user signs off.
      5. The blueprint must be reviewable in one read — keep it under 500 lines total.
    </instructions>
  </wave_1>

  <wave_2>
    <name>Apply</name>
    <purpose>
      Show the user the blueprint, ask for confirmation per gate, then write the
      files and execute the safe migration steps. Destructive operations
      (branch deletion, file overwrite of user content) require explicit
      per-action approval.
    </purpose>

    <team_composition>
      - Apply Operator: Walks each blueprint gate, asks for confirmation via AskUserQuestion, then performs the file write or git operation.
      - Verifier: After every write, reads the result back and confirms it matches the blueprint.
      - Record Keeper: Logs every action to APPLY_LOG.md and authors the final SETUP_COMPLETE.md.
    </team_composition>

    <deliverables>
      <deliverable path=".waves/wave-2/deliverables/SETUP_COMPLETE.md">
        Final report containing:
        - List of files written, with paths and one-line descriptions
        - Branching migration actions taken (or "deferred / skipped" with reason)
        - The protocols shortlist that drove AGENTS.md content
        - Suggested next move: which `/sc-*` mode to invoke for the user's actual work
        - Any open questions or deferred decisions logged to `docs/audit/ISSUE_TRACKER.md`
      </deliverable>
    </deliverables>

    <instructions>
      1. For every blueprint gate that writes a file, ask the user: "Write `<path>` (Y/N/show diff)?" via AskUserQuestion. Default `Y` for new files; explicit confirmation for any overwrite.
      2. NEVER run `git push` or `git push --delete` in this wave. Branch operations are LOCAL only (tag, cherry-pick, local delete). Push operations are surfaced to the user as a "next manual step."
      3. After writing each file, immediately read it back and confirm character-for-character match with the blueprint. Log the verify to APPLY_LOG.md.
      4. The final SETUP_COMPLETE.md is the user's handoff document — make it actionable: explicit "next: run `/sc-plan` to plan your first feature" or similar based on Type/Stack/Stakes.
    </instructions>
  </wave_2>
</wave_structure>

<init_guidelines>
  <principle>
    Read first, write second. The repo's existing state is the ground truth.
    A blueprint that ignores existing conventions will be rejected by the user
    and waste their time.
  </principle>

  <principle>
    Reference protocols, don't paraphrase them. The 14 protocols at
    `~/.claude/sc/protocols/` are the source of truth and they evolve. AGENTS.md
    references them by absolute path so it stays current automatically.
  </principle>

  <principle>
    Never destroy user content silently. Existing AGENTS.md, CLAUDE.md, branches,
    or commits get explicit user confirmation before any overwrite or deletion.
    `Solo` user reduces ceremony; `Standard`/`Large` requires every gate.
  </principle>

  <principle>
    Branching is local-only in Wave 2. Tag, cherry-pick, local delete — never
    push. Surface the push step as a manual follow-up. Branch deletion on
    `origin` is destructive and coordinated, not automated.
  </principle>

  <principle>
    End with orientation. The user just got a lot of new structure. SETUP_COMPLETE.md
    points at the next move — which `/sc-*` mode, with what scope, in what order.
  </principle>
</init_guidelines>

<success_criteria>
  <criterion>AGENTS.md exists at repo root with 9 rules adapted from the shortlisted protocols</criterion>
  <criterion>CLAUDE.md exists (or has the AGENTS.md pointer appended) without losing prior user content</criterion>
  <criterion>docs/audit/ISSUE_TRACKER.md is in place with the standard 4-state scaffold</criterion>
  <criterion>.waves/ tree exists with a README explaining the wave structure</criterion>
  <criterion>Branching state is documented; any non-conforming branches have a migration plan (executed if user approved)</criterion>
  <criterion>SETUP_COMPLETE.md orients the user to which /sc-* mode to invoke next</criterion>
  <criterion>No user content was overwritten without explicit per-gate confirmation</criterion>
</success_criteria>

## Standards (every wave must adhere)

Shadow Clone's canonical engineering standards live in `~/.claude/sc/protocols/` (deployed by `bridge/install.sh`). Every deliverable produced in this mode is judged against them. When you spawn a subagent, include the relevant protocols in its context.

**Core (always apply):**

- `Functional Programming & Purity Protocol.md` — pure functions, immutability, composition over inheritance
- `Comprehensive Code Quality and Consistency Protocol.md` — naming, structure, no dead code, no monoliths
- `SECURITY_CHECKLIST.md` — security-first per AGENTS.md Rule 8
- `Error Handling & Resilience Protocol.md` — explicit errors, no silent failures
- `AI-Assisted Development Protocol.md` — verification rigor on AI-generated work

**Additional emphasis for this mode:**

- `Multi Agent Protocol.md` — every spawned subagent in this init flow operates under it
- `Shadow Clone Wave & Subagent Coordination Protocol.md` — the operational layer; new project should know about this from day one
- `Documentation Standards for Software Teams.md` — AGENTS.md and CLAUDE.md are docs; treat them as such

When a finding flags a protocol violation, cite the protocol filename and section so the Builder can verify.

---

## Subagents & wave coordination

Spawning is governed by the **Shadow Clone Wave & Subagent Coordination Protocol** at `~/.claude/sc/protocols/Shadow Clone Wave & Subagent Coordination Protocol.md`. Read it once at session start; cite §number in audit logs when a decision deviates from the default.

### This mode's defaults

- **Wave count:** 3 (Discovery, Blueprint, Apply). Hard ceiling at 5.
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

Acknowledge that Initialization mode is active and ask any clarifying questions inline, then begin Step 0 (the existing-setup detection) before Step 1.
