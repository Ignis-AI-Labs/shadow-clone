# Admin Portal Deployment & Troubleshooting

## Current Issue: Wallet Authentication Stuck

The admin portal is showing "Sign to Continue" but authentication is not completing. This is likely due to one of these issues:

### 1. API Not Deployed

The admin API needs to be deployed to Cloudflare Pages with Functions. Check deployment status:

```bash
./check-deployment.sh
```

To deploy:
```bash
npm run deploy
```

### 2. Missing Environment Variables

Create `.env.local` file:
```env
NEXT_PUBLIC_ADMIN_API_ENDPOINT=https://admin.ignislabs.ai
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
```

Get a WalletConnect Project ID from: https://cloud.walletconnect.com/

### 3. Debugging Steps

1. **Open Browser Console** (F12) before clicking "Sign Message"
2. Look for console logs showing:
   - API endpoint being used
   - Wallet address
   - Any error messages

3. **Common Errors:**
   - `fetch failed` = API not deployed or CORS issue
   - `HTTP 404` = API routes not configured
   - `User rejected` = You cancelled the MetaMask signature

### 4. Local Testing

To test locally:
```bash
# Terminal 1: Run the API
cd /root/repos/shadow-clone/admin-portal
wrangler dev

# Terminal 2: Run the frontend
npm run dev
```

Then update `.env.local`:
```env
NEXT_PUBLIC_ADMIN_API_ENDPOINT=http://localhost:8787
```

### 5. Verifying Admin Wallet

The admin wallet is hardcoded as:
```
0x4faa0fac32F844ACAF59b5B5a72C0D38de8bd0CD
```

Make sure you're connecting with this exact wallet address.

## Quick Fix Checklist

- [ ] Run `./check-deployment.sh` to verify API is accessible
- [ ] Check browser console for detailed error messages
- [ ] Verify you're using the correct admin wallet
- [ ] Ensure MetaMask is unlocked and on mainnet
- [ ] Create `.env.local` with proper values
- [ ] Deploy with `npm run deploy` if needed