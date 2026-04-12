// Kyshi monitoring and error handling utilities
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export interface KyshiError {
  type: 'api_error' | 'webhook_error' | 'subscription_error' | 'payment_error' | 'cron_error';
  message: string;
  context?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  resolved?: boolean;
}

export interface KyshiMetrics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  failedPayments: number;
  successfulPayments: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  churnRate: number;
  averageRevenuePerUser: number;
}

export class KyshiMonitoringService {
  // Error logging
  static async logError(error: KyshiError): Promise<void> {
    try {
      await supabase
        .from('kyshi_webhook_logs')
        .insert({
          event_type: `error_${error.type}`,
          reference: error.context?.subscriptionId || error.context?.transactionId || 'system',
          payload: {
            error: error.message,
            context: error.context,
            severity: error.severity,
            type: error.type
          },
          processed: false,
          error_message: error.message,
        });

      // For critical errors, you might want to send alerts
      if (error.severity === 'critical') {
        await this.sendCriticalAlert(error);
      }
    } catch (loggingError) {
      console.error('Failed to log Kyshi error:', loggingError);
    }
  }

  // Metrics collection
  static async getMetrics(): Promise<KyshiMetrics> {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Get subscription metrics
      const { data: subscriptions } = await supabase
        .from('kyshi_subscriptions')
        .select('status, created_at, updated_at');

      const totalSubscriptions = subscriptions?.length || 0;
      const activeSubscriptions = subscriptions?.filter(s => s.status === 'active').length || 0;

      // Get transaction metrics
      const { data: transactions } = await supabase
        .from('kyshi_transactions')
        .select('status, amount, created_at');

      const successfulPayments = transactions?.filter(t => t.status === 'success').length || 0;
      const failedPayments = transactions?.filter(t => t.status === 'failed').length || 0;

      // Calculate revenue metrics
      const revenueToday = transactions
        ?.filter(t => t.status === 'success' && t.created_at.startsWith(today))
        ?.reduce((sum, t) => sum + t.amount, 0) || 0;

      const revenueThisWeek = transactions
        ?.filter(t => t.status === 'success' && t.created_at >= weekAgo)
        ?.reduce((sum, t) => sum + t.amount, 0) || 0;

      const revenueThisMonth = transactions
        ?.filter(t => t.status === 'success' && t.created_at >= monthAgo)
        ?.reduce((sum, t) => sum + t.amount, 0) || 0;

      // Calculate churn rate (simplified)
      const cancelledThisMonth = subscriptions
        ?.filter(s => s.status === 'cancelled' && s.updated_at >= monthAgo)
        ?.length || 0;
      
      const churnRate = totalSubscriptions > 0 ? (cancelledThisMonth / totalSubscriptions) * 100 : 0;

      // Calculate ARPU
      const averageRevenuePerUser = activeSubscriptions > 0 ? revenueThisMonth / activeSubscriptions : 0;

      return {
        totalSubscriptions,
        activeSubscriptions,
        failedPayments,
        successfulPayments,
        revenueToday,
        revenueThisWeek,
        revenueThisMonth,
        churnRate,
        averageRevenuePerUser,
      };
    } catch (error) {
      console.error('Error getting Kyshi metrics:', error);
      throw error;
    }
  }

  // Health check
  static async healthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    checks: {
      database: boolean;
      kyshiApi: boolean;
      recentErrors: number;
      failedPaymentsRate: number;
    };
    message: string;
  }> {
    try {
      // Check database connectivity
      let databaseHealthy = true;
      try {
        await supabase.from('kyshi_subscriptions').select('id').limit(1);
      } catch (error) {
        databaseHealthy = false;
      }

      // Check recent error rate
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data: recentErrors } = await supabase
        .from('kyshi_webhook_logs')
        .select('id')
        .eq('processed', false)
        .gte('created_at', oneHourAgo);

      const recentErrorCount = recentErrors?.length || 0;

      // Check failed payment rate
      const { data: recentTransactions } = await supabase
        .from('kyshi_transactions')
        .select('status')
        .gte('created_at', oneHourAgo);

      const totalRecent = recentTransactions?.length || 0;
      const failedRecent = recentTransactions?.filter(t => t.status === 'failed').length || 0;
      const failedPaymentsRate = totalRecent > 0 ? (failedRecent / totalRecent) * 100 : 0;

      // Check Kyshi API (basic connectivity)
      let kyshiApiHealthy = true;
      try {
        const response = await fetch(`${process.env.KYSHI_API_URL || 'https://api.kyshi.co/v1'}/plans`, {
          headers: {
            'Authorization': `Bearer ${process.env.KYSHI_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        kyshiApiHealthy = response.ok;
      } catch (error) {
        kyshiApiHealthy = false;
      }

      // Determine overall health
      let status: 'healthy' | 'warning' | 'critical' = 'healthy';
      let message = 'All systems operational';

      if (!databaseHealthy || !kyshiApiHealthy) {
        status = 'critical';
        message = 'Critical system failure detected';
      } else if (recentErrorCount > 10 || failedPaymentsRate > 20) {
        status = 'warning';
        message = 'High error rate detected';
      }

      return {
        status,
        checks: {
          database: databaseHealthy,
          kyshiApi: kyshiApiHealthy,
          recentErrors: recentErrorCount,
          failedPaymentsRate,
        },
        message,
      };
    } catch (error) {
      return {
        status: 'critical',
        checks: {
          database: false,
          kyshiApi: false,
          recentErrors: 999,
          failedPaymentsRate: 100,
        },
        message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Alert system (placeholder - integrate with your preferred alert service)
  private static async sendCriticalAlert(error: KyshiError): Promise<void> {
    // This is where you would integrate with:
    // - Email notifications
    // - Slack alerts
    // - PagerDuty
    // - SMS alerts
    // - etc.
    
    console.error('CRITICAL KYSHI ALERT:', {
      type: error.type,
      message: error.message,
      context: error.context,
      timestamp: error.timestamp,
    });

    // Example: Send to Slack (uncomment and configure)
    // await fetch(process.env.SLACK_WEBHOOK_URL!, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     text: `Kyshi Critical Alert: ${error.type}`,
    //     blocks: [
    //       {
    //         type: 'section',
    //         text: { type: 'mrkdwn', text: `*Kyshi Critical Alert*\n\n*Type:* ${error.type}\n*Message:* ${error.message}\n*Time:* ${error.timestamp}` }
    //       }
    //     ]
    //   })
    // });
  }

  // Performance monitoring
  static async logPerformance(operation: string, duration: number, success: boolean, context?: any): Promise<void> {
    try {
      await supabase
        .from('kyshi_webhook_logs')
        .insert({
          event_type: `performance_${operation}`,
          reference: context?.subscriptionId || context?.transactionId || 'system',
          payload: {
            operation,
            duration,
            success,
            context
          },
          processed: true,
        });
    } catch (error) {
      console.error('Failed to log performance:', error);
    }
  }

  // Webhook monitoring
  static async getWebhookStats(hours: number = 24): Promise<{
    total: number;
    processed: number;
    failed: number;
    averageProcessingTime: number;
    eventTypeBreakdown: Record<string, number>;
  }> {
    try {
      const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
      
      const { data: logs } = await supabase
        .from('kyshi_webhook_logs')
        .select('event_type, processed, created_at')
        .gte('created_at', since);

      const total = logs?.length || 0;
      const processed = logs?.filter(l => l.processed).length || 0;
      const failed = total - processed;

      // Calculate event type breakdown
      const eventTypeBreakdown: Record<string, number> = {};
      logs?.forEach(log => {
        eventTypeBreakdown[log.event_type] = (eventTypeBreakdown[log.event_type] || 0) + 1;
      });

      return {
        total,
        processed,
        failed,
        averageProcessingTime: 0, // Would need to add processing_time field to logs
        eventTypeBreakdown,
      };
    } catch (error) {
      console.error('Error getting webhook stats:', error);
      return {
        total: 0,
        processed: 0,
        failed: 0,
        averageProcessingTime: 0,
        eventTypeBreakdown: {},
      };
    }
  }
}

// Error handling middleware for API routes
export function withKyshiErrorHandling(handler: Function) {
  return async (request: Request, ...args: any[]) => {
    const startTime = Date.now();
    
    try {
      const result = await handler(request, ...args);
      
      // Log successful operation
      await KyshiMonitoringService.logPerformance(
        request.url.split('/').pop() || 'unknown',
        Date.now() - startTime,
        true
      );
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Log error
      await KyshiMonitoringService.logError({
        type: 'api_error',
        message: error instanceof Error ? error.message : 'Unknown API error',
        context: {
          url: request.url,
          method: request.method,
          duration,
        },
        severity: 'high',
        timestamp: new Date().toISOString(),
      });

      // Log performance
      await KyshiMonitoringService.logPerformance(
        request.url.split('/').pop() || 'unknown',
        duration,
        false
      );

      // Return appropriate error response
      return new Response(
        JSON.stringify({
          success: false,
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  };
}

// Utility function to create standardized error responses
export function createKyshiErrorResponse(
  message: string,
  type: KyshiError['type'] = 'api_error',
  severity: KyshiError['severity'] = 'medium',
  context?: any
) {
  return {
    success: false,
    message,
    error: {
      type,
      severity,
      context,
      timestamp: new Date().toISOString(),
    },
  };
}
