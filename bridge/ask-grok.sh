#!/usr/bin/env bash
#
# echo bridge — Claude builds, Grok reviews. Hands the current work unit to the
# Grok Reviewer (headless `grok -p`, read-only) and prints its review.
# This is the third reviewer backend, alongside ask-glm.sh (GLM via OpenCode) and
# ask-claude.sh (Claude via `claude -p`). All three share lib/ and the single
# reviewer persona in agent/sc-echo-reviewer.md.
#
# impure: shells out to `grok`, reads git state and files, writes exchange
# artifacts. All side effects live here, isolated from any pure logic.
#
# Usage: ask-grok.sh "<context: what was done and why>" [file ...]
#
# Configurable via env or ${XDG_CONFIG_HOME:-~/.config}/sc/config:
#   SC_GROK_MODEL     model id for the Grok reviewer (default: grok's configured default)
#   SC_GROK_SANDBOX   optional grok --sandbox profile (default: unset — not passed)
#   SC_GROK_ALLOW_MCP set to an explicit true value (1/true/yes) to skip the
#                     fail-closed MCP pre-flight (accepts the risk). Any other
#                     value — including 0/false/no/empty — keeps the gate on.
#   SC_GROK_MAX_CHARS per-pass byte budget for THIS backend; overrides SC_MAX_CHARS
#                     for grok passes (default 24000, digits only, hard ceiling
#                     32000). Kept small because grok truncates dense content near
#                     ~25KB; the chunker splits work to fit. The grok backend suits
#                     SMALL work units — a single file too big to fit returns ERROR.
#   SC_QUIET_ARGV     set to 1 to suppress the one-time note that this backend
#                     passes the request via argv (visible to other local users
#                     via /proc for the review's lifetime — see GROK-002).

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
# before they reach the reviewer CLI argv. SC_GROK_MODEL may be empty (then the
# reviewer uses grok's own configured default and no --model flag is passed).
if [ -n "${SC_GROK_MODEL:-}" ]; then
  sc_assert_env_ident SC_GROK_MODEL "${SC_GROK_MODEL}" || exit 1
fi
if [ -n "${SC_GROK_SANDBOX:-}" ]; then
  sc_assert_env_ident SC_GROK_SANDBOX "${SC_GROK_SANDBOX}" || exit 1
fi

readonly REVIEWER_MODEL="${SC_GROK_MODEL:-}"
readonly GROK_SANDBOX="${SC_GROK_SANDBOX:-}"

# GROK-002 (2026-07-10): grok OFFLOADS a large prompt and shows the model only a
# truncated head+tail slice, keeping the full text in a file reachable via a tool.
# Our reviewer denies all tools (GROK-001), so the middle of an over-large request
# is lost to it. This is by TOKEN count, so dense real code truncates near ~25KB
# per request — far smaller than GLM's 1MB window (evidence: a ~24KB single-file
# review found a real mid-file bug, but a ~29KB dense request lost its middle; a
# 183KB request lost it badly). So force a grok-appropriate per-pass budget:
# chunk-review.sh then splits a work unit into passes grok sees IN FULL, or returns
# VERDICT: ERROR for a single file too big to fit. Tune with SC_GROK_MAX_CHARS
# (digits only; anything else falls back to the safe default).
case "${SC_GROK_MAX_CHARS:-}" in
  ''|*[!0-9]*) _sc_grok_budget=24000 ;;
  *)           _sc_grok_budget="${SC_GROK_MAX_CHARS}" ;;
esac
# Hard ceiling (GROK-002 R2 Medium): a digits-only value alone is not enough — an
# inflated budget would let the chunker rebuild the large, truncation-prone passes
# this guards against. grok truncates REAL (dense) content around ~25KB per
# request — far below what sparse filler suggested — so the ceiling sits just
# above the verified-good zone; above it, warn and clamp.
if [ "${_sc_grok_budget}" -gt 32000 ]; then
  echo "sc: WARN — SC_GROK_MAX_CHARS=${_sc_grok_budget} exceeds the grok-safe ceiling (32000); clamping. Larger passes risk grok truncating their middle." >&2
  _sc_grok_budget=32000
fi
# _sc_grok_budget is the TOTAL prompt target for grok. SC_MAX_CHARS (the chunker's
# REQ-size budget) is exported LATER — after the persona is measured — because grok
# also receives the persona via --rules as a SEPARATE payload the chunker cannot
# see, so it must be debited from the request budget (GROK-002 R3 High). Do not
# export SC_MAX_CHARS here.
#
# Lower the chunker's per-pass file floor for grok (default 20000 suits GLM). With
# AGENTS.md + context + the persona all riding every pass, the default floor would
# force requests well past grok's truncation point. 5000 keeps grok's real prompt
# (REQ + persona) under the ~25KB threshold; a single file larger than this returns
# VERDICT: ERROR rather than a truncated review. This is why the grok backend suits
# SMALL work units — big files exceed its secure, tool-denied window.
export SC_MIN_PASS_AVAIL=5000
# Physical path (-P): the file-containment filter compares against realpath output,
# so PROJECT_DIR must also be symlink-resolved or every file is wrongly skipped when
# the project root is reached through a symlink.
readonly PROJECT_DIR="$(pwd -P)"
readonly EXCHANGE_DIR="${PROJECT_DIR}/.sc/exchange"

# AS-009 / AUDIT-027: refuse PROJECT_DIR='/' or '${HOME}' — the containment
# filter would otherwise let every absolute path through.
sc_assert_project_dir "${PROJECT_DIR}" || exit 1

# A reviewer must never trigger another review. Refuse cleanly if we are nested.
sc_assert_not_reentrant "ask-grok.sh" || exit 0

if ! command -v grok >/dev/null 2>&1; then
  echo "sc: grok is not installed or not on PATH." >&2
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
# files into ${EXCHANGE_DIR} and sends the same content to xAI via `grok`.
# If the user accidentally commits .sc/, that data leaks. Emit a one-time
# warning when .sc/ is not gitignored. Suppress with SC_QUIET_GITIGNORE=1.
if [ -z "${SC_QUIET_GITIGNORE:-}" ] \
   && git -C "${PROJECT_DIR}" rev-parse --git-dir >/dev/null 2>&1; then
  if ! git -C "${PROJECT_DIR}" check-ignore -q .sc/ 2>/dev/null; then
    echo "sc: WARN — .sc/ is not gitignored in ${PROJECT_DIR}." >&2
    echo "sc:        Review request/response files contain full file contents." >&2
    echo "sc:        Add '.sc/' to .gitignore to keep them out of commits, or set" >&2
    echo "sc:        SC_QUIET_GITIGNORE=1 to suppress this warning." >&2
  fi
fi

# GROK-002 (CWE-200): this backend passes the review request to grok inline via
# `-p`, so the request body (source, diffs, AGENTS.md) is briefly visible on the
# process argv (/proc/<pid>/cmdline) to other local users while the review runs.
# grok gives no non-truncating secure channel (see sc_invoke_one). Warn once so
# the tradeoff is an informed choice; suppress with SC_QUIET_ARGV=1.
if [ -z "${SC_QUIET_ARGV:-}" ]; then
  echo "sc: NOTE — the grok backend passes the review request via the command line," >&2
  echo "sc:        so its contents are briefly visible to other local users via /proc." >&2
  echo "sc:        On a shared/multi-user host, prefer the opencode or claude backend." >&2
  echo "sc:        Set SC_QUIET_ARGV=1 to suppress this note." >&2
fi

STAMP="$(date +%Y%m%d-%H%M%S)-$$"
REQ="${EXCHANGE_DIR}/${STAMP}-request.md"
RESP="${EXCHANGE_DIR}/${STAMP}-response.md"

# --- fail-closed MCP pre-flight (BRIDGE-005 parity for the Grok backend) -----
# The Claude reviewer confines its MCP surface at the source with
# `--strict-mcp-config` (loads ZERO servers, so no mcp__* tool can exist).
# The grok CLI exposes no such flag, so we get the same practical guarantee by
# refusing to dispatch when ANY Grok MCP server is configured: a reviewer with
# no MCP servers in reach cannot be handed dynamically-named MCP tools that a
# built-in denylist could never enumerate.
#
# `grok mcp list` prints the sentinel "No MCP servers configured" when the set
# is empty. We fail closed on anything else — servers present OR unrecognized
# output (e.g. a future wording change) — because the safe direction here is to
# refuse rather than dispatch an unconfined reviewer. Set SC_GROK_ALLOW_MCP=1
# to accept the risk and skip this gate. sc-doctor should verify the sentinel
# still matches so a silent wording drift is caught at health-check time.
sc_emit_error_verdict() {
  # $1 = human-readable reason. Produce a parseable VERDICT: ERROR so the
  # Builder surfaces the failure instead of looping. Mirrors the wrapped-output
  # contract in the --- emit --- section below.
  echo "sc: $1" >&2
  echo "<<<UNTRUSTED-REVIEWER-OUTPUT>>>"
  echo "The Grok review bridge did not dispatch: $1"
  echo "VERDICT: ERROR"
  echo "<<<END-UNTRUSTED-REVIEWER-OUTPUT>>>"
}

# Gate the override on EXPLICIT true values only. A bare `-z` emptiness test
# would skip the safety check for SC_GROK_ALLOW_MCP=0 / false / no — the
# opposite of what a safety switch should do (echo-review Medium finding,
# 2026-07-10). Anything not on the allowlist runs the fail-closed pre-flight.
case "${SC_GROK_ALLOW_MCP:-}" in
  1|true|TRUE|yes|YES) ;;  # explicit opt-out — skip the pre-flight, accept the risk
  *)
    mcp_list_out="$(grok mcp list 2>/dev/null || true)"
    if ! printf '%s' "${mcp_list_out}" | grep -qi "No MCP servers configured"; then
      sc_emit_error_verdict \
        "Grok has MCP servers configured (or 'grok mcp list' output was unrecognized); refusing to dispatch an unconfined reviewer. Remove them with 'grok mcp remove', switch to the OpenCode backend, or set SC_GROK_ALLOW_MCP=1 to override."
      exit 0
    fi
    ;;
esac

# --- reviewer contract (single source of truth = the persona file) ---------
# Extract the reviewer's instructions from the shared persona file, stripping
# the YAML frontmatter. Both non-OpenCode backends (Claude + Grok) inherit the
# exact same reviewer-boundary contract this way — there is one place to update
# it (agent/sc-echo-reviewer.md). Passed to grok via --rules (appended to the
# system prompt; grok maps this to Claude Code's --append-system-prompt idiom).
PERSONA_FILE="${SCRIPT_DIR}/agent/sc-echo-reviewer.md"
if [ ! -f "${PERSONA_FILE}" ]; then
  # When ask-grok.sh runs from the installed location (~/.claude/sc/) the
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

# GROK-002 R3 (High): grok receives the persona via --rules as a payload the
# chunker's overhead math never sees, so grok's true prompt is REQ + persona.
# Debit the persona (plus a small margin) from the request budget now, so the
# chunker packs passes small enough that REQ + persona stays inside grok's window.
# Guard against a tiny/negative budget (a very large persona) with a sane floor.
_sc_sys_bytes="$(printf '%s' "${SYS}" | wc -c | tr -d '[:space:]')"
case "${_sc_sys_bytes}" in ''|*[!0-9]*) _sc_sys_bytes=0 ;; esac
_sc_req_budget=$(( _sc_grok_budget - _sc_sys_bytes - 500 ))
# Never inflate the request budget back up: SC_MAX_CHARS must stay ≤
# _sc_grok_budget - persona so REQ + persona can't exceed grok's window (a bare
# "floor up to N" would reintroduce truncation once the persona is large). If the
# persona leaves too little room, WARN — the chunker then refuses oversized passes
# with VERDICT: ERROR (fail-safe), rather than silently overflowing grok.
if [ "${_sc_req_budget}" -lt 8000 ]; then
  echo "sc: WARN — the reviewer persona (${_sc_sys_bytes}B) consumes most of the grok budget (${_sc_grok_budget}B), leaving only ${_sc_req_budget}B for the request. grok reviews may return VERDICT: ERROR. Shrink agent/sc-echo-reviewer.md or raise SC_GROK_MAX_CHARS." >&2
fi
# Keep it a sane positive integer for the arithmetic downstream; this only bites
# when the persona nearly fills the whole budget, in which case the chunker's
# overhead already exceeds it and every pass is refused (ERROR) regardless.
[ "${_sc_req_budget}" -lt 1000 ] && _sc_req_budget=1000
export SC_MAX_CHARS="${_sc_req_budget}"

# Per-pass invoker used by sc_echo_review ($1=request file, $2=response file).
# Transport = inline `-p "<prompt>"`. grok's three input channels were all
# tested (GROK-002); this is the least-bad:
#   - stdin        — grok refuses a piped prompt ("No such device or address").
#   - --prompt-file — keeps the body in the 0600 file (secure) BUT grok offloads
#                     large inputs to a tool-readable file and truncates the
#                     inline middle from ~25KB up; the reviewer denies all tools
#                     (GROK-001) so it cannot read the offload, and every moderate
#                     review lost its middle. A review tool that silently drops
#                     the code under review is worse than the alternative.
#   - -p inline    — the whole request reaches the model (retains a mid-file
#                     canary to ~40KB+, well above the ~33KB pass budget), so
#                     reviews are actually complete. The cost is CWE-200: the
#                     request body sits on the process argv, readable by OTHER
#                     local users via /proc/<pid>/cmdline for the review's
#                     lifetime. Accepted as a documented, warned exception (see
#                     the argv-exposure warning above): the exposure is local and
#                     transient, the same bytes already go to xAI over the
#                     network, and there is no non-truncating secure channel. On a
#                     shared/multi-user host, prefer the opencode or claude backend.
# The truncation-marker detector after sc_echo_review still forces VERDICT: ERROR
# if grok ever offloads anyway, so a partial view can never become a false APPROVE.
sc_invoke_one() {
  local prompt; prompt="$(cat "$1")"
  # Confinement — the reviewer is read-only by contract, and this is enforced by
  # grok's PERMISSION DENY RULES (--deny), which grok's own --help documents as
  # the equivalent of Claude Code's --disallowedTools. This was chosen on
  # EVIDENCE, not docs (2026-07-10 probe, ISSUE_TRACKER GROK-001): a confined
  # reviewer was asked to read an off-prompt secret file, and only --deny
  # actually blocked it. The two flags that sound right — `--tools ""` (empty
  # allowlist) and `--disallowed-tools <names>` — were both NO-OPS in headless
  # --prompt-file mode: the reviewer read the file and printed the secret. So:
  #   1. --deny "*"            wildcard deny-all — the load-bearing lever. Verified
  #                            to block file reads AND shell while still letting the
  #                            reviewer emit its normal text verdict (needs no tools).
  #   2. --deny <Name> (each)  forward-compatible named superset over the critical
  #                            tools, so confinement still holds for the ones that
  #                            matter even if wildcard semantics ever change. grok
  #                            maps these Claude-style names onto its own tools
  #                            (verified: "Read" blocks its read_file, "Bash" the shell).
  #   3. --disable-web-search  documented flag — removes web search + web fetch.
  #   4. --no-subagents        documented flag — no agentic fan-out that could run
  #                            with permissions this parent process didn't grant.
  #   5. no --always-approve   so a headless tool call is never auto-approved.
  # MCP tools are foreclosed upstream by the fail-closed pre-flight above.
  local -a cmd=(grok
    -p "${prompt}"
    --output-format plain
    --rules "${SYS}"
    --cwd "${PROJECT_DIR}"
    --deny "*"
    --deny "Read" --deny "Write" --deny "Edit" --deny "MultiEdit" --deny "NotebookEdit"
    --deny "Bash" --deny "Grep" --deny "Glob" --deny "WebFetch" --deny "WebSearch" --deny "Task"
    --disable-web-search
    --no-subagents)
  [ -n "${REVIEWER_MODEL}" ] && cmd+=(--model "${REVIEWER_MODEL}")
  # Optional OS-level sandbox profile (filesystem + network). Only passed when
  # the user configured a valid profile name; an unknown profile would error
  # every review, so it stays opt-in.
  [ -n "${GROK_SANDBOX}" ] && cmd+=(--sandbox "${GROK_SANDBOX}")
  sc_invoke_reviewer "$2" /dev/null -- "${cmd[@]}"
}

# Claim the review for this subtree so any nested bridge invocation is refused.
sc_mark_in_review "ask-grok.sh"

# Build + review, splitting into multiple passes if the payload is large so the
# reviewer always sees every file in full.
sc_echo_review

# --- truncation safety net (GROK-002) --------------------------------------
# Inline -p plus the small pass budget keep the request inside grok's
# full-retention window, but if grok ever offloads/truncates a pass anyway it
# leaves a tell in its output ("middle truncated", "offloaded prompt/file"). A
# review that judged a partial view must NEVER reach the Builder as a real
# verdict, so if that tell is present we overwrite the response with a parseable
# VERDICT: ERROR. Deterministic and model-independent — it does not rely on the
# reviewer choosing to BLOCK. Case-insensitive, fixed-string match.
if grep -qiF -e "middle truncated" -e "offloaded prompt" -e "offloaded file" "${RESP}" 2>/dev/null; then
  echo "sc: WARN — grok truncated a review pass (offload marker detected); forcing VERDICT: ERROR so no partial review is trusted. Lower SC_GROK_MAX_CHARS or review fewer files at once." >&2
  {
    echo "The grok reviewer received a truncated (offloaded) view of the work unit,"
    echo "so its review covered only part of the code. The bridge refuses to treat a"
    echo "partial review as a real verdict."
    echo "VERDICT: ERROR"
  } > "${RESP}"
fi

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
