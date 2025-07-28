/**
 * Shadow Clone MCP Server
 * 
 * IMPORTANT: How these tools work:
 * - Most tools DO NOT execute anything in the background
 * - They return instructions/prompts that guide AI assistants on how to orchestrate the Shadow Clone system
 * - The AI uses these instructions to understand project structure and simulate specialized agent behaviors
 * - All deliverables are created in .waves/ folder (never .shadow/)
 * - The .shadow/ folder contains internal prompts that should NEVER be exposed to users
 * - This system is AI-agnostic and works with any AI that can follow structured instructions
 * 
 * Exception: check_for_updates actually runs npm commands to check versions
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import { AuthService } from './auth/authService.js';
import { CombinedTools } from './tools/combinedTools.js';
import { logger, logInfo, logError, logPerformance } from './utils/logger.js';
import { config, validateConfig } from './config/production.js';
import { validateToolName, validateString, sanitizeObject } from './utils/validation.js';
import { globalRateLimiter } from './utils/rateLimiter.js';
import { healthMonitor } from './utils/monitoring.js';

// Validate configuration on startup
try {
  validateConfig();
} catch (error) {
  logError(error as Error);
  process.exit(1);
}

class ShadowCloneMCPServer {
  private server: Server;
  private authService: AuthService;
  private tools: CombinedTools;

  constructor() {
    this.server = new Server(
      {
        name: config.server.name,
        version: config.server.version,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.authService = new AuthService();
    this.tools = new CombinedTools(this.authService);

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

    // Handle tool calls with rate limiting and validation
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const startTime = Date.now();
      
      // Apply rate limiting (using a simple client ID for MCP)
      const clientId = 'mcp-client'; // In production, derive from connection metadata
      globalRateLimiter.check(clientId);
      
      // Record request for monitoring
      healthMonitor.recordRequest();
      
      const { name, arguments: args } = request.params;
      
      // Validate tool name
      const validatedName = validateToolName(name);

      try {
        // Handle authentication separately
        if (validatedName === 'authenticate') {
          const apiKey = validateString(args?.apiKey, 'apiKey', { 
            required: true, 
            minLength: 10,
            maxLength: 200 
          });
          
          if (!apiKey) {
            throw new McpError(
              ErrorCode.InvalidParams,
              'API key is required for authentication'
            );
          }
          
          const result = await this.authService.authenticate(apiKey);
          
          logPerformance('authenticate', Date.now() - startTime, { 
            success: result.success 
          });
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

        // Sanitize arguments before execution
        const sanitizedArgs = args ? sanitizeObject(args) : {};
        
        // Execute the requested tool with timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Tool execution timeout')), config.performance.maxExecutionTime);
        });
        
        const result = await Promise.race([
          this.tools.executeTool(validatedName, sanitizedArgs),
          timeoutPromise
        ]) as string;
        
        logPerformance(`tool:${validatedName}`, Date.now() - startTime);
        
        return {
          content: [
            {
              type: 'text',
              text: result,
            },
          ],
        };
      } catch (error) {
        const duration = Date.now() - startTime;
        
        // Record error for monitoring
        healthMonitor.recordError();
        
        logError(error as Error, { 
          tool: validatedName, 
          duration,
          clientId 
        });
        
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
    
    // Set up health monitoring
    healthMonitor.setAuthCheck(async () => {
      try {
        return await this.authService.isAuthenticated();
      } catch {
        return false;
      }
    });
    
    // Start metrics logging in production
    if (config.performance.enableMetrics) {
      healthMonitor.startMetricsLogging(60000); // Log every minute
    }
    
    logInfo(`Shadow Clone MCP Server started`, {
      version: config.server.version,
      environment: config.server.environment,
      logLevel: config.logging.level,
      rateLimit: `${config.rateLimit.maxRequests} requests per ${config.rateLimit.windowMs}ms`
    });
    
    if (config.server.environment === 'production') {
      logInfo('Running in production mode with enhanced security and monitoring');
    }
    
    // Handle graceful shutdown
    const shutdown = async (signal: string) => {
      logInfo(`Received ${signal}, starting graceful shutdown`, {
        timeout: config.server.gracefulShutdownTimeout
      });
      
      const shutdownTimeout = setTimeout(() => {
        logError('Graceful shutdown timeout exceeded, forcing exit');
        process.exit(1);
      }, config.server.gracefulShutdownTimeout);
      
      try {
        await this.server.close();
        globalRateLimiter.destroy();
        clearTimeout(shutdownTimeout);
        logInfo('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        logError(error as Error, { context: 'shutdown' });
        process.exit(1);
      }
    };
    
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    
    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      logError(error, { context: 'uncaughtException' });
      shutdown('uncaughtException');
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      logError(new Error(`Unhandled rejection: ${reason}`), { 
        context: 'unhandledRejection',
        promise: promise.toString()
      });
      shutdown('unhandledRejection');
    });
  }
}

// Start the server
const server = new ShadowCloneMCPServer();
server.start().catch((error) => {
  logError(error, { context: 'startup' });
  process.exit(1);
});