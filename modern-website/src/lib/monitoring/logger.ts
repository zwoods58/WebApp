/**
 * Centralized logging utility for monitoring and debugging
 * Provides structured logging with different severity levels
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export enum LogCategory {
  AUTH = 'auth',
  API = 'api',
  DATABASE = 'database',
  VALIDATION = 'validation',
  RATE_LIMIT = 'rate_limit',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  SYSTEM = 'system'
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  metadata?: Record<string, any>;
  userId?: string;
  businessId?: string;
  ip?: string;
  userAgent?: string;
  requestId?: string;
}

class Logger {
  private isDevelopment: boolean;
  private isProduction: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  /**
   * Create structured log entry
   */
  private createLogEntry(
    level: LogLevel,
    category: LogCategory,
    message: string,
    metadata?: Record<string, any>
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      metadata,
      requestId: metadata?.requestId
    };
  }

  /**
   * Format log for console output
   */
  private formatLog(entry: LogEntry): string {
    const emoji = this.getEmoji(entry.level);
    const prefix = `${emoji} [${entry.category.toUpperCase()}]`;
    
    if (this.isDevelopment) {
      return `${prefix} ${entry.message}`;
    }
    
    // Production: JSON format for log aggregation
    return JSON.stringify(entry);
  }

  /**
   * Get emoji for log level
   */
  private getEmoji(level: LogLevel): string {
    const emojis = {
      [LogLevel.DEBUG]: '🔍',
      [LogLevel.INFO]: 'ℹ️',
      [LogLevel.WARN]: '⚠️',
      [LogLevel.ERROR]: '❌',
      [LogLevel.CRITICAL]: '🚨'
    };
    return emojis[level] || 'ℹ️';
  }

  /**
   * Send log to external service (e.g., Sentry, LogRocket, DataDog)
   */
  private async sendToExternalService(entry: LogEntry): Promise<void> {
    // Only send errors and critical logs to external services in production
    if (!this.isProduction) return;
    if (entry.level !== LogLevel.ERROR && entry.level !== LogLevel.CRITICAL) return;

    try {
      // TODO: Integrate with your monitoring service
      // Example: Sentry
      // Sentry.captureException(new Error(entry.message), {
      //   level: entry.level,
      //   tags: { category: entry.category },
      //   extra: entry.metadata
      // });

      // Example: Custom logging endpoint
      // await fetch('/api/monitoring/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // });
    } catch (error) {
      // Fail silently to avoid logging loops
      console.error('Failed to send log to external service:', error);
    }
  }

  /**
   * Log debug message
   */
  debug(category: LogCategory, message: string, metadata?: Record<string, any>): void {
    if (!this.isDevelopment) return; // Only log debug in development
    
    const entry = this.createLogEntry(LogLevel.DEBUG, category, message, metadata);
    console.debug(this.formatLog(entry));
  }

  /**
   * Log info message
   */
  info(category: LogCategory, message: string, metadata?: Record<string, any>): void {
    const entry = this.createLogEntry(LogLevel.INFO, category, message, metadata);
    console.info(this.formatLog(entry));
  }

  /**
   * Log warning message
   */
  warn(category: LogCategory, message: string, metadata?: Record<string, any>): void {
    const entry = this.createLogEntry(LogLevel.WARN, category, message, metadata);
    console.warn(this.formatLog(entry));
    this.sendToExternalService(entry);
  }

  /**
   * Log error message
   */
  error(category: LogCategory, message: string, error?: Error, metadata?: Record<string, any>): void {
    const entry = this.createLogEntry(LogLevel.ERROR, category, message, {
      ...metadata,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    });
    console.error(this.formatLog(entry));
    this.sendToExternalService(entry);
  }

  /**
   * Log critical message (requires immediate attention)
   */
  critical(category: LogCategory, message: string, error?: Error, metadata?: Record<string, any>): void {
    const entry = this.createLogEntry(LogLevel.CRITICAL, category, message, {
      ...metadata,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    });
    console.error(this.formatLog(entry));
    this.sendToExternalService(entry);
  }

  /**
   * Log authentication event
   */
  auth(message: string, metadata?: Record<string, any>): void {
    this.info(LogCategory.AUTH, message, metadata);
  }

  /**
   * Log security event
   */
  security(message: string, metadata?: Record<string, any>): void {
    this.warn(LogCategory.SECURITY, message, metadata);
  }

  /**
   * Log rate limit event
   */
  rateLimit(message: string, metadata?: Record<string, any>): void {
    this.warn(LogCategory.RATE_LIMIT, message, metadata);
  }

  /**
   * Log API request
   */
  apiRequest(method: string, path: string, metadata?: Record<string, any>): void {
    this.debug(LogCategory.API, `${method} ${path}`, metadata);
  }

  /**
   * Log API response
   */
  apiResponse(method: string, path: string, status: number, duration: number, metadata?: Record<string, any>): void {
    const level = status >= 500 ? LogLevel.ERROR : status >= 400 ? LogLevel.WARN : LogLevel.INFO;
    const entry = this.createLogEntry(level, LogCategory.API, `${method} ${path} - ${status}`, {
      ...metadata,
      status,
      duration
    });
    
    if (level === LogLevel.ERROR) {
      console.error(this.formatLog(entry));
    } else if (level === LogLevel.WARN) {
      console.warn(this.formatLog(entry));
    } else {
      console.info(this.formatLog(entry));
    }
  }

  /**
   * Log performance metric
   */
  performance(operation: string, duration: number, metadata?: Record<string, any>): void {
    const level = duration > 1000 ? LogLevel.WARN : LogLevel.INFO;
    const entry = this.createLogEntry(level, LogCategory.PERFORMANCE, `${operation} took ${duration}ms`, {
      ...metadata,
      duration
    });
    
    if (level === LogLevel.WARN) {
      console.warn(this.formatLog(entry));
    } else {
      console.info(this.formatLog(entry));
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const logAuth = (message: string, metadata?: Record<string, any>) => logger.auth(message, metadata);
export const logSecurity = (message: string, metadata?: Record<string, any>) => logger.security(message, metadata);
export const logRateLimit = (message: string, metadata?: Record<string, any>) => logger.rateLimit(message, metadata);
export const logError = (category: LogCategory, message: string, error?: Error, metadata?: Record<string, any>) => 
  logger.error(category, message, error, metadata);
export const logCritical = (category: LogCategory, message: string, error?: Error, metadata?: Record<string, any>) => 
  logger.critical(category, message, error, metadata);
