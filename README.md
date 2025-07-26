# Shadow Clone System

> **AI-powered master craftsmen working in synchronized excellence**

⚠️ **PROPRIETARY SOFTWARE** - This repository contains proprietary code owned by Ignis AI Labs LLC. Unauthorized use, distribution, or access is strictly prohibited. See [LICENSE-PROPRIETARY.md](./LICENSE-PROPRIETARY.md) for terms.

Orchestrates teams of specialized AI agents that work in parallel waves to deliver exceptional results. Every agent operates at master level - no weak links allowed.

## 🔐 Intellectual Property Protection

Shadow Clone prompts are served dynamically through our secure API:
- **No Local Files**: Prompts are never stored on user machines
- **API Authentication**: Only licensed users can access prompts
- **Encrypted Delivery**: All prompts transmitted via HTTPS
- **Session-Based**: Prompts are ephemeral and session-specific
- **Copy Protection**: Prompts cannot be exported or saved locally

## 🚀 Quick Start

Shadow Clone offers two powerful integration options:

### Option 1: MCP Server (Recommended)
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

### Option 2: VS Code Extension
```bash
# Install VS Code Extension
code --install-extension shadow-clone-*.vsix

# Launch through VS Code
1. Click "Launch Claude" button in status bar
2. Select mode and parameters
3. Paste command when Claude is ready
```

Both options provide:
- Secure prompt delivery (never stored locally)
- License verification
- Full Shadow Clone capabilities
- IP protection

## 📋 Key Documentation

- **[CLAUDE.md](./CLAUDE.md)** - AI context file for understanding the system
- **[CRITICAL_RULES.md](./CRITICAL_RULES.md)** - Essential system rules (internal reference)
- **[STREAMLINING_SUMMARY.md](./STREAMLINING_SUMMARY.md)** - Documentation improvements (75% reduction)

## 🎯 System Architecture

```
Shadow Clone API Server
├── Prompt Engine               # Dynamic prompt generation
├── License Verification        # Access control
├── Mode Configurations         # Project type templates
└── Security Layer             # IP protection

Integration Options:

1. MCP Server (Recommended)
├── Embedded Prompts          # All prompts compiled in
├── Native Claude Tools       # Direct function calls
├── Modular Tools            # Granular agent deployment
└── Session Persistence      # 24-hour authentication

2. VS Code Extension
├── Authentication           # License key management
├── Prompt Service          # Secure API client
├── Claude Integration      # Command generation
└── Session Management      # Track AI agent deployments
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

| Parameter | Default | Description |
|-----------|---------|-------------|
| `project_type` | `auto` | `audit`, `feature`, `refactor`, `optimize`, `debug`, `research` |
| `waves_directory` | `./.waves/` | Configurable output location |
| `num_teams` | `dynamic` | Team count |
| `wave_strategy` | `auto` | Wave execution strategy |

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

### Using MCP Server (Recommended):
```javascript
// Authenticate once per 24 hours
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
```

### Using VS Code Extension:
1. Click "Launch Claude" button in status bar
2. Select mode:
   - **Audit**: Comprehensive security assessment
   - **Feature**: Build new functionality
   - **Refactor**: Improve existing code
   - **Optimize**: Performance enhancements
   - **Debug**: Fix issues
   - **Research**: Analyze without changes
3. Configure parameters (project plan, waves directory)
4. Extension generates secure command with embedded prompts
5. Paste in Claude when ready

Note: Both methods protect intellectual property - prompts are never exposed as plain text files.

## 📊 Project Modes

- **Audit**: Comprehensive security assessment (OWASP, NIST, CWE)
- **Feature**: Security-first development with TDD
- **Refactor**: Code improvement preserving security
- **Optimize**: Performance enhancement maintaining security
- **Debug**: Issue resolution and root cause analysis
- **Research**: Technical exploration and prototyping

## 🚀 Advanced Features

### MCP Server Features:
- **Modular Tools**: Deploy single agents or teams for focused tasks
  - `deploy_agent_team` - Specialized team deployment
  - `deploy_specialist_agent` - Single expert agents
  - `quick_fix` - Rapid bug fixes
  - `code_review_team` - Targeted code reviews
  - `generate_tests` - Automated test creation
  - `create_documentation` - Documentation generation
  - `execute_single_wave` - Single wave execution
  - `architecture_consultant` - Expert guidance
- **Native Integration**: Direct function calls in Claude
- **Persistent Auth**: 24-hour authentication sessions

### VS Code Extension Features:
- **Resume Previous Session**: Select "Resume Previous" in extension
- **Track Active Sessions**: View real-time progress in Claude Sessions panel
- **Custom Parameters**: Build complex commands with interactive prompts
- **Session Management**: Monitor and control multiple AI agent deployments
- **Secure Prompt Caching**: 30-minute cache for optimal performance

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

**Copyright © 2024 Ignis AI Labs LLC. All Rights Reserved.**

This software is proprietary and contains trade secrets of Ignis AI Labs. Any unauthorized access, use, reproduction, or distribution is strictly prohibited and will be prosecuted to the fullest extent of the law.

- **License Required**: Valid Ignis AI Labs license required for use
- **Not Open Source**: This is proprietary commercial software
- **Legal Action**: Violations subject to $250,000+ in damages per incident
- **Report Violations**: abuse@shadowclone.ai

By accessing this repository, you acknowledge that you have read and agree to be bound by the terms in [LICENSE-PROPRIETARY.md](./LICENSE-PROPRIETARY.md).

For licensing inquiries: legal@shadowclone.ai