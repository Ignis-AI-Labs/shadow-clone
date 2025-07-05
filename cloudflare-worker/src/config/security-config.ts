/**
 * Security Configuration
 * Controls whether security measures are enforced or just monitored
 */

export interface SecurityConfig {
  // Security mode: 'enforce' | 'monitor'
  mode: 'monitor' | 'enforce';
  
  // Whether to send real-time alerts
  sendAlerts: boolean;
  
  // Whether to log all security events
  logEvents: boolean;
  
  // Admin notification settings
  adminNotifications: {
    enabled: boolean;
    channels: Array<'email' | 'discord' | 'webhook'>;
    thresholds: {
      extractionAttempts: number;
      suspicionScore: number;
      rateLimitExceeded: number;
    };
  };
  
  // Feature flags
  features: {
    extractionDetection: boolean;
    rateLimiting: boolean;
    enumerationDetection: boolean;
    suspicionScoring: boolean;
  };
}

// Default configuration - monitoring only
export const defaultSecurityConfig: SecurityConfig = {
  mode: 'monitor',
  sendAlerts: true,
  logEvents: true,
  adminNotifications: {
    enabled: true,
    channels: ['discord', 'webhook'],
    thresholds: {
      extractionAttempts: 3,
      suspicionScore: 50,
      rateLimitExceeded: 10,
    },
  },
  features: {
    extractionDetection: true,
    rateLimiting: true,
    enumerationDetection: true,
    suspicionScoring: true,
  },
};

/**
 * Get security configuration from environment
 */
export function getSecurityConfig(env: any): SecurityConfig {
  // Allow environment override
  const mode = env.SECURITY_MODE || 'monitor';
  
  return {
    ...defaultSecurityConfig,
    mode: mode as 'monitor' | 'enforce',
    sendAlerts: env.SECURITY_ALERTS !== 'false',
    logEvents: env.SECURITY_LOGGING !== 'false',
  };
}

/**
 * Security decision helper
 * Returns whether to enforce an action based on current mode
 */
export function shouldEnforce(config: SecurityConfig, action: string): boolean {
  if (config.mode === 'monitor') {
    console.log(`[SECURITY] Would ${action} but mode is monitor-only`);
    return false;
  }
  return true;
}

/**
 * Log security decision
 */
export function logSecurityDecision(
  config: SecurityConfig,
  action: string,
  details: any
): void {
  if (!config.logEvents) return;
  
  const timestamp = new Date().toISOString();
  const mode = config.mode;
  
  console.log(JSON.stringify({
    timestamp,
    level: 'SECURITY',
    mode,
    action,
    enforced: config.mode === 'enforce',
    details,
  }));
}