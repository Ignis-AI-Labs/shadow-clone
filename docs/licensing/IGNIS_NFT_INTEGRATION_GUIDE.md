# Ignis Elite NFT License Integration Guide

This guide explains how to integrate the Ignis Elite NFT license claiming system into the Shadow Clone dashboard.

## Overview

Ignis Elite NFT holders (Phase 1, 2, and 3) receive complimentary lifetime access to Shadow Clone. This system verifies NFT ownership on-chain and generates API keys for authenticated access.

## API Endpoints

**Base URL**: `https://shadow-clone-api.elijah-02b.workers.dev`

### 1. Check NFT Ownership
```
GET /api/license/check/ignis?wallet={walletAddress}
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "walletAddress": "0x123...",
    "hasClaimedLicense": false,
    "currentOwnerships": [
      {
        "phase": "phase_1",
        "contract": "0x42347db440ef412bbe19c0841895a4b98256885b",
        "tokenId": 1,
        "balance": 2,
        "collectionName": "Ignis Elite Phase 1"
      }
    ],
    "eligibleForClaim": true
  }
}
```

### 2. Claim License
```
POST /api/license/claim/ignis
Content-Type: application/json

{
  "walletAddress": "0x123...",
  "email": "user@example.com"
}
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "apiKey": "sk_ignis_elite_phase_1_xxxxx",
    "licenseId": "lic_xxxxx",
    "email": "user@example.com",
    "walletAddress": "0x123...",
    "licenseType": "ignis_elite_phase_1",
    "message": "Congratulations! Your Ignis Elite Phase 1 license has been activated."
  }
}
```

## NFT Contracts

```javascript
const IGNIS_CONTRACTS = {
  PHASE_1: {
    address: '0x42347db440ef412bbe19c0841895a4b98256885b',
    tokenId: 1
  },
  PHASE_2: {
    address: '0x17a2b200cec625b431c3ae7334d2d8ddb41712ce',
    tokenId: 0
  },
  PHASE_3: {
    address: '0xab505a667039d08d8e33cef95c81897a8b5fed1a',
    tokenId: 0
  }
};
```

## React Integration Example

```jsx
import React, { useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

const IgnisLicenseClaim = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  const [eligible, setEligible] = useState(false);

  const checkEligibility = async () => {
    if (!address) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `https://shadow-clone-api.elijah-02b.workers.dev/api/license/check/ignis?wallet=${address}`
      );
      
      const data = await response.json();
      
      if (data.success) {
        setEligibilityChecked(true);
        
        if (data.data.hasClaimedLicense) {
          setError(`This wallet has already claimed a license (Email: ${data.data.existingClaim.email})`);
          setEligible(false);
        } else if (data.data.eligibleForClaim) {
          setEligible(true);
        } else {
          setError('No Ignis Elite NFTs found in this wallet');
          setEligible(false);
        }
      } else {
        setError(data.error || 'Failed to check eligibility');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const claimLicense = async () => {
    if (!address || !email) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        'https://shadow-clone-api.elijah-02b.workers.dev/api/license/claim/ignis',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress: address,
            email: email,
          }),
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        setApiKey(data.data.apiKey);
        // Store the license info in your backend
        await saveLicenseToBackend(data.data);
      } else {
        setError(data.error || 'Failed to claim license');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveLicenseToBackend = async (licenseData) => {
    // Save to your backend database
    await fetch('/api/users/save-license', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include your auth headers
      },
      body: JSON.stringify({
        licenseId: licenseData.licenseId,
        apiKey: licenseData.apiKey, // Store securely!
        walletAddress: licenseData.walletAddress,
        email: licenseData.email,
        licenseType: licenseData.licenseType,
      }),
    });
  };

  if (!isConnected) {
    return (
      <div className="claim-container">
        <h2>Claim Your Ignis Elite License</h2>
        <p>Connect your wallet to check eligibility</p>
        <button onClick={() => connect()} className="connect-btn">
          Connect Wallet
        </button>
      </div>
    );
  }

  if (!eligibilityChecked) {
    return (
      <div className="claim-container">
        <h2>Claim Your Ignis Elite License</h2>
        <p>Wallet: {address}</p>
        <button onClick={checkEligibility} disabled={loading} className="check-btn">
          {loading ? 'Checking...' : 'Check Eligibility'}
        </button>
        {error && <div className="error">{error}</div>}
      </div>
    );
  }

  if (apiKey) {
    return (
      <div className="claim-container">
        <h2>License Claimed Successfully!</h2>
        <div className="success">
          <p>Your API Key (save this securely):</p>
          <code className="api-key">{apiKey}</code>
          <p className="warning">
            ⚠️ This is the only time you'll see this API key. 
            Save it securely now!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="claim-container">
      <h2>Claim Your Ignis Elite License</h2>
      {eligible ? (
        <>
          <p>✅ You're eligible for a complimentary lifetime license!</p>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="email-input"
          />
          <button 
            onClick={claimLicense} 
            disabled={loading || !email}
            className="claim-btn"
          >
            {loading ? 'Claiming...' : 'Claim License'}
          </button>
        </>
      ) : (
        <p>❌ {error}</p>
      )}
    </div>
  );
};

export default IgnisLicenseClaim;
```

## Next.js API Route Example

```javascript
// pages/api/license/claim-ignis.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { walletAddress } = req.body;
  
  // Get user's email from your auth system
  const email = req.user.email; // Assuming you have auth middleware

  try {
    // First check eligibility
    const checkResponse = await fetch(
      `https://shadow-clone-api.elijah-02b.workers.dev/api/license/check/ignis?wallet=${walletAddress}`
    );
    
    const checkData = await checkResponse.json();
    
    if (!checkData.data.eligibleForClaim) {
      return res.status(400).json({ 
        error: 'Not eligible for Ignis Elite license' 
      });
    }

    // Claim the license
    const claimResponse = await fetch(
      'https://shadow-clone-api.elijah-02b.workers.dev/api/license/claim/ignis',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          email,
        }),
      }
    );

    const claimData = await claimResponse.json();

    if (claimData.success) {
      // Save to your database
      await saveUserLicense(req.user.id, claimData.data);
      
      return res.status(200).json({
        success: true,
        apiKey: claimData.data.apiKey,
        message: claimData.data.message,
      });
    } else {
      return res.status(400).json({ error: claimData.error });
    }
  } catch (error) {
    console.error('License claim error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

## Security Considerations

1. **API Key Storage**: Store API keys securely encrypted in your database
2. **One-Time Display**: Show the API key only once after generation
3. **HTTPS Only**: All API calls must use HTTPS
4. **Rate Limiting**: The API has built-in rate limiting
5. **Wallet Verification**: Always verify wallet ownership before claiming

## Error Handling

Common error scenarios:

```javascript
const errorMessages = {
  'This wallet has already claimed a license': 
    'You have already claimed your Ignis Elite license',
  
  'No Ignis Elite NFTs found in this wallet': 
    'Please ensure you hold an Ignis Elite NFT in this wallet',
  
  'This email has already been used': 
    'This email is already associated with another license',
  
  'Invalid wallet address format': 
    'Please provide a valid Ethereum wallet address',
};
```

## Testing

For development testing:
- Use any valid Ethereum wallet address
- The system will verify actual NFT ownership on mainnet
- Test with known Ignis Elite holder addresses

## Database Schema

Store license information in your database:

```sql
CREATE TABLE user_licenses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  license_id VARCHAR(255) UNIQUE NOT NULL,
  api_key_hash VARCHAR(255) NOT NULL, -- Store hashed!
  wallet_address VARCHAR(42) NOT NULL,
  license_type VARCHAR(50) NOT NULL,
  claimed_at TIMESTAMP DEFAULT NOW(),
  last_verified TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);
```

## Complete Integration Checklist

- [ ] Add wallet connection (MetaMask, WalletConnect, etc.)
- [ ] Implement eligibility check before showing claim form
- [ ] Add email input validation
- [ ] Handle all error states gracefully
- [ ] Store API key securely (encrypted)
- [ ] Show API key only once after claiming
- [ ] Add loading states for better UX
- [ ] Test with mainnet Ignis Elite NFT holders
- [ ] Add success confirmation UI
- [ ] Implement proper error messages

## Support

For integration issues:
- Check the browser console for detailed error messages
- Verify the wallet has Ignis Elite NFTs on Etherscan
- Ensure proper CORS headers if calling from frontend
- Contact support@shadow-clone.ai for API issues