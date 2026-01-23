import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

/**
 * Creator Mode Detection and Management
 *
 * Provides privileged access for the Shadow Clone creator
 * when working locally on their own machine.
 */

/**
 * Zod schema for creator config validation
 * Uses strict() to reject unknown fields and prevent injection attacks
 */
const CreatorConfigSchema = z.object({
    mode: z.literal('CREATOR_PRIVILEGED'),
    creator: z.boolean(),
    bypassAuth: z.boolean().optional().default(false),
    apiKey: z.string().max(255).optional(),
    userId: z.string().max(255).optional(),
    licenseType: z.enum(['UNLIMITED', 'BASIC', 'PRO']).optional(),
    description: z.string().max(1000).optional(),
    features: z.record(z.string(), z.boolean()).optional(),
}).strict(); // Reject unknown fields

type CreatorConfig = z.infer<typeof CreatorConfigSchema>;

export class CreatorMode {
    private static instance: CreatorMode;
    private isCreator: boolean = false;
    private creatorConfig: CreatorConfig | null = null;

    // Possible locations for creator config (no hardcoded paths)
    private configPaths = [
        // Local .shadow-local in current repo
        path.join(process.cwd(), '.shadow-local', 'creator-config.json'),
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
                    const rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

                    // Validate with Zod schema (strict mode rejects unknown fields)
                    const config = CreatorConfigSchema.parse(rawConfig);

                    // Verify it's a valid creator config
                    if (config.mode === 'CREATOR_PRIVILEGED' && config.creator === true) {
                        this.isCreator = true;
                        this.creatorConfig = config;
                        logger.info('Creator Mode detected', { configPath });
                        return;
                    }
                } catch (error) {
                    // Log validation errors for debugging
                    if (error instanceof z.ZodError) {
                        logger.warn('Invalid creator config', {
                            configPath,
                            errors: error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`)
                        });
                    }
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
    getConfig(): CreatorConfig | null {
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
                const rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                // Validate with Zod schema
                const config = CreatorConfigSchema.parse(rawConfig);
                if (config.mode === 'CREATOR_PRIVILEGED') {
                    this.isCreator = true;
                    this.creatorConfig = config;
                    logger.info('Creator mode manually enabled');
                }
            } catch (error) {
                if (error instanceof z.ZodError) {
                    logger.error('Failed to enable creator mode - invalid config', {
                        errors: error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`),
                    });
                } else {
                    logger.error('Failed to enable creator mode', {
                        message: error instanceof Error ? error.message : 'Unknown error',
                    });
                }
            }
        }
    }
}