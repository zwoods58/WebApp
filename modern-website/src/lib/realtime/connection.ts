// =====================================================
// Realtime Connection Pool
// PURPOSE: Reuse realtime connections to reduce overhead
// Manages connection health and automatic reconnection
// =====================================================

import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface PooledConnection {
  id: string;
  channel: RealtimeChannel;
  businessId: string;
  createdAt: number;
  lastUsed: number;
  isHealthy: boolean;
  subscribers: number;
  maxSubscribers: number;
  healthCheckInterval?: NodeJS.Timeout;
}

class RealtimeConnectionPool {
  private connections = new Map<string, PooledConnection>();
  private readonly CONNECTION_TIMEOUT = 5 * 60 * 1000; // 5 minutes
  private readonly HEALTH_CHECK_INTERVAL = 30 * 1000; // 30 seconds
  private readonly MAX_SUBSCRIBERS_PER_CONNECTION = 10;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanup();
  }

  /**
   * Get or create a pooled connection for a business
   */
  getConnection(businessId: string): PooledConnection {
    // Find existing healthy connection with capacity
    for (const [key, connection] of this.connections) {
      if (
        connection.businessId === businessId &&
        connection.isHealthy &&
        connection.subscribers < this.MAX_SUBSCRIBERS_PER_CONNECTION
      ) {
        connection.lastUsed = Date.now();
        connection.subscribers++;
        
        console.log(`[ConnectionPool] Reusing connection ${key} for ${businessId} (${connection.subscribers}/${connection.maxSubscribers})`);
        return connection;
      }
    }

    // Create new connection
    const connectionId = this.generateConnectionId();
    const channel = supabase.channel(`pooled:${connectionId}`);

    const connection: PooledConnection = {
      id: connectionId,
      channel,
      businessId,
      createdAt: Date.now(),
      lastUsed: Date.now(),
      isHealthy: false,
      subscribers: 1,
      maxSubscribers: this.MAX_SUBSCRIBERS_PER_CONNECTION
    };

    // Subscribe to channel to establish connection
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        connection.isHealthy = true;
        console.log(`[ConnectionPool] New connection established: ${connectionId} for ${businessId}`);
        this.startHealthCheck(connection);
      } else if (status === 'CHANNEL_ERROR') {
        connection.isHealthy = false;
        console.error(`[ConnectionPool] Connection error: ${connectionId} for ${businessId}`);
        this.scheduleReconnection(connection);
      }
    });

    this.connections.set(connectionId, connection);
    return connection;
  }

  /**
   * Release a connection back to the pool
   */
  releaseConnection(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    
    if (connection) {
      connection.subscribers = Math.max(0, connection.subscribers - 1);
      connection.lastUsed = Date.now();
      
      console.log(`[ConnectionPool] Released connection ${connectionId} for ${connection.businessId} (${connection.subscribers}/${connection.maxSubscribers})`);
      
      // If no more subscribers, schedule for cleanup
      if (connection.subscribers === 0) {
        setTimeout(() => {
          this.cleanupConnection(connectionId);
        }, this.CONNECTION_TIMEOUT);
      }
    }
  }

  /**
   * Get connection pool statistics
   */
  getStats() {
    const totalConnections = this.connections.size;
    const healthyConnections = Array.from(this.connections.values())
      .filter(conn => conn.isHealthy).length;
    
    const totalSubscribers = Array.from(this.connections.values())
      .reduce((sum, conn) => sum + conn.subscribers, 0);
    
    const connectionsByBusiness = new Map<string, number>();
    const subscriberDistribution = new Map<string, number>();

    this.connections.forEach(connection => {
      // Count by business
      connectionsByBusiness.set(
        connection.businessId,
        (connectionsByBusiness.get(connection.businessId) || 0) + 1
      );
      
      // Count subscribers per connection
      const subscriberRange = `${connection.subscribers}/${connection.maxSubscribers}`;
      subscriberDistribution.set(
        subscriberRange,
        (subscriberDistribution.get(subscriberRange) || 0) + 1
      );
    });

    return {
      totalConnections,
      healthyConnections,
      totalSubscribers,
      averageSubscribersPerConnection: totalConnections > 0 ? totalSubscribers / totalConnections : 0,
      connectionsByBusiness: Object.fromEntries(connectionsByBusiness),
      subscriberDistribution: Object.fromEntries(subscriberDistribution)
    };
  }

  /**
   * Start health check for a connection
   */
  private startHealthCheck(connection: PooledConnection): void {
    connection.healthCheckInterval = setInterval(() => {
      this.checkConnectionHealth(connection);
    }, this.HEALTH_CHECK_INTERVAL);
  }

  /**
   * Check connection health
   */
  private checkConnectionHealth(connection: PooledConnection): void {
    try {
      // Simple health check - verify connection is still in a good state
      // We can't directly access subscriptions.size, so we'll use a different approach
      const timeSinceCreation = Date.now() - connection.createdAt;
      const timeSinceLastUsed = Date.now() - connection.lastUsed;
      
      // Consider unhealthy if:
      // 1. Connection is very old (over 30 minutes)
      // 2. Haven't been used recently but still has subscribers
      if (timeSinceCreation > 30 * 60 * 1000 || 
          (timeSinceLastUsed > 5 * 60 * 1000 && connection.subscribers > 0)) {
        console.warn(`[ConnectionPool] Unhealthy connection detected: ${connection.id}`);
        connection.isHealthy = false;
        this.scheduleReconnection(connection);
      } else {
        connection.isHealthy = true;
      }
    } catch (error) {
      console.error(`[ConnectionPool] Health check error for ${connection.id}:`, error);
      connection.isHealthy = false;
      this.scheduleReconnection(connection);
    }
  }

  /**
   * Schedule reconnection for unhealthy connection
   */
  private scheduleReconnection(connection: PooledConnection): void {
    // Clear existing health check
    if (connection.healthCheckInterval) {
      clearInterval(connection.healthCheckInterval);
      connection.healthCheckInterval = undefined;
    }

    // Wait before reconnecting
    setTimeout(() => {
      this.reconnectConnection(connection);
    }, 5000); // 5 second delay
  }

  /**
   * Reconnect a connection
   */
  private reconnectConnection(connection: PooledConnection): void {
    console.log(`[ConnectionPool] Reconnecting: ${connection.id} for ${connection.businessId}`);
    
    // Unsubscribe and resubscribe
    connection.channel.unsubscribe();
    
    connection.channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        connection.isHealthy = true;
        console.log(`[ConnectionPool] Reconnected: ${connection.id} for ${connection.businessId}`);
        this.startHealthCheck(connection);
      } else if (status === 'CHANNEL_ERROR') {
        connection.isHealthy = false;
        console.error(`[ConnectionPool] Reconnection failed: ${connection.id} for ${connection.businessId}`);
        // Try again after longer delay
        setTimeout(() => {
          this.reconnectConnection(connection);
        }, 15000); // 15 second delay
      }
    });
  }

  /**
   * Clean up idle connections
   */
  private cleanupConnection(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    
    if (connection && connection.subscribers === 0) {
      console.log(`[ConnectionPool] Cleaning up idle connection: ${connectionId}`);
      
      // Clear health check
      if (connection.healthCheckInterval) {
        clearInterval(connection.healthCheckInterval);
      }
      
      // Unsubscribe channel
      connection.channel.unsubscribe();
      
      // Remove from pool
      this.connections.delete(connectionId);
    }
  }

  /**
   * Start cleanup interval
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, this.CONNECTION_TIMEOUT);
  }

  /**
   * Clean up idle connections
   */
  private cleanup(): void {
    const now = Date.now();
    const toCleanup: string[] = [];

    this.connections.forEach((connection, id) => {
      // Clean up connections that have been idle too long and have no subscribers
      if (
        connection.subscribers === 0 &&
        now - connection.lastUsed > this.CONNECTION_TIMEOUT
      ) {
        toCleanup.push(id);
      }
    });

    toCleanup.forEach(id => {
      this.cleanupConnection(id);
    });

    if (toCleanup.length > 0) {
      console.log(`[ConnectionPool] Cleaned up ${toCleanup.length} idle connections`);
    }
  }

  /**
   * Generate unique connection ID
   */
  private generateConnectionId(): string {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Destroy connection pool and clean up all connections
   */
  destroy(): void {
    // Clear cleanup interval
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    // Clean up all connections
    const connectionIds = Array.from(this.connections.keys());
    connectionIds.forEach(id => {
      this.cleanupConnection(id);
    });

    console.log('[ConnectionPool] Destroyed');
  }
}

// Singleton instance
export const realtimeConnectionPool = new RealtimeConnectionPool();

// Export class for testing
export { RealtimeConnectionPool };
