const ISSUE_GUIDANCE: Record<string, string> = {
  bug: `
## Bug Fix Specific Guidelines
- Identify the exact cause of the bug
- Check for similar issues in related code
- Ensure the fix handles all edge cases
- Verify no new bugs are introduced`,

  style: `
## Style Fix Specific Guidelines
- Follow existing CSS/styling conventions
- Ensure cross-browser compatibility
- Test responsive behavior
- Optimize for performance`,

  logic: `
## Logic Fix Specific Guidelines
- Trace through the logic flow
- Identify where logic breaks down
- Ensure business rules are preserved
- Add appropriate validation`,

  performance: `
## Performance Fix Specific Guidelines
- Profile to identify bottlenecks
- Implement minimal optimization
- Measure improvement
- Document any trade-offs`,

  security: `
## Security Fix Specific Guidelines
- Identify the vulnerability clearly
- Implement secure coding practices
- Validate all inputs
- Consider security implications`,
};

export const getIssueGuidance = (issueType: string): string =>
  ISSUE_GUIDANCE[issueType] ?? ISSUE_GUIDANCE.bug;
