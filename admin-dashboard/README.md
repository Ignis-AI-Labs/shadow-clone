# Shadow Clone Admin Portal

Centralized admin dashboard for all Shadow Clone and Ignis Labs operations at `admin.ignislabs.ai`.

## Current Features

### Security Dashboard
- Real-time security monitoring
- User blocking/unblocking
- Security event management
- Suspicious activity tracking

## Authentication

- **Web3 Wallet Auth**: MetaMask integration
- **Admin Wallet**: `0x4faa0fac32F844ACAF59b5B5a72C0D38de8bd0CD`
- **Session Management**: 1-hour secure tokens

## Deployment

```bash
./deploy.sh
```

This deploys to Cloudflare Pages and will be available at:
- Development: `https://shadow-clone-admin.pages.dev`
- Production: `https://admin.ignislabs.ai`

## Future Modules

### 1. License Management (`/licenses`)
- NFT holder verification
- License activation/deactivation
- Subscription management
- License transfer approvals

### 2. User Management (`/users`)
- User profiles and details
- API key management
- Usage statistics per user
- Account status management

### 3. Analytics Dashboard (`/analytics`)
- System-wide usage metrics
- Revenue analytics
- User activity patterns
- Performance monitoring

### 4. Billing & Subscriptions (`/billing`)
- Stripe integration
- Subscription status
- Payment history
- Invoice management

### 5. Project Monitoring (`/projects`)
- Active Shadow Clone projects
- Resource usage per project
- Project success rates
- Error tracking

### 6. System Logs (`/logs`)
- Audit trail
- API access logs
- Security events
- System errors

### 7. Settings (`/settings`)
- System configuration
- Feature flags
- Rate limit adjustments
- Notification preferences

### 8. API Management (`/api-keys`)
- Generate admin API keys
- Revoke compromised keys
- Usage tracking per key
- Rate limit configuration

## Architecture

```
admin.ignislabs.ai/
├── index.html          # Main portal with navigation
├── security/           # Current security dashboard
├── licenses/           # License management (future)
├── users/              # User management (future)
├── analytics/          # Analytics dashboard (future)
├── billing/            # Billing management (future)
├── projects/           # Project monitoring (future)
├── logs/               # System logs (future)
├── settings/           # Admin settings (future)
└── api-keys/           # API key management (future)
```

## Development

### Adding New Modules

1. Create new directory for the module
2. Add navigation link in main index.html
3. Implement wallet authentication check
4. Connect to appropriate API endpoints
5. Follow existing UI/UX patterns

### UI Components

- Dark theme with Ignis green (#00ff88) accent
- Consistent card-based layouts
- Real-time data updates
- Responsive design

### Security

- All modules require wallet authentication
- Session tokens for API calls
- Audit logging for all actions
- Rate limiting on sensitive operations

## API Integration

The admin portal connects to:

1. **Shadow Clone API** (`api.ignislabs.ai`)
   - `/admin/*` endpoints
   - Requires admin authentication

2. **Blockchain**
   - Direct contract calls for NFT verification
   - Wallet signature verification

3. **External Services**
   - Stripe (future)
   - Analytics services (future)
   - Monitoring tools (future)

## Contributing

When adding new features:
1. Maintain consistent authentication flow
2. Use existing UI components
3. Add proper error handling
4. Include loading states
5. Document new endpoints

## Support

- Technical: support@shadow-clone.ai
- Security: security@shadow-clone.ai
- Admin: admin@ignislabs.ai