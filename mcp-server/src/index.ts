#!/usr/bin/env node

/**
 * Shadow Clone MCP Server - Prompt Engineering Macro System
 * 
 * THIS IS A PROMPT DELIVERY SYSTEM - NOT AN EXECUTION ENGINE
 * 
 * What this server does:
 * - Delivers structured prompt engineering macros to AI assistants
 * - Returns instructions that teach AIs how to orchestrate complex tasks
 * - Provides methodology and patterns for simulating specialized agent behaviors
 * - Acts like "unlocking new powers" for AI by teaching advanced techniques
 * 
 * What this server DOES NOT do:
 * - Does NOT execute code in the background
 * - Does NOT run processes or manage tasks
 * - Does NOT handle any actual implementation
 * 
 * Think of it as:
 * - A macro system for prompt engineering
 * - A toolkit of professional methodologies
 * - An instruction manual that AIs follow
 * - A way to inject expert knowledge into any AI conversation
 * 
 * The AI receiving these prompts will:
 * - Read the instructions and understand the methodology
 * - Follow the patterns to complete tasks professionally
 * - Create deliverables in .waves/ folder (never .shadow/)
 * - Simulate specialized agent behaviors based on the prompts
 * 
 * This system is AI-agnostic and enhances any AI CLI or chat interface
 * by providing battle-tested prompt engineering patterns.
 * 
 * Exception: check_for_updates is the ONLY tool that executes code (npm commands)
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import { exec } from 'child_process';
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

/**
 * Check if running inside WSL (Windows Subsystem for Linux)
 */
function isWSL(): boolean {
  try {
    const release = require('os').release().toLowerCase();
    return release.includes('microsoft') || release.includes('wsl');
  } catch {
    return false;
  }
}

/**
 * Open URL in the user's default browser (cross-platform, including WSL)
 */
function openBrowser(url: string): void {
  let command: string;

  if (process.platform === 'win32') {
    command = `start "" "${url}"`;
  } else if (process.platform === 'darwin') {
    command = `open "${url}"`;
  } else if (isWSL()) {
    // WSL: use Windows cmd.exe to open URL in Windows browser
    command = `cmd.exe /c start "" "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }

  exec(command, (error) => {
    if (error) {
      logError(error, { context: 'openBrowser', url, platform: process.platform, isWSL: isWSL() });
    }
  });
}

class ShadowCloneMCPServer {
  private server: Server;
  private authService!: AuthService;
  private tools!: CombinedTools;

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
    // Note: authService and tools are initialized in start() using factory pattern
  }

  /**
   * Initialize services asynchronously using factory pattern
   */
  private async initializeServices(): Promise<void> {
    // Use factory method for proper async initialization
    this.authService = await AuthService.create();
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
          // Check if already authenticated
          if (await this.authService.isAuthenticated()) {
            const licenseType = await this.authService.getLicenseType();
            logPerformance('authenticate', Date.now() - startTime, {
              success: true,
              alreadyAuthenticated: true
            });
            return {
              content: [
                {
                  type: 'text',
                  text: `Already authenticated!\nLicense: ${licenseType}\n\nYou can use all Shadow Clone tools.`,
                },
              ],
            };
          }

          // Check if browser auth is already pending
          if (this.authService.isBrowserAuthPending()) {
            const url = this.authService.getBrowserAuthUrl();
            return {
              content: [
                {
                  type: 'text',
                  text: `# Authentication In Progress

A browser authentication session is already active.

Please open the following URL in your browser:

**${url}**

Enter your Shadow Clone API key on the page.
Get your API key at: https://dashboard.ignislabs.ai

After authenticating in the browser, you can use all Shadow Clone tools.`,
                },
              ],
            };
          }

          // Start browser-based authentication
          const { url } = await this.authService.startBrowserAuth();

          logPerformance('authenticate', Date.now() - startTime, {
            success: true,
            browserAuthStarted: true
          });
          return {
            content: [
              {
                type: 'text',
                text: `# Authentication Required

Please open the following URL in your browser:

**${url}**

Enter your Shadow Clone API key on the page.
Get your API key at: https://dashboard.ignislabs.ai

After authenticating in the browser, you can use all Shadow Clone tools.`,
              },
            ],
          };
        }

        // Handle logout separately with browser-based flow
        if (validatedName === 'logout') {
          // Check if already logged out (use hasLocalSession to avoid NFT verification)
          if (!await this.authService.hasLocalSession()) {
            logPerformance('logout', Date.now() - startTime, {
              success: true,
              alreadyLoggedOut: true
            });
            return {
              content: [
                {
                  type: 'text',
                  text: `# Already Logged Out

You don't have an active session.

Use the \`authenticate\` tool to log in.`,
                },
              ],
            };
          }

          // Check if browser logout is already pending
          if (this.authService.isBrowserLogoutPending()) {
            const url = this.authService.getBrowserAuthUrl();
            return {
              content: [
                {
                  type: 'text',
                  text: `# Logout In Progress

A browser logout session is already active.

Please open the following URL in your browser:

**${url}**

Complete the logout process in your browser.`,
                },
              ],
            };
          }

          // Start browser-based logout
          const { url } = await this.authService.startBrowserLogout();
          openBrowser(url);

          logPerformance('logout', Date.now() - startTime, {
            success: true,
            browserLogoutStarted: true
          });
          return {
            content: [
              {
                type: 'text',
                text: `# Logout Options

A browser window has been opened for you to complete the logout process.

**URL:** ${url}

## Options Available:
1. **Copy API Key & Logout Locally** - Keep your key valid for later use
2. **Revoke API Key Permanently** - Requires wallet signature, key cannot be recovered

Complete the logout process in your browser.`,
              },
            ],
          };
        }

        // Check authentication for all other tools
        const isAuthenticated = await this.authService.isAuthenticated();
        if (!isAuthenticated) {
          // Check if we have auth data but NFT is missing
          const hasAuthData = await this.authService.getApiKey() !== null;
          const message = hasAuthData
            ? 'NFT license not found in wallet. Please ensure you own an active Shadow Clone NFT.'
            : 'Please authenticate first using the authenticate tool';
          
          throw new McpError(
            ErrorCode.InvalidRequest,
            message
          );
        }
        
        // Start validation polling if not already running (user may have just authenticated)
        if (!this.authService.isValidationPollingActive()) {
          this.authService.startValidationPolling();
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
    logInfo('Shadow Clone MCP Server initializing...', {
      version: config.server.version,
      environment: config.server.environment
    });

    // Initialize services using factory pattern before setting up handlers
    await this.initializeServices();

    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    // Proactive authentication: check auth status and auto-open browser if needed
    const isAuthenticated = await this.authService.isAuthenticated();
    if (!isAuthenticated) {
      const { url } = await this.authService.startBrowserAuth();
      openBrowser(url);
      logInfo('Authentication required - browser opened automatically', { url });
    } else {
      // Start validation polling if already authenticated
      this.authService.startValidationPolling();
      logInfo('Validation polling started - session will be checked every minute');
    }

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
        // Stop validation polling first
        this.authService.stopValidationPolling();
        
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