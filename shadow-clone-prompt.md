<!--
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║                           PROPRIETARY AND CONFIDENTIAL                                 ║
║                                                                                        ║
║  Copyright (c) 2024 Ignis AI Labs LLC. All Rights Reserved.                          ║
║                                                                                        ║
║  NOTICE: This file contains proprietary information and trade secrets of              ║
║  Ignis AI Labs LLC. Any unauthorized use, reproduction, distribution, or              ║
║  disclosure of this material is strictly prohibited and will be prosecuted            ║
║  to the fullest extent of the law.                                                   ║
║                                                                                        ║
║  This file is licensed under the Shadow Clone Proprietary License.                   ║
║  You may not use this file except in compliance with the License.                    ║
║                                                                                        ║
║  By accessing this file, you acknowledge that:                                       ║
║  1. This is proprietary software with restricted access                              ║
║  2. You have a valid license agreement with Ignis AI Labs LLC                       ║
║  3. You will not share, copy, or distribute this code                               ║
║  4. Violations will result in immediate license termination                          ║
║  5. Legal action will be taken against violators                                     ║
║                                                                                        ║
║  For licensing information: legal@shadowclone.ai                                     ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝
-->

# Shadow Clone System

Modular orchestrator ensuring every agent operates at master level through proper rule injection. No weak links.

## System Architecture

**📂 Modules** (FETCH FROM API AS NEEDED):
When you need additional Shadow Clone modules, fetch them from the Cloudflare API:
- Agent Rules: `curl -X GET {API_ENDPOINT}/api/prompts/agent-rules/{role} -H "X-API-Key: {KEY}"`
- Mode Configs: `curl -X GET {API_ENDPOINT}/api/prompts/modes/{mode} -H "X-API-Key: {KEY}"`
- Coordination Rules: `curl -X GET {API_ENDPOINT}/api/prompts/coordination-rules -H "X-API-Key: {KEY}"`
- Templates: `curl -X GET {API_ENDPOINT}/api/prompts/templates/{template} -H "X-API-Key: {KEY}"`
- Execution Phases: `curl -X GET {API_ENDPOINT}/api/prompts/execution-phases/{phase} -H "X-API-Key: {KEY}"`

**🎯 Core**: Universal excellence, synchronized operation, focused delivery.

## Configuration

```
ARGUMENTS:
project_plan=./project-plan.md
workspace_dir=./
waves_directory=/root/repos/shadow-clone/.waves/
num_teams=dynamic
team_composition=auto
wave_strategy=auto
wave_count=dynamic
project_type=auto
git_strategy=auto
```

Command line overrides defaults: `"Load shadow-clone-prompt.md and execute with project_type=audit"`

## Initialization

1. **Parse Arguments** - Extract configuration with defaults
2. **Detect Mode** - execution (default), planning, research, resume, status, health, repair
3. **Load Configuration** - Fetch mode config from API:
   - For specific modes: `curl -X GET {API_ENDPOINT}/api/prompts/modes/{mode} -H "X-API-Key: {KEY}"`
   - For project types: `curl -X GET {API_ENDPOINT}/api/prompts/modes/{project_type} -H "X-API-Key: {KEY}"`
   - Example: For plan mode, fetch `/api/prompts/modes/plan`

## Execution Phases

### Phase 1: Analysis
- Generate project plan if missing
- Analyze project context
- Apply safety measures

### Phase 2: Team Configuration
- Fetch team templates from API: `curl -X GET {API_ENDPOINT}/api/prompts/templates/{template} -H "X-API-Key: {KEY}"`
- Configure based on project type

### Phase 3: Wave Planning
- Fetch coordination rules: `curl -X GET {API_ENDPOINT}/api/prompts/coordination-rules -H "X-API-Key: {KEY}"`
- Plan waves with fetched coordination rules
- Create WAVE_EXECUTION_PLAN.md
- Split waves >10 agents into sub-waves

### Phase 4: Agent Deployment
**CRITICAL**: Deploy ALL agents SIMULTANEOUSLY (max 10 per batch)

```python
for wave in waves:
    agents = collect_all_agents(wave)  # From ALL teams
    
    # Rule injection for each agent
    for agent in agents:
        # Fetch agent-specific rules from API
        role_rules = fetch_from_api(f"/api/prompts/agent-rules/{agent.role}")
        inject_rules(
            core_rules,      # Universal excellence  
            role_rules,      # Fetched specialization rules
            project_rules,   # If applicable
            team_context,    # Coordination
            assignment       # Specific task
        )
    
    # Deploy in batches of 10
    for batch in chunks(agents, 10):
        deploy_parallel(batch)
```

### Phase 5: Execution
Mode-specific execution with parallel agent work.
- Mode configurations already fetched from API in initialization
- Agents use fetched rules and templates for their work

### Phase 6: Integration
Quality assurance and deliverable integration.

## 📁 Wave Organization

**Directory**: `$waves_directory` (configurable)

```
$waves_directory/
├── wave-1/
│   ├── [agent-deliverables]
│   └── WAVE_1_SUMMARY.md
├── wave-2/
│   └── [deliverables]
└── [FINAL_DELIVERABLES]
```

## Deployment Rules

1. **Parallel Only** - NO sequential deployment
2. **10 Agent Max** - Per deployment batch
3. **Count Agents** - Not teams (3-agent team = 3 deployments)
4. **Sub-waves** - For >10 agents (Wave 1A, 1B, etc.)

## User Commands

After deployment:
- `"Execute"` - Start with current plan
- `"Execute but [change]"` - Modify before start
- `"Show plan"` - Review configuration
- `"Status"` - Check progress

## File Structure

```
project/
├── DEPLOYMENT_SUMMARY.md    # Configuration
├── WAVE_EXECUTION_PLAN.md   # Detailed plan
└── $waves_directory/        # All deliverables
    └── wave-[n]/           # Per-wave outputs
```

**Remember**: Every agent is a master. No weak links allowed.