# Shadow Clone License Status Fix

## The Problem
The VS Code extension is trying to check license status using endpoints that don't exist in the Ignis Dashboard API:
- ❌ `/user/profile` 
- ❌ `/user/license-status`
- ❌ `/projects`

The Ignis Dashboard only provides:
- ✅ `/shadow-clone-licenses/validate`

## Solution

### Option 1: Update VS Code Extension (Quick Fix)
Modify the extension to get all information from the validate endpoint:

```javascript
// In showStatus.ts
async function showStatusCommand(authProvider: AuthProvider) {
    const hasAuth = await authProvider.checkAuth();
    
    if (!hasAuth) {
        // ... authentication prompt
    }

    try {
        // Get stored auth data which includes license info
        const authData = await authProvider.getAuth();
        
        // Validate the API key to ensure it's still active
        const validationResponse = await authProvider.makeAuthenticatedRequest(
            `${getApiEndpoint()}/shadow-clone-licenses/validate`,
            {
                method: 'POST',
                data: { apiKey: authData.apiKey }
            }
        );

        if (!validationResponse.data.valid) {
            vscode.window.showErrorMessage('License is no longer valid');
            return;
        }

        // Use the stored license type from authentication
        const licenseInfo = {
            licenseType: authData.licenseType || validationResponse.data.licenseType,
            isActive: validationResponse.data.valid,
            userId: authData.userId || validationResponse.data.userId
        };

        // Show status with available information
        // ... rest of status display
    } catch (error) {
        vscode.window.showErrorMessage('Failed to check license status');
    }
}
```

### Option 2: Add Endpoints to Ignis Dashboard (Better)
Ask your developer to add these endpoints to the Ignis Dashboard:

```javascript
// GET /shadow-clone-licenses/status
// Header: X-API-Key: YOUR_API_KEY
{
  "valid": true,
  "licenseType": "tripleOG",
  "userId": "user-123",
  "isActive": true,
  "features": {
    "maxProjects": 10,
    "maxAgentsPerWave": 10
  }
}

// GET /shadow-clone/profile  
// Header: X-API-Key: YOUR_API_KEY
{
  "userId": "user-123",
  "email": "user@example.com",
  "licenseType": "tripleOG",
  "createdAt": "2024-01-01"
}
```

### Option 3: Minimal Extension Update
For now, disable the status features that don't work:

```javascript
// Simplified showStatus that only shows what's available
async function showStatusCommand(authProvider: AuthProvider) {
    const authData = await authProvider.getAuth();
    if (!authData) {
        vscode.window.showInformationMessage('Not authenticated');
        return;
    }

    vscode.window.showInformationMessage(
        `Shadow Clone Active\nLicense: ${authData.licenseType}\nAPI Key: ${authData.apiKey.substring(0, 10)}...`
    );
}
```

## Immediate Fix

Update `showStatus.ts` to remove the non-existent API calls and use only the validation endpoint and stored auth data.