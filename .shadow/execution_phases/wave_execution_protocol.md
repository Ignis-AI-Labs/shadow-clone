<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
See LICENSE-PROPRIETARY.md for full terms.
-->

# Wave Execution Protocol - User Guidance

## After Deployment Summary

When you see the deployment summary (like "Shadow Clone Security Audit System Successfully Deployed! 🛡️"), the system is in **READY** state awaiting your command.

## Your Options:

### 1. Execute Immediately (Most Common)
Simply respond with one of:
- `"Execute"`
- `"Start"` 
- `"Begin"`
- `"Go"`
- `"Proceed"`
- `"Yes"`

### 2. Modify Execution
Specify what to change:
- `"Execute but only scan authentication"`
- `"Execute with reduced scope - skip infrastructure"`
- `"Execute but add extra focus on SQL injection"`
- `"Execute Wave 1 only for now"`

### 3. Review Plan First
- `"Show me the detailed plan"`
- `"What will each team do?"`
- `"Explain the wave strategy"`

## CRITICAL: Parallel Agent Deployment

**All agents in a wave MUST deploy simultaneously!**

### ✅ CORRECT Wave Execution:
```
Wave 1 Starting...
[PARALLEL DEPLOYMENT]
├── Team 1: Auth Security (3 agents) - DEPLOYED
├── Team 3: Infrastructure (3 agents) - DEPLOYED  
└── All agents working simultaneously

[2 hours later]
Wave 1 Convergence Session
├── Collect all findings
├── Correlate results
└── Prepare for Wave 2
```

### ❌ INCORRECT Sequential Execution:
```
Wave 1 Starting...
Deploy Team 1 Agent 1... wait...
Deploy Team 1 Agent 2... wait...
[This is WRONG - too slow!]
```

## Wave Execution Pattern

```python
# Each wave follows this pattern:
1. PRE-WAVE VALIDATION
   - Verify CONSTITUTION.md exists
   - Ensure Record Keeper assigned
   - Check previous wave updates complete
   - Validate all agents have constitution awareness

2. PARALLEL DEPLOYMENT
   - All teams in wave deploy at once
   - All agents in each team deploy at once
   - Everyone starts working simultaneously
   - Record Keeper begins monitoring

3. PARALLEL EXECUTION  
   - Agents work independently
   - No waiting for others
   - Continuous state updates
   - Record Keeper collects key decisions

4. CONVERGENCE SESSION
   - All agents report findings
   - Correlate discoveries
   - Record Keeper documents decisions
   - Prepare handoffs

5. WAVE COMPLETION
   - Record Keeper updates CONSTITUTION.md
   - Team Lead validates constitution update
   - Wave marked complete only after update
   - Context preserved for next wave

6. WAVE TRANSITION
   - Next wave reads updated constitution
   - Deploy with full context awareness
   - Continue until project complete
```

## Common User Commands During Execution

- `"Status"` - Check current progress
- `"Pause"` - Temporarily halt execution
- `"Resume"` - Continue from pause
- `"Skip to Wave 2"` - Jump ahead
- `"Focus on critical findings only"` - Adjust scope mid-execution
- `"Generate preliminary report"` - Get early results
- `"Show constitution"` - View current project context
- `"What decisions have been made?"` - See key architectural choices

## Example Execution Flow

```
User: "Execute"

System: 
🌊 WAVE 1: FOUNDATION SECURITY (2 hours)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[DEPLOYING ALL WAVE 1 AGENTS IN PARALLEL]

Team 1: Authentication & Authorization (3 Security Masters)
├── 🔐 Master: identity_and_access_management
├── 🔑 Master: session_and_token_security  
└── 🛡️ Master: authorization_and_rbac
✓ All deployed and working simultaneously

Team 3: Infrastructure & Deployment (3 Security Masters)
├── 🏗️ Master: infrastructure_security
├── 🔧 Master: deployment_and_devops
└── ☁️ Master: configuration_and_secrets
✓ All deployed and working simultaneously

⏳ Wave 1 in progress... (6 agents working in parallel)
```

## Constitution: Your Project's Memory

Throughout execution, the Record Keeper maintains your project's CONSTITUTION.md at `{waves_directory}/CONSTITUTION.md`. This ensures:

- **No Lost Context**: Every decision and discovery is preserved
- **Resume Capability**: Stop and restart anytime without losing progress
- **Clear History**: Understand why choices were made
- **Future Guidance**: Next waves build on solid foundation

The constitution is updated after each wave, creating a living document of your project's evolution.

## Remember

The Shadow Clone System's power comes from parallel execution AND context preservation. When you say "Execute", all agents in the current wave spring into action simultaneously, working as master craftsmen toward the common goal, while the Record Keeper ensures nothing is forgotten.

**Every second counts. Every agent matters. Every decision is preserved. No sequential bottlenecks allowed.**