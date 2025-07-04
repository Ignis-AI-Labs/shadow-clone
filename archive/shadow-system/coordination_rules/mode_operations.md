<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
See LICENSE-PROPRIETARY.md for full terms.
-->

# Mode Operation Rules

## Resume Mode Operations

### Workspace State Analysis Protocol
1. **Progress Assessment**
   - Check `.waves/wave_status.md` for current wave progress
   - Analyze git branch state and recent commits
   - Review `DEVELOPMENT.md` for last recorded activities
   - Examine `.waves/git_status.md` for safety status

2. **Interruption Point Detection**
   - Identify which wave was in progress when interrupted
   - Determine completion status of current wave deliverables
   - Check for partial deliverables in wave directories
   - Assess quality and integrity of existing work

3. **Resume Strategy Selection**
   - If wave was cleanly completed: proceed to next wave
   - If wave was partially completed: resume current wave with state validation
   - If corruption detected: initiate repair sequence first
   - If significant time passed: offer fresh analysis option

4. **Safe Resume Execution**
   - Verify git branch is clean and resumable
   - Create backup of current state before resuming
   - Continue from appropriate checkpoint with agent rule reinjection
   - Update coordination files with resume timestamp and status

## Status Mode Operations

### Comprehensive Status Reporting
- Current wave number and progress percentage across all teams
- Completed deliverables summary with quality metrics
- Active git branch status and recent commit activity
- Team assignments and dependency satisfaction status
- Estimated time to completion based on current velocity
- File reservation status and potential conflicts
- Constitutional authority health and coordination effectiveness

## Health Check Mode Operations

### Workspace Integrity Analysis
- Verify all required directories exist according to workspace structure
- Check coordination file consistency and format validation
- Validate git repository state and branch integrity
- Assess backup integrity and recovery capabilities
- Report any corruption or missing components
- Validate agent rule availability and version consistency
- Check constitutional authority files and coordination infrastructure

## Repair Mode Operations

### Workspace Recovery Procedures
- Rebuild missing coordination files from templates
- Repair corrupted wave directories and restore structure
- Fix git branch issues and restore clean working state
- Restore from backups if critical data is corrupted
- Update status files to reflect repairs and recovery actions
- Reinitialize constitutional authority if needed
- Validate and restore agent rule integrity

## Planning Mode Operations

### Comprehensive Execution Planning

#### Project Analysis Phase
- Project type and complexity assessment with risk analysis
- Key deliverables identification and priority ranking
- Constraint analysis and resource requirement estimation
- Technology stack validation and compatibility assessment

#### Team Structure Design
- Proposed teams with detailed roles and responsibilities
- Team size justification based on complexity and workload
- Skill requirements per team with specialization mapping
- Agent composition recommendations with rule set specifications

#### Wave Execution Strategy
- Detailed wave assignments with dependency mapping
- Timeline estimates with critical path analysis
- Resource allocation and load balancing across waves
- Risk mitigation strategies for each wave

#### Coordination Framework
- Workspace organization strategy with file ownership plans
- Constitutional authority setup and coordination mechanisms
- Quality gates and checkpoint definitions
- Success metrics and monitoring frameworks

**Output**: Detailed execution plan ready for review and approval, including all modular components and rule sets to be used

## Execution Mode Operations

### Full System Orchestration
Execute complete Shadow Clone System workflow starting from Phase 1, incorporating all modular components:
- Load appropriate mode configurations from `.shadow/mode_configs/`
- Initialize constitutional authority and coordination infrastructure
- Inject appropriate agent rules based on project type and team roles
- Execute wave coordination according to `.shadow/coordination_rules/wave_coordination.md`
- Maintain system integrity through modular rule enforcement 