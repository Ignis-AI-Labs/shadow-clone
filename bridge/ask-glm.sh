#!/usr/bin/env bash
#
# echo bridge — Claude builds, the second model (default: GLM via OpenCode)
# reviews. Hands the current work unit to the Reviewer and prints its review.
#
# impure: shells out to `opencode`, reads git state and files, writes exchange
# artifacts. All side effects live here, isolated from any pure logic.
#
# Usage: ask-glm.sh "<context: what was done and why>" [file ...]
#
# Configurable via env or ${XDG_CONFIG_HOME:-~/.config}/sc/config:
#   SC_REVIEWER_MODEL   provider/model for the reviewer (default zai-coding-plan/glm-5.2)
#   SC_REVIEWER_AGENT   OpenCode agent to use            (default sc-echo-reviewer)

set -euo pipefail

# Locate the shared libraries relative to this script (works in the repo layout and
# in the installed ~/.claude/sc layout — both keep ask-*.sh beside lib/).
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Optional config file. Use conditional assignment in it so inline env wins.
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
    mode="$(stat -f '%Op' "${cfg}")"; mode="${mode: -3}"
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
    *) echo "sc: refusing to source ${cfg}: mode ${mode} is too permissive (need 0600 or 0640)." >&2; return 1 ;;
  esac
  return 0
}
# shellcheck source=/dev/null
if _sc_source_config_safe "${SC_CONFIG}"; then
  # shellcheck source=/dev/null
  [ -f "${SC_CONFIG}" ] && . "${SC_CONFIG}"
fi

readonly MODEL="${SC_REVIEWER_MODEL:-zai-coding-plan/glm-5.2}"
readonly AGENT="${SC_REVIEWER_AGENT:-sc-echo-reviewer}"
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
sc_assert_not_reentrant "ask-glm.sh" || exit 0

if ! command -v opencode >/dev/null 2>&1; then
  echo "sc: opencode is not installed or not on PATH." >&2
  exit 1
fi

CONTEXT="${1:-No context provided by the Builder.}"
shift || true
FILES=("$@")

mkdir -p "${EXCHANGE_DIR}"

# AUDIT-010 (CWE-200): every review writes the full contents of the listed
# files into ${EXCHANGE_DIR} and sends the same content to the configured
# reviewer model's provider. If the user accidentally commits .sc/, that
# data leaks. Emit a one-time warning when .sc/ is not gitignored in the
# current repo. The warning is suppressed by SC_QUIET_GITIGNORE=1.
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

# Per-pass invoker used by sc_echo_review ($1=request file, $2=response file).
# The request is attached as a file to avoid argument-length limits on large diffs.
# NOTE: the message positional MUST come before --file= (the flag is a greedy array).
# --port 0 gives each run its own random server port (isolation across concurrent
# projects). The shared runner bounds, retries, reaps, and never hangs.
sc_invoke_one() {
  sc_invoke_reviewer "$2" /dev/null -- \
    opencode run \
      --agent "${AGENT}" \
      --model "${MODEL}" \
      --dir "${PROJECT_DIR}" \
      --port 0 \
      "Review the attached echo review request and respond in the required format." \
      --file="$1"
}

# Claim the review for this subtree so any nested bridge invocation is refused.
sc_mark_in_review "ask-glm.sh"

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
