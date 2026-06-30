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

# The doctor lives in <repo>/scripts/, so the repo root is one level up.
# Used to enumerate the canonical source of /sc and /sc-* slash commands.
readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

readonly BRIDGE_DIR="${HOME}/.claude/sc"
readonly CONFIG_DIR="${HOME}/.config/sc"
readonly CLAUDE_CMD_DIR="${HOME}/.claude/commands"
readonly OPENCODE_DIR="${HOME}/.config/opencode"
readonly CLAUDE_CMD_SRC="${REPO_ROOT}/claude/commands"
readonly PROTOCOLS_SRC="${REPO_ROOT}/protocols"
readonly PROTOCOLS_DEST="${HOME}/.claude/sc/protocols"

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
  "agent/sc-echo-reviewer.md"
  "plugin/sc-echo.js"
  "command/sc-echo.md"
)

# External CLIs the bridge calls directly. `realpath` is checked
# separately because we need to assert the GNU `-m` extension; bare
# presence of a BSD `realpath` is not sufficient (AUDIT-013).
readonly REQUIRED_CMDS=("opencode" "claude" "flock" "setsid" "git" "cksum" "awk")

# Installed paths from earlier names that should no longer exist. A user
# upgrading from a previous Shadow Clone may have both old and new files
# registered side by side; the doctor warns (never fails) so they know to
# clean up. Extend this list when a future rename ships.
readonly STALE_FILES=(
  "${HOME}/.claude/commands/echo.md"
  "${HOME}/.config/opencode/command/echo.md"
  "${HOME}/.config/opencode/agent/echo-reviewer.md"
  "${HOME}/.config/opencode/plugin/echo.js"
)

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
  if [ -L "${path}" ]; then
    # IS-009: a symlink at an installed path is a strong signal of
    # tampering or a half-failed upgrade — refuse to call it OK.
    report FAIL "${label}" "is a symlink (refusing): ${path}"
  elif [ -f "${path}" ]; then
    report OK "${label}"
  else
    report FAIL "${label}" "missing: ${path}"
  fi
}

# check_exec PATH LABEL — file must exist AND be executable. A copied-without-+x
# bridge script is the textbook partial-install state we are here to catch.
check_exec() {
  local path="$1" label="$2"
  if [ -L "${path}" ]; then
    # IS-009 (see check_file).
    report FAIL "${label}" "is a symlink (refusing): ${path}"
  elif [ ! -f "${path}" ]; then
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

# check_stale PATH — warn (but never fail) if a file from a prior naming
# is still installed. Two competing installs is a quiet way for users to
# end up running an outdated /echo alongside the current /sc-echo.
check_stale() {
  local path="$1"
  if [ -e "${path}" ]; then
    printf '  WARN  stale install: %s — remove this file.\n' "${path}"
  fi
}

# AUDIT-013: bare `realpath` is GNU on most Linux distros and BSD on
# macOS. The bridge's file-containment filter uses `realpath -m`, a
# GNU extension. Probe for the actual flag rather than trusting
# presence alone.
check_realpath_gnu_m() {
  if ! command -v realpath >/dev/null 2>&1; then
    report FAIL "realpath -m available" "realpath not on PATH"
    return
  fi
  if realpath -m -- / >/dev/null 2>&1; then
    report OK "realpath -m available"
  else
    report FAIL "realpath -m available" \
      "installed realpath does not accept -m (BSD/macOS form). Install GNU coreutils (e.g. 'brew install coreutils' and use 'grealpath' or symlink it as realpath)."
  fi
}

# IS-010: warn if ~/.config/sc/config is more permissive than 0600.
# Pairs with the install.sh chmod 0600 from Theme 1 and the bridge's
# _sc_source_config_safe guard from Theme 3 — surface drift early
# rather than waiting for the bridge to refuse-to-source at runtime.
# Portable stat (GNU `-c`/BSD `-f`).
check_config_mode() {
  local path="${CONFIG_DIR}/config"
  if [ ! -f "${path}" ]; then
    return  # absence already reported by check_config
  fi
  local mode=""
  if stat -c '%a' "${path}" >/dev/null 2>&1; then
    mode="$(stat -c '%a' "${path}")"
  elif stat -f '%Lp' "${path}" >/dev/null 2>&1; then
    mode="$(stat -f '%Lp' "${path}")"
  else
    printf '  WARN  config mode probe: no usable stat(1); skipped.\n'
    return
  fi
  case "${mode}" in
    600|400)
      report OK "config mode (${mode})"
      ;;
    640|440)
      # Group-readable is allowed by the bridge's _sc_source_config_safe
      # guard, but install.sh writes 0600 — anything looser is drift
      # worth surfacing.
      printf '  WARN  config mode %s is looser than the installed default 0600 (still accepted by the bridge).\n' "${mode}"
      ;;
    *)
      printf '  WARN  config mode %s is too permissive (want 0600 or stricter); run install.sh to normalize.\n' "${mode}"
      ;;
  esac
}

# IS-011: try to mkdir + write a sentinel under the lock dir the bridge
# will actually use at runtime. A wedged or read-only ${XDG_RUNTIME_DIR}
# is what would manifest as a "VERDICT: ERROR" on the first review —
# catch it here instead.
check_lock_dir() {
  # Path expression must match bridge/lib/run-review.sh exactly — otherwise the
  # doctor probes a directory the bridge never uses (and masks an IS-011 failure
  # the doctor is here to catch).
  local lock_dir="${SC_LOCK_DIR:-${XDG_RUNTIME_DIR:-${HOME}/.cache}/sc/locks}"
  if ! mkdir -p "${lock_dir}" 2>/dev/null; then
    report FAIL "lock dir writable" "mkdir failed for ${lock_dir}"
    return
  fi
  local probe="${lock_dir}/.sc-doctor-probe-$$"
  # Ensure the sentinel is removed on any normal return from this
  # function (including `set -e` early-exit). RETURN does not fire on
  # signal interrupts, but the success path removes the sentinel
  # explicitly and `rm -f` is idempotent.
  # shellcheck disable=SC2064
  trap "rm -f '${probe}'" RETURN
  if : > "${probe}" 2>/dev/null; then
    rm -f "${probe}"
    report OK "lock dir writable (${lock_dir})"
  else
    report FAIL "lock dir writable" "cannot write to ${lock_dir}"
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
  check_config_mode
}

check_claude_commands() {
  printf '\nClaude Code /sc commands (%s):\n' "${CLAUDE_CMD_DIR}"
  if [ ! -d "${CLAUDE_CMD_SRC}" ]; then
    report FAIL "source dir" "missing: ${CLAUDE_CMD_SRC}"
    return
  fi
  # Derive the expected list from the canonical source so the doctor stays in
  # lockstep with bridge/install.sh — no hardcoded list to drift.
  # Glob "sc*.md" matches the umbrella /sc and every /sc-<name>.
  local any=0
  for src in "${CLAUDE_CMD_SRC}"/sc*.md; do
    [ -e "${src}" ] || continue
    any=1
    local name; name="$(basename "${src}")"
    check_file "${CLAUDE_CMD_DIR}/${name}" "${name}"
  done
  if [ "${any}" -eq 0 ]; then
    report FAIL "any /sc commands" "no sc*.md files in ${CLAUDE_CMD_SRC}"
  fi
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
  check_realpath_gnu_m
}

check_runtime() {
  printf '\nRuntime environment:\n'
  check_lock_dir
}

check_protocols() {
  printf '\nCoding standards (%s):\n' "${PROTOCOLS_DEST}"
  if [ ! -d "${PROTOCOLS_SRC}" ]; then
    report FAIL "protocols source dir" "missing: ${PROTOCOLS_SRC}"
    return
  fi
  if [ ! -d "${PROTOCOLS_DEST}" ]; then
    report FAIL "protocols deployed dir" "missing: ${PROTOCOLS_DEST}"
    return
  fi
  local missing=0 total=0
  for src in "${PROTOCOLS_SRC}"/*.md; do
    [ -e "${src}" ] || continue
    total=$((total + 1))
    local name; name="$(basename "${src}")"
    if [ ! -f "${PROTOCOLS_DEST}/${name}" ]; then
      report FAIL "${name}" "not deployed"
      missing=$((missing + 1))
    fi
  done
  if [ "${total}" -eq 0 ]; then
    report FAIL "any protocols" "no *.md files in ${PROTOCOLS_SRC}"
  elif [ "${missing}" -eq 0 ]; then
    report OK "${total} protocol(s) deployed"
  fi
}

check_upgrade_residue() {
  printf '\nUpgrade residue (warn-only):\n'
  local any=0
  for p in "${STALE_FILES[@]}"; do
    if [ -e "${p}" ]; then
      check_stale "${p}"
      any=1
    fi
  done
  if [ "${any}" -eq 0 ]; then
    printf '  OK    no stale files from prior installs.\n'
  fi
}

# --- main -------------------------------------------------------------------

printf 'sc-doctor: checking Shadow Clone install...\n'
# IS-012: print the active umask so users diagnosing mode-related
# install drift (notably the 0600 config) can see what their shell
# will set the moment they re-run install.sh.
printf '  active umask: %s\n' "$(umask)"

check_bridge
check_config
check_claude_commands
check_opencode
check_path
check_protocols
check_runtime
check_upgrade_residue

printf '\n'
if [ "${FAILS}" -eq 0 ]; then
  printf 'sc-doctor: all checks passed.\n'
  exit 0
else
  printf 'sc-doctor: %d check(s) failed. Re-run bridge/install.sh and opencode-plugin/install.sh.\n' "${FAILS}" >&2
  exit 1
fi
