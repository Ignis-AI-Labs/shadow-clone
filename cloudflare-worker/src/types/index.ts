export interface User {
  id: string;
  email: string;
  name: string;
  licenseType: 'ignis_elite' | 'pioneer' | 'builder' | 'reserve';
  createdAt: string;
  apiKey?: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  type: 'web_app' | 'api' | 'cli' | 'library' | 'other';
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  lastDeployment?: string;
}

export interface Deployment {
  id: string;
  projectId: string;
  userId: string;
  waveNumber: number;
  agentCount: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  prompt: string;
  createdAt: string;
  completedAt?: string;
}

export interface LicenseStatus {
  type: string;
  status: 'active' | 'expired' | 'suspended';
  features: {
    maxProjects: number;
    maxAgentsPerWave: number;
    prioritySupport: boolean;
  };
  expiresAt?: string;
}