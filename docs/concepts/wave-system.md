# The Wave System

Shadow Clone organizes complex work into **waves** - sequential phases that build on each other to produce complete solutions.

## Why Waves?

Complex projects fail when tackled all at once. The wave system:
- Breaks large tasks into manageable chunks
- Ensures each phase is complete before moving on
- Creates checkpoints for review and adjustment
- Maintains context across the entire project

## Wave Structure

### Wave 0: Planning

Every project starts with Wave 0, which handles:
- Requirements analysis
- Technical research
- Architecture decisions
- Creating the master plan

**Output:**
```
.waves/wave-0/
├── PROJECT_FOUNDATION.md    # Requirements and constraints
├── TECHNICAL_RESEARCH.md    # Technology decisions
└── MASTER_PLAN.md           # Implementation blueprint
```

Wave 0 produces no code - only planning documents.

### Wave 1+: Implementation

After planning, implementation waves execute the work:

**Wave 1** typically handles:
- Project setup and scaffolding
- Core infrastructure
- Base components

**Wave 2** usually covers:
- Feature implementation
- Business logic
- API integration

**Wave 3+** focuses on:
- Testing
- Documentation
- Polish and optimization

**Output per wave:**
```
.waves/wave-N/
├── WAVE_PLAN.md        # What this wave will do
├── [implementation]    # Actual code/files
└── WAVE_COMPLETE.md    # Summary of what was done
```

## The Record Keeper

Each project has a **Record Keeper** agent that:
- Coordinates all other agents
- Maintains project context across waves
- Tracks progress and dependencies
- Creates wave summaries
- Manages the `.waves/` directory structure

Think of the Record Keeper as the project manager that ensures continuity.

## Wave Execution Flow

```
┌──────────────────────────────────────────────────────────┐
│                      Wave 0: Planning                     │
│  ┌─────────────┐   ┌─────────────┐   ┌──────────────┐   │
│  │ Requirements│──▶│  Research   │──▶│ Master Plan  │   │
│  └─────────────┘   └─────────────┘   └──────────────┘   │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│                   Wave 1: Foundation                      │
│  ┌─────────────┐   ┌─────────────┐   ┌──────────────┐   │
│  │   Setup     │──▶│    Core     │──▶│   Complete   │   │
│  └─────────────┘   └─────────────┘   └──────────────┘   │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│                 Wave 2: Implementation                    │
│  ┌─────────────┐   ┌─────────────┐   ┌──────────────┐   │
│  │  Features   │──▶│   Logic     │──▶│   Complete   │   │
│  └─────────────┘   └─────────────┘   └──────────────┘   │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│                    Wave 3: Polish                         │
│  ┌─────────────┐   ┌─────────────┐   ┌──────────────┐   │
│  │   Tests     │──▶│    Docs     │──▶│   Complete   │   │
│  └─────────────┘   └─────────────┘   └──────────────┘   │
└──────────────────────────────────────────────────────────┘
```

## Agent Deployment Per Wave

Each wave deploys agents in parallel (up to 10 per wave):

```
Wave 1 Example:
┌────────────────────────────────────────────┐
│              Record Keeper                  │
│         (coordinates everything)            │
└─────────────────┬──────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    ▼             ▼             ▼
┌────────┐   ┌────────┐   ┌────────┐
│Frontend│   │Backend │   │Database│
│  Spec  │   │  Spec  │   │  Spec  │
└────────┘   └────────┘   └────────┘
```

## Wave Status Tracking

The `WAVE_STATUS.md` file tracks overall progress:

```markdown
# Wave Execution Status

## Project: User Authentication System

## Completed Waves
- Wave 0: Planning ✅ (3 docs created)
- Wave 1: Foundation ✅ (12 files created)
- Wave 2: Implementation ✅ (28 files created)

## Current Wave
- Wave 3: Testing (in progress)

## Pending
- Wave 4: Documentation

## Total Progress: 75%
```

## Customizing Waves

### Specify Wave Directory

```
shadow_clone_orchestrate(
  mode: "feature",
  projectDescription: "...",
  wavesDirectory: "./my-custom-location/.waves/"
)
```

### Limit Agents Per Wave

```
shadow_clone_orchestrate(
  mode: "feature",
  projectDescription: "...",
  maxAgentsPerWave: 5  # Default is 10
)
```

## When to Use Fewer Waves

Not every task needs multiple waves:

| Task Complexity | Recommended Approach |
|-----------------|---------------------|
| Quick bug fix | `quick_fix` - no waves |
| Small feature | Single wave via `deploy_agent_team` |
| Medium feature | `shadow_clone_orchestrate` - 2-3 waves |
| Large project | Full orchestration - 3+ waves |

## Resuming Interrupted Work

If execution stops mid-project:
1. Check `.waves/WAVE_STATUS.md` for current state
2. Reference completed waves in your next prompt
3. Claude will continue from where it left off

```
Continue the user auth implementation from .waves/.
Wave 0 and Wave 1 are complete. Start Wave 2 implementation.
```

---

## Related Topics

- [Agent Roles](agent-roles.md) - Understanding specialist agents
- [Prompt Engineering](prompt-engineering.md) - How Shadow Clone enhances Claude
- [Output Examples](../examples/output-examples.md) - Sample wave outputs
