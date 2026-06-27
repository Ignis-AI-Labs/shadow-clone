# Shadow Clone

> **Free, open-source AI orchestration through prompt engineering macros**

Shadow Clone is an MCP server that delivers professional prompt engineering macros to AI assistants. It teaches AI how to simulate specialized expert teams, coordinate multi-agent workflows, and follow battle-tested development methodologies.

**No API keys. No authentication. Just install and go.**

## Four ways to use it

The same prompt macros, four delivery channels — pick what fits your setup.

### A — Run it locally with one command (recommended)

```bash
npx @shadow-clone/web
```

Spins up a local server, opens your browser to the Shadow Clone UI. No account, no API key, no cloud round-trip. Works offline once installed. **Ideal for normal people who want to use it on their own machine without thinking about servers.**

### B — Download a zip, double-click

Grab `shadow-clone-web.zip` from a GitHub release, unzip, open `index.html` in any browser. Truly zero-install — the entire UI is static HTML/JS/CSS bundled with the prompts. Works on a USB stick.

### C — Visit the hosted URL

_(coming soon — `shadow-clone.ignislabs.ai`)_

Same UI, one click away, no install. Best when you just want to try it.

### D — MCP server (Claude Desktop / VS Code)

For power users with an MCP-compatible client. The tools become native commands inside your AI assistant.

```bash
npm install -g @shadow-clone/mcp-server
```

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "shadow-clone": {
      "command": "shadow-clone-mcp"
    }
  }
}
```

All 13 tools become available in your Claude conversations.

```
"Use shadow_clone_orchestrate in feature mode to build a real-time chat system"

"Use quick_fix to debug the null pointer in my login function"

"Deploy a frontend team to redesign the dashboard"
```

## What is Shadow Clone?

Shadow Clone is a **prompt delivery system**, not a code execution engine. When you call a tool, it returns structured instructions (prompt macros) that teach the AI how to approach your task like an expert team.

Think of it as unlocking new capabilities for your AI assistant:
- Expert debugging methodology
- Professional code review patterns
- Coordinated multi-agent workflows
- Architecture consultation frameworks

## Available Tools (13)

### Orchestration
| Tool | Description |
|------|-------------|
| `shadow_clone_orchestrate` | Full multi-wave project execution with virtual agent teams |
| `shadow_clone_plan` | Comprehensive project planning methodology |

### Teams
| Tool | Description |
|------|-------------|
| `deploy_agent_team` | Deploy specialized teams (frontend, backend, database, testing, devops, mobile, security, documentation) |
| `deploy_specialist_agent` | Deploy individual experts (react, API design, database, testing, performance, security, code review, docs) |

### Rapid Operations
| Tool | Description |
|------|-------------|
| `quick_fix` | Targeted problem-solving for bugs, performance, security, logic, style |
| `code_review_team` | Professional code reviews (security, performance, quality, architecture) |
| `generate_tests` | Test generation (unit, integration, e2e, performance, security) |
| `execute_single_wave` | Focused single-phase execution (research, planning, implementation, testing, docs, review) |

### Documentation & Architecture
| Tool | Description |
|------|-------------|
| `create_documentation` | Professional docs (API, user guide, developer, architecture, inline) |
| `architecture_consultant` | Expert design analysis (design review, patterns, scalability, migration) |

### Utility
| Tool | Description |
|------|-------------|
| `initialize_workspace` | Set up AI instruction files in your project |
| `check_for_updates` | Check for MCP server updates |
| `show_commands` | Quick reference of all commands |

## Usage Examples

```javascript
// Full project orchestration
shadow_clone_orchestrate({
  mode: "feature",
  projectDescription: "Build a real-time chat system with React and Node.js"
})

// Quick bug fix
quick_fix({
  issueType: "bug",
  description: "Fix login form validation error"
})

// Deploy a specialized team
deploy_agent_team({
  teamType: "frontend",
  task: "Implement responsive dashboard"
})

// Code review
code_review_team({
  reviewType: "security",
  files: ["src/auth.js", "src/api.js"]
})

// Generate tests
generate_tests({
  testType: "unit",
  targetFiles: ["src/utils.js"]
})
```

## Project Modes

Shadow Clone supports 7 orchestration modes:

| Mode | Purpose |
|------|---------|
| **plan** | Create comprehensive project plans (no code) |
| **feature** | Build new features with agent teams |
| **debug** | Systematic debugging and root cause analysis |
| **optimize** | Performance enhancement |
| **refactor** | Code improvement preserving behavior |
| **audit** | Security and quality assessment |
| **research** | Technical exploration and prototyping |

## How It Works

```
You ──> Claude ──MCP──> Shadow Clone Server
                              │
                              └── Returns: Prompt Macro (instructions)
                                           ↓
                                    Claude follows the methodology
                                    to complete your task professionally
```

1. You ask Claude to use a Shadow Clone tool
2. The MCP server returns structured prompt engineering macros
3. Claude reads and follows the methodology
4. You get expert-level results

All deliverables are organized in the `.waves/` directory for orchestration tasks.

## Development

```bash
git clone https://github.com/ElijahMoses/shadow-clone.git
cd shadow-clone

# MCP server
cd mcp-server
npm install
npm run build        # TypeScript compilation
npm run dev          # Development mode with watch
npm run lint         # Type checking
npm test             # Run tests

# Web UI (separate workspace)
cd ../web
npm install
npm run dev          # http://localhost:3000
npm run build        # Production build
npm run type-check   # tsc --noEmit
```

The web UI imports prompt content directly from `mcp-server/src/prompts/content/` via a TypeScript path alias — both apps share one source of truth, so edits to a prompt show up in both places.

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch conventions and PR workflow.

## Contributing

We welcome contributions! Whether it's improving existing prompts, adding new specialist agents, fixing bugs, or improving documentation.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on:
- Branch model and commit conventions
- How to contribute new prompts
- PR workflow and code review

## License

MIT License - see [LICENSE](LICENSE) for details.

## Links

- [CLAUDE.md](CLAUDE.md) - AI context file
- [DEVELOPER-HANDOFF.md](DEVELOPER-HANDOFF.md) - Full developer onboarding
- [TASKS.md](TASKS.md) - Task tracker
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guide

---

Built by [Ignis AI Labs](https://ignislabs.ai). Made with care for the AI developer community.
