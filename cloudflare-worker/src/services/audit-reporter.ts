import { Env } from '../index';
import { SecurityMonitor } from '../utils/security-monitor';

interface AuditReport {
  reportId: string;
  reportType: 'daily' | 'weekly' | 'monthly' | 'critical' | 'realtime';
  generatedAt: string;
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalEvents: number;
    criticalEvents: number;
    uniqueUsers: number;
    blockedUsers: number;
    extractionAttempts: number;
    suspiciousPatterns: number;
    apiCallsTotal: number;
  };
  threats: ThreatSummary[];
  topOffenders: UserThreatProfile[];
  recommendations: string[];
  rawEvents?: any[];
}

interface ThreatSummary {
  threatType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  count: number;
  affectedUsers: string[];
  examples: string[];
}

interface UserThreatProfile {
  userId: string;
  suspicionScore: number;
  totalEvents: number;
  eventBreakdown: Record<string, number>;
  firstSeen: string;
  lastSeen: string;
  isBlocked: boolean;
}

interface NotificationConfig {
  type: 'email' | 'webhook' | 'slack' | 'discord';
  endpoint: string;
  apiKey?: string;
  recipients?: string[];
  events: string[]; // Which events to notify about
  minSeverity: 'low' | 'medium' | 'high' | 'critical';
}

export class AuditReporter {
  constructor(private env: Env) {}

  /**
   * Generate a comprehensive audit report
   */
  async generateReport(
    reportType: AuditReport['reportType'],
    startTime?: Date,
    endTime?: Date
  ): Promise<AuditReport> {
    const now = new Date();
    const end = endTime || now;
    const start = startTime || this.getReportStartTime(reportType, end);
    
    const monitor = new SecurityMonitor(this.env);
    
    // Collect all security events in the period
    const events = await this.collectSecurityEvents(start, end);
    
    // Analyze events
    const analysis = this.analyzeEvents(events);
    
    // Generate threat summary
    const threats = this.identifyThreats(events);
    
    // Get top offenders
    const topOffenders = await this.getTopOffenders(events);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(analysis, threats);
    
    const report: AuditReport = {
      reportId: `report-${reportType}-${Date.now()}`,
      reportType,
      generatedAt: now.toISOString(),
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
      summary: {
        totalEvents: events.length,
        criticalEvents: events.filter(e => this.isCriticalEvent(e)).length,
        uniqueUsers: new Set(events.map(e => e.userId)).size,
        blockedUsers: analysis.blockedUsers,
        extractionAttempts: analysis.extractionAttempts,
        suspiciousPatterns: analysis.suspiciousPatterns,
        apiCallsTotal: analysis.apiCallsTotal,
      },
      threats,
      topOffenders,
      recommendations,
    };
    
    // Store the report
    await this.storeReport(report);
    
    // Send notifications if needed
    if (reportType === 'critical' || report.summary.criticalEvents > 0) {
      await this.sendNotifications(report, 'critical');
    }
    
    return report;
  }

  /**
   * Send real-time alert for critical events
   */
  async sendRealtimeAlert(event: any): Promise<void> {
    if (!this.isCriticalEvent(event)) return;
    
    const alert = {
      alertId: `alert-${Date.now()}`,
      timestamp: new Date().toISOString(),
      severity: 'critical',
      event: {
        type: event.eventType,
        userId: event.userId,
        details: event.details,
        ip: event.ip,
        userAgent: event.userAgent,
      },
      message: this.generateAlertMessage(event),
    };
    
    // Get notification configs
    const configs = await this.getNotificationConfigs();
    
    // Send to all configured endpoints
    for (const config of configs) {
      if (config.events.includes('realtime') || config.events.includes(event.eventType)) {
        await this.sendNotification(config, alert);
      }
    }
  }

  /**
   * Schedule automated reports
   */
  async scheduleReports(): Promise<void> {
    // This would be triggered by Cloudflare Cron Triggers
    // Configure in wrangler.toml:
    // [triggers]
    // crons = ["0 9 * * *", "0 9 * * 1", "0 9 1 * *"]
    // Daily at 9 AM, Weekly on Mondays, Monthly on 1st
  }

  /**
   * Collect security events for a time period
   */
  private async collectSecurityEvents(start: Date, end: Date): Promise<any[]> {
    const events: any[] = [];
    const prefix = 'security:event:';
    
    const { keys } = await this.env.USERS.list({ prefix });
    
    for (const key of keys) {
      const eventData = await this.env.USERS.get(key.name);
      if (!eventData) continue;
      
      const event = JSON.parse(eventData);
      const eventTime = new Date(event.timestamp);
      
      if (eventTime >= start && eventTime <= end) {
        events.push(event);
      }
    }
    
    return events.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Analyze events for patterns
   */
  private analyzeEvents(events: any[]): any {
    const userEvents = new Map<string, any[]>();
    let blockedUsers = 0;
    let extractionAttempts = 0;
    let suspiciousPatterns = 0;
    let apiCallsTotal = 0;
    
    // Group events by user
    for (const event of events) {
      const userList = userEvents.get(event.userId) || [];
      userList.push(event);
      userEvents.set(event.userId, userList);
      
      if (event.eventType === 'extraction_attempt') extractionAttempts++;
      if (event.eventType === 'suspicious_pattern') suspiciousPatterns++;
      apiCallsTotal++;
    }
    
    // Check for blocked users
    for (const [userId, userEventList] of userEvents) {
      if (userEventList.some(e => e.details?.includes('blocked'))) {
        blockedUsers++;
      }
    }
    
    return {
      userEvents,
      blockedUsers,
      extractionAttempts,
      suspiciousPatterns,
      apiCallsTotal,
    };
  }

  /**
   * Identify threat patterns
   */
  private identifyThreats(events: any[]): ThreatSummary[] {
    const threats: Map<string, ThreatSummary> = new Map();
    
    // Categorize threats
    const threatCategories = {
      'extraction_attempt': { severity: 'high', name: 'Prompt Extraction Attempts' },
      'enumeration': { severity: 'medium', name: 'Resource Enumeration' },
      'rate_limit': { severity: 'low', name: 'Rate Limit Violations' },
      'suspicious_pattern': { severity: 'medium', name: 'Suspicious Behavior' },
      'repeated_failures': { severity: 'medium', name: 'Repeated Failed Attempts' },
      'api_abuse': { severity: 'high', name: 'API Abuse' },
    };
    
    for (const event of events) {
      const category = threatCategories[event.eventType] || 
        { severity: 'low', name: event.eventType };
      
      const key = event.eventType;
      const threat = threats.get(key) || {
        threatType: category.name,
        severity: category.severity as any,
        count: 0,
        affectedUsers: [],
        examples: [],
      };
      
      threat.count++;
      if (!threat.affectedUsers.includes(event.userId)) {
        threat.affectedUsers.push(event.userId);
      }
      if (threat.examples.length < 3) {
        threat.examples.push(event.details || event.requestPath);
      }
      
      threats.set(key, threat);
    }
    
    // Check for coordinated attacks
    const timeGroups = this.groupEventsByTime(events, 60000); // 1 minute windows
    for (const [time, groupEvents] of timeGroups) {
      if (groupEvents.length > 10) {
        const users = new Set(groupEvents.map(e => e.userId));
        if (users.size > 3) {
          threats.set('coordinated_attack', {
            threatType: 'Possible Coordinated Attack',
            severity: 'critical',
            count: groupEvents.length,
            affectedUsers: Array.from(users),
            examples: [`${users.size} users in 1 minute window`],
          });
        }
      }
    }
    
    return Array.from(threats.values()).sort((a, b) => 
      this.getSeverityScore(b.severity) - this.getSeverityScore(a.severity)
    );
  }

  /**
   * Get top offending users
   */
  private async getTopOffenders(events: any[]): Promise<UserThreatProfile[]> {
    const userProfiles = new Map<string, UserThreatProfile>();
    
    // Build profiles from events
    for (const event of events) {
      const profile = userProfiles.get(event.userId) || {
        userId: event.userId,
        suspicionScore: 0,
        totalEvents: 0,
        eventBreakdown: {},
        firstSeen: event.timestamp,
        lastSeen: event.timestamp,
        isBlocked: false,
      };
      
      profile.totalEvents++;
      profile.eventBreakdown[event.eventType] = 
        (profile.eventBreakdown[event.eventType] || 0) + 1;
      
      if (new Date(event.timestamp) < new Date(profile.firstSeen)) {
        profile.firstSeen = event.timestamp;
      }
      if (new Date(event.timestamp) > new Date(profile.lastSeen)) {
        profile.lastSeen = event.timestamp;
      }
      
      userProfiles.set(event.userId, profile);
    }
    
    // Get current suspicion scores
    for (const [userId, profile] of userProfiles) {
      const securityProfile = await this.env.USERS.get(`security:profile:${userId}`);
      if (securityProfile) {
        const data = JSON.parse(securityProfile);
        profile.suspicionScore = data.suspicionScore || 0;
        profile.isBlocked = data.isBlocked || false;
      }
    }
    
    // Sort by threat level
    return Array.from(userProfiles.values())
      .sort((a, b) => b.suspicionScore - a.suspicionScore)
      .slice(0, 10);
  }

  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(analysis: any, threats: ThreatSummary[]): string[] {
    const recommendations: string[] = [];
    
    // Check extraction attempts
    if (analysis.extractionAttempts > 10) {
      recommendations.push(
        'High number of extraction attempts detected. Consider reviewing and updating extraction detection patterns.'
      );
    }
    
    // Check for critical threats
    const criticalThreats = threats.filter(t => t.severity === 'critical');
    if (criticalThreats.length > 0) {
      recommendations.push(
        'Critical threats detected. Immediate review and action recommended.'
      );
    }
    
    // Check for repeat offenders
    const repeatOffenders = analysis.userEvents.size;
    if (repeatOffenders > 20) {
      recommendations.push(
        `${repeatOffenders} users with security events. Consider implementing stricter rate limits.`
      );
    }
    
    // Check blocked users
    if (analysis.blockedUsers > 5) {
      recommendations.push(
        `${analysis.blockedUsers} users are currently blocked. Review for false positives.`
      );
    }
    
    // Pattern-specific recommendations
    if (threats.some(t => t.threatType === 'Possible Coordinated Attack')) {
      recommendations.push(
        'Coordinated attack pattern detected. Consider implementing IP-based rate limiting.'
      );
    }
    
    return recommendations;
  }

  /**
   * Send notifications
   */
  private async sendNotification(config: NotificationConfig, data: any): Promise<void> {
    try {
      switch (config.type) {
        case 'webhook':
          await this.sendWebhook(config, data);
          break;
        case 'email':
          await this.sendEmail(config, data);
          break;
        case 'slack':
          await this.sendSlack(config, data);
          break;
        case 'discord':
          await this.sendDiscord(config, data);
          break;
      }
    } catch (error) {
      console.error(`Failed to send ${config.type} notification:`, error);
    }
  }

  /**
   * Send webhook notification
   */
  private async sendWebhook(config: NotificationConfig, data: any): Promise<void> {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` }),
      },
      body: JSON.stringify({
        source: 'shadow-clone-security',
        timestamp: new Date().toISOString(),
        data,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }
  }

  /**
   * Send email notification (using a service like SendGrid)
   */
  private async sendEmail(config: NotificationConfig, data: any): Promise<void> {
    // This would integrate with an email service
    // For now, we'll use a webhook that triggers email
    await this.sendWebhook({
      ...config,
      endpoint: config.endpoint || 'https://api.sendgrid.com/v3/mail/send',
    }, {
      to: config.recipients,
      subject: `Shadow Clone Security Alert: ${data.severity || 'Report'}`,
      content: this.formatEmailContent(data),
    });
  }

  /**
   * Send Slack notification
   */
  private async sendSlack(config: NotificationConfig, data: any): Promise<void> {
    const message = this.formatSlackMessage(data);
    
    await fetch(config.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
  }

  /**
   * Send Discord notification
   */
  private async sendDiscord(config: NotificationConfig, data: any): Promise<void> {
    const embed = this.formatDiscordEmbed(data);
    
    await fetch(config.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [embed],
      }),
    });
  }

  /**
   * Format Slack message
   */
  private formatSlackMessage(data: any): any {
    const color = data.severity === 'critical' ? 'danger' : 
                  data.severity === 'high' ? 'warning' : 'good';
    
    return {
      attachments: [{
        color,
        title: '🔐 Shadow Clone Security Alert',
        fields: [
          {
            title: 'Type',
            value: data.reportType || data.event?.type || 'Security Event',
            short: true,
          },
          {
            title: 'Severity',
            value: data.severity || 'Medium',
            short: true,
          },
          {
            title: 'Details',
            value: data.message || JSON.stringify(data.summary || data.event, null, 2),
          },
        ],
        footer: 'Shadow Clone Security',
        ts: Math.floor(Date.now() / 1000),
      }],
    };
  }

  /**
   * Format Discord embed
   */
  private formatDiscordEmbed(data: any): any {
    const color = data.severity === 'critical' ? 0xFF0000 : 
                  data.severity === 'high' ? 0xFFA500 : 0x00FF00;
    
    return {
      title: '🔐 Shadow Clone Security Alert',
      color,
      fields: [
        {
          name: 'Type',
          value: data.reportType || data.event?.type || 'Security Event',
          inline: true,
        },
        {
          name: 'Severity',
          value: data.severity || 'Medium',
          inline: true,
        },
        {
          name: 'Details',
          value: data.message || 'Security event detected',
        },
      ],
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Format email content
   */
  private formatEmailContent(data: any): string {
    if (data.reportType) {
      return this.formatReportEmail(data);
    }
    
    return `
Shadow Clone Security Alert

Type: ${data.event?.type || 'Security Event'}
Severity: ${data.severity || 'Medium'}
Time: ${new Date().toISOString()}

Details:
${JSON.stringify(data.event || data, null, 2)}

Please review this event in your Shadow Clone admin dashboard.
    `;
  }

  /**
   * Format report email
   */
  private formatReportEmail(report: AuditReport): string {
    return `
Shadow Clone Security Report - ${report.reportType.toUpperCase()}

Report Period: ${report.period.start} to ${report.period.end}

SUMMARY
-------
Total Events: ${report.summary.totalEvents}
Critical Events: ${report.summary.criticalEvents}
Unique Users: ${report.summary.uniqueUsers}
Blocked Users: ${report.summary.blockedUsers}
Extraction Attempts: ${report.summary.extractionAttempts}

TOP THREATS
-----------
${report.threats.slice(0, 5).map(t => 
  `- ${t.threatType}: ${t.count} events (${t.severity})`
).join('\n')}

TOP OFFENDERS
-------------
${report.topOffenders.slice(0, 5).map(u => 
  `- User ${u.userId}: Score ${u.suspicionScore}, ${u.totalEvents} events`
).join('\n')}

RECOMMENDATIONS
---------------
${report.recommendations.map(r => `- ${r}`).join('\n')}

View full report: https://shadow-clone.ai/admin/reports/${report.reportId}
    `;
  }

  /**
   * Helper methods
   */
  private getReportStartTime(reportType: string, end: Date): Date {
    const start = new Date(end);
    switch (reportType) {
      case 'daily':
        start.setDate(start.getDate() - 1);
        break;
      case 'weekly':
        start.setDate(start.getDate() - 7);
        break;
      case 'monthly':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'realtime':
        start.setHours(start.getHours() - 1);
        break;
      default:
        start.setDate(start.getDate() - 1);
    }
    return start;
  }

  private isCriticalEvent(event: any): boolean {
    return event.eventType === 'extraction_attempt' ||
           event.eventType === 'coordinated_attack' ||
           event.suspicionScore > 75;
  }

  private getSeverityScore(severity: string): number {
    const scores = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
    return scores[severity] || 0;
  }

  private groupEventsByTime(events: any[], windowMs: number): Map<number, any[]> {
    const groups = new Map<number, any[]>();
    
    for (const event of events) {
      const time = new Date(event.timestamp).getTime();
      const window = Math.floor(time / windowMs) * windowMs;
      
      const group = groups.get(window) || [];
      group.push(event);
      groups.set(window, group);
    }
    
    return groups;
  }

  private generateAlertMessage(event: any): string {
    switch (event.eventType) {
      case 'extraction_attempt':
        return `User ${event.userId} attempted to extract prompts using: ${event.details}`;
      case 'coordinated_attack':
        return `Coordinated attack detected from multiple users`;
      case 'rate_limit':
        return `User ${event.userId} exceeded rate limits`;
      default:
        return `Security event: ${event.eventType} from user ${event.userId}`;
    }
  }

  private async storeReport(report: AuditReport): Promise<void> {
    const key = `audit:report:${report.reportId}`;
    await this.env.USERS.put(key, JSON.stringify(report), {
      expirationTtl: 86400 * 90, // 90 days retention
    });
    
    // Also maintain a list of reports
    const listKey = `audit:reports:${report.reportType}`;
    const existingList = await this.env.USERS.get(listKey);
    const reports = existingList ? JSON.parse(existingList) : [];
    
    reports.push({
      reportId: report.reportId,
      generatedAt: report.generatedAt,
      period: report.period,
    });
    
    // Keep only last 100 reports
    if (reports.length > 100) {
      reports.shift();
    }
    
    await this.env.USERS.put(listKey, JSON.stringify(reports));
  }

  private async getNotificationConfigs(): Promise<NotificationConfig[]> {
    const configKey = 'config:notifications';
    const stored = await this.env.USERS.get(configKey);
    
    if (!stored) {
      // Return default config
      return [{
        type: 'webhook',
        endpoint: process.env.SECURITY_WEBHOOK_URL || '',
        events: ['critical', 'extraction_attempt'],
        minSeverity: 'high',
      }];
    }
    
    return JSON.parse(stored);
  }

  /**
   * Save notification configuration
   */
  async saveNotificationConfig(config: NotificationConfig): Promise<void> {
    const configs = await this.getNotificationConfigs();
    configs.push(config);
    
    await this.env.USERS.put('config:notifications', JSON.stringify(configs));
  }
}