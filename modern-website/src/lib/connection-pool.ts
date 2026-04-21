// =====================================================
// Phase 3: Advanced Connection Pool Management
// Manages database connections for 50,000 user scaling
// =====================================================

import { supabase } from './supabase';

export interface ConnectionPoolConfig {
  maxConnections: number;
  minConnections: number;
  connectionTimeout: number;
  idleTimeout: number;
  maxLifetime: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface PoolMetrics {
  activeConnections: number;
  idleConnections: number;
  totalConnections: number;
  waitingRequests: number;
  averageWaitTime: number;
  failedConnections: number;
  connectionUtilization: number;
}

class ConnectionPool {
  private config: ConnectionPoolConfig;
  private connections: any[] = [];
  private waitingQueue: Array<{
    resolve: (connection: any) => void;
    reject: (error: any) => void;
    timestamp: number;
  }> = [];
  private metrics: PoolMetrics;
  private lastCleanup = Date.now();

  constructor(config: Partial<ConnectionPoolConfig> = {}) {
    this.config = {
      maxConnections: 20,
      minConnections: 5,
      connectionTimeout: 10000,
      idleTimeout: 30000,
      maxLifetime: 1800000, // 30 minutes
      retryAttempts: 3,
      retryDelay: 1000,
      ...config
    };

    this.metrics = {
      activeConnections: 0,
      idleConnections: 0,
      totalConnections: 0,
      waitingRequests: 0,
      averageWaitTime: 0,
      failedConnections: 0,
      connectionUtilization: 0
    };

    this.initializePool();
  }

  private async initializePool() {
    // Create minimum connections
    for (let i = 0; i < this.config.minConnections; i++) {
      this.connections.push(this.createConnection());
    }
    this.updateMetrics();
  }

  private createConnection() {
    // Use server client for connection pool (bypasses RLS)
    const { createServerClient } = require('./supabase');
    return {
      client: createServerClient(),
      created: Date.now(),
      lastUsed: Date.now(),
      inUse: false,
      useCount: 0
    };
  }

  async getConnection(): Promise<any> {
    // Try to get an existing connection
    const availableConnection = this.connections.find(conn => !conn.inUse);
    
    if (availableConnection) {
      availableConnection.inUse = true;
      availableConnection.lastUsed = Date.now();
      availableConnection.useCount++;
      this.updateMetrics();
      return availableConnection.client;
    }

    // Create new connection if under limit
    if (this.connections.length < this.config.maxConnections) {
      const newConnection = this.createConnection();
      newConnection.inUse = true;
      newConnection.lastUsed = Date.now();
      newConnection.useCount = 1;
      this.connections.push(newConnection);
      this.updateMetrics();
      return newConnection.client;
    }

    // Wait for available connection
    return new Promise((resolve, reject) => {
      const waitStart = Date.now();
      this.waitingQueue.push({
        resolve: (conn) => {
          const waitTime = Date.now() - waitStart;
          this.updateAverageWaitTime(waitTime);
          resolve(conn);
        },
        reject,
        timestamp: waitStart
      });

      // Timeout handling
      setTimeout(() => {
        const index = this.waitingQueue.findIndex(item => item.timestamp === waitStart);
        if (index !== -1) {
          this.waitingQueue.splice(index, 1);
          reject(new Error('Connection timeout'));
          this.metrics.failedConnections++;
        }
      }, this.config.connectionTimeout);
    });
  }

  releaseConnection(client: any) {
    const connection = this.connections.find(conn => conn.client === client);
    if (connection) {
      connection.inUse = false;
      connection.lastUsed = Date.now();

      // Process waiting queue
      if (this.waitingQueue.length > 0) {
        const waiting = this.waitingQueue.shift();
        if (waiting) {
          connection.inUse = true;
          connection.useCount++;
          waiting.resolve(connection.client);
        }
      }

      this.updateMetrics();
    }
  }

  private updateMetrics() {
    this.metrics.activeConnections = this.connections.filter(conn => conn.inUse).length;
    this.metrics.idleConnections = this.connections.filter(conn => !conn.inUse).length;
    this.metrics.totalConnections = this.connections.length;
    this.metrics.waitingRequests = this.waitingQueue.length;
    this.metrics.connectionUtilization = this.metrics.activeConnections / this.config.maxConnections;

    // Periodic cleanup
    if (Date.now() - this.lastCleanup > 60000) { // Every minute
      this.cleanupConnections();
      this.lastCleanup = Date.now();
    }
  }

  private updateAverageWaitTime(waitTime: number) {
    this.metrics.averageWaitTime = 
      (this.metrics.averageWaitTime + waitTime) / 2;
  }

  private cleanupConnections() {
    const now = Date.now();
    const toRemove: number[] = [];

    this.connections.forEach((conn, index) => {
      // Remove old connections
      if (now - conn.created > this.config.maxLifetime) {
        toRemove.push(index);
      }
      // Remove idle connections (but keep minimum)
      else if (
        !conn.inUse && 
        now - conn.lastUsed > this.config.idleTimeout &&
        this.connections.length > this.config.minConnections
      ) {
        toRemove.push(index);
      }
    });

    // Remove connections (in reverse order to maintain indices)
    toRemove.reverse().forEach(index => {
      this.connections.splice(index, 1);
    });

    // Ensure minimum connections
    while (this.connections.length < this.config.minConnections) {
      this.connections.push(this.createConnection());
    }

    this.updateMetrics();
  }

  getMetrics(): PoolMetrics {
    return { ...this.metrics };
  }

  async healthCheck(): Promise<boolean> {
    try {
      const connection = await this.getConnection();
      await connection.from('businesses').select('count').limit(1);
      this.releaseConnection(connection);
      return true;
    } catch (error) {
      console.error('Connection pool health check failed:', error);
      return false;
    }
  }

  // Execute operation with automatic connection management
  async execute<T>(
    operation: (connection: any) => Promise<T>,
    options: { priority?: 'high' | 'normal' | 'low'; retries?: number } = {}
  ): Promise<T> {
    const retries = options.retries ?? this.config.retryAttempts;
    let lastError: any;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const connection = await this.getConnection();
        const result = await operation(connection);
        this.releaseConnection(connection);
        return result;
      } catch (error) {
        lastError = error;
        console.warn(`Connection attempt ${attempt + 1} failed:`, error);
        
        if (attempt < retries) {
          // Exponential backoff
          const delay = this.config.retryDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  destroy() {
    this.connections = [];
    this.waitingQueue = [];
    this.updateMetrics();
  }
}

// Singleton instances - INCREASED to fix connection exhaustion
export const userConnectionPool = new ConnectionPool({
  maxConnections: 50,        // INCREASED: 20 → 50
  minConnections: 10,       // INCREASED: 5 → 10
  connectionTimeout: 10000,
  idleTimeout: 30000,
  maxLifetime: 1800000,
  retryAttempts: 3,
  retryDelay: 1000
});

export const adminConnectionPool = new ConnectionPool({
  maxConnections: 25,       // INCREASED: 10 → 25
  minConnections: 5,        // KEPT: 5 is sufficient for admin
  connectionTimeout: 15000,
  idleTimeout: 60000,
  maxLifetime: 3600000, // 1 hour for admin
  retryAttempts: 5,
  retryDelay: 2000
});

// =====================================================
// Connection Pool Manager
// Orchestrates multiple pools and provides unified interface
// =====================================================

export class ConnectionPoolManager {
  private pools: Map<string, ConnectionPool> = new Map();
  private metricsHistory: Array<{
    timestamp: number;
    userPool: PoolMetrics;
    adminPool: PoolMetrics;
  }> = [];

  constructor() {
    this.pools.set('user', userConnectionPool);
    this.pools.set('admin', adminConnectionPool);
    
    // Start metrics collection
    this.startMetricsCollection();
  }

  private startMetricsCollection() {
    setInterval(() => {
      const metrics = {
        timestamp: Date.now(),
        userPool: userConnectionPool.getMetrics(),
        adminPool: adminConnectionPool.getMetrics()
      };
      
      this.metricsHistory.push(metrics);
      
      // Keep only last 100 entries
      if (this.metricsHistory.length > 100) {
        this.metricsHistory.shift();
      }
    }, 30000); // Every 30 seconds
  }

  getPool(type: 'user' | 'admin'): ConnectionPool {
    const pool = this.pools.get(type);
    if (!pool) {
      throw new Error(`Connection pool '${type}' not found`);
    }
    return pool;
  }

  async execute<T>(
    operation: (connection: any) => Promise<T>,
    options: { 
      poolType?: 'user' | 'admin';
      priority?: 'high' | 'normal' | 'low';
      retries?: number;
    } = {}
  ): Promise<T> {
    const poolType = options.poolType || 'user';
    const pool = this.getPool(poolType);
    return pool.execute(operation, options);
  }

  getAllMetrics() {
    return {
      user: userConnectionPool.getMetrics(),
      admin: adminConnectionPool.getMetrics(),
      history: this.metricsHistory.slice(-10), // Last 10 entries
    };
  }

  async healthCheck(): Promise<{ user: boolean; admin: boolean }> {
    const [userHealth, adminHealth] = await Promise.all([
      userConnectionPool.healthCheck(),
      adminConnectionPool.healthCheck()
    ]);

    return { user: userHealth, admin: adminHealth };
  }

  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const userMetrics = userConnectionPool.getMetrics();
    const adminMetrics = adminConnectionPool.getMetrics();

    // User pool recommendations
    if (userMetrics.connectionUtilization > 0.8) {
      recommendations.push('User pool utilization high - consider increasing maxConnections');
    }

    if (userMetrics.waitingRequests > 10) {
      recommendations.push('High wait queue for user pool - increase pool size or optimize queries');
    }

    if (userMetrics.averageWaitTime > 1000) {
      recommendations.push('High average wait time - check database performance');
    }

    // Admin pool recommendations
    if (adminMetrics.connectionUtilization > 0.6) {
      recommendations.push('Admin pool utilization elevated - monitor admin operations');
    }

    // General recommendations
    if (userMetrics.failedConnections > 5 || adminMetrics.failedConnections > 2) {
      recommendations.push('Connection failures detected - check database connectivity');
    }

    return recommendations;
  }

  async destroy() {
    for (const pool of this.pools.values()) {
      pool.destroy();
    }
    this.pools.clear();
    this.metricsHistory = [];
  }
}

export const connectionPoolManager = new ConnectionPoolManager();

// =====================================================
// Utility Functions for Connection Pool Usage
// =====================================================

export async function withConnection<T>(
  operation: (connection: any) => Promise<T>,
  options?: { poolType?: 'user' | 'admin'; priority?: 'high' | 'normal' | 'low' }
): Promise<T> {
  return connectionPoolManager.execute(operation, options);
}

export async function withAdminConnection<T>(
  operation: (connection: any) => Promise<T>,
  options?: { priority?: 'high' | 'normal' | 'low' }
): Promise<T> {
  return connectionPoolManager.execute(operation, { 
    poolType: 'admin', 
    ...options 
  });
}

// Types and classes are already exported above

