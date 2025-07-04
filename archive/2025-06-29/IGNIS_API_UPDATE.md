# Shadow Clone VS Code Extension - Ignis API Integration Update

## Summary of Changes (v0.1.5)

The VS Code extension has been updated to work with the new Ignis dashboard API at `https://api.ignislabs.ai`.

### Key Updates:

1. **API Endpoint**: Changed from `https://shadow-clone-api.elijah-02b.workers.dev` to `https://api.ignislabs.ai`

2. **Validation Endpoint**: Updated from `/auth/validate` to `/shadow-clone-licenses/validate`

3. **License Types**: Updated to match the new system:
   - `tripleOG` - Users who own all three phases (Phase 1, 2, and 3)
   - `doubleOG` - Users who own Phase 1
   - `singleOG` - Users who own Phase 2  
   - `ignisElite` - Users who own Phase 3

4. **Test Addresses**: The following addresses are treated as tripleOG holders for testing:
   ```javascript
   const testAddresses = [
     "0xc7892218FfE73AaFA2Dc1Bd118d26c2C324c1291",
     "0x4faa0fac32f844acaf59b5b5a72c0d38de8bd0cd",
     "0x98164369278d01270158BaDc39A5b96f71758C13"
   ];
   ```

### Installation Instructions:

1. **Install the VSIX**:
   ```bash
   code --install-extension shadow-clone-0.1.5.vsix
   ```

2. **Configure API Endpoint** (if needed):
   - Open VS Code settings (Cmd/Ctrl + ,)
   - Search for "Shadow Clone"
   - Ensure "Shadow Clone: Api Endpoint" is set to `https://api.ignislabs.ai`

3. **Authenticate**:
   - Open Command Palette (Cmd/Ctrl + Shift + P)
   - Run "Shadow Clone: Authenticate"
   - Enter your API key from the Ignis dashboard

### API Key Generation in Ignis Dashboard:

tripleOG holders can:
- Create 1 license key
- Regenerate keys if needed

The dashboard determines license type based on:
```javascript
if (isTestUser) {
    licenseType = 'tripleOG';
} else if (phase1_count > 0 && phase2_count > 0 && phase3_count > 0) {
    licenseType = 'tripleOG';
} else if (phase1_count > 0) {
    licenseType = 'doubleOG';
} else if (phase2_count > 0) {
    licenseType = 'singleOG';
} else if (phase3_count > 0) {
    licenseType = 'ignisElite';
}
```

### Testing:

1. Get an API key from the Ignis dashboard
2. Install the extension VSIX
3. Authenticate with your API key
4. Run "Shadow Clone: Show Status" to verify connection

### Troubleshooting:

If authentication fails:
1. Verify the API endpoint in settings is `https://api.ignislabs.ai`
2. Check that your API key is valid in the Ignis dashboard
3. Ensure you have network connectivity
4. Check VS Code Developer Tools (Help > Toggle Developer Tools) for error messages

### Files Changed:

- `src/utils/constants.ts` - Updated API endpoint and license types
- `src/auth/authProvider.ts` - Updated validation endpoint
- `src/commands/showStatus.ts` - Updated license type display
- `package.json` - Version bump to 0.1.5 and updated default API endpoint