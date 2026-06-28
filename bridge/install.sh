#!/usr/bin/env bash
#
# Install the echo bridge into ~/.claude/sc — the single canonical copy that both
# the Claude-side scripts and the OpenCode plugin point at.
#
# Deploys:
#   ~/.claude/sc/                              ask-*.sh, lib/, sc-init.sh, templates/
#   ~/.config/opencode/agent/sc-echo-reviewer.md  the read-only reviewer persona
#   ~/.config/sc/config                        from config.example, only if absent
#
# Existing user config is never overwritten. Re-run after editing anything here.
#
# impure: copies files, chmods scripts.

set -euo pipefail

readonly HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly REPO_ROOT="$(cd "${HERE}/.." && pwd)"
readonly DEST="${HOME}/.claude/sc"
readonly AGENT_DIR="${HOME}/.config/opencode/agent"
readonly CONFIG_DIR="${HOME}/.config/sc"
readonly CLAUDE_CMD_DIR="${HOME}/.claude/commands"

# --- deploy the canonical copy ---------------------------------------------
mkdir -p "${DEST}/lib" "${DEST}/templates"
cp "${HERE}/ask-glm.sh"    "${DEST}/ask-glm.sh"
cp "${HERE}/ask-claude.sh" "${DEST}/ask-claude.sh"
cp "${HERE}/sc-init.sh"    "${DEST}/sc-init.sh"
cp "${HERE}/lib/"*.sh      "${DEST}/lib/"
cp "${HERE}/templates/"*   "${DEST}/templates/"
chmod +x "${DEST}/ask-glm.sh" "${DEST}/ask-claude.sh" "${DEST}/sc-init.sh"
echo "sc: installed bridge -> ${DEST}"

# --- reviewer persona for the OpenCode (GLM) side --------------------------
mkdir -p "${AGENT_DIR}"
cp "${HERE}/agent/sc-echo-reviewer.md" "${AGENT_DIR}/sc-echo-reviewer.md"
echo "sc: installed reviewer agent -> ${AGENT_DIR}/sc-echo-reviewer.md"

# --- /sc-echo slash command for Claude Code -----------------------------------
# Source of truth is repo_root/claude/commands/sc-echo.md; copied to the user-level
# command directory so Claude Code discovers /sc-echo in any project.
mkdir -p "${CLAUDE_CMD_DIR}"
if [ -f "${REPO_ROOT}/claude/commands/sc-echo.md" ]; then
  cp "${REPO_ROOT}/claude/commands/sc-echo.md" "${CLAUDE_CMD_DIR}/sc-echo.md"
  echo "sc: installed Claude /sc-echo command -> ${CLAUDE_CMD_DIR}/sc-echo.md"
else
  echo "sc: WARN — ${REPO_ROOT}/claude/commands/sc-echo.md missing; skipping /sc-echo install." >&2
fi

# --- config (never clobber the user's) -------------------------------------
mkdir -p "${CONFIG_DIR}"
if [ -f "${CONFIG_DIR}/config" ]; then
  echo "sc: ${CONFIG_DIR}/config exists — left untouched (see config.example for new keys)."
else
  cp "${HERE}/config.example" "${CONFIG_DIR}/config"
  echo "sc: seeded config -> ${CONFIG_DIR}/config"
fi

echo "sc: done. Bridge, reviewer agent, and config are consolidated under ${DEST}."
