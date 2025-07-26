import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import { AuthService } from './auth/authService.js';
import { EmbeddedPromptTools } from './tools/embeddedPromptTools.js';
import { logger } from './utils/logger.js';

// Server metadata
const SERVER_NAME = 'shadow-clone-mcp';
const SERVER_VERSION = '0.1.0';

class ShadowCloneMCPServer {
  private server: Server;
  private authService: AuthService;
  private tools: EmbeddedPromptTools;

  constructor() {
    this.server = new Server(
      {
        name: SERVER_NAME,
        version: SERVER_VERSION,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.authService = new AuthService();
    this.tools = new EmbeddedPromptTools(this.authService);

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      // Always return all tools, but indicate auth status in descriptions
      const isAuthenticated = await this.authService.isAuthenticated();
      const allTools = this.tools.getToolDefinitions();
      
      if (!isAuthenticated) {
        // Add auth required notice to tool descriptions
        return {
          tools: allTools.map(tool => {
            if (tool.name === 'authenticate') {
              return tool; // Keep authenticate tool as-is
            }
            return {
              ...tool,
              description: `${tool.description} (🔒 Authentication Required)`
            };
          }),
        };
      }

      // Return all tools normally when authenticated
      return {
        tools: allTools,
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Handle authentication separately
        if (name === 'authenticate') {
          if (!args || typeof args.apiKey !== 'string') {
            throw new McpError(
              ErrorCode.InvalidParams,
              'API key is required for authentication'
            );
          }
          const result = await this.authService.authenticate(args.apiKey);
          return {
            content: [
              {
                type: 'text',
                text: result.success 
                  ? `✅ Authenticated successfully! License type: ${result.licenseType}`
                  : `❌ Authentication failed: ${result.message}`,
              },
            ],
          };
        }

        // Check authentication for all other tools
        const isAuthenticated = await this.authService.isAuthenticated();
        if (!isAuthenticated) {
          throw new McpError(
            ErrorCode.InvalidRequest,
            'Please authenticate first using the authenticate tool'
          );
        }

        // Execute the requested tool
        const result = await this.tools.executeTool(name, args);
        
        return {
          content: [
            {
              type: 'text',
              text: result,
            },
          ],
        };
      } catch (error) {
        logger.error(`Tool execution error: ${error}`);
        
        if (error instanceof McpError) {
          throw error;
        }
        
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    logger.info('Shadow Clone MCP Server started');
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('Shutting down Shadow Clone MCP Server');
      await this.server.close();
      process.exit(0);
    });
  }
}

// Start the server
const server = new ShadowCloneMCPServer();
server.start().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});