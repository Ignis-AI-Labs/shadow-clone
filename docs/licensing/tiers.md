# License Tiers

Shadow Clone is licensed through Ignis Labs NFTs. Your tier determines your access level.

---

## Available Tiers

### Ignis Elite

**The full Shadow Clone experience.**

| Feature | Access |
|---------|--------|
| All orchestration tools | ✅ |
| All team deployment | ✅ |
| All rapid tools | ✅ |
| All specialist agents | ✅ |
| Unlimited waves | ✅ |
| Max agents per wave | 20 |
| Priority support | ✅ |

**Best for**: Professional developers, teams, power users

---

### Pioneer

**Core functionality for serious users.**

| Feature | Access |
|---------|--------|
| shadow_clone_orchestrate | ✅ |
| shadow_clone_plan | ✅ |
| deploy_agent_team | ✅ |
| deploy_specialist_agent | ✅ |
| quick_fix | ✅ |
| code_review_team | ✅ |
| generate_tests | ✅ |
| Max agents per wave | 10 |
| Community support | ✅ |

**Best for**: Individual developers with regular use

---

### Builder

**Essential tools to get started.**

| Feature | Access |
|---------|--------|
| shadow_clone_plan | ✅ |
| quick_fix | ✅ |
| deploy_specialist_agent | ✅ |
| create_documentation | ✅ |
| Max agents per wave | 5 |
| Community support | ✅ |

**Best for**: Developers trying Shadow Clone

---

## Feature Comparison

| Feature | Elite | Pioneer | Builder |
|---------|-------|---------|---------|
| **Orchestration** ||||
| shadow_clone_orchestrate | ✅ | ✅ | ❌ |
| shadow_clone_plan | ✅ | ✅ | ✅ |
| **Teams** ||||
| deploy_agent_team | ✅ | ✅ | ❌ |
| deploy_specialist_agent | ✅ | ✅ | ✅ |
| **Rapid Tools** ||||
| quick_fix | ✅ | ✅ | ✅ |
| code_review_team | ✅ | ✅ | ❌ |
| generate_tests | ✅ | ✅ | ❌ |
| execute_single_wave | ✅ | ❌ | ❌ |
| create_documentation | ✅ | ✅ | ✅ |
| architecture_consultant | ✅ | ✅ | ❌ |
| **Limits** ||||
| Max agents per wave | 20 | 10 | 5 |
| **Support** ||||
| Priority support | ✅ | ❌ | ❌ |
| Community support | ✅ | ✅ | ✅ |

---

## Checking Your Tier

### Method 1: api_key_status Tool

```
api_key_status()
```

Returns:
```
Authentication: ✅ Active
License Type: ignisElite
```

### Method 2: Dashboard

1. Go to [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
2. Connect your wallet
3. View your license tier

---

## Upgrading Your Tier

### How to Upgrade

1. **Purchase higher-tier NFT** from Ignis Labs collection
2. **Connect wallet** to dashboard with new NFT
3. **Generate new API key** (optional - existing key auto-upgrades)
4. **Enjoy new features** immediately

### Upgrade Paths

```
Builder → Pioneer → Elite
```

Each tier includes all features of lower tiers.

### Where to Buy

- Official collection on supported marketplaces
- Check [Ignis Labs website](https://ignislabs.ai) for current listings

---

## Multiple Licenses

### Using Multiple Devices

One license works on unlimited devices:
- Use same API key everywhere
- Claude Code and Claude Desktop both work
- No per-device limits

### Team Usage

Each team member needs their own license:
- One NFT = one license
- Cannot share API keys between users
- Enterprise options available for teams

---

## License Verification

How verification works:

1. **You call a tool** - Any Shadow Clone tool
2. **API key checked** - Key validated against database
3. **NFT verified** - Real-time blockchain verification
4. **Tier determined** - Your NFT tier sets permissions
5. **Tool executes** - If authorized for your tier

This happens automatically on every tool call.

---

## FAQ

### What if I sell my NFT?

- Your API key becomes invalid
- New owner can generate their own key
- Immediate transition (blockchain-verified)

### What if I buy a second NFT?

- Highest tier applies
- You only need one NFT per tier

### Can I downgrade?

- Selling your NFT ends your license
- You can purchase a lower tier
- No refunds on NFT purchases

### Is there a free tier?

- No free tier currently
- Builder tier is entry-level

---

## Related Topics

- [NFT Verification](nft-verification.md)
- [Authentication Guide](../getting-started/authentication.md)
- [Support](../troubleshooting/support.md)
