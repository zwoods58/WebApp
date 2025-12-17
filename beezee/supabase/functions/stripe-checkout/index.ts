// Stripe Checkout Session Creation Edge Function
// Creates a Stripe checkout session for subscription payments

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const STRIPE_PUBLISHABLE_KEY = Deno.env.get("STRIPE_PUBLISHABLE_KEY");
const STRIPE_PRODUCT_ID = Deno.env.get("STRIPE_PRODUCT_ID");
const STRIPE_PRICE_ID = Deno.env.get("STRIPE_PRICE_ID");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Max-Age": "86400",
};

interface CheckoutRequest {
  user_id: string;
  tier: "manual" | "ai";
  success_url?: string;
  cancel_url?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (!STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    if (!STRIPE_PRODUCT_ID || !STRIPE_PRICE_ID) {
      throw new Error("STRIPE_PRODUCT_ID or STRIPE_PRICE_ID not configured");
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2025-11-17.clover",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const { user_id, tier, success_url, cancel_url }: CheckoutRequest = await req.json();

    if (!user_id) {
      throw new Error("user_id is required");
    }

    if (!tier || !["manual", "ai"].includes(tier)) {
      throw new Error("Valid subscription tier is required");
    }

    // Map tier to price ID
    const priceId = tier === "ai" 
      ? Deno.env.get("STRIPE_PRICE_ID_AI") || Deno.env.get("STRIPE_PRICE_ID")
      : Deno.env.get("STRIPE_PRICE_ID_MANUAL");

    if (!priceId) {
      throw new Error(`Stripe Price ID for tier '${tier}' not configured`);
    }

    // Get user data from Supabase
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data: user, error: userError } = await supabaseClient
      .from("users")
      .select("id, first_name, business_name, whatsapp_number")
      .eq("id", user_id)
      .single();

    if (userError || !user) {
      throw new Error(`User not found: ${userError?.message || "No user"}`);
    }

    // Create Stripe customer if doesn't exist
    // Check if user has stripe_customer_id in metadata
    let customerId: string | null = null;

    // For now, create a new customer each time (you can optimize this later)
    const customer = await stripe.customers.create({
      email: user.whatsapp_number ? `${user.whatsapp_number}@beezee.app` : undefined,
      name: user.first_name || user.business_name || "BeeZee User",
      metadata: {
        user_id: user.id,
        whatsapp_number: user.whatsapp_number || "",
      },
    });

    customerId = customer.id;

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: success_url || `${SUPABASE_URL.replace("/rest/v1", "")}/dashboard?payment=success`,
      cancel_url: cancel_url || `${SUPABASE_URL.replace("/rest/v1", "")}/dashboard?payment=cancelled`,
      metadata: {
        user_id: user.id,
        tier: tier,
      },
      subscription_data: {
        trial_period_days: 7, // 7-day free trial
        metadata: {
          user_id: user.id,
          tier: tier,
        },
      },
    });

    // Store checkout session in database
    await supabaseClient
      .from("subscription_payments")
      .insert({
        user_id: user.id,
        amount: tier === "ai" ? 3.00 : 1.00,
        currency: "USD",
        payment_gateway: "stripe",
        payment_reference: session.id,
        status: "pending",
        metadata: {
          stripe_checkout_session_id: session.id,
          stripe_customer_id: customerId,
          tier: tier,
        },
      });

    return new Response(
      JSON.stringify({
        success: true,
        session_id: session.id,
        url: session.url,
        customer_id: customerId,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to create checkout session",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
        status: error.status || 500,
      }
    );
  }
});

