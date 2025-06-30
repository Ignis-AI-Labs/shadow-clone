import * as vscode from 'vscode';
import { AuthProvider } from '../auth/authProvider';
import { getApiEndpoint, getPromptApiEndpoint } from '../utils/constants';
import { logCommandExecution } from '../services/telemetryHandler';

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
    const promptApiEndpoint = getPromptApiEndpoint();
    
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
            command = `# Shadow Clone Deploy Command

## Project Description
[Describe what you want to build here - be specific about features, tech stack, and requirements]

## Execution Parameters
project_plan=./project-plan.md waves_directory=./.waves/

## Now fetch and execute Shadow Clone
Fetch and execute the Shadow Clone orchestration system from the Cloudflare API:
curl -X GET ${promptApiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"

Then load the returned prompt and execute with the parameters above.`;
            break;
            
        case 'debug':
            command = `# Shadow Clone Debug Command

## Issue Description
[Describe the bug or issue you're experiencing - include error messages, expected vs actual behavior]

## Execution Parameters
mode=debug waves_directory=./.waves/

## Now fetch and execute Shadow Clone
Fetch and execute the Shadow Clone orchestration system from the Cloudflare API:
curl -X GET ${promptApiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"
curl -X GET ${promptApiEndpoint}/api/prompts/modes/debug -H "X-API-Key: ${apiKey}"

Then load the returned prompts and execute with the parameters above.`;
            break;
            
        case 'feature':
            command = `# Shadow Clone Feature Build Command

## Feature Description
[Describe the feature you want to add - include user stories, acceptance criteria, and technical requirements]

## Execution Parameters
mode=feature project_plan=./feature-spec.md waves_directory=./.waves/

## Now fetch and execute Shadow Clone
Fetch and execute the Shadow Clone orchestration system from the Cloudflare API:
curl -X GET ${promptApiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"
curl -X GET ${promptApiEndpoint}/api/prompts/modes/feature -H "X-API-Key: ${apiKey}"

Then load the returned prompts and execute with the parameters above.`;
            break;
            
        case 'refactor':
            command = `# Shadow Clone Refactor Command

## Refactoring Goals
[Describe what you want to refactor and why - include specific files/components and desired improvements]

## Execution Parameters
mode=refactor waves_directory=./.waves/

## Now fetch and execute Shadow Clone
Fetch and execute the Shadow Clone orchestration system from the Cloudflare API:
curl -X GET ${promptApiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"
curl -X GET ${promptApiEndpoint}/api/prompts/modes/refactor -H "X-API-Key: ${apiKey}"

Then load the returned prompts and execute with the parameters above.`;
            break;
            
        case 'optimize':
            command = `# Shadow Clone Optimize Command

## Performance Issues
[Describe performance problems - slow queries, rendering issues, memory usage, etc.]

## Execution Parameters
mode=optimize waves_directory=./.waves/

## Now fetch and execute Shadow Clone
Fetch and execute the Shadow Clone orchestration system from the Cloudflare API:
curl -X GET ${promptApiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"
curl -X GET ${promptApiEndpoint}/api/prompts/modes/optimize -H "X-API-Key: ${apiKey}"

Then load the returned prompts and execute with the parameters above.`;
            break;
            
        case 'audit':
            command = `# Shadow Clone Security Audit Command

## Security Concerns
[Describe any specific security concerns or compliance requirements (OWASP, PCI, etc.)]

## Execution Parameters
mode=audit waves_directory=./.waves/

## Now fetch and execute Shadow Clone
Fetch and execute the Shadow Clone orchestration system from the Cloudflare API:
curl -X GET ${promptApiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"
curl -X GET ${promptApiEndpoint}/api/prompts/modes/audit -H "X-API-Key: ${apiKey}"

Then load the returned prompts and execute with the parameters above.`;
            break;
            
        case 'research':
            command = `# Shadow Clone Research Command

## Research Questions
[What do you want to understand about this codebase? What are you looking for?]

## Execution Parameters
mode=research waves_directory=./.waves/

## Now fetch and execute Shadow Clone
Fetch and execute the Shadow Clone orchestration system from the Cloudflare API:
curl -X GET ${promptApiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"

Then load the returned prompt and execute with the parameters above.`;
            break;
            
        case 'resume':
            command = `# Shadow Clone Resume Command
# Resume previous Shadow Clone session

Fetch and execute the Shadow Clone orchestration system from the Cloudflare API:
curl -X GET ${promptApiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"

Then load the returned prompt and execute the 'resume' command.`;
            break;
            
        case 'plan':
            command = `# Shadow Clone Plan Command

## Project Vision
[Describe your project idea, goals, and high-level requirements for planning]

## Execution Mode
Use 'plan' command to create detailed project plan without implementation

## Now fetch and execute Shadow Clone
Fetch and execute the Shadow Clone orchestration system from the Cloudflare API:
curl -X GET ${promptApiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"

Then load the returned prompt and execute the 'plan' command.`;
            break;
            
        case 'custom':
            const customParams = await vscode.window.showInputBox({
                prompt: 'Enter custom parameters',
                placeHolder: 'e.g., mode=custom project_plan=./plan.md waves_directory=./.waves/',
                value: 'waves_directory=./.waves/'
            });
            
            if (!customParams) return;
            
            command = `# Shadow Clone Custom Command

## Project Context
[Describe what you want Shadow Clone to do]

## Execution Parameters
${customParams}

## Now fetch and execute Shadow Clone
Fetch and execute the Shadow Clone orchestration system from the Cloudflare API:
curl -X GET ${promptApiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"

Then load the returned prompt and execute with the parameters above.`;
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
    
    // Log telemetry
    logCommandExecution('shadowClone.inject', {
        commandType,
        destination: activeTerminal ? 'terminal' : 'editor',
        apiEndpoint,
    });
    
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