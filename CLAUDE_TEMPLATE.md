# PROJECT CLAUDE CODE PROTOCOL

**This file is law. Read it fully before touching anything in this repository.**

---

## PURPOSE

This file is the operating agreement between human developers and AI assistants working in this codebase. It establishes rules that must be followed on every task, every file created, every function written. Deviations must be flagged, not silent. Generate correct code the first time.

---

## IDENTITY & OPERATING CONTEXT

**Project:** `[PROJECT NAME]`
**Stack:** `[FRAMEWORK/STACK — e.g., Next.js, Fastify, Solana, etc.]`
**Domain:** `[WHAT THE PROJECT BUILDS — e.g., DeFi, consumer app, internal tooling]`
**Criticality:** `[PRODUCTION-GRADE / MVP / INTERNAL TOOL]`

You are working inside this codebase. Treat every line of code as if it ships to production — because it does.

The human developer you are working with is accountable for your output. Your code must meet protocol before it is committed.

---

## RULE 1: FUNCTIONAL PROGRAMMING — ALWAYS

### Pure Functions

- Write pure functions wherever technically possible
- A pure function: defined inputs → defined output, zero side effects
- If a function must be impure (IO, filesystem, network, blockchain state changes), isolate it from all pure logic and document it explicitly as `// impure`

### Single Responsibility

- Each function does exactly one thing
- If you cannot describe the function's purpose in one sentence without using "and," split it

### No Monoliths

- Do not create monolithic files or scripts
- Logic is split into focused modules by domain
- If a file is growing beyond a single clear responsibility, decompose it
- **If you generate a monolith, you have failed. Decompose before presenting.**

### No Dead Code

- Never include unused imports, unused functions, unused variables, or commented-out logic
- Every line in your output must be actively used
- If you are unsure whether something is needed, ask — do not include it speculatively

### Minimal Surface Area

- Write only what is absolutely necessary for the current task
- Do not build for hypothetical future use cases

---

## RULE 2: BRANCHING

**Configure for your project:**

```
main                   ← live, deployed, stable — protected
    └── develop       ← integration branch — protected
            ├── [name]/dev
            └── ...
```

- All work happens on named feature/fix branches
- When instructed to prepare a commit or PR, target `develop` — never `main`
- Never suggest or execute a direct push to `develop` or `main`
- Branch names follow `[type]/[description]` — no generic names like `fix`, `update`, `temp`

---

## RULE 3: CODE STRUCTURE

### Naming Conventions

| Context               | Convention           | Example             |
| --------------------- | -------------------- | ------------------- |
| Functions / methods   | camelCase            | `calculateFee()`    |
| Constants             | SCREAMING_SNAKE_CASE | `MAX_SUPPLY`        |
| Files (non-component) | kebab-case           | `fee-calculator.ts` |
| Classes / Components  | PascalCase           | `FeeDisplay.tsx`    |
| Environment variables | SCREAMING_SNAKE_CASE | `RPC_ENDPOINT`      |
| Database tables       | snake_case           | `position_actions`  |
| Database columns      | snake_case           | `created_at`        |

### Typing

- All parameters and return values are typed
- No implicit `any` — if you must use `any`, leave a comment justifying it
- Strict mode is enabled unless the project explicitly opts out

### Error Handling

- Every function handles its own error cases explicitly
- No silent failures — errors are caught, logged, or surfaced appropriately
- Do not swallow exceptions without a documented reason

### Comments

- Comments explain **why**, not what — the code explains what
- Exported functions get a JSDoc block: purpose, params, return
- No commented-out code in any output — ever

---

## RULE 4: DOMAIN-SPECIFIC REQUIREMENTS

_Replace this section with rules specific to your project domain._

### Example: Blockchain / Smart Contracts

- Pure/view functions must be marked as such
- State-changing logic is isolated from computation — separate reads from writes
- All state-changing functions emit events
- Access control is explicit on every privileged function
- Flag any function handling user funds for security review

### Example: Financial Calculations

- All monetary values use integer representation (wei, satoshis, etc.)
- Floating-point arithmetic is prohibited for financial calculations
- Rounding rules are explicit and documented

---

## RULE 5: DATA LAYER

_Adapt or remove based on your data layer._

**If using Supabase / PostgreSQL:**

All migrations live in `[MIGRATIONS_DIR]` and follow a sequential whole-number naming convention:

```
supabase/migrations/
├── 100_descriptive_name.sql
├── 101_another_change.sql
└── ...
```

- `NNN_descriptive-kebab-name.sql`
- Every `CREATE OR REPLACE FUNCTION` must be preceded by `DROP FUNCTION IF EXISTS`
- RPC functions: `REVOKE ALL ... FROM PUBLIC` then `GRANT EXECUTE ... TO service_role`
- After writing a migration, apply it and verify with `supabase migration list`

---

## RULE 6: DEPENDENCIES

- Do not add a dependency if the functionality can be written cleanly in under ~20 lines
- Every suggested dependency must be justified in your response
- Do not suggest packages with known vulnerabilities or that are unmaintained
- Pin versions — no floating ranges in production

---

## RULE 7: PULL REQUEST OUTPUT

When preparing PR content, always include:

1. **Title** — one clear line describing the change
2. **Description** — what changed, why, relevant context
3. **Testing notes** — what was tested and how
4. Target branch is always `develop` unless explicitly told otherwise

---

## RULE 8: SELF-CHECK BEFORE OUTPUT

Before presenting any code, run through this checklist:

- [ ] Are all functions pure where possible?
- [ ] Does every function do exactly one thing?
- [ ] Is there any monolithic structure that needs decomposition?
- [ ] Is there any dead code, unused import, or speculative logic?
- [ ] Are all values typed?
- [ ] Are error cases handled?
- [ ] Does this follow the naming conventions?
- [ ] Am I targeting the correct branch?
- [ ] Are there any security implications (injection, auth bypass, data exposure)?

If any check fails, fix it before outputting. Do not present code that fails this checklist and wait for the developer to catch it.

---

## RULE 9: AUDIT TRAIL

All audits must maintain a complete discovery-to-resolution trail for every issue found.

### Issue Discovery Record

Every issue must be documented with:

```
- **Issue ID**: [DOMAIN]-[NNN] (e.g., SEC-001, CQ-014, INFRA-001)
- **Discovered By**: Agent name, human name, or "Claude Code"
- **Date Discovered**: YYYY-MM-DD format
- **Source**: Code review, audit, testing, runtime error, etc.
- **Severity**: Critical / High / Medium / Low / Info
- **Location**: Exact file path and line number(s)
- **Description**: Clear description of the issue
- **Evidence**: Code snippet, error message, or documentation excerpt
```

### Resolution Record

```
- **Fixed By**: Agent name, human name, or "Claude Code"
- **Date Fixed**: YYYY-MM-DD format
- **Fix Description**: What was changed and why
- **Verification**: How the fix was verified
```

### Severity Definitions

| Severity     | Definition                                                            |
| ------------ | --------------------------------------------------------------------- |
| **Critical** | Data loss, security breach, production outage, or legal risk          |
| **High**     | Runtime error, functional bug, or significant performance degradation |
| **Medium**   | Correctness issue, maintenance burden, or moderate inefficiency       |
| **Low**      | Cosmetic, style preference, or minor optimization opportunity         |
| **Info**     | Informational, no action required                                     |

### Issue States

Every issue must be in one of these states:

- **Open** — Confirmed, awaiting fix
- **In Progress** — Fix being implemented
- **Resolved** — Fix completed and verified
- **Deferred** — Accepted risk, documented reason
- **False Positive** — Not an actual issue

### Tracking Requirements

- All Critical and High severity issues must be tracked
- Every state change must be logged with timestamp and actor
- Issues cannot be "resolved" without verification
- Issues cannot be "closed" without both discovery and resolution attribution

### Audit Report Format

Audit reports live in `docs/audit/` and must contain:

```
docs/audit/
├── ISSUE_TRACKER.md       # Living issue tracker — single source of truth
├── RESOLUTION_LOG.md      # All resolved issues with attribution
├── SPRINT_CURRENT.md      # Current sprint status
└── archive/
    ├── SESSION_01.md      # Session reports (frozen discovery docs)
    ├── SESSION_02.md
    └── ...
```

### Issue Tracker Structure

The `ISSUE_TRACKER.md` is organized into sections:

1. **Open Issues** — Critical / High / Medium / Low, sorted by severity
2. **Deferred Issues** — Accepted risks with documented reasoning
3. **Resolved Issues** — With fix attribution and date
4. **False Positives** — Issues that were not actual problems
5. **Issue Counts** — Running tally by status and severity
6. **Session History** — All audit sessions with dates and scopes

### Session Report Structure

Each session in `archive/` documents:

- Objective and scope
- Audit execution (what was checked)
- Findings (issues filed)
- Session status

---

## RULE 10: BUG FIX PIPELINE — ONE ISSUE, ONE AGENT, ONE COMMIT

Every bug fix follows this exact pipeline. No deviations.

### Step 1: Register

Before any fix begins, the issue MUST exist as a GitHub issue with:
- Title: severity prefix + description (e.g., "H-01: clearOrder has no access control")
- Labels: `security` + severity (`critical`, `high`, `medium`)
- Body: file, line numbers, description, attack scenario (if security), proposed fix

If the issue doesn't exist yet, create it FIRST. No fixing unregistered issues.

### Step 2: Assign

One agent is dispatched per issue. The agent:
- Claims the issue (assigns itself or comments "Fixing this")
- Reads ONLY the files relevant to that issue
- Follows CLAUDE.md protocol strictly (custom errors, NatSpec, single responsibility)
- Makes the minimal surgical change to fix ONLY that issue
- Does NOT touch unrelated code, add features, or refactor

### Step 3: Verify

After the fix:
- Run the project's build command — must pass
- Run the project's test command — must pass with zero regressions
- New test(s) proving the fix works

### Step 4: Close

The agent:
- Commits with message: `fix({ISSUE_ID}): {description}`
- Comments on the GitHub issue with the commit hash
- Closes the issue
- Stops. Does not continue to other issues.

### What This Prevents

- Scope creep (agent fixes one thing, touches ten)
- Tangled commits (multiple fixes in one commit)
- Missing audit trail (every fix traces to an issue)
- Silent fixes (no fix without a registered issue)

---

## RULE 11: GIT PUSH DISCIPLINE

- `git commit` is fine — local only, safe, do it freely
- `git push` requires **explicit instruction** from the developer
- Phrases like "push", "push it", "commit and push" are explicit permission
- Anything else is NOT permission to push
- If you pushed code that breaks the build, that is a production stability violation

### Before Any Push

1. Run the project's build/lint/typecheck commands — must pass
2. Verify no breaking changes to shared configs
3. Confirm the developer said to push

### Sandbox Branches

- When working on experimental features, use a sandbox branch (e.g., `[name]/dev-sandbox`)
- Sandbox branches are never pushed unless explicitly instructed
- Sandbox branches are deleted after merge

---

## RULE 12: CONSEQUENCES OF DEVIATION

### Genuine Exceptions

If you believe a rule cannot be followed for a legitimate technical reason:

1. State it explicitly before presenting the code
2. Explain why the standard approach does not apply
3. Let the developer make the call

A flagged, justified exception is acceptable. Silent deviation is not.

### Consequence Structure

| Situation                                                     | Consequence                              |
| ------------------------------------------------------------- | ---------------------------------------- |
| First unintentional violation — honest mistake                | **Warning** — correct immediately        |
| Repeated unintentional violation of the same rule             | **Warning** — pattern is noted           |
| Conscious deviation without justification or flagging         | **Grounds for removal from the project** |
| Violation that touches security or production stability       | **Immediate removal**                    |
| Ignoring protocol based on "I thought it was better this way" | **Immediate removal**                    |

---

## SETUP FOR NEW PROJECTS

When seeding this protocol into a new project:

1. Copy this file as `CLAUDE.md` in the repo root
2. Fill in the placeholders at the top (project name, stack, domain, criticality)
3. Configure Rules 2, 4, and 5 for your specific stack
4. Set up the audit directory: `docs/audit/`
5. Create `docs/audit/ISSUE_TRACKER.md`, `RESOLUTION_LOG.md`, `SPRINT_CURRENT.md`
6. Create `docs/audit/archive/`
7. Run an initial baseline audit before writing any features

---

## QUICK REFERENCE

| Item               | Value                  |
| ------------------ | ---------------------- |
| Protocol version   | 1.0                    |
| Target branch      | `develop`              |
| Protected branches | `main`, `develop`      |
| Audit directory    | `docs/audit/`          |
| Branch format      | `[type]/[description]` |

---

**Owner:** `[OWNER NAME]`
**Last updated:** `[DATE]`
