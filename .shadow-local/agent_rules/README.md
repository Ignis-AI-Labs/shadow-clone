# Agent Rules System (Simplified)

## Overview
This directory contains simplified behavioral rule sets for Shadow Clone agents. We've consolidated from 12 files to 6 files, reducing complexity while maintaining all essential functionality.

## File Structure

### Core Rules (Universal)
- **`core_rules.md`** - Universal rules every agent must follow
  - File coordination and conflict prevention
  - State reporting and progress updates
  - Quality standards (90%+ requirement)
  - Communication and escalation protocols
  - Error handling and recovery

### Specialized Rules (By Function)
- **`technical_rules.md`** - For building, testing, and deploying
  - Development (Frontend, Backend, Full-stack)
  - Quality Assurance (Testing, Bug tracking)
  - DevOps (Infrastructure, CI/CD, Monitoring)
  - Security (Implementation, Vulnerability management)

- **`analytical_rules.md`** - For planning, research, and documentation
  - Planning (Strategic planning, Consolidation)
  - Research (Investigation, Analysis)
  - Audit (Compliance, Risk assessment)
  - Documentation (Technical writing, Knowledge management)

- **`leadership_rules.md`** - For coordination and context preservation
  - Team Lead (Agent coordination, File management, Communication)
  - Record Keeper (Constitution maintenance, Context preservation)

### Utility Files
- **`agent_template.md`** - Template for creating new agent types
- **`README.md`** - This file

## Rule Injection Protocol

### Simple Injection Pattern
When creating agents, inject only the necessary rule sets:

```
AGENT COMPOSITION:
1. Core Rules (always included)
2. Function-Specific Rules (technical OR analytical OR leadership)
3. Custom Assignment (specific task and context)
```

### Example Injections

**Frontend Developer:**
```
Load: core_rules.md
Load: technical_rules.md (focus on Frontend section)
Add: Specific UI tasks and file reservations
```

**Security Auditor:**
```
Load: core_rules.md
Load: technical_rules.md (focus on Security section)
Load: analytical_rules.md (focus on Audit section)
Add: Specific audit scope
```

**Team Lead:**
```
Load: core_rules.md
Load: leadership_rules.md
Add: Team-specific coordination needs
```

## Key Improvements

### Reduced Complexity
- **50% fewer files** (12 → 6)
- **Removed redundancy** - No more repeated "Master Craftsman" sections
- **Practical focus** - Removed philosophical and theoretical content
- **Clear grouping** - Technical vs Analytical vs Leadership

### Simplified Language
- No more "Sovereign Agent" or "Constitutional Authority"
- Standard industry terminology
- Focus on actions, not philosophy
- Clear, concise instructions

### Better Maintainability
- Common behaviors in one place (core_rules.md)
- Related specializations grouped together
- Easy to add new agent types using template
- Clear hierarchy of rules

## Creating New Agent Types

1. Start with `agent_template.md`
2. Define core identity and deliverables
3. Specify collaboration requirements
4. Set quality standards
5. Add to appropriate functional file (technical or analytical)

## Rule Priority

1. **Core Rules** - Always highest priority
2. **Functional Rules** - Specialization requirements
3. **Custom Assignment** - Specific implementation details

When conflicts arise, core rules take precedence. Escalate unresolvable conflicts to team lead.

## Migration from Old System

The old 12-file system has been consolidated:
- `development`, `qa`, `devops`, `security` → `technical_rules.md`
- `planning`, `research`, `audit`, `documentation` → `analytical_rules.md`
- `team_lead` + `record_keeper` → `leadership_rules.md`
- Removed redundant philosophical content
- Extracted common patterns to `core_rules.md`

This simplified structure maintains all functionality while being easier to understand and maintain.