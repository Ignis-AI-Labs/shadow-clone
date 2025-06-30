import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';

const execAsync = promisify(exec);

export interface DependencyStatus {
    nodeInstalled: boolean;
    nodeVersion: string | null;
    nodeVersionValid: boolean;
    npmInstalled: boolean;
    npmVersion: string | null;
    claudeInstalled: boolean;
    claudeVersion: string | null;
    nvmInstalled: boolean;
}

export class DependencyChecker {
    private static instance: DependencyChecker;
    private statusBarItem: vscode.StatusBarItem;

    private constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left,
            100
        );
    }

    public static getInstance(): DependencyChecker {
        if (!DependencyChecker.instance) {
            DependencyChecker.instance = new DependencyChecker();
        }
        return DependencyChecker.instance;
    }

    public async checkAllDependencies(): Promise<DependencyStatus> {
        const status: DependencyStatus = {
            nodeInstalled: false,
            nodeVersion: null,
            nodeVersionValid: false,
            npmInstalled: false,
            npmVersion: null,
            claudeInstalled: false,
            claudeVersion: null,
            nvmInstalled: false
        };

        // Check Node.js
        try {
            const { stdout: nodeVersion } = await execAsync('node --version');
            status.nodeInstalled = true;
            status.nodeVersion = nodeVersion.trim();
            
            // Check if version is 18 or higher
            const majorVersion = parseInt(nodeVersion.match(/v(\d+)/)?.[1] || '0');
            status.nodeVersionValid = majorVersion >= 18;
        } catch (error) {
            console.log('Node.js not found');
        }

        // Check npm
        try {
            const { stdout: npmVersion } = await execAsync('npm --version');
            status.npmInstalled = true;
            status.npmVersion = npmVersion.trim();
        } catch (error) {
            console.log('npm not found');
        }

        // Check Claude Code
        try {
            const { stdout: claudeVersion } = await execAsync('claude --version');
            status.claudeInstalled = true;
            status.claudeVersion = claudeVersion.trim();
        } catch (error) {
            console.log('Claude Code not found');
        }

        // Check nvm
        try {
            // Check if nvm is available
            const nvmDir = path.join(process.env.HOME || '', '.nvm');
            status.nvmInstalled = fs.existsSync(nvmDir);
        } catch (error) {
            console.log('nvm not found');
        }

        this.updateStatusBar(status);
        return status;
    }

    private updateStatusBar(status: DependencyStatus) {
        if (!status.nodeInstalled || !status.claudeInstalled) {
            this.statusBarItem.text = '$(warning) Shadow Clone: Missing Dependencies';
            this.statusBarItem.tooltip = this.getTooltipText(status);
            this.statusBarItem.command = 'shadowClone.checkDependencies';
            this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
            this.statusBarItem.show();
        } else if (!status.nodeVersionValid) {
            this.statusBarItem.text = '$(warning) Shadow Clone: Node.js Update Required';
            this.statusBarItem.tooltip = `Current: ${status.nodeVersion}, Required: v18.0.0 or higher`;
            this.statusBarItem.command = 'shadowClone.checkDependencies';
            this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
            this.statusBarItem.show();
        } else {
            this.statusBarItem.hide();
        }
    }

    private getTooltipText(status: DependencyStatus): string {
        const missing = [];
        if (!status.nodeInstalled) missing.push('Node.js');
        if (!status.npmInstalled) missing.push('npm');
        if (!status.claudeInstalled) missing.push('Claude Code CLI');
        
        return `Missing: ${missing.join(', ')}\nClick to install`;
    }

    public async installDependencies(context: vscode.ExtensionContext): Promise<void> {
        const status = await this.checkAllDependencies();
        
        // Show setup guide
        const panel = vscode.window.createWebviewPanel(
            'shadowCloneDependencies',
            'Shadow Clone Setup',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.webview.html = this.getSetupWebviewContent(status, context);
        
        // Handle messages from webview
        panel.webview.onDidReceiveMessage(
            async message => {
                switch (message.command) {
                    case 'installNode':
                        await this.installNodeJs();
                        break;
                    case 'installClaude':
                        await this.installClaudeCode();
                        break;
                    case 'checkAgain':
                        const newStatus = await this.checkAllDependencies();
                        panel.webview.html = this.getSetupWebviewContent(newStatus, context);
                        break;
                    case 'runSetupScript':
                        await this.runSetupScript(context);
                        break;
                }
            },
            undefined,
            context.subscriptions
        );
    }

    private getSetupWebviewContent(status: DependencyStatus, context: vscode.ExtensionContext): string {
        const allGood = status.nodeInstalled && status.nodeVersionValid && status.claudeInstalled;
        
        return `<!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: var(--vscode-font-family);
                    padding: 20px;
                    color: var(--vscode-foreground);
                    background-color: var(--vscode-editor-background);
                }
                .status-item {
                    margin: 15px 0;
                    padding: 15px;
                    border-radius: 5px;
                    background-color: var(--vscode-editor-inactiveSelectionBackground);
                }
                .status-good {
                    border-left: 4px solid #4CAF50;
                }
                .status-bad {
                    border-left: 4px solid #f44336;
                }
                .status-warning {
                    border-left: 4px solid #ff9800;
                }
                button {
                    background-color: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    padding: 8px 16px;
                    margin: 5px;
                    border-radius: 3px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: var(--vscode-button-hoverBackground);
                }
                .code-block {
                    background-color: var(--vscode-textBlockQuote-background);
                    padding: 10px;
                    border-radius: 3px;
                    margin: 10px 0;
                    font-family: monospace;
                }
                .success-message {
                    background-color: #4CAF50;
                    color: white;
                    padding: 20px;
                    border-radius: 5px;
                    text-align: center;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <h1>Shadow Clone Setup Assistant</h1>
            
            ${allGood ? `
                <div class="success-message">
                    <h2>✅ All dependencies are installed!</h2>
                    <p>You're ready to use Shadow Clone.</p>
                </div>
            ` : `
                <p>Shadow Clone needs the following dependencies to work properly:</p>
                
                <div class="status-item ${status.nodeInstalled && status.nodeVersionValid ? 'status-good' : status.nodeInstalled ? 'status-warning' : 'status-bad'}">
                    <h3>Node.js ${status.nodeInstalled ? `(${status.nodeVersion})` : '(Not installed)'}</h3>
                    ${!status.nodeInstalled ? `
                        <p>Node.js is required to run Claude Code CLI.</p>
                        <button onclick="installNode()">Install Node.js</button>
                    ` : !status.nodeVersionValid ? `
                        <p>Node.js v18.0.0 or higher is required. You have ${status.nodeVersion}.</p>
                        <button onclick="installNode()">Update Node.js</button>
                    ` : '<p>✅ Node.js is properly installed</p>'}
                </div>

                <div class="status-item ${status.claudeInstalled ? 'status-good' : 'status-bad'}">
                    <h3>Claude Code CLI ${status.claudeInstalled ? `(${status.claudeVersion})` : '(Not installed)'}</h3>
                    ${!status.claudeInstalled ? `
                        <p>Claude Code CLI is required to run AI agents.</p>
                        ${status.nodeInstalled ? `
                            <button onclick="installClaude()">Install Claude Code</button>
                        ` : `
                            <p><em>Install Node.js first</em></p>
                        `}
                    ` : '<p>✅ Claude Code is properly installed</p>'}
                </div>

                <div style="margin-top: 30px;">
                    <h3>Quick Setup (Recommended)</h3>
                    <p>Run our automated setup script that handles everything:</p>
                    <button onclick="runSetupScript()" style="background-color: #4CAF50;">
                        Run Automated Setup
                    </button>
                    <p><small>This will configure npm and install all dependencies without requiring sudo.</small></p>
                </div>
            `}

            <div style="margin-top: 30px;">
                <button onclick="checkAgain()">Check Again</button>
                ${allGood ? '<button onclick="window.close()">Close</button>' : ''}
            </div>

            <script>
                const vscode = acquireVsCodeApi();
                
                function installNode() {
                    vscode.postMessage({ command: 'installNode' });
                }
                
                function installClaude() {
                    vscode.postMessage({ command: 'installClaude' });
                }
                
                function checkAgain() {
                    vscode.postMessage({ command: 'checkAgain' });
                }
                
                function runSetupScript() {
                    vscode.postMessage({ command: 'runSetupScript' });
                }
            </script>
        </body>
        </html>`;
    }

    private async installNodeJs(): Promise<void> {
        const choice = await vscode.window.showInformationMessage(
            'To install Node.js, you need to download it from nodejs.org or use a package manager.',
            'Open nodejs.org',
            'Show Commands'
        );

        if (choice === 'Open nodejs.org') {
            vscode.env.openExternal(vscode.Uri.parse('https://nodejs.org/'));
        } else if (choice === 'Show Commands') {
            const terminal = vscode.window.createTerminal('Install Node.js');
            terminal.show();
            
            // Show platform-specific commands
            const platform = process.platform;
            if (platform === 'win32') {
                terminal.sendText('# For Windows, download from https://nodejs.org/');
                terminal.sendText('# Or use winget:');
                terminal.sendText('# winget install OpenJS.NodeJS.LTS');
            } else if (platform === 'darwin') {
                terminal.sendText('# For macOS, use Homebrew:');
                terminal.sendText('# brew install node');
                terminal.sendText('# Or download from https://nodejs.org/');
            } else {
                terminal.sendText('# For Linux/WSL, use nvm:');
                terminal.sendText('curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash');
                terminal.sendText('# Then restart terminal and run:');
                terminal.sendText('# nvm install --lts');
            }
        }
    }

    private async installClaudeCode(): Promise<void> {
        const terminal = vscode.window.createTerminal('Install Claude Code');
        terminal.show();
        
        // Configure npm to avoid permission issues
        terminal.sendText('# Configuring npm to avoid permission issues...');
        terminal.sendText('mkdir -p ~/.npm-global');
        terminal.sendText('npm config set prefix "~/.npm-global"');
        terminal.sendText('export PATH=$PATH:~/.npm-global/bin');
        terminal.sendText('');
        terminal.sendText('# Installing Claude Code...');
        terminal.sendText('npm install -g @anthropic/claude-code');
        terminal.sendText('');
        terminal.sendText('# After installation completes, run:');
        terminal.sendText('# claude --version');
        
        vscode.window.showInformationMessage(
            'Installing Claude Code in the terminal. After installation, you may need to restart VS Code.',
            'OK'
        );
    }

    private async runSetupScript(context: vscode.ExtensionContext): Promise<void> {
        const terminal = vscode.window.createTerminal('Shadow Clone Setup');
        terminal.show();
        
        // Get the setup script path
        const scriptPath = path.join(context.extensionPath, 'scripts', 'setup-wsl.sh');
        
        if (fs.existsSync(scriptPath)) {
            terminal.sendText(`bash "${scriptPath}"`);
        } else {
            // If script doesn't exist locally, create it inline
            terminal.sendText('cat > /tmp/shadow-clone-setup.sh << \'EOF\'');
            terminal.sendText('#!/bin/bash');
            terminal.sendText('echo "🚀 Shadow Clone Quick Setup"');
            terminal.sendText('echo "=========================="');
            terminal.sendText('');
            terminal.sendText('# Configure npm for user-level global installs');
            terminal.sendText('mkdir -p ~/.npm-global');
            terminal.sendText('npm config set prefix "~/.npm-global"');
            terminal.sendText('echo "export PATH=\\$PATH:~/.npm-global/bin" >> ~/.bashrc');
            terminal.sendText('export PATH=$PATH:~/.npm-global/bin');
            terminal.sendText('');
            terminal.sendText('# Install Claude Code');
            terminal.sendText('npm install -g @anthropic/claude-code');
            terminal.sendText('');
            terminal.sendText('echo ""');
            terminal.sendText('echo "✅ Setup complete!"');
            terminal.sendText('echo "Please restart VS Code or run: source ~/.bashrc"');
            terminal.sendText('EOF');
            terminal.sendText('');
            terminal.sendText('chmod +x /tmp/shadow-clone-setup.sh');
            terminal.sendText('bash /tmp/shadow-clone-setup.sh');
        }
        
        vscode.window.showInformationMessage(
            'Running setup script. Please wait for it to complete, then restart VS Code.',
            'OK'
        );
    }

    public dispose() {
        this.statusBarItem.dispose();
    }
}