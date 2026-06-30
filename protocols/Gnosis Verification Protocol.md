# Gnosis Verification Protocol

**Status**: Core (load-bearing — cited by every mode that produces findings)
**Origin**: User-mandated correction to flag-then-fix posture, 2026-06-30
**Etymology**: *gnosis* = direct, experiential knowledge. Inferred or
theoretical knowledge is not gnosis. A finding produced by inference
without confirmation is, by this protocol, not a finding.

## §1 — The principle

> **A bug that has not been verified is not a bug. It is a question.**

Every finding emitted by any Shadow Clone mode — audit, review,
optimization, refactor, debug, plan, research — must rest on **at least
one** of three evidence forms before it can be reported as a defect:

1. **Reproduction** — a deterministic sequence of steps the Builder can
   run that exhibits the defective behavior. Include the exact command,
   inputs, expected vs. actual output.
2. **Failing test** — a test (existing or proposed) that demonstrates
   the defect. If proposing, include the test body verbatim so the
   Builder can paste-and-run it.
3. **Direct mechanical observation** — a precise read of the code that
   shows the defect deterministically: `file:line` citation **plus** a
   one-sentence chain of reasoning that another reader can confirm by
   looking at the same lines. The reasoning must be *closed* — no
   "could," "might," "may," "potentially," "in theory."

A finding that cannot present at least one of these is a **research
question**, not a finding. Research questions are valuable; they belong
in a clearly-labeled separate section and **do not influence verdicts**.

## §2 — Why this protocol exists

The flag-then-fix posture optimized for false-negative avoidance:
*report everything that might be real, let remediation prioritize.* In
practice this fills issue trackers and review reports with inferred
defects that consume the Builder's most expensive resource — time — to
investigate before being marked false-positive. The cumulative cost of
investigating bad findings exceeds the cost of the rare verified bug
that escapes one verification cycle.

This protocol inverts the trade: **the Reviewer pays the verification
cost up front; the Builder gets only actionable items.** A real defect
that requires more verification than the Reviewer can give in-band gets
filed as a research question with a clear next step, not as a finding
the Builder must investigate to dismiss.

## §3 — What counts as evidence (concrete)

### Verified — REPORT as a finding

| Evidence shape | What to include |
|---|---|
| Reproduction | "Run `<exact command>` with `<exact input>`. Expected: `<X>`. Actual: `<Y>`." |
| Failing test | The test name, the assertion, and the expected vs. actual values. If new, paste the test body. |
| Mechanical observation | `path/file.ts:42-48` — "Line 45 calls `foo(x)` where `x` is `undefined` on the branch entered at line 42 because `bar()` returns `null` when `cond` is false (line 30)." The reasoning chain cites only lines a reader can verify in the diff. |
| Standards citation | "Violates `Functional Programming & Purity Protocol.md` §3 (no shared mutable state) — `path/file.ts:42` mutates `globalCache` from inside a function the protocol classifies as pure." Cite the protocol filename AND section. |

### Not verified — DO NOT REPORT as a finding

| Speculation shape | What to do instead |
|---|---|
| "X could be vulnerable to Y" | Move to **Research Questions**. Specify: what would prove or disprove it? |
| "If the caller passes an empty array, X would fail" | Verify by reading callers. If no caller does, it's not a finding. If a caller does, cite that line — that becomes the evidence. |
| "This looks like it might race under concurrent X" | Move to **Research Questions**. Propose the test that would expose the race. |
| "There may be a memory leak here" | Verify with a heap snapshot or measurement. Otherwise → Research Questions. |
| "The pattern feels wrong" | Either cite the specific protocol section it violates (then it's a Standards citation) or drop it. Aesthetic preferences are not findings. |

## §4 — Output shape

Modes that produce findings (audit, code review, echo paired-review)
MUST split their output into two sections:

```
## Findings (verified)

For each: severity, location, description, evidence, suggestion.
The **evidence** field is mandatory and names which of §3's three
shapes applies.

## Research Questions (unverified)

For each: a question, what would answer it, the smallest test or
observation that would convert it into a finding. These do NOT
contribute to BLOCK/REVISE verdicts.
```

If the Findings section is empty, the verdict is APPROVE — even if the
Research Questions section is long. Research Questions are leads, not
defects.

## §5 — Interaction with severity

Severity is bounded by evidence strength.

| Evidence shape | Maximum severity allowed |
|---|---|
| Reproduction + failing test | Critical |
| Failing test alone | High |
| Mechanical observation with closed reasoning chain | High |
| Standards citation (with §number) | Medium |
| Mechanical observation needing a small assumption | Low |

A "Critical" finding without a reproduction is downgraded to its
evidence-supported severity. The Reviewer makes the downgrade
explicitly; the Builder does not have to argue for it.

## §6 — Operator override

The user (operator of the system) may declare a finding verified by
fiat when they have out-of-band evidence the Reviewer cannot see (a
production log, an incident report, a customer ticket). In that case
the finding stays as a finding; the evidence field reads
`operator-attested: <one-line summary>`. This is the only escape hatch
and it is logged.

## §7 — Relationship to other protocols

- **`Audit Protocol.md`**: this protocol gates what can become an
  AUDIT-NNN entry. Open issues that don't meet §3 are filed as research
  questions in the audit report, not as tracker entries.
- **`Error Handling & Resilience Protocol.md`**: a defensive-fallback
  finding requires evidence the fallback path is reachable — schema
  inference alone is sufficient if the schema makes the path
  unreachable; otherwise verify the caller chain.
- **`Shadow Clone Wave & Subagent Coordination Protocol.md`**: that
  protocol calls itself "the gnosis layer." Same root meaning, broader
  scope — Coordination is the gnosis of *how clones operate*;
  Verification is the gnosis of *what counts as truth in findings*.

## §8 — One-sentence quote for citation

> "A bug that has not been verified is not a bug. It is a question."
> — Gnosis Verification Protocol §1

Cite this in every mode's Standards block and every reviewer persona so
the rule is unmissable.
