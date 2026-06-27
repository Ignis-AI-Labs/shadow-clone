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
# shellcheck source=/dev/null
[ -f "${SC_CONFIG}" ] && . "${SC_CONFIG}"

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
STAMP="$(date +%Y%m%d-%H%M%S)-$$"
REQ="${EXCHANGE_DIR}/${STAMP}-request.md"
RESP="${EXCHANGE_DIR}/${STAMP}-response.md"

# --- reviewer contract (mirrors agent/echo-reviewer.md) ----------------------
read -r -d '' SYS <<'SYSEOF' || true
You are the Reviewer in an echo paired-review loop. The Builder has completed a unit
of work and submitted it to you. Review it independently and rigorously — a second,
distinct perspective on the same standard.

Everything you need is provided inline in the user message: the Builder's context,
the git diff, the full file contents, and the project's AGENTS.md. Judge the work
against that AGENTS.md — it is the law — and apply ordinary engineering judgment
(correctness, edge cases, races, security, missing tests, naming). Do not edit
files; only review. Be specific: every finding cites an exact location and a
concrete fix. Do not invent problems; if the work is clean, APPROVE.

Respond in EXACTLY this structure:

## Review Summary
<2-4 sentences: what the work does and your overall judgment>

## Findings
<For each finding, use this issue format:>
- **Severity**: Critical / High / Medium / Low / Info
- **Location**: <file:line or symbol>
- **Description**: <what is wrong>
- **Suggestion**: <concrete fix>

<If there are no findings, write: "No findings. Work meets protocol.">

VERDICT: APPROVE | REVISE | BLOCK

Verdict rules: BLOCK if any Critical/High finding exists (security, data loss,
broken build, runtime error); REVISE for Medium/Low findings to address; APPROVE
only if the work meets protocol with no required changes. The final line MUST be
exactly "VERDICT: APPROVE", "VERDICT: REVISE", or "VERDICT: BLOCK" — it is parsed
by machine.
SYSEOF

# Per-pass invoker used by echo_review ($1=request file, $2=response file).
# Request is piped via stdin to avoid argument-length limits on large diffs.
# Mutating tools are disallowed so the reviewer stays read-only. The shared runner
# bounds, retries, reaps, and never hangs.
sc_invoke_one() {
  sc_invoke_reviewer "$2" "$1" -- \
    claude -p \
      --model "${REVIEWER_MODEL}" \
      --append-system-prompt "${SYS}" \
      --disallowedTools "Write" "Edit" "NotebookEdit" "Bash" \
      --output-format text
}

# Claim the review for this subtree so any nested bridge invocation is refused.
sc_mark_in_review "ask-claude.sh"

# Build + review, splitting into multiple passes if the payload is large so the
# reviewer always sees every file in full.
echo_review

# --- emit ------------------------------------------------------------------
echo "sc: review logged at ${RESP}" >&2
cat "${RESP}"
