#!/usr/bin/env bash
#
# sc-update.sh — pull the latest Shadow Clone source, re-run the bridge
# installer, and re-verify the install. Works from any working directory
# because it resolves its own location to find the repo root.
#
# Usage:
#   bash scripts/sc-update.sh                   # from inside the repo
#   bash ~/path/to/shadow-clone/scripts/sc-update.sh   # from anywhere
#
# Exit codes:
#   0  — update completed, all checks passed
#   1  — git pull, install, or doctor failed; details on stderr
#
# impure: runs git, runs subprocesses, writes to ${HOME}/.claude/.

set -euo pipefail

# Resolve repo root from this script's location.
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${HERE}/.." && pwd)"

# Sanity: this script must live in <repo>/scripts/, and the bridge
# installer must be at <repo>/bridge/install.sh. If either is missing,
# the user is running a stale or corrupted clone — bail with a useful
# message rather than mutating their install.
if [ ! -f "${REPO_ROOT}/bridge/install.sh" ]; then
  echo "sc-update: ERROR — ${REPO_ROOT}/bridge/install.sh not found." >&2
  echo "sc-update:   This script must be run from a checkout of" >&2
  echo "sc-update:   github.com/Ignis-AI-Labs/shadow-clone." >&2
  exit 1
fi

cd "${REPO_ROOT}"

# Step 1 — refuse to update over uncommitted local changes. If the user
# has modified files in their clone (intentional or accidental),
# overwriting them silently is the wrong move.
if [ -n "$(git status --porcelain 2>/dev/null || true)" ]; then
  echo "sc-update: ERROR — uncommitted changes in ${REPO_ROOT}." >&2
  echo "sc-update:   Either commit them, stash them, or discard them:" >&2
  echo "sc-update:     git stash      # keep them for later" >&2
  echo "sc-update:     git checkout . # discard them" >&2
  echo "sc-update:   then re-run sc-update.sh." >&2
  exit 1
fi

# Step 2 — git fetch + fast-forward to whatever the user is tracking.
# `--ff-only` refuses divergent history rather than auto-merging — if
# the user's tracking branch has diverged from upstream, that's a real
# situation they need to look at.
current_branch="$(git rev-parse --abbrev-ref HEAD)"
echo "sc-update: pulling latest on ${current_branch} ..."
if ! git pull --ff-only; then
  echo "sc-update: ERROR — git pull --ff-only failed." >&2
  echo "sc-update:   Your branch may have diverged from upstream, or you" >&2
  echo "sc-update:   may not have network access. Resolve manually then" >&2
  echo "sc-update:   re-run sc-update.sh." >&2
  exit 1
fi

# Step 3 — re-deploy the bridge, commands, protocols, reviewer agent.
echo "sc-update: re-running bridge/install.sh ..."
bash "${REPO_ROOT}/bridge/install.sh"

# Step 4 — verify the install is healthy. Doctor exits non-zero on
# any failed check, which propagates through our `set -e`.
echo "sc-update: running scripts/sc-doctor.sh ..."
bash "${REPO_ROOT}/scripts/sc-doctor.sh"

echo
echo "sc-update: ✅ done. Shadow Clone updated to $(git describe --tags --always 2>/dev/null || git rev-parse --short HEAD)."
