const TESTING_GUIDELINES: Record<string, string> = {
  unit: `
- Test individual functions/methods in isolation
- Mock all external dependencies
- Cover happy paths and edge cases
- Test error conditions
- Ensure fast execution`,

  integration: `
- Test component interactions
- Use real or test databases
- Test API endpoints
- Verify data flow between components
- Test error propagation`,

  e2e: `
- Test complete user workflows
- Simulate real user interactions
- Test across different browsers/devices
- Verify business requirements
- Include visual regression tests`,

  performance: `
- Create load testing scenarios
- Measure response times
- Test concurrent users
- Monitor resource usage
- Identify breaking points`,

  security: `
- Test authentication flows
- Attempt common attacks (XSS, injection)
- Verify authorization rules
- Test data validation
- Check for security headers`,
};

const DEFAULT_FRAMEWORKS: Record<string, string> = {
  unit: 'jest',
  integration: 'jest',
  e2e: 'cypress',
  performance: 'k6',
  security: 'owasp-zap',
};

export const getTestingGuidelines = (testType: string): string =>
  TESTING_GUIDELINES[testType] ?? TESTING_GUIDELINES.unit;

export const getDefaultFramework = (testType: string): string =>
  DEFAULT_FRAMEWORKS[testType] ?? 'jest';
