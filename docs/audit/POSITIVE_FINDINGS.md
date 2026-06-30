# Shadow Clone — Positive Security & Quality Findings

Audit reports usually surface defects. This file surfaces the **load-bearing
defensive patterns** the `/sc-audit` Wave 1 specialists confirmed were already
correct. Recording them is not self-congratulation — it is regression
insurance. Future PRs that touch these surfaces should preserve the
properties documented here, and the audit itself should not re-discover
them on the next pass.

Source: `/sc-audit` Wave 1 specialist reports (Application Security,
Supply Chain, Infrastructure Security, Quality / Protocol-Conformance),
captured 2026-06-30. Cross-references the `AUDIT-029` aggregate entry in
`ISSUE_TRACKER.md`.

## Application security

### AS-013 — paired-review re-entrancy guard verified correct
- **What was verified**: `bridge/lib/guard.sh` exports
  `sc_assert_not_reentrant`, which refuses to spawn a reviewer
  subprocess if `SC_IN_REVIEW` is already set in the environment.
  `sc_mark_in_review` then exports `SC_IN_REVIEW="${who}:$$"` before the
  reviewer runs, so every descendant process sees the marker and a
  nested bridge invocation aborts with a parseable `VERDICT: ERROR`
  instead of recursing or self-deadlocking on the per-project lock.
  Both `bridge/ask-claude.sh` and `bridge/ask-glm.sh` call
  `sc_assert_not_reentrant` immediately after sourcing `guard.sh`.
- **Why it matters**: the bridge attaches the reviewer's stdout to a
  `<<<UNTRUSTED-REVIEWER-OUTPUT>>>` block (Theme 3); without the
  re-entrancy guard, a malicious reviewer prompt could cause the
  bridge to recurse on its own output and exhaust the user's API
  budget, or deadlock on the per-project flock that the outer review
  is still holding.
- **Don't regress**: any new bridge entrypoint must call
  `sc_assert_not_reentrant "<name>" || exit 0` before spawning the
  reviewer subprocess, and must call `sc_mark_in_review "<name>"`
  before the spawn so descendants see the marker. The contract — both
  functions, the `SC_IN_REVIEW` marker, and the "always emit a
  parseable `VERDICT: ERROR`" rule — lives in `bridge/lib/guard.sh`;
  AGENTS.md Rule 9 references the overall echo review loop but does
  not duplicate the marker mechanics.

### AS-007 — `--disallowedTools` argv syntax verified safe
- **What was verified**: the Claude CLI accepts `--disallowedTools Tool1 Tool2 …`
  as multi-positional arguments. The bridge passes the denylist as
  separate argv elements (not a single comma-joined string), so Claude
  parses each tool name independently and the deny list takes effect.
- **Why it matters**: `Edit`/`Write`/`MultiEdit`/`NotebookEdit`/`Bash`
  must actually be refused when GLM-via-bridge invokes Claude for an
  echo review — otherwise the reviewer could silently mutate the project
  under audit (Theme 3 trust boundary). The Theme 3 fix is load-bearing
  only because the CLI argv shape is correct.
- **Don't regress**: never concatenate the denylist into one
  comma-separated argument. AUDIT-027 includes an integration test
  asserting `Edit` is actually refused when called from inside a review.

### AS-012 — Bun `$` template interpolation verified safe
- **What was verified**: in the OpenCode plugin path (`opencode-plugin/sc-echo.js`)
  the `$\`…\`` Bun shell helper escapes interpolated values with
  per-shell quoting, **not** string-template expansion. A `$\`cmd
  ${attacker}\`` invocation can't inject shell metacharacters even if
  `attacker` contains `;` or `$(…)`.
- **Why it matters**: the OpenCode plugin shells out to `git diff` and
  the reviewer CLI; any unsafe interpolation would be a command-injection
  primitive reachable from a PR title or branch name.
- **Don't regress**: do not migrate `$\`…\`` to a `child_process.exec(string)`
  pattern. If a future refactor swaps shell backends, the new helper
  must be argv-only (no string-shell). AUDIT-027 tracks an integration
  test that injects metacharacters into a controlled fixture.

## Infrastructure security

### IS-008 — cksum 32-bit lock-file naming — collision is a perf issue, not a race
- **What was verified**: `_sc_lock_path` derives the per-project lock
  file name from a 32-bit cksum of the project path. Two different
  projects can collide; when they do, both serialize on the same lock
  and one waits up to `SC_LOCK_TIMEOUT` (default 900 s) for the other.
  No correctness or race-condition impact — the worst case is
  observable slowness, never an unsafe interleaving.
- **Why it matters**: a longer hash (sha1/sha256) would eliminate the
  collision but at the cost of a larger lock-file name and an additional
  tool dependency. The chosen tradeoff is documented and intentional.
- **Don't regress**: if `SC_LOCK_DIR` ever holds a name collision in
  practice, prefer a longer cksum/sha1 derivation over removing the
  per-project lock. A global lock would serialize unrelated repos and
  defeat the queue's purpose.

### IS-011 / IS-012 — sc-doctor probes (subsumed by AUDIT-025 fixes)
- These were observations rather than open defects after Theme 5:
  `scripts/sc-doctor.sh` now probes `${SC_LOCK_DIR:-…}` for
  user-privacy, prints the active umask in its banner, and refuses to
  validate config files whose mode strays from the allow-list. Listed
  here so future audits don't re-flag them.

## Quality / protocol-conformance

### QA-012 — `# impure:` annotations accurate across the codebase
- **What was verified**: every TS/bash function annotated with
  `# impure:` (or its TS prose-comment equivalent) genuinely has a side
  effect (filesystem, subprocess, mutation of shared state). Conversely,
  no function lacking the annotation hides an external interaction.
  Spot-checked by the QA reviewer against the FP Purity Protocol §4.
- **Why it matters**: the protocol leans on the annotation to keep the
  pure-function default credible. A pure function silently doing IO would
  be a bug that the Protocol can't catch; the audit confirms there are
  none in the current tree.
- **Don't regress**: when adding a new IO call site, annotate it. When
  refactoring an impure function into a pure one, delete the annotation.

### Module size after the AUDIT-020 split
- **What was verified**: `mcp-server/src/tools/modular-tools.ts` (the
  former 1400-line monolith) is now a 70-line dispatcher. Every
  per-handler file is 76–129 lines; every config table is 39–112 lines.
  All under the 200-line target.
- **Why it matters**: file-size limits in `CLAUDE.md` /
  `CONTRIBUTING.md` are non-negotiable structural standards. The split
  proves they are achievable across the surface area; future drift
  toward monoliths has no precedent to point to.

## Supply chain

### Hono cluster (transitively reachable, exploit path unreachable)
- **What was verified**: `hono@4.12.23` was flagged by `npm audit` with
  five HIGH-severity advisories — but every CVE applies to a Hono entry
  point (Lambda adapter, Cloudflare Worker adapter, `serve-static` on
  Windows, etc.) that the MCP server's stdio transport never reaches.
  The dependency is pulled in transitively via
  `@modelcontextprotocol/sdk` → `@hono/node-server`.
- **Why it matters**: a clean `npm audit` matters for downstream
  consumer trust regardless of reachability.
- **Action taken (P3 polish pass)**: `npm audit fix` in
  `mcp-server/` bumped to `hono@4.12.27`, clearing the advisory.
- **Don't regress**: when `@modelcontextprotocol/sdk` next updates,
  re-run `npm audit` and bump the lockfile so the cluster stays clean.

## How to read this file

These are not "things we don't need to fix." They are "things that work
*because* of a specific design choice." When you change one of the
surfaces above, the corresponding property is the contract you have to
preserve — or replace with something stronger and documented.

If a future audit finding contradicts an entry here, prefer the audit:
this file freezes a moment in time. Update the entry, don't argue with
the new finding.
