// =====================================================
// Phase 3: Database Configuration for 50,000 Users
// Centralized configuration for connection pooling and scaling
// =====================================================

export interface DatabaseConfig {
  // Connection Pool Settings
  poolSize: {
    user: number;
    admin: number;
    min: number;
    max: number;
  };
  
  // Timeouts (in milliseconds)
  timeouts: {
    connection: number;
    query: number;
    idle: number;
    lifetime: number;
    healthCheck: number;
  };
  
  // Retry Configuration
  retry: {
    attempts: number;
    delay: number;
    backoffMultiplier: number;
    maxDelay: number;
  };
  
  // Performance Settings
  performance: {
    batchSize: number;
    batchWindow: number;
    maxConcurrentQueries: number;
    queryTimeout: number;
  };
  
  // Monitoring
  monitoring: {
    enabled: boolean;
    metricsInterval: number;
    healthCheckInterval: number;
    alertThresholds: {
      connectionUtilization: number;
      averageWaitTime: number;
      errorRate: number;
      failedConnections: number;
    };
  };
}

// Default configuration optimized for 50,000 users
export const defaultDatabaseConfig: DatabaseConfig = {
  poolSize: {
    user: 20,        // User connections for regular operations
    admin: 10,       // Admin connections for elevated operations
    min: 5,          // Minimum connections to maintain
    max: 50,         // Maximum connections per pool
  },
  
  timeouts: {
    connection: 10000,      // 10 seconds
    query: 30000,           // 30 seconds
    idle: 30000,            // 30 seconds
    lifetime: 1800000,      // 30 minutes
    healthCheck: 5000,       // 5 seconds
  },
  
  retry: {
    attempts: 3,
    delay: 1000,             // 1 second
    backoffMultiplier: 2,
    maxDelay: 10000,          // 10 seconds max
  },
  
  performance: {
    batchSize: 100,          // Max requests per batch
    batchWindow: 50,         // 50ms window for batching
    maxConcurrentQueries: 100, // Max parallel queries
    queryTimeout: 30000,     // 30 seconds per query
  },
  
  monitoring: {
    enabled: true,
    metricsInterval: 30000,  // 30 seconds
    healthCheckInterval: 60000, // 1 minute
    alertThresholds: {
      connectionUtilization: 0.8,  // 80%
      averageWaitTime: 1000,       // 1 second
      errorRate: 0.05,               // 5%
      failedConnections: 5,
    },
  },
};

// Environment-specific configurations
export const getDatabaseConfig = (): DatabaseConfig => {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'production') {
    return {
      ...defaultDatabaseConfig,
      poolSize: {
        ...defaultDatabaseConfig.poolSize,
        user: parseInt(process.env.DATABASE_POOL_SIZE || '20'),
        max: 100, // Higher limit for production
      },
      timeouts: {
        ...defaultDatabaseConfig.timeouts,
        connection: 15000, // Longer timeout for production
      },
      monitoring: {
        ...defaultDatabaseConfig.monitoring,
        metricsInterval: 15000, // More frequent monitoring
        healthCheckInterval: 30000, // More frequent health checks
      },
    };
  }
  
  if (env === 'development') {
    return {
      ...defaultDatabaseConfig,
      poolSize: {
        ...defaultDatabaseConfig.poolSize,
        user: 5,
        admin: 2,
        min: 1,
        max: 10,
      },
      timeouts: {
        ...defaultDatabaseConfig.timeouts,
        connection: 5000,  // Shorter timeout for development
        query: 10000,
      },
      monitoring: {
        ...defaultDatabaseConfig.monitoring,
        metricsInterval: 60000,  // Less frequent in development
        healthCheckInterval: 120000,
      },
    };
  }
  
  return defaultDatabaseConfig;
};

// =====================================================
// Scaling Configuration
// Automatically adjusts based on load
// =====================================================

export interface ScalingConfig {
  thresholds: {
    low: number;      // < 30% utilization
    medium: number;   // 30-70% utilization
    high: number;      // > 70% utilization
    critical: number;  // > 90% utilization
  };
  
  actions: {
    low: {
      reduceConnections: boolean;
      increaseBatchSize: boolean;
    };
    medium: {
      maintainConnections: boolean;
      optimizeQueries: boolean;
    };
    high: {
      increaseConnections: boolean;
      reduceBatchSize: boolean;
      enableReadReplica: boolean;
    };
    critical: {
      maxConnections: boolean;
      emergencyMode: boolean;
    };
  };
}

export const scalingConfig: ScalingConfig = {
  thresholds: {
    low: 0.3,
    medium: 0.7,
    high: 0.8,
    critical: 0.9,
  },
  
  actions: {
    low: {
      reduceConnections: true,
      increaseBatchSize: true,
    },
    medium: {
      maintainConnections: true,
      optimizeQueries: true,
    },
    high: {
      increaseConnections: true,
      reduceBatchSize: true,
      enableReadReplica: true,
    },
    critical: {
      maxConnections: true,
      emergencyMode: true,
    },
  },
};

// =====================================================
// Performance Profiles
// Different configurations for different use cases
// =====================================================

export interface PerformanceProfile {
  name: string;
  description: string;
  config: Partial<DatabaseConfig>;
}

export const performanceProfiles: PerformanceProfile[] = [
  {
    name: 'high-throughput',
    description: 'Optimized for maximum throughput',
    config: {
      poolSize: { user: 30, admin: 15, min: 10, max: 100 },
      performance: { batchSize: 200, batchWindow: 25, maxConcurrentQueries: 150, queryTimeout: 15000 },
      timeouts: { connection: 5000, query: 15000, idle: 30000, lifetime: 1800000, healthCheck: 5000 },
      retry: { attempts: 3, delay: 1000, backoffMultiplier: 2, maxDelay: 10000 },
      monitoring: defaultDatabaseConfig.monitoring,
    },
  },
  {
    name: 'low-latency',
    description: 'Optimized for minimal response time',
    config: {
      poolSize: { user: 25, admin: 10, min: 15, max: 50 },
      performance: { batchSize: 50, batchWindow: 10, maxConcurrentQueries: 200, queryTimeout: 10000 },
      timeouts: { connection: 3000, query: 10000, idle: 20000, lifetime: 1200000, healthCheck: 3000 },
      retry: { attempts: 2, delay: 500, backoffMultiplier: 2, maxDelay: 5000 },
      monitoring: defaultDatabaseConfig.monitoring,
    },
  },
  {
    name: 'resource-efficient',
    description: 'Optimized for minimal resource usage',
    config: {
      poolSize: { user: 10, admin: 5, min: 2, max: 20 },
      performance: { batchSize: 25, batchWindow: 100, maxConcurrentQueries: 50, queryTimeout: 45000 },
      timeouts: { connection: 15000, query: 45000, idle: 60000, lifetime: 3600000, healthCheck: 10000 },
      retry: { attempts: 5, delay: 2000, backoffMultiplier: 2, maxDelay: 20000 },
      monitoring: defaultDatabaseConfig.monitoring,
    },
  },
  {
    name: 'balanced',
    description: 'Balanced performance and resource usage',
    config: defaultDatabaseConfig,
  },
];

// =====================================================
// Environment Variables Helper
// =====================================================

export const getDatabaseEnvironmentVariables = () => {
  return {
    DATABASE_POOL_SIZE: process.env.DATABASE_POOL_SIZE || '20',
    DATABASE_CONNECTION_TIMEOUT: process.env.DATABASE_CONNECTION_TIMEOUT || '10000',
    DATABASE_QUERY_TIMEOUT: process.env.DATABASE_QUERY_TIMEOUT || '30000',
    DATABASE_RETRY_ATTEMPTS: process.env.DATABASE_RETRY_ATTEMPTS || '3',
    DATABASE_RETRY_DELAY: process.env.DATABASE_RETRY_DELAY || '1000',
    DATABASE_BATCH_SIZE: process.env.DATABASE_BATCH_SIZE || '100',
    DATABASE_BATCH_WINDOW: process.env.DATABASE_BATCH_WINDOW || '50',
    DATABASE_MONITORING_ENABLED: process.env.DATABASE_MONITORING_ENABLED || 'true',
    DATABASE_HEALTH_CHECK_INTERVAL: process.env.DATABASE_HEALTH_CHECK_INTERVAL || '60000',
  };
};

// =====================================================
// Validation Functions
// =====================================================

export const validateDatabaseConfig = (config: DatabaseConfig): string[] => {
  const errors: string[] = [];
  
  if (config.poolSize.user < config.poolSize.min) {
    errors.push('User pool size cannot be less than minimum pool size');
  }
  
  if (config.poolSize.user > config.poolSize.max) {
    errors.push('User pool size cannot exceed maximum pool size');
  }
  
  if (config.timeouts.connection < 1000) {
    errors.push('Connection timeout must be at least 1 second');
  }
  
  if (config.timeouts.query < config.timeouts.connection) {
    errors.push('Query timeout must be greater than connection timeout');
  }
  
  if (config.retry.attempts < 1 || config.retry.attempts > 10) {
    errors.push('Retry attempts must be between 1 and 10');
  }
  
  if (config.performance.batchSize < 1 || config.performance.batchSize > 1000) {
    errors.push('Batch size must be between 1 and 1000');
  }
  
  return errors;
};

export default defaultDatabaseConfig;

