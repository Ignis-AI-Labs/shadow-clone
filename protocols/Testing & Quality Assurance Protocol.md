# Testing & Quality Assurance Protocol

## Ignis AI Labs — Engineering Standards Series

**Version:** 1.0
**Classification:** Internal Engineering Standard — Mandatory
**Enforcement:** AI Coding Agents (Claude Code, Shadow Clone) + Human Oversight
**Scope:** All production code, all languages (TypeScript, Rust, Python, Go, Solidity)
**Companion Protocols:** Security Audit Protocol, Code Quality Protocol, Code Efficiency Protocol, Functional Programming & Purity Protocol

---

## PURPOSE

This protocol defines exactly what "properly tested" means at Ignis AI Labs. It establishes mandatory, measurable testing standards enforced at every stage of development — from local commits through CI gates to production deployment. Every checklist item is designed to be programmatically verifiable by AI coding agents or objectively assessable by human reviewers.

The systems built at Ignis — sub-100ms trading bots, SAGE AI inference, Unavis L1 blockchain, Shadow Clone orchestration — operate in environments where a single untested edge case can cause catastrophic financial loss, chain halts, or cascading agent failures. Testing is not optional overhead. It is a hard production requirement at the same severity level as security.

This protocol integrates with the Functional Programming & Purity Protocol. Because ≥80% of business logic consists of pure functions (per FP protocol mandate), the majority of tests require zero mocks, run in milliseconds, and are inherently deterministic — enabling property-based testing, mutation testing, and formal verification at scales impractical in side-effect-heavy codebases.

**Severity Definitions:**

| Tag | Meaning | Enforcement |
|-----|---------|-------------|
| **[CRITICAL]** | Hard deployment blocker. Violations prevent merge to main and deployment to any environment. | Automated CI gate + mandatory human sign-off |
| **[HIGH]** | Must be resolved before release. Exceptions require written justification from tech lead with a remediation deadline ≤14 days. | Automated CI gate with override capability |
| **[MEDIUM]** | Should be resolved within current sprint. Tracked as tech debt if deferred. | Automated warning + tracked in backlog |
| **[LOW]** | Recommended best practice. Improves long-term quality. Address opportunistically. | Advisory — flagged in code review |

---

## HOW TO USE THIS PROTOCOL

### For AI Coding Agents (Claude Code, Shadow Clone)

1. **Before generating code:** Review applicable sections. Generate tests before or alongside implementation (TDD default).
2. **Before submitting PRs:** Run all [CRITICAL] and [HIGH] checks. Include results in PR description.
3. **Verification format:** Use status markers in PR checklists:
   - `[ ]` — Not yet verified
   - `[x]` — Passing
   - `[!]` — Failing (blocker)
   - `[~]` — Partial compliance (document gaps)
   - `[N/A]` — Not applicable (state reason)
4. **Automated enforcement:** CI pipelines SHALL reject PRs failing any [CRITICAL] item. [HIGH] items require explicit override.

### For Human Reviewers

1. **Code review:** Verify test quality, not just test existence. Check that tests assert meaningful behavior, not just execute code.
2. **Architecture review:** Validate testing strategy matches system risk profile (Section 1).
3. **Release gating:** All [CRITICAL] and [HIGH] items must show `[x]` before release approval.
4. **Exception process:** Document all `[N/A]` and override decisions in the PR with rationale.

### Applicability Matrix

| System | Critical Sections | Additional Requirements |
|--------|------------------|------------------------|
| Trading Bots | 1-3, 5-9, 13 | Sub-100ms latency verification, property-based testing on all order logic |
| SAGE (AI Inference) | 1-3, 5, 8-9, 12-13 | AI-generated code testing, performance regression gates |
| Unavis L1 (Blockchain) | 1-3, 5-11 | Smart contract testing, formal verification, fuzz testing |
| Shadow Clone (Orchestration) | 1-3, 5, 8-9, 12-13 | Deterministic simulation testing, chaos engineering |
| Web/Dashboard | 1-4, 8-9, 14 | E2E testing, visual regression, accessibility |

---

## SECTION 1: TESTING STRATEGY AND ARCHITECTURE

### 1.1 Testing pyramid and layer proportions

- [ ] **[CRITICAL]** Test suite follows the testing pyramid distribution: **≥70% unit tests, ≤20% integration tests, ≤10% E2E tests** (measured by test count). Deviations require documented architectural justification referencing the Testing Trophy or Testing Diamond model.
- [ ] **[CRITICAL]** Every module, service, and package has unit tests. No production module exists without a corresponding test file.
- [ ] **[HIGH]** Testing shape matches system architecture:
  - Backend services with rich business logic: Pyramid (80/15/5)
  - Frontend SPAs: Trophy (emphasize integration tests with Testing Library)
  - Microservices: Diamond/Honeycomb (emphasize integration)
  - Distributed systems: Pyramid + deterministic simulation testing + property-based testing
  - Smart contracts: 100% unit + fuzz + invariant + formal verification
- [ ] **[HIGH]** Each test layer has enforced speed budgets:
  - Unit tests: **≤100ms per test** (target ≤10ms for pure functions)
  - Integration tests: **≤30s per test**
  - E2E tests: **≤120s per test**
  - Full PR test suite: **≤10 minutes total**
- [ ] **[MEDIUM]** Test strategy document exists for each major system, specifying pyramid proportions, critical paths, and rationale for any deviations from default ratios.

### 1.2 Test-Driven Development (TDD)

- [ ] **[HIGH]** TDD (red-green-refactor) is the default workflow for all business logic, algorithms, and API design. AI agents MUST write failing tests before implementation for these categories.
- [ ] **[HIGH]** TDD cycle granularity follows Kent Beck's model: each red-green-refactor iteration targets ≤5 minutes. Tests are written incrementally (one behavior per cycle), not in bulk.
- [ ] **[MEDIUM]** TDD is NOT required for: rapid prototypes (marked `// PROTOTYPE — NOT FOR PRODUCTION`), trivial configuration, generated code, or purely visual UI work. These exceptions must be documented.
- [ ] **[MEDIUM]** When TDD is not used, tests MUST be written immediately after implementation (same PR, same commit batch). No code merges without tests.

### 1.3 Behavior-Driven Development (BDD)

- [ ] **[MEDIUM]** BDD (Gherkin/Cucumber) is used for features with complex business rules requiring stakeholder validation, cross-functional acceptance criteria, or living documentation needs.
- [ ] **[LOW]** BDD feature files contain **5–20 scenarios per feature**. Feature files exceeding 30 scenarios are split into sub-features.
- [ ] **[LOW]** Given-When-Then steps map 1:1 to Arrange-Act-Assert in underlying test implementations.

---

## SECTION 2: UNIT TESTING STANDARDS

### 2.1 F.I.R.S.T. principles

- [ ] **[CRITICAL]** All unit tests satisfy F.I.R.S.T.:
  - **Fast:** Each test executes in **≤100ms**. Pure function tests target **≤10ms**.
  - **Isolated:** No test depends on another test's state, execution order, or side effects. Tests pass when run individually, in any order, or in parallel.
  - **Repeatable:** Identical results in any environment (local, CI, staging). No network calls, no filesystem dependencies, no system clock reads.
  - **Self-validating:** Automatic pass/fail via assertions. No manual output inspection.
  - **Timely:** Written before or concurrently with production code (see Section 1.2).
- [ ] **[CRITICAL]** Unit tests for pure functions (≥80% of business logic per FP protocol) require **zero mocks, zero stubs, zero test doubles**. Direct input → output verification only.
- [ ] **[HIGH]** Remaining unit tests (side-effectful code at boundaries) use the minimal number of test doubles necessary. Over-mocking is a code review rejection reason.

### 2.2 Test structure and naming

- [ ] **[HIGH]** All tests follow the **Arrange-Act-Assert (AAA)** pattern with clear visual separation (blank lines or comments between sections).
- [ ] **[HIGH]** Test names follow one consistent convention per project. Approved patterns:
  - `should_[expectedBehavior]_when_[condition]` — e.g., `should_reject_order_when_balance_insufficient`
  - `[methodName]_[scenario]_[expectedResult]` — e.g., `calculateFee_negativeAmount_throwsInvalidInput`
  - `given_[precondition]_when_[action]_then_[result]` — e.g., `given_authenticated_user_when_invalid_account_then_transaction_fails`
- [ ] **[HIGH]** Test names express behavior, not implementation. Names remain valid after internal refactoring.
- [ ] **[MEDIUM]** Each test covers **one logical behavior**. Multiple assertions on the same behavior (e.g., checking both sender and receiver balance after a transfer) are acceptable. Multiple behaviors in one test are not.

### 2.3 Test data management

- [ ] **[HIGH]** Tests create their own data using **factories or builders**. Shared mutable fixtures across tests are prohibited.
- [ ] **[HIGH]** Test data factories produce deterministic, predictable data. No random data in unit tests (randomness belongs in property-based tests only — see Section 5).
- [ ] **[MEDIUM]** Complex test objects use the Builder pattern with sensible defaults and per-test overrides. Recommended libraries:
  - TypeScript/JS: Fishery, Faker.js (for realistic values)
  - Python: Factory Boy, Faker
  - Rust: `impl Default` + builder pattern
  - Go: functional options pattern
- [ ] **[MEDIUM]** Hardcoded magic numbers, IDs, and strings in tests are replaced with named constants or builder defaults. Test intent must be clear from the test body alone.

---

## SECTION 3: INTEGRATION TESTING

### 3.1 Database integration testing

- [ ] **[HIGH]** Database integration tests run against **real database engines** matching production (PostgreSQL, MySQL, etc.), not in-memory substitutes (H2, SQLite). Use Testcontainers or equivalent Docker-based isolation.
- [ ] **[HIGH]** Database containers use **dynamic port mapping** — never hardcoded ports. Connection strings are injected at runtime.
- [ ] **[HIGH]** Each test or test suite runs in an **isolated transaction** that is rolled back after completion, OR uses a dedicated ephemeral schema/database. No shared mutable database state between tests.
- [ ] **[MEDIUM]** Testcontainers are **reused across test classes** within a test suite for performance (container startup target: ≤8 seconds for PostgreSQL, ≤2 seconds for Redis). Per-test container creation is prohibited unless isolation requires it.

### 3.2 API contract testing

- [ ] **[HIGH]** All service-to-service API boundaries have **consumer-driven contract tests** (Pact or equivalent). Contracts verify schema, required fields, and response shapes — not business logic.
- [ ] **[HIGH]** Contract tests use **static, deterministic test data**. Random data in contracts is prohibited (creates unique pacts every run).
- [ ] **[HIGH]** Contracts are published to a **centralized broker** (Pact Broker or git-based sharing). The `can-i-deploy` check runs before any service deployment.
- [ ] **[MEDIUM]** Contract assertions are **loose** — only assert on fields the consumer actually uses. Over-specified contracts that break on additive provider changes are rejected in review.

### 3.3 External service mocking

- [ ] **[HIGH]** External HTTP dependencies are mocked at the **network/protocol level** (WireMock, MSW, nock), not at the client object level. This catches serialization, header, and transport errors.
- [ ] **[HIGH]** Mock servers simulate failure modes: **4xx errors, 5xx errors, network timeouts, slow responses (>5s), rate limiting (429), malformed responses**. Happy-path-only mocks are insufficient.
- [ ] **[MEDIUM]** Third-party API mocks are kept in sync with actual API behavior via periodic contract verification or recorded response playback (VCR pattern).

### 3.4 Message queue and event testing

- [ ] **[HIGH]** Message producers and consumers are tested independently via contract tests that verify message format and schema, decoupled from transport mechanism.
- [ ] **[MEDIUM]** Integration tests for message-driven systems use real broker containers (Kafka, RabbitMQ, Redis Streams via Testcontainers) — not in-process fakes.

---

## SECTION 4: END-TO-END TESTING

### 4.1 E2E test scope and framework

- [ ] **[HIGH]** E2E tests cover **critical user paths only** — the 20% of flows representing 80% of user/system interactions (e.g., authentication, core transactions, primary data paths). Exhaustive E2E coverage is explicitly NOT a goal.
- [ ] **[HIGH]** E2E tests use **Playwright** for new projects (42% faster than Selenium, 67% fewer flaky tests, free built-in parallelization). Exceptions for Cypress (frontend-heavy SPAs) or Selenium (legacy/enterprise) require justification.
- [ ] **[HIGH]** E2E tests use **auto-waiting and smart selectors** (Playwright locators, `data-testid` attributes). Static `waitForTimeout()` / `sleep()` calls are prohibited.
- [ ] **[MEDIUM]** Each E2E test gets a **fresh browser context** with independent cookies, localStorage, and session state. Tests never depend on state from previous tests.

### 4.2 E2E flakiness budget

- [ ] **[HIGH]** Individual E2E test flakiness rate is **<0.5%** (measured over rolling 30-day window). Tests exceeding this threshold are quarantined within 48 hours.
- [ ] **[HIGH]** Overall E2E suite false failure rate is **<5%**. Formula: with N tests each at flakiness rate p, suite false failure rate = 1 - (1-p)^N. Keep N × p low.
- [ ] **[MEDIUM]** Flaky tests are tracked on a dashboard with severity, frequency, last occurrence, and assigned owner. Quarantined tests have a **14-day fix-or-delete deadline**.

### 4.3 Visual regression testing

- [ ] **[MEDIUM]** UI-facing systems have visual regression tests covering primary views and responsive breakpoints. Use Playwright built-in screenshot comparison for small projects; Chromatic or Percy for cross-browser needs.
- [ ] **[MEDIUM]** Visual tests **mask dynamic content** (timestamps, avatars, animated elements), disable animations, and wait for network idle before capture.
- [ ] **[LOW]** Visual regression tests use **layout-based diffing** over pixel-perfect comparison to reduce false positives from font rendering, anti-aliasing, and subpixel differences.

---

## SECTION 5: PROPERTY-BASED TESTING

### 5.1 Where property-based testing is required

- [ ] **[CRITICAL]** All **serialization/deserialization** functions have round-trip property tests: `deserialize(serialize(x)) == x` for all valid inputs.
- [ ] **[CRITICAL]** All **parsers** (configuration, protocol messages, user input, blockchain data) have property-based tests verifying they handle arbitrary well-formed and malformed inputs without crashing.
- [ ] **[HIGH]** All pure functions operating on **numeric domains** (financial calculations, fee computation, token math, order sizing) have property-based tests verifying:
  - Invariant preservation (e.g., total supply conservation)
  - Commutativity where mathematically expected (e.g., `add(a, b) == add(b, a)`)
  - Idempotency where expected (e.g., `normalize(normalize(x)) == normalize(x)`)
  - Boundary behavior (no overflow, no underflow, no division by zero)
- [ ] **[HIGH]** State machines and protocol handlers have **stateful property-based tests** (model-based testing) verifying that all reachable states satisfy defined invariants.
- [ ] **[MEDIUM]** AI agent orchestration logic (Shadow Clone) has property-based tests verifying message ordering guarantees, task completion invariants, and error recovery properties.

### 5.2 Configuration and execution

- [ ] **[HIGH]** Property-based test iteration counts are configured per environment:
  - Local development: **≥100 iterations** (fast feedback)
  - CI (per-PR): **≥500 iterations**
  - Nightly/pre-release: **≥10,000 iterations**
- [ ] **[HIGH]** Failing property test cases are **shrunk to minimal reproduction** and added as pinned regression tests (`@example()` in Hypothesis, explicit test case in fast-check).
- [ ] **[MEDIUM]** Property tests use `bound()` / constrained generators over `assume()` / input filtering. Filter-based approaches that discard >10% of generated inputs must be refactored.
- [ ] **[MEDIUM]** Framework selection by language:
  - TypeScript: fast-check
  - Python: Hypothesis
  - Rust: proptest
  - Go: gopter or rapid
  - Solidity: Foundry fuzz (native)

---

## SECTION 6: MUTATION TESTING

### 6.1 Mutation score requirements

- [ ] **[HIGH]** Critical business logic (financial calculations, order execution, token operations, access control, consensus logic) achieves a **mutation score ≥80%**. Surviving mutants in critical paths require documented justification.
- [ ] **[HIGH]** AI-generated code has mutation testing applied to verify that AI-written tests actually catch bugs (see Section 12). Mutation score for AI-generated modules must meet the same ≥80% threshold.
- [ ] **[MEDIUM]** Overall project mutation score is **≥60%** as a baseline, with a ratchet mechanism: the score never decreases between releases.
- [ ] **[MEDIUM]** Mutation testing runs in **incremental mode** on PRs (mutate only changed files). Full mutation analysis runs **nightly**. Incremental run budget: **≤15 minutes**.

### 6.2 Configuration and exclusions

- [ ] **[MEDIUM]** Mutation testing tools per language:
  - TypeScript/JS: Stryker Mutator (`thresholds: { high: 80, low: 60, break: 50 }`)
  - Python: mutmut
  - Rust: cargo-mutants
  - Java/JVM: PIT (Pitest)
- [ ] **[MEDIUM]** Excluded from mutation: generated code, type definitions, configuration files, logging statements, debug-only code paths. Exclusions are documented in the mutation config.
- [ ] **[LOW]** Equivalent mutants (mutations that produce semantically identical behavior) are identified and excluded from score calculation. Teams review surviving mutants monthly to distinguish true gaps from equivalents.

---

## SECTION 7: FUZZ TESTING

### 7.1 Coverage-guided fuzzing requirements

- [ ] **[CRITICAL]** All code that **parses untrusted input** (network protocols, file formats, API payloads, blockchain transactions, user-submitted data) has coverage-guided fuzz tests.
- [ ] **[CRITICAL]** Fuzz targets are compiled with **sanitizers enabled** (AddressSanitizer, UndefinedBehaviorSanitizer) for Rust and C/C++ code. Memory safety violations found by fuzzing are [CRITICAL] severity bugs.
- [ ] **[HIGH]** Fuzz testing runs **continuously** (not just in CI). A dedicated fuzzing infrastructure runs 24/7 on latest main branch code, with new coverage and crashes reported within 4 hours.
- [ ] **[HIGH]** Fuzz corpus is committed to version control and seeded with diverse valid and invalid inputs. Corpus is minimized periodically (`afl-cmin` or equivalent).
- [ ] **[MEDIUM]** Structure-aware fuzzing is used for complex input formats (protobuf, JSON schemas, binary protocols). Custom mutators or grammar-based fuzzing is implemented for proprietary formats.

### 7.2 Fuzz testing tools and configuration

- [ ] **[HIGH]** Fuzz testing tools by language:
  - Rust: cargo-fuzz (libFuzzer) + cargo-afl (AFL++)
  - Go: native `go test -fuzz`
  - TypeScript: fast-check (property-based fuzzing for logic), plus dedicated fuzz targets for any native/WASM modules
  - Solidity: Foundry fuzz + Echidna + Medusa (see Section 11)
  - C/C++ dependencies: AFL++ or libFuzzer with LLVM instrumentation
- [ ] **[MEDIUM]** Fuzzing campaigns have defined stopping criteria: continue until no new coverage paths are discovered for **≥24 hours**, or until a time budget (minimum **48 hours** for pre-release campaigns) is exhausted.
- [ ] **[MEDIUM]** All crashes found by fuzzing are triaged within **24 hours**, classified by severity, and fixed before release. Fuzz-found crashes in parsers or protocol handlers are treated as [CRITICAL].

---

## SECTION 8: CODE COVERAGE STANDARDS

### 8.1 Coverage thresholds

- [ ] **[CRITICAL]** New code (added or modified in a PR) achieves **≥80% line coverage AND ≥80% branch coverage**. PRs below this threshold do not merge without tech lead override and documented justification.
- [ ] **[CRITICAL]** Critical modules (financial logic, authentication, authorization, consensus, cryptographic operations) maintain **≥90% branch coverage**. These modules are tagged in the codebase and have dedicated coverage checks.
- [ ] **[HIGH]** Overall project coverage meets the **coverage ratchet**: coverage never decreases between merges to main. Current coverage is the floor, automatically updated by CI tooling.
- [ ] **[HIGH]** Smart contract code (Solidity) maintains **100% line coverage and 100% branch coverage** (see Section 11). There is no acceptable reason to deploy under-covered contract code.
- [ ] **[MEDIUM]** Coverage targets by project maturity:
  - New projects: ≥80% line + branch from inception
  - Established projects: ratchet from current level, minimum ≥70% overall
  - Legacy code: ratchet from current level, ≥80% required for all new/modified files
  - Safety-critical components: ≥90% MC/DC coverage

### 8.2 Coverage metrics and measurement

- [ ] **[HIGH]** Coverage measurement includes both **line coverage and branch coverage**. Line coverage alone is insufficient — conditional logic without branch coverage creates false confidence.
- [ ] **[HIGH]** Coverage reports distinguish between **meaningful coverage** (tests with assertions that verify behavior) and **incidental coverage** (code executed by tests that assert something else). Mutation testing (Section 6) is the mechanism for validating coverage quality.
- [ ] **[MEDIUM]** Coverage exclusion policy: The following may be excluded from coverage metrics with documented justification:
  - Generated/scaffolded code (ORM models, API clients from OpenAPI specs)
  - Platform-specific OS interface code not testable in CI environment
  - Debug/development-only code paths (behind feature flags or compile-time guards)
  - Panic/unreachable handlers that exist only for type-system completeness
- [ ] **[MEDIUM]** Coverage is tracked at both file level and module level. Files with **<50% coverage** are flagged in dashboards regardless of overall project coverage.

### 8.3 Coverage anti-patterns

- [ ] **[HIGH]** Tests that execute code without meaningful assertions (coverage gaming) are detected and rejected. Coverage without assertion = zero value. Mutation testing catches this.
- [ ] **[MEDIUM]** Teams do not treat coverage thresholds as ceilings. Google's observation: "engineers treat the 80% floor as a ceiling." Coverage is a minimum bar, not a target to satisfy and stop.

---

## SECTION 9: TEST ISOLATION AND DETERMINISM

### 9.1 Deterministic test execution

- [ ] **[CRITICAL]** All tests are **fully deterministic** — identical results on every execution, in every environment, regardless of execution order, time of day, or machine state.
- [ ] **[CRITICAL]** Tests **never read the system clock directly**. Time-dependent logic uses injected clock abstractions:
  - TypeScript: Dependency-injected `Clock` interface, or `vi.useFakeTimers()` / `jest.useFakeTimers()` in test
  - Python: `freezegun` library or `unittest.mock.patch('time.time')`
  - Rust: Tokio `tokio::time::pause()` or injected `Clock` trait
  - Go: Injected `func() time.Time` or `clock` interface
- [ ] **[CRITICAL]** Tests **never make real network calls**. All external HTTP, gRPC, WebSocket, and database connections in unit tests are replaced with test doubles, recorded responses, or local containers.
- [ ] **[HIGH]** Tests **never depend on filesystem state** outside of explicitly created temp directories that are cleaned up after each test.

### 9.2 State isolation

- [ ] **[CRITICAL]** Tests **do not share mutable state**. Each test creates its own data (Fresh Fixture pattern), operates on it, and either cleans it up or runs in an isolated transaction/context.
- [ ] **[CRITICAL]** **No global mutable state** is modified by tests without restoration. If a test must modify a global (environment variable, singleton, static), it saves, modifies, and restores in a try/finally or equivalent.
- [ ] **[HIGH]** Test suites are configured to **randomize test execution order** in CI to surface hidden ordering dependencies. Frameworks: `pytest-randomly` (Python), `jest --randomize` (JS), `cargo test` (Rust — shuffled by default).
- [ ] **[HIGH]** Database-backed tests use **one of**: per-test transaction rollback, per-test ephemeral schema, or per-suite container isolation. Shared mutable database state between tests is a [CRITICAL] violation.

### 9.3 Flaky test management

- [ ] **[CRITICAL]** The overall test suite **false failure rate** (failures not caused by real bugs) is **<2%** on a rolling 7-day average. Exceeding this threshold triggers a mandatory flaky test triage sprint.
- [ ] **[HIGH]** Flaky tests are **automatically detected** by CI infrastructure (track pass/fail history per test over ≥20 runs). Tests with **>1% flakiness rate** are quarantined automatically.
- [ ] **[HIGH]** Quarantined flaky tests are **fixed or deleted within 14 days**. Quarantined tests do not block deployments but ARE visible in dashboards and tracked as tech debt.
- [ ] **[HIGH]** New tests run in a **burn-in period**: executed ≥20 times in CI before being added to the critical path. Tests that fail ≥1 time during burn-in are flagged for investigation before promotion.
- [ ] **[MEDIUM]** Flaky test dashboard tracks: test name, flakiness rate, last failure date, root cause category (timing, state leakage, external dependency, resource contention), assigned owner, and age in quarantine.

---

## SECTION 10: CI/CD TEST GATES

### 10.1 Pipeline stage definitions

- [ ] **[CRITICAL]** PR/Pre-merge gate (**≤10 minutes total**):
  - Static analysis (linting, type checking, formatting)
  - All unit tests (parallelized)
  - Critical integration tests (contract tests, core API tests)
  - Coverage check (≥80% on new code)
  - Security scanning (dependency audit, SAST)
- [ ] **[CRITICAL]** Post-merge gate (**≤20 minutes total**):
  - Full unit + integration test suite
  - E2E smoke tests (critical paths only)
  - Mutation testing (incremental, changed files only)
  - Visual regression tests (if applicable)
  - Performance micro-benchmarks against stored baselines
- [ ] **[HIGH]** Nightly gate (**≤3 hours**):
  - Full E2E suite across all target environments
  - Full mutation testing
  - Extended property-based tests (≥10,000 iterations)
  - Cross-browser/cross-platform testing (if applicable)
  - Load/stress test suite
  - Full visual regression suite
- [ ] **[MEDIUM]** Weekly gate:
  - Extended fuzz campaign review and corpus update
  - Chaos engineering experiments (staging environment)
  - Dependency vulnerability deep scan
  - Performance baseline recalibration
  - Accessibility full-site scan

### 10.2 Parallelization and performance

- [ ] **[HIGH]** Tests are parallelized using **duration-based sharding** (not test-count-based). Historical timing data drives shard balancing for even distribution.
- [ ] **[HIGH]** CI test infrastructure achieves **≥70% time reduction** through parallelization compared to sequential execution. Target: 1,000 unit tests complete in **<3 minutes**.
- [ ] **[MEDIUM]** Matrix builds cover all supported platforms and language versions. Matrix strategy uses **fail-fast for PR checks** and **run-all for nightly/release builds**.

### 10.3 Timeout and failure policies

- [ ] **[HIGH]** Test timeouts are enforced per layer:
  - Unit test: **5 seconds** per test (hard kill)
  - Integration test: **60 seconds** per test
  - E2E test: **120 seconds** per test
  - Full PR suite: **10 minutes** total (hard kill, investigate if exceeded)
- [ ] **[HIGH]** PR pipeline uses **fail-fast** for unit tests and lint checks (stop on first critical failure for fast feedback). Integration and E2E stages run all tests for complete failure picture.
- [ ] **[MEDIUM]** Only **failed shards are retried** on transient failures — full suite reruns are prohibited (masks flakiness). Maximum **1 automatic retry** per failed test. Two consecutive failures = real failure.

---

## SECTION 11: SMART CONTRACT TESTING

### 11.1 Unit testing with Foundry

- [ ] **[CRITICAL]** All smart contracts have unit tests written in Solidity using Foundry (`forge test`). Test file structure mirrors source: `src/Token.sol` → `test/Token.t.sol`.
- [ ] **[CRITICAL]** Smart contract unit tests achieve **100% line coverage** (`forge coverage`). There is no acceptable exception — the financial risk of untested contract code is unacceptable.
- [ ] **[CRITICAL]** Smart contract unit tests achieve **100% branch coverage**. Every conditional path (if/else, require, ternary) is exercised in both directions.
- [ ] **[CRITICAL]** All **revert conditions** are tested with `vm.expectRevert(selector)` specifying the exact error. The deprecated `testFail_` prefix is prohibited — it does not verify WHY a revert occurred.
- [ ] **[CRITICAL]** All **access-controlled functions** have tests verifying unauthorized callers are rejected. Every `onlyOwner`, `onlyAdmin`, role-based modifier has a corresponding unauthorized-caller test.
- [ ] **[HIGH]** Test naming follows Foundry conventions:
  - `test_Description` — standard tests
  - `testFuzz_Description` — fuzz tests
  - `test_RevertWhen_Condition` / `test_RevertIf_Condition` — revert tests
  - `invariant_Description` — invariant tests
- [ ] **[HIGH]** Edge cases are explicitly tested: **zero amounts, `type(uint256).max`, empty arrays, `address(0)`, reentrancy scenarios, self-transfers, zero-address recipients**.
- [ ] **[HIGH]** Event emissions are verified with `vm.expectEmit(true, true, true, true)` for all state-changing operations.
- [ ] **[MEDIUM]** Internal functions are tested via **test harness contracts** that inherit the target and expose internal functions. Direct testing of internal functions through other means is prohibited.
- [ ] **[MEDIUM]** Assertions in `setUp()` are prohibited. Use a dedicated `test_SetUpState()` function to verify initial conditions.

### 11.2 Fuzz testing with Foundry

- [ ] **[CRITICAL]** All public/external functions accepting user inputs have **fuzz tests** (`testFuzz_` prefix). Foundry generates random values for all function parameters.
- [ ] **[HIGH]** Fuzz run counts are configured by profile:
  - Default (local dev): **256 runs**
  - CI (per-PR): **500–1,000 runs**
  - Pre-audit/pre-deployment: **≥10,000 runs**
  - Extended campaign (dedicated security review): **100,000+ runs**
- [ ] **[HIGH]** Input constraints use **`bound(value, min, max)`** over `vm.assume()`. Excessive `vm.assume()` usage (>10% input rejection rate) triggers a refactoring requirement.
- [ ] **[HIGH]** Fuzz seeds are configured for CI reproducibility. Seeds may rotate weekly to balance reproducibility with exploration.
- [ ] **[MEDIUM]** Failing fuzz cases are persisted (`failure_persist_dir`) and replayed in subsequent runs as regression tests.

### 11.3 Invariant testing (stateful fuzzing)

- [ ] **[CRITICAL]** All DeFi protocols and token contracts have **invariant tests** (`invariant_` prefix) verifying protocol-level properties across random function call sequences.
- [ ] **[CRITICAL]** Minimum invariants for DeFi contracts:
  - `totalSupply == sum(all balances)` (token conservation)
  - `sum(deposits) >= sum(withdrawals)` (vault solvency)
  - No user can withdraw more than their balance
  - Access control invariants hold across all state transitions
- [ ] **[HIGH]** Invariant tests use the **handler pattern**: dedicated handler contracts that constrain inputs to realistic ranges and track ghost variables for independent accounting verification.
- [ ] **[HIGH]** Invariant test configuration: **≥256 runs, depth ≥50** for CI. Pre-audit: **≥1,000 runs, depth ≥100**.
- [ ] **[MEDIUM]** `targetContract()` and `targetSelector()` are configured to focus the fuzzer on meaningful function sequences. Unconstrained fuzzing with all selectors wastes budget on irrelevant paths.

### 11.4 Fork testing

- [ ] **[HIGH]** All integrations with deployed contracts (Chainlink oracles, Uniswap pools, Aave lending pools, governance contracts) have **fork tests against mainnet state**.
- [ ] **[HIGH]** Fork tests are **pinned to specific block numbers** for deterministic execution and RPC response caching. First-run performance: ~7 minutes; cached runs: **<1 second**.
- [ ] **[HIGH]** Fork-based fuzz tests use **fixed seeds** to prevent excessive RPC consumption.
- [ ] **[MEDIUM]** `[rpc_endpoints]` are configured in `foundry.toml` (not CLI flags) for flexibility across profiles.

### 11.5 Formal verification

- [ ] **[HIGH]** Critical financial invariants (token conservation, vault solvency, access control completeness) are **formally verified** using Halmos (symbolic testing with existing Foundry tests) or Certora Prover (CVL specifications).
- [ ] **[HIGH]** Formal verification proves properties for **ALL possible inputs** — not sampled. Results explicitly confirm: "No counterexample found for all 2^256 input combinations" or produce a concrete counterexample.
- [ ] **[MEDIUM]** Formal verification tool selection:
  - **Halmos**: For teams already using Foundry. Reuses existing `test_` functions with `check_` prefix. Low additional effort.
  - **Certora Prover**: For complex protocol-level properties requiring CVL specs. Higher effort, strongest guarantees. Secured $100B+ TVL.
  - **KEVM**: For deep EVM-level verification. Highest effort.
- [ ] **[MEDIUM]** Verification is performed on every major contract upgrade and before any mainnet deployment.

### 11.6 Gas snapshot testing

- [ ] **[HIGH]** `.gas-snapshot` file is committed to version control. `forge snapshot --check` runs in CI on every PR to catch gas regressions.
- [ ] **[HIGH]** Gas regressions exceeding **10%** on any public function require explicit justification in the PR description.
- [ ] **[MEDIUM]** Gas reports (`forge test --gas-report`) are generated for all contract test suites, showing min, max, mean, and median gas per function.
- [ ] **[MEDIUM]** In-test gas snapshots (`vm.startSnapshotGas` / `vm.stopSnapshotGas`) are used for fine-grained gas measurement of specific operations.

### 11.7 Static analysis

- [ ] **[CRITICAL]** **Slither** static analysis runs on all Solidity code with **zero high-severity findings** before deployment. Medium-severity findings require documented mitigation or acceptance.
- [ ] **[HIGH]** Contract bytecode size stays under **24,576 bytes** (EIP-170 limit). Size is checked in CI.

---

## SECTION 12: AI-GENERATED CODE TESTING

### 12.1 Testing requirements for AI-generated code

- [ ] **[CRITICAL]** AI-generated code is subject to **all the same testing requirements** as human-written code, with additional verification layers. AI code is not exempt from any section of this protocol.
- [ ] **[CRITICAL]** AI-generated tests are verified to **fail when the implementation is incorrect**. Specifically: introduce a known bug into the implementation and confirm the test catches it. Up to 68% of AI-generated test suites validate bugs rather than detecting them — this check prevents that failure mode.
- [ ] **[HIGH]** AI-generated tests undergo **mutation testing** (Section 6) to verify assertion quality. AI tests that achieve high coverage but low mutation scores (tests that execute code without meaningfully asserting on outputs) are rejected.
- [ ] **[HIGH]** AI-generated tests are reviewed for these specific anti-patterns:
  - Tests with no meaningful assertions (coverage-only tests)
  - Over-mocking that disconnects tests from real behavior
  - Tautological tests (testing the code against itself)
  - Flaky tests from non-deterministic patterns the AI introduced
  - Tests that filter/skip failing cases (masks real bugs)

### 12.2 AI agent testing workflow

- [ ] **[HIGH]** AI coding agents follow this workflow:
  1. Receive or define acceptance criteria and specifications (human-provided or derived from existing code)
  2. Write failing tests from specifications (TDD red phase)
  3. Generate implementation to pass tests (TDD green phase)
  4. Refactor while keeping tests green (TDD refactor phase)
  5. Run mutation testing to validate test quality
  6. Submit for human review of test quality, edge cases, and architecture
- [ ] **[HIGH]** AI agents do NOT use code coverage as the primary optimization target for test generation. Coverage is a necessary condition, not a sufficient one.
- [ ] **[MEDIUM]** AI-generated tests include a `// AI-GENERATED` marker comment for traceability. This enables separate tracking of AI test quality metrics.

---

## SECTION 13: PERFORMANCE AND LOAD TESTING

### 13.1 Performance regression detection

- [ ] **[CRITICAL]** Performance-critical paths (trading bot order execution, SAGE inference latency, blockchain transaction processing) have **automated benchmark tests** that run on every merge to main.
- [ ] **[CRITICAL]** Performance regression threshold: any benchmark showing **>5% regression** from the stored baseline blocks the merge. The 5% threshold accounts for measurement noise; regressions between 5-10% require investigation; >10% is an automatic blocker.
- [ ] **[HIGH]** Benchmarks run **≥5 iterations** with statistical analysis (mean, standard deviation, p95, p99). Single-run benchmarks are insufficient — measurement noise causes false positives.
- [ ] **[HIGH]** Benchmark baselines are stored in version control alongside code. Baselines are updated only via explicit PR (not automatically) to prevent gradual regression acceptance.
- [ ] **[MEDIUM]** Trading bot benchmarks enforce **sub-100ms total response time** (order receipt → execution decision → order submission) at p99. This is a hard functional requirement, not just a performance target.

### 13.2 Load testing

- [ ] **[HIGH]** Load tests run in staging before every release. Minimum test types:
  - **Smoke test**: 1-5 virtual users (VUs), 1-5 minutes — verify scripts work
  - **Load test**: Expected production VUs, 15-30 minutes — validate SLOs
  - **Stress test**: 2-3x expected VUs, 15-30 minutes — find breaking points
  - **Soak test**: Expected VUs, ≥4 hours — detect memory leaks and resource exhaustion
- [ ] **[HIGH]** Load test pass/fail thresholds are defined as code:
  - Response time: **p95 < defined SLO** (e.g., 500ms for API endpoints)
  - Error rate: **<1%** under expected load
  - Throughput: **≥defined minimum RPS** for critical endpoints
- [ ] **[HIGH]** Load testing tool: **k6** (recommended) with thresholds enforced via non-zero exit codes in CI.
- [ ] **[MEDIUM]** Load test scripts use **tags** for per-endpoint granularity. Critical transactions (checkout, order placement, token transfers) have separate, stricter thresholds.

### 13.3 Chaos engineering and resilience testing

- [ ] **[HIGH]** Production-bound systems undergo **chaos engineering experiments** in staging before release:
  - Service instance termination (random pod/container kill)
  - Network latency injection (100ms-5s added delay)
  - Network partition simulation
  - Dependency failure (database unavailable, external API timeout)
- [ ] **[HIGH]** Chaos experiments have a defined **steady-state hypothesis** (specific metrics and expected ranges) measured before, during, and after fault injection. Experiments that cause violations outside acceptable bounds trigger mandatory remediation.
- [ ] **[MEDIUM]** Chaos engineering tools:
  - Kubernetes: Litmus (CNCF) or Gremlin
  - AWS: AWS Fault Injection Simulator
  - General: Gremlin (commercial) or custom scripts
- [ ] **[MEDIUM]** Combine chaos experiments with load tests (fault injection during sustained load) to discover emergent failures that only appear under stress.

### 13.4 Deterministic simulation testing (for distributed systems)

- [ ] **[HIGH]** Distributed systems (Unavis L1 blockchain, Shadow Clone orchestration) use **deterministic simulation testing** (DST) where feasible. DST replaces all non-determinism (clocks, network, thread scheduling, RNG) with controlled, reproducible equivalents.
- [ ] **[MEDIUM]** DST implementations enable **full reproduction of any bug** from a single seed value. Any failure found in simulation can be replayed deterministically for debugging.

---

## SECTION 14: ACCESSIBILITY TESTING

### 14.1 Automated accessibility scanning

- [ ] **[HIGH]** All web-facing UIs pass automated accessibility scanning with **zero Level A or Level AA violations** (WCAG 2.2). Use `axe-core` as the primary scanning engine.
- [ ] **[HIGH]** Accessibility tests run on **every PR** for pages modified by the PR. Full-site accessibility scans run **nightly**.
- [ ] **[HIGH]** Automated checks enforce:
  - All images have meaningful `alt` text (WCAG 1.1.1)
  - Color contrast ≥ **4.5:1** for normal text, ≥ **3:1** for large text (WCAG 1.4.3)
  - All form inputs have associated labels (WCAG 1.3.1)
  - Valid ARIA attributes and roles (WCAG 4.1.2)
  - Touch targets ≥ **24×24 CSS pixels** (WCAG 2.5.8)
- [ ] **[MEDIUM]** Accessibility testing integrations:
  - Playwright: `@axe-core/playwright`
  - Cypress: `cypress-axe`
  - Jest/component tests: `jest-axe`
  - CI scanner: Pa11y CLI
- [ ] **[MEDIUM]** Google Lighthouse accessibility score **≥90** on all primary pages.

### 14.2 Manual accessibility verification

- [ ] **[MEDIUM]** Keyboard navigation is manually verified for all interactive workflows: all functionality reachable via keyboard alone, focus order is logical, focus indicator is always visible (WCAG 2.1.1, 2.4.7).
- [ ] **[LOW]** Screen reader testing (NVDA on Windows, VoiceOver on macOS) is performed quarterly on critical user flows.
- [ ] **[LOW]** Automated scanning catches approximately **57% of WCAG issues** (Deque benchmark). The remaining 43% require manual assessment — schedule manual accessibility reviews semi-annually.

---

## APPENDIX A: RECOMMENDED TOOLS BY LANGUAGE

### TypeScript / JavaScript

| Category | Tool | Notes |
|----------|------|-------|
| Unit Testing | Vitest, Jest | Vitest preferred for speed; native ESM support |
| Integration Testing | Vitest + Testcontainers, Supertest | Supertest for HTTP API testing |
| E2E Testing | Playwright | Default choice for all new projects |
| Property-Based | fast-check | 100+ default iterations; deterministic via seed |
| Mutation | Stryker Mutator | `thresholds: { high: 80, low: 60, break: 50 }` |
| Mocking | MSW (network), Vitest mocks (minimal) | MSW for HTTP; avoid over-mocking |
| Coverage | v8 (via Vitest), c8, istanbul | Branch coverage required |
| Contract Testing | Pact (pact-js) | Consumer-driven contracts |
| Accessibility | @axe-core/playwright, jest-axe | Zero-false-positive engine |
| Visual Regression | Playwright screenshots, Chromatic | Chromatic for Storybook projects |
| Load Testing | k6 | JavaScript test scripts, Go runtime |

### Rust

| Category | Tool | Notes |
|----------|------|-------|
| Unit Testing | cargo test (built-in) | Parallel by default, randomized order |
| Integration Testing | cargo test + Testcontainers | `tests/` directory for integration tests |
| Property-Based | proptest | `proptest!{}` macro, `prop_assert!` for assertions |
| Mutation | cargo-mutants | Zero-config, Mold linker for speed |
| Fuzz Testing | cargo-fuzz (libFuzzer), cargo-afl | Always enable ASan + UBSan |
| Coverage | cargo-llvm-cov, tarpaulin | LLVM source-based coverage preferred |
| Benchmarking | criterion.rs | Statistical analysis, regression detection |

### Python

| Category | Tool | Notes |
|----------|------|-------|
| Unit Testing | pytest | De facto standard; rich plugin ecosystem |
| Integration Testing | pytest + Testcontainers | `testcontainers-python` package |
| Property-Based | Hypothesis | Profiles: fast (10), default (100), ci (derandomize=True), long (1000) |
| Mutation | mutmut | AST-based, caching for speed |
| Fuzz Testing | Atheris (libFuzzer binding) | For native extension modules |
| Coverage | coverage.py + pytest-cov | Branch coverage via `--cov-branch` |
| Mocking | unittest.mock, pytest-mock | Minimize use per FP protocol |
| Time Control | freezegun | Deterministic time tests |
| Load Testing | Locust | Python-based, distributed |

### Go

| Category | Tool | Notes |
|----------|------|-------|
| Unit Testing | testing (stdlib) | Table-driven tests are idiomatic |
| Integration Testing | testing + Testcontainers | `testcontainers-go` package |
| Property-Based | gopter, rapid | rapid is newer and simpler |
| Fuzz Testing | go test -fuzz (native, Go 1.18+) | Built-in coverage-guided fuzzing |
| Coverage | go test -cover -coverprofile | Branch coverage via go tool cover |
| Mocking | testify/mock (minimal use) | Prefer interfaces + fakes over mocks |
| Benchmarking | testing.B (stdlib) | `go test -bench` with benchstat for comparison |

### Solidity

| Category | Tool | Notes |
|----------|------|-------|
| Unit Testing | Foundry (forge test) | Solidity-native, 5x faster than Hardhat |
| Fuzz Testing | Foundry fuzz (forge) | Default 256 runs; CI 500-1000; pre-audit 10K+ |
| Invariant Testing | Foundry invariant | Handler pattern, ghost variables |
| Stateful Fuzzing | Echidna, Medusa | Echidna: Haskell-based; Medusa: Go-based, parallel |
| Formal Verification | Halmos, Certora Prover | Halmos reuses Foundry tests; Certora for complex specs |
| Static Analysis | Slither | 40+ detectors, zero high-severity findings required |
| Gas Testing | forge snapshot | `--check` flag in CI for regression detection |
| Fork Testing | forge test --fork-url | Pin block numbers, cache RPC responses |

---

## APPENDIX B: REFERENCE THRESHOLDS

### Coverage Thresholds

| Context | Line Coverage | Branch Coverage | Mutation Score |
|---------|--------------|-----------------|----------------|
| New code (per PR) | ≥80% | ≥80% | — |
| Critical modules | ≥90% | ≥90% | ≥80% |
| Smart contracts | 100% | 100% | ≥80% |
| Overall project | Ratchet (never decrease) | Ratchet (never decrease) | ≥60% |
| Legacy (modified files) | ≥80% | ≥80% | — |
| Safety-critical | 100% | 100% MC/DC | ≥90% |

### Speed Thresholds

| Test Type | Per-Test Limit | Suite Limit | CI Stage Limit |
|-----------|---------------|-------------|----------------|
| Unit test (pure function) | 10ms target | — | — |
| Unit test (with dependencies) | 100ms hard limit | — | — |
| Integration test | 30s hard limit | — | — |
| E2E test | 120s hard limit | — | — |
| PR gate (total) | — | — | 10 minutes |
| Post-merge gate (total) | — | — | 20 minutes |
| Nightly suite (total) | — | — | 3 hours |

### Fuzz Testing Iteration Counts

| Context | Foundry Fuzz | Foundry Invariant | Echidna | Property-Based |
|---------|-------------|-------------------|---------|----------------|
| Local dev | 256 | 256 runs × depth 15 | 10,000 | 100 |
| CI (per PR) | 500-1,000 | 256 runs × depth 50 | 50,000 | 500 |
| Pre-audit | 10,000-25,000 | 1,000 runs × depth 100 | 100,000+ | 10,000 |
| Extended campaign | 100,000+ | — | 1,000,000 | — |

### Performance and Reliability Thresholds

| Metric | Threshold | Enforcement |
|--------|-----------|-------------|
| Benchmark regression | >5% = investigate, >10% = block | Per merge to main |
| API response time (p95) | <500ms (default SLO) | Load testing |
| API error rate under load | <1% | Load testing |
| Trading bot latency (p99) | <100ms | Per merge + load testing |
| Test flakiness (per test) | <0.5% (E2E), <0.1% (unit) | Rolling 30-day window |
| Suite false failure rate | <2% | Rolling 7-day average |
| Flaky test quarantine deadline | 14 days | Dashboard tracked |
| Gas regression threshold | >10% = block | Per PR |

### Accessibility Thresholds

| Metric | Threshold | Standard |
|--------|-----------|----------|
| WCAG compliance level | Level AA minimum | WCAG 2.2 |
| Text contrast (normal) | ≥4.5:1 | WCAG 1.4.3 AA |
| Text contrast (large) | ≥3:1 | WCAG 1.4.3 AA |
| Non-text contrast (UI) | ≥3:1 | WCAG 1.4.11 AA |
| Touch target size | ≥24×24 CSS px | WCAG 2.5.8 AA |
| Lighthouse a11y score | ≥90 | Best practice |
| Automated WCAG A/AA violations | Zero | Per PR |

---

## APPENDIX C: TESTING STRATEGY DECISION FRAMEWORK

### When to use each test type

| Situation | Primary Tests | Supporting Tests |
|-----------|--------------|-----------------|
| Pure function (math, transforms, validation) | Unit test + property-based test | Mutation testing for assertion quality |
| API endpoint | Integration test (contract + HTTP) | Unit tests for business logic, E2E for critical paths |
| Database query logic | Integration test (Testcontainers) | Unit tests for query builder logic |
| External API integration | Contract test (Pact) + mock (WireMock/MSW) | Integration test with real service (staging) |
| Smart contract | Unit + fuzz + invariant | Formal verification + fork test + gas snapshot |
| Parser / deserializer | Fuzz test + property-based test | Unit tests for known formats |
| UI component | Integration test (Testing Library) | Visual regression, accessibility scan |
| Critical user flow | E2E test (Playwright) | Smoke test in CI, full suite nightly |
| Performance-sensitive path | Benchmark test (criterion/k6) | Load test, chaos test (staging) |
| Distributed system | Deterministic simulation test | Property-based, chaos engineering |
| AI-generated code | Same as above + mutation testing + bug injection verification | All above, with stricter review |

### Testing pyramid shape by architecture

| Architecture | Shape | Rationale |
|-------------|-------|-----------|
| Monolith with rich domain logic | Pyramid (80/15/5) | Most logic is testable in isolation |
| Microservices | Diamond (20/60/20) | Inter-service contracts matter most |
| Frontend SPA | Trophy (static/unit/integration/E2E) | User-facing integration tests give most confidence |
| Smart contracts | Inverted (unit + fuzz + formal, all layers critical) | Financial risk demands exhaustive testing at every layer |
| Data pipeline | Diamond (30/50/20) | Data flow integration is primary concern |
| Trading system | Pyramid + property-based + performance | Pure logic + latency sensitivity |

---

## APPENDIX D: ANTI-PATTERN REFERENCE

### Testing anti-patterns that trigger review rejection

1. **Coverage gaming**: Tests that execute code without meaningful assertions. Detected by mutation testing showing low kill rate despite high coverage.
2. **Mock-heavy tests**: Tests with more mock setup than actual logic verification. Pure functions require zero mocks; impure boundary code should use minimal, targeted test doubles.
3. **Testing implementation details**: Tests that break when code is refactored but behavior is unchanged. Test names reference private methods or internal data structures.
4. **Shared mutable fixtures**: Tests that modify shared state (database rows, files, globals) without cleanup, causing order-dependent failures.
5. **Static waits**: `sleep(2000)`, `waitForTimeout(5000)`, or equivalent. Use auto-waiting (Playwright locators), event-driven waits, or polling with timeout.
6. **Snapshot abuse**: Large snapshot tests (>50 lines) that nobody reads when they change. Snapshots should be small, focused, and diff-readable.
7. **The Ice Cream Cone**: More E2E tests than unit tests. Inverts the pyramid, creating slow, flaky, expensive test suites.
8. **Tautological tests**: Tests that verify code against itself rather than against an independent specification. Common in AI-generated tests.
9. **Ignoring edge cases**: Testing only the happy path. Missing: zero values, max values, empty collections, null/undefined, boundary conditions, error paths, concurrent access.
10. **Test-per-method**: One test per method regardless of method complexity. Tests should cover behaviors, not methods. A complex method may need 10 tests; a trivial getter needs zero.

---

## APPENDIX E: PROTOCOL COMPLIANCE CHECKLIST (SUMMARY)

Use this summary for rapid compliance assessment. All items reference detailed sections above.

### Deployment blockers (all must be [x])

- [ ] Unit test coverage ≥80% on new code (line + branch) — §8.1
- [ ] Smart contract coverage 100% (line + branch) — §11.1
- [ ] Zero [CRITICAL] test failures — §10.1
- [ ] Coverage ratchet: overall coverage has not decreased — §8.1
- [ ] Serialization round-trip property tests exist — §5.1
- [ ] Parser fuzz tests exist — §7.1
- [ ] Smart contract fuzz tests exist with ≥500 runs — §11.2
- [ ] Smart contract invariant tests exist — §11.3
- [ ] Smart contract Slither: zero high-severity findings — §11.7
- [ ] Gas snapshot committed and regression-checked — §11.6
- [ ] AI-generated tests verified to catch known bugs — §12.1
- [ ] PR gate completes in ≤10 minutes — §10.1
- [ ] Test suite false failure rate <2% — §9.3
- [ ] Performance benchmarks show no >10% regression — §13.1
- [ ] All tests are deterministic (no system clock, no real network) — §9.1
- [ ] Accessibility: zero WCAG 2.2 Level A/AA violations — §14.1

### Release requirements (all must be [x] or justified [~])

- [ ] Mutation score ≥80% on critical modules — §6.1
- [ ] Property-based tests at ≥10,000 iterations pass — §5.2
- [ ] Load test passes at expected production VUs — §13.2
- [ ] Chaos engineering experiments completed in staging — §13.3
- [ ] Nightly E2E suite flakiness <5% — §4.2
- [ ] Smart contract formal verification completed — §11.5
- [ ] Fork tests pass against current mainnet state — §11.4
- [ ] Full mutation testing run completes with score ≥60% — §6.1

---

*This protocol is a living document. Thresholds are reviewed quarterly and adjusted based on team maturity, system risk profile, and empirical defect data. Proposed changes require approval from the engineering leads and a documented rationale referencing defect metrics or industry benchmarks.*
