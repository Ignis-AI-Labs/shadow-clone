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

# --- /sc-* slash commands for Claude Code ----------------------------------
# Source of truth is repo_root/claude/commands/sc-*.md; every file in that
# directory is copied to the user-level command directory so Claude Code
# discovers each /sc-<name> in any project. New commands deploy automatically
# the moment a sc-<name>.md file lands in the repo — no install.sh edit needed.
mkdir -p "${CLAUDE_CMD_DIR}"
readonly CMD_SRC_DIR="${REPO_ROOT}/claude/commands"
sc_cmd_count=0
if [ -d "${CMD_SRC_DIR}" ]; then
  for cmd in "${CMD_SRC_DIR}"/sc-*.md; do
    # The glob expands to the literal pattern when the directory is empty.
    [ -e "${cmd}" ] || continue
    name="$(basename "${cmd}")"
    cp "${cmd}" "${CLAUDE_CMD_DIR}/${name}"
    echo "sc: installed Claude /${name%.md} command -> ${CLAUDE_CMD_DIR}/${name}"
    sc_cmd_count=$((sc_cmd_count + 1))
  done
fi
if [ "${sc_cmd_count}" -eq 0 ]; then
  echo "sc: WARN — no sc-*.md files found under ${CMD_SRC_DIR}; no /sc-* commands installed." >&2
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
