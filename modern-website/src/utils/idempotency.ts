/**
 * Idempotency Helper Utilities
 * Handles idempotency key checking and storage for API routes
 */

import { supabase } from '@/lib/supabase';

export interface IdempotencyResult {
  isDuplicate: boolean;
  responseData?: any;
}

/**
 * Check if an idempotency key has been processed before
 */
export async function checkIdempotencyKey(
  key: string,
  feature: string,
  operationType: string,
  userId: string
): Promise<IdempotencyResult> {
  try {
    const { data, error } = await supabase
      .from('idempotency_keys')
      .select('response_data')
      .eq('key', key)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking idempotency key:', error);
      return { isDuplicate: false };
    }

    if (data) {
      console.log(`Duplicate request detected for key: ${key}`);
      return {
        isDuplicate: true,
        responseData: data.response_data
      };
    }

    return { isDuplicate: false };
  } catch (error) {
    console.error('Error in checkIdempotencyKey:', error);
    return { isDuplicate: false };
  }
}

/**
 * Store an idempotency key with its response
 */
export async function storeIdempotencyKey(
  key: string,
  feature: string,
  operationType: string,
  userId: string,
  responseData: any
): Promise<void> {
  try {
    const { error } = await supabase
      .from('idempotency_keys')
      .insert({
        key,
        feature,
        operation_type: operationType,
        user_id: userId,
        response_data: responseData,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });

    if (error) {
      console.error('Error storing idempotency key:', error);
    }
  } catch (error) {
    console.error('Error in storeIdempotencyKey:', error);
  }
}

/**
 * Clean up expired idempotency keys
 */
export async function cleanupExpiredKeys(): Promise<void> {
  try {
    const { error } = await supabase
      .from('idempotency_keys')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (error) {
      console.error('Error cleaning up expired keys:', error);
    } else {
      console.log('Expired idempotency keys cleaned up');
    }
  } catch (error) {
    console.error('Error in cleanupExpiredKeys:', error);
  }
}
