import * as vscode from 'vscode';
import { AuthProvider } from '../auth/authProvider';

export async function authenticateCommand(authProvider: AuthProvider) {
    const apiKey = await vscode.window.showInputBox({
        prompt: 'Enter your Shadow Clone API key',
        password: true,
        placeHolder: 'sk-...',
        validateInput: (value) => {
            if (!value || value.length < 10) {
                return 'Please enter a valid API key';
            }
            return null;
        }
    });

    if (!apiKey) {
        return;
    }

    const authenticated = await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Authenticating with Shadow Clone...',
        cancellable: false
    }, async () => {
        return await authProvider.authenticate(apiKey);
    });

    if (authenticated) {
        const licenseType = await authProvider.getLicenseType();
        const licenseDisplay: Record<string, string> = {
            'ignis_elite': '🔥 Ignis Elite (NFT)',
            'pioneer': '🚀 Pioneer',
            'builder': '🏗️ Builder',
            'reserve': '💎 Reserve'
        };
        const displayText = licenseType ? (licenseDisplay[licenseType] || licenseType) : 'Unknown';
        vscode.window.showInformationMessage(
            `Successfully authenticated! ${displayText} License Active`,
            'View Status'
        ).then(action => {
            if (action === 'View Status') {
                vscode.commands.executeCommand('shadowClone.showStatus');
            }
        });
    } else {
        const retry = await vscode.window.showErrorMessage(
            'Authentication failed. Please check your API key.',
            'Try Again',
            'Cancel'
        );
        if (retry === 'Try Again') {
            vscode.commands.executeCommand('shadowClone.authenticate');
        }
    }
}