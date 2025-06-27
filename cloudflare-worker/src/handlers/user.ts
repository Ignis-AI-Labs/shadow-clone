import { Env } from '../index';
import { authenticateRequest, jsonResponse } from '../utils/auth';
import { LicenseStatus } from '../types';

export async function handleGetProfile(request: Request, env: Env): Promise<Response> {
  const auth = await authenticateRequest(request, env);
  
  if ('error' in auth) {
    return jsonResponse({ error: auth.error }, 401);
  }

  const { user } = auth;
  
  // Remove sensitive data
  const { apiKey, ...profile } = user;
  
  return jsonResponse(profile);
}

export async function handleGetLicenseStatus(request: Request, env: Env): Promise<Response> {
  const auth = await authenticateRequest(request, env);
  
  if ('error' in auth) {
    return jsonResponse({ error: auth.error }, 401);
  }

  const { user } = auth;
  
  // Define license features based on type
  const licenseFeatures = {
    ignis_elite: {
      maxProjects: -1, // unlimited
      maxAgentsPerWave: 10,
      prioritySupport: true,
    },
    pioneer: {
      maxProjects: 10,
      maxAgentsPerWave: 10,
      prioritySupport: false,
    },
    builder: {
      maxProjects: 20,
      maxAgentsPerWave: 10,
      prioritySupport: true,
    },
    reserve: {
      maxProjects: 50,
      maxAgentsPerWave: 10,
      prioritySupport: true,
    },
  };

  const status: LicenseStatus = {
    type: user.licenseType,
    status: 'active',
    features: licenseFeatures[user.licenseType],
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
  };

  return jsonResponse(status);
}