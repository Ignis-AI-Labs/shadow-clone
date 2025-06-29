import * as vscode from 'vscode';
import { AuthProvider } from '../auth/authProvider';

export async function authenticateCommand(authProvider: AuthProvider, isUpdate: boolean = false) {
    const apiKey = await vscode.window.showInputBox({
        prompt: isUpdate ? 'Enter your new Shadow Clone API key' : 'Enter your Shadow Clone API key',
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

    const result = await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: isUpdate ? 'Updating Shadow Clone credentials...' : 'Authenticating with Shadow Clone...',
        cancellable: false
    }, async () => {
        return isUpdate ? await authProvider.updateCredentials(apiKey) : await authProvider.authenticate(apiKey);
    });

    if (result.success) {
        const licenseType = await authProvider.getLicenseType();
        const licenseDisplay: Record<string, string> = {
            'tripleOG': '🔥 Triple OG (All Phases)',
            'doubleOG': '🚀 Double OG (Phase 1)',
            'singleOG': '💎 Single OG (Phase 2)',
            'ignisElite': '✨ Ignis Elite (Phase 3)',
            'ignis_elite_phase_1': '🔥 Ignis Elite Phase 1 (NFT)',
            'ignis_elite_phase_2': '🚀 Ignis Elite Phase 2 (NFT)',
            'ignis_elite_phase_3': '💎 Ignis Elite Phase 3 (NFT)',
            'pioneer': '🚀 Pioneer',
            'builder': '🏗️ Builder',
            'reserve': '💎 Reserve'
        };
        const displayText = licenseType ? (licenseDisplay[licenseType] || licenseType) : 'Unknown';
        
        if (result.isActive === false) {
            // License is valid but inactive
            const choice = await vscode.window.showWarningMessage(
                `${displayText} - ${result.message || 'Your license is currently inactive.'}`,
                'View Status',
                'Update API Key',
                'Contact Support'
            );
            
            if (choice === 'View Status') {
                vscode.commands.executeCommand('shadowClone.showStatus');
            } else if (choice === 'Update API Key') {
                vscode.commands.executeCommand('shadowClone.updateCredentials');
            } else if (choice === 'Contact Support') {
                vscode.env.openExternal(vscode.Uri.parse('https://ignislabs.ai/support'));
            }
        } else {
            // License is active
            vscode.window.showInformationMessage(
                `Successfully authenticated! ${displayText} License Active`,
                'View Status'
            ).then(action => {
                if (action === 'View Status') {
                    vscode.commands.executeCommand('shadowClone.showStatus');
                }
            });
        }
    } else {
        const retry = await vscode.window.showErrorMessage(
            result.message || 'Authentication failed. Please check your API key.',
            'Try Again',
            'Cancel'
        );
        if (retry === 'Try Again') {
            vscode.commands.executeCommand('shadowClone.authenticate');
        }
    }
}