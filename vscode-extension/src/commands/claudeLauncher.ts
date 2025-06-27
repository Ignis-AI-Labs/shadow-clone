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

        // Wait a moment for Claude to initialize
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show command preview and options
        const action = await vscode.window.showInformationMessage(
            `Shadow Clone command ready. Review before sending?`,
            { modal: true, detail: finalCommand },
            'Send to Claude',
            'Edit First',
            'Cancel'
        );

        if (action === 'Send to Claude') {
            // Send the command directly to the terminal
            claudeTerminal.sendText(finalCommand);
            
            vscode.window.showInformationMessage(
                'Shadow Clone command sent! Claude will fetch the prompt from the API.',
                'Track Session'
            ).then(choice => {
                if (choice === 'Track Session') {
                    vscode.commands.executeCommand('shadowClone.showSessions');
                }
            });
        } else if (action === 'Edit First') {
            // Allow user to edit the command before sending
            const editedCommand = await vscode.window.showInputBox({
                prompt: 'Edit Shadow Clone command before sending',
                value: finalCommand,
                valueSelection: [0, finalCommand.length],
                placeHolder: 'Shadow Clone command...',
                validateInput: (value) => {
                    if (!value || value.trim().length === 0) {
                        return 'Command cannot be empty';
                    }
                    return null;
                }
            });

            if (editedCommand) {
                // Send the edited command
                claudeTerminal.sendText(editedCommand);
                
                // Update the session with edited command
                sessionManager.updateSessionCommand(sessionId, editedCommand);
                
                vscode.window.showInformationMessage(
                    'Custom Shadow Clone command sent!',
                    'Track Session'
                ).then(choice => {
                    if (choice === 'Track Session') {
                        vscode.commands.executeCommand('shadowClone.showSessions');
                    }
                });
            }
        }
        // If Cancel or closed, do nothing

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