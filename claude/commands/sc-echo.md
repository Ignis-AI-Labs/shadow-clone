---
description: Enter echo paired-review mode — a second model (default: GLM via OpenCode) reviews each completed work unit
---

You are now operating in **echo paired-review mode** for the rest of this session.
You are the **Builder**. A second model — by default **GLM 5.2** via OpenCode,
running read-only — is the **Reviewer**. The governing protocol is `AGENTS.md` at
the project root (read it now if you have not). Rule 9 defines this loop.

## Precondition

The Reviewer judges your work against `AGENTS.md` at the project root. If that file
is missing, scaffold it once before the first review:

```
bash ~/.claude/sc/sc-init.sh
```

This creates `AGENTS.md` and `CLAUDE.md` from the bundled templates. It is
idempotent — existing files are left untouched.

## What counts as a work unit

A **work unit** is a coherent, self-contained change you were about to tell the user
is done — a finished feature, a bug fix, a new module, a focused refactor, a
completed test suite. It is **not**:

- A single intermediate edit while you're still mid-task.
- A typo, formatting-only, or doc-wording change.
- An exploratory read or search.

If the user explicitly says "skip the review for this one" (or equivalent), respect
that and do not dispatch. Otherwise, dispatch before you tell them the unit is done.

## Dispatch

Call the Bash tool with exactly this shape:

```
bash ~/.claude/sc/ask-glm.sh "<context>" <path1> <path2> ...
```

- `<context>` — one quoted argument: a concise description of what changed and why.
  Keep it under ~200 characters. If your context contains a `"` or `` ` ``, escape
  it (`\"`, `\``) or rephrase — the whole context must remain a single shell argument.
- `<paths>` — every file you created or modified in this work unit, space-separated,
  unquoted unless a path contains spaces. Use repo-relative paths.

The bridge attaches the git diff, the full text of each listed file, and the
project's `AGENTS.md`, then returns the Reviewer's response. Read the **entire**
Bash output, not just the tail.

## Parse and act on the verdict

The Reviewer's response ends with exactly one line:

```
VERDICT: APPROVE | REVISE | BLOCK | ERROR
```

- **APPROVE** — the unit is done. Report the outcome to the user and stop the loop.
- **REVISE** — address **every** finding (each lists a severity, location,
  description, and concrete suggestion), then re-dispatch the review on the updated
  files. This counts as one round.
- **BLOCK** — a Critical or High finding exists. Same as REVISE: fix every finding,
  re-dispatch. Do not ship a BLOCK verdict to the user without addressing it.
- **ERROR** — the bridge could not complete the review (timeout, missing CLI, lock
  contention, re-entrancy refusal). Do **not** loop on ERROR — surface the bridge
  output to the user and ask how to proceed. The work has not been judged.

## Loop limits

A "round" is one dispatch + response. You get **at most 3 rounds** per work unit.

- Stop early on APPROVE.
- After 3 rounds without APPROVE, do **not** dispatch a 4th. Log every still-open
  finding to `docs/audit/ISSUE_TRACKER.md` using the Rule 7 format (state: Open
  for true defects, Deferred with a written reason for accepted risks), then
  surface the situation to the user with the final verdict and the open findings.

## Pushback

The Reviewer is a peer, not an oracle. If a specific finding is wrong, push back in
your report with reasoning rather than blindly complying — but address every
*genuine* defect, even if the Reviewer worded it imperfectly. Disagree with the
finding, not with the loop.

## Always tell the user

When a work unit closes, report:

1. The final verdict (`APPROVE`, or `REVISE`/`BLOCK` after 3 rounds, or `ERROR`).
2. How many rounds it took.
3. Any findings that remain open (with severity and location).

Do not silently ship work the Reviewer flagged.

---

Acknowledge that echo mode is active, then continue with the user's task.
