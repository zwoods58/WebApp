// Enhanced Financial Coach Edge Function
// Provides contextual, data-driven advice to SA informal business owners

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
// Try Gemini 2.5 Flash first (more likely to be available), fallback to 2.0 Flash
const GEMINI_MODEL = "google/gemini-2.5-flash"; // Using Gemini 2.5 Flash via OpenRouter (or try google/gemini-2.0-flash-exp:free)

const SYSTEM_PROMPT = `You are a financial coach for South African informal business owners.

Your role:
- Give practical, specific advice based on THEIR actual transaction data
- Use simple, conversational South African English
- Be encouraging and supportive like a mentor
- Suggest realistic actions they can take this week
- Flag concerning patterns gently
- Celebrate improvements enthusiastically
- Reference their actual numbers and categories

Language guidelines:
- Say "money you made" not "revenue"
- Say "money you spent" not "expenditure"  
- Say "profit" not "net income"
- Use "R" for Rand amounts
- Be conversational: "Well done!", "Let's look at...", "I noticed..."
- Use emojis sparingly but appropriately (👍 😊 💰 📈 ⚠️)

Response format:
- Keep responses under 100 words unless complex explanation needed
- Start with a direct answer to their question
- Reference their actual data with specific numbers
- Give 1-2 actionable suggestions
- End with encouragement

Safety guidelines:
- Never give specific investment advice (stocks, crypto, etc.)
- Don't comment on politics or macroeconomic policy
- For tax, legal, or debt issues, suggest professional help
- Don't make promises or guarantees
- Disclaim: "I help you understand your numbers, not replace a professional accountant"

Cultural awareness:
- Understand cash-based informal economy
- Recognize seasonal income fluctuations
- Be sensitive to economic challenges in SA
- Celebrate small wins - every rand counts
- Use South African context and examples`;

// Helper function to check if user has AI access
function checkAIAccess(user: any): boolean {
  const status = user.subscription_status;
  const now = new Date();

  // Allow if trial or active
  if (status === "trial" || status === "active") {
    return true;
  }

  // Allow if grace_period and grace period hasn't ended
  if (status === "grace_period") {
    if (user.grace_period_end_date) {
      const graceEnd = new Date(user.grace_period_end_date);
      return now < graceEnd;
    }
    // If no end date, assume expired
    return false;
  }

  // Block for cancelled, expired, or null
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

    const { question, context, user_id } = await req.json();

    if (!user_id) {
      throw new Error("Missing user_id");
    }

    // Verify user exists and check subscription (custom auth system - not Supabase Auth)
    const { data: user, error: userError } = await supabaseClient
      .from("users")
      .select("id, first_name, whatsapp_number, subscription_status, grace_period_end_date, trial_end_date")
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

      contextString = `
User's Business Summary:
- Total transactions: ${context.transaction_count || 0}
- Average daily income: R${(context.avg_daily_income || 0).toFixed(2)}
- Average daily expenses: R${(context.avg_daily_expenses || 0).toFixed(2)}
- Most common expense: ${context.top_expense_category || 'None'}
- Most common income source: ${context.top_income_category || 'None'}
- Recent trend: ${context.trend || 'Unknown'}
- Current month profit: R${(context.current_month_profit || 0).toFixed(2)}

Recent Transactions:
${recentTxText}
`;
    } else {
      contextString = `
User is new - no transaction data yet.
Encourage them to start recording their sales and expenses so you can give personalized advice.
`;
    }

    // Get recent coaching history for continuity
    const { data: recentCoaching } = await supabaseClient
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

    // Save coaching session
    const { data: session, error: sessionError } = await supabaseClient
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