# Quick Test in VS Code

## If F5 isn't working, try this:

### 1. Check Extension is Loaded
Open Command Palette (Ctrl+Shift+P) and type:
- "Shadow Clone"
- You should see these commands:
  - Shadow Clone: Create New Project
  - Shadow Clone: Deploy AI Agents  
  - Shadow Clone: Show Project Status
  - Shadow Clone: Authenticate

### 2. Manual Extension Installation
If F5 still doesn't work, build and install manually:

```bash
# In terminal (in the extension folder)
npm run package
```

This creates `shadow-clone-0.1.0.vsix`

Then in VS Code:
1. Ctrl+Shift+P → "Extensions: Install from VSIX"
2. Select the `.vsix` file
3. Reload VS Code
4. The extension should now be installed

### 3. Check for Errors
- View → Output → Select "Extension Host" from dropdown
- Help → Toggle Developer Tools → Console tab

### 4. Expected Behavior
When the extension loads correctly:
- You'll see a rocket icon (🚀) in the activity bar
- Commands will be available in Command Palette
- Status bar will show "🚀 Shadow Clone"

### 5. Configuration Needed
Once loaded, configure the API endpoint:
1. Open Settings (Ctrl+,)
2. Search for "shadow clone"  
3. Set `Shadow Clone: Api Endpoint` to `http://localhost:3001`

### Common Issues:
- **No launch.json**: Now fixed ✓
- **Wrong folder**: Make sure VS Code is opened in `/root/repos/shadow-clone/vscode-extension`
- **Extension not compiled**: Run `npm run compile` first
- **Port conflict**: Our test server is on 3001, not 3000