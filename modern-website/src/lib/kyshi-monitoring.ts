// Kyshi Monitoring and Health Check Utilities

import { kyshiAPI } from './kyshi';

export interface KyshiHealthStatus {
  api: 'healthy' | 'unhealthy';
  database: 'connected' | 'disconnected';
  webhook: 'active' | 'inactive';
  lastCheck: string;
  responseTime: number;
}

export interface KyshiMetrics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  totalRevenue: number;
  successRate: number;
  averageResponseTime: number;
}

export class KyshiMonitor {
  private healthCache: KyshiHealthStatus | null = null;
  private lastHealthCheck: number = 0;
  private readonly HEALTH_CHECK_INTERVAL = 60000; // 1 minute

  async checkHealth(): Promise<KyshiHealthStatus> {
    const now = Date.now();
    
    // Cache health status for 1 minute
    if (this.healthCache && (now - this.lastHealthCheck) < this.HEALTH_CHECK_INTERVAL) {
      return this.healthCache;
    }

    const startTime = Date.now();
    let apiStatus: 'healthy' | 'unhealthy' = 'healthy';
    let dbStatus: 'connected' | 'disconnected' = 'connected';
    let webhookStatus: 'active' | 'inactive' = 'active';

    try {
      // Test API connectivity
      await kyshiAPI.listPlans();
    } catch (error) {
      apiStatus = 'unhealthy';
      console.error('Kyshi API health check failed:', error);
    }

    // Test database connectivity (you can implement this based on your DB setup)
    try {
      // This would be a simple database ping
      // For now, we'll assume it's connected
      dbStatus = 'connected';
    } catch (error) {
      dbStatus = 'disconnected';
      console.error('Database health check failed:', error);
    }

    // Check webhook status (you can implement this based on your webhook setup)
    // For now, we'll assume webhooks are active
    webhookStatus = 'active';

    const responseTime = Date.now() - startTime;

    this.healthCache = {
      api: apiStatus,
      database: dbStatus,
      webhook: webhookStatus,
      lastCheck: new Date().toISOString(),
      responseTime,
    };

    this.lastHealthCheck = now;

    return this.healthCache;
  }

  async getMetrics(): Promise<KyshiMetrics> {
    try {
      const subscriptions = await kyshiAPI.listSubscriptions();
      
      const totalSubscriptions = subscriptions.length;
      const activeSubscriptions = subscriptions.filter(sub => sub.isActive).length;
      const totalRevenue = subscriptions
        .filter(sub => sub.isActive)
        .reduce((sum, sub) => sum + sub.amount, 0);
      
      const successRate = totalSubscriptions > 0 
        ? (activeSubscriptions / totalSubscriptions) * 100 
        : 0;

      const health = await this.checkHealth();

      return {
        totalSubscriptions,
        activeSubscriptions,
        totalRevenue,
        successRate,
        averageResponseTime: health.responseTime,
      };
    } catch (error) {
      console.error('Failed to get Kyshi metrics:', error);
      throw error;
    }
  }

  async logActivity(activity: {
    type: 'subscription_created' | 'subscription_cancelled' | 'payment_processed' | 'payment_failed';
    userId?: string;
    subscriptionId?: string;
    amount?: number;
    currency?: string;
    country?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    try {
      // Log activity to your monitoring system
      const logEntry = {
        ...activity,
        timestamp: new Date().toISOString(),
        service: 'kyshi',
      };

      // You can send this to your logging service
      console.log('Kyshi Activity:', JSON.stringify(logEntry, null, 2));

      // For production, you might want to send this to:
      // - Your monitoring service (DataDog, New Relic, etc.)
      // - Your database logs table
      // - Your analytics service
    } catch (error) {
      console.error('Failed to log Kyshi activity:', error);
    }
  }

  async alertIfUnhealthy(): Promise<void> {
    const health = await this.checkHealth();
    
    if (health.api === 'unhealthy' || health.database === 'disconnected') {
      const alertMessage = `Kyshi Service Unhealthy: API=${health.api}, DB=${health.database}, Response Time=${health.responseTime}ms`;
      
      console.error('ALERT:', alertMessage);
      
      // Send alert to your monitoring system
      // This could be:
      // - Slack webhook
      // - Email notification
      // - SMS alert
      // - PagerDuty
    }
  }

  startHealthCheckInterval(intervalMs: number = 60000): NodeJS.Timeout {
    return setInterval(() => {
      this.alertIfUnhealthy().catch(console.error);
    }, intervalMs);
  }
}

export const kyshiMonitor = new KyshiMonitor();

// Export convenience functions
export const checkKyshiHealth = () => kyshiMonitor.checkHealth();
export const getKyshiMetrics = () => kyshiMonitor.getMetrics();
export const logKyshiActivity = (activity: Parameters<KyshiMonitor['logActivity']>[0]) => 
  kyshiMonitor.logActivity(activity);
export const startKyshiHealthMonitoring = (intervalMs?: number) => 
  kyshiMonitor.startHealthCheckInterval(intervalMs);

