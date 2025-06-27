import * as vscode from 'vscode';

export async function showHelpCommand() {
    const helpContent = `# Shadow Clone Command Reference

## 🚀 Quick Start
Shadow Clone commands tell Claude to fetch AI agent orchestration prompts from a secure API and execute them with your specified parameters.

## 📖 Command Structure
Each command has three parts:
1. **Fetch prompt from API** - Retrieves the secure Shadow Clone orchestration system
2. **Mode configuration** (optional) - Adds specialized agent behaviors
3. **Execution parameters** - Your project-specific settings

## 🎯 Available Modes

### Deploy Project (Full Deployment)
**What it does:** Deploys a complete team of AI agents to build your entire project
**When to use:** Starting a new project or major feature
**Example usage:** Building a full-stack app, creating a new service, major refactoring

### Debug Issues 
**What it does:** Specialized debugging agents analyze and fix problems
**When to use:** When you have bugs, errors, or issues to resolve
**Example usage:** Fixing test failures, resolving runtime errors, debugging complex issues

### Build Feature
**What it does:** Feature-focused agents that add new functionality
**When to use:** Adding specific features to existing code
**Example usage:** Adding authentication, implementing search, creating new endpoints

### Refactor Code
**What it does:** Agents that improve code structure without changing behavior
**When to use:** Code needs cleanup, better organization, or modernization
**Example usage:** Extracting components, improving patterns, updating dependencies

### Optimize Performance
**What it does:** Performance-focused agents that improve speed and efficiency
**When to use:** App is slow, using too much memory, or needs optimization
**Example usage:** Database query optimization, frontend rendering, algorithm improvements

### Security Audit
**What it does:** Security specialist agents review code for vulnerabilities
**When to use:** Before deployment, after adding sensitive features
**Example usage:** OWASP compliance, penetration testing, security hardening

### Research Mode
**What it does:** Agents analyze code without making changes
**When to use:** Understanding a codebase, planning changes, documentation
**Example usage:** Codebase analysis, architecture review, feasibility studies

### Resume Session
**What it does:** Continues from where agents previously stopped
**When to use:** Returning to an incomplete project
**Example usage:** Continuing after interruption, picking up next day

### Plan Mode
**What it does:** Creates comprehensive project plans without writing code
**When to use:** Before starting implementation, for complex projects needing design
**Example usage:** Architecture planning, API design, database schema planning

## 📝 Parameters Explained

Shadow Clone uses a simple key=value syntax for parameters. You chain multiple parameters with spaces:
\`\`\`
Load shadow-clone-prompt.md and execute with param1=value1 param2=value2 param3=value3
\`\`\`

### Core Parameters

**project_plan=./project-plan.md**
- Points to your requirements file
- Can be any markdown file with project details
- Example: \`project_plan=./specs/new-feature.md\`

**waves_directory=./.waves/**
- Where agents save their work
- Each wave creates a subfolder
- Example: \`waves_directory=./agent-outputs/\`

**mode=<mode_name>**
- Selects specialized agent behavior
- Options: feature, debug, refactor, optimize, audit, research
- Example: \`mode=debug\`

### Advanced Parameters

**wave_count=<number|dynamic>**
- Number of agent waves to run
- Use "dynamic" for automatic determination
- Example: \`wave_count=3\` or \`wave_count=dynamic\`

**num_teams=<1-3>**
- Number of parallel agent teams
- More teams = faster but more complex
- Example: \`num_teams=2\`

**team_composition=<type>**
- Specialization of agent teams
- Options: fullstack, frontend, backend, ai-specialists, architects
- Example: \`team_composition=fullstack\`

**git_strategy=<strategy>**
- How agents handle version control
- Options: feature-branch, direct, none
- Example: \`git_strategy=feature-branch\`

**enable_testing=<true|false>**
- Auto-generate test suites
- Default: true
- Example: \`enable_testing=true\`

**enable_docs=<true|false>**
- Auto-generate documentation
- Default: true
- Example: \`enable_docs=true\`

**max_agents_per_wave=<1-10>**
- Concurrent agents per wave
- Default: 10
- Example: \`max_agents_per_wave=5\`

### Parameter Examples

**Minimal Setup:**
\`\`\`
Load shadow-clone-prompt.md and execute with waves_directory=./.waves/
\`\`\`

**Standard Project:**
\`\`\`
Load shadow-clone-prompt.md and execute with project_plan=./project-plan.md waves_directory=./.waves/
\`\`\`

**Debug Session:**
\`\`\`
Load shadow-clone-prompt.md and execute with mode=debug waves_directory=./.waves/ execution_timeout=15
\`\`\`

**Enterprise Build:**
\`\`\`
Load shadow-clone-prompt.md and execute with project_plan=./requirements.md waves_directory=./.waves/ num_teams=3 team_composition=fullstack git_strategy=feature-branch enable_testing=true enable_docs=true
\`\`\`

### Using the Parameter Builder

Click "⚙️ Build Parameters" in the Macros view for an interactive parameter builder that:
- Shows all available parameters
- Provides descriptions and defaults
- Validates your inputs
- Builds the complete parameter string

## 💡 Tips for Success

1. **Create a project plan**: Even a simple markdown file with bullet points helps agents understand your goals

2. **Use the right mode**: Each mode optimizes agents for specific tasks

3. **Check .waves directory**: This is where all agent outputs are saved

4. **Be specific**: The more detail in your project plan, the better the results

5. **Iterate**: You can run multiple waves to refine and improve

## 🔧 Example Workflows

### Starting a New Project:
1. Create project-plan.md with your requirements
2. Use "Deploy Project" macro
3. Watch agents build in .waves directory
4. Review and iterate as needed

### Fixing Bugs:
1. Use "Debug Issues" macro
2. Describe the bug when prompted
3. Agents will analyze and propose fixes
4. Review changes before applying

### Adding Features:
1. Create feature-spec.md with requirements
2. Use "Build Feature" macro
3. Point to your spec file
4. Agents implement the feature

## ❓ Common Questions

**Q: Where do agents save their work?**
A: In the waves_directory (default: ./.waves/)

**Q: Can I edit the commands before running?**
A: Yes! Commands are injected but not executed - edit as needed

**Q: What if I don't have a project plan?**
A: Agents will ask questions, but a plan gives better results

**Q: How many agents run at once?**
A: Up to 10 agents per wave for optimal coordination

**Q: Is my code secure?**
A: All prompts are served from secure API, your code stays local

## 🛠️ Advanced Usage

### Custom Parameters:
You can add custom parameters like:
- num_teams=3 (number of agent teams)
- team_composition=fullstack (agent specialties)
- git_strategy=feature-branch (git workflow)

### Multiple Waves:
Run sequential waves for complex projects:
1. Wave 1: Architecture and planning
2. Wave 2: Implementation
3. Wave 3: Testing and polish

Need more help? Visit the Shadow Clone documentation or run another command!`;

    // Create and show help document
    const doc = await vscode.workspace.openTextDocument({
        content: helpContent,
        language: 'markdown'
    });
    
    await vscode.window.showTextDocument(doc, {
        preview: true,
        viewColumn: vscode.ViewColumn.Beside
    });
}

// Quick reference panel
export async function showQuickReferenceCommand() {
    const quickRef = await vscode.window.showQuickPick([
        {
            label: '$(question) What do the parameters mean?',
            detail: 'project_plan: Your requirements file | waves_directory: Where agents save work | mode: Type of agents'
        },
        {
            label: '$(folder-opened) Where are outputs saved?',
            detail: 'In .waves/ directory: wave-1/, wave-2/, wave-3/, and [final-deliverables]/'
        },
        {
            label: '$(rocket) How do I start a new project?',
            detail: '1. Create project-plan.md 2. Use Deploy macro 3. Check .waves/ for results'
        },
        {
            label: '$(bug) How do I fix bugs?',
            detail: 'Use Debug macro - agents will analyze and fix issues'
        },
        {
            label: '$(shield) Is this secure?',
            detail: 'Yes - prompts from secure API, your code stays local, no data leaves your machine'
        },
        {
            label: '$(book) Show full documentation',
            detail: 'Open complete Shadow Clone reference guide'
        }
    ], {
        placeHolder: 'Shadow Clone Quick Help - Select a topic'
    });

    if (quickRef?.label.includes('Show full documentation')) {
        vscode.commands.executeCommand('shadowClone.showHelp');
    }
}