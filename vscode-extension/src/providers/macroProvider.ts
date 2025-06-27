import * as vscode from 'vscode';

export class MacroItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly macroCommand: string,
        public readonly description?: string,
        public readonly commandType?: string
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.tooltip = `${this.label} - ${this.description}`;
        this.contextValue = 'macro';
        
        // Set icon based on command type
        switch (commandType) {
            case 'deploy':
                this.iconPath = new vscode.ThemeIcon('rocket');
                break;
            case 'debug':
                this.iconPath = new vscode.ThemeIcon('bug');
                break;
            case 'feature':
                this.iconPath = new vscode.ThemeIcon('sparkle');
                break;
            case 'refactor':
                this.iconPath = new vscode.ThemeIcon('sync');
                break;
            case 'optimize':
                this.iconPath = new vscode.ThemeIcon('dashboard');
                break;
            case 'audit':
                this.iconPath = new vscode.ThemeIcon('shield');
                break;
            case 'research':
                this.iconPath = new vscode.ThemeIcon('search');
                break;
            case 'resume':
                this.iconPath = new vscode.ThemeIcon('history');
                break;
            case 'plan':
                this.iconPath = new vscode.ThemeIcon('checklist');
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

export class MacroProvider implements vscode.TreeDataProvider<MacroItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<MacroItem | undefined | null | void> = new vscode.EventEmitter<MacroItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<MacroItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private macros: MacroItem[] = [
        new MacroItem(
            'Deploy Project', 
            'deploy', 
            'Complete project build - Creates architecture, implements features, adds tests', 
            'deploy'
        ),
        new MacroItem(
            'Debug Issues', 
            'debug', 
            'Analyzes errors and fixes bugs - Great for test failures or runtime issues', 
            'debug'
        ),
        new MacroItem(
            'Build Feature', 
            'feature', 
            'Adds new functionality - Use with feature-spec.md for best results', 
            'feature'
        ),
        new MacroItem(
            'Refactor Code', 
            'refactor', 
            'Improves code quality - Extracts components, updates patterns, modernizes', 
            'refactor'
        ),
        new MacroItem(
            'Optimize Performance', 
            'optimize', 
            'Makes code faster - Database queries, rendering, algorithms', 
            'optimize'
        ),
        new MacroItem(
            'Security Audit', 
            'audit', 
            'Finds vulnerabilities - OWASP checks, penetration testing, hardening', 
            'audit'
        ),
        new MacroItem(
            'Research Mode', 
            'research', 
            'Analyzes without changing - Understand codebase, plan changes', 
            'research'
        ),
        new MacroItem(
            'Resume Session', 
            'resume', 
            'Continues previous work - Picks up where agents left off', 
            'resume'
        ),
        new MacroItem(
            'Plan Mode', 
            'plan', 
            'Creates detailed project plan - Agents analyze and plan without coding', 
            'plan'
        ),
        new MacroItem(
            'Custom Command', 
            'custom', 
            'Build your own - Set custom parameters for specific needs', 
            'custom'
        ),
        new MacroItem(
            '❓ Help / Legend', 
            'help', 
            'Learn Shadow Clone commands - Full documentation and examples', 
            'help'
        ),
        new MacroItem(
            '⚙️ Build Parameters', 
            'params', 
            'Interactive parameter builder - Select and configure execution arguments', 
            'params'
        )
    ];

    constructor() {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: MacroItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: MacroItem): Thenable<MacroItem[]> {
        if (!element) {
            // Return root level macros
            return Promise.resolve(this.macros);
        }
        return Promise.resolve([]);
    }

    getParent(element: MacroItem): vscode.ProviderResult<MacroItem> {
        return null;
    }
}