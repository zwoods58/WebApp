// Verify Custom OTP Code
// Verifies OTP code and creates Supabase Auth session

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  // Handle CORS preflight requests FIRST - before any other processing
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
        'Access-Control-Allow-Headers': '*',
      }
    });
  }

  try {
    const { whatsapp_number, code } = await req.json();

    if (!whatsapp_number || !code) {
      return new Response(
        JSON.stringify({ error: "WhatsApp number and code are required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Normalize phone number (remove spaces, ensure consistent format)
    const normalizedNumber = whatsapp_number.replace(/\s/g, '').trim();
    
    console.log("Verifying OTP:", { 
      whatsapp_number: normalizedNumber, 
      code,
      original: whatsapp_number 
    });

    // Verify OTP using database function
    const { data: isValid, error: verifyError } = await supabase.rpc(
      "verify_otp_code",
      {
        p_whatsapp_number: normalizedNumber,
        p_code: code.toString().trim(),
      }
    );

    if (verifyError) {
      console.error("Error verifying OTP:", verifyError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to verify OTP",
          details: verifyError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    if (!isValid) {
      // Check if OTP exists but is expired/used
      const { data: otpCheck } = await supabase
        .from("otp_codes")
        .select("*")
        .eq("whatsapp_number", normalizedNumber)
        .eq("code", code.toString().trim())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      let errorMessage = "Invalid or expired code";
      if (otpCheck) {
        if (otpCheck.used) {
          errorMessage = "This code has already been used";
        } else if (new Date(otpCheck.expires_at) < new Date()) {
          errorMessage = "This code has expired. Please request a new one.";
        }
      }

      return new Response(
        JSON.stringify({ 
          success: false,
          error: errorMessage 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Check if user exists (use normalized number)
    const { data: existingUser, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("whatsapp_number", normalizedNumber)
      .single();

    let userId;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create new user (use normalized number)
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          whatsapp_number: normalizedNumber,
          phone_number: normalizedNumber, // Store as phone for compatibility
          subscription_status: "trial",
          trial_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select("id")
        .single();

      if (createError) {
        console.error("Error creating user:", createError);
        return new Response(
          JSON.stringify({ error: "Failed to create user" }),
          { 
            status: 500, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      userId = newUser.id;
    }

    // Return success with user info
    // Note: We're using a custom auth system, not Supabase Auth
    return new Response(
      JSON.stringify({
        success: true,
        user_id: userId,
        whatsapp_number: normalizedNumber,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in verify-otp-custom:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Internal server error" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});