# Prompt Engineering in Shadow Clone

Shadow Clone is fundamentally a **prompt engineering system**. Understanding this helps you get the most out of it.

## What is Prompt Engineering?

Prompt engineering is the art of crafting instructions that guide AI behavior. Better prompts produce better results.

**Basic prompt:**
> Write a login function

**Engineered prompt:**
> As a senior security engineer, write a login function that:
> - Validates email format and password strength
> - Uses bcrypt for password hashing
> - Implements rate limiting
> - Returns appropriate error codes
> - Includes input sanitization
> - Follows OWASP authentication guidelines

The second prompt produces dramatically better results because it:
- Assigns an expert role
- Specifies requirements
- References best practices
- Defines success criteria

## How Shadow Clone Engineers Prompts

When you use a Shadow Clone tool, you're not just getting instructions - you're getting **expertly crafted prompt engineering macros** that include:

### 1. Role Definitions

```xml
<agent_role>
  <name>Security Auditor</name>
  <expertise>OWASP Top 10, penetration testing, secure coding</expertise>
  <responsibilities>
    - Identify security vulnerabilities
    - Assess risk levels
    - Recommend mitigations
    - Verify fixes
  </responsibilities>
</agent_role>
```

### 2. Methodology Instructions

```xml
<methodology>
  <phase name="analysis">
    1. Review authentication flows
    2. Check input validation
    3. Examine session management
    4. Assess data protection
  </phase>
  <phase name="testing">
    1. Attempt injection attacks
    2. Test authentication bypass
    3. Check for sensitive data exposure
  </phase>
</methodology>
```

### 3. Quality Standards

```xml
<quality_standards>
  <requirement>All code must handle errors gracefully</requirement>
  <requirement>Security issues must include severity rating</requirement>
  <requirement>Recommendations must be actionable</requirement>
  <requirement>Output must be production-ready</requirement>
</quality_standards>
```

### 4. Output Specifications

```xml
<output_format>
  <deliverable>SECURITY_AUDIT.md with findings</deliverable>
  <deliverable>Remediation code for each vulnerability</deliverable>
  <deliverable>Test cases to verify fixes</deliverable>
</output_format>
```

## The Transformation

When you call:
```
quick_fix(issueType: "security", description: "SQL injection in login")
```

Claude doesn't just receive your description. It receives a complete prompt engineering package that transforms its approach from generic to expert-level.

**Without Shadow Clone:**
```
Claude thinks: "Find SQL injection, fix it"
```

**With Shadow Clone:**
```
Claude thinks: "I am a Security Specialist. I will:
1. Identify all SQL injection vectors
2. Assess severity (Critical/High/Medium/Low)
3. Implement parameterized queries
4. Add input validation
5. Create regression tests
6. Document the vulnerability and fix
7. Check for similar issues elsewhere"
```

## Why This Matters

### Consistency

Every time you use Shadow Clone, you get the same rigorous approach. No more varying quality based on how you phrased your request.

### Expertise You Don't Have

Shadow Clone embeds expertise from experienced developers. Even if you don't know OWASP guidelines, Claude will follow them.

### Completeness

The prompts ensure nothing is missed. Tests, documentation, error handling - all included automatically.

### Best Practices

Industry-standard methodologies are baked in. You get professional approaches without needing to specify them.

## Maximizing Results

### Provide Context

Shadow Clone works better with context:

**Good:**
```
Use shadow_clone_orchestrate with:
- projectDescription: "Add OAuth2 authentication to existing Express API.
  Current auth uses JWT tokens stored in localStorage.
  Need to support Google and GitHub providers.
  Must maintain backward compatibility with existing /api/auth endpoints."
```

The more context, the more tailored the expert approach.

### Be Specific About Constraints

```
- Must use existing PostgreSQL database schema
- Follow company naming convention (camelCase)
- Max bundle size increase: 50KB
- Needs to work in IE11
```

### Reference Existing Code

```
Match the patterns in src/services/auth.js
Use the same error handling as src/utils/errors.js
Follow the component structure in src/components/UserProfile.jsx
```

## Understanding the Output

Shadow Clone prompts tell Claude to think in structured ways:

```
[Record Keeper thinking]
- Project scope: OAuth2 integration
- Estimated waves: 3
- Key specialists needed: API Designer, Security Expert, Test Engineer
- Wave 1 focus: Provider setup and token flow
- Wave 2 focus: Integration with existing auth
- Wave 3 focus: Testing and documentation
```

This structured thinking produces structured output.

## Prompt Engineering vs Code Execution

| Shadow Clone Does | Shadow Clone Doesn't |
|-------------------|---------------------|
| Deliver expert instructions | Run any code |
| Provide methodologies | Execute builds |
| Define quality standards | Install packages |
| Specify output formats | Access databases |
| Enable role simulation | Make API calls |

The AI (Claude) does all the actual work. Shadow Clone just makes it dramatically better at that work.

---

## Related Topics

- [What is Shadow Clone?](../getting-started/what-is-shadow-clone.md) - Overview
- [Agent Roles](agent-roles.md) - The specialists Shadow Clone creates
- [Wave System](wave-system.md) - How work is organized
