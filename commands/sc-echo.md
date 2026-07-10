---
description: Enter echo paired-review mode — GLM via OpenCode and/or Grok review each completed work unit (use "both" for two independent lenses)
argument-hint: "[opencode|grok|both]"
---

You are now operating in **echo paired-review mode** for the rest of this session.
You are the **Builder**. A second model, running read-only, is the **Reviewer**.
The governing protocol is `AGENTS.md` at the project root (read it now if you have
not). Rule 9 defines this loop.

## Choose the reviewer backend

Echo can route each review through GLM (via OpenCode), Grok (via its own CLI), or
**both at once**. Resolve which is active for this session **once, now**, in this
order:

1. If the user passed an argument to this command (`$ARGUMENTS`), use it:
   - `grok` → the **Grok** reviewer via `ask-grok.sh`.
   - `opencode` (or `glm`) → the **GLM via OpenCode** reviewer via `ask-glm.sh`.
   - `both` (or `all`) → **both** reviewers per work unit (see "Two lenses" below).
2. Otherwise use the configured default: read `SC_REVIEWER_BACKEND` from
   `~/.config/sc/config` (`opencode` if unset). `both` is also valid there.

Announce the resolved backend when you acknowledge echo mode, and use the same
choice for **every** review this session. If the user names an unrecognized
backend, tell them the valid choices (`opencode`, `grok`, `both`) and ask which
they want before continuing.

The Reviewer is the same read-only persona regardless of backend — only the model
and CLI differ. GLM via OpenCode is the default; Grok reviews through its own CLI.

## Two lenses (the `both` backend)

`both` sends every work unit to **each** reviewer independently and treats their
responses as **two separate audit perspectives** — like handing the same change to
two auditors from different backgrounds. Different models miss different things, so
two lenses surface issues neither would catch alone and harden the repo from more
angles. It costs roughly double the review time, so it's opt-in — for when the user
has the capacity for it.

When the backend is `both`, for each work unit:

1. Dispatch to **both** scripts (order doesn't matter):
   ```
   bash ~/.claude/sc/ask-glm.sh  "<context>" <paths...>
   bash ~/.claude/sc/ask-grok.sh "<context>" <paths...>
   ```
2. Read **both** full responses and both `VERDICT:` lines.
3. **Combine the verdicts** (worst wins): the unit is done only when *both* say
   `APPROVE`. If either says `REVISE`/`BLOCK`, address **every** finding from
   **both** reviewers (they are peers — see Pushback), then re-dispatch to **both**.
   That pair of dispatches counts as **one** round.
4. **Grok size limit vs. other errors:** Grok suits small work units and returns
   `VERDICT: ERROR` for a file too large for its window. Distinguish the two kinds
   of `ERROR` by reading the bridge output:
   - **Size/truncation ERROR** (the output mentions the reviewer window,
     `SC_GROK_MAX_CHARS`, a payload exceeding budget, or truncation): treat it as a
     non-blocking **coverage gap** — note that Grok could not review this unit
     because it was too large, and let GLM's verdict carry the unit. Not a finding
     to fix.
   - **Any other ERROR** (timeout, missing CLI, lock contention, re-entrancy): the
     work was **not judged** by that lens for an operational reason — apply the
     general `ERROR` contract below (surface the bridge output to the user, ask how
     to proceed). Do **not** silently proceed as if it were a size gap.
5. **If GLM (or either reviewer) returns a non-size `ERROR`**, apply the general
   `ERROR` contract below — surface it and ask how to proceed; do not quietly
   collapse `both` to a single lens.
6. Attribute findings to their reviewer when you report (GLM vs Grok), so the user
   sees which lens caught what.

An `ERROR` from either lens (size or operational) is **never** a `REVISE`/`BLOCK`,
so it never triggers a fix-and-re-dispatch round on its own — only a *content*
verdict does. If both lenses `ERROR` operationally in the same round, follow the
general `ERROR` contract for both (surface, ask how to proceed) and do not loop.

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

Call the Bash tool with exactly this shape, using the script for the backend you
resolved above (`ask-glm.sh` for opencode, `ask-grok.sh` for grok):

```
bash ~/.claude/sc/ask-glm.sh  "<context>" <path1> <path2> ...   # opencode backend
bash ~/.claude/sc/ask-grok.sh "<context>" <path1> <path2> ...   # grok backend
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
   In `both` mode, report **each** reviewer's final verdict separately (e.g.
   "GLM: APPROVE · Grok: APPROVE"), plus the combined outcome.
2. How many rounds it took.
3. Any findings that remain open (with severity, location, and — in `both` mode —
   which lens raised them). If Grok returned `ERROR` (size), say so: that lens did
   not cover this unit.

Do not silently ship work a Reviewer flagged.

---

Acknowledge that echo mode is active, then continue with the user's task.
