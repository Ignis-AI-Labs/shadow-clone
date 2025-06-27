// Shadow Clone command templates
export const SHADOW_CLONE_COMMANDS = {
    DEPLOY: 'Load shadow-clone-prompt.md and execute with project_plan=./project-plan.md workspace_dir=./ waves_directory=./.waves/',
    RESEARCH: 'Load shadow-clone-prompt.md and execute with project_type=research',
    DEBUG: 'Load shadow-clone-prompt.md and execute with project_type=debug',
    FEATURE: 'Load shadow-clone-prompt.md and execute with project_type=feature',
    REFACTOR: 'Load shadow-clone-prompt.md and execute with project_type=refactor',
    OPTIMIZE: 'Load shadow-clone-prompt.md and execute with project_type=optimize',
    AUDIT: 'Load shadow-clone-prompt.md and execute with project_type=audit',
    RESUME: 'Load shadow-clone-prompt.md and resume',
    STATUS: 'Load shadow-clone-prompt.md and status',
    PLAN: 'Load shadow-clone-prompt.md and plan',
    HEALTH: 'Load shadow-clone-prompt.md and health',
    REPAIR: 'Load shadow-clone-prompt.md and repair'
};

// Macro system for building custom commands
export class ShadowCloneMacros {
    static buildCommand(options: {
        mode?: string;
        projectPlan?: string;
        workspaceDir?: string;
        wavesDirectory?: string;
        numTeams?: number;
        teamComposition?: string;
        waveStrategy?: string;
        waveCount?: number;
        projectType?: string;
        gitStrategy?: string;
    }): string {
        let command = 'Load shadow-clone-prompt.md and ';
        
        // Special modes
        if (options.mode && ['resume', 'status', 'plan', 'health', 'repair'].includes(options.mode)) {
            return command + options.mode;
        }
        
        // Regular execution
        command += 'execute';
        
        const args: string[] = [];
        
        if (options.projectPlan) {
            args.push(`project_plan=${options.projectPlan}`);
        }
        if (options.workspaceDir) {
            args.push(`workspace_dir=${options.workspaceDir}`);
        }
        if (options.wavesDirectory) {
            args.push(`waves_directory=${options.wavesDirectory}`);
        }
        if (options.numTeams) {
            args.push(`num_teams=${options.numTeams}`);
        }
        if (options.teamComposition) {
            args.push(`team_composition=${options.teamComposition}`);
        }
        if (options.waveStrategy) {
            args.push(`wave_strategy=${options.waveStrategy}`);
        }
        if (options.waveCount) {
            args.push(`wave_count=${options.waveCount}`);
        }
        if (options.projectType) {
            args.push(`project_type=${options.projectType}`);
        }
        if (options.gitStrategy) {
            args.push(`git_strategy=${options.gitStrategy}`);
        }
        
        if (args.length > 0) {
            command += ' with ' + args.join(' ');
        }
        
        return command;
    }
    
    static parseCommand(command: string): any {
        const options: any = {};
        
        // Check for special modes
        const modeMatch = command.match(/and (resume|status|plan|health|repair)$/);
        if (modeMatch) {
            options.mode = modeMatch[1];
            return options;
        }
        
        // Parse arguments
        const argsMatch = command.match(/with (.+)$/);
        if (argsMatch) {
            const argsString = argsMatch[1];
            const argPairs = argsString.split(/\s+/);
            
            for (const pair of argPairs) {
                const [key, value] = pair.split('=');
                if (key && value) {
                    options[key] = value;
                }
            }
        }
        
        return options;
    }
    
    static getQuickCommands(): Array<{label: string, description: string, command: string}> {
        return [
            {
                label: 'Build Full-Stack App',
                description: 'React + Node.js + PostgreSQL',
                command: this.buildCommand({
                    projectType: 'feature',
                    teamComposition: 'fullstack',
                    waveCount: 3
                })
            },
            {
                label: 'Security Audit',
                description: 'OWASP Top 10 + Best Practices',
                command: this.buildCommand({
                    projectType: 'audit',
                    teamComposition: 'security'
                })
            },
            {
                label: 'Performance Optimization',
                description: 'Analyze and improve performance',
                command: this.buildCommand({
                    projectType: 'optimize',
                    teamComposition: 'performance'
                })
            },
            {
                label: 'AI Feature Integration',
                description: 'Add AI capabilities to existing app',
                command: this.buildCommand({
                    projectType: 'feature',
                    teamComposition: 'ai-specialists',
                    waveCount: 2
                })
            },
            {
                label: 'Microservices Migration',
                description: 'Break monolith into services',
                command: this.buildCommand({
                    projectType: 'refactor',
                    teamComposition: 'architects',
                    waveStrategy: 'incremental'
                })
            }
        ];
    }
}