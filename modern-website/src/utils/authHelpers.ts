/**
 * Authentication helper utilities for database operations
 */

import { supabase } from '@/lib/supabase';

export interface AuthCheckResult {
  isAuthenticated: boolean;
  userId: string | null;
  businessId: string | null;
  error: string | null;
}

/**
 * Check if user is properly authenticated and has valid business context
 * This helps debug RLS policy issues
 */
export async function checkAuthenticationStatus(businessId?: string): Promise<AuthCheckResult> {
  try {
    console.log('🔍 [authHelpers] Checking authentication status...');
    
    // Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ [authHelpers] Session error:', sessionError);
      return {
        isAuthenticated: false,
        userId: null,
        businessId: null,
        error: `Session error: ${sessionError.message}`
      };
    }

    if (!session?.user) {
      console.error('❌ [authHelpers] No authenticated user found');
      return {
        isAuthenticated: false,
        userId: null,
        businessId: null,
        error: 'No authenticated user found'
      };
    }

    console.log('✅ [authHelpers] User authenticated:', session.user.email);

    // If businessId provided, verify it exists and belongs to user
    if (businessId) {
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('id, business_name, supabase_user_id')
        .eq('id', businessId)
        .eq('supabase_user_id', session.user.id)
        .single();

      if (businessError || !business) {
        console.error('❌ [authHelpers] Business verification failed:', businessError);
        return {
          isAuthenticated: false,
          userId: session.user.id,
          businessId: null,
          error: `Business verification failed: ${businessError?.message || 'Business not found'}`
        };
      }

      console.log('✅ [authHelpers] Business verified:', business.business_name);
      return {
        isAuthenticated: true,
        userId: session.user.id,
        businessId: business.id,
        error: null
      };
    }

    // No businessId provided, just return auth status
    return {
      isAuthenticated: true,
      userId: session.user.id,
      businessId: null,
      error: null
    };

  } catch (error) {
    console.error('💥 [authHelpers] Authentication check failed:', error);
    return {
      isAuthenticated: false,
      userId: null,
      businessId: null,
      error: error instanceof Error ? error.message : 'Authentication check failed'
    };
  }
}

/**
 * Validate required fields for database operations
 */
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!data[field] || data[field] === '' || data[field] === null) {
      missingFields.push(field);
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

/**
 * Log detailed error information for debugging
 */
export function logDatabaseError(operation: string, error: any, payload?: any) {
  console.error(`💥 [DB Error] ${operation} failed:`, {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
    payload
  });

  // Check for common RLS-related errors
  if (error.code === '42501') {
    console.error('🚫 [RLS] Row Level Security policy violation - user may not have permission');
  }
  
  if (error.code === 'PGRST116') {
    console.error('🚫 [RLS] Policy exists but user is not authenticated');
  }
}

/**
 * Create a standardized error object for hooks
 */
export function createHookError(message: string, originalError?: any) {
  const error = new Error(message);
  (error as any).code = originalError?.code;
  (error as any).details = originalError?.details;
  (error as any).originalError = originalError;
  return error;
}
