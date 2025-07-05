interface Env {
  SECURITY_DATA: KVNamespace;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
  'Access-Control-Max-Age': '86400',
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { headers: corsHeaders });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // This endpoint doesn't require admin auth as it's used internally
  // You might want to add a server-to-server auth token here
  
  try {
    const event = await request.json() as any;
    const eventId = `event:${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Store event
    await env.SECURITY_DATA.put(eventId, JSON.stringify({
      ...event,
      timestamp: event.timestamp || new Date().toISOString()
    }), {
      expirationTtl: 2592000 // 30 days
    });
    
    // Update user profile
    const userId = event.userId;
    const userKey = `user:${userId}`;
    const existingData = await env.SECURITY_DATA.get(userKey);
    
    let userProfile = existingData ? JSON.parse(existingData) : {
      userId,
      suspicionScore: 0,
      extractionAttempts: 0,
      isBlocked: false
    };
    
    // Update based on event type
    if (event.eventType === 'extraction_attempt') {
      userProfile.extractionAttempts++;
      userProfile.suspicionScore += 15;
    } else if (event.eventType === 'rate_limit') {
      userProfile.suspicionScore += 5;
    } else if (event.eventType === 'enumeration') {
      userProfile.suspicionScore += 10;
    }
    
    await env.SECURITY_DATA.put(userKey, JSON.stringify(userProfile));
    
    return new Response(
      JSON.stringify({ success: true, eventId }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error logging security event:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to log security event',
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