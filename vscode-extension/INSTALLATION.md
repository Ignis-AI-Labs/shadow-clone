# Shadow Clone VS Code Extension - Installation Guide

## Quick Installation Steps

### 1. Build the Extension

```bash
# Navigate to extension directory
cd vscode-extension

# Install dependencies
npm install

# Build for development (with debugging)
npm run compile

# OR build for production (obfuscated)
npm run package:prod
```

### 2. Test with Mock Server

```bash
# Start mock server (in terminal 1)
PORT=3001 node test-server.js

# Test API key: YOUR_API_KEY
```

### 3. Install Extension

**Option A: Development Mode (F5)**
1. Open the `vscode-extension` folder in VS Code
2. Press `F5` to launch a new VS Code window with extension loaded
3. Look for the Shadow Clone icon (🚀) in the activity bar

**Option B: Install VSIX Package**
1. Build: `npm run package:prod`
2. Install: 
   - Command Palette (`Cmd/Ctrl+Shift+P`)
   - Run "Extensions: Install from VSIX"
   - Select `shadow-clone-0.1.0.vsix`

### 4. Configure Extension

1. Open VS Code Settings (`Cmd/Ctrl+,`)
2. Search for "shadow clone"
3. Set API endpoint:
   - For testing: `http://localhost:3001`
   - For production: Your actual API URL

### 5. Authenticate

1. Click Shadow Clone icon in activity bar
2. Click "Authenticate" 
3. Enter API key:
   - Test: Your development API key
   - Production: Your actual API key

## Testing Checklist

- [ ] Extension loads without errors
- [ ] Shadow Clone icon appears in activity bar
- [ ] Authentication works with test key
- [ ] Projects tree view populates
- [ ] Can create a new project
- [ ] Status command shows user info
- [ ] No TypeScript errors in console

## Troubleshooting

### Extension Not Showing
- Check VS Code version (needs 1.74+)
- Look for errors in: Help → Toggle Developer Tools

### Authentication Fails
- Verify mock server is running
- Check API endpoint in settings
- Ensure correct API key

### Build Errors
```bash
# Clean rebuild
rm -rf out node_modules package-lock.json
npm install
npm run compile
```

## Production Deployment

1. **Update version** in `package.json`
2. **Add icon**: 128x128 PNG in `images/icon.png`
3. **Build**: `npm run package:prod`
4. **Verify protection**: `npm run verify:obfuscation`
5. **Distribute**: 
   - Direct: Share `.vsix` file
   - Marketplace: `vsce publish`

## Security Notes

- The production build obfuscates source code
- API keys are stored in VS Code's secure storage
- All proprietary logic remains server-side
- Legal notices are preserved throughout

---

Ready to test! The extension respects all legal notices while providing full Shadow Clone functionality.