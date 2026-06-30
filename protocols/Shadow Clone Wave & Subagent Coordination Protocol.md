# Shadow Clone Wave & Subagent Coordination Protocol

**Protocol:** `SCWS-PROTOCOL-v1.0`
**Effective Date:** 2026-06-29
**Applicability:** Every `/sc-*` mode command in Shadow Clone (`/sc-plan`, `/sc-sprint`, `/sc-roadmap`, `/sc-feature`, `/sc-refactor`, `/sc-debug`, `/sc-optimize`, `/sc-research`, `/sc-audit`).

This is a Shadow-Clone-specific operational extension of the canonical `Multi Agent Protocol.md`. The Multi Agent Protocol covers *why* orchestrator-worker is the right pattern and the hard numeric limits. This protocol covers *how* Shadow Clone implements it: wave coordination, role-to-subagent mapping, team-size capping, standards passing, and communication contracts.

A `/sc-echo` finding that flags a violation of this protocol cites this filename and the rule number.

---

## 1. The Shadow Clone topology

Shadow Clone uses the **orchestrator-worker** pattern from `Multi Agent Protocol.md §1`. The orchestrator is the agent that received the `/sc-*` slash command (the "lead clone"). The workers are subagents spawned via the `Task` tool ("clones").

```
Lead clone (you, in the /sc-* session)
   └── spawns clones per wave, per role
         ├── Wave 0 clones (in parallel)
         ├── Wave 1 clones (after Wave 0 deliverable lands)
         └── Wave 2 clones (after Wave 1 deliverable lands)
```

### Checklist: topology

- [ ] **Single lead per session.** Exactly one orchestrator — the agent running the `/sc-*` command. Clones do not spawn further clones (no recursion).
- [ ] **Hub-and-spoke per wave.** Lead → role clones → Record Keeper → next wave. No peer-to-peer chat between specialist clones.
- [ ] **Max 5 *concurrent* direct reports** per wave (`Multi Agent Protocol §1`: coordination tax saturates at ~4 agents per orchestrator). The Record Keeper runs **strictly after** specialists return — it is never concurrent with them — so the concurrent peak in §3 is always the specialist count alone. Standard: 4 specialists concurrent (peak 4); Large: 5 specialists concurrent (peak 5); RK then runs alone afterward (peak 1). At no point are RK and specialists both running.

---

## 2. Wave coordination

Every mode declares its wave structure in the mode body. This protocol enforces how those waves run in practice.

### Wave lifecycle

1. **Open the wave.** Lead emits a one-line announcement: "Starting Wave N: `<wave name>`."
2. **Spawn role clones** in parallel using the Task tool (see §3 for spawn rules).
3. **Wait for all role clones to return** before spawning the Record Keeper.
4. **Spawn the Record Keeper** (or play it yourself; see §4) to aggregate the role outputs into the wave's `<deliverable>`.
5. **Write the deliverable** to the path declared in the mode body (e.g., `.waves/wave-0/deliverables/<NAME>.md`).
6. **Close the wave per the mode body's `## Closing each wave` section** — that section is the single source of truth for wave-close behavior (user-facing summary + `/sc-echo` dispatch when active).

### Checklist: wave coordination

- [ ] **No overlap between waves.** Wave N+1 does NOT start until Wave N's deliverable has been written.
- [ ] **Sequential waves only.** Even if waves are independent, run them in order — the mode body's wave count is the contract.
- [ ] **Deliverable path is mandatory.** The deliverable lands at the path declared in the mode body. Anywhere else is a protocol violation.
- [ ] **Max 5 waves.** If the work needs more, split into multiple sprint runs of the same mode — don't extend a single mode invocation past 5 waves.

---

## 3. Spawn rules

When a wave's `<team_composition>` lists N roles, you spawn up to N clones — capped by the user's team-size budget from Step 1 of the mode preamble.

### Default spawn count per wave

| Team size (user answered) | Max concurrent clones per wave | Strategy |
|---|---|---|
| `Solo` / 1 | **0** | Play every role yourself, sequentially. No `Task` calls. |
| `2-3` / Small | **2** | Spawn at most 2 specialist clones in parallel. Merge overlapping roles. Always play the Record Keeper yourself. |
| `4-7` / Standard | **4** | Spawn up to 4 specialist clones in parallel. Record Keeper runs AFTER specialists finish (per-wave peak concurrency = 4 specialists; RK is never concurrent with them — see §1). |
| `8+` / Large | **5** | Hard cap at 5 concurrent specialists per wave (the orchestrator-worker direct-reports ceiling). Run in two batches of ≤5 if the wave needs more roles. |

The cap is a **per-wave concurrency cap**, not a per-session cap. A 3-wave mode at `Standard` team size can spawn up to 12 specialist clones over the session (4 per wave × 3 waves), but never more than 4 at once.

### Role-to-clone mapping

When the wave's `<team_composition>` has more roles than the cap allows, **merge overlapping roles** rather than dropping them. Examples:

- A "Code Cartographer" + "History Reader" can merge into one clone if the user is at `Small`.
- A "Risk Auditor" + "Estimator" can merge if their evidence overlaps.
- The "Record Keeper" role is **never** dropped or merged. It is the deliverable's author.

### Checklist: spawn rules

- [ ] **Read the user's team-size answer** from the Step 1 preamble before spawning anything.
- [ ] **One Task call per role**, not one Task call with all roles. (Multiple Task calls in a single message run in parallel.)
- [ ] **Record Keeper runs LAST in the wave**, after specialists return.
- [ ] **Never exceed the team-size cap.** If `<team_composition>` lists more roles than the cap allows, merge them by responsibility overlap.
- [ ] **Solo means no `Task` calls.** Play roles sequentially yourself.

---

## 4. What every clone's prompt MUST contain

A spawned clone receives a self-contained briefing — it cannot see the lead's conversation history. Every `Task` call's `prompt` argument MUST include:

1. **Identity:** "You are the `<Role Name>` in Wave `<N>` of Shadow Clone `<mode>` mode."
2. **Wave purpose:** The `<purpose>` block from the mode body for this wave.
3. **Role responsibilities:** The role's line from `<team_composition>`.
4. **Prior-wave context:** Absolute paths to prior deliverables (`.waves/wave-0/deliverables/<NAME>.md`, etc.). The clone reads them itself with the Read tool — do NOT paste their content into the prompt (token cost).
5. **Standards:** The full `## Standards` block from the mode body. The clone judges its own work against the same protocols the lead does.
6. **Expected output:** Exactly what the clone returns — a markdown section, a structured list, a file written to `drafts/`. Specify the structure and length.
7. **Boundary:** Tool budget (`Multi Agent Protocol §2`: simple tasks 3-10 tool calls, moderate 10-15). State the budget explicitly so the clone self-caps.
8. **Termination:** "Return your output as your final message; do not loop or ask follow-up questions."

### Checklist: clone prompts

- [ ] Identity line is present and matches the role from `<team_composition>`.
- [ ] Wave purpose is included verbatim (no paraphrasing).
- [ ] Prior-wave deliverable paths are absolute and exist (or the clone is told to skip them).
- [ ] The full `## Standards` block is in the prompt.
- [ ] Output structure is specified down to section headings or table columns.
- [ ] Tool budget is named.
- [ ] No clone is asked to spawn further clones.

---

## 5. Standards passing

Every clone judges its work against the same protocols the lead is judged against. The `## Standards` section in the mode body lists 5 core protocols + mode-specific emphasis. **The full Standards block must travel with every clone prompt.**

### Why

Without Standards in the prompt, the clone falls back to whatever defaults its base model has. With Standards, the clone produces output that the lead can integrate without re-running protocol checks.

### How

- Copy the entire `## Standards (every wave must adhere)` section from the mode body into the clone's `prompt` argument.
- Do NOT replace protocol filenames with summaries — the clone references the actual files at `~/.claude/sc/protocols/<filename>` if it needs depth.
- If the clone produces a finding, instruct it to cite the protocol filename and section.

### Checklist: standards passing

- [ ] The `## Standards` block is verbatim in every clone prompt.
- [ ] Protocol filenames are quoted exactly as they appear in `~/.claude/sc/protocols/`.
- [ ] The clone is told findings must cite filenames + sections.

---

## 6. Record Keeper communication contract

The Record Keeper is the wave's aggregator. Every wave has one. Its job is to take the specialist clones' outputs and produce the wave's `<deliverable>`.

### Record Keeper inputs

- Every specialist clone's return value (text the clone produced as its final message)
- The mode body's `<deliverable>` block describing exact structure
- Any drafts files written by specialists to `drafts/`
- Prior-wave deliverables (read by absolute path)

### Record Keeper outputs

- One file at the deliverable path declared in the mode body
- A one-line summary the lead can show the user

### Who plays the Record Keeper

- **Solo team:** the lead plays Record Keeper.
- **Small team:** the lead plays Record Keeper.
- **Standard / Large team:** spawn the Record Keeper as a separate clone AFTER specialists return. Its prompt receives the specialists' outputs as context.

### Checklist: Record Keeper

- [ ] Exactly one Record Keeper per wave.
- [ ] Record Keeper runs AFTER specialists, never in parallel with them.
- [ ] Record Keeper writes to the declared deliverable path.
- [ ] Record Keeper's output is what the lead reports to the user at wave close.

---

## 7. Failure modes

### A specialist clone errors

If a clone returns an error or refuses to complete (e.g., the user interrupted, a tool failed, the clone hit its budget):

- **Do NOT silently drop the role.** A wave with a missing role's input cannot produce a complete deliverable.
- **Retry once** with a tighter prompt — the original may have been ambiguous.
- **If retry fails, escalate to the user.** Report which role failed, what was missing, and ask whether to (a) play the role yourself, (b) skip and document the gap in the deliverable, or (c) abort the wave.

### A specialist clone produces obviously bad output

- The lead is the final filter. If a specialist's output violates Standards (cite the protocol), DO NOT pass it to the Record Keeper. Re-spawn the role with corrective context, or play the role yourself.

### The wave budget is exhausted

The Multi Agent Protocol caps concurrent clones at 3-5 and per-wave tool budgets at 10-15 calls per specialist. If a wave is consuming much more than that, **stop and re-evaluate** — the wave is mis-scoped, not under-resourced.

### Checklist: failure handling

- [ ] Errors are surfaced to the user, not papered over.
- [ ] One retry max per clone.
- [ ] Lead acts as the final filter on specialist output before Record Keeper integration.
- [ ] Wave-budget overruns trigger re-scoping, not more clones.

---

## 8. When NOT to spawn clones

Spawning has overhead. Skip the clone fleet when:

- The wave's work is reading or grep that the lead can do in one tool call.
- The work needs user input (use `AskUserQuestion`, not a clone).
- The wave is trivial — typo fixes, formatting, single-file edits.
- The user said `Solo`. Play roles sequentially.
- The mode body has 0 roles in `<team_composition>` for that wave (some modes have research-style waves without an explicit team).

### Checklist: skip rules

- [ ] Lookup work stays with the lead.
- [ ] User-input decisions go through `AskUserQuestion`.
- [ ] Trivial work skips the wave structure entirely.

---

## 9. Telemetry & audit

Every wave produces audit trail under `.waves/wave-N/rk-operations/`:

- `AGENT_ASSIGNMENTS.md` — one line per spawned clone: role, time, tool budget, return summary.
- `RECORD_KEEPER_LOG.md` — the Record Keeper's reasoning trace for the aggregation step.
- `WAVE_COMPLETE.md` — final wave summary: deliverable path, clones spawned, time elapsed, anything that escalated to the user.

If `/sc-echo` is active, the wave-close review attaches these audit files to the request so the reviewer can verify protocol compliance.

### Checklist: audit

- [ ] Every spawn is logged in `AGENT_ASSIGNMENTS.md` BEFORE the clone starts.
- [ ] Record Keeper writes its reasoning to `RECORD_KEEPER_LOG.md`.
- [ ] `WAVE_COMPLETE.md` is the last thing written before opening the next wave.

---

## 10. Quick reference

```
Wave N opens
  → Lead reads team-size cap from Step 1 preamble
  → Lead reads <team_composition> from mode body
  → Lead spawns up to cap specialist clones IN PARALLEL via Task
      Each clone receives: identity + purpose + role + prior paths + Standards + output spec + budget
  → Lead waits for all to return
  → Lead spawns (or plays) Record Keeper
      Record Keeper aggregates specialist outputs into the wave deliverable
  → Lead writes deliverable, logs audit, closes wave with user-facing summary
  → If /sc-echo active: dispatch review
  → Wave N+1 opens
```

This protocol IS the gnosis layer. Every clone, every wave, every deliverable owes its shape to the rules above. When in doubt, cite §number.
