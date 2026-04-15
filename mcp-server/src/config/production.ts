/**
 * Production configuration for Shadow Clone MCP Server
 */

export interface Config {
  // Server configuration
  server: {
    name: string;
    version: string;
    environment: string;
    gracefulShutdownTimeout: number;
  };

  // Security configuration
  security: {
    maxRequestSize: number;
    maxToolNameLength: number;
    maxStringLength: number;
    allowedToolPatterns: RegExp[];
  };

  // Rate limiting
  rateLimit: {
    windowMs: number;
    maxRequests: number;
    message: string;
  };

  // Logging configuration
  logging: {
    level: string;
    format: 'json' | 'simple';
    includeTimestamp: boolean;
    maskSensitiveData: boolean;
    filePath: string | null;
  };

  // Paths configuration
  paths: {
    defaultWavesDirectory: string;
    maxPathLength: number;
    forbiddenPaths: string[];
  };

  // Performance
  performance: {
    maxExecutionTime: number;
    maxMemoryUsage: number;
    enableMetrics: boolean;
  };
}

// Load from environment variables with defaults
export const config: Config = {
  server: {
    name: process.env.MCP_SERVER_NAME || 'shadow-clone-mcp',
    version: process.env.npm_package_version || '0.2.3',
    environment: process.env.NODE_ENV || 'production',
    gracefulShutdownTimeout: parseInt(process.env.GRACEFUL_SHUTDOWN_TIMEOUT || '30000'),
  },

  security: {
    maxRequestSize: parseInt(process.env.MAX_REQUEST_SIZE || '1048576'), // 1MB
    maxToolNameLength: 100,
    maxStringLength: parseInt(process.env.MAX_STRING_LENGTH || '100000'),
    allowedToolPatterns: [
      /^[a-zA-Z_][a-zA-Z0-9_]*$/,
    ],
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: 'Too many requests, please try again later.',
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: (process.env.LOG_FORMAT as 'json' | 'simple') || 'json',
    includeTimestamp: process.env.LOG_TIMESTAMP !== 'false',
    maskSensitiveData: process.env.LOG_MASK_SENSITIVE !== 'false',
    filePath: process.env.LOG_FILE_PATH || null,
  },

  paths: {
    defaultWavesDirectory: './.waves/',
    maxPathLength: 260, // Windows MAX_PATH
    forbiddenPaths: ['.shadow', '.git', 'node_modules', '.env'],
  },

  performance: {
    maxExecutionTime: parseInt(process.env.MAX_EXECUTION_TIME || '300000'), // 5 minutes
    maxMemoryUsage: parseInt(process.env.MAX_MEMORY_USAGE || '524288000'), // 500MB
    enableMetrics: process.env.ENABLE_METRICS === 'true',
  },
};

// Validate configuration on startup
export function validateConfig(): void {
  if (config.security.maxRequestSize < 1024) {
    throw new Error('MAX_REQUEST_SIZE must be at least 1024 bytes');
  }

  if (config.rateLimit.maxRequests < 1) {
    throw new Error('RATE_LIMIT_MAX_REQUESTS must be at least 1');
  }

  if (config.performance.maxExecutionTime < 1000) {
    throw new Error('MAX_EXECUTION_TIME must be at least 1000ms');
  }
}