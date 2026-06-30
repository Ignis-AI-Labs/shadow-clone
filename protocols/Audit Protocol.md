# Audit Protocol

**Version:** 1.0
**Date:** March 2026
**Applies to:** Any software project

---

## Overview

This document defines a universal audit protocol for software projects. It establishes how code audits are conducted, how issues are tracked from discovery to resolution, and how the audit trail is maintained for regulatory, security, and operational review.

The protocol is designed for production-critical software where code correctness and security are paramount. Every issue must have a complete discovery-to-resolution trail.

---

## Core Principle

**Every issue has an audit trail from discovery to resolution.** No issue is ever "fixed" without a logged explanation of what changed, why, and how it was verified. This applies to bugs, security vulnerabilities, architectural problems, and code quality issues alike.

## Load-bearing companion: Gnosis Verification Protocol

This protocol governs how findings are **tracked** once they exist. The **Gnosis Verification Protocol** (`protocols/Gnosis Verification Protocol.md`) governs what can become a finding in the first place. Read it before opening any audit; it overrides any prior "flag-then-fix" guidance and replaces it with verify-or-research-question.

> "A bug that has not been verified is not a bug. It is a question."
> — Gnosis Verification Protocol §1

---

## File Structure

```
docs/audit/
├── AUDIT_PROTOCOL.md      # This file — operational workflow and agent coordination
├── SECURITY_CHECKLIST.md   # Comprehensive security audit checklist — MANDATORY for full audits
├── ISSUE_TRACKER.md       # Read-only snapshot (live source: GitHub Issues)
├── RESOLUTION_LOG.md      # Sprint session index
├── SPRINT_CURRENT.md      # Current sprint status + historical sprint index
├── temp/                  # Agent staging area (gitignored)
└── archive/               # Frozen discovery documents + session reports
    ├── SESSION_01.md
    ├── SESSION_02.md
    └── ...
```

### Two Documents, One System

This protocol has two parts:

1. **AUDIT_PROTOCOL.md** (this file) — **How** to run audits. Workflow, agent coordination, issue lifecycle, fix pipeline. Operational infrastructure.

2. **[SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md)** — **What** to check during audits. 10-section checklist covering smart contracts, blockchain infrastructure, application security, AI/LLM, data privacy, operational security, regulatory compliance, and emerging threats.

**Rule: During a full security audit, every section of SECURITY_CHECKLIST.md must be evaluated.** Sections not applicable to the project are marked `[N/A]` with written justification — not silently skipped. "We don't think it's relevant" is not a justification. "The project does not deploy smart contracts" is.

---

## Source of Truth: Issue Tracker

**The project's issue tracker (GitHub, GitLab, Jira, etc.) is the live, authoritative source for all audit findings.** Issues are created with labels for severity and domain, assigned to developers/agents, and auto-closed via `Fixes #N` commit footers on merge.

The markdown files in `docs/audit/` serve as:
- **ISSUE_TRACKER.md** — Read-only snapshot for offline reference
- **RESOLUTION_LOG.md** — Sprint session index
- **SPRINT_CURRENT.md** — Current sprint metadata
- **archive/** — Frozen session reports

### GitHub Label Taxonomy

| Label type | Labels |
| ---------- | ------ |
| Severity | `severity: critical`, `severity: high`, `severity: medium`, `severity: low` |
| Domain | `domain: security`, `domain: code-quality`, `domain: api`, `domain: infrastructure`, `domain: testing`, `domain: frontend`, `domain: backend`, `domain: database` |
| Source | `audit: sprint-1`, `audit: sprint-N` |
| State | open/closed + `false-positive` label |

*Adapt domain labels to your stack (e.g., `domain: contracts` for Solidity, `domain: mobile` for React Native, etc.)*

### Quick Reference

```bash
# List issues by severity
gh issue list --label "severity: critical"

# List issues by domain
gh issue list --label "domain: security"

# Claim an issue
gh issue edit {N} --add-assignee @me

# Close as false positive
gh issue close {N} --reason "not planned" --comment "Reason"
gh issue edit {N} --add-label "false-positive"

# Auto-close via commit
git commit -m "fix(ID): description

Fixes #N"
```

---

## Offline Reference Documents

### Severity Taxonomy

| Severity | Definition |
| -------- | ---------- |
| Critical | Active exploit or data loss in production; immediate remediation required |
| High | Significant functional or security defect; fix within 24-48 hours |
| Medium | Non-critical defect affecting user experience or maintainability; fix within sprint |
| Low | Cosmetic, minor code quality, or accepted technical debt; fix opportunistically |
| Info | Observation or recommendation; no immediate action required |

### Issue ID Format

`{PREFIX}-{NNN}`

| Prefix | Domain |
| ------ | ------ |
| SEC | Security |
| AUTH | Authentication & Authorization |
| DATA | Data Accuracy |
| DB | Database & Sync |
| API | API Efficiency |
| PERF | Performance |
| CQ | Code Quality |
| CLEAN | Cleanup (dead code, deprecated markers) |
| DOC | Documentation |
| INFRA | Infrastructure |
| BUG | Bug (cross-domain) |
| DEF | Deferred issue |

*Add domain-specific prefixes as needed (e.g., CONT for smart contracts, MOBILE for mobile apps)*

### Status Values

| Status | Definition |
| -------------- | ------------------------------------ |
| Open | Confirmed, awaiting fix |
| In Progress | Fix being implemented |
| Resolved | Fix completed and verified |
| Deferred | Accepted risk with documented reason |
| False Positive | Not an actual issue |

---

## Issue Body Format

Every issue must follow this executable spec format. Any agent or developer should be able to read an issue, understand the full context, and execute the fix without asking questions.

```markdown
## Metadata
| Field | Value |
| ----- | ----- |
| Date Filed | YYYY-MM-DD |
| Filed By | {agent name, human name, or "Claude Code"} |
| Sprint | {N} |
| Last Verified | YYYY-MM-DD |
| Audit ID | {PREFIX}-{NNN} |

## Location

| File | Lines |
| ---- | ----- |
| \`path/to/file.js\` | 141-145 |
| \`path/to/other-file.js\` | 58 (also affected) |

## Current Behavior

What the code does RIGHT NOW. Show the actual code — not a summary, the
real lines from the file. Include enough surrounding context that a reader
understands the flow without opening the file.

\```js
// frontend/services/Auth.js:141-145
const _escapeHtml = (str) => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};
\```

## Expected Behavior

What the code SHOULD do and why. Reference the protocol or standard being
violated (e.g., "Rule 3: validate at system boundaries").

## Root Cause

Why this happened. Not just "it's wrong" — explain the gap: was the shared
utility added later? Did the author not know about it? Is this a pattern
repeated elsewhere?

## Impact

| Dimension | Detail |
| --------- | ------ |
| Security | Does this create an exploitable vulnerability? |
| Correctness | Does this cause wrong behavior? |
| Maintenance | Does this create drift or inconsistency? |
| Users | Can end users hit this? How? |

## Fix Specification

Step-by-step instructions precise enough that an agent can execute without
judgment calls. Include the EXACT before/after for every file.

**File: \`path/to/file.js\`**

Remove:
\```js
const _escapeHtml = (str) => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};
\```

Add (at top of file, with existing imports):
\```js
import { escapeHTML } from '../utils/sanitize.js';
\```

Replace all references to `_escapeHtml` with `escapeHTML`.

## Verification

- [ ] \`npm test\` — all existing tests pass
- [ ] Grep: \`_escapeHtml\` returns zero matches in this file
- [ ] Manual: wallet confirmation modal renders correctly with special characters
- [ ] Edge case: input containing \`<script>\`, `"quotes"`, \`&amp;\` entities

## Related

| Type | Reference |
| ---- | --------- |
| Related Issues | #27 (SEC-022: same pattern in Auth.js) |
| Affected Files | \`frontend/services/Auth.js\` |
| Protocol | Rule 3 (shared utilities), Rule 8 (XSS prevention) |
```

---

## Resolution Log Format

The resolution log provides the complete narrative for every resolved issue.

**Format per resolved issue:**

```
- **Issue ID**: e.g., SEC-001
- **Discovered By**: Agent name, human name, or "Claude Code"
- **Date Discovered**: YYYY-MM-DD
- **Source**: Code review, audit, testing, runtime error, etc.
- **Severity**: Critical / High / Medium / Low / Info
- **Location**: Exact file path and line number(s)
- **Description**: Clear description of the issue
- **Evidence**: Code snippet, error message, or documentation excerpt

**Resolution Record:**
- **Fixed By**: Agent name, human name, or "Claude Code"
- **Date Fixed**: YYYY-MM-DD
- **Fix Description**: What was changed and why
- **Verification**: How the fix was verified
```

---

## Audit Sessions

### Audit Types

| Type | Scope | Checklist | When |
| ---- | ----- | --------- | ---- |
| **Full Security Audit** | Entire codebase + infrastructure | All 10 sections of [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) | Pre-launch, annually, after major architecture change |
| **Sector Audit** | Single domain (e.g., contracts, frontend) | Relevant sections of checklist | Per sprint, when domain changes significantly |
| **Fix Verification** | Specific issues being remediated | N/A — uses fix pipeline | Continuous |

### Full Security Audit Process

A full security audit uses [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) as the mandatory scope. Every section must be evaluated:

1. **Pre-audit** — Lead and engineering jointly determine which checklist sections are in scope. Mark `[N/A]` with written justification for sections that don't apply.
2. **Execute** — Work through each applicable section. Every `[ ]` item gets checked. Mark `[x]` (passing), `[!]` (failing — file as issue), `[~]` (partial — document exception), or `[N/A]`.
3. **File findings** — Every `[!]` becomes a GitHub Issue following the issue body format below.
4. **Report** — Produce session report in archive/ with summary, findings, and remediation roadmap.

### Sector Audit Process

1. **Define scope** before starting — what files, routes, or systems are in scope
2. **Document scope** in the sprint file before touching any code
3. **Audit-only mode** — when instructed, document findings without modifying code
4. **Track findings** — every issue gets an ID, severity, location, and description

### Audit vs. Fix Mode

**Audit-only mode:**

- Map and document issues
- File issues in the tracker with proper labels
- Do not modify source code
- Another agent or developer handles fixes

**Fix mode:**

```
1. CLAIM    → Assign issue to yourself
2. SCOPE    → Read code, confirm bug, define fix boundary
3. FIX      → Minimal surgical change — one issue per fix
4. VERIFY   → Run tests, confirm fix, confirm no regressions
5. COMMIT   → fix({ISSUE_ID}): {description} — one commit per issue
6. RESOLVE  → Update tracker, resolution log, sprint doc
```

Each step completes before the next begins. No step is skipped.

### Session Report Format

Every session produces a report archived in `docs/audit/archive/`:

```markdown
# Session N — [Brief Title]

**Date:** YYYY-MM-DD
**Auditor:** [Name]
**Scope:** [What was examined]
**Status:** Complete / In Progress / Blocked

---

## Issues Resolved

### [ID] ([Severity]) — [One-line title]

**Discovered:** Session N (YYYY-MM-DD)
**Location:** [File:line or DB object]

**Root cause:** [2-3 sentences]

**Fix:** [What was changed]

**Verified by:** [Test name or manual verification method]

---

## Migration

| Number | File | Changes |
| ------ | ---- | ------- |

## Test Results

[Pass/fail summary of any tests run]
```

---

## Naming Conventions

| Item | Convention | Example |
| ------------------ | ---------------------------------------------------------------- | ------------------------------------------------ |
| Issue ID | `{PREFIX}-{NNN}` | `SEC-001`, `CQ-014` |
| Session file | `SESSION_NN.md` | `SESSION_01.md` |
| Sprint file | `SPRINT_CURRENT.md` (current), `archive/SESSION_NN.md` (history) |
| Discovery document | `archive/{AUDIT_TYPE}_YYYY-MM-DD.md` | `archive/SECURITY_AUDIT_2026-03-27.md` |

---

## Branching Rules

Adapt to your team's workflow. Example for teams using protected branches:

```
main            ← live, deployed, stable — protected
    └── dev     ← integration branch — protected
            ├── alice/dev
            ├── bob/dev
            └── [name]/dev
```

- All work happens on named developer branches
- Commits targeting `dev` for PR review
- Never commit directly to protected branches
- Never force-push to protected branches

---

## Self-Check Before Output

Before presenting any code or audit finding, verify:

- [ ] Is the issue severity appropriate and defensible?
- [ ] Is the location (file:line) exact and verified?
- [ ] Is the root cause clearly stated?
- [ ] Does the fix actually address the root cause?
- [ ] Is the verification method specified?
- [ ] Is the issue filed in the correct location?

---

## Issue Lifecycle

```
Discovery → Open → In Progress → Resolved / Deferred / False Positive
```

1. **Discovery:** Issue found during audit, testing, or runtime
2. **Open:** Confirmed, logged in tracker with severity
3. **In Progress:** Fix being implemented
4. **Resolved:** Fix verified, migration/solution documented
5. **Deferred:** Accepted risk with written justification
6. **False Positive:** Investigated, determined not to be an issue

---

## File Updates Per Action

| Action | Update Tracker | Update Resolution Log | Update Sprint Doc | Create Session File |
| ------------------------------- | ----------------------- | ---------------------------- | ------------------------ | ---------------------------- |
| New audit sprint | — | Add session index entry | Reset sprint doc | Create archive/SESSION_NN.md |
| Issue found (audit-only) | Add to Open section | — | Update open count | Add to session file |
| Issue fixed | Move to Resolved | Add full trail | Update counts | Update session file |
| Issue deferred | Move to Deferred | Add trail with justification | Update counts | Update session file |
| Issue false positive | Move to False Positive | Add trail | Update counts | Update session file |

---

## Multi-Agent Coordination

When running audits with multiple agents (e.g., one per sector), follow this coordination protocol.

### Directory Structure

```
docs/audit/
├── temp/                          # Staging area for agent findings (gitignored)
│   ├── sector-security.md         # One file per sector agent
│   ├── sector-frontend.md
│   ├── sector-backend.md
│   └── ...
```

### Agent Output Format

Each sub-agent MUST write findings to `docs/audit/temp/sector-{name}.md`:

```markdown
# Sector Audit: {Sector Name}

**Date:** YYYY-MM-DD
**Auditor:** Claude Code (sub-agent)
**Scope:** {What was examined}
**Files Reviewed:** {Count}

---

## Findings

### {ID} | {Severity} | {File:line}

**Description:** {Clear description}

**Evidence:**
```
{code snippet or explanation}
```

**Recommendation:** {What should change}

---

## Summary

| Severity | Count |
| -------- | ----- |
| Critical | N |
| High | N |
| Medium | N |
| Low | N |
| Info | N |

## Positive Findings

{What is working well — compliance confirmations, solid patterns}
```

### Issue ID Assignment

Sub-agents use **temporary IDs** within their sector file: `{PREFIX}-{NNN}`. The coordinator assigns **final IDs** when compiling to avoid collisions.

### Agent Batch Limits

**Each agent receives no more than 5-10 issues (or files) per assignment.** Overloaded agents produce shallow work and are harder to audit.

### Coordinator Workflow

1. **Launch** — Define sector scopes, launch sub-agents in parallel (respect batch limits)
2. **Verify permissions** — Ensure agents have access to necessary tools
3. **Review** — Read each `docs/audit/temp/sector-*.md` file when agents complete
4. **Deduplicate** — Identify overlapping findings across sectors
5. **Assign final IDs** — Renumber all issues with globally unique IDs
6. **Compile** — Write deduplicated findings into the issue tracker with proper labels
7. **Clean up** — Delete `docs/audit/temp/` contents after compilation

### Deduplication Rules

When the same issue is found by multiple agents:
- Keep the **most detailed** finding
- Use the **highest severity** assigned by any agent
- Note all affected locations from all agents
- Credit all discovering agents in the resolution log

---

## Applying This Protocol to a New Project

1. Create `docs/audit/` directory
2. Create `docs/audit/ISSUE_TRACKER.md` with header and empty sections
3. Create `docs/audit/RESOLUTION_LOG.md` with header and session index
4. Create `docs/audit/SPRINT_CURRENT.md` as Sprint 1
5. Create `docs/audit/archive/` directory
6. Establish baseline: audit the codebase once end-to-end before any fixes
7. Track every issue found — no matter how small

---

## Severity Override Rules

A higher-severity designation always wins over lower. If an issue can be exploited (even indirectly), it is at minimum **High**. If it causes data loss or funds loss, it is **Critical**.

**Never downgrade a severity to make an issue appear less urgent.** If unsure between two severities, use the higher one.
