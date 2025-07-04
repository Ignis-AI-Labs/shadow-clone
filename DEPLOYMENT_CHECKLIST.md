# Shadow Clone Deployment Checklist

## Pre-Deployment Steps Completed ✅

1. **Security Updates**
   - [x] Made extraction patterns more specific to reduce false positives
   - [x] Reduced penalty scores for security events (25→15 for extraction, 15→10 for enumeration)
   - [x] Increased enumeration thresholds (3→5 patterns, 10→20 paths)
   - [x] Created admin documentation for removing false restrictions
   - [x] Updated admin dashboard to use Ignis API endpoint

2. **API Endpoint Configuration**
   - [x] Updated all {API_ENDPOINT} placeholders to https://api.ignislabs.ai
   - [x] Changed references from "Cloudflare API" to "Ignis API"
   - [x] Verified shadow-clone-prompt.md in .shadow/ directory

3. **Build Artifacts**
   - [x] VS Code Extension compiled successfully
   - [x] VS Code Extension packaged: `shadow-clone-0.3.2.vsix`
   - [x] File size: 540.66KB

## Deployment Steps Required

### 1. Cloudflare Worker Deployment
```bash
cd cloudflare-worker
# Create .env file with CLOUDFLARE_API_TOKEN
./deploy.sh
```

### 2. VS Code Extension Publication
- Upload `vscode-extension/shadow-clone-0.3.2.vsix` to VS Code Marketplace
- Or distribute directly to users for manual installation

### 3. Ignis API Integration
Ensure the following endpoints are available at https://api.ignislabs.ai:
- `/api/prompts/shadow-clone` - Main orchestrator prompt
- `/api/prompts/modes/*` - Mode configurations
- `/api/prompts/agent-rules/*` - Agent behavioral rules
- `/api/prompts/coordination-rules/*` - System coordination rules
- `/api/prompts/templates/*` - System templates
- `/api/prompts/execution-phases/*` - Execution phase details
- `/api/prompts/documentation/*` - System documentation

### 4. Security Configuration
The security system has been adjusted to reduce false positives:
- Extraction patterns require specific keywords like "verbatim", "hidden", "raw"
- Reduced penalty scores for various events
- Increased thresholds for enumeration detection

Admin tools are available to remove false restrictions:
- Admin Dashboard: `/admin-dashboard.html`
- API Endpoints: `/admin/security/unblock` and `/admin/security/clear-events`

### 5. Testing
- [ ] Test VS Code extension with valid API key
- [ ] Verify prompts load from Ignis API
- [ ] Test that legitimate Shadow Clone usage doesn't trigger security alerts
- [ ] Verify admin can unblock falsely flagged users
- [ ] Confirm rate limiting still works for actual suspicious behavior

## Post-Deployment Verification

1. **API Health Check**
   ```bash
   curl -X GET https://api.ignislabs.ai/api/prompts/shadow-clone \
     -H "X-API-Key: YOUR_API_KEY"
   ```

2. **Extension Verification**
   - Install extension in VS Code
   - Enter API key
   - Run "Shadow Clone: Load Project"
   - Verify prompts load correctly

3. **Security Verification**
   - Test normal Shadow Clone operations
   - Verify legitimate usage doesn't increase suspicion scores
   - Test admin unblock functionality
   - Verify actual malicious patterns still trigger alerts

## Important Notes

- The old Cloudflare Worker endpoint (shadow-clone-api.elijah-02b.workers.dev) is deprecated
- All prompts should be served from https://api.ignislabs.ai
- VS Code extension expects the Ignis API format for responses
- Keep CONSTITUTION.md updated with any deployment changes