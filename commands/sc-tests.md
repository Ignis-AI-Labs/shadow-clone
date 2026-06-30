---
description: Shadow Clone tests mode — generate meaningful tests for work currently in scope. Surface-first, framework-aware, no coverage theater.
---

You are now operating in **Shadow Clone Tests mode**. This mode
generates tests that *prove something works*, not tests that lift the
coverage number. Surface-first: read the code, identify the contract,
write tests against the contract. Skip CRUD redundancy and trivial
getter/setter assertions unless the user explicitly asks for them.

Use this when:
- A feature just shipped (often after `/sc-feature` or `/sc-quick-fix`)
  and needs test coverage.
- An existing module has coverage gaps you want filled deliberately.
- You've run `/sc-test-audit` and want to act on a specific finding.

This is **not** a coverage chaser. It does not run the test suite, does
not produce coverage percentages, and does not generate placeholder
tests to satisfy a lint rule. See `/sc-test-audit` for diagnosis.

The deliverable is the test files themselves plus
`.waves/wave-1/deliverables/TESTS_SUMMARY.md` describing what was added,
what was deliberately not tested, and why.

---

## Step 1 — Capture context (ask before generating)

Use the **AskUserQuestion** tool to ask the user, in one batch:

1. **Scope** (header `Scope`) — what to test. Free-text: file paths,
   module names, or "the feature I just shipped" (you'll discover the
   diff). Don't accept "everything" — push back and ask for the
   highest-value slice first.
2. **Framework** (header `Framework`) — options: `Detect from repo`,
   `Jest`, `Vitest`, `Pytest`, `Go test`, `Cargo test`, `Other
   (specify)`. Drives the imports and assertion style.
3. **Test type emphasis** (header `Type`) — options:
   `Unit (isolated)`, `Integration (real deps)`,
   `End-to-end (real environment)`, `Mix`. Sets the dependency-mock
   posture.
4. **Tolerance for over-mocking** (header `Mocking`) — options:
   `Mock liberally (fast, isolated)`, `Mock only externals (real
   internal calls)`, `No mocking (everything real, slow)`. This is the
   single most important call — get it explicit so you don't generate
   tests the user will throw away.
5. **Team size** (header `Team`) — options: `Solo`, `2-3`, `4-7`,
   `8+`. Drives spawn cap. For one or two files, `Solo` is honest;
   bigger scopes benefit from parallel specialists.

Wait for answers. Echo a one-line scope confirmation, then proceed to
Wave 0.

---

## Step 2 — Run the methodology

### Wave 0 — Contract discovery

Read the in-scope code and the surrounding context. For each entry
point (exported function, HTTP route, CLI subcommand, public class
method), capture:

- **Contract** — what inputs are accepted, what outputs are produced,
  what side effects occur.
- **Edge cases** — empty / null / out-of-range inputs, concurrent
  callers, partial failures, retries.
- **Security-relevant paths** — input validation, authorization
  checks, secret handling, anything the SECURITY_CHECKLIST flags.
- **Existing tests** — what's already covered. Don't duplicate.

Deliverable: `.waves/wave-0/deliverables/TEST_CONTRACTS.md` — one
section per entry point with the contract + edge case list.

If you spawn specialists (per the team-size answer), the roles are:

- **Contract Reader**: walks the source for inputs/outputs.
- **Edge Case Analyst**: identifies the failure modes worth proving.
- **Existing Test Reader**: inventories what's already covered so the
  new tests don't duplicate.
- **Security Path Finder**: flags security-relevant entry points
  needing specific assertions per `SECURITY_CHECKLIST.md`.
- **Record Keeper**: writes `TEST_CONTRACTS.md`.

### Wave 1 — Generate tests

Using `TEST_CONTRACTS.md` as the source of truth, write tests in the
framework the user specified. Apply the protocols at
`~/.claude/sc/protocols/`:

- `Testing & Quality Assurance Protocol.md` — naming, structure,
  AAA / Arrange-Act-Assert, what to mock and what not to.
- `Functional Programming & Purity Protocol.md` — prefer pure-function
  testing; reach for mocks only when an impure dependency makes the
  test untrustworthy otherwise.
- `Error Handling & Resilience Protocol.md` — assert on the explicit
  error type, not just "throws."
- `SECURITY_CHECKLIST.md` — every security-relevant entry point gets
  at least one negative-case test (invalid input, unauthorized caller,
  malformed payload).

**House rules** for the tests themselves:

- One assertion per concept, multiple assertions per test are fine if
  they prove one behavior.
- Test names describe behavior (`returns_empty_array_when_input_is_null`),
  not implementation (`calls_foo`).
- No `console.log` / `print` in committed tests — if you need it for
  development, remove before the wave closes.
- Mock at the boundary the user asked for (Step 1 #4), not deeper.
- If a contract is too tangled to test cleanly, **say so** in the
  wave's deliverable — don't generate a test that lies. Recommend a
  `/sc-refactor` to untangle it first.

Deliverable: the test files themselves, written into the project at
the framework's conventional location (`__tests__/`, `tests/`, `spec/`,
etc.). Cite each file's path in `TESTS_SUMMARY.md`.

### Wave 2 — Summarize + flag what's not tested

Write `.waves/wave-1/deliverables/TESTS_SUMMARY.md` with:

- **Files added** — path + one-line purpose per file.
- **Contracts covered** — list from `TEST_CONTRACTS.md` and which test
  proves each.
- **Deliberately skipped** — anything you decided not to test, and why
  (genuine trivia, untestable-without-refactor, etc.). This is Rule 7
  honesty: surface what isn't covered so the user can decide.
- **Next steps** — if you noticed code that needs `/sc-refactor` or
  `/sc-debug`, list it. Tests reveal design issues; surface them.

If `/sc-echo` is active in the session, dispatch a review of the new
test files before declaring the unit done. Tests are code; they get
the same paired review.

---

## Closing

Tell the user what was generated, where it landed, and what wasn't
tested with the reason. Suggest running the test suite (you don't run
it yourself; that's their responsibility) and surface anything the
contract discovery flagged as worth a follow-up `/sc-refactor` or
`/sc-debug`.

---

Acknowledge that Tests mode is active, then begin Step 1 by asking the
five context questions.
