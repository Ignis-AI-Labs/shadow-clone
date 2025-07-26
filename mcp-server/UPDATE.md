# Updating Shadow Clone MCP Server

## Quick Update Methods

### Method 1: NPM Global Update (Recommended)
```bash
# Check current version
shadow-clone-mcp --version

# Update to latest version
npm update -g @shadow-clone/mcp-server

# Or force reinstall
npm install -g @shadow-clone/mcp-server@latest
```

### Method 2: Manual Update
```bash
# Clone latest version
git clone https://github.com/ignislabs/shadow-clone.git
cd shadow-clone/mcp-server

# Build and install
npm install
npm run build:prod
npm install -g .
```

## Refreshing in Claude Desktop

After updating the MCP server:

1. **Quick Refresh**: 
   - Open Claude Desktop settings
   - Go to Developer tab
   - Click the reload icon (↻) next to "shadow-clone"

2. **Full Restart**:
   - Quit Claude Desktop completely
   - Reopen Claude Desktop
   - The updated server will load automatically

## Checking Your Version

To verify the update worked:
1. In Claude, use: `get_agent_template(templateType: "core_rules")`
2. Check the server logs for version info
3. Or run `shadow-clone-mcp --version` in terminal

## Auto-Update Feature (Coming Soon)

We're working on an auto-update feature that will:
- Check for updates automatically
- Notify you when updates are available
- Update with a single command

## Troubleshooting

If updates aren't showing:
1. Clear npm cache: `npm cache clean --force`
2. Ensure Claude Desktop is fully closed
3. Check `~/.shadow-clone/` for any lock files
4. Reinstall with `npm install -g @shadow-clone/mcp-server --force`

## Version History

- v0.1.0 - Initial release with embedded prompts and modular tools