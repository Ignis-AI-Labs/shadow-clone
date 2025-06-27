# Shadow Clone VS Code Extension - Cloudflare Setup

## Configuration

To use Shadow Clone with your Cloudflare Worker endpoint:

1. **Install the Extension**
   - In VS Code, go to Extensions view (Ctrl+Shift+X)
   - Click the "..." menu and select "Install from VSIX..."
   - Select `shadow-clone-0.1.0.vsix`

2. **Configure API Endpoint**
   - Open VS Code Settings (Ctrl+,)
   - Search for "shadow clone"
   - Set `Shadow Clone: Api Endpoint` to your Cloudflare Worker URL
   
   OR add to your settings.json:
   ```json
   {
     "shadowClone.apiEndpoint": "https://your-worker.your-subdomain.workers.dev"
   }
   ```

3. **Authenticate**
   - Click the "$(key) Authenticate" button in status bar
   - Enter your Shadow Clone API key
   - You should see "$(check) License Active"

## API Endpoints Required

Your Cloudflare Worker should implement these endpoints:

- `POST /auth/validate` - Validate API key
  ```json
  // Request
  {
    "apiKey": "sk-..."
  }
  
  // Response
  {
    "valid": true,
    "userId": "user123",
    "licenseType": "pioneer" // or "ignis_elite", "builder", "reserve"
  }
  ```

- `GET /user/profile` - Get user profile (requires X-API-Key header)
- `GET /user/license-status` - Get license details (requires X-API-Key header)
- `GET /projects` - List user's projects (requires X-API-Key header)
- `POST /projects` - Create new project (requires X-API-Key header)
- `GET /projects/:id/deployments` - Get project deployments (requires X-API-Key header)
- `POST /projects/:id/deploy` - Deploy agents (requires X-API-Key header)

## Environment Variables (Optional)

You can also set the API endpoint via environment variable:
```bash
export SHADOW_CLONE_API=https://your-worker.your-subdomain.workers.dev
```

## WebSocket Support (Future)

For real-time updates, the extension expects WebSocket at:
- `wss://your-worker.your-subdomain.workers.dev/ws`

This will be used for deployment progress tracking.