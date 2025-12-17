// Create Notification Edge Function
// Creates in-app notifications with wa.me support links

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// For testing: Allow any number or use default
const WHATSAPP_NUMBER = Deno.env.get("WHATSAPP_BUSINESS_NUMBER") || null;

serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { userId, type, data = {} } = await req.json();

    if (!userId || !type) {
      throw new Error("Missing userId or type");
    }

    // Fetch user context for personalization
    const { data: profile, error: profileError } = await supabaseClient
      .from("users")
      .select("id, first_name, trial_end_date, subscription_status")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      throw new Error("User not found");
    }

    // Fetch user stats for dynamic content
    const { data: transactions } = await supabaseClient
      .from("transactions")
      .select("amount, type")
      .eq("user_id", userId);

    const stats = {
      transaction_count: transactions?.length || 0,
      total_amount: transactions?.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0) || 0,
    };

    let notification: any = {
      user_id: userId,
      type: type,
      created_at: new Date().toISOString(),
    };

    // Build notification based on type
    switch (type) {
      case "trial_day_3": {
        notification = {
          ...notification,
          title: `👋 Hey ${profile.first_name || "there"}!`,
          message: `You've been using the app for 3 days! Recorded ${stats.transaction_count} transactions so far.`,
          action_label: "View My Progress",
          action_url: "/reports",
          whatsapp_help_label: "Need help?",
          whatsapp_help_text: `Hi, I'm on day 3 of my trial and need some guidance. User ID: ${userId}`,
          priority: "normal",
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
        break;
      }

      case "trial_ending": {
        const trialEnd = new Date(profile.trial_end_date);
        const now = new Date();
        const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

        notification = {
          ...notification,
          title: `⏰ ${daysLeft} day${daysLeft === 1 ? "" : "s"} left`,
          message: `Your free trial ends ${daysLeft === 1 ? "tomorrow" : `in ${daysLeft} days`}. You've tracked R${stats.total_amount.toFixed(2)} so far!`,
          action_label: "Subscribe Now (R55.50/month)",
          action_url: "/settings/subscription",
          whatsapp_help_label: "Questions first?",
          whatsapp_help_text: `Hi, I have questions about subscribing. User ID: ${userId}`,
          priority: "high",
          expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        };
        break;
      }

      case "payment_due": {
        notification = {
          ...notification,
          title: "💳 Payment due soon",
          message: "Your subscription renews in 3 days (R55.50). Make sure your payment method is ready.",
          action_label: "Update Payment Method",
          action_url: "/settings/payment",
          whatsapp_help_label: "Payment questions?",
          whatsapp_help_text: `I have questions about my upcoming payment. User: ${userId}`,
          priority: "normal",
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
        break;
      }

      case "payment_failed": {
        notification = {
          ...notification,
          title: "⚠️ Payment couldn't be processed",
          message: "We couldn't process your payment. Update your payment info to keep using the app.",
          action_label: "Update Payment Now",
          action_url: "/settings/payment",
          whatsapp_help_label: "Need payment help?",
          whatsapp_help_text: `My payment failed and I need help fixing it. User: ${userId}`,
          priority: "high",
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
        break;
      }

      case "milestone": {
        const count = data.transactionCount || stats.transaction_count;
        notification = {
          ...notification,
          title: "🎉 Milestone reached!",
          message: `You just recorded your ${count}th transaction! You're building great money habits.`,
          whatsapp_help_label: "Share your achievement",
          whatsapp_help_text: `I just hit ${count} transactions tracking my business! 🎉`,
          priority: "low",
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
        break;
      }

      case "weekly_summary": {
        notification = {
          ...notification,
          title: "📊 Weekly report ready",
          message: `This week: Made R${(data.income || 0).toFixed(2)}, Spent R${(data.expenses || 0).toFixed(2)}. Profit: R${(data.profit || 0).toFixed(2)}`,
          action_label: "View Full Report",
          action_url: "/reports",
          whatsapp_help_label: "Share this week",
          whatsapp_help_text: `Check out my weekly business report! Profit: R${(data.profit || 0).toFixed(2)}`,
          priority: "normal",
          expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        };
        break;
      }

      case "insight": {
        notification = {
          ...notification,
          title: "💡 Your coach noticed something",
          message: data.message || "Your coach has an insight for you. Check it out!",
          action_label: "Chat with Coach",
          action_url: "/coach",
          whatsapp_help_label: "Get personal advice",
          whatsapp_help_text: `I saw the insight about my business. Can we discuss? User: ${userId}`,
          priority: "normal",
          expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        };
        break;
      }

      default:
        throw new Error(`Unknown notification type: ${type}`);
    }

    // Check user preferences before creating notification
    const { data: preferences } = await supabaseClient
      .from("notification_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    // Skip if user has disabled this notification type
    if (preferences) {
      const preferenceMap: Record<string, keyof typeof preferences> = {
        trial_day_3: "trial_reminders",
        trial_ending: "trial_reminders",
        payment_due: "payment_reminders",
        payment_failed: "payment_reminders",
        milestone: "milestone_celebrations",
        weekly_summary: "weekly_summaries",
        insight: "insights",
      };

      const preferenceKey = preferenceMap[type];
      if (preferenceKey && preferences[preferenceKey] === false) {
        return new Response(
          JSON.stringify({ success: false, message: "User has disabled this notification type" }),
          {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            status: 200,
          }
        );
      }
    }

    // Insert notification
    const { data: inserted, error } = await supabaseClient
      .from("notifications")
      .insert(notification)
      .select()
      .single();

    if (error) throw error;

    console.log(`Notification created: ${type} for user ${userId}`);

    return new Response(
      JSON.stringify({ success: true, notification: inserted }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating notification:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to create notification",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 500,
      }
    );
  }
});