# Shadow Clone User Guide

Welcome to Shadow Clone - a prompt engineering macro system that transforms AI assistants into expert development teams. This guide will help you understand how to use Shadow Clone to its full potential.

## 🎯 What Shadow Clone Does

Shadow Clone delivers **professional methodologies** to AI assistants. When you ask your AI to use Shadow Clone commands, it receives detailed instructions on how to solve problems using industry best practices. The AI then implements these methodologies to deliver high-quality solutions.

**Key Point**: Shadow Clone doesn't execute code in the background - it teaches the AI HOW to solve problems professionally.

## 🚀 Quick Start

### Basic Usage Pattern
1. **You** identify what you need (fix a bug, write tests, review code)
2. **You** tell the AI which Shadow Clone command to use
3. **Shadow Clone** provides professional methodology to the AI
4. **The AI** implements the solution following the methodology

### Example Conversations

```
You: "Use shadow fix to debug the login function that's returning null"
AI: [Uses quick_fix tool, receives debugging methodology, fixes the bug]

You: "Run shadow review on the auth.js file for security issues"
AI: [Uses code_review_team tool, receives security review checklist, reviews code]

You: "Generate unit tests for the utils.js file"
AI: [Uses generate_tests tool, receives test patterns, creates tests]
```

## 📚 Complete Command Reference

### 🔧 Quick Problem Solving

**Command**: `shadow fix <type> "description"` or `sfix <type> "description"`

**Types**:
- `bug` - Software bugs and errors
- `performance` - Speed and efficiency issues  
- `security` - Security vulnerabilities
- `logic` - Logic errors and flow problems
- `style` - Code style and formatting

**Example**: 
```
"Use sfix bug to fix the null pointer in the login function"
"Apply shadow fix performance to optimize the data processing loop"
```

### 👨‍💻 Expert Consultation

**Command**: `shadow specialist <type> "task"`

**Types**:
- `react` - React.js expertise
- `api` - API design and REST patterns
- `database` - Database architecture
- `test` - Testing strategies
- `perf` - Performance optimization
- `security` - Security best practices
- `review` - Code review expertise
- `docs` - Documentation writing

**Example**:
```
"Get help from shadow specialist react to optimize our useState hooks"
"Use shadow specialist database to design the user authentication schema"
```

### 🔍 Code Review

**Command**: `shadow review <type> [files]` or `sreview <type> [files]`

**Types**:
- `security` - Security vulnerability review
- `performance` - Performance bottleneck analysis
- `quality` - Code quality and maintainability
- `architecture` - Architectural pattern review

**Example**:
```
"Run sreview security on auth.js and api.js"
"Perform shadow review architecture on the entire src folder"
```

### 🧪 Test Generation

**Command**: `shadow test <type> [files]` or `stest <type> [files]`

**Types**:
- `unit` - Unit test creation
- `integration` - Integration test patterns
- `e2e` - End-to-end test scenarios
- `performance` - Performance test suites

**Example**:
```
"Generate stest unit for the helper functions"
"Create shadow test e2e for the checkout flow"
```

### 🌊 Single Phase Work

**Command**: `shadow wave <type> "scope"` or `swave <type> "scope"`

**Types**:
- `research` - Research and discovery phase
- `planning` - Planning and architecture phase
- `implementation` - Code implementation phase
- `testing` - Testing and validation phase
- `documentation` - Documentation phase

**Example**:
```
"Run swave research on OAuth implementation best practices"
"Execute shadow wave planning for the new feature architecture"
```

### 📖 Documentation

**Command**: `shadow doc <type> "scope"`

**Types**:
- `api` - API documentation
- `user_guide` - User guides and tutorials
- `developer` - Developer documentation
- `architecture` - System architecture docs

**Example**:
```
"Create shadow doc api for our REST endpoints"
"Generate shadow doc user_guide for the dashboard features"
```

### 🏗️ Architecture Consultation

**Command**: `shadow arch <type> "context"`

**Types**:
- `design_review` - Review current architecture
- `pattern_recommendation` - Get pattern suggestions
- `scalability_analysis` - Analyze scaling needs
- `migration_planning` - Plan system migrations

**Example**:
```
"Use shadow arch design_review on our microservices setup"
"Get shadow arch pattern_recommendation for state management"
```

### 🎭 Full Project Orchestration

**Command**: `shadow orchestrate <mode> "project description"`

**Modes**:
- `plan` - Create comprehensive project plan
- `feature` - Implement complete features
- `debug` - Debug complex issues
- `optimize` - Optimize entire systems
- `refactor` - Refactor codebases
- `audit` - Security audit
- `research` - Research solutions

**Example**:
```
"Use shadow orchestrate feature to build a complete user authentication system"
"Run shadow orchestrate optimize on the entire application"
```

## 💡 Intermediate Usage

### Combining Commands

You can combine multiple Shadow Clone commands for comprehensive solutions:

```
1. "First, use shadow orchestrate plan to design the feature"
2. "Now use swave implementation to build it"
3. "Run stest unit to create tests"
4. "Finally, use sreview quality to review everything"
```

### Working with Teams

Deploy entire teams of specialized agents:

```
"Deploy a frontend team to redesign the dashboard"
"Get a backend team to optimize our API endpoints"
"Have a security team audit our authentication system"
```

### Iterative Development

Use Shadow Clone iteratively:

```
1. Start with research: "swave research on best practices"
2. Plan the approach: "shadow orchestrate plan for implementation"
3. Implement: "Use quick_fix to implement each component"
4. Test: "Generate tests with stest unit"
5. Review: "sreview quality on the implementation"
```

## 🚀 Advanced Usage

### Full Project Development

For complete projects, use orchestration:

```
"Use shadow orchestrate feature to build a complete e-commerce checkout system with cart management, payment processing, order confirmation, and email notifications"
```

The AI will receive comprehensive methodologies for:
- Architecture design
- Component structure
- Implementation patterns
- Testing strategies
- Documentation approaches

### Complex Debugging

For difficult bugs, combine multiple approaches:

```
1. "Use shadow orchestrate debug to analyze the memory leak"
2. "Deploy a specialist performance agent to profile the code"
3. "Use sfix performance to implement the solution"
```

### System-Wide Optimization

Optimize entire applications:

```
"Run shadow orchestrate optimize with focus on:
- Frontend bundle size reduction
- API response time improvement
- Database query optimization
- Caching strategy implementation"
```

### Migration Projects

Handle complex migrations:

```
"Use shadow arch migration_planning to migrate from MongoDB to PostgreSQL"
"Deploy a database team to handle the migration implementation"
```

## 🎯 Pro Tips

### 1. Be Specific
The more specific your request, the better the methodology:
- ❌ "Fix the bug"
- ✅ "Use sfix bug to fix the null pointer exception in the login function when users have special characters in passwords"

### 2. Use the Right Tool
Each tool is optimized for specific tasks:
- Quick fixes → `sfix` for rapid solutions
- Complex projects → `shadow orchestrate` for comprehensive approach
- Expert help → `shadow specialist` for deep expertise

### 3. Layer Your Approach
Start broad, then get specific:
1. Research the problem
2. Plan the solution
3. Implement with specialized tools
4. Test thoroughly
5. Review for quality

### 4. Leverage Teams
For large tasks, deploy teams:
```
"Deploy a frontend team, backend team, and database team to implement the new feature"
```

### 5. Check Outputs
Shadow Clone outputs typically go to `.waves/` directory for orchestration tasks.

## 📋 Command Cheat Sheet

| Need | Command | Example |
|------|---------|---------|
| Fix a bug | `sfix bug "description"` | `sfix bug "null pointer in login"` |
| Review code | `sreview <type> [files]` | `sreview security auth.js` |
| Generate tests | `stest <type> [files]` | `stest unit utils.js` |
| Get expert help | `shadow specialist <type>` | `shadow specialist react "optimize hooks"` |
| Plan project | `shadow orchestrate plan` | `shadow orchestrate plan "user system"` |
| Create docs | `shadow doc <type>` | `shadow doc api "REST endpoints"` |

## 🔐 API Key Setup

If you haven't set up your API key yet:

1. **Get your key**: Visit https://dashboard.ignislabs.ai
2. **Set it up**: Tell the AI to use the `authenticate` tool with your key
3. **Verify**: Use `api_key_status` tool to check it's working

## 🎉 Creator Mode

If you're the Shadow Clone creator, you have privileged access:
- No API key needed
- All features unlocked
- Unlimited usage
- Special debug tools

## 💬 Getting Help

- **Check status**: Ask AI to use `shadow status`
- **List commands**: Ask AI to use `shadow commands`
- **Check version**: Ask AI to use `check_for_updates` tool
- **Initialize workspace**: Ask AI to use `initialize_workspace` tool

## 🎓 Learning Path

### Beginner
1. Start with `sfix` for simple bug fixes
2. Use `sreview` to review your code
3. Generate tests with `stest`

### Intermediate
1. Use `shadow specialist` for expert help
2. Combine multiple tools for complex tasks
3. Use `swave` for focused work phases

### Advanced
1. Master `shadow orchestrate` for full projects
2. Deploy specialized teams
3. Handle system-wide optimizations
4. Manage complex migrations

## 🚀 Example Project Flow

Here's how to build a complete feature:

```
1. "Use shadow orchestrate plan to design a user authentication system"
2. "Deploy a backend team to implement the API"
3. "Deploy a frontend team to build the UI"
4. "Use shadow specialist security to review the implementation"
5. "Generate tests with stest integration"
6. "Create documentation with shadow doc api"
7. "Run sreview security for final validation"
```

## Remember

- **Shadow Clone provides methodologies** - The AI implements them
- **Be specific** in your requests for better results
- **Combine tools** for comprehensive solutions
- **Check .waves/** for orchestration outputs
- **Use the right tool** for each task

Now you're ready to transform your AI into a professional development team with Shadow Clone!

---

*Shadow Clone - Turning AI into Expert Development Teams*