# Error Codes Reference

Common errors and how to resolve them.

---

## Authentication Errors

### AUTH_001: Invalid API Key

```
❌ Authentication failed: Invalid API key
```

**Cause**: The API key is incorrect or malformed.

**Solutions**:
1. Verify your API key at [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
2. Check for typos or extra spaces
3. Ensure key starts with `ignis_`
4. Re-copy the key from your dashboard

---

### AUTH_002: Expired Session

```
❌ Session expired. Please re-authenticate.
```

**Cause**: Your authentication session has expired (24-hour limit).

**Solutions**:
1. Run `authenticate(apiKey: "your_key")` again
2. Your license is still valid, just needs fresh auth

---

### AUTH_003: No License Found

```
❌ No active license found for this API key
```

**Cause**: The API key exists but has no associated license.

**Solutions**:
1. Verify you own an Ignis Labs NFT
2. Check your wallet is connected at dashboard.ignislabs.ai
3. Ensure NFT hasn't been transferred

---

### AUTH_004: License Verification Failed

```
❌ License verification failed. Please try again.
```

**Cause**: Network issue connecting to verification server.

**Solutions**:
1. Check your internet connection
2. Try again in a few minutes
3. Contact support if persistent

---

## Tool Errors

### TOOL_001: Missing Required Parameter

```
❌ Missing required parameter: projectDescription
```

**Cause**: A required parameter was not provided.

**Solutions**:
1. Check the tool documentation for required parameters
2. Add the missing parameter to your request

---

### TOOL_002: Invalid Parameter Value

```
❌ Invalid value for 'mode': must be one of: plan, feature, debug, optimize, refactor, audit, research
```

**Cause**: Parameter value is not in the allowed set.

**Solutions**:
1. Check the allowed values for this parameter
2. Use one of the valid options

---

### TOOL_003: Invalid Parameter Type

```
❌ Parameter 'teamSize' must be a number
```

**Cause**: Wrong data type provided for parameter.

**Solutions**:
1. Check expected type (string, number, array, etc.)
2. Provide correct type

---

### TOOL_004: Parameter Out of Range

```
❌ Parameter 'maxAgentsPerWave' must be between 1 and 20
```

**Cause**: Numeric parameter is outside allowed range.

**Solutions**:
1. Check min/max values for this parameter
2. Adjust value to be within range

---

## Configuration Errors

### CONFIG_001: Tools Not Loading

```
Tools not appearing in Claude Code or Claude Desktop
```

**Cause**: MCP server not properly configured.

**Solutions**:
1. Verify configuration file location:
   - Claude Code: `~/.claude/claude_code_config.json`
   - Claude Desktop: `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac)
2. Check JSON syntax is valid
3. Restart Claude after changes
4. Run `npx @anthropic-ai/claude-code@latest --mcp-debug`

---

### CONFIG_002: Server Not Starting

```
MCP server failed to start
```

**Cause**: Issue with server installation or node.

**Solutions**:
1. Verify Node.js is installed (v18+)
2. Run `npm list -g @anthropic-ai/shadow-clone-mcp-server`
3. Reinstall: `npm install -g @anthropic-ai/shadow-clone-mcp-server`
4. Check for port conflicts

---

### CONFIG_003: Wrong Node Version

```
Error: Node.js version 16 is not supported
```

**Cause**: Node.js version is too old.

**Solutions**:
1. Install Node.js v18 or later
2. Use nvm: `nvm install 18 && nvm use 18`
3. Verify: `node --version`

---

## Execution Errors

### EXEC_001: Wave Execution Failed

```
❌ Wave execution failed: [details]
```

**Cause**: Error during wave processing.

**Solutions**:
1. Check the error details for specific cause
2. Verify projectDescription is clear and specific
3. Try with a simpler scope
4. Check .waves/ directory for partial output

---

### EXEC_002: Output Directory Error

```
❌ Cannot write to output directory: [path]
```

**Cause**: Permission issue or invalid path.

**Solutions**:
1. Check directory exists
2. Verify write permissions
3. Try default `./.waves/` directory
4. Use absolute path

---

### EXEC_003: Plan File Not Found

```
❌ Project plan not found: [path]
```

**Cause**: Referenced plan file doesn't exist.

**Solutions**:
1. Verify plan file path is correct
2. Run `shadow_clone_plan` first if needed
3. Use relative path from project root

---

## Network Errors

### NET_001: Connection Timeout

```
❌ Connection timeout: Could not reach authentication server
```

**Cause**: Network connectivity issue.

**Solutions**:
1. Check internet connection
2. Verify no firewall blocking
3. Try again in a few minutes

---

### NET_002: API Rate Limited

```
❌ Rate limited. Please wait before trying again.
```

**Cause**: Too many requests in short period.

**Solutions**:
1. Wait a few minutes before retrying
2. Reduce request frequency
3. Contact support if persistent

---

## Recovery Steps

### General Troubleshooting

1. **Restart Claude**
   - Close and reopen Claude Code or Claude Desktop
   - This reloads the MCP server

2. **Check Configuration**
   ```bash
   # Claude Code
   cat ~/.claude/claude_code_config.json

   # Claude Desktop (Mac)
   cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

3. **Verify Installation**
   ```bash
   npm list -g @anthropic-ai/shadow-clone-mcp-server
   ```

4. **Check Debug Output**
   ```bash
   # Claude Code with debug
   npx @anthropic-ai/claude-code@latest --mcp-debug
   ```

5. **Re-authenticate**
   ```
   authenticate(apiKey: "ignis_YOUR_KEY")
   ```

### Clean Reinstall

```bash
# Uninstall
npm uninstall -g @anthropic-ai/shadow-clone-mcp-server

# Clear npm cache
npm cache clean --force

# Reinstall
npm install -g @anthropic-ai/shadow-clone-mcp-server
```

---

## Getting Help

### Before Contacting Support

1. Note the exact error message
2. Check this error codes page
3. Try the suggested solutions
4. Note your:
   - Node.js version (`node --version`)
   - OS and version
   - Claude Code or Desktop version
   - License tier

### Contact Options

- **Discord**: [Ignis Labs Discord](#)
- **Email**: support@ignislabs.ai
- **Dashboard**: [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)

---

## Related Topics

- [Common Issues](../troubleshooting/common-issues.md)
- [Installation Guide](../getting-started/installation.md)
- [Authentication Guide](../getting-started/authentication.md)
