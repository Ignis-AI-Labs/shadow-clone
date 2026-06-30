#!/usr/bin/env bash
#
# echo re-entrancy guard — keeps the review loop a clean, one-directional current.
#
# The Reviewer is read-only and must NEVER start another review. If it does (a
# reviewer that calls the bridge again, in either direction), two bad things happen:
# the loop recurses without end, and the second review blocks forever on the same
# per-project lock the first review already holds — a self-deadlock. That is the
# "windows lock up / sessions never close" symptom.
#
# Each bridge marks its subtree with SC_IN_REVIEW before invoking the reviewer.
# Any bridge that starts up already inside that subtree refuses immediately and
# emits a parseable `VERDICT: ERROR` on stdout, so the caller gets a clean answer
# instead of a hang.
#
# impure: reads the environment, writes to stdout (verdict) and stderr (warnings).

# sc_assert_not_reentrant WHO — refuse (return 1) if already inside a review.
# Prints an ERROR verdict to stdout so a nested caller parses a real result.
sc_assert_not_reentrant() {
  local who="$1"
  if [ -n "${SC_IN_REVIEW:-}" ]; then
    cat <<EOF
## Echo Review Refused (re-entrant)

A review is already in progress (SC_IN_REVIEW=${SC_IN_REVIEW}). "${who}" was invoked
from inside it. The Reviewer is read-only and must not start another review — this
guard prevents the reviewer-reviews-reviewer recursion and the per-project lock
self-deadlock. Nothing was run.

VERDICT: ERROR
EOF
    return 1
  fi
  return 0
}

# sc_mark_in_review WHO — claim the review for this subtree. Exported so every
# descendant process (the reviewer and anything it spawns) sees the marker.
sc_mark_in_review() {
  export SC_IN_REVIEW="${1}:$$"
}

# sc_assert_env_ident NAME VALUE — refuse (return 1) if VALUE contains
# anything other than ASCII alphanumerics, '.', '-', '_', or '/'. Closes
# AS-006 / AUDIT-027: SC_REVIEWER_MODEL, SC_REVIEWER_AGENT, SC_CLAUDE_MODEL
# flow straight into `opencode run --agent X --model Y` / `claude --model Y`
# argv. The CLIs treat the values as opaque strings, but a `~/.config/sc/config`
# attacker who can set `SC_REVIEWER_MODEL='--dangerous-flag foo'` could append
# CLI flags to the reviewer command line. Argv quoting on the bridge side
# prevents shell injection; this guard prevents flag injection. Whitespace,
# `=`, `;`, `$`, and `\` are all refused. Empty values are accepted (caller
# is expected to apply a default).
sc_assert_env_ident() {
  local name="$1" value="$2"
  [ -z "${value}" ] && return 0
  case "${value}" in
    *[!A-Za-z0-9._/-]*)
      echo "sc: ${name}=${value} contains unsupported characters; refusing." >&2
      echo "sc:   Allowed: ASCII alphanumeric, '.', '-', '_', '/'." >&2
      return 1
      ;;
  esac
  return 0
}

# sc_assert_project_dir DIR — refuse (return 1) if DIR is empty, `/`, or
# `${HOME}` itself. Closes AS-009 / AUDIT-027 (PROJECT_DIR=/ edge case):
# build-request.sh's containment check rejects files outside ${PROJECT_DIR},
# so a `/` root means every absolute path on the system passes confinement.
# A `${HOME}` root is similarly far too permissive. The bridge is meant to
# operate on a single project tree.
sc_assert_project_dir() {
  local dir="$1"
  if [ -z "${dir}" ] || [ "${dir}" = "/" ]; then
    echo "sc: refusing to run with PROJECT_DIR='${dir}' — must be a project subdirectory." >&2
    return 1
  fi
  if [ -n "${HOME:-}" ] && [ "${dir}" = "${HOME}" ]; then
    echo "sc: refusing to run with PROJECT_DIR='${HOME}' (your home directory)." >&2
    echo "sc:   Run the bridge from inside a specific project tree." >&2
    return 1
  fi
  return 0
}
