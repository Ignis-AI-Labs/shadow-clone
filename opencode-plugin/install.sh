#!/usr/bin/env bash
#
# Install the Shadow Clone OpenCode plugin into OpenCode's global plugin directory.
#
# Why a copy and not a symlink: OpenCode resolves the plugin's
# `@opencode-ai/plugin` import relative to the file's REAL path. That package is
# installed under ~/.config/opencode/node_modules, so the plugin file must live in
# ~/.config/opencode/plugin/ — a symlink whose target is elsewhere (e.g. this repo)
# resolves the import from the wrong tree and silently fails to load.
#
# Re-run this after editing echo.js.

set -euo pipefail

readonly HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PLUGIN_DIR="${HOME}/.config/opencode/plugin"
readonly COMMAND_DIR="${HOME}/.config/opencode/command"

mkdir -p "${PLUGIN_DIR}" "${COMMAND_DIR}"
cp "${HERE}/echo.js" "${PLUGIN_DIR}/echo.js"
cp "${HERE}/command/echo.md" "${COMMAND_DIR}/echo.md"

echo "sc: installed tool   -> ${PLUGIN_DIR}/echo.js"
echo "sc: installed command -> ${COMMAND_DIR}/echo.md"
echo "sc: run /echo inside an OpenCode session to activate paired-review mode."
