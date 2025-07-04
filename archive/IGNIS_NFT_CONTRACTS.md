# Ignis Elite NFT Contract Addresses

## Ethereum Mainnet Contracts (ERC-1155)

### Ignis Elite Phase 1
- **Contract Type**: ERC-1155
- **Contract Address**: `0x42347db440ef412bbe19c0841895a4b98256885b`
- **Token ID**: 1
- **Etherscan**: https://etherscan.io/address/0x42347db440ef412bbe19c0841895a4b98256885b
- **License Type**: `ignis_elite_phase_1`

### Ignis Elite Phase 2
- **Contract Type**: ERC-1155
- **Contract Address**: `0x17a2b200cec625b431c3ae7334d2d8ddb41712ce`
- **Token ID**: 0
- **Etherscan**: https://etherscan.io/address/0x17a2b200cec625b431c3ae7334d2d8ddb41712ce
- **License Type**: `ignis_elite_phase_2`

### Ignis Elite Phase 3
- **Contract Type**: ERC-1155
- **Contract Address**: `0xab505a667039d08d8e33cef95c81897a8b5fed1a`
- **Token ID**: 0
- **Etherscan**: https://etherscan.io/address/0xab505a667039d08d8e33cef95c81897a8b5fed1a
- **License Type**: `ignis_elite_phase_3`

## Implementation Plan

### 1. Direct Blockchain Verification
Instead of relying on user-provided data, we'll directly query the Ethereum blockchain to verify NFT ownership.

### 2. Required Dependencies
```json
{
  "ethers": "^6.9.0"
}
```

### 3. Verification Flow
1. User provides wallet address
2. API queries each contract to check if wallet owns any NFTs
3. If ownership confirmed, generate Shadow Clone license
4. Store wallet + contract + tokenId to prevent duplicate claims

### 4. Smart Contract Interface
```javascript
// ERC1155 ABI for checking balances
const ERC1155_ABI = [
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function balanceOfBatch(address[] accounts, uint256[] ids) view returns (uint256[])",
  "function uri(uint256 id) view returns (string)"
];
```

### 5. Security Benefits
- **No Spoofing**: Can't fake NFT ownership
- **Real-time Verification**: Always current ownership status
- **No Token ID Required**: We find the tokens they own
- **Multi-Phase Support**: Check all three contracts automatically

## API Changes

### Updated Claim Endpoint
```
POST /api/license/claim/ignis
{
  "walletAddress": "0x...",
  "email": "user@example.com"
}
```

The API will:
1. Check all three Ignis Elite contracts
2. Find which NFTs the wallet owns
3. Create appropriate license based on phase
4. Return license details

### Response
```json
{
  "success": true,
  "data": {
    "apiKey": "sk_ignis_phase1_xxxxx",
    "licenseId": "lic_xxxxx",
    "email": "user@example.com",
    "walletAddress": "0x...",
    "nftContract": "0x42347db440ef412bbe19c0841895a4b98256885b",
    "phase": "phase_1",
    "tokenId": 1,
    "balance": 2,
    "message": "Ignis Elite Phase 1 license activated!"
  }
}
```