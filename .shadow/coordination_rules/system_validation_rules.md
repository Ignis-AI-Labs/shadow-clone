<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
See LICENSE-PROPRIETARY.md for full terms.
-->

# System Validation Rules - Continuous Enforcement

## 🔒 CRITICAL: These Rules Prevent System Bypass

**PURPOSE**: Ensure NO component of the Shadow Clone system can be skipped or bypassed during execution.

## Validation Layers

### Layer 1: Pre-Execution Validation
**When**: Before ANY agent deployment or code execution
**What**: Complete system initialization verification

```python
def pre_execution_validation():
    """
    MANDATORY validation before any execution
    """
    validations = {
        "system_files": check_all_system_files_exist(),
        "rules_loaded": verify_all_rules_loaded(),
        "wave_0_ready": check_wave_0_directory_exists(),
        "agents_configured": verify_agent_configurations(),
        "workspace_valid": validate_workspace_structure()
    }
    
    failed_checks = [k for k, v in validations.items() if not v]
    
    if failed_checks:
        raise ValidationError(f"Pre-execution validation failed: {failed_checks}")
        
    return True
```

### Layer 2: Agent Deployment Validation
**When**: As each agent is deployed
**What**: Verify complete rule injection

```python
def validate_agent_deployment(agent):
    """
    Ensure agent has ALL required components
    """
    required_components = [
        "core_agent_rules",
        "role_specific_rules", 
        "mode_configuration",
        "file_organization_rules",
        "wave_coordination_rules"
    ]
    
    for component in required_components:
        if component not in agent.loaded_rules:
            raise AgentValidationError(
                f"Agent {agent.name} missing {component}"
            )
    
    # Verify agent understands wave-0
    if not agent.acknowledges_wave_0_requirement():
        raise AgentValidationError(
            f"Agent {agent.name} not aware of wave-0 requirements"
        )
    
    return True
```

### Layer 3: Runtime Validation
**When**: Continuously during execution
**What**: Monitor compliance with all rules

```python
def runtime_validation_loop():
    """
    Continuous validation during execution
    """
    while system_running:
        # Check file placement
        validate_file_placement()
        
        # Check wave-0 compliance
        if in_wave_1_or_later() and not wave_0_complete():
            raise RuntimeError("Wave-0 incomplete but execution proceeding!")
        
        # Check reservation system
        validate_file_reservations()
        
        # Check agent behavior
        validate_agent_compliance()
        
        sleep(validation_interval)
```

## Validation Checkpoints

### 1. System Start Checkpoint
```yaml
Location: Phase 1 - Project Analysis
Validates:
  - initialization_checklist.md loaded
  - All system files present
  - Core rules loaded
  - Mode identified
  - Wave-0 directory created
Failure Action: ABORT - Cannot proceed without initialization
```

### 2. Team Formation Checkpoint  
```yaml
Location: Phase 2 - Team Configuration
Validates:
  - All agents have complete rulesets
  - Role-specific rules loaded
  - Mode configuration applied
  - File organization rules included
Failure Action: ABORT - Cannot deploy incomplete agents
```

### 3. Wave Planning Checkpoint
```yaml
Location: Phase 3 - Wave Planning
Validates:
  - Wave-0 included in plan
  - Wave coordination rules loaded
  - File reservation system ready
  - Convergence protocols configured
Failure Action: ABORT - Cannot execute without proper planning
```

### 4. Pre-Wave Execution Checkpoint
```yaml
Location: Before each wave starts
Validates:
  - Previous wave complete (if applicable)
  - Wave-0 complete (for wave 1+)
  - File reservations cleared
  - Agents ready with full rulesets
Failure Action: BLOCK - Cannot start wave
```

### 5. Post-Wave Checkpoint
```yaml
Location: After each wave completes
Validates:
  - All deliverables in correct locations
  - No files in .waves/ that shouldn't be
  - Quality gates passed
  - Handoffs prepared
Failure Action: REMEDIATE - Fix before next wave
```

## Bypass Prevention Mechanisms

### 1. Multiple Load Points
Rules are loaded at MULTIPLE points to prevent single-point bypass:
- System initialization
- Agent creation
- Wave start
- Convergence sessions
- Quality checks

### 2. Cross-Validation
Components validate each other:
- Agents check other agents' compliance
- Phases verify previous phase completion
- Quality gates check rule adherence
- File system monitors placement

### 3. Fail-Safe Defaults
If validation uncertain:
- Default to MOST restrictive interpretation
- Require wave-0 even if unclear
- Enforce all rules even if some seem redundant
- Block progress until validation passes

## Validation Error Handling

### Error Categories
1. **CRITICAL**: Missing system files → ABORT
2. **SEVERE**: Incomplete initialization → BLOCK
3. **MAJOR**: Rule violations → REMEDIATE
4. **MINOR**: Best practice deviations → WARN

### Error Response Protocol
```python
def handle_validation_error(error):
    if error.severity == "CRITICAL":
        # Stop everything
        system.emergency_stop()
        notify_user("CRITICAL SYSTEM FAILURE", error)
        require_manual_intervention()
        
    elif error.severity == "SEVERE":
        # Block current operation
        current_operation.block()
        attempt_auto_remediation(error)
        if not remediated:
            escalate_to_user()
            
    elif error.severity == "MAJOR":
        # Try to fix
        remediation_result = auto_remediate(error)
        log_remediation(remediation_result)
        if not fixed:
            add_to_post_wave_fixes()
            
    elif error.severity == "MINOR":
        # Log and continue
        log_warning(error)
        add_to_improvement_queue()
```

## Continuous Improvement

### Validation Metrics Tracked
- Number of validation failures by type
- Most common bypass attempts
- Agent compliance rates
- File placement accuracy
- Wave-0 completion rates

### Feedback Loop
1. Track validation failures
2. Identify patterns
3. Strengthen weak points
4. Update validation rules
5. Deploy improvements

## Integration with Other Systems

### With File Organization Rules
- Validates file placement continuously
- Ensures wave-0 directory exists
- Checks source code not in .waves/

### With Wave Coordination
- Validates wave sequence
- Ensures wave-0 completes first
- Checks convergence participation

### With Agent Rules
- Validates rule loading
- Monitors agent behavior
- Ensures coordination compliance

## Summary

**These validation rules ensure:**
1. ✓ System ALWAYS fully initializes
2. ✓ NO rules can be skipped
3. ✓ Wave-0 ALWAYS happens first
4. ✓ Agents ALWAYS have complete rulesets
5. ✓ File organization ALWAYS enforced

**Remember**: Validation is not optional - it's the immune system of Shadow Clone.