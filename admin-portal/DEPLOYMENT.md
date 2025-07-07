# Admin Portal Deployment Guide

## Current Deployment

The admin portal has been successfully deployed to Cloudflare Pages:

- **Preview URL**: https://96cf0545.shadow-clone-admin-portal.pages.dev
- **Branch URL**: https://dev-testing.shadow-clone-admin-portal.pages.dev

## Setting Up Custom Domain

To use `admin.ignislabs.ai`:

1. **In Cloudflare Dashboard**:
   - Go to Pages → shadow-clone-admin-portal
   - Click "Custom domains" tab
   - Add `admin.ignislabs.ai`
   - Follow DNS setup instructions

2. **Update Environment Variables**:
   - The API endpoint is already configured to use `https://admin.ignislabs.ai`
   - No changes needed in the code

## API Endpoints

The following API endpoints are available:

- `POST /auth/wallet` - Wallet authentication
- `GET /security/analytics` - Get security analytics
- `POST /security/unblock` - Unblock an IP
- `DELETE /security/clear-events` - Clear security events
- `GET /security/event/:id` - Get event details

## Testing the Deployment

1. **Test API Health**:
   ```bash
   curl -I https://admin.ignislabs.ai/auth/wallet -X OPTIONS
   ```

2. **Test Authentication**:
   - Visit https://admin.ignislabs.ai
   - Connect with admin wallet: `0x4faa0fac32F844ACAF59b5B5a72C0D38de8bd0CD`
   - Sign the authentication message

## Monitoring

- Check Cloudflare Pages dashboard for deployment status
- View function logs in Cloudflare dashboard
- Monitor KV namespace usage for sessions and security data

## Updating the Deployment

To deploy updates:

```bash
cd /root/repos/shadow-clone/admin-portal
npm run build
npm run deploy
```

## Environment Variables

The deployment uses these KV namespaces:
- `ADMIN_SESSIONS` - For authentication sessions
- `SECURITY_DATA` - For security monitoring data

No additional configuration needed - these are bound in `wrangler.toml`.