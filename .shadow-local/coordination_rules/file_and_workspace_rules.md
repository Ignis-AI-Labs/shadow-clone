# File and Workspace Rules

## Workspace Structure

```
project-root/
├── .shadow/                    # Shadow Clone configuration
│   ├── coordination_rules/     # System rules (this directory)
│   ├── templates/              # Document templates
│   └── testing/                # Test configurations
├── .waves/                     # Wave execution data
│   ├── wave-0/                 # Planning phase (mandatory)
│   │   ├── project_analysis.md
│   │   ├── requirements.md
│   │   ├── architecture_plan.md
│   │   ├── team_formation.md
│   │   ├── wave_plan.md
│   │   └── setup_complete.md
│   ├── wave-1/                 # Implementation waves
│   ├── wave-2/
│   └── constitution.md         # Project memory/context
└── [project files]             # Actual code and assets
```

## File Placement Rules

### Strict Rules
1. **Source code NEVER goes in .waves/** - Only planning and documentation
2. **Wave-0 is mandatory** for projects requiring planning
3. **Constitution.md** lives at `.waves/constitution.md`
4. **Each wave has its own directory** under `.waves/`

### File Types by Location
- **.waves/**: Planning docs, analysis, team formation, progress tracking
- **Project root**: Source code, configs, assets, tests
- **.shadow/**: System configuration and templates

## File Reservation System

### How It Works
1. **Check** - Before editing, check if file is reserved
2. **Reserve** - Claim the file with your agent name
3. **Edit** - Make your changes
4. **Release** - Remove reservation when done

### Reservation Format
```markdown
# In .waves/active_wave/file_reservations.md
- `path/to/file.ext` - Reserved by AgentName at HH:MM
```

### Conflict Resolution
- First reservation wins
- Urgent changes can request handoff
- Lead agent can override reservations

## Git Operations

### The Golden Rule
**NO commits during wave execution**

### Commit Strategy
1. Complete ALL wave work first
2. Run final quality checks
3. Create single atomic commit
4. Include all changes from the wave

### Commit Message Format
```
[wave-X] Brief description of changes

- Key change 1
- Key change 2
- Key change 3

Implements: [requirement IDs]
```

### Forbidden Operations During Waves
- `git commit` (except final commit)
- `git push` (until wave complete)
- `git reset --hard` (data loss risk)
- Branch switching (context loss)

## Document Coordination

### Sequential Updates
- Only ONE agent updates a document at a time
- Use file reservation system
- Announce major documentation changes

### Constitution Updates
- Update after each wave completion
- Include wave summary and outcomes
- Maintain chronological history
- Record key decisions and rationale

### Cross-References
- Use relative paths for internal links
- Maintain link integrity during moves
- Update references when renaming files