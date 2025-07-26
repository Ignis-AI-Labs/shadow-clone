import { AuthService } from '../auth/authService.js';
import { EmbeddedPromptTools } from './embeddedPromptTools.js';
import { ModularTools } from './modularTools.js';
import { UpdateChecker } from './updateChecker.js';

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

  constructor(private authService: AuthService) {
    this.embeddedTools = new EmbeddedPromptTools(authService);
    this.modularTools = new ModularTools(authService);
    this.updateChecker = new UpdateChecker(authService);
  }

  getToolDefinitions(): ToolDefinition[] {
    // Combine tools from all classes
    const embedded = this.embeddedTools.getToolDefinitions();
    const modular = this.modularTools.getToolDefinitions();
    const updateTool = this.updateChecker.getToolDefinition();
    
    // Return all tools, with authenticate and check_for_updates first
    return [
      ...embedded.filter(tool => tool.name === 'authenticate'),
      updateTool,
      ...embedded.filter(tool => tool.name !== 'authenticate'),
      ...modular,
    ];
  }

  async executeTool(name: string, args: any): Promise<string> {
    // Check if it's the update checker
    if (name === 'check_for_updates') {
      return this.updateChecker.checkForUpdates();
    }

    // Check if it's an embedded tool
    const embeddedToolNames = this.embeddedTools.getToolDefinitions().map(t => t.name);
    if (embeddedToolNames.includes(name)) {
      return this.embeddedTools.executeTool(name, args);
    }

    // Check if it's a modular tool
    const modularToolNames = this.modularTools.getToolDefinitions().map(t => t.name);
    if (modularToolNames.includes(name)) {
      return this.modularTools.executeTool(name, args);
    }

    throw new Error(`Unknown tool: ${name}`);
  }
}