# Shadow Clone Critical Rules

**Single source of truth for system-critical rules to avoid repetition across documentation.**

## 🚨 Deployment Rules

1. **PARALLEL ONLY**: Deploy ALL agents SIMULTANEOUSLY (max 10 per batch)
2. **COUNT AGENTS**: Not teams (3-agent team = 3 deployments)
3. **BATCH LIMITS**: Maximum 10 agents per deployment batch
4. **SUB-WAVES**: For >10 agents, split into Wave 1A, 1B, etc.
5. **NO SEQUENTIAL**: Never deploy one agent at a time

## 📁 File Operations

1. **READ, DON'T CREATE**: All .shadow/ files ALREADY EXIST
2. **"load" = READ**: Always means read existing file
3. **NEVER CREATE**: Files in .shadow/ directories
4. **WORKSPACE ONLY**: Create files only for deliverables

## 🌊 Wave Organization

1. **MANDATORY STRUCTURE**: `$waves_directory/wave-X/`
2. **ALL DELIVERABLES**: Must be in wave folders
3. **CONFIGURABLE PATH**: Via waves_directory argument
4. **DEFAULT PATH**: `/root/repos/shadow-clone/.waves/`

## 🔒 Document Coordination

1. **NO SIMULTANEOUS UPDATES**: One agent updates at a time
2. **CONVERGENCE SESSIONS**: For shared document updates
3. **SECTION OWNERSHIP**: Each team owns their domain section
4. **SEQUENTIAL PROTOCOL**: Agents request and release access

## 🎯 Core Principles

1. **NO WEAK LINKS**: Every agent operates at master level
2. **UNIVERSAL EXCELLENCE**: Core rules apply to all agents
3. **PROPER INJECTION**: Role and project rules enhance core
4. **SYNCHRONIZED OPERATION**: Constitutional coordination

## ⚡ Quality Standards

1. **FALSE POSITIVE RATE**: <10% for security findings
2. **EXPERT CONSENSUS**: >95% agreement required
3. **MULTI-TOOL VALIDATION**: Cross-reference with 2+ tools
4. **COMPLETE FILE ANALYSIS**: Never partial scans
5. **BUSINESS CONTEXT**: Always consider real-world impact