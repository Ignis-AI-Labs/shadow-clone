import winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import { config } from '../config/production.js';

// Ensure log directory exists
const ensureLogDirectory = (): boolean => {
  if (config.logging.enableFileLogging) {
    try {
      const logDir = path.dirname(config.logging.logFilePath);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      return true;
    } catch (error) {
      // Log to stderr since we can't use the logger yet
      console.error(`[Logger] Failed to create log directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }
  return false;
};

// Initialize log directory
const fileLoggingEnabled = ensureLogDirectory();

// Custom format to mask sensitive data
const maskSensitive = winston.format((info) => {
  if (config.logging.maskSensitiveData) {
    const sensitivePatterns = [
      // JSON API key patterns
      { pattern: /apiKey":\s*"[^"]+"/g, replacement: 'apiKey":"***"' },
      { pattern: /encryptedApiKey":\s*"[^"]+"/g, replacement: 'encryptedApiKey":"***"' },
      // Query string/env patterns
      { pattern: /api_key=\S+/g, replacement: 'api_key=***' },
      { pattern: /SHADOW_CLONE_API_KEY=\S+/g, replacement: 'SHADOW_CLONE_API_KEY=***' },
      // Header patterns
      { pattern: /authorization:\s*[^\s,}]+/gi, replacement: 'authorization: ***' },
      { pattern: /X-API-Key:\s*[^\s,}]+/gi, replacement: 'X-API-Key: ***' },
      // API key prefix patterns (ignis_ and sk-)
      { pattern: /ignis_[a-zA-Z0-9_-]+/g, replacement: 'ignis_***' },
      { pattern: /sk-[a-zA-Z0-9]+/g, replacement: 'sk-***' },
    ];

    let message = JSON.stringify(info);
    sensitivePatterns.forEach(({ pattern, replacement }) => {
      message = message.replace(pattern, replacement);
    });
    
    return JSON.parse(message);
  }
  return info;
});

// Production log format
const productionFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  maskSensitive(),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'service'] }),
  winston.format.json()
);

// Development log format
const developmentFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);

// Build transports array
// IMPORTANT: MCP servers use stdout for JSON-RPC communication
// All console logs MUST go to stderr to avoid corrupting the protocol
const transports: winston.transport[] = [
  // Use Stream transport writing to stderr instead of Console transport
  // This guarantees stderr output regardless of environment quirks
  new winston.transports.Stream({
    stream: process.stderr,
    format: config.server.environment === 'production' ? productionFormat : developmentFormat,
    handleExceptions: true,
    handleRejections: true,
  }),
];

// Add file transport if enabled and directory was created successfully
if (config.logging.enableFileLogging && fileLoggingEnabled) {
  try {
    transports.push(
      new winston.transports.File({
        filename: config.logging.logFilePath,
        format: productionFormat, // Always use JSON for file logging
        handleExceptions: true,
        handleRejections: true,
      })
    );
  } catch (error) {
    console.error(`[Logger] Failed to create file transport: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Create logger instance
// NOTE: Format is applied on individual transports, not here, to avoid double-processing
// which breaks maskSensitive's JSON stringify/parse cycle
export const logger = winston.createLogger({
  level: config.logging.level,
  defaultMeta: {
    service: config.server.name,
    environment: config.server.environment,
    version: config.server.version,
  },
  transports,
  exitOnError: false,
});

// Log startup message to confirm file logging is working
if (config.logging.enableFileLogging && fileLoggingEnabled) {
  logger.info('Logger initialized with file transport', {
    logFilePath: config.logging.logFilePath,
    logLevel: config.logging.level,
  });
}

// Note: stderrLevels configured above ensures all logs go to stderr
// (required for MCP stdio compatibility - stdout is used for JSON-RPC)

// Export convenience methods with proper typing
export const logError = (error: Error | string, context?: Record<string, any>) => {
  if (error instanceof Error) {
    logger.error(error.message, {
      stack: error.stack,
      name: error.name,
      ...context,
    });
  } else {
    logger.error(error, context);
  }
};

export const logInfo = (message: string, metadata?: Record<string, any>) => {
  logger.info(message, metadata);
};

export const logWarning = (message: string, metadata?: Record<string, any>) => {
  logger.warn(message, metadata);
};

export const logDebug = (message: string, metadata?: Record<string, any>) => {
  logger.debug(message, metadata);
};

// Performance logging helper
export const logPerformance = (operation: string, duration: number, metadata?: Record<string, any>) => {
  logger.info(`Performance: ${operation}`, {
    duration_ms: duration,
    ...metadata,
  });
};

// Audit event types for security logging
export type AuditEventType =
  // Login/Logout events
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILURE'
  | 'AUTH_LOGOUT'
  | 'AUTH_SESSION_REVOKED'
  // NFT verification events
  | 'AUTH_NFT_LOST'
  | 'AUTH_NFT_VERIFY_SUCCESS'
  | 'AUTH_NFT_VERIFY_FAILURE'
  // Validation polling events
  | 'AUTH_VALIDATION_POLL_START'
  | 'AUTH_VALIDATION_POLL_STOP'
  | 'AUTH_VALIDATION_POLL_SUCCESS'
  | 'AUTH_VALIDATION_POLL_FAILURE'
  // Browser auth events
  | 'AUTH_BROWSER_AUTH_START'
  | 'AUTH_BROWSER_AUTH_CANCEL'
  // Browser logout events
  | 'AUTH_BROWSER_LOGOUT_START'
  | 'AUTH_BROWSER_LOGOUT_SUCCESS'
  | 'AUTH_BROWSER_LOGOUT_CANCEL'
  // Cached key events
  | 'AUTH_CACHED_KEY_FOUND'
  | 'AUTH_CACHED_KEY_INVALID'
  // Other auth events
  | 'AUTH_CREATOR_MODE'
  | 'AUTH_REVALIDATION_START';

/**
 * Log security audit events
 * Uses existing Winston logger with audit-specific metadata
 */
export const logAudit = (
  event: AuditEventType,
  outcome: 'success' | 'failure',
  details?: Record<string, unknown>
) => {
  logger.info(`AUDIT: ${event}`, {
    audit: true,
    event,
    outcome,
    ...details,
  });
};
