---
description: Shadow Clone quick-fix mode — fastest path to a small, focused change. Minimal team, no waves, deliverable inline.
---

You are now operating in **Shadow Clone Quick-Fix mode**. Quick-Fix is the
opposite of a full orchestration: a single coherent change, made
deliberately, reviewed against the Gnosis Verification gate before it
ships. No waves, no parallel specialists, no `.waves/` directory write.

Use this when:
- A bug has been pinpointed and the fix is < ~50 lines.
- A focused refactor or rename touches one module.
- A doc/comment correction or a config tweak.
- Anything where spinning up a multi-wave team would be overkill.

If the change is larger or the diagnosis is unclear, recommend
`/sc-feature` (new capability), `/sc-debug` (unclear root cause), or
`/sc-refactor` (cross-module restructure) instead, and stop.

---

## Step 1 — Capture context (ask before touching code)

Use the **AskUserQuestion** tool to ask the user, in one batch:

1. **Issue** (header `Issue`) — what is broken / what needs to change.
   Free-text. Cite a file:line or a symptom.
2. **Severity** (header `Severity`) — options: `Trivial`, `Low`,
   `Medium`, `High`, `Critical`. Drives how much verification rigor
   the fix needs.
3. **Scope guard** (header `Scope`) — options: `Single file`,
   `Single function`, `Up to 3 related files`, `Touch whatever it
   takes (escalate if > 3)`. Hard stop on over-reach.
4. **Verification** (header `Verify`) — options: `Existing tests must
   still pass`, `Add a regression test`, `Manual smoke test step`,
   `No automated verification (justify why)`. Sets the success criterion
   up front so it isn't an afterthought.

Wait for answers. Echo a one-line scope confirmation, then proceed.

---

## Step 2 — Apply the Gnosis verification gate to the diagnosis

Before changing code, the fix needs evidence the issue is real. Per
`~/.claude/sc/protocols/Gnosis Verification Protocol.md` §3, you need
at least one of:

- **Reproduction** — exact steps that exhibit the issue.
- **Failing test or assertion** — that demonstrates the bug.
- **Mechanical observation** — `file:line` + a closed reasoning chain
  showing why the current code is wrong.

If you can't establish at least one of these from what the user gave
you (plus reading the code), say so and **stop**. A guessed fix is
worse than no fix. Recommend `/sc-debug` instead.

---

## Step 3 — Make the change

1. **Read** the affected file(s) fully before editing — do not patch
   from a snippet.
2. **Edit** only what the issue requires. Do not opportunistically
   refactor surrounding code; that violates the scope guard the user
   set in Step 1.
3. **Preserve** existing patterns — naming, error handling style,
   import order. Match the file's conventions.
4. **No new dependencies** without surfacing it to the user first.
5. Apply the relevant Core protocols at
   `~/.claude/sc/protocols/`:
   - `Functional Programming & Purity Protocol.md` — pure-by-default,
     immutable, composition.
   - `Comprehensive Code Quality and Consistency Protocol.md` — naming,
     size limits, no dead code.
   - `Error Handling & Resilience Protocol.md` — explicit errors, no
     silent failures.
   - `SECURITY_CHECKLIST.md` — if the fix touches input handling,
     filesystem, network, or auth.

If the scope guard from Step 1 is violated mid-fix (e.g. the issue
turned out to need 4 files instead of 3), **stop and escalate** to the
user. Do not silently expand scope.

---

## Step 4 — Verify per the user's choice in Step 1

- **Existing tests must still pass** — run them. Report results.
- **Add a regression test** — write one that fails before your change
  and passes after. Cite the test path.
- **Manual smoke test step** — give the user the exact command or
  click sequence that confirms the fix.
- **No automated verification** — justify why (e.g. doc-only change,
  config tweak with no execution path) and note that the user is
  accepting that risk.

If verification fails (test still red, smoke test still broken), do
not declare the fix done. Either iterate or escalate.

---

## Step 5 — Dispatch `/sc-echo` paired review (if active)

If echo mode is on (the user has activated `/sc-echo` in this session),
dispatch a review of the changed files before declaring the unit done.
This is the same loop as any other Shadow Clone work unit — up to 3
rounds, address every finding, log residuals to
`docs/audit/ISSUE_TRACKER.md` if you hit the cap.

If echo mode is **not** on, recommend the user turn it on for fixes of
Medium severity or higher — paired review catches subtle regressions
that solo loops miss.

---

## Step 6 — Report

Tell the user, in this order:

1. **What changed** — file paths and a one-line summary per file.
2. **Why it was the right fix** — one sentence citing the evidence
   from Step 2.
3. **How it was verified** — concrete result of Step 4.
4. **Echo verdict** if you dispatched a review.
5. **Anything you noticed but didn't change** — if you saw a related
   issue out of scope, mention it as a `/sc-quick-fix` follow-up or a
   `/sc-feature`/`/sc-refactor` candidate.

No `.waves/` directory is created. Quick-Fix's deliverable is the diff
itself; the report above is the hand-off.

---

Acknowledge that Quick-Fix mode is active, then begin Step 1 by asking
the four context questions.
