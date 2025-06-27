import { Env } from '../index';
import { authenticateRequest, jsonResponse } from '../utils/auth';
import { Deployment } from '../types';
import { nanoid } from 'nanoid';

export async function handleGetDeployments(
  request: Request,
  env: Env,
  params: Record<string, string>
): Promise<Response> {
  const auth = await authenticateRequest(request, env);
  
  if ('error' in auth) {
    return jsonResponse({ error: auth.error }, 401);
  }

  const { user } = auth;
  const projectId = params.id;
  
  // Verify project belongs to user
  const projectData = await env.PROJECTS.get(`project:${projectId}`);
  if (!projectData) {
    return jsonResponse({ error: 'Project not found' }, 404);
  }
  
  const project = JSON.parse(projectData);
  if (project.userId !== user.id) {
    return jsonResponse({ error: 'Forbidden' }, 403);
  }
  
  // Get deployments for project
  const deploymentsKey = `deployments:${projectId}`;
  const deploymentIds = await env.PROJECTS.get(deploymentsKey, 'json') as string[] || [];
  
  const deployments: Deployment[] = [];
  
  for (const deploymentId of deploymentIds) {
    const deploymentData = await env.PROJECTS.get(`deployment:${deploymentId}`);
    if (deploymentData) {
      deployments.push(JSON.parse(deploymentData));
    }
  }
  
  // Sort by creation date, newest first
  deployments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return jsonResponse(deployments);
}

export async function handleCreateDeployment(
  request: Request,
  env: Env,
  params: Record<string, string>
): Promise<Response> {
  const auth = await authenticateRequest(request, env);
  
  if ('error' in auth) {
    return jsonResponse({ error: auth.error }, 401);
  }

  const { user } = auth;
  const projectId = params.id;
  
  // Verify project belongs to user
  const projectData = await env.PROJECTS.get(`project:${projectId}`);
  if (!projectData) {
    return jsonResponse({ error: 'Project not found' }, 404);
  }
  
  const project = JSON.parse(projectData);
  if (project.userId !== user.id) {
    return jsonResponse({ error: 'Forbidden' }, 403);
  }
  
  try {
    const body = await request.json() as {
      projectId: string;
      prompt: string;
      agentCount: number;
      wavesDirectory: string;
    };
    
    if (!body.prompt || !body.agentCount) {
      return jsonResponse({ error: 'Missing required fields' }, 400);
    }
    
    // Get current wave number
    const deploymentsKey = `deployments:${projectId}`;
    const deploymentIds = await env.PROJECTS.get(deploymentsKey, 'json') as string[] || [];
    const waveNumber = deploymentIds.length + 1;
    
    // Create new deployment
    const deployment: Deployment = {
      id: `deploy_${nanoid(12)}`,
      projectId,
      userId: user.id,
      waveNumber,
      agentCount: Math.min(body.agentCount, 10), // Max 10 agents per wave
      status: 'pending',
      prompt: body.prompt,
      createdAt: new Date().toISOString(),
    };
    
    // Store deployment
    await env.PROJECTS.put(`deployment:${deployment.id}`, JSON.stringify(deployment));
    
    // Update project's deployment list
    deploymentIds.push(deployment.id);
    await env.PROJECTS.put(deploymentsKey, JSON.stringify(deploymentIds));
    
    // Update project's last deployment time
    project.lastDeployment = deployment.createdAt;
    await env.PROJECTS.put(`project:${projectId}`, JSON.stringify(project));
    
    // In a real implementation, this would trigger the actual deployment
    // For now, we'll simulate it by marking it as completed after a delay
    
    return jsonResponse({
      deploymentId: deployment.id,
      status: 'pending',
      message: 'Deployment queued successfully',
    }, 202);
  } catch (error) {
    console.error('Create deployment error:', error);
    return jsonResponse({ error: 'Invalid request' }, 400);
  }
}