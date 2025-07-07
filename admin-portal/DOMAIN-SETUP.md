# Setting Up admin.ignislabs.ai Custom Domain

## Current Status

The admin portal is deployed and accessible at:
- Latest deployment: https://d61696f0.shadow-clone-admin-portal.pages.dev
- Branch URL: https://dev-testing.shadow-clone-admin-portal.pages.dev

## Steps to Add Custom Domain

1. **Log into Cloudflare Dashboard**
2. **Go to Pages** → `shadow-clone-admin-portal`
3. **Click "Custom domains" tab**
4. **Add domain**: Enter `admin.ignislabs.ai`
5. **DNS Configuration**: 
   - Cloudflare will automatically create a CNAME record
   - If `ignislabs.ai` is already in Cloudflare, it will be instant
   - If not, follow the DNS instructions provided

## Verify Domain Setup

Once configured, test:
```bash
# Check if domain resolves
dig admin.ignislabs.ai

# Test API endpoint
curl -I https://admin.ignislabs.ai/auth/wallet -X OPTIONS
```

## Important Notes

- The API endpoints are at the root level (e.g., `/auth/wallet` not `/admin/auth/wallet`)
- Only wallet `0x4faa0fac32F844ACAF59b5B5a72C0D38de8bd0CD` can authenticate
- No WalletConnect project ID needed - we use direct MetaMask connection

## Troubleshooting

If authentication still fails after domain setup:
1. Check browser console for errors
2. Ensure you're using the correct wallet address
3. Clear browser cache and try again
4. The enhanced error messages will show what's failing