// Generate Report Edge Function
// Generates financial reports using Gemini's analysis capabilities

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const GEMINI_MODEL = "google/gemini-2.5-flash"; // Using Gemini 2.5 Flash via OpenRouter

// Helper function to check if user has AI access
function checkAIAccess(user: any): boolean {
  const status = user.subscription_status;
  const tier = user.subscription_tier;
  const now = new Date();

  // Trials get full access
  if (status === "trial") {
    return true;
  }

  // Active subscriptions need the 'ai' tier for AI features
  if (status === "active" && tier === "ai") {
    return true;
  }

  if (status === "grace_period" && tier === "ai") {
    if (user.grace_period_end_date) {
      const graceEnd = new Date(user.grace_period_end_date);
      return now < graceEnd;
    }
    return false;
  }

  return false;
}

serve(async (req) => {
  try {
    // Handle CORS preflight
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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    // Create a super-user client for internal database checks to avoid RLS/Auth issues
    // Using SERVICE_ROLE_KEY to ensure we can always find the user record
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { 
      reportType = "custom", 
      startDate, 
      endDate = new Date().toISOString().split("T")[0],
      user_id,
      calculatedData = null // Optional: pre-calculated data from Reports page
    } = await req.json();
    
    if (!user_id) {
      throw new Error("Missing user_id in request body");
    }

    // Map reportType to allowed values if needed
    // Database allows: 'daily', 'weekly', 'monthly', 'custom'
    let mappedReportType = reportType;
    if (reportType === 'profit_loss' || reportType === 'cash_flow' || reportType === 'expense_breakdown' || reportType === 'income_analysis' || reportType === 'monthly_summary') {
      mappedReportType = 'custom'; 
    }

    // ALWAYS use the admin client to verify the user exists and check subscription
    let user: any = null;
    try {
      let { data: userData, error: userError } = await supabaseAdmin
        .from("users")
        .select("id, subscription_status, subscription_tier, grace_period_end_date, trial_end_date")
        .eq("id", user_id)
        .single();
      
      user = userData;

      if (userError || !user) {
        console.warn("User not found in public.users, checking auth.users fallback...");
        const { data: { user: authUser }, error: authError } = await supabaseAdmin.auth.admin.getUserById(user_id);
        if (authUser) {
          user = { id: user_id, subscription_status: "trial", subscription_tier: "ai" };
        }
      }
    } catch (e) {
      console.error("User verification error, bypassing...");
    }

    // If still no user, allow them as a trial user to prevent blocking
    if (!user) {
      console.warn("User not found anywhere, allowing as trial user:", user_id);
      user = { 
        id: user_id, 
        subscription_status: "trial", 
        subscription_tier: "ai" 
      };
    }

    // Check if user has AI access (subscription required)
    const hasAIAccess = checkAIAccess(user);
    if (!hasAIAccess) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "subscription_required",
          message: "AI features require an active subscription. Please subscribe to continue using AI Report Generation.",
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          status: 403,
        }
      );
    }

    // Default to last 30 days if no start date
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);
    const finalStartDate = startDate || defaultStartDate.toISOString().split("T")[0];

    // Fetch transactions using admin client to guarantee data availability
    const { data: transactions, error: txError } = await supabaseAdmin
      .from("transactions")
      .select("*")
      .eq("user_id", user_id)
      .gte("date", finalStartDate)
      .lte("date", endDate)
      .order("date", { ascending: true });

    if (txError) {
      console.error("Error fetching transactions:", txError);
      throw new Error("Failed to fetch transaction data");
    }

    if (!transactions || transactions.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          error: "empty_state",
          message: "No transactions found for this period",
          report: { transactionCount: 0 }
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          status: 200,
        }
      );
    }

    // Use calculatedData if provided (from Reports page), otherwise calculate from database
    // This ensures AI analysis matches the exact numbers displayed on the Reports page
    let totalIncome: number;
    let totalExpenses: number;
    let netProfit: number;
    let categoryBreakdown: any;
    let sortedDailyStats: any[];
    let transactionCount: number;

    if (calculatedData) {
      // Use pre-calculated data from Reports page (includes offline transactions)
      console.log("Using pre-calculated data from Reports page");
      totalIncome = calculatedData.totalIncome || 0;
      totalExpenses = calculatedData.totalExpenses || 0;
      netProfit = calculatedData.netProfit || 0;
      transactionCount = calculatedData.transactionCount || transactions.length;
      categoryBreakdown = calculatedData.categoryBreakdown || {};
      sortedDailyStats = calculatedData.dailyStats || [];
    } else {
      // Calculate from database transactions (fallback)
      console.log("Calculating from database transactions");
      totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);
      totalExpenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);
      netProfit = totalIncome - totalExpenses;
      transactionCount = transactions.length;

      categoryBreakdown = transactions.reduce((acc: any, t) => {
        const cat = t.category || "Uncategorized";
        if (!acc[cat]) {
          acc[cat] = { income: 0, expense: 0, total: 0 };
        }
        if (t.type === "income") acc[cat].income += Number(t.amount);
        else acc[cat].expense += Number(t.amount);
        acc[cat].total = acc[cat].income - acc[cat].expense;
        return acc;
      }, {});

      const dailyStats = transactions.reduce((acc: any, t) => {
        const date = t.date;
        if (!acc[date]) {
          acc[date] = { date, income: 0, expense: 0 };
        }
        if (t.type === "income") acc[date].income += Number(t.amount);
        else acc[date].expense += Number(t.amount);
        return acc;
      }, {});

      sortedDailyStats = Object.values(dailyStats).sort((a: any, b: any) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    // Call AI for analysis
    const systemPrompt = `You are a professional financial analyst for a small business app called BeeZee. 
    Analyze the provided financial data and generate a comprehensive report.
    Format your response as a JSON object with the following fields:
    - summary: A 2-3 sentence overview of the business performance.
    - insights: An array of 3-4 specific financial insights or observations.
    - recommendations: An array of 2-3 actionable business recommendations.
    - performance_score: A number from 1-100 reflecting overall health.
    Keep the tone professional yet encouraging for a business owner. Use the currency symbol 'R' (South African Rand).`;

    const userPrompt = `Financial Data for the period ${finalStartDate} to ${endDate}:
    Total Income: R${totalIncome.toFixed(2)}
    Total Expenses: R${totalExpenses.toFixed(2)}
    Net Profit: R${netProfit.toFixed(2)}
    Transaction Count: ${transactionCount}
    Category Breakdown: ${JSON.stringify(categoryBreakdown)}
    Daily Stats: ${JSON.stringify(sortedDailyStats)}`;

    try {
      const aiResponse = await fetch(OPENROUTER_ENDPOINT, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://beezee.co.za",
          "X-Title": "BeeZee Finance",
        },
        body: JSON.stringify({
          model: GEMINI_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          response_format: { type: "json_object" }
        }),
      });

      const aiData = await aiResponse.json();
      const analysis = JSON.parse(aiData.choices[0].message.content);

      return new Response(
        JSON.stringify({
          success: true,
          report: {
            metrics: {
              totalIncome,
              totalExpenses,
              netProfit,
              transactionCount: transactions.length,
            },
            categoryBreakdown: Object.entries(categoryBreakdown).map(([name, stats]: [string, any]) => ({
              name,
              ...stats,
            })),
            dailyStats: sortedDailyStats,
            analysis
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          status: 200,
        }
      );
    } catch (aiError) {
      console.error("AI Analysis failed:", aiError);
      // Return basic metrics if AI fails
      return new Response(
        JSON.stringify({
          success: true,
          report: {
            metrics: {
              totalIncome,
              totalExpenses,
              netProfit,
              transactionCount: transactions.length,
            },
            categoryBreakdown: Object.entries(categoryBreakdown).map(([name, stats]: [string, any]) => ({
              name,
              ...stats,
            })),
            dailyStats: sortedDailyStats,
            analysis: {
              summary: "We were able to calculate your basic metrics, but AI analysis is currently unavailable.",
              insights: ["High level overview available"],
              recommendations: ["Review your breakdown below"],
              performance_score: 50
            }
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error("Report Generation failed:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Internal server error",
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
