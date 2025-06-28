# Shadow Clone License API - Ignis Labs Integration

## Overview
This API allows the Ignis Labs dashboard to integrate with Shadow Clone's license system. Ignis Elite NFT holders can claim their complimentary lifetime licenses through your dashboard.

## Base URL
```
https://shadow-clone-api.elijah-02b.workers.dev
```

## API Endpoints

### 1. Claim Ignis Elite License
Allows Ignis Elite NFT holders to claim their Shadow Clone license.

**Endpoint:** `POST /api/license/claim/ignis-elite`

**Request Body:**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f6E123",
  "nftTokenId": "123",
  "email": "holder@example.com",
  "signature": "0x..." // Optional: Wallet signature for verification
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "apiKey": "sk_elite_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "licenseId": "lic_xxxxxxxxxxxxxxxx",
    "email": "holder@example.com",
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f6E123",
    "nftTokenId": 123,
    "licenseType": "ignis_elite",
    "message": "Congratulations! Your Ignis Elite license has been activated."
  }
}
```

**Error Responses:**
- `400` - Invalid request (missing fields, invalid wallet format, invalid token ID)
- `409` - NFT already claimed or email already has license
- `500` - Server error

### 2. Check NFT Claim Status
Check if a specific Ignis Elite NFT has already claimed a license.

**Endpoint:** `GET /api/license/check-nft?tokenId={tokenId}`

**Success Response (200):**
```json
{
  "success": true,
  "claimed": true,
  "data": {
    "licenseId": "lic_xxxxxxxxxxxxxxxx",
    "email": "holder@example.com",
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f6E123"
  }
}
```

### 3. Get License Availability
Get current availability for all license tiers.

**Endpoint:** `GET /api/license/availability`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "tiers": {
      "ignis_elite": {
        "total": 777,
        "claimed": 150,
        "available": 627,
        "price": 0,
        "monthly": 0,
        "benefits": ["Lifetime access", "All features", "Priority support", "Early access"]
      },
      "pioneer": {
        "total": 500,
        "claimed": 50,
        "available": 450,
        "price": 79,
        "monthly": 79,
        "benefits": ["Full access", "Community support", "Regular updates"]
      },
      "builder": {
        "total": 500,
        "claimed": 25,
        "available": 475,
        "price": 99,
        "monthly": 99,
        "benefits": ["Full access", "Priority support", "Partner benefits"]
      },
      "reserve": {
        "total": 223,
        "claimed": 10,
        "available": 213,
        "price": 149,
        "monthly": 149,
        "benefits": ["Full access", "Premium support", "Advanced features", "Custom integrations"]
      }
    },
    "summary": {
      "totalLicenses": 2000,
      "totalClaimed": 235,
      "totalAvailable": 1765,
      "percentageClaimed": "11.8"
    },
    "timestamp": "2025-06-27T12:00:00Z"
  }
}
```

## Integration Flow for Ignis Labs Dashboard

### 1. Pre-Claim Check
Before showing the claim button, check if the NFT has already been claimed:
```javascript
const response = await fetch(`https://shadow-clone-api.elijah-02b.workers.dev/api/license/check-nft?tokenId=${nftId}`);
const data = await response.json();

if (data.claimed) {
  // Show "Already Claimed" message
  // Display the email that claimed it (data.data.email)
} else {
  // Show claim form
}
```

### 2. Claim License
When user submits the claim form:
```javascript
const claimData = {
  walletAddress: userWallet,
  nftTokenId: nftId.toString(),
  email: userEmail,
  signature: walletSignature // Optional
};

const response = await fetch('https://shadow-clone-api.elijah-02b.workers.dev/api/license/claim/ignis-elite', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(claimData)
});

const result = await response.json();

if (result.success) {
  // Show success message
  // Display the API key (result.data.apiKey)
  // Recommend user saves it securely
} else {
  // Show error message (result.error)
}
```

### 3. Display License Stats
Show real-time availability on your dashboard:
```javascript
const response = await fetch('https://shadow-clone-api.elijah-02b.workers.dev/api/license/availability');
const data = await response.json();

// Display Ignis Elite stats
const ignisStats = data.data.tiers.ignis_elite;
console.log(`${ignisStats.claimed} of ${ignisStats.total} claimed`);
```

## Security Considerations

1. **CORS**: The API supports CORS, so you can call it directly from your frontend
2. **Rate Limiting**: API has rate limits to prevent abuse
3. **Validation**: All inputs are validated server-side
4. **One NFT = One License**: Each Ignis Elite NFT can only claim one license
5. **API Key Security**: Remind users to save their API key securely - it cannot be retrieved later

## Testing

For testing, you can use these test values:
- Wallet: Any valid Ethereum address format (0x...)
- NFT Token ID: Any number between 1-777
- Email: Any valid email format

## Error Handling

All error responses follow this format:
```json
{
  "success": false,
  "error": "Error message here",
  "message": "Additional details if available"
}
```

## Support

For integration support or questions:
- Email: support@shadow-clone.ai
- Discord: [Shadow Clone Discord]
- Documentation: https://docs.shadow-clone.ai

---

## Example Integration Code

Here's a complete example for your Ignis Labs dashboard:

```javascript
class ShadowCloneLicenseManager {
  constructor() {
    this.apiBase = 'https://shadow-clone-api.elijah-02b.workers.dev';
  }

  async checkNFTClaim(tokenId) {
    try {
      const response = await fetch(`${this.apiBase}/api/license/check-nft?tokenId=${tokenId}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to check NFT claim:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async claimLicense(walletAddress, nftTokenId, email) {
    try {
      const response = await fetch(`${this.apiBase}/api/license/claim/ignis-elite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          nftTokenId,
          email
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Failed to claim license:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async getAvailability() {
    try {
      const response = await fetch(`${this.apiBase}/api/license/availability`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get availability:', error);
      return { success: false, error: 'Network error' };
    }
  }
}

// Usage in your dashboard
const licenseManager = new ShadowCloneLicenseManager();

// Check if NFT can claim
const claimStatus = await licenseManager.checkNFTClaim('123');
if (!claimStatus.claimed) {
  // Show claim form
  const result = await licenseManager.claimLicense(
    '0x742d35Cc6634C0532925a3b844Bc9e7595f6E123',
    '123',
    'user@example.com'
  );
  
  if (result.success) {
    // Show API key to user
    alert(`Your API Key: ${result.data.apiKey}\n\nSave this securely!`);
  }
}
```