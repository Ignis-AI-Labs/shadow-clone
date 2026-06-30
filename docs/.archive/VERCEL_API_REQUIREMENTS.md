# Shadow Clone API Requirements

This document specifies the API endpoints required by the Shadow Clone MCP server for authentication and license validation.

## Base Configuration

- **Domain**: `https://api.ignislabs.ai`
- **Authentication**: API key via `X-API-Key` header
- **Content-Type**: `application/json` for requests, `application/json` or `text/plain` for responses

---

## Required Endpoints

### 1. License Validation (Critical)

**Endpoint**: `POST /shadow-clone-licenses/validate`

This is the primary authentication endpoint. Called on:
- Initial authentication
- Every 30 minutes for license status refresh
- Each tool execution in MCP server (with 1-minute cache)

**Request**:
```http
POST /shadow-clone-licenses/validate
Content-Type: application/json
X-API-Key: {apiKey}

{
  "apiKey": "{apiKey}"
}
```

**Expected Response (Success)**:
```json
{
  "valid": true,
  "isActive": true,
  "userId": "user_123",
  "licenseType": "ignisElite",
  "walletAddress": "0x...",
  "email": "user@example.com",
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

**Expected Response (Invalid Key)**:
```json
{
  "valid": false,
  "message": "Invalid API key"
}
```

**Expected Response (Inactive License)**:
```json
{
  "valid": true,
  "isActive": false,
  "userId": "user_123",
  "licenseType": "pioneer",
  "message": "License inactive - subscription expired"
}
```

**HTTP Status Codes**:
| Status | Meaning | Client Behavior |
|--------|---------|-----------------|
| 200 | Success (check `valid` field) | Process response |
| 401 | Invalid API key | Show "Invalid API key" error |
| 403 | Access denied / expired | Show "License expired" error |
| 500 | Server error | Retry or show generic error |

**Supabase Implementation Notes**:
- Query `shadow_clone_licenses` table by API key
- Check `is_active` status
- Optionally verify NFT ownership via wallet address
- Return user details for client-side display

---

### 2. Main Prompt Endpoint

**Endpoint**: `GET /api/prompts/shadow-clone`

Returns the main Shadow Clone orchestration prompt.

**Request**:
```http
GET /api/prompts/shadow-clone
X-API-Key: {apiKey}
```

**Expected Response**:
- Content-Type: `text/plain` or `application/json`
- If JSON: `{ "content": "...prompt text..." }`
- If plain text: Raw prompt markdown content

**Notes**:
- This prompt is intellectual property - serve from secure storage
- Consider caching headers (prompts don't change frequently)
- 30-minute client-side cache is applied

---

### 3. Modes List Endpoint

**Endpoint**: `GET /api/prompts/modes`

Returns list of available execution modes.

**Request**:
```http
GET /api/prompts/modes
X-API-Key: {apiKey}
```

**Expected Response**:
```json
["plan", "feature", "debug", "optimize", "refactor", "audit", "research"]
```

Or:
```json
{
  "modes": ["plan", "feature", "debug", "optimize", "refactor", "audit", "research"]
}
```

---

### 4. Individual Mode Endpoint

**Endpoint**: `GET /api/prompts/modes/{modeName}`

Returns configuration for a specific execution mode.

**Request**:
```http
GET /api/prompts/modes/feature
X-API-Key: {apiKey}
```

**Path Parameters**:
- `modeName`: One of `plan`, `feature`, `debug`, `optimize`, `refactor`, `audit`, `research`

**Expected Response**:
- Content-Type: `text/plain` or `application/json`
- Mode-specific prompt/configuration content

---

## Optional Endpoints

### WebSocket Connection (Not Currently Used)

**Endpoint**: `WSS /ws/deploy/{projectId}`

The WebSocket manager exists in the codebase but isn't actively used. Low priority.

**Headers**:
```
X-API-Key: {apiKey}
```

---

## Authentication Flow

```
┌─────────────────────┐
│  User calls         │
│  authenticate()     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ POST /shadow-clone- │
│ licenses/validate   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐     ┌─────────────────┐
│  valid: true?       │─No─▶│ Return error    │
│  isActive: true?    │     └─────────────────┘
└──────────┬──────────┘
           │ Yes
           ▼
┌─────────────────────┐
│ Cache credentials:  │
│ - Environment var   │
│ - ~/.shadow-clone/  │
│ - Workspace .env    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ NFT ownership       │
│ verified per call   │
│ (1-min cache)       │
└─────────────────────┘
```

---

## Supabase Schema Suggestion

```sql
-- Shadow Clone Licenses Table
CREATE TABLE shadow_clone_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  wallet_address TEXT,
  license_type TEXT NOT NULL CHECK (license_type IN (
    'tripleOG', 'doubleOG', 'singleOG',
    'ignisElite', 'pioneer', 'builder', 'reserve'
  )),
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast API key lookups
CREATE INDEX idx_api_key ON shadow_clone_licenses(api_key);

-- RLS Policy (if using Supabase Auth)
ALTER TABLE shadow_clone_licenses ENABLE ROW LEVEL SECURITY;
```

---

## Vercel API Route Examples

### `/api/shadow-clone-licenses/validate/route.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();
    const headerKey = request.headers.get('X-API-Key');

    const keyToValidate = apiKey || headerKey;

    if (!keyToValidate) {
      return NextResponse.json(
        { valid: false, message: 'API key required' },
        { status: 401 }
      );
    }

    const { data: license, error } = await supabase
      .from('shadow_clone_licenses')
      .select('*')
      .eq('api_key', keyToValidate)
      .single();

    if (error || !license) {
      return NextResponse.json(
        { valid: false, message: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Check expiration
    const isExpired = license.expires_at && new Date(license.expires_at) < new Date();

    return NextResponse.json({
      valid: true,
      isActive: license.is_active && !isExpired,
      userId: license.user_id,
      licenseType: license.license_type,
      walletAddress: license.wallet_address,
      expiresAt: license.expires_at
    });

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { valid: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
```

### `/api/prompts/shadow-clone/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('X-API-Key');

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // Validate API key first (reuse validation logic)
  // ...

  // Return prompt content
  // Option 1: From file system
  // Option 2: From Supabase storage
  // Option 3: From environment variable

  const promptContent = process.env.SHADOW_CLONE_MAIN_PROMPT || '...';

  return new NextResponse(promptContent, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'private, max-age=1800' // 30 min cache
    }
  });
}
```

---

## CORS Configuration

Ensure your Vercel API allows requests from VS Code extension:

```typescript
// middleware.ts or in each route
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
};
```

---

## Testing Checklist

After implementing, verify with these curl commands:

```bash
# 1. Test license validation
curl -X POST https://api.ignislabs.ai/shadow-clone-licenses/validate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_TEST_KEY" \
  -d '{"apiKey": "YOUR_TEST_KEY"}'

# Expected: {"valid": true, "isActive": true, ...}

# 2. Test main prompt endpoint
curl -X GET https://api.ignislabs.ai/api/prompts/shadow-clone \
  -H "X-API-Key: YOUR_TEST_KEY"

# Expected: Prompt content (text or JSON)

# 3. Test modes list
curl -X GET https://api.ignislabs.ai/api/prompts/modes \
  -H "X-API-Key: YOUR_TEST_KEY"

# Expected: ["plan", "feature", ...]

# 4. Test individual mode
curl -X GET https://api.ignislabs.ai/api/prompts/modes/feature \
  -H "X-API-Key: YOUR_TEST_KEY"

# Expected: Mode configuration content
```

---

## Error Handling Summary

| Scenario | HTTP Status | Response |
|----------|-------------|----------|
| Missing API key | 401 | `{"valid": false, "message": "API key required"}` |
| Invalid API key | 401 | `{"valid": false, "message": "Invalid API key"}` |
| Expired license | 200 | `{"valid": true, "isActive": false, ...}` |
| Server error | 500 | `{"valid": false, "message": "Server error"}` |

---

## Contact

For questions about this specification, refer to the MCP server source code in:
- `mcp-server/src/auth/authService.ts`
- `mcp-server/src/auth/apiKeyManager.ts`
