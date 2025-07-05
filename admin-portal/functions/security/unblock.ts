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
    const userKey = `user:${userId}`;
    
    const userData = await env.SECURITY_DATA.get(userKey);
    if (userData) {
      const userProfile = JSON.parse(userData);
      userProfile.isBlocked = false;
      userProfile.suspicionScore = Math.max(0, userProfile.suspicionScore - 20);
      await env.SECURITY_DATA.put(userKey, JSON.stringify(userProfile));
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
};