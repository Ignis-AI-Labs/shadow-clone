import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { logger } from '../utils/logger.js';

/**
 * Creator Mode Detection and Management
 *
 * Provides privileged access for the Shadow Clone creator
 * when working locally on their own machine.
 */

export class CreatorMode {
    private static instance: CreatorMode;
    private isCreator: boolean = false;
    private creatorConfig: any = null;
    
    // Possible locations for creator config
    private configPaths = [
        // Local .shadow-local in current repo
        path.join(process.cwd(), '.shadow-local', 'creator-config.json'),
        // Shadow Clone repo location
        path.join('E:', 'Repos', 'shadow-clone', '.shadow-local', 'creator-config.json'),
        // Alternative Windows path
        path.join('E:', 'Repos', 'shadow-clone', '.shadow-local', 'creator-config.json'),
        // Home directory fallback
        path.join(os.homedir(), '.shadow-clone', 'creator-config.json')
    ];
    
    private constructor() {
        this.detectCreatorMode();
    }
    
    static getInstance(): CreatorMode {
        if (!CreatorMode.instance) {
            CreatorMode.instance = new CreatorMode();
        }
        return CreatorMode.instance;
    }
    
    private detectCreatorMode(): void {
        // Check each possible location
        for (const configPath of this.configPaths) {
            if (fs.existsSync(configPath)) {
                try {
                    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                    
                    // Verify it's a valid creator config
                    if (config.mode === 'CREATOR_PRIVILEGED' && config.creator === true) {
                        this.isCreator = true;
                        this.creatorConfig = config;
                        logger.info('Creator Mode detected', { configPath });
                        return;
                    }
                } catch (error) {
                    // Invalid config, continue checking
                }
            }
        }
        
        // Also check environment variable as override
        if (process.env.SHADOW_CLONE_CREATOR_MODE === 'true') {
            this.isCreator = true;
            this.creatorConfig = {
                mode: 'CREATOR_PRIVILEGED',
                creator: true,
                bypassAuth: true,
                apiKey: 'LOCAL_CREATOR_MODE',
                licenseType: 'UNLIMITED'
            };
            logger.info('Creator Mode enabled via environment variable');
        }
    }
    
    /**
     * Check if creator mode is active
     */
    isCreatorMode(): boolean {
        return this.isCreator;
    }
    
    /**
     * Get creator configuration
     */
    getConfig(): any {
        return this.creatorConfig;
    }
    
    /**
     * Get API key for creator mode
     */
    getCreatorApiKey(): string {
        return 'LOCAL_CREATOR_MODE';
    }
    
    /**
     * Get license type for creator mode
     */
    getCreatorLicenseType(): string {
        return 'UNLIMITED';
    }
    
    /**
     * Check if authentication should be bypassed
     */
    shouldBypassAuth(): boolean {
        return this.isCreator && this.creatorConfig?.bypassAuth === true;
    }
    
    /**
     * Get creator mode status message
     */
    getStatusMessage(): string {
        if (!this.isCreator) {
            return 'Standard mode - authentication required';
        }
        
        return `🚀 CREATOR MODE ACTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Authentication: Bypassed
✅ License: UNLIMITED
✅ All features enabled
✅ Local execution mode
✅ Debug capabilities active
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You're using Shadow Clone with full creator privileges.
Perfect for local development and company projects.`;
    }
    
    /**
     * Enable creator mode manually (for testing)
     */
    enableCreatorMode(configPath?: string): void {
        if (configPath && fs.existsSync(configPath)) {
            try {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                if (config.mode === 'CREATOR_PRIVILEGED') {
                    this.isCreator = true;
                    this.creatorConfig = config;
                    logger.info('Creator mode manually enabled');
                }
            } catch (error) {
                logger.error('Failed to enable creator mode', {
                    message: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }
    }
}