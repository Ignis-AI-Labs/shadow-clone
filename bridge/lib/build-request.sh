#!/usr/bin/env bash
#
# echo shared request builder — the single source of truth for what the Reviewer
# sees, in BOTH directions. Sourced by ask-glm.sh and ask-claude.sh so the
# security-critical file-containment filter can never drift between them.
#
# impure: reads git state and files, writes the request file.
#
# Contract: the caller must have set CONTEXT, FILES (array), PROJECT_DIR, and REQ
# before calling sc_build_request.

# Echo a backtick fence longer than the longest backtick run in the content (min 3),
# so content that itself contains ``` can't break the surrounding markdown fence.
# Reads file "$1", or stdin when "$1" is "-". set -e safe (no-match grep is tolerated).
sc_fence() {
  local longest src="${1:--}"
  if [ "${src}" = "-" ]; then
    longest="$( { grep -oE '`+' || true; } | awk '{ if (length > m) m = length } END { print m + 0 }' )"
  else
    longest="$( { grep -oE '`+' "${src}" 2>/dev/null || true; } | awk '{ if (length > m) m = length } END { print m + 0 }' )"
  fi
  [ -z "${longest}" ] && longest=0
  local n=$(( longest + 1 ))
  [ "${n}" -lt 3 ] && n=3
  printf '%*s' "${n}" '' | tr ' ' '`'
}

# Assemble the review request at "${REQ}".
sc_build_request() {
  # A missing law means a degraded, near-useless review. Warn the human loudly
  # rather than failing silently (Rule 3: no silent failures).
  if [ ! -f "${PROJECT_DIR}/AGENTS.md" ]; then
    echo "sc: WARNING — no AGENTS.md at ${PROJECT_DIR}. Reviewing without a project law." >&2
    echo "sc:           Run 'bash ~/.sc/sc-init.sh' to scaffold one." >&2
  fi
  {
    echo "# Echo Review Request"
    echo
    echo "## Builder context (what was done and why)"
    echo
    echo "${CONTEXT}"
    echo

    if git -C "${PROJECT_DIR}" rev-parse --git-dir >/dev/null 2>&1; then
      local diff
      if [ "${#FILES[@]}" -gt 0 ]; then
        # Scope the diff to the files under review (keeps each chunked pass focused
        # and within budget).
        diff="$(git -C "${PROJECT_DIR}" --no-pager diff HEAD -- "${FILES[@]}" 2>/dev/null || true)"
      else
        diff="$(git -C "${PROJECT_DIR}" --no-pager diff HEAD 2>/dev/null || true)"
      fi
      if [ -n "${diff}" ]; then
        local dfence; dfence="$(printf '%s' "${diff}" | sc_fence -)"
        echo "## Git diff (uncommitted, vs HEAD)"
        echo
        echo "${dfence}diff"
        echo "${diff}"
        echo "${dfence}"
        echo
      fi
    fi

    if [ "${#FILES[@]}" -gt 0 ]; then
      echo "## Files under review (full contents)"
      local f rp fence abs
      for f in "${FILES[@]}"; do
        echo
        echo "### ${f}"
        # Untrusted input (Rule 8): the file list comes from the agent. Only read
        # files inside the project root, so a confused or prompt-injected agent
        # can't exfiltrate secrets (e.g. ~/.ssh/id_rsa, .env) to the reviewer model.
        # Resolve relative paths against PROJECT_DIR (not the caller's cwd) so files
        # are found and containment-checked consistently regardless of cwd.
        abs="${f}"
        case "${f}" in /*) : ;; *) abs="${PROJECT_DIR}/${f}" ;; esac
        rp="$(realpath -m -- "${abs}" 2>/dev/null || true)"
        [ -n "${rp}" ] || rp="${abs}"
        case "${rp}" in
          "${PROJECT_DIR}"|"${PROJECT_DIR}"/*) : ;;
          *) echo "_(skipped, outside project root: ${f})_"; continue ;;
        esac
        if [ -f "${rp}" ]; then
          fence="$(sc_fence "${rp}")"
          echo "${fence}"
          cat "${rp}"
          echo "${fence}"
        else
          echo "_(file not found: ${f})_"
        fi
      done
      echo
    fi

    if [ -f "${PROJECT_DIR}/AGENTS.md" ]; then
      echo "## Standard to judge against (AGENTS.md)"
      echo
      local afence; afence="$(sc_fence "${PROJECT_DIR}/AGENTS.md")"
      echo "${afence}markdown"
      cat "${PROJECT_DIR}/AGENTS.md"
      echo "${afence}"
    else
      echo "## ⚠ No AGENTS.md at the project root"
      echo
      echo "No project law was provided. Review against sound general engineering"
      echo "practice, and raise the missing AGENTS.md as a finding so the user can"
      echo "scaffold one with \`bash ~/.sc/sc-init.sh\`."
    fi
  } > "${REQ}"
}
