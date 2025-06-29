# Security Fix: Authentication Guards for All Commands

## Date: 2025-06-29

## Critical Security Issue Fixed
The Shadow Clone VS Code extension was allowing unauthorized users to access core functionality through:
1. Clickable status bar buttons (even when not authenticated)
2. Commands executable via Command Palette
3. No authentication checks on sensitive operations

## Changes Made in v0.2.2

### 1. Created Authentication Guard System
- New `authGuard.ts` utility with `withAuth` and `withAuthSync` wrappers
- Guards check both authentication AND active license status
- Provides user-friendly prompts to authenticate

### 2. Protected All Sensitive Commands
Commands now requiring authentication:
- `launchClaude` - Requires active subscription
- `buildCustomCommand` - Requires active subscription  
- `copyCommand` - Basic auth required
- `openSessionOutput` - Basic auth required
- `terminateSession` - Basic auth required
- `clearCompletedSessions` - Basic auth required
- `showSessions` - Basic auth required
- `registerTerminal` - Basic auth required
- `showSessionPicker` - Basic auth required
- `buildParameters` - Basic auth required

### 3. Status Bar Visibility Based on Auth State

**Unauthenticated Users See Only:**
- Authentication button
- Help button

**Authenticated but Inactive License:**
- Shadow Clone status button (to check status)
- Authentication button
- Help button

**Authenticated with Active License:**
- All features visible:
  - Shadow Clone status
  - Launch Claude button
  - SC Inject button
  - Deploy/Debug/Feature buttons
  - Active sessions indicator

### 4. Comprehensive Status Bar Management
- `updateAllStatusBarItems()` function manages visibility
- Updates on auth changes
- Updates on license status changes
- Hides session indicator when no auth

## Security Improvements

### Before:
```typescript
// Anyone could click and execute
claudeButton.show();
vscode.commands.registerCommand('shadowClone.launchClaude', () =>
    launchClaudeCommand(sessionManager, authProvider)
)
```

### After:
```typescript
// Hidden until authenticated
// Command wrapped with auth guard
vscode.commands.registerCommand('shadowClone.launchClaude', 
    withAuthSync(() => launchClaudeCommand(sessionManager, authProvider), authProvider, {
        requireActiveSubscription: true
    })
)
```

## User Experience
1. **Unauthenticated**: Only see "Authenticate" and "Help" buttons
2. **Click Protected Feature**: Get prompt to authenticate
3. **Inactive License**: Get prompt to update API key or contact support
4. **Active License**: Full access to all features

## Testing Recommendations
1. Launch extension without authentication
2. Verify only Auth and Help buttons visible
3. Try executing commands via Command Palette
4. Verify auth prompts appear
5. Authenticate and verify buttons appear
6. Test with inactive license