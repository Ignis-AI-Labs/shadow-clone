# Shadow Clone API Specification for Cloudflare Worker

## Authentication

All endpoints except `/auth/validate` require the `X-API-Key` header:
```
X-API-Key: sk-xxxxxxxxxxxx
```

## Endpoints

### 1. POST /auth/validate
Validates an API key and returns user information.

**Request:**
```json
{
  "apiKey": "sk-xxxxxxxxxxxx"
}
```

**Response (200 OK):**
```json
{
  "valid": true,
  "userId": "user_123",
  "licenseType": "pioneer"  // "ignis_elite" | "pioneer" | "builder" | "reserve"
}
```

**Response (401 Unauthorized):**
```json
{
  "valid": false,
  "error": "Invalid API key"
}
```

### 2. GET /user/profile
Returns the authenticated user's profile.

**Response (200 OK):**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "licenseType": "pioneer",
  "createdAt": "2024-01-15T00:00:00Z"
}
```

### 3. GET /user/license-status
Returns detailed license information.

**Response (200 OK):**
```json
{
  "type": "pioneer",
  "status": "active",
  "features": {
    "maxProjects": 10,
    "maxAgentsPerWave": 10,
    "prioritySupport": false
  },
  "expiresAt": "2025-01-15T00:00:00Z"
}
```

### 4. GET /projects
Lists all projects for the authenticated user.

**Query Parameters:**
- `limit` (optional): Number of projects to return (default: 10)
- `offset` (optional): Pagination offset (default: 0)

**Response (200 OK):**
```json
[
  {
    "id": "proj_123",
    "name": "E-Commerce Platform",
    "description": "Modern e-commerce site with React",
    "status": "active",
    "createdAt": "2024-01-15T00:00:00Z",
    "lastDeployment": "2024-01-20T00:00:00Z"
  }
]
```

### 5. POST /projects
Creates a new project.

**Request:**
```json
{
  "name": "My New Project",
  "description": "Project description",
  "type": "web_app"  // "web_app" | "api" | "cli" | "library" | "other"
}
```

**Response (201 Created):**
```json
{
  "id": "proj_456",
  "name": "My New Project",
  "description": "Project description",
  "type": "web_app",
  "status": "active",
  "createdAt": "2024-01-25T00:00:00Z"
}
```

### 6. GET /projects/:id/deployments
Lists all deployments for a specific project.

**Response (200 OK):**
```json
[
  {
    "id": "deploy_123",
    "projectId": "proj_123",
    "waveNumber": 1,
    "agentCount": 5,
    "status": "completed",  // "pending" | "running" | "completed" | "failed"
    "createdAt": "2024-01-20T00:00:00Z",
    "completedAt": "2024-01-20T01:00:00Z"
  }
]
```

### 7. POST /projects/:id/deploy
Deploys agents for a project.

**Request:**
```json
{
  "projectId": "proj_123",
  "prompt": "Build a user authentication system",
  "agentCount": 5,
  "wavesDirectory": ".waves"
}
```

**Response (202 Accepted):**
```json
{
  "deploymentId": "deploy_456",
  "status": "pending",
  "message": "Deployment queued successfully"
}
```

## Error Responses

All endpoints may return these error responses:

**400 Bad Request:**
```json
{
  "error": "Invalid request",
  "message": "Detailed error message"
}
```

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing API key"
}
```

**404 Not Found:**
```json
{
  "error": "Not found",
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal error",
  "message": "An unexpected error occurred"
}
```

## CORS Headers

The Cloudflare Worker should include these CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-API-Key
```