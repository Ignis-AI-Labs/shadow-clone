import { Env } from '../index';
import { AuditReporter } from '../services/audit-reporter';

// Suspicious patterns that might indicate extraction attempts
const EXTRACTION_PATTERNS = [
  // Direct extraction attempts
  /show\s*me\s*(the\s*)?(full\s*)?prompt/i,
  /display\s*(all\s*)?(agent\s*)?instructions/i,
  /what\s*are\s*your\s*system\s*instructions/i,
  /repeat\s*everything\s*above/i,
  /print\s*(the\s*)?(entire\s*)?prompt/i,
  /give\s*me\s*(the\s*)?(complete\s*)?prompt/i,
  /output\s*(the\s*)?(full\s*)?instructions/i,
  
  // File reading attempts
  /cat\s+.*shadow-clone.*\.md/i,
  /read\s+.*shadow-clone.*prompt/i,
  /type\s+.*shadow-clone/i,
  /get-content.*shadow-clone/i,
  
  // Code extraction attempts
  /extract.*prompt.*content/i,
  /dump.*instructions/i,
  /show.*source.*code/i,
  /reveal.*hidden.*instructions/i,
  
  // API response manipulation
  /JSON\.parse.*shadow.*clone/i,
  /console\.log.*prompt/i,
  /print.*API.*response/i,
];

// Rate limiting configuration
const RATE_LIMITS = {
  // Per minute limits
  MINUTE: {
    normal: 10,
    suspicious: 5,
    burst: 20,
  },
  // Per hour limits
  HOUR: {
    normal: 100,
    suspicious: 20,
    burst: 200,
  },
  // Per day limits
  DAY: {
    normal: 500,
    suspicious: 50,
    burst: 1000,
  }
};

interface SecurityEvent {
  userId: string;
  apiKey: string;
  timestamp: string;
  eventType: 'extraction_attempt' | 'rate_limit' | 'enumeration' | 'suspicious_pattern';
  details: string;
  requestPath: string;
  userAgent?: string;
  ip?: string;
}

interface UserSecurityProfile {
  userId: string;
  suspicionScore: number;
  lastActivity: string;
  accessCounts: {
    minute: number;
    hour: number;
    day: number;
  };
  extractionAttempts: number;
  flaggedPatterns: string[];
  isBlocked: boolean;
  blockUntil?: string;
}

export class SecurityMonitor {
  constructor(private env: Env) {}

  /**
   * Check if a request contains suspicious patterns
   */
  async checkForExtractionAttempts(
    request: Request,
    userId: string,
    apiKey: string
  ): Promise<SecurityEvent | null> {
    const url = new URL(request.url);
    const body = await this.getRequestBody(request);
    const headers = Object.fromEntries(request.headers.entries());
    
    // Check URL parameters
    const urlParams = url.searchParams.toString();
    
    // Combine all text to check
    const textToCheck = [
      urlParams,
      body,
      headers['user-agent'] || '',
      headers['referer'] || '',
    ].join(' ');
    
    // Check for extraction patterns
    for (const pattern of EXTRACTION_PATTERNS) {
      if (pattern.test(textToCheck)) {
        const event: SecurityEvent = {
          userId,
          apiKey: this.hashApiKey(apiKey),
          timestamp: new Date().toISOString(),
          eventType: 'extraction_attempt',
          details: `Matched pattern: ${pattern.toString()}`,
          requestPath: url.pathname,
          userAgent: headers['user-agent'],
          ip: headers['cf-connecting-ip'] || headers['x-forwarded-for'],
        };
        
        await this.logSecurityEvent(event);
        await this.updateUserSuspicionScore(userId, 25); // High penalty for extraction attempts
        
        // Send real-time alert for extraction attempts
        const reporter = new AuditReporter(this.env);
        await reporter.sendRealtimeAlert(event);
        
        return event;
      }
    }
    
    return null;
  }

  /**
   * Check rate limits for a user
   */
  async checkRateLimits(userId: string): Promise<{ allowed: boolean; limit?: string }> {
    const profile = await this.getUserSecurityProfile(userId);
    
    // Check if user is blocked
    if (profile.isBlocked && profile.blockUntil) {
      const blockTime = new Date(profile.blockUntil);
      if (blockTime > new Date()) {
        return { allowed: false, limit: 'blocked' };
      }
      // Unblock if time has passed
      profile.isBlocked = false;
      profile.blockUntil = undefined;
    }
    
    // Determine rate limits based on suspicion score
    const limits = profile.suspicionScore > 50 ? RATE_LIMITS : RATE_LIMITS;
    const userLimits = profile.suspicionScore > 50 
      ? { minute: limits.MINUTE.suspicious, hour: limits.HOUR.suspicious, day: limits.DAY.suspicious }
      : { minute: limits.MINUTE.normal, hour: limits.HOUR.normal, day: limits.DAY.normal };
    
    // Check limits
    if (profile.accessCounts.minute > userLimits.minute) {
      return { allowed: false, limit: 'minute' };
    }
    if (profile.accessCounts.hour > userLimits.hour) {
      return { allowed: false, limit: 'hour' };
    }
    if (profile.accessCounts.day > userLimits.day) {
      return { allowed: false, limit: 'day' };
    }
    
    // Update counts
    await this.incrementAccessCount(userId);
    
    return { allowed: true };
  }

  /**
   * Check for enumeration attempts
   */
  async checkForEnumeration(
    userId: string,
    requestPath: string,
    recentPaths: string[]
  ): Promise<boolean> {
    // Check if user is trying to enumerate all modes/rules/templates
    const pathPatterns = [
      /\/api\/prompts\/modes\/\w+/,
      /\/api\/prompts\/agent-rules\/\w+/,
      /\/api\/prompts\/templates\/\w+/,
    ];
    
    const matchedPatterns = new Set<string>();
    for (const path of [...recentPaths, requestPath]) {
      for (const pattern of pathPatterns) {
        if (pattern.test(path)) {
          matchedPatterns.add(pattern.source);
        }
      }
    }
    
    // If accessing many different resources rapidly, flag as enumeration
    if (matchedPatterns.size >= 3 && recentPaths.length > 10) {
      await this.logSecurityEvent({
        userId,
        apiKey: '',
        timestamp: new Date().toISOString(),
        eventType: 'enumeration',
        details: 'Rapid access to multiple resource types',
        requestPath,
      });
      
      await this.updateUserSuspicionScore(userId, 15);
      return true;
    }
    
    return false;
  }

  /**
   * Get or create user security profile
   */
  private async getUserSecurityProfile(userId: string): Promise<UserSecurityProfile> {
    const key = `security:profile:${userId}`;
    const stored = await this.env.USERS.get(key);
    
    if (stored) {
      const profile = JSON.parse(stored) as UserSecurityProfile;
      // Reset counts if needed
      await this.resetExpiredCounts(profile);
      return profile;
    }
    
    // Create new profile
    const profile: UserSecurityProfile = {
      userId,
      suspicionScore: 0,
      lastActivity: new Date().toISOString(),
      accessCounts: {
        minute: 0,
        hour: 0,
        day: 0,
      },
      extractionAttempts: 0,
      flaggedPatterns: [],
      isBlocked: false,
    };
    
    await this.saveUserSecurityProfile(profile);
    return profile;
  }

  /**
   * Save user security profile
   */
  private async saveUserSecurityProfile(profile: UserSecurityProfile): Promise<void> {
    const key = `security:profile:${profile.userId}`;
    await this.env.USERS.put(key, JSON.stringify(profile), {
      expirationTtl: 86400 * 30, // 30 days
    });
  }

  /**
   * Log security event
   */
  public async logSecurityEvent(event: SecurityEvent): Promise<void> {
    const key = `security:event:${event.timestamp}:${event.userId}`;
    await this.env.USERS.put(key, JSON.stringify(event), {
      expirationTtl: 86400 * 90, // 90 days retention
    });
    
    // Also maintain a list of recent events
    const listKey = `security:events:${event.userId}`;
    const existingList = await this.env.USERS.get(listKey);
    const events = existingList ? JSON.parse(existingList) : [];
    events.push(event);
    
    // Keep only last 100 events
    if (events.length > 100) {
      events.shift();
    }
    
    await this.env.USERS.put(listKey, JSON.stringify(events), {
      expirationTtl: 86400 * 30,
    });
  }

  /**
   * Update user suspicion score
   */
  private async updateUserSuspicionScore(userId: string, points: number): Promise<void> {
    const profile = await this.getUserSecurityProfile(userId);
    profile.suspicionScore += points;
    
    // Auto-block if score too high
    if (profile.suspicionScore >= 100) {
      profile.isBlocked = true;
      profile.blockUntil = new Date(Date.now() + 86400000).toISOString(); // 24 hour block
    }
    
    await this.saveUserSecurityProfile(profile);
  }

  /**
   * Increment access count
   */
  private async incrementAccessCount(userId: string): Promise<void> {
    const profile = await this.getUserSecurityProfile(userId);
    
    // Use minute-based counters with Redis-like expiry simulation
    const now = new Date();
    const minuteKey = `${userId}:${now.getMinutes()}`;
    const hourKey = `${userId}:${now.getHours()}`;
    const dayKey = `${userId}:${now.getDate()}`;
    
    // Increment all counters
    profile.accessCounts.minute++;
    profile.accessCounts.hour++;
    profile.accessCounts.day++;
    profile.lastActivity = now.toISOString();
    
    await this.saveUserSecurityProfile(profile);
  }

  /**
   * Reset expired counts
   */
  private async resetExpiredCounts(profile: UserSecurityProfile): Promise<void> {
    const now = new Date();
    const lastActivity = new Date(profile.lastActivity);
    
    const minutesDiff = (now.getTime() - lastActivity.getTime()) / 60000;
    const hoursDiff = minutesDiff / 60;
    const daysDiff = hoursDiff / 24;
    
    if (minutesDiff >= 1) profile.accessCounts.minute = 0;
    if (hoursDiff >= 1) profile.accessCounts.hour = 0;
    if (daysDiff >= 1) {
      profile.accessCounts.day = 0;
      // Decay suspicion score daily
      profile.suspicionScore = Math.max(0, profile.suspicionScore - 10);
    }
  }

  /**
   * Get request body safely
   */
  private async getRequestBody(request: Request): Promise<string> {
    try {
      const contentType = request.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const body = await request.json();
        return JSON.stringify(body);
      } else if (contentType?.includes('text/')) {
        return await request.text();
      }
    } catch {
      // Ignore body parsing errors
    }
    return '';
  }

  /**
   * Hash API key for logging
   */
  private hashApiKey(apiKey: string): string {
    // Simple hash for logging - just show first and last 4 chars
    if (apiKey.length > 8) {
      return `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;
    }
    return 'short-key';
  }

  /**
   * Get security analytics for admin dashboard
   */
  async getSecurityAnalytics(): Promise<any> {
    // This would aggregate security events and provide insights
    // Implementation depends on admin dashboard requirements
    return {
      totalUsers: 0,
      suspiciousUsers: 0,
      blockedUsers: 0,
      recentEvents: [],
      extractionAttempts: 0,
      enumerationAttempts: 0,
    };
  }
}