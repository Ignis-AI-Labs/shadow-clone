# Shadow Clone Documentation

Welcome to Shadow Clone - a prompt engineering system that transforms AI assistants into teams of specialized virtual agents.

## What is Shadow Clone?

Shadow Clone is an MCP (Model Context Protocol) server that delivers advanced prompt engineering macros to AI assistants like Claude. It doesn't execute code itself - instead, it provides sophisticated instructions that guide AI assistants through complex software development workflows.

**Think of it as:** Programming your AI with expert-level capabilities through structured prompts.

## Quick Links

- [What is Shadow Clone?](getting-started/what-is-shadow-clone.md) - Understand the concept
- [Installation](getting-started/installation.md) - Get set up in 5 minutes
- [Your First Project](getting-started/first-project.md) - Complete walkthrough
- [Tool Reference](reference/all-tools.md) - All tools documented

## How It Works

```
You → Request a task → Shadow Clone MCP Server → Returns expert instructions → AI executes the work
```

1. You ask Claude to use a Shadow Clone tool
2. The MCP server delivers prompt engineering macros
3. Claude adopts specialized behaviors and methodologies
4. Claude executes your task with enhanced capabilities
5. Deliverables appear in your `.waves/` directory

## Available Tools

| Category | Tools | Purpose |
|----------|-------|---------|
| **Orchestration** | `shadow_clone_orchestrate`, `shadow_clone_plan` | Full project execution |
| **Teams** | `deploy_agent_team`, `deploy_specialist_agent` | Deploy focused expert teams |
| **Rapid** | `quick_fix`, `code_review_team`, `generate_tests` | Quick targeted operations |
| **Utility** | `authenticate`, `check_for_updates` | System management |

## Getting Started

1. **Install**: `npm install -g @shadow-clone/mcp-server`
2. **Configure**: Add to Claude Code or Claude Desktop
3. **Authenticate**: Use your API key from [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
4. **Use**: Ask Claude to use any Shadow Clone tool

See the [Installation Guide](getting-started/installation.md) for detailed instructions.

## Requirements

- Node.js 18+
- Claude Code or Claude Desktop
- Shadow Clone license (NFT) from [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)

## Support

- **Dashboard**: [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
- **Troubleshooting**: [Common Issues](troubleshooting/common-issues.md)
