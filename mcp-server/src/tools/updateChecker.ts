import { exec } from 'child_process';
import { promisify } from 'util';
import { config } from '../config/production.js';

const execAsync = promisify(exec);

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export class UpdateChecker {

  getToolDefinition(): ToolDefinition {
    return {
      name: 'check_for_updates',
      description: 'Actually checks for updates to the MCP server (runs npm command) - returns version comparison results',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    };
  }

  // impure: shells out to npm; result depends on registry state.
  async checkForUpdates(): Promise<string> {
    const currentVersion = config.server.version;

    // SC-011 / AUDIT-025: the original swallowed every error and
    // returned `{ stdout: currentVersion }`, which then matched the
    // equality check and falsely told the user "up to date" when the
    // registry was actually unreachable. Now: registry failure is
    // explicitly distinguished from "matched" — we surface a specific
    // "could not contact npm registry" message instead of masking it
    // as success.
    //
    // Theme 5 R2: bound the wait (15s) so a stalled-but-not-erroring
    // socket doesn't hang the MCP tool indefinitely. Maxbuffer at 1 MiB
    // is plenty for a single version string.
    let latestVersion: string;
    try {
      const { stdout } = await execAsync(
        'npm view @shadow-clone/mcp-server version',
        { timeout: 15_000, maxBuffer: 1 << 20 }
      );
      latestVersion = stdout.trim();
      // Rule 8: validate the external response before using it.
      // npm should return a single semver string; anything else means
      // the registry payload is malformed or wrapped in extra output.
      if (!/^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/.test(latestVersion)) {
        return `⚠️ The npm registry returned an unexpected payload. Could not verify the latest version.

To manually update:
\`\`\`bash
npm update -g @shadow-clone/mcp-server
\`\`\``;
      }
    } catch {
      return `⚠️ Could not contact the npm registry to check for updates.

This is usually a network issue. To manually update when you are next online:
\`\`\`bash
npm update -g @shadow-clone/mcp-server
\`\`\`

To refresh in Claude Desktop:
1. Open Settings → Developer
2. Click the reload icon (↻) next to "shadow-clone"`;
    }

    if (latestVersion === currentVersion) {
      return `✅ Shadow Clone MCP Server is up to date (v${currentVersion})

To manually refresh the server in Claude Desktop:
1. Open Settings → Developer
2. Click the reload icon (↻) next to "shadow-clone"`;
    }

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
}