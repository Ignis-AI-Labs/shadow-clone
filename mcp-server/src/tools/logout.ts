import { AuthService } from '../auth/authService.js';

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

/**
 * Logout Tool
 * This tool clears local credentials and notifies the backend
 * to revoke the session.
 */
export class LogoutTool {
  constructor(private authService: AuthService) {}

  getToolDefinition(): ToolDefinition {
    return {
      name: 'logout',
      description: 'Log out and revoke your current Shadow Clone session. Clears local credentials and notifies backend. Use this when you want to switch accounts or revoke access.',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      }
    };
  }

  async execute(): Promise<string> {
    // Check if already logged out
    const isAuthenticated = await this.authService.isAuthenticated();
    if (!isAuthenticated) {
      return `# Already Logged Out

You don't have an active session.

Use the \`authenticate\` tool to log in.`;
    }

    // Perform logout
    const result = await this.authService.logout();

    if (result.success) {
      return `# Logged Out Successfully

Your Shadow Clone session has been revoked.

**What was cleared:**
- Local API key cache
- Authentication data
- Verification cache
- Backend session notified

Use the \`authenticate\` tool to log in again.`;
    }

    return `# Logout Failed

${result.message}

Please try again or contact support if the issue persists.`;
  }
}
