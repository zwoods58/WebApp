// Enhanced Voice to Transaction Edge Function
// Optimized for South African informal business owners with low literacy

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const GEMINI_MODEL = "google/gemini-2.5-flash"; // Using Gemini 2.5 Flash via OpenRouter

// South African business terms mapping
const SA_TERMS_MAP = {
  "spaza": { category: "Stock", type: "expense" },
  "taxi": { category: "Transport", type: "expense" },
  "airtime": { category: "Airtime", type: "expense" },
  "electricity": { category: "Electricity", type: "expense" },
  "lights": { category: "Electricity", type: "expense" },
  "prepaid": { category: "Electricity", type: "expense" },
  "stock": { category: "Stock", type: "expense" },
  "rent": { category: "Rent", type: "expense" },
  "sold": { category: "Sales", type: "income" },
  "sales": { category: "Sales", type: "income" },
  "payment": { category: "Sales", type: "income" },
};

// South African currency patterns
const CURRENCY_PATTERNS = [
  /(\d+)\s*rand/i,
  /R\s*(\d+)/i,
  /(\d+)\s*R/i,
  /(\d+[-,]\d+)/i, // Handle "one-fifty" or "1,50"
];

interface TransactionData {
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string;
  confidence: number;
}

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

    // Get JWT token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Parse request body
    const { audioBase64, language = "en", user_id } = await req.json();

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
          message: "AI features require an active subscription. Please subscribe to continue using Voice Transactions.",
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

    if (!audioBase64) {
      throw new Error("Missing audio data");
    }

    // Enhanced prompt for South African context
    const prompt = `You are a financial assistant for South African informal business owners with varying literacy levels.

IMPORTANT CONTEXT:
- Users may speak in South African English, Afrikaans, or mix languages
- Common terms: spaza (small shop), taxi (minibus taxi), airtime (phone credit), electricity/lights (prepaid power)
- Currency: South African Rand (R or "rand")
- Users may say amounts like "fifty rand", "150 rand", "one-fifty", "R100"

TASK:
Listen to this voice recording and extract transaction information.

Extract the following:
1. AMOUNT: Convert spoken numbers to digits. Examples:
   - "fifty rand" → 50
   - "one-fifty" → 150
   - "R200" → 200
   - "two hundred" → 200

2. TYPE: 
   - "income" if: sold, received, payment, customer paid, got paid, earned
   - "expense" if: bought, paid, spent, purchased, cost

3. CATEGORY (use these EXACT categories):
   - Sales (for income from selling)
   - Transport (taxi, petrol, bus)
   - Stock (inventory, goods to sell)
   - Airtime (phone credit, data)
   - Rent (shop rent, storage)
   - Electricity (prepaid, lights)
   - Food (groceries, eating)
   - Other (if unclear)

4. DESCRIPTION: Keep the user's own words, clean and simple

5. CONFIDENCE: 
   - "high" (0.8-1.0): Clear audio, clear amount and purpose
   - "medium" (0.6-0.79): Somewhat clear but minor uncertainties
   - "low" (0.0-0.59): Unclear audio, guessing needed

EXAMPLES:
"Sold fifty rand airtime" → {"amount": 50, "type": "income", "category": "Sales", "description": "Sold airtime", "confidence": 0.9}
"Bought stock for two hundred rand" → {"amount": 200, "type": "expense", "category": "Stock", "description": "Bought stock", "confidence": 0.9}
"Taxi fare thirty rand" → {"amount": 30, "type": "expense", "category": "Transport", "description": "Taxi fare", "confidence": 0.85}
"Paid 150 for electricity" → {"amount": 150, "type": "expense", "category": "Electricity", "description": "Paid for electricity", "confidence": 0.9}

If audio is unclear or you're unsure, still make your best guess but set confidence to "low".
If you hear background noise or can't understand, return confidence 0.3 or lower.

Return ONLY valid JSON (no markdown, no code blocks):
{
  "amount": <number>,
  "type": "income" | "expense",
  "category": "<exact category from list>",
  "description": "<simple description>",
  "confidence": <0.0 to 1.0>
}`;

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
        "X-Title": "BeeZee Voice Transaction",
      },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "input_audio",
                input_audio: {
                  data: audioBase64,
                  format: "wav",
                },
              },
            ],
          },
        ],
        temperature: 0.1,
        max_tokens: 256,
      }),
    });

    if (!openrouterResponse.ok) {
      const errorText = await openrouterResponse.text();
      console.error("OpenRouter API error:", errorText);
      throw new Error(`OpenRouter API error: ${openrouterResponse.statusText}`);
    }

    const openrouterData = await openrouterResponse.json();
    
    if (!openrouterData.choices || openrouterData.choices.length === 0) {
      throw new Error("No response from OpenRouter");
    }

    const responseText = openrouterData.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("No response text from OpenRouter");
    }

    console.log("Gemini response:", responseText);

    // Parse JSON from response (handle markdown code blocks)
    let transactionData: TransactionData;
    
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      transactionData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Raw response:", responseText);
      throw new Error("Could not parse transaction data from response");
    }

    // Validate and normalize data
    if (!transactionData.amount || isNaN(transactionData.amount)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Could not understand the amount. Please try again.",
          confidence: 0,
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

    // Normalize confidence to 0-1 range
    let confidence = transactionData.confidence;
    if (typeof confidence === "string") {
      const confidenceMap: { [key: string]: number } = {
        high: 0.9,
        medium: 0.7,
        low: 0.4,
      };
      confidence = confidenceMap[confidence.toLowerCase()] || 0.5;
    }

    // Apply confidence threshold
    if (confidence < 0.5) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "I didn't understand that clearly. Please try again.",
          data: transactionData,
          confidence,
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

    // Ensure category is valid
    const validCategories = [
      "Sales",
      "Transport",
      "Stock",
      "Airtime",
      "Rent",
      "Electricity",
      "Food",
      "Other",
    ];
    
    if (!validCategories.includes(transactionData.category)) {
      transactionData.category = "Other";
    }

    // Insert transaction into database
    const { data: transaction, error: insertError } = await supabaseClient
      .from("transactions")
      .insert({
        user_id: user_id,
        amount: Math.abs(transactionData.amount),
        type: transactionData.type,
        category: transactionData.category,
        description: transactionData.description,
        date: new Date().toISOString().split("T")[0],
        source: "voice",
        synced: true,
        metadata: {
          confidence,
          language,
          processed_at: new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw insertError;
    }

    // Log successful processing
    console.log(`Voice transaction processed for user ${user_id}:`, {
      amount: transactionData.amount,
      type: transactionData.type,
      category: transactionData.category,
      confidence,
    });

    return new Response(
      JSON.stringify({
        success: true,
        transaction,
        confidence,
        message: "Transaction recorded successfully",
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
    console.error("Error processing voice transaction:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to process voice recording",
        message: "Something went wrong. Please try again.",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: error.message === "Unauthorized" ? 401 : 400,
      }
    );
  }
});