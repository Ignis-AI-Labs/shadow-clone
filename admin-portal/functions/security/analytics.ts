interface Env {
  ADMIN_SESSIONS: KVNamespace;
  SECURITY_DATA: KVNamespace;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
  'Access-Control-Max-Age': '86400',
};

// Verify admin token
async function verifyAdminToken(token: string, env: Env): Promise<boolean> {
  if (!token) return false;
  
  const sessionData = await env.ADMIN_SESSIONS.get(`session:${token}`);
  if (!sessionData) return false;
  
  try {
    const session = JSON.parse(sessionData);
    
    // Check if expired
    if (new Date(session.expiresAt) < new Date()) {
      await env.ADMIN_SESSIONS.delete(`session:${token}`);
      return false;
    }
    
    // Verify is admin
    return session.isAdmin === true;
  } catch {
    return false;
  }
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { headers: corsHeaders });
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  // Verify admin token
  const token = request.headers.get('X-Admin-Token');
  if (!token || !await verifyAdminToken(token, env)) {
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
    // Get all security events from storage
    const { keys } = await env.SECURITY_DATA.list({ prefix: 'event:' });
    const events = [];
    
    for (const key of keys.slice(0, 100)) { // Limit to 100 most recent
      const eventData = await env.SECURITY_DATA.get(key.name);
      if (eventData) {
        events.push(JSON.parse(eventData));
      }
    }
    
    // Sort by timestamp
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Get user profiles
    const { keys: userKeys } = await env.SECURITY_DATA.list({ prefix: 'user:' });
    const suspiciousUsers = [];
    const blockedUsers = [];
    const topOffenders = [];
    
    for (const key of userKeys) {
      const userData = await env.SECURITY_DATA.get(key.name);
      if (userData) {
        const user = JSON.parse(userData);
        if (user.suspicionScore > 50) {
          suspiciousUsers.push(user.userId);
        }
        if (user.isBlocked) {
          blockedUsers.push(user.userId);
        }
        if (user.extractionAttempts > 0) {
          topOffenders.push({
            userId: user.userId,
            attempts: user.extractionAttempts
          });
        }
      }
    }
    
    // Sort top offenders
    topOffenders.sort((a, b) => b.attempts - a.attempts);
    
    // Calculate stats
    const stats = {
      totalUsers: userKeys.length,
      suspiciousUsers: suspiciousUsers.length,
      blockedUsers: blockedUsers.length,
      extractionAttempts: topOffenders.reduce((sum, u) => sum + u.attempts, 0),
      last24HourEvents: events.filter(e => {
        const eventTime = new Date(e.timestamp);
        const dayAgo = new Date(Date.now() - 86400000);
        return eventTime > dayAgo;
      }).length
    };
    
    return new Response(
      JSON.stringify({
        success: true,
        analytics: {
          stats,
          recentEvents: events.slice(0, 50),
          topOffenders: topOffenders.slice(0, 10),
          suspiciousUsers,
          blockedUsers
        },
        timestamp: new Date().toISOString()
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
};