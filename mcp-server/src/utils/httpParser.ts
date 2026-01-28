/**
 * HTTP Parser Utilities
 *
 * Pure functions for parsing HTTP request bodies.
 * Used by the local auth server for handling form and JSON data.
 */

import type { IncomingMessage } from 'http';

/**
 * Options for parsing request bodies
 */
export interface ParseOptions {
  maxFormSize?: number;  // default 10KB
  maxJsonSize?: number;  // default 50KB
}

const DEFAULT_FORM_SIZE = 10 * 1024;  // 10KB
const DEFAULT_JSON_SIZE = 50 * 1024;  // 50KB for ERC-712 messages

/**
 * Parse URL-encoded form data from request body
 *
 * @param req - The incoming HTTP request
 * @param opts - Optional size limits
 * @returns Promise resolving to Map of form field names to values
 */
export function parseFormData(
  req: IncomingMessage,
  opts: ParseOptions = {}
): Promise<Map<string, string>> {
  const maxSize = opts.maxFormSize ?? DEFAULT_FORM_SIZE;

  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
      if (body.length > maxSize) {
        req.destroy();
        reject(new Error('Request body too large'));
      }
    });

    req.on('end', () => {
      const formData = new Map<string, string>();
      const params = new URLSearchParams(body);
      for (const [key, value] of params) {
        formData.set(key, value);
      }
      resolve(formData);
    });

    req.on('error', reject);
  });
}

/**
 * Parse JSON body from request
 *
 * @param req - The incoming HTTP request
 * @param opts - Optional size limits
 * @returns Promise resolving to parsed JSON object
 */
export function parseJsonBody<T = Record<string, unknown>>(
  req: IncomingMessage,
  opts: ParseOptions = {}
): Promise<T> {
  const maxSize = opts.maxJsonSize ?? DEFAULT_JSON_SIZE;

  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
      if (body.length > maxSize) {
        req.destroy();
        reject(new Error('Request body too large'));
      }
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(body) as T);
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });

    req.on('error', reject);
  });
}
