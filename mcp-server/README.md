# Shadow Clone MCP Server

**Free, open-source prompt engineering macros for AI assistants.** Transform any AI into a team of specialized virtual agents through advanced prompt engineering.

## What is Shadow Clone?

Shadow Clone is a **prompt engineering macro system** that delivers sophisticated instructions to AI assistants. It doesn't execute code directly - instead, it provides expert-level methodologies that guide AI through complex software development workflows.

**Works with:** Claude Code, Claude Desktop, or any AI supporting MCP (Model Context Protocol).

## Quick Start

### 1. Install

```bash
npm install -g @shadow-clone/mcp-server
```

### 2. Configure

**Claude Code** (`~/.claude/claude_code_config.json`):
```json
{
  "mcpServers": {
    "shadow-clone": {
      "command": "shadow-clone-mcp"
    }
  }
}
```

**Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "shadow-clone": {
      "command": "shadow-clone-mcp"
    }
  }
}
```

### 3. Use

No authentication needed. All tools are immediately available:

```
shadow_clone_orchestrate(
  mode: "feature",
  projectDescription: "Build user authentication with JWT tokens"
)
```

## Available Tools (14)

| Category | Tools |
|----------|-------|
| **Orchestration** | `shadow_clone_orchestrate`, `shadow_clone_plan` |
| **Teams** | `deploy_agent_team`, `deploy_specialist_agent` |
| **Rapid** | `quick_fix`, `code_review_team`, `generate_tests`, `execute_single_wave` |
| **Documentation** | `create_documentation`, `architecture_consultant` |
| **Utility** | `initialize_workspace`, `check_for_updates`, `show_commands`, `get_agent_template` |

## Requirements

- Node.js v16+

## Development

```bash
cd mcp-server
npm install
npm run build        # TypeScript compilation
npm run dev          # Development mode with watch
npm run lint         # Type checking
npm test             # Run tests
```

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built by [Ignis AI Labs](https://ignislabs.ai). Made with care for the AI developer community.
