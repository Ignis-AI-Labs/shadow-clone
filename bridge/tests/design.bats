#!/usr/bin/env bats
#
# Design is a clean component of Shadow Clone: the protocol carries the Ignis
# DESIGN standard, every mode's Core list cites it, /sc writes it into the
# generated AGENTS.md as Rule 10, and the installer deploys it.

setup() {
  REPO="$(cd "${BATS_TEST_DIRNAME}/../.." && pwd)"
  PROTOCOL="${REPO}/protocols/Design Protocol.md"
}

@test "the Design Protocol carries the three glossed principles and the less-to-read rule" {
  for term in 'SHINKEI 真計' 'JŌHŌ SEKKEI 情報設計' 'CHOKKAN 直感' \
    '**Less to read, same information**' 'Density is never decoration.' 'the stranger test'; do
    grep -qF -- "${term}" "${PROTOCOL}"
  done
}

@test "the Design Protocol is the canonical DESIGN.md, verbatim, when coding-standards sits beside this repo" {
  canonical="${REPO}/../coding-standards/standards/DESIGN.md"
  [ -f "${canonical}" ] || skip "no sibling coding-standards checkout to compare against"
  diff <(sed '1s/^# /## /' "${canonical}") <(sed -n '/^## Design — /,$p' "${PROTOCOL}")
}

@test "every mode with a Core list cites the Design Protocol inside it" {
  checked=0
  for file in "${REPO}"/commands/sc*.md "${REPO}"/kimi/skills/*/SKILL.md; do
    grep -qF '**Core (always apply):**' "${file}" || continue
    awk '/^\*\*Core \(always apply\):\*\*/ { core = 1; next }
         core && /^- / { print; listed = 1; next }
         core && listed && /^$/ { exit }' "${file}" | grep -qF 'Design Protocol.md' \
      || { echo "missing from Core: ${file}"; return 1; }
    checked=$((checked + 1))
  done
  [ "${checked}" -ge 22 ]
}

@test "/sc writes Design into the generated AGENTS.md as Rule 10" {
  for file in "${REPO}/commands/sc.md" "${REPO}/kimi/skills/sc/SKILL.md"; do
    grep -qF 'Rules section structure: 10 rules' "${file}"
    grep -qF 'Rule 10 (Design)' "${file}"
    grep -qF 'Rule 10 being Design' "${file}"
  done
}

@test "the AGENTS.md template carries Rule 10 and points at the deployed protocol" {
  grep -qxF '## RULE 10: DESIGN' "${REPO}/bridge/templates/AGENTS.md"
  grep -qF '~/.claude/sc/protocols/Design Protocol.md' "${REPO}/bridge/templates/AGENTS.md"
}

@test "the installer deploys the Design Protocol byte for byte" {
  home="${BATS_TEST_TMPDIR}/home"
  mkdir -p "${home}"
  run env HOME="${home}" bash "${REPO}/bridge/install.sh"
  [ "${status}" -eq 0 ]
  cmp "${PROTOCOL}" "${home}/.claude/sc/protocols/Design Protocol.md"
}
