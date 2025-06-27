# Shadow Clone - Claude Terminal Update

## What Changed

The "Launch Claude" button now:
1. Opens a new terminal named "Claude Code"
2. Runs the `claude` command to start Claude Code
3. Copies your Shadow Clone command to clipboard
4. You paste the command when Claude is ready

## Benefits

- **Simpler**: No extension detection needed
- **Reliable**: Always works if Claude Code CLI is installed
- **Direct**: Launches Claude exactly how you normally would

## Requirements

Make sure Claude Code CLI is installed:
```bash
# If not installed, install with:
npm install -g @anthropic/claude-code
```

## Usage

1. Click "$(terminal) Launch Claude" in status bar
2. Select your Shadow Clone mode
3. Terminal opens and runs `claude`
4. When Claude is ready, paste the command from clipboard

That's it! Much simpler and more reliable.