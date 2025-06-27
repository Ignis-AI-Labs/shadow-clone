# Shadow Clone VS Code Extension

Deploy teams of specialized AI agents to complete complex software projects directly from VS Code.

## Features

- **AI Agent Orchestration**: Deploy up to 10 specialized AI agents per wave
- **Real-time Progress Tracking**: Monitor agent activity and project status
- **Integrated Project Management**: Create and manage projects from the sidebar
- **Secure Authentication**: API key-based access with license verification
- **Wave-based Deployment**: Organize large projects into manageable waves

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

## License Tiers

### 🔥 Ignis Elite (NFT Holders)
- Free monthly access
- Lowest compute markup (25%)
- Priority support

### 🚀 Pioneer License ($79/month)
- Early adopter pricing
- 50% compute markup
- 500 licenses available

### 🏗️ Builder License ($99/month)
- For agencies and teams
- 75% compute markup
- 500 licenses available

### 💎 Reserve License ($149/month)
- Premium tier
- 100% compute markup
- 223 licenses available

## Requirements

- VS Code 1.74.0 or higher
- Active Shadow Clone license
- Internet connection for API access

## Configuration

Access settings through VS Code preferences:

- `shadowClone.apiEndpoint`: API endpoint (default: https://api.shadowclone.ai)
- `shadowClone.wavesDirectory`: Directory for agent outputs (default: .waves)
- `shadowClone.maxAgentsPerWave`: Maximum agents per deployment (default: 10)

## Security

- API keys are stored securely using VS Code's secret storage
- All communication is encrypted via HTTPS
- Source code is obfuscated to protect proprietary algorithms
- Server-side validation for all operations

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