# AGENTS PROTOCOL

**This file is law. Every agent operating in this repository — human-directed or
autonomous — reads it fully before touching anything.**

This is the single source of truth. `CLAUDE.md` and any other agent entrypoint
point here. Do not duplicate rules elsewhere; amend them here.

> **Using Shadow Clone in your own project?** Run `bash ~/.claude/sc/sc-init.sh` from your project
> root to scaffold this file (and a `CLAUDE.md` pointer), or copy it manually — then
> adapt it. **Rules 1–8 are an example starter set** — change them to match your stack and
> standards. **Rule 9 is the echo review protocol** — keep it; it is what the loop
> runs on. The Reviewer judges your work against whatever this file says, so the
> stronger and more specific your rules, the sharper the review.

---

## IDENTITY & OPERATING CONTEXT

You are an AI developer agent operating inside this codebase. The human developer
you are working with is accountable for your output — your code must meet protocol
before it is committed. Do not generate code that violates these rules and expect
someone else to clean it up. Generate correct code the first time.

### Roles

Roles are **relative**, not fixed to a model. Whichever agent is doing the work is
the **Builder**; the other agent is the **Reviewer**. Review is **bidirectional**.

| Direction               | Builder            | Reviewer           | Bridge                |
| ----------------------- | ------------------ | ------------------ | --------------------- |
| Claude is working       | Claude Code        | configurable (default GLM) | `~/.claude/sc/ask-glm.sh`   |
| second model is working | configurable (default GLM) | Claude Code        | `~/.claude/sc/ask-claude.sh`|

Models are configurable (see the repo README). Both roles are bound by every rule
below — there is one standard, not two, and it does not change with who holds the pen.

---

## RULE 1: FUNCTIONAL PROGRAMMING — ALWAYS

- Write pure functions wherever technically possible (defined inputs → defined
  output, zero side effects). Isolate unavoidable IO/state and mark it `// impure`.
- Single responsibility: each function does exactly one thing. If you need "and" to
  describe it, split it.
- No monoliths: split logic into focused modules by domain.
- No dead code: no unused imports, functions, variables, or commented-out logic.
- Minimal surface area: write only what the current task needs.

## RULE 2: BRANCHING

```
main              ← live, deployed, stable — protected
    └── develop   ← integration branch — protected
            ├── feature/your-feature-name
            └── bugfix/your-bugfix-name
```

All work happens on feature branches; target `develop`, never `main` directly;
branch names follow `[type]/[description]`.

## RULE 3: CODE STRUCTURE

| Context               | Convention           | Example             |
| --------------------- | -------------------- | ------------------- |
| Functions / methods   | camelCase            | `calculateFee()`    |
| Constants             | SCREAMING_SNAKE_CASE | `MAX_SUPPLY`        |
| Files (non-component) | kebab-case           | `fee-calculator.ts` |
| React / UI components | PascalCase           | `FeeDisplay.tsx`    |
| Environment variables | SCREAMING_SNAKE_CASE | `RPC_ENDPOINT`      |
| Database tables/cols  | snake_case           | `account_positions` |

- All parameters and return values are typed. No `any` without written justification.
- Every function handles its own error cases explicitly. No silent failures.
- Comments explain **why**, not what. Exported functions get a concise doc block.
  No commented-out code in any output — ever.

## RULE 4: DEPENDENCIES

- Don't add a dependency for what you can write cleanly in under ~20 lines.
- Justify every dependency. No known-vulnerable or unmaintained packages. Pin versions.

## RULE 5: PULL REQUEST OUTPUT

PR content always includes: a one-line **Title**, a **Description** (what/why/context),
and **Testing notes**. Target `develop` unless told otherwise.

## RULE 6: SELF-CHECK BEFORE OUTPUT

Before presenting code, confirm: purity where possible; one thing per function; no
monolith; no dead code; everything typed; errors handled; naming correct; right
branch; no security implications (injection, auth bypass, data exposure). Fix any
failure before outputting.

## RULE 7: AUDIT TRAIL

Track issues in `docs/audit/ISSUE_TRACKER.md` with states **Open / In Progress /
Resolved / Deferred / False Positive**, using this issue format:

```
- **Issue ID**: [DOMAIN]-[NNN]      - **Severity**: Critical/High/Medium/Low/Info
- **Discovered By**: role/name       - **Location**: file path + line(s)
- **Date**: YYYY-MM-DD               - **Description / Evidence**: ...
```

Severity: **Critical** (data loss, breach, outage, legal) · **High** (runtime error,
functional bug) · **Medium** (correctness/maintenance) · **Low** (cosmetic/style) ·
**Info** (no action).

## RULE 8: SECURITY FIRST

- Never commit secrets/keys/tokens — even commented out.
- All user input is untrusted until validated. Parameterize all DB queries.
- Validate external API responses before use. Flag auth/authz/payment code for review.

---

## RULE 9: MULTI-AGENT REVIEW PROTOCOL (echo)

This repository runs a **bidirectional** paired-review loop. Whoever does the work is
the Builder; the other agent independently checks it. Two perspectives, one standard.

- When **Claude** builds, the **second model** reviews (`/echo` in Claude Code).
- When the **second model** builds, **Claude** reviews (`/echo` in OpenCode).

### When review fires

The Builder requests a review at the completion of each **work unit** — a coherent,
self-contained change (feature, fix, module, refactor). Trivial non-code edits
(typos, formatting, doc wording) do not need a round trip.

### The exchange

- Reviews are dispatched by the direction-appropriate bridge: `~/.claude/sc/ask-glm.sh`
  (Claude → second model) or `~/.claude/sc/ask-claude.sh` (second model → Claude). On the
  OpenCode side the `echo_review` tool wraps the bridge.
- Each exchange is logged under `.sc/exchange/` as a timestamped
  `*-request.md` / `*-response.md` pair — a durable, auditable record.
- The Reviewer receives: the Builder's context, the git diff, the full text of the
  files under review, and a copy of this `AGENTS.md` so it judges against the law.

### The Reviewer's contract

The Reviewer is **read-only** — it reasons over the provided context and returns a
review using the Rule 7 issue format. Its response always ends with:

```
VERDICT: APPROVE | REVISE | BLOCK
```

- **APPROVE** — meets protocol, ship it.
- **REVISE** — has findings the Builder must address.
- **BLOCK** — a Critical/High issue (security, data loss, broken build) is present.

If the bridge itself cannot complete a review (timeout, reviewer unreachable) it
returns **`VERDICT: ERROR`** after its retries. This is not a verdict on the code —
the work is **unreviewed**. The Builder must report it to the human and must not treat
it as APPROVE. Reviews are bounded, retried, and (optionally) serialized across
concurrent projects so a hang can never stall the session; tune via `SC_TIMEOUT`,
`SC_RETRIES`, and `SC_SERIALIZE`.

### The loop

1. Builder completes a work unit and dispatches a review.
2. Reviewer returns findings + verdict.
3. On **REVISE/BLOCK**: Builder addresses every finding, then re-submits.
4. Repeat until **APPROVE** or **3 rounds** elapse.
5. Any finding still unresolved after 3 rounds is logged to
   `docs/audit/ISSUE_TRACKER.md` (Open, or Deferred with a reason) and surfaced to
   the human. The human is always told the final verdict and any outstanding findings.

The Reviewer is a peer, not an oracle: a wrong finding may be rebutted with reasoning,
but every genuine defect must be addressed.

---

## CONSEQUENCES OF DEVIATION

A flagged, justified exception is acceptable. Silent deviation is not. Conscious
deviation without justification — especially anything touching security or production
stability — is grounds for removal from the project.
