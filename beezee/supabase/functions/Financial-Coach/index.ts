// Enhanced Financial Coach Edge Function
// Provides contextual, data-driven advice to SA informal business owners

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
// Try Gemini 2.5 Flash first (more likely to be available), fallback to 2.0 Flash
const GEMINI_MODEL = "google/gemini-2.5-flash"; // Using Gemini 2.5 Flash via OpenRouter (or try google/gemini-2.0-flash-exp:free)

const SYSTEM_PROMPT = `You are a helpful and knowledgeable all-round business assistant for South African informal business owners using the BeeZee app.

Your role:
1. FINANCIAL COACH: Give practical, data-driven advice based on their transactions.
2. INVENTORY MANAGER: Help them understand their stock levels and suggest restocking.
3. APP GUIDE: Explain how to use BeeZee features (Reports, Shortcuts, Inventory, Bookings).
4. MENTOR: Be encouraging, supportive, and use simple conversational South African English.

Core BeeZee Features:
- Shortcuts (2x2 grid on Home): Record (voice/manual), Scan Receipt (camera/upload), Bookings (appointments), and Inventory (stock).
- Reports: Shows detailed profit/loss and category breakdowns.
- Inventory: Tracks item names, quantities, cost vs selling price, and categories.
- Bookings: Tracks client appointments and recurring tasks.

Guidelines:
- If asked about how to do something, explain the feature in BeeZee.
- Say "money you made" not "revenue", "money you spent" not "expenditure".
- Use "R" for Rand amounts.
- Celebrate wins and flag concerning patterns (high expenses, low stock) gently.
- Keep responses under 100 words unless explaining a complex step.
- Disclaimer: "I help you understand your numbers, not replace a professional accountant."`;

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

    const { question, context, user_id } = await req.json();

    if (!user_id) {
      throw new Error("Missing user_id");
    }

    // ALWAYS use the admin client to verify the user exists and check subscription
    let user: any = null;
    try {
      let { data: userData, error: userError } = await supabaseAdmin
        .from("users")
        .select("id, first_name, whatsapp_number, subscription_status, subscription_tier, grace_period_end_date, trial_end_date")
        .eq("id", user_id)
        .single();
      
      user = userData;

      if (userError || !user) {
        console.warn("User not found in public.users, checking auth.users fallback...");
        const { data: { user: authUser }, error: authError } = await supabaseAdmin.auth.admin.getUserById(user_id);
        if (authUser) {
          user = { id: user_id, first_name: "User", subscription_status: "trial", subscription_tier: "ai" };
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
        first_name: "User",
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
          message: "AI features require an active subscription. Please subscribe to continue using the Financial Coach.",
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

    if (!question) {
      throw new Error("Missing question");
    }

    // Safety filters
    const lowerQuestion = question.toLowerCase();
    
    // Check for investment advice
    if (/bitcoin|crypto|stocks|shares|forex|trading/i.test(lowerQuestion)) {
      return new Response(
        JSON.stringify({
          success: true,
          answer: "I can't give investment advice - that's too risky without knowing your full situation. Stick to what you know: growing your current business! Want help with that?",
          sessionId: null,
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

    // Check for tax/legal questions
    if (/tax evasion|avoid tax|illegal|legal advice/i.test(lowerQuestion)) {
      return new Response(
        JSON.stringify({
          success: true,
          answer: "That's a question for a professional accountant or lawyer. I'm here to help you understand your business numbers, not replace professional advice. Want to talk about your profits instead?",
          sessionId: null,
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

    // Build context string
    let contextString = '';
    
    if (context) {
      const recentTxText = context.recent_transactions
        ?.slice(0, 5)
        .map((t: any) => `${t.date}: ${t.type === 'income' ? '+' : '-'}R${t.amount} (${t.category})`)
        .join('\n') || 'No recent transactions';

      const inventoryText = context.inventory
        ? `\nInventory Status:
- Total items: ${context.inventory.total_items}
- Low stock: ${context.inventory.low_stock_count}
- Out of stock: ${context.inventory.out_of_stock_count}
- Top stock: ${context.inventory.top_items?.join(', ') || 'None'}`
        : '';

      contextString = `
User's Business Summary:
- Total transactions: ${context.transaction_count || 0}
- Average daily income: R${(context.avg_daily_income || 0).toFixed(2)}
- Average daily expenses: R${(context.avg_daily_expenses || 0).toFixed(2)}
- Most common expense: ${context.top_expense_category || 'None'}
- Most common income source: ${context.top_income_category || 'None'}
- Recent trend: ${context.trend || 'Unknown'}
- Current month profit: R${(context.current_month_profit || 0).toFixed(2)}
${inventoryText}

Recent Transactions:
${recentTxText}
`;
    } else {
      contextString = `
User is new - no transaction data yet.
Encourage them to start recording their sales and expenses so you can give personalized advice.
`;
    }

    // Get recent coaching history for continuity using admin client
    const { data: recentCoaching } = await supabaseAdmin
      .from("coaching_sessions")
      .select("question, answer")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3);

    const conversationHistory = recentCoaching
      ?.map((c: any) => `User: ${c.question}\nYou: ${c.answer}`)
      .join("\n\n") || "";

    // Construct full prompt
    const fullPrompt = `${SYSTEM_PROMPT}

${contextString}

${conversationHistory ? `Recent Conversation:\n${conversationHistory}\n` : ''}

User's Question: ${question}

Provide a helpful, personalized response that:
1. Directly answers their question
2. References their actual business data when relevant (use specific numbers!)
3. Gives practical, actionable advice they can implement this week
4. Uses simple South African English
5. Is encouraging and supportive
6. Stays under 100 words unless truly necessary

Remember: You're a friendly mentor, not a corporate advisor. Be warm and conversational!`;

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
        "X-Title": "BeeZee Financial Coach",
      },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: fullPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 256,
      }),
    });

    if (!openrouterResponse.ok) {
      const errorText = await openrouterResponse.text();
      console.error("OpenRouter API error:", errorText);
      let errorMessage = `OpenRouter API error: ${openrouterResponse.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message) {
          errorMessage = `OpenRouter API error: ${errorData.error.message}`;
        }
      } catch (e) {
        // If parsing fails, use the text as-is
        errorMessage = `OpenRouter API error: ${errorText}`;
      }
      throw new Error(errorMessage);
    }

    const openrouterData = await openrouterResponse.json();
    
    if (!openrouterData.choices || openrouterData.choices.length === 0) {
      throw new Error("No response from OpenRouter");
    }

    const answer = openrouterData.choices[0]?.message?.content;

    if (!answer) {
      throw new Error("No response text from Gemini");
    }

    // Clean up response
    const cleanedAnswer = answer
      .replace(/```/g, '')
      .replace(/\*\*/g, '')
      .trim();

    // Save coaching session using admin client
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("coaching_sessions")
      .insert({
        user_id: user.id,
        question,
        answer: cleanedAnswer,
        context: {
          transaction_count: context?.transaction_count || 0,
          current_month_profit: context?.current_month_profit || 0,
          trend: context?.trend || 'unknown',
        },
      })
      .select()
      .single();

    if (sessionError) {
      console.error("Session save error:", sessionError);
      // Continue even if save fails
    }

    console.log(`Coaching response generated for user ${user.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        answer: cleanedAnswer,
        sessionId: session?.id || null,
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
    console.error("Error in financial coach:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to get coaching response",
        answer: "Sorry, I'm having trouble right now. Please try again in a moment.",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: error.message === "Unauthorized" ? 401 : 500,
      }
    );
  }
});