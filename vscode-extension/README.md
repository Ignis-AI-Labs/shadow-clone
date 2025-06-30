# Shadow Clone VS Code Extension

Deploy teams of specialized AI agents to complete complex software projects directly from VS Code.

## Prerequisites & Installation

Before using Shadow Clone, ensure you have all required dependencies installed. Follow these steps in order:

### 1. Windows Subsystem for Linux (WSL) - Windows Users Only

Shadow Clone's AI agents require a Unix-like environment. Windows users must install WSL:

```bash
# Open PowerShell as Administrator and run:
wsl --install

# After installation, restart your computer
# Set up your Linux distribution (Ubuntu recommended)
# Create a username and password when prompted
```

For detailed WSL setup: https://docs.microsoft.com/en-us/windows/wsl/install

### 2. Node.js and npm

Shadow Clone requires Node.js 18.0.0 or higher:

**Option A: Using Node Version Manager (nvm) - Recommended**
```bash
# Install nvm (Linux/macOS/WSL)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run:
source ~/.bashrc

# Install and use Node.js
nvm install 18
nvm use 18

# Verify installation
node --version  # Should show v18.x.x or higher
npm --version   # Should show 8.x.x or higher
```

**Option B: Direct Installation**
- Download from https://nodejs.org/ (LTS version recommended)
- Follow installer instructions for your OS
- Verify installation with `node --version`

### 3. Claude Code CLI

Shadow Clone integrates with Anthropic's Claude Code for AI agent execution.

**⚠️ WSL/Linux Users - Avoid Permission Errors:**

We provide an automated setup script that configures npm properly to avoid permission errors:

```bash
# Download and run the setup script
curl -o setup-wsl.sh https://raw.githubusercontent.com/shadow-clone/vscode-extension/main/scripts/setup-wsl.sh
chmod +x setup-wsl.sh
./setup-wsl.sh

# After script completes, restart your terminal or run:
source ~/.bashrc
```

**Manual Installation (All Platforms):**

```bash
# Option 1: Configure npm to install global packages without sudo (Recommended)
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=$PATH:~/.npm-global/bin' >> ~/.bashrc
source ~/.bashrc

# Now install Claude Code
npm install -g @anthropic/claude-code

# Option 2: Use sudo (Not recommended, but works)
sudo npm install -g @anthropic/claude-code

# Option 3: Use npx (No installation needed)
npx @anthropic/claude-code --version
```

**Verify Installation:**
```bash
# Check if Claude is installed
claude --version

# If command not found, ensure PATH is updated:
echo $PATH | grep npm-global
# Should show your npm-global/bin directory

# Authenticate Claude (you'll need an Anthropic API key)
claude auth
```

**Getting a Claude API Key:**
1. Visit https://console.anthropic.com
2. Create an account or sign in
3. Navigate to API Keys section
4. Generate a new API key
5. Save it securely (you'll need it for authentication)

**Common WSL Issues:**
- **Permission denied**: Use the setup script or configure npm prefix as shown above
- **Command not found**: Restart terminal or run `source ~/.bashrc`
- **Path issues**: Check that `~/.npm-global/bin` is in your PATH

### 4. VS Code Extension Installation

**Option A: From VS Code Marketplace**
1. Open VS Code
2. Go to Extensions (Ctrl/Cmd + Shift + X)
3. Search for "Shadow Clone AI"
4. Click Install

**Option B: Manual Installation**
```bash
# Download the .vsix file from releases
# Install using VS Code CLI
code --install-extension shadow-clone-*.vsix
```

### 5. Shadow Clone License

Shadow Clone requires an active license:
1. Obtain an NFT license (Ignis Elite holders have automatic access)
2. Get your API key from the Shadow Clone dashboard
3. Authenticate in VS Code using the Shadow Clone sidebar

### Quick Start Checklist

- [ ] WSL installed and configured (Windows only)
- [ ] Node.js 18+ and npm installed
- [ ] Claude Code CLI installed (`npm install -g @anthropic/claude-code`)
- [ ] Claude authenticated (`claude auth`)
- [ ] VS Code Shadow Clone extension installed
- [ ] Shadow Clone API key obtained and configured

### Troubleshooting Common Issues

**WSL Issues (Windows)**
- If `wsl --install` fails, enable WSL feature first:
  ```powershell
  dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
  dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
  ```
- Restart and try `wsl --install` again

**Node.js Issues**
- Permission errors: Use `nvm` instead of system Node.js
- Version conflicts: Ensure Node.js 18+ with `node --version`

**Claude Code Installation Issues**

1. **EACCES Permission Denied Error**
   ```bash
   # Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules'
   # Solution: Configure npm to use a user directory
   mkdir -p ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=$PATH:~/.npm-global/bin' >> ~/.bashrc
   source ~/.bashrc
   npm install -g @anthropic/claude-code
   ```

2. **Command Not Found After Installation**
   ```bash
   # Ensure PATH includes npm global bin
   echo $PATH | grep npm-global
   
   # If missing, add it:
   echo 'export PATH=$PATH:~/.npm-global/bin' >> ~/.bashrc
   source ~/.bashrc
   
   # Or for immediate use:
   export PATH=$PATH:~/.npm-global/bin
   ```

3. **WSL-Specific Network Issues**
   ```bash
   # If npm install fails with network errors in WSL:
   # Check DNS settings
   echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
   
   # Or disable IPv6 temporarily
   sudo sysctl -w net.ipv6.conf.all.disable_ipv6=1
   ```

4. **Alternative Installation Methods**
   ```bash
   # Using yarn (if npm fails)
   yarn global add @anthropic/claude-code
   
   # Using npx (no installation)
   npx @anthropic/claude-code auth
   
   # Using nvm's npm (cleanest approach)
   nvm use 18
   npm install -g @anthropic/claude-code
   ```

**Extension Issues**
- Extension not loading: Check VS Code version (1.74.0+ required)
- API connection fails: Verify internet connection and API endpoint
- License verification fails: Ensure valid Shadow Clone API key

## Features

- **AI Agent Orchestration**: Deploy up to 10 specialized AI agents per wave
- **Real-time Progress Tracking**: Monitor agent activity and project status
- **Integrated Project Management**: Create and manage projects from the sidebar
- **Secure Authentication**: API key-based access with license verification
- **Wave-based Deployment**: Organize large projects into manageable waves
- **Claude Code Integration**: Launch Claude with embedded Shadow Clone prompts
- **Intellectual Property Protection**: Prompts served via API, never stored locally

## Installation

1. Install from VS Code Marketplace: Search for "Shadow Clone AI"
2. Or install manually: Download the `.vsix` file and run:
   ```bash
   code --install-extension shadow-clone-*.vsix
   ```

## Getting Started

1. **Authenticate**: Click the Shadow Clone icon in the activity bar and authenticate with your API key
2. **Create Project**: Use `Cmd/Ctrl + Shift + P` → "Shadow Clone: Create New Project"
3. **Deploy Agents**: Select your project and deploy AI agents
4. **Monitor Progress**: View real-time updates in the Shadow Clone output panel

## Commands

- `Shadow Clone: Authenticate` - Connect your Shadow Clone account
- `Shadow Clone: Create New Project` - Start a new AI-powered project
- `Shadow Clone: Deploy AI Agents` - Deploy agents to work on your project
- `Shadow Clone: Show Project Status` - View account and project information
- `Shadow Clone: Launch Claude` - Open Claude Code with Shadow Clone prompts
- `Shadow Clone: Show Sessions` - View active Claude sessions
- `Shadow Clone: Build Custom Command` - Create custom Shadow Clone commands

## Exclusive Access

Shadow Clone uses NFT-based licensing for security and exclusivity:

### 🔥 Ignis Elite NFT Collection (777 Total)
- **Phase 1**: 100 NFTs - Original holders
- **Phase 2**: 200 NFTs - Second release
- **Phase 3**: 477 NFTs - Final release
- All 777 Ignis Elite NFT holders receive complimentary lifetime access
- Premium tier benefits for all Ignis Elite holders

### 🚀 Pioneer Access (500 NFTs)
- Planned future release
- Early adopter benefits
- Details coming soon

### 🏗️ Builder Access (500 NFTs)
- Planned future release
- Agency/team features
- Partner verification required
- Details coming soon

### 💎 Reserve Access (223 NFTs)
- Planned future release
- Premium support tier
- Limited availability
- Details coming soon

**Total Platform Capacity**: 2,000 NFT licenses
**Current Access**: Ignis Elite NFT holders only (777 total)
**Security Model**: All access controlled via NFT ownership to ensure platform integrity

## Claude Code Integration

Shadow Clone works seamlessly with Claude Code:

1. **Launch from VS Code**: Click "Launch Claude" button in status bar
2. **Select Mode**: Choose from audit, feature, debug, etc.
3. **Secure Prompts**: Prompts are fetched from API and embedded in commands
4. **Paste & Execute**: Copy command and paste in Claude terminal

### Intellectual Property Protection

- **No Local Prompt Files**: All prompts served dynamically via API
- **Session-Based Access**: Prompts are ephemeral and tied to sessions
- **Authentication Required**: Valid license required to access prompts
- **Copy Protection**: Prompts cannot be saved or exported
- **Encrypted Transmission**: All API communication via HTTPS

## System Requirements

- **VS Code**: Version 1.74.0 or higher
- **Node.js**: Version 18.0.0 or higher
- **Operating System**: Windows (with WSL), macOS, or Linux
- **Claude Code CLI**: Latest version (`@anthropic/claude-code`)
- **Internet**: Stable connection for API access
- **License**: Active Shadow Clone NFT license

## Configuration

Access settings through VS Code preferences:

- `shadowClone.apiEndpoint`: API endpoint (default: https://api.shadowclone.ai)
- `shadowClone.wavesDirectory`: Directory for agent outputs (default: .waves)
- `shadowClone.maxAgentsPerWave`: Maximum agents per deployment (default: 10)

## Security

- **API Key Storage**: Secured using VS Code's secret storage
- **Encrypted Communication**: All API calls via HTTPS
- **Source Protection**: Extension code obfuscated with Webpack
- **Prompt Protection**: Shadow Clone prompts never stored locally
- **Server Validation**: All operations verified server-side
- **Session Isolation**: Each Claude session has unique access tokens
- **No File Access**: Prompts delivered via API, not filesystem
- **Audit Trail**: All prompt access logged for security

## Support

- **Documentation**: https://docs.shadowclone.ai
- **Issues**: https://github.com/shadow-clone/support/issues
- **Email**: support@shadowclone.ai

## Privacy

Shadow Clone extension collects minimal telemetry:
- Authentication events
- Project creation (anonymous)
- Error reports (opt-in)

No source code or project details are transmitted without explicit deployment.

---

© 2024 Shadow Clone AI. All rights reserved.