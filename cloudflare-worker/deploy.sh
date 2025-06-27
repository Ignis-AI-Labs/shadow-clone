#!/bin/bash

# Cloudflare Worker Deployment Script
# This script deploys the Shadow Clone API to Cloudflare Workers

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if API token is set
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "Error: CLOUDFLARE_API_TOKEN not set in .env file"
    echo "Please create a .env file with your Cloudflare API token"
    echo "See .env.example for reference"
    exit 1
fi

echo "🚀 Deploying Shadow Clone API to Cloudflare Workers..."
echo "📍 Endpoint: https://shadow-clone-api.elijah-02b.workers.dev"

# Deploy with wrangler
npx wrangler deploy

echo "✅ Deployment complete!"