# Shadow Clone Admin Portal Setup Guide

## Quick Start

1. **Install dependencies for both projects:**
   ```bash
   # Admin API
   cd admin-api
   npm install
   
   # Admin Portal
   cd ../admin-portal
   npm install
   ```

2. **Run locally for testing:**
   ```bash
   # Terminal 1 - Start admin API
   cd admin-api
   npm run dev
   
   # Terminal 2 - Start admin portal
   cd admin-portal
   npm run dev
   ```

3. **Access the portal:**
   - Open http://localhost:3000
   - Connect your admin wallet (0x4faa0fac32F844ACAF59b5B5a72C0D38de8bd0CD)
   - Sign the authentication message
   - Access the security dashboard

## Integration with Main API

Update the main Shadow Clone API to send events to your admin API:

1. Edit `/cloudflare-worker/src/services/admin-bridge.ts`
2. Set `ADMIN_API_ENDPOINT` to your deployed admin API URL
3. Redeploy the main Shadow Clone worker

## Security Event Types

- **extraction_attempt** - User trying to extract system prompts
- **rate_limit** - User exceeding request limits
- **enumeration** - User scanning for endpoints
- **suspicious_pattern** - Other suspicious behavior

## Admin Actions

- **View Events** - See all security events in real-time
- **Unblock User** - Remove block status from a user
- **Clear Events** - Delete all events for a specific user
- **Auto-refresh** - Set dashboard to update automatically