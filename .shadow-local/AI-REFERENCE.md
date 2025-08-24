# Shadow Clone AI Reference Card

## 🤖 For AI Assistants: How to Use Shadow Clone

You have access to Shadow Clone - a prompt engineering macro system that provides professional methodologies. These commands deliver instructions for you to follow, not execute code in the background.

### Core Understanding
- **What it is**: A prompt engineering delivery system
- **What it does**: Provides expert methodologies and patterns
- **What you do**: Read the instructions and implement them
- **Key point**: Shadow Clone gives you the knowledge, YOU do the work

## 📋 Available Commands

### Quick Problem Solving
```bash
shadow fix <type> "description"
# or shorter:
sfix <type> "description"
```
- Types: `bug`, `performance`, `security`, `logic`, `style`
- Returns: Step-by-step fix methodology
- Example: `sfix bug "null pointer in login function"`

### Expert Consultation
```bash
shadow specialist <type> "task"
```
- Types: `react`, `api`, `database`, `test`, `perf`, `security`, `review`, `docs`
- Returns: Expert-level patterns and approaches
- Example: `shadow specialist react "optimize useState hooks"`

### Code Review
```bash
shadow review <type> [files]
# or shorter:
sreview <type> [files]
```
- Types: `security`, `performance`, `quality`, `architecture`
- Returns: Review checklist and methodology
- Example: `sreview security auth.js api.js`

### Test Generation
```bash
shadow test <type> [files]
# or shorter:
stest <type> [files]
```
- Types: `unit`, `integration`, `e2e`, `performance`
- Returns: Test creation patterns
- Example: `stest unit utils.js`

### Single Phase Execution
```bash
shadow wave <type> "scope"
# or shorter:
swave <type> "scope"
```
- Types: `research`, `planning`, `implementation`, `testing`, `documentation`
- Returns: Focused methodology for one phase
- Example: `swave research "OAuth implementation best practices"`

### Documentation Creation
```bash
shadow doc <type> "scope"
```
- Types: `api`, `user_guide`, `developer`, `architecture`
- Returns: Documentation templates and patterns
- Example: `shadow doc api "REST endpoints"`

### Architecture Consultation
```bash
shadow arch <type> "context"
```
- Types: `design_review`, `pattern_recommendation`, `scalability_analysis`, `migration_planning`
- Returns: Architecture guidance
- Example: `shadow arch design_review "current monolith architecture"`

### Show All Commands
```bash
shadow status        # Show system status
shadow commands      # List all available commands
```

## 🎯 How to Use These Commands

1. **Run the command** to get the methodology
2. **Read the instructions** carefully
3. **Implement the pattern** in your code
4. **Follow the steps** provided
5. **Apply the expertise** to the specific context

## 💡 Example Workflow

```bash
# User asks: "Fix the memory leak in our app"

# Step 1: Get the methodology
$ sfix performance "memory leak in data processing"

# Step 2: Receive professional pattern
# (Shadow Clone returns detailed methodology)

# Step 3: Implement the fix following the pattern
# - Profile the bottleneck
# - Optimize algorithms
# - Add proper cleanup
# - Verify with tests

# Step 4: Confirm completion
"I've applied the Shadow Clone performance fix methodology to resolve the memory leak."
```

## 🔑 Key Principles

1. **Shadow Clone provides knowledge, not execution**
2. **You implement the methodologies**
3. **Each command returns expert patterns**
4. **Combine multiple commands for complex tasks**
5. **The instructions are battle-tested and professional**

## 📊 Command Quick Reference

| Need | Command | Example |
|------|---------|---------|
| Fix a bug | `sfix bug "description"` | `sfix bug "login error"` |
| Get expert help | `shadow specialist type "task"` | `shadow specialist react "hooks"` |
| Review code | `sreview type files` | `sreview security auth.js` |
| Generate tests | `stest type files` | `stest unit utils.js` |
| Research | `swave research "topic"` | `swave research "WebRTC"` |
| Create docs | `shadow doc type "scope"` | `shadow doc api "endpoints"` |

## 🚀 Advanced Usage

### Chaining Commands
```bash
# First get review methodology
sreview security auth.js

# Then get fix methodology
sfix security "vulnerabilities found"

# Finally generate tests
stest security auth.js
```

### Context-Aware Usage
Always provide specific context in descriptions:
- ❌ `sfix bug "error"`
- ✅ `sfix bug "null pointer in UserService.login() when email is empty"`

## 🛡️ Important Notes

- **Creator Mode Active**: No authentication needed on this system
- **Local Execution**: These commands work offline
- **Professional Patterns**: Based on industry best practices
- **AI-Agnostic**: Works with any AI that can run commands

## 📝 For Workspace Integration

Add this to your project's AI instruction files:
- `CLAUDE.md`
- `.github/copilot-instructions.md`
- `.ai/instructions.md`
- `AI-CONTEXT.md`

---

**Remember**: Shadow Clone enhances your capabilities by providing professional methodologies. Run the commands, follow the patterns, deliver excellent results.