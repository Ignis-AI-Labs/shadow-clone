# Shadow Clone Mode Execution Flowchart & Validation Framework

## Universal Flow (All Modes)

```
┌─────────────────────┐
│  User Command       │
│  "Execute [mode]"   │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ System Initialize   │ ✓ Check: All components verified
│ - Load rules        │ ✓ Check: .shadow-local exists
│ - Verify git branch │ ✓ Check: NOT on main/master
│ - Create wave-0     │ ✓ Check: .waves/wave-0/ created
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Team Configuration  │ ✓ Check: Record Keeper in EVERY team
│ - Load templates    │ ✓ Check: Teams match mode needs
│ - Assign agents     │ ✓ Check: No team > 10 agents
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Wave-0 Execution    │ ✓ Check: Planning only, NO implementation
│ - Scope analysis    │ ✓ Check: Dynamic team roster created
│ - Team selection    │ ✓ Check: Wave count determined
│ - Create plan       │ ✓ Check: All work in .waves/wave-0/
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Wave 1-N Execution  │ ✓ Check: All work in .waves/wave-N/
│ - Deploy teams      │ ✓ Check: File reservations used
│ - Execute tasks     │ ✓ Check: Reports to Record Keeper and Record Keeper finalizes each wave
│ - Quality gates     │ ✓ Check: Tests pass before proceeding
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Final Wave          │ ✓ Check: Record Keeper LAST to complete
│ - Consolidation     │ ✓ Check: Mode-specific deliverables
│ - Validation        │ ✓ Check: MODE_COMPLETION_SUMMARY.md
│ - Record Keeper     │ ✓ Check: CONSTITUTION.md updated
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Git Commit          │ ✓ Check: Single atomic commit
│ - On dev branch     │ ✓ Check: Commit message descriptive
│ - All changes       │ ✓ Check: No uncommitted files
└─────────────────────┘
```

## Mode-Specific Validation Checklists

### PLANNING MODE
```
Wave-0 (Discovery):
├── ✓ project_vision.md exists
├── ✓ scope_assessment.md exists
├── ✓ initial_requirements.md exists
├── ✓ planning_strategy.md exists
└── ✓ wave_plan.md exists

Dynamic Waves (1-N):
├── ✓ Teams match Wave-0 recommendations
├── ✓ Each wave builds on previous
└── ✓ NO implementation code

Final Wave:
├── ✓ MASTER_PLAN.md created
├── ✓ Uses MASTER_PLAN_TEMPLATE.md
├── ✓ Contains all 8 required sections
└── ✓ Record Keeper creates MODE_COMPLETION_SUMMARY.md
```

### FEATURE MODE
```
Wave-0 (Analysis):
├── ✓ Feature breakdown created
├── ✓ Dynamic team roster based on feature type
├── ✓ Security threat model exists
├── ✓ Wave allocation matches complexity
└── ✓ All assessments in .waves/wave-0/

Dynamic Waves (1-N):
├── ✓ Code in appropriate directories (/src, etc.)
├── ✓ Unit tests >80% coverage
├── ✓ Integration points documented
├── ✓ Performance metrics recorded
└── ✓ Security considerations addressed

Final Wave:
├── ✓ End-to-end testing complete
├── ✓ Security clearance obtained
├── ✓ Documentation complete
├── ✓ Deployment package ready
└── ✓ Record Keeper last to finish
```

### AUDIT MODE
```
Wave-0 (Scope Discovery):
├── ✓ Audit Assessment Matrix created
├── ✓ Domain Priority Map (1-7 ranking)
├── ✓ Compliance Requirements identified
├── ✓ Tool configuration complete
└── ✓ Wave count based on domains selected

Dynamic Waves (1-N):
├── ✓ Focus on priority domains first
├── ✓ Framework compliance checked
├── ✓ Tool scans completed
├── ✓ 5-Layer validation applied
└── ✓ False positive rate <10%

Final Wave:
├── ✓ SECURITY_AUDIT_REPORT.md created
├── ✓ Uses SECURITY_AUDIT_REPORT_TEMPLATE.md
├── ✓ VULNERABILITY_REGISTER.md exists
├── ✓ COMPLIANCE_MATRIX.md exists
└── ✓ NO major compliance issues skipped
```

### DEBUG MODE
```
Wave-0 (Issue Analysis):
├── ✓ Issue reproduced in isolation
├── ✓ Severity classification done
├── ✓ Impact analysis complete
├── ✓ Debug strategy created
└── ✓ Team matches issue type

Dynamic Waves (1-N):
├── ✓ Root cause identified (not symptoms)
├── ✓ Fix implemented with tests
├── ✓ Regression tests added
├── ✓ Performance impact measured
└── ✓ Security assessment done

Final Wave:
├── ✓ DEBUG_REPORT.md created
├── ✓ FIX_VALIDATION.md exists
├── ✓ All tests passing
├── ✓ No side effects introduced
└── ✓ Rollback plan documented
```

### OPTIMIZE MODE
```
Wave-0 (Performance Analysis):
├── ✓ Baseline metrics established
├── ✓ Bottlenecks identified with data
├── ✓ Dynamic team roster for bottlenecks
├── ✓ ROI-based prioritization
└── ✓ Measurable targets set

Dynamic Waves (1-N):
├── ✓ Before/after metrics for each change
├── ✓ Cost impact documented
├── ✓ No functionality broken
├── ✓ Rollback procedures ready
└── ✓ Incremental validation done

Final Wave:
├── ✓ OPTIMIZATION_REPORT.md created
├── ✓ MONITORING_SETUP.md exists
├── ✓ Performance targets achieved
├── ✓ Cost reduction OR performance gain
└── ✓ Load tests prove improvements
```

### REFACTOR MODE
```
Wave-0 (Code Analysis):
├── ✓ Code quality metrics gathered
├── ✓ Dynamic team based on issues
├── ✓ Test coverage >80% baseline
├── ✓ Target architecture defined
└── ✓ Refactoring roadmap created

Dynamic Waves (1-N):
├── ✓ Tests stay green throughout
├── ✓ NO functional changes
├── ✓ Architectural decisions documented
├── ✓ Code metrics improving
└── ✓ Performance not degraded

Final Wave:
├── ✓ REFACTORING_REPORT.md created
├── ✓ ARCHITECTURE_GUIDE.md exists
├── ✓ All original tests pass
├── ✓ Technical debt reduced
└── ✓ Zero functional changes
```

### RESEARCH MODE
```
Wave-0 (Research Definition):
├── ✓ Research questions defined
├── ✓ Evaluation criteria set
├── ✓ Dynamic team based on topics
├── ✓ Methodology selected
└── ✓ Success criteria clear

Dynamic Waves (1-N):
├── ✓ Evidence-based findings
├── ✓ POCs created and tested
├── ✓ Cost calculations done
├── ✓ Risk mitigation planned
└── ✓ Multiple options evaluated

Final Wave:
├── ✓ RESEARCH_FINDINGS.md created
├── ✓ DECISION_MATRIX.md exists
├── ✓ IMPLEMENTATION_ROADMAP.md ready
├── ✓ At least 3 options evaluated
└── ✓ POCs in repository
```

## Critical Validation Points (All Modes)

### 1. Workspace Discipline
```
MUST PASS:
✗ Files created outside .waves/ = FAIL
✗ Files modified in other waves = FAIL
✗ Work in project root = FAIL
✗ Missing file reservations = FAIL
```

### 2. Record Keeper Protocol
```
MUST PASS:
✗ Record Keeper missing from team = FAIL
✗ Record Keeper completes before others = FAIL
✗ No checkpoint files = FAIL
✗ CONSTITUTION.md not updated = FAIL
✗ No MODE_COMPLETION_SUMMARY.md = FAIL
```

### 3. Git Workflow
```
MUST PASS:
✗ Working on main/master = FAIL
✗ Commits during wave = FAIL
✗ Multiple commits per wave = FAIL
✗ No dev branch created = FAIL
```

### 4. Quality Standards
```
MUST PASS:
✗ Tests failing = FAIL
✗ Security vulnerabilities = FAIL
✗ No documentation = FAIL
✗ Code coverage <80% = FAIL (where applicable)
```

## Test Execution Framework

### Pre-Test Setup
```bash
# 1. Verify clean environment
git status # Must be clean
git branch # Must not be on main

# 2. Check .shadow-local structure
ls -la .shadow-local/
# Must have: agent_rules/, mode_configs/, templates/, shadow-clone-prompt.md

# 3. Verify no .waves directory
ls .waves/ 2>/dev/null # Should not exist
```

### During Test Monitoring
```bash
# Monitor wave creation
watch -n 1 'ls -la .waves/'

# Check Record Keeper status
cat .waves/wave-*/RECORD_KEEPER_STATUS.md

# Verify workspace discipline
find . -name "*.md" -newer .waves/wave-0/WAVE_STATUS.md | grep -v ".waves/"
# Should return nothing (all new files in .waves/)
```

### Post-Test Validation
```bash
# 1. Check all deliverables
find .waves/ -name "*.md" | sort

# 2. Verify Record Keeper was last
tail .waves/wave-*/RECORD_KEEPER_LOG.md

# 3. Check git status
git status # Should show single commit

# 4. Validate mode-specific outputs
ls .waves/wave-*/MASTER_PLAN.md # For planning mode
ls .waves/wave-*/SECURITY_AUDIT_REPORT.md # For audit mode
# etc.
```

## Automated Test Script Structure
```python
def validate_mode_execution(mode_name):
    """Validate complete mode execution against flowchart"""
    
    # Phase 1: System Initialization
    assert verify_system_initialized()
    assert verify_git_branch() != "main"
    assert os.path.exists(".waves/wave-0/")
    
    # Phase 2: Team Configuration
    teams = get_deployed_teams()
    assert all(has_record_keeper(team) for team in teams)
    assert all(len(team.agents) <= 10 for team in teams)
    
    # Phase 3: Wave-0 Validation
    assert validate_wave_0_outputs(mode_name)
    assert verify_no_implementation_in_wave_0()
    
    # Phase 4: Dynamic Waves
    for wave_num in range(1, get_total_waves()):
        assert validate_wave_outputs(wave_num, mode_name)
        assert verify_workspace_discipline(wave_num)
        
    # Phase 5: Final Wave
    assert verify_mode_deliverables(mode_name)
    assert verify_record_keeper_last()
    assert os.path.exists("MODE_COMPLETION_SUMMARY.md")
    
    # Phase 6: Git Validation
    assert verify_single_commit()
    assert verify_dev_branch()
    
    return True
```

---
*This flowchart and validation framework ensures consistent, testable execution across all Shadow Clone modes.*