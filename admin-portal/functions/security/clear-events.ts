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

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
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
    const { userId } = await request.json() as any;
    
    // Reset user profile
    const userKey = `user:${userId}`;
    await env.SECURITY_DATA.put(userKey, JSON.stringify({
      userId,
      suspicionScore: 0,
      extractionAttempts: 0,
      isBlocked: false
    }));
    
    // Delete user events
    const { keys } = await env.SECURITY_DATA.list({ prefix: 'event:' });
    for (const key of keys) {
      const eventData = await env.SECURITY_DATA.get(key.name);
      if (eventData) {
        const event = JSON.parse(eventData);
        if (event.userId === userId) {
          await env.SECURITY_DATA.delete(key.name);
        }
      }
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error clearing events:', error);
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
};