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
# Security posture (AUDIT-002/014/IS-013, IS-001, IS-003, IS-006):
#   - umask 077 bounds install-time modes; every file gets an explicit mode
#     via `install -m <mode>` (atomic write + rename, does NOT follow a
#     pre-existing symlink at the destination — CWE-59).
#   - The seeded `~/.config/sc/config` lands at mode 0600 and its parent at
#     0700; the bridge sources this file as shell on every invocation, so
#     it must not be world-readable or world-writable (CWE-732).
#   - Refuse to run when ${HOME} is empty or "/" — paths under those roots
#     would target the filesystem root.
#
# impure: writes to ${HOME}, chmods config dir.

set -euo pipefail

# Bound the install-time umask. Per-file modes are set explicitly via
# `install -m`, so this only matters for the directories we mkdir and for
# any cp(1) fallback if one is ever reintroduced.
umask 077

# AUDIT-025 / IS-006: refuse to run on an unusable HOME — an empty or "/"
# value would resolve every path under filesystem root.
if [ -z "${HOME:-}" ] || [ "${HOME}" = "/" ]; then
  echo "sc: HOME is empty or '/'; refusing to install." >&2
  exit 1
fi

readonly HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly REPO_ROOT="$(cd "${HERE}/.." && pwd)"
readonly DEST="${HOME}/.claude/sc"
readonly AGENT_DIR="${HOME}/.config/opencode/agent"
readonly CONFIG_DIR="${HOME}/.config/sc"
readonly CLAUDE_CMD_DIR="${HOME}/.claude/commands"

# --- deploy the canonical copy ---------------------------------------------
# `install -m MODE SRC DEST` writes via a temp file and renames atomically;
# it removes a pre-existing destination first, which neutralizes any
# symlink an attacker may have planted at the target path (CWE-59).
mkdir -p "${DEST}/lib" "${DEST}/templates" "${DEST}/protocols"
install -m 0755 "${HERE}/ask-glm.sh"    "${DEST}/ask-glm.sh"
install -m 0755 "${HERE}/ask-claude.sh" "${DEST}/ask-claude.sh"
install -m 0755 "${HERE}/sc-init.sh"    "${DEST}/sc-init.sh"
install -m 0644 "${HERE}/lib/"*.sh      "${DEST}/lib/"
install -m 0644 "${HERE}/templates/"*   "${DEST}/templates/"
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
    install -m 0644 "${protocol_files[@]}" "${DEST}/protocols/"
    echo "sc: installed ${#protocol_files[@]} protocol(s) -> ${DEST}/protocols/"
  fi
fi

# --- reviewer persona for the OpenCode (GLM) side --------------------------
mkdir -p "${AGENT_DIR}"
install -m 0644 "${HERE}/agent/sc-echo-reviewer.md" "${AGENT_DIR}/sc-echo-reviewer.md"
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
    install -m 0644 "${cmd}" "${CLAUDE_CMD_DIR}/${name}"
    echo "sc: installed Claude /${name%.md} command -> ${CLAUDE_CMD_DIR}/${name}"
    sc_cmd_count=$((sc_cmd_count + 1))
  done
fi
if [ "${sc_cmd_count}" -eq 0 ]; then
  echo "sc: WARN — no sc*.md files found under ${CMD_SRC_DIR}; no /sc commands installed." >&2
fi

# --- config (never clobber the user's) -------------------------------------
# Mode 0700 on the dir + 0600 on the file: this config is sourced as shell
# by every bridge invocation; over time it may hold endpoint overrides or
# secrets, so it must not be world-readable or world-writable (AUDIT-003,
# CWE-732).
mkdir -p "${CONFIG_DIR}"
chmod 0700 "${CONFIG_DIR}"
if [ -L "${CONFIG_DIR}/config" ]; then
  # `chmod` follows symlinks; refusing to operate on a symlinked
  # config closes a CWE-59 inconsistency with the rest of this script.
  echo "sc: ERROR — ${CONFIG_DIR}/config is a symlink; refusing to touch it." >&2
  echo "sc:         Remove the symlink or replace it with a regular file, then re-run." >&2
  exit 1
elif [ -f "${CONFIG_DIR}/config" ]; then
  # Tighten the mode on an existing config too — users installed with the
  # prior version may have a 0644 file holding new secrets.
  chmod 0600 "${CONFIG_DIR}/config"
  echo "sc: ${CONFIG_DIR}/config exists — left untouched (mode normalized to 0600; see config.example for new keys)."
else
  install -m 0600 "${HERE}/config.example" "${CONFIG_DIR}/config"
  echo "sc: seeded config -> ${CONFIG_DIR}/config (mode 0600)"
fi

echo "sc: done. Bridge, reviewer agent, and config are consolidated under ${DEST}."
