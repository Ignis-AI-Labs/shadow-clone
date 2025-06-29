# Shadow Clone API - Cloudflare Worker

This is the Cloudflare Worker implementation of the Shadow Clone API.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create KV namespaces**
   ```bash
   # Create namespaces
   wrangler kv:namespace create USERS
   wrangler kv:namespace create PROJECTS  
   wrangler kv:namespace create API_KEYS
   
   # For preview/development
   wrangler kv:namespace create USERS --preview
   wrangler kv:namespace create PROJECTS --preview
   wrangler kv:namespace create API_KEYS --preview
   ```

3. **Update wrangler.toml**
   Replace the KV namespace IDs in `wrangler.toml` with the IDs from the output above.

4. **Run locally**
   ```bash
   npm run dev
   ```

5. **Deploy to Cloudflare**
   ```bash
   npm run deploy
   ```

## Test API Key

For testing, configure your own test API key which creates a test user with Pioneer license.

## API Endpoints

- `POST /auth/validate` - Validate API key
- `GET /user/profile` - Get user profile
- `GET /user/license-status` - Get license status
- `GET /projects` - List projects
- `POST /projects` - Create project
- `GET /projects/:id/deployments` - List deployments
- `POST /projects/:id/deploy` - Create deployment

## Environment Variables

- `ENVIRONMENT` - Set to "production" for production deployment
- `CORS_ORIGIN` - CORS allowed origin (default: "*")

## VS Code Extension Configuration

After deploying, update your VS Code settings:

```json
{
  "shadowClone.apiEndpoint": "https://shadow-clone-api.YOUR-SUBDOMAIN.workers.dev"
}
```

## Production Deployment

```bash
npm run deploy:prod
```

This will deploy to the production environment with the name `shadow-clone-api-prod`.