import { Env } from '../index';
import { authenticateRequest } from '../utils/auth';
import { corsHeaders } from '../utils/cors';
import { SecurityMonitor } from '../utils/security-monitor';

interface TelemetryEvent {
  eventType: string;
  timestamp: string;
  details: any;
  sessionId: string;
  extensionVersion: string;
}

interface TelemetryPayload {
  sessionId: string;
  events: TelemetryEvent[];
  metadata: {
    extensionVersion: string;
    vsCodeVersion: string;
    platform: string;
    suspicionScore: number;
  };
}

/**
 * Handle telemetry events from VS Code extension
 */
export async function handleTelemetryEvents(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    // Verify authentication
    const authResult = await authenticateRequest(request, env);
    if ('error' in authResult) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const { user } = authResult;
    const payload = await request.json() as TelemetryPayload;

    // Process telemetry events
    const monitor = new SecurityMonitor(env);
    let highRiskDetected = false;

    for (const event of payload.events) {
      // Store telemetry event
      const telemetryKey = `telemetry:${event.sessionId}:${event.timestamp}`;
      await env.USERS.put(telemetryKey, JSON.stringify({
        ...event,
        userId: user.id,
      }), {
        expirationTtl: 86400 * 30, // 30 days
      });

      // Check for suspicious activities in telemetry
      if (event.eventType === 'suspicious_activity') {
        // Log security event
        await monitor.logSecurityEvent({
          userId: user.id,
          apiKey: request.headers.get('X-API-Key') || '',
          timestamp: event.timestamp,
          eventType: 'extension_suspicious_activity',
          details: JSON.stringify(event.details),
          requestPath: '/api/telemetry/events',
          userAgent: request.headers.get('User-Agent'),
          ip: request.headers.get('CF-Connecting-IP'),
        });

        // Check if high risk
        if (event.details.severity === 'high' || payload.metadata.suspicionScore >= 100) {
          highRiskDetected = true;
        }
      }

      // Check for extraction attempts in commands
      if (event.eventType === 'command_executed' && event.details.command) {
        const extractionCheck = await monitor.checkForExtractionAttempts(
          request,
          user.id,
          request.headers.get('X-API-Key') || ''
        );

        if (extractionCheck) {
          highRiskDetected = true;
        }
      }
    }

    // Update session tracking
    const sessionKey = `session:${payload.sessionId}`;
    await env.USERS.put(sessionKey, JSON.stringify({
      userId: user.id,
      sessionId: payload.sessionId,
      lastActivity: new Date().toISOString(),
      metadata: payload.metadata,
      suspicionScore: payload.metadata.suspicionScore,
      eventCount: payload.events.length,
    }), {
      expirationTtl: 86400 * 7, // 7 days
    });

    // Response based on risk level
    if (highRiskDetected) {
      return new Response(
        JSON.stringify({
          success: true,
          warning: 'High risk activity detected',
          action: 'monitor',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-Security-Warning': 'high-risk-detected',
            ...corsHeaders,
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        eventsProcessed: payload.events.length,
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
    console.error('Telemetry processing error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process telemetry',
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
 * Handle high-risk security alerts from extension
 */
export async function handleHighRiskAlert(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    // Verify authentication
    const authResult = await authenticateRequest(request, env);
    if ('error' in authResult) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const { user } = authResult;
    const alertData = await request.json() as any;

    // Log critical security event
    const monitor = new SecurityMonitor(env);
    await monitor.logSecurityEvent({
      userId: user.id,
      apiKey: request.headers.get('X-API-Key') || '',
      timestamp: new Date().toISOString(),
      eventType: 'high_risk_alert',
      details: JSON.stringify(alertData),
      requestPath: '/api/security/high-risk-alert',
      userAgent: request.headers.get('User-Agent'),
      ip: request.headers.get('CF-Connecting-IP'),
    });

    // Send real-time alert
    const { AuditReporter } = await import('../services/audit-reporter');
    const reporter = new AuditReporter(env);
    await reporter.sendRealtimeAlert({
      eventType: 'high_risk_alert',
      userId: user.id,
      timestamp: new Date().toISOString(),
      details: alertData,
      severity: 'critical',
    });

    // Consider blocking the user if score is extreme
    if (alertData.suspicionScore >= 150) {
      // Update user security profile to block
      const profileKey = `security:profile:${user.id}`;
      const profileData = await env.USERS.get(profileKey);
      
      if (profileData) {
        const profile = JSON.parse(profileData);
        profile.isBlocked = true;
        profile.blockUntil = new Date(Date.now() + 86400000 * 7).toISOString(); // 7 day block
        profile.suspicionScore = alertData.suspicionScore;
        
        await env.USERS.put(profileKey, JSON.stringify(profile));
      }

      return new Response(
        JSON.stringify({
          success: true,
          action: 'blocked',
          message: 'Account temporarily suspended due to security violations',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        action: 'monitored',
        message: 'High risk alert processed',
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
    console.error('High risk alert processing error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process high risk alert',
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
 * Get telemetry analytics for admin
 */
export async function handleGetTelemetryAnalytics(
  request: Request,
  env: Env
): Promise<Response> {
  // Admin check
  const apiKey = request.headers.get('X-API-Key');
  if (!apiKey) {
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
    // Get telemetry statistics
    const now = new Date();
    const yesterday = new Date(now.getTime() - 86400000);

    // Count active sessions
    const { keys: sessionKeys } = await env.USERS.list({ prefix: 'session:' });
    let activeSessions = 0;
    let highRiskSessions = 0;

    for (const key of sessionKeys) {
      const sessionData = await env.USERS.get(key.name);
      if (!sessionData) continue;

      const session = JSON.parse(sessionData);
      const lastActivity = new Date(session.lastActivity);

      if (lastActivity > yesterday) {
        activeSessions++;
        if (session.suspicionScore >= 50) {
          highRiskSessions++;
        }
      }
    }

    // Count telemetry events
    const { keys: telemetryKeys } = await env.USERS.list({ 
      prefix: 'telemetry:', 
      limit: 1000 
    });

    const eventTypes: Record<string, number> = {};
    let totalEvents = 0;

    for (const key of telemetryKeys) {
      const eventData = await env.USERS.get(key.name);
      if (!eventData) continue;

      const event = JSON.parse(eventData);
      totalEvents++;
      eventTypes[event.eventType] = (eventTypes[event.eventType] || 0) + 1;
    }

    return new Response(
      JSON.stringify({
        success: true,
        analytics: {
          activeSessions,
          highRiskSessions,
          totalEvents,
          eventTypes,
          timestamp: now.toISOString(),
        },
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
    console.error('Telemetry analytics error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to get telemetry analytics',
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