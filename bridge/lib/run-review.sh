#!/usr/bin/env bash
#
# echo shared reviewer runner — the single source of truth for HOW a review is
# invoked, so both bridges behave identically under load:
#   - run inside its own process group and reaped on timeout (no orphans — see reap.sh),
#   - bounded by a per-attempt timeout (a hang can never be permanent),
#   - retried on timeout/transient failure,
#   - serialized PER PROJECT so two reviews in the same repo queue cleanly while
#     different repos run fully in parallel,
#   - degraded gracefully to a parseable `VERDICT: ERROR` instead of hanging.
#
# impure: runs subprocesses, takes a per-project flock, writes the response file.
#
# Tunables (env or ~/.config/sc/config):
#   SC_TIMEOUT       seconds per attempt                 (default 300)
#   SC_KILL_GRACE    seconds between TERM and KILL        (default 10)
#   SC_RETRIES       extra attempts after the first       (default 1)
#   SC_RETRY_DELAY   seconds between attempts             (default 3)
#   SC_SERIALIZE     project | global | off               (default project)
#   SC_LOCK_DIR      dir holding per-project lock files   (default ${XDG_RUNTIME_DIR:-~/.cache/sc}/sc/locks)
#   SC_LOCK_TIMEOUT  max seconds to wait for the lock      (default 900)
#
# Depends on sc_run_reaped (lib/reap.sh); the bridge sources reap.sh first.

# _sc_lock_dir_safe DIR — return 0 iff DIR (or its nearest existing
# ancestor) is owned by the current uid AND its other-write bit is clear.
# Closes AUDIT-015 / IS-004 (CWE-59 + CWE-426): without this, a user who
# sets SC_LOCK_DIR to a sticky-bit-only path like /tmp/sc/locks gives a
# co-located unprivileged process the chance to plant a symlink at the
# lock filename and have `exec 9>"${lock}"` truncate-open the symlink
# target. Refusing the dir and falling back to ${HOME}/.cache/sc/sc/locks
# eliminates the surface.
#
# stat(1) varies between coreutils (-c) and BSD (-f); on systems where
# `stat -c` is unavailable we skip the check rather than block the bridge.
_sc_lock_dir_safe() {
  local dir="$1"
  local parent="${dir}"
  # Walk to nearest existing ancestor.
  while [ ! -e "${parent}" ]; do
    local up; up="$(dirname -- "${parent}")"
    [ "${up}" = "${parent}" ] && return 1
    parent="${up}"
  done
  local uid; uid="$(id -u)"
  local owner mode
  owner="$(stat -c '%u' "${parent}" 2>/dev/null)" || return 0
  mode="$(stat -c '%a' "${parent}" 2>/dev/null)" || return 0
  [ "${owner}" = "${uid}" ] || return 1
  # Last digit of the octal mode is the other-perms triplet; bit 2 = world-write.
  case "${mode: -1}" in
    2|3|6|7) return 1 ;;
  esac
  return 0
}

# _sc_lock_path SERIALIZE LOCK_DIR PROJECT — resolve the lock file for the mode.
# Empty output means "no lock" (serialize=off). The per-project key is derived from
# the project's physical path so each repo gets its own queue.
_sc_lock_path() {
  local mode="$1" dir="$2" project="$3"
  case "${mode}" in
    off)    : ;;
    global) printf '%s/global.lock' "${dir}" ;;
    project|*)
      local key
      key="$(printf '%s' "${project}" | cksum | awk '{print $1}')"
      printf '%s/project-%s.lock' "${dir}" "${key}"
      ;;
  esac
}

# sc_invoke_reviewer RESP STDIN_FILE -- CMD [ARGS...]
#   Runs CMD reaped and bounded, optionally behind a per-project lock, with retries.
#   Always returns 0; RESP always ends with a parseable VERDICT line.
sc_invoke_reviewer() {
  local resp="$1" stdin_file="$2"; shift 2
  [ "${1:-}" = "--" ] && shift
  local -a cmd=( "$@" )

  local timeout_s="${SC_TIMEOUT:-300}"
  local grace="${SC_KILL_GRACE:-10}"
  local retries="${SC_RETRIES:-1}"
  local delay="${SC_RETRY_DELAY:-3}"
  local serialize="${SC_SERIALIZE:-project}"
  local lock_timeout="${SC_LOCK_TIMEOUT:-900}"
  # Keep locks in a user-private dir (Rule 8): a shared /tmp path could be a planted
  # symlink that `exec 9>` would follow and truncate.
  local lock_dir="${SC_LOCK_DIR:-${XDG_RUNTIME_DIR:-${HOME}/.cache/sc}/sc/locks}"
  local fallback_lock_dir="${HOME}/.cache/sc/sc/locks"

  # AUDIT-015 / IS-004: refuse a lock dir whose parent isn't user-private.
  # Fall back to the canonical user-private path and warn once per run.
  if ! _sc_lock_dir_safe "${lock_dir}"; then
    if [ "${lock_dir}" != "${fallback_lock_dir}" ]; then
      echo "sc: SC_LOCK_DIR (${lock_dir}) is not user-private; falling back to ${fallback_lock_dir}." >&2
      lock_dir="${fallback_lock_dir}"
    fi
  fi

  local lock
  lock="$(_sc_lock_path "${serialize}" "${lock_dir}" "${PROJECT_DIR:-${PWD}}")"

  if [ -n "${lock}" ]; then
    if command -v flock >/dev/null 2>&1; then
      mkdir -p "${lock_dir}" 2>/dev/null || true
    else
      echo "sc: 'flock' not found; reviews run without serialization (install util-linux)." >&2
      lock=""
    fi
  fi

  local err="${resp}.err"
  local attempt=0 rc=0 reason=""
  while : ; do
    attempt=$((attempt + 1))
    reason=""; rc=0

    if [ -n "${lock}" ]; then
      # fd 9 is held by THIS shell, so reaping the reviewer still releases the lock,
      # and a wedged review can't block its repo's queue past SC_TIMEOUT.
      exec 9>"${lock}"
      if flock -w "${lock_timeout}" 9; then
        sc_run_reaped "${timeout_s}" "${grace}" "${stdin_file}" "${resp}" "${err}" -- "${cmd[@]}" || rc=$?
        flock -u 9
      else
        rc=200; reason="could not acquire the ${serialize} review lock within ${lock_timeout}s"
      fi
      exec 9>&-
    else
      sc_run_reaped "${timeout_s}" "${grace}" "${stdin_file}" "${resp}" "${err}" -- "${cmd[@]}" || rc=$?
    fi

    if [ "${rc}" -eq 0 ]; then rm -f "${err}"; return 0; fi

    if [ "${rc}" -eq 124 ]; then
      reason="reviewer timed out after ${timeout_s}s (process group reaped)"
    elif [ "${rc}" -eq 200 ]; then
      : # reason already set; lock contention is not worth retrying
    else
      reason="reviewer exited with code ${rc}: $(head -c 400 "${err}" 2>/dev/null | tr '\n' ' ')"
    fi
    rm -f "${err}"

    # A lock-wait timeout won't fix itself on retry — fail fast.
    [ "${rc}" -eq 200 ] && break
    [ "${attempt}" -gt "${retries}" ] && break
    sleep "${delay}"
  done

  # Graceful degradation: never hang. Emit a parseable ERROR review.
  {
    echo "## Echo Review Unavailable"
    echo
    echo "The review could not be completed after ${attempt} attempt(s): ${reason}."
    echo
    echo "This is an echo bridge error, not a verdict on the code. The work was NOT"
    echo "reviewed — do not treat it as approved."
    echo
    echo "VERDICT: ERROR"
  } > "${resp}"
  return 0
}
