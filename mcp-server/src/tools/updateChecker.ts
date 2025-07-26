import { exec } from 'child_process';
import { promisify } from 'util';
import { AuthService } from '../auth/authService.js';

const execAsync = promisify(exec);

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export class UpdateChecker {
  constructor(private authService: AuthService) {}

  getToolDefinition(): ToolDefinition {
    return {
      name: 'check_for_updates',
      description: 'Check if a newer version of Shadow Clone MCP Server is available',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    };
  }

  async checkForUpdates(): Promise<string> {
    try {
      // Get current version
      const currentVersion = '0.1.0'; // This should match package.json
      
      // Check npm for latest version
      const { stdout } = await execAsync('npm view @shadow-clone/mcp-server version').catch(() => ({ stdout: currentVersion }));
      const latestVersion = stdout.trim();
      
      if (latestVersion === currentVersion) {
        return `✅ Shadow Clone MCP Server is up to date (v${currentVersion})

To manually refresh the server in Claude Desktop:
1. Open Settings → Developer
2. Click the reload icon (↻) next to "shadow-clone"`;
      } else {
        return `🆕 Update available! 
Current version: v${currentVersion}
Latest version: v${latestVersion}

To update:
\`\`\`bash
npm update -g @shadow-clone/mcp-server
\`\`\`

After updating:
1. Restart Claude Desktop
2. Or click the reload icon (↻) in Settings → Developer → shadow-clone`;
      }
    } catch (error) {
      return `⚠️ Could not check for updates. 

To manually update:
\`\`\`bash
npm update -g @shadow-clone/mcp-server
\`\`\`

To refresh in Claude Desktop:
1. Open Settings → Developer
2. Click the reload icon (↻) next to "shadow-clone"`;
    }
  }
}