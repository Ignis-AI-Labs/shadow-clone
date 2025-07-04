# Admin Security Endpoints Documentation

This document provides information about the admin endpoints available for managing user security restrictions in the Shadow Clone system.

## Overview

When legitimate users are falsely flagged by the security system, administrators can use these endpoints to remove restrictions and reset security profiles.

## Authentication

All admin endpoints require:
- `X-API-Key` header with a valid admin API key
- The API key must belong to a user with `role: 'admin'` or `isAdmin: true`

## Available Endpoints

### 1. Unblock User

**Endpoint:** `POST /admin/security/unblock`  
**URL:** `https://api.ignislabs.ai/admin/security/unblock`

Unblocks a user who has been auto-blocked by the security system.

**Request:**
```json
{
  "userId": "user-id-to-unblock"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User user-123 unblocked",
  "newSuspicionScore": 25
}
```

**Effects:**
- Sets `isBlocked` to `false`
- Removes `blockUntil` timestamp
- Reduces suspicion score by 25 points

**Example cURL:**
```bash
curl -X POST https://api.ignislabs.ai/admin/security/unblock \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_ADMIN_API_KEY" \
  -d '{"userId": "user-123"}'
```

### 2. Clear User Security Events

**Endpoint:** `POST /admin/security/clear-events`  
**URL:** `https://api.ignislabs.ai/admin/security/clear-events`

Completely resets a user's security profile and clears all security events.

**Request:**
```json
{
  "userId": "user-id-to-clear"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Security events cleared for user user-123"
}
```

**Effects:**
- Deletes all security events for the user
- Resets suspicion score to 0
- Resets extraction attempts to 0
- Clears flagged patterns
- Resets access counts
- Sets `isBlocked` to `false`

**Example cURL:**
```bash
curl -X POST https://api.ignislabs.ai/admin/security/clear-events \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_ADMIN_API_KEY" \
  -d '{"userId": "user-123"}'
```

### 3. Get Security Analytics

**Endpoint:** `GET /admin/security/analytics`  
**URL:** `https://api.ignislabs.ai/admin/security/analytics`

Retrieves comprehensive security analytics including blocked users, suspicious users, and recent events.

**Response:**
```json
{
  "success": true,
  "analytics": {
    "stats": {
      "totalUsers": 150,
      "suspiciousUsers": 5,
      "blockedUsers": 2,
      "extractionAttempts": 12,
      "last24HourEvents": 45,
      "eventsByType": {
        "extraction_attempt": 8,
        "rate_limit": 30,
        "enumeration": 7
      }
    },
    "recentEvents": [...],
    "topOffenders": [...],
    "suspiciousUsers": ["user-456", "user-789"],
    "blockedUsers": ["user-111", "user-222"]
  },
  "timestamp": "2025-07-04T12:00:00.000Z"
}
```

**Example cURL:**
```bash
curl -X GET https://api.ignislabs.ai/admin/security/analytics \
  -H "X-API-Key: YOUR_ADMIN_API_KEY"
```

## Typical Workflow for Removing False Restrictions

1. **Identify affected user** - Get their user ID from support request or analytics
   
2. **Check user status** - Use analytics endpoint to see their current security profile

3. **Decide on action:**
   - If user is just blocked: Use `/admin/security/unblock`
   - If user has accumulated many false events: Use `/admin/security/clear-events`

4. **Verify resolution** - Check analytics again to confirm user is unblocked

## Security Scoring System

Understanding the scoring helps determine which endpoint to use:

- **0-25 points**: Normal user
- **25-50 points**: Monitored user (reduced rate limits)
- **50-75 points**: Suspicious user (heavily limited)
- **75-100 points**: High risk (very restricted)
- **100+ points**: Auto-blocked for 24 hours

## Best Practices

1. **Use unblock first** - Try unblocking before clearing all events, as it preserves audit history

2. **Document actions** - Keep records of why users were unblocked for audit purposes

3. **Monitor patterns** - If many false positives occur, consider adjusting security rules

4. **Communicate with users** - Let affected users know their access has been restored

## Security Patterns That May Cause False Positives

The current patterns that can trigger false positives include:
- Phrases containing "show me the prompt" (even in legitimate context)
- File operations on shadow-clone files
- Rapid API access (legitimate heavy usage)
- Multiple resource type access (normal Shadow Clone operations)

These have been adjusted to be more specific, but historical events may still affect users.

## Contact

For additional admin access or security rule adjustments:
- Technical: support@shadow-clone.ai
- Security: security@shadow-clone.ai