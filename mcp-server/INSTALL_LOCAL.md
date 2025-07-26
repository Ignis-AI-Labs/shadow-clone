# Shadow Clone MCP Server Installation Guide

This guide covers installation for all MCP-compatible clients including Claude Code, Claude Desktop, and other systems.

## Installation Steps

### 1. Build the Server
```bash
cd E:\Repos\shadow-clone\mcp-server
npm install
npm run build
```

## Client Configuration

### Claude Code (CLI)

#### User-wide Installation (Recommended)
```bash
# Add server available to all projects
claude mcp add shadow-clone -s user node E:\Repos\shadow-clone\mcp-server\dist\index.js
```

#### Project-specific Installation
```bash
# Add to current project only
claude mcp add shadow-clone node E:\Repos\shadow-clone\mcp-server\dist\index.js
```

#### Check Installation
```bash
# List configured servers
claude mcp list

# In Claude, use /mcp to see servers
/mcp
```

### Claude Desktop (GUI)

1. Open File Explorer and navigate to: `%APPDATA%\Claude`
2. Create or edit `claude_desktop_config.json`
3. Add the Shadow Clone MCP server configuration:

```json
{
  "mcpServers": {
    "shadow-clone": {
      "command": "node",
      "args": ["E:\\Repos\\shadow-clone\\mcp-server\\dist\\index.js"],
      "env": {
        "SHADOW_CLONE_API_ENDPOINT": "https://api.ignislabs.ai"
      }
    }
  }
}
```

**Note**: Make sure to use double backslashes (`\\`) in the path on Windows.

4. Restart Claude Desktop completely (including system tray)

## Other MCP Clients

For any MCP-compatible client, use these connection details:

**Command**: `node`  
**Arguments**: `["E:\\Repos\\shadow-clone\\mcp-server\\dist\\index.js"]`  
**Protocol**: stdio  
**Environment Variables**:
- `SHADOW_CLONE_API_ENDPOINT`: `https://api.ignislabs.ai`

## Usage

### First Time Setup
1. Connect to the Shadow Clone MCP server
2. Use the `authenticate` tool with your API key from https://dashboard.ignislabs.ai
3. Authentication persists for 24 hours

### Available Tools
- `authenticate` - Authenticate with API key
- `fetch_shadow_clone_prompt` - Get main orchestration system
- `fetch_mode_prompt` - Get mode-specific prompts
- `list_available_modes` - List execution modes
- `build_shadow_clone_command` - Generate commands
- `get_template` - Access template files

## Troubleshooting

### Server Not Appearing (Claude Code)
```bash
# Check if server is listed
claude mcp list

# Remove and re-add if needed
claude mcp remove shadow-clone
claude mcp add shadow-clone -s user node E:\Repos\shadow-clone\mcp-server\dist\index.js
```

### Server Not Appearing (Claude Desktop)
1. Check the config file path is correct
2. Ensure all backslashes are doubled in paths
3. Check Claude Desktop logs at: `%APPDATA%\Claude\logs`

### Authentication Issues
1. Verify your API key at https://dashboard.ignislabs.ai
2. Check the server logs in console when running manually:
   ```bash
   node E:\Repos\shadow-clone\mcp-server\dist\index.js
   ```

### Path Issues
If the server doesn't start, try using forward slashes:
- Claude Code: `node E:/Repos/shadow-clone/mcp-server/dist/index.js`
- Claude Desktop: `"args": ["E:/Repos/shadow-clone/mcp-server/dist/index.js"]`

## Manual Testing

To test the server manually:
```bash
cd E:\Repos\shadow-clone\mcp-server
node dist\index.js
```

This will start the server in stdio mode - you should see no output (that's normal).

## Development Mode

For development with live reload:
```bash
cd E:\Repos\shadow-clone\mcp-server
npm run dev
```