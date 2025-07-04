# Quick Deployment Guide - Admin Portal

Since Cloudflare is already connected to your account, deployment is straightforward.

## 1. Deploy the Admin Portal

```bash
cd admin-dashboard
./deploy.sh
```

This will create/update the Cloudflare Pages project `shadow-clone-admin`.

## 2. Add Custom Domain (One-time setup)

After first deployment:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Pages**
2. Click on `shadow-clone-admin` project
3. Go to **Custom domains** tab
4. Click **Set up a custom domain**
5. Type `admin.ignislabs.ai` and click **Continue**
6. Cloudflare will automatically:
   - Add the CNAME record
   - Provision SSL certificate
   - Enable the domain

## 3. Verify Deployment

The portal will be available at:
- **Production**: https://admin.ignislabs.ai
- **Preview**: https://shadow-clone-admin.pages.dev

## That's it!

Since you already have:
- ✅ Cloudflare account connected
- ✅ Domain managed by Cloudflare
- ✅ Wrangler CLI configured

The deployment should complete in under 2 minutes.

## First Time Access

1. Navigate to https://admin.ignislabs.ai
2. Connect your admin wallet: `0x4faa0fac32F844ACAF59b5B5a72C0D38de8bd0CD`
3. Sign the authentication message
4. Access the portal!

## Updating the Portal

Any time you make changes:
```bash
cd admin-dashboard
./deploy.sh
```

Changes will be live in ~30 seconds.