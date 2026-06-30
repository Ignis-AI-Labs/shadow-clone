#!/usr/bin/env bash
#
# echo graceful-shutdown reaper — runs the reviewer inside its OWN process group and
# guarantees that, on timeout or when the bridge itself is interrupted, the ENTIRE
# subtree dies. This is what stops orphaned `opencode`/`claude` (and their model
# clients) from surviving a killed review and piling up.
#
# Why this exists: `timeout -k N CMD` signals only CMD, not the children CMD spawns,
# so a wedged reviewer leaks a tree of descendants. Here CMD is started under
# `setsid` (a fresh session ⇒ its PID is the process-group id), so a single
# `kill -SIG -PGID` reaps the whole group. Where `setsid` is unavailable, we walk and
# signal descendants explicitly.
#
# impure: spawns subprocesses, installs signal traps, sends signals.

# _sc_signal_tree ROOT_PID GROUPED SIGNAL — signal a whole process subtree.
#   GROUPED=1 ⇒ ROOT_PID is a process-group leader; signal the group directly.
#   GROUPED=0 ⇒ no setsid; recurse children-first, then the root.
_sc_signal_tree() {
  local root="$1" grouped="$2" sig="$3"
  if [ "${grouped}" = 1 ]; then
    kill -"${sig}" -- -"${root}" 2>/dev/null || true
    return 0
  fi
  _sc_kill_descendants "${root}" "${sig}"
  kill -"${sig}" "${root}" 2>/dev/null || true
}

# _sc_kill_descendants PARENT_PID SIGNAL — signal every descendant, deepest first,
# so a parent can't re-spawn a child we already reaped. Fallback path only.
_sc_kill_descendants() {
  local parent="$1" sig="$2" child
  for child in $(pgrep -P "${parent}" 2>/dev/null || true); do
    _sc_kill_descendants "${child}" "${sig}"
    kill -"${sig}" "${child}" 2>/dev/null || true
  done
}

# sc_run_reaped TIMEOUT GRACE STDIN OUT ERR -- CMD [ARGS...]
#   Run CMD with stdin<STDIN, stdout>OUT, stderr>ERR, bounded by TIMEOUT seconds.
#   On expiry the whole process group gets SIGTERM, then SIGKILL after GRACE seconds.
#   If the bridge receives INT/TERM while CMD runs, CMD's group is taken down too.
#   Returns CMD's exit status, or 124 on timeout — matching GNU `timeout`'s contract
#   so callers can treat 124 as "timed out".
sc_run_reaped() {
  local timeout_s="$1" grace="$2" stdin_f="$3" out_f="$4" err_f="$5"; shift 5
  [ "${1:-}" = "--" ] && shift
  local -a cmd=( "$@" )

  local grouped=0
  command -v setsid >/dev/null 2>&1 && grouped=1

  local fired="${out_f}.timedout"
  rm -f "${fired}"

  local pid
  if [ "${grouped}" = 1 ]; then
    setsid "${cmd[@]}" < "${stdin_f}" > "${out_f}" 2>"${err_f}" &
    pid=$!
  else
    "${cmd[@]}" < "${stdin_f}" > "${out_f}" 2>"${err_f}" &
    pid=$!
  fi

  # Watchdog: after TIMEOUT, mark the timeout then escalate TERM → KILL on the group.
  (
    sleep "${timeout_s}" 2>/dev/null || exit 0
    : > "${fired}"
    _sc_signal_tree "${pid}" "${grouped}" TERM
    sleep "${grace}" 2>/dev/null || true
    _sc_signal_tree "${pid}" "${grouped}" KILL
  ) &
  local wd=$!

  # If the bridge is interrupted, take the reviewer group and the watchdog with us.
  trap '_sc_signal_tree "'"${pid}"'" "'"${grouped}"'" TERM; kill "'"${wd}"'" 2>/dev/null || true' INT TERM

  local rc=0
  wait "${pid}" || rc=$?

  # CMD returned — cancel the watchdog and restore default signal handling.
  kill "${wd}" 2>/dev/null || true
  wait "${wd}" 2>/dev/null || true
  trap - INT TERM

  if [ -f "${fired}" ]; then rc=124; fi
  rm -f "${fired}"
  return "${rc}"
}
