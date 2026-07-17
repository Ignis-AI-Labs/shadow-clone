# Shadow Clone — Kimi integration

Run Shadow Clone's echo paired-review loop from
[Kimi Code CLI](https://www.kimi.com/code/docs/en/), in both directions:

| Direction | Builder | Reviewer | Surface |
|---|---|---|---|
| Kimi is working | Kimi Code CLI | Claude (default), GLM via OpenCode, Grok, or Kimi | `/skill:sc-echo` → `~/.claude/sc/ask-*.sh` |
| Another agent is working | Claude Code / OpenCode | Kimi | `~/.claude/sc/ask-kimi.sh` |

The review machinery is **not** reimplemented here — the skills dispatch to the
shared bridge at `~/.claude/sc/` (see `bridge/`), exactly like the OpenCode
plugin does. There is one reviewer persona (`bridge/agent/sc-echo-reviewer.md`)
and one review contract (`AGENTS.md` Rule 9) for every direction.

## Install

```bash
bash bridge/install.sh   # bridge scripts, protocols, reviewer persona
bash kimi/install.sh     # the Kimi skills -> ~/.kimi-code/skills/sc-*/
bash scripts/sc-doctor.sh
```

`kimi/install.sh` deploys directory-form skills (`<name>/SKILL.md`) to
`${KIMI_CODE_HOME:-~/.kimi-code}/skills/`. Re-run it after editing anything
under `kimi/skills/`.

## Use

In a Kimi session:

```
/skill:sc-echo            # paired review, default reviewer (Claude)
/skill:sc-echo grok       # pick a reviewer backend: claude|opencode|grok|kimi
/skill:sc-bootstrap       # verify the install is complete
/skill:sc-update          # check for / apply updates
/skill:sc-help            # the skill catalog
```

To have **Kimi review** work built by another agent, point that agent at the
kimi reviewer backend — e.g. `/sc-echo kimi` in Claude Code, or
`SC_REVIEWER_BACKEND=kimi` in `~/.config/sc/config`. The bridge script is
`~/.claude/sc/ask-kimi.sh "<context>" <files...>`, tunable via `SC_KIMI_MODEL`
and `SC_KIMI_MAX_CHARS` (see `bridge/config.example`).

## Known limitation (KIMI-001)

`kimi -p` has no per-invocation tool-restriction flags (no `--disallowedTools`
or `--strict-mcp-config` equivalent), so when Kimi is the **Reviewer** its
confinement is prompt-only: the persona orders a read-only review, but the
process does not enforce it, and any MCP servers configured for kimi are
reachable. The bridge still wraps and parses the reviewer's output as untrusted
data. On hosts where enforced confinement matters, prefer the `claude` or
`grok` reviewer backend.

## Layout

```
kimi/
  install.sh                   deploy the skills (this directory -> ~/.kimi-code/skills/)
  skills/
    sc-echo/SKILL.md           paired-review loop (Builder side)
    sc-bootstrap/SKILL.md      install verification walkthrough
    sc-update/SKILL.md         update walkthrough
    sc-help/SKILL.md           skill catalog
```
