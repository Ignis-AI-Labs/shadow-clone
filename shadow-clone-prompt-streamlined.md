# Shadow Clone System

Modular orchestrator ensuring every agent operates at master level through proper rule injection. No weak links.

## System Architecture

**📂 Modules** (READ ONLY - ALL EXIST):
- `.shadow/agent_rules/` - Behavioral DNA
- `.shadow/coordination_rules/` - Wave coordination  
- `.shadow/mode_configs/` - Project methodologies
- `.shadow/templates/` - Standards
- `.shadow/execution_phases/` - Phase implementations

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
3. **Load Configuration** - `{workspace_dir}/.shadow/mode_configs/shadow-clone-{project_type}.md`

## Execution Phases

### Phase 1: Analysis
- Generate project plan if missing
- Analyze project context
- Apply safety measures

### Phase 2: Team Configuration
- Load team templates
- Configure based on project type

### Phase 3: Wave Planning
- Plan waves with coordination rules
- Create WAVE_EXECUTION_PLAN.md
- Split waves >10 agents into sub-waves

### Phase 4: Agent Deployment
**CRITICAL**: Deploy ALL agents SIMULTANEOUSLY (max 10 per batch)

```python
for wave in waves:
    agents = collect_all_agents(wave)  # From ALL teams
    
    # Rule injection for each agent
    for agent in agents:
        inject_rules(
            core_rules,      # Universal excellence
            role_rules,      # Specialization
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
├── .shadow/                 # System modules (READ ONLY)
└── $waves_directory/        # All deliverables
    └── wave-[n]/           # Per-wave outputs
```

**Remember**: Every agent is a master. No weak links allowed.