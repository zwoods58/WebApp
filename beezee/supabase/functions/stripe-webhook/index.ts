// Stripe Webhook Handler Edge Function
// Handles Stripe webhook events (payment success, subscription updates, etc.)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");

serve(async (req) => {
  try {
    if (!STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    if (!STRIPE_WEBHOOK_SECRET) {
      throw new Error("STRIPE_WEBHOOK_SECRET not configured");
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2025-11-17.clover",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("Missing stripe-signature header");
    }

    const body = await req.text();

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 400 }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(supabaseClient, session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(supabaseClient, subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancelled(supabaseClient, subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(supabaseClient, invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(supabaseClient, invoice, stripe);
        break;
      }

      case "customer.subscription.trial_will_end": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleTrialWillEnd(supabaseClient, subscription);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Webhook processing failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});

async function handleCheckoutCompleted(
  supabaseClient: any,
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.user_id;
  if (!userId) {
    console.error("No user_id in session metadata");
    return;
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
    apiVersion: "2024-11-20.acacia",
    httpClient: Stripe.createFetchHttpClient(),
  });

  // Get subscription details to check if it's in trial
  let subscription = null;
  if (session.subscription) {
    subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  }

  const isTrialing = subscription?.status === "trialing";
  const tier = subscription?.metadata?.tier || "manual";
  const trialEndDate = subscription?.trial_end
    ? new Date(subscription.trial_end * 1000).toISOString()
    : null;

  // Update payment record (pending during trial, completed after)
  await supabaseClient
    .from("subscription_payments")
    .update({
      status: isTrialing ? "pending" : "completed",
      paid_at: isTrialing ? null : new Date().toISOString(),
      payment_reference: session.id,
      metadata: {
        stripe_checkout_session_id: session.id,
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        is_trial: isTrialing,
        tier: tier,
      },
    })
    .eq("payment_reference", session.id);

  // Update user subscription status - set to trial if in trial period
  await supabaseClient
    .from("users")
    .update({
      subscription_status: isTrialing ? "trial" : "active",
      subscription_tier: tier,
      trial_end_date: trialEndDate,
      subscription_start_date: new Date().toISOString(),
    })
    .eq("id", userId);
}

async function handleSubscriptionUpdate(
  supabaseClient: any,
  subscription: Stripe.Subscription
) {
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    console.error("No user_id in subscription metadata");
    return;
  }

  // Map Stripe subscription status to our status
  let status = "trial";
  if (subscription.status === "active") {
    status = "active";
  } else if (subscription.status === "trialing") {
    status = "trial";
  } else if (subscription.status === "canceled" || subscription.status === "unpaid") {
    status = "cancelled";
  } else if (subscription.status === "past_due") {
    // Past due means payment failed but still in grace period
    status = "grace_period";
  }

  const trialEndDate = subscription.trial_end
    ? new Date(subscription.trial_end * 1000).toISOString()
    : null;

  const tier = subscription.metadata?.tier;

  const updateData: any = {
    subscription_status: status,
    trial_end_date: trialEndDate,
    subscription_end_date: subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : null,
  };

  if (tier) {
    updateData.subscription_tier = tier;
  }

  await supabaseClient
    .from("users")
    .update(updateData)
    .eq("id", userId);
}

async function handleSubscriptionCancelled(
  supabaseClient: any,
  subscription: Stripe.Subscription
) {
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    console.error("No user_id in subscription metadata");
    return;
  }

  await supabaseClient
    .from("users")
    .update({
      subscription_status: "cancelled",
    })
    .eq("id", userId);
}

async function handlePaymentSucceeded(
  supabaseClient: any,
  invoice: Stripe.Invoice
) {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;

  // Get subscription to find user_id
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
    apiVersion: "2025-11-17.clover",
    httpClient: Stripe.createFetchHttpClient(),
  });

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata?.user_id;
  if (!userId) return;

  // Skip if this is a $0 invoice (trial period)
  if (invoice.amount_paid === 0) {
    console.log("Skipping $0 invoice (trial period)");
    return;
  }

  // Record payment
  await supabaseClient
    .from("subscription_payments")
    .insert({
      user_id: userId,
      amount: (invoice.amount_paid / 100).toFixed(2),
      currency: invoice.currency.toUpperCase(),
      payment_gateway: "stripe",
      payment_reference: invoice.id,
      status: "completed",
      paid_at: new Date(invoice.status_transitions.paid_at * 1000).toISOString(),
      metadata: {
        stripe_invoice_id: invoice.id,
        stripe_subscription_id: subscriptionId,
      },
    });

  // Update user subscription status to active (payment succeeded, reactivate AI features)
  await supabaseClient
    .from("users")
    .update({
      subscription_status: "active",
      last_payment_at: new Date().toISOString(),
      grace_period_end_date: null, // Clear grace period
      trial_end_date: null, // Clear trial end date after first payment
    })
    .eq("id", userId);
}

async function handlePaymentFailed(
  supabaseClient: any,
  invoice: Stripe.Invoice,
  stripe: Stripe
) {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata?.user_id;
  if (!userId) return;

  // Record failed payment
  await supabaseClient
    .from("subscription_payments")
    .insert({
      user_id: userId,
      amount: (invoice.amount_due / 100).toFixed(2),
      currency: invoice.currency.toUpperCase(),
      payment_gateway: "stripe",
      payment_reference: invoice.id,
      status: "failed",
      failure_reason: invoice.last_payment_error?.message || "Payment failed",
      metadata: {
        stripe_invoice_id: invoice.id,
        stripe_subscription_id: subscriptionId,
      },
    });

  // Set grace period: 2 days from now
  const gracePeriodEnd = new Date();
  gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 2);

  // Update user to grace_period status (AI features still work for 2 days)
  await supabaseClient
    .from("users")
    .update({
      subscription_status: "grace_period",
      grace_period_end_date: gracePeriodEnd.toISOString(),
    })
    .eq("id", userId);

  // Create notification for failed payment
  await supabaseClient
    .from("notifications")
    .insert({
      user_id: userId,
      type: "payment_failed",
      title: "Payment Failed",
      message: `Your subscription payment failed. You have 2 days to update your payment method before AI features are disabled.`,
      priority: "high",
    });
}

async function handleTrialWillEnd(
  supabaseClient: any,
  subscription: Stripe.Subscription
) {
  const userId = subscription.metadata?.user_id;
  if (!userId) return;

  // Create notification that trial is ending soon
  await supabaseClient
    .from("notifications")
    .insert({
      user_id: userId,
      type: "trial_ending",
      title: "Trial Ending Soon",
      message: `Your 7-day free trial ends in 3 days. Your subscription will automatically renew.`,
      priority: "normal",
    });
}


