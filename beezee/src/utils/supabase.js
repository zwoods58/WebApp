// Supabase Client Configuration

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Warn in development if env vars are missing
if (import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.warn('⚠️ Missing Supabase environment variables. Please create a .env file with:');
  console.warn('   VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.warn('   VITE_SUPABASE_ANON_KEY=your-anon-key');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper function to get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  
  return user;
}

// Helper function to check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

// Helper function to sign out (custom auth system)
export async function signOut() {
  try {
    // Clear Supabase Auth session (if any)
    await supabase.auth.signOut();
  } catch (error) {
    // Ignore Supabase Auth errors (we're using custom auth)
    console.warn('Supabase auth signOut error (ignored):', error);
  }
  
  // Clear custom auth data from localStorage
  localStorage.removeItem('beezee_user_id');
  localStorage.removeItem('beezee_whatsapp');
  
  // Clear auth store - import at top level to avoid issues
  // Note: This will be called from components that already have access to useAuthStore
  // The component calling signOut should also call clearAuth() if needed
}

// Edge Functions helpers
const functionsUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || 
  (import.meta.env.VITE_SUPABASE_URL ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1` : '');

export async function callEdgeFunction(functionName, payload, requireAuth = false) {
  try {
    let headers = {
      'Content-Type': 'application/json',
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '', // Required for all Edge Functions
    };

    // Only add auth header if required
    if (requireAuth) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      } else {
        // If auth required but no session, still use anon key
        headers['Authorization'] = `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`;
      }
    } else {
      // For public functions, use anon key in Authorization header
      headers['Authorization'] = `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`;
    }

    const response = await fetch(`${functionsUrl}/${functionName}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      // For OTP verification, return the data even if not OK so frontend can check success flag
      if (functionName === 'verify-OTP-custom' && data.success === false) {
        return data;
      }
      
      // For subscription_required errors, return data so frontend can handle navigation
      if (data.error === 'subscription_required' || response.status === 403) {
        return {
          success: false,
          error: 'subscription_required',
          message: data.message || 'Subscription required',
        };
      }
      
      throw new Error(data.error || data.message || 'Edge function failed');
    }

    return data;
  } catch (error) {
    console.error(`Error calling ${functionName}:`, error);
    throw error;
  }
}

// Specific edge function wrappers
export async function voiceToBooking(audioBase64, language = 'en', type = 'booking') {
  try {
    const userId = localStorage.getItem('beezee_user_id');
    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }

    const response = await callEdgeFunction('voice-booking', {
      audioBase64,
      language,
      user_id: userId,
      type, // 'booking' or 'task'
    }, false);

    return response;
  } catch (error) {
    console.error('Error calling voice-booking function:', error);
    return {
      success: false,
      error: error.message || 'Failed to process voice recording',
    };
  }
}

export async function voiceToTransaction(audioBase64, language = 'en') {
  // Get user ID from localStorage (custom auth system)
  const userId = localStorage.getItem('beezee_user_id');
  if (!userId) {
    throw new Error('Not authenticated. Please log in.');
  }
  return callEdgeFunction('voice-transaction', { audioBase64, language, user_id: userId });
}

export async function receiptToTransaction(imageBase64, mimeType = 'image/jpeg') {
  // Get user ID from localStorage (custom auth system)
  const userId = localStorage.getItem('beezee_user_id');
  if (!userId) {
    throw new Error('Not authenticated. Please log in.');
  }
  return callEdgeFunction('receipts-transaction', { imageBase64, mimeType, user_id: userId });
}

export async function generateReport(reportType, startDate, endDate) {
  // Get user ID from localStorage (custom auth system)
  const userId = localStorage.getItem('beezee_user_id');
  if (!userId) {
    throw new Error('Not authenticated. Please log in.');
  }
  const result = await callEdgeFunction('Generate-Reports', { reportType, startDate, endDate, user_id: userId });
  
  // Handle empty state gracefully - don't treat "No transactions" as an error
  if (result && !result.success && result.message && 
      (result.message.toLowerCase().includes('no transactions found') || 
       result.message.toLowerCase().includes('no transactions'))) {
    return {
      success: false,
      error: 'empty_state',
      message: result.message,
    };
  }
  
  return result;
}

export async function askFinancialCoach(question, context = null) {
  // Get user ID from localStorage (custom auth system)
  const userId = localStorage.getItem('beezee_user_id');
  if (!userId) {
    throw new Error('Not authenticated. Please log in.');
  }
  return callEdgeFunction('Financial-Coach', { question, context, user_id: userId });
}

export async function sendNotification(notificationType, data = {}, userId = null) {
  // Get user ID from localStorage if not provided (custom auth system)
  const finalUserId = userId || localStorage.getItem('beezee_user_id');
  if (!finalUserId) {
    throw new Error('Not authenticated. Please log in.');
  }
  return callEdgeFunction('create-notifications', { 
    userId: finalUserId,
    type: notificationType,
    data
  }, true);
}

// Custom OTP Functions - Using Supabase REST API directly (NO Edge Functions = NO CORS issues!)
export async function sendOTPWhatsApp(whatsappNumber) {
  // Generate OTP and store directly in database using Supabase client (no Edge Functions!)
  try {
    // Normalize phone number
    const normalizedNumber = whatsappNumber.replace(/\s/g, '').trim();
    
    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP directly in database using Supabase client
    const { data, error } = await supabase
      .from('otp_codes')
      .insert({
        whatsapp_number: normalizedNumber,
        code: otpCode,
        expires_at: expiresAt.toISOString(),
        used: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing OTP:', error);
      throw new Error('Failed to generate OTP');
    }

    return {
      success: true,
      otp_code: otpCode, // Return code for in-app display
      expires_in: 300, // 5 minutes in seconds
      message: "OTP code generated. Your code is displayed below.",
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
}

export async function verifyOTPCustom(whatsappNumber, code) {
  // Verify OTP using Supabase RPC function directly (no Edge Functions!)
  try {
    // Normalize phone number
    const normalizedNumber = whatsappNumber.replace(/\s/g, '').trim();
    
    // Call RPC function directly using Supabase client
    const { data: isValid, error: verifyError } = await supabase.rpc(
      'verify_otp_code',
      {
        p_whatsapp_number: normalizedNumber,
        p_code: code.toString().trim(),
      }
    );

    if (verifyError) {
      console.error('Error verifying OTP:', verifyError);
      return {
        success: false,
        error: 'Failed to verify OTP',
      };
    }

    if (!isValid) {
      // Check if OTP exists but is expired/used
      const { data: otpCheck } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('whatsapp_number', normalizedNumber)
        .eq('code', code.toString().trim())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      let errorMessage = 'Invalid or expired code';
      if (otpCheck) {
        if (otpCheck.used) {
          errorMessage = 'This code has already been used';
        } else if (new Date(otpCheck.expires_at) < new Date()) {
          errorMessage = 'This code has expired. Please request a new one.';
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('whatsapp_number', normalizedNumber)
      .single();

    let userId;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          whatsapp_number: normalizedNumber,
          phone_number: normalizedNumber, // Store as phone for compatibility
          subscription_status: 'trial',
          trial_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select('id')
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return {
          success: false,
          error: 'Failed to create user',
        };
      }

      userId = newUser.id;
    }

    return {
      success: true,
      user_id: userId,
      whatsapp_number: normalizedNumber,
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    };
  }
}

