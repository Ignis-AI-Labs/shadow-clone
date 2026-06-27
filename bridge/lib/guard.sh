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
# impure: reads the environment, writes to stdout.

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
