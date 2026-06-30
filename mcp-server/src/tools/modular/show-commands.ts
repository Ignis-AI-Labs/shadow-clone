import { z } from 'zod';
import { showCommandsSchema } from '../../schemas/tool-schemas.js';
import type { ToolDefinition } from './types.js';

export const showCommandsDefinition: ToolDefinition = {
  name: 'show_commands',
  description: 'Returns a QUICK REFERENCE of all Shadow Clone commands - provides a cheat sheet of available tools and their usage (NO code execution)',
  inputSchema: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        description: 'Filter by category (optional)',
        enum: ['orchestration', 'teams', 'rapid', 'documentation', 'all'],
      },
    },
    required: [],
  },
};

export async function showCommands(
  args: z.infer<typeof showCommandsSchema>
): Promise<string> {
  const category = args?.category || 'all';

  return `<!--
IMPORTANT: THIS IS A PROMPT ENGINEERING MACRO
================================================
This is a REFERENCE GUIDE for Shadow Clone commands.
These commands deliver instructions for YOU to follow.
Shadow Clone does NOT execute code - YOU do.
================================================
-->

# Shadow Clone Command Reference

## Remember: These are PROMPT MACROS, not executable commands
Each tool delivers professional methodologies for YOU (the AI) to implement.

${category === 'all' || category === 'orchestration' ? `
## Orchestration Commands

### shadow_clone_orchestrate
- Modes: plan, feature, debug, optimize, refactor, audit, research
- Example: Use mode="feature" with projectDescription="Add OAuth login"
- Returns: Complete methodology for orchestrating virtual agent teams

### shadow_clone_plan
- Create comprehensive project plans
- Example: projectVision="Build scalable SaaS platform"
- Returns: Planning templates and methodologies
` : ''}

${category === 'all' || category === 'teams' ? `
## Team Deployment Commands

### deploy_agent_team
- Teams: frontend, backend, database, testing, documentation, devops, mobile, security
- Example: teamType="backend" task="Create REST API"
- Returns: Team simulation patterns and workflows

### deploy_specialist_agent
- Specialists: react_expert, api_designer, database_architect, test_engineer, etc.
- Example: specialization="security_auditor" task="Audit auth flow"
- Returns: Expert-level methodologies for specific tasks
` : ''}

${category === 'all' || category === 'rapid' ? `
## Quick Modular Tools (No Full Orchestration!)

### quick_fix ⚡ - Instant Fix Methodology
- FAST: Single bug/issue resolution without teams
- Types: bug, style, logic, performance, security
- Example: issueType="bug" description="Null pointer in user service"
- Returns: Direct fix approach, no orchestration

### deploy_specialist_agent 🎯 - Single Expert
- FOCUSED: One specialist, one task, no coordination
- Experts: react_expert, api_designer, security_auditor, etc.
- Example: specialization="react_expert" task="Fix render loop"
- Returns: Expert methodology for specific problem

### code_review_team 🔍 - Quick Review
- TARGETED: Review specific files without full audit
- Types: security, performance, quality, architecture
- Example: reviewType="security" files=["login.js"]
- Returns: Focused review checklist

### generate_tests ✅ - Test Creation Only
- SPECIFIC: Add tests to existing code
- Types: unit, integration, e2e, performance, security
- Example: testType="unit" targetFiles=["utils.js"]
- Returns: Test writing patterns

### execute_single_wave 🌊 - One Phase Only
- SINGLE: Just research OR planning OR implementation
- No multi-wave coordination needed
- Example: waveType="research" scope="OAuth best practices"
- Returns: Focused methodology for one phase
` : ''}

${category === 'all' || category === 'documentation' ? `
## Documentation & Architecture Commands

### create_documentation
- Types: api, user_guide, developer, architecture, inline
- Example: docType="api" scope="REST endpoints"
- Returns: Documentation creation patterns

### architecture_consultant
- Types: design_review, pattern_recommendation, scalability_analysis, migration_planning
- Example: consultationType="design_review" context="Monolithic app"
- Returns: Architecture analysis methodologies
` : ''}

## Quick Tips
1. These tools teach YOU professional methodologies
2. YOU implement the actual code following these patterns
3. Each tool is a "power-up" for your capabilities
4. Combine tools for comprehensive solutions
5. No authentication needed - Shadow Clone is free and open-source

## Getting Started
1. show_commands - Display this reference (you're here!)
2. shadow_clone_plan - Start planning your project
3. Execute the methodologies provided

Remember: Shadow Clone makes YOU more capable by providing battle-tested methodologies!`;
}
