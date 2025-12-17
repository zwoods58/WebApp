// WhatsApp Notification Trigger Edge Function
// Sends WhatsApp notifications via Twilio/Plivo using wa.me links

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_WHATSAPP_NUMBER = Deno.env.get("TWILIO_WHATSAPP_NUMBER"); // e.g., "whatsapp:+14155238886"
const BUSINESS_WHATSAPP_NUMBER = Deno.env.get("BUSINESS_WHATSAPP_NUMBER"); // Your SA WhatsApp number
const APP_NAME = Deno.env.get("APP_NAME") || "BeeZee";
const APP_URL = Deno.env.get("APP_URL") || "https://beezee.app";

interface NotificationRequest {
  user_id?: string;
  notification_type: string;
  scheduled_for?: string;
  batch?: boolean;
}

interface MessageTemplate {
  title?: string;
  message: string;
  wa_me_link?: string;
}

serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        },
      });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Can be called by authenticated user or by service role (for cron jobs)
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    const { user_id, notification_type, scheduled_for, batch } =
      await req.json() as NotificationRequest;

    console.log(`Processing notification: ${notification_type} for ${user_id || 'batch'}`);

    let results = [];

    if (batch) {
      // Batch notifications (e.g., weekly summaries for all eligible users)
      results = await sendBatchNotifications(supabaseClient, notification_type);
    } else if (user_id) {
      // Single user notification
      const result = await sendNotification(
        supabaseClient,
        user_id,
        notification_type,
        scheduled_for
      );
      results = [result];
    } else {
      throw new Error("Either user_id or batch must be provided");
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
        results,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in notification trigger:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to send notification",
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

async function sendNotification(
  supabaseClient: any,
  userId: string,
  notificationType: string,
  scheduledFor?: string
): Promise<any> {
  try {
    // Get user data
    const { data: user, error: userError } = await supabaseClient
      .from("users")
      .select("*, notification_preferences(*)")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      throw new Error("User not found");
    }

    // Check if user has WhatsApp opted in
    if (!user.notification_preferences?.[0]?.whatsapp_opted_in) {
      console.log(`User ${userId} has not opted in to WhatsApp notifications`);
      return { success: false, reason: "not_opted_in" };
    }

    // Check notification preferences
    const prefs = user.notification_preferences[0];
    if (!shouldSendNotification(notificationType, prefs)) {
      console.log(`User ${userId} has disabled ${notificationType} notifications`);
      return { success: false, reason: "disabled_by_user" };
    }

    // Check quiet hours
    if (isQuietHours(prefs)) {
      console.log(`Skipping notification - quiet hours for user ${userId}`);
      return { success: false, reason: "quiet_hours" };
    }

    // Get user context data for personalization
    const context = await getUserContext(supabaseClient, userId);

    // Build message from template
    const template = await buildMessageTemplate(
      supabaseClient,
      notificationType,
      user,
      context
    );

    if (!template) {
      throw new Error(`No template found for ${notificationType}`);
    }

    // Create notification record
    const { data: notification, error: notifError } = await supabaseClient
      .from("notifications")
      .insert({
        user_id: userId,
        notification_type: notificationType,
        channel: "whatsapp",
        title: template.title,
        message: template.message,
        wa_me_link: template.wa_me_link,
        status: scheduledFor ? "pending" : "pending",
        scheduled_for: scheduledFor || null,
      })
      .select()
      .single();

    if (notifError) {
      throw new Error(`Failed to create notification: ${notifError.message}`);
    }

    // If scheduled, don't send now
    if (scheduledFor) {
      return {
        success: true,
        notification_id: notification.id,
        scheduled: true,
      };
    }

    // Send via Twilio WhatsApp API
    const sendResult = await sendWhatsAppMessage(
      user.whatsapp_number || user.phone_number,
      template.message,
      notification.id
    );

    // Update notification status
    await supabaseClient
      .from("notifications")
      .update({
        status: sendResult.success ? "sent" : "failed",
        sent_at: new Date().toISOString(),
        error_message: sendResult.error || null,
        twilio_sid: sendResult.sid || null,
      })
      .eq("id", notification.id);

    // Log analytics
    await supabaseClient.from("notification_analytics").insert({
      notification_id: notification.id,
      event_type: sendResult.success ? "sent" : "failed",
      event_data: sendResult,
    });

    // Update last_notification_at
    await supabaseClient
      .from("notification_preferences")
      .update({ last_notification_at: new Date().toISOString() })
      .eq("user_id", userId);

    return {
      success: sendResult.success,
      notification_id: notification.id,
      twilio_sid: sendResult.sid,
      error: sendResult.error,
    };
  } catch (error) {
    console.error(`Error sending notification to ${userId}:`, error);
    return {
      success: false,
      error: error.message,
    };
  }
}

async function sendBatchNotifications(
  supabaseClient: any,
  notificationType: string
): Promise<any[]> {
  try {
    // Get eligible users based on notification type
    const eligibleUsers = await getEligibleUsers(supabaseClient, notificationType);

    console.log(`Found ${eligibleUsers.length} eligible users for ${notificationType}`);

    const results = [];

    for (const user of eligibleUsers) {
      const result = await sendNotification(
        supabaseClient,
        user.id,
        notificationType
      );
      results.push({
        user_id: user.id,
        ...result,
      });

      // Rate limit: Wait 100ms between messages
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return results;
  } catch (error) {
    console.error("Error in batch notifications:", error);
    return [{ success: false, error: error.message }];
  }
}

async function getEligibleUsers(
  supabaseClient: any,
  notificationType: string
): Promise<any[]> {
  try {
    let query = supabaseClient
      .from("users")
      .select("*, notification_preferences(*)")
      .eq("notification_preferences.whatsapp_opted_in", true);

    // Filter based on notification type
    switch (notificationType) {
      case "trial_day_3":
        // Users who signed up 3 days ago
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        query = query
          .eq("subscription_status", "trial")
          .gte("created_at", threeDaysAgo.toISOString())
          .lt("created_at", new Date(threeDaysAgo.getTime() + 86400000).toISOString());
        break;

      case "trial_day_6":
        // Users whose trial ends tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        query = query
          .eq("subscription_status", "trial")
          .gte("trial_end_date", tomorrow.toISOString().split("T")[0])
          .lt("trial_end_date", new Date(tomorrow.getTime() + 86400000).toISOString().split("T")[0]);
        break;

      case "weekly_summary":
        // Active users with weekly_summaries enabled
        query = query
          .in("subscription_status", ["trial", "active"])
          .eq("notification_preferences.weekly_summaries", true);
        break;

      case "inactivity_nudge":
        // Users with no transactions in last 3 days
        const threeDaysAgoForInactivity = new Date();
        threeDaysAgoForInactivity.setDate(threeDaysAgoForInactivity.getDate() - 3);
        // This would need a subquery or separate logic
        break;

      case "payment_due":
        // Users whose subscription renews in 3 days
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        query = query
          .eq("subscription_status", "active")
          .gte("subscription_end_date", threeDaysFromNow.toISOString().split("T")[0])
          .lt("subscription_end_date", new Date(threeDaysFromNow.getTime() + 86400000).toISOString().split("T")[0]);
        break;

      default:
        console.log(`No specific eligibility criteria for ${notificationType}`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error getting eligible users:", error);
    return [];
  }
}

async function getUserContext(supabaseClient: any, userId: string): Promise<any> {
  try {
    // Get transaction stats
    const { data: transactions } = await supabaseClient
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    const totalIncome = transactions
      ?.filter((t: any) => t.type === "income")
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0) || 0;

    const totalExpenses = transactions
      ?.filter((t: any) => t.type === "expense")
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0) || 0;

    const profit = totalIncome - totalExpenses;

    // Get top category
    const categoryTotals: any = {};
    transactions?.forEach((t: any) => {
      if (t.type === "income") {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + parseFloat(t.amount);
      }
    });

    const topCategory = Object.entries(categoryTotals)
      .sort(([, a]: any, [, b]: any) => b - a)[0]?.[0] || "Sales";

    return {
      transaction_count: transactions?.length || 0,
      total_income: totalIncome,
      total_expenses: totalExpenses,
      profit,
      top_category: topCategory,
      recent_transactions: transactions?.slice(0, 5) || [],
    };
  } catch (error) {
    console.error("Error getting user context:", error);
    return {};
  }
}

async function buildMessageTemplate(
  supabaseClient: any,
  notificationType: string,
  user: any,
  context: any
): Promise<MessageTemplate | null> {
  const userName = user.phone_number?.slice(-4) || "there";
  const waLink = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=Hi%20${APP_NAME}%20-%20User%20ID%3A%20${user.id}`;

  const templates: Record<string, MessageTemplate> = {
    welcome: {
      title: `Welcome to ${APP_NAME}!`,
      message: `Welcome to ${APP_NAME}! 🎉\n\nYour 7-day free trial has started.\n\nQuick tips:\n- Tap the mic to record sales and expenses\n- Scan receipts with your camera\n- Ask the coach any business questions\n\nNeed help? Reply to this message anytime!`,
      wa_me_link: waLink,
    },

    trial_day_3: {
      title: "How's it going?",
      message: `Hi ${userName}! 👋\n\nYou've been using ${APP_NAME} for 3 days.\nHow's it going so far?\n\nReply:\n1 - It's great!\n2 - I'm confused about something\n3 - I need help`,
      wa_me_link: `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=Trial%20feedback%20-%20User%20ID%3A%20${user.id}%20-%20`,
    },

    trial_day_6: {
      title: "Trial ending soon",
      message: `Just a reminder: Your free trial ends tomorrow.\n\nYou've recorded R${context.total_income?.toFixed(0) || 0} in sales so far! 🎯\n\nWant to keep your business on track?\nSubscribe for only R55.50/month.\n\n${APP_URL}/subscribe`,
      wa_me_link: `${APP_URL}/subscribe`,
    },

    weekly_summary: {
      title: "Your week at a glance",
      message: `Your week at a glance:\n\n💰 Money in: R${context.total_income?.toFixed(0) || 0}\n💸 Money out: R${context.total_expenses?.toFixed(0) || 0}\n📊 Profit: R${context.profit?.toFixed(0) || 0}\n\n${APP_URL}/reports`,
      wa_me_link: `${APP_URL}/reports`,
    },

    inactivity_nudge: {
      title: "We miss you!",
      message: `Haven't seen you in a few days!\n\nDon't forget to record your sales and expenses.\nYour business needs you! 💪\n\n${APP_URL}`,
      wa_me_link: APP_URL,
    },

    milestone: {
      title: "Milestone reached!",
      message: `🎉 Amazing news!\n\nYou just recorded your ${context.transaction_count}th transaction!\nYou're building great money habits.\n\nKeep it up!`,
      wa_me_link: APP_URL,
    },

    payment_due: {
      title: "Payment reminder",
      message: `Friendly reminder:\n\nYour subscription renews in 3 days (R55.50).\n\nNo action needed if payment method is ready.\n\nQuestions? Reply here anytime.`,
      wa_me_link: waLink,
    },

    payment_failed: {
      title: "Payment failed",
      message: `Oops! We couldn't process your payment.\n\nUpdate your payment info to keep using ${APP_NAME}:\n${APP_URL}/settings/billing\n\nNeed help? We're here.`,
      wa_me_link: waLink,
    },

    payment_success: {
      title: "Payment received",
      message: `✅ Payment received - thank you!\n\nYour subscription is active for another month.\nKeep growing your business! 🚀`,
      wa_me_link: APP_URL,
    },

    report_ready: {
      title: "Report ready",
      message: `Your monthly report is ready! 📊\n\nQuick summary:\nProfit: R${context.profit?.toFixed(0) || 0}\nBest category: ${context.top_category}\n\n${APP_URL}/reports`,
      wa_me_link: `${APP_URL}/reports`,
    },

    coach_insight: {
      title: "Your coach noticed",
      message: `💡 Your coach noticed something:\n\n"${context.insight || 'Check your dashboard for insights'}"\n\nWant to discuss this?\n${APP_URL}/coach`,
      wa_me_link: `${APP_URL}/coach`,
    },
  };

  return templates[notificationType] || null;
}

async function sendWhatsAppMessage(
  toNumber: string,
  message: string,
  notificationId: string
): Promise<any> {
  try {
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_NUMBER) {
      console.log("Twilio not configured - would send:", message);
      return { success: true, sid: "test_" + notificationId };
    }

    // Format phone number for WhatsApp
    let formattedNumber = toNumber.replace(/[^\d+]/g, "");
    if (!formattedNumber.startsWith("+")) {
      formattedNumber = "+27" + formattedNumber.replace(/^0/, "");
    }
    const whatsappNumber = `whatsapp:${formattedNumber}`;

    // Twilio API call
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

    const response = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: TWILIO_WHATSAPP_NUMBER,
        To: whatsappNumber,
        Body: message,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Twilio API error");
    }

    return {
      success: true,
      sid: result.sid,
      status: result.status,
    };
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

function shouldSendNotification(notificationType: string, prefs: any): boolean {
  const prefMap: Record<string, string> = {
    weekly_summary: "weekly_summaries",
    milestone: "milestone_celebrations",
    inactivity_nudge: "inactivity_nudges",
    coach_insight: "coach_insights",
    payment_due: "payment_reminders",
    payment_failed: "payment_reminders",
  };

  const prefKey = prefMap[notificationType];
  if (!prefKey) {
    return true; // Always send if no preference setting (welcome, trial, etc.)
  }

  return prefs[prefKey] !== false;
}

function isQuietHours(prefs: any): boolean {
  try {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    const quietStart = prefs.quiet_hours_start || "21:00";
    const quietEnd = prefs.quiet_hours_end || "07:00";

    // Handle overnight quiet hours (e.g., 21:00 to 07:00)
    if (quietStart > quietEnd) {
      return currentTime >= quietStart || currentTime < quietEnd;
    }

    return currentTime >= quietStart && currentTime < quietEnd;
  } catch (error) {
    console.error("Error checking quiet hours:", error);
    return false;
  }
}