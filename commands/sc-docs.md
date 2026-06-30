---
description: Shadow Clone docs mode — generate or refresh documentation for work currently in scope. Audience-aware, anti-marketing, written for the person who has to read it later.
---

You are now operating in **Shadow Clone Docs mode**. This mode writes
documentation that *helps the reader do something*, not documentation
that fills a checklist. No marketing speak, no aspirational language,
no "comprehensive guide to the system" when a half-page reference
would do.

Use this when:
- A feature just shipped and needs user-facing docs.
- An internal module is opaque enough that the next maintainer (you
  in three months) will be confused without it.
- A project README is stale and needs a structured refresh.
- A protocol or contract needs to be documented for outside readers.

This is **not** a content-mill. It does not pad to hit a word count
and does not produce "introduction" paragraphs that restate the
section title. See `/sc-research` for narrative prose work and
`/sc-feature` for shipping new capabilities.

The deliverable is the doc file(s) themselves plus
`.waves/wave-1/deliverables/DOCS_SUMMARY.md` describing what was
written and what was deliberately left out.

---

## Step 1 — Capture context (ask before writing)

Use the **AskUserQuestion** tool to ask the user, in one batch:

1. **Scope** (header `Scope`) — what to document. Free-text. Examples:
   "the new `/sc-quick-fix` command," "the auth module," "the project
   README." Push back on "everything" — pick a focused slice.
2. **Audience** (header `Audience`) — options: `End users (no
   technical context)`, `Developers integrating this module`,
   `Future maintainers (us in 6 months)`, `External contributors
   (open source)`. This is the single most important call —
   audience determines voice, depth, and which questions to answer.
3. **Doc type** (header `Type`) — options: `How-to (task-oriented)`,
   `Reference (API/CLI signatures)`, `Concept (the why, the model)`,
   `Tutorial (guided learning)`, `README (orientation)`,
   `Mix (justify which sections)`. Different types have different
   structures; mixing them in one file is usually wrong.
4. **Output location** (header `Where`) — options: `In-repo
   docs/ directory`, `Inline (JSDoc/TSDoc/docstrings)`, `Top-level
   README`, `External wiki (specify URL)`, `Other (specify)`. Drives
   the format and the linking.
5. **Team size** (header `Team`) — options: `Solo`, `2-3`, `4-7`,
   `8+`. Drives spawn cap.

Wait for answers. Echo a one-line scope confirmation, then proceed to
Wave 0.

---

## Step 2 — Run the methodology

### Wave 0 — Source-of-truth discovery

Before writing a single sentence, read the code or system being
documented. Documentation that drifts from reality is worse than no
documentation. Capture:

- **What it actually does** — read the code, run examples if you
  can, observe behavior. Don't infer from the function name.
- **What it doesn't do** — common misconceptions, things that look
  similar but are not, gotchas.
- **What questions the audience will ask** — based on the Step 1 #2
  answer, anticipate the top 5 questions and make sure the doc
  answers them.
- **What already exists** — read existing docs in the repo. Don't
  duplicate; either reference or replace.

If you spawn specialists (per team-size), the roles are:

- **Code Reader**: walks the source and captures the actual behavior.
- **Audience Empath**: anticipates questions the target audience
  (Step 1 #2) will have.
- **Existing Doc Reader**: inventories what's already written so the
  new doc doesn't duplicate or contradict.
- **Example Hunter**: identifies concrete examples that earn their
  place (a real use case, a real command, a real error message).
- **Record Keeper**: writes `DOC_SOURCE.md` capturing all of the
  above as raw material for Wave 1.

Deliverable: `.waves/wave-0/deliverables/DOC_SOURCE.md`.

### Wave 1 — Write the docs

Use `DOC_SOURCE.md` as the raw material. Apply the protocol at
`~/.claude/sc/protocols/Documentation Standards for Software Teams.md`
and the Gnosis Verification Protocol's anti-speculation discipline:

**Voice and structure rules**:

- Write *for* the audience from Step 1 #2. End-user docs assume zero
  technical context. Maintainer docs assume familiarity with the
  codebase. Don't blend.
- Lead with what the reader needs to *do*, not with what the system
  *is*. The "what it is" comes after, if at all.
- One sentence per idea. No "comprehensive," "robust," "powerful,"
  "world-class." No "we are excited to introduce."
- Every claim verifiable from the code or from a documented example.
  No aspirational ("will eventually support") — say what it does now.
- Concrete examples earn their place. Generic placeholder examples
  (`foo`, `bar`) do not — use real, runnable examples or omit.
- Code blocks are labeled with what they are (terminal command,
  config snippet, code) so the reader knows what to do with them.
- Headings are scannable. A reader skimming the H2s should know what
  the doc covers.

**Per-type structure** (apply the matching template):

- **How-to**: Problem statement → prerequisites → numbered steps →
  what success looks like → troubleshooting.
- **Reference**: Signature/contract → parameter table → returns/errors
  → minimal example → links to deeper concepts.
- **Concept**: The mental model in one paragraph → why this design →
  alternatives considered → constraints that produced it.
- **Tutorial**: Goal → starting state → guided steps with rationale →
  ending state → next step.
- **README**: One-paragraph what + why → install → quickstart → links
  to deeper docs.

Write the actual file(s) at the location from Step 1 #4. Cite each
file's path in `DOCS_SUMMARY.md`.

### Wave 2 — Summary + honest gaps

Write `.waves/wave-1/deliverables/DOCS_SUMMARY.md` with:

- **Files written or updated** — path + one-line purpose per file.
- **What's documented** — the contracts / concepts / steps covered.
- **Deliberately omitted** — anything you decided not to document and
  why. Per Rule 7, surface the gaps so the user can decide. Examples:
  "didn't document internal `_helper()` functions because they're
  scheduled for removal in the next refactor," or "skipped the
  configuration section because the config is auto-generated and
  shouldn't be hand-edited."
- **Cross-links** — what other docs this links to and what links back
  to it. Catch broken cross-references now, not after the doc lands.
- **Drift watch** — what part of the code is most likely to make this
  doc go stale, so a future audit can catch it.

If `/sc-echo` is active, dispatch a review of the doc files before
declaring the unit done. The Reviewer judges docs against the same
clarity standard — verbose, aspirational, or unverifiable claims will
get flagged.

---

## Closing

Tell the user what was documented, where it landed, and what
deliberately wasn't covered. Suggest the user open the file and read
the first paragraph — if it doesn't make sense to them, the audience
was probably misjudged and you should iterate.

---

Acknowledge that Docs mode is active, then begin Step 1 by asking the
five context questions.
