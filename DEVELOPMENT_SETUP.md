# Shadow Clone Development Setup

This guide covers setting up the development environment for Shadow Clone.

## Prerequisites

- Node.js 18+ and npm
- VS Code
- Cloudflare account
- Claude Code CLI (`npm install -g @anthropic/claude-code`)

## Cloudflare Worker Setup

### 1. Environment Configuration

```bash
cd cloudflare-worker
cp .env.example .env
```

Edit `.env` and add your Cloudflare API token:
```
CLOUDFLARE_API_TOKEN=your_token_here
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Deploy to Cloudflare

```bash
# Using the deploy script
./deploy.sh

# Or manually
npx wrangler deploy
```

The API will be deployed to: `https://shadow-clone-api.elijah-02b.workers.dev`

### 4. Test the API

```bash
# Test authentication
curl -X POST https://shadow-clone-api.elijah-02b.workers.dev/auth/validate \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "test-key-123"}'

# Test fetching prompts
curl -X GET https://shadow-clone-api.elijah-02b.workers.dev/api/prompts/shadow-clone \
  -H "X-API-Key: test-key-123"
```

## VS Code Extension Setup

### 1. Environment Configuration

```bash
cd vscode-extension
cp .env.example .env
```

The `.env` file is for development only. It contains:
- **API Endpoint**: The Shadow Clone API URL (users don't need to configure this)
- **Test API Key**: For development testing (users will enter their own API keys)

### 2. Install Dependencies

```bash
npm install
```

### 3. Build and Package

```bash
# Compile TypeScript
npm run compile

# Package extension
npm run package
```

### 4. Install Extension

```bash
# Install the VSIX file
code --install-extension shadow-clone-0.1.0.vsix
```

## Testing the Full System

1. **Open VS Code** with the extension installed
2. **Authenticate** with test key: `test-key-123`
3. **Launch Claude** using the status bar button
4. **Select a mode** (e.g., audit, feature, debug)
5. **Paste the command** into Claude when ready

## API Endpoints

### Authentication
- `POST /auth/validate` - Validate API key

### User Management
- `GET /user/profile` - Get user profile
- `GET /user/license-status` - Get license status

### Projects
- `GET /projects` - List projects
- `POST /projects` - Create project

### Deployments
- `GET /projects/:id/deployments` - List deployments
- `POST /projects/:id/deploy` - Create deployment

### Shadow Clone Prompts (Protected)
- `GET /api/prompts/shadow-clone` - Main prompt
- `GET /api/prompts/modes` - List available modes
- `GET /api/prompts/modes/:mode` - Get mode configuration

## Security Notes

1. **API Token**: The Cloudflare API token is stored in `.env` (not committed to git)
2. **Test Mode**: Uses `test-key-123` for development
3. **Prompt Protection**: Prompts are served via API, never stored locally
4. **Authentication**: All prompt endpoints require valid API key

## Troubleshooting

### Cloudflare Worker Issues
- Check logs: `npx wrangler tail`
- Verify API token is correct
- Ensure KV namespaces are created

### VS Code Extension Issues
- Check Developer Tools: `Help > Toggle Developer Tools`
- Verify API endpoint in settings
- Check authentication status

### Claude Integration Issues
- Ensure Claude Code CLI is installed
- Check that prompts are being fetched from API
- Verify command is properly formatted

## Important Files

- `/cloudflare-worker/.env` - Cloudflare API token (not in git)
- `/vscode-extension/.env` - Extension config (not in git)
- `/cloudflare-worker/src/handlers/prompts.ts` - Prompt serving logic
- `/vscode-extension/src/services/promptService.ts` - Prompt fetching logic