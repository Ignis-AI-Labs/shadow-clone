const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all origins during testing
app.use(cors());
app.use(express.json());

// Mock database
const mockData = {
  users: {
    '123': {
      id: '123',
      licenseType: 'pioneer',
      licenseNumber: 'P-001',
      activeProjects: 2,
      totalDeployments: 5,
      createdAt: new Date('2024-01-01')
    }
  },
  projects: [
    {
      id: '1',
      name: 'E-Commerce Platform',
      status: 'active',
      description: 'Building a modern e-commerce platform with React and Node.js',
      createdAt: new Date('2024-01-15'),
      lastDeployment: new Date('2024-01-20')
    },
    {
      id: '2', 
      name: 'Data Analytics Dashboard',
      status: 'completed',
      description: 'Real-time analytics dashboard for business metrics',
      createdAt: new Date('2024-01-10'),
      lastDeployment: new Date('2024-01-18')
    }
  ],
  deployments: {
    '1': [
      {
        id: 'd1',
        projectId: '1',
        waveNumber: 1,
        agentCount: 5,
        status: 'completed',
        createdAt: new Date('2024-01-20')
      }
    ]
  }
};

// Auth middleware
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== 'test-key-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.userId = '123';
  next();
};

// Mock auth validation endpoint
app.post('/auth/validate', (req, res) => {
  const { apiKey } = req.body;
  console.log('Auth validation request:', { 
    apiKey,
    headers: req.headers,
    body: req.body 
  });
  
  if (apiKey === 'test-key-123') {
    console.log('✅ Authentication successful for test-key-123');
    res.json({
      valid: true,
      userId: '123',
      licenseType: 'pioneer'
    });
  } else {
    console.log('❌ Authentication failed. Expected: test-key-123, Got:', apiKey);
    res.status(401).json({ 
      valid: false,
      error: 'Invalid API key' 
    });
  }
});

// Mock projects endpoints
app.get('/projects', authenticate, (req, res) => {
  console.log('Fetching projects');
  res.json(mockData.projects);
});

app.post('/projects', authenticate, (req, res) => {
  console.log('Creating project:', req.body);
  const newProject = {
    id: String(mockData.projects.length + 1),
    ...req.body,
    status: 'active',
    createdAt: new Date()
  };
  mockData.projects.push(newProject);
  res.json(newProject);
});

// Mock user endpoints
app.get('/user/profile', authenticate, (req, res) => {
  console.log('Fetching user profile');
  res.json(mockData.users[req.userId]);
});

// Mock subscription/license status endpoint
app.get('/user/license-status', authenticate, (req, res) => {
  console.log('Fetching license status');
  const user = mockData.users[req.userId];
  res.json({ 
    licenseType: user.licenseType,
    isActive: true,
    expiresAt: user.licenseType === 'ignis_elite' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // NFT holders don't expire
    features: {
      maxConcurrentProjects: user.licenseType === 'ignis_elite' ? 10 : 5,
      prioritySupport: user.licenseType === 'ignis_elite' || user.licenseType === 'reserve',
      earlyAccess: user.licenseType === 'ignis_elite' || user.licenseType === 'pioneer'
    }
  });
});

// Mock agents endpoint
app.get('/agents/active', authenticate, (req, res) => {
  console.log('Fetching active agents');
  res.json([
    {
      id: 'a1',
      name: 'Frontend Developer',
      role: 'frontend',
      status: 'active',
      projectId: '1',
      projectName: 'E-Commerce Platform',
      currentTask: 'Building product catalog component',
      progress: 75
    },
    {
      id: 'a2',
      name: 'Backend Developer',
      role: 'backend',
      status: 'idle',
      projectId: '1',
      projectName: 'E-Commerce Platform',
      currentTask: null,
      progress: 100
    }
  ]);
});

// Mock deployments endpoint
app.get('/projects/:projectId/deployments', authenticate, (req, res) => {
  const { projectId } = req.params;
  console.log('Fetching deployments for project:', projectId);
  res.json(mockData.deployments[projectId] || []);
});

// Mock deployment endpoint
app.post('/projects/:projectId/deploy', authenticate, (req, res) => {
  const { projectId } = req.params;
  console.log('Deploying agents for project:', projectId, req.body);
  
  res.json({
    deploymentId: 'd' + Date.now(),
    estimatedTime: '5-10 minutes',
    agentCount: req.body.agents ? req.body.agents.length : 10
  });
});

// WebSocket mock (simplified)
app.get('/ws/deploy/:projectId', (req, res) => {
  res.json({ 
    message: 'WebSocket endpoint - use ws:// protocol in production' 
  });
});

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`
🚀 Shadow Clone Mock API Server Running
====================================
URL: http://localhost:${PORT}
Test API Key: test-key-123

Available endpoints:
- POST /auth/validate
- GET  /projects
- POST /projects
- GET  /user/profile
- GET  /credits/balance
- GET  /agents/active
- GET  /projects/:id/deployments
- POST /projects/:id/deploy

To use with extension:
1. Set shadowClone.apiEndpoint to http://localhost:${PORT}
2. Use API key: test-key-123
`);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use!`);
    console.log('\nTry one of these solutions:');
    console.log('1. Kill the process: lsof -ti:' + PORT + ' | xargs kill -9');
    console.log('2. Use a different port: PORT=3001 node test-server.js');
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});