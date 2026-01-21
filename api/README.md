# Shadow Clone API

License validation API for the Shadow Clone MCP server.

## Quick Start

```bash
# Install dependencies
npm install

# Create .env from example
cp .env.example .env

# Generate an admin secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Add to .env as ADMIN_SECRET

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

## API Key Management (Admin Only)

### Create a New Key
```bash
curl -X POST http://localhost:3000/api/admin/keys \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "licenseType": "ignisElite",
    "walletAddress": "0x...",
    "expiresAt": "2027-01-01T00:00:00Z"
  }'
```

**Response:**
```json
{
  "message": "API key created. Save this key - it cannot be retrieved again.",
  "apiKey": "sc-abc123...",  // SAVE THIS! Only shown once
  "id": "uuid",
  "licenseType": "ignisElite",
  "expiresAt": "2027-01-01T00:00:00Z"
}
```

### List All Keys
```bash
curl http://localhost:3000/api/admin/keys \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET"
```

### Revoke a Key
```bash
curl -X DELETE "http://localhost:3000/api/admin/keys?id=KEY_UUID" \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET"
```

## Security Model

- **API keys are hashed** - We store SHA-256 hashes, not raw keys
- **Keys shown once** - When created, the raw key is returned once and never again
- **Admin protected** - Key management requires `ADMIN_SECRET` bearer token
- **Format validation** - Keys must match `sc-*` format and length requirements

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
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key |
| `ADMIN_SECRET` | Yes | 64-char hex secret for admin endpoints |

## Database Schema

```sql
-- API keys are stored as SHA-256 hashes
CREATE TABLE shadow_clone_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key TEXT UNIQUE NOT NULL,  -- This is the HASH, not raw key
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

## Testing Flow

1. Set up Supabase and run the schema above
2. Generate admin secret and add to `.env`
3. Start the API: `npm run dev`
4. Create a test key via admin endpoint
5. Save the returned `apiKey`
6. Test validation with that key
