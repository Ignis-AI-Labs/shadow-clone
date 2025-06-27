import * as vscode from 'vscode';
import { ClaudeSessionManager } from '../utils/claudeSessionManager';
import { PromptService } from '../services/promptService';
import { AuthProvider } from '../auth/authProvider';

export async function launchClaudeCommand(sessionManager: ClaudeSessionManager, authProvider: AuthProvider) {
    // Launch Claude Code in terminal
    const claudeTerminal = vscode.window.createTerminal({
        name: 'Claude Code',
        iconPath: new vscode.ThemeIcon('terminal')
    });
    
    // Run claude command to start Claude Code
    claudeTerminal.sendText('claude');
    claudeTerminal.show();

    try {
        // Initialize prompt service
        const promptService = new PromptService(authProvider);
        
        // Fetch available modes from API
        const modes = await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Loading Shadow Clone modes...',
            cancellable: false
        }, async () => {
            return await promptService.getModes();
        });

        // Build command options dynamically
        const commandOptions = modes.map(mode => ({
            label: `$(rocket) ${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`,
            description: getModedescription(mode),
            mode: mode
        }));

        // Add utility commands
        commandOptions.push(
            {
                label: '$(history) Resume Previous',
                description: 'Continue from last session',
                mode: 'resume'
            },
            {
                label: '$(info) Custom Configuration',
                description: 'Specify custom parameters',
                mode: 'custom'
            }
        );

        const selected = await vscode.window.showQuickPick(commandOptions, {
            placeHolder: 'Select Shadow Clone mode'
        });

        if (!selected) return;

        // Build the command with prompts from API
        let finalCommand: string;

        if (selected.mode === 'resume') {
            finalCommand = await promptService.buildCommand({
                mode: 'resume',
                wavesDirectory: './.waves/'
            });
        } else {
            // Get parameters
            const projectPlan = await vscode.window.showInputBox({
                prompt: 'Project plan file (optional)',
                placeHolder: './project-plan.md',
                value: './project-plan.md'
            });

            const wavesDir = await vscode.window.showInputBox({
                prompt: 'Waves output directory',
                placeHolder: './.waves/',
                value: './.waves/'
            });

            // Build command with API prompts
            finalCommand = await promptService.buildCommand({
                mode: selected.mode,
                projectPlan: projectPlan || './project-plan.md',
                wavesDirectory: wavesDir || './.waves/'
            });
        }

        // Track the session
        const sessionId = sessionManager.createSession(claudeTerminal, selected.label, finalCommand);

        // Copy to clipboard
        await vscode.env.clipboard.writeText(finalCommand);

        // Show instructions
        const message = await vscode.window.showInformationMessage(
            `Shadow Clone prompt loaded! Command copied to clipboard. Paste it when Claude is ready.`,
            'View Full Prompt',
            'Track Sessions'
        );

        if (message === 'View Full Prompt') {
            const doc = await vscode.workspace.openTextDocument({
                content: `# Shadow Clone Command\n\n${finalCommand}\n\n## Session ID: ${sessionId}\n\n## Instructions:\n1. Wait for Claude Code to fully start\n2. Paste this entire command\n3. Shadow Clone will orchestrate AI agents for your project`,
                language: 'markdown'
            });
            vscode.window.showTextDocument(doc);
        } else if (message === 'Track Sessions') {
            vscode.commands.executeCommand('shadowClone.showSessions');
        }

    } catch (error) {
        vscode.window.showErrorMessage(`Failed to load Shadow Clone prompts: ${error}`);
        console.error('Shadow Clone prompt loading error:', error);
    }
}

export async function launchClaudeWithArgumentsCommand(
    sessionManager: ClaudeSessionManager, 
    authProvider: AuthProvider,
    args?: any
) {
    // Quick launch with specific mode
    await launchClaudeCommand(sessionManager, authProvider);
}

function getModedescription(mode: string): string {
    const descriptions: Record<string, string> = {
        'audit': 'Security and quality assessment',
        'debug': 'Fix issues with AI agents',
        'feature': 'Build new features',
        'optimize': 'Performance improvements',
        'refactor': 'Improve existing code',
        'research': 'Analyze codebase without changes'
    };
    return descriptions[mode] || 'Custom Shadow Clone mode';
}