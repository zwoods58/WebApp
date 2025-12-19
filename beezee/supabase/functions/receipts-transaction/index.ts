// Enhanced Receipt to Transaction Edge Function
// Handles receipt image OCR and transaction extraction via Google Gemini Vision
// Optimized for South African receipts (retail, informal, handwritten)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const GEMINI_MODEL = "google/gemini-2.5-flash"; // Using Gemini 2.5 Flash via OpenRouter

interface ReceiptData {
  vendor: string;
  date: string;
  total_amount: number;
  items: Array<{ item: string; price: number }> | null;
  payment_method: string | null;
  confidence: number;
  raw_text: string;
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

    const { imageBase64, mimeType = "image/jpeg", user_id } = await req.json();

    if (!user_id) {
      throw new Error("Missing user_id");
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
          message: "AI features require an active subscription. Please subscribe to continue using Receipt to Transaction.",
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

    if (!imageBase64) {
      throw new Error("Missing image data");
    }

    // Upload image to Supabase Storage first
    const fileName = `receipts/${user_id}/${Date.now()}.jpg`;
    
    // Convert base64 to Uint8Array for Deno (Buffer is not available in Deno)
    const binaryString = atob(imageBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("receipts")
      .upload(fileName, bytes, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
    }

    const receiptUrl = uploadData
      ? supabaseAdmin.storage.from("receipts").getPublicUrl(fileName).data.publicUrl
      : null;

    // Enhanced prompt for South African receipts
    const prompt = `
You are analyzing a receipt or invoice from a South African business. These receipts vary widely:

SOUTH AFRICAN RECEIPT TYPES:
1. Till slips from major retailers (Pick n Pay, Shoprite, Checkers, Spar, Woolworths)
2. Petrol station receipts (Shell, Engen, BP, Total, Sasol)
3. Handwritten invoices from informal vendors
4. Taxi receipts (often handwritten, minimal detail)
5. Spaza shop receipts (informal small shops)
6. Restaurant bills
7. Service invoices (mechanics, salons, etc.)

SOUTH AFRICAN SPECIFICS:
- Currency: South African Rand (R, ZAR)
- Common amount formats: "R50.00", "R 50", "50.00", "50-00"
- Date formats: DD/MM/YYYY, DD-MM-YYYY, YYYY/MM/DD
- Language: English and/or Afrikaans text
- VAT/BTW: Often shows VAT amount and VAT number
- Common terms: "Totaal" (Afrikaans for Total), "Bedrag" (Amount), "Kontant" (Cash), "Kaart" (Card)

COMMON RETAILERS & PATTERNS:
- Pick n Pay: Green/white, "Pick n Pay" header, itemized list, loyalty card info
- Shoprite/Checkers: Red/white, "Shoprite" or "Checkers", detailed itemization
- Woolworths: Black, "Woolworths", premium items
- Shell/Engen/BP: Fuel receipts, litres, price per litre, total
- Informal vendors: Handwritten, minimal detail, sometimes just amount and signature

YOUR TASK:
Extract all transaction details accurately. Handle faded thermal paper, handwriting, poor lighting, and multiple languages.

Extract and return ONLY a JSON object:
{
  "vendor": "<business name, even if abbreviated or handwritten>",
  "date": "<YYYY-MM-DD format, infer if unclear, use today if not visible>",
  "total_amount": <numeric only, no currency symbol>,
  "items": [{"item": "<item name>", "price": <price>}] or null if not itemized,
  "payment_method": "Cash" | "Card" | "EFT" | null,
  "confidence": <0.0 to 1.0>,
  "raw_text": "<full OCR text for debugging>"
}

CONFIDENCE SCORING:
- 0.9-1.0: Clear printed receipt, all fields visible
- 0.7-0.89: Most fields visible, minor uncertainties
- 0.5-0.69: Partial data, some guessing needed
- 0.3-0.49: Heavily damaged/unclear, major guessing
- 0.0-0.29: Not a receipt or completely unreadable

SPECIAL HANDLING:
- Handwritten receipts: Lower confidence (0.5-0.7) but still extract
- Faded thermal paper: Focus on vendor header and total
- Multiple languages: Extract from either English or Afrikaans
- Crumpled/damaged: Make best effort, note in confidence
- If not a receipt at all, return: {"error": "Not a valid receipt", "confidence": 0}

AMOUNT EXTRACTION PRIORITY:
1. Look for "TOTAL", "Totaal", "Grand Total", "Amount Due"
2. Usually last or largest amount on receipt
3. Exclude VAT-only lines, subtotals
4. Format: Convert "R 50.00" or "50-00" to 50.00

DATE EXTRACTION:
- Usually at top of receipt
- Format DD/MM/YYYY most common
- Convert to YYYY-MM-DD
- If unclear, use transaction timestamp

Be accurate but practical - informal business owners need any data, even if imperfect.
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
        "X-Title": "BeeZee Receipt Scanner",
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
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        temperature: 0.1,
        max_tokens: 512,
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
      throw new Error("No response from OpenRouter");
    }

    // Parse JSON from response (handle markdown code blocks)
    let receiptData: ReceiptData;
    
    try {
      const cleanedResponse = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      receiptData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Raw response:", responseText);
      throw new Error("Could not parse receipt data from response");
    }

    // Check if it's an error response (not a receipt)
    if ('error' in receiptData && receiptData.error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: receiptData.error || "Not a valid receipt",
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

    const transactionData = receiptData;

    // Normalize confidence to 0-1 range
    let confidence = transactionData.confidence || 0;
    if (typeof confidence === "string") {
      const confidenceMap: { [key: string]: number } = {
        high: 0.9,
        medium: 0.7,
        low: 0.4,
      };
      confidence = confidenceMap[confidence.toLowerCase()] || 0.5;
    }

    // Validate minimum confidence threshold
    if (confidence < 0.3) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Receipt image is too unclear. Please try again with better lighting and focus.",
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

    // Validate and format amount
    const totalAmount = transactionData.total_amount || transactionData.amount;
    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Could not read amount from receipt. Please enter manually.",
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

    // Format date properly
    let formattedDate = transactionData.date;
    try {
      if (formattedDate && formattedDate !== "null") {
        const dateParts = formattedDate.match(/(\d{2,4})[/-](\d{1,2})[/-](\d{1,2})/);
        if (dateParts) {
          const [_, part1, part2, part3] = dateParts;
          if (part1.length === 4) {
            formattedDate = `${part1}-${part2.padStart(2, '0')}-${part3.padStart(2, '0')}`;
          } else {
            const year = part3.length === 2 ? `20${part3}` : part3;
            formattedDate = `${year}-${part2.padStart(2, '0')}-${part1.padStart(2, '0')}`;
          }
        }
      } else {
        formattedDate = new Date().toISOString().split("T")[0];
      }
    } catch (dateError) {
      console.error("Date parsing error:", dateError);
      formattedDate = new Date().toISOString().split("T")[0];
    }

    // Return extracted data for frontend confirmation
    const extractedData = {
      vendor: transactionData.vendor || "Unknown",
      date: formattedDate,
      total_amount: Math.abs(totalAmount),
      items: transactionData.items || null,
      payment_method: transactionData.payment_method || null,
      raw_text: transactionData.raw_text || null,
    };

    console.log(`Receipt processed for user ${user_id}:`, {
      vendor: extractedData.vendor,
      amount: extractedData.total_amount,
      confidence,
    });

    return new Response(
      JSON.stringify({
        success: true,
        transaction: extractedData,
        confidence,
        message: confidence >= 0.7 
          ? "Receipt scanned successfully"
          : "Receipt scanned. Please review the details.",
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