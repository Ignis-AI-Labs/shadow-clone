## Summary

<!-- 1-3 sentences: What does this PR do and why? -->

## Priority & Category

- **Priority:** <!-- P0 (foundation) | P1 (security) | P2 (integration) | P3 (differentiation) | P4 (testing) -->
- **Type:** <!-- feat | fix | refactor | test | docs | chore -->
- **Component:** <!-- auth | tools | prompts | build | docs | infra -->
- **Task ID:** <!-- e.g., B-P1-04 from TASKS.md, or N/A -->

## Changes

<!-- Bulleted list of what changed -->

-
-
-

## Dependencies

- **Blocks:** <!-- PRs or tasks that are waiting on this one -->
- **Blocked by:** <!-- PRs or tasks that must merge before this one -->

## Testing Checklist

- [ ] `npm run build` passes
- [ ] `npm run lint` passes (type check)
- [ ] Tested locally with MCP client
- [ ] No new TypeScript errors introduced

## Code Quality Checklist

- [ ] All new functions are pure where feasible
- [ ] No function exceeds 50 lines
- [ ] No file exceeds 300 lines
- [ ] Task ID referenced (from TASKS-*.md)
- [ ] Work done on `{name}/dev` branch, PR targets `dev`

## Security Checklist

<!-- Complete this section if the PR touches auth, crypto, or security config -->

- [ ] No secrets or API keys in code
- [ ] Input validation covers new parameters
- [ ] Auth flow changes reviewed by security reviewer
- [ ] Sensitive data masked in logs
