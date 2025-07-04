# Shadow Clone VS Code Extension - Test Checklist

## Prerequisites
Ensure these files exist in your project root:
- ✅ `/root/repos/shadow-clone/shadow-clone-prompt.md`
- ✅ `/root/repos/shadow-clone/.shadow/` (directory with mode configs)

## Test Steps

1. **Install Extension**
   - Install `shadow-clone-0.1.0.vsix` in VS Code

2. **Check Authentication**
   - Look for status bar buttons (bottom right)
   - Click "$(key) Authenticate" 
   - Enter your API key
   - Should show "$(check) License Active"

3. **Launch Claude**
   - Click "$(terminal) Launch Claude" button
   - Terminal opens and runs `claude` command
   - Wait for Claude to start

4. **Test Command**
   - Select "Deploy Shadow Clone" from menu
   - Command is copied to clipboard
   - Paste in Claude terminal
   - Should see: `Load shadow-clone-prompt.md and execute with project_plan=./project-plan.md workspace_dir=./ waves_directory=./.waves/`

5. **Verify Claude Can Access Files**
   When you run the command, Claude should:
   - Load `shadow-clone-prompt.md` from your repo
   - Access `.shadow/` directory for agent configs
   - Create outputs in `.waves/` directory

## Expected Command Format
```
Load shadow-clone-prompt.md and execute with project_plan=./project-plan.md workspace_dir=./ waves_directory=./.waves/
```

## If Issues Occur
- Check Claude has access to `/root/repos/shadow-clone/`
- Ensure `shadow-clone-prompt.md` exists
- Verify `.shadow/` directory contains mode configs
- Check Claude terminal for error messages