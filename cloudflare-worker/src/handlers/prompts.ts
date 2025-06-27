import { Env } from '../index';
import { authenticateRequest } from '../utils/auth';
import { corsHeaders } from '../utils/cors';

// Main Shadow Clone prompt content (embedded for better performance)
const SHADOW_CLONE_PROMPT = `<!--
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║                           PROPRIETARY AND CONFIDENTIAL                                 ║
║                                                                                        ║
║  Copyright (c) 2024 Ignis AI Labs LLC. All Rights Reserved.                          ║
║                                                                                        ║
║  NOTICE: This file contains proprietary information and trade secrets of              ║
║  Ignis AI Labs LLC. Any unauthorized use, reproduction, distribution, or              ║
║  disclosure of this material is strictly prohibited and will be prosecuted            ║
║  to the fullest extent of the law.                                                   ║
║                                                                                        ║
║  This file is licensed under the Shadow Clone Proprietary License.                   ║
║  You may not use this file except in compliance with the License.                    ║
║                                                                                        ║
║  By accessing this file, you acknowledge that:                                       ║
║  1. This is proprietary software with restricted access                              ║
║  2. You have a valid license agreement with Ignis AI Labs LLC                       ║
║  3. You will not share, copy, or distribute this code                               ║
║  4. Violations will result in immediate license termination                          ║
║  5. Legal action will be taken against violators                                     ║
║                                                                                        ║
║  For licensing information: legal@shadowclone.ai                                     ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝
-->

# Shadow Clone System

Modular orchestrator ensuring every agent operates at master level through proper rule injection. No weak links.

## System Architecture

**📂 Modules** (READ ONLY - ALL EXIST):
- \`.shadow/agent_rules/\` - Behavioral DNA
- \`.shadow/coordination_rules/\` - Wave coordination  
- \`.shadow/mode_configs/\` - Project methodologies
- \`.shadow/templates/\` - Standards
- \`.shadow/execution_phases/\` - Phase implementations

**🎯 Core**: Universal excellence, synchronized operation, focused delivery.

## Configuration

\`\`\`
ARGUMENTS:
project_plan=./project-plan.md
workspace_dir=./
waves_directory=/root/repos/shadow-clone/.waves/
num_teams=dynamic
team_composition=auto
wave_strategy=auto
wave_count=dynamic
project_type=auto
git_strategy=auto
\`\`\`

Command line overrides defaults: \`"Load shadow-clone-prompt.md and execute with project_type=audit"\`

## Initialization

1. **Parse Arguments** - Extract configuration with defaults
2. **Detect Mode** - execution (default), planning, research, resume, status, health, repair
3. **Load Configuration** - \`{workspace_dir}/.shadow/mode_configs/shadow-clone-{project_type}.md\`

## Execution Phases

### Phase 1: Analysis
- Generate project plan if missing
- Analyze project context
- Apply safety measures

### Phase 2: Team Configuration
- Load team templates
- Configure based on project type

### Phase 3: Wave Planning
- Plan waves with coordination rules
- Create WAVE_EXECUTION_PLAN.md
- Split waves >10 agents into sub-waves

### Phase 4: Agent Deployment
**CRITICAL**: Deploy ALL agents SIMULTANEOUSLY (max 10 per batch)

\`\`\`python
for wave in waves:
    agents = collect_all_agents(wave)  # From ALL teams
    
    # Rule injection for each agent
    for agent in agents:
        inject_rules(
            core_rules,      # Universal excellence
            role_rules,      # Specialization
            project_rules,   # If applicable
            team_context,    # Coordination
            assignment       # Specific task
        )
    
    # Deploy in batches of 10
    for batch in chunks(agents, 10):
        deploy_parallel(batch)
\`\`\`

### Phase 5: Consolidation
- Merge wave outputs
- Create final deliverables
- Generate README

## Orchestrator Directives

1. **Apply mode_configs** - Load and apply configurations
2. **Excellence standard** - Every agent must be master-level
3. **Parallel deployment** - Deploy waves simultaneously
4. **Zero weakness** - Proper rule injection ensures quality
5. **Clear deliverables** - Organized in waves_directory

## File System

\`\`\`
{waves_directory}/
├── wave-1/
│   ├── [agent_outputs]
│   └── README.md
├── wave-2/
│   └── ...
└── [final-deliverables]/
    ├── final-codebase/
    ├── documentation/
    └── deployment/
\`\`\`

## Success Criteria

✅ All agents operate at master level
✅ Perfect wave coordination
✅ Clear organized deliverables
✅ Project requirements exceeded
✅ Zero weak outputs

## Remember

"Every agent is a master. Every wave is synchronized. Every output is exceptional."
`;

// Store mode configurations in KV or embed them
const MODE_CONFIGS: Record<string, string> = {
  'audit': `# Shadow Clone Audit Mode

Mode: Comprehensive System Analysis

## Purpose
Deep dive into existing codebases to identify issues, security vulnerabilities, performance bottlenecks, and improvement opportunities.

## Team Configuration
- **Lead Security Auditor**: Security vulnerability analysis
- **Performance Analyst**: Performance profiling and optimization
- **Code Quality Specialist**: Best practices and maintainability
- **Architecture Reviewer**: System design evaluation
- **Testing Specialist**: Test coverage and quality assessment

## Wave Strategy
1. **Wave 1**: Initial scan and inventory
2. **Wave 2**: Deep analysis by domain
3. **Wave 3**: Consolidated findings and recommendations

## Deliverables
- Security audit report
- Performance analysis
- Code quality metrics
- Architecture recommendations
- Prioritized improvement roadmap`,

  'debug': `# Shadow Clone Debug Mode

Mode: Systematic Issue Resolution

## Purpose
Identify, isolate, and fix bugs through comprehensive debugging strategies.

## Team Configuration
- **Lead Debugger**: Root cause analysis
- **Test Engineer**: Reproduction and verification
- **Performance Debugger**: Performance-related issues
- **Integration Specialist**: System interaction bugs
- **Documentation Lead**: Fix documentation

## Wave Strategy
1. **Wave 1**: Issue reproduction and isolation
2. **Wave 2**: Root cause analysis
3. **Wave 3**: Fix implementation and verification

## Deliverables
- Bug analysis report
- Fix implementations
- Test cases for regression
- Updated documentation`,

  'feature': `# Shadow Clone Feature Mode

Mode: Feature Development Excellence

## Purpose
Build new features with complete implementation including frontend, backend, tests, and documentation.

## Team Configuration
- **Architect**: Feature design and planning
- **Frontend Developer**: UI implementation
- **Backend Developer**: API and business logic
- **Database Specialist**: Data modeling
- **QA Engineer**: Testing strategy
- **DevOps**: Deployment considerations

## Wave Strategy
1. **Wave 1**: Architecture and design
2. **Wave 2**: Core implementation
3. **Wave 3**: Testing and polish
4. **Wave 4**: Documentation and deployment

## Deliverables
- Feature specification
- Complete implementation
- Test suite
- User documentation
- Deployment guide`,

  'optimize': `# Shadow Clone Optimize Mode

Mode: Performance Excellence

## Purpose
Maximize system performance through comprehensive optimization strategies.

## Team Configuration
- **Performance Lead**: Overall optimization strategy
- **Frontend Optimizer**: Client-side performance
- **Backend Optimizer**: Server-side efficiency
- **Database Optimizer**: Query and schema optimization
- **Infrastructure Expert**: Resource utilization

## Wave Strategy
1. **Wave 1**: Performance profiling
2. **Wave 2**: Optimization implementation
3. **Wave 3**: Verification and tuning

## Deliverables
- Performance baseline report
- Optimization implementations
- Performance comparison
- Optimization guide`,

  'refactor': `# Shadow Clone Refactor Mode

Mode: Code Excellence Transformation

## Purpose
Transform codebases for better maintainability, scalability, and developer experience.

## Team Configuration
- **Refactoring Architect**: Strategy and patterns
- **Code Modernizer**: Language feature updates
- **API Designer**: Interface improvements
- **Test Refactorer**: Test suite improvements
- **Documentation Expert**: Code documentation

## Wave Strategy
1. **Wave 1**: Analysis and planning
2. **Wave 2**: Core refactoring
3. **Wave 3**: Test updates
4. **Wave 4**: Documentation

## Deliverables
- Refactoring plan
- Modernized codebase
- Updated test suite
- Migration guide`,

  'research': `# Shadow Clone Research Mode

Mode: Deep Technical Investigation

## Purpose
Conduct thorough research on technologies, architectures, or implementation approaches.

## Team Configuration
- **Research Lead**: Research coordination
- **Technology Analyst**: Tool evaluation
- **Architecture Researcher**: Design patterns
- **Implementation Expert**: Proof of concepts
- **Documentation Specialist**: Findings compilation

## Wave Strategy
1. **Wave 1**: Initial research and survey
2. **Wave 2**: Deep dive analysis
3. **Wave 3**: Proof of concepts
4. **Wave 4**: Final recommendations

## Deliverables
- Research report
- Technology comparisons
- Proof of concepts
- Implementation recommendations
- Decision matrix`
};

/**
 * Handle requests for the main Shadow Clone prompt
 */
export async function handleGetShadowClonePrompt(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    // Verify authentication
    const authResult = await authenticateRequest(request, env);
    if ('error' in authResult) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
    
    const { user } = authResult;

    // Return the prompt content
    return new Response(
      JSON.stringify({
        success: true,
        content: SHADOW_CLONE_PROMPT,
        version: '1.0.0',
        lastUpdated: '2024-12-27'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error fetching shadow clone prompt:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch prompt',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}

/**
 * Handle requests for mode configurations
 */
export async function handleGetModeConfig(
  request: Request,
  env: Env,
  params: { mode: string }
): Promise<Response> {
  try {
    // Verify authentication
    const authResult = await authenticateRequest(request, env);
    if ('error' in authResult) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
    
    const { user } = authResult;

    // Get the requested mode config
    const mode = params.mode.toLowerCase();
    const config = MODE_CONFIGS[mode];

    if (!config) {
      return new Response(
        JSON.stringify({
          error: 'Mode not found',
          availableModes: Object.keys(MODE_CONFIGS),
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        name: mode,
        description: `${mode.charAt(0).toUpperCase() + mode.slice(1)} mode configuration`,
        content: config,
        version: '1.0.0',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error fetching mode config:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch mode config',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}

/**
 * Handle requests for all available modes
 */
export async function handleGetAllModes(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    // Verify authentication
    const authResult = await authenticateRequest(request, env);
    if ('error' in authResult) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
    
    const { user } = authResult;

    // Return list of available modes
    const modes = Object.keys(MODE_CONFIGS);

    return new Response(
      JSON.stringify({
        success: true,
        modes: modes,
        version: '1.0.0',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error fetching modes:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch modes',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}