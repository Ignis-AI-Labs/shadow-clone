import { Env } from '../index';
import { User } from '../types';

export async function authenticateRequest(
  request: Request,
  env: Env
): Promise<{ user: User } | { error: string }> {
  const apiKey = request.headers.get('X-API-Key');
  
  if (!apiKey) {
    return { error: 'Missing API key' };
  }

  // Look up user by API key
  const userId = await env.API_KEYS.get(apiKey);
  if (!userId) {
    return { error: 'Invalid API key' };
  }

  // Get user data
  const userData = await env.USERS.get(userId);
  if (!userData) {
    return { error: 'User not found' };
  }

  try {
    const user = JSON.parse(userData) as User;
    return { user };
  } catch {
    return { error: 'Invalid user data' };
  }
}

export function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
    },
  });
}