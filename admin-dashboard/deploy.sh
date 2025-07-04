#!/bin/bash

# Shadow Clone Admin Dashboard Deployment Script
# Deploys to Cloudflare Pages

echo "🚀 Deploying Shadow Clone Admin Dashboard to Cloudflare Pages..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "Error: wrangler CLI not found. Please install it with: npm install -g wrangler"
    exit 1
fi

# Project name
PROJECT_NAME="shadow-clone-admin"

# Deploy to Cloudflare Pages
echo "📦 Deploying to Cloudflare Pages..."
wrangler pages deploy . --project-name=$PROJECT_NAME

echo "✅ Deployment complete!"
echo "📍 Your admin dashboard should be available at: https://${PROJECT_NAME}.pages.dev"
echo ""
echo "⚠️  Important: Make sure the Cloudflare Worker API is deployed first!"
echo "📖 See docs/ADMIN_DASHBOARD_WEB3.md for usage instructions"