// Cron Job Handler for Scheduled Notifications
// Runs daily to send batch notifications

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const CRON_SECRET = Deno.env.get("CRON_SECRET"); // Protect cron endpoint

serve(async (req) => {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "" // Use service role for cron
    );

    const { job_type } = await req.json();

    console.log(`Running cron job: ${job_type}`);

    const results = [];

    switch (job_type) {
      case "weekly_summary":
        // Run every Sunday at 8am
        results.push(await sendWeeklySummaries(supabaseClient));
        break;

      case "trial_day_3":
        // Check daily for users on day 3 of trial
        results.push(await sendTrialDay3Checkups(supabaseClient));
        break;

      case "trial_day_6":
        // Check daily for users with trial ending tomorrow
        results.push(await sendTrialEndingReminders(supabaseClient));
        break;

      case "payment_due":
        // Check daily for subscriptions renewing in 3 days
        results.push(await sendPaymentReminders(supabaseClient));
        break;

      case "inactivity_nudge":
        // Check daily for inactive users
        results.push(await sendInactivityNudges(supabaseClient));
        break;

      case "cleanup":
        // Clean up old notifications
        results.push(await cleanupOldNotifications(supabaseClient));
        break;

      default:
        throw new Error(`Unknown job type: ${job_type}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        job_type,
        results,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Cron job error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});

async function sendWeeklySummaries(supabaseClient: any) {
  try {
    // Get eligible users for weekly summaries
    const { data: users } = await supabaseClient
      .from("users")
      .select("id")
      .in("subscription_status", ["trial", "active"]);

    if (!users || users.length === 0) {
      return { job: "weekly_summary", success: true, sent: 0, failed: 0 };
    }

    let sent = 0;
    let failed = 0;

    for (const user of users) {
      // Get weekly stats
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data: transactions } = await supabaseClient
        .from("transactions")
        .select("amount, type")
        .eq("user_id", user.id)
        .gte("date", weekAgo.toISOString().split("T")[0]);

      const income = transactions?.filter((t: any) => t.type === "income")
        .reduce((sum: number, t: any) => sum + parseFloat(t.amount || 0), 0) || 0;
      const expenses = transactions?.filter((t: any) => t.type === "expense")
        .reduce((sum: number, t: any) => sum + parseFloat(t.amount || 0), 0) || 0;
      const profit = income - expenses;

      // Create in-app notification
      const { error } = await supabaseClient.functions.invoke(
        "create-notifications",
        {
          body: {
            userId: user.id,
            type: "weekly_summary",
            data: { income, expenses, profit },
          },
        }
      );

      if (error) {
        failed++;
      } else {
        sent++;
      }
    }

    console.log(`Weekly summaries: ${sent} sent, ${failed} failed`);

    return { job: "weekly_summary", success: true, sent, failed };
  } catch (error) {
    console.error("Error sending weekly summaries:", error);
    return { job: "weekly_summary", success: false, error: error.message };
  }
}

async function sendTrialDay3Checkups(supabaseClient: any) {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const { data: users } = await supabaseClient
      .from("users")
      .select("id")
      .eq("subscription_status", "trial")
      .gte("created_at", threeDaysAgo.toISOString())
      .lt("created_at", new Date(threeDaysAgo.getTime() + 86400000).toISOString());

    if (!users || users.length === 0) {
      return { job: "trial_day_3", success: true, sent: 0, failed: 0 };
    }

    let sent = 0;
    let failed = 0;

    for (const user of users) {
      const { error } = await supabaseClient.functions.invoke(
        "create-notifications",
        {
          body: {
            userId: user.id,
            type: "trial_day_3",
          },
        }
      );

      if (error) {
        failed++;
      } else {
        sent++;
      }
    }

    console.log(`Trial day 3 checkups: ${sent} sent, ${failed} failed`);

    return { job: "trial_day_3", success: true, sent, failed };
  } catch (error) {
    console.error("Error sending trial day 3 checkups:", error);
    return { job: "trial_day_3", success: false, error: error.message };
  }
}

async function sendTrialEndingReminders(supabaseClient: any) {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: users } = await supabaseClient
      .from("users")
      .select("id")
      .eq("subscription_status", "trial")
      .gte("trial_end_date", tomorrow.toISOString().split("T")[0])
      .lt("trial_end_date", new Date(tomorrow.getTime() + 86400000).toISOString().split("T")[0]);

    if (!users || users.length === 0) {
      return { job: "trial_day_6", success: true, sent: 0, failed: 0 };
    }

    let sent = 0;
    let failed = 0;

    for (const user of users) {
      const { error } = await supabaseClient.functions.invoke(
        "create-notifications",
        {
          body: {
            userId: user.id,
            type: "trial_ending",
          },
        }
      );

      if (error) {
        failed++;
      } else {
        sent++;
      }
    }

    console.log(`Trial ending reminders: ${sent} sent, ${failed} failed`);

    return { job: "trial_day_6", success: true, sent, failed };
  } catch (error) {
    console.error("Error sending trial ending reminders:", error);
    return { job: "trial_day_6", success: false, error: error.message };
  }
}

async function sendPaymentReminders(supabaseClient: any) {
  try {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const { data: users } = await supabaseClient
      .from("users")
      .select("id")
      .eq("subscription_status", "active")
      .gte("subscription_end_date", threeDaysFromNow.toISOString().split("T")[0])
      .lt("subscription_end_date", new Date(threeDaysFromNow.getTime() + 86400000).toISOString().split("T")[0]);

    if (!users || users.length === 0) {
      return { job: "payment_due", success: true, sent: 0, failed: 0 };
    }

    let sent = 0;
    let failed = 0;

    for (const user of users) {
      const { error } = await supabaseClient.functions.invoke(
        "create-notifications",
        {
          body: {
            userId: user.id,
            type: "payment_due",
          },
        }
      );

      if (error) {
        failed++;
      } else {
        sent++;
      }
    }

    console.log(`Payment reminders: ${sent} sent, ${failed} failed`);

    return { job: "payment_due", success: true, sent, failed };
  } catch (error) {
    console.error("Error sending payment reminders:", error);
    return { job: "payment_due", success: false, error: error.message };
  }
}

async function sendInactivityNudges(supabaseClient: any) {
  try {
    // Get users with no transactions in last 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const { data: inactiveUsers, error: queryError } = await supabaseClient
      .from("users")
      .select(`
        id,
        notification_preferences!inner(
          whatsapp_opted_in,
          inactivity_nudges
        )
      `)
      .eq("notification_preferences.whatsapp_opted_in", true)
      .eq("notification_preferences.inactivity_nudges", true)
      .in("subscription_status", ["trial", "active"]);

    if (queryError) throw queryError;

    let sent = 0;
    let failed = 0;

    for (const user of inactiveUsers || []) {
      // Check if user has transactions in last 3 days
      const { data: recentTransactions } = await supabaseClient
        .from("transactions")
        .select("id")
        .eq("user_id", user.id)
        .gte("created_at", threeDaysAgo.toISOString())
        .limit(1);

      if (!recentTransactions || recentTransactions.length === 0) {
        // User is inactive, create notification
        const { error } = await supabaseClient.functions.invoke(
          "create-notifications",
          {
            body: {
              userId: user.id,
              type: "inactivity_nudge",
            },
          }
        );

        if (error) {
          failed++;
        } else {
          sent++;
        }

        // Rate limit
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    console.log(`Inactivity nudges: ${sent} sent, ${failed} failed`);

    return { job: "inactivity_nudge", success: true, sent, failed };
  } catch (error) {
    console.error("Error sending inactivity nudges:", error);
    return { job: "inactivity_nudge", success: false, error: error.message };
  }
}

async function cleanupOldNotifications(supabaseClient: any) {
  try {
    // Delete notifications older than 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { data, error } = await supabaseClient
      .from("notifications")
      .delete()
      .lt("created_at", ninetyDaysAgo.toISOString());

    if (error) throw error;

    console.log(`Cleanup: Deleted old notifications`);

    return { job: "cleanup", success: true, deleted: data?.length || 0 };
  } catch (error) {
    console.error("Error cleaning up notifications:", error);
    return { job: "cleanup", success: false, error: error.message };
  }
}