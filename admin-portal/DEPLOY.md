# Deploy Admin Portal to Cloudflare Pages

## Prerequisites
- Cloudflare account
- Repository connected to Cloudflare Pages

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

### 4. Deploy

Click "Save and Deploy". The initial build will take a few minutes.

### 5. Custom Domain (Optional)

To add a custom domain like `admin.shadowclone.dev`:

1. Go to your Pages project → Settings → Custom domains
2. Add your domain
3. Follow DNS configuration instructions

## Post-Deployment

Once deployed, access your admin portal at:
- Cloudflare Pages URL: `https://shadow-clone-admin.pages.dev` (or your generated URL)
- Custom domain: `https://admin.shadowclone.dev` (if configured)

### Authentication
- Only the configured admin wallet can access the portal
- Wallet address: `0x4faa0fac32F844ACAF59b5B5a72C0D38de8bd0CD`

## Updating

To update the admin portal:
1. Push changes to your repository
2. Cloudflare Pages will automatically rebuild and deploy

## Security Notes

- The admin portal is protected by wallet authentication
- All API calls require a valid admin session token
- Security events are stored in the main worker's KV storage
- No automatic blocking - all actions require manual admin review