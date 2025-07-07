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
exports.MacroProvider = exports.MacroItem = void 0;
const vscode = __importStar(require("vscode"));
class MacroItem extends vscode.TreeItem {
    constructor(label, macroCommand, description, commandType) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.label = label;
        this.macroCommand = macroCommand;
        this.description = description;
        this.commandType = commandType;
        this.tooltip = `${this.label} - ${this.description}`;
        this.contextValue = 'prompt mode';
        // Set icon based on command type
        switch (commandType) {
            case 'plan':
                this.iconPath = new vscode.ThemeIcon('checklist');
                break;
            case 'build':
                this.iconPath = new vscode.ThemeIcon('rocket');
                break;
            case 'optimize':
                this.iconPath = new vscode.ThemeIcon('dashboard');
                break;
            case 'audit':
                this.iconPath = new vscode.ThemeIcon('shield');
                break;
            case 'feature':
                this.iconPath = new vscode.ThemeIcon('sparkle');
                break;
            case 'debug':
                this.iconPath = new vscode.ThemeIcon('bug');
                break;
            case 'refactor':
                this.iconPath = new vscode.ThemeIcon('sync');
                break;
            case 'research':
                this.iconPath = new vscode.ThemeIcon('search');
                break;
            case 'resume':
                this.iconPath = new vscode.ThemeIcon('history');
                break;
            case 'custom':
                this.iconPath = new vscode.ThemeIcon('edit');
                break;
            case 'help':
                this.iconPath = new vscode.ThemeIcon('question');
                break;
            case 'params':
                this.iconPath = new vscode.ThemeIcon('settings-gear');
                break;
            default:
                this.iconPath = new vscode.ThemeIcon('code');
        }
        // Set command to execute when clicked
        this.command = {
            command: 'shadowClone.executeMacro',
            title: 'Execute Macro',
            arguments: [this.commandType || 'custom']
        };
    }
}
exports.MacroItem = MacroItem;
class MacroProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.macros = [
            new MacroItem('Research Mode', 'research', 'Analyzes without changing - Explores codebase, understands patterns, plans improvements', 'research'),
            new MacroItem('Plan Mode', 'plan', 'Creates detailed project plan - Agents analyze requirements and design architecture without coding', 'plan'),
            new MacroItem('Build Project', 'build', 'Complete project build - Creates full architecture, implements all features, writes tests', 'build'),
            new MacroItem('Build Feature', 'feature', 'Adds new functionality - Implements a specific feature with tests and documentation', 'feature'),
            new MacroItem('Debug Issues', 'debug', 'Analyzes and fixes bugs - Investigates errors, traces issues, and implements fixes', 'debug'),
            new MacroItem('Optimize Performance', 'optimize', 'Makes code faster - Optimizes database queries, caching, rendering, and algorithms', 'optimize'),
            new MacroItem('Refactor Code', 'refactor', 'Improves code quality - Extracts components, updates patterns, removes duplication', 'refactor'),
            new MacroItem('Security Audit', 'audit', 'Finds vulnerabilities - OWASP security checks, penetration testing, and hardening', 'audit'),
            new MacroItem('Resume Session', 'resume', 'Continues previous work - Picks up from last wave execution with full context', 'resume'),
            new MacroItem('⚙️ Build Parameters', 'params', 'Interactive parameter builder - Select and configure all execution options or create custom commands', 'params'),
            new MacroItem('❓ Help / Legend', 'help', 'Learn Shadow Clone commands - Full documentation, examples, and best practices', 'help')
        ];
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            // Return root level macros
            return Promise.resolve(this.macros);
        }
        return Promise.resolve([]);
    }
    getParent(element) {
        return null;
    }
}
exports.MacroProvider = MacroProvider;
//# sourceMappingURL=macroProvider.js.map