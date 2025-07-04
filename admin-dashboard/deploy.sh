#!/bin/bash

# Shadow Clone Admin Dashboard Deployment Script
# Deploys to Cloudflare Pages with custom domain support

echo "🚀 Deploying Shadow Clone Admin Dashboard to Cloudflare Pages..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "Error: wrangler CLI not found. Please install it with: npm install -g wrangler"
    exit 1
fi

# Project name
PROJECT_NAME="shadow-clone-admin"
CUSTOM_DOMAIN="admin.ignislabs.ai"

# Deploy to Cloudflare Pages
echo "📦 Deploying to Cloudflare Pages..."
wrangler pages deploy . --project-name=$PROJECT_NAME

echo "✅ Deployment complete!"
echo ""
echo "📍 Default URL: https://${PROJECT_NAME}.pages.dev"
echo "🌐 Custom domain: https://${CUSTOM_DOMAIN}"
echo ""
echo "⚠️  Next steps:"
echo "1. Add CNAME record: admin -> ${PROJECT_NAME}.pages.dev"
echo "2. Configure custom domain in Cloudflare Pages dashboard"
echo "3. Ensure Cloudflare Worker API is deployed"
echo ""
echo "📖 See docs/CUSTOM_DOMAIN_SETUP.md for detailed instructions"