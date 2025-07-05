# Deploy Admin Portal to Cloudflare Pages

## Prerequisites
- Cloudflare account
- GitHub repository connected

## Pre-Deployment: Create KV Namespaces

Before deploying, create the required KV namespaces:

```bash
# Create KV namespaces
wrangler kv:namespace create "ADMIN_SESSIONS"
wrangler kv:namespace create "SECURITY_DATA"
```

Save the IDs that are returned and update `wrangler.toml`:
- Replace `YOUR_ADMIN_SESSIONS_KV_ID` with the ADMIN_SESSIONS namespace ID
- Replace `YOUR_SECURITY_DATA_KV_ID` with the SECURITY_DATA namespace ID

## Deployment Steps

### 1. Connect GitHub Repository to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to "Workers & Pages" → "Create application" → "Pages"
3. Connect to Git
4. Select the `shadow-clone` repository
5. Select the `dev-testing` branch (or your production branch)

### 2. Configure Build Settings

Set the following build configuration:

- **Framework preset**: Next.js (Static HTML Export)
- **Build command**: `cd admin-portal && npm install && npm run build`
- **Build output directory**: `admin-portal/out`
- **Root directory**: `/` (leave as default)

### 3. Set Environment Variables

Add the following environment variable in Cloudflare Pages settings:

```
NEXT_PUBLIC_ADMIN_API_ENDPOINT = https://admin.ignislabs.ai
```

### 4. Configure KV Bindings

In your Cloudflare Pages project settings:

1. Go to Settings → Functions → KV namespace bindings
2. Add the following bindings:
   - Variable name: `ADMIN_SESSIONS` → Select your ADMIN_SESSIONS KV namespace
   - Variable name: `SECURITY_DATA` → Select your SECURITY_DATA KV namespace

### 5. Deploy

Click "Save and Deploy". The initial build will take a few minutes.

### 6. Custom Domain Setup

Set up the domain `admin.ignislabs.ai`:

1. Go to your Pages project → Custom domains
2. Add `admin.ignislabs.ai`
3. Follow the DNS configuration instructions

## API Endpoints

Once deployed, the following endpoints will be available:

- `POST https://admin.ignislabs.ai/auth/wallet` - Wallet authentication
- `GET https://admin.ignislabs.ai/security/analytics` - Get security dashboard data
- `POST https://admin.ignislabs.ai/security/unblock` - Unblock a user
- `POST https://admin.ignislabs.ai/security/clear-events` - Clear user events
- `POST https://admin.ignislabs.ai/security/event` - Log security events (internal use)

## Testing the Deployment

1. Visit https://admin.ignislabs.ai
2. Connect your admin wallet: `0x4faa0fac32F844ACAF59b5B5a72C0D38de8bd0CD`
3. Sign the authentication message
4. Access the security dashboard

## Updating

To update the admin portal:
1. Push changes to your repository
2. Cloudflare Pages will automatically rebuild and deploy

## Security Notes

- The admin portal is protected by wallet-based authentication
- All API endpoints require a valid admin session token (except /security/event)
- Security events are stored in KV storage with 30-day retention
- Admin sessions expire after 1 hour
- No automatic blocking - all actions require manual admin review