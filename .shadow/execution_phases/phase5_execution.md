# Phase 5: Mode-Specific Execution

## Module Interface
- **Inputs**: 
  - Deployed agents from Phase 4
  - Wave assignments from Phase 3
  - Wave coordination rules
  - Mode configuration (EXECUTION, PLANNING, RESEARCH, etc.)
  - Constitutional authority structure
- **Outputs**: 
  - Wave execution results
  - Agent deliverables
  - State convergence reports
  - Quality validation results
  - Handoff artifacts
- **Dependencies**: 
  - Mode operations rules
  - Wave coordination protocols
  - Quality gate definitions
  - Integration rules

## Phase Objectives
1. Execute waves according to mode and strategy
2. Coordinate agent activities within waves
3. Manage convergence sessions
4. Monitor quality gates continuously
5. Facilitate smooth handoffs between waves

## Execution Modes

### EXECUTION MODE (Default)
Full system execution with actual work performed:
```python
if mode == "EXECUTION":
    for wave in wave_assignments:
        execute_wave(wave, deployed_agents, wave_rules)
```

### PLANNING MODE
Generate detailed execution plan without execution:
```python
elif mode == "PLANNING":
    execution_plan = generate_execution_plan(wave_assignments, deployed_agents)
    save_plan(execution_plan)
```

### RESEARCH MODE
Deep investigation protocol:
```python
elif mode == "RESEARCH":
    research_protocol = load_research_protocol()
    execute_research(teams, research_protocol)
```

### Other Modes
- **RESUME**: Continue from interruption point
- **STATUS**: Report current state
- **HEALTH CHECK**: Validate system integrity
- **REPAIR**: Fix identified issues

## Wave Execution Protocol

### 1. Pre-Wave Setup
```python
def prepare_wave_execution(wave, deployed_agents):
    """
    Set up wave for execution
    """
    wave_state = {
        "number": wave["number"],
        "status": "preparing",
        "start_time": None,
        "teams": wave["teams"],
        "agents": get_wave_agents(wave, deployed_agents),
        "convergence_points": []
    }
    
    # Initialize constitutional authority for this wave
    constitutional_authority = {
        "wave_coordinator": f"wave_{wave['number']}_coordinator",
        "state_aggregator": f"wave_{wave['number']}_state",
        "quality_monitor": f"wave_{wave['number']}_quality"
    }
    
    # Create wave coordination structures
    create_wave_coordination_files(wave, constitutional_authority)
    
    # Schedule convergence sessions
    convergence_schedule = plan_wave_convergences(wave)
    wave_state["convergence_points"] = convergence_schedule
    
    return wave_state, constitutional_authority
```

### 2. Wave Launch
```python
def launch_wave(wave_state, constitutional_authority):
    """
    Begin wave execution with all agents
    """
    wave_state["status"] = "executing"
    wave_state["start_time"] = timestamp()
    
    # Notify all agents in wave
    for agent in wave_state["agents"]:
        # Update agent state to active
        update_agent_state(agent["id"], {
            "status": "active",
            "wave_status": "executing",
            "task_status": "in_progress"
        })
        
        # Provide wave context
        provide_wave_context(agent, {
            "wave_number": wave_state["number"],
            "wave_objective": wave_state["objective"],
            "peer_agents": get_peer_agents(agent, wave_state),
            "dependencies_available": check_dependencies(agent, wave_state),
            "convergence_schedule": wave_state["convergence_points"]
        })
    
    # Initialize wave monitoring
    start_wave_monitoring(wave_state, constitutional_authority)
    
    log_info(f"Wave {wave_state['number']} launched with {len(wave_state['agents'])} agents")
```

### 3. Convergence Session Management
```python
def execute_convergence_session(session_type, wave_state, constitutional_authority):
    """
    Manage convergence sessions for coordination
    """
    convergence_report = {
        "type": session_type,
        "wave": wave_state["number"],
        "timestamp": timestamp(),
        "participants": [],
        "findings": [],
        "decisions": [],
        "action_items": []
    }
    
    # Collect state from all agents
    agent_states = []
    for agent in wave_state["agents"]:
        state = read_agent_state(agent["id"])
        agent_states.append(state)
        convergence_report["participants"].append(agent["id"])
    
    # Aggregate findings
    if session_type == "mid_wave":
        # Progress check
        overall_progress = calculate_overall_progress(agent_states)
        blockers = identify_blockers(agent_states)
        
        convergence_report["findings"] = {
            "overall_progress": overall_progress,
            "blockers": blockers,
            "at_risk_items": identify_risks(agent_states)
        }
        
        # Make decisions
        if blockers:
            convergence_report["decisions"].append("Reallocate resources to blocked tasks")
            convergence_report["action_items"] = generate_unblocking_actions(blockers)
    
    elif session_type == "post_wave":
        # Completion check
        completion_status = verify_wave_completion(agent_states)
        quality_results = run_quality_gates(wave_state)
        
        convergence_report["findings"] = {
            "completion": completion_status,
            "quality": quality_results,
            "deliverables": collect_deliverables(agent_states)
        }
        
        # Prepare handoffs
        if completion_status["ready_for_handoff"]:
            convergence_report["decisions"].append("Wave complete, proceed to handoff")
            prepare_wave_handoff(wave_state, convergence_report["findings"]["deliverables"])
    
    # Document convergence
    save_convergence_report(convergence_report, constitutional_authority)
    
    # Update agent states based on decisions
    apply_convergence_decisions(convergence_report, wave_state)
    
    return convergence_report
```

### 4. Quality Gate Monitoring
```python
def monitor_quality_gates(wave_state, constitutional_authority):
    """
    Continuous quality monitoring during wave execution
    """
    quality_monitor = constitutional_authority["quality_monitor"]
    
    while wave_state["status"] == "executing":
        quality_metrics = {
            "timestamp": timestamp(),
            "wave": wave_state["number"],
            "metrics": {}
        }
        
        for agent in wave_state["agents"]:
            agent_quality = assess_agent_quality(agent)
            quality_metrics["metrics"][agent["id"]] = agent_quality
            
            # Enforce No Weak Links
            if agent_quality["score"] < 0.9:  # Below 90%
                trigger_weak_link_protocol(agent, agent_quality)
                wave_state["status"] = "quality_intervention"
                break
        
        # Check wave-level quality
        wave_quality = calculate_wave_quality(quality_metrics["metrics"])
        if wave_quality["status"] == "at_risk":
            initiate_quality_improvement(wave_state, wave_quality)
        
        # Log quality status
        log_quality_metrics(quality_metrics, quality_monitor)
        
        # Check every 5 minutes
        sleep(300)

def trigger_weak_link_protocol(agent, quality_metrics):
    """
    CRITICAL: Handle weak link detection
    """
    alert = {
        "severity": "CRITICAL",
        "agent": agent["id"],
        "issue": "Quality below master craftsman standard",
        "metrics": quality_metrics,
        "action": "IMMEDIATE INTERVENTION REQUIRED"
    }
    
    # Stop wave progression
    log_critical(f"WEAK LINK DETECTED: {agent['id']} - {quality_metrics['score']}")
    
    # Initiate remediation
    remediation_plan = {
        "agent": agent["id"],
        "issues": quality_metrics["failures"],
        "required_actions": generate_remediation_actions(quality_metrics),
        "support_needed": identify_support_requirements(agent, quality_metrics)
    }
    
    return remediation_plan
```

### 5. Wave Completion
```python
def complete_wave(wave_state, constitutional_authority):
    """
    Finalize wave execution
    """
    wave_state["status"] = "completing"
    
    # Final quality validation
    final_quality = run_final_quality_checks(wave_state)
    if not final_quality["passed"]:
        wave_state["status"] = "failed_quality"
        return handle_quality_failure(wave_state, final_quality)
    
    # Collect all deliverables
    wave_deliverables = {
        "wave": wave_state["number"],
        "deliverables": []
    }
    
    for team in wave_state["teams"]:
        team_deliverables = collect_team_deliverables(team)
        wave_deliverables["deliverables"].extend(team_deliverables)
    
    # Prepare handoff package
    handoff_package = {
        "from_wave": wave_state["number"],
        "completed_at": timestamp(),
        "deliverables": wave_deliverables,
        "quality_certification": final_quality,
        "state_summary": generate_wave_summary(wave_state)
    }
    
    # Archive wave execution data
    archive_wave_data(wave_state, constitutional_authority)
    
    # Update status
    wave_state["status"] = "completed"
    wave_state["end_time"] = timestamp()
    wave_state["duration"] = calculate_duration(wave_state["start_time"], wave_state["end_time"])
    
    log_success(f"Wave {wave_state['number']} completed successfully in {wave_state['duration']}")
    
    return handoff_package
```

### 6. Inter-Wave Handoff
```python
def execute_handoff(handoff_package, next_wave):
    """
    Transfer deliverables between waves
    """
    handoff_validation = {
        "status": "validating",
        "from_wave": handoff_package["from_wave"],
        "to_wave": next_wave["number"],
        "checks": []
    }
    
    # Validate all deliverables exist
    for deliverable in handoff_package["deliverables"]["deliverables"]:
        if verify_deliverable_exists(deliverable):
            handoff_validation["checks"].append(f"✓ {deliverable['name']} verified")
        else:
            handoff_validation["checks"].append(f"✗ {deliverable['name']} missing")
            handoff_validation["status"] = "failed"
    
    # Check quality certification
    if handoff_package["quality_certification"]["passed"]:
        handoff_validation["checks"].append("✓ Quality certification valid")
    else:
        handoff_validation["checks"].append("✗ Quality certification failed")
        handoff_validation["status"] = "failed"
    
    if handoff_validation["status"] != "failed":
        handoff_validation["status"] = "completed"
        
        # Transfer file ownership
        transfer_file_ownership(handoff_package, next_wave)
        
        # Update next wave dependencies
        update_wave_dependencies(next_wave, handoff_package["deliverables"])
        
        # Notify next wave teams
        notify_wave_ready(next_wave, handoff_package)
    
    return handoff_validation
```

## Mode-Specific Execution Examples

### Research Mode Execution
```python
def execute_research_protocol(teams, research_config):
    """
    Special execution for research projects
    """
    research_phases = [
        "literature_review",
        "hypothesis_formation",
        "experimentation",
        "analysis",
        "documentation"
    ]
    
    for phase in research_phases:
        phase_teams = filter_teams_for_phase(teams, phase)
        execute_research_phase(phase, phase_teams, research_config)
```

### Planning Mode Output
```python
def generate_execution_plan(waves, agents):
    """
    Create detailed plan without execution
    """
    plan = {
        "generated_at": timestamp(),
        "total_waves": len(waves),
        "total_agents": len(agents),
        "estimated_duration": calculate_total_duration(waves),
        "wave_details": []
    }
    
    for wave in waves:
        wave_plan = {
            "wave_number": wave["number"],
            "teams": [t["name"] for t in wave["teams"]],
            "agent_count": count_wave_agents(wave),
            "objectives": wave["objective"],
            "deliverables": wave["deliverables"],
            "dependencies": wave["prerequisites"],
            "estimated_duration": wave["duration"],
            "convergence_points": generate_convergence_schedule(wave)
        }
        plan["wave_details"].append(wave_plan)
    
    return plan
```

## Quality Enforcement Throughout Execution

### Continuous Quality Monitoring
- Real-time quality score tracking
- Automated quality gate checks
- Peer review coordination
- Test execution verification
- Documentation completeness

### No Weak Links Enforcement
- Immediate detection of sub-standard work
- Wave halt on quality violations  
- Mandatory remediation before proceeding
- System-wide quality alerts
- Learning from quality failures

## Deliverables
1. **Wave Execution Reports**: Complete execution history
2. **Agent Deliverables**: All work products
3. **Quality Certifications**: Validated quality metrics
4. **Convergence Reports**: Coordination session outcomes
5. **Handoff Packages**: Inter-wave transitions

## Quality Gates
During execution:
- ✓ All agents maintain 90%+ quality
- ✓ No weak links detected
- ✓ Convergence sessions completed
- ✓ Deliverables validated
- ✓ Handoffs successful
- ✓ Timeline maintained

## Success Metrics
- Wave completion rate: >95%
- Quality standard maintenance: 100%
- On-time delivery: >90%
- Successful handoffs: 100%
- Agent coordination effectiveness: High