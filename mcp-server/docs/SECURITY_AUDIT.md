# Shadow Clone MCP Server - Internal Security Audit

**Version:** 0.1.0
**Last Updated:** January 2026

---

## Overview

This document tracks security-related implementation details, design decisions, known issues, and fixes for the MCP server. It serves as internal reference for developers working on security-sensitive code.

The MCP server uses a multi-layer authentication system with NFT ownership verification. This document covers the authentication flow, caching strategy, input validation, and known trade-offs.

---

## Authentication Architecture

### Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MCP Client Request                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          index.ts: CallToolRequestSchema                     │
│                                                                              │
│   1. Rate limiting check (100 req/min)                                       │
│   2. Tool name validation                                                    │
│   3. Is tool "authenticate"?                                                 │
│      ├─ YES → Process browser auth flow                                      │
│      └─ NO  → Continue to auth check                                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       authService.isAuthenticated()                          │
│                          (index.ts:237-248)                                  │
│                                                                              │
│   1. Check for Creator Mode bypass (development only)                        │
│   2. Load auth data from disk                                                │
│   3. If no auth data, try cached API key with revalidation                   │
│   4. Verify NFT ownership via API call                                       │
│      └─ Network error → Use cached value if < 5 min old, else deny          │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                         ┌─────────────┴─────────────┐
                         │                           │
                    Authenticated              Not Authenticated
                         │                           │
                         ▼                           ▼
┌──────────────────────────────────┐   ┌──────────────────────────────────────┐
│     Execute Tool with Timeout    │   │   Throw McpError(InvalidRequest)     │
│        (5 min max execution)     │   │   "Please authenticate first"        │
└──────────────────────────────────┘   └──────────────────────────────────────┘
```

### Key Authentication Points

| Layer | Location | Purpose |
|-------|----------|---------|
| 1 | `index.ts:156` | Rate limiting (100 req/min) |
| 2 | `index.ts:164` | Tool name validation |
| 3 | `index.ts:237-248` | Authentication enforcement |
| 4 | `authService.ts:285-342` | NFT ownership verification |

---

## Access Control Points

### All Tool Handlers Require Authentication

**Single enforcement point:** `index.ts:237-248`

```typescript
// Check authentication for all other tools
const isAuthenticated = await this.authService.isAuthenticated();
if (!isAuthenticated) {
  throw new McpError(
    ErrorCode.InvalidRequest,
    message
  );
}
```

**Tools exempt from authentication:**
- `authenticate` - Required to obtain authentication

**Tools requiring authentication:**
- All tools in `embeddedPromptTools.ts` (except `authenticate`)
- All tools in `modularTools.ts`
- `check_for_updates`
- `initialize_workspace`
- `api_key_status`

---

## Two-Tier Caching Strategy

### Overview

The authentication system uses a two-tier caching strategy to balance security with availability:

| Tier | Cache Duration | Scenario | Purpose |
|------|---------------|----------|---------|
| **Normal** | 60 seconds | API call succeeds | Reduce API calls during active session |
| **Fallback** | 5 minutes | Network error occurs | Grace period during network outages |

### Implementation

**File:** `authService.ts:285-342`

**Normal Operation Flow:**
1. Check cache - if valid entry exists and is < 60s old, use it
2. Make API call to verify NFT ownership
3. Update cache with result
4. Return verification result

**Network Error Flow:**
1. API call fails (timeout, DNS failure, 5xx error)
2. Check if cached value exists and is < 5 minutes old
3. If yes: use cached value (grace period for network issues)
4. If no: deny access

```typescript
// On network errors, use cached value if available and recent (within 5 minutes)
if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
  logger.info('Using cached verification due to network error');
  return cached.isActive;
}
return false;
```

### Rationale

- **60-second normal cache**: Prevents hammering the API during active usage while ensuring relatively fresh verification
- **5-minute fallback**: Provides availability during brief network outages without significantly compromising security
- **Denial after 5 minutes**: Ensures revoked keys cannot be used indefinitely during extended outages

---

## Cache Durations

| Cache | Duration | Location | Purpose |
|-------|----------|----------|---------|
| NFT Verification (normal) | 60 seconds | `authService.ts:33` | Reduce API calls during active session |
| NFT Verification (fallback) | 5 minutes | `authService.ts:335` | Grace period during network errors |
| Auth Data | Persistent | `~/.shadow-clone/mcp-auth.json` | Store encrypted credentials |
| API Key | Persistent | `~/.shadow-clone/config.json` | Quick access to key |

---

## Creator Mode (Development Bypass)

### Description

Creator Mode allows authentication bypass for local development and testing.

### Detection

**File:** `creatorMode.ts`

Creator Mode is enabled when:
1. Environment variable `SHADOW_CLONE_CREATOR_MODE=true`
2. Config file `.shadow-local/creator-config.json` exists with valid settings

### Security Implications

- **By Design:** This is an intentional bypass for development
- **Not for Production:** Production builds should never have Creator Mode enabled
- **Logged:** When active, logs: `Creator Mode Active - Authentication bypassed`

### Recommendation

- Ensure production deployments do NOT have:
  - `SHADOW_CLONE_CREATOR_MODE` environment variable
  - `.shadow-local/creator-config.json` file

---

## Local Auth Server Security

### Binding

**File:** `localAuthServer.ts:82`

The local authentication server binds to `127.0.0.1` only:

```typescript
this.server!.listen(this.port, '127.0.0.1', () => { ... });
```

### Security Features

1. **Localhost Only:** Cannot be accessed from network
2. **CSRF Protection:** Random token generated per session
3. **HTTP Security Headers:** X-Frame-Options, X-Content-Type-Options
4. **Request Size Limit:** 10KB max body
5. **Auto-Shutdown:** Closes after successful auth or timeout (5 min)
6. **Dynamic Port:** Uses random ephemeral port (49152-65535)

### Endpoints

| Endpoint | Method | Purpose | Security |
|----------|--------|---------|----------|
| `/` | GET | Auth form | CSRF token embedded |
| `/auth` | POST | Submit API key | CSRF validation |
| `/status` | GET | Server status | No sensitive data |

---

## Data Protection

### API Key Storage

**Encryption:** AES-256-GCM (v2 format)

**Files:**
- `~/.shadow-clone/mcp-auth.json` - Encrypted auth data
- `~/.shadow-clone/config.json` - Encrypted API key cache

**File Permissions:** `0o600` (owner read/write only)

### Error Logging

Sensitive data is sanitized from logs:
- API keys never logged
- Only HTTP status, error code, and message logged
- Request headers and body excluded

---

## No HTTP Endpoints Expose Prompts

### Verification

1. **MCP Transport:** Only `StdioServerTransport` used (stdio, not HTTP)
2. **Local Auth Server:** Only serves HTML forms, no prompt content
3. **No Debug Endpoints:** No `/debug`, `/test`, or diagnostic routes

### Code Paths

All prompt access flows through:
1. `index.ts` → MCP protocol handler
2. `combinedTools.ts` → Tool routing
3. `embeddedPromptTools.ts` / `modularTools.ts` → Prompt delivery

None of these expose HTTP endpoints.

---

## Input Validation

### Tool Name Validation

**File:** `utils/validation.ts`

- Whitelist validation against known tool names
- Prevents tool injection attacks

### Argument Validation

**Files:** `utils/zodValidation.ts`, `utils/validation.ts`

- Zod schema validation for all tool inputs
- Path traversal prevention
- String length limits
- Enum validation for known values

### Rate Limiting

**File:** `utils/rateLimiter.ts`

- 100 requests per minute per client
- Prevents abuse and DoS

### Execution Timeout

**File:** `index.ts:255-262`

- 5 minute maximum execution time
- Prevents runaway operations

---

## Known Trade-offs

The following behaviors are intentional design decisions with understood implications:

### 1. Rate Limiter Uses Hardcoded Client ID

Each MCP client spawns its own subprocess with an isolated in-memory rate limiter. The hardcoded `'mcp-client'` ID (in `index.ts:155`) only applies within that single process instance. No cross-process state sharing occurs, so this isn't exploitable.

---

### 2. Network Error Cache Fallback (5 minutes)

When API calls fail due to network errors, the system uses cached verification data if it's less than 5 minutes old. This means revoked NFTs may remain valid for up to 5 minutes during network outages.

This is an intentional availability trade-off. The normal 60-second cache still applies when API calls succeed.

---

### 3. Creator Mode

Required for local development and testing. Allows developers to use Shadow Clone without an NFT license.

If enabled in production, would bypass all authentication. However:
- The npm package distribution does not include `.shadow-local/`
- Activity is logged when Creator Mode is active

Never enable in production deployments.

---

### 4. Environment Variable Creator Mode

The `SHADOW_CLONE_CREATOR_MODE=true` environment variable enables Creator Mode without a config file. Same implications as #3 above.

---

## Notes

### Production Deployment

- Never enable Creator Mode in production
- Monitor for failed authentication attempts (logged as warnings)
- Verify no `.shadow-local/` directory exists
- Ensure `SHADOW_CLONE_CREATOR_MODE` env var is not set

### Development

- Creator Mode available for local testing without NFT
- Local auth server binds to localhost for browser-based key entry
- Test network failure scenarios to verify cache fallback behavior

---

## Security Controls

Current security measures implemented in the codebase:

- All tool handlers require authentication (except `authenticate`)
- No HTTP endpoints expose prompts
- Network errors use 5-minute cache fallback, then deny
- Local auth server binds to localhost only
- API keys encrypted at rest (AES-256-GCM)
- Error messages don't leak prompt content
- Input validation on all tool arguments
- Rate limiting enabled (100 req/min)
- Execution timeout enforced (5 min max)
- CSRF protection on local auth form
- Creator Mode documented as development-only bypass
- Command injection prevented - `openBrowser()` uses `execFile` instead of `exec`
- Symlink traversal blocked - Path validation uses `realpathSync()` to resolve symlinks
- Creator config validated - Zod schema with `strict()` rejects unknown fields

---

## Fixed Issues

### January 2026

| Vulnerability | Severity | Fix Applied |
|--------------|----------|-------------|
| Command injection in `openBrowser()` | CRITICAL | Use `execFile` with array args instead of `exec` |
| Symlink path traversal | HIGH | Resolve symlinks with `realpathSync()` |
| Creator config injection | HIGH | Zod schema validation with `strict()` |
| Hardcoded Windows paths | MEDIUM | Removed from `creatorMode.ts` |

---

## Defensive Hardening

These are robustness improvements that handle edge cases. They are not responses to exploitable vulnerabilities, but rather defensive programming practices.

### Clock Skew Handling

| Item | Severity | Fix Applied |
|------|----------|-------------|
| Cache age calculation | LOW | Clamp to non-negative with `Math.max(0, age)` |

**Issue:** Cache validity was checked using `Date.now() - cached.timestamp < CACHE_DURATION`. If `cached.timestamp` is in the future (due to clock adjustment), the result is negative, which extends cache validity beyond the intended duration.

**Note:** This is not a practical exploit vector. If an attacker can manipulate the system clock, they have much greater access and could simply keep the clock manipulated to stay within any cache window. The fix handles accidental scenarios:

1. **NTP corrections** - System clock jumps backward after running fast
2. **VM/container drift** - Clock sync issues during pause/resume
3. **Manual clock adjustment** - Admin sets clock backward

**Fix:**

```typescript
// Before:
if (Date.now() - cached.timestamp < CACHE_DURATION)

// After (robust):
const cacheAge = Math.max(0, Date.now() - cached.timestamp);
if (cacheAge < CACHE_DURATION)
```

**Impact:** Future timestamps are treated as age=0 (freshly created). Negligible performance cost.

---

## Test Coverage

Security tests are located in `tests/security/`:
- `auth-cache-expiry.test.ts` - Cache expiry and network error fallback behavior
- `prompt-access.test.ts` - Authentication requirements
- `exploit-tests.test.ts` - Verifies security fixes block known exploit patterns

Run security tests:
```bash
cd mcp-server
npm test -- tests/security/
```
