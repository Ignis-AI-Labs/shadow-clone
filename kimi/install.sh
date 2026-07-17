#!/usr/bin/env bash
#
# Install the Shadow Clone Kimi skills into Kimi Code CLI's user skill directory.
#
# Why a copy and not a symlink: a copy is what every other Shadow Clone installer
# does (bridge/install.sh, opencode-plugin/install.sh) — the deployed files keep
# working when the clone moves or is deleted, and modes/ownership stay explicit.
#
# Target: ${KIMI_CODE_HOME:-~/.kimi-code}/skills/<name>/SKILL.md — the directory
# form of a Kimi skill, invoked in a Kimi session as /skill:<name>.
#
# Re-run this after editing anything under kimi/skills/. Note: the loop below
# only creates or overwrites destination entries — renaming or deleting a skill
# in the repo does NOT prune the deployed copy; remove it from the destination
# manually. The bridge itself (ask-*.sh, protocols, reviewer persona) is
# deployed separately by bridge/install.sh — both are needed for
# /skill:sc-echo to work.

set -euo pipefail
umask 077

readonly HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SKILLS_SRC="${HERE}/skills"

# Refuse a degenerate destination (empty or root HOME would scatter skills
# somewhere nonsensical). Guard BEFORE HOME is dereferenced (set -u would
# abort on the expansion otherwise), and skip it entirely when KIMI_CODE_HOME
# is set — then HOME is never used.
if [ -n "${KIMI_CODE_HOME:-}" ]; then
  readonly SKILLS_DST="${KIMI_CODE_HOME}/skills"
else
  if [ -z "${HOME:-}" ] || [ "${HOME}" = "/" ]; then
    echo "sc: refusing to install: HOME is unset or '/'." >&2
    exit 1
  fi
  readonly SKILLS_DST="${HOME}/.kimi-code/skills"
fi

install -m 0755 -d "${SKILLS_DST}"

count=0
for skill_dir in "${SKILLS_SRC}"/*/; do
  [ -f "${skill_dir}/SKILL.md" ] || continue
  name="$(basename "${skill_dir}")"
  install -m 0755 -d "${SKILLS_DST}/${name}"
  install -m 0644 "${skill_dir}/SKILL.md" "${SKILLS_DST}/${name}/SKILL.md"
  echo "sc: installed skill -> ${SKILLS_DST}/${name}/SKILL.md"
  count=$((count + 1))
done

if [ "${count}" -eq 0 ]; then
  echo "sc: no skills found under ${SKILLS_SRC} — nothing installed." >&2
  exit 1
fi

echo "sc: ${count} skill(s) installed. Invoke them in a Kimi session as /skill:<name> (e.g. /skill:sc-echo)."
echo "sc: verify the full install with: bash \"${HERE}/../scripts/sc-doctor.sh\""
