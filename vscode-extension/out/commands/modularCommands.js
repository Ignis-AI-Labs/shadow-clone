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
exports.ModularCommands = void 0;
exports.registerModularCommands = registerModularCommands;
const vscode = __importStar(require("vscode"));
/**
 * Shadow Clone Modular Commands - Prompt Engineering Macro Injection
 *
 * These commands inject Shadow Clone prompt engineering macros into any AI conversation.
 * They work by copying formatted commands to clipboard or inserting into active editor.
 * Think of these as "hotkeys" for professional AI methodologies.
 */
class ModularCommands {
    constructor(authProvider) {
        this.authProvider = authProvider;
    }
    /**
     * Quick Fix - Inject rapid problem-solving methodology
     */
    async quickFix() {
        const issueTypes = ['bug', 'style', 'logic', 'performance', 'security'];
        const issueType = await vscode.window.showQuickPick(issueTypes, {
            placeHolder: 'Select issue type'
        });
        if (!issueType)
            return;
        const description = await vscode.window.showInputBox({
            prompt: 'Describe the issue',
            placeHolder: 'e.g., Null pointer exception in user service'
        });
        if (!description)
            return;
        const command = `quick_fix issueType="${issueType}" description="${description}"`;
        await this.injectCommand(command, `Quick fix for ${issueType}: ${description}`);
    }
    /**
     * Deploy Single Specialist - Inject expert methodology
     */
    async deploySpecialist() {
        const specialists = [
            'react_expert',
            'api_designer',
            'database_architect',
            'test_engineer',
            'performance_analyst',
            'security_auditor',
            'code_reviewer',
            'documentation_writer'
        ];
        const specialization = await vscode.window.showQuickPick(specialists, {
            placeHolder: 'Select specialist type'
        });
        if (!specialization)
            return;
        const task = await vscode.window.showInputBox({
            prompt: 'What should the specialist do?',
            placeHolder: 'e.g., Optimize component rendering performance'
        });
        if (!task)
            return;
        const command = `deploy_specialist_agent specialization="${specialization}" task="${task}"`;
        await this.injectCommand(command, `${specialization} for: ${task}`);
    }
    /**
     * Code Review - Inject targeted review methodology
     */
    async codeReview() {
        const reviewTypes = ['security', 'performance', 'quality', 'architecture', 'comprehensive'];
        const reviewType = await vscode.window.showQuickPick(reviewTypes, {
            placeHolder: 'Select review focus'
        });
        if (!reviewType)
            return;
        // Get active file or selection
        const editor = vscode.window.activeTextEditor;
        const files = editor ? [editor.document.fileName] : [];
        const command = `code_review_team reviewType="${reviewType}" files=${JSON.stringify(files)}`;
        await this.injectCommand(command, `${reviewType} review for current file`);
    }
    /**
     * Generate Tests - Inject test creation methodology
     */
    async generateTests() {
        const testTypes = ['unit', 'integration', 'e2e', 'performance', 'security'];
        const testType = await vscode.window.showQuickPick(testTypes, {
            placeHolder: 'Select test type'
        });
        if (!testType)
            return;
        const editor = vscode.window.activeTextEditor;
        const targetFiles = editor ? [editor.document.fileName] : [];
        const command = `generate_tests testType="${testType}" targetFiles=${JSON.stringify(targetFiles)}`;
        await this.injectCommand(command, `Generate ${testType} tests`);
    }
    /**
     * Single Wave Execution - Inject focused phase methodology
     */
    async executeSingleWave() {
        const waveTypes = ['research', 'planning', 'implementation', 'testing', 'documentation', 'review'];
        const waveType = await vscode.window.showQuickPick(waveTypes, {
            placeHolder: 'Select wave type'
        });
        if (!waveType)
            return;
        const scope = await vscode.window.showInputBox({
            prompt: 'What should this wave focus on?',
            placeHolder: 'e.g., OAuth implementation best practices'
        });
        if (!scope)
            return;
        const command = `execute_single_wave waveType="${waveType}" scope="${scope}"`;
        await this.injectCommand(command, `${waveType} wave: ${scope}`);
    }
    /**
     * Create Documentation - Inject documentation methodology
     */
    async createDocumentation() {
        const docTypes = ['api', 'user_guide', 'developer', 'architecture', 'inline'];
        const docType = await vscode.window.showQuickPick(docTypes, {
            placeHolder: 'Select documentation type'
        });
        if (!docType)
            return;
        const scope = await vscode.window.showInputBox({
            prompt: 'What to document?',
            placeHolder: 'e.g., REST API endpoints'
        });
        if (!scope)
            return;
        const command = `create_documentation docType="${docType}" scope="${scope}"`;
        await this.injectCommand(command, `Create ${docType} documentation`);
    }
    /**
     * Architecture Consultation - Inject design methodology
     */
    async architectureConsult() {
        const consultTypes = [
            'design_review',
            'pattern_recommendation',
            'scalability_analysis',
            'migration_planning'
        ];
        const consultationType = await vscode.window.showQuickPick(consultTypes, {
            placeHolder: 'Select consultation type'
        });
        if (!consultationType)
            return;
        const context = await vscode.window.showInputBox({
            prompt: 'Describe your current system',
            placeHolder: 'e.g., Monolithic Node.js app with 100K users'
        });
        if (!context)
            return;
        const command = `architecture_consultant consultationType="${consultationType}" context="${context}"`;
        await this.injectCommand(command, `Architecture ${consultationType}`);
    }
    /**
     * Show Commands - Display available Shadow Clone commands
     */
    async showCommands() {
        const categories = ['all', 'orchestration', 'teams', 'rapid', 'documentation'];
        const category = await vscode.window.showQuickPick(categories, {
            placeHolder: 'Select command category'
        });
        const command = `show_commands${category && category !== 'all' ? ` category="${category}"` : ''}`;
        await this.injectCommand(command, 'Show Shadow Clone commands');
    }
    /**
     * Inject command into active context
     */
    async injectCommand(command, description) {
        const options = ['Copy to Clipboard', 'Insert at Cursor', 'Open in Terminal'];
        const choice = await vscode.window.showQuickPick(options, {
            placeHolder: `How to inject: ${description}`
        });
        if (!choice)
            return;
        // Format command for MCP or direct use
        const formattedCommand = `@shadow-clone ${command}`;
        switch (choice) {
            case 'Copy to Clipboard':
                await vscode.env.clipboard.writeText(formattedCommand);
                vscode.window.showInformationMessage(`📋 Copied: ${formattedCommand}`);
                break;
            case 'Insert at Cursor':
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    editor.edit(editBuilder => {
                        editBuilder.insert(editor.selection.active, formattedCommand);
                    });
                    vscode.window.showInformationMessage(`✏️ Inserted: ${formattedCommand}`);
                }
                else {
                    vscode.window.showWarningMessage('No active editor to insert into');
                }
                break;
            case 'Open in Terminal':
                const terminal = vscode.window.createTerminal('Shadow Clone');
                terminal.show();
                terminal.sendText(`# Shadow Clone Command:\n# ${formattedCommand}`);
                vscode.window.showInformationMessage(`🖥️ Sent to terminal: ${formattedCommand}`);
                break;
        }
    }
}
exports.ModularCommands = ModularCommands;
/**
 * Register all modular commands
 */
function registerModularCommands(context, authProvider) {
    const modularCommands = new ModularCommands(authProvider);
    // Quick modular tools
    context.subscriptions.push(vscode.commands.registerCommand('shadowClone.quickFix', () => modularCommands.quickFix()));
    context.subscriptions.push(vscode.commands.registerCommand('shadowClone.deploySpecialist', () => modularCommands.deploySpecialist()));
    context.subscriptions.push(vscode.commands.registerCommand('shadowClone.codeReview', () => modularCommands.codeReview()));
    context.subscriptions.push(vscode.commands.registerCommand('shadowClone.generateTests', () => modularCommands.generateTests()));
    context.subscriptions.push(vscode.commands.registerCommand('shadowClone.executeSingleWave', () => modularCommands.executeSingleWave()));
    context.subscriptions.push(vscode.commands.registerCommand('shadowClone.createDocumentation', () => modularCommands.createDocumentation()));
    context.subscriptions.push(vscode.commands.registerCommand('shadowClone.architectureConsult', () => modularCommands.architectureConsult()));
    context.subscriptions.push(vscode.commands.registerCommand('shadowClone.showCommands', () => modularCommands.showCommands()));
}
//# sourceMappingURL=modularCommands.js.map