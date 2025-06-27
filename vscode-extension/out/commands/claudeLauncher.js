"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchClaudeCommand = launchClaudeCommand;
exports.launchClaudeWithArgumentsCommand = launchClaudeWithArgumentsCommand;
const vscode = __importStar(require("vscode"));
const shadowCloneCommands_1 = require("../utils/shadowCloneCommands");
async function launchClaudeCommand(sessionManager) {
    // Check if Claude extension is installed
    const claudeExtension = vscode.extensions.getExtension('anthropic.claude');
    if (!claudeExtension) {
        const install = await vscode.window.showWarningMessage('Claude extension is not installed. Shadow Clone works best with the official Claude extension.', 'Install Claude Extension', 'Continue Anyway');
        if (install === 'Install Claude Extension') {
            vscode.commands.executeCommand('workbench.extensions.search', '@id:anthropic.claude');
            return;
        }
    }
    // Show command selection
    const commandOptions = [
        {
            label: '$(rocket) Deploy Shadow Clone',
            description: 'Full orchestration mode',
            command: shadowCloneCommands_1.SHADOW_CLONE_COMMANDS.DEPLOY
        },
        {
            label: '$(search) Research Mode',
            description: 'Analyze codebase without changes',
            command: shadowCloneCommands_1.SHADOW_CLONE_COMMANDS.RESEARCH
        },
        {
            label: '$(bug) Debug Mode',
            description: 'Fix issues with AI agents',
            command: shadowCloneCommands_1.SHADOW_CLONE_COMMANDS.DEBUG
        },
        {
            label: '$(sparkle) Feature Mode',
            description: 'Build new features',
            command: shadowCloneCommands_1.SHADOW_CLONE_COMMANDS.FEATURE
        },
        {
            label: '$(sync) Refactor Mode',
            description: 'Improve existing code',
            command: shadowCloneCommands_1.SHADOW_CLONE_COMMANDS.REFACTOR
        },
        {
            label: '$(dashboard) Optimize Mode',
            description: 'Performance improvements',
            command: shadowCloneCommands_1.SHADOW_CLONE_COMMANDS.OPTIMIZE
        },
        {
            label: '$(shield) Audit Mode',
            description: 'Security assessment',
            command: shadowCloneCommands_1.SHADOW_CLONE_COMMANDS.AUDIT
        },
        {
            label: '$(history) Resume Previous',
            description: 'Continue from last session',
            command: shadowCloneCommands_1.SHADOW_CLONE_COMMANDS.RESUME
        },
        {
            label: '$(info) Status Check',
            description: 'View current progress',
            command: shadowCloneCommands_1.SHADOW_CLONE_COMMANDS.STATUS
        }
    ];
    const selected = await vscode.window.showQuickPick(commandOptions, {
        placeHolder: 'Select Shadow Clone command to run'
    });
    if (!selected)
        return;
    // Get additional parameters if needed
    let finalCommand = selected.command;
    if (selected.label.includes('Deploy')) {
        // Ask for project plan path
        const projectPlan = await vscode.window.showInputBox({
            prompt: 'Project plan file (optional)',
            placeHolder: './project-plan.md',
            value: './project-plan.md'
        });
        if (projectPlan && projectPlan !== './project-plan.md') {
            finalCommand = finalCommand.replace('project_plan=./project-plan.md', `project_plan=${projectPlan}`);
        }
        // Ask for waves directory
        const wavesDir = await vscode.window.showInputBox({
            prompt: 'Waves output directory',
            placeHolder: '.waves',
            value: '.waves'
        });
        if (wavesDir && wavesDir !== '.waves') {
            finalCommand = finalCommand.replace('waves_directory=./.waves/', `waves_directory=${wavesDir}/`);
        }
    }
    // Create and show terminal
    const terminal = vscode.window.createTerminal({
        name: `Shadow Clone: ${selected.label.replace(/\$\([^)]+\)\s*/, '')}`,
        iconPath: new vscode.ThemeIcon('rocket')
    });
    // Track the terminal
    const sessionId = sessionManager.createSession(terminal, selected.label, finalCommand);
    // Copy command to clipboard
    await vscode.env.clipboard.writeText(finalCommand);
    // Show the terminal
    terminal.show();
    // Show instructions
    const message = await vscode.window.showInformationMessage(`Shadow Clone command copied to clipboard! Paste it into Claude Code.`, 'View Command', 'Track Sessions');
    if (message === 'View Command') {
        const doc = await vscode.workspace.openTextDocument({
            content: `# Shadow Clone Command\n\n\`\`\`\n${finalCommand}\n\`\`\`\n\nThis command has been copied to your clipboard.\n\n## To use:\n1. Make sure Claude Code is running in the terminal\n2. Paste this command\n3. Shadow Clone will orchestrate AI agents for your project\n\n## Session ID: ${sessionId}`,
            language: 'markdown'
        });
        vscode.window.showTextDocument(doc);
    }
    else if (message === 'Track Sessions') {
        vscode.commands.executeCommand('shadowClone.showSessions');
    }
}
async function launchClaudeWithArgumentsCommand(sessionManager, args) {
    // Quick launch with specific mode
    const mode = args?.mode || 'deploy';
    const command = shadowCloneCommands_1.SHADOW_CLONE_COMMANDS[mode.toUpperCase()] || shadowCloneCommands_1.SHADOW_CLONE_COMMANDS.DEPLOY;
    const terminal = vscode.window.createTerminal({
        name: `Shadow Clone: ${mode}`,
        iconPath: new vscode.ThemeIcon('rocket')
    });
    sessionManager.createSession(terminal, mode, command);
    await vscode.env.clipboard.writeText(command);
    terminal.show();
    vscode.window.showInformationMessage(`Shadow Clone ${mode} command copied to clipboard!`);
}
//# sourceMappingURL=claudeLauncher.js.map