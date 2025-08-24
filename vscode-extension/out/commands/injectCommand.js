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
exports.injectShadowCloneCommand = injectShadowCloneCommand;
exports.injectBuildCommand = injectBuildCommand;
exports.injectDebugCommand = injectDebugCommand;
exports.injectFeatureCommand = injectFeatureCommand;
const vscode = __importStar(require("vscode"));
const constants_1 = require("../utils/constants");
const telemetryHandler_1 = require("../services/telemetryHandler");
async function injectShadowCloneCommand(authProvider, commandType) {
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
    const apiEndpoint = (0, constants_1.getApiEndpoint)();
    // Build command based on type
    let command;
    if (!commandType) {
        // Show quick pick for command type
        const commandTypes = [
            { label: '$(checklist) Plan', value: 'plan', description: 'Create project plan without coding' },
            { label: '$(rocket) Build Project', value: 'build', description: 'Complete project build' },
            { label: '$(dashboard) Optimize', value: 'optimize', description: 'Performance improvements' },
            { label: '$(shield) Security Audit', value: 'audit', description: 'Security assessment' },
            { label: '$(sparkle) New Feature', value: 'feature', description: 'Build new functionality' },
            { label: '$(bug) Debug Mode', value: 'debug', description: 'Fix issues with AI agents' },
            { label: '$(sync) Refactor', value: 'refactor', description: 'Improve existing code' },
            { label: '$(search) Research', value: 'research', description: 'Analyze without changes' },
            { label: '$(history) Resume', value: 'resume', description: 'Continue previous session' }
        ];
        const selected = await vscode.window.showQuickPick(commandTypes, {
            placeHolder: 'Select Shadow Clone command to inject'
        });
        if (!selected)
            return;
        commandType = selected.value;
    }
    // Build the command text
    switch (commandType) {
        case 'build':
            command = `<task>
  <context>
    Shadow Clone Build Mode - Complete project implementation from specification.
    AI agent teams will build your entire project following best practices and standards.
  </context>
  
  <project_description>
    [Describe what you want to build here - be specific about features, tech stack, and requirements]
  </project_description>
  
  <instructions>
    1. First, fetch the Shadow Clone orchestration system:
       curl -X GET ${apiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"
    
    2. Load the returned Shadow Clone prompt into your context
    
    3. Execute with parameters: project_plan=./project-plan.md waves_directory=./.waves/
  </instructions>
</task>`;
            break;
        case 'debug':
            command = `<task>
  <context>
    Shadow Clone Debug Mode - Systematically identify and fix issues in your codebase.
    AI agents will analyze, diagnose, and resolve bugs with comprehensive testing.
  </context>
  
  <issue_description>
    [Describe the bug or issue you're experiencing - include error messages, expected vs actual behavior]
  </issue_description>
  
  <instructions>
    1. First, fetch the Shadow Clone orchestration system:
       curl -X GET ${apiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"
    
    2. Load the returned Shadow Clone prompt into your context
    
    3. Execute with parameters: mode=debug waves_directory=./.waves/
  </instructions>
</task>`;
            break;
        case 'feature':
            command = `<task>
  <context>
    Shadow Clone Feature Mode - Build new functionality with AI agent teams.
    Agents will implement, test, and integrate your feature following best practices.
  </context>
  
  <feature_description>
    [Describe the feature you want to add - include user stories, acceptance criteria, and technical requirements]
  </feature_description>
  
  <instructions>
    1. First, fetch the Shadow Clone orchestration system:
       curl -X GET ${apiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"
    
    2. Load the returned Shadow Clone prompt into your context
    
    3. Execute with parameters: mode=feature project_plan=./feature-spec.md waves_directory=./.waves/
  </instructions>
</task>`;
            break;
        case 'refactor':
            command = `<task>
  <context>
    Shadow Clone Refactor Mode - Improve code quality, structure, and maintainability.
    AI agents will analyze and refactor your code while preserving functionality.
  </context>
  
  <refactoring_goals>
    [Describe what you want to refactor and why - include specific files/components and desired improvements]
  </refactoring_goals>
  
  <instructions>
    1. First, fetch the Shadow Clone orchestration system:
       curl -X GET ${apiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"
    
    2. Load the returned Shadow Clone prompt into your context
    
    3. Execute with parameters: mode=refactor waves_directory=./.waves/
  </instructions>
</task>`;
            break;
        case 'optimize':
            command = `<task>
  <context>
    Shadow Clone Optimize Mode - Enhance performance and efficiency of your application.
    AI agents will profile, analyze, and optimize bottlenecks systematically.
  </context>
  
  <performance_issues>
    [Describe performance problems - slow queries, rendering issues, memory usage, etc.]
  </performance_issues>
  
  <instructions>
    1. First, fetch the Shadow Clone orchestration system:
       curl -X GET ${apiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"
    
    2. Load the returned Shadow Clone prompt into your context
    
    3. Execute with parameters: mode=optimize waves_directory=./.waves/
  </instructions>
</task>`;
            break;
        case 'audit':
            command = `<task>
  <context>
    Shadow Clone Security Audit Mode - Comprehensive security assessment of your codebase.
    AI agents will identify vulnerabilities, check compliance, and recommend fixes.
  </context>
  
  <security_concerns>
    [Describe any specific security concerns or compliance requirements (OWASP, PCI, etc.)]
  </security_concerns>
  
  <instructions>
    1. First, fetch the Shadow Clone orchestration system:
       curl -X GET ${apiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"
    
    2. Load the returned Shadow Clone prompt into your context
    
    3. Execute with parameters: mode=audit waves_directory=./.waves/
  </instructions>
</task>`;
            break;
        case 'research':
            command = `<task>
  <context>
    Shadow Clone Research Mode - Deep analysis and understanding of your codebase.
    AI agents will explore, document, and provide insights without making changes.
  </context>
  
  <research_questions>
    [What do you want to understand about this codebase? What are you looking for?]
  </research_questions>
  
  <instructions>
    1. First, fetch the Shadow Clone orchestration system:
       curl -X GET ${apiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"
    
    2. Load the returned Shadow Clone prompt into your context
    
    3. Execute with parameters: mode=research waves_directory=./.waves/
  </instructions>
</task>`;
            break;
        case 'resume':
            command = `<task>
  <context>
    Shadow Clone Resume - Continue from previous execution state.
    Picks up where the last wave left off, maintaining all context and progress.
  </context>
  
  <instructions>
    1. First, fetch the Shadow Clone orchestration system:
       curl -X GET ${apiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"
    
    2. Load the returned Shadow Clone prompt into your context
    
    3. Execute the 'resume' command to continue from the last checkpoint
  </instructions>
</task>`;
            break;
        case 'plan':
            command = `<task>
  <context>
    Shadow Clone Planning Mode - Create comprehensive project plan without writing code.
    This will generate a detailed technical specification and implementation roadmap.
  </context>
  
  <project_vision>
    [Describe your project idea, goals, and high-level requirements for planning]
  </project_vision>
  
  <instructions>
    1. First, fetch the Shadow Clone orchestration system:
       curl -X GET ${apiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"
    
    2. Load the returned Shadow Clone prompt into your context
    
    3. Execute the 'plan' command with your project vision to create a comprehensive plan
  </instructions>
</task>`;
            break;
        case 'custom':
            // Redirect to params builder for custom commands
            vscode.commands.executeCommand('shadowClone.buildParameters');
            return;
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
    (0, telemetryHandler_1.logCommandExecution)('shadowClone.inject', {
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
        vscode.window.showInformationMessage(`Shadow Clone ${commandType} command injected! Press Enter to execute or edit as needed.`, 'Show Help').then(selection => {
            if (selection === 'Show Help') {
                vscode.commands.executeCommand('shadowClone.showHelp');
            }
        });
    }
    else if (editor) {
        // Insert at cursor position in editor
        editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, command);
        });
        vscode.window.showInformationMessage(`Shadow Clone ${commandType} command injected!`);
    }
}
// Quick inject functions for specific commands
async function injectBuildCommand(authProvider) {
    return injectShadowCloneCommand(authProvider, 'build');
}
async function injectDebugCommand(authProvider) {
    return injectShadowCloneCommand(authProvider, 'debug');
}
async function injectFeatureCommand(authProvider) {
    return injectShadowCloneCommand(authProvider, 'feature');
}
//# sourceMappingURL=injectCommand.js.map