import { z } from 'zod';
import { EmbeddedPromptTools } from './embedded-prompt-tools.js';
import { ModularTools } from './modular-tools.js';
import { UpdateChecker } from './update-checker.js';
import { WorkspaceInitializer } from './workspace-initializer.js';
import { validateToolInput } from '../utils/zod-validation.js';
import { initializeWorkspaceSchema } from '../schemas/tool-schemas.js';
import type { ToolDefinition } from './modular/types.js';

export class CombinedTools {
  private embeddedTools: EmbeddedPromptTools;
  private modularTools: ModularTools;
  private updateChecker: UpdateChecker;
  private workspaceInitializer: WorkspaceInitializer;
  // Dispatch sets built once at construction (R1 review feedback):
  // tool definitions are static, so re-mapping them on every call was
  // pure per-call allocation in the hot path.
  private readonly embeddedNames: ReadonlySet<string>;
  private readonly modularNames: ReadonlySet<string>;

  constructor() {
    this.embeddedTools = new EmbeddedPromptTools();
    this.modularTools = new ModularTools();
    this.updateChecker = new UpdateChecker();
    this.workspaceInitializer = new WorkspaceInitializer();
    this.embeddedNames = new Set(this.embeddedTools.getToolDefinitions().map(t => t.name));
    this.modularNames = new Set(this.modularTools.getToolDefinitions().map(t => t.name));
  }

  getToolDefinitions(): ToolDefinition[] {
    return [
      this.updateChecker.getToolDefinition(),
      this.workspaceInitializer.getToolDefinition(),
      ...this.embeddedTools.getToolDefinitions(),
      ...this.modularTools.getToolDefinitions(),
    ];
  }

  async executeTool(name: string, args: unknown): Promise<string> {
    const validatedArgs = validateToolInput(name, args);

    if (name === 'check_for_updates') {
      return this.updateChecker.checkForUpdates();
    }

    if (name === 'initialize_workspace') {
      // R2 review feedback: derive the cast type from the zod schema
      // (single source of truth) rather than from the method signature.
      // validatedArgs has already been schema-checked and path-confined
      // by validateToolInput.
      return this.workspaceInitializer.initializeWorkspace(
        (validatedArgs ?? {}) as z.infer<typeof initializeWorkspaceSchema>
      );
    }

    if (this.embeddedNames.has(name)) {
      return this.embeddedTools.executeTool(name, validatedArgs);
    }

    if (this.modularNames.has(name)) {
      return this.modularTools.executeTool(name, validatedArgs);
    }

    throw new Error(`Unknown tool: ${name}`);
  }
}
