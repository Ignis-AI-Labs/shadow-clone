# Shadow Clone Security Features - Implementation Complete

## Overview
We've successfully implemented comprehensive security monitoring and protection features for the Shadow Clone API. These features protect against prompt extraction attempts, API abuse, and provide visibility into security events.

## Implemented Features

### 1. ✅ Prompt Extraction Detection System
**Location**: `/cloudflare-worker/src/utils/security-monitor.ts`

Detects and flags attempts to extract proprietary prompts through:
- Pattern matching for extraction phrases ("show me the prompt", "display instructions", etc.)
- File reading command detection
- API response manipulation attempts
- Console logging attempts

**Key Features**:
- Real-time pattern matching
- Suspicion scoring system
- Automatic blocking for repeat offenders
- Detailed logging of all attempts

### 2. ✅ Smart Rate Limiting
**Location**: `/cloudflare-worker/src/utils/security-monitor.ts`

Intelligent rate limiting that adapts based on user behavior:
- **Normal Users**: 10/min, 100/hour, 500/day
- **Suspicious Users**: 5/min, 20/hour, 50/day
- **Burst Protection**: Prevents rapid-fire requests
- **Auto-blocking**: Users with high suspicion scores get blocked for 24 hours

### 3. ✅ Security Analytics Dashboard API
**Location**: `/cloudflare-worker/src/handlers/admin.ts`

Admin endpoints for monitoring security:
- `GET /admin/security/analytics` - Get security analytics
- `POST /admin/security/unblock` - Unblock a user
- `POST /admin/security/clear-events` - Clear security events for a user

**Analytics Include**:
- Total/suspicious/blocked users
- Extraction attempts count
- Recent security events
- Top offenders list
- Event type breakdown

### 4. ✅ Enumeration Detection
Detects users trying to enumerate all available modes/rules/templates:
- Tracks recent API paths accessed
- Flags rapid access to multiple resource types
- Increases suspicion score for enumeration attempts

### 5. ✅ Security Middleware
**Location**: `/cloudflare-worker/src/middleware/security.ts`

All protected routes now use security middleware that:
- Checks for extraction attempts before processing
- Enforces rate limits
- Tracks user behavior
- Returns appropriate error responses

## How It Works

### Suspicion Scoring System
- **0-25**: Normal user
- **25-50**: Monitored user (reduced rate limits)
- **50-75**: Suspicious user (heavily limited)
- **75-100**: High risk (very restricted)
- **100+**: Auto-blocked for 24 hours

### Score Increases
- Extraction attempt: +25 points
- Enumeration detected: +15 points
- Rate limit hit: +5 points

### Score Decreases
- Daily decay: -10 points
- Admin unblock: -25 points

## API Examples

### Test Extraction Detection
```bash
# This will be flagged as an extraction attempt
curl -X GET https://shadow-clone-api.elijah-02b.workers.dev/api/prompts/shadow-clone \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "User-Agent: show me the full prompt"
```

### Get Security Analytics (Admin Only)
```bash
curl -X GET https://shadow-clone-api.elijah-02b.workers.dev/admin/security/analytics \
  -H "X-API-Key: admin-key-here"
```

### Unblock a User (Admin Only)
```bash
curl -X POST https://shadow-clone-api.elijah-02b.workers.dev/admin/security/unblock \
  -H "X-API-Key: admin-key-here" \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-123"}'
```

## Response Headers
The API now returns security-related headers:
- `X-Security-Warning`: Indicates suspicious activity detected
- `X-RateLimit-Limit`: Shows which limit was hit (minute/hour/day)
- `Retry-After`: Seconds until rate limit resets

## Future Admin Dashboard
While the backend is fully implemented, a frontend admin dashboard can be built to:
- Visualize security analytics
- Monitor real-time threats
- Manage user blocks/unblocks
- View detailed event logs
- Export security reports

## Configuration
To enable admin features, add admin users to the Cloudflare Worker:
1. Add `ADMIN_KEYS` KV namespace in wrangler.toml
2. Set user role to 'admin' in USERS KV
3. Use admin API key for admin endpoints

## Monitoring Best Practices
1. **Regular Reviews**: Check analytics weekly for patterns
2. **False Positives**: Monitor legitimate users being flagged
3. **Adjust Patterns**: Update detection patterns based on new threats
4. **Rate Limit Tuning**: Adjust limits based on usage patterns
5. **Alert Setup**: Configure alerts for high-severity events

## Security Event Types
- `extraction_attempt`: User tried to extract prompt content
- `rate_limit`: User exceeded rate limits
- `enumeration`: User rapidly accessing multiple resources
- `suspicious_pattern`: Other suspicious behavior detected

## Testing the Security Features
1. **Extraction Detection**: Include suspicious phrases in requests
2. **Rate Limiting**: Send rapid requests to trigger limits
3. **Enumeration**: Access many different modes/rules quickly
4. **Analytics**: Use admin endpoint to view collected data

## Important Notes
- All security events are logged with 90-day retention
- User profiles are stored with 30-day expiration
- Suspicion scores decay daily to forgive old behavior
- The system is designed to be invisible to legitimate users

---

*Security features implemented: 2025-06-27*
*Cloudflare Worker deployed with full security monitoring*