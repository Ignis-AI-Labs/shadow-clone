# Shadow Clone Startup License Check (v0.2.0)

## New Feature: Automatic License Verification on Startup

The VS Code extension now automatically checks your license status every time VS Code starts, ensuring you always know your current license status immediately.

## What Happens on Startup

### 1. **Extension Activation**
When VS Code starts and Shadow Clone extension loads:
- Checks if you're authenticated
- If authenticated, immediately verifies license status
- Shows progress notification during verification

### 2. **Visual Feedback**
During startup check:
- **Progress Bar**: "Shadow Clone: Verifying license status..."
- **Status Bar**: Shows spinning sync icon

After check completes:
- **Active License**: ✅ "Shadow Clone: License verified - [license type]"
- **Inactive License**: ⚠️ Warning message about inactive status
- **Check Failed**: ⚠️ "Could not verify license status"

### 3. **Console Logging**
For debugging, the extension logs:
```
Shadow Clone: Checking license status on startup...
Shadow Clone: Startup license check complete - Active: true, Type: tripleOG
```

## Complete License Check Timeline

1. **VS Code Starts** → Immediate license check
2. **Every 30 Minutes** → Automatic refresh
3. **Manual Refresh** → On-demand via command
4. **Auth Changes** → Check after login/logout

## Benefits

### Immediate Awareness
- Know your license status as soon as VS Code opens
- No delays or uncertainty about access
- Clear visual indicators in status bar

### Proactive Notifications
- Warning if license is inactive
- Prevents surprises when trying to use features
- Helps maintain continuous access

### Better User Experience
- Seamless integration with VS Code startup
- Non-blocking progress indicators
- Cached status for offline scenarios

## Technical Implementation

### Startup Sequence
```javascript
1. Extension activates
2. Check authentication status
3. If authenticated:
   - Show progress notification
   - Force fresh license check
   - Update all UI components
   - Show result message
4. Continue normal operations
```

### Error Handling
- Network failures don't block extension startup
- Falls back to cached status if available
- Clear error messages for troubleshooting

### Performance
- Asynchronous check doesn't block VS Code
- Other extension features load in parallel
- Minimal impact on startup time

## Testing the Feature

1. **Close VS Code completely**
2. **Open VS Code**
3. **Watch for**:
   - Progress notification in bottom right
   - Status bar updates
   - Result message (5 seconds)

## Troubleshooting

### No License Check on Startup
- Ensure you're authenticated first
- Check VS Code Developer Tools for errors
- Verify network connectivity

### Check Takes Too Long
- Default timeout is 30 seconds
- Check your internet connection
- API might be experiencing delays

### Wrong Status Shown
- Use "Refresh License Status" command
- Check with Ignis Dashboard directly
- Ensure API key is valid

This ensures you're always aware of your license status from the moment you start working!