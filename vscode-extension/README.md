# Shadow Clone VS Code Extension

Deploy teams of specialized AI agents to complete complex software projects directly from VS Code.

## Quick Start

1. **Install the Extension**
   - Search for "Shadow Clone AI" in VS Code Marketplace
   - Click Install

2. **Automatic Setup**
   - The extension will check for required dependencies on first launch
   - If anything is missing, click "Setup Now" when prompted
   - Follow the interactive setup guide

3. **Get Your License**
   - Obtain a Shadow Clone NFT license (Ignis Elite holders have automatic access)
   - Get your API key from the [Shadow Clone dashboard](https://shadow-clone.ai)
   - Click the Shadow Clone icon in VS Code and authenticate

That's it! The extension handles all dependency installation for you.

## Manual Setup (Advanced Users)

If the automatic setup doesn't work or you prefer manual installation:

1. **Windows Users**: Install WSL from PowerShell (Admin): `wsl --install`
2. **Install Node.js 18+**: Download from [nodejs.org](https://nodejs.org)
3. **Install Claude Code**: Run the setup script from the extension folder:
   ```bash
   # Navigate to where the extension is installed
   cd ~/.vscode/extensions/IgnisAILabsLLC.shadow-clone-*/scripts
   bash setup-wsl.sh
   ```

## Troubleshooting

**Missing Dependencies Warning**
- Click the warning in VS Code status bar
- Follow the interactive setup guide
- Or run: `Cmd/Ctrl + Shift + P` → "Shadow Clone: Check Dependencies"

**Permission Errors (npm install)**
```bash
# Fix npm permissions
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=$PATH:~/.npm-global/bin' >> ~/.bashrc
source ~/.bashrc
```

**Can't Find Claude Command**
```bash
# Check if installed
which claude

# If not found, reinstall
npm install -g @anthropic/claude-code

# Restart VS Code after installation
```

## Features

- **Automatic Dependency Setup**: Built-in setup assistant for all requirements
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