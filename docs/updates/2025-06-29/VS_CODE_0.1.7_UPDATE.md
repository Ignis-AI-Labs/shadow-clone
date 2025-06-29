# VS Code Extension v0.1.7 - License Status Fix

## What's Fixed

The VS Code extension now properly checks license status using the Ignis Dashboard API endpoints.

### Changes Made:

1. **Updated Status Command**
   - Now calls `/shadow_clone_licenses` endpoint (as shown in your Cloudflare dashboard)
   - Properly handles the license data returned by Ignis API
   - Shows accurate license status (active/inactive)

2. **Removed Old Endpoints**
   - ❌ Removed: `/user/profile`
   - ❌ Removed: `/user/license-status`  
   - ❌ Removed: `/projects`
   - ✅ Added: `/shadow_clone_licenses`

3. **License Status Detection**
   - Checks `is_active` field from the license data
   - Properly identifies license types (tripleOG, doubleOG, singleOG, ignisElite)
   - Shows appropriate features based on license tier

## Installation

```bash
code --install-extension shadow-clone-0.1.7.vsix
```

## How It Works Now

1. When you run "Shadow Clone: Show Status"
2. It calls `GET https://api.ignislabs.ai/shadow_clone_licenses`
3. Finds your license using your API key
4. Shows whether your license is active
5. Displays your license tier and features

## Testing

After installing v0.1.7:
1. Authenticate with your API key
2. Run "Shadow Clone: Show Status" 
3. It should now properly show your license status

The extension will correctly identify if your license is active or inactive based on the Ignis Dashboard data.