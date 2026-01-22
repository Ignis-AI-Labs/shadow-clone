/**
 * HTML Templates for Local Auth Server
 *
 * These templates are served by the local authentication server
 * to enable browser-based API key entry.
 */

/**
 * Common CSS styles for all auth pages
 */
const getStyles = (): string => `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #e0e0e0;
  }

  .container {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 40px;
    max-width: 420px;
    width: 90%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .logo {
    text-align: center;
    margin-bottom: 24px;
  }

  .logo-icon {
    font-size: 48px;
    margin-bottom: 8px;
  }

  .logo h1 {
    font-size: 24px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 4px;
  }

  .logo p {
    font-size: 14px;
    color: #a0a0a0;
  }

  h2 {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 24px;
    text-align: center;
    color: #fff;
  }

  .form-group {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #b0b0b0;
  }

  input[type="password"],
  input[type="text"] {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    font-size: 16px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  input[type="password"]:focus,
  input[type="text"]:focus {
    outline: none;
    border-color: #4a9eff;
    box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.2);
  }

  input[type="password"]::placeholder,
  input[type="text"]::placeholder {
    color: #666;
  }

  button {
    width: 100%;
    padding: 14px 24px;
    background: linear-gradient(135deg, #4a9eff 0%, #3a7bd5 100%);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(74, 158, 255, 0.4);
  }

  button:active:not(:disabled) {
    transform: translateY(0);
  }

  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .loading {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .link {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
  }

  .link a {
    color: #4a9eff;
    text-decoration: none;
  }

  .link a:hover {
    text-decoration: underline;
  }

  .success-icon {
    font-size: 64px;
    text-align: center;
    margin-bottom: 16px;
  }

  .error-icon {
    font-size: 64px;
    text-align: center;
    margin-bottom: 16px;
  }

  .message {
    text-align: center;
    margin-bottom: 24px;
    line-height: 1.6;
  }

  .message.success {
    color: #4ade80;
  }

  .message.error {
    color: #f87171;
  }

  .badge {
    display: inline-block;
    padding: 4px 12px;
    background: rgba(74, 222, 128, 0.2);
    color: #4ade80;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    margin-top: 8px;
  }

  .security-note {
    background: rgba(74, 158, 255, 0.1);
    border: 1px solid rgba(74, 158, 255, 0.3);
    border-radius: 8px;
    padding: 12px;
    margin-top: 20px;
    font-size: 13px;
    color: #a0c4ff;
  }

  .security-note strong {
    color: #4a9eff;
  }

  .close-note {
    text-align: center;
    margin-top: 20px;
    font-size: 13px;
    color: #808080;
  }

  .hidden {
    display: none;
  }
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
</head>
<body>
  <div class="container">
    <div class="logo">
      <div class="logo-icon">&#128126;</div>
      <h1>Shadow Clone</h1>
      <p>by Ignis Labs</p>
    </div>

    <h2>Enter Your API Key</h2>

    <form id="authForm" method="POST" action="/auth">
      <input type="hidden" name="csrf_token" value="${csrfToken}">

      <div class="form-group">
        <label for="apiKey">API Key</label>
        <input
          type="password"
          id="apiKey"
          name="apiKey"
          placeholder="sk-shadow-..."
          required
          autocomplete="off"
          minlength="10"
        >
      </div>

      <button type="submit" id="submitBtn">
        <span id="btnText">Authenticate</span>
        <span id="btnLoading" class="hidden"><span class="loading"></span>Authenticating...</span>
      </button>
    </form>

    <div class="link">
      <a href="https://dashboard.ignislabs.ai" target="_blank" rel="noopener">Get your API key at dashboard.ignislabs.ai</a>
    </div>

    <div class="security-note">
      <strong>Secure Authentication:</strong> Your API key is entered locally on your machine and sent directly to Ignis Labs for verification. It is never exposed to the MCP client.
    </div>
  </div>

  <script>
    const form = document.getElementById('authForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');

    form.addEventListener('submit', function(e) {
      submitBtn.disabled = true;
      btnText.classList.add('hidden');
      btnLoading.classList.remove('hidden');
    });
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
    <div class="logo">
      <div class="logo-icon">&#128126;</div>
      <h1>Shadow Clone</h1>
      <p>by Ignis Labs</p>
    </div>

    <div class="success-icon">&#10004;</div>

    <div class="message success">
      <strong>Authentication Successful!</strong>
      <br><br>
      You can now return to your MCP client and use all Shadow Clone tools.
      <br>
      <span class="badge">${escapeHtml(licenseType)} License</span>
    </div>

    <div class="close-note">
      This window will close automatically. You can also close it manually.
    </div>
  </div>

  <script>
    // Auto-close after 3 seconds
    setTimeout(function() {
      window.close();
    }, 3000);
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
    <div class="logo">
      <div class="logo-icon">&#128126;</div>
      <h1>Shadow Clone</h1>
      <p>by Ignis Labs</p>
    </div>

    <div class="error-icon">&#10060;</div>

    <div class="message error">
      <strong>Authentication Failed</strong>
      <br><br>
      ${escapeHtml(errorMessage)}
    </div>

    <button onclick="window.location.href='/'">Try Again</button>

    <div class="link">
      <a href="https://dashboard.ignislabs.ai" target="_blank" rel="noopener">Get a new API key at dashboard.ignislabs.ai</a>
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
