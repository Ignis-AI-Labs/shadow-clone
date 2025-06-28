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
exports.PARAMETER_SNIPPETS = void 0;
exports.buildParametersCommand = buildParametersCommand;
exports.injectParametersCommand = injectParametersCommand;
exports.injectParameterSnippet = injectParameterSnippet;
const vscode = __importStar(require("vscode"));
async function buildParametersCommand() {
    // Common parameters with descriptions
    const commonParams = [
        { label: 'waves_directory', description: 'Where agents save work (default: ./.waves/)', default: './.waves/' },
        { label: 'project_plan', description: 'Path to project requirements file', default: './project-plan.md' },
        { label: 'mode', description: 'Agent mode (feature, debug, refactor, etc.)', default: '' },
        { label: 'wave_count', description: 'Number of waves (default: dynamic)', default: 'dynamic' },
        { label: 'num_teams', description: 'Number of agent teams (1-3)', default: '1' },
        { label: 'team_composition', description: 'Team makeup (fullstack, frontend, backend, etc.)', default: 'fullstack' },
        { label: 'git_strategy', description: 'Git workflow (feature-branch, direct, none)', default: 'feature-branch' },
        { label: 'workspace_dir', description: 'Project root directory', default: './' },
        { label: 'enable_testing', description: 'Auto-generate tests (true/false)', default: 'true' },
        { label: 'enable_docs', description: 'Auto-generate documentation (true/false)', default: 'true' },
        { label: 'max_agents_per_wave', description: 'Max concurrent agents (1-10)', default: '10' },
        { label: 'execution_timeout', description: 'Max time per wave in minutes', default: '30' }
    ];
    // Multi-step parameter builder
    const selectedParams = [];
    // Step 1: Select which parameters to include
    const paramSelection = await vscode.window.showQuickPick(commonParams.map(p => ({
        label: p.label,
        description: p.description,
        picked: ['waves_directory', 'project_plan'].includes(p.label) // Default selections
    })), {
        canPickMany: true,
        placeHolder: 'Select parameters to include (Space to toggle, Enter to confirm)'
    });
    if (!paramSelection || paramSelection.length === 0) {
        return undefined;
    }
    // Step 2: Get values for each selected parameter
    for (const param of paramSelection) {
        const paramDef = commonParams.find(p => p.label === param.label);
        if (!paramDef)
            continue;
        const value = await vscode.window.showInputBox({
            prompt: `Value for ${param.label}`,
            placeHolder: paramDef.default,
            value: paramDef.default,
            ignoreFocusOut: true,
            validateInput: (value) => {
                // Basic validation
                if (!value || value.trim().length === 0) {
                    return 'Value cannot be empty';
                }
                // Specific validations
                if (param.label === 'num_teams' || param.label === 'max_agents_per_wave') {
                    const num = parseInt(value);
                    if (isNaN(num) || num < 1 || num > 10) {
                        return 'Must be a number between 1 and 10';
                    }
                }
                return null;
            }
        });
        if (value !== undefined) {
            selectedParams.push({
                name: param.label,
                value: value,
                description: param.description
            });
        }
    }
    // Build the parameter string
    if (selectedParams.length > 0) {
        return selectedParams.map(p => `${p.name}=${p.value}`).join(' ');
    }
    return undefined;
}
async function injectParametersCommand() {
    const params = await buildParametersCommand();
    if (!params)
        return;
    // Check for active terminal or editor
    const activeTerminal = vscode.window.activeTerminal;
    const editor = vscode.window.activeTextEditor;
    if (activeTerminal) {
        activeTerminal.sendText(params, false);
        activeTerminal.show();
    }
    else if (editor) {
        editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, params);
        });
    }
    else {
        // Copy to clipboard as fallback
        await vscode.env.clipboard.writeText(params);
        vscode.window.showInformationMessage('Parameters copied to clipboard: ' + params);
    }
}
// Quick parameter snippets
exports.PARAMETER_SNIPPETS = {
    MINIMAL: 'waves_directory=./.waves/',
    STANDARD: 'project_plan=./project-plan.md waves_directory=./.waves/',
    FULL_STACK: 'project_plan=./project-plan.md waves_directory=./.waves/ team_composition=fullstack',
    MULTI_TEAM: 'waves_directory=./.waves/ num_teams=3 wave_count=3',
    TESTING_FOCUS: 'waves_directory=./.waves/ enable_testing=true enable_docs=true',
    PERFORMANCE: 'waves_directory=./.waves/ mode=optimize max_agents_per_wave=10',
    QUICK_DEBUG: 'mode=debug waves_directory=./.waves/ execution_timeout=15',
    ENTERPRISE: 'waves_directory=./.waves/ git_strategy=feature-branch enable_testing=true enable_docs=true num_teams=3'
};
async function injectParameterSnippet(snippetName) {
    const snippet = exports.PARAMETER_SNIPPETS[snippetName];
    const activeTerminal = vscode.window.activeTerminal;
    const editor = vscode.window.activeTextEditor;
    if (activeTerminal) {
        activeTerminal.sendText(snippet, false);
        activeTerminal.show();
    }
    else if (editor) {
        editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, snippet);
        });
    }
}
//# sourceMappingURL=parameterBuilder.js.map