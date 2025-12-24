# Installation Guide

Get Shadow Clone installed and configured in 5 minutes.

## Prerequisites

Before installing, ensure you have:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Claude Code** or **Claude Desktop** - [Get Claude Code](https://claude.ai/code) | [Get Claude Desktop](https://claude.ai/download)
- **Shadow Clone License** - Get your API key at [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)

## Step 1: Install the MCP Server

Open your terminal and run:

```bash
npm install -g @shadow-clone/mcp-server
```

Verify the installation:

```bash
shadow-clone-mcp --version
```

You should see a version number like `0.2.3`.

## Step 2: Configure Claude

### Option A: Claude Code (CLI)

The easiest way to add the MCP server:

```bash
claude mcp add shadow-clone -- shadow-clone-mcp
```

**Or** manually edit `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "shadow-clone": {
      "command": "shadow-clone-mcp"
    }
  }
}
```

After configuring, restart Claude Code (exit and run `claude` again).

### Option B: Claude Desktop (GUI App)

Find your config file:

| OS | Location |
|----|----------|
| **Windows** | `%APPDATA%\Claude\claude_desktop_config.json` |
| **macOS** | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| **Linux** | `~/.config/Claude/claude_desktop_config.json` |

Add this configuration:

```json
{
  "mcpServers": {
    "shadow-clone": {
      "command": "shadow-clone-mcp"
    }
  }
}
```

Save the file and restart Claude Desktop completely (quit and reopen).

## Step 3: Verify Installation

In Claude, type:

```
What Shadow Clone tools are available?
```

Claude should list tools like `authenticate`, `shadow_clone_orchestrate`, `quick_fix`, etc.

If tools aren't showing up, see [Troubleshooting](#troubleshooting).

## Step 4: Authenticate

Before using Shadow Clone tools, you need to authenticate with your API key.

In Claude, type:

```
Please authenticate me with Shadow Clone using this API key: YOUR_API_KEY_HERE
```

Replace `YOUR_API_KEY_HERE` with your actual API key from [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai).

You should see:

```
✅ Authenticated successfully! License type: ignisElite
```

Authentication persists for 24 hours or until your NFT ownership changes.

## You're Ready!

Start using Shadow Clone:

```
Use the quick_fix tool to help me debug a login issue:
- issueType: "bug"
- description: "Login button not responding to clicks"
- urgency: "high"
```

See [Your First Project](first-project.md) for a complete walkthrough.

---

## Troubleshooting

### Tools not showing up

**Claude Code:**
1. Check if MCP server is registered:
   ```bash
   claude mcp list
   ```
2. Restart Claude Code completely (exit and run `claude` again)
3. Verify `~/.claude/settings.json` is valid JSON

**Claude Desktop:**
1. Quit Claude Desktop completely (not just close window)
2. Reopen Claude Desktop
3. Check your config file is valid JSON (use a JSON validator)

### "Command not found: shadow-clone-mcp"

The npm global bin directory isn't in your PATH.

**Windows:**
```bash
# Add to PATH (usually %APPDATA%\npm)
npm config get prefix
# Add the returned path + \bin to your PATH environment variable
```

**macOS/Linux:**
```bash
# Find npm global bin
npm config get prefix
# Add to your shell config (~/.bashrc, ~/.zshrc):
export PATH="$(npm config get prefix)/bin:$PATH"
```

Or reinstall with:
```bash
npm install -g @shadow-clone/mcp-server
```

### "Authentication failed"

1. Check your API key is correct at [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
2. Ensure your license is active (NFT still in wallet)
3. Try generating a new API key from the dashboard

### MCP server crashes

Check logs:
```bash
# Logs location
~/.shadow-clone/logs/
```

Common fixes:
- Update Node.js to v18+
- Reinstall: `npm install -g @shadow-clone/mcp-server --force`
- Clear npm cache: `npm cache clean --force`

---

## Updating

Check for updates in Claude:
```
Use check_for_updates to see if there's a new version
```

Update via npm:
```bash
npm update -g @shadow-clone/mcp-server
```

Then restart Claude (Code or Desktop).

---

## Next Steps

- [Authenticate your license](authentication.md)
- [Build your first project](first-project.md)
- [Explore available tools](../tools/overview.md)
