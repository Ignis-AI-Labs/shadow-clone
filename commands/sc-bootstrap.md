---
description: Verify the Shadow Clone install is complete, and walk the user through completing it if not. Use this once after `/plugin install shadow-clone@ignis-labs`.
---

You are bootstrapping a Shadow Clone install. The plugin marketplace path
(`/plugin install shadow-clone@ignis-labs`) gives the user the `/sc-*`
slash commands but does **not** drop the bridge scripts, the protocol
library, or the OpenCode reviewer persona on disk. Without those, the
planning/execution modes work but `/sc-echo` (paired review) and the
protocol-citation behavior do not.

Your job is to detect what's installed and tell the user the smallest
next step to complete the install.

## Step 1 — Detect install state

Run this exact check via the **Bash** tool:

```bash
echo "BRIDGE_OK=$([ -x ~/.claude/sc/ask-glm.sh ] && [ -x ~/.claude/sc/ask-claude.sh ] && echo yes || echo no)"
echo "PROTOCOLS_OK=$([ -d ~/.claude/sc/protocols ] && [ "$(ls ~/.claude/sc/protocols 2>/dev/null | wc -l)" -ge 10 ] && echo yes || echo no)"
echo "REVIEWER_OK=$([ -f ~/.config/opencode/agent/sc-echo-reviewer.md ] && echo yes || echo no)"
echo "OPENCODE_OK=$(command -v opencode >/dev/null 2>&1 && echo yes || echo no)"
```

Parse the four `KEY=value` lines into a state map.

## Step 2 — Decide the next step

There are four outcomes. Match the map and emit the matching message
verbatim, then **stop**. Do not chain into another command.

### A. Fully installed (BRIDGE_OK=yes, PROTOCOLS_OK=yes, REVIEWER_OK=yes, OPENCODE_OK=yes)

> ✅ Shadow Clone is fully installed.
>
> - Bridge scripts at `~/.claude/sc/` — ready
> - 15 canonical protocols deployed — ready
> - Echo reviewer persona registered with OpenCode — ready
> - OpenCode CLI on PATH — ready
>
> You can use `/sc` to set up a new project, `/sc-help` for the full
> command catalog, or `/sc-echo` to turn on paired-review for the next
> work unit.

### B. Bridge + protocols installed, OpenCode missing (BRIDGE_OK=yes, PROTOCOLS_OK=yes, REVIEWER_OK=yes, OPENCODE_OK=no)

> ⚠ Shadow Clone is installed, but OpenCode is not on PATH.
>
> Every `/sc-*` command works EXCEPT `/sc-echo` (paired-review). The
> reviewer runs in OpenCode, so install it when you want the loop:
>
> ```bash
> curl -fsSL https://opencode.ai/install | bash
> ```
>
> Then sign in once (`opencode auth login`). After that, `/sc-echo` works.

### C. Plugin-only install — bridge missing (BRIDGE_OK=no OR PROTOCOLS_OK=no)

> ⚠ The `/sc-*` slash commands are installed (via the Claude Code plugin),
> but the bridge scripts, the 15 canonical protocols, and the reviewer
> persona are NOT on disk. That means:
>
> - Planning, feature, refactor, debug, optimize, research, audit modes — these work, but they cite protocols at `~/.claude/sc/protocols/` that don't exist yet
> - `/sc-echo` paired review — DOES NOT WORK
> - `/sc-init` scaffolding for new projects — DOES NOT WORK
>
> To complete the install, clone the repo and run the bridge installer:
>
> ```bash
> git clone --depth 1 --branch v0.2.4 https://github.com/Ignis-AI-Labs/shadow-clone.git
> cd shadow-clone
> bash bridge/install.sh
> bash scripts/sc-doctor.sh     # verify the install is healthy
> ```
>
> The plugin install and the source clone are complementary, not
> alternatives. The plugin gives you the commands; the source install
> gives you the supporting infrastructure the commands rely on.
>
> Want to install OpenCode now too (needed for `/sc-echo`)?
>
> ```bash
> curl -fsSL https://opencode.ai/install | bash
> ```

### D. Mixed state — bridge present but protocols or reviewer missing (any other combination)

> ⚠ Shadow Clone is partially installed. Re-run the bridge installer
> from your clone of the repo to refresh everything:
>
> ```bash
> cd /path/to/your/shadow-clone-clone
> bash bridge/install.sh
> bash scripts/sc-doctor.sh
> ```
>
> If you don't have a clone yet:
>
> ```bash
> git clone --depth 1 --branch v0.2.4 https://github.com/Ignis-AI-Labs/shadow-clone.git
> cd shadow-clone
> bash bridge/install.sh
> bash scripts/sc-doctor.sh
> ```
>
> Detected state:
> - BRIDGE_OK=<value>
> - PROTOCOLS_OK=<value>
> - REVIEWER_OK=<value>
> - OPENCODE_OK=<value>

## Step 3 — Stop

After emitting the matching message, stop. Do not run additional commands
on the user's behalf. The user runs the install themselves so they
understand what landed where.
