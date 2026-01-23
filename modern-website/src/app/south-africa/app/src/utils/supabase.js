// Supabase Client Configuration

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Warn in development if env vars are missing
if (process.env.NODE_ENV === 'development' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  console.warn('⚠️ Missing Supabase environment variables. Please create a .env file with:');
  console.warn('   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.warn('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
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
const functionsUrl = process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL ||
  (process.env.NEXT_PUBLIC_SUPABASE_URL ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1` : '');

export async function callEdgeFunction(functionName, payload, requireAuth = false) {
  try {
    let headers = {
      'Content-Type': 'application/json',
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '', // Required for all Edge Functions
    };

    // Only add auth header if required
    if (requireAuth) {
      // Get session from the already created supabase client
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      } else {
        // If auth required but no session, still use anon key
        headers['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`;
      }
    } else {
      // For public functions, use anon key in Authorization header
      headers['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`;
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
      console.error('[voiceToBooking] No user ID found in localStorage');
      return { success: false, error: 'Not authenticated' };
    }

    console.log(`[voiceToBooking] Calling edge function for user: ${userId}, type: ${type}`);

    // South Africa Demo Mode Mock
    if (localStorage.getItem('beezee_za_demo_data')) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (type === 'inventory') {
        return {
          success: true,
          confidence: 0.95,
          inventory: { name: "Sample Item", quantity: 10, cost_price: 15, selling_price: 25, category: "Mock" }
        };
      }
      if (type === 'booking') {
        return {
          success: true,
          confidence: 0.92,
          booking: { client_name: "Mock Client", appointment_date: new Date().toISOString().split('T')[0], appointment_time: "10:00", service: "Consultation" }
        };
      }
      if (type === 'task') {
        return {
          success: true,
          confidence: 0.88,
          task: { title: "Mock Task", due_date: new Date().toISOString().split('T')[0], priority: "medium" }
        };
      }
    }

    const response = await callEdgeFunction('voice-booking', {
      audioBase64,
      language,
      user_id: userId,
      type,
    }, false);

    console.log('[voiceToBooking] Response received:', response);
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

export async function generateReport(reportType, startDate, endDate, customUserId = null, calculatedData = null) {
  // Get user ID from parameter or localStorage (custom auth system)
  const userId = customUserId || localStorage.getItem('beezee_user_id');
  if (!userId) {
    throw new Error('Not authenticated. Please log in.');
  }

  // South Africa Demo Mode Mock
  if (localStorage.getItem('beezee_za_demo_data')) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return {
      success: true,
      reportHtml: "<h1>Business Report</h1><p>Your business is performing well in our analysis.</p>",
      summary: "Your business is performing well. We've analyzed your data to provide these insights."
    };
  }

  // Use requireAuth = false because we are using custom user_id in the payload
  // and the Edge Function will use the Admin client to verify the user.
  // Pass calculatedData so AI uses the same numbers displayed on the Reports page
  return callEdgeFunction('Generate-Reports', {
    reportType,
    startDate,
    endDate,
    user_id: userId,
    calculatedData // Pass calculated values to match Reports page display
  }, false);
}

export async function askFinancialCoach(question, context = null) {
  // Get user ID from localStorage (custom auth system)
  const userId = localStorage.getItem('beezee_user_id');
  if (!userId) {
    throw new Error('Not authenticated. Please log in.');
  }

  // South Africa Demo Mode Mock
  if (localStorage.getItem('beezee_za_demo_data')) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      success: true,
      answer: "I can help you with that. Based on typical patterns in your industry, I recommend focusing on inventory turnover."
    };
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

