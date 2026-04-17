import { createClient } from '@supabase/supabase-js';
import { RateLimitConfig, RateLimitResult, FailedPinRecord } from '@/types/rate-limit';

// Use service role for rate limit operations (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export class SupabaseRateLimitAdapter {
  
  // Record an attempt and check if within limits
  async checkAndRecord(
    identifier: string,
    type: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const key = `${identifier}:${type}`;
    
    // Get current record
    const { data: record } = await supabaseAdmin
      .from('rate_limits')
      .select('*')
      .eq('identifier', identifier)
      .eq('type', type)
      .single();
    
    const now = new Date();
    
    // Check if currently locked out
    if (record?.locked_until && new Date(record.locked_until) > now) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(record.locked_until),
        lockoutUntil: new Date(record.locked_until),
        message: `Too many attempts. Try again after ${new Date(record.locked_until).toLocaleTimeString()}`,
      };
    }
    
    // Check window expiry
    const windowStart = record?.first_attempt_at 
      ? new Date(record.first_attempt_at)
      : now;
    
    const windowExpiry = new Date(windowStart.getTime() + (config.windowSeconds * 1000));
    
    // If window expired, reset counter
    if (windowExpiry < now) {
      // Reset the record
      await supabaseAdmin
        .from('rate_limits')
        .upsert({
          identifier,
          type,
          attempts: 1,
          first_attempt_at: now,
          last_attempt_at: now,
          locked_until: null,
        }, { onConflict: 'identifier,type' });
      
      return {
        allowed: true,
        remaining: config.maxAttempts - 1,
        resetAt: new Date(now.getTime() + (config.windowSeconds * 1000)),
      };
    }
    
    // Check if within limits
    const currentAttempts = record?.attempts || 0;
    
    if (currentAttempts >= config.maxAttempts) {
      // Lock out for the remainder of the window
      await supabaseAdmin
        .from('rate_limits')
        .update({ locked_until: windowExpiry })
        .eq('identifier', identifier)
        .eq('type', type);
      
      return {
        allowed: false,
        remaining: 0,
        resetAt: windowExpiry,
        lockoutUntil: windowExpiry,
        message: `Too many attempts. Try again after ${windowExpiry.toLocaleTimeString()}`,
      };
    }
    
    // Increment attempts
    await supabaseAdmin
      .from('rate_limits')
      .upsert({
        identifier,
        type,
        attempts: currentAttempts + 1,
        first_attempt_at: windowStart,
        last_attempt_at: now,
        locked_until: null,
      }, { onConflict: 'identifier,type' });
    
    return {
      allowed: true,
      remaining: config.maxAttempts - (currentAttempts + 1),
      resetAt: windowExpiry,
    };
  }
  
  // Record failed PIN attempt with progressive backoff
  async recordFailedPin(phoneNumber: string): Promise<RateLimitResult> {
    const { data: record } = await supabaseAdmin
      .from('failed_pin_attempts')
      .select('*')
      .eq('phone_number', phoneNumber)
      .single();
    
    const now = new Date();
    const attempts = (record?.attempts || 0) + 1;
    let escalationLevel = record?.escalation_level || 1;
    let lockoutUntil: Date | null = null;
    
    // Progressive lockout levels
    const lockoutSeconds = [0, 30, 60, 300, 900, 3600, 86400]; // 0s, 30s, 1m, 5m, 15m, 1h, 24h
    
    if (attempts >= 3 && attempts <= 5) {
      escalationLevel = 2;
      lockoutUntil = new Date(now.getTime() + (lockoutSeconds[1] * 1000));
    } else if (attempts >= 6 && attempts <= 7) {
      escalationLevel = 3;
      lockoutUntil = new Date(now.getTime() + (lockoutSeconds[2] * 1000));
    } else if (attempts >= 8 && attempts <= 9) {
      escalationLevel = 4;
      lockoutUntil = new Date(now.getTime() + (lockoutSeconds[3] * 1000));
    } else if (attempts >= 10 && attempts <= 11) {
      escalationLevel = 5;
      lockoutUntil = new Date(now.getTime() + (lockoutSeconds[4] * 1000));
    } else if (attempts >= 12 && attempts <= 14) {
      escalationLevel = 6;
      lockoutUntil = new Date(now.getTime() + (lockoutSeconds[5] * 1000));
    } else if (attempts >= 15) {
      escalationLevel = 7;
      lockoutUntil = new Date(now.getTime() + (lockoutSeconds[6] * 1000));
    }
    
    await supabaseAdmin
      .from('failed_pin_attempts')
      .upsert({
        phone_number: phoneNumber,
        attempts,
        last_failed_at: now,
        lockout_until: lockoutUntil,
        escalation_level: escalationLevel,
      }, { onConflict: 'phone_number' });
    
    if (lockoutUntil && lockoutUntil > now) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: lockoutUntil,
        lockoutUntil,
        escalationLevel,
        message: `Too many failed attempts. Try again in ${Math.ceil((lockoutUntil.getTime() - now.getTime()) / 1000)} seconds.`,
      };
    }
    
    return {
      allowed: true,
      remaining: 15 - attempts,
      resetAt: now,
      escalationLevel,
    };
  }
  
  // Reset failed PIN attempts on success
  async resetFailedPin(phoneNumber: string): Promise<void> {
    await supabaseAdmin
      .from('failed_pin_attempts')
      .delete()
      .eq('phone_number', phoneNumber);
  }
  
  // Check corporate multiplier
  async getCorporateMultiplier(phoneNumber: string): Promise<number> {
    const { data } = await supabaseAdmin
      .from('corporate_rate_limits')
      .select('limit_multiplier')
      .eq('phone_number', phoneNumber)
      .lte('valid_from', new Date().toISOString())
      .maybeSingle();
    
    return data?.limit_multiplier || 1;
  }
}

