# Security Whitelist Proposal for Shadow Clone

## Problem Statement
Legitimate Shadow Clone users are being false-flagged as attackers when they:
- Work extensively with the system
- Use phrases that match extraction patterns
- Access multiple resources rapidly (normal usage)
- Get auto-blocked and have their data deleted

## Proposed Solution

### 1. Trusted User Whitelist
Add a whitelist system for known legitimate users:

```typescript
// Add to security-monitor.ts
interface TrustedUser {
  userId: string;
  apiKey: string;
  trustLevel: 'full' | 'partial' | 'monitoring';
  addedBy: string;
  addedAt: string;
  reason: string;
}

// Check whitelist before applying penalties
async function isTrustedUser(userId: string): Promise<boolean> {
  const trusted = await env.USERS.get(`trusted:${userId}`);
  return trusted !== null;
}
```

### 2. Adjust Security Scoring for Trusted Users
- **Full Trust**: No suspicion score increases
- **Partial Trust**: 50% reduced penalties
- **Monitoring**: Normal penalties but no auto-block

### 3. Pattern Exemptions for Shadow Clone Operations
Exempt patterns that are part of normal Shadow Clone usage:
- Loading prompts from the system
- Discussing prompt engineering
- Working with agent configurations
- Accessing multiple modes/templates (normal workflow)

### 4. Prevent Data Deletion for Trusted Users
Add safeguards to `handleClearUserEvents`:
```typescript
// Check if user is trusted before deletion
if (await isTrustedUser(userId)) {
  // Archive instead of delete
  await env.USERS.put(
    `security:archive:${userId}:${Date.now()}`,
    await env.USERS.get(`security:events:${userId}`),
    { expirationTtl: 86400 * 365 } // 1 year archive
  );
}
```

### 5. Admin Commands for Trust Management
New admin endpoints:
- `POST /admin/security/trust` - Add user to whitelist
- `DELETE /admin/security/trust` - Remove from whitelist
- `GET /admin/security/trusted` - List all trusted users

### 6. Reduced Rate Limits for Trusted Users
```typescript
const TRUSTED_RATE_LIMITS = {
  MINUTE: { normal: 30, burst: 50 },
  HOUR: { normal: 300, burst: 500 },
  DAY: { normal: 1500, burst: 2000 }
};
```

## Implementation Priority
1. **Immediate**: Add trusted user check to prevent auto-blocking
2. **High**: Implement whitelist system
3. **Medium**: Adjust patterns for Shadow Clone context
4. **Low**: Add comprehensive admin tools

## Security Considerations
- Whitelist management requires admin authentication
- All whitelist changes are logged
- Regular review of trusted users
- Temporary trust options (e.g., 30-day trust periods)

## Benefits
- Legitimate users won't be blocked
- Reduced support burden
- Better user experience
- Maintains security for actual threats
- Preserves audit trail for compliance