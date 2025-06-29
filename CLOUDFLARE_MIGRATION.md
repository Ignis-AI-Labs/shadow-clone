# Cloudflare Worker Migration to Ignis Dashboard API

## Important: Migration Complete

As of 2025-06-29, Shadow Clone has fully migrated from the standalone Cloudflare Worker to the integrated Ignis Dashboard API.

### Old API (Deprecated - DO NOT USE)
- **URL**: `https://shadow-clone-api.elijah-02b.workers.dev`
- **Status**: DEPRECATED - This should be removed from Cloudflare

### New API (Production)
- **URL**: `https://api.ignislabs.ai`
- **Endpoints**:
  - `/shadow-clone-licenses/validate` - License validation
  - `/shadow-clone-licenses/create` - Create new licenses
  - `/shadow-clone-licenses/regenerate` - Regenerate API keys

## Migration Steps Completed

1. ✅ VS Code Extension updated to use new API (v0.1.6)
2. ✅ Test credentials removed from all systems
3. ✅ Documentation updated with new endpoints
4. ✅ License types updated to match Ignis system:
   - `tripleOG` - All three phases
   - `doubleOG` - Phase 1
   - `singleOG` - Phase 2
   - `ignisElite` - Phase 3

## Removing the Old Cloudflare Worker

To completely remove the old worker from Cloudflare:

```bash
# 1. List all workers
wrangler list

# 2. Delete the old worker
wrangler delete shadow-clone-api

# 3. Confirm deletion in Cloudflare dashboard
```

## Admin Account Creation

Admin accounts are now managed through the Ignis Dashboard. To create an admin account:

1. Access the Ignis Dashboard admin panel
2. Use the tripleOG license type for full admin access
3. Generate API keys through the dashboard interface

## Security Notes

- All test credentials have been removed
- No hardcoded API keys exist in the codebase
- All authentication goes through the Ignis Dashboard
- NFT verification is handled by the Ignis system

## For Developers

When working with Shadow Clone:
- Always use `https://api.ignislabs.ai` as the API endpoint
- Get API keys from the Ignis Dashboard
- Test with actual NFT holder wallets (or test addresses configured in Ignis)
- Never commit API keys to the repository