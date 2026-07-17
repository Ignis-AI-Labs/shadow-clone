#!/usr/bin/env bash
#
# echo bridge — another agent builds, Kimi reviews. Hands the current work unit to
# the Kimi Reviewer (headless `kimi -p`) and prints its review. This is the fourth
# reviewer backend, alongside ask-glm.sh (GLM via OpenCode), ask-claude.sh
# (Claude via `claude -p`), and ask-grok.sh (Grok via `grok -p`). All four share
# lib/ and the single reviewer persona in agent/sc-echo-reviewer.md.
#
# impure: shells out to `kimi`, reads git state and files, writes exchange
# artifacts. All side effects live here, isolated from any pure logic.
#
# Usage: ask-kimi.sh "<context: what was done and why>" [file ...]
#
# Configurable via env or ${XDG_CONFIG_HOME:-~/.config}/sc/config:
#   SC_KIMI_MODEL     model alias for the Kimi reviewer (default: kimi's
#                     configured default_model — no -m flag is passed when unset)
#   SC_KIMI_MAX_CHARS per-pass byte budget for THIS backend; overrides SC_MAX_CHARS
#                     for kimi passes (default 240000, digits only, hard ceiling
#                     800000). Sized conservatively under a ~256K-token window
#                     (tokens ≈ bytes/4); raise only if your model takes more.
#   SC_QUIET_ARGV     set to 1 to suppress the one-time note that this backend
#                     passes the request via argv (visible to other local users
#                     via /proc for the review's lifetime).
#
# KIMI-001 (known limitation): kimi's headless mode has NO per-invocation tool
# restriction flags (no --disallowedTools / --deny equivalent) and no
# --strict-mcp-config equivalent, so reviewer confinement is PROMPT-ONLY: the
# persona forbids tool use, but nothing enforces it in the process. If the host
# has MCP servers configured for kimi, they are reachable to the reviewer. On a
# host where that matters, prefer the claude or grok backend, whose confinement
# is enforced. The request/response wrapping and verdict parsing still treat the
# reviewer output as untrusted data either way (AUDIT-006).

set -euo pipefail

# BRIDGE-003 (CWE-200): every file this process creates — the exchange request/
# response files (full source + diffs of the reviewed code) and the lock files —
# must be owner-only, matching how install.sh hardens the config to 0600. Set a
# private umask up front so nothing is born world-readable.
umask 077

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

# AS-006 / AUDIT-027: refuse env-supplied values with unsupported characters
# before they reach the reviewer CLI argv. SC_KIMI_MODEL may be empty (then the
# reviewer uses kimi's own configured default and no -m flag is passed).
if [ -n "${SC_KIMI_MODEL:-}" ]; then
  sc_assert_env_ident SC_KIMI_MODEL "${SC_KIMI_MODEL}" || exit 1
fi

readonly REVIEWER_MODEL="${SC_KIMI_MODEL:-}"

# Per-pass byte budget for kimi passes. kimi's window is large but the persona
# rides inline in the same -p prompt (kimi has no system-prompt channel), so the
# budget is kept conservative and the persona is debited from it below. Digits
# only; anything else falls back to the safe default.
case "${SC_KIMI_MAX_CHARS:-}" in
  ''|*[!0-9]*) _sc_kimi_budget=240000 ;;
  *)           _sc_kimi_budget="${SC_KIMI_MAX_CHARS}" ;;
esac
# Hard ceiling: an inflated budget would let the chunker build passes past the
# model's real window, reintroducing silent truncation. Above it, warn and clamp.
if [ "${_sc_kimi_budget}" -gt 800000 ]; then
  echo "sc: WARN — SC_KIMI_MAX_CHARS=${_sc_kimi_budget} exceeds the kimi-safe ceiling (800000); clamping. Larger passes risk the model truncating their middle." >&2
  _sc_kimi_budget=800000
fi
# SC_MAX_CHARS (the chunker's REQ-size budget) is exported LATER — after the
# persona is measured — because kimi also receives the persona inline in the same
# prompt, a payload the chunker cannot see, so it must be debited from the
# request budget. Do not export SC_MAX_CHARS here.

# Physical path (-P): the file-containment filter compares against realpath output,
# so PROJECT_DIR must also be symlink-resolved or every file is wrongly skipped when
# the project root is reached through a symlink.
readonly PROJECT_DIR="$(pwd -P)"
readonly EXCHANGE_DIR="${PROJECT_DIR}/.sc/exchange"

# AS-009 / AUDIT-027: refuse PROJECT_DIR='/' or '${HOME}' — the containment
# filter would otherwise let every absolute path through.
sc_assert_project_dir "${PROJECT_DIR}" || exit 1

# A reviewer must never trigger another review. Refuse cleanly if we are nested.
sc_assert_not_reentrant "ask-kimi.sh" || exit 0

if ! command -v kimi >/dev/null 2>&1; then
  echo "sc: kimi is not installed or not on PATH." >&2
  exit 1
fi

CONTEXT="${1:-No context provided by the Builder.}"
shift || true
FILES=("$@")

mkdir -p "${EXCHANGE_DIR}"
# Repair a .sc/exchange left world-traversable (0755) by an older bridge; the
# umask above only governs newly created dirs. Owner-only dirs block other local
# users from reaching the exchange files regardless of the files' own mode.
chmod 700 "${PROJECT_DIR}/.sc" "${EXCHANGE_DIR}" 2>/dev/null \
  || echo "sc: WARN — could not restrict ${EXCHANGE_DIR} to 0700; artifact filenames may be listable by other local users (file contents stay 0600 via umask)." >&2

# AUDIT-010 (CWE-200): every review writes the full contents of the listed
# files into ${EXCHANGE_DIR} and sends the same content to the Kimi API via
# `kimi -p`. If the user accidentally commits .sc/, that data leaks. Emit a
# one-time warning when .sc/ is not gitignored. Suppress with
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

# CWE-200: this backend passes the review request to kimi inline via `-p`, so the
# request body (source, diffs, AGENTS.md) is briefly visible on the process argv
# (/proc/<pid>/cmdline) to other local users while the review runs — same
# tradeoff as the grok backend. Warn once; suppress with SC_QUIET_ARGV=1.
if [ -z "${SC_QUIET_ARGV:-}" ]; then
  echo "sc: NOTE — the kimi backend passes the review request via the command line," >&2
  echo "sc:        so its contents are briefly visible to other local users via /proc." >&2
  echo "sc:        On a shared/multi-user host, prefer the opencode or claude backend." >&2
  echo "sc:        Set SC_QUIET_ARGV=1 to suppress this note." >&2
fi

STAMP="$(date +%Y%m%d-%H%M%S)-$$"
REQ="${EXCHANGE_DIR}/${STAMP}-request.md"
RESP="${EXCHANGE_DIR}/${STAMP}-response.md"

# --- reviewer contract (single source of truth = the persona file) ---------
# Extract the reviewer's instructions from the shared persona file, stripping
# the YAML frontmatter. kimi has no system-prompt flag, so the persona body is
# prepended to the request text inside the single -p prompt (see sc_invoke_one).
PERSONA_FILE="${SCRIPT_DIR}/agent/sc-echo-reviewer.md"
if [ ! -f "${PERSONA_FILE}" ]; then
  # When ask-kimi.sh runs from the installed location (~/.claude/sc/) the
  # persona lives at the OpenCode deploy path instead.
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

# kimi receives the persona inline in the same prompt as the request, so kimi's
# true prompt is REQ + persona. Debit the persona (plus a small margin) from the
# request budget now, so the chunker packs passes small enough that REQ +
# persona stays inside the model's window.
_sc_sys_bytes="$(printf '%s' "${SYS}" | wc -c | tr -d '[:space:]')"
case "${_sc_sys_bytes}" in ''|*[!0-9]*) _sc_sys_bytes=0 ;; esac
_sc_req_budget=$(( _sc_kimi_budget - _sc_sys_bytes - 500 ))
if [ "${_sc_req_budget}" -lt 8000 ]; then
  echo "sc: WARN — the reviewer persona (${_sc_sys_bytes}B) consumes most of the kimi budget (${_sc_kimi_budget}B), leaving only ${_sc_req_budget}B for the request. kimi reviews may return VERDICT: ERROR. Shrink agent/sc-echo-reviewer.md or raise SC_KIMI_MAX_CHARS." >&2
fi
[ "${_sc_req_budget}" -lt 1000 ] && _sc_req_budget=1000
export SC_MAX_CHARS="${_sc_req_budget}"

# Per-pass invoker used by sc_echo_review ($1=request file, $2=response file).
# Transport = inline `-p "<persona + request>"`: kimi's documented headless
# input channel is the -p argument, and kimi -p requests no approvals (auto
# permission) while static deny rules still apply. Confinement is prompt-only
# (see KIMI-001 above): the persona orders a read-only review, and the bridge
# treats everything that comes back as untrusted data.
sc_invoke_one() {
  local prompt; prompt="$(cat "$1")"
  local -a cmd=(kimi -p "${SYS}

${prompt}" --output-format text)
  [ -n "${REVIEWER_MODEL}" ] && cmd+=(-m "${REVIEWER_MODEL}")
  sc_invoke_reviewer "$2" /dev/null -- "${cmd[@]}"
  # kimi's text transcript prefixes the first line of each assistant message
  # with "• " and indents every continuation line by two spaces (verified
  # 2026-07-16: the +2 applies to all body lines, not only soft wraps). The
  # verdict parser requires `^VERDICT:` at column 0, so strip the bullet and
  # exactly one 2-space continuation indent. The dedent is a uniform shift —
  # it restores the reviewer's original indentation; genuinely empty lines
  # are unaffected.
  [ -f "$2" ] && sed -i -E -e 's/^• ?//' -e 's/^  //' "$2" || true
}

# Claim the review for this subtree so any nested bridge invocation is refused.
sc_mark_in_review "ask-kimi.sh"

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
