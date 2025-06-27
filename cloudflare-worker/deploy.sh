#!/bin/bash

echo "🚀 Shadow Clone API - Cloudflare Worker Deployment"
echo "================================================"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler not found. Installing..."
    npm install -g wrangler
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if KV namespaces are configured
if grep -q "YOUR_.*_KV_ID" wrangler.toml; then
    echo ""
    echo "⚠️  KV namespaces not configured!"
    echo ""
    echo "Run these commands to create KV namespaces:"
    echo ""
    echo "  wrangler kv:namespace create USERS"
    echo "  wrangler kv:namespace create PROJECTS"
    echo "  wrangler kv:namespace create API_KEYS"
    echo ""
    echo "  # For preview/development:"
    echo "  wrangler kv:namespace create USERS --preview"
    echo "  wrangler kv:namespace create PROJECTS --preview"
    echo "  wrangler kv:namespace create API_KEYS --preview"
    echo ""
    echo "Then update the IDs in wrangler.toml"
    exit 1
fi

# Deploy to Cloudflare
echo ""
echo "🌐 Deploying to Cloudflare..."
echo ""

if [ "$1" == "prod" ]; then
    echo "Deploying to production..."
    npm run deploy:prod
else
    echo "Deploying to development..."
    npm run deploy
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Test with:"
echo "  curl -X POST https://your-worker.workers.dev/auth/validate \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"apiKey\": \"test-key-123\"}'"