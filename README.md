# Shadow Clone System

> **AI-powered master craftsmen working in synchronized excellence**

⚠️ **PROPRIETARY SOFTWARE** - This repository contains proprietary code owned by Ignis AI Labs LLC, a Puerto Rico-based company. Unauthorized use, distribution, or access is strictly prohibited. See [LICENSE](./LICENSE) for terms.

Orchestrates teams of specialized AI agents that work in parallel waves to deliver exceptional results. Every agent operates at master level - no weak links allowed.

## 🔐 Intellectual Property Protection

Shadow Clone prompts are served dynamically through our secure API:
- **No Local Files**: Prompts are never stored on user machines
- **API Authentication**: Only licensed users can access prompts
- **Encrypted Delivery**: All prompts transmitted via HTTPS
- **Session-Based**: Prompts are ephemeral and session-specific
- **Copy Protection**: Prompts cannot be exported or saved locally

## 🔒 Security Features

Shadow Clone implements defense-in-depth security. See [SECURITY_AUDIT.md](./mcp-server/docs/SECURITY_AUDIT.md) for the full audit.

| Feature | Description |
|---------|-------------|
| **Browser-Based Auth** | Local server for secure API key entry (no key in chat) |
| **AES-256-GCM Encryption** | API keys encrypted at rest with machine-specific keys |
| **CSRF Protection** | Random token per auth session prevents cross-site attacks |
| **Localhost-Only Auth** | Auth server binds to 127.0.0.1 only (not network accessible) |
| **Symlink Protection** | Path traversal prevention via symlink resolution |
| **Input Validation** | Zod schema validation on all tool inputs |
| **Secure Process Execution** | Uses `execFile` with array args (no shell injection) |
| **Two-Tier Caching** | 60s normal / 5min fallback for resilient sessions |

## 🚀 Quick Start

### MCP Server Integration
```bash
# Install MCP Server
npm install -g @shadow-clone/mcp-server

# Configure Claude Desktop
# Add to claude_desktop_config.json:
{
  "mcpServers": {
    "shadow-clone": {
      "command": "shadow-clone-mcp"
    }
  }
}

# Use directly in Claude conversations
- Authenticate once with your API key
- Access all Shadow Clone tools immediately
- Deploy agents with simple function calls
```

**Features:**
- Secure prompt delivery (never stored locally)
- NFT-based license verification
- Full Shadow Clone capabilities
- IP protection via compiled prompts

## 📋 Key Documentation

- **[CLAUDE.md](./CLAUDE.md)** - AI context file for understanding the system
- **[mcp-server/USER-GUIDE.md](./mcp-server/USER-GUIDE.md)** - MCP server usage guide
- **[docs/](./docs/)** - Additional documentation

## 🎯 System Architecture

```
Shadow Clone MCP Server
├── Embedded Prompts          # All prompts compiled in TypeScript
├── Native Claude Tools       # Direct function calls via MCP
├── Modular Tools            # Granular agent deployment
├── NFT License Verification  # Blockchain-based access control
└── Session Persistence      # Cached authentication
```

## 💎 Exclusive Access

Shadow Clone is a premium SaaS platform with strictly limited NFT-based licenses:

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
- Free NFT mint for verified partners
- Agency/team features

### 💎 Reserve Access (223 NFTs)
- $149/month subscription
- Free NFT mint (limited availability)
- Premium support tier

**Total Platform Capacity**: 2,000 NFT licenses only
**Security Note**: Partner verification required for Builder tier to ensure responsible use

## 🔧 Configuration

### Tool Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `project_type` | `auto` | `audit`, `feature`, `refactor`, `optimize`, `debug`, `research` |
| `waves_directory` | `./.waves/` | Configurable output location |
| `num_teams` | `dynamic` | Team count |
| `wave_strategy` | `auto` | Wave execution strategy |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `SHADOW_CLONE_API_KEY` | API key for authentication (alternative to browser auth) |
| `SHADOW_CLONE_CREATOR_MODE` | Enable creator mode for local development |
| `SHADOW_CLONE_API_ENDPOINT` | Override API endpoint (default: api.ignislabs.ai) |

### Secure Storage Locations

API keys and session data are encrypted and stored in:
- **Linux/macOS**: `~/.shadow-clone/`
- **Windows**: `%USERPROFILE%\.shadow-clone\`

These files use AES-256-GCM encryption with machine-specific keys. Do not copy these files between machines.

## 🌊 Execution Flow

1. **Analysis** - Project understanding
2. **Team Configuration** - Master assignments
3. **Wave Planning** - Work organization
4. **Parallel Deployment** - Simultaneous execution (max 10/batch)
5. **Mode Execution** - Specialized workflows
6. **Integration** - Quality validation

## 📁 Wave Organization

All deliverables organized by waves:
```
$waves_directory/
├── wave-1/
├── wave-2/
└── FINAL_DELIVERABLES
```

## 🛡️ Quality Standards

- **No Weak Links**: Every agent at master level
- **False Positive Rate**: <10% for findings
- **Expert Consensus**: >95% agreement
- **Multi-Tool Validation**: Cross-referenced results

## 🎮 Usage Examples

```javascript
// Authenticate once per session
authenticate(apiKey: "your-shadow-clone-api-key")

// Deploy full orchestration
shadow_clone_orchestrate(
  mode: "feature",
  projectDescription: "Build a real-time chat system with React and Node.js"
)

// Or use modular tools for focused tasks
quick_fix(
  issueType: "bug",
  description: "Fix login form validation error"
)

// Deploy specialized teams
deploy_agent_team(
  teamType: "frontend",
  task: "Implement responsive dashboard"
)
```

**Note:** All prompts are compiled into the MCP server - never exposed as plain text files.

## 📊 Project Modes

- **Audit**: Comprehensive security assessment (OWASP, NIST, CWE)
- **Feature**: Security-first development with TDD
- **Refactor**: Code improvement preserving security
- **Optimize**: Performance enhancement maintaining security
- **Debug**: Issue resolution and root cause analysis
- **Research**: Technical exploration and prototyping

## 🚀 Advanced Features

### Modular Tools
Deploy single agents or teams for focused tasks:
- `deploy_agent_team` - Specialized team deployment (frontend, backend, database, etc.)
- `deploy_specialist_agent` - Single expert agents (react_expert, api_designer, etc.)
- `quick_fix` - Rapid bug fixes
- `code_review_team` - Targeted code reviews
- `generate_tests` - Automated test creation
- `create_documentation` - Documentation generation
- `execute_single_wave` - Single wave execution
- `architecture_consultant` - Expert guidance

### Core Features
- **Native Integration**: Direct function calls via MCP protocol
- **NFT Authentication**: Blockchain-based license verification
- **Embedded Prompts**: All prompts compiled into server (IP protected)
- **Parallel Deployment**: Up to 10 agents per batch

---

**Remember**: Every agent is a master. No weak links allowed.

## 🧪 Internal Testing (Authorized Personnel Only)

For internal development and testing, authorized personnel can validate the Shadow Clone system:

### Local Testing (Development)
```bash
# Single command that loads the test file AND executes the test
Load {current_dir}/.shadow-local/testing/test_mode.md and execute with mode=plan
```

### API Testing (Production Verification)
```bash
# Single command that loads the test file AND executes the test
Load {current_dir}/.shadow/testing/test_mode.md and execute with mode=feature
```

**Available test modes**: audit, debug, feature, optimize, refactor, research, plan

**Testing workflow**:
1. Make changes locally
2. Test with `--source=local`
3. Deploy to production
4. Test with `--source=api`

This ensures both local development and production API work correctly.

## ⚖️ Legal Notice

**Copyright © 2025 Ignis AI Labs LLC. All Rights Reserved.**

This software is proprietary and contains trade secrets of Ignis AI Labs. Any unauthorized access, use, reproduction, or distribution is strictly prohibited and will be prosecuted to the fullest extent of the law.

- **License Required**: Valid Ignis AI Labs license required for use
- **Not Open Source**: This is proprietary commercial software
- **Legal Action**: Violations subject to $250,000+ in damages per incident
- **Report Violations**: abuse@shadowclone.ai

By accessing this repository, you acknowledge that you have read and agree to be bound by the terms in [LICENSE](./LICENSE).

For licensing inquiries: legal@shadowclone.ai