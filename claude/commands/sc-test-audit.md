---
description: Shadow Clone test-audit mode — diagnose test-suite coverage gaps in an existing project, flag missing integration tests where they make sense, and surface security-sensitive paths without coverage
---

You are now operating in **Shadow Clone Test-Audit mode** for the rest of this session. This mode produces a structured diagnostic of an existing project's test suite — not a pass/fail metric, but a prioritized gap report grounded in real code. The output answers the user's underlying question: *do we have enough coverage to prove the system works and is secure?*

It is **not** a test generator (that is `/sc-tests`, coming in Phase C) and not a test runner. It reads what exists, cross-references against the source surface, and flags meaningful gaps.

The deliverable is `.waves/wave-2/deliverables/TEST_AUDIT.md`.

---

## Step 0 — Precondition

The audit benchmarks the project against the user's own standards. If `AGENTS.md` does not exist at the repo root, suggest running `/sc` first — without it, the auditor falls back to generic protocol defaults and the report will be less specific. If the user wants to proceed anyway, that's fine; note "no project-local standards" in the report's preamble.

---

## Step 1 — Capture context (ask before scanning)

Use the **AskUserQuestion** tool to ask the user, in one batch:

1. **Scope** (header `Scope`) — paths, modules, or packages to audit. Free-text. Use `whole repo` for a full sweep.
2. **Framework** (header `Framework`) — options: `Detect`, `Jest`, `Pytest`, `Vitest`, `Go test`, `Cargo test`, `Other (specify)`. Drives where to look for tests.
3. **Severity floor** (header `Floor`) — options: `Report everything (Info+)`, `Low and above`, `Medium and above`, `Critical paths only`. Filters the final report.
4. **Emphasis** (header `Emphasis`) — options: `Coverage breadth`, `Integration depth`, `Security paths`, `Balanced`. Drives which gaps get spotlighted.
5. **Team size** (header `Team`) — options: `Solo`, `2-3`, `4-7`, `8+`. Drives the per-wave subagent spawn cap (see the Subagents section below).

Wait for the answers. Echo a one-line scope confirmation, then proceed to Wave 0.

---

## Step 2 — Run the methodology

## Shadow Clone Test-Audit Mode

<mode_overview>
  <purpose>
    Produce a structured diagnostic of the project's test suite that answers
    three questions: (1) what is currently covered, (2) what critical paths are
    not covered, and (3) where would integration tests genuinely add proof of
    correctness rather than redundant assurance.
  </purpose>

  <why_important>
    Coverage percentages lie. A 90% unit-test-line-coverage suite can still
    leave the highest-stakes flow — checkout, auth, data write — without an
    end-to-end test that exercises the actual contract. Conversely, blanket
    integration tests for trivial CRUD inflate the suite without adding
    confidence. This mode reads the source first, decides where coverage
    actually matters, and reports against that map.
  </why_important>

  <critical_protocol>
    <deliverable_location>
      CRITICAL: TEST_AUDIT.md MUST land at
      `.waves/wave-2/deliverables/TEST_AUDIT.md`. This is the only valid location.
    </deliverable_location>

    <three_waves>
      Test-Audit uses EXACTLY 3 waves with ONE deliverable per wave:
      - Wave 0: SURFACE_MAP.md       in `.waves/wave-0/deliverables/`
      - Wave 1: GAP_ANALYSIS.md      in `.waves/wave-1/deliverables/`
      - Wave 2: TEST_AUDIT.md        in `.waves/wave-2/deliverables/`
    </three_waves>

    <no_test_execution>
      This mode does NOT run the test suite. Running tests is the user's job (or a future `/sc-test-run` command's). If the user wants execution + coverage numbers, suggest they run their framework's coverage tool and feed the output back into a fresh `/sc-test-audit` for re-grounded analysis.
    </no_test_execution>
  </critical_protocol>
</mode_overview>

<wave_structure>
  <wave_0>
    <name>Surface map</name>
    <purpose>
      Read what exists. Map the source surface (entry points, public APIs,
      security-sensitive paths, data writes) and inventory the existing tests
      (framework, structure, what they assert). Wave 1 cannot prioritize gaps
      without this grounding.
    </purpose>

    <team_composition>
      - Surface Cartographer: Walks the source tree, identifies entry points (HTTP routes, CLI commands, exported library APIs, event handlers), lists each by location.
      - Security Path Finder: Identifies security-sensitive paths — auth handlers, authorization checks, payment / value-moving code, secret handling, external-API surfaces, user-input ingress points.
      - Test Inventory: Detects the framework (or reads from the user's `Framework` answer), walks the test tree, lists every test file with what it covers (unit / integration / e2e per the test's actual content).
      - Protocol Reader: Reads `~/.claude/sc/protocols/Testing & Quality Assurance Protocol.md` and `~/.claude/sc/protocols/SECURITY_CHECKLIST.md` for the standards this audit judges against.
      - Record Keeper: Consolidates findings into SURFACE_MAP.md.
    </team_composition>

    <deliverables>
      <deliverable path=".waves/wave-0/deliverables/SURFACE_MAP.md">
        Single document containing:
        - Source surface table: ID, kind (HTTP route / CLI / library API / event handler / etc.), location (file:lines), stakes (security / data / external / cosmetic)
        - Security-sensitive paths called out separately with their auth/authz/secret/value-moving classification
        - Test inventory table: file, framework, kind (unit / integration / e2e), surface IDs it covers, last-modified date
        - Framework detected (or accepted from the user) plus any unusual config (e.g. test pyramid distribution, mocking strategy)
        - Protocol standards being applied (cite the two protocols + sections most relevant)
      </deliverable>
    </deliverables>

    <instructions>
      1. Read first, infer second. Use Glob, Grep, and Read on the actual repo. Every surface entry must cite a real file path.
      2. Detect entry points by convention: HTTP routes (Express/Fastify route registrations, FastAPI/Flask decorators, Go `http.Handle*`), CLI commands (commander/yargs, click, cobra), library exports (`index.ts`/`__init__.py`/`mod.rs`), event handlers (job queues, pub/sub subscribers).
      3. Security-path classification uses the SECURITY_CHECKLIST taxonomy: AuthN/AuthZ, secrets/PII, value-moving (payments, on-chain), external network, user-input ingress, file-system writes, DB mutations.
      4. For each test file, scan its contents to classify it: unit (mocks dependencies), integration (touches real services / DB / network), e2e (drives the system through real entry points). Don't trust filename conventions alone.
      5. If no tests at all exist, SURFACE_MAP.md still produces the source-side map; Wave 1 will treat the entire surface as a gap.
    </instructions>
  </wave_0>

  <wave_1>
    <name>Gap analysis</name>
    <purpose>
      Cross-reference Wave 0's surface map against its test inventory. For each
      uncovered surface, decide whether coverage is genuinely warranted (some
      paths legitimately don't need tests) and what kind of test fits best
      (unit, integration, e2e). Prioritize by stakes × likelihood of regression.
    </purpose>

    <team_composition>
      - Coverage Cross-Referencer: For each source-surface ID in Wave 0, identifies which existing tests cover it (or marks "uncovered"). Produces a coverage matrix.
      - Integration Spotter: Identifies multi-component flows whose individual units are unit-tested but whose contract between units is not tested as a whole — the exact gaps integration tests are for.
      - Security Coverage Auditor: Cross-references the security-sensitive paths from Wave 0 against the test inventory; flags any auth/authz/value-moving/secret path without coverage. Cites `SECURITY_CHECKLIST.md` sections.
      - Prioritizer: Scores each gap by stakes (Critical / High / Medium / Low / Info per Rule 7) × regression-likelihood (high-churn code = higher; stable boring code = lower).
      - Record Keeper: Consolidates into GAP_ANALYSIS.md.
    </team_composition>

    <deliverables>
      <deliverable path=".waves/wave-1/deliverables/GAP_ANALYSIS.md">
        Consolidated document containing:
        - Coverage matrix: surface ID × test IDs, with "covered / partially / uncovered" status per cell
        - Integration gaps: multi-component flows that need an integration test that doesn't exist; each entry cites the unit tests that exist and what they're NOT proving together
        - Security gaps: every security-sensitive path without coverage, with severity and a citation to the SECURITY_CHECKLIST section it violates
        - "Doesn't need a test" list: surfaces explicitly excluded from gaps (cosmetic helpers, trivial getters, generated code) with a one-line reason — defending the exclusion is part of the audit
        - Prioritized gap list: sorted by stakes × likelihood, ready to drive Wave 2's recommendations
      </deliverable>
    </deliverables>

    <instructions>
      1. The coverage matrix is the heart of this wave. If a surface ID has no row, the audit is incomplete.
      2. An integration gap requires evidence of the contract that's untested: which units interact, and what the interaction must prove. "X and Y don't have integration tests together" is not enough — specify the contract.
      3. Security gaps are non-negotiable in the report. Even if the user set the floor to "Medium and above," security gaps surface at their actual severity (often Critical/High).
      4. "Doesn't need a test" is a real category. Don't pretend every line needs coverage. But every exclusion gets a one-line reason in the report — auditors disagree later, having the reason on record makes the disagreement productive.
      5. Prioritization formula: Severity × Regression-likelihood. High-churn code with high stakes = top of the list. Stable code with low stakes = bottom or excluded.
    </instructions>
  </wave_1>

  <wave_2>
    <name>Audit report</name>
    <purpose>
      Synthesize Wave 0's surface map and Wave 1's gap analysis into a single
      TEST_AUDIT.md that gives the user a prioritized action list, not just an
      inventory.
    </purpose>

    <team_composition>
      - Audit Author: Drafts the TEST_AUDIT.md narrative (preamble, summary, top gaps, full gap list, exclusions, next steps).
      - Recommendation Engineer: For each top gap, drafts a concrete next step — what test type to add, what entry point to exercise, what assertion to make. NOT the test code itself; the prescription.
      - Issue Tracker Integrator: Asks the user during this wave (via `AskUserQuestion`) whether to log gaps as Rule-7 entries to `docs/audit/ISSUE_TRACKER.md`. If yes, drafts one Open issue per gap above the severity floor. The ask is deliberately deferred to Wave 2 — the user can decide once the report's shape is visible.
      - Record Keeper: Finalizes TEST_AUDIT.md and writes issue-tracker entries (if requested) under user-gated confirmation.
    </team_composition>

    <deliverables>
      <deliverable path=".waves/wave-2/deliverables/TEST_AUDIT.md">
        CRITICAL: The only valid location for TEST_AUDIT.md.
        Complete audit report including:
        1. Preamble: scope, framework, emphasis, severity floor, standards applied
        2. Executive summary (3-5 sentences for the human reader)
        3. Top gaps (the highest-priority items — usually 3-7 entries)
        4. Full gap list (everything above the severity floor, sorted by priority)
        5. Per-gap recommendation: severity, location, what kind of test fits, the contract to assert, the entry point to exercise
        6. Exclusions ("doesn't need a test"): surfaces deliberately not flagged, with one-line reasons
        7. Suggested next steps: which `/sc-tests` invocations would fill the top gaps (when /sc-tests ships); for now, the prescription is enough
        8. If the user confirms (in this wave's `AskUserQuestion` ask) that gaps should be logged as Rule-7 entries: a "logged" section listing the IDs written to `docs/audit/ISSUE_TRACKER.md`. Otherwise: a one-line note that issue-tracker logging was declined.
      </deliverable>
    </deliverables>

    <instructions>
      1. The Executive summary is for the human reader. Keep it under 5 sentences. State the overall health, the count of gaps by severity, and the single most important action.
      2. Top gaps are the report's center of gravity. Don't bury the lede — the user must be able to know what to fix from the first screen.
      3. Recommendations are concrete. "Add an integration test for the checkout flow" is too vague. "Add an integration test exercising POST /checkout that asserts (a) inventory decremented, (b) payment recorded, (c) email queued; use a real DB, mock only the payment provider" is concrete enough to act on.
      4. Issue-tracker entries (if requested) use the exact Rule 7 format from `AGENTS.md`. Ask the user before writing them — they land in a tracked file.
      5. Suggested next steps point at other Shadow Clone modes where useful: `/sc-tests` (when it ships) to generate from the prescriptions; `/sc-audit` for adjacent security audits; `/sc-debug` if any uncovered code is also a known bug.
    </instructions>
  </wave_2>
</wave_structure>

<audit_guidelines>
  <principle>
    Read the code first. Every gap, every exclusion, every recommendation cites
    a real file path and a real test file (or "missing"). A gap without a
    citation is a guess.
  </principle>

  <principle>
    Coverage percentages are not the goal. The goal is proving the system
    behaves correctly in the situations that matter — security paths, value-
    moving flows, multi-component contracts. Two well-chosen integration tests
    beat fifty redundant unit tests.
  </principle>

  <principle>
    Exclusion is a deliverable. "Doesn't need a test" with a reason is more
    valuable than silent omission, because the reason lets a future auditor
    disagree productively.
  </principle>

  <principle>
    Security gaps surface at their actual severity, even below the user's
    severity floor. A user who sets the floor to "Medium" but has an
    unauthenticated admin endpoint still sees the Critical finding.
  </principle>

  <principle>
    The auditor is not the test author. This mode produces prescriptions, not
    test code. Generation is a separate concern (`/sc-tests`, Phase C).
  </principle>
</audit_guidelines>

<success_criteria>
  <criterion>Every surface ID in SURFACE_MAP.md appears in GAP_ANALYSIS.md's coverage matrix</criterion>
  <criterion>Every security-sensitive path is classified and audited regardless of the user's severity floor</criterion>
  <criterion>TEST_AUDIT.md's recommendations are concrete enough to act on without follow-up clarification</criterion>
  <criterion>Exclusions are listed with one-line reasons</criterion>
  <criterion>Issue-tracker entries (when the Wave-2 user confirmation is `yes`) follow the Rule 7 format and were user-confirmed before write</criterion>
  <criterion>The auditor never runs tests, never modifies source, never writes test code</criterion>
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

- `Testing & Quality Assurance Protocol.md` — the primary standard; the test-pyramid guidance and integration-test discipline live here
- `Audit Protocol.md` — the audit cadence, finding format, and escalation rules
- `Documentation Standards for Software Teams.md` — TEST_AUDIT.md is a report; treat it as documentation

When a finding flags a protocol violation, cite the protocol filename and section so the Builder can verify.

---

## Subagents & wave coordination

Spawning is governed by the **Shadow Clone Wave & Subagent Coordination Protocol** at `~/.claude/sc/protocols/Shadow Clone Wave & Subagent Coordination Protocol.md`. Read it once at session start; cite §number in audit logs when a decision deviates from the default.

### This mode's defaults

- **Wave count:** 3 (Surface map, Gap analysis, Audit report). Hard ceiling at 5.
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

Acknowledge that Test-Audit mode is active, run the Step 0 precondition check, ask the Step 1 `AskUserQuestion` batch (all 5 questions in one call), then begin Wave 0.
