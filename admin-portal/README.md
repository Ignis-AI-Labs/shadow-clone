# Shadow Clone Admin Portal

Modern Next.js admin dashboard for Ignis Labs with RainbowKit wallet authentication.

## Features

- 🌈 **RainbowKit Integration**: Beautiful wallet connection UI
- 🔐 **Secure Authentication**: Wallet-based admin authentication
- ⚡ **Next.js 14**: Fast, modern React framework
- 🎨 **Tailwind CSS**: Custom Ignis theme
- 📊 **Real-time Dashboard**: Live security monitoring
- 🚀 **Cloudflare Pages**: Edge deployment ready

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- RainbowKit v2
- Wagmi v2
- Tailwind CSS
- Cloudflare Pages

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   # Add your WalletConnect project ID
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

## Deployment

### Cloudflare Pages

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Cloudflare:
   ```bash
   wrangler pages deploy out --project-name=shadow-clone-admin-portal
   ```

3. Add custom domain in Cloudflare Dashboard

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout with providers
│   ├── page.tsx        # Home page (portal hub)
│   └── security/       # Security dashboard
├── components/         # React components
│   ├── AdminGuard.tsx  # Auth protection wrapper
│   ├── Header.tsx      # Navigation header
│   └── PortalCard.tsx  # Module cards
├── hooks/              # Custom React hooks
│   └── useAdminAuth.ts # Admin authentication hook
└── utils/              # Utility functions
```

## Authentication Flow

1. User connects wallet via RainbowKit
2. System checks if wallet matches admin address
3. User signs authentication message
4. Backend verifies signature and issues session token
5. Token used for all API calls

## Security

- Only the configured admin wallet can access
- Session tokens expire after 1 hour
- All API calls require authentication
- No sensitive data in client code

## Adding New Modules

1. Create new directory in `src/app/[module-name]`
2. Add page.tsx with AdminGuard wrapper
3. Update portal grid in home page
4. Implement API integration

## Environment Variables

- `NEXT_PUBLIC_API_ENDPOINT`: Backend API URL
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: For RainbowKit
- `NEXT_PUBLIC_ADMIN_WALLET`: Admin wallet address (optional)

## Support

- Technical: support@shadow-clone.ai
- Admin: admin@ignislabs.ai