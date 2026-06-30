# Common Issues

Frequently encountered problems and their solutions.

---

## Installation Issues

### Tools Not Showing Up

**Problem**: Shadow Clone tools don't appear in Claude.

**Solutions**:

1. **Verify configuration file exists**

   Claude Code:
   ```bash
   cat ~/.claude/claude_code_config.json
   ```

   Claude Desktop (Mac):
   ```bash
   cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

   Claude Desktop (Windows):
   ```cmd
   type %APPDATA%\Claude\claude_desktop_config.json
   ```

2. **Check JSON syntax**

   Common issues:
   - Missing commas between entries
   - Trailing commas after last entry
   - Unquoted keys or values

   Valid example:
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

3. **Restart Claude completely**
   - Close all Claude windows
   - Wait a few seconds
   - Reopen Claude

4. **Test with debug mode (Claude Code)**
   ```bash
   npx @anthropic-ai/claude-code@latest --mcp-debug
   ```

---

### "Command Not Found" Error

**Problem**: `npx` or `npm` not recognized.

**Solutions**:

1. **Install Node.js**
   - Download from [nodejs.org](https://nodejs.org)
   - Choose LTS version (v18+)

2. **Verify installation**
   ```bash
   node --version
   npm --version
   npx --version
   ```

3. **Restart terminal after install**
   - New terminal window needed for PATH update

---

### Wrong Node.js Version

**Problem**: Errors about unsupported Node version.

**Solutions**:

1. **Check current version**
   ```bash
   node --version
   ```

2. **Update Node.js**
   - Download latest LTS from [nodejs.org](https://nodejs.org)
   - Or use nvm:
     ```bash
     nvm install 18
     nvm use 18
     ```

---

## Authentication Issues

### "Invalid API Key"

**Problem**: Authentication fails with invalid key error.

**Solutions**:

1. **Verify key format**
   - Must start with `ignis_`
   - Should be ~40 characters
   - No extra spaces

2. **Re-copy from dashboard**
   - Go to [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
   - Generate new key if needed
   - Copy carefully (use copy button)

3. **Check for invisible characters**
   - Paste key into plain text editor first
   - Remove any trailing whitespace

---

### "No License Found"

**Problem**: Key works but no license associated.

**Solutions**:

1. **Verify NFT ownership**
   - Go to [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
   - Connect your wallet
   - Confirm NFT shows in your collection

2. **Check correct wallet**
   - NFT must be in connected wallet
   - If transferred, reconnect new wallet

3. **Wait for sync**
   - New purchases may take a few minutes
   - Refresh dashboard and try again

---

### Session Expired

**Problem**: Was working, now getting auth errors.

**Solutions**:

1. **Re-authenticate**
   ```
   authenticate(apiKey: "ignis_YOUR_KEY")
   ```

2. **Sessions last 24 hours**
   - Normal behavior
   - Just authenticate again

---

## Usage Issues

### No Output Generated

**Problem**: Tool runs but nothing appears in `.waves/`.

**Solutions**:

1. **Check tool is returning prompt**
   - Shadow Clone returns instructions
   - Claude must process them
   - Look for Claude's response after tool call

2. **Verify output directory**
   - Default is `./.waves/` in current directory
   - Check you have write permissions
   - Try explicit path: `wavesDirectory: "./output/"`

3. **Ensure Claude processes response**
   - The tool returns a prompt
   - Claude should then create files
   - If Claude stops, ask it to continue

---

### Incomplete Results

**Problem**: Some files missing or waves incomplete.

**Solutions**:

1. **Be more specific**

   Instead of:
   ```
   Build a login system
   ```

   Try:
   ```
   Build a login system with:
   - Email/password authentication
   - JWT tokens with 15-minute expiry
   - Password hashing with bcrypt
   - Express.js backend
   ```

2. **Ask Claude to continue**
   ```
   Continue with the next wave
   ```

3. **Check for errors in output**
   - Look at WAVE_STATUS.md
   - Check individual WAVE_COMPLETE.md files

---

### Tool Response Too Long

**Problem**: Claude seems to hang or response is cut off.

**Solutions**:

1. **Use smaller scope**
   - Break task into smaller pieces
   - Use `deploy_agent_team` instead of full orchestration

2. **Reduce agent count**
   ```
   shadow_clone_orchestrate(
     mode: "feature",
     projectDescription: "...",
     maxAgentsPerWave: 5  // Reduce from default 10
   )
   ```

---

## Performance Issues

### Slow Response Times

**Problem**: Tools take a long time to respond.

**Solutions**:

1. **Check network connection**
   - Authentication requires network
   - Slow internet = slow auth

2. **Use simpler tools for small tasks**

   Instead of full orchestration:
   ```
   quick_fix(
     issueType: "bug",
     description: "Fix login validation"
   )
   ```

---

### High Memory Usage

**Problem**: Claude or terminal using lots of memory.

**Solutions**:

1. **Restart Claude periodically**
   - Long sessions can accumulate memory

2. **Close unused terminals**
   - Each terminal may have node processes

---

## Platform-Specific Issues

### Windows Path Issues

**Problem**: Paths not working on Windows.

**Solutions**:

1. **Use forward slashes**
   ```
   wavesDirectory: "./output/"
   ```
   Not:
   ```
   wavesDirectory: ".\\output\\"
   ```

2. **Avoid spaces in paths**
   - Or quote paths with spaces

---

### Mac Permission Denied

**Problem**: Cannot write to output directory.

**Solutions**:

1. **Check directory permissions**
   ```bash
   ls -la .waves/
   ```

2. **Fix permissions**
   ```bash
   chmod 755 .waves/
   ```

3. **Try home directory**
   ```
   wavesDirectory: "~/.shadow-clone-output/"
   ```

---

### Linux npx Issues

**Problem**: npx not finding package.

**Solutions**:

1. **Clear npx cache**
   ```bash
   npx clear-npx-cache
   ```

2. **Install globally instead**
   ```bash
   npm install -g @anthropic-ai/shadow-clone-mcp-server
   ```

   Then update config to use direct path:
   ```json
   {
     "command": "shadow-clone-mcp-server"
   }
   ```

---

## Still Having Issues?

1. Check [Error Codes Reference](../reference/error-codes.md)
2. Read [Installation Guide](../getting-started/installation.md)
3. Contact [Support](support.md)

---

## Related Topics

- [Error Codes](../reference/error-codes.md)
- [Installation Guide](../getting-started/installation.md)
- [Support](support.md)
