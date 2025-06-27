import * as vscode from 'vscode';
import { AuthProvider } from '../auth/authProvider';
import { getApiEndpoint } from '../utils/constants';

export async function injectShadowCloneCommand(authProvider: AuthProvider, commandType?: string) {
    // Check if we have an active terminal first (for Claude sessions)
    const activeTerminal = vscode.window.activeTerminal;
    const editor = vscode.window.activeTextEditor;
    
    if (!activeTerminal && !editor) {
        vscode.window.showErrorMessage('No active terminal or text editor');
        return;
    }

    const apiKey = await authProvider.getApiKey();
    if (!apiKey) {
        vscode.window.showErrorMessage('Please authenticate first');
        vscode.commands.executeCommand('shadowClone.authenticate');
        return;
    }

    const apiEndpoint = getApiEndpoint();
    
    // Build command based on type
    let command: string;
    
    if (!commandType) {
        // Show quick pick for command type
        const commandTypes = [
            { label: '$(rocket) Full Deploy', value: 'deploy', description: 'Complete project deployment' },
            { label: '$(bug) Debug Mode', value: 'debug', description: 'Fix issues with AI agents' },
            { label: '$(sparkle) New Feature', value: 'feature', description: 'Build new functionality' },
            { label: '$(sync) Refactor', value: 'refactor', description: 'Improve existing code' },
            { label: '$(dashboard) Optimize', value: 'optimize', description: 'Performance improvements' },
            { label: '$(shield) Security Audit', value: 'audit', description: 'Security assessment' },
            { label: '$(search) Research', value: 'research', description: 'Analyze without changes' },
            { label: '$(history) Resume', value: 'resume', description: 'Continue previous session' },
            { label: '$(checklist) Plan', value: 'plan', description: 'Create project plan without coding' },
            { label: '$(list-flat) Custom', value: 'custom', description: 'Custom command' }
        ];
        
        const selected = await vscode.window.showQuickPick(commandTypes, {
            placeHolder: 'Select Shadow Clone command to inject'
        });
        
        if (!selected) return;
        commandType = selected.value;
    }
    
    // Build the command text
    switch (commandType) {
        case 'deploy':
            command = `Fetch the Shadow Clone orchestration prompt from the API:
curl -X GET ${apiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"

Load shadow-clone-prompt.md and execute with project_plan=./project-plan.md waves_directory=./.waves/`;
            break;
            
        case 'debug':
            command = `Fetch the Shadow Clone orchestration prompt from the API:
curl -X GET ${apiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"
Also fetch the debug mode: curl -X GET ${apiEndpoint}/api/prompts/modes/debug -H "X-API-Key: ${apiKey}"

Load shadow-clone-prompt.md and execute with mode=debug waves_directory=./.waves/`;
            break;
            
        case 'feature':
            command = `Fetch the Shadow Clone orchestration prompt from the API:
curl -X GET ${apiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"
Also fetch the feature mode: curl -X GET ${apiEndpoint}/api/prompts/modes/feature -H "X-API-Key: ${apiKey}"

Load shadow-clone-prompt.md and execute with mode=feature project_plan=./feature-spec.md waves_directory=./.waves/`;
            break;
            
        case 'refactor':
            command = `Fetch the Shadow Clone orchestration prompt from the API:
curl -X GET ${apiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"
Also fetch the refactor mode: curl -X GET ${apiEndpoint}/api/prompts/modes/refactor -H "X-API-Key: ${apiKey}"

Load shadow-clone-prompt.md and execute with mode=refactor waves_directory=./.waves/`;
            break;
            
        case 'optimize':
            command = `Fetch the Shadow Clone orchestration prompt from the API:
curl -X GET ${apiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"
Also fetch the optimize mode: curl -X GET ${apiEndpoint}/api/prompts/modes/optimize -H "X-API-Key: ${apiKey}"

Load shadow-clone-prompt.md and execute with mode=optimize waves_directory=./.waves/`;
            break;
            
        case 'audit':
            command = `Fetch the Shadow Clone orchestration prompt from the API:
curl -X GET ${apiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"
Also fetch the audit mode: curl -X GET ${apiEndpoint}/api/prompts/modes/audit -H "X-API-Key: ${apiKey}"

Load shadow-clone-prompt.md and execute with mode=audit waves_directory=./.waves/`;
            break;
            
        case 'research':
            command = `Fetch the Shadow Clone orchestration prompt from the API:
curl -X GET ${apiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"

Load shadow-clone-prompt.md and execute with mode=research waves_directory=./.waves/`;
            break;
            
        case 'resume':
            command = `Fetch the Shadow Clone orchestration prompt from the API:
curl -X GET ${apiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"

Load shadow-clone-prompt.md and resume`;
            break;
            
        case 'plan':
            command = `Fetch the Shadow Clone orchestration prompt from the API:
curl -X GET ${apiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"

Load shadow-clone-prompt.md and plan`;
            break;
            
        case 'custom':
            const customParams = await vscode.window.showInputBox({
                prompt: 'Enter custom parameters',
                placeHolder: 'e.g., mode=custom project_plan=./plan.md waves_directory=./.waves/',
                value: 'waves_directory=./.waves/'
            });
            
            if (!customParams) return;
            
            command = `Fetch the Shadow Clone orchestration prompt from the API:
curl -X GET ${apiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"

Execute with: ${customParams}`;
            break;
            
        case 'help':
            // Don't inject anything, just show help
            vscode.commands.executeCommand('shadowClone.showHelp');
            return;
            
        case 'params':
            // Launch parameter builder
            vscode.commands.executeCommand('shadowClone.buildParameters');
            return;
            
        default:
            return;
    }
    
    // Inject into terminal or editor
    if (activeTerminal) {
        // Send to terminal
        activeTerminal.sendText(command, false); // false = don't execute, just type it
        activeTerminal.show();
        
        // Show help tip
        vscode.window.showInformationMessage(
            `Shadow Clone ${commandType} command injected! Press Enter to execute or edit as needed.`,
            'Show Help'
        ).then(selection => {
            if (selection === 'Show Help') {
                vscode.commands.executeCommand('shadowClone.showHelp');
            }
        });
    } else if (editor) {
        // Insert at cursor position in editor
        editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, command);
        });
        
        vscode.window.showInformationMessage(`Shadow Clone ${commandType} command injected!`);
    }
}

// Quick inject functions for specific commands
export async function injectDeployCommand(authProvider: AuthProvider) {
    return injectShadowCloneCommand(authProvider, 'deploy');
}

export async function injectDebugCommand(authProvider: AuthProvider) {
    return injectShadowCloneCommand(authProvider, 'debug');
}

export async function injectFeatureCommand(authProvider: AuthProvider) {
    return injectShadowCloneCommand(authProvider, 'feature');
}

export async function injectCustomCommand(authProvider: AuthProvider) {
    return injectShadowCloneCommand(authProvider, 'custom');
}