# Shadow Clone License Auto-Refresh System (v0.1.9)

## What's New

The VS Code extension now automatically checks and updates license status every 30 minutes to ensure accurate license information is always displayed.

### Key Features:

1. **Automatic 30-Minute Refresh**
   - License status is checked every 30 minutes in the background
   - No manual intervention required
   - Continues as long as VS Code is open

2. **Smart Status Caching**
   - License status is cached between checks
   - Reduces unnecessary API calls
   - Persists between VS Code sessions

3. **Real-time Status Updates**
   - Status bar updates immediately when license status changes
   - Shows "License Active" or "License Inactive" based on actual status
   - Displays last check time in tooltip

4. **Manual Refresh Option**
   - New command: "Shadow Clone: Refresh License Status"
   - Can be triggered from Command Palette
   - Shows progress notification during refresh

5. **Status Change Notifications**
   - Notifies when license becomes active: "Shadow Clone license is now active!"
   - Warns when license becomes inactive: "Shadow Clone license has become inactive."

## How It Works

### Automatic Refresh Cycle
```
Every 30 minutes:
1. Check authentication status
2. Call /shadow_clone_licenses endpoint
3. Update cached status
4. Update UI components
5. Show notification if status changed
```

### Status Bar Display
- **License Active**: Green checkmark, shows last check time
- **License Inactive**: Warning icon with red background
- **Checking License**: Spinning sync icon during verification
- **Not Authenticated**: Key icon prompting to authenticate

### Fallback Mechanism
If the primary endpoint fails (404), the system tries:
1. `/shadow-clone-licenses/validate` endpoint
2. Keeps previous status if all checks fail
3. Updates timestamp to prevent rapid retries

## UI Components Updated

All these components now reflect real-time license status:
1. **Status Bar** - Shows current license state
2. **Project View** - Enables/disables based on license
3. **Commands** - Availability based on active license
4. **Show Status Command** - Displays detailed license info

## Error Handling

- **Network Errors**: Keeps last known status
- **404 Errors**: Tries alternative endpoints
- **Invalid Response**: Maintains previous state
- **Expired Auth**: Prompts re-authentication

## Testing the System

1. **Check Current Status**
   - Look at status bar (should show "License Active" or "License Inactive")
   - Hover over status to see last check time

2. **Manual Refresh**
   - Open Command Palette (Ctrl/Cmd + Shift + P)
   - Run "Shadow Clone: Refresh License Status"
   - Watch status bar update

3. **Verify Auto-Refresh**
   - Note the "Last checked" time in tooltip
   - Wait 30+ minutes
   - Check tooltip again - time should update

## Technical Details

### New Components
- `LicenseStatusManager` service handles all status checks
- Implements interval-based refresh with Timer
- Uses VS Code's globalState for persistence
- Event-driven updates via EventEmitter

### API Calls
- Primary: `GET /shadow_clone_licenses`
- Fallback: `POST /shadow-clone-licenses/validate`
- Headers: `X-API-Key: {apiKey}`

### Performance
- Single status check on startup
- Cached results between checks
- No redundant API calls
- Graceful degradation on errors

This ensures your license status is always accurate and up-to-date without manual intervention!