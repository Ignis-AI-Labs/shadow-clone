import { EmbeddedPromptTools } from './embeddedPromptTools.js';
import { ModularTools } from './modularTools.js';
import { UpdateChecker } from './updateChecker.js';
import { WorkspaceInitializer } from './workspaceInitializer.js';
import { validateToolInput } from '../utils/zodValidation.js';

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
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

  async executeTool(name: string, args: unknown): Promise<string> {
    const validatedArgs = validateToolInput(name, args);

    if (name === 'check_for_updates') {
      return this.updateChecker.checkForUpdates();
    }

    if (name === 'initialize_workspace') {
      // validatedArgs has been schema-checked and path-confined by
      // validateToolInput; safe to widen to the handler's input type.
      return this.workspaceInitializer.initializeWorkspace(
        (validatedArgs ?? {}) as Parameters<typeof this.workspaceInitializer.initializeWorkspace>[0]
      );
    }

    const embeddedToolNames = this.embeddedTools.getToolDefinitions().map(t => t.name);
    if (embeddedToolNames.includes(name)) {
      return this.embeddedTools.executeTool(name, validatedArgs);
    }

    const modularToolNames = this.modularTools.getToolDefinitions().map(t => t.name);
    if (modularToolNames.includes(name)) {
      return this.modularTools.executeTool(name, validatedArgs);
    }

    throw new Error(`Unknown tool: ${name}`);
  }
}
