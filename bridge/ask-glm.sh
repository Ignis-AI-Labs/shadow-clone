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
#   SC_REVIEWER_AGENT   OpenCode agent to use            (default echo-reviewer)

set -euo pipefail

# Locate the shared libraries relative to this script (works in the repo layout and
# in the installed ~/.claude/sc layout — both keep ask-*.sh beside lib/).
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Optional config file. Use conditional assignment in it so inline env wins.
SC_CONFIG="${SC_CONFIG:-${XDG_CONFIG_HOME:-$HOME/.config}/sc/config}"
# shellcheck source=/dev/null
[ -f "${SC_CONFIG}" ] && . "${SC_CONFIG}"

readonly MODEL="${SC_REVIEWER_MODEL:-zai-coding-plan/glm-5.2}"
readonly AGENT="${SC_REVIEWER_AGENT:-echo-reviewer}"
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
STAMP="$(date +%Y%m%d-%H%M%S)-$$"
REQ="${EXCHANGE_DIR}/${STAMP}-request.md"
RESP="${EXCHANGE_DIR}/${STAMP}-response.md"

# Per-pass invoker used by echo_review ($1=request file, $2=response file).
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
echo_review

# --- emit ------------------------------------------------------------------
echo "sc: review logged at ${RESP}" >&2
cat "${RESP}"
