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

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { 
      reportType = "custom", 
      startDate, 
      endDate = new Date().toISOString().split("T")[0],
      user_id
    } = await req.json();
    
    // Map reportType to allowed values if needed
    // Database allows: 'daily', 'weekly', 'monthly', 'custom'
    let mappedReportType = reportType;
    if (reportType === 'profit_loss' || reportType === 'cash_flow' || reportType === 'expense_breakdown' || reportType === 'income_analysis' || reportType === 'monthly_summary') {
      mappedReportType = 'custom'; // Map all custom report types to 'custom'
    }

    if (!user_id) {
      throw new Error("Missing user_id");
    }

    // Verify user exists and check subscription (custom auth system - not Supabase Auth)
    const { data: user, error: userError } = await supabaseClient
      .from("users")
      .select("id, subscription_status, subscription_tier, grace_period_end_date, trial_end_date")
      .eq("id", user_id)
      .single();

    if (userError || !user) {
      throw new Error("Unauthorized - User not found");
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

    // Fetch transactions for the date range
    const { data: transactions, error: txError } = await supabaseClient
      .from("transactions")
      .select("*")
      .eq("user_id", user_id)
      .gte("date", finalStartDate)
      .lte("date", endDate)
      .order("date", { ascending: true });

    if (txError) {
      throw txError;
    }

    if (!transactions || transactions.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No transactions found for the selected period",
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

    // Calculate basic metrics
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const netProfit = totalIncome - totalExpenses;

    // Group by category
    const categoryBreakdown = transactions.reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { type: t.type, total: 0, count: 0 };
      }
      acc[t.category].total += parseFloat(t.amount);
      acc[t.category].count += 1;
      return acc;
    }, {});

    // Prepare data for Gemini analysis
    const prompt = `
You are a financial advisor for South African informal business owners. Analyze the following transaction data and provide insights.

Period: ${finalStartDate} to ${endDate}
Total Income: R${totalIncome.toFixed(2)}
Total Expenses: R${totalExpenses.toFixed(2)}
Net Profit: R${netProfit.toFixed(2)}

Category Breakdown:
${Object.entries(categoryBreakdown)
  .map(([cat, data]: [string, any]) => `${cat} (${data.type}): R${data.total.toFixed(2)} (${data.count} transactions)`)
  .join("\n")}

Provide a comprehensive analysis including:
1. Overall financial health assessment
2. Top expense categories and recommendations
3. Income trends and opportunities
4. Cash flow observations
5. 3-5 actionable recommendations

Return a JSON object:
{
  "summary": "<brief summary>",
  "health_score": <0-100>,
  "insights": ["<insight 1>", "<insight 2>", ...],
  "recommendations": ["<rec 1>", "<rec 2>", ...],
  "warnings": ["<warning 1>", ...] or []
}
`;

    // Call OpenRouter API (Gemini 3 Flash)
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY not configured");
    }

    const openrouterResponse = await fetch(OPENROUTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": Deno.env.get("SUPABASE_URL") || "",
        "X-Title": "BeeZee Report Generator",
      },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!openrouterResponse.ok) {
      const errorText = await openrouterResponse.text();
      console.error("OpenRouter API error:", errorText);
      throw new Error(`OpenRouter API error: ${openrouterResponse.statusText}`);
    }

    const openrouterData = await openrouterResponse.json();
    const responseText = openrouterData.choices[0]?.message?.content;

    // Parse AI insights
    const jsonMatch = responseText?.match(/\{[\s\S]*\}/);
    const aiInsights = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    // Construct report data
    const reportData = {
      period: {
        start: finalStartDate,
        end: endDate,
      },
      metrics: {
        totalIncome,
        totalExpenses,
        netProfit,
        profitMargin: totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(2) : 0,
        transactionCount: transactions.length,
      },
      categoryBreakdown,
      aiInsights,
      generatedAt: new Date().toISOString(),
    };

    // Save report to database
    const { data: report, error: reportError } = await supabaseClient
      .from("reports")
      .insert({
        user_id: user_id,
        report_type: mappedReportType,
        start_date: finalStartDate,
        end_date: endDate,
        report_data: reportData,
      })
      .select()
      .single();

    if (reportError) {
      throw reportError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        report: reportData,
        reportId: report.id,
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
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 400,
      }
    );
  }
});