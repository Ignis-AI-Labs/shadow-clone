# Claude Session Tracking Fix

## What Was Fixed

1. **Added Debug Logging** - Added comprehensive console logging to track terminal detection and session creation
2. **Improved Terminal Detection** - Enhanced pattern matching to detect more Claude terminal variations
3. **Prevented Duplicate Sessions** - Modified `createSession` to check for existing sessions on the same terminal
4. **Added Terminal State Monitoring** - Now monitors terminal state changes in addition to open/active events
5. **Added `getSessionByTerminal` Method** - Helper method to find sessions by terminal reference

## Testing Instructions

1. **Run Extension in Debug Mode**
   ```bash
   cd vscode-extension
   code .
   # Press F5 to launch debug instance
   ```

2. **Check Debug Console**
   - Open Debug Console in VS Code
   - Look for `[TerminalMonitor]` and `[SessionManager]` log messages

3. **Test Session Detection**
   - Use Command Palette: "Shadow Clone: Launch Claude"
   - Select any mode and send command
   - Check if session appears in Shadow Clone Sessions view
   - Check Debug Console for detection messages

4. **Test Manual Registration**
   - Open any terminal
   - Use Command Palette: "Shadow Clone: Register Current Terminal"
   - Should see notification and session in list

5. **Test Existing Terminal Detection**
   - Have a terminal named "Claude Code" already open
   - Reload VS Code window
   - Should detect and register the terminal automatically

## Debug Output Examples

You should see messages like:
```
[TerminalMonitor] Initializing...
[TerminalMonitor] Checking 2 existing terminals
[TerminalMonitor] Checking existing terminal: "bash"
[TerminalMonitor] Not a Claude terminal: "bash"
[TerminalMonitor] New terminal opened: "Claude Code"
[TerminalMonitor] Detected Claude terminal: "Claude Code"
[SessionManager] Created session: abc-123-def-456
```

## Known Terminal Names

The extension now detects terminals with these patterns (case-insensitive):
- "claude"
- "shadow clone"
- "claude code"
- "claude-code"
- "shadow-clone"

## Troubleshooting

If sessions still aren't being tracked:

1. **Check Terminal Name** - Make sure the terminal has "claude" in its name
2. **Check Debug Console** - Look for error messages
3. **Try Manual Registration** - Use the register command
4. **Reload Window** - Sometimes VS Code needs a reload

## Next Steps

Once session tracking is verified working:
1. Package extension for marketplace
2. Create publisher account
3. Publish to VS Code marketplace