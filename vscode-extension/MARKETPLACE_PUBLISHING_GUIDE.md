# VS Code Marketplace Publishing Guide

## Prerequisites

1. **Azure DevOps Account** (Required for publisher account)
   - Go to https://dev.azure.com/
   - Sign in with Microsoft account
   - Create organization if needed

2. **Personal Access Token**
   - Navigate to https://dev.azure.com/
   - Click user settings (top right) → Personal Access Tokens
   - Click "New Token"
   - Name: "vscode-marketplace"
   - Organization: Select "All accessible organizations"
   - Scopes: Custom defined → Marketplace → Check all boxes
   - Create and save token securely

3. **VS Code Extension CLI (vsce)**
   ```bash
   npm install -g @vscode/vsce
   ```

## Step 1: Create Publisher

```bash
# Create publisher account
vsce create-publisher <publisher-name>

# Example for Shadow Clone/Ignis Labs:
vsce create-publisher ignislabs
# or
vsce create-publisher shadow-clone
```

You'll be prompted for:
- Publisher display name
- Email
- Personal Access Token (from Azure DevOps)

## Step 2: Prepare Extension Manifest

Update `package.json` with marketplace metadata:

```json
{
  "publisher": "ignislabs",
  "icon": "resources/icon.png",
  "galleryBanner": {
    "color": "#1e1e1e",
    "theme": "dark"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/ignislabs/shadow-clone"
  },
  "homepage": "https://shadow-clone.ai",
  "bugs": {
    "url": "https://github.com/ignislabs/shadow-clone/issues"
  },
  "keywords": [
    "ai",
    "claude",
    "agent",
    "automation",
    "shadow-clone"
  ],
  "categories": [
    "Programming Languages",
    "Machine Learning",
    "Other"
  ],
  "badges": [
    {
      "url": "https://img.shields.io/badge/license-proprietary-blue",
      "href": "https://shadow-clone.ai/license",
      "description": "License"
    }
  ]
}
```

## Step 3: Create Extension Icon

Create a 128x128 PNG icon at `resources/icon.png`:
- Use Shadow Clone or Ignis Labs branding
- Ensure good contrast on dark backgrounds
- Keep it simple and recognizable at small sizes

## Step 4: Update README

The marketplace uses `README.md` as the main description. Update it with:
- Clear description of Shadow Clone
- Installation instructions
- Usage examples
- Requirements (API key, etc.)
- Links to documentation

## Step 5: Create CHANGELOG

Create `CHANGELOG.md` to track version history:

```markdown
# Change Log

## [0.1.0] - 2025-06-28
### Added
- Initial release
- Claude session tracking
- API integration
- Security monitoring
- Command injection tools
```

## Step 6: Package Extension

```bash
cd vscode-extension

# Package extension
vsce package

# This creates shadow-clone-0.1.0.vsix
```

## Step 7: Test VSIX Locally

```bash
# Install from VSIX
code --install-extension shadow-clone-0.1.0.vsix

# Test all features
# Uninstall after testing
code --uninstall-extension ignislabs.shadow-clone
```

## Step 8: Publish to Marketplace

```bash
# Login to publisher account
vsce login ignislabs

# Publish extension
vsce publish

# Or publish specific version
vsce publish 0.1.0

# Or package and publish in one command
vsce publish --packagePath shadow-clone-0.1.0.vsix
```

## Step 9: Marketplace Management

After publishing:
1. Visit https://marketplace.visualstudio.com/manage/publishers/ignislabs
2. Update extension details
3. Add screenshots
4. Monitor reviews and ratings
5. Respond to user issues

## Important Considerations

### 1. **API Key Security**
- Never include API keys in the extension
- Use secure storage (SecretStorage API)
- Provide clear instructions for obtaining keys

### 2. **License Verification**
- Extension should verify Shadow Clone license
- Handle expired/invalid licenses gracefully
- Link to purchase page for non-licensed users

### 3. **Update Process**
```bash
# Update version in package.json
# Update CHANGELOG.md
# Then:
vsce publish patch  # 0.1.0 → 0.1.1
vsce publish minor  # 0.1.0 → 0.2.0
vsce publish major  # 0.1.0 → 1.0.0
```

### 4. **Extension Naming**
Choose between:
- "Shadow Clone" - Main brand
- "Shadow Clone for VS Code" - More descriptive
- "Shadow Clone AI Agent Orchestrator" - Full description

### 5. **Required Files Checklist**
- [ ] package.json (with publisher info)
- [ ] README.md (marketplace description)
- [ ] CHANGELOG.md (version history)
- [ ] LICENSE (or LICENSE.md)
- [ ] resources/icon.png (128x128)
- [ ] .vscodeignore (exclude unnecessary files)

## Quick Publishing Commands

```bash
# First time setup
npm install -g @vscode/vsce
vsce create-publisher ignislabs

# Publishing workflow
cd vscode-extension
vsce package
vsce publish

# Update existing extension
vsce publish patch
```

## Marketplace URL

Once published, the extension will be available at:
```
https://marketplace.visualstudio.com/items?itemName=ignislabs.shadow-clone
```

Users can install directly from VS Code:
1. Open Extensions view (Ctrl+Shift+X)
2. Search for "Shadow Clone"
3. Click Install

## Support & Analytics

- Monitor installation count
- Respond to reviews
- Track issues on GitHub
- Update based on user feedback

## Next Steps

1. Create publisher account
2. Add icon and screenshots
3. Test VSIX package thoroughly
4. Publish to marketplace
5. Announce to community