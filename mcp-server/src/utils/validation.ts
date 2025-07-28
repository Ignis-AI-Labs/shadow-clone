import { config } from '../config/production.js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

/**
 * Validates and sanitizes tool names
 */
export function validateToolName(name: unknown): string {
  if (typeof name !== 'string') {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Tool name must be a string'
    );
  }

  if (name.length === 0 || name.length > config.security.maxToolNameLength) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `Tool name must be between 1 and ${config.security.maxToolNameLength} characters`
    );
  }

  // Check against allowed patterns
  const isValid = config.security.allowedToolPatterns.some(pattern => pattern.test(name));
  if (!isValid) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid tool name format'
    );
  }

  return name;
}

/**
 * Validates and sanitizes string inputs
 */
export function validateString(
  value: unknown,
  fieldName: string,
  options: {
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: RegExp;
  } = {}
): string | undefined {
  if (value === undefined || value === null) {
    if (options.required) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `${fieldName} is required`
      );
    }
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new McpError(
      ErrorCode.InvalidParams,
      `${fieldName} must be a string`
    );
  }

  const maxLength = options.maxLength || config.security.maxStringLength;
  if (value.length > maxLength) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `${fieldName} exceeds maximum length of ${maxLength} characters`
    );
  }

  if (options.minLength && value.length < options.minLength) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `${fieldName} must be at least ${options.minLength} characters`
    );
  }

  if (options.pattern && !options.pattern.test(value)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `${fieldName} has invalid format`
    );
  }

  // Sanitize by removing null bytes and control characters
  return value.replace(/\0/g, '').replace(/[\x00-\x1F\x7F]/g, '');
}

/**
 * Validates and sanitizes file paths
 */
export function validatePath(
  path: unknown,
  fieldName: string,
  options: { required?: boolean } = {}
): string | undefined {
  const sanitized = validateString(path, fieldName, {
    required: options.required,
    maxLength: config.paths.maxPathLength,
  });

  if (!sanitized) return undefined;

  // Check for forbidden paths
  const normalizedPath = sanitized.toLowerCase().replace(/\\/g, '/');
  const isForbidden = config.paths.forbiddenPaths.some(forbidden =>
    normalizedPath.includes(forbidden.toLowerCase())
  );

  if (isForbidden) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `${fieldName} contains forbidden path`
    );
  }

  // Prevent directory traversal
  if (normalizedPath.includes('../') || normalizedPath.includes('..\\')) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `${fieldName} cannot contain directory traversal`
    );
  }

  return sanitized;
}

/**
 * Validates number inputs
 */
export function validateNumber(
  value: unknown,
  fieldName: string,
  options: {
    required?: boolean;
    min?: number;
    max?: number;
    integer?: boolean;
  } = {}
): number | undefined {
  if (value === undefined || value === null) {
    if (options.required) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `${fieldName} is required`
      );
    }
    return undefined;
  }

  const num = Number(value);
  if (isNaN(num)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `${fieldName} must be a number`
    );
  }

  if (options.integer && !Number.isInteger(num)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `${fieldName} must be an integer`
    );
  }

  if (options.min !== undefined && num < options.min) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `${fieldName} must be at least ${options.min}`
    );
  }

  if (options.max !== undefined && num > options.max) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `${fieldName} must be at most ${options.max}`
    );
  }

  return num;
}

/**
 * Validates enum values
 */
export function validateEnum<T extends string>(
  value: unknown,
  fieldName: string,
  allowedValues: readonly T[],
  options: { required?: boolean } = {}
): T | undefined {
  if (value === undefined || value === null) {
    if (options.required) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `${fieldName} is required`
      );
    }
    return undefined;
  }

  if (!allowedValues.includes(value as T)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `${fieldName} must be one of: ${allowedValues.join(', ')}`
    );
  }

  return value as T;
}

/**
 * Validates array inputs
 */
export function validateArray<T>(
  value: unknown,
  fieldName: string,
  options: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    validator?: (item: unknown, index: number) => T;
  } = {}
): T[] | undefined {
  if (value === undefined || value === null) {
    if (options.required) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `${fieldName} is required`
      );
    }
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `${fieldName} must be an array`
    );
  }

  if (options.minLength && value.length < options.minLength) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `${fieldName} must have at least ${options.minLength} items`
    );
  }

  if (options.maxLength && value.length > options.maxLength) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `${fieldName} must have at most ${options.maxLength} items`
    );
  }

  if (options.validator) {
    return value.map((item, index) => options.validator!(item, index));
  }

  return value as T[];
}

/**
 * Sanitizes objects by removing undefined and null values
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      result[key as keyof T] = value;
    }
  }
  
  return result;
}