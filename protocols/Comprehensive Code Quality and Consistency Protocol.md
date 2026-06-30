# Comprehensive Code Quality and Consistency Protocol v1.0

**Effective Date:** April 2026 | **Classification:** Engineering Standard — Mandatory | **Applicability:** All production codebases, all languages, all contributors (human and AI)

---

## Purpose

**Code quality failures are engineering failures with direct business consequences.** Every ambiguous variable name, swallowed error, and unchecked dependency is a latent defect that compounds over time. Stripe engineers spend **33% of their time** dealing with bad code and technical debt. Fortune 100 studies show that increasing code coverage from low levels to **80% reduces defect ratios from 84% to 7%**. Google's internal research ranks dead and abandoned code as the **#5 productivity hindrance** across all engineering teams.

This protocol establishes the minimum acceptable standard for all code entering production. It is not a guideline — it is a **deployment-blocking checklist** enforced identically for human-written and AI-generated code. Violations tagged **[CRITICAL]** halt deployment. Violations tagged **[HIGH]** block PR merge. Every rule is written to be programmatically verifiable by AI coding agents, CI/CD pipelines, and human reviewers.

The protocol is language-agnostic by design, with language-specific implementation notes where conventions diverge. It covers TypeScript, Rust, Python, Go, Solidity, Java, C++, and any other language following equivalent principles.

---

## How to use this protocol

**Status markers** indicate verification state for each checklist item:

- `[ ]` Not yet verified
- `[x]` Passing
- `[!]` Failing — requires remediation
- `[~]` Partial compliance — tracked for resolution
- `[N/A]` Not applicable to this project

**Severity tags** determine enforcement behavior:

| Tag | Meaning | Enforcement |
|-----|---------|-------------|
| **[CRITICAL]** | Deployment blocker | CI/CD pipeline MUST reject. Cannot ship. |
| **[HIGH]** | Merge blocker | PR MUST NOT merge until resolved. |
| **[MEDIUM]** | Must-track | Create ticket if not resolved in current PR. Fix within 30 days. |
| **[LOW]** | Advisory | Best practice. Reviewer discretion. |

**Workflow:** Before any production deployment, the responsible engineer (or AI agent) runs through all applicable sections. Each item is verified, marked, and the completed checklist is attached to the release artifact. Quarterly audits use this protocol as the assessment framework.

---

## 1. Naming conventions and semantic clarity

Naming is the most fundamental readability mechanism in code. Every identifier is read **10–50x more often** than it is written. Bad names force mental mapping; good names eliminate it entirely.

### Universal naming principles

- [ ] **[CRITICAL] NC-U1: All names must reveal intent without requiring a comment.** If a declaration requires an inline comment explaining what the identifier represents, the name has failed. A name must answer why it exists, what it does, and how it is used. Flag any variable/function declaration with an adjacent comment restating its purpose.

- [ ] **[CRITICAL] NC-U2: Names must be pronounceable English words or universally accepted abbreviations.** Permitted abbreviations: `url`, `http`, `id`, `num`, `max`, `min`, `db`, `io`, `api`, `ui`. All other abbreviations are banned. Detect identifiers with ≥3 consecutive consonants not on the whitelist.

- [ ] **[HIGH] NC-U3: Names must be searchable.** Single-letter names and raw numeric constants must not appear outside loop counters in ≤5-line scope or well-known mathematical constants. Lint rule flags single-letter variable usage outside `for`/`while` index declarations.

- [ ] **[HIGH] NC-U4: One word per concept, consistently.** Do not use `fetch`, `retrieve`, `get`, and `obtain` interchangeably. Pick one verb per semantic operation and enforce it project-wide via custom lint rules or dictionary-based scanning.

- [ ] **[HIGH] NC-U5: No noise-word class/module names.** Standalone names ending in `Data`, `Info`, `Manager`, `Processor`, `Handler`, `Helper`, `Utils`, or `Impl` are prohibited unless semantically qualified. `UserManager` says nothing that `UserService` or `UserRepository` doesn't say better.

- [ ] **[MEDIUM] NC-U6: Name length proportional to scope.** Short names (`i`, `n`) for ≤5-line scopes; descriptive names for broader scopes. Public API names should be concise but unambiguous. Follow Uncle Bob's scope-length rule.

- [ ] **[MEDIUM] NC-U7: Treat acronyms as single words.** `HttpClient` not `HTTPClient`; `parseJson` not `parseJSON`; `Uuid` not `UUID`. Exception: Python PEP 8 permits all-caps acronyms in CamelCase (e.g., `HTTPServerError`).

### Function naming

- [ ] **[CRITICAL] NC-F1: Function names must begin with a verb or verb phrase.** `calculate_total()`, `sendMessage()`, `parse_config()`. Functions perform actions; a verb-first name immediately conveys behavior. Language conventions: Python/Rust use `snake_case` verbs, JS/TS use `camelCase` verbs, Java uses `lowerCamelCase` verbs.

- [ ] **[HIGH] NC-F2: Boolean-returning functions must use predicate prefixes.** Required prefixes: `is_`, `has_`, `can_`, `should_`, `was_`, `will_`, `did_`. Flag functions with return type `bool`/`boolean` whose name lacks a predicate prefix.

- [ ] **[HIGH] NC-F3: Event handlers follow `handle{Event}` or `on{Event}` pattern.** In JS/TS/React: `handleClick`, `onSubmit`. Distinguishes handlers from general functions.

- [ ] **[MEDIUM] NC-F4: Conversion methods use standard prefixes.** `to_*` (returns new type), `into_*` (consumes self), `from_*` (static constructor), `as_*` (cheap reference cast). From Rust API Guidelines, applicable universally.

### Variable naming

- [ ] **[CRITICAL] NC-V1: No ambiguous abbreviations.** Banned: `tmp`, `val`, `ret`, `buf`, `cnt`, `mgr`, `srv`, `ctx`. Use `temporary_file`, `return_value`, `buffer`, `count`, `manager`, `server`, `context`. Enforce via banned-identifier list in linter config.

- [ ] **[HIGH] NC-V2: Boolean variables use predicate-style names; no negated names.** Use `isEnabled` not `isDisabled`. Negated booleans cause double-negative confusion in conditionals (`if (!isDisabled)`).

- [ ] **[HIGH] NC-V3: Collection variables use plural nouns.** `users`, `order_items`, `active_connections`. Singular for individual items. Flag variables typed as Array/List/Set/Vec whose name is singular.

- [ ] **[MEDIUM] NC-V4: Numeric variables include unit or role.** `timeout_seconds`, `distance_km`, `retry_count`, `max_connections`. Bare nouns (`timeout`, `distance`) risk unit-mismatch bugs.

### Constant and module naming

- [ ] **[CRITICAL] NC-C1: Constants use SCREAMING_SNAKE_CASE.** Python, Rust, JS/TS, Solidity, Java: `MAX_RETRIES`, `DEFAULT_TIMEOUT`. C++ non-macro constants: `kConstantName` per Google style. Enforce via lint rules on `const`/`static final` declarations.

- [ ] **[HIGH] NC-M1: File names follow language-idiomatic casing.** Python: `snake_case.py`. JS/TS: `camelCase.js` or `PascalCase.tsx` for components. Rust: `snake_case.rs`. Java: `PascalCase.java`. Go: `lowercase.go`. CI validates via filename regex.

### Naming anti-patterns

- [ ] **[CRITICAL] NC-A1: Hungarian notation is prohibited.** No `strName`, `iCount`, `bIsValid`, `arrUsers`. Modern type systems make type-encoded prefixes redundant. Regex detect common Hungarian prefixes.

- [ ] **[CRITICAL] NC-A2: Single-letter variables banned outside small loop indices and one-line lambdas.** Absolute ban on `l`, `O`, `I` (font ambiguity). Maximum loop body: 10 lines for single-letter index.

- [ ] **[HIGH] NC-A3: No misleading names.** A variable named `accountList` must be a list type. A function named `checkPermission` must not modify state. Flag container-suffix names (`*List`, `*Map`, `*Set`) mismatched with actual types.

- [ ] **[MEDIUM] NC-A5: Number-series naming prohibited.** No `item1`, `item2`, `data1`, `data2`. Each identifier must have a semantically distinct name.

---

## 2. Code formatting and style enforcement

Formatting debates waste engineering hours. The solution is **zero-choice automated formatting**: the formatter decides, humans comply, CI enforces. As Rob Pike said of gofmt: *"Gofmt's style is no one's favorite, yet gofmt is everyone's favorite."*

### Automated formatting

- [ ] **[CRITICAL] FMT-1: Every language must use its canonical opinionated formatter.** JS/TS: **Prettier**. Python: **Black** (line-length: 88). Rust: **rustfmt**. Go: **gofmt**. No manual formatting permitted. **100% of committed code must pass the formatter check.**

- [ ] **[CRITICAL] FMT-2: CI/CD must run formatter in check mode and fail the build on any diff.** `prettier --check .`, `black --check .`, `gofmt -l .`, `rustfmt --check`. This is a blocking gate, not advisory.

- [ ] **[HIGH] FMT-3: Format-on-save configured in shared editor settings.** Project must include `.vscode/settings.json` or equivalent with `editor.formatOnSave: true` and the correct default formatter.

- [ ] **[HIGH] FMT-4: Pre-commit hooks enforce formatting.** Use `pre-commit` framework (Python) or `husky` + `lint-staged` (JS). Configuration committed to repository.

### Linting

- [ ] **[CRITICAL] FMT-5: All linter warnings treated as errors in CI.** `eslint --max-warnings 0`, `clippy -- -D warnings`, `pylint --fail-under=10`. Zero warnings tolerated. If a warning is not worth fixing, suppress it with a justification comment.

- [ ] **[HIGH] FMT-6: Linter config committed to repository root.** `.eslintrc`, `.pylintrc`, `clippy.toml`, `.golangci.yml` — no reliance on developer-local configs.

- [ ] **[HIGH] FMT-7: Lint suppressions require justification comments.** Any `// eslint-disable-next-line`, `# pylint: disable=`, `#[allow()]` must include a comment explaining why. Suppressions without rationale are rejected in review.

### Whitespace and encoding

- [ ] **[HIGH] FMT-8: EditorConfig at repository root.** Every repository must contain `.editorconfig` specifying `root = true`, `indent_style`, `indent_size`, `end_of_line = lf`, `charset = utf-8`, `trim_trailing_whitespace = true`, `insert_final_newline = true`.

- [ ] **[HIGH] FMT-9: Line length limits per language.** Python: **88** (Black default). JS/TS: **100** (Prettier). Java: **100** (Google). Rust: **100** hard / 80 soft. Go: no hard limit. Shell: **80**. URLs and import paths may exceed limits when they cannot be meaningfully broken.

- [ ] **[HIGH] FMT-10: No trailing whitespace; files end with single newline; LF line endings.** Enforce via EditorConfig and `.gitattributes` (`* text=auto eol=lf`). CRLF/LF mixing creates massive noisy diffs.

- [ ] **[HIGH] FMT-11: UTF-8 encoding without BOM for all source files.**

### Import ordering

- [ ] **[HIGH] FMT-12: Canonical import order — stdlib → external → internal.** Three groups separated by blank lines, alphabetical within each. Enforce: `isort` (Python), `eslint-plugin-import` (JS/TS), `goimports` (Go), `rustfmt` with `group_imports = "StdExternalCrate"` (Rust). CI must verify.

- [ ] **[HIGH] FMT-13: No wildcard imports.** `from x import *` and `import * from` are prohibited except in explicit re-export files. Wildcard imports pollute namespaces and break static analysis.

---

## 3. Function and module design

Functions are the atoms of software architecture. Their size, shape, and interface design determine whether a codebase is maintainable or not. Research-backed thresholds follow.

### Function size and responsibility

- [ ] **[CRITICAL] FN-1: Each function must do exactly one thing.** Single Responsibility Principle at function level. Test: can you describe the function without using "and" or "then"? If not, split it. A function that requires section comments (`// Step 1:`, `// Step 2:`) should have those sections extracted into named functions.

- [ ] **[HIGH] FN-2: Function length soft limit — 30 lines of logic.** Hard limit: **50 lines** requiring explicit justification. Research basis: Google recommends reconsidering at **40 lines**; CodeClimate defaults to **25**; Clean Code advocates 5–20. **30 lines** balances readability with pragmatism — short enough to fit one screen, long enough to avoid excessive fragmentation.

- [ ] **[HIGH] FN-3: Maximum 4 parameters per function.** Functions with 5+ parameters must use an options object/struct/dataclass. CodeClimate default: **4**. Clean Code: ideal is 0–2, triadic (3) should be avoided. Every additional parameter exponentially increases the testing surface.

- [ ] **[HIGH] FN-4: Maximum nesting depth — 4 levels.** CodeClimate default: **4**. Linux kernel style: recommends max **3**. Each nesting level multiplies cognitive load. Deep nesting is the strongest predictor of "hard to understand" code.

- [ ] **[HIGH] FN-5: Use guard clauses to reduce nesting.** Handle edge cases, invalid inputs, and errors via early returns at the top. Keep the main logic path at minimum nesting depth. SonarQube explicitly recommends "flattening conditionals."

### Complexity thresholds

- [ ] **[CRITICAL] FN-6: Cognitive complexity ≤ 15 per function.** SonarQube default threshold. Cognitive complexity penalizes nesting with increasing increments, counts `switch` as 1 (not N), and ignores shorthand operators like `??`. A function with cognitive complexity **> 15 is a deployment blocker for new code**. Functions exceeding **10** should be reviewed for refactoring.

- [ ] **[HIGH] FN-7: Cyclomatic complexity ≤ 10 per function.** McCabe's original (1976) "reasonable upper limit." Functions at 11–15 require justification. Functions **> 15 must be refactored**. Each independent path requires a test case; CC > 10 makes exhaustive testing impractical.

### Return values and type safety

- [ ] **[CRITICAL] FN-8: Functions that can fail must communicate failure through the type system.** Rust: `Result<T, E>`. Go: `(value, error)` tuple. TypeScript: discriminated unions. Python: explicit `Optional[T]` only for legitimate "no value" domain concepts, not error signaling. Never return `null`/`undefined` as an error signal.

- [ ] **[HIGH] FN-9: No ambiguous return types.** Functions must not return different types conditionally (string on success, `false` on failure). Return type must be consistent and narrowly typed.

- [ ] **[HIGH] FN-10: Prefer pure functions.** Same inputs → same output, no side effects. Side-effectful operations (I/O, state mutation, network calls) must be isolated into clearly named functions pushed to system boundaries. Follow "functional core, imperative shell."

### Module design

- [ ] **[HIGH] FN-11: One module, one responsibility.** If a module's description requires "and," it should be split. Each file should have a single clear purpose.

- [ ] **[MEDIUM] FN-12: File length soft limit — 400 lines; hard limit — 500 lines.** CodeClimate default: **250** (strict). Long files indicate insufficient decomposition.

- [ ] **[MEDIUM] FN-13: Monitor instability metric.** `I = Ce / (Ca + Ce)` where Ce = efferent coupling, Ca = afferent coupling. Modules with efferent coupling > **20** types need refactoring attention. Use dependency-cruiser (JS/TS), `cargo-modules` (Rust), or NDepend (.NET).

---

## 4. Code readability and self-documentation

Code is read **10x more often** than it is written. Every readability investment pays compound returns.

### Comments

- [ ] **[CRITICAL] RD-1: Comments must not restate what code already expresses.** `// increment counter` above `counter++` must be deleted. Redundant comments decay into lies as code evolves.

- [ ] **[HIGH] RD-2: Comments must explain WHY, not WHAT.** Required comment types: intent/rationale, warnings of consequences, TODO/FIXME with tracker reference, workarounds with linked issue, regex/algorithm clarification. All other comments should be replaced by better naming.

- [ ] **[HIGH] RD-3: Commented-out code must be deleted.** Use version control to retrieve old code. Commented-out blocks confuse readers and clutter diffs.

- [ ] **[CRITICAL] RD-4: Replace magic numbers with named constants.** Every literal value used in logic (except `0`, `1`, `true`, `false`, `""`, `null`/`None`) must be assigned to a named constant. `if (retries > 3)` means nothing; `if (retries > MAX_RETRY_COUNT)` is self-documenting.

- [ ] **[HIGH] RD-5: Extract complex boolean expressions into explanatory variables.** Replace `if (user.age >= 18 && user.country === 'US' && !user.isBanned)` with `const isEligibleVoter = ...` Named booleans serve as compiler-verified documentation.

### Documentation comments

- [ ] **[CRITICAL] RD-6: Every public function, class, module, and interface must have a documentation comment.** JS/TS: JSDoc `/** */`. Python: docstrings (Google or NumPy style). Rust: `///` doc comments. Solidity: NatSpec `///`. Enforce via `eslint-plugin-jsdoc`, `pydocstyle`, `clippy::missing_docs`, `solhint`.

- [ ] **[HIGH] RD-7: Doc comments must include summary, @param, @returns, and @throws.** Incomplete doc comments are worse than none — they create false confidence. Summary lines use imperative mood ("Calculate the total," not "Calculates the total").

- [ ] **[MEDIUM] RD-8: Public API doc comments should include usage examples.** `@example` (JSDoc), `# Examples` (rustdoc), doctests (Python). Examples are the most-read part of documentation.

### Architecture Decision Records

- [ ] **[HIGH] RD-9: Architecturally significant decisions must be recorded as ADRs.** Store in `docs/decisions/NNNN-short-title.md` using MADR v4.0 template. Required sections: Context and Problem Statement, Decision Drivers, Considered Options, Decision Outcome with justification, Consequences (positive and negative).

- [ ] **[MEDIUM] RD-10: ADRs are sequentially numbered and append-only.** Never delete an ADR. Status changes reference the superseding ADR.

### README standards

- [ ] **[HIGH] RD-11: Every repository must have a README with mandatory sections.** Required in order: Project title and one-line description, badges (build/coverage/version), Quick Start (install + run in ≤5 steps with copy-pasteable commands), usage examples, configuration/environment variables, contributing guide link, license.

- [ ] **[MEDIUM] RD-12: Type annotations for all public APIs.** TypeScript strict mode, Python type hints (PEP 484), Rust inherent typing, Solidity inherent typing. Types are machine-checked documentation that never goes stale.

---

## 5. Dead code and technical debt management

Dead code is a broken window. Its presence signals that nobody is watching, and quality degrades from there. Meta built **SCARF** (Systematic Code and Asset Removal Framework) specifically to auto-detect and auto-remove dead code at scale.

- [ ] **[CRITICAL] DC-1: Zero tolerance for dead code.** Unreachable code, unused imports, unused variables, commented-out code blocks — all must be removed. Version control is the history system. Enforce unused-import/unused-variable removal via linters (`no-unused-vars`, `no-unused-imports`) in CI with zero tolerance.

- [ ] **[HIGH] DC-2: Every TODO/FIXME must include a ticket number and owner.** Format: `// TODO(username) [PROJ-123]: description`. Naked TODOs without ticket references are rejected in CI and code review. Maximum lifetime: **90 days** without activity triggers automated alerts. Track TODO count as a codebase health metric.

- [ ] **[HIGH] DC-3: Three-phase deprecation lifecycle — Mark → Warn → Remove.** Mark: add `@deprecated` annotation with replacement guidance and target removal version. Warn: emit compiler/runtime warnings for 2–3 minor versions. Remove: delete deprecated code, update tests, close ticket. Deprecation without a replacement path is not permitted.

- [ ] **[CRITICAL] DC-4: Feature flag maximum lifetime — 90 days after full rollout.** Every flag gets an owner, expiration date, and auto-created cleanup ticket at creation time. Release toggles: clean up within **30 days** of 100% rollout. Experiment flags: **90 days** maximum. Ops/kill switches: permanent but reviewed quarterly. CI checks flag age and alerts when thresholds are exceeded. Knight Capital lost **$440M** partly due to reactivated old feature flag code.

- [ ] **[HIGH] DC-5: Technical debt classified and tracked.** Categories: code debt, design/architecture debt, test debt, documentation debt, dependency debt, migration debt, infrastructure debt. Dedicate **15–25% of sprint capacity** to debt reduction. Tag debt tickets in issue tracker for visibility and burndown.

- [ ] **[HIGH] DC-6: Mandatory refactoring triggers.** Refactoring required when: cyclomatic complexity > 15, function length > 50 lines, file length > 500 lines, code duplication > 5%, test coverage drops below 60%. Refactoring PRs must be separate from feature PRs.

---

## 6. Error handling standards

Silent error swallowing is the **#1 cause of cascading, hard-to-debug failures** according to Joe Duffy's research on Microsoft's Midori project. Every error must be explicitly handled, propagated with context, or documented as intentionally ignored.

### Core error handling

- [ ] **[CRITICAL] EH-1: No empty catch/except blocks.** Every catch block must: log the error with context, re-throw/propagate the error, return a typed error value, or explicitly document why the error is intentionally ignored. Detect `catch {}`, `except: pass`, or `_ = someFunc()` in Go with no error check.

- [ ] **[CRITICAL] EH-2: Typed/structured error handling per language.** Rust: `Result<T, E>` with `thiserror`/`anyhow`; never `unwrap()` in production. Go: always check error returns; use `errors.Is()`/`errors.As()`; wrap with `fmt.Errorf("context: %w", err)`. TypeScript: custom error classes extending `Error`; libraries return `Result<T, E>` types over throwing. Python: catch specific exceptions; use `from error` for chaining. Solidity: custom errors (0.8.4+) over string revert reasons; always check `.call()` return values.

- [ ] **[HIGH] EH-3: Wrap errors with context at each architectural boundary.** Every layer that catches and re-throws must add a description of what operation failed. Rust: `.context("loading user config")`. Go: `fmt.Errorf("loadConfig(%s): %w", path, err)`. Python: `raise ConfigError(f"...") from error`.

- [ ] **[MEDIUM] EH-4: Handle errors exactly once.** Do not log an error AND re-throw it (causes duplicate logging). Either handle it (log + recover) or propagate it (wrap + throw/return).

### User-facing errors

- [ ] **[CRITICAL] EH-5: Never expose stack traces, internal paths, or raw error messages to end users.** User sees: "Something went wrong. Please try again. (Reference: REQ-abc123)." Developer logs: full stack trace, request context, correlation ID. Detect patterns that serialize `error.stack` or raw exception messages into API response bodies.

- [ ] **[HIGH] EH-6: API errors use structured format with error codes.** `{ "error": { "code": "VALIDATION_FAILED", "message": "Email format is invalid", "requestId": "..." } }`. Machine-readable codes, human-readable messages.

### Recovery patterns

- [ ] **[HIGH] EH-7: Retry with exponential backoff for transient failures.** Formula: `delay = min(base * 2^attempt + random_jitter, max_delay)`. All network calls, database connections, and external API calls must implement retry logic.

- [ ] **[HIGH] EH-8: Circuit breaker pattern for external dependencies.** CLOSED → OPEN (fail fast after N consecutive failures) → HALF-OPEN (test recovery). Prevent cascading failures.

- [ ] **[MEDIUM] EH-9: Explicit timeout on all external calls.** Every HTTP request, database query, and RPC call must have an explicit timeout. Never use default infinite timeouts.

### Validation and panics

- [ ] **[CRITICAL] EH-10: Validate at system boundaries — fail fast.** All external input (HTTP requests, user input, file reads, environment variables) must be validated immediately upon entry. Use schema validation libraries: Zod (TypeScript), Pydantic (Python), validator (Go), serde (Rust).

- [ ] **[HIGH] EH-11: Aggregate validation errors.** Return all validation errors together, not one at a time. `{ "errors": [{ "field": "email", ... }, { "field": "age", ... }] }`.

- [ ] **[CRITICAL] EH-12: Crash only for truly unrecoverable states.** Panicking is acceptable only for: violated invariants indicating programming bugs, out-of-memory conditions, failed security invariants, corrupt data that would propagate damage. Detect `panic()`, `process.exit()`, `unwrap()` in production code paths.

- [ ] **[CRITICAL] EH-13: Never let async errors go unhandled.** Every `Promise` must have `.catch()` or be in `try/catch` with `await`. Every goroutine must handle errors. Set `process.on('unhandledRejection')` as safety net. Use `errgroup` (Go), `TaskGroup` (Python asyncio).

---

## 7. Code review standards

Google's research demonstrates that code review is the single most effective defect-detection mechanism, superior to testing alone. The SmartBear/Cisco study of **2,500 reviews across 3.2M lines of code** established the thresholds below.

### PR requirements

- [ ] **[CRITICAL] CR-1: Maximum 400 lines of logical changes per PR.** Defect detection drops precipitously beyond 400 LOC. Review pace: no faster than **300–500 LOC/hour**. Sessions: **30–60 minutes**, never exceed 90. Generated files and lockfiles may be excluded from line counts but must still be reviewed.

- [ ] **[CRITICAL] CR-2: Every PR must answer four questions.** What changed (technical summary), why (business justification + ticket link), how it was tested (automated tests + manual steps), and what the risks are (breaking changes, rollback plan). Enforce via `PULL_REQUEST_TEMPLATE.md`.

- [ ] **[CRITICAL] CR-3: One logical change per PR.** Tests and documentation ship in the same PR as the code they relate to. Formatting and logic changes must never be combined. Refactoring PRs are separate from feature PRs.

- [ ] **[HIGH] CR-4: First review response within 4 business hours; maximum 1 business day.** Google: "One business day is the maximum time it should take to respond." PRs unreviewed after 24 hours trigger automatic escalation. PRs unmerged after 3 days require justification.

### Review process

- [ ] **[CRITICAL] CR-5: Reviewers verify design, correctness, security, performance, readability, complexity, tests, style, and documentation.** The style guide is the absolute authority on style questions. Every reviewer checks: Does the code do what it claims? Are edge cases handled? Are there concurrency issues? Is input validated?

- [ ] **[HIGH] CR-6: Use severity prefixes on all review comments.** `blocking:` (must resolve before merge), `nit:` (optional polish), `question:` (seeking clarification), `suggestion:` (alternative approach), `praise:` (positive reinforcement). Always comment on the code, never on the developer.

- [ ] **[CRITICAL] CR-7: Minimum 1 approved review from a qualified reviewer.** Critical paths (payments, auth, data handling): minimum **2 reviewers**. CODEOWNERS file enforced. Stale approvals invalidated after force-push. PR author cannot approve their own PR.

### AI-specific review

- [ ] **[CRITICAL] CR-8: All AI-generated code receives identical review rigor as human code.** Stripe merges **1,300+ AI-generated PRs weekly** — every one passes human review. SonarSource research shows AI-assisted code has **3x more security vulnerabilities**. AI-generated PRs must be explicitly labeled.

- [ ] **[HIGH] CR-9: AI review tools complement but do not replace human review.** AI runs first pass (edge cases, null pointers, security patterns). Humans focus on architecture, intent, business logic, and design decisions.

---

## 8. Dependency management

The npm ecosystem alone has suffered **event-stream** (2018), **ua-parser-js** (2021), **colors.js** (2022), and **xz-utils** (2024) supply chain attacks. Every dependency is code you don't control running in your production environment.

### Lockfiles and pinning

- [ ] **[CRITICAL] DEP-1: All lockfiles committed to version control.** `package-lock.json`, `yarn.lock`, `Cargo.lock`, `poetry.lock`, `go.sum` — these pin every dependency to exact version + integrity hash.

- [ ] **[CRITICAL] DEP-2: CI must use lockfile-enforcing install commands.** `npm ci` (not `npm install`), `yarn install --frozen-lockfile`, `cargo build --locked`, `pipenv install --deploy`. Fail if lockfile is inconsistent with dependency specification.

- [ ] **[HIGH] DEP-3: Applications use exact version pinning.** For deployed applications: `"react": "18.2.0"` not `"^18.2.0"`. Set `save-exact=true` in `.npmrc`. Libraries use caret ranges for compatibility.

- [ ] **[MEDIUM] DEP-4: Never use `*`, `latest`, or unbounded ranges.** These are supply chain attack vectors. Every dependency must specify a bounded version.

### Security and auditing

- [ ] **[CRITICAL] DEP-5: Automated vulnerability scanning on every CI build.** `npm audit --audit-level=high`, `cargo audit`, `pip-audit`, `govulncheck`. Failure blocks merge.

- [ ] **[CRITICAL] DEP-6: Disable postinstall scripts by default in CI.** `npm install --ignore-scripts`. Re-enable only for explicitly allowlisted packages. This blocks the primary attack vector used in the major supply chain incidents.

- [ ] **[CRITICAL] DEP-7: Security patches applied within 24–48 hours.** Critical/High severity vulnerabilities (CVSS ≥ 7.0) patched within **24 hours**. Medium within **1 week**. Configure Dependabot/Renovate with daily security update schedule.

- [ ] **[HIGH] DEP-8: Weekly automated full dependency audit.** Comprehensive SCA tool (Snyk, Socket.dev, Dependabot) scanning the full transitive dependency tree.

### License compliance

- [ ] **[CRITICAL] DEP-9: Explicit license allowlist enforced in CI.** Allowed: MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, Unlicense. Requires legal review: LGPL, MPL-2.0. **Blocked in proprietary code: GPL-2.0, GPL-3.0, AGPL-3.0, SSPL-1.0.** Use `license-checker` (npm), `cargo-license` (Rust), `pip-licenses` (Python).

### Dependency hygiene

- [ ] **[HIGH] DEP-10: New dependency requires justification in PR.** Must document: why needed, alternatives considered, package health assessment (downloads, maintenance status, dependency count), license verification. Socket.dev or Snyk auto-annotate risk scores.

- [ ] **[HIGH] DEP-11: Follow minimal dependency philosophy.** Prefer standard library. A package adding **50+ transitive dependencies** requires elevated review. Set dependency budget thresholds per project type: microservice < 100, web app < 300.

- [ ] **[MEDIUM] DEP-12: Audit for unused dependencies quarterly.** `depcheck` (npm), `cargo-udeps` (Rust), equivalent tools. Remove anything not actively used.

---

## 9. Git hygiene and version control

Clean git history is not vanity — it's the foundation of `git bisect`, `git revert`, and understanding why changes were made six months later.

### Commit standards

- [ ] **[CRITICAL] GIT-1: Follow Conventional Commits specification.** Format: `<type>(<scope>): <description>`. Required types: `feat` (MINOR), `fix` (PATCH), `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`. Breaking changes: `!` after type or `BREAKING CHANGE:` in footer. Enforce with `commitlint` + `husky`.

- [ ] **[HIGH] GIT-2: Subject line in imperative mood, lowercase, no period, max 72 characters.** Body explains what and why, not how. Reference tickets in footer: `Refs: #133`, `Closes: PROJ-456`.

- [ ] **[HIGH] GIT-3: One logical change per commit.** Each commit must compile and pass tests independently. Don't mix unrelated changes. A single commit should be revertible without side effects.

### Branch and merge strategy

- [ ] **[HIGH] GIT-4: Branch naming convention — `<type>/<ticket-id>-<short-description>`.** `feature/PROJ-123-add-user-auth`, `bugfix/PROJ-456-fix-payment-timeout`. Lowercase, hyphen-separated, no underscores. Delete branches after merge.

- [ ] **[HIGH] GIT-5: Default to squash-and-merge for feature branches.** Produces clean linear history. Each merge = one logical change = easy to revert and bisect. Exception: rebase-and-merge for stacked PRs with meaningful individual commits.

- [ ] **[CRITICAL] GIT-6: No direct pushes to main/master.** All changes via PR only. Require approval, CI status checks, up-to-date branch, signed commits. Dismiss stale approvals on new pushes. No force pushes to protected branches.

### Repository hygiene

- [ ] **[HIGH] GIT-7: .gitignore excludes all non-source artifacts.** Build artifacts (`dist/`, `build/`), IDE files (`.idea/`, `.vscode/` except shared settings), secrets (`.env`, `*.pem`, `*.key`), OS files (`.DS_Store`), dependency directories (`node_modules/`, `venv/`), logs, coverage output.

- [ ] **[CRITICAL] GIT-8: Never commit secrets.** Use secret scanning tools (Gitleaks, GitHub secret scanning, TruffleHog) in CI on every push. Pre-commit hooks with Gitleaks as first line of defense.

- [ ] **[HIGH] GIT-9: Git LFS for files > 1MB; hard reject files > 50MB.** Track binary assets via Git LFS. Database dumps and large datasets use artifact storage (S3, GCS).

- [ ] **[CRITICAL] GIT-10: Force push forbidden on protected branches.** Allowed only on personal feature branches. After PR is opened, prefer `--force-with-lease` over `--force`.

---

## 10. Configuration and environment management

The **12-Factor App** methodology's Factor III is unequivocal: *store config in the environment*. Configuration that varies between deploys must never be inline in source code.

### Secrets management

- [ ] **[CRITICAL] CFG-1: Zero hardcoded secrets in source code.** Passwords, API keys, tokens, private keys, connection strings with credentials — never in code, never in git history. Enforce with pre-commit hooks (Gitleaks + detect-secrets) AND CI pipeline scanning. Regex patterns must cover: AWS keys (`AKIA[0-9A-Z]{16}`), generic API keys, private key headers, database URLs with credentials, GitHub tokens, Slack tokens, JWTs.

- [ ] **[CRITICAL] CFG-2: .env files must be in .gitignore.** All variants: `.env`, `.env.local`, `.env.production`, `.env.*.local`. CI verifies no `.env` file is tracked: `git ls-files --error-unmatch .env 2>/dev/null && exit 1 || true`.

- [ ] **[CRITICAL] CFG-3: Use a dedicated secrets manager in production.** HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager, Azure Key Vault, or Doppler. Never store production secrets in server `.env` files or CI environment variables directly. Secrets injected at runtime by the platform.

- [ ] **[HIGH] CFG-4: Secrets rotation every 90 days minimum.** API keys, database credentials, JWT signing keys, service account keys. After any suspected breach: rotate all secrets within **1 hour**. Support zero-downtime rotation (accept both old and new keys during transition).

### Configuration validation

- [ ] **[CRITICAL] CFG-5: Application must fail fast on missing or invalid configuration.** Before any server starts listening, validate ALL required environment variables. Exit with code 1 and clear error listing ALL missing/invalid variables. Use Zod (TypeScript), Pydantic `BaseSettings` (Python), or equivalent.

- [ ] **[HIGH] CFG-6: Centralize configuration loading.** All environment variables read through a single config module. Application code never reads `process.env` directly. The config module exports a frozen, typed, validated object.

- [ ] **[HIGH] CFG-7: .env.example committed with all required variables documented.** Every variable documented with: name, description, expected format, required/optional status, example value (never a real secret). Any PR adding a new variable must update `.env.example`.

- [ ] **[HIGH] CFG-8: Environment variable naming — SCREAMING_SNAKE_CASE, prefixed by service name.** `MYAPP_DATABASE_URL`, `MYAPP_JWT_SECRET`. Consistent suffixes: `_URL`, `_KEY`, `_SECRET`, `_TOKEN`, `_HOST`, `_PORT`, `_ENABLED`.

### Feature flags

- [ ] **[HIGH] CFG-9: Feature flag metadata required at creation.** Owner, type (release/experiment/ops/permission), purpose, expiration date, rollout plan, and cleanup ticket — all non-negotiable. Naming convention: `release_`, `experiment_`, `ops_`, `permission_` prefixes.

- [ ] **[HIGH] CFG-10: Production config must be explicit.** When `NODE_ENV=production`, optional-in-dev variables become required. Default values rejected for critical config. Placeholder values (`changeme`, `TODO`) cause startup failure.

---

## 11. Logging and observability standards

Without structured, correlated telemetry, you are blind in production. Google SRE's **Four Golden Signals** and the **OpenTelemetry** specification form the foundation.

### Structured logging

- [ ] **[CRITICAL] LOG-1: All production logs must be structured JSON.** Every log entry includes: `timestamp` (ISO 8601), `level`, `message`, `service`, `version`, and contextual key-value attributes. No `console.log()`, `print()`, or `fmt.Println()` for production logging. Use: `slog`/`zap` (Go), `pino` (Node), `structlog` (Python), `tracing` (Rust).

- [ ] **[HIGH] LOG-2: Use parameterized logging, not string interpolation.** `logger.info("User login", { user_id })` not `logger.info(f"User {user_id}")`. Parameterized logging enables structured querying and prevents injection.

- [ ] **[CRITICAL] LOG-3: NEVER log secrets, PII, or tokens.** Banned field names in log statements: `password`, `secret`, `token`, `api_key`, `authorization`, `credit_card`, `ssn`, `private_key`, `connection_string`. Never log full request headers (contain `Authorization`). Implement automated PII/secret redaction in the logging pipeline. Use domain primitive types that override `toString()`/`Display` to mask values.

### Log levels

- [ ] **[HIGH] LOG-4: Follow strict log level definitions.** **FATAL:** process will exit. **ERROR:** operation failed, requires attention; must include error object. **WARN:** unexpected condition, doesn't cause failure. **INFO:** significant business events (default production level). **DEBUG:** diagnostic detail, off in production. **TRACE:** fine-grained, never permanently on in production.

- [ ] **[MEDIUM] LOG-5: Production log level must be INFO or WARN.** Debug logging dynamically togglable at runtime per-service or per-request via feature flag, without redeployment.

### Distributed tracing

- [ ] **[CRITICAL] LOG-6: Every request must carry a correlation ID propagated through all services.** Use W3C Trace Context standard (`traceparent` header). Generate at edge/API gateway if not present. Include `trace_id` and `span_id` in every log entry via OpenTelemetry SDK.

- [ ] **[HIGH] LOG-7: Implement distributed tracing with OpenTelemetry.** All services export traces covering: incoming HTTP requests, outgoing HTTP/RPC calls, database queries, message queue operations, and critical business operations. Use auto-instrumentation where available.

### Metrics and health

- [ ] **[CRITICAL] LOG-8: Implement the Four Golden Signals for every service.** **Latency** as distribution (p50/p90/p95/p99), separating success and failure. **Traffic** as requests per second. **Errors** as both count and percentage. **Saturation** for CPU, memory, connection pools, queue depth.

- [ ] **[CRITICAL] LOG-9: Every service must expose health check endpoints.** `/healthz` (liveness — is process alive? no dependency checks, < 100ms). `/ready` (readiness — checks database, cache, downstream services). `/startup` (initialization complete). Response format: `{ "status": "healthy|degraded|unhealthy", "version": "...", "checks": {...} }`.

- [ ] **[HIGH] LOG-10: Every alert must be actionable with a runbook attached.** Alert on symptoms (user-facing impact), not causes (raw infrastructure metrics). Tiered severity: P1 pages on-call immediately, P2 Slack notification, P3 creates ticket. Track false positive rates; remove alerts with > 50% false positive rate.

---

## 12. AI-agent enforcement

As of 2026, **~40%+ of production code** is AI-generated across organizations adopting AI assistants. AI-generated code shows **3x more security vulnerabilities** and **1.75x more logic errors** than human-written code. The same quality standards must apply — no exceptions.

### Quality gates

- [ ] **[CRITICAL] AI-1: All CI/CD quality gates apply identically to AI-generated and human-written code.** Linting, type checking, test coverage, security scanning, complexity limits — zero exceptions. AI code in security-sensitive areas (auth, crypto, payments) requires mandatory additional human security review.

- [ ] **[CRITICAL] AI-2: Every AI-generated PR requires at least one human reviewer approval.** No auto-merge for AI-generated code. Reviewer must explicitly confirm they understood the code, not just approved it.

- [ ] **[CRITICAL] AI-3: AI agents must run linters, formatters, and type checkers before proposing code.** Configure Claude Code PostToolUse hooks to auto-format after every file edit. Configure PreCommit hooks for full linting suite. CLAUDE.md must include exact commands: `npm run lint`, `npm run typecheck`, `npx prettier --check .`.

- [ ] **[CRITICAL] AI-4: AI agents must verify changes don't break existing tests.** Run relevant test suites before proposing changes. CI runs full suite and blocks merge on any failure.

### Hallucination prevention

- [ ] **[CRITICAL] AI-5: AI agents must verify APIs exist before calling them.** CLAUDE.md instruction: "Before using any API, function, or method, verify it exists by reading the actual source file. Never assume." Verify function signatures match. Test that code compiles/transpiles without errors.

- [ ] **[HIGH] AI-6: Monitor context window usage.** At **50–70%** context: proceed with caution. At **70%+**: run `/compact`. At **90%+**: mandatory `/clear`. Context overflow increases hallucination rates.

- [ ] **[HIGH] AI-7: AI must not introduce new dependencies without explicit human approval.** Maintain a dependency allowlist. Configure hooks to detect and flag any new dependency additions. CLAUDE.md: "NEVER add new dependencies without asking first."

### Attribution and conventions

- [ ] **[CRITICAL] AI-8: Git commits must indicate AI involvement.** Convention: `[AI-assisted]` prefix or git trailer `AI-Tool: claude-code`. PR template must include: AI tool used, human review confirmation. Author remains fully responsible for all AI-generated code.

- [ ] **[HIGH] AI-9: AI must not blindly delete code.** Instruction: "Never delete existing code without explaining why it's no longer needed." AI must not introduce TODO/FIXME placeholders — all code must be complete and functional.

- [ ] **[HIGH] AI-10: Configure comprehensive rules files.** CLAUDE.md (Claude Code), `.cursor/rules/*.mdc` (Cursor), `.github/copilot-instructions.md` (Copilot), `AGENTS.md` (cross-platform). Keep CLAUDE.md concise: **< 200 lines, < 150 individual instructions**. Must include: project overview, build/test/lint commands, code style, security rules, verification rules. Use hierarchical files for monorepos.

- [ ] **[MEDIUM] AI-11: Cyclomatic complexity thresholds are stricter for AI-generated code.** ≤ **10** per function (vs. ≤ 15 for human code). AI tends to produce overly complex conditionals. Enforce minimum **80% test coverage** for AI-assisted code changes.

---

## 13. Metrics and measurement

Not everything that counts can be counted, but the metrics below have **strong empirical evidence** linking them to defect rates, team velocity, and system reliability.

### Code coverage

- [ ] **[CRITICAL] MET-1: Minimum 80% line coverage on new/modified code.** SonarQube "Sonar way" default. Fortune 100 study: coverage at 80% reduces defect ratio from 84% to 7%. Google internal scale: 60% acceptable, 75% commendable, 90% exemplary.

- [ ] **[CRITICAL] MET-2: Overall project minimum 70% line coverage.** 80% target for greenfield projects. **90%+** for authentication, payment processing, and security-critical code.

- [ ] **[HIGH] MET-3: Coverage ratchet — coverage must never decrease on a PR.** CI blocks merges that reduce overall coverage. Branch coverage minimum: **70%** on new code.

### Code quality ratings

- [ ] **[CRITICAL] MET-4: SonarQube Maintainability Rating must be A on new code.** Also: Reliability Rating A, Security Rating A, **100% of Security Hotspots reviewed**, duplication ≤ **3%** on new code.

- [ ] **[CRITICAL] MET-5: Technical debt ratio must not exceed 10%.** Target: below **5%** for mature projects. TDR = (Remediation Cost / Development Cost) × 100. Any increase triggers review. Dedicate **15–25% of sprint capacity** to debt reduction.

- [ ] **[HIGH] MET-6: Code duplication maximum 5% overall; 3% on new code.** SonarQube "Sonar way" default for new code. Minimum detection threshold: 10 lines or 100 tokens.

### DORA metrics

- [ ] **[CRITICAL] MET-7: Track and display DORA metrics on a daily-updated dashboard.** **Deployment Frequency:** target multiple deploys/day (elite) or weekly minimum. **Change Lead Time:** target < 26 hours (elite). **Change Failure Rate:** target < 4% (elite) or < 8% (high). **Failed Deployment Recovery Time:** target < 1 hour (elite). **Rework Rate:** < 8% (elite benchmark).

### Quality gates for deployment

- [ ] **[CRITICAL] MET-8: Deployment blocked unless ALL of the following pass.** All tests pass (unit, integration, e2e). SonarQube quality gate passes. No critical/high severity security vulnerabilities (SAST + SCA). Code review approved. Secrets scanner passes. Build succeeds with zero warnings. Type checking passes. Linting passes.

### Trend tracking

- [ ] **[CRITICAL] MET-9: Quality ratchet — no metric may degrade on any merge.** Apply strictest standards to new/modified code (SonarQube "Clean as You Code"). Overall codebase improves gradually. Quarterly quality reviews compare metrics to previous quarter; any regression requires documented remediation plan.

- [ ] **[HIGH] MET-10: SPACE framework metrics measured quarterly.** Satisfaction (developer surveys, burnout indicators), Performance (quality ratings, reliability), Activity (PR throughput, review turnaround), Communication (response time, collaboration), Efficiency (cycle time, flow efficiency).

---

## Appendix A: Recommended tools by ecosystem

| Category | Universal | JS/TS | Python | Rust | Go | Solidity |
|----------|-----------|-------|--------|------|----|----------|
| **Formatter** | EditorConfig | Prettier | Black | rustfmt | gofmt | — |
| **Linter** | SonarQube | ESLint, Biome | Ruff (replaces flake8/isort) | Clippy | golangci-lint | solhint |
| **Type Checker** | — | TypeScript strict | mypy | (built-in) | go vet | (built-in) |
| **Test Framework** | — | Vitest, Jest | pytest | cargo test | go test | Foundry (forge) |
| **Coverage** | — | c8, Istanbul | coverage.py | cargo-tarpaulin | go test -cover | forge coverage |
| **Security (SAST)** | Checkmarx, Snyk | — | Bandit | cargo-audit | govulncheck | Slither, Mythril |
| **Dependency Audit** | Socket.dev, Renovate | npm audit | pip-audit | cargo-audit | govulncheck | — |
| **Complexity** | SonarQube, CodeClimate | eslint complexity | Radon | clippy | gocyclo | — |
| **Secrets Detection** | Gitleaks, TruffleHog | — | — | — | — | — |
| **Observability** | OpenTelemetry | pino | structlog | tracing | slog, zap | — |

## Appendix B: Critical thresholds reference

| Metric | Warning | Block | Source |
|--------|---------|-------|--------|
| Function length | > 30 lines | > 50 lines | Google (~40), CodeClimate (25), Clean Code (5–20) |
| Parameter count | > 3 | > 4 | CodeClimate (4), Clean Code (≤ 2 ideal) |
| Cyclomatic complexity | > 10 | > 15 | McCabe (10), SonarQube (20), CodeClimate (5) |
| Cognitive complexity | > 10 | > 15 | SonarQube default (15), CodeClimate (5) |
| Nesting depth | > 3 | > 4 | CodeClimate (4), Linux kernel (3) |
| File length | > 400 lines | > 500 lines | CodeClimate (250) |
| PR size | > 200 lines | > 400 lines | SmartBear/Cisco study |
| Code coverage (new) | < 85% | < 80% | SonarQube Sonar way, industry consensus |
| Code coverage (overall) | < 75% | < 70% | Bullseye/NIST, Google internal |
| Duplication (new code) | > 2% | > 3% | SonarQube Sonar way |
| Duplication (overall) | > 4% | > 5% | Industry practice |
| Technical debt ratio | > 5% | > 10% | DX research, industry benchmarks |
| Line length | — | 80–100 per language | Google guides, Black (88), Prettier (100) |
| Security patch SLA | — | 24–48 hours for Critical/High | Industry standard |
| Feature flag max age | 30 days at 100% | 90 days total | LaunchDarkly, FlagShark |
| AI code complexity | > 8 | > 10 | Emerging standard, Of Ash and Fire |

## Appendix C: CI/CD quality gate configuration template

The following gates must ALL pass before any merge to a protected branch:

```yaml
quality_gates:
  # Stage 1: Format & Lint (fastest, fail first)
  - name: formatting
    severity: CRITICAL
    commands:
      - prettier --check .          # JS/TS
      - black --check .             # Python
      - rustfmt --check             # Rust
      
  - name: linting
    severity: CRITICAL
    commands:
      - eslint --max-warnings 0 .   # JS/TS
      - ruff check .                # Python
      - clippy -- -D warnings       # Rust
      - golangci-lint run           # Go

  # Stage 2: Type checking
  - name: type_check
    severity: CRITICAL
    commands:
      - tsc --noEmit --strict       # TypeScript
      - mypy --strict .             # Python

  # Stage 3: Tests & Coverage
  - name: tests
    severity: CRITICAL
    commands:
      - vitest run --coverage       # JS/TS
      - pytest --cov --cov-fail-under=80  # Python
      - cargo test                  # Rust

  # Stage 4: Security
  - name: secrets_scan
    severity: CRITICAL
    commands:
      - gitleaks detect --source .
      
  - name: dependency_audit
    severity: CRITICAL
    commands:
      - npm audit --audit-level=high
      - pip-audit
      - cargo audit

  - name: license_check
    severity: CRITICAL
    commands:
      - license-checker --failOn "GPL-2.0;GPL-3.0;AGPL-3.0"

  # Stage 5: Quality Analysis
  - name: sonarqube
    severity: CRITICAL
    conditions:
      - maintainability_rating: A
      - reliability_rating: A
      - security_rating: A
      - coverage_new_code: ">= 80%"
      - duplication_new_code: "<= 3%"
      - cognitive_complexity_per_function: "<= 15"
```

## Appendix D: CLAUDE.md template for AI agent configuration

```markdown
# Project: [Name]

## Build & Test
- Build: `npm run build`
- Test (single): `npm test -- path/to/test`  
- Test (all): `npm test`
- Lint: `npm run lint`
- Type check: `npx tsc --noEmit`
- Format: `npx prettier --write .`

## Code Style
- TypeScript strict mode, no `any` types
- Functions: verb-first camelCase, max 30 lines, max 4 params
- Boolean functions: is/has/can/should prefix
- Imports: stdlib → external → internal, no wildcards
- Errors: return Result types, never throw in libraries
- No magic numbers — use named constants

## Rules  
- Run linters and type checker before committing
- Run affected tests after making changes
- NEVER add new dependencies without asking first
- NEVER delete code without explaining why
- NEVER hardcode secrets, tokens, or API keys
- Verify APIs exist by reading source before using them
- All code must be complete — no TODO placeholders
- Prefer minimal, focused changes over large refactors

## Architecture
[Brief description of project architecture, key patterns, 
directory structure, and domain concepts]
```

---

*This protocol synthesizes standards from Google Engineering Practices, Microsoft Research, Clean Code (Robert C. Martin), the Linux kernel coding style, Rust RFC 430, Python PEP 8, the 12-Factor App methodology, OpenTelemetry specification, DORA/SPACE research frameworks, SonarQube quality models, the Conventional Commits specification, and empirical studies including the SmartBear/Cisco code review study (2,500 reviews, 3.2M LOC) and Fortune 100 coverage-to-defect ratio research. All thresholds are research-backed with sources cited inline.*