<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
See LICENSE-PROPRIETARY.md for full terms.
-->

# Phase 1: Project Analysis & Safety Assessment

## Module Interface
- **Inputs**: 
  - `project_plan` path (or user request if no plan exists)
  - `workspace_dir` location
  - `project_type` specification (or "auto")
  - `git_strategy` setting
- **Outputs**: 
  - Project context object with type, scope, requirements
  - Safety measures applied
  - Git branch created (if applicable)
  - Initial workspace structure
  - **VERIFIED SYSTEM INITIALIZATION**
- **Dependencies**: 
  - **MANDATORY**: initialization_checklist.md
  - Mode configurations (if project_type specific)
  - Git integration utilities
  - ALL coordination rules

## Phase Objectives
1. **FIRST: Complete mandatory system initialization checklist**
2. Understand the project requirements and scope
3. Detect or determine the project type
4. Ensure workspace safety through backups and git branching
5. Create initial project structure
6. Prepare foundation for team configuration

## Execution Steps

### 0. MANDATORY System Initialization (MUST BE FIRST)
```python
def initialize_system():
    """
    CRITICAL: This MUST execute before ANY other steps
    Failure here = Complete system failure
    """
    # Load and execute initialization checklist
    checklist = load_file(".shadow/coordination_rules/initialization_checklist.md")
    
    # Verify ALL required system files
    required_files = [
        ".shadow/agent_rules/core_agent_rules.md",
        ".shadow/coordination_rules/file_organization_rules.md",
        ".shadow/coordination_rules/wave_coordination.md",
        ".shadow/coordination_rules/workspace_structure.md",
        ".shadow/coordination_rules/initialization_checklist.md"
    ]
    
    for file in required_files:
        if not exists(file):
            raise CriticalError(f"SYSTEM FAILURE: Missing {file}")
    
    # Load ALL core rules
    core_rules = load_all_core_rules()
    
    # Verify wave-0 enforcement is configured
    if "wave-0" not in core_rules:
        raise CriticalError("Wave-0 enforcement not configured!")
    
    log_success("System initialization complete")
    return True
```

### 1. Dynamic Project Plan Creation
If no project plan exists at the specified path:
```python
if not exists(project_plan):
    # Analyze user request from $ARGUMENTS
    user_request = parse_arguments($ARGUMENTS)
    
    # Generate structured plan
    project_plan_content = """
    # [Project Name - Inferred from Request]
    
    ## Overview
    [Generated from user description]
    
    ## Core Requirements
    [Extracted from user request]
    
    ## Technical Stack
    [Inferred from requirements and best practices]
    
    ## Success Criteria
    [Defined based on project type and requirements]
    
    ## Generated Notes
    - This plan was automatically generated from user request
    - Generated on: [timestamp]
    - User request: "[original user request]"
    """
    
    save_project_plan(project_plan_path, project_plan_content)
```

### 2. Project Type Detection
If `project_type` is "auto":
```python
def detect_project_type(workspace_dir, project_plan):
    # Check for existing codebase indicators
    if exists(f"{workspace_dir}/package.json") or exists(f"{workspace_dir}/requirements.txt"):
        if contains_keywords(project_plan, ["audit", "security", "review"]):
            return "audit"
        elif contains_keywords(project_plan, ["feature", "add", "implement"]):
            return "feature"
        elif contains_keywords(project_plan, ["refactor", "improve", "clean"]):
            return "refactor"
        elif contains_keywords(project_plan, ["debug", "fix", "issue"]):
            return "debug"
        elif contains_keywords(project_plan, ["optimize", "performance", "speed"]):
            return "optimize"
    else:
        return "new"
    
    # Research projects
    if contains_keywords(project_plan, ["research", "investigate", "explore"]):
        return "research"
    
    return "new"  # Default to new project
```

### 3. Git Strategy Assessment
```python
def determine_git_strategy(workspace_dir, git_strategy_param):
    if git_strategy_param != "auto":
        return git_strategy_param
    
    if exists(f"{workspace_dir}/.git"):
        # Existing repository
        return "safe_branch"
    elif should_use_git(workspace_dir):
        return "main"
    else:
        return "none"
```

### 4. Workspace Safety Analysis
For existing codebases:
```python
def apply_safety_measures(workspace_dir, project_type):
    # Create backup directory
    backup_dir = f"{workspace_dir}/.backup"
    create_directory(backup_dir)
    
    # Backup critical files
    critical_patterns = ["*.js", "*.py", "*.java", "*.go", "package.json", "requirements.txt"]
    for pattern in critical_patterns:
        backup_files(pattern, backup_dir)
    
    # Document existing structure
    create_file(f"{workspace_dir}/.waves/project_analysis.md", """
    # Existing Project Structure
    - Total files: [count]
    - Primary language: [detected]
    - Key directories: [list]
    - Dependencies: [summary]
    """)
    
    # Log safety measures
    log_safety_measures(f"{workspace_dir}/.waves/safety_log.md")
```

### 5. Git Branch Management
```python
def execute_git_strategy(workspace_dir, strategy, project_type):
    if strategy == "safe_branch":
        branch_name = f"shadow-clone/{project_type}-{timestamp()}"
        git_checkout_new_branch(branch_name)
    elif strategy == "branch":
        branch_name = f"shadow-clone/{project_type}"
        git_checkout_new_branch(branch_name)
    elif strategy == "main":
        # Work on current branch
        log_warning("Working on main branch")
    # strategy == "none" - skip git operations
```

### 6. Mode-Specific Analysis
Based on detected project_type, apply specialized analysis:
```python
if project_type == "audit":
    # Load comprehensive security assessment approach
    config = load_module(f".shadow/mode_configs/shadow-clone-audit.md")
    apply_audit_analysis(workspace_dir, config)
elif project_type == "optimize":
    # Check for existing audit results
    if exists(f"{workspace_dir}/.waves/audit_results.md"):
        previous_findings = load_audit_findings()
        prioritize_optimizations(previous_findings)
```

### 7. Project Context Creation
```python
project_context = {
    "type": project_type,
    "workspace": workspace_dir,
    "requirements": extract_requirements(project_plan),
    "technical_stack": detect_tech_stack(workspace_dir),
    "complexity": assess_complexity(project_plan, workspace_dir),
    "safety_measures": safety_report,
    "git_branch": current_branch,
    "mode_config": loaded_mode_config
}
```

## Deliverables
1. **Project Context Object**: Complete analysis results
2. **Safety Backup**: `.backup/` directory with critical files
3. **Project Analysis**: `.waves/project_analysis.md`
4. **Safety Log**: `.waves/safety_log.md`
5. **Git Branch**: New branch created (if applicable)
6. **Initial Workspace**: Basic directory structure created

## Quality Gates
Before proceeding to Phase 2:
- ✓ Project type successfully determined
- ✓ All safety measures completed
- ✓ Git strategy executed without errors
- ✓ Project context validated and complete
- ✓ Mode configuration loaded (if applicable)
- ✓ No critical risks identified

## Error Handling
- If project plan creation fails → Request user clarification
- If git operations fail → Log and continue with warnings
- If backup fails → Stop and request manual backup
- If type detection uncertain → Default to "new" with warning

## Success Metrics
- Project type detection accuracy: >95%
- Safety measure completion: 100%
- Git operation success rate: >99%
- Analysis time: <30 seconds for most projects