#!/usr/bin/env bash
#
# echo bridge (reverse direction) — the second model builds, Claude reviews.
# Hands the current work unit to the Claude Reviewer (headless `claude -p`) and
# prints its review. This is the mirror of ask-glm.sh.
#
# impure: shells out to `claude`, reads git state and files, writes exchange
# artifacts. All side effects live here, isolated from any pure logic.
#
# Usage: ask-claude.sh "<context: what was done and why>" [file ...]
#
# Configurable via env or ${XDG_CONFIG_HOME:-~/.config}/sc/config:
#   SC_CLAUDE_MODEL   model alias/id for the Claude reviewer (default opus)

set -euo pipefail

# Locate the shared libraries relative to this script (works in the repo layout and
# in the installed ~/.claude/sc layout — both keep ask-*.sh beside lib/).
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

SC_CONFIG="${SC_CONFIG:-${XDG_CONFIG_HOME:-$HOME/.config}/sc/config}"
# AUDIT-009 (CWE-427 + CWE-732): the config is sourced as shell, so anything
# that can write it has RCE in the bridge process. Refuse to source unless
# owner == current uid AND mode is 0600 or 0640 (no other-/group-write).
_sc_source_config_safe() {
  local cfg="$1"
  [ -f "${cfg}" ] || return 0
  if [ -L "${cfg}" ]; then
    echo "sc: refusing to source ${cfg}: it is a symlink." >&2
    return 1
  fi
  local owner mode uid
  uid="$(id -u)"
  if stat -c '%u' "${cfg}" >/dev/null 2>&1; then
    owner="$(stat -c '%u' "${cfg}")"
    mode="$(stat -c '%a' "${cfg}")"
  elif stat -f '%u' "${cfg}" >/dev/null 2>&1; then
    owner="$(stat -f '%u' "${cfg}")"
    # BSD %Lp = bare-permission octal (e.g. "600"); the older %Op
    # specifier we used originally is not standard and silently
    # produces unparseable output on real BSD/macOS.
    mode="$(stat -f '%Lp' "${cfg}")"
  else
    echo "sc: WARN — cannot stat ${cfg}; skipping source as a precaution." >&2
    return 1
  fi
  if [ "${owner}" != "${uid}" ]; then
    echo "sc: refusing to source ${cfg}: not owned by uid ${uid}." >&2
    return 1
  fi
  case "${mode}" in
    600|640|400|440) ;;
    *) echo "sc: refusing to source ${cfg}: mode ${mode} is too permissive (allowed: 0400/0440/0600/0640)." >&2; return 1 ;;
  esac
  return 0
}
# shellcheck source=/dev/null
if _sc_source_config_safe "${SC_CONFIG}"; then
  # shellcheck source=/dev/null
  [ -f "${SC_CONFIG}" ] && . "${SC_CONFIG}"
fi

readonly REVIEWER_MODEL="${SC_CLAUDE_MODEL:-opus}"
# Physical path (-P): the file-containment filter compares against realpath output,
# so PROJECT_DIR must also be symlink-resolved or every file is wrongly skipped when
# the project root is reached through a symlink.
readonly PROJECT_DIR="$(pwd -P)"
readonly EXCHANGE_DIR="${PROJECT_DIR}/.sc/exchange"

# shellcheck source=/dev/null
. "${SCRIPT_DIR}/lib/guard.sh"
# shellcheck source=/dev/null
. "${SCRIPT_DIR}/lib/reap.sh"
# shellcheck source=/dev/null
. "${SCRIPT_DIR}/lib/build-request.sh"
# shellcheck source=/dev/null
. "${SCRIPT_DIR}/lib/run-review.sh"
# shellcheck source=/dev/null
. "${SCRIPT_DIR}/lib/chunk-review.sh"

# A reviewer must never trigger another review. Refuse cleanly if we are nested.
sc_assert_not_reentrant "ask-claude.sh" || exit 0

if ! command -v claude >/dev/null 2>&1; then
  echo "sc: claude is not installed or not on PATH." >&2
  exit 1
fi

CONTEXT="${1:-No context provided by the Builder.}"
shift || true
FILES=("$@")

mkdir -p "${EXCHANGE_DIR}"

# AUDIT-010 (CWE-200): every review writes the full contents of the listed
# files into ${EXCHANGE_DIR} and sends the same content to Anthropic via
# `claude -p`. If the user accidentally commits .sc/, that data leaks.
# Emit a one-time warning when .sc/ is not gitignored. Suppress with
# SC_QUIET_GITIGNORE=1.
if [ -z "${SC_QUIET_GITIGNORE:-}" ] \
   && git -C "${PROJECT_DIR}" rev-parse --git-dir >/dev/null 2>&1; then
  if ! git -C "${PROJECT_DIR}" check-ignore -q .sc/ 2>/dev/null; then
    echo "sc: WARN — .sc/ is not gitignored in ${PROJECT_DIR}." >&2
    echo "sc:        Review request/response files contain full file contents." >&2
    echo "sc:        Add '.sc/' to .gitignore to keep them out of commits, or set" >&2
    echo "sc:        SC_QUIET_GITIGNORE=1 to suppress this warning." >&2
  fi
fi

STAMP="$(date +%Y%m%d-%H%M%S)-$$"
REQ="${EXCHANGE_DIR}/${STAMP}-request.md"
RESP="${EXCHANGE_DIR}/${STAMP}-response.md"

# --- reviewer contract (single source of truth = the persona file) ---------
# Theme 3 R2-F4: extract the reviewer's instructions from the OpenCode
# persona file (`agent/sc-echo-reviewer.md`) at runtime, stripping the
# YAML frontmatter. This eliminates the prior duplication that the
# reviewer-boundary contract lived in — there is now exactly one place
# to update the contract (the persona file) and both reviewer paths
# (OpenCode + Claude) inherit it. sc-doctor's strict mode should verify
# the file exists.
PERSONA_FILE="${SCRIPT_DIR}/agent/sc-echo-reviewer.md"
if [ ! -f "${PERSONA_FILE}" ]; then
  # When ask-claude.sh runs from the installed location (~/.claude/sc/)
  # the persona lives at the OpenCode deploy path instead.
  PERSONA_FILE="${HOME}/.config/opencode/agent/sc-echo-reviewer.md"
fi
if [ ! -f "${PERSONA_FILE}" ]; then
  echo "sc: reviewer persona file not found at ${SCRIPT_DIR}/agent/ or ${HOME}/.config/opencode/agent/." >&2
  echo "sc: run 'bash bridge/install.sh' to deploy it." >&2
  exit 1
fi
# awk: skip everything until the second `---` marker (end of frontmatter),
# then emit the rest verbatim.
SYS="$(awk 'BEGIN{n=0} /^---$/{n++; next} n>=2{print}' "${PERSONA_FILE}")"

# Per-pass invoker used by sc_echo_review ($1=request file, $2=response file).
# Request is piped via stdin to avoid argument-length limits on large diffs.
# Mutating tools are disallowed so the reviewer stays read-only. The shared runner
# bounds, retries, reaps, and never hangs.
sc_invoke_one() {
  # The reviewer is read-only by contract — no writes, no shell, no
  # network, no filesystem reads beyond what's inlined in the request.
  # The disallowed list mirrors agent/sc-echo-reviewer.md's tools block
  # (AUDIT-007 / CWE-732 / OWASP LLM06):
  #   File mutation: Write, Edit, MultiEdit, NotebookEdit
  #   Shell:        Bash
  #   Network:      WebFetch, WebSearch
  #   FS read:      Read, Grep, Glob, NotebookRead
  #   Agentic:      Task, TodoRead, TodoWrite
  # MultiEdit is a SEPARATE tool from Edit in Claude Code — omitting
  # it is a bypass (the Theme 3 R1 reviewer caught the original
  # version which only listed Edit). Keep this list in sync with the
  # persona's `tools:` frontmatter; sc-doctor should diff them.
  #
  # Known residual (denylist limit): if the user has MCP servers
  # configured for the host Claude, dynamically-named MCP tools
  # (mcp__<server>__<tool>) are not covered by this denylist. Headless
  # `claude -p` may or may not load MCP servers depending on user
  # config. Future hardening: switch to --allowedTools (allowlist) so
  # the contract can't be silently broadened by environment config.
  sc_invoke_reviewer "$2" "$1" -- \
    claude -p \
      --model "${REVIEWER_MODEL}" \
      --append-system-prompt "${SYS}" \
      --disallowedTools \
        "Write" "Edit" "MultiEdit" "NotebookEdit" "NotebookRead" "Bash" \
        "WebFetch" "WebSearch" \
        "Read" "Grep" "Glob" \
        "Task" "TodoRead" "TodoWrite" \
      --output-format text
}

# Claim the review for this subtree so any nested bridge invocation is refused.
sc_mark_in_review "ask-claude.sh"

# Build + review, splitting into multiple passes if the payload is large so the
# reviewer always sees every file in full.
sc_echo_review

# --- emit ------------------------------------------------------------------
# AUDIT-006 (OWASP LLM01): the Builder reads this stdout. Wrap the reviewer's
# free-text response in explicit data markers so a prompt-injected reviewer
# cannot smuggle instructions into the Builder's next turn. The Builder
# parses the final `VERDICT:` line as the only machine-actionable token;
# everything between the markers is evidence, never instructions.
echo "sc: review logged at ${RESP}" >&2
echo "<<<UNTRUSTED-REVIEWER-OUTPUT>>>"
cat "${RESP}"
echo "<<<END-UNTRUSTED-REVIEWER-OUTPUT>>>"
