# Setting up admin.ignislabs.ai

This guide walks through setting up the Shadow Clone admin dashboard on the custom domain `admin.ignislabs.ai`.

## Prerequisites

1. Domain `ignislabs.ai` is registered and managed
2. Access to DNS settings for the domain
3. Cloudflare account with the domain added
4. Wrangler CLI installed (`npm install -g wrangler`)

## Step 1: DNS Configuration

Add the following DNS record in your domain registrar or Cloudflare:

```
Type: CNAME
Name: admin
Target: shadow-clone-admin.pages.dev
Proxy: Yes (if using Cloudflare)
```

## Step 2: Deploy to Cloudflare Pages

1. Navigate to the admin dashboard directory:
   ```bash
   cd /root/repos/shadow-clone/admin-dashboard
   ```

2. Deploy using the updated deploy script:
   ```bash
   ./deploy.sh
   ```

## Step 3: Configure Custom Domain in Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to Pages → shadow-clone-admin
3. Go to "Custom domains" tab
4. Click "Set up a custom domain"
5. Enter `admin.ignislabs.ai`
6. Follow the verification steps

## Step 4: SSL/TLS Configuration

Cloudflare automatically provides SSL certificates for custom domains. Ensure:

1. SSL/TLS encryption mode is set to "Full" or "Full (strict)"
2. Always Use HTTPS is enabled
3. Automatic HTTPS Rewrites is enabled

## Step 5: Update Configuration Files

The admin dashboard is already configured to work with any domain. However, you may want to update:

1. **API Endpoint** (if needed):
   ```javascript
   const API_ENDPOINT = 'https://api.ignislabs.ai';
   ```

2. **Admin Wallet** (already set):
   ```javascript
   const ADMIN_WALLET = '0x4faa0fac32F844ACAF59b5B5a72C0D38de8bd0CD'.toLowerCase();
   ```

## Future Admin Portal Structure

Since you want to consolidate all admin functions into one page at `admin.ignislabs.ai`, here's a suggested structure:

```
admin.ignislabs.ai/
├── /                          # Main dashboard (current security dashboard)
├── /security                  # Security monitoring and user management
├── /licenses                  # License management and NFT verification
├── /analytics                 # Usage analytics and metrics
├── /billing                   # Subscription and payment management
├── /users                     # User management and profiles
├── /projects                  # Project monitoring and management
├── /logs                      # System logs and audit trail
├── /settings                  # Admin settings and configuration
└── /api-keys                  # API key management
```

## Integration Points

The admin portal can integrate with:

1. **Shadow Clone API** (`api.ignislabs.ai`)
   - Security endpoints
   - License management
   - User data

2. **Ignis Dashboard** 
   - License verification
   - NFT ownership checks
   - Subscription management

3. **Blockchain**
   - Direct NFT verification
   - Wallet authentication
   - On-chain analytics

## Security Considerations

1. **Access Control**:
   - Wallet-based authentication (current)
   - Consider multi-sig for critical operations
   - Role-based access for team members

2. **Audit Logging**:
   - Log all admin actions
   - Store in immutable format
   - Regular security reviews

3. **Rate Limiting**:
   - Implement rate limits on admin endpoints
   - Prevent abuse of admin functions

## Deployment Checklist

- [ ] DNS record created for `admin.ignislabs.ai`
- [ ] Cloudflare Pages deployment successful
- [ ] Custom domain verified in Cloudflare
- [ ] SSL certificate active
- [ ] Test wallet authentication
- [ ] Verify admin functions work
- [ ] Update documentation with new URL

## Testing the Setup

1. Navigate to https://admin.ignislabs.ai
2. Connect with admin wallet
3. Verify all functions work correctly
4. Check SSL certificate is valid

## Maintenance

1. **Regular Updates**:
   - Keep dependencies updated
   - Monitor security advisories
   - Review access logs

2. **Backup**:
   - Regular backups of configuration
   - Document any custom changes
   - Maintain deployment history

## Support

For issues with domain setup:
- Cloudflare Support: https://support.cloudflare.com
- Technical: support@shadow-clone.ai
- Domain: admin@ignislabs.ai