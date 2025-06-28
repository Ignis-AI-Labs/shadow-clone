# ERC-1155 NFT Verification Update

## Overview
Updated the Ignis Elite NFT verification to properly handle ERC-1155 tokens instead of ERC-721.

## Key Changes

### 1. **Token Standards**
- Changed from ERC-721 to ERC-1155 verification
- Updated ABI to use ERC-1155 functions:
  - `balanceOf(address account, uint256 id)` - Check balance for specific token ID
  - `balanceOfBatch` - Check multiple balances at once
  - `uri(uint256 id)` - Get metadata URI

### 2. **Token ID Mapping**
```javascript
IGNIS_CONTRACTS = {
  PHASE_1: {
    address: '0x42347db440ef412bbe19c0841895a4b98256885b',
    tokenId: 1  // Token ID 1
  },
  PHASE_2: {
    address: '0x17a2b200cec625b431c3ae7334d2d8ddb41712ce',
    tokenId: 0  // Token ID 0
  },
  PHASE_3: {
    address: '0xab505a667039d08d8e33cef95c81897a8b5fed1a',
    tokenId: 0  // Token ID 0
  }
}
```

### 3. **Ownership Structure**
Changed from tracking array of token IDs to balance count:
```typescript
interface NFTOwnership {
  phase: 'phase_1' | 'phase_2' | 'phase_3';
  contract: string;
  tokenId: number;      // The specific token ID (0 or 1)
  balance: number;      // How many they own
  collectionName?: string;
}
```

### 4. **Verification Process**
1. For each phase, check `balanceOf(wallet, tokenId)`
2. If balance > 0, they own that phase NFT
3. Users can own multiple of the same token (ERC-1155 feature)

### 5. **API Response Updates**
```json
{
  "tokenId": 1,      // The token ID for this phase
  "balance": 2,      // They own 2 of this NFT
  // instead of "tokenIds": [123, 456]
}
```

## Benefits of ERC-1155

1. **Fungible within ID**: Users can own multiple of the same token ID
2. **Gas Efficient**: Batch operations for checking multiple tokens
3. **Simpler Logic**: Just check balance for known token IDs (0 or 1)

## Testing Notes

When testing:
- Phase 1: Check balance of token ID 1
- Phase 2 & 3: Check balance of token ID 0
- Users may own multiple copies of the same NFT
- Total NFT count = sum of all balances across phases