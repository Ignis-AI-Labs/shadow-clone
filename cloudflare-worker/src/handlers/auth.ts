import { Env } from '../index';
import { jsonResponse } from '../utils/auth';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

export async function handleAuthValidate(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as { apiKey: string };
    const { apiKey } = body;

    if (!apiKey) {
      return jsonResponse({ valid: false, error: 'Missing API key' }, 400);
    }


    // Look up the API key
    const userId = await env.API_KEYS.get(apiKey);
    if (!userId) {
      return jsonResponse({ valid: false, error: 'Invalid API key' }, 401);
    }

    // Get user data
    const userData = await env.USERS.get(userId);
    if (!userData) {
      return jsonResponse({ valid: false, error: 'User not found' }, 401);
    }

    const user = JSON.parse(userData);
    
    return jsonResponse({
      valid: true,
      userId: user.id,
      licenseType: user.licenseType,
    });
  } catch (error) {
    console.error('Auth validation error:', error);
    return jsonResponse({ valid: false, error: 'Internal error' }, 500);
  }
}