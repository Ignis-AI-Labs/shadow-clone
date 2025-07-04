# Immediate Security Fix for Trusted User

## Quick Solution
Until the full whitelist system is implemented, here's an immediate fix to prevent the trusted holder from being blocked:

### 1. Add to security-monitor.ts (Line ~290)

```typescript
private async updateUserSuspicionScore(userId: string, points: number): Promise<void> {
  const profile = await this.getUserSecurityProfile(userId);
  
  // TEMPORARY: Hardcoded trusted user check
  const TRUSTED_USERS = [
    'YOUR_TRUSTED_USER_ID_HERE', // Replace with actual user ID
    // Add more trusted users as needed
  ];
  
  // Skip suspicion updates for trusted users
  if (TRUSTED_USERS.includes(userId)) {
    console.log(`Skipping suspicion update for trusted user: ${userId}`);
    return;
  }
  
  profile.suspicionScore += points;
  
  // Auto-block if score too high
  if (profile.suspicionScore >= 100) {
    profile.isBlocked = true;
    profile.blockUntil = new Date(Date.now() + 86400000).toISOString(); // 24 hour block
  }
  
  await this.saveUserSecurityProfile(profile);
}
```

### 2. Admin Commands to Help

If the user is already blocked, use these admin commands:

```bash
# Unblock the user
curl -X POST https://shadow-clone-api.elijah-02b.workers.dev/admin/security/unblock \
  -H "X-API-Key: ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"userId": "BLOCKED_USER_ID"}'

# Clear their security events (optional)
curl -X POST https://shadow-clone-api.elijah-02b.workers.dev/admin/security/clear-events \
  -H "X-API-Key: ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"userId": "BLOCKED_USER_ID"}'
```

### 3. Get User's Current Status

```bash
# Check security analytics to find the user
curl -X GET https://shadow-clone-api.elijah-02b.workers.dev/admin/security/analytics \
  -H "X-API-Key: ADMIN_KEY"
```

## Finding the User ID

The user ID is typically:
1. The hashed API key stored in KV
2. Check the security events to find which user is being flagged
3. Look in the blocked users list from analytics

## Long-term Solution

Implement the full whitelist system from SECURITY_WHITELIST_PROPOSAL.md which includes:
- Proper trust management
- Different trust levels
- Admin tools for managing trusted users
- Audit trail for compliance

## Alternative: Adjust Patterns

If the user is triggering specific patterns, consider adjusting the EXTRACTION_PATTERNS to be more specific and less likely to match legitimate usage.