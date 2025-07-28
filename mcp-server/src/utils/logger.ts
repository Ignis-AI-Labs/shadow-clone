import winston from 'winston';
import { config } from '../config/production.js';

// Custom format to mask sensitive data
const maskSensitive = winston.format((info) => {
  if (config.logging.maskSensitiveData) {
    const sensitivePatterns = [
      { pattern: /apiKey":\s*"[^"]+"/g, replacement: 'apiKey":"***"' },
      { pattern: /api_key=\S+/g, replacement: 'api_key=***' },
      { pattern: /authorization:\s*[^\s,}]+/gi, replacement: 'authorization: ***' },
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
    new winston.transports.Console({
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
  exitOnError: false,
});

// Production-specific logging to stderr for errors
if (config.server.environment === 'production') {
  logger.add(
    new winston.transports.Console({
      level: 'error',
      handleExceptions: true,
      handleRejections: true,
      stderrLevels: ['error', 'crit', 'alert', 'emerg'],
    })
  );
}

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