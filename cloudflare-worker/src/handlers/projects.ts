import { Env } from '../index';
import { authenticateRequest, jsonResponse } from '../utils/auth';
import { Project } from '../types';
import { nanoid } from 'nanoid';

export async function handleGetProjects(request: Request, env: Env): Promise<Response> {
  const auth = await authenticateRequest(request, env);
  
  if ('error' in auth) {
    return jsonResponse({ error: auth.error }, 401);
  }

  const { user } = auth;
  
  // Get all projects for the user
  const projectsKey = `projects:${user.id}`;
  const projectIds = await env.PROJECTS.get(projectsKey, 'json') as string[] || [];
  
  const projects: Project[] = [];
  
  for (const projectId of projectIds) {
    const projectData = await env.PROJECTS.get(`project:${projectId}`);
    if (projectData) {
      projects.push(JSON.parse(projectData));
    }
  }
  
  // Sort by creation date, newest first
  projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return jsonResponse(projects);
}

export async function handleCreateProject(request: Request, env: Env): Promise<Response> {
  const auth = await authenticateRequest(request, env);
  
  if ('error' in auth) {
    return jsonResponse({ error: auth.error }, 401);
  }

  const { user } = auth;
  
  try {
    const body = await request.json() as {
      name: string;
      description: string;
      type: Project['type'];
    };
    
    if (!body.name || !body.description || !body.type) {
      return jsonResponse({ error: 'Missing required fields' }, 400);
    }
    
    // Create new project
    const project: Project = {
      id: `proj_${nanoid(12)}`,
      userId: user.id,
      name: body.name,
      description: body.description,
      type: body.type,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    
    // Store project
    await env.PROJECTS.put(`project:${project.id}`, JSON.stringify(project));
    
    // Update user's project list
    const projectsKey = `projects:${user.id}`;
    const projectIds = await env.PROJECTS.get(projectsKey, 'json') as string[] || [];
    projectIds.push(project.id);
    await env.PROJECTS.put(projectsKey, JSON.stringify(projectIds));
    
    return jsonResponse(project, 201);
  } catch (error) {
    console.error('Create project error:', error);
    return jsonResponse({ error: 'Invalid request' }, 400);
  }
}