# Shadow Clone VS Code Extension

Deploy teams of specialized AI agents to complete complex software projects directly from VS Code.

## System Requirements

### Required Dependencies
- **VS Code**: Latest version ([Download](https://code.visualstudio.com))
- **Node.js**: Latest LTS version ([Download](https://nodejs.org))
- **Claude Code CLI**: Latest version (`npm install -g @anthropic/claude-code`)
- **Operating System Requirements**:
  - **Windows**: Windows 10/11 with WSL2 installed
  - **macOS**: macOS 10.15 or higher
  - **Linux**: Ubuntu 20.04+ or equivalent
- **Internet**: Stable connection for API access
- **License**: Active Shadow Clone NFT license

### Hardware Requirements
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: 2GB free space for agent outputs
- **CPU**: 4+ cores recommended for optimal performance

## Installation & Setup

### Quick Install (Recommended)
1. **Install Extension**: Search "Shadow Clone AI" in VS Code Marketplace → Install
2. **Automatic Setup**: Extension checks dependencies on first launch
3. **Get License**: Obtain from [Ignis Labs Dashboard](https://dashboard.ignislabs.ai)
4. **Authenticate**: Click Shadow Clone icon → Enter API key

### Platform-Specific Setup Guides

#### Windows Setup
```bash
# 1. Install WSL2 (PowerShell as Admin)
wsl --install

# 2. Restart computer, then open WSL terminal
# 3. Install Node.js (Latest LTS)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Install Claude Code
npm install -g @anthropic/claude-code

# 5. Verify installation
node --version
claude --version
```

#### macOS Setup
```bash
# 1. Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Install Node.js (Latest)
brew install node

# 3. Install Claude Code
npm install -g @anthropic/claude-code

# 4. Verify installation
node --version
claude --version
```

#### Linux Setup
```bash
# Ubuntu/Debian - Install Latest LTS
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Claude Code
npm install -g @anthropic/claude-code

# Verify installation
node --version
claude --version
```

### Manual Installation
```bash
# Download .vsix file from releases
code --install-extension shadow-clone-*.vsix
```

## Getting Started

1. **Authenticate**: 
   - Open Command Palette (`Cmd/Ctrl + Shift + P`)
   - Run "Shadow Clone: Authenticate"
   - Enter your API key from dashboard

2. **Create Your First Project**:
   - Click Shadow Clone icon in sidebar
   - Click "+" to create new project
   - Select project type and parameters

3. **Deploy Agents**:
   - Open project → Click "Deploy Agents"
   - Choose execution mode (Plan, Deploy, Debug, etc.)
   - Monitor progress in output panel

## Execution Modes (Prompts)

Access via Shadow Clone sidebar → Prompts panel:

1. **Plan Mode** - Analyzes requirements and creates detailed project architecture
2. **Deploy Project** - Complete implementation with tests and documentation
3. **Build Feature** - Add specific functionality to existing codebase
4. **Debug Issues** - Investigate and fix bugs systematically
5. **Refactor Code** - Improve code quality and structure
6. **Optimize Performance** - Speed up queries, caching, and algorithms
7. **Security Audit** - OWASP checks and vulnerability scanning
8. **Research Mode** - Analyze codebase without making changes
9. **Resume Session** - Continue from previous wave execution

## Common Issues & Solutions

### Dependency Issues

**"Claude command not found"**
```bash
# Reinstall globally
npm install -g @anthropic/claude-code

# Add to PATH if needed
export PATH=$PATH:$(npm prefix -g)/bin
```

**NPM Permission Errors**
```bash
# Fix npm permissions
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=$PATH:~/.npm-global/bin' >> ~/.bashrc
source ~/.bashrc
```

**WSL Issues (Windows)**
```bash
# Enable WSL features
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Update WSL
wsl --update
```

### Extension Issues

- **Missing Dependencies Warning**: Click warning → Follow setup wizard
- **Authentication Failed**: Check API key in dashboard
- **No Projects Visible**: Refresh with `Cmd/Ctrl + R` in sidebar

## Configuration

Settings available in VS Code preferences (`Cmd/Ctrl + ,`):

| Setting | Description | Default |
|---------|-------------|---------|
| `shadowClone.apiEndpoint` | API server URL | `https://api.ignislabs.ai` |
| `shadowClone.wavesDirectory` | Output directory | `.waves` |
| `shadowClone.maxAgentsPerWave` | Agent limit | `10` |

## License & Access

### Current Access (777 Total)
- **Ignis Elite NFT Holders**: Complimentary lifetime access
- **License Management**: Via [Ignis Labs Dashboard](https://dashboard.ignislabs.ai)

### Future Releases
- Pioneer Access (500 NFTs)
- Builder Access (500 NFTs)  
- Reserve Access (223 NFTs)

**Total Platform Capacity**: 2,000 NFT licenses

## Security & Privacy

- **Prompt Protection**: All prompts served via encrypted API
- **No Local Storage**: Prompts never saved to disk
- **Session Isolation**: Each execution has unique tokens
- **Minimal Telemetry**: Only authentication and errors logged

## Support

- **Documentation**: [docs.shadowclone.ai](https://docs.shadowclone.ai)
- **Issues**: [GitHub Issues](https://github.com/shadow-clone/support/issues)
- **Dashboard**: [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)

---

© 2024 Ignis AI Labs LLC. All rights reserved.