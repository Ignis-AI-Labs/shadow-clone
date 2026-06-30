---
description: Update Shadow Clone to the latest release — detects what's installed, compares against the latest tag, and walks the user through the update for their install path.
---

You are helping the user update their Shadow Clone install. There are
two install paths and they update differently. Your job is to figure
out which one the user is on and emit the matching instructions.

## Step 1 — Detect install path + current version

Run this exact check via the **Bash** tool:

```bash
SOURCE_FILE="${HOME}/.claude/sc/install-source"
if [ -f "${SOURCE_FILE}" ]; then
  SRC="$(cat "${SOURCE_FILE}")"
  if [ -d "${SRC}/.git" ]; then
    CURRENT="$(git -C "${SRC}" describe --tags --always 2>/dev/null || echo unknown)"
    echo "INSTALL_PATH=source"
    echo "INSTALL_SOURCE=${SRC}"
    echo "CURRENT_VERSION=${CURRENT}"
  else
    echo "INSTALL_PATH=source-broken"
    echo "INSTALL_SOURCE=${SRC}"
    echo "CURRENT_VERSION=unknown"
  fi
else
  echo "INSTALL_PATH=plugin-or-none"
  echo "INSTALL_SOURCE="
  echo "CURRENT_VERSION=unknown"
fi
LATEST="$(curl -fsSL https://api.github.com/repos/Ignis-AI-Labs/shadow-clone/releases/latest 2>/dev/null | grep -E '^\s*"tag_name"' | head -1 | sed -E 's/.*"tag_name": *"([^"]+)".*/\1/')"
echo "LATEST_VERSION=${LATEST:-unknown}"
```

Parse the five `KEY=value` lines into a state map.

## Step 2 — Decide what to tell the user

Match the state and emit the matching message verbatim, then **stop**.

### A. Source install, already on latest (`INSTALL_PATH=source` and `CURRENT_VERSION` equals `LATEST_VERSION`)

> ✅ You're on the latest release (`<CURRENT_VERSION>`).
>
> Source clone at `<INSTALL_SOURCE>`.
>
> No action needed. If you want to re-deploy anyway (e.g. you suspect
> something on disk is out of sync), run:
>
> ```bash
> bash <INSTALL_SOURCE>/scripts/sc-update.sh
> ```

### B. Source install, update available (`INSTALL_PATH=source` and versions differ)

> 🆕 An update is available.
>
> - Installed: `<CURRENT_VERSION>` at `<INSTALL_SOURCE>`
> - Latest: `<LATEST_VERSION>`
>
> Run this in the terminal to update:
>
> ```bash
> bash <INSTALL_SOURCE>/scripts/sc-update.sh
> ```
>
> The script does three things in order: `git pull --ff-only`,
> re-runs `bridge/install.sh`, re-runs `scripts/sc-doctor.sh`. It
> refuses to overwrite uncommitted local changes — if you've edited
> files in the clone, it'll tell you to commit/stash/discard first.

### C. Source install marker present but the clone is gone or unreadable (`INSTALL_PATH=source-broken`)

> ⚠ Shadow Clone says it was installed from a source clone at
> `<INSTALL_SOURCE>`, but that path is no longer a git repo (the
> `.git` directory is missing).
>
> Either you moved or deleted the clone after installing. To update,
> re-clone it somewhere and run the installer again:
>
> ```bash
> git clone --depth 1 --branch <LATEST_VERSION> https://github.com/Ignis-AI-Labs/shadow-clone.git
> cd shadow-clone
> bash bridge/install.sh
> bash scripts/sc-doctor.sh
> ```
>
> That will overwrite the install-source marker with the new location.

### D. Plugin install or no install marker (`INSTALL_PATH=plugin-or-none`)

> Your install doesn't have a source-clone marker on disk. This means
> one of two things:
>
> **(i)** You installed via the Claude Code plugin (`/plugin install
> shadow-clone@ignis-labs`). To update, use Claude Code's plugin
> system:
>
> ```
> /plugin update shadow-clone@ignis-labs
> ```
>
> Note: the plugin-only install gives you the slash commands but not
> the bridge scripts or the protocols. For `/sc-echo` paired review
> you also need the source-clone install — see the latest release at
> <https://github.com/Ignis-AI-Labs/shadow-clone/releases/latest>.
>
> **(ii)** You installed manually before the install-source marker
> was added (Shadow Clone < v0.2.9). In that case, `cd` into your
> existing clone and run:
>
> ```bash
> cd /path/to/your/shadow-clone-clone
> bash scripts/sc-update.sh
> ```
>
> Latest release: `<LATEST_VERSION>`.

### E. Latest version unknown (`LATEST_VERSION=unknown`)

> ⚠ Couldn't reach the GitHub API to check the latest version. This
> is usually a network or rate-limit issue.
>
> Your installed version: `<CURRENT_VERSION>`.
> Source clone: `<INSTALL_SOURCE>`.
>
> When you have network, either retry `/sc-update`, or check the
> release page directly:
> <https://github.com/Ignis-AI-Labs/shadow-clone/releases/latest>

## Step 3 — Stop

After emitting the matching message, stop. The user runs the update
themselves so they understand what landed where. Do not chain into
another command.
