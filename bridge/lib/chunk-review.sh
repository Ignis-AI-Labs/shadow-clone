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
# impure: builds requests, invokes the reviewer (via the bridge-provided
# sc_invoke_one), writes the response file.
#
# Contract: the caller must have set CONTEXT, FILES (array), PROJECT_DIR,
# EXCHANGE_DIR, STAMP, REQ, RESP, and must define a function:
#   sc_invoke_one REQ_PATH RESP_PATH   # run the reviewer on REQ_PATH -> RESP_PATH
#
# Tunable:
#   SC_MAX_CHARS   approx max request size per pass in bytes (default 200000)

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

# sc_echo_review: build + invoke, chunking by SC_MAX_CHARS when needed. Writes RESP.
sc_echo_review() {
  local budget="${SC_MAX_CHARS:-200000}"

  # Fixed per-request overhead: AGENTS.md + the context note + markup slack.
  local overhead=2000
  [ -f "${PROJECT_DIR}/AGENTS.md" ] && overhead=$(( overhead + $(wc -c < "${PROJECT_DIR}/AGENTS.md" 2>/dev/null || echo 0) ))
  overhead=$(( overhead + ${#CONTEXT} ))
  local avail=$(( budget - overhead ))
  [ "${avail}" -lt 20000 ] && avail=20000   # always leave room for at least one file

  [ "${overhead}" -gt "${budget}" ] && echo "sc: WARNING — AGENTS.md + context (${overhead}B) alone exceeds SC_MAX_CHARS (${budget}B); passes may still exceed the model window." >&2

  # Does this project have git? (used to count each file's diff toward its size).
  local has_git=0
  git -C "${PROJECT_DIR}" rev-parse --git-dir >/dev/null 2>&1 && has_git=1

  # Plan: greedily pack files so each pass's file bytes stay under "avail".
  # Chunks are stored one-per-array-element, files newline-separated within. A file's
  # size counts its contents AND its scoped diff (the request carries both), so the
  # budget reflects the real per-pass payload.
  local -a chunks=()
  local cur="" cur_bytes=0 f sz
  local i=0
  while [ "${i}" -lt "${#FILES[@]}" ]; do
    f="${FILES[$i]}"; i=$(( i + 1 ))
    # Resolve relative paths against PROJECT_DIR so the size check is correct
    # regardless of the caller's cwd (build-request.sh resolves the same way).
    local fp="${f}"
    case "${f}" in /*) : ;; *) fp="${PROJECT_DIR}/${f}" ;; esac
    sz=0
    if [ -f "${fp}" ]; then sz=$(wc -c < "${fp}" 2>/dev/null || echo 0); fi
    if [ "${has_git}" = 1 ]; then
      sz=$(( sz + $( { git -C "${PROJECT_DIR}" --no-pager diff HEAD -- "${f}" 2>/dev/null || true; } | wc -c ) ))
    fi
    if [ "${sz}" -gt "${avail}" ] && [ -n "${cur}" ]; then
      chunks+=( "${cur}" ); cur=""; cur_bytes=0
    fi
    if [ -n "${cur}" ] && [ $(( cur_bytes + sz )) -gt "${avail}" ]; then
      chunks+=( "${cur}" ); cur=""; cur_bytes=0
    fi
    [ "${sz}" -gt "${avail}" ] && echo "sc: WARNING — '${f}' (${sz}B) exceeds the per-pass budget (${avail}B); reviewing it alone (it may still exceed the model window)." >&2
    cur+="${f}"$'\n'; cur_bytes=$(( cur_bytes + sz ))
  done
  [ -n "${cur}" ] && chunks+=( "${cur}" )

  local n="${#chunks[@]}"

  # Common case: 0 or 1 chunk -> a single pass, exactly as before.
  if [ "${n}" -le 1 ]; then
    sc_build_request
    sc_invoke_one "${REQ}" "${RESP}" || true
    grep -qE '^VERDICT:' "${RESP}" 2>/dev/null || printf '\nVERDICT: ERROR\n' >> "${RESP}"
    return 0
  fi

  echo "sc: review payload is large — splitting into ${n} passes so the reviewer sees every file in full." >&2

  local orig_context="${CONTEXT}"
  : > "${RESP}"
  local -a verdicts=()
  local k=0 chunkstr line v presp
  for chunkstr in "${chunks[@]}"; do
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
    [ "$(wc -c < "${REQ}" 2>/dev/null || echo 0)" -gt "${budget}" ] && echo "sc: WARNING — part ${k} request still exceeds SC_MAX_CHARS; the model may truncate it." >&2
    sc_invoke_one "${REQ}" "${presp}" || true
    grep -qE '^VERDICT:' "${presp}" 2>/dev/null || printf '\nVERDICT: ERROR\n' >> "${presp}"
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
