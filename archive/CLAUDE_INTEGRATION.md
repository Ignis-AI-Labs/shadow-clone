# Shadow Clone Claude Integration Guide

## Overview

The Shadow Clone VS Code extension now includes deep integration with Claude Code, making it easy to launch AI agent orchestration sessions directly from VS Code.

## Key Features

### 1. Launch Claude Button
- **Status Bar Button**: Click "$(terminal) Launch Claude" in the status bar
- **Command Palette**: `Shadow Clone: Launch Claude Code`
- **Activity Bar**: Click the rocket icon, then "Launch Claude" button

### 2. Command Templates
When you launch Claude, you'll see options for:
- **🚀 Deploy Shadow Clone** - Full orchestration mode
- **🔍 Research Mode** - Analyze codebase without changes
- **🐛 Debug Mode** - Fix issues with AI agents
- **✨ Feature Mode** - Build new features
- **🔄 Refactor Mode** - Improve existing code
- **📊 Optimize Mode** - Performance improvements
- **🛡️ Audit Mode** - Security assessment
- **📜 Resume Previous** - Continue from last session
- **ℹ️ Status Check** - View current progress

### 3. Claude Session Tracking
The extension tracks all your Claude Code sessions:
- **Active Sessions View**: See running Claude instances
- **Session History**: Review past sessions
- **Output Monitoring**: Automatically detects `.waves` outputs
- **Status Indicators**: Shows active session count in status bar

### 4. Macro System
Build custom Shadow Clone commands with:
- Interactive command builder
- Parameter customization
- Quick command templates
- Command history

## Usage

### Quick Start
1. Click "Launch Claude" in status bar
2. Select a command template
3. Command is copied to clipboard
4. Paste in Claude Code terminal

### Custom Commands
```javascript
// Example: Build a full-stack app
Load shadow-clone-prompt.md and execute with project_type=feature team_composition=fullstack wave_count=3

// Example: Security audit
Load shadow-clone-prompt.md and execute with project_type=audit team_composition=security

// Example: Custom waves directory
Load shadow-clone-prompt.md and execute with waves_directory=/my/custom/path/
```

### Session Management
- **View Sessions**: Click session count in status bar
- **Terminate Session**: Right-click session → Terminate
- **Open Output**: Click on completed session to view results
- **Clear History**: Command palette → "Clear Completed Sessions"

## Advanced Features

### 1. Claude Extension Detection
The extension checks if you have the official Claude extension installed and prompts you to install it for the best experience.

### 2. Auto Output Detection
When Shadow Clone creates output in `.waves` directories, the extension:
- Automatically detects new files
- Updates session status
- Shows notifications for completed deliverables
- Provides quick access to results

### 3. Command History
- Last 10 commands are saved
- Quick re-run previous commands
- Modify and reuse templates

### 4. Workspace Integration
- Commands automatically use current workspace
- Customizable output directories
- Project-specific configurations

## Tips

1. **Use Templates**: Start with pre-built command templates
2. **Track Progress**: Keep the Claude Sessions view open
3. **Multiple Sessions**: Run multiple Claude instances for different tasks
4. **Review Outputs**: Click completed sessions to review deliverables

## Keyboard Shortcuts

- **Launch Claude**: No default (assign in preferences)
- **Show Sessions**: No default (assign in preferences)
- **Copy Last Command**: Available via command palette

## Configuration

In VS Code settings:
- `shadowClone.wavesDirectory`: Default output directory
- `shadowClone.maxAgentsPerWave`: Maximum agents to deploy

## Troubleshooting

### Claude Not Found
- Install the official Claude extension
- Ensure Claude Code is accessible from terminal

### Sessions Not Tracking
- Check that terminals are created via the extension
- Verify workspace permissions for `.waves` directory

### Commands Not Working
- Ensure `shadow-clone-prompt.md` exists in workspace
- Check that all Shadow Clone files are present

## Security Note

All commands are copied to clipboard only - the extension never executes commands directly. This ensures you maintain full control over what runs in Claude Code.