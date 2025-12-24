# Shadow Clone MCP Server - Quick Start Guide

Get up and running with Shadow Clone in 5 minutes.

---

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Claude Code** or **Claude Desktop** - [Get Claude Code](https://claude.ai/code) | [Get Claude Desktop](https://claude.ai/download)
- **Shadow Clone API Key** - Get yours at [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)

---

## Step 1: Install the MCP Server

Open your terminal and run:

```bash
npm install -g @shadow-clone/mcp-server
```

Verify installation:

```bash
shadow-clone-mcp --version
```

---

## Step 2: Configure Claude

### Option A: Claude Code (CLI)

Run this command to add the MCP server:

```bash
claude mcp add shadow-clone -- shadow-clone-mcp
```

Or manually edit `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "shadow-clone": {
      "command": "shadow-clone-mcp"
    }
  }
}
```

**Restart Claude Code after configuring.**

---

### Option B: Claude Desktop (GUI App)

Find your Claude Desktop config file:

| OS | Location |
|----|----------|
| **Windows** | `%APPDATA%\Claude\claude_desktop_config.json` |
| **macOS** | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| **Linux** | `~/.config/Claude/claude_desktop_config.json` |

Add this to the file:

```json
{
  "mcpServers": {
    "shadow-clone": {
      "command": "shadow-clone-mcp"
    }
  }
}
```

**Save and restart Claude Desktop.**

---

## Step 3: Authenticate

In Claude, type:

```
Please authenticate me with Shadow Clone using this API key: YOUR_API_KEY_HERE
```

Claude will use the `authenticate` tool. You should see:

```
✅ Authenticated successfully! License type: ignisElite
```

You're now ready to use Shadow Clone!

---

## Step 4: Try It Out

### Quick Fix (Fastest)
```
Use the quick_fix tool to help me fix a bug:
- issueType: "bug"
- description: "Login form not validating email correctly"
- urgency: "high"
```

### Code Review
```
Use code_review_team to review my authentication code:
- reviewType: "security"
- files: ["src/auth/login.js", "src/auth/register.js"]
```

### Build a Feature
```
Use shadow_clone_orchestrate to build a feature:
- mode: "feature"
- projectDescription: "Create a user dashboard with profile settings, activity history, and notification preferences using React"
```

### Plan a Project
```
Use shadow_clone_plan to create a project plan:
- projectVision: "Build a real-time chat application with WebSocket support, message history, and user presence indicators"
```

---

## Available Tools

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `authenticate` | Verify your license | First time setup |
| `quick_fix` | Rapid bug fixes | Urgent issues |
| `code_review_team` | Review code quality | Before PRs, security audits |
| `generate_tests` | Create test suites | Improve coverage |
| `deploy_specialist_agent` | Single expert help | Focused tasks |
| `deploy_agent_team` | Team of experts | Component development |
| `shadow_clone_orchestrate` | Full project build | New features, major work |
| `shadow_clone_plan` | Project planning | Architecture, roadmaps |
| `create_documentation` | Generate docs | API docs, guides |
| `architecture_consultant` | Design guidance | System design decisions |

---

## Troubleshooting

### "Tools not showing up"

**Claude Code:**
1. Run `claude mcp list` to see if shadow-clone is registered
2. Restart Claude Code: exit and run `claude` again
3. Check `~/.claude/settings.json` is valid JSON

**Claude Desktop:**
1. Make sure Claude Desktop is fully restarted (quit and reopen)
2. Check your config file is valid JSON
3. Verify installation: `npm list -g @shadow-clone/mcp-server`

### "Authentication failed"
1. Check your API key at [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
2. Make sure your license is active
3. Try getting a new API key from the dashboard

### "Command not found: shadow-clone-mcp"
1. Reinstall: `npm install -g @shadow-clone/mcp-server`
2. Check npm global bin is in your PATH:
   - Windows: Usually `%APPDATA%\npm`
   - macOS/Linux: Usually `/usr/local/bin` or `~/.npm-global/bin`

### Still stuck?
Check logs at `~/.shadow-clone/logs/` or contact support at [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)

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

## Example Workflows

### Bug Fix Workflow
1. `quick_fix` - Identify and fix the issue
2. `generate_tests` - Create regression tests
3. `code_review_team` - Verify the fix

### New Feature Workflow
1. `shadow_clone_plan` - Create implementation plan
2. `shadow_clone_orchestrate` (mode: feature) - Build it
3. `generate_tests` - Add tests
4. `create_documentation` - Document it

### Security Audit Workflow
1. `code_review_team` (reviewType: security) - Find vulnerabilities
2. `quick_fix` - Fix each issue
3. `generate_tests` (testType: security) - Add security tests

---

## Need More Help?

- **Full Documentation**: See `USER_GUIDE.md` for complete tool reference
- **Dashboard**: [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
- **Support**: Contact through the dashboard

---

**You're all set! Start building with Shadow Clone.**
