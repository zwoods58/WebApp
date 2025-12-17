// Send OTP Code
// Generates OTP code and returns it for in-app display (no WhatsApp link needed)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const WHATSAPP_NUMBER = Deno.env.get("WHATSAPP_BUSINESS_NUMBER") || null;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

serve(async (req) => {
  // Handle CORS preflight requests FIRST - before any other processing
  if (req.method === "OPTIONS") {
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
    const { whatsapp_number } = await req.json();

    if (!whatsapp_number) {
      return new Response(
        JSON.stringify({ error: "WhatsApp number is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Normalize phone number (remove spaces, ensure consistent format)
    const normalizedNumber = whatsapp_number.replace(/\s/g, '').trim();
    
    console.log("Generating OTP for:", { 
      original: whatsapp_number, 
      normalized: normalizedNumber 
    });

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes (reduced from 10)

    // Store OTP in database (use normalized number)
    const { error: insertError } = await supabase
      .from("otp_codes")
      .insert({
        whatsapp_number: normalizedNumber,
        code: otpCode,
        expires_at: expiresAt.toISOString(),
        used: false,
      });

    if (insertError) {
      console.error("Error storing OTP:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to generate OTP" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        otp_code: otpCode, // Return code for in-app display
        expires_in: 300, // 5 minutes in seconds (reduced from 10)
        message: "OTP code generated. Your code is displayed below.",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-otp-whatsapp:", error);
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