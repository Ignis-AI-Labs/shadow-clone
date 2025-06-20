# Shadow Clone System

> **Transform complex projects into coordinated excellence through AI-powered master craftsmen**

The Shadow Clone System orchestrates teams of specialized AI agents that work in synchronized waves to deliver exceptional results. Built on the Japanese sword-making philosophy - each agent is a master craftsman capable of independent excellence, but when masters collaborate, they create something far superior.

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/shadow-clone.git
cd shadow-clone

# 2. Copy to your project
cp -r shadow-clone-prompt.md .shadow/ /path/to/your/project/

# 3. Navigate to your project
cd /path/to/your/project

# 4. Execute with Claude
claude "Load shadow-clone-prompt.md and execute"
```

## 🎯 Key Features

### Master Craftsman Architecture
- **No Weak Links**: Every agent operates at 90%+ quality standards
- **Modular Excellence**: Clean separation between orchestration and implementation
- **Universal Standards**: Core behavioral rules injected into every agent
- **Dynamic Loading**: Load only what you need, when you need it

### Intelligent Execution
- **Auto Mode Detection**: Automatically detects project type and requirements
- **Wave-Based Coordination**: Structured sprints with clear objectives
- **Parallel Processing**: Multiple masters work simultaneously
- **Quality Gates**: Built-in validation at every stage

### Project Flexibility
- **No Project Plan Required**: Describe your project in natural language
- **Multiple Project Types**: New, audit, feature, refactor, debug, optimize, research
- **Git Safety**: Automatic branching and backup for existing codebases
- **Resume Capability**: Pick up where you left off after interruptions

## 📁 System Architecture

```
your-project/
├── shadow-clone-prompt.md        # Main orchestrator (400 lines)
└── .shadow/                      # Modular components
    ├── agent_rules/             # Behavioral DNA for agents
    │   ├── core_agent_rules.md  # Universal standards (No Weak Links)
    │   ├── qa_agent_rules.md    # QA excellence
    │   ├── security_agent_rules.md # Security protocols
    │   └── [other roles]...
    ├── coordination_rules/      # Wave coordination
    │   ├── wave_coordination.md
    │   ├── integration_rules.md
    │   └── quality_gates.md
    ├── mode_configs/           # Project type configurations
    │   ├── shadow-clone-audit.md
    │   ├── shadow-clone-feature.md
    │   └── [other modes]...
    ├── templates/              # Reusable components
    │   ├── team_templates.md
    │   └── agent_templates.md
    └── execution_phases/       # Phase implementations
        ├── phase1_analysis.md
        └── [phases 2-7]...
```

## 🎮 Usage Examples

### Basic Execution
```bash
# Let Shadow Clone analyze and execute your project
claude "Load shadow-clone-prompt.md and execute"
```

### With Specific Project Type
```bash
# Security audit
claude "Load shadow-clone-prompt.md and execute with project_type=audit"

# New feature development
claude "Load shadow-clone-prompt.md and execute with project_type=feature"

# Performance optimization
claude "Load shadow-clone-prompt.md and execute with project_type=optimize"
```

### Custom Configuration
```bash
# Custom team composition
claude "Load shadow-clone-prompt.md and execute with team_composition='security:4,performance:2,quality:3'"

# Specific wave strategy
claude "Load shadow-clone-prompt.md and execute with wave_strategy=dependency"
```

### Natural Language Requests
```bash
# Describe what you want
claude "Build me a REST API for task management with authentication, real-time updates, and Stripe integration"

# The system will create the project plan automatically
```

## 🔧 Configuration Options

| Parameter | Default | Options | Description |
|-----------|---------|---------|-------------|
| `project_type` | `auto` | `new`, `audit`, `feature`, `refactor`, `debug`, `optimize`, `research` | Type of project to execute |
| `git_strategy` | `auto` | `safe_branch`, `branch`, `main`, `none` | Git branch management |
| `num_teams` | `dynamic` | Number or `dynamic` | Team count |
| `team_composition` | `auto` | `auto`, `balanced`, or custom spec | Agent distribution |
| `wave_strategy` | `auto` | `auto`, `manual`, `dependency`, `balanced` | Wave execution strategy |
| `wave_count` | `dynamic` | Number or `dynamic` | Number of execution waves |

## 🏗️ Execution Phases

1. **Project Analysis** - Understand requirements and create safety measures
2. **Team Configuration** - Assign master craftsmen to specialized teams
3. **Wave Planning** - Organize work into coordinated sprints
4. **Agent Deployment** - Deploy agents with proper rule injection
5. **Mode Execution** - Execute waves according to project type
6. **Integration** - Combine deliverables with quality validation
7. **Quality Assurance** - Final validation and deployment readiness

## 🛡️ Quality Assurance

### No Weak Links Protocol
- **Minimum 90% Quality**: Every deliverable must meet master standards
- **Peer Review**: All work reviewed by fellow masters
- **Automated Validation**: Continuous quality monitoring
- **Immediate Intervention**: System halts if quality drops

### Quality Gates
- Code coverage ≥80% (≥90% for critical paths)
- All tests passing
- Security vulnerabilities: 0 critical
- Documentation: 100% complete
- Performance: No regressions

## 🚀 Advanced Features

### Multi-Instance Support
Run multiple instances on different branches:
```bash
# Terminal 1
claude "Load shadow-clone-prompt.md and execute on feature/payment"

# Terminal 2  
claude "Load shadow-clone-prompt.md and execute on feature/auth"
```

### Resume Interrupted Work
```bash
claude "Load shadow-clone-prompt.md and resume"
```

### Check System Status
```bash
claude "Load shadow-clone-prompt.md and status"
```

### Planning Mode
```bash
claude "Load shadow-clone-prompt.md and plan"
```

## 📊 Example Projects

Find complete project examples in the `examples/` directory:
- `project-plan-web.md` - E-commerce web application
- `project-plan-cli.md` - DevOps CLI tool
- `project-plan-api.md` - RESTful API service

## 🔍 Mode-Specific Features

### Audit Mode
- Comprehensive security assessment
- OWASP Top 10 coverage
- Automated vulnerability scanning
- Compliance checking (GDPR, HIPAA, PCI DSS)
- Detailed remediation roadmaps

### Feature Mode
- Security-first development
- Test-driven implementation
- Comprehensive documentation
- Integration testing

### Optimize Mode
- Performance profiling
- Security hardening
- Code quality improvements
- Architecture enhancements

## 🤝 Contributing

Contributions are welcome! The modular architecture makes it easy to:
- Add new agent roles
- Create project type configurations
- Enhance quality gates
- Improve coordination rules

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by Japanese craftsmanship philosophy
- Built for the Claude Code community
- Special thanks to all contributors

---

**Remember**: Every agent is a master. Every master is essential. No weak links allowed.

*For detailed documentation, see the [Wiki](https://github.com/yourusername/shadow-clone/wiki)*