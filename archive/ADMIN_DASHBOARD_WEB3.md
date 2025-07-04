# Web3 Admin Dashboard Deployment Guide

## Overview

The Shadow Clone Admin Dashboard now supports Web3 wallet authentication, allowing secure access using your Ethereum wallet instead of API keys.

## Features

- **Wallet Authentication**: Sign in with MetaMask or any Web3 wallet
- **Single Admin Access**: Only the configured admin wallet can access
- **Session Management**: 1-hour secure sessions with signed messages
- **Full Admin Controls**: Unblock users, clear events, view analytics

## Configuration

### Admin Wallet

The admin wallet is currently configured as:
```
0x4faa0fac32F844ACAF59b5B5a72C0D38de8bd0CD
```

To change this, update the `ADMIN_WALLET` constant in:
- `/cloudflare-worker/src/handlers/admin-wallet.ts`
- `/admin-dashboard-web3.html`

## Deployment Steps

### 1. Deploy Cloudflare Worker

The worker has been updated with wallet authentication endpoints:

```bash
cd cloudflare-worker
npm install  # Ensure ethers is installed
./deploy.sh
```

New endpoints added:
- `POST /admin/auth/wallet` - Authenticate with wallet signature

### 2. Host Admin Dashboard

The admin dashboard (`admin-dashboard-web3.html`) needs to be hosted on a secure domain.

Options:
1. **Cloudflare Pages** (Recommended)
2. **GitHub Pages** 
3. **Any static hosting with HTTPS**

### 3. Access the Dashboard

1. Navigate to your hosted dashboard URL
2. Click "Connect Wallet"
3. Select your admin wallet in MetaMask
4. Sign the authentication message
5. Dashboard will load automatically

## How It Works

### Authentication Flow

1. **Connect Wallet**: User connects MetaMask
2. **Check Authorization**: Frontend verifies wallet is admin
3. **Sign Message**: User signs timestamped message
4. **Backend Verification**: 
   - Verifies signature matches wallet
   - Checks wallet is authorized admin
   - Generates session token
5. **Session Token**: Used for all API calls (1 hour expiry)

### Security Features

- **Signature Verification**: Uses ethers.js to verify wallet ownership
- **Timestamp Validation**: Messages expire after 5 minutes
- **Session Tokens**: Temporary tokens instead of permanent API keys
- **Single Admin**: Only one wallet has access

## API Changes

All admin endpoints now support dual authentication:
- `X-API-Key`: Traditional API key auth (still supported)
- `X-Admin-Token`: New wallet session token

This allows backward compatibility while adding wallet auth.

## Frontend Integration

The dashboard automatically:
- Detects MetaMask installation
- Handles account switching
- Manages session tokens
- Shows appropriate error messages

## Troubleshooting

### "Please install MetaMask"
- Install MetaMask browser extension
- Refresh the page

### "Unauthorized Access"
- Ensure you're using the correct admin wallet
- Check wallet address in console

### "Message expired"
- Sign the message within 5 minutes
- Try connecting again

### "Failed to authenticate"
- Check browser console for errors
- Ensure Cloudflare Worker is deployed
- Verify API endpoint is correct

## Future Enhancements

1. **Multiple Admin Wallets**: Support admin team
2. **Role-Based Access**: Different permissions per wallet
3. **Audit Logging**: Track all admin actions
4. **Hardware Wallet Support**: Ledger/Trezor integration
5. **ENS Support**: Use ENS names instead of addresses

## Security Notes

- Never share your admin wallet private key
- Always verify the domain before signing messages
- Session tokens expire after 1 hour
- All admin actions are logged

## Support

For issues or questions:
- Technical: support@shadow-clone.ai
- Security: security@shadow-clone.ai