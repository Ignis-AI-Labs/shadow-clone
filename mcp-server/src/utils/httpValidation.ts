import { z } from 'zod';

/**
 * Result of HTTP request validation
 */
export interface HttpValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Validate HTTP request body against a Zod schema
 *
 * @param schema - Zod schema to validate against
 * @param data - Request body data to validate
 * @param expectedCsrfToken - Expected CSRF token (for additional verification)
 * @returns Validation result with parsed data or error message
 */
export function validateHttpRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  expectedCsrfToken?: string
): HttpValidationResult<T> {
  try {
    const validated = schema.parse(data);

    // Additional CSRF token verification if provided
    if (expectedCsrfToken !== undefined) {
      const dataWithCsrf = validated as { csrf_token?: string };
      if (dataWithCsrf.csrf_token !== expectedCsrfToken) {
        return {
          success: false,
          error: 'Invalid request. Please refresh and try again.'
        };
      }
    }

    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map(issue => {
        const path = issue.path.join('.') || 'input';
        return `${path}: ${issue.message}`;
      });
      return { success: false, error: messages.join('; ') };
    }
    return { success: false, error: 'Validation failed' };
  }
}

/**
 * Validate that a deadline timestamp has not expired
 *
 * @param deadlineTimestamp - Unix timestamp (seconds) of deadline
 * @returns true if deadline is in the future, false if expired
 */
export function validateDeadline(deadlineTimestamp: number): boolean {
  const now = Math.floor(Date.now() / 1000);
  return deadlineTimestamp >= now;
}
