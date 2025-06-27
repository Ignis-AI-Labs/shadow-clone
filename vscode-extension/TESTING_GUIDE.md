# Shadow Clone VS Code Extension - Testing & Installation Guide

## Prerequisites

1. **Node.js** (v16 or higher)
2. **VS Code** (v1.74.0 or higher)
3. **Git** installed

## Setup for Testing

### 1. Install Dependencies

```bash
cd vscode-extension
npm install
```

### 2. Compile the Extension

```bash
# Development build (with source maps, no obfuscation)
npm run compile

# Or watch mode for active development
npm run watch
```

## Testing Methods

### Method 1: Run Extension in Development Mode (Recommended for Testing)

1. Open the `vscode-extension` folder in VS Code
2. Press `F5` or go to Run → Start Debugging
3. A new VS Code window will open with the extension loaded
4. You'll see "Shadow Clone" in the activity bar (rocket icon)

### Method 2: Package and Install Locally

```bash
# Build production version (obfuscated)
npm run build:prod

# Package the extension
npm run package

# This creates shadow-clone-0.1.0.vsix
```

Install the VSIX file:
- Command Palette (`Cmd/Ctrl + Shift + P`)
- Type "Install from VSIX"
- Select the generated `.vsix` file

## Testing Checklist

### 1. Authentication
- [ ] Click Shadow Clone icon in activity bar
- [ ] Try authenticating with a test API key
- [ ] Verify error handling for invalid keys

### 2. Mock API Setup (for testing without backend)

Create a file `vscode-extension/test-server.js`:

```javascript
const express = require('express');
const app = express();
app.use(express.json());

// Mock auth endpoint
app.post('/auth/validate', (req, res) => {
  const { apiKey } = req.body;
  if (apiKey === 'test-key-123') {
    res.json({
      valid: true,
      userId: '123',
      licenseType: 'pioneer'
    });
  } else {
    res.status(401).json({ valid: false });
  }
});

// Mock projects endpoint
app.get('/projects', (req, res) => {
  res.json([
    {
      id: '1',
      name: 'Test Project',
      status: 'active',
      description: 'A test project',
      createdAt: new Date()
    }
  ]);
});

// Mock user profile
app.get('/user/profile', (req, res) => {
  res.json({
    id: '123',
    licenseType: 'pioneer',
    activeProjects: 2,
    totalDeployments: 5
  });
});

// Mock credits
app.get('/credits/balance', (req, res) => {
  res.json({ balance: 50.00 });
});

app.listen(3000, () => {
  console.log('Mock API server running on http://localhost:3000');
});
```

Run the mock server:
```bash
node test-server.js
```

Update extension settings to use local API:
- Open VS Code settings (`Cmd/Ctrl + ,`)
- Search for "shadow clone"
- Set `shadowClone.apiEndpoint` to `http://localhost:3000`

### 3. Test Features

- [ ] **Create Project**: Try creating a new project
- [ ] **View Projects**: Check if projects appear in sidebar
- [ ] **Status Command**: Run "Shadow Clone: Show Project Status"
- [ ] **Deploy Agents**: Test deployment UI (will fail without real backend)

## Verify Source Protection

```bash
# Build production version
npm run build:prod

# Check obfuscation
npm run verify:obfuscation

# Look at the output file
cat out/extension.js | head -n 50
```

You should see obfuscated code, not readable source.

## Troubleshooting

### Extension Not Loading
1. Check VS Code version (needs 1.74+)
2. Look at Debug Console for errors
3. Ensure all dependencies installed

### API Connection Issues
1. Check `shadowClone.apiEndpoint` setting
2. Verify network connectivity
3. Check browser console for CORS errors

### Build Errors
```bash
# Clean and rebuild
rm -rf out node_modules package-lock.json
npm install
npm run compile
```

## Distribution Testing

### Create Production Package
```bash
# Full production build
npm run package:prod

# Creates: shadow-clone-0.1.0.vsix
```

### Test Installation
1. Uninstall any development version
2. Install the VSIX file
3. Restart VS Code
4. Verify all features work

## Security Testing

1. **Check No Secrets**: Ensure no API keys in code
2. **Verify Obfuscation**: Production build should be unreadable
3. **Test Auth Flow**: Credentials should use VS Code secret storage
4. **Network Inspection**: All requests should have proper auth headers

## Next Steps

Once testing is complete:

1. **Update Version**: Edit `package.json` version
2. **Add Icon**: Place 128x128 PNG in `images/icon.png`
3. **Update README**: Add screenshots and better docs
4. **Publish**: 
   - Private: Share VSIX file directly
   - Public: Publish to VS Code Marketplace

## Sample Test Workflow

```bash
# 1. Start in extension directory
cd vscode-extension

# 2. Install and build
npm install
npm run compile

# 3. Open in VS Code
code .

# 4. Press F5 to test

# 5. When ready, create production build
npm run package:prod
```

The extension is now ready for testing!