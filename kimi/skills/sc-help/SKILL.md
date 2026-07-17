---
name: sc-help
description: Show the catalog of installed Shadow Clone Kimi skills and what each one does
type: prompt
whenToUse: When the user asks what Shadow Clone skills or commands are available
---

Show the user the following catalog **exactly** as written below, then ask if they
want to use any of them. Do not invent skills; do not omit the "Status" column.

# Shadow Clone skill catalog (Kimi)

Shadow Clone's Kimi surface is a set of skills: they live as directories under
`~/.kimi-code/skills/sc-*/SKILL.md` once `kimi/install.sh` has run —
`bash scripts/sc-doctor.sh` verifies the install. Invoke them as `/skill:<name>`.

## System

| Skill | What it does | Status |
|---|---|---|
| `/skill:sc-echo [claude\|opencode\|grok\|kimi]` | Enter paired-review mode — a second model reviews each completed work unit against `AGENTS.md`, returning `VERDICT: APPROVE \| REVISE \| BLOCK \| ERROR`. Loop up to 3 rounds per unit. Default reviewer when Kimi builds: Claude (`ask-claude.sh`). | ✅ Available |
| `/skill:sc-bootstrap` | Verify the install is complete (bridge + protocols + reviewer persona + Kimi skills) and tell you the smallest next step to complete it. | ✅ Available |
| `/skill:sc-update` | Check for and apply Shadow Clone updates — detects the install path and walks you through the right update route. | ✅ Available |
| `/skill:sc-help` | Show this catalog. | ✅ Available |

## The rest of Shadow Clone

The full mode family (`/sc-plan`, `/sc-sprint`, `/sc-feature`, `/sc-debug`, …)
currently ships as **Claude Code slash commands** under `~/.claude/commands/sc*.md`
— see `commands/sc-help.md` in the Shadow Clone repo for that catalog. The Kimi
skill surface covers the echo paired-review loop and install maintenance; the
orchestration modes have not been ported to Kimi skills yet.

## Helper scripts (not skills)

These are bash scripts in `scripts/` — run with `bash scripts/<name>.sh`:

| Script | What it does |
|---|---|
| `scripts/sc-doctor.sh` | Verify the Shadow Clone install is healthy — checks every deployed path (including the Kimi skills), required CLIs, and the protocols deployment. |
| `scripts/sc-update.sh` | Pull the latest release source, re-run the bridge installer, re-verify with sc-doctor. |
| `scripts/sc-last-verdict.sh` | Print the verdict line from the most recent echo review in `.sc/exchange/`. |

## Coding standards

The canonical engineering standards live in `protocols/` in the repo and are
deployed to `~/.claude/sc/protocols/` by `bridge/install.sh`. The echo Reviewer
judges every work unit against them; findings cite the protocol filename.

## Status legend

- ✅ **Available** — installed by `kimi/install.sh` and ready to use.

For the list of *currently installed* Kimi skills on this machine, look at
`~/.kimi-code/skills/`. Anything there is invokable as `/skill:<directory-name>`.
