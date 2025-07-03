<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
See LICENSE-PROPRIETARY.md for full terms.
-->

# Mode Validation Rules - Ensuring Protocol Compliance

## Purpose
Enforce that every Shadow Clone mode follows ALL required protocols without exception.

## Core Protocol Requirements (ALL Modes)

### 1. Phase Execution Validation
```python
def validate_phase_execution(current_mode, phases_executed):
    """
    EVERY mode MUST execute ALL phases in exact order
    """
    REQUIRED_PHASES = [
        "phase1_analysis",      # MANDATORY: Safety & initialization
        "phase2_team_config",   # MANDATORY: Team setup
        "phase3_wave_planning", # MANDATORY: Wave strategy
        "phase4_deployment",    # MANDATORY: Agent deployment  
        "phase5_execution",     # MANDATORY: Mode-specific work
        "phase6_integration",   # MANDATORY: Integration & quality
        "phase7_quality"        # MANDATORY: Final quality & commit
    ]
    
    # Verify all phases present
    if phases_executed != REQUIRED_PHASES:
        raise ModeViolation(
            f"Mode {current_mode} violated phase execution order. "
            f"Expected: {REQUIRED_PHASES}, Got: {phases_executed}"
        )
```

### 2. Mandatory Function Call Validation
```python
MANDATORY_FUNCTION_CALLS = {
    "phase1": [
        "initialize_system()",          # Load all system files
        "verify_constitution_exists()",  # Check for context
        "determine_git_strategy()",      # Set git approach
        "apply_safety_measures()",       # Backup & protect
        "create_wave_0_directory()"      # Initialize waves
    ],
    "phase2": [
        "assign_record_keeper()",        # CRITICAL: Context preservation
        "load_mode_configuration()",     # Mode-specific setup
        "configure_teams()",             # Team assignment
        "validate_team_composition()"    # Ensure proper teams
    ],
    "phase3": [
        "plan_wave_execution()",         # Wave strategy
        "enforce_wave_0_first()",        # Wave-0 mandatory
        "allocate_file_reservations()",  # Prevent conflicts
        "setup_convergence_points()"     # Coordination points
    ],
    "phase4": [
        "deploy_all_agents_parallel()",  # Parallel deployment
        "inject_all_rules()",           # Complete rule injection
        "verify_agent_compliance()",     # Pre-execution check
        "start_constitution_monitoring()" # Record Keeper active
    ],
    "phase5": [
        # Mode-specific execution
        "execute_mode_specific_work()",
        "maintain_quality_standards()",
        "update_constitution_progress()",
        "respect_file_reservations()"
    ],
    "phase6": [
        "integrate_all_deliverables()",
        "run_quality_validation()",
        "prepare_final_handoff()",
        "update_constitution_summary()"
    ],
    "phase7": [
        "run_final_quality_audit()",
        "verify_all_waves_complete()",
        "execute_final_commit_protocol()", # Single commit here
        "generate_completion_report()"
    ]
}
```

### 3. Wave-0 Enforcement Validation
```python
def validate_wave_0_compliance(mode, wave_0_path):
    """
    Wave-0 is MANDATORY for ALL modes
    """
    # Core files required for EVERY mode
    MANDATORY_WAVE_0_FILES = [
        "project_analysis.md",
        "requirements.md",
        "architecture_plan.md",
        "team_formation.md",
        "wave_plan.md",
        "risk_assessment.md",
        "setup_complete.md"
    ]
    
    # Check constitution
    if not exists(f"{wave_0_path}/../CONSTITUTION.md"):
        raise ModeViolation(f"Mode {mode} failed to create CONSTITUTION.md")
    
    # Check all mandatory files
    for file in MANDATORY_WAVE_0_FILES:
        if not exists(f"{wave_0_path}/{file}"):
            raise ModeViolation(f"Mode {mode} missing wave-0 file: {file}")
    
    # Check mode-specific extras
    mode_extras = get_mode_specific_wave_0_files(mode)
    for file in mode_extras:
        if not exists(f"{wave_0_path}/{file}"):
            raise ModeViolation(f"Mode {mode} missing required file: {file}")
```

### 4. Git Protocol Enforcement
```python
def validate_git_protocol_compliance(mode, git_operations_log):
    """
    Enforce NO commits during waves, single commit at end
    """
    # Check for forbidden operations during waves
    for wave in ["wave-0", "wave-1", "wave-2", "wave-3", "wave-4"]:
        wave_ops = git_operations_log.get(wave, [])
        forbidden = ["git commit", "git push", "git merge", "git tag"]
        
        for op in wave_ops:
            if any(f in op for f in forbidden):
                raise ModeViolation(
                    f"Mode {mode} attempted '{op}' during {wave}. "
                    f"Commits only allowed after final wave!"
                )
    
    # Verify final commit exists
    final_ops = git_operations_log.get("phase7", [])
    if "execute_final_commit_protocol" not in final_ops:
        raise ModeViolation(f"Mode {mode} failed to execute final commit")
```

## Mode-Specific Validation Rules

### Audit Mode
```yaml
audit_mode_validation:
  required_wave_0_files:
    - audit_scope.md
    - vulnerability_analysis.md
    - security_frameworks.md
  required_teams:
    - auth_security_team (min 3 agents)
    - data_security_team (min 3 agents)
    - infrastructure_team (min 3 agents)
  required_functions:
    - load_security_frameworks()
    - initialize_vulnerability_scanners()
    - prepare_compliance_checklists()
    - generate_audit_report()
  minimum_waves: 3
```

### Debug Mode
```yaml
debug_mode_validation:
  required_wave_0_files:
    - issue_analysis.md
    - root_cause_analysis.md
    - debug_strategy.md
  required_teams:
    - diagnostic_team (min 2 agents)
    - fix_team (min 2 agents)
  required_functions:
    - analyze_error_patterns()
    - setup_debug_environment()
    - identify_root_cause()
    - implement_fix()
    - verify_fix()
  minimum_waves: 2
```

### Feature Mode  
```yaml
feature_mode_validation:
  required_wave_0_files:
    - feature_analysis.md
    - impact_assessment.md
    - security_review.md
  required_teams:
    - design_team (min 2 agents)
    - implementation_team (min 3 agents)
    - testing_team (min 2 agents)
  required_functions:
    - analyze_feature_requirements()
    - design_feature_architecture()
    - implement_feature()
    - write_tests()
    - document_feature()
  minimum_waves: 3
```

### Optimize Mode
```yaml
optimize_mode_validation:
  required_wave_0_files:
    - performance_baseline.md
    - bottleneck_analysis.md
    - optimization_strategy.md
  required_teams:
    - analysis_team (min 2 agents)
    - optimization_team (min 2 agents)
  required_functions:
    - establish_performance_baseline()
    - profile_application()
    - identify_bottlenecks()
    - implement_optimizations()
    - verify_improvements()
  minimum_waves: 2
```

### Refactor Mode
```yaml
refactor_mode_validation:
  required_wave_0_files:
    - code_analysis.md
    - refactor_plan.md
    - test_coverage.md
  required_teams:
    - analysis_team (min 2 agents)
    - refactor_team (min 3 agents)
    - testing_team (min 2 agents)
  required_functions:
    - analyze_code_structure()
    - identify_refactor_targets()
    - ensure_test_coverage()
    - execute_refactoring()
    - validate_behavior_unchanged()
  minimum_waves: 2
```

### Research Mode
```yaml
research_mode_validation:
  required_wave_0_files:
    - research_questions.md
    - methodology.md
    - expected_outcomes.md
  required_teams:
    - research_team (min 2 agents)
  required_functions:
    - define_research_scope()
    - gather_information()
    - analyze_findings()
    - synthesize_conclusions()
    - create_recommendations()
  minimum_waves: 1
```

### Plan Mode
```yaml
plan_mode_validation:
  required_wave_0_files:
    - MASTER_PLAN.md       # Central planning document
    - stakeholder_analysis.md
    - resource_planning.md
  required_teams:
    - planning_team (min 2 agents)
  required_functions:
    - create_master_plan_framework()
    - analyze_stakeholders()
    - define_milestones()
    - allocate_resources()
    - create_risk_mitigation_plan()
  minimum_waves: 1
```

## Runtime Validation Engine

### Continuous Mode Validation
```python
class ModeValidator:
    """
    Real-time validation during mode execution
    """
    
    def __init__(self, mode_name):
        self.mode = mode_name
        self.violations = []
        self.phase_tracker = []
        self.function_tracker = set()
        self.git_operations = []
        
    def validate_phase_transition(self, from_phase, to_phase):
        """Ensure phases execute in correct order"""
        expected_next = self.get_next_phase(from_phase)
        if to_phase != expected_next:
            self.record_violation(
                f"Invalid phase transition: {from_phase} -> {to_phase}"
            )
            
    def validate_function_call(self, phase, function_name):
        """Track and validate function calls"""
        self.function_tracker.add(f"{phase}:{function_name}")
        
        # Check if function is allowed in this phase
        if function_name not in MANDATORY_FUNCTION_CALLS.get(phase, []):
            if not self.is_mode_specific_function(function_name):
                self.record_warning(
                    f"Unexpected function {function_name} in {phase}"
                )
                
    def validate_git_operation(self, operation, phase):
        """Enforce git protocol"""
        self.git_operations.append((phase, operation))
        
        # No commits until phase7
        if phase != "phase7" and any(cmd in operation for cmd in ["commit", "push"]):
            self.record_violation(
                f"Git operation '{operation}' not allowed in {phase}"
            )
            
    def validate_file_creation(self, file_path, phase):
        """Ensure files created in correct locations"""
        if phase == "phase1" and "wave-0" in file_path:
            # Wave-0 files OK in phase1
            pass
        elif ".waves/" in file_path and phase not in ["phase5", "phase6"]:
            self.record_warning(
                f"File {file_path} created in unexpected phase {phase}"
            )
            
    def final_validation(self):
        """Run final validation checks"""
        # Verify all mandatory functions called
        for phase, functions in MANDATORY_FUNCTION_CALLS.items():
            for func in functions:
                if f"{phase}:{func}" not in self.function_tracker:
                    self.record_violation(
                        f"Mandatory function {func} not called in {phase}"
                    )
                    
        # Verify mode-specific requirements
        self.validate_mode_specific_requirements()
        
        return len(self.violations) == 0
```

## Validation Integration Points

### 1. Shadow Clone Prompt Integration
The main orchestrator MUST load these validation rules:
```python
# In shadow-clone-prompt.md initialization
validation_rules = load_module(".shadow/coordination_rules/mode_validation_rules.md")
mode_validator = ModeValidator(detected_mode)
```

### 2. Phase Transition Hooks
Each phase transition MUST validate:
```python
# Before transitioning phases
mode_validator.validate_phase_transition(current_phase, next_phase)
if mode_validator.has_violations():
    abort_execution("Mode validation failed")
```

### 3. Agent Deployment Validation
Agents MUST be aware of mode requirements:
```python
# During agent creation
agent.inject_mode_requirements(mode_validation_rules[current_mode])
```

## Enforcement Mechanisms

### Hard Failures (Abort Execution)
- Missing mandatory phases
- Wrong phase execution order  
- Commits during wave execution
- Missing wave-0 files
- No Record Keeper assigned
- Constitution not created/updated

### Warnings (Log but Continue)
- Extra functions called (if beneficial)
- Additional files created (if helpful)
- Extra teams deployed (if adds value)

### Quality Gates
Each mode must pass quality gates:
- Wave-0 completeness: 100%
- Function coverage: ≥95%
- Constitution updates: Current
- Git protocol compliance: 100%
- Team composition: Correct

## Summary

These validation rules ensure:
1. **NO mode can skip required protocols**
2. **Every mode follows the same core structure**
3. **Mode-specific needs are still met**
4. **Quality and consistency maintained**
5. **Single commit workflow enforced**

Regular validation prevents protocol drift and ensures Shadow Clone remains a reliable, high-quality system regardless of which mode is selected.