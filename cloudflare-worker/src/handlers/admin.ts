import { Env } from '../index';
import { SecurityMonitor } from '../utils/security-monitor';
import { AuditReporter } from '../services/audit-reporter';
import { corsHeaders } from '../utils/cors';
import { isAdminAuthenticated } from './admin-wallet';

interface ScheduledEvent {
  cron: string;
  scheduledTime: number;
}

/**
 * Get security analytics dashboard data
 */
export async function handleGetSecurityAnalytics(
  request: Request,
  env: Env
): Promise<Response> {
  if (!(await isAdminAuthenticated(request, env))) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
  
  const monitor = new SecurityMonitor(env);
  
  try {
    // Get all security events from the last 24 hours
    const now = new Date();
    const yesterday = new Date(now.getTime() - 86400000);
    
    // Scan for security events
    const events: any[] = [];
    const suspiciousUsers = new Set<string>();
    const blockedUsers = new Set<string>();
    const extractionAttempts = new Map<string, number>();
    
    // Get all users with security profiles
    const { keys } = await env.USERS.list({ prefix: 'security:profile:' });
    
    for (const key of keys) {
      const profileData = await env.USERS.get(key.name);
      if (!profileData) continue;
      
      const profile = JSON.parse(profileData);
      if (profile.suspicionScore > 50) {
        suspiciousUsers.add(profile.userId);
      }
      if (profile.isBlocked) {
        blockedUsers.add(profile.userId);
      }
      if (profile.extractionAttempts > 0) {
        extractionAttempts.set(profile.userId, profile.extractionAttempts);
      }
    }
    
    // Get recent security events
    const { keys: eventKeys } = await env.USERS.list({ 
      prefix: 'security:event:', 
      limit: 100 
    });
    
    for (const key of eventKeys) {
      const eventData = await env.USERS.get(key.name);
      if (!eventData) continue;
      
      const event = JSON.parse(eventData);
      const eventTime = new Date(event.timestamp);
      
      if (eventTime > yesterday) {
        events.push(event);
      }
    }
    
    // Sort events by timestamp
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Calculate statistics
    const stats = {
      totalUsers: (await env.USERS.list({ prefix: 'user:' })).keys.length,
      suspiciousUsers: suspiciousUsers.size,
      blockedUsers: blockedUsers.size,
      extractionAttempts: Array.from(extractionAttempts.values()).reduce((a, b) => a + b, 0),
      last24HourEvents: events.length,
      eventsByType: events.reduce((acc, event) => {
        acc[event.eventType] = (acc[event.eventType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
    
    // Get top offenders
    const topOffenders = Array.from(extractionAttempts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([userId, attempts]) => ({ userId, attempts }));
    
    return new Response(
      JSON.stringify({
        success: true,
        analytics: {
          stats,
          recentEvents: events.slice(0, 50), // Last 50 events
          topOffenders,
          suspiciousUsers: Array.from(suspiciousUsers),
          blockedUsers: Array.from(blockedUsers),
        },
        timestamp: now.toISOString(),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error fetching security analytics:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch analytics',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}

/**
 * Unblock a user
 */
export async function handleUnblockUser(
  request: Request,
  env: Env
): Promise<Response> {
  if (!(await isAdminAuthenticated(request, env))) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
  
  try {
    const { userId } = await request.json() as { userId: string };
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
    
    // Get user security profile
    const profileKey = `security:profile:${userId}`;
    const profileData = await env.USERS.get(profileKey);
    
    if (!profileData) {
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
    
    const profile = JSON.parse(profileData);
    profile.isBlocked = false;
    profile.blockUntil = undefined;
    profile.suspicionScore = Math.max(0, profile.suspicionScore - 25); // Reduce suspicion
    
    await env.USERS.put(profileKey, JSON.stringify(profile));
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `User ${userId} unblocked`,
        newSuspicionScore: profile.suspicionScore,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error unblocking user:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to unblock user',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}

/**
 * Clear security events for a user
 */
export async function handleClearUserEvents(
  request: Request,
  env: Env
): Promise<Response> {
  if (!(await isAdminAuthenticated(request, env))) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
  
  try {
    const { userId } = await request.json() as { userId: string };
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
    
    // Clear events list
    await env.USERS.delete(`security:events:${userId}`);
    
    // Reset security profile
    const profileKey = `security:profile:${userId}`;
    const profile = {
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
    
    await env.USERS.put(profileKey, JSON.stringify(profile));
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Security events cleared for user ${userId}`,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error clearing user events:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to clear events',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}
/**
 * Generate security audit report
 */
export async function handleGenerateReport(
  request: Request,
  env: Env
): Promise<Response> {
  if (!(await isAdminAuthenticated(request, env))) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
  
  try {
    const { reportType = 'daily', startDate, endDate } = await request.json() as any;
    
    const reporter = new AuditReporter(env);
    const report = await reporter.generateReport(
      reportType,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
    
    return new Response(
      JSON.stringify({
        success: true,
        report,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error generating report:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate report',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}

/**
 * Configure notifications
 */
export async function handleConfigureNotifications(
  request: Request,
  env: Env
): Promise<Response> {
  if (!(await isAdminAuthenticated(request, env))) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
  
  try {
    const config = await request.json();
    
    const reporter = new AuditReporter(env);
    await reporter.saveNotificationConfig(config);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Notification configuration saved',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error configuring notifications:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to configure notifications',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}

/**
 * Handle scheduled report generation (called by Cloudflare Cron)
 */
export async function handleScheduledReport(
  event: ScheduledEvent,
  env: Env
): Promise<void> {
  const reporter = new AuditReporter(env);
  
  try {
    // Determine report type based on cron schedule
    const cronTime = event.cron;
    let reportType: 'daily' | 'weekly' | 'monthly' = 'daily';
    
    // Weekly reports on Monday
    if (new Date().getDay() === 1) {
      reportType = 'weekly';
    }
    
    // Monthly reports on the 1st
    if (new Date().getDate() === 1) {
      reportType = 'monthly';
    }
    
    // Generate report
    const report = await reporter.generateReport(reportType);
    
    console.log(`Generated ${reportType} security report: ${report.reportId}`);
  } catch (error) {
    console.error('Failed to generate scheduled report:', error);
  }
}
