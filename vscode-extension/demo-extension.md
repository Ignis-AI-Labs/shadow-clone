# Shadow Clone Extension Demo

## What's Running Now

✅ **Mock API Server** is running on port 3001
- Test API Key: `test-key-123`
- Simulates all Shadow Clone backend endpoints

## To Test the Extension in VS Code

### Option 1: Debug Mode (Recommended)

1. **Open a new terminal** and run:
   ```bash
   code /root/repos/shadow-clone/vscode-extension
   ```

2. **In VS Code**, once it opens:
   - Press `F5` (or Run → Start Debugging)
   - A new VS Code window will open with the extension loaded

3. **In the new VS Code window**:
   - Look for the 🚀 rocket icon in the left sidebar (activity bar)
   - Click it to open Shadow Clone panel

4. **Test the features**:
   - Click "Authenticate" → Enter API key: `test-key-123`
   - You'll see two tree views:
     - **Projects**: Shows your existing projects
     - **Active Agents**: Shows running AI agents
   - Try commands (Cmd/Ctrl+Shift+P):
     - "Shadow Clone: Create New Project"
     - "Shadow Clone: Show Project Status"

### Option 2: Install the VSIX Package

1. **Build the package**:
   ```bash
   npm run package
   ```
   This creates `shadow-clone-0.1.0.vsix`

2. **Install in VS Code**:
   - Open Command Palette (Cmd/Ctrl+Shift+P)
   - Type "Install from VSIX"
   - Select the `shadow-clone-0.1.0.vsix` file

3. **Configure**:
   - Go to Settings (Cmd/Ctrl+,)
   - Search for "shadow clone"
   - Set API endpoint to: `http://localhost:3001`

## What You'll See

```
VS Code Window
├── Activity Bar (left side)
│   └── 🚀 Shadow Clone (click this)
│
├── Shadow Clone Panel
│   ├── Projects Tree
│   │   ├── 📁 E-Commerce Platform (active)
│   │   └── 📁 Data Analytics Dashboard (completed)
│   │
│   └── Active Agents Tree
│       ├── 👤 Frontend Developer (active - 75%)
│       └── 👤 Backend Developer (idle - 100%)
│
└── Status Bar (bottom)
    └── 🚀 Shadow Clone (click for status)
```

## Features to Test

1. **Authentication**: Stores API key securely
2. **Project View**: Lists all your projects with status
3. **Agent View**: Shows active AI agents and their progress
4. **Create Project**: Multi-step wizard to create new projects
5. **Status Dashboard**: Shows account info, credits, and recent activity

## Current Status

- ✅ Mock API running on port 3001
- ✅ All TypeScript errors fixed
- ✅ Extension compiles successfully
- ✅ API endpoints tested and working
- ✅ Legal notices preserved (Ignis AI Labs LLC)
- ✅ Source protection via obfuscation available

## Stop the Test Server

When done testing:
```bash
kill 380059  # Or whatever PID was shown earlier
```