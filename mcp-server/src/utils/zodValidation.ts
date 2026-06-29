import { z } from 'zod';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { toolSchemaRegistry } from '../schemas/index.js';
import { validatePath } from './validation.js';

/**
 * Path-like field names that need additional security validation
 */
const PATH_FIELDS = ['projectPath', 'projectPlan', 'wavesDirectory', 'outputDirectory', 'filePath'];

/**
 * Array fields containing file paths that need security validation
 */
const PATH_ARRAY_FIELDS = ['files', 'targetFiles'];

/**
 * Validate tool input against Zod schema
 */
export function validateToolInput(toolName: string, args: unknown): unknown {
  const schema = toolSchemaRegistry[toolName];
  if (!schema) {
    return args; // No schema defined, pass through
  }

  try {
    const validated = schema.parse(args ?? {});

    // Apply path security checks for path-like fields
    return applyPathValidation(validated as Record<string, unknown>);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createSafeValidationError(error);
    }
    throw error;
  }
}

/**
 * Apply validatePath to path-like fields for security.
 *
 * Every path field is also root-confined to `process.cwd()` — absolute
 * paths and resolved-out-of-root paths are rejected. Closes AUDIT-001
 * (CWE-22 / CWE-73): the prior version only blocked relative `../`
 * traversal, leaving absolute paths like `/etc` or `/home/user/.ssh`
 * passing through to handlers that write files.
 */
function applyPathValidation(obj: Record<string, unknown>): Record<string, unknown> {
  const result = { ...obj };
  const root = process.cwd();

  // Validate single path fields
  for (const field of PATH_FIELDS) {
    if (typeof result[field] === 'string') {
      result[field] = validatePath(result[field] as string, field, { containedIn: root });
    }
  }

  // Validate arrays of paths
  for (const field of PATH_ARRAY_FIELDS) {
    if (Array.isArray(result[field])) {
      result[field] = (result[field] as unknown[]).map((item, index) => {
        if (typeof item === 'string') {
          return validatePath(item, `${field}[${index}]`, { containedIn: root });
        }
        return item;
      });
    }
  }

  return result;
}

/**
 * Convert Zod error to safe MCP error (no internal details leaked)
 * Compatible with Zod 4.x error types
 */
export function createSafeValidationError(error: z.ZodError): McpError {
  const issues = error.issues.map(issue => {
    const path = issue.path.join('.') || 'input';
    const code = issue.code;

    // Use type assertion to access Zod 4 specific properties
    const issueAny = issue as unknown as Record<string, unknown>;

    switch (code) {
      case 'invalid_type':
        // Zod 4: has 'expected' property
        return `${path}: expected ${issueAny.expected || 'valid type'}`;
      case 'invalid_value':
        // Zod 4: replaces 'invalid_enum_value', has 'values' property
        if (Array.isArray(issueAny.values)) {
          return `${path}: must be one of: ${(issueAny.values as unknown[]).join(', ')}`;
        }
        return `${path}: invalid value`;
      case 'too_small': {
        // Zod 4: uses 'origin' instead of 'type', and 'minimum' property
        const origin = issueAny.origin as string || 'value';
        const minimum = issueAny.minimum;
        if (origin === 'string') {
          return `${path}: must be at least ${minimum} character(s)`;
        }
        if (origin === 'array') {
          return `${path}: must have at least ${minimum} item(s)`;
        }
        return `${path}: must be at least ${minimum}`;
      }
      case 'too_big': {
        // Zod 4: uses 'origin' instead of 'type', and 'maximum' property
        const origin = issueAny.origin as string || 'value';
        const maximum = issueAny.maximum;
        if (origin === 'string') {
          return `${path}: must be at most ${maximum} character(s)`;
        }
        if (origin === 'array') {
          return `${path}: must have at most ${maximum} item(s)`;
        }
        return `${path}: must be at most ${maximum}`;
      }
      case 'invalid_format':
        // Zod 4: replaces 'invalid_string'
        return `${path}: invalid format`;
      default:
        // Use the message from Zod if available, but sanitize it
        return `${path}: invalid value`;
    }
  });

  return new McpError(
    ErrorCode.InvalidParams,
    `Validation failed: ${issues.join('; ')}`
  );
}
