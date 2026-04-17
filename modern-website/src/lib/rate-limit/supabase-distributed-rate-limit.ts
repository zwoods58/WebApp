/**
 * Supabase Distributed Rate Limiting Implementation
 * Replaces Redis with Supabase-native rate limiting with sliding window algorithm
 */

import { createClient } from '@supabase/supabase-js';

// Rate limit configuration
export interface RateLimitConfig {
  windowMs: number;           // Time window in milliseconds
  maxRequests: number;        // Maximum requests per window
  keyGenerator?: (req: any) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyPrefix?: string;
  corporateMultiplier?: number;
  phoneMultiplier?: number;
  progressiveBackoff?: boolean;
}

// Rate limit result
export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
  isBlocked?: boolean;
  blockReason?: string;
}

// Rate limit violation info
export interface RateLimitViolation {
  identifier: string;
  identifierType: string;
  endpoint: string;
  method: string;
  requestCount: number;
  limit: number;
  windowSeconds: number;
  violationType: 'standard' | 'burst' | 'abuse';
  headers?: Record<string, any>;
  userAgent?: string;
  ipAddress?: string;
  subscriptionTier?: string;
  countryCode?: string;
}

// User tier configuration
export const USER_TIER_LIMITS = {
  free: {
    windowMs: 60 * 1000,        // 1 minute
    maxRequests: 100,           // 100 requests per minute
    corporateMultiplier: 1.0,
    phoneMultiplier: 1.0,
  },
  basic: {
    windowMs: 60 * 1000,        // 1 minute
    maxRequests: 500,           // 500 requests per minute
    corporateMultiplier: 2.0,
    phoneMultiplier: 1.5,
  },
  premium: {
    windowMs: 60 * 1000,        // 1 minute
    maxRequests: 2000,          // 2000 requests per minute
    corporateMultiplier: 3.0,
    phoneMultiplier: 2.0,
  },
  enterprise: {
    windowMs: 60 * 1000,        // 1 minute
    maxRequests: 10000,         // 10000 requests per minute
    corporateMultiplier: 5.0,
    phoneMultiplier: 3.0,
  },
} as const;

export type UserTier = keyof typeof USER_TIER_LIMITS;

class SupabaseDistributedRateLimiter {
  private supabase: any;
  private defaultConfig: RateLimitConfig;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    this.defaultConfig = {
      windowMs: 60 * 1000,        // 1 minute
      maxRequests: 100,           // 100 requests per minute
      keyPrefix: 'rl',
      corporateMultiplier: 1.0,
      phoneMultiplier: 1.0,
      progressiveBackoff: true,
    };
  }

  // Main rate limiting method with sliding window
  async checkRateLimit(
    identifier: string,
    config: Partial<RateLimitConfig> = {},
    requestInfo?: {
      endpoint?: string;
      method?: string;
      headers?: Record<string, any>;
      userAgent?: string;
      ipAddress?: string;
      subscriptionTier?: UserTier;
      countryCode?: string;
      isCorporate?: boolean;
      isPhoneRequest?: boolean;
    }
  ): Promise<RateLimitResult> {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    // Apply multipliers based on user tier and request type
    let adjustedLimit = finalConfig.maxRequests;
    
    if (requestInfo?.subscriptionTier) {
      const tierConfig = USER_TIER_LIMITS[requestInfo.subscriptionTier];
      
      // Apply corporate multiplier
      if (requestInfo.isCorporate && tierConfig.corporateMultiplier > 1) {
        adjustedLimit = Math.floor(adjustedLimit * tierConfig.corporateMultiplier);
      }
      
      // Apply phone multiplier
      if (requestInfo.isPhoneRequest && tierConfig.phoneMultiplier > 1) {
        adjustedLimit = Math.floor(adjustedLimit * tierConfig.phoneMultiplier);
      }
    }

    // Check if identifier is blocked
    const isBlocked = await this.isBlocked(identifier);
    if (isBlocked) {
      return {
        allowed: false,
        limit: adjustedLimit,
        remaining: 0,
        resetTime: new Date(Date.now() + finalConfig.windowMs),
        isBlocked: true,
        blockReason: 'Identifier is temporarily blocked',
      };
    }

    // Use sliding window algorithm
    const result = await this.slidingWindowCheck(identifier, adjustedLimit, finalConfig.windowMs);
    
    // Log violation if rate limited
    if (!result.allowed && requestInfo) {
      await this.logViolation({
        identifier,
        identifierType: this.getIdentifierType(identifier),
        endpoint: requestInfo.endpoint || 'unknown',
        method: requestInfo.method || 'GET',
        requestCount: adjustedLimit + 1,
        limit: adjustedLimit,
        windowSeconds: Math.floor(finalConfig.windowMs / 1000),
        violationType: this.determineViolationType(result.remaining, adjustedLimit),
        headers: requestInfo.headers,
        userAgent: requestInfo.userAgent,
        ipAddress: requestInfo.ipAddress,
        subscriptionTier: requestInfo.subscriptionTier,
        countryCode: requestInfo.countryCode,
      });
    }

    // Apply progressive backoff if enabled
    if (finalConfig.progressiveBackoff && !result.allowed && requestInfo) {
      await this.applyProgressiveBackoff(identifier, result);
    }

    return result;
  }

  // Sliding window rate limiting using Supabase
  private async slidingWindowCheck(
    identifier: string,
    maxRequests: number,
    windowMs: number
  ): Promise<RateLimitResult> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - windowMs);
    
    try {
      // Clean up old entries first
      await this.cleanupOldEntries(identifier, windowStart);

      // Count current requests in window
      const { count, error } = await this.supabase
        .from('rate_limits')
        .select('*', { count: 'exact' })
        .eq('identifier', identifier)
        .gte('created_at', windowStart.toISOString())
        .lte('created_at', now.toISOString());

      if (error) {
        console.error('Rate limit check error:', error);
        // Fail open - allow the request
        return {
          allowed: true,
          limit: maxRequests,
          remaining: maxRequests - 1,
          resetTime: new Date(now.getTime() + windowMs),
        };
      }

      const currentCount = count || 0;
      const allowed = currentCount < maxRequests;
      const remaining = Math.max(0, maxRequests - currentCount - (allowed ? 1 : 0));

      // Add current request to the log if allowed
      if (allowed) {
        await this.addRequestEntry(identifier);
      }

      return {
        allowed,
        limit: maxRequests,
        remaining,
        resetTime: new Date(now.getTime() + windowMs),
        retryAfter: allowed ? undefined : Math.ceil(windowMs / 1000),
      };
    } catch (error) {
      console.error('Sliding window check error:', error);
      // Fail open - allow the request
      return {
        allowed: true,
        limit: maxRequests,
        remaining: maxRequests - 1,
        resetTime: new Date(now.getTime() + windowMs),
      };
    }
  }

  // Add request entry to rate_limits table
  private async addRequestEntry(identifier: string): Promise<void> {
    try {
      await this.supabase
        .from('rate_limits')
        .insert({
          identifier,
          created_at: new Date().toISOString(),
        });
    } catch (error) {
      console.error('Failed to add rate limit entry:', error);
    }
  }

  // Clean up old entries outside the window
  private async cleanupOldEntries(identifier: string, cutoff: Date): Promise<void> {
    try {
      await this.supabase
        .from('rate_limits')
        .delete()
        .eq('identifier', identifier)
        .lt('created_at', cutoff.toISOString());
    } catch (error) {
      console.error('Failed to cleanup old rate limit entries:', error);
    }
  }

  // Check if identifier is blocked
  private async isBlocked(identifier: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.rpc('is_rate_limit_blocked', {
        p_identifier: identifier,
        p_identifier_type: this.getIdentifierType(identifier),
      });

      if (error) {
        console.error('Block check error:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Block check error:', error);
      return false;
    }
  }

  // Determine violation type
  private determineViolationType(remaining: number, limit: number): 'standard' | 'burst' | 'abuse' {
    const violationRatio = (limit - remaining) / limit;
    
    if (violationRatio > 2) {
      return 'abuse';
    } else if (violationRatio > 1.5) {
      return 'burst';
    } else {
      return 'standard';
    }
  }

  // Get identifier type
  private getIdentifierType(identifier: string): string {
    if (identifier.includes('.')) {
      return 'ip';
    } else if (identifier.startsWith('user_')) {
      return 'user_id';
    } else if (identifier.startsWith('phone_')) {
      return 'phone';
    } else if (identifier.startsWith('api_')) {
      return 'api_key';
    } else {
      return 'unknown';
    }
  }

  // Log rate limit violation
  private async logViolation(violation: RateLimitViolation): Promise<void> {
    try {
      await this.supabase.rpc('log_rate_limit_violation', {
        p_identifier: violation.identifier,
        p_identifier_type: violation.identifierType,
        p_endpoint: violation.endpoint,
        p_method: violation.method,
        p_request_count: violation.requestCount,
        p_limit_value: violation.limit,
        p_window_seconds: violation.windowSeconds,
        p_headers: violation.headers || {},
        p_user_agent: violation.userAgent,
        p_ip_address: violation.ipAddress,
        p_subscription_tier: violation.subscriptionTier || 'free',
        p_violation_type: violation.violationType,
        p_country_code: violation.countryCode,
      });
    } catch (error) {
      console.error('Failed to log rate limit violation:', error);
    }
  }

  // Apply progressive backoff
  private async applyProgressiveBackoff(identifier: string, result: RateLimitResult): Promise<void> {
    try {
      // Get violation count for this identifier
      const { count, error } = await this.supabase
        .from('rate_limit_audit')
        .select('*', { count: 'exact' })
        .eq('identifier', identifier)
        .gte('violated_at', new Date(Date.now() - 3600000).toISOString()); // Last hour

      if (error || !count) return;

      const violationCount = count;
      
      // Apply progressive block based on violation count
      if (violationCount >= 10) {
        // Block for 1 hour after 10 violations
        await this.createBlock(identifier, 'progressive', 3600, 'High violation count detected');
      } else if (violationCount >= 5) {
        // Block for 30 minutes after 5 violations
        await this.createBlock(identifier, 'progressive', 1800, 'Repeated violations detected');
      } else if (violationCount >= 3) {
        // Block for 15 minutes after 3 violations
        await this.createBlock(identifier, 'progressive', 900, 'Multiple violations detected');
      }
    } catch (error) {
      console.error('Failed to apply progressive backoff:', error);
    }
  }

  // Create a block for an identifier
  private async createBlock(
    identifier: string,
    blockType: string,
    durationSeconds: number,
    reason: string
  ): Promise<void> {
    try {
      await this.supabase
        .from('rate_limit_blocks')
        .insert({
          identifier,
          identifier_type: this.getIdentifierType(identifier),
          block_reason: reason,
          block_end: new Date(Date.now() + durationSeconds * 1000).toISOString(),
          block_type: blockType,
          metadata: {
            created_by: 'rate_limiter',
            violation_count: 'auto_detected',
          },
        });
    } catch (error) {
      console.error('Failed to create block:', error);
    }
  }

  // Get rate limit statistics
  async getStats(identifier?: string, hours: number = 24): Promise<any> {
    try {
      const cutoff = new Date(Date.now() - hours * 3600000);
      
      let query = this.supabase
        .from('rate_limit_audit')
        .select('*')
        .gte('violated_at', cutoff.toISOString());

      if (identifier) {
        query = query.eq('identifier', identifier);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to get rate limit stats:', error);
        return null;
      }

      // Process statistics
      const stats = {
        totalViolations: data?.length || 0,
        uniqueIdentifiers: new Set(data?.map((d: any) => d.identifier)).size,
        violationsByHour: this.groupByHour(data || []),
        violationsByType: this.groupByType(data || []),
        violationsByEndpoint: this.groupByEndpoint(data || []),
        topViolators: this.getTopViolators(data || []),
        activeBlocks: await this.getActiveBlocks(identifier),
      };

      return stats;
    } catch (error) {
      console.error('Failed to get rate limit stats:', error);
      return null;
    }
  }

  // Get active blocks
  private async getActiveBlocks(identifier?: string): Promise<any[]> {
    try {
      let query = this.supabase
        .from('rate_limit_active_blocks')
        .select('*');

      if (identifier) {
        query = query.eq('identifier', identifier);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to get active blocks:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to get active blocks:', error);
      return [];
    }
  }

  // Helper methods for statistics
  private groupByHour(violations: any[]): Record<string, number> {
    return violations.reduce((acc, v) => {
      const hour = new Date(v.violated_at).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});
  }

  private groupByType(violations: any[]): Record<string, number> {
    return violations.reduce((acc, v) => {
      const type = v.violation_type || 'standard';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  }

  private groupByEndpoint(violations: any[]): Record<string, number> {
    return violations.reduce((acc, v: any) => {
      const endpoint = v.endpoint || 'unknown';
      acc[endpoint] = (acc[endpoint] || 0) + 1;
      return acc;
    }, {});
  }

  private getTopViolators(violations: any[]): any[] {
    const counts = violations.reduce((acc: Record<string, number>, v: any) => {
      acc[v.identifier] = (acc[v.identifier] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([identifier, count]) => ({ identifier, count }));
  }

  // Cleanup old data
  async cleanup(daysOld: number = 30): Promise<number> {
    try {
      const { data, error } = await this.supabase.rpc('cleanup_rate_limit_audit', {
        p_days_old: daysOld,
      });

      if (error) {
        console.error('Failed to cleanup rate limit data:', error);
        return 0;
      }

      return data || 0;
    } catch (error) {
      console.error('Failed to cleanup rate limit data:', error);
      return 0;
    }
  }

  // Reset rate limit for identifier
  async reset(identifier: string): Promise<void> {
    try {
      await this.supabase
        .from('rate_limits')
        .delete()
        .eq('identifier', identifier);

      // Remove any active blocks
      await this.supabase
        .from('rate_limit_blocks')
        .update({ is_active: false })
        .eq('identifier', identifier)
        .eq('is_active', true);
    } catch (error) {
      console.error('Failed to reset rate limit:', error);
    }
  }
}

// Export singleton instance
export const supabaseRateLimiter = new SupabaseDistributedRateLimiter();
export default supabaseRateLimiter;

