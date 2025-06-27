<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
See LICENSE-PROPRIETARY.md for full terms.
-->

# Shadow Clone System Constants

## 🎯 Critical System Paths

### Waves Directory (CONFIGURABLE)
**DEFAULT PATH**: `/root/repos/shadow-clone/.waves/`
**PARAMETER**: `$waves_directory`

- **Purpose**: Central location for ALL agent deliverables across ALL modes
- **Structure**: Organized by waves (wave-1/, wave-2/, etc.)
- **Configuration**: Set via `waves_directory` argument
- **Override**: `"Load shadow-clone-prompt.md and execute with waves_directory=/custom/path/.waves/"`

### Directory Structure
```
$waves_directory/
├── wave-1/              # First wave deliverables
├── wave-2/              # Second wave deliverables
├── wave-3/              # Third wave deliverables
├── wave-1a/             # Sub-waves for >10 agents
├── wave-1b/             # Additional sub-wave
└── [final-deliverables] # Consolidated master documents
```

## 🔒 System Constraints

### Agent Deployment Limits
- **Maximum per wave**: 10 agents
- **Sub-wave splitting**: Automatic for waves >10 agents
- **Parallel deployment**: MANDATORY (not sequential)

### License Limits
- **Total licenses**: 2,000
- **Ignis Elite NFT**: 777
- **Pioneer**: 500
- **Builder**: 500
- **Reserve**: 223

## 📝 Naming Conventions

### Wave Folders
- Standard waves: `wave-1`, `wave-2`, `wave-3`, etc.
- Sub-waves: `wave-1a`, `wave-1b`, `wave-2a`, etc.
- Special folders: `scans/`, `templates/`, `archive/`

### Deliverable Files
- Summaries: `WAVE_[X]_SUMMARY.md`
- Convergence: `WAVE_[X]_CONVERGENCE.md`
- Finals: `[MODE]_FINAL_REPORT.md`

## ⚠️ Critical Rules

1. **Path Consistency**: Always use `/root/repos/shadow-clone/.waves/`
2. **No Relative Paths**: Never use `./waves` or `../waves`
3. **No Variables**: Never use `[workspace_dir]` or similar
4. **Wave Isolation**: Each wave works in its own folder
5. **No Cross-Wave Access**: Agents cannot modify other waves' folders

This constants file ensures system-wide consistency for the Shadow Clone orchestration system.