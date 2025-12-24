# Shadow Clone MCP Server

**Prompt engineering macros for AI assistants.** Transform any AI into a team of specialized virtual agents through advanced prompt engineering.

## What is Shadow Clone?

Shadow Clone is a **prompt engineering macro system** that delivers sophisticated instructions to AI assistants. It doesn't execute code directly - instead, it provides expert-level methodologies that guide AI through complex software development workflows.

**Works with:** Claude Code, Claude Desktop, or any AI supporting MCP (Model Context Protocol).

## Quick Start

### 1. Install

```bash
npm install -g @anthropic-ai/shadow-clone-mcp-server
```

### 2. Configure

**Claude Code** (`~/.claude/claude_code_config.json`):
```json
{
  "mcpServers": {
    "shadow-clone": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/shadow-clone-mcp-server"]
    }
  }
}
```

**Claude Desktop**: See [Installation Guide](../docs/getting-started/installation.md)

### 3. Authenticate

Get your API key from [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai), then:

```
authenticate(apiKey: "ignis_YOUR_API_KEY")
```

### 4. Use

```
shadow_clone_orchestrate(
  mode: "feature",
  projectDescription: "Build user authentication with JWT tokens"
)
```

## Available Tools

| Category | Tools |
|----------|-------|
| **Orchestration** | `shadow_clone_orchestrate`, `shadow_clone_plan` |
| **Teams** | `deploy_agent_team`, `deploy_specialist_agent` |
| **Rapid** | `quick_fix`, `code_review_team`, `generate_tests` |
| **Utility** | `authenticate`, `api_key_status`, `check_for_updates` |

## Requirements

- Node.js v18+
- Shadow Clone NFT license ([dashboard.ignislabs.ai](https://dashboard.ignislabs.ai))

## Documentation

- **[Quick Start Guide](QUICKSTART.md)** - 5-minute setup
- **[Full Documentation](../docs/index.md)** - Complete guide
- **[Tool Reference](../docs/reference/all-tools.md)** - All tools and parameters
- **[Troubleshooting](../docs/troubleshooting/common-issues.md)** - Common issues

## License

Requires active Shadow Clone NFT ownership. Verified in real-time - access is revoked if NFT is transferred.

## Support

- Dashboard: [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
- Documentation: See [docs/](../docs/)

---

© 2024 Ignis AI Labs LLC
