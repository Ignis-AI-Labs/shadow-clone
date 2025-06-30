import * as vscode from 'vscode';
import { DependencyChecker } from '../services/dependencyChecker';

export async function checkDependencies(context: vscode.ExtensionContext) {
    const checker = DependencyChecker.getInstance();
    const status = await checker.checkAllDependencies();
    
    // If all dependencies are installed, show success message
    if (status.nodeInstalled && status.nodeVersionValid && status.claudeInstalled) {
        vscode.window.showInformationMessage(
            '✅ All Shadow Clone dependencies are installed!',
            'Close'
        );
        return;
    }
    
    // Otherwise, show the setup assistant
    await checker.installDependencies(context);
}