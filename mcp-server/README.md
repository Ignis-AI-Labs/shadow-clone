# Shadow Clone MCP Server

Deploy teams of specialized AI agents directly through Claude using the Model Context Protocol (MCP).

## Overview

The Shadow Clone MCP Server provides seamless integration between Claude and the Shadow Clone AI agent orchestration system. This allows you to deploy AI agent teams for complex software tasks directly from Claude conversations.

## Requirements

- **Node.js**: v18 or higher
- **Shadow Clone License**: Active NFT license from [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
- **Claude Desktop**: Latest version with MCP support

## Installation

### Option 1: NPM (Recommended)
```bash
npm install -g @shadow-clone/mcp-server
```

### Option 2: From Source (Internal Only)
```bash
# Clone from internal repository
cd mcp-server
npm install
npm run build
npm link
```

## Configuration

Add the Shadow Clone MCP server to your Claude Desktop configuration:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "shadow-clone": {
      "command": "shadow-clone-mcp",
      "env": {
        "SHADOW_CLONE_API_ENDPOINT": "https://api.ignislabs.ai"
      }
    }
  }
}
```

## Authentication

When you first use Shadow Clone tools in Claude, you'll need to authenticate:

1. Use the `authenticate` tool
2. Provide your API key from [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
3. Authentication persists for 24 hours

## Available Tools

### 1. **authenticate**
Authenticate with your Shadow Clone API key.

### 2. **shadow_clone_orchestrate**
Execute Shadow Clone AI agent orchestration directly:
- Deploys teams of specialized AI agents
- Supports all execution modes (plan, feature, debug, etc.)
- Manages wave-based execution
- Includes all prompt engineering built-in

### 3. **shadow_clone_plan**
Create comprehensive project plans without writing code:
- Generates detailed technical specifications
- Creates implementation roadmaps
- Produces architecture documents
- No code generation in this mode

### 4. **get_agent_template**
Access agent behavior templates:
- `core_rules` - Core agent behavior rules
- `agent_template` - Individual agent templates
- `team_templates` - Team coordination templates

## Usage Examples

### Basic Project Build
```
1. Use authenticate tool with your API key
2. Use shadow_clone_orchestrate with:
   - mode: "feature"
   - projectDescription: "Your project requirements"
   - wavesDirectory: "./.waves/"
3. The tool will deploy AI agents to build your project
```

### Planning Mode
```
1. Authenticate first
2. Use shadow_clone_plan with:
   - projectVision: "Your project idea and goals"
3. Agents will create comprehensive plans without coding
```

### Debug Mode
```
1. Authenticate
2. Use shadow_clone_orchestrate with:
   - mode: "debug"
   - projectDescription: "The bugs/issues to fix"
3. Debug agents will systematically fix issues
```

## Security

- API keys are stored securely in your home directory
- Authentication expires after 24 hours
- All prompt engineering is embedded and protected
- Prompts are never exposed in plain text
- Minimal logging for privacy

## Troubleshooting

### "Not authenticated" Error
Run the authenticate tool with your API key.

### "Invalid API key" Error
1. Check your API key at [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
2. Ensure your license is active
3. Re-authenticate with the correct key

### MCP Server Not Found
1. Ensure the server is installed globally: `npm list -g @shadow-clone/mcp-server`
2. Check your PATH includes npm global bin directory
3. Restart Claude Desktop after configuration changes

### Connection Issues
1. Check your internet connection
2. Verify API endpoint is accessible
3. Check logs at `~/.shadow-clone/logs/`

## Environment Variables

- `SHADOW_CLONE_API_ENDPOINT` - API server URL (default: https://api.ignislabs.ai)
- `LOG_LEVEL` - Logging level: error, warn, info, debug (default: info)
- `NODE_ENV` - Set to "production" to disable console logging

## License

This MCP server requires an active Shadow Clone NFT license. Access is currently limited to:
- Ignis Elite NFT holders (777 total)

Future releases will include Pioneer, Builder, and Reserve access tiers.

## Support

- **Documentation**: [docs.shadowclone.ai](https://docs.shadowclone.ai)
- **Support**: Contact through [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
- **Dashboard**: [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)

---

© 2024 Ignis AI Labs LLC. All rights reserved.