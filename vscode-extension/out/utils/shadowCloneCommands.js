"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShadowCloneMacros = exports.SHADOW_CLONE_COMMANDS = void 0;
// Shadow Clone command templates
exports.SHADOW_CLONE_COMMANDS = {
    PLAN: 'Fetch Shadow Clone prompt from API and plan',
    BUILD: 'Fetch Shadow Clone prompt from API and execute with project_plan=./project-plan.md workspace_dir=./ waves_directory=./.waves/',
    OPTIMIZE: 'Fetch Shadow Clone prompt from API and execute with mode=optimize',
    AUDIT: 'Fetch Shadow Clone prompt from API and execute with mode=audit',
    FEATURE: 'Fetch Shadow Clone prompt from API and execute with mode=feature',
    DEBUG: 'Fetch Shadow Clone prompt from API and execute with mode=debug',
    REFACTOR: 'Fetch Shadow Clone prompt from API and execute with mode=refactor',
    RESEARCH: 'Fetch Shadow Clone prompt from API and execute with mode=research',
    RESUME: 'Fetch Shadow Clone prompt from API and resume',
    STATUS: 'Fetch Shadow Clone prompt from API and status',
    HEALTH: 'Fetch Shadow Clone prompt from API and health',
    REPAIR: 'Fetch Shadow Clone prompt from API and repair'
};
// Macro system for building custom commands
class ShadowCloneMacros {
    static buildCommand(options) {
        let command = 'Fetch Shadow Clone prompt from API and ';
        // Special modes
        if (options.mode && ['resume', 'status', 'plan', 'health', 'repair'].includes(options.mode)) {
            return command + options.mode;
        }
        // Regular execution
        command += 'execute';
        const args = [];
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
    static parseCommand(command) {
        const options = {};
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
    static getQuickCommands() {
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
exports.ShadowCloneMacros = ShadowCloneMacros;
//# sourceMappingURL=shadowCloneCommands.js.map