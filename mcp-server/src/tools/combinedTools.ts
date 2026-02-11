import { EmbeddedPromptTools } from './embeddedPromptTools.js';
import { ModularTools } from './modularTools.js';
import { UpdateChecker } from './updateChecker.js';
import { WorkspaceInitializer } from './workspaceInitializer.js';

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

  constructor() {
    this.embeddedTools = new EmbeddedPromptTools();
    this.modularTools = new ModularTools();
    this.updateChecker = new UpdateChecker();
    this.workspaceInitializer = new WorkspaceInitializer();
  }

  getToolDefinitions(): ToolDefinition[] {
    // Combine tools from all classes
    const embedded = this.embeddedTools.getToolDefinitions();
    const modular = this.modularTools.getToolDefinitions();
    const updateTool = this.updateChecker.getToolDefinition();
    const workspaceTool = this.workspaceInitializer.getToolDefinition();

    // Return all tools, with utility tools first
    return [
      updateTool,
      workspaceTool,
      ...embedded,
      ...modular,
    ];
  }

  async executeTool(name: string, args: any): Promise<string> {
    // Check if it's the update checker
    if (name === 'check_for_updates') {
      return this.updateChecker.checkForUpdates();
    }

    // Check if it's the workspace initializer
    if (name === 'initialize_workspace') {
      return this.workspaceInitializer.initializeWorkspace(args);
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
