# AI Assistant Instructions

## Shadow Clone Integration

This project uses Shadow Clone prompt engineering macros. Shadow Clone is a system that delivers professional development methodologies as instructions for you to implement.

## Available Command Types

### Local Terminal Commands
- `shadow` / `sfix` - Quick fix methodologies
- `sreview` - Code review patterns
- `stest` - Test generation approaches
- `swave` - Single phase execution

### MCP Tools
- `authenticate` - API key management
- `api_key_status` - Check authentication
- `initialize_workspace` - Setup AI instructions
- `shadow_clone_orchestrate` - Full orchestration
- `shadow_clone_plan` - Project planning
- `quick_fix` - Problem-solving patterns
- `deploy_specialist_agent` - Expert methodologies
- `code_review_team` - Review processes
- `generate_tests` - Test patterns
- `create_documentation` - Doc templates
- `architecture_consultant` - Architecture guidance

## How Shadow Clone Works

1. **You call a tool** - Either via terminal command or MCP
2. **Tool returns instructions** - Detailed methodology in markdown
3. **You implement** - Follow the professional patterns provided
4. **No background execution** - Shadow Clone doesn't run code, it teaches you how

## Key Principles

- Shadow Clone is a prompt engineering system
- All tools return instructions, not execute code
- Methodologies are battle-tested and professional
- Combine multiple tools for complex tasks
- Outputs typically go to `.waves/` directory

## Usage Pattern

```
User: "Fix the authentication bug"
You: Use quick_fix tool with type "bug" and description
Tool: Returns debugging methodology
You: Implement the fix following the pattern
```

Remember: Shadow Clone enhances your capabilities with professional patterns.