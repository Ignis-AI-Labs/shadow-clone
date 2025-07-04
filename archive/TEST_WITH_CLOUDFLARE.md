# Testing Shadow Clone with Cloudflare Worker

## Quick Setup

1. **Install the Extension**
   - In VS Code: Extensions → "..." menu → "Install from VSIX..."
   - Select `shadow-clone-0.1.0.vsix`

2. **The extension is pre-configured** to use your Cloudflare Worker:
   - API Endpoint: `https://shadow-clone-api.elijah-02b.workers.dev`
   - No additional configuration needed!

3. **Test Authentication**
   - Look for the status bar items (bottom right):
     - "$(key) Authenticate" button (yellow background)
     - "$(rocket) Shadow Clone" button
     - "$(terminal) Launch Claude" button
   
   - Click "$(key) Authenticate"
   - Enter your API key
   - Should change to "$(check) License Active"

## Testing Features

### 1. Check Status
- Click "$(rocket) Shadow Clone" in status bar
- Should show:
  - User: test@example.com
  - License: Pioneer
  - Active projects

### 2. Create Project
- Open Command Palette (Cmd/Ctrl+Shift+P)
- Run "Shadow Clone: Create New Project"
- Fill in project details

### 3. View Projects
- Check the Shadow Clone sidebar
- Should show your created projects

### 4. Launch Claude
- Click "$(terminal) Launch Claude" 
- Select a command template
- Paste into Claude Code

## Troubleshooting

**Can't see status bar items?**
- Reload VS Code window (Cmd/Ctrl+R)
- Check Developer Tools console (Help → Toggle Developer Tools)

**Authentication fails?**
- Verify API endpoint in settings
- Check if Cloudflare Worker is running:
  ```bash
  curl https://shadow-clone-api.elijah-02b.workers.dev/auth/validate \
    -H 'Content-Type: application/json' \
    -d '{"apiKey": "YOUR_API_KEY"}'
  ```

**Want to use a different API key?**
- Sign out: Command Palette → "Shadow Clone: Sign Out"
- Re-authenticate with new key