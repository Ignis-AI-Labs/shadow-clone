# Shadow Clone VSCode Extension Transformation Plan

## From API Integration to Universal Macro Prompting Tool

### Overview

Transform the Shadow Clone VSCode extension from an API-based tool into a universal macro prompting system that enhances any AI assistant with advanced prompt engineering capabilities.

## Core Transformation Goals

1. **Remove API Dependencies**: Shift from API calls to prompt injection
2. **Universal Compatibility**: Work with any AI CLI or chat interface
3. **Prompt Library System**: Comprehensive prompt template management
4. **Enhanced Developer Experience**: Streamlined prompt engineering workflow

## New Architecture

### 1. Macro Command System
Replace API calls with macro commands that inject prompts:

```typescript
interface MacroCommand {
  name: string;           // e.g., "/shadow-orchestrate"
  description: string;    
  category: string;       // orchestration, team, expert, utility
  parameters: {
    required: string[];
    optional: string[];
  };
  promptTemplate: string; // The actual prompt to inject
  shortcuts?: string[];   // Keyboard shortcuts
}
```

### 2. Prompt Template Engine
```typescript
class PromptTemplateEngine {
  // Parse parameters and inject into template
  renderTemplate(template: string, params: Record<string, any>): string;
  
  // Validate parameters
  validateParams(command: MacroCommand, params: Record<string, any>): boolean;
  
  // Format for specific AI platforms
  formatForPlatform(prompt: string, platform: AIPlatform): string;
}
```

### 3. AI Platform Integration
```typescript
enum AIPlatform {
  ClaudeDesktop = "claude-desktop",
  GitHubCopilot = "github-copilot",
  Continue = "continue",
  Cursor = "cursor",
  ChatGPT = "chatgpt",
  Generic = "generic"
}

interface PlatformAdapter {
  detect(): boolean;
  inject(prompt: string): Promise<void>;
  format(prompt: string): string;
}
```

## Feature Specifications

### 1. Command Palette Integration
- **Command**: `Shadow Clone: Insert Macro`
- **UI**: Quick pick with categories and search
- **Preview**: Show prompt preview before insertion
- **History**: Recent macros for quick access

### 2. Prompt Library Manager
```typescript
interface PromptLibrary {
  // Built-in prompts
  builtIn: MacroCommand[];
  
  // User custom prompts  
  custom: MacroCommand[];
  
  // Team shared prompts
  shared: MacroCommand[];
  
  // CRUD operations
  create(command: MacroCommand): void;
  update(id: string, command: MacroCommand): void;
  delete(id: string): void;
  share(id: string, team: string): void;
}
```

### 3. Context-Aware Suggestions
- Detect current file type and suggest relevant macros
- Analyze current code and recommend appropriate commands
- Smart parameter suggestions based on context

### 4. Macro Builder UI
Visual interface for creating custom macros:
- Template editor with syntax highlighting
- Parameter definition
- Live preview
- Test execution

## Implementation Plan

### Phase 1: Core Infrastructure (Week 1-2)
1. Remove API authentication system
2. Implement macro command structure
3. Create prompt template engine
4. Basic command palette integration

### Phase 2: Prompt Library (Week 3-4)
1. Convert existing prompts to macro format
2. Implement prompt storage system
3. Create CRUD operations
4. Add import/export functionality

### Phase 3: Platform Integration (Week 5-6)
1. Detect AI platforms in workspace
2. Implement platform adapters
3. Add injection mechanisms
4. Test with major platforms

### Phase 4: Enhanced Features (Week 7-8)
1. Context-aware suggestions
2. Macro builder UI
3. Keyboard shortcuts
4. Team sharing capabilities

### Phase 5: Polish & Release (Week 9-10)
1. User documentation
2. Migration guide for existing users
3. Performance optimization
4. Beta testing and feedback

## Migration Strategy

### For Existing Users
1. **Automatic Migration**: Convert existing settings to macro format
2. **Compatibility Mode**: Temporary support for old commands
3. **Migration Wizard**: Guide users through the transition
4. **Documentation**: Clear upgrade instructions

### Data Migration
```typescript
// Old format
{
  "shadow-clone.apiKey": "sk-shadow-xxx",
  "shadow-clone.mode": "feature"
}

// New format
{
  "shadow-clone.defaultMacros": {
    "orchestrate": {
      "mode": "feature",
      "outputDir": "./.waves/"
    }
  },
  "shadow-clone.customMacros": []
}
```

## New Commands

### Core Commands
- `shadow-clone.insertMacro`: Open macro picker
- `shadow-clone.createMacro`: Create new macro
- `shadow-clone.editMacro`: Edit existing macro
- `shadow-clone.manageMacros`: Open macro library

### Quick Commands
- `shadow-clone.quickOrchestrate`: Fast orchestration
- `shadow-clone.quickTeam`: Deploy team quickly
- `shadow-clone.quickExpert`: Summon expert
- `shadow-clone.quickFix`: Rapid debugging

## UI Components

### 1. Macro Picker
```
┌─────────────────────────────────────┐
│ 🔍 Search macros...                 │
├─────────────────────────────────────┤
│ 📦 Orchestration                    │
│   └─ Full Project Orchestration     │
│   └─ Planning Mode                  │
│   └─ Single Wave Execution          │
│ 👥 Teams                            │
│   └─ Frontend Team                  │
│   └─ Backend Team                   │
│   └─ Security Team                  │
│ 🧠 Experts                          │
│   └─ React Expert                   │
│   └─ API Designer                   │
└─────────────────────────────────────┘
```

### 2. Parameter Input
```
┌─────────────────────────────────────┐
│ Shadow Clone: Full Orchestration    │
├─────────────────────────────────────┤
│ Mode: [feature    ▼]                │
│ Project: [____________________]     │
│ □ Include planning phase            │
│ □ Generate tests                    │
├─────────────────────────────────────┤
│ [Preview] [Cancel] [Insert]         │
└─────────────────────────────────────┘
```

### 3. Macro Builder
```
┌─────────────────────────────────────┐
│ Create Custom Macro                 │
├─────────────────────────────────────┤
│ Name: /shadow-___________           │
│ Category: [Select...  ▼]            │
│ Description: [_________________]    │
├─────────────────────────────────────┤
│ Parameters:                         │
│ + Add Parameter                     │
├─────────────────────────────────────┤
│ Template:                           │
│ ┌─────────────────────────────┐    │
│ │ Act as a Shadow Clone {role}│    │
│ │ specializing in {task}.     │    │
│ │                             │    │
│ │ Your approach:              │    │
│ │ 1. {step1}                  │    │
│ │ 2. {step2}                  │    │
│ └─────────────────────────────┘    │
├─────────────────────────────────────┤
│ [Test] [Save] [Cancel]              │
└─────────────────────────────────────┘
```

## Benefits of Transformation

### 1. Universal Compatibility
- Works with any AI assistant
- No API dependencies
- Platform agnostic

### 2. Enhanced Flexibility
- Custom prompt creation
- Team sharing
- Rapid iteration

### 3. Better Developer Experience
- Faster prompt engineering
- Consistent methodologies
- Reusable templates

### 4. Cost Efficiency
- No API calls
- No subscription required
- Open source approach

## Success Metrics

1. **Adoption Rate**: 80% of existing users migrate successfully
2. **Usage Frequency**: 5x increase in command usage
3. **Platform Coverage**: Support for top 10 AI platforms
4. **Custom Macros**: Average 10+ custom macros per user
5. **Performance**: <100ms macro injection time

## Risk Mitigation

1. **User Confusion**: Clear documentation and migration guide
2. **Feature Parity**: Ensure all functionality is preserved
3. **Performance**: Optimize prompt rendering and injection
4. **Compatibility**: Test across all major platforms

## Timeline

- **Month 1**: Core transformation
- **Month 2**: Feature enhancement
- **Month 3**: Beta testing and release

This transformation positions Shadow Clone as the universal prompt engineering toolkit for all AI-assisted development.