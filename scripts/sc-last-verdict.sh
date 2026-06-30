#!/usr/bin/env bash
#
# sc-last-verdict — print the verdict line from the most recent echo review in
# this repository's exchange log.
#
# Why: after a review loop, a human (or another script) often wants the bottom
# line — APPROVE / REVISE / BLOCK — without opening the full response file.
#
# impure: reads the filesystem (.sc/exchange). All IO is isolated in this script;
# no pure logic is mixed in.
#
# Usage: scripts/sc-last-verdict.sh

set -euo pipefail

# Resolve the exchange dir relative to this script's location (repo_root/.sc),
# so the helper works regardless of the caller's working directory.
readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
readonly EXCHANGE_DIR="${REPO_ROOT}/.sc/exchange"

if [ ! -d "${EXCHANGE_DIR}" ]; then
  echo "sc: no exchange directory at ${EXCHANGE_DIR}; run a review first." >&2
  exit 1
fi

# Response files are named with sortable timestamps, so the newest is last.
LATEST="$(find "${EXCHANGE_DIR}" -maxdepth 1 -name '*-response.md' -type f \
  | sort \
  | tail -n 1)"

if [ -z "${LATEST}" ]; then
  echo "sc: no review responses found in ${EXCHANGE_DIR}." >&2
  exit 1
fi

VERDICT="$(grep -E '^VERDICT:' "${LATEST}" | tail -n 1 || true)"

if [ -z "${VERDICT}" ]; then
  echo "sc: latest response (${LATEST}) contains no VERDICT line." >&2
  exit 1
fi

# Bare verdict on stdout so downstream parsers get a clean `VERDICT: <value>` line;
# the source path goes to stderr as human context.
echo "${VERDICT}"
echo "  source: ${LATEST}" >&2
