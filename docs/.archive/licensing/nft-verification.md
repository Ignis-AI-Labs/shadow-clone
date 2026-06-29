# NFT Verification

How Shadow Clone verifies your license through NFT ownership.

---

## How It Works

### Overview

Shadow Clone uses NFT ownership for licensing:

```
Your Wallet → Owns NFT → Dashboard → API Key → Shadow Clone Tools
```

### Verification Flow

1. **You authenticate** with your API key
2. **Server checks** key against database
3. **Wallet lookup** finds associated wallet
4. **Blockchain query** verifies NFT ownership
5. **Tier determined** based on NFT held
6. **Access granted** to appropriate tools

### Real-Time Verification

Every tool call verifies:
- API key is valid
- Associated wallet exists
- NFT is still owned
- Correct tier permissions

This ensures only current NFT holders have access.

---

## Why NFT Licensing?

### Benefits

1. **Transferable** - Sell or gift your license
2. **Verifiable** - Blockchain-proven ownership
3. **Permanent** - No recurring subscriptions
4. **Secure** - Cannot be faked or duplicated
5. **Decentralized** - Not dependent on central database

### How It Differs from Traditional Licensing

| Traditional | NFT-Based |
|-------------|-----------|
| License key tied to email | License tied to wallet |
| Cannot transfer | Fully transferable |
| Subscription fees | One-time purchase |
| Central database | Blockchain verified |
| Can be revoked | Owner controls |

---

## Setting Up NFT Verification

### Step 1: Own an Ignis Labs NFT

Purchase from official collection:
- Check supported marketplaces
- Verify collection address
- Complete purchase to your wallet

### Step 2: Connect Wallet to Dashboard

1. Go to [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
2. Click "Connect Wallet"
3. Select your wallet (MetaMask, etc.)
4. Sign the verification message
5. Dashboard shows your NFT(s)

### Step 3: Generate API Key

1. In dashboard, click "Generate API Key"
2. Name your key (optional)
3. Copy the key immediately (shown once)
4. Store securely

### Step 4: Use API Key

```
authenticate(apiKey: "ignis_YOUR_KEY")
```

---

## Verification Details

### What Gets Verified

| Check | What It Verifies |
|-------|------------------|
| API Key | Key exists and is active |
| Wallet | Wallet is linked to key |
| NFT Ownership | Wallet holds valid NFT |
| NFT Tier | Which tier NFT is held |
| Product Access | Key is for Shadow Clone |

### Verification Speed

- First auth: ~2-3 seconds (blockchain query)
- Cached: ~100ms (24-hour cache)
- Re-verification: On each tool call

### Caching

To avoid constant blockchain queries:
- Ownership cached for 24 hours
- Session valid for 24 hours
- Cache invalidated on NFT transfer

---

## NFT Transfer Scenarios

### You Sell Your NFT

1. NFT transfers to new owner
2. Your next tool call fails verification
3. Your API key becomes invalid
4. New owner can generate their key

**Timeline**: Immediate (next tool call)

### You Buy an NFT

1. NFT arrives in your wallet
2. Connect wallet to dashboard
3. NFT appears in your account
4. Generate API key
5. Start using Shadow Clone

**Timeline**: Immediate after blockchain confirms

### You Upgrade (Buy Higher Tier)

1. Purchase higher-tier NFT
2. Dashboard auto-detects on next visit
3. Existing API key gains new permissions
4. No action needed

**Timeline**: Automatic on next verification

---

## Security

### API Key Security

- Keys are hashed in database
- Only key prefix stored in plain text
- Original key never stored

### Wallet Security

- Dashboard uses signature verification
- No private key access required
- Read-only blockchain queries

### What We Store

| Data | Stored | Purpose |
|------|--------|---------|
| Wallet address | Yes | Link key to wallet |
| API key hash | Yes | Verify authentication |
| API key prefix | Yes | Key identification |
| NFT data | No | Queried from blockchain |
| Private keys | Never | Not needed |

---

## Troubleshooting

### NFT Not Showing in Dashboard

1. **Confirm purchase completed**
   - Check transaction on block explorer
   - NFT should be in your wallet

2. **Refresh dashboard**
   - Disconnect and reconnect wallet
   - Clear browser cache

3. **Check correct wallet**
   - NFT must be in connected wallet
   - Check you're connected with right account

4. **Wait for sync**
   - New purchases may take a few minutes
   - Blockchain confirmation needed

### Verification Failing After Transfer

If you still hold the NFT but verification fails:

1. **Reconnect wallet** to dashboard
2. **Generate new API key**
3. **Authenticate** with new key

### "No License" Error

1. **Check wallet connection** in dashboard
2. **Verify NFT ownership** in your wallet
3. **Ensure correct product** (Shadow Clone NFT, not other Ignis NFTs)

---

## Supported Wallets

Dashboard supports:
- MetaMask
- WalletConnect (various wallets)
- Coinbase Wallet
- Other injected wallets

### Recommended

MetaMask for best compatibility:
1. Install MetaMask extension
2. Import or create wallet
3. Connect to dashboard

---

## FAQ

### Can I use a hardware wallet?

Yes, through MetaMask or WalletConnect integration.

### What if the blockchain is slow?

Verification uses cached results when possible. Initial auth may take a few extra seconds during congestion.

### Is my wallet at risk?

No. Dashboard only:
- Reads your public address
- Requests signature for verification
- Queries blockchain for NFT ownership

No transaction permissions requested.

### What blockchain are the NFTs on?

Check Ignis Labs official documentation for current blockchain.

### Can I use a multisig wallet?

Technically yes, but signature verification may be more complex. Standard EOA wallets recommended.

---

## Related Topics

- [License Tiers](tiers.md)
- [Authentication Guide](../getting-started/authentication.md)
- [API Key Status Tool](../tools/utility.md#api_key_status)
