/**
 * HTML Templates for Local Auth Server
 *
 * These templates are served by the local authentication server
 * to enable browser-based API key entry and wallet connection.
 *
 * Design system matches Ignis Labs brand guidelines.
 */

// Constants for timeout values
const PAGE_CLOSE_DELAY_MS = 3000; // 3 seconds before auto-closing success pages
const SUCCESS_REDIRECT_DELAY_MS = 500; // 0.5 seconds for success redirect
const LOGOUT_AUTO_CLOSE_DELAY_MS = 5000; // 5 seconds before auto-closing logout success

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
  <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/6.9.0/ethers.umd.min.js" integrity="sha384-ro/pNP1sfmhdbpq60NKzKAYve9JahlgCklXcKvudVEd/osRAYz2RlPG5TvB7Q04t" crossorigin="anonymous"></script>
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
              csrf_token: ${JSON.stringify(csrfToken)}
            })
          });

          const data = await response.json();

          if (data.success) {
            // Check if we need to redirect (existing key or new key scenarios)
            if (data.redirectUrl) {
              showWalletStatus('Success! Redirecting...', 'success');
              setTimeout(() => {
                window.location.href = data.redirectUrl;
              }, 500);
            } else if (data.apiKey) {
              // Direct auth flow (legacy or simple case)
              apiKeyInput.value = data.apiKey;
              showWalletStatus('Success! Redirecting...', 'success');
              setTimeout(() => form.submit(), 500);
            } else if (data.existingKey) {
              // Existing key scenario - redirect to existing key page
              showWalletStatus('Existing key found. Redirecting...', 'info');
              setTimeout(() => {
                window.location.href = '/existing-key?masked=' + encodeURIComponent(data.maskedKey) + '&wallet=' + encodeURIComponent(data.walletAddress);
              }, 500);
            }
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
    setTimeout(function() { window.close(); }, ${PAGE_CLOSE_DELAY_MS});
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
 * Get the existing key page when user has a masked key
 * Shows options to paste their full key or regenerate a new one
 * @param csrfToken - CSRF token for forms
 * @param maskedKey - The masked API key from backend (e.g., "ignis_abc1...xyz9")
 * @param walletAddress - The connected wallet address
 */
export function getExistingKeyPage(csrfToken: string, maskedKey: string, walletAddress: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shadow Clone - Existing API Key</title>
  <style>${getStyles()}</style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/6.9.0/ethers.umd.min.js" integrity="sha384-ro/pNP1sfmhdbpq60NKzKAYve9JahlgCklXcKvudVEd/osRAYz2RlPG5TvB7Q04t" crossorigin="anonymous"></script>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="brand">
        <div class="brand-logo">${getLogoSvg()}</div>
        <div class="brand-title">Ignis Labs</div>
        <div class="brand-product">Shadow Clone</div>
      </div>

      <div class="section-header">
        <div class="section-title">Existing API Key Found</div>
        <div class="section-subtitle">You already have an API key associated with this wallet</div>
      </div>

      <!-- Wallet Connected State -->
      <div class="wallet-connected">
        <div class="wallet-header">
          <div class="wallet-label">
            <span class="wallet-indicator"></span>
            Connected
          </div>
        </div>
        <div class="wallet-address">${escapeHtml(walletAddress)}</div>
      </div>

      <!-- Masked Key Display -->
      <div class="status warning" style="margin-top: 16px;">
        <span class="status-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </span>
        <span>Your existing key: <code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px;">${escapeHtml(maskedKey)}</code><br/>We cannot show the full key for security. Choose an option below.</span>
      </div>

      <!-- Status Messages -->
      <div id="statusMessage" class="status hidden">
        <span class="status-icon"></span>
        <span id="statusText"></span>
      </div>

      <!-- Option 1: Paste API Key -->
      <div style="margin-top: 24px;">
        <div class="section-title" style="text-align: left; font-size: 13px; margin-bottom: 12px;">Option 1: Enter Your Saved API Key</div>
        <form id="pasteKeyForm" method="POST" action="/paste-key">
          <input type="hidden" name="csrf_token" value="${csrfToken}">
          <input type="hidden" name="walletAddress" value="${escapeHtml(walletAddress)}">
          <div class="form-group">
            <input
              type="password"
              id="apiKey"
              name="apiKey"
              class="form-input"
              placeholder="Paste your full API key..."
              autocomplete="off"
              minlength="10"
            >
          </div>
          <button type="submit" id="pasteKeyBtn" class="btn-secondary">
            <span id="pasteKeyBtnText">Authenticate with Saved Key</span>
            <span id="pasteKeyBtnLoading" class="hidden"><span class="spinner"></span></span>
          </button>
        </form>
      </div>

      <div class="divider">
        <span class="divider-text">or</span>
      </div>

      <!-- Option 2: Regenerate Key -->
      <div>
        <div class="section-title" style="text-align: left; font-size: 13px; margin-bottom: 12px;">Option 2: Regenerate New API Key</div>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">
          This will revoke your existing key and create a new one. Requires a new wallet signature.
        </p>
        <button type="button" id="regenerateBtn" class="btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            <path d="M21 2v6h-6"/>
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8"/>
            <path d="M3 22v-6h6"/>
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
          </svg>
          <span id="regenerateBtnText">Regenerate API Key</span>
          <span id="regenerateBtnLoading" class="hidden"><span class="spinner"></span></span>
        </button>
      </div>

      <div class="footer">
        <a href="/" class="footer-link">← Back to login</a>
      </div>
    </div>
  </div>

  <script>
    const pasteKeyForm = document.getElementById('pasteKeyForm');
    const pasteKeyBtn = document.getElementById('pasteKeyBtn');
    const pasteKeyBtnText = document.getElementById('pasteKeyBtnText');
    const pasteKeyBtnLoading = document.getElementById('pasteKeyBtnLoading');
    const apiKeyInput = document.getElementById('apiKey');
    const regenerateBtn = document.getElementById('regenerateBtn');
    const regenerateBtnText = document.getElementById('regenerateBtnText');
    const regenerateBtnLoading = document.getElementById('regenerateBtnLoading');
    const statusMessage = document.getElementById('statusMessage');
    const statusText = document.getElementById('statusText');

    function showStatus(message, type) {
      statusText.textContent = message;
      statusMessage.className = 'status ' + type;
      statusMessage.classList.remove('hidden');
    }

    function hideStatus() {
      statusMessage.classList.add('hidden');
    }

    // Paste key form handler
    pasteKeyForm.addEventListener('submit', function(e) {
      if (!apiKeyInput.value || apiKeyInput.value.length < 10) {
        e.preventDefault();
        showStatus('Please enter a valid API key', 'error');
        return;
      }
      hideStatus();
      pasteKeyBtn.disabled = true;
      pasteKeyBtnText.classList.add('hidden');
      pasteKeyBtnLoading.classList.remove('hidden');
    });

    // ERC-712 Types for Regenerate
    const ERC712_REGENERATE_TYPES = {
      Regenerate: [
        { name: 'wallet', type: 'address' },
        { name: 'nonce', type: 'string' },
        { name: 'deadline', type: 'uint256' },
        { name: 'action', type: 'string' }
      ]
    };

    // Regenerate button handler
    regenerateBtn.addEventListener('click', async function() {
      if (typeof window.ethereum === 'undefined') {
        showStatus('No wallet detected. Please install MetaMask.', 'error');
        return;
      }

      try {
        regenerateBtn.disabled = true;
        regenerateBtnText.textContent = 'Signing...';
        regenerateBtnLoading.classList.remove('hidden');
        hideStatus();

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        // Verify it's the same wallet
        if (address.toLowerCase() !== ${JSON.stringify(walletAddress.toLowerCase())}) {
          showStatus('Please connect the same wallet: ' + ${JSON.stringify(walletAddress.slice(0, 10))} + '...', 'error');
          regenerateBtn.disabled = false;
          regenerateBtnText.textContent = 'Regenerate API Key';
          regenerateBtnLoading.classList.add('hidden');
          return;
        }

        const network = await provider.getNetwork();
        const chainId = Number(network.chainId);

        const ERC712_DOMAIN = {
          name: 'Shadow Clone',
          version: '1',
          chainId: chainId
        };

        const message = {
          wallet: address,
          nonce: crypto.randomUUID(),
          deadline: BigInt(Math.floor(Date.now() / 1000) + 300),
          action: 'regenerate'
        };

        showStatus('Please sign the regenerate request in your wallet...', 'info');

        const signature = await signer.signTypedData(ERC712_DOMAIN, ERC712_REGENERATE_TYPES, message);

        showStatus('Regenerating API key...', 'info');

        const response = await fetch('/regenerate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: {
              wallet: message.wallet,
              nonce: message.nonce,
              deadline: Number(message.deadline),
              action: message.action
            },
            signature: signature,
            csrf_token: ${JSON.stringify(csrfToken)}
          })
        });

        const data = await response.json();

        if (data.success && data.token) {
          showStatus('Success! Redirecting...', 'success');
          // Redirect to success page with token (not key in URL)
          window.location.href = '/regenerate-success?token=' + encodeURIComponent(data.token);
        } else {
          showStatus(data.message || 'Regeneration failed', 'error');
          regenerateBtn.disabled = false;
          regenerateBtnText.textContent = 'Regenerate API Key';
          regenerateBtnLoading.classList.add('hidden');
        }
      } catch (error) {
        console.error('Regenerate error:', error);
        if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
          showStatus('Signature cancelled', 'warning');
        } else {
          showStatus('Error: ' + (error.message || 'Unknown error'), 'error');
        }
        regenerateBtn.disabled = false;
        regenerateBtnText.textContent = 'Regenerate API Key';
        regenerateBtnLoading.classList.add('hidden');
      }
    });
  </script>
</body>
</html>`;
}

/**
 * Get the regenerate success page showing the new API key
 * @param token - The token to retrieve the API key
 * @param csrfToken - CSRF token for auth submission
 */
export function getRegenerateSuccessPage(token: string, csrfToken: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shadow Clone - New API Key Generated</title>
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
        <div class="success-title">New API Key Generated</div>
        <div class="success-text">
          Your old key has been revoked and a new one has been created.
        </div>
        <div id="licenseBadge" class="license-badge hidden">Loading...</div>
      </div>

      <!-- Loading State -->
      <div id="loadingState" class="status info" style="margin-top: 24px;">
        <span class="status-icon"><span class="spinner"></span></span>
        <span>Retrieving your API key...</span>
      </div>

      <!-- API Key Display (hidden until loaded) -->
      <div id="keySection" class="hidden">
        <div class="status warning" style="margin-top: 24px;">
          <span class="status-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </span>
          <span><strong>Save this key now!</strong> You won't be able to see it again.</span>
        </div>

        <div class="form-group" style="margin-top: 16px;">
          <label class="form-label">Your New API Key</label>
          <div style="position: relative;">
            <input
              type="text"
              id="apiKeyDisplay"
              class="form-input"
              readonly
              style="padding-right: 90px; font-family: monospace;"
            >
            <button type="button" id="copyBtn" onclick="copyKey()" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: var(--accent-copper); border: none; color: white; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500;">
              Copy
            </button>
          </div>
        </div>

        <div id="copyStatus" class="status success hidden" style="margin-top: 12px;">
          <span class="status-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
          <span>Copied to clipboard!</span>
        </div>

        <button type="button" id="continueBtn" class="btn-primary" style="margin-top: 24px;" disabled onclick="completeAuth()">
          <span id="continueBtnText">Copy key first to continue</span>
          <span id="continueBtnLoading" class="hidden"><span class="spinner"></span></span>
        </button>

        <div class="footer-note" style="margin-top: 16px;">
          Store this key securely. You will need it if you log out or authenticate from another device.
        </div>
      </div>

      <div id="errorStatus" class="status error hidden" style="margin-top: 12px;">
        <span class="status-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </span>
        <span id="errorStatusText"></span>
      </div>
    </div>
  </div>

  <script>
    let keyCopied = false;
    let apiKey = '';
    const csrfToken = ${JSON.stringify(csrfToken)};
    const token = ${JSON.stringify(token)};

    // Fetch the API key securely via POST
    async function fetchApiKey() {
      try {
        const response = await fetch('/get-key-by-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: token, csrf_token: csrfToken })
        });
        const data = await response.json();

        if (data.success && data.apiKey) {
          apiKey = data.apiKey;
          document.getElementById('apiKeyDisplay').value = apiKey;
          document.getElementById('licenseBadge').textContent = (data.license || 'Active') + ' License';
          document.getElementById('licenseBadge').classList.remove('hidden');
          document.getElementById('loadingState').classList.add('hidden');
          document.getElementById('keySection').classList.remove('hidden');
          document.getElementById('apiKeyDisplay').focus();
        } else {
          showError(data.message || 'Failed to retrieve API key. Please restart the authentication process.');
          document.getElementById('loadingState').classList.add('hidden');
        }
      } catch (error) {
        showError('Failed to retrieve API key. Please restart the authentication process.');
        document.getElementById('loadingState').classList.add('hidden');
      }
    }

    function copyKey() {
      const keyInput = document.getElementById('apiKeyDisplay');
      keyInput.select();
      document.execCommand('copy');

      const copyStatus = document.getElementById('copyStatus');
      copyStatus.classList.remove('hidden');

      // Hide any previous error
      document.getElementById('errorStatus').classList.add('hidden');

      keyCopied = true;
      const continueBtn = document.getElementById('continueBtn');
      const continueBtnText = document.getElementById('continueBtnText');
      continueBtn.disabled = false;
      continueBtnText.textContent = 'Continue to Shadow Clone';
    }

    function showError(message) {
      const errorStatus = document.getElementById('errorStatus');
      document.getElementById('errorStatusText').textContent = message;
      errorStatus.classList.remove('hidden');
    }

    function completeAuth() {
      if (!keyCopied || !apiKey) return;

      const continueBtn = document.getElementById('continueBtn');
      const continueBtnText = document.getElementById('continueBtnText');
      const continueBtnLoading = document.getElementById('continueBtnLoading');

      // Show loading state immediately
      continueBtn.disabled = true;
      continueBtnText.classList.add('hidden');
      continueBtnLoading.classList.remove('hidden');

      // Hide any previous error
      document.getElementById('errorStatus').classList.add('hidden');

      // Submit to complete authentication
      fetch('/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'apiKey=' + encodeURIComponent(apiKey) + '&csrf_token=' + encodeURIComponent(csrfToken)
      }).then(response => {
        if (response.ok) {
          window.location.href = '/success';
        } else {
          throw new Error('Authentication failed');
        }
      }).catch(error => {
        // Reset button state on error
        continueBtn.disabled = false;
        continueBtnText.classList.remove('hidden');
        continueBtnLoading.classList.add('hidden');
        showError(error.message || 'Failed to complete authentication. Please try again.');
      });
    }

    // Fetch key on page load
    fetchApiKey();
  </script>
</body>
</html>`;
}

/**
 * Get the new key success page (for first-time wallet auth)
 * @param token - The token to retrieve the API key
 * @param csrfToken - CSRF token for auth submission
 */
export function getNewKeySuccessPage(token: string, csrfToken: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shadow Clone - API Key Created</title>
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
        <div class="success-title">API Key Created</div>
        <div class="success-text">
          Your wallet has been verified and an API key has been generated.
        </div>
        <div id="licenseBadge" class="license-badge hidden">Loading...</div>
      </div>

      <!-- Loading State -->
      <div id="loadingState" class="status info" style="margin-top: 24px;">
        <span class="status-icon"><span class="spinner"></span></span>
        <span>Retrieving your API key...</span>
      </div>

      <!-- API Key Display (hidden until loaded) -->
      <div id="keySection" class="hidden">
        <div class="status warning" style="margin-top: 24px;">
          <span class="status-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </span>
          <span><strong>Save this key now!</strong> You won't be able to see it again.</span>
        </div>

        <div class="form-group" style="margin-top: 16px;">
          <label class="form-label">Your API Key</label>
          <div style="position: relative;">
            <input
              type="text"
              id="apiKeyDisplay"
              class="form-input"
              readonly
              style="padding-right: 90px; font-family: monospace;"
            >
            <button type="button" id="copyBtn" onclick="copyKey()" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: var(--accent-copper); border: none; color: white; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500;">
              Copy
            </button>
          </div>
        </div>

        <div id="copyStatus" class="status success hidden" style="margin-top: 12px;">
          <span class="status-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
          <span>Copied to clipboard!</span>
        </div>

        <button type="button" id="continueBtn" class="btn-primary" style="margin-top: 24px;" disabled onclick="completeAuth()">
          <span id="continueBtnText">Copy key first to continue</span>
          <span id="continueBtnLoading" class="hidden"><span class="spinner"></span></span>
        </button>

        <div class="footer-note" style="margin-top: 16px;">
          Store this key securely. You will need it if you log out or authenticate from another device.
        </div>
      </div>

      <div id="errorStatus" class="status error hidden" style="margin-top: 12px;">
        <span class="status-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </span>
        <span id="errorStatusText"></span>
      </div>
    </div>
  </div>

  <script>
    let keyCopied = false;
    let apiKey = '';
    const csrfToken = ${JSON.stringify(csrfToken)};
    const token = ${JSON.stringify(token)};

    // Fetch the API key securely via POST
    async function fetchApiKey() {
      try {
        const response = await fetch('/get-key-by-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: token, csrf_token: csrfToken })
        });
        const data = await response.json();

        if (data.success && data.apiKey) {
          apiKey = data.apiKey;
          document.getElementById('apiKeyDisplay').value = apiKey;
          document.getElementById('licenseBadge').textContent = (data.license || 'Active') + ' License';
          document.getElementById('licenseBadge').classList.remove('hidden');
          document.getElementById('loadingState').classList.add('hidden');
          document.getElementById('keySection').classList.remove('hidden');
          document.getElementById('apiKeyDisplay').focus();
        } else {
          showError(data.message || 'Failed to retrieve API key. Please restart the authentication process.');
          document.getElementById('loadingState').classList.add('hidden');
        }
      } catch (error) {
        showError('Failed to retrieve API key. Please restart the authentication process.');
        document.getElementById('loadingState').classList.add('hidden');
      }
    }

    function copyKey() {
      const keyInput = document.getElementById('apiKeyDisplay');
      keyInput.select();
      document.execCommand('copy');

      const copyStatus = document.getElementById('copyStatus');
      copyStatus.classList.remove('hidden');

      // Hide any previous error
      document.getElementById('errorStatus').classList.add('hidden');

      keyCopied = true;
      const continueBtn = document.getElementById('continueBtn');
      const continueBtnText = document.getElementById('continueBtnText');
      continueBtn.disabled = false;
      continueBtnText.textContent = 'Continue to Shadow Clone';
    }

    function showError(message) {
      const errorStatus = document.getElementById('errorStatus');
      document.getElementById('errorStatusText').textContent = message;
      errorStatus.classList.remove('hidden');
    }

    function completeAuth() {
      if (!keyCopied || !apiKey) return;

      const continueBtn = document.getElementById('continueBtn');
      const continueBtnText = document.getElementById('continueBtnText');
      const continueBtnLoading = document.getElementById('continueBtnLoading');

      // Show loading state immediately
      continueBtn.disabled = true;
      continueBtnText.classList.add('hidden');
      continueBtnLoading.classList.remove('hidden');

      // Hide any previous error
      document.getElementById('errorStatus').classList.add('hidden');

      // Submit to complete authentication
      fetch('/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'apiKey=' + encodeURIComponent(apiKey) + '&csrf_token=' + encodeURIComponent(csrfToken)
      }).then(response => {
        if (response.ok) {
          window.location.href = '/success';
        } else {
          throw new Error('Authentication failed');
        }
      }).catch(error => {
        // Reset button state on error
        continueBtn.disabled = false;
        continueBtnText.classList.remove('hidden');
        continueBtnLoading.classList.add('hidden');
        showError(error.message || 'Failed to complete authentication. Please try again.');
      });
    }

    // Fetch key on page load
    fetchApiKey();
  </script>
</body>
</html>`;
}

/**
 * Get the logout page with options
 * @param csrfToken - CSRF token for forms
 * @param maskedApiKey - The masked API key
 * @param walletAddress - The wallet address (optional)
 */
export function getLogoutPage(csrfToken: string, maskedApiKey: string, walletAddress?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shadow Clone - Logout</title>
  <style>${getStyles()}</style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/6.9.0/ethers.umd.min.js" integrity="sha384-ro/pNP1sfmhdbpq60NKzKAYve9JahlgCklXcKvudVEd/osRAYz2RlPG5TvB7Q04t" crossorigin="anonymous"></script>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="brand">
        <div class="brand-logo">${getLogoSvg()}</div>
        <div class="brand-title">Ignis Labs</div>
        <div class="brand-product">Shadow Clone</div>
      </div>

      <div class="section-header">
        <div class="section-title">Logout from Shadow Clone</div>
        <div class="section-subtitle">Choose how you want to logout</div>
      </div>

      <!-- Current Session Info -->
      <div class="status info" style="margin-bottom: 24px;">
        <span class="status-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </span>
        <span>Current API key: <code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px;">${escapeHtml(maskedApiKey)}</code></span>
      </div>

      <!-- Status Messages -->
      <div id="statusMessage" class="status hidden">
        <span class="status-icon"></span>
        <span id="statusText"></span>
      </div>

      <!-- Option 1: Copy & Logout Locally -->
      <div style="margin-bottom: 16px;">
        <button type="button" id="copyLogoutBtn" class="btn-secondary" style="text-align: left;">
          <div style="display: flex; align-items: flex-start; gap: 12px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24" style="flex-shrink: 0; margin-top: 2px;">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            <div>
              <div style="font-weight: 600; margin-bottom: 4px;">Copy API Key & Logout Locally</div>
              <div style="font-size: 12px; color: var(--text-muted);">Keep your key valid for later use. You can re-authenticate anytime.</div>
            </div>
          </div>
        </button>
      </div>

      <!-- Option 2: Revoke Permanently -->
      <div style="margin-bottom: 24px;">
        <button type="button" id="revokeBtn" class="btn-secondary" style="text-align: left; border-color: rgba(239, 68, 68, 0.3);">
          <div style="display: flex; align-items: flex-start; gap: 12px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" stroke-width="2" width="24" height="24" style="flex-shrink: 0; margin-top: 2px;">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
            <div>
              <div style="font-weight: 600; margin-bottom: 4px; color: var(--accent-red);">Revoke API Key Permanently</div>
              <div style="font-size: 12px; color: var(--text-muted);">Requires wallet signature. Key cannot be recovered after revocation!</div>
            </div>
          </div>
        </button>
      </div>

      <button type="button" id="cancelBtn" class="btn-secondary" onclick="window.close()">
        Cancel
      </button>

      <div class="footer-note" style="margin-top: 16px;">
        Logging out locally keeps your key valid. Use "Revoke" only if you want to permanently invalidate your key.
      </div>
    </div>
  </div>

  <!-- Copy & Logout Modal -->
  <div id="copyModal" class="hidden" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 100;">
    <div class="card" style="max-width: 400px; margin: 20px;">
      <div class="section-header">
        <div class="section-title">Copy Your API Key</div>
        <div class="section-subtitle">Save this key before logging out</div>
      </div>

      <div class="form-group">
        <label class="form-label">Your API Key</label>
        <div style="position: relative;">
          <input
            type="text"
            id="apiKeyDisplay"
            class="form-input"
            readonly
            style="padding-right: 90px; font-family: monospace;"
          >
          <button type="button" id="copyKeyBtn" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: var(--accent-copper); border: none; color: white; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500;">
            Copy
          </button>
        </div>
      </div>

      <div id="copyConfirmStatus" class="status success hidden" style="margin-top: 12px;">
        <span class="status-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
        <span>Copied to clipboard!</span>
      </div>

      <button type="button" id="completeLogoutBtn" class="btn-primary" style="margin-top: 16px;" disabled>
        <span id="completeLogoutBtnText">Copy key first to continue</span>
        <span id="completeLogoutBtnLoading" class="hidden"><span class="spinner"></span></span>
      </button>

      <button type="button" id="cancelCopyBtn" class="btn-secondary" style="margin-top: 8px;">
        Cancel
      </button>
    </div>
  </div>

  <!-- Revoke Confirmation Modal -->
  <div id="revokeModal" class="hidden" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 100;">
    <div class="card" style="max-width: 400px; margin: 20px;">
      <div class="error-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>

      <div class="section-header">
        <div class="section-title" style="color: var(--accent-red);">Permanent Revocation</div>
        <div class="section-subtitle">This action cannot be undone</div>
      </div>

      <div class="status error" style="margin-bottom: 16px;">
        <span class="status-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </span>
        <span>Your API key will be permanently invalidated. You will need to regenerate a new key to use Shadow Clone again.</span>
      </div>

      <div id="revokeStatus" class="status hidden" style="margin-bottom: 16px;">
        <span class="status-icon"></span>
        <span id="revokeStatusText"></span>
      </div>

      <button type="button" id="confirmRevokeBtn" class="btn-primary" style="background: var(--accent-red);">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <span id="confirmRevokeBtnText">Connect Wallet & Revoke</span>
        <span id="confirmRevokeBtnLoading" class="hidden"><span class="spinner"></span></span>
      </button>

      <button type="button" id="cancelRevokeBtn" class="btn-secondary" style="margin-top: 8px;">
        Cancel
      </button>
    </div>
  </div>

  <script>
    const copyLogoutBtn = document.getElementById('copyLogoutBtn');
    const revokeBtn = document.getElementById('revokeBtn');
    const copyModal = document.getElementById('copyModal');
    const revokeModal = document.getElementById('revokeModal');
    const apiKeyDisplay = document.getElementById('apiKeyDisplay');
    const copyKeyBtn = document.getElementById('copyKeyBtn');
    const copyConfirmStatus = document.getElementById('copyConfirmStatus');
    const completeLogoutBtn = document.getElementById('completeLogoutBtn');
    const completeLogoutBtnText = document.getElementById('completeLogoutBtnText');
    const completeLogoutBtnLoading = document.getElementById('completeLogoutBtnLoading');
    const cancelCopyBtn = document.getElementById('cancelCopyBtn');
    const confirmRevokeBtn = document.getElementById('confirmRevokeBtn');
    const confirmRevokeBtnText = document.getElementById('confirmRevokeBtnText');
    const confirmRevokeBtnLoading = document.getElementById('confirmRevokeBtnLoading');
    const cancelRevokeBtn = document.getElementById('cancelRevokeBtn');
    const revokeStatus = document.getElementById('revokeStatus');
    const revokeStatusText = document.getElementById('revokeStatusText');
    const statusMessage = document.getElementById('statusMessage');
    const statusText = document.getElementById('statusText');

    let keyCopied = false;
    // Use JSON.stringify for safe JS injection
    const walletAddress = ${JSON.stringify(walletAddress || '')};

    function showStatus(message, type) {
      statusText.textContent = message;
      statusMessage.className = 'status ' + type;
      statusMessage.classList.remove('hidden');
    }

    function showRevokeStatus(message, type) {
      revokeStatusText.textContent = message;
      revokeStatus.className = 'status ' + type;
      revokeStatus.classList.remove('hidden');
    }

    // Show copy modal
    copyLogoutBtn.addEventListener('click', async function() {
      // First fetch the full API key
      try {
        showStatus('Fetching your API key...', 'info');
        const response = await fetch('/logout/get-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csrf_token: ${JSON.stringify(csrfToken)} })
        });
        const data = await response.json();
        if (data.success && data.apiKey) {
          apiKeyDisplay.value = data.apiKey;
          copyModal.classList.remove('hidden');
          copyModal.style.display = 'flex';
          statusMessage.classList.add('hidden');
        } else {
          showStatus(data.message || 'Failed to retrieve API key', 'error');
        }
      } catch (error) {
        showStatus('Failed to retrieve API key', 'error');
      }
    });

    // Copy key button
    copyKeyBtn.addEventListener('click', function() {
      apiKeyDisplay.select();
      document.execCommand('copy');
      copyConfirmStatus.classList.remove('hidden');
      keyCopied = true;
      completeLogoutBtn.disabled = false;
      completeLogoutBtnText.textContent = 'Complete Logout';
    });

    // Complete logout button
    completeLogoutBtn.addEventListener('click', async function() {
      if (!keyCopied) return;

      completeLogoutBtn.disabled = true;
      completeLogoutBtnText.classList.add('hidden');
      completeLogoutBtnLoading.classList.remove('hidden');

      try {
        const response = await fetch('/logout/local', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csrf_token: ${JSON.stringify(csrfToken)} })
        });
        const data = await response.json();
        if (data.success) {
          window.location.href = '/logout/success?type=local';
        } else {
          showStatus(data.message || 'Logout failed', 'error');
          copyModal.classList.add('hidden');
          copyModal.style.display = 'none';
        }
      } catch (error) {
        showStatus('Logout failed', 'error');
        copyModal.classList.add('hidden');
        copyModal.style.display = 'none';
      }
    });

    // Cancel copy modal
    cancelCopyBtn.addEventListener('click', function() {
      copyModal.classList.add('hidden');
      copyModal.style.display = 'none';
      keyCopied = false;
      completeLogoutBtn.disabled = true;
      completeLogoutBtnText.textContent = 'Copy key first to continue';
      copyConfirmStatus.classList.add('hidden');
    });

    // Show revoke modal
    revokeBtn.addEventListener('click', function() {
      revokeModal.classList.remove('hidden');
      revokeModal.style.display = 'flex';
    });

    // Cancel revoke modal
    cancelRevokeBtn.addEventListener('click', function() {
      revokeModal.classList.add('hidden');
      revokeModal.style.display = 'none';
      revokeStatus.classList.add('hidden');
    });

    // ERC-712 Types for Revoke
    const ERC712_REVOKE_TYPES = {
      Revoke: [
        { name: 'wallet', type: 'address' },
        { name: 'nonce', type: 'string' },
        { name: 'deadline', type: 'uint256' },
        { name: 'action', type: 'string' }
      ]
    };

    // Confirm revoke button
    confirmRevokeBtn.addEventListener('click', async function() {
      if (typeof window.ethereum === 'undefined') {
        showRevokeStatus('No wallet detected. Please install MetaMask.', 'error');
        return;
      }

      try {
        confirmRevokeBtn.disabled = true;
        confirmRevokeBtnText.textContent = 'Connecting...';
        confirmRevokeBtnLoading.classList.remove('hidden');

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        // Verify wallet if we have one
        if (walletAddress && address.toLowerCase() !== walletAddress.toLowerCase()) {
          showRevokeStatus('Please connect the wallet associated with this API key.', 'error');
          confirmRevokeBtn.disabled = false;
          confirmRevokeBtnText.textContent = 'Connect Wallet & Revoke';
          confirmRevokeBtnLoading.classList.add('hidden');
          return;
        }

        const network = await provider.getNetwork();
        const chainId = Number(network.chainId);

        const ERC712_DOMAIN = {
          name: 'Shadow Clone',
          version: '1',
          chainId: chainId
        };

        const message = {
          wallet: address,
          nonce: crypto.randomUUID(),
          deadline: BigInt(Math.floor(Date.now() / 1000) + 300),
          action: 'revoke'
        };

        showRevokeStatus('Please sign the revoke request in your wallet...', 'info');
        confirmRevokeBtnText.textContent = 'Signing...';

        const signature = await signer.signTypedData(ERC712_DOMAIN, ERC712_REVOKE_TYPES, message);

        showRevokeStatus('Revoking API key...', 'info');
        confirmRevokeBtnText.textContent = 'Revoking...';

        const response = await fetch('/logout/revoke', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: {
              wallet: message.wallet,
              nonce: message.nonce,
              deadline: Number(message.deadline),
              action: message.action
            },
            signature: signature,
            csrf_token: ${JSON.stringify(csrfToken)}
          })
        });

        const data = await response.json();

        if (data.success) {
          window.location.href = '/logout/success?type=revoked';
        } else {
          showRevokeStatus(data.message || 'Revocation failed', 'error');
          confirmRevokeBtn.disabled = false;
          confirmRevokeBtnText.textContent = 'Connect Wallet & Revoke';
          confirmRevokeBtnLoading.classList.add('hidden');
        }
      } catch (error) {
        console.error('Revoke error:', error);
        if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
          showRevokeStatus('Signature cancelled', 'warning');
        } else {
          showRevokeStatus('Error: ' + (error.message || 'Unknown error'), 'error');
        }
        confirmRevokeBtn.disabled = false;
        confirmRevokeBtnText.textContent = 'Connect Wallet & Revoke';
        confirmRevokeBtnLoading.classList.add('hidden');
      }
    });
  </script>
</body>
</html>`;
}

/**
 * Get the logout success page
 * @param type - The type of logout ('local' or 'revoked')
 */
export function getLogoutSuccessPage(type: 'local' | 'revoked'): string {
  const isRevoked = type === 'revoked';
  const title = isRevoked ? 'API Key Revoked' : 'Logged Out Successfully';
  const message = isRevoked
    ? 'Your API key has been permanently revoked. You will need to regenerate a new key to use Shadow Clone again.'
    : 'You have been logged out. Your API key is still valid and can be used to log in again.';
  const iconColor = isRevoked ? 'var(--accent-red)' : 'var(--accent-green)';
  const iconBg = isRevoked ? 'rgba(239, 68, 68, 0.1)' : 'rgba(74, 222, 128, 0.1)';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shadow Clone - ${escapeHtml(title)}</title>
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

      <div style="width: 64px; height: 64px; margin: 0 auto 20px; background: ${iconBg}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        ${isRevoked ? `
        <svg viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" width="32" height="32">
          <path d="M3 6h18"/>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
        </svg>
        ` : `
        <svg viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" width="32" height="32">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        `}
      </div>

      <div class="success-message">
        <div class="success-title" style="${isRevoked ? 'color: var(--accent-red);' : ''}">${escapeHtml(title)}</div>
        <div class="success-text">${escapeHtml(message)}</div>
      </div>

      <div class="close-note" style="margin-top: 24px;">
        You can close this window now.
      </div>
    </div>
  </div>

  <script>
    // Use constant for timeout - auto-close after delay
    setTimeout(function() { window.close(); }, ${LOGOUT_AUTO_CLOSE_DELAY_MS});
  </script>
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
