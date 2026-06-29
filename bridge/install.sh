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
# (DEST/protocols is also rm+recreated by the deploy block below on success,
# so its presence is fully managed there; the top-level mkdir only ensures
# it exists on failure paths.)
mkdir -p "${DEST}/lib" "${DEST}/templates" "${DEST}/protocols"
cp "${HERE}/ask-glm.sh"    "${DEST}/ask-glm.sh"
cp "${HERE}/ask-claude.sh" "${DEST}/ask-claude.sh"
cp "${HERE}/sc-init.sh"    "${DEST}/sc-init.sh"
cp "${HERE}/lib/"*.sh      "${DEST}/lib/"
cp "${HERE}/templates/"*   "${DEST}/templates/"
chmod +x "${DEST}/ask-glm.sh" "${DEST}/ask-claude.sh" "${DEST}/sc-init.sh"
echo "sc: installed bridge -> ${DEST}"

# --- deploy the canonical coding-standards (protocols/) ---------------------
# Source of truth: repo_root/protocols/*.md. Every /sc-* mode command
# references these by absolute path under ${DEST}/protocols/. New protocol
# files deploy automatically the moment they land in repo_root/protocols/.
# Surface real failures (perm denied, disk full, no matches) — no silent fallback.
protocols_src="${REPO_ROOT}/protocols"
if [ ! -d "${protocols_src}" ]; then
  echo "sc: WARN — ${protocols_src} missing; /sc-* mode commands will have no canonical standards to point at." >&2
else
  shopt -s nullglob
  protocol_files=("${protocols_src}/"*.md)
  shopt -u nullglob
  if [ "${#protocol_files[@]}" -eq 0 ]; then
    echo "sc: WARN — no *.md files in ${protocols_src}; nothing to deploy." >&2
  else
    rm -rf "${DEST}/protocols"
    mkdir -p "${DEST}/protocols"
    cp "${protocol_files[@]}" "${DEST}/protocols/"
    echo "sc: installed ${#protocol_files[@]} protocol(s) -> ${DEST}/protocols/"
  fi
fi

# --- reviewer persona for the OpenCode (GLM) side --------------------------
mkdir -p "${AGENT_DIR}"
cp "${HERE}/agent/sc-echo-reviewer.md" "${AGENT_DIR}/sc-echo-reviewer.md"
echo "sc: installed reviewer agent -> ${AGENT_DIR}/sc-echo-reviewer.md"

# --- /sc and /sc-* slash commands for Claude Code --------------------------
# Source of truth is repo_root/claude/commands/sc*.md (umbrella /sc plus every
# /sc-<name>). Every file is copied to the user-level command directory so
# Claude Code discovers them in any project. New commands deploy automatically
# the moment a sc*.md file lands in the repo — no install.sh edit needed.
mkdir -p "${CLAUDE_CMD_DIR}"
readonly CMD_SRC_DIR="${REPO_ROOT}/claude/commands"
sc_cmd_count=0
if [ -d "${CMD_SRC_DIR}" ]; then
  # Glob "sc*.md" matches both the umbrella /sc and every /sc-<name>.
  for cmd in "${CMD_SRC_DIR}"/sc*.md; do
    [ -e "${cmd}" ] || continue
    name="$(basename "${cmd}")"
    cp "${cmd}" "${CLAUDE_CMD_DIR}/${name}"
    echo "sc: installed Claude /${name%.md} command -> ${CLAUDE_CMD_DIR}/${name}"
    sc_cmd_count=$((sc_cmd_count + 1))
  done
fi
if [ "${sc_cmd_count}" -eq 0 ]; then
  echo "sc: WARN — no sc*.md files found under ${CMD_SRC_DIR}; no /sc commands installed." >&2
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
