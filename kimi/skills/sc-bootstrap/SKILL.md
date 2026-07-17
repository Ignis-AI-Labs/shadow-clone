---
name: sc-bootstrap
description: Verify the Shadow Clone install is complete for Kimi, and walk the user through completing it if not
type: prompt
whenToUse: When the user wants to check or finish their Shadow Clone installation for use with Kimi
---

You are bootstrapping a Shadow Clone install for Kimi. The skills give Kimi the
`/skill:sc-*` surface, but the review loop also needs the bridge scripts, the
protocol library, and the reviewer persona on disk — those come from the source
clone's `bridge/install.sh` and `kimi/install.sh`, not from the skills alone.

Your job is to detect what's installed and tell the user the smallest
next step to complete the install.

## Step 1 — Detect install state

Run this exact check via the **Bash** tool:

```bash
echo "BRIDGE_OK=$([ -x ~/.claude/sc/ask-glm.sh ] && [ -x ~/.claude/sc/ask-claude.sh ] && [ -x ~/.claude/sc/ask-grok.sh ] && [ -x ~/.claude/sc/ask-kimi.sh ] && echo yes || echo no)"
echo "PROTOCOLS_OK=$([ -d ~/.claude/sc/protocols ] && [ "$(ls ~/.claude/sc/protocols 2>/dev/null | wc -l)" -ge 10 ] && echo yes || echo no)"
echo "REVIEWER_OK=$([ -f ~/.config/opencode/agent/sc-echo-reviewer.md ] && echo yes || echo no)"
echo "KIMI_SKILLS_OK=$([ -f "${KIMI_CODE_HOME:-$HOME/.kimi-code}/skills/sc-echo/SKILL.md" ] && echo yes || echo no)"
echo "KIMI_SKILLS_DIR=${KIMI_CODE_HOME:-$HOME/.kimi-code}/skills"
echo "REVIEWER_CLI=$(command -v claude >/dev/null 2>&1 && echo claude || { command -v opencode >/dev/null 2>&1 && echo opencode || { command -v grok >/dev/null 2>&1 && echo grok || { command -v kimi >/dev/null 2>&1 && echo kimi || echo none; }; }; })"
```

Parse the six `KEY=value` lines into a state map.

## Step 2 — Decide the next step

Evaluate the cases **in the order listed (A → B → C → D → E)** and emit the
**first** message whose conditions match — the cases can overlap (e.g. B and D),
so this precedence is what makes the guidance deterministic. Substitute the
detected values where shown, then **stop**. Do not chain into another command.

### A. Fully installed (BRIDGE_OK=yes, PROTOCOLS_OK=yes, REVIEWER_OK=yes, KIMI_SKILLS_OK=yes, REVIEWER_CLI≠none)

> ✅ Shadow Clone is fully installed for Kimi.
>
> - Bridge scripts at `~/.claude/sc/` — ready
> - Canonical protocols deployed — ready
> - Echo reviewer persona registered — ready
> - Kimi skills at `<KIMI_SKILLS_DIR>/sc-*/` — ready
> - Reviewer CLI available: `<REVIEWER_CLI>` — ready
>
> You can use `/skill:sc-echo` to turn on paired-review for the next work unit,
> or `/skill:sc-help` for the skill catalog.

### B. Skills present, bridge missing (KIMI_SKILLS_OK=yes, BRIDGE_OK=no OR PROTOCOLS_OK=no)

> ⚠ The Kimi skills are installed, but the bridge scripts, protocols, or reviewer
> persona are NOT on disk. `/skill:sc-echo` (paired review) DOES NOT WORK without
> them.
>
> To complete the install, clone the repo and run both installers:
>
> ```bash
> git clone --depth 1 https://github.com/Ignis-AI-Labs/shadow-clone.git
> cd shadow-clone
> bash bridge/install.sh      # bridge + protocols + reviewer persona
> bash kimi/install.sh        # the Kimi skills
> bash scripts/sc-doctor.sh   # verify the install is healthy
> ```
>
> (If REVIEWER_CLI was also `none`, you still need a reviewer CLI afterwards —
> see case D.)

### C. Bridge present, skills missing (BRIDGE_OK=yes, KIMI_SKILLS_OK=no)

> ⚠ The Shadow Clone bridge is installed, but the Kimi skills are not on disk.
> From your clone of the repo, run:
>
> ```bash
> bash kimi/install.sh
> bash scripts/sc-doctor.sh
> ```
>
> (If REVIEWER_CLI was also `none`, you still need a reviewer CLI afterwards —
> see case D.)

### D. No reviewer CLI (REVIEWER_CLI=none)

> ⚠ The review loop needs a reviewer CLI on PATH — `claude` (default when Kimi
> builds), `opencode`, `grok`, or `kimi` (self-review). None was found. Install
> one, then re-run `/skill:sc-bootstrap`. Paired review works best when a
> different model holds the reviewer pen — self-review (`/skill:sc-echo kimi`)
> is the fallback, not the ideal.

### E. Mixed state (any other combination)

> ⚠ Shadow Clone is partially installed. Re-run the installers from your clone
> of the repo to refresh everything:
>
> ```bash
> cd /path/to/your/shadow-clone-clone
> bash bridge/install.sh
> bash kimi/install.sh
> bash scripts/sc-doctor.sh
> ```
>
> Detected state:
> - BRIDGE_OK=<value>
> - PROTOCOLS_OK=<value>
> - REVIEWER_OK=<value>
> - KIMI_SKILLS_OK=<value>
> - REVIEWER_CLI=<value>

## Step 3 — Stop

After emitting the matching message, stop. Do not run additional commands
on the user's behalf. The user runs the install themselves so they
understand what landed where.
