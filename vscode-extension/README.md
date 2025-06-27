# Shadow Clone VS Code Extension

Deploy teams of specialized AI agents to complete complex software projects directly from VS Code.

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

### 🔥 Ignis Elite (777 NFTs)
- Premium tier NFT holders
- Complimentary lifetime access
- Original collection

### 🚀 Pioneer Access (500 NFTs)
- $79/month subscription
- Free NFT mint (first come, first serve)
- Early adopter benefits

### 🏗️ Builder Access (500 NFTs)
- $99/month subscription
- Free NFT mint for verified partners only
- Agency/team features
- **Partner verification required** - Ensuring responsible use

### 💎 Reserve Access (223 NFTs)
- $149/month subscription
- Free NFT mint (limited availability)
- Premium support tier

**Total Platform Capacity**: 2,000 NFT licenses
**Security Model**: All access controlled via NFT ownership to ensure platform integrity

## Claude Code Integration

Shadow Clone works seamlessly with Claude Code:

1. **Install Claude Code**: `npm install -g @anthropic/claude-code`
2. **Launch from VS Code**: Click "Launch Claude" button in status bar
3. **Select Mode**: Choose from audit, feature, debug, etc.
4. **Secure Prompts**: Prompts are fetched from API and embedded in commands
5. **Paste & Execute**: Copy command and paste in Claude terminal

### Intellectual Property Protection

- **No Local Prompt Files**: All prompts served dynamically via API
- **Session-Based Access**: Prompts are ephemeral and tied to sessions
- **Authentication Required**: Valid license required to access prompts
- **Copy Protection**: Prompts cannot be saved or exported
- **Encrypted Transmission**: All API communication via HTTPS

## Requirements

- VS Code 1.74.0 or higher
- Active Shadow Clone license
- Internet connection for API access
- Claude Code CLI (for AI agent execution)

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