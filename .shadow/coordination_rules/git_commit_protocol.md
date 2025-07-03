<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
See LICENSE-PROPRIETARY.md for full terms.
-->

# Git Commit Protocol - Final Wave Commits Only

## Core Principle
**NO commits during execution. ALL commits happen ONLY after the final wave completes successfully.**

## Why This Matters
1. **Atomic Changes**: All changes from all waves form a single logical unit
2. **Clean History**: One meaningful commit instead of fragmented wave commits
3. **Easy Rollback**: Can revert entire feature/fix with single operation
4. **Professional Workflow**: Matches enterprise development practices
5. **Constitution Alignment**: Complete context captured before committing

## Git Strategy Options

### 1. "auto" (Default)
```python
if exists(".git"):
    if is_clean_working_tree():
        use "safe_branch"
    else:
        use "main" with warning
else:
    use "none"
```

### 2. "safe_branch"
- Creates: `shadow-clone/{project_type}-{timestamp}`
- Example: `shadow-clone/feature-20250103-142536`
- All work happens on feature branch
- Commit only after final wave

### 3. "branch"
- Creates: `shadow-clone/{project_type}`
- Example: `shadow-clone/feature`
- Simpler branch naming
- May conflict if branch exists

### 4. "main"
- Works on current branch
- **WARNING**: Direct modifications
- Use only when explicitly requested
- Still no commits until final wave

### 5. "none"
- No git operations at all
- For non-git projects
- User handles version control

## Commit Protocol Enforcement

### During Waves (NO COMMITS)
```python
def wave_execution_git_rules():
    """
    ENFORCED during ALL wave execution
    """
    # Allowed operations
    allowed = [
        "git status",      # Check current state
        "git diff",        # Review changes
        "git add",         # Stage files (but don't commit)
        "git stash",       # Temporary storage if needed
        "git log",         # View history
        "git branch"       # Check branches
    ]
    
    # FORBIDDEN operations
    forbidden = [
        "git commit",      # NO commits during waves
        "git push",        # NO pushing during waves
        "git merge",       # NO merging during waves
        "git rebase",      # NO rebasing during waves
        "git tag"          # NO tagging during waves
    ]
    
    return enforce_git_restrictions(allowed, forbidden)
```

### After Final Wave (COMMIT TIME)
```python
def final_wave_commit_protocol():
    """
    ONLY executes after ALL waves complete successfully
    """
    # 1. Verify all waves completed
    if not all_waves_completed():
        raise Error("Cannot commit - waves incomplete")
    
    # 2. Verify constitution updated
    if not constitution_fully_updated():
        raise Error("Cannot commit - constitution incomplete")
    
    # 3. Run final quality checks
    quality_results = run_final_quality_gates()
    if not quality_results.passed:
        raise Error(f"Cannot commit - quality issues: {quality_results.issues}")
    
    # 4. Stage all changes
    git_add_all_wave_deliverables()
    
    # 5. Generate commit message
    commit_msg = generate_commit_message()
    
    # 6. Create the commit
    git_commit(commit_msg)
    
    # 7. Log completion
    log_commit_details()
    
    return commit_success
```

## Commit Message Generation

### Automatic Message Structure
```markdown
{project_type}: {brief_description}

Wave Summary:
- Wave 0: {planning_summary}
- Wave 1: {wave_1_summary}
- Wave 2: {wave_2_summary}
[... continue for all waves]

Key Changes:
- {major_change_1}
- {major_change_2}
- {major_change_3}

Technical Details:
- Files modified: {count}
- Tests added: {count}
- Documentation updated: {yes/no}

This commit represents the complete implementation of:
{project_description_from_constitution}

Shadow Clone Execution ID: {execution_id}
```

### Commit Message Examples

#### Feature Implementation
```
feature: Add user authentication system

Wave Summary:
- Wave 0: Planning and architecture design
- Wave 1: Core authentication implementation
- Wave 2: UI components and integration
- Wave 3: Testing and documentation

Key Changes:
- Implemented JWT-based authentication
- Added login/logout UI components
- Created user session management
- Added comprehensive test suite

Technical Details:
- Files modified: 47
- Tests added: 23
- Documentation updated: yes

This commit represents the complete implementation of:
User authentication system with JWT tokens, session management, and UI

Shadow Clone Execution ID: sc-2025-0103-142536
```

#### Security Audit
```
audit: Complete security assessment and fixes

Wave Summary:
- Wave 0: Audit planning and scope definition
- Wave 1: Authentication and authorization audit
- Wave 2: Infrastructure and deployment audit
- Wave 3: Data security and compliance audit
- Wave 4: Remediation implementation

Key Changes:
- Fixed 12 critical vulnerabilities
- Updated 8 dependencies
- Improved authentication flow
- Added security headers

Technical Details:
- Files modified: 89
- Tests added: 34
- Documentation updated: yes

This commit represents the complete implementation of:
Comprehensive security audit with critical vulnerability remediation

Shadow Clone Execution ID: sc-2025-0103-093015
```

## Integration Points

### With Constitution Protocol
1. Record Keeper ensures all context captured
2. Final commit references constitution updates
3. Commit message pulls from constitution summary

### With Quality Gates
1. No commit if quality gates fail
2. All tests must pass
3. Documentation must be complete
4. No known critical issues

### With Wave Coordination
1. Wave coordinator tracks completion
2. All teams must report success
3. All deliverables must be in place

## Error Handling

### Commit Failures
```python
if commit_fails:
    # 1. Preserve all work
    create_recovery_bundle()
    
    # 2. Document failure
    log_commit_failure_details()
    
    # 3. Provide recovery instructions
    show_manual_commit_instructions()
    
    # 4. Maintain constitution
    update_constitution_with_failure()
```

### Partial Completion
- If project stopped before final wave
- All work preserved on branch
- Constitution documents progress
- Can resume and complete later

## User Commands

### During Execution
- `"git status"` → Show current changes (allowed)
- `"commit"` → Respond: "Commits happen after final wave"
- `"save progress"` → Work is continuously saved to files

### After Final Wave
- `"commit"` → Execute final commit protocol
- `"commit with message: [msg]"` → Use custom message
- `"skip commit"` → Leave changes uncommitted

## Validation Rules

### Pre-Commit Checklist
- [ ] All waves marked complete
- [ ] Constitution fully updated
- [ ] Quality gates passed
- [ ] No file conflicts
- [ ] All tests passing
- [ ] Documentation current
- [ ] No temporary files in commit

### Branch State Validation
- Working tree must include all deliverables
- No uncommitted constitution updates
- All .waves/ content properly organized
- No sensitive data in commit

## Summary

**Remember**: 
1. **NO commits during waves** - This is absolute
2. **ONE commit after completion** - Clean, atomic change
3. **FULL context in commit** - Message tells complete story
4. **QUALITY before commit** - All gates must pass

This protocol ensures every Shadow Clone execution results in a single, high-quality, well-documented commit that represents the complete implementation of the requested work.