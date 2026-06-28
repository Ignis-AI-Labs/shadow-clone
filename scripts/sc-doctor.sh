#!/usr/bin/env bash
#
# sc-doctor — verify a Shadow Clone install is healthy.
#
# Walks every path the bridge installer is supposed to produce and every
# CLI the bridge depends on. Prints a per-check OK/FAIL line and a final
# summary, then exits non-zero iff anything failed.
#
# Why: install.sh failures can be partial — a renamed file or a stale
# template can leave the user with a half-deployed setup that fails at
# review time. This gives a single command to spot the gap.
#
# impure: reads the filesystem and queries the user's PATH. All IO is
# isolated in this script; no pure logic is mixed in.
#
# Usage: bash scripts/sc-doctor.sh

set -euo pipefail

# --- pure: where each piece is expected to live -----------------------------

readonly BRIDGE_DIR="${HOME}/.claude/sc"
readonly CONFIG_DIR="${HOME}/.config/sc"
readonly CLAUDE_CMD_DIR="${HOME}/.claude/commands"
readonly OPENCODE_DIR="${HOME}/.config/opencode"

# Top-level bridge scripts that get invoked as commands — must be +x.
# (bridge/install.sh chmods exactly these.)
readonly BRIDGE_EXEC_FILES=(
  "ask-glm.sh"
  "ask-claude.sh"
  "sc-init.sh"
)

# Bridge files that are sourced or read, not executed — presence-only.
readonly BRIDGE_DATA_FILES=(
  "lib/build-request.sh"
  "lib/chunk-review.sh"
  "lib/guard.sh"
  "lib/reap.sh"
  "lib/run-review.sh"
  "templates/AGENTS.md"
  "templates/CLAUDE.md"
)

# Files the OpenCode-side installer must deploy.
readonly OPENCODE_FILES=(
  "agent/echo-reviewer.md"
  "plugin/echo.js"
  "command/echo.md"
)

# External CLIs the bridge calls directly.
readonly REQUIRED_CMDS=("opencode" "claude" "flock" "setsid")

# --- impure: reporting ------------------------------------------------------

FAILS=0

# report STATUS LABEL DETAIL — print a single result line and tally failures.
report() {
  local status="$1" label="$2" detail="${3:-}"
  if [ "${status}" = "OK" ]; then
    printf '  OK    %s\n' "${label}"
  else
    printf '  FAIL  %s — %s\n' "${label}" "${detail}"
    FAILS=$((FAILS + 1))
  fi
}

# --- check helpers ----------------------------------------------------------

check_file() {
  local path="$1" label="$2"
  if [ -f "${path}" ]; then
    report OK "${label}"
  else
    report FAIL "${label}" "missing: ${path}"
  fi
}

# check_exec PATH LABEL — file must exist AND be executable. A copied-without-+x
# bridge script is the textbook partial-install state we are here to catch.
check_exec() {
  local path="$1" label="$2"
  if [ ! -f "${path}" ]; then
    report FAIL "${label}" "missing: ${path}"
  elif [ ! -x "${path}" ]; then
    report FAIL "${label}" "not executable: ${path}"
  else
    report OK "${label}"
  fi
}

check_cmd() {
  local cmd="$1"
  if command -v "${cmd}" >/dev/null 2>&1; then
    report OK "${cmd} on PATH"
  else
    report FAIL "${cmd} on PATH" "not found"
  fi
}

# --- check groups -----------------------------------------------------------

check_bridge() {
  printf '\nBridge (%s):\n' "${BRIDGE_DIR}"
  for f in "${BRIDGE_EXEC_FILES[@]}"; do
    check_exec "${BRIDGE_DIR}/${f}" "${f}"
  done
  for f in "${BRIDGE_DATA_FILES[@]}"; do
    check_file "${BRIDGE_DIR}/${f}" "${f}"
  done
}

check_config() {
  printf '\nConfig (%s):\n' "${CONFIG_DIR}"
  check_file "${CONFIG_DIR}/config" "config"
}

check_claude_command() {
  printf '\nClaude Code /echo command:\n'
  check_file "${CLAUDE_CMD_DIR}/echo.md" "echo.md"
}

check_opencode() {
  printf '\nOpenCode (%s):\n' "${OPENCODE_DIR}"
  for f in "${OPENCODE_FILES[@]}"; do
    check_file "${OPENCODE_DIR}/${f}" "${f}"
  done
}

check_path() {
  printf '\nRequired commands on PATH:\n'
  for c in "${REQUIRED_CMDS[@]}"; do
    check_cmd "${c}"
  done
}

# --- main -------------------------------------------------------------------

printf 'sc-doctor: checking Shadow Clone install...\n'

check_bridge
check_config
check_claude_command
check_opencode
check_path

printf '\n'
if [ "${FAILS}" -eq 0 ]; then
  printf 'sc-doctor: all checks passed.\n'
  exit 0
else
  printf 'sc-doctor: %d check(s) failed. Re-run bridge/install.sh and opencode-plugin/install.sh.\n' "${FAILS}" >&2
  exit 1
fi
