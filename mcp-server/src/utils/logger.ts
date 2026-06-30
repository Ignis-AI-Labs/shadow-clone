import winston from 'winston';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { config } from '../config/production.js';

// Note (intentional restriction): allowed roots are user-private
// directories only. `os.tmpdir()` was considered but excluded — on
// some platforms it can be a multi-user world-writable location, and
// winston opens the file without `O_NOFOLLOW`, leaving a TOCTOU window
// between safeLogFilePath() validating and winston opening. Keeping
// the roots inside ${HOME} and ${cwd} keeps that window single-user.

/**
 * Resolve and validate a caller-supplied log file path. Closes AUDIT-016
 * (CWE-22 + CWE-73): the prior version handed LOG_FILE_PATH straight to
 * fs.mkdirSync({recursive: true}) and winston.transports.File, with no
 * normalization, containment, or symlink rejection.
 *
 * Returns the safe absolute path on success, or null on rejection
 * (caller skips the file transport — the server still runs).
 */
function safeLogFilePath(input: string): string | null {
  const allowedRoots = [
    path.resolve(os.homedir(), '.cache', 'shadow-clone', 'logs'),
    path.resolve(process.cwd()),
  ];

  // Reject control chars / nulls outright; the rest of the logic
  // operates on the cleaned string.
  if (/[\x00-\x1F\x7F]/.test(input)) return null;

  const resolved = path.resolve(input);

  const containedIn = (root: string): boolean => {
    const rel = path.relative(root, resolved);
    return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
  };

  if (!allowedRoots.some(containedIn)) return null;

  // Refuse if the destination path or its dirname is a symlink. We
  // require the dirname to already exist (no `recursive: true` mkdir on
  // an env-driven path — that lets a hostile env var materialize new
  // directories anywhere we have write).
  const dir = path.dirname(resolved);
  let dirStat: fs.Stats;
  try {
    dirStat = fs.lstatSync(dir);
  } catch {
    return null;
  }
  if (dirStat.isSymbolicLink() || !dirStat.isDirectory()) return null;

  // realpath the dir and re-check containment — defeats a symlinked
  // intermediate ancestor under an allowed root pointing elsewhere.
  let realDir: string;
  try {
    realDir = fs.realpathSync(dir);
  } catch {
    return null;
  }
  if (!allowedRoots.some((root) => {
    const rel = path.relative(root, realDir);
    return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
  })) {
    return null;
  }

  // The file itself may not yet exist (that's the normal create case),
  // but if something is there it must not be a symlink.
  try {
    const fileStat = fs.lstatSync(resolved);
    if (fileStat.isSymbolicLink()) return null;
  } catch {
    // File doesn't exist yet — that's fine.
  }

  return path.join(realDir, path.basename(resolved));
}

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

// Create logger instance
export const logger = winston.createLogger({
  level: config.logging.level,
  defaultMeta: { 
    service: config.server.name,
    environment: config.server.environment,
    version: config.server.version,
  },
  format: config.server.environment === 'production' ? productionFormat : developmentFormat,
  transports: [
    // Route all logs to stderr so stdout stays reserved for the MCP JSON-RPC protocol
    new winston.transports.Stream({
      stream: process.stderr,
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
  exitOnError: false,
});

// Optional file logging, enabled by setting LOG_FILE_PATH. The path is
// validated against an allow-list of roots and refused if any component
// is a symlink (AUDIT-016 / CWE-22 / CWE-73). On rejection, we log a
// warning and run with stderr-only — never fail the server.
if (config.logging.filePath) {
  const safePath = safeLogFilePath(config.logging.filePath);
  if (safePath === null) {
    logger.warn(
      'LOG_FILE_PATH rejected by path validator (not under an allowed root, or contains a symlink). File logging disabled.',
      { requested: config.logging.filePath }
    );
  } else {
    try {
      logger.add(new winston.transports.File({
        filename: safePath,
        format: productionFormat,
        handleExceptions: true,
        handleRejections: true,
      }));
    } catch (error) {
      logger.error('Failed to create file log transport', { error: (error as Error).message });
    }
  }
}

// Export convenience methods with proper typing
export const logError = (error: Error | string, context?: Record<string, unknown>) => {
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

export const logInfo = (message: string, metadata?: Record<string, unknown>) => {
  logger.info(message, metadata);
};

export const logWarning = (message: string, metadata?: Record<string, unknown>) => {
  logger.warn(message, metadata);
};

export const logDebug = (message: string, metadata?: Record<string, unknown>) => {
  logger.debug(message, metadata);
};

// Performance logging helper
export const logPerformance = (operation: string, duration: number, metadata?: Record<string, unknown>) => {
  logger.info(`Performance: ${operation}`, {
    duration_ms: duration,
    ...metadata,
  });
};