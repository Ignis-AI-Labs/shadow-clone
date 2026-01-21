# Shadow Clone API

License validation API for the Shadow Clone MCP server.

## Quick Start

```bash
# Install dependencies
npm install

# Create .env from example
cp .env.example .env

# Enable dev mode for testing (edit .env)
DEV_MODE=true

# Run locally
npm run dev
```

## Endpoints

### Health Check
```bash
GET /api/health
```

### License Validation
```bash
POST /api/shadow-clone-licenses/validate
Content-Type: application/json
X-API-Key: your-api-key

# Or in body:
{"apiKey": "your-api-key"}
```

**Response (Success):**
```json
{
  "valid": true,
  "isActive": true,
  "userId": "user-123",
  "licenseType": "ignisElite",
  "walletAddress": "0x...",
  "expiresAt": "2026-12-31T23:59:59Z"
}
```

**Response (Invalid):**
```json
{
  "valid": false,
  "message": "Invalid API key"
}
```

## Development Mode

When `DEV_MODE=true`, the API accepts test keys:

- `sc-dev-*` - Any key starting with `sc-dev-` returns a valid ignisElite license
- `sc-test-key-for-development` - Returns a valid pioneer license

This allows testing without Supabase configured.

## Deployment

```bash
# Deploy to Vercel
vercel

# Or link to existing project
vercel link
vercel deploy --prod
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Production | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | Supabase service role key |
| `DEV_MODE` | No | Set to `true` to enable dev API keys |

## Database Schema

```sql
CREATE TABLE shadow_clone_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  wallet_address TEXT,
  license_type TEXT NOT NULL CHECK (license_type IN (
    'ignisElite', 'pioneer', 'builder', 'reserve'
  )),
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_key ON shadow_clone_licenses(api_key);
```
