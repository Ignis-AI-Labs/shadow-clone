# Shadow Clone Admin Account Setup

## Overview

Shadow Clone admin accounts are now managed through the Ignis Dashboard at `https://api.ignislabs.ai`. 

## Creating an Admin Account

Since you have tripleOG NFT holder status, you can create and manage Shadow Clone licenses through the Ignis Dashboard.

### Steps:

1. **Access the Ignis Dashboard**
   - Navigate to your Ignis Dashboard
   - You should have admin/tripleOG access

2. **Create Shadow Clone License**
   - tripleOG holders can create 1 license key
   - The license key serves as your API key for Shadow Clone

3. **License Types Available**:
   ```javascript
   // Based on NFT ownership:
   - tripleOG: Own all 3 phases (Phase 1, 2, and 3)
   - doubleOG: Own Phase 1
   - singleOG: Own Phase 2
   - ignisElite: Own Phase 3
   ```

4. **Test Addresses** (for development):
   ```javascript
   const testAddresses = [
     "0xc7892218FfE73AaFA2Dc1Bd118d26c2C324c1291",
     "0x4faa0fac32f844acaf59b5b5a72c0d38de8bd0cd", 
     "0x98164369278d01270158BaDc39A5b96f71758C13"
   ];
   ```

## Using Your Admin Account

Once you have your API key from the Ignis Dashboard:

1. **In VS Code Extension**:
   - Install `shadow-clone-0.1.6.vsix`
   - Run "Shadow Clone: Authenticate"
   - Enter your API key from Ignis Dashboard

2. **API Validation**:
   ```bash
   curl -X POST https://api.ignislabs.ai/shadow-clone-licenses/validate \
     -H "Content-Type: application/json" \
     -H "X-API-Key: YOUR_API_KEY" \
     -d '{"apiKey": "YOUR_API_KEY"}'
   ```

3. **Expected Response**:
   ```json
   {
     "valid": true,
     "userId": "your-user-id",
     "licenseType": "tripleOG"
   }
   ```

## Important Notes

1. **No More Test Keys**: The system no longer accepts `test-key-123`
2. **All Auth Through Ignis**: All authentication goes through the Ignis Dashboard
3. **One License Per Wallet**: Each wallet can only claim one license
4. **Regeneration**: You can regenerate your API key if needed through the dashboard

## Security Best Practices

1. **Never share your API key**
2. **Store it securely** (use environment variables)
3. **Regenerate if compromised**
4. **Use HTTPS only** for all API calls

## Need Help?

- Check the Ignis Dashboard documentation
- Contact your development team for dashboard access
- Ensure your wallet is connected with the correct NFTs