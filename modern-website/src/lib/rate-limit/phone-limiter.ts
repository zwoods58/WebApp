import { SupabaseRateLimitAdapter } from './supabase-adapter';
import { DEFAULT_RATE_LIMITS, RateLimitType, RateLimitResult } from '@/types/rate-limit';

const adapter = new SupabaseRateLimitAdapter();

export class PhoneRateLimiter {
  
  /**
   * Check rate limit for a phone number
   * @param phoneNumber - International format phone number (e.g., +254700000000)
   * @param type - Type of rate limit to check
   * @returns RateLimitResult
   */
  async checkLimit(
    phoneNumber: string,
    type: RateLimitType
  ): Promise<RateLimitResult> {
    const config = DEFAULT_RATE_LIMITS[type];
    
    // Check for corporate multiplier
    const multiplier = await adapter.getCorporateMultiplier(phoneNumber);
    
    // Apply multiplier to max attempts
    const adjustedConfig = {
      ...config,
      maxAttempts: config.maxAttempts * multiplier,
    };
    
    return await adapter.checkAndRecord(phoneNumber, type, adjustedConfig);
  }
  
  /**
   * Special handler for PIN verification with progressive backoff
   */
  async checkPinVerification(phoneNumber: string): Promise<RateLimitResult> {
    return await adapter.recordFailedPin(phoneNumber);
  }
  
  /**
   * Reset PIN verification counter (on successful login)
   */
  async resetPinVerification(phoneNumber: string): Promise<void> {
    await adapter.resetFailedPin(phoneNumber);
  }
  
  /**
   * Check business operation limit (user-based)
   */
  async checkOperationLimit(userId: string, type: RateLimitType): Promise<RateLimitResult> {
    const config = DEFAULT_RATE_LIMITS[type];
    return await adapter.checkAndRecord(userId, type, config);
  }
}

export const rateLimiter = new PhoneRateLimiter();
