import * as vscode from 'vscode';
import { AuthProvider } from '../auth/authProvider';

/**
 * Creates an authentication guard wrapper for commands
 * Commands wrapped with this will require authentication before executing
 */
export function withAuth<T extends (...args: any[]) => any>(
    commandFn: T,
    authProvider: AuthProvider,
    options?: {
        requireActiveSubscription?: boolean;
        showAuthPrompt?: boolean;
        customMessage?: string;
    }
): T {
    return (async (...args: Parameters<T>) => {
        // Check if user is authenticated
        const hasAuth = await authProvider.checkAuth();
        
        if (!hasAuth) {
            // Show authentication prompt
            const message = options?.customMessage || 
                'Shadow Clone requires authentication to use this feature.';
            
            if (options?.showAuthPrompt !== false) {
                const choice = await vscode.window.showWarningMessage(
                    message,
                    'Authenticate',
                    'Cancel'
                );
                
                if (choice === 'Authenticate') {
                    await vscode.commands.executeCommand('shadowClone.authenticate');
                }
            } else {
                vscode.window.showWarningMessage(message);
            }
            
            return undefined;
        }
        
        // Check if subscription is active (if required)
        if (options?.requireActiveSubscription) {
            const isActive = await authProvider.isLicenseActive();
            if (!isActive) {
                const choice = await vscode.window.showWarningMessage(
                    'Your Shadow Clone license is inactive. Please update your subscription.',
                    'Update API Key',
                    'Contact Support'
                );
                
                if (choice === 'Update API Key') {
                    await vscode.commands.executeCommand('shadowClone.updateCredentials');
                } else if (choice === 'Contact Support') {
                    await vscode.env.openExternal(vscode.Uri.parse('https://ignislabs.ai/support'));
                }
                
                return undefined;
            }
        }
        
        // Execute the original command
        return commandFn(...args);
    }) as T;
}

/**
 * Creates an async authentication guard for non-async commands
 */
export function withAuthSync<T extends (...args: any[]) => any>(
    commandFn: T,
    authProvider: AuthProvider,
    options?: {
        requireActiveSubscription?: boolean;
        showAuthPrompt?: boolean;
        customMessage?: string;
    }
): (...args: Parameters<T>) => Promise<ReturnType<T> | undefined> {
    return async (...args: Parameters<T>) => {
        const wrappedAsync = withAuth(
            async (...innerArgs: Parameters<T>) => commandFn(...innerArgs),
            authProvider,
            options
        );
        return wrappedAsync(...args);
    };
}