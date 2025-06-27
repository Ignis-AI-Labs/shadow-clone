# Shadow Clone System

> **AI-powered master craftsmen working in synchronized excellence**

⚠️ **PROPRIETARY SOFTWARE** - This repository contains proprietary code owned by Ignis AI Labs LLC. Unauthorized use, distribution, or access is strictly prohibited. See [LICENSE-PROPRIETARY.md](./LICENSE-PROPRIETARY.md) for terms.

Orchestrates teams of specialized AI agents that work in parallel waves to deliver exceptional results. Every agent operates at master level - no weak links allowed.

## 🚀 Quick Start

```bash
# Execute with Claude
claude "Load shadow-clone-prompt.md and execute"

# With specific mode
claude "Load shadow-clone-prompt.md and execute with project_type=audit"
```

## 📋 Key Documentation

- **[CLAUDE.md](./CLAUDE.md)** - AI context file for understanding the system
- **[CRITICAL_RULES.md](./CRITICAL_RULES.md)** - Essential system rules (single source of truth)
- **[shadow-clone-prompt.md](./shadow-clone-prompt.md)** - Main orchestrator (streamlined to ~120 lines)
- **[STREAMLINING_SUMMARY.md](./STREAMLINING_SUMMARY.md)** - Documentation improvements (75% reduction)

## 🎯 System Architecture

```
your-project/
├── shadow-clone-prompt.md        # Main orchestrator
├── CRITICAL_RULES.md            # System rules reference
└── .shadow/                     # Modular components
    ├── agent_rules/            # Behavioral DNA
    ├── coordination_rules/     # Wave coordination
    ├── mode_configs/          # Project types
    ├── templates/             # Standards
    └── execution_phases/      # Implementation
```

## 🔧 Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| `project_type` | `auto` | `audit`, `feature`, `refactor`, `optimize`, `debug`, `research` |
| `waves_directory` | `/root/repos/shadow-clone/.waves/` | Configurable output location |
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

```bash
# Security audit
claude "Load shadow-clone-prompt.md and execute with project_type=audit"

# Feature development  
claude "Load shadow-clone-prompt.md and execute with project_type=feature"

# Custom waves directory
claude "Load shadow-clone-prompt.md and execute with waves_directory=/custom/path/"

# Natural language
claude "Build a secure REST API with authentication and real-time updates"
```

## 📊 Project Modes

- **Audit**: Comprehensive security assessment (OWASP, NIST, CWE)
- **Feature**: Security-first development with TDD
- **Refactor**: Code improvement preserving security
- **Optimize**: Performance enhancement maintaining security
- **Debug**: Issue resolution and root cause analysis
- **Research**: Technical exploration and prototyping

## 🚀 Advanced Features

- **Resume**: `claude "Load shadow-clone-prompt.md and resume"`
- **Status**: `claude "Load shadow-clone-prompt.md and status"`
- **Planning**: `claude "Load shadow-clone-prompt.md and plan"`

---

**Remember**: Every agent is a master. No weak links allowed.

## ⚖️ Legal Notice

**Copyright © 2024 Ignis AI Labs LLC. All Rights Reserved.**

This software is proprietary and contains trade secrets of Ignis AI Labs. Any unauthorized access, use, reproduction, or distribution is strictly prohibited and will be prosecuted to the fullest extent of the law.

- **License Required**: Valid Ignis AI Labs license required for use
- **Not Open Source**: This is proprietary commercial software
- **Legal Action**: Violations subject to $250,000+ in damages per incident
- **Report Violations**: abuse@shadowclone.ai

By accessing this repository, you acknowledge that you have read and agree to be bound by the terms in [LICENSE-PROPRIETARY.md](./LICENSE-PROPRIETARY.md).

For licensing inquiries: legal@shadowclone.ai