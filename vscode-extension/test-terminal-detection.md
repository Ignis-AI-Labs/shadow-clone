# Terminal Detection Test Plan

## Issue
Claude sessions are not being automatically detected and registered in the VS Code extension's session view.

## Root Cause Analysis
1. The `TerminalMonitor` class is checking for terminals with "claude" or "shadow clone" in the name
2. Claude Code terminals may not have these keywords in their names
3. Need to verify what the actual terminal name is when Claude is launched

## Test Steps

1. **Check Current Terminal Names**
   - Open VS Code with the extension
   - Launch Claude using the extension command
   - Check the terminal name in VS Code

2. **Verify Terminal Monitor Initialization**
   - The `TerminalMonitor` is created in `extension.ts` line 45
   - It should automatically scan existing terminals
   - It should monitor new terminals

3. **Manual Registration Test**
   - Use Command Palette: "Shadow Clone: Register Current Terminal"
   - This should force-register any terminal as a Claude session

## Potential Fixes

1. **Update Terminal Name Detection**
   - Check for more variations: "Claude Code", "claude-code", "claude-cli"
   - Make detection case-insensitive (already done)
   - Add pattern matching for partial names

2. **Improve Launch Integration**
   - When launching Claude via `launchClaudeCommand`, the terminal is created with name "Claude Code"
   - This should match our detection pattern
   - May need to ensure the session is created immediately after terminal creation

3. **Add Debug Logging**
   - Add console logs to verify terminal names
   - Log when terminals are checked
   - Log when sessions are created

## Debug Commands
```bash
# In VS Code Debug Console when running extension:
# Check all terminal names
vscode.window.terminals.forEach(t => console.log('Terminal:', t.name))

# Check session manager
const sm = sessionManager;
console.log('Active sessions:', sm.getActiveSessions());
```