import { AuthService } from '../auth/authService.js';
import { EmbeddedPromptTools } from './embeddedPromptTools.js';
import { ModularTools } from './modularTools.js';
import { UpdateChecker } from './updateChecker.js';
import { WorkspaceInitializer } from './workspaceInitializer.js';
import { ApiKeyStatus } from './apiKeyStatus.js';
import { LogoutTool } from './logout.js';
import { validateToolInput } from '../utils/zodValidation.js';

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export class CombinedTools {
  private embeddedTools: EmbeddedPromptTools;
  private modularTools: ModularTools;
  private updateChecker: UpdateChecker;
  private workspaceInitializer: WorkspaceInitializer;
  private apiKeyStatus: ApiKeyStatus;
  private logoutTool: LogoutTool;

  constructor(private authService: AuthService) {
    this.embeddedTools = new EmbeddedPromptTools(authService);
    this.modularTools = new ModularTools(authService);
    this.updateChecker = new UpdateChecker(authService);
    this.workspaceInitializer = new WorkspaceInitializer(authService);
    this.apiKeyStatus = new ApiKeyStatus(authService);
    this.logoutTool = new LogoutTool(authService);
  }

  getToolDefinitions(): ToolDefinition[] {
    // Combine tools from all classes
    const embedded = this.embeddedTools.getToolDefinitions();
    const modular = this.modularTools.getToolDefinitions();
    const updateTool = this.updateChecker.getToolDefinition();
    const workspaceTool = this.workspaceInitializer.getToolDefinition();
    const statusTool = this.apiKeyStatus.getToolDefinition();
    const logoutTool = this.logoutTool.getToolDefinition();
    
    // Return all tools, with utility tools first (authenticate, logout, status...)
    return [
      ...embedded.filter(tool => tool.name === 'authenticate'),
      logoutTool,
      statusTool,
      updateTool,
      workspaceTool,
      ...embedded.filter(tool => tool.name !== 'authenticate'),
      ...modular,
    ];
  }

  async executeTool(name: string, args: any): Promise<string> {
    // Validate input with Zod schema before processing
    const validatedArgs = validateToolInput(name, args);
    
    // Check if it's the logout tool
    if (name === 'logout') {
      return this.logoutTool.execute();
    }

    // Check if it's the update checker
    if (name === 'check_for_updates') {
      return this.updateChecker.checkForUpdates();
    }

    // Check if it's the workspace initializer
    if (name === 'initialize_workspace') {
      return this.workspaceInitializer.initializeWorkspace(validatedArgs);
    }

    // Check if it's the API key status
    if (name === 'api_key_status') {
      return this.apiKeyStatus.checkStatus(validatedArgs);
    }

    // Check if it's an embedded tool
    const embeddedToolNames = this.embeddedTools.getToolDefinitions().map(t => t.name);
    if (embeddedToolNames.includes(name)) {
      return this.embeddedTools.executeTool(name, validatedArgs);
    }

    // Check if it's a modular tool
    const modularToolNames = this.modularTools.getToolDefinitions().map(t => t.name);
    if (modularToolNames.includes(name)) {
      return this.modularTools.executeTool(name, validatedArgs);
    }

    throw new Error(`Unknown tool: ${name}`);
  }
}