#!/usr/bin/env bash
#
# echo chunked review — guarantees the Reviewer sees every file IN FULL, even when a
# work unit is too large to fit a model's context window in one request.
#
# If the planned request exceeds SC_MAX_CHARS, the files are split into multiple
# passes that each fit the budget (each pass carries full file contents, the diff
# scoped to just those files, and AGENTS.md). Each pass is reviewed independently and
# the verdicts are aggregated (ERROR > BLOCK > REVISE > APPROVE). For a normal-sized
# work unit it's a single pass — identical to the unchunked behavior.
#
# SC_MAX_CHARS is a byte proxy for the reviewer model's input window (model windows
# are token-denominated; tokens ≈ bytes/4 for typical code/text — so keep the byte
# budget comfortably under the model's real token capacity). It is a hard gate, not a
# soft target: if a built pass exceeds it (e.g. a single file larger than the budget),
# the pass is REFUSED with VERDICT: ERROR instead of being sent — a model that
# silently truncates an over-budget request would return a verdict on files it never
# fully saw, which is worse than a clean ERROR the human can act on. Never trade a
# silent truncation for a substantive-looking verdict.
#
# impure: builds requests, invokes the reviewer (via the bridge-provided
# sc_invoke_one), writes the response file.
#
# Contract: the caller must have set CONTEXT, FILES (array), PROJECT_DIR,
# EXCHANGE_DIR, STAMP, REQ, RESP, and must define a function:
#   sc_invoke_one REQ_PATH RESP_PATH   # run the reviewer on REQ_PATH -> RESP_PATH
#
# Tunable:
#   SC_MAX_CHARS   per-pass budget in bytes — a proxy for the reviewer's token
#                  window (tokens ≈ bytes/4). Default 1000000 (~250K tokens), sized
#                  for GLM 5.2 via OpenCode, whose context easily accommodates large
#                  multi-file units, so normal work reviews in a single pass. Files
#                  are packed so each pass stays under it; any pass that would still
#                  exceed it is REFUSED with VERDICT: ERROR rather than sent for a
#                  silently-truncated review. Lower it for a smaller-context
#                  reviewer; raise it only if yours has a larger token window.

# Parse the final VERDICT token from a response file (APPROVE/REVISE/BLOCK/ERROR).
sc_verdict_of() {
  local v
  v="$(grep -E '^VERDICT:' "$1" 2>/dev/null | tail -1 | awk '{print $2}' || true)"
  [ -n "${v}" ] && echo "${v}" || echo "ERROR"
}

# _sc_aggregate_verdict VERDICT [VERDICT...]  → echo the strictest one.
# Precedence (strictest wins): ERROR > BLOCK > REVISE > APPROVE.
# Extracted from sc_echo_review (AUDIT-026 / QA-010) so the main function
# stays under the 50-line ceiling.
_sc_aggregate_verdict() {
  local v has_error=0 has_block=0 has_revise=0
  for v in "$@"; do
    case "${v}" in
      ERROR)  has_error=1 ;;
      BLOCK)  has_block=1 ;;
      REVISE) has_revise=1 ;;
    esac
  done
  if   [ "${has_error}"  = 1 ]; then echo ERROR
  elif [ "${has_block}"  = 1 ]; then echo BLOCK
  elif [ "${has_revise}" = 1 ]; then echo REVISE
  else echo APPROVE
  fi
}

# _sc_refuse_oversize RESP FILES_DESC REQ_BYTES BUDGET
# Write an ERROR review for a pass whose built request exceeds the reviewer's input
# window. Sending it would let the model silently truncate the files and return a
# verdict on content it never saw, so the bridge refuses and surfaces it instead.
_sc_refuse_oversize() {
  local resp="$1" desc="$2" bytes="$3" budget="$4"
  {
    echo "## Echo bridge — pass too large to review in full"
    echo
    echo "This pass's request is ${bytes}B, over the reviewer input window of"
    echo "${budget}B (SC_MAX_CHARS). Sending it would let the model silently"
    echo "truncate the files and judge content it never fully saw, so the bridge"
    echo "refused rather than return an untrustworthy verdict."
    echo
    echo "Files in this pass: ${desc}"
    echo
    echo "Resolve by splitting this into a smaller work unit (fewer/smaller files"
    echo "per review), or — only if your reviewer model genuinely accepts more —"
    echo "raise the window, e.g. SC_MAX_CHARS=2000000."
    echo
    echo "VERDICT: ERROR"
  } > "${resp}"
}

# _sc_req_bytes REQ  → size of the built request file in bytes (0 if missing).
_sc_req_bytes() { wc -c < "$1" 2>/dev/null || echo 0; }

# _sc_run_pass REQ RESP BUDGET DESC LABEL
# Run one already-built pass: refuse it (VERDICT: ERROR) when its byte size exceeds
# BUDGET, else invoke the reviewer on it. Always leaves RESP ending in a VERDICT
# line. LABEL prefixes the stderr diagnostic (e.g. "review", "part 2"). Shared by
# the single-pass and multi-pass paths so the refuse gate can never drift between them.
_sc_run_pass() {
  local req="$1" resp="$2" budget="$3" desc="$4" label="$5" reqsz
  reqsz="$(_sc_req_bytes "${req}")"
  if [ "${reqsz}" -gt "${budget}" ]; then
    _sc_refuse_oversize "${resp}" "${desc}" "${reqsz}" "${budget}"
    echo "sc: ERROR — ${label} payload ${reqsz}B exceeds the reviewer window (${budget}B); refused (the model would silently truncate it). See ${resp}." >&2
  else
    sc_invoke_one "${req}" "${resp}" || true
  fi
  grep -qE '^VERDICT:' "${resp}" 2>/dev/null || printf '\nVERDICT: ERROR\n' >> "${resp}"
}

# _sc_plan_chunks AVAIL HAS_GIT
# Greedily pack FILES into passes whose file+diff bytes stay under AVAIL, leaving the
# result in the global array SC_PLANNED_CHUNKS (one pass per element, files
# newline-separated within). A file's size counts its contents AND its scoped diff,
# so the estimate reflects the real per-pass payload. Warns on any single file that
# alone exceeds AVAIL (it gets its own pass and may be refused downstream).
_sc_plan_chunks() {
  local avail="$1" has_git="$2"
  SC_PLANNED_CHUNKS=()
  local cur="" cur_bytes=0 f sz fp i=0
  while [ "${i}" -lt "${#FILES[@]}" ]; do
    f="${FILES[$i]}"; i=$(( i + 1 ))
    # Resolve relative paths against PROJECT_DIR so the size check is correct
    # regardless of the caller's cwd (build-request.sh resolves the same way).
    fp="${f}"; case "${f}" in /*) : ;; *) fp="${PROJECT_DIR}/${f}" ;; esac
    sz=0
    if [ -f "${fp}" ]; then sz=$(wc -c < "${fp}" 2>/dev/null || echo 0); fi
    if [ "${has_git}" = 1 ]; then
      sz=$(( sz + $( { git -C "${PROJECT_DIR}" --no-pager diff HEAD -- "${f}" 2>/dev/null || true; } | wc -c ) ))
    fi
    if [ -n "${cur}" ] && [ $(( cur_bytes + sz )) -gt "${avail}" ]; then
      SC_PLANNED_CHUNKS+=( "${cur}" ); cur=""; cur_bytes=0
    fi
    [ "${sz}" -gt "${avail}" ] && echo "sc: WARNING — '${f}' (${sz}B) exceeds the per-pass budget (${avail}B); it gets its own pass and will be refused with VERDICT: ERROR if the built request still exceeds the window." >&2
    cur+="${f}"$'\n'; cur_bytes=$(( cur_bytes + sz ))
  done
  [ -n "${cur}" ] && SC_PLANNED_CHUNKS+=( "${cur}" )
  return 0   # never let an empty-FILES short-circuit abort the caller under set -e
}

# _sc_run_multipass N BUDGET
# Review each planned chunk in SC_PLANNED_CHUNKS as its own pass (rebuilding FILES,
# CONTEXT, and REQ per pass), append each part's response to RESP, then finish with
# an aggregate verdict (strictest of the parts). Only called when there are >=2 chunks.
_sc_run_multipass() {
  local n="$1" budget="$2"
  echo "sc: review payload is large — splitting into ${n} passes so the reviewer sees every file in full." >&2
  local orig_context="${CONTEXT}"
  : > "${RESP}"
  local -a verdicts=()
  local k=0 chunkstr line v presp
  for chunkstr in "${SC_PLANNED_CHUNKS[@]}"; do
    k=$(( k + 1 ))
    # Rebuild FILES for this chunk (bash 3.2-safe; no mapfile).
    FILES=()
    while IFS= read -r line; do [ -n "${line}" ] && FILES+=( "${line}" ); done <<EOF
${chunkstr}
EOF
    CONTEXT="${orig_context}

(echo chunked review: part ${k} of ${n}. Judge ONLY the ${#FILES[@]} file(s) in this part; the other parts are reviewed separately. Do not flag files as missing.)"
    REQ="${EXCHANGE_DIR}/${STAMP}-part${k}-request.md"
    presp="${EXCHANGE_DIR}/${STAMP}-part${k}-response.md"
    sc_build_request
    _sc_run_pass "${REQ}" "${presp}" "${budget}" "${FILES[*]}" "part ${k}"
    v="$(sc_verdict_of "${presp}")"
    verdicts+=( "${v}" )
    {
      echo "### echo review — part ${k} of ${n}  (verdict: ${v})"
      echo "Files: ${FILES[*]}"
      echo
      cat "${presp}"
      echo
      echo "---"
      echo
    } >> "${RESP}"
  done
  CONTEXT="${orig_context}"
  local overall; overall="$(_sc_aggregate_verdict "${verdicts[@]}")"
  {
    echo "## Echo Aggregate Verdict (${n} parts)"
    echo
    echo "Per-part verdicts: ${verdicts[*]}"
    echo "Address every finding from every part above before re-reviewing."
    echo
    echo "VERDICT: ${overall}"
  } >> "${RESP}"
  return 0
}

# sc_echo_review: build + invoke, chunking by SC_MAX_CHARS when needed. Writes RESP.
sc_echo_review() {
  local budget="${SC_MAX_CHARS:-1000000}"

  # Fixed per-request overhead: AGENTS.md + the context note + markup slack. The
  # slack covers the boundary-contract header, per-file section markers, and fences
  # that the size estimate below does not count — kept generous so a single pass's
  # built request rarely overshoots the window and forces an avoidable refuse.
  local overhead=4000
  [ -f "${PROJECT_DIR}/AGENTS.md" ] && overhead=$(( overhead + $(wc -c < "${PROJECT_DIR}/AGENTS.md" 2>/dev/null || echo 0) ))
  overhead=$(( overhead + ${#CONTEXT} ))
  local avail=$(( budget - overhead ))
  # Floor so a pass always has room for at least one reasonable file. Default
  # 20000 suits large-window reviewers (GLM); a small-window backend that
  # truncates real content at a low size (grok) lowers it via SC_MIN_PASS_AVAIL
  # so its passes stay inside its retention window instead of being forced large.
  local floor="${SC_MIN_PASS_AVAIL:-20000}"
  case "${floor}" in ''|*[!0-9]*) floor=20000 ;; esac
  [ "${avail}" -lt "${floor}" ] && avail="${floor}"

  [ "${overhead}" -gt "${budget}" ] && echo "sc: WARNING — AGENTS.md + context (${overhead}B) alone exceeds SC_MAX_CHARS (${budget}B); every pass will be refused with VERDICT: ERROR. Raise SC_MAX_CHARS or shrink AGENTS.md." >&2

  # Does this project have git? (used to count each file's diff toward its size).
  local has_git=0
  git -C "${PROJECT_DIR}" rev-parse --git-dir >/dev/null 2>&1 && has_git=1

  # Plan the passes (chunks land in SC_PLANNED_CHUNKS, one pass per element).
  _sc_plan_chunks "${avail}" "${has_git}"
  local n="${#SC_PLANNED_CHUNKS[@]}"

  # Common case: 0 or 1 chunk -> a single pass, exactly as before.
  if [ "${n}" -le 1 ]; then
    sc_build_request
    _sc_run_pass "${REQ}" "${RESP}" "${budget}" "${FILES[*]:-<none>}" "review"
    return 0
  fi

  # Multiple chunks -> one pass each, aggregated. (Delegated to keep this
  # entrypoint focused on planning vs. the per-pass orchestration.)
  _sc_run_multipass "${n}" "${budget}"
}
