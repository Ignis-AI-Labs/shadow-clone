# Shadow Clone System for Claude Code

## 🚀 Overview

The Shadow Clone System is a powerful project orchestration framework that leverages Claude Code's ability to work with multiple specialized agents in parallel. It breaks complex projects into manageable **waves** (sprints), where teams of AI agents collaborate to deliver results efficiently with sophisticated coordination and execution control.

**🗾 Japanese Sword Master Philosophy**: Like the legendary Japanese sword-making process, each agent is a master craftsman in their domain - fully capable of handling the entire project alone, but when multiple masters collaborate, they create something far superior to what any individual could achieve. Each specialist brings deep expertise while working in perfect coordination with others.

## 🎯 Why Use Shadow Clone System?

- **🗾 Master Craftsman Approach**: Each agent is a domain expert capable of independent excellence
- **⚡ Dynamic Project Creation**: No project plan file required - describe your project and get started instantly
- **Wave-Based Execution**: Structured sprints with clear objectives and deliverables
- **Multiple Wave Strategies**: Auto, manual, dependency, or balanced execution approaches
- **Smart Project Detection**: Automatically detects new projects, audits, features, refactoring, or debugging
- **Git Safety Features**: Automatic safe branching for existing codebases with backup creation
- **Multi-Instance Support**: Run multiple Shadow Clone instances simultaneously on different branches
- **Parallel Processing**: Multiple master agents work simultaneously within each wave
- **Specialized Excellence**: Each agent brings master-level expertise to their domain
- **Coordinated Mastery**: Wave coordination creates synergy between domain experts
- **Quality Gates**: Built-in checkpoints between waves for validation
- **Interruption Recovery**: Built-in contingency planning for resuming work
- **Single Source of Truth**: Central development document coordinates all masters
- **Flexible Planning**: File-based project plans OR dynamic creation from natural language requests

## 📋 Prerequisites

- Claude Code installed and configured
- A workspace directory for the project
- **Shadow Clone prompt file in your project root directory**
- **Git repository** (optional - system will initialize if needed)
- **Existing codebase safety**: System automatically detects and protects existing code
- **Project plan file** (optional - system can create one dynamically from your request)

## 🔧 Setup Requirements

### Step 1: Place the Shadow Clone Prompt File

The `shadow-clone-prompt.md` file must be placed in the **root directory of your project** for Claude to find it easily.

#### Recommended Setup (Simplest)
Place the file in your project's root directory:
```bash
your-project-root/
├── shadow-clone-prompt.md    # Place it here for easy access
├── .shadow/                  # Shadow Clone system directory
│   └── mode_configs/        # Modular security configurations
├── project-plan.md
└── [other project files]
```

#### Alternative: Global Configuration  
You can also place it in a global location, but you'll need to specify the full path:
```bash
# Windows
%APPDATA%/.claude/prompts/shadow-clone-prompt.md

# macOS/Linux  
~/.claude/prompts/shadow-clone-prompt.md

# Then reference it in commands:
claude "Load ~/.claude/prompts/shadow-clone-prompt.md and execute"
```

#### Why Root Directory Works Best
- Claude finds it automatically without path specification
- Works consistently across different environments
- Simplifies command syntax
- No configuration directory setup required

### Step 2: Verify Claude Can Access the Prompt

Test that Claude can find and use the prompt:
```bash
# Simple test command - Claude Code will find it automatically in project root
claude "Load shadow-clone-prompt.md and plan"
```

If Claude can't find the prompt, you may need to:
1. Ensure the file is in your project's root directory
2. Check file permissions (ensure Claude can read the file)
3. Verify the filename is exactly `shadow-clone-prompt.md`
4. Make sure you're running the command from the project root directory

### Step 3: File Organization Best Practice

**Recommended directory structure for Shadow Clone projects:**
```
~/development/
├── project-templates/        # Reusable project plans
│   ├── web-app-template.md
│   ├── cli-tool-template.md
│   └── api-service-template.md
└── active-projects/          # Your actual projects
    ├── my-saas-app/
    │   ├── shadow-clone-prompt.md  # Copy prompt to each project root
    │   ├── .shadow/               # System configurations
    │   │   └── mode_configs/      # Modular security frameworks
    │   └── project-plan.md
    ├── cli-tool/
    │   ├── shadow-clone-prompt.md  # Copy prompt to each project root
    │   ├── .shadow/               # System configurations
    │   │   └── mode_configs/      # Modular security frameworks
    │   └── project-plan.md
    └── data-pipeline/
        ├── shadow-clone-prompt.md  # Copy prompt to each project root
        ├── .shadow/               # System configurations
        │   └── mode_configs/      # Modular security frameworks
        └── project-plan.md
```

## 🛡️ New Safety Features (Production Ready!)

## 🎯 NEW: Granular Agent Control per Team

You can now control not just the number of teams, but the exact number of agents within each team! This gives you precise control over how much expertise and parallel processing power each domain gets.

### 🔧 Team Composition Options

**Auto Composition (Default)**:
```bash
claude "Load shadow-clone-prompt.md and execute"
# System automatically allocates agents per team based on complexity
```

**Array-Based Specification**:
```bash
# Specify exact agent count per team: [Team1, Team2, Team3, Team4]
claude "Load shadow-clone-prompt.md and execute with num_teams=4 team_composition='[3,4,2,5]'"

# Results in:
# - Team 1: 3 agents (Lead + Implementation + QA)
# - Team 2: 4 agents (Lead + Senior Dev + Junior Dev + QA)
# - Team 3: 2 agents (Lead + Specialist)  
# - Team 4: 5 agents (Lead + Senior Dev + 2x Implementation + QA)
```

**Named Team Specification**:
```bash
# Specify by team role name and agent count
claude "Load shadow-clone-prompt.md and execute with team_composition='frontend:4,backend:4,testing:2,devops:2,security:3'"

# Results in specialized teams with exact agent allocation:
# - Frontend Team: 4 agents for complex UI/UX work
# - Backend Team: 4 agents for API and database development  
# - Testing Team: 2 agents for focused QA
# - DevOps Team: 2 agents for deployment and infrastructure
# - Security Team: 3 agents for comprehensive security assessment
```

**Balanced Distribution**:
```bash
# Distribute total agents evenly across all teams
claude "Load shadow-clone-prompt.md and execute with num_teams=4 team_composition='balanced'"
# With 12 total agents = 3 agents per team automatically
```

### 🏗️ Multi-Agent Team Structure

**2-Agent Teams**: Lead + Specialist
- Perfect for focused domains like DevOps or Documentation

**3-Agent Teams**: Lead + Implementation + QA  
- Ideal balance for most development teams

**4-Agent Teams**: Lead + Senior Dev + Junior Dev + QA
- Great for complex domains like Frontend/Backend development

**5+ Agent Teams**: Lead + Senior + Multiple Implementation + QA + Documentation
- Perfect for complex domains like Security Audits or Large-Scale Architecture

### 💡 Real-World Examples

**Web Application Development**:
```bash
claude "Load shadow-clone-prompt.md and execute with team_composition='requirements:2,architecture:3,frontend:4,backend:4,testing:3,devops:2'"

# Creates specialized teams with appropriate sizing:
# - Requirements: 2 agents (Business Analysis + User Research)  
# - Architecture: 3 agents (System Design + Database + API Design)
# - Frontend: 4 agents (Lead + Senior React + Junior React + QA)
# - Backend: 4 agents (Lead + Senior Node.js + Junior Node.js + QA)
# - Testing: 3 agents (Manual Testing + Automation + Performance)
# - DevOps: 2 agents (Infrastructure + CI/CD)
```

**Security Audit Project**:
```bash
claude "Load shadow-clone-prompt.md and execute with project_type=audit team_composition='security:4,performance:2,code:3,infrastructure:2,compliance:2'"

# Specialized security teams:
# - Security Assessment: 4 agents (OWASP Expert + Penetration Tester + Vulnerability Analyst + QA)
# - Performance Analysis: 2 agents (Load Testing + Optimization)
# - Code Quality: 3 agents (Static Analysis + Architecture Review + Documentation)
# - Infrastructure Security: 2 agents (Cloud Security + Network Security)
# - Compliance Review: 2 agents (Regulatory Expert + Documentation)
```

**Complex SaaS Platform**:
```bash
claude "Load shadow-clone-prompt.md and execute with team_composition='[3,5,5,4,3,2,2]'"

# Team 1 (Requirements): 3 agents - Business analysis and user research
# Team 2 (Frontend): 5 agents - Complex React/TypeScript development  
# Team 3 (Backend): 5 agents - Microservices and API development
# Team 4 (Database): 4 agents - Schema design, optimization, and migrations
# Team 5 (Testing): 3 agents - Unit, integration, and E2E testing
# Team 6 (DevOps): 2 agents - AWS infrastructure and CI/CD
# Team 7 (Security): 2 agents - Authentication and security review
```

### 🚀 Why Use Granular Agent Control?

- **Resource Optimization**: Allocate more agents to complex domains, fewer to simpler ones
- **Expertise Focus**: Create large expert teams for critical areas like security or architecture  
- **Parallel Processing**: Scale up teams that can benefit from multiple agents working in parallel
- **Quality Assurance**: Ensure complex teams have dedicated QA agents
- **Cost Efficiency**: Don't waste agents on simple tasks that only need 1-2 experts

## 🔥 New Safety Features (Production Ready!)

The Shadow Clone System now includes powerful safety features for existing codebases:

### 🔍 Smart Project Type Detection
- **Automatic detection** of project type (new, audit, feature, refactor, debug, optimize)
- **Workspace analysis** looking at existing code, git history, and dependencies
- **Intelligent safety measures** applied based on project context

### 🌿 Advanced Git Safety
- **Safe branching** automatically creates timestamped branches for existing repos
- **Backup creation** before any modifications to existing codebases  
- **Branch isolation** enables multiple instances without conflicts
- **Zero risk** to main/master branches

### 🔄 Multi-Instance Coordination  
- **Parallel development** on different branches simultaneously
- **Resource optimization** across multiple Shadow Clone teams
- **Clear integration** paths with separate git histories

### 🚀 Usage Examples
```bash
# Safe feature development on existing codebase
claude "Load shadow-clone-prompt.md and execute with project_type=feature git_strategy=safe_branch"

# Code audit without touching main branch  
claude "Load shadow-clone-prompt.md and execute with project_type=audit"

# Automatic detection (recommended)
claude "Load shadow-clone-prompt.md and execute"
```

## 🛠️ How to Use

### Step 1: Create Your Project Plan (Optional)

You have two options for project planning:

#### Option A: Create a Detailed Project Plan File (Recommended for Complex Projects)

Create a detailed project plan file for complex projects with specific requirements:

**Example: `project-plan.md`**
```markdown
# Task Management Web Application

## Overview
Build a modern task management application with real-time updates and team collaboration features.

## Core Requirements

### User Management
- User registration and authentication (JWT-based)
- User profiles with avatars
- Role-based access control (Admin, Manager, Member)

### Task Features
- Create, read, update, delete tasks
- Task assignment to team members
- Due dates and priority levels
- Task categories and tags
- File attachments
- Comments and activity feed

### Project Organization
- Projects as containers for tasks
- Project templates
- Team assignment to projects
- Project dashboards with statistics

### Technical Requirements
- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: PostgreSQL with Prisma ORM
- Real-time: Socket.io
- Authentication: JWT + refresh tokens
- Testing: Jest for backend, React Testing Library for frontend

### Additional Features
- Email notifications
- Search and filtering
- Data export (CSV, PDF)
- Dark mode support
- Mobile responsive design

## Success Criteria
- All CRUD operations working
- Real-time updates functional
- Comprehensive test coverage (>80%)
- Full API documentation
- Deployment-ready with Docker
```

#### Option B: Dynamic Project Plan Creation (Quick Start)

For simpler projects or quick tasks, you can skip creating a project plan file and describe your project directly in the command. The system will automatically create a comprehensive project plan for you based on your description.

**Examples of Dynamic Project Descriptions:**
```bash
# Simple web app request
claude "Load shadow-clone-prompt.md and execute - Build a todo list web app with React frontend and Node.js backend, using PostgreSQL database, with user authentication and CRUD operations"

# CLI tool request  
claude "Load shadow-clone-prompt.md and execute - Create a CLI tool in Go that can initialize projects from templates, deploy to various platforms, and monitor logs"

# API service request
claude "Load shadow-clone-prompt.md and execute - Build a REST API for a blog platform with user management, posts, comments, and search functionality using Python FastAPI"

# Data pipeline request
claude "Load shadow-clone-prompt.md and execute - Create a data pipeline that processes CSV files, cleans the data, performs analytics, and outputs to both database and visualization dashboard"
```

The system will automatically:
- Analyze your request and extract requirements
- Generate a comprehensive project plan
- Save the plan to your workspace for future reference
- Proceed with full project execution

### Step 2: Launch the Shadow Clone System

Choose your environment and launch method:

## 🚀 Claude Code Launch (Recommended)

### 📋 Understanding Execution Modes vs Project Types

**🔄 Execution Modes** (how the system runs):
- **Execute Mode**: `"and execute"` - Actually performs the work and creates/modifies files
- **Planning Mode**: `"and plan"` - Reviews strategy and creates plans without executing
- **Research Mode**: `"and research"` - Deploys specialized research agents to gather comprehensive information

**📁 Project Types** (what kind of work to do):
- **new**: Build new project from scratch
- **audit**: Analyze existing codebase without changes
- **feature**: Add functionality to existing code
- **refactor**: Improve existing code structure  
- **debug**: Fix issues in existing code
- **optimize**: Apply improvements based on audit findings
- **research**: Deep investigation into technologies, patterns, or problem domains
- **auto**: Let system detect project type automatically

#### Ultra-Simple Launch (Execute Mode)
```bash
# Option 1: With existing project plan file
claude "Load shadow-clone-prompt.md and execute"

# Option 2: Dynamic project creation (describe your project)
claude "Load shadow-clone-prompt.md and execute - [Your project description]"

# Examples:
claude "Load shadow-clone-prompt.md and execute - Build a contact management app with React and Firebase"
claude "Load shadow-clone-prompt.md and execute - Create a Python data analysis script for sales reports"
```
**Requirements**: Either have `project-plan.md` in your current directory OR provide a project description in the command

#### Planning Mode (Review Before Execution)
```bash
# Option 1: Plan with existing project plan file
claude "Load shadow-clone-prompt.md and plan"

# Option 2: Dynamic planning (describe your project)
claude "Load shadow-clone-prompt.md and plan - [Your project description]"

# Examples:
claude "Load shadow-clone-prompt.md and plan - Build an e-commerce site with payment integration"
claude "Load shadow-clone-prompt.md and plan - Create a microservices architecture for user management"
```
**Use when**: You want to review the strategy before committing to execution

#### Research Mode (Expert Knowledge Gathering)
```bash
# Option 1: Research based on existing project plan
claude "Load shadow-clone-prompt.md and research"

# Option 2: Dynamic research (describe your research domain)
claude "Load shadow-clone-prompt.md and research - [Your research focus]"

# Examples:
claude "Load shadow-clone-prompt.md and research - Compare authentication solutions for SaaS platforms"
claude "Load shadow-clone-prompt.md and research - Modern CI/CD patterns for microservices deployment"
```
**Use when**: You need deep investigation into technologies, best practices, or problem domains before planning or execution

**Master Craftsman Philosophy**: Like Japanese sword-making masters, each agent is an expert in their domain who could handle the entire project alone, but together they create something far superior through specialized collaboration.

#### Custom Configuration Launch
```bash
# Override specific settings (execution mode):
claude "Load shadow-clone-prompt.md and execute with num_teams=6 wave_strategy=balanced"

# Different workspace (execution mode):
claude "Load shadow-clone-prompt.md and execute with workspace_dir=./my-project"

# Specify project type (execution mode):
claude "Load shadow-clone-prompt.md and execute with project_type=feature"

# Granular agent control per team (NEW FEATURE):
claude "Load shadow-clone-prompt.md and execute with num_teams=4 team_composition='[3,4,2,3]'"

# Named team composition (execution mode):
claude "Load shadow-clone-prompt.md and execute with team_composition='frontend:4,backend:4,testing:2,devops:2'"

# Complete control (execution mode):
claude "Load shadow-clone-prompt.md and execute with project_plan=./custom.md workspace_dir=./project num_teams=5 team_composition='[3,4,4,2,2]' wave_strategy=manual wave_count=3"

# Custom configuration in planning mode (no execution):
claude "Load shadow-clone-prompt.md and plan with num_teams=8 wave_strategy=manual"

# Plan specific project type (no execution):
claude "Load shadow-clone-prompt.md and plan with project_type=audit"

# Research mode with auto project type detection:
claude "Load shadow-clone-prompt.md and research"

# Research specific domains:
claude "Load shadow-clone-prompt.md and research with project_type=research"

# Research for existing project enhancement:
claude "Load shadow-clone-prompt.md and research with project_type=feature"
```

## 💬 Cursor Chat Launch (Alternative)

#### Simple Cursor Launch
```
Create Shadow Clone team for this project using default settings. 
Analyze project-plan.md in current directory and create specialized sub-agents.
```

#### Custom Cursor Launch
```
Launch Shadow Clone system with:
- 6 specialized sub-agents
- Balanced wave strategy  
- Workspace: ./my-project
Create background agents for each team role.
```

#### 🔥 Hybrid System Launch (Recommended for Maximum Power)
```
Launch hybrid Shadow Clone system:
1. First execute Claude Code with "Load shadow-clone-prompt.md and execute"
2. Then create Cursor background agents to work alongside Claude Code teams
3. Use project-plan.md in current directory
4. Coordinate between both systems for maximum efficiency

Create specialized background agents for each role while Claude Code handles the primary workflow.
```

## 🛡️ Enhanced Cybersecurity Framework (NEW)

The Shadow Clone System now includes comprehensive cybersecurity capabilities that go far beyond basic security practices to provide enterprise-grade security assessment and implementation.

### 🔐 Comprehensive Security Coverage

#### Beyond OWASP Top Ten
**Multi-Framework Security Integration:**
- **NIST Secure Software Development Framework (SSDF)** - Complete SSDLC integration
- **Common Weakness Enumeration (CWE)** - Comprehensive vulnerability pattern coverage
- **OWASP Application Security Verification Standard (ASVS)** - Detailed security requirements
- **OWASP Mobile Application Security Verification Standard (MASVS)** - Mobile security
- **OWASP API Security Top Ten** - API-specific security assessment
- **Cloud Security Alliance (CSA) Guidelines** - Cloud and container security
- **Industry-Specific Standards** - HIPAA, PCI DSS, GDPR, SOX compliance integration

#### Advanced Security Assessment Features
**Automated Security Tool Integration:**
- **SAST (Static Application Security Testing)**: SonarQube, Semgrep, CodeQL, Bandit, Brakeman
- **DAST (Dynamic Application Security Testing)**: OWASP ZAP, Burp Suite, custom testing
- **Dependency Security**: OWASP Dependency-Check, Snyk, GitHub Dependabot
- **Infrastructure Security**: Checkov, Terrascan, Docker Bench, Kube-score
- **Configuration Security**: Cloud security scanners, IaC security assessment

### 🎯 Modular Security Architecture

#### Mode-Specific Security Expertise
**Specialized Security Modules:**
- **🔍 Audit Mode**: Comprehensive security assessment with OWASP Top Ten, NIST SSDF, CWE integration
- **🔨 Feature Mode**: Security-first feature development with threat modeling and secure coding
- **🔄 Refactor Mode**: Security-preserving code improvements with audit finding integration
- **⚡ Optimize Mode**: Security-focused performance optimization with vulnerability remediation
- **🐛 Debug Mode**: Secure debugging practices with information protection
- **🔬 Research Mode**: Security-informed research with threat intelligence integration

#### Security Master Craftsmen
**Enhanced Security Teams:**
- **Authentication & Authorization Master**: IAM, MFA, OAuth/OIDC, RBAC expertise
- **Data Security Master**: Encryption, PII/PHI protection, GDPR/CCPA compliance
- **Infrastructure Security Master**: Cloud security, container security, CI/CD security
- **Application Security Master**: OWASP compliance, injection prevention, XSS protection
- **Dependency & Supply Chain Master**: CVE analysis, SBOM generation, supply chain security
- **Compliance & Governance Master**: Regulatory compliance, audit trails, privacy protection

### 🔧 Security-Enhanced Project Types

#### Comprehensive Security Audit (Enhanced)
```bash
# Enterprise-grade security audit with multiple frameworks
claude "Load shadow-clone-prompt.md and execute with project_type=audit"

# Features:
- OWASP Top Ten 2021 compliance assessment with 2025 preparation
- NIST SSDF framework integration across all development phases
- CWE vulnerability pattern analysis with automated tool integration
- Industry-specific compliance checking (HIPAA, PCI DSS, GDPR)
- Automated SAST/DAST tool execution and result correlation
- Supply chain security assessment with SBOM generation
- Cloud security configuration analysis
- AI/ML security assessment (when applicable)
```

#### Secure Feature Development
```bash
# Security-first feature development with threat modeling
claude "Load shadow-clone-prompt.md and execute with project_type=feature - Add user authentication with OAuth2 and MFA support"

# Features:
- STRIDE threat modeling integration
- Security-by-design implementation
- Automated security testing integration
- Compliance requirement verification
- Secure coding standard enforcement
- Real-time security scanning during development
```

#### Security-Preserving Refactoring
```bash
# Code improvements that enhance security posture
claude "Load shadow-clone-prompt.md and execute with project_type=refactor"

# Features:
- Security control preservation during refactoring
- Audit finding remediation integration
- Security pattern implementation
- Vulnerability prevention during code changes
- Security regression testing
- Compliance maintenance verification
```

#### Audit-to-Optimization Workflow
```bash
# Step 1: Comprehensive security audit
claude "Load shadow-clone-prompt.md and execute with project_type=audit"

# Step 2: Security-focused optimization based on findings
claude "Load shadow-clone-prompt.md and execute with project_type=optimize"

# Features:
- Risk-based vulnerability prioritization
- Critical security fixes in Wave 1
- Performance security optimization in Wave 2
- Quality security enhancement in Wave 3
- Compliance gap closure
- Automated security testing integration
```

### 🌐 Industry-Specific Security Compliance

#### Healthcare (HIPAA/HITECH)
```bash
claude "Load shadow-clone-prompt.md and execute with project_type=audit - Healthcare application requiring HIPAA compliance"

# Includes:
- PHI protection mechanism assessment
- Access control and audit logging verification
- Encryption requirement compliance
- Business associate agreement compliance
- Breach notification procedure verification
```

#### Financial Services (PCI DSS)
```bash
claude "Load shadow-clone-prompt.md and execute with project_type=audit - Payment processing application"

# Includes:
- Cardholder data protection assessment
- Network security architecture validation
- Strong access control measure verification
- Regular security testing integration
- Compliance monitoring and reporting
```

#### Privacy Compliance (GDPR/CCPA)
```bash
claude "Load shadow-clone-prompt.md and execute with project_type=feature - Add privacy controls for EU users"

# Includes:
- Data minimization principle implementation
- Consent management mechanism integration
- Data subject rights automation
- Privacy by design verification
- Cross-border data transfer compliance
```

### 🤖 AI/ML Security Integration

#### AI System Security Assessment
```bash
claude "Load shadow-clone-prompt.md and execute with project_type=audit - Machine learning recommendation system"

# Features:
- Model poisoning attack prevention assessment
- Adversarial attack resistance evaluation
- Data privacy in AI/ML workflow verification
- Model interpretability and bias assessment
- AI system governance and ethics compliance
- Federated learning security (when applicable)
```

### 📊 Security Metrics and Continuous Improvement

#### Advanced Security KPIs
**Quantitative Security Metrics:**
- Vulnerability count by severity and category
- Mean time to remediation (MTTR) tracking
- Security test coverage percentage
- Dependency vulnerability exposure metrics
- Compliance score percentage across frameworks

**Qualitative Security Metrics:**
- Security architecture maturity assessment
- Incident response effectiveness evaluation
- Security training completion and effectiveness
- Security tool adoption and integration rates
- Threat modeling coverage assessment

#### Continuous Security Activities
**Automated Security Schedule:**
- **Daily**: Automated SAST/DAST scanning
- **Weekly**: Dependency vulnerability assessment
- **Monthly**: Configuration security review
- **Quarterly**: Comprehensive security assessment
- **Annually**: Security architecture and strategy review

### 🚀 Enhanced Launch Examples

#### Enterprise Security Audit
```bash
# 🎯 COMPREHENSIVE: Full enterprise security assessment (no project plan needed)
claude "Load shadow-clone-prompt.md and execute with project_type=audit workspace_dir=./enterprise-app"

# 🏢 COMPLIANCE: Enterprise with specific compliance requirements
claude "Load shadow-clone-prompt.md and execute with project_type=audit - Enterprise SaaS requiring SOC2 and GDPR compliance"

# 🔍 FOCUSED: Large codebase with specific technology focus
claude "Load shadow-clone-prompt.md and execute with project_type=audit - Microservices architecture with Kubernetes and API security focus"

# Enhanced Deployment Features:
- 7+ Security Master specialists (including QA & Validation Master)
- Self-contained audit scope (no project plan required)
- Comprehensive OWASP + NIST + CWE + industry assessment
- Multi-layer false positive validation protocol (5-layer system)
- Automated SAST/DAST tool integration with cross-tool correlation
- 10 standardized enterprise report templates
- Expert consensus requirement for all findings
- Practical exploitation testing for critical vulnerabilities
- Business context analysis and impact validation
- Multi-framework compliance verification (GDPR, HIPAA, PCI DSS, SOX)
- Quality assurance metrics tracking (<10% false positive rate)
- Technology-specific expertise (web, mobile, API, cloud, containers, AI/ML)
```

#### Secure SaaS Development
```bash
claude "Load shadow-clone-prompt.md and execute with project_type=new - Multi-tenant SaaS platform with SOC2 compliance"

# Features:
- Security-by-design architecture
- Multi-tenancy security isolation
- Automated compliance monitoring
- Real-time security testing integration
- Enterprise security control implementation
```

#### Zero-Trust Architecture Implementation
```bash
claude "Load shadow-clone-prompt.md and execute with project_type=feature - Implement zero-trust architecture with micro-segmentation"

# Includes:
- Identity-centric security model
- Least privilege access implementation
- Continuous verification mechanisms
- Micro-segmentation strategy
- Advanced threat detection integration
```

### 📝 Standardized Report Templates & Quality Assurance

The Shadow Clone System now includes enterprise-grade report templates and quality assurance protocols to ensure consistent, high-quality audit deliverables.

#### Report Template Structure
**Location:** `.shadow/templates/`

**Available Templates:**
- **`security-audit-report-template.md`** - Comprehensive audit report with standardized sections
- **`vulnerability-report-template.md`** - Individual security finding documentation  
- **`false-positive-validation-checklist.md`** - Quality assurance validation protocol

#### Quality Assurance Features
**False Positive Prevention Protocol:**
- **5-Layer Validation System** - Multi-stage verification process
- **Cross-Tool Correlation** - Minimum 2 SAST tools for critical findings
- **Expert Consensus** - Multiple security master validation required
- **Business Context Analysis** - Real-world exploitability assessment
- **Practical Testing** - Proof-of-concept development for verification

**Quality Metrics Tracking:**
- **False Positive Rate Target:** <10% across all findings
- **Validation Time:** <24 hours for critical, <72 hours for high findings
- **Expert Consensus Rate:** >95% agreement between security masters
- **Client Challenge Rate:** <5% of delivered findings challenged
- **Reproduction Success:** >90% of confirmed vulnerabilities reproducible

#### Enhanced Audit Capabilities
**Multi-Layer Validation Protocol:**

1. **Layer 1: Automated Tool Correlation**
   - Cross-reference findings across multiple security tools
   - Compare confidence levels and scoring methodologies
   - Flag single-tool detections for enhanced validation

2. **Layer 2: Code Context Analysis**  
   - Complete file reading (never partial scans)
   - Framework security feature assessment
   - Data flow validation from input to vulnerability

3. **Layer 3: Business Logic Validation**
   - Authentication and authorization requirements analysis
   - Network accessibility assessment (internal vs external)
   - Real-world exploitation feasibility evaluation

4. **Layer 4: Dynamic Testing**
   - Manual vulnerability reproduction attempts
   - Proof-of-concept exploit development
   - Impact verification through practical testing

5. **Layer 5: Expert Consensus**
   - Multiple security master independent assessment
   - Peer review and validation consensus
   - Quality Assurance Master final approval

**Common False Positive Pattern Recognition:**
- **React/Angular:** Auto-escaped template output flagged as XSS
- **Django/Rails:** ORM-generated queries flagged as SQL injection  
- **Spring Boot:** Auto-configured security flagged as misconfiguration
- **Node.js:** Proper input validation flagged as insufficient
- **Cloud Services:** Default security configurations flagged as weak

This enhanced cybersecurity framework ensures that every Shadow Clone project meets enterprise-grade security standards while maintaining the efficiency and master craftsman philosophy of the system.

#### Custom Hybrid Launch
```
Launch hybrid Shadow Clone system with custom settings:
1. Execute Claude Code with "Load shadow-clone-prompt.md and execute with num_teams=6 wave_strategy=balanced workspace_dir=./my-project"
2. Create 4 additional Cursor background agents for:
   - Real-time code review and optimization
   - Advanced debugging and troubleshooting  
   - Documentation and testing assistance
   - Integration and deployment support
3. Coordinate wave execution between both systems

This gives you Claude Code's structured waves plus Cursor's real-time assistance.
```

## 🔥 Hybrid System: Claude Code + Cursor (Maximum Power)

The hybrid approach combines Claude Code's structured wave system with Cursor's real-time assistance for unprecedented development power.

### How Hybrid System Works

1. **Claude Code** handles the primary structured workflow with specialized teams in waves
2. **Cursor** creates background agents that provide real-time assistance throughout the process
3. Both systems coordinate to maximize efficiency and quality

### Hybrid System Benefits

- **Structured Workflow**: Claude Code's wave-based project management
- **Real-time Assistance**: Cursor's background agents for immediate help
- **Quality Assurance**: Dual-layer code review and optimization
- **Parallel Processing**: Multiple systems working simultaneously
- **Comprehensive Coverage**: Both macro project management and micro code assistance

### Hybrid Command Format

**Simple Hybrid Launch:**
```
Launch hybrid Shadow Clone system:
1. First execute Claude Code with "Load shadow-clone-prompt.md and execute"
2. Then create Cursor background agents to work alongside Claude Code teams
3. Use project-plan.md in current directory
4. Coordinate between both systems for maximum efficiency
```

**Advanced Hybrid Launch:**
```
Launch hybrid Shadow Clone system with custom settings:
1. Execute Claude Code with "Load shadow-clone-prompt.md and execute with [your-custom-settings]"
2. Create [X] additional Cursor background agents for specialized roles
3. Coordinate wave execution between both systems
```

### Hybrid System Examples

#### Example 1: Web App with Hybrid Power
```
Launch hybrid Shadow Clone system for web application:
1. Execute Claude Code with "Load shadow-clone-prompt.md and execute with num_teams=5 wave_strategy=balanced"
2. Create 3 Cursor background agents:
   - Frontend code optimization and real-time React debugging
   - Backend API testing and performance monitoring
   - Database query optimization and security scanning
3. Let Claude Code handle wave coordination while Cursor agents provide continuous assistance
```

#### Example 2: Complex SaaS with Maximum Support
```
Launch hybrid Shadow Clone system for SaaS platform:
1. Execute Claude Code with "Load shadow-clone-prompt.md and execute with project_plan=./saas-plan.md workspace_dir=./saas-app num_teams=6 wave_strategy=manual wave_count=4"
2. Create 5 Cursor background agents:
   - Real-time security vulnerability scanning
   - Performance bottleneck detection and optimization
   - Advanced testing strategy implementation
   - Documentation generation and maintenance
   - DevOps and deployment troubleshooting
3. Coordinate both systems for enterprise-grade development workflow
```

## 📁 Setup Requirements

**Before launching, ensure you have:**
1. **shadow-clone-prompt.md** file in your project's root directory
2. **project-plan.md** file in your target directory (optional - system can create dynamically)
3. **workspace directory** ready (current directory works fine)

## ⚡ Quick Launch Examples

#### For a New Web App Project:
```bash
# Option 1: Create project plan file then execute
cat > project-plan.md << 'EOF'
# Web Application Project
## Overview
Build a full-stack web application with authentication and CRUD operations.
## Technical Stack
- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: PostgreSQL
EOF

claude "Load shadow-clone-prompt.md and execute"

# Option 2: Dynamic creation (no project plan file needed)
claude "Load shadow-clone-prompt.md and execute - Build a full-stack web application with React TypeScript frontend, Node.js Express backend, PostgreSQL database, with user authentication and CRUD operations"
```

#### For Adding Features to Existing Codebase:
```bash
# Option 1: Create feature plan file then execute
cat > project-plan.md << 'EOF'
# New Feature Addition
## Overview
Add user notifications and real-time chat to existing app.
## Requirements
- Real-time notifications
- Chat system with message history
- Mobile push notifications
EOF

claude "Load shadow-clone-prompt.md and execute with project_type=feature"

# Option 2: Dynamic feature addition (no project plan file needed)
claude "Load shadow-clone-prompt.md and execute with project_type=feature - Add user notifications and real-time chat system with message history and mobile push notifications to existing app"
```

#### For Code Audit of Existing Project:
```bash
# 🚀 SIMPLE: No project plan needed - audit scope is standardized!
claude "Load shadow-clone-prompt.md and execute with project_type=audit"

# 🎯 FOCUSED: Specify focus areas if needed
claude "Load shadow-clone-prompt.md and execute with project_type=audit - Focus on OWASP Top Ten and API security"

# 🏥 COMPLIANCE: Industry-specific audits
claude "Load shadow-clone-prompt.md and execute with project_type=audit - Healthcare app requiring HIPAA compliance"

# 🌐 TECHNOLOGY: Technology-specific audits  
claude "Load shadow-clone-prompt.md and execute with project_type=audit - React/Node.js web application with AWS deployment"

# Features Include:
# - 7+ Security Masters (including QA & Validation Master)
# - 5-layer validation protocol for <10% false positive rate
# - Standardized enterprise report templates (10 templates)
# - OWASP Top Ten + NIST SSDF + CWE + industry compliance
# - Cross-tool correlation and expert consensus validation
# - Practical exploitation testing for critical findings
# - Comprehensive coverage: web, API, mobile, cloud, containers, AI/ML
```

#### For Optimizing After Audit:
```bash
# 1. Create optimization plan based on audit findings
cat > project-plan.md << 'EOF'
# Code Optimization
## Overview
Optimize existing codebase based on audit findings and best practices.
## Optimization Areas
- Fix security vulnerabilities identified in audit
- Improve performance bottlenecks
- Refactor code quality issues
- Add missing documentation
- Upgrade dependencies
- Implement best practices
EOF

# 2. Launch in execution mode with optimize project type (continues on audit branch or creates new branch)
claude "Load shadow-clone-prompt.md and execute with project_type=optimize"
```

#### For Deep Technology Research:
```bash
# 1. Create research investigation plan
cat > project-plan.md << 'EOF'
# Technology Research Investigation
## Overview
Comprehensive research into modern authentication patterns for SaaS applications.
## Research Domains
### Security Patterns
- OAuth 2.0 vs JWT best practices
- Multi-factor authentication implementations
- Session management strategies
- Zero-trust architecture principles

### Performance & Scalability
- Microservices vs monolith for auth
- Caching strategies for user sessions
- Database optimization for user data
- Load balancing considerations

### Technology Stack Analysis
- Auth0 vs Firebase Auth vs custom solutions
- Node.js vs Go vs Rust for auth services
- PostgreSQL vs MongoDB for user data
- Redis vs Memcached for sessions

### Implementation Patterns
- Clean architecture for auth systems
- Testing strategies for security features
- Deployment patterns and CI/CD
- Monitoring and observability

## Research Objectives
- Comprehensive technology comparison report
- Architecture recommendations with pros/cons
- Implementation roadmap with timelines
- Security best practices checklist
- Performance benchmarking data
EOF

# 2. Launch research mode (deploys specialized research teams)
claude "Load shadow-clone-prompt.md and research with project_type=research"
```

#### For a CLI Tool Project:
```bash
# Option 1: Create project plan file then execute
cat > project-plan.md << 'EOF'
# CLI Tool Project
## Overview
Build a developer productivity CLI tool.
## Technical Stack
- Language: Go
- Commands: init, deploy, monitor
EOF

claude "Load shadow-clone-prompt.md and execute with num_teams=4"

# Option 2: Dynamic CLI tool creation (no project plan file needed)
claude "Load shadow-clone-prompt.md and execute with num_teams=4 - Build a developer productivity CLI tool in Go with commands for init, deploy, and monitor"
```

### Command Arguments Format

The Shadow Clone System uses smart defaults - you only need to specify what you want to customize:

**Smart Defaults Applied When Not Specified:**
1. **project_plan**: `./project-plan.md` (looks for this file in current directory)
2. **workspace_dir**: `./` (uses current directory as workspace)
3. **num_teams**: `dynamic` (system determines optimal team count)
4. **wave_strategy**: `auto` (system determines optimal wave strategy)
5. **wave_count**: `dynamic` (system determines optimal wave count)
6. **project_type**: `auto` (system detects: new, audit, feature, refactor)
7. **git_strategy**: `auto` (creates branches for existing repos, handles new repos)

**Override Any Default Using Natural Language:**
```bash
# Override just one setting
claude "Load shadow-clone-prompt.md and execute with num_teams=6"

# Override multiple settings
claude "Load shadow-clone-prompt.md and execute with workspace_dir=./my-project wave_strategy=balanced"

# Specify project type and git strategy
claude "Load shadow-clone-prompt.md and execute with project_type=audit git_strategy=branch"

# Override everything
claude "Load shadow-clone-prompt.md and execute with project_plan=./custom.md workspace_dir=./project num_teams=5 wave_strategy=manual wave_count=3 project_type=feature git_strategy=safe_branch"
```

### How Arguments Are Processed

When you run a command like:
```bash
claude "Load shadow-clone-prompt.md and execute with project_plan=./plan.md workspace_dir=./project num_teams=5"
```

The Shadow Clone prompt receives this and parses it to extract:
- `project_plan` = `./plan.md`
- `workspace_dir` = `./project` 
- `num_teams` = `5`
- `wave_strategy` = `auto` (default if not specified)
- `wave_count` = `dynamic` (default if not specified)

**Important Notes:**
- Use `key=value` format without spaces around the `=`
- Separate multiple arguments with spaces
- File paths with spaces should be quoted: `project_plan="./my project/plan.md"`
- Natural language commands like "and execute" or "and plan" make the interface more intuitive

### Project Type Detection & Git Strategies

#### Project Type Options

**Auto Detection (Recommended)**
- System analyzes workspace and project plan to determine type
- Looks for existing code, git history, and project plan keywords
- Automatically applies appropriate safety measures

**Manual Project Types:**
- **new**: Greenfield project, full workspace setup
- **audit**: Code review, analysis, and documentation focus
- **feature**: Adding new functionality to existing codebase
- **refactor**: Improving existing code structure and quality
- **debug**: Troubleshooting and fixing existing issues
- **optimize**: Performance, security, and quality improvements based on audit findings

#### Git Strategy Options

**Auto Git Strategy (Recommended)**
- Detects existing git repository and creates appropriate branches
- Uses safe branching for existing codebases
- Handles new repositories appropriately

**Manual Git Strategies:**
- **safe_branch**: Always create new branch with timestamp/feature name
- **branch**: Create standard feature branch
- **main**: Work directly on main branch (use with caution)
- **none**: Skip git operations entirely

#### Smart Safety Features

**For Existing Codebases:**
- Automatically creates feature branches with descriptive names
- Preserves main/master branch integrity
- Enables multiple Shadow Clone instances via separate branches
- Backs up critical files before major changes

**Branch Naming Convention:**
- New features: `shadow-clone/feature-[timestamp]`
- Audits: `shadow-clone/audit-[timestamp]`
- Refactors: `shadow-clone/refactor-[timestamp]`
- Debug: `shadow-clone/debug-[issue-description]`
- Optimizations: `shadow-clone/optimize-[timestamp]`

### Wave Strategy Options

#### Auto Strategy
- System automatically determines optimal wave distribution
- Analyzes team dependencies and balances workload
- **Best for**: Most projects where you want optimal efficiency

#### Manual Strategy  
- Explicit wave assignments based on your project plan specifications
- Provides maximum control over execution flow
- **Best for**: Projects with specific sprint requirements or custom phases

#### Dependency Strategy
- Wave assignment based purely on dependency chains
- Teams with no dependencies run first, then subsequent waves
- **Best for**: Projects with clear sequential dependencies

#### Balanced Strategy
- Hybrid approach balancing dependencies and workload
- Optimizes for both efficiency and resource utilization
- **Best for**: Complex projects needing both speed and coordination

## 📁 Workspace Structure

The enhanced system creates an organized workspace with wave coordination:

```
workspace_dir/
├── DEVELOPMENT.md         # Central coordination document
├── project-plan.md        # Copy of your project plan
├── .shadow/               # Shadow Clone system files
│   ├── mode_configs/     # Modular security configurations
│   │   ├── shadow-clone-audit.md
│   │   ├── shadow-clone-feature.md
│   │   ├── shadow-clone-refactor.md
│   │   ├── shadow-clone-optimize.md
│   │   ├── shadow-clone-debug.md
│   │   └── shadow-clone-research.md
│   └── templates/        # Standardized report templates
│       ├── security-audit-report-template.md
│       ├── vulnerability-report-template.md
│       └── false-positive-validation-checklist.md
├── .waves/                # Wave execution runtime files
│   ├── wave_plan.md      # Wave assignments and timeline
│   ├── wave_status.md    # Overall wave progress
│   ├── git_status.md     # Git branch management and safety
│   ├── safety_log.md     # Backup and safety operations log
│   ├── project_analysis.md # Project type detection results
│   ├── vulnerabilities/ # Individual vulnerability reports (audit mode)
│   ├── wave_1/           # Wave 1 coordination
│   ├── wave_2/           # Wave 2 coordination
│   └── instance_coordination.md # Multi-instance management
├── src/                  # Source code
├── tests/                # Test files
├── docs/                 # Documentation
├── config/               # Configuration files
├── .backup/              # Safety backups (for existing codebases)
└── [other directories as needed]
```

## 🌊 Understanding Enhanced Waves

Waves are now sophisticated development phases with built-in coordination:

### Wave Execution Flow

1. **Pre-Wave Setup**: Verify prerequisites and prepare workspace
2. **Wave Launch**: Launch all teams simultaneously with monitoring
3. **Wave Monitoring**: Track progress and facilitate coordination
4. **Wave Completion**: Verify deliverables and quality checks
5. **Inter-Wave Transition**: Review outcomes and prepare next wave

### Wave Coordination Features

- **Progress Tracking**: Real-time dashboards and completion indicators
- **Quality Gates**: Automatic validation between waves
- **Communication Protocols**: Structured team coordination
- **Dependency Management**: Automatic prerequisite verification

### Typical Wave Structure

#### Wave 1: Foundation
- Requirements analysis and specifications
- Architecture design and technical decisions
- Initial workspace setup
- **Duration**: 1-3 hours depending on complexity

#### Wave 2: Design & Planning
- UI/UX design and mockups
- Database schema design
- API interface definitions
- Development task breakdown
- **Duration**: 2-4 hours

#### Wave 3: Core Implementation
- Parallel frontend and backend development
- Core feature implementation
- Integration point development
- **Duration**: 4-8 hours

#### Wave 4: Integration & Quality
- Component integration and testing
- Quality assurance and validation
- Documentation and deployment preparation
- **Duration**: 2-6 hours

## 🚀 Real-World Examples

### Example 1: SaaS Application with Balanced Strategy

**Project Plan: `saas-plan.md`**
```markdown
# Multi-tenant SaaS Platform

## Overview
Build a B2B SaaS platform for project management with subscription billing.

## Core Requirements
### Multi-tenancy
- Workspace isolation
- Custom subdomains
- Data separation

### Subscription Management
- Stripe integration
- Multiple pricing tiers
- Usage-based billing

### Core Features
- Project management
- Team collaboration
- File storage (S3)
- Audit logs

## Technical Stack
- Frontend: Next.js 14 with App Router
- Backend: NestJS with GraphQL
- Database: PostgreSQL with row-level security
- Cache: Redis
- Queue: Bull for background jobs

## Wave Preferences
- Wave 1: Requirements + Architecture (Foundation teams)
- Wave 2: Database + API Design (Design teams)
- Wave 3: Frontend + Backend (Implementation teams)
- Wave 4: Integration + Testing (QA teams)

## Success Criteria
- 100% tenant isolation
- <200ms API response time
- Stripe webhook handling
- Comprehensive admin panel
```

**Command:**
```bash
claude "Load shadow-clone-prompt.md and execute with project_plan=./saas-plan.md workspace_dir=./saas-platform num_teams=5 wave_strategy=balanced wave_count=4"
```

### Example 2: CLI Tool with Dependency Strategy

**Project Plan: `cli-plan.md`**
```markdown
# Developer Productivity CLI

## Overview
Create a CLI tool that automates common development tasks.

## Commands
### init
- Initialize new projects from templates
- Support multiple languages/frameworks
- Interactive configuration

### deploy
- Deploy to various platforms (Vercel, Netlify, AWS)
- Environment management
- Rollback capability

### monitor
- Real-time log streaming
- Performance metrics
- Error tracking

## Technical Requirements
- Language: Go for performance
- Config: YAML/TOML support
- Distribution: Homebrew, npm, direct download
- Auto-updates

## Dependencies
- Core CLI framework must be built before commands
- Configuration system needed before any commands
- Testing framework required before validation

## Success Criteria
- Cross-platform compatibility
- <100ms command startup
- Comprehensive --help
- Man page generation
```

**Command:**
```bash
claude "Load shadow-clone-prompt.md and execute with project_plan=./cli-plan.md workspace_dir=./dev-cli num_teams=dynamic wave_strategy=dependency wave_count=dynamic"
```

### Example 3: Audit → Optimize Workflow for Legacy Codebase

**Step 1: Audit Plan: `audit-plan.md`**
```markdown
# Legacy Codebase Audit

## Overview
Comprehensive audit of existing Node.js application that has grown organically over 3 years.

## Audit Focus Areas
### Security Analysis (OWASP Top Ten 2021 Framework)
- A01: Broken Access Control - Authorization and privilege escalation issues
- A02: Cryptographic Failures - Weak encryption and exposed sensitive data
- A03: Injection - SQL injection, XSS, and other injection vulnerabilities
- A04: Insecure Design - Design flaws and missing threat modeling
- A05: Security Misconfiguration - Default configurations and setup issues
- A06: Vulnerable and Outdated Components - Dependency vulnerabilities (npm audit)
- A07: Authentication Failures - Session management and credential issues
- A08: Software and Data Integrity Failures - CI/CD and update security
- A09: Security Logging and Monitoring Failures - Logging and detection gaps
- A10: Server-Side Request Forgery - SSRF vulnerabilities

### Performance Analysis
- Database query optimization opportunities
- Memory leaks and resource usage
- API response time bottlenecks
- Bundle size and loading performance

### Code Quality Assessment
- Code duplication and technical debt
- Test coverage gaps
- Documentation completeness
- ESLint/Prettier compliance

### Architecture Review
- Separation of concerns
- Error handling consistency
- Logging and monitoring gaps
- Scalability limitations

## Audit Methodology
- **Phase 0**: Comprehensive workspace analysis and file cataloging
- **Professional File Review**: Complete file reading (never partial scanning)
- **Expert Assignment**: Files assigned to specialized Security Masters
- **Sweep-Based Approach**: For large codebases, systematic security sweeps

## Deliverables
- Comprehensive OWASP Top Ten compliance report with precise line numbers
- Security vulnerability report with severity ratings and context
- Performance benchmark report with optimization recommendations
- Code quality metrics and improvement roadmap
- Architecture improvement proposals with security considerations
```

**Audit Command:**
```bash
claude "Load shadow-clone-prompt.md and execute with project_plan=./audit-plan.md workspace_dir=./legacy-app project_type=audit git_strategy=safe_branch"
```

**Step 2: Optimization Plan: `optimize-plan.md`** *(Created after audit completion)*
```markdown
# Legacy Codebase Optimization

## Overview
Implement optimizations based on audit findings to improve security, performance, and maintainability.

## High Priority Fixes (Wave 1)
### Critical Security Issues (OWASP Top Ten Based)
- A06: Upgrade vulnerable dependencies (express 4.16 → 4.18, lodash 4.17.15 → 4.17.21)
- A07: Implement proper JWT token validation and session management
- A03: Add input sanitization middleware for injection prevention
- A03: Fix SQL injection vulnerabilities in user queries
- A01: Implement proper access control checks and authorization
- A02: Add proper encryption for sensitive data storage

### Performance Critical Fixes
- Add database indexes for slow queries (user_actions, analytics_events tables)
- Implement Redis caching for user sessions
- Optimize N+1 query patterns in dashboard endpoint

## Medium Priority Improvements (Wave 2)
### Code Quality Enhancements
- Consolidate duplicate user validation logic
- Refactor 500+ line controller methods
- Add TypeScript strict mode compliance
- Implement proper error handling middleware

### Testing & Documentation
- Add unit tests for authentication module (0% → 80% coverage)
- Document API endpoints with OpenAPI/Swagger
- Add integration tests for payment flow

## Low Priority Enhancements (Wave 3)
### Architecture Improvements
- Extract email service into separate module
- Implement proper logging strategy (Winston)
- Add health check endpoints
- Implement graceful shutdown handling

## Success Criteria
- All critical security vulnerabilities resolved
- API response time improved by 40%
- Test coverage increased to 75%+
- Zero ESLint errors
- Documentation coverage at 90%
```

**Optimization Command:**
```bash
claude "Load shadow-clone-prompt.md and execute with project_plan=./optimize-plan.md workspace_dir=./legacy-app project_type=optimize wave_strategy=manual wave_count=3"
```

### Example 4: Research → Plan → Execute Workflow

**Step 1: Research Plan: `research-plan.md`**
```markdown
# AI-Powered SaaS Platform Research

## Overview
Comprehensive research for building a next-generation AI-powered project management SaaS.

## Research Domains
### AI/ML Integration Research
- LLM integration patterns (OpenAI, Anthropic, local models)
- RAG implementation for project knowledge
- AI-powered task automation opportunities
- Vector database selection (Pinecone, Weaviate, Chroma)

### Modern SaaS Architecture Research  
- Multi-tenant architecture patterns
- Microservices vs modular monolith
- Event-driven architecture best practices
- Real-time collaboration technologies

### Technology Stack Research
- Frontend: React 18 vs Next.js 14 vs Svelte
- Backend: Node.js vs Go vs Python for AI integration
- Database: PostgreSQL + vector DB vs all-in-one solutions
- Infrastructure: AWS vs GCP vs Azure for AI workloads

### Market & Competitive Analysis
- Feature gap analysis vs Asana, Monday, Linear
- AI integration opportunities competitors miss
- Pricing strategy research
- User experience patterns in modern SaaS

## Research Deliverables
- Technology decision matrix with scoring
- Architecture blueprint with AI integration points
- Market positioning recommendations
- Implementation roadmap with AI milestones
```

**Research Command:**
```bash
claude "Load shadow-clone-prompt.md and research with project_plan=./research-plan.md workspace_dir=./ai-saas project_type=research wave_strategy=dependency"
```

**Step 2: Plan Based on Research: `implementation-plan.md`** *(Created after research completion)*
```markdown
# AI-Powered SaaS Implementation Plan
## Overview
Implementation plan based on comprehensive research findings.

## Architecture Decisions (From Research)
- **Frontend**: Next.js 14 with App Router for SEO and AI streaming
- **Backend**: Node.js with tRPC for type-safe AI integrations  
- **AI Stack**: OpenAI + local Llama for sensitive data
- **Vector DB**: Weaviate for project knowledge RAG
- **Database**: PostgreSQL with pgvector extension

## Implementation Phases
### Phase 1: Core Platform
- Multi-tenant authentication and workspace management
- Basic project and task CRUD operations
- Real-time collaboration infrastructure

### Phase 2: AI Integration Foundation  
- Vector database setup and knowledge ingestion
- Basic AI assistant for task suggestions
- Smart project template generation

### Phase 3: Advanced AI Features
- Intelligent task automation and assignment
- Project risk prediction and mitigation suggestions
- Natural language project queries and reporting

## Success Metrics (Research-Informed)
- 40% faster project setup vs competitors (AI templates)
- 60% reduction in manual task assignment (AI automation)
- 25% improvement in project delivery times (AI insights)
```

**Planning Command:**
```bash
claude "Load shadow-clone-prompt.md and plan with project_plan=./implementation-plan.md workspace_dir=./ai-saas project_type=new"
```

**Execution Command:**
```bash
claude "Load shadow-clone-prompt.md and execute with project_plan=./implementation-plan.md workspace_dir=./ai-saas project_type=new num_teams=6 wave_strategy=balanced wave_count=3"
```

### Example 5: Data Pipeline with Auto Strategy

**Project Plan: `pipeline-plan.md`**
```markdown
# Real-time Analytics Pipeline

## Overview
Build a data pipeline for processing e-commerce events in real-time.

## Data Sources
- Shopify webhooks
- Google Analytics 4
- Customer database
- Payment processor events

## Processing Requirements
### Ingestion
- Handle 10k events/second
- Schema validation
- Dead letter queue

### Transformation
- Customer 360 view
- Revenue attribution
- Fraud detection signals

### Storage
- Hot data: ClickHouse
- Warm data: PostgreSQL
- Cold data: S3 + Athena

## Technical Stack
- Streaming: Apache Kafka
- Processing: Apache Flink
- Orchestration: Airflow
- Monitoring: Prometheus + Grafana

## Success Criteria
- <1s end-to-end latency
- 99.9% uptime
- Exactly-once processing
- Full data lineage
```

**Command:**
```bash
claude "Load shadow-clone-prompt.md and execute with project_plan=./pipeline-plan.md workspace_dir=./analytics-pipeline num_teams=dynamic wave_strategy=auto wave_count=dynamic"
```

## 📄 Enhanced Development Tracking

### The Development Document
Located at `workspace_dir/DEVELOPMENT.md`, now includes:
- Wave-by-wave progress tracking
- Inter-team coordination logs
- Quality gate results
- Sprint objectives and outcomes

### Wave Status Monitoring
Check `workspace_dir/.waves/wave_status.md` for:
- Current active wave
- Team assignments and progress
- Dependency satisfaction status
- Next wave preparation

### Wave-Specific Coordination
Each wave directory (`workspace_dir/.waves/wave_N/`) contains:
- Team coordination files
- Shared resources and handoffs
- Wave-specific quality checks
- Progress indicators

## 🔧 Advanced Usage

## ⏸️ System Pause & Resume Management

### Understanding System Pauses

The Shadow Clone System can be paused or interrupted for various reasons:
- **User interruption** (Ctrl+C, closing terminal)
- **Claude session timeout** or rate limiting
- **System resource constraints** 
- **Network connectivity issues**
- **Intentional pause** for review or external dependencies

### 🔍 Detecting a Paused State

Check these indicators to identify if your system is paused:

```bash
# Check wave status
cat .waves/wave_status.md

# Check for incomplete waves
ls .waves/wave_*/

# Check development log
tail -20 DEVELOPMENT.md

# Check git branch status
git status
cat .waves/git_status.md
```

**Paused State Indicators:**
- Wave status shows "IN_PROGRESS" but no recent activity
- Incomplete deliverables in wave directories
- Git branch exists but recent commits missing
- DEVELOPMENT.md shows unfinished tasks

### 🔄 Resume Strategies

#### Simple Resume (Recommended)
```bash
claude "Load shadow-clone-prompt.md and resume"
# System automatically detects workspace state and continues
```

#### Resume with Workspace Specification
```bash
claude "Load shadow-clone-prompt.md and resume project with workspace_dir=./my-project"
# Useful when running from different directory
```

#### Resume with Analysis
```bash
claude "Load shadow-clone-prompt.md and analyze then resume project with workspace_dir=./my-project"
# Performs full state analysis before resuming
```

#### Resume from Specific Wave
```bash
claude "Load shadow-clone-prompt.md and resume from wave_2 with workspace_dir=./my-project"
# Skip completed waves and resume from specific point
```

### 🛠️ Recovery Scenarios

#### Scenario 1: Interrupted During Wave Execution
```bash
# Check what was in progress
cat .waves/wave_status.md

# Resume current wave
claude "Load shadow-clone-prompt.md and resume current wave"

# Or restart current wave if needed
claude "Load shadow-clone-prompt.md and restart current wave with workspace_dir=./my-project"
```

#### Scenario 2: Session Timeout Between Waves
```bash
# System can cleanly resume at wave boundaries
claude "Load shadow-clone-prompt.md and resume next wave"

# Check wave completion status first
cat .waves/wave_plan.md
```

#### Scenario 3: Corrupted or Partial State
```bash
# Analyze and repair workspace state
claude "Load shadow-clone-prompt.md and analyze workspace then repair and resume with workspace_dir=./my-project"

# If severe corruption, rollback to last good state
claude "Load shadow-clone-prompt.md and rollback to last completed wave then resume"
```

#### Scenario 4: Git Branch Conflicts During Resume
```bash
# Create new branch for resume
claude "Load shadow-clone-prompt.md and resume with git_strategy=safe_branch workspace_dir=./my-project"

# Or continue on existing branch
claude "Load shadow-clone-prompt.md and resume with git_strategy=continue workspace_dir=./my-project"
```

### 📊 State Recovery Commands

#### Check System Health Before Resume
```bash
# Comprehensive state check
claude "Load shadow-clone-prompt.md and check workspace health with workspace_dir=./my-project"

# Quick status check
claude "Load shadow-clone-prompt.md and status"
```

#### Repair Workspace Issues
```bash
# Fix missing directories or files
claude "Load shadow-clone-prompt.md and repair workspace with workspace_dir=./my-project"

# Rebuild coordination files
claude "Load shadow-clone-prompt.md and rebuild coordination files"
```

### 🔄 Multi-Instance Resume

When multiple Shadow Clone instances were running:

```bash
# Resume all instances (different terminals)
# Terminal 1:
claude "Load shadow-clone-prompt.md and resume feature instance with workspace_dir=./my-project"

# Terminal 2: 
claude "Load shadow-clone-prompt.md and resume audit instance with workspace_dir=./my-project"

# Check instance coordination
cat .waves/instance_coordination.md
```

### 🛡️ Safe Resume Practices

**Before Resuming:**
1. **Backup current state** if significant progress was made
2. **Check git status** to understand current branch state
3. **Review wave status** to identify where interruption occurred
4. **Verify workspace integrity** using health check commands

**Resume Commands:**
```bash
# Safe resume with backup
claude "Load shadow-clone-prompt.md and backup then resume with workspace_dir=./my-project"

# Resume with fresh analysis
claude "Load shadow-clone-prompt.md and fresh analysis then resume"

# Resume with modified strategy (if needed)
claude "Load shadow-clone-prompt.md and resume with wave_strategy=manual workspace_dir=./my-project"
```

### ⚠️ When NOT to Resume

Don't use resume if:
- Workspace has been manually modified significantly
- Git repository is in conflicted state
- Multiple days have passed (consider fresh start)
- Project requirements have changed substantially

Instead, use:
```bash
# Fresh start with existing work preserved
claude "Load shadow-clone-prompt.md and restart preserving existing work with workspace_dir=./my-project"
```

### Changing Wave Strategy Mid-Project

```bash
claude "Load shadow-clone-prompt.md and continue project with workspace_dir=./my-project wave_strategy=dependency for remaining waves due to integration challenges"
```

### Adding Features Mid-Project

```bash
# First, update your project plan
echo "## Additional Requirements\n### OAuth Integration\n- Google OAuth\n- GitHub OAuth" >> ./my-project/project-plan.md

# Then continue with updated plan
claude "Load shadow-clone-prompt.md and execute with project_plan=./my-project/project-plan.md workspace_dir=./my-project num_teams=6 wave_strategy=balanced"
```

### Working with Existing Codebases

**Automatic Detection (Recommended):**
```bash
claude "Load shadow-clone-prompt.md and execute with project_plan=./refactor-plan.md workspace_dir=./legacy-app"
# System will detect existing codebase and automatically create safe branch
```

**Manual Control:**
```bash
claude "Load shadow-clone-prompt.md and execute with project_plan=./refactor-plan.md workspace_dir=./legacy-app project_type=refactor git_strategy=safe_branch num_teams=4 wave_strategy=manual"
```

**Audit Existing Codebase:**
```bash
claude "Load shadow-clone-prompt.md and execute with project_type=audit git_strategy=branch"
# Creates audit branch and focuses on code analysis
```

**Add Features Safely:**
```bash
claude "Load shadow-clone-prompt.md and execute with project_plan=./new-features.md project_type=feature git_strategy=safe_branch"
# Creates feature branch with timestamp for safe development
```

## 🔄 Multi-Instance Coordination

### Running Multiple Shadow Clone Instances

**Same Workspace, Different Branches:**
```bash
# Instance 1: Feature development
claude "Load shadow-clone-prompt.md and execute with project_plan=./features.md project_type=feature git_strategy=safe_branch"

# Instance 2: Bug fixes (different terminal/session)
claude "Load shadow-clone-prompt.md and execute with project_plan=./bugfixes.md project_type=debug git_strategy=safe_branch"

# Instance 3: Code audit (different terminal/session)
claude "Load shadow-clone-prompt.md and execute with project_type=audit git_strategy=branch"
```

**Automatic Branch Management:**
- Each instance gets its own timestamped branch
- No conflicts between different Shadow Clone instances
- Branches are automatically named: `shadow-clone/[type]-[timestamp]`
- Easy to track and merge different workstreams

**Coordination Benefits:**
- **Parallel Development**: Multiple teams working on different aspects
- **Risk Isolation**: Each instance isolated on separate branches
- **Easy Integration**: Clear git history for merging completed work
- **Resource Optimization**: Distribute work across multiple instances

## 🐛 Troubleshooting

### "Wave coordination issues"
- Check `.waves/wave_status.md` for dependency problems
- Ensure teams have clear handoff protocols
- Consider switching to dependency strategy

### "Teams creating conflicts"
- Review wave assignments in `.waves/wave_plan.md`
- Check if teams need better separation
- Consider manual wave strategy for better control

### "Slow wave transitions"
- Review quality gates - may be too strict
- Check for dependency bottlenecks
- Consider balanced strategy for better flow

### "Project seems unclear"
- Your project plan might be too vague
- Add wave preferences if using manual strategy
- Include technical decisions and constraints

### "Git branch conflicts"
- Check if multiple instances are using the same branch
- Use `git_strategy=safe_branch` for automatic branch creation
- Review branch naming in `.waves/git_status.md`

### "Existing codebase safety concerns"
- Ensure `project_type=auto` for automatic safety detection
- Use `git_strategy=safe_branch` for existing codebases
- Check backup status in `.waves/safety_log.md`

### "System won't resume properly"
- Check `.waves/wave_status.md` for corruption or inconsistencies
- Use health check: `claude "Load shadow-clone-prompt.md and check workspace health"`
- Try repair command: `claude "Load shadow-clone-prompt.md and repair workspace"`
- If persistent, use fresh start: `claude "Load shadow-clone-prompt.md and restart preserving existing work"`

### "Resume creates duplicate work"
- Check if multiple instances are running simultaneously
- Review `.waves/instance_coordination.md` for conflicts
- Use specific instance resume: `claude "Load shadow-clone-prompt.md and resume [instance-type] instance"`

### "Lost progress after interruption"
- Check git commits in current branch: `git log --oneline`
- Review `.backup/` directory for preserved work
- Check individual wave directories: `ls .waves/wave_*/`
- Use recovery command: `claude "Load shadow-clone-prompt.md and recover lost progress"`

## ❓ FAQ

**Q: Which wave strategy should I use?**
A: Start with "auto" for most projects - the system will coordinate your master craftsmen optimally. Use "dependency" for projects with clear sequential steps, "balanced" for complex projects needing coordination between multiple masters, and "manual" when you have specific sprint requirements for your expert teams.

**Q: How do I control the number of agents within each team?**
A: Use the new `team_composition` parameter! Options include:
- `team_composition="auto"` (default) - System decides optimal agent count per team
- `team_composition="[3,4,2,5]"` - Exact agent count per team (Team 1: 3 agents, Team 2: 4 agents, etc.)
- `team_composition="frontend:4,backend:4,testing:2"` - Named team allocation
- `team_composition="balanced"` - Equal distribution across all teams
Example: `claude "Load shadow-clone-prompt.md and execute with num_teams=4 team_composition='[3,4,2,3]'"`

**Q: What's the difference between 2-agent and 4-agent teams?**
A: 2-agent teams (Lead + Specialist) are perfect for focused work like DevOps. 4-agent teams (Lead + Senior Dev + Junior Dev + QA) provide more parallel processing and built-in quality assurance, ideal for complex development like Frontend/Backend work. The system automatically assigns specialized roles based on team size.

**Q: How many waves should I specify?**
A: Use "dynamic" unless you have specific phases in mind. The system will optimize based on your project complexity and chosen strategy.

**Q: Can I see real-time progress during waves?**
A: Yes! Check `DEVELOPMENT.md` for overall progress and `.waves/wave_status.md` for detailed coordination between your master craftsmen teams.

**Q: What if a wave fails or gets stuck?**
A: The system has built-in quality gates and can be resumed. Check the wave status files for specific issues and use the resume command.

**Q: Can I customize wave assignments?**
A: Yes! Use manual strategy and specify wave preferences in your project plan for complete control.

**Q: How do quality gates work?**
A: Each wave has automatic validation of deliverables, dependency satisfaction checks, and integration testing before proceeding to the next wave.

**Q: How does project type detection work?**
A: The system analyzes your workspace for existing code, git history, package files, and project plan keywords to determine if you're starting new, auditing, adding features, or refactoring. It then applies appropriate safety measures and workflow optimizations.

**Q: Is it safe to use on existing codebases?**
A: Yes! The system automatically creates feature branches for existing repos and never works directly on main/master unless explicitly told to. Use `git_strategy=safe_branch` for maximum safety.

**Q: Can I run multiple Shadow Clone instances simultaneously?**
A: Absolutely! Each instance gets its own timestamped branch, so multiple teams can work on different aspects of the same project without conflicts. Perfect for parallel feature development, bug fixes, and audits.

**Q: What happens if I don't specify project_type or git_strategy?**
A: The system uses intelligent defaults - it detects your project type automatically and applies the safest git strategy for your situation. You only need to override when you want specific control.

**Q: What should I do if the system gets interrupted or paused?**
A: Use the resume commands! Start with `claude "Load shadow-clone-prompt.md and resume"` for automatic detection and resumption. The system maintains state files to track progress and can intelligently continue from where it left off.

**Q: How does the system handle session timeouts?**
A: The Shadow Clone System is designed for interruption recovery. All progress is saved in workspace files (`.waves/`, `DEVELOPMENT.md`, git commits). Simply use the resume command to continue from the last checkpoint.

**Q: Can I resume a project days or weeks later?**
A: Yes, but consider using `claude "Load shadow-clone-prompt.md and analyze then resume"` for a fresh analysis of the current state. If significant time has passed or requirements changed, you might want to start fresh while preserving existing work.

**Q: What if I manually modified files during a pause?**
A: The system will detect modifications during resume. Use `claude "Load shadow-clone-prompt.md and analyze workspace then resume"` to incorporate your changes into the continued workflow.

**Q: How does the audit→optimize workflow work?**
A: After completing an audit with `project_type=audit`, create an optimization plan based on the audit findings and run `project_type=optimize`. The system will detect the previous audit work and continue on the same branch for seamless workflow. Optimization automatically structures work by priority: critical security/performance fixes first, then code quality improvements, then architectural enhancements.

**Q: Can I run optimize without first running audit?**
A: Yes! If you have existing audit artifacts, security reports, or performance benchmarks from other tools, you can create an optimization plan that references those findings and run `project_type=optimize` directly. The system is designed to work with any existing analysis, not just Shadow Clone audits.

**Q: How does the false positive validation work?**
A: The system uses a 5-layer validation protocol: (1) Cross-tool correlation with multiple SAST tools, (2) Complete code context analysis including framework protections, (3) Business logic and access control validation, (4) Dynamic testing with proof-of-concept development, and (5) Expert consensus between multiple security masters. This achieves <10% false positive rates.

**Q: What report templates are available?**
A: The system includes standardized templates in `.shadow/templates/`: comprehensive security audit reports, individual vulnerability documentation, and false positive validation checklists. These ensure consistent, enterprise-grade deliverables across all audits.

**Q: How is audit quality assured?**
A: Every finding requires validation by multiple security masters, cross-tool correlation, business context analysis, and practical testing. The Quality Assurance Master provides final approval. We track metrics like false positive rates, validation times, and expert consensus rates to ensure continuous improvement.

**Q: How do I customize an audit without a project plan?**
A: Use natural language to specify focus areas or exclusions directly in the command. Examples: `claude "Load shadow-clone-prompt.md and execute with project_type=audit - Focus on API security and GDPR compliance"` or `claude "Load shadow-clone-prompt.md and execute with project_type=audit - Healthcare app excluding mobile security"`. The audit will adapt while maintaining comprehensive coverage of specified areas.

**Q: Do I always need a project plan file?**
A: **For audits: NO!** Audit mode is completely self-contained with standardized scope covering OWASP Top Ten, NIST SSDF, CWE, and industry compliance. Just run: `claude "Load shadow-clone-prompt.md and execute with project_type=audit"`. **For other project types:** You can either create a detailed `project-plan.md` file (recommended for complex projects) or describe your project directly in the command. For example: `claude "Load shadow-clone-prompt.md and execute - Build a todo app with React and Firebase"`. The system will automatically create a comprehensive project plan for you.

**Q: What's the difference between execution mode and project type?**
A: **Execution mode** controls whether the system actually does work (`"and execute"`) or just plans (`"and plan"`). **Project type** determines what kind of work to do (new project, audit, feature, etc.). You combine them like: `"Load shadow-clone-prompt.md and execute with project_type=audit"` (execution mode + audit project type) or `"Load shadow-clone-prompt.md and plan with project_type=feature"` (planning mode + feature project type).

### 📋 Common Mode + Project Type Combinations

**Master Craftsman Research → Plan → Execute Workflow:**
```bash
# 1. Deploy research masters to investigate domain deeply
claude "Load shadow-clone-prompt.md and research with project_type=research"

# 2. Masters create detailed plan based on research findings
claude "Load shadow-clone-prompt.md and plan with project_type=new"

# 3. Execute with master craftsmen teams
claude "Load shadow-clone-prompt.md and execute with project_type=new"
```

**Planning First, Then Executing:**
```bash
# 1. Plan an audit to see what would be analyzed
claude "Load shadow-clone-prompt.md and plan with project_type=audit"

# 2. If plan looks good, execute the audit
claude "Load shadow-clone-prompt.md and execute with project_type=audit"

# 3. After audit, plan the optimization
claude "Load shadow-clone-prompt.md and plan with project_type=optimize"

# 4. Execute the optimization
claude "Load shadow-clone-prompt.md and execute with project_type=optimize"
```

**Direct Execution (When Master Craftsmen Are Confident):**
```bash
# Execute feature development immediately with domain masters
claude "Load shadow-clone-prompt.md and execute with project_type=feature"

# Execute new project immediately with expert teams
claude "Load shadow-clone-prompt.md and execute with project_type=new"
```

## 🎉 Quick Start Template

### ⚡ Ultra-Quick Start (10 seconds) - Dynamic Mode

**No project plan file needed! Just describe what you want:**

```bash
# Simple web app
claude "Load shadow-clone-prompt.md and execute - Build a simple web application with user authentication and basic CRUD operations using React, Node.js/Express, and PostgreSQL"

# CLI tool
claude "Load shadow-clone-prompt.md and execute - Create a CLI tool for managing Docker containers with commands to start, stop, list, and monitor containers"

# API service
claude "Load shadow-clone-prompt.md and execute - Build a REST API for a bookstore with book management, user reviews, and order processing using Python FastAPI"

# Data processing
claude "Load shadow-clone-prompt.md and execute - Create a data pipeline that reads CSV files, processes sales data, and generates analytics reports"
```

### 🚀 Traditional Quick Start (30 seconds) - File Mode

1. **Create a simple project plan:**
```bash
cat > project-plan.md << 'EOF'
# My Project

## Overview
Build a simple web application with user authentication and basic CRUD operations.

## Core Requirements
- User registration and login
- Dashboard with user data
- Basic data management (create, read, update, delete)

## Technical Stack
- Frontend: React
- Backend: Node.js/Express
- Database: PostgreSQL
EOF
```

2. **Launch Shadow Clone (uses all smart defaults):**
```bash
claude "Load shadow-clone-prompt.md and execute"
```

### ⚙️ Customized Quick Start

1. **Create detailed project plan:**
```bash
cat > project-plan.md << 'EOF'
# My Advanced Project

## Overview
[Detailed description of what you're building]

## Core Requirements
### Feature Category 1
- Specific requirement
- Another requirement

### Feature Category 2
- Detailed specifications

## Technical Stack
- Frontend: [Your choice]
- Backend: [Your choice]
- Database: [Your choice]

## Wave Preferences (for manual strategy)
- Wave 1: Requirements + Architecture
- Wave 2: Design + Planning
- Wave 3: Implementation
- Wave 4: Testing + Deployment

## Success Criteria
- [What defines completion]
- [Quality metrics]
EOF
```

2. **Launch with custom settings:**
```bash
claude "Load shadow-clone-prompt.md and execute with workspace_dir=./my-project num_teams=6 wave_strategy=balanced"
```

3. **Monitor progress:**
```bash
# Overall progress
cat ./my-project/DEVELOPMENT.md

# Wave-specific status
cat ./my-project/.waves/wave_status.md

# Current wave coordination
ls ./my-project/.waves/
```

## 📚 Summary

The enhanced Shadow Clone System transforms complex projects into manageable waves of focused work with sophisticated coordination mechanisms and production-ready safety features. Like the legendary Japanese sword-making process, each agent is a master craftsman capable of handling entire projects independently, but together they create something far superior through coordinated excellence.

Key benefits of the master craftsman system:
- **🗾 Master Craftsman Philosophy**: Each agent brings expert-level capability in their domain
- **🔍 Smart Detection**: Automatically identifies project type and applies optimal strategies
- **🛡️ Production Safety**: Safe branching and backup creation for existing codebases
- **🔄 Multi-Instance Support**: Run multiple master teams simultaneously on separate branches
- **🌊 Structured Sprints**: Clear wave objectives and deliverables worthy of master-level work
- **⚙️ Flexible Strategies**: Choose the execution approach that fits your project and masters
- **✅ Quality Assurance**: Built-in validation and peer review between masters
- **📊 Progress Visibility**: Real-time tracking and coordination monitoring
- **🔄 Interruption Recovery**: Robust resumption capabilities with workspace integrity

### 🚀 Ready for Any Project Type:
- **New Projects**: Full workspace setup and greenfield development
- **Feature Addition**: Safe branching for adding to existing codebases
- **Code Audits**: Analysis and documentation without code changes, with OWASP Top Ten compliance for web applications
- **Refactoring**: Structure improvements with safety measures
- **Bug Fixes**: Isolated debugging on separate branches
- **Optimization**: Performance, security, and quality improvements following audits
- **Security Audits**: Comprehensive OWASP Top Ten assessment framework integration

Remember: **The project plan file is your blueprint** - invest time in making it detailed and clear. The system will automatically apply the safest approach for your situation!

Start building today:

**🚀 Ultra-Simple (automatic detection and safety):**
```bash
claude "Load shadow-clone-prompt.md and execute"
```

**🛡️ Safe for Existing Codebases:**
```bash
claude "Load shadow-clone-prompt.md and execute with project_type=feature git_strategy=safe_branch"
```

**⚙️ Full Control:**
```bash
claude "Load shadow-clone-prompt.md and execute with project_plan=[your-plan-file] workspace_dir=[project-dir] num_teams=[number|dynamic] wave_strategy=[auto|manual|dependency|balanced] wave_count=[number|dynamic] project_type=[auto|new|audit|feature|refactor|debug|optimize] git_strategy=[auto|safe_branch|branch|main|none]"
```