# Shadow Clone VS Code Extension - Testing Setup

## Quick Start

1. **Install the Extension**
   - In VS Code, go to Extensions view (Ctrl+Shift+X)
   - Click the "..." menu and select "Install from VSIX..."
   - Select `shadow-clone-0.1.0.vsix`

2. **Configure for Local Testing**
   - Open VS Code Settings (Ctrl+,)
   - Search for "shadow clone"
   - Set `Shadow Clone: Api Endpoint` to `http://localhost:3000`
   
   OR add to your settings.json:
   ```json
   {
     "shadowClone.apiEndpoint": "http://localhost:3000"
   }
   ```

3. **Start Test Server** (if not already running)
   ```bash
   cd vscode-extension
   node test-server.js
   ```
   Server runs on http://localhost:3000

4. **Authenticate**
   - Click the "$(key) Authenticate" button in status bar
   - Enter your API key
   - You should see "$(check) License Active"

## Test Server Details

- **Test API Key**: Use your development API key
- **Test User**: Pioneer license type
- **Mock Data**: 2 sample projects with deployments

## Troubleshooting

1. **Authentication fails**
   - Check VS Code Developer Tools (Help > Toggle Developer Tools)
   - Verify API endpoint is set to `http://localhost:3000`
   - Ensure test server is running

2. **No status bar buttons**
   - Reload VS Code window (Ctrl+R in VS Code)
   - Check console for activation errors

3. **Connection errors**
   - Test server might have crashed
   - Restart with: `node test-server.js`