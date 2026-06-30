# Authentication Guide

Shadow Clone requires authentication to verify your license before using any tools.

## Getting Your API Key

1. Go to [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
2. Connect your wallet containing the Shadow Clone NFT
3. Generate an API key from the dashboard
4. Copy the key (starts with `ignis_`)

Your API key is tied to your wallet address and NFT ownership.

## Authenticating in Claude

Use the `authenticate` tool with your API key:

```
Please authenticate me with Shadow Clone using this API key: ignis_YOUR_KEY_HERE
```

Or more directly:

```
Use the authenticate tool with apiKey: "ignis_YOUR_KEY_HERE"
```

### Successful Authentication

```
✅ Authenticated successfully!
License type: ignisElite
All Shadow Clone tools are now available.
```

### Failed Authentication

If authentication fails, you'll see one of these messages:

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid API key" | Key is incorrect or doesn't exist | Check your key at dashboard.ignislabs.ai |
| "License inactive" | NFT not found in wallet | Ensure NFT is in the wallet linked to your API key |
| "Authentication failed" | Network or server issue | Try again in a few minutes |

## How Authentication Works

```
┌─────────────┐     ┌────────────────┐     ┌─────────────────┐
│  Your Key   │────▶│  Shadow Clone  │────▶│  Ignis API      │
│             │     │  MCP Server    │     │                 │
│             │     │                │     │  Validates key  │
│             │◀────│  Stores auth   │◀────│  Checks NFT     │
│             │     │  locally       │     │  ownership      │
└─────────────┘     └────────────────┘     └─────────────────┘
```

1. You provide your API key
2. MCP server validates with the Ignis API
3. API checks NFT ownership in your wallet
4. If valid, authentication is stored locally
5. All tools become available

## Session Duration

- **Authentication persists** for 24 hours
- **Re-validation** happens automatically when you use tools
- **Instant revocation** if NFT is transferred or sold

If you sell or transfer your NFT, access is revoked immediately on the next tool call.

## Checking Your Status

Use the `api_key_status` tool to see your current authentication state:

```
Use api_key_status to check my authentication
```

Returns:
- Whether you're authenticated
- Your license type
- Where API keys are cached
- Last validation time

## Multiple Devices

Your API key works on multiple devices:
- Same key can be used on different computers
- Each device maintains its own authentication session
- All devices must have the NFT still in your wallet

## Security Notes

- **Never share your API key** publicly
- API keys are stored securely in:
  - VS Code secret storage (encrypted)
  - `~/.shadow-clone/config.json` (locally encrypted)
- Keys are validated against real-time NFT ownership
- Transferring/selling your NFT revokes all API key access

## Troubleshooting

### "Not authenticated" when using tools

Your session expired or was invalidated:
1. Re-authenticate with your API key
2. Check NFT is still in your wallet

### Key works on one device but not another

1. Ensure both devices have the latest MCP server version
2. Re-authenticate on the failing device
3. Check for network connectivity issues

### Can't generate API key on dashboard

1. Ensure your wallet is connected
2. Verify you own a Shadow Clone NFT
3. Try a different browser or clear cache
4. Contact support if issue persists

---

## Next Steps

- [Build your first project](first-project.md)
- [Explore available tools](../tools/overview.md)
- [Understand the wave system](../concepts/wave-system.md)
