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

export class MacroProvider implements vscode.TreeDataProvider<MacroItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<MacroItem | undefined | null | void> = new vscode.EventEmitter<MacroItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<MacroItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private macros: MacroItem[] = [
        new MacroItem(
            'Research Mode', 
            'research', 
            'Analyzes without changing - Explores codebase, understands patterns, plans improvements', 
            'research'
        ),
        new MacroItem(
            'Plan Mode', 
            'plan', 
            'Creates detailed project plan - Agents analyze requirements and design architecture without coding', 
            'plan'
        ),
        new MacroItem(
            'Build Project', 
            'build', 
            'Complete project build - Creates full architecture, implements all features, writes tests', 
            'build'
        ),
        new MacroItem(
            'Build Feature', 
            'feature', 
            'Adds new functionality - Implements a specific feature with tests and documentation', 
            'feature'
        ),
        new MacroItem(
            'Debug Issues', 
            'debug', 
            'Analyzes and fixes bugs - Investigates errors, traces issues, and implements fixes', 
            'debug'
        ),
        new MacroItem(
            'Optimize Performance', 
            'optimize', 
            'Makes code faster - Optimizes database queries, caching, rendering, and algorithms', 
            'optimize'
        ),
        new MacroItem(
            'Refactor Code', 
            'refactor', 
            'Improves code quality - Extracts components, updates patterns, removes duplication', 
            'refactor'
        ),
        new MacroItem(
            'Security Audit', 
            'audit', 
            'Finds vulnerabilities - OWASP security checks, penetration testing, and hardening', 
            'audit'
        ),
        new MacroItem(
            'Resume Session', 
            'resume', 
            'Continues previous work - Picks up from last wave execution with full context', 
            'resume'
        ),
        new MacroItem(
            '⚙️ Build Parameters', 
            'params', 
            'Interactive parameter builder - Select and configure all execution options or create custom commands', 
            'params'
        ),
        new MacroItem(
            '❓ Help / Legend', 
            'help', 
            'Learn Shadow Clone commands - Full documentation, examples, and best practices', 
            'help'
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