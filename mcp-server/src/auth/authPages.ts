/**
 * HTML Templates for Local Auth Server
 *
 * These templates are served by the local authentication server
 * to enable browser-based API key entry and wallet connection.
 * 
 * Design system matches Ignis Labs brand guidelines.
 */

/**
 * Common CSS styles for all auth pages - Ignis Labs Design System
 */
const getStyles = (): string => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  :root {
    --bg-primary: #0a0a0a;
    --bg-secondary: #111111;
    --bg-card: rgba(17, 17, 17, 0.8);
    --border-subtle: rgba(255, 255, 255, 0.06);
    --border-hover: rgba(255, 255, 255, 0.12);
    
    --text-primary: #ffffff;
    --text-secondary: #a1a1a1;
    --text-muted: #666666;
    
    --accent-copper: #C97B5D;
    --accent-copper-hover: #d9917a;
    --accent-green: #4ade80;
    --accent-red: #ef4444;
    --accent-yellow: #fbbf24;
    --accent-blue: #60a5fa;
    
    --grid-color: rgba(255, 255, 255, 0.03);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--bg-primary);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-primary);
    position: relative;
  }

  /* Grid background */
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(var(--grid-color) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
  }

  /* Subtle gradient overlay */
  body::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(201, 123, 93, 0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  .container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 440px;
    padding: 20px;
  }

  .card {
    background: var(--bg-card);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border-subtle);
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 0 60px rgba(0, 0, 0, 0.5);
  }

  /* Logo & Branding */
  .brand {
    text-align: center;
    margin-bottom: 32px;
  }

  .brand-logo {
    width: 48px;
    height: 48px;
    margin: 0 auto 16px;
  }

  .brand-logo svg {
    width: 100%;
    height: 100%;
  }

  .brand-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin-bottom: 4px;
  }

  .brand-product {
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  /* Section Headers */
  .section-header {
    text-align: center;
    margin-bottom: 24px;
  }

  .section-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .section-subtitle {
    font-size: 13px;
    color: var(--text-muted);
  }

  /* Primary Button - Copper */
  .btn-primary {
    width: 100%;
    padding: 16px 24px;
    background: var(--accent-copper);
    color: var(--text-primary);
    border: none;
    border-radius: 8px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--accent-copper-hover);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(201, 123, 93, 0.3);
  }

  .btn-primary:active:not(:disabled) {
    transform: translateY(0);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .btn-primary svg {
    width: 20px;
    height: 20px;
  }

  /* Secondary Button - Dark */
  .btn-secondary {
    width: 100%;
    padding: 14px 24px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-secondary:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--border-hover);
  }

  .btn-secondary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Loading spinner */
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-top-color: var(--text-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Divider */
  .divider {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 28px 0;
  }

  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-subtle);
  }

  .divider-text {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  /* Form Elements */
  .form-group {
    margin-bottom: 16px;
  }

  .form-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
  }

  .form-input {
    width: 100%;
    padding: 14px 16px;
    background: var(--bg-primary);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    color: var(--text-primary);
    font-family: inherit;
    font-size: 14px;
    transition: all 0.2s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--accent-copper);
    box-shadow: 0 0 0 3px rgba(201, 123, 93, 0.15);
  }

  .form-input::placeholder {
    color: var(--text-muted);
  }

  /* Status Messages */
  .status {
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 13px;
    margin-top: 16px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .status-icon {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin-top: 1px;
  }

  .status.info {
    background: rgba(96, 165, 250, 0.1);
    border: 1px solid rgba(96, 165, 250, 0.2);
    color: var(--accent-blue);
  }

  .status.success {
    background: rgba(74, 222, 128, 0.1);
    border: 1px solid rgba(74, 222, 128, 0.2);
    color: var(--accent-green);
  }

  .status.error {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: var(--accent-red);
  }

  .status.warning {
    background: rgba(251, 191, 36, 0.1);
    border: 1px solid rgba(251, 191, 36, 0.2);
    color: var(--accent-yellow);
  }

  /* Wallet Connected State */
  .wallet-connected {
    background: rgba(74, 222, 128, 0.05);
    border: 1px solid rgba(74, 222, 128, 0.15);
    border-radius: 8px;
    padding: 16px;
  }

  .wallet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .wallet-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 500;
    color: var(--accent-green);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .wallet-indicator {
    width: 6px;
    height: 6px;
    background: var(--accent-green);
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .wallet-disconnect {
    padding: 6px 12px;
    background: transparent;
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 6px;
    color: var(--accent-red);
    font-family: inherit;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .wallet-disconnect:hover {
    background: rgba(239, 68, 68, 0.1);
  }

  .wallet-address {
    font-family: 'SF Mono', Monaco, 'Courier New', monospace;
    font-size: 13px;
    color: var(--text-primary);
    background: var(--bg-primary);
    padding: 10px 12px;
    border-radius: 6px;
    word-break: break-all;
  }

  /* Footer */
  .footer {
    margin-top: 24px;
    text-align: center;
  }

  .footer-link {
    font-size: 13px;
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer-link:hover {
    color: var(--accent-copper);
  }

  .footer-note {
    margin-top: 16px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 8px;
    font-size: 11px;
    color: var(--text-muted);
    line-height: 1.5;
  }

  /* Success Page */
  .success-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 20px;
    background: rgba(74, 222, 128, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .success-icon svg {
    width: 32px;
    height: 32px;
    color: var(--accent-green);
  }

  .success-message {
    text-align: center;
    margin-bottom: 24px;
  }

  .success-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 8px;
  }

  .success-text {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .license-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    background: rgba(74, 222, 128, 0.1);
    border: 1px solid rgba(74, 222, 128, 0.2);
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    color: var(--accent-green);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 12px;
  }

  /* Error Page */
  .error-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 20px;
    background: rgba(239, 68, 68, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .error-icon svg {
    width: 32px;
    height: 32px;
    color: var(--accent-red);
  }

  .error-message {
    text-align: center;
    margin-bottom: 24px;
  }

  .error-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 8px;
  }

  .error-text {
    font-size: 14px;
    color: var(--accent-red);
    line-height: 1.6;
  }

  .close-note {
    text-align: center;
    font-size: 12px;
    color: var(--text-muted);
  }

  .hidden {
    display: none !important;
  }
`;

/**
 * Ignis Labs triangle logo SVG
 */
const getLogoSvg = (): string => `
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4L36 34H4L20 4Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M20 12L28 28H12L20 12Z" fill="currentColor" opacity="0.3"/>
    <circle cx="20" cy="18" r="2" fill="currentColor"/>
  </svg>
`;

/**
 * Wallet icon SVG
 */
const getWalletIconSvg = (): string => `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
  </svg>
`;

/**
 * Get the authentication form page
 * @param csrfToken - CSRF token to embed in the form
 */
export function getAuthFormPage(csrfToken: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shadow Clone - Authentication</title>
  <style>${getStyles()}</style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/6.9.0/ethers.umd.min.js" crossorigin="anonymous"></script>
</head>
<body>
  <div class="container">
    <div class="card">
      <!-- Branding -->
      <div class="brand">
        <div class="brand-logo">${getLogoSvg()}</div>
        <div class="brand-title">Ignis Labs</div>
        <div class="brand-product">Shadow Clone</div>
      </div>

      <!-- Wallet Connection Section -->
      <div class="section-header">
        <div class="section-title">Authenticate</div>
        <div class="section-subtitle">Connect your wallet or enter your API key</div>
      </div>

      <div id="walletSection">
        <!-- Connect Button -->
        <button type="button" id="connectWalletBtn" class="btn-primary">
          ${getWalletIconSvg()}
          <span id="walletBtnText">Connect Wallet</span>
          <span id="walletBtnLoading" class="hidden"><span class="spinner"></span></span>
        </button>

        <!-- Connected State -->
        <div id="walletConnected" class="wallet-connected hidden">
          <div class="wallet-header">
            <div class="wallet-label">
              <span class="wallet-indicator"></span>
              Connected
            </div>
            <button type="button" id="disconnectBtn" class="wallet-disconnect">Disconnect</button>
          </div>
          <div id="walletAddress" class="wallet-address"></div>
        </div>

        <!-- Status Messages -->
        <div id="walletStatus" class="status hidden">
          <span class="status-icon"></span>
          <span id="walletStatusText"></span>
        </div>
      </div>

      <div class="divider">
        <span class="divider-text">or</span>
      </div>

      <!-- Manual API Key Section -->
      <form id="authForm" method="POST" action="/auth">
        <input type="hidden" name="csrf_token" value="${csrfToken}">

        <!-- API Key Status Messages -->
        <div id="apiKeyStatus" class="status hidden">
          <span class="status-icon"></span>
          <span id="apiKeyStatusText"></span>
        </div>

        <div class="form-group">
          <label class="form-label" for="apiKey">API Key</label>
          <input
            type="password"
            id="apiKey"
            name="apiKey"
            class="form-input"
            placeholder="Enter your API key..."
            autocomplete="off"
            minlength="10"
          >
        </div>

        

        <button type="submit" id="submitBtn" class="btn-secondary">
          <span id="btnText">Authenticate with API Key</span>
          <span id="btnLoading" class="hidden"><span class="spinner"></span></span>
        </button>
      </form>

      <!-- Footer -->
      <div class="footer">
        <a href="https://dashboard.ignislabs.ai" target="_blank" rel="noopener" class="footer-link">
          Get your API key at dashboard.ignislabs.ai
        </a>
        <div class="footer-note">
          Your credentials are processed locally and verified directly with Ignis Labs. They are never exposed to the MCP client.
        </div>
      </div>
    </div>
  </div>

  <script>
    // DOM Elements
    const form = document.getElementById('authForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');
    const apiKeyInput = document.getElementById('apiKey');
    const apiKeyStatus = document.getElementById('apiKeyStatus');
    const apiKeyStatusText = document.getElementById('apiKeyStatusText');
    
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    const walletBtnText = document.getElementById('walletBtnText');
    const walletBtnLoading = document.getElementById('walletBtnLoading');
    const walletConnected = document.getElementById('walletConnected');
    const walletAddressEl = document.getElementById('walletAddress');
    const disconnectBtn = document.getElementById('disconnectBtn');
    const walletStatus = document.getElementById('walletStatus');
    const walletStatusText = document.getElementById('walletStatusText');

    // State
    let connectedAddress = null;
    let provider = null;
    let signer = null;

    // Form submission handler
    form.addEventListener('submit', function(e) {
      if (!apiKeyInput.value || apiKeyInput.value.length < 10) {
        e.preventDefault();
        showApiKeyStatus('Please enter a valid API key', 'error');
        return;
      }
      hideApiKeyStatus();
      submitBtn.disabled = true;
      btnText.classList.add('hidden');
      btnLoading.classList.remove('hidden');
    });

    // Show wallet status message
    function showWalletStatus(message, type) {
      walletStatusText.textContent = message;
      walletStatus.className = 'status ' + type;
      walletStatus.classList.remove('hidden');
    }

    // Hide wallet status message
    function hideWalletStatus() {
      walletStatus.classList.add('hidden');
    }

    // Show API key status message
    function showApiKeyStatus(message, type) {
      apiKeyStatusText.textContent = message;
      apiKeyStatus.className = 'status ' + type;
      apiKeyStatus.classList.remove('hidden');
    }

    // Hide API key status message
    function hideApiKeyStatus() {
      apiKeyStatus.classList.add('hidden');
    }

    // Check if wallet is available
    function hasWallet() {
      return typeof window.ethereum !== 'undefined';
    }

    // ERC-712 Types (must match server)
    const ERC712_TYPES = {
      Auth: [
        { name: 'wallet', type: 'address' },
        { name: 'nonce', type: 'string' },
        { name: 'deadline', type: 'uint256' }
      ]
    };

    // Generate ERC-712 message for signing
    function generateAuthMessage(address) {
      return {
        wallet: address,
        nonce: crypto.randomUUID(),
        deadline: BigInt(Math.floor(Date.now() / 1000) + 300) // 5 minute expiry as BigInt
      };
    }

    // Connect wallet
    async function connectWallet() {
      if (!hasWallet()) {
        showWalletStatus('No wallet detected. Please install MetaMask or another Web3 wallet.', 'error');
        return;
      }

      try {
        connectWalletBtn.disabled = true;
        walletBtnText.textContent = 'Connecting...';
        walletBtnLoading.classList.remove('hidden');
        hideWalletStatus();

        provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        
        if (accounts.length === 0) {
          throw new Error('No accounts found');
        }

        connectedAddress = accounts[0];
        signer = await provider.getSigner();

        // Get the current chain ID from the connected network
        const network = await provider.getNetwork();
        const chainId = Number(network.chainId);

        // ERC-712 Domain (uses connected chain)
        const ERC712_DOMAIN = {
          name: 'Shadow Clone',
          version: '1',
          chainId: chainId
        };

        connectWalletBtn.classList.add('hidden');
        walletConnected.classList.remove('hidden');
        walletAddressEl.textContent = connectedAddress;

        showWalletStatus('Wallet connected. Please sign the authentication request...', 'info');

        // Generate ERC-712 typed data locally
        const message = generateAuthMessage(connectedAddress);
        
        let signature;
        try {
          // Use ERC-712 signTypedData instead of signMessage
          signature = await signer.signTypedData(ERC712_DOMAIN, ERC712_TYPES, message);
        } catch (signError) {
          console.error('ERC-712 signing error:', signError);
          // Check if user cancelled
          if (signError.code === 4001 || signError.code === 'ACTION_REJECTED') {
            showWalletStatus('Signature cancelled. Enter your API key below instead.', 'warning');
          } else {
            showWalletStatus('Signing failed: ' + (signError.message || 'Unknown error'), 'error');
          }
          return;
        }

        showWalletStatus('Verifying with server...', 'info');

        try {
          // Convert BigInt deadline to number for JSON serialization
          const messageForServer = {
            wallet: message.wallet,
            nonce: message.nonce,
            deadline: Number(message.deadline)
          };

          const response = await fetch('/wallet-auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              domain: ERC712_DOMAIN,
              types: ERC712_TYPES,
              message: messageForServer,
              signature: signature,
              csrf_token: '${csrfToken}'
            })
          });

          const data = await response.json();

          if (data.success && data.apiKey) {
            apiKeyInput.value = data.apiKey;
            showWalletStatus('Success! Redirecting...', 'success');
            setTimeout(() => form.submit(), 500);
          } else if (data.notImplemented) {
            showWalletStatus('Wallet connected. Backend integration coming soon. Please enter your API key.', 'warning');
          } else {
            showWalletStatus(data.message || 'No license found for this wallet.', 'error');
          }
        } catch (fetchError) {
          showWalletStatus('Wallet connected. Enter your API key below.', 'warning');
        }

      } catch (error) {
        connectWalletBtn.disabled = false;
        walletBtnText.textContent = 'Connect Wallet';
        walletBtnLoading.classList.add('hidden');

        if (error.code === 4001) {
          showWalletStatus('Connection cancelled.', 'warning');
        } else {
          showWalletStatus('Connection failed. Try again or use your API key.', 'error');
        }
      }
    }

    // Disconnect wallet
    function disconnectWallet() {
      connectedAddress = null;
      provider = null;
      signer = null;
      
      walletConnected.classList.add('hidden');
      connectWalletBtn.classList.remove('hidden');
      connectWalletBtn.disabled = false;
      walletBtnText.textContent = 'Connect Wallet';
      walletBtnLoading.classList.add('hidden');
      hideWalletStatus();
    }

    // Clear API key error when user starts typing
    apiKeyInput.addEventListener('input', function() {
      hideApiKeyStatus();
    });

    // Event listeners
    disconnectBtn.addEventListener('click', disconnectWallet);

    if (hasWallet()) {
      window.ethereum.on('accountsChanged', function(accounts) {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (connectedAddress && accounts[0] !== connectedAddress) {
          disconnectWallet();
          showWalletStatus('Account changed. Please reconnect.', 'warning');
        }
      });
      connectWalletBtn.addEventListener('click', connectWallet);
    } else {
      walletBtnText.textContent = 'Install Wallet';
      showWalletStatus('No wallet detected. Install MetaMask to connect, or use your API key.', 'warning');
      connectWalletBtn.addEventListener('click', function() {
        window.open('https://metamask.io/download/', '_blank');
      });
    }
  </script>
</body>
</html>`;
}

/**
 * Get the success page after authentication
 * @param licenseType - The type of license the user has
 */
export function getSuccessPage(licenseType: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shadow Clone - Authenticated</title>
  <style>${getStyles()}</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="brand">
        <div class="brand-logo">${getLogoSvg()}</div>
        <div class="brand-title">Ignis Labs</div>
        <div class="brand-product">Shadow Clone</div>
      </div>

      <div class="success-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>

      <div class="success-message">
        <div class="success-title">Authentication Successful</div>
        <div class="success-text">
          You can now return to your MCP client and use all Shadow Clone tools.
        </div>
        <div class="license-badge">${escapeHtml(licenseType)} License</div>
      </div>

      <div class="close-note">
        This window will close automatically
      </div>
    </div>
  </div>

  <script>
    setTimeout(function() { window.close(); }, 3000);
  </script>
</body>
</html>`;
}

/**
 * Get the error page when authentication fails
 * @param errorMessage - The error message to display
 */
export function getErrorPage(errorMessage: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shadow Clone - Authentication Failed</title>
  <style>${getStyles()}</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="brand">
        <div class="brand-logo">${getLogoSvg()}</div>
        <div class="brand-title">Ignis Labs</div>
        <div class="brand-product">Shadow Clone</div>
      </div>

      <div class="error-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>

      <div class="error-message">
        <div class="error-title">Authentication Failed</div>
        <div class="error-text">${escapeHtml(errorMessage)}</div>
      </div>

      <button onclick="window.location.href='/'" class="btn-primary">Try Again</button>

      <div class="footer">
        <a href="https://dashboard.ignislabs.ai" target="_blank" rel="noopener" class="footer-link">
          Get a new API key at dashboard.ignislabs.ai
        </a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Simple HTML escaping to prevent XSS
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
}
