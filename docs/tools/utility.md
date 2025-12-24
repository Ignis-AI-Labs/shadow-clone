# Utility Tools

System management and helper tools.

## authenticate

Authenticate with your Shadow Clone API key.

### When to Use

- First time setup
- After session expiry (24 hours)
- After NFT ownership changes

### Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `apiKey` | Yes | string | Your API key from dashboard.ignislabs.ai |

### Example

```
authenticate(
  apiKey: "ignis_YOUR_API_KEY_HERE"
)
```

### Response

**Success:**
```
✅ Authenticated successfully!
License type: ignisElite
All Shadow Clone tools are now available.
```

**Failure:**
```
❌ Authentication failed: Invalid API key
Please check your key at dashboard.ignislabs.ai
```

### Notes

- Get your API key at [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
- Authentication persists for 24 hours
- Real-time NFT ownership verification on each tool use
- Required before using any other Shadow Clone tools

---

## api_key_status

Check your current authentication status.

### When to Use

- Verify you're authenticated
- Check license type
- Debug authentication issues
- See where API keys are cached

### Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `showKey` | No | boolean | Show actual API key (default: false) |

### Example

```
api_key_status()
```

### Response

```
=== Shadow Clone API Key Status ===

Authentication: ✅ Active
License Type: ignisElite
Last Validated: 2024-01-15 10:30:00

API Key Sources Checked:
1. VS Code Secret Storage: ✅ Found
2. Environment Variable: ✅ Found
3. Global Config (~/.shadow-clone/): ✅ Found
4. Workspace .env: Not found

Current Key: ignis_****...****YY (masked)
```

---

## check_for_updates

Check if a newer version of Shadow Clone is available.

### When to Use

- Periodic update checks
- After encountering issues
- Before starting major projects

### Parameters

None required.

### Example

```
check_for_updates()
```

### Response

**Up to date:**
```
✅ Shadow Clone MCP Server is up to date!
Current version: 0.2.3
Latest version: 0.2.3
```

**Update available:**
```
⚠️ Update available!
Current version: 0.2.2
Latest version: 0.2.3

To update:
npm update -g @shadow-clone/mcp-server

Then restart Claude (Code or Desktop).
```

---

## initialize_workspace

Set up a workspace with Shadow Clone configuration files.

### When to Use

- Setting up a new project for Shadow Clone
- Adding Shadow Clone config to existing project
- Creating standardized AI instruction files

### Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `projectPath` | No | string | Path to project (default: current directory) |
| `includeTypes` | No | array | Which files to create |
| `overwrite` | No | boolean | Overwrite existing files (default: false) |

### Include Types

- `claude` - CLAUDE.md for Claude Code
- `github` - .github/copilot-instructions.md
- `vscode` - .vscode settings
- `general` - .ai/instructions.md

### Example

```
initialize_workspace(
  projectPath: "./my-project",
  includeTypes: ["claude", "github"],
  overwrite: false
)
```

### What It Creates

```
my-project/
├── CLAUDE.md                          # Claude Code instructions
├── .ai/
│   └── instructions.md                # General AI instructions
├── .github/
│   └── copilot-instructions.md        # GitHub Copilot instructions
└── .env                               # API key backup (gitignored)
```

---

## show_commands

Display quick reference of all Shadow Clone commands.

### When to Use

- Need a reminder of available tools
- Quick syntax reference
- Learning Shadow Clone

### Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `category` | No | string | Filter by category |

### Categories

- `orchestration` - Main orchestration tools
- `teams` - Team deployment tools
- `rapid` - Quick operation tools
- `documentation` - Documentation tools
- `all` - Everything (default)

### Example

```
show_commands(category: "rapid")
```

### Response

```
# Shadow Clone Quick Reference - Rapid Tools

## quick_fix
Rapid problem-solving for urgent fixes.
Parameters:
  - issueType (required): bug | style | logic | performance | security
  - description (required): Issue description
  - filePath (optional): Affected file(s)
  - urgency (optional): low | medium | high | critical

## code_review_team
Deploy review team for code analysis.
Parameters:
  - reviewType (required): security | performance | quality | architecture | comprehensive
  - files (required): Array of files/directories
  - standards (optional): Standards to check against

...
```

---

## get_agent_template

Access internal agent behavior templates.

### When to Use

- Understanding how agents work
- Learning Shadow Clone internals
- Customizing approaches

### Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `templateType` | Yes | string | Type of template to retrieve |

### Template Types

- `core_rules` - Fundamental agent behavior rules
- `agent_template` - Individual agent role template
- `team_templates` - Team composition and coordination

### Example

```
get_agent_template(templateType: "core_rules")
```

### Response

Returns the actual template content used to define agent behaviors. This is the prompt engineering "source code" that creates agent expertise.

---

## Which Tools Don't Require Authentication?

These tools work without authentication:
- `authenticate` - Obviously
- `api_key_status` - Check status
- `check_for_updates` - Version check
- `show_commands` - Reference only

All other tools require authentication first.

---

## Related Topics

- [Authentication Guide](../getting-started/authentication.md)
- [Installation Guide](../getting-started/installation.md)
- [Tools Overview](overview.md)
