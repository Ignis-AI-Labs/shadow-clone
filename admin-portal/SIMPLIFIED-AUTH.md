# Simplified Admin Portal Authentication

## What Changed

1. **Removed RainbowKit and WalletConnect** - No more placeholder project IDs or unnecessary dependencies
2. **Direct MetaMask Integration** - Simple wallet connection without third-party libraries
3. **Alchemy RPC Configuration** - Using your own RPC endpoint for reliability
4. **Single Wallet Access** - Only `0x4faa0fac32F844ACAF59b5B5a72C0D38de8bd0CD` can authenticate

## Key Files

- `/src/hooks/useSimpleWallet.ts` - Direct MetaMask integration
- `/src/hooks/useAdminAuthSimple.ts` - Simplified authentication logic
- `/src/components/SimpleAdminGuard.tsx` - Clean UI without RainbowKit
- `.env.production` - Contains Alchemy RPC configuration

## Environment Variables

```env
NEXT_PUBLIC_ADMIN_API_ENDPOINT=https://admin.ignislabs.ai
NEXT_PUBLIC_ALCHEMY_API_KEY=idzzW0EzCqqwMPSChegXR
NEXT_PUBLIC_ALCHEMY_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/idzzW0EzCqqwMPSChegXR
```

## Latest Deployment

- URL: https://b2213da4.shadow-clone-admin-portal.pages.dev
- Branch: https://dev-testing.shadow-clone-admin-portal.pages.dev

## Authentication Flow

1. User connects MetaMask (no WalletConnect needed)
2. System checks if wallet matches admin address
3. User signs message to prove ownership
4. Backend validates signature and issues JWT token
5. Token stored in sessionStorage for 1 hour

## Benefits

- No more WalletConnect errors
- No placeholder project IDs
- Direct chain verification
- Simpler, cleaner code
- Faster load times