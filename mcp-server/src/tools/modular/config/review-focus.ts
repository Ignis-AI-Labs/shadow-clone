const REVIEW_FOCUSES: Record<string, string> = {
  security: `
- Authentication and authorization flaws
- Input validation and sanitization
- SQL injection and XSS vulnerabilities
- Sensitive data exposure
- Security misconfigurations
- Cryptographic issues`,

  performance: `
- Algorithm efficiency
- Database query optimization
- Caching opportunities
- Memory leaks
- Unnecessary computations
- Network request optimization`,

  quality: `
- Code readability and maintainability
- Adherence to style guides
- Proper error handling
- Code duplication
- Test coverage
- Documentation quality
- Functional programming compliance (pure functions, immutability)
- Function size limits (30 line target, 50 line ceiling)
- File size limits (200 line target, 300 line ceiling)`,

  architecture: `
- Design pattern usage
- Component coupling
- Dependency management
- Scalability concerns
- Separation of concerns
- API design quality
- Composition over inheritance
- Side effect isolation at boundaries
- No mutable shared state across modules`,

  comprehensive: `
- All security vulnerabilities
- Performance bottlenecks
- Code quality issues
- Architecture concerns
- Test coverage gaps
- Documentation completeness
- FP compliance (pure functions, immutability, composition)
- Function/file size limits
- Branching protocol compliance
- Task ID referenced in PR`,

  fp_compliance: `
- Pure function verification (no side effects)
- Immutability adherence (const, spread, no mutation)
- Function size limits (30 line target, 50 line ceiling)
- File size limits (200 line target, 300 line ceiling)
- Composition over inheritance
- Single responsibility per function
- Side effect boundary isolation
- Parameter count (max 3-4, use options object)
- No mutable shared state across modules`,
};

export const getReviewFocus = (reviewType: string): string => {
  const value = REVIEW_FOCUSES[reviewType];
  if (value === undefined) throw new Error(`Unknown reviewType: ${reviewType}`);
  return value;
};
