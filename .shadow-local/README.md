# Shadow Clone LOCAL Mode - Creator Privileges

## 🚀 Overview

This is the **privileged local version** of Shadow Clone for the creator. It bypasses all authentication and provides instant access to all Shadow Clone functions directly on your machine.

**Features:**
- ✅ No authentication required
- ✅ All micro functions available
- ✅ Works offline
- ✅ Instant methodology delivery
- ✅ Perfect for company projects

## 🛠️ Quick Start

### Windows Command Prompt
```batch
# Check status
shadow-local status

# Quick fix
shadow-local fix bug "Null pointer in user service"

# Deploy specialist
shadow-local specialist react "Optimize component rendering"

# Code review
shadow-local review security src\auth.js

# Generate tests
shadow-local test unit utils.js
```

### PowerShell
```powershell
# Run script
.\shadow-local.ps1 status

# Interactive mode
.\shadow-local.ps1 interactive

# Quick commands
.\shadow-local.ps1 fix bug "Memory leak"
.\shadow-local.ps1 specialist api "Design GraphQL schema"
```

### Node.js Direct
```bash
# With full options
node use-local.js quick_fix bug "Description" file.js high

# Show all commands
node use-local.js --help
```

## 📋 Available Micro Functions

### Quick Problem Solving
- **quick_fix** - Instant bug fixes without orchestration
  - Types: `bug`, `style`, `logic`, `performance`, `security`
  - Example: `shadow-local fix bug "Null check missing"`

### Single Expert Deployment
- **deploy_specialist** - One expert, one task
  - Specialists: `react`, `api`, `database`, `test`, `perf`, `security`, `review`, `docs`
  - Example: `shadow-local specialist react "Fix render loop"`

### Targeted Reviews
- **code_review** - Quick code review
  - Types: `security`, `performance`, `quality`, `architecture`
  - Example: `shadow-local review security *.js`

### Test Generation
- **generate_tests** - Create tests instantly
  - Types: `unit`, `integration`, `e2e`, `performance`
  - Example: `shadow-local test unit src/utils.js`

### Single Wave Execution
- **execute_single_wave** - One phase only
  - Waves: `research`, `planning`, `implementation`, `testing`, `documentation`
  - Example: `shadow-local wave research "OAuth best practices"`

### Documentation
- **create_documentation** - Generate docs
  - Types: `api`, `user_guide`, `developer`, `architecture`
  - Example: `shadow-local doc api "REST endpoints"`

### Architecture Consultation
- **architecture_consultant** - Design advice
  - Types: `design_review`, `pattern_recommendation`, `scalability_analysis`, `migration_planning`
  - Example: `shadow-local arch design_review "Current monolith"`

## 🔧 Setup

1. **Verify Creator Config**
   ```
   shadow-local status
   ```
   Should show: `Creator Mode: ACTIVE`

2. **Environment Variable** (Optional)
   Set `SHADOW_CLONE_CREATOR_MODE=true` to enable globally

3. **Use in Any Project**
   Copy `.shadow-local` folder to any project for local access

## 🎯 Use Cases

### Company Projects
Perfect for internal projects where you need Shadow Clone methodologies without API overhead:
```batch
# Quick bug fix
shadow-local fix bug "Production issue"

# Architecture review
shadow-local arch design_review "Microservices migration"

# Security audit
shadow-local review security src/**/*.js
```

### Personal Development
Use for your own projects with full privileges:
```batch
# Generate tests for new feature
shadow-local test unit new-feature.js

# Get expert advice
shadow-local specialist react "State management strategy"
```

### Rapid Prototyping
Quickly get methodologies without setup:
```batch
# Research phase
shadow-local wave research "WebRTC implementation"

# Documentation
shadow-local doc developer "Component library"
```

## 🔐 Security Note

This local mode is **only for the creator**. It includes:
- `creator-config.json` - Identifies creator privileges
- Bypassed authentication
- Full access to all features
- Local-only execution

**Never distribute this version publicly.**

## 📝 Integration with MCP Server

The MCP server automatically detects creator mode when:
1. `.shadow-local/creator-config.json` exists with `mode: "CREATOR_PRIVILEGED"`
2. Environment variable `SHADOW_CLONE_CREATOR_MODE=true`

When detected, the MCP server:
- Bypasses all authentication
- Returns "UNLIMITED" license
- Enables all features
- Shows creator status in logs

## 🆘 Troubleshooting

### "Creator config not found"
- Ensure you're in the `.shadow-local` directory
- Check `creator-config.json` exists

### "Node.js not found"
- Install Node.js from https://nodejs.org
- Ensure it's in your PATH

### Commands not working
- Run `shadow-local status` to verify setup
- Check you have creator privileges
- Try the PowerShell interactive mode

## 🚀 Pro Tips

1. **Add to PATH** - Add `.shadow-local` to your system PATH for global access
2. **Alias Setup** - Create aliases in your shell profile:
   ```bash
   alias scfix="shadow-local fix"
   alias sctest="shadow-local test"
   ```
3. **Interactive Mode** - Use PowerShell interactive mode for guided usage
4. **Combine with MCP** - Use alongside MCP server for full integration

---

**Remember:** This is your privileged creator access. Use it freely for all your projects!