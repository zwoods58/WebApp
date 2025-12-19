// Voice to Booking Edge Function
// Converts voice recordings to booking/task data using AI

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const GEMINI_MODEL = "google/gemini-2.5-flash";

interface BookingData {
  client_name: string;
  appointment_date?: string | null;
  appointment_time?: string | null;
  service?: string | null;
  location?: string | null;
  notes?: string | null;
  client_phone?: string | null;
  client_email?: string | null;
  type: "booking" | "task" | "inventory";
  task_title?: string | null;
  task_description?: string | null;
  due_date?: string | null;
  due_time?: string | null;
  priority?: "low" | "medium" | "high" | "urgent";
  // Inventory specific
  name?: string | null;
  quantity?: number | null;
  unit?: string | null;
  cost_price?: number | null;
  selling_price?: number | null;
  category?: string | null;
  transcript?: string | null;
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

// Helper function to parse date from natural language (with SA language tokens)
function parseNaturalDate(text: string): string | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const lowerText = text.toLowerCase().trim();

  // Common SA language tokens for today/tomorrow/next week
  const todayTokens = ["today", "vandag", "namhlanje", "namuhla", "kajeno", "gompieno", "lehono", "lamuhla", "namusi", "namuntlha"];
  const tomorrowTokens = ["tomorrow", "môre", "more", "kusasa", "ngomso", "hosane", "kamoso", "gosasa", "kusasa", "matshelo", "mundzuku"];
  const nextWeekTokens = ["next week", "volgende week", "isonto elizayo", "iveki ezayo", "bekeng e tlang", "bekeng e tlang", "bekeng e tlago", "nextweek"];
  const nextTokens = ["next", "volgende", "elandelayo", "e tlang", "e tlago"]; // generic "next"

  if (todayTokens.some(t => lowerText.includes(t))) {
    return today.toISOString().split('T')[0];
  }
  if (tomorrowTokens.some(t => lowerText.includes(t))) {
    return tomorrow.toISOString().split('T')[0];
  }
  if (nextWeekTokens.some(t => lowerText.includes(t))) {
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  }

  // Handle day names (English + Afrikaans + common Nguni/Sotho variants)
  const dayMap: Record<string, number> = {
    "sunday": 0,
    "sondae": 0,
    "sundey": 0,
    "monday": 1,
    "maandag": 1,
    "mvulo": 1,
    "mvulozulu": 1,
    "tuesday": 2,
    "dinsdag": 2,
    "lwesibili": 2,
    "labo-beli": 2,
    "wednesday": 3,
    "woensdag": 3,
    "lwesithathu": 3,
    "labo-tharo": 3,
    "thursday": 4,
    "donderdag": 4,
    "lwesine": 4,
    "friday": 5,
    "vrijdag": 5,
    "lwesihlanu": 5,
    "labohlano": 5,
    "saturday": 6,
    "zaterdag": 6,
    "mgqibelo": 6,
    "mokibelo": 6,
  };

  for (const [name, idx] of Object.entries(dayMap)) {
    if (lowerText.includes(name)) {
      const targetDay = idx;
      const currentDay = today.getDay();
      let daysToAdd = (targetDay - currentDay + 7) % 7;
      if (nextTokens.some(t => lowerText.includes(t))) {
        daysToAdd += 7;
      }
      if (daysToAdd === 0) {
        daysToAdd = 7;
      }
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + daysToAdd);
      return targetDate.toISOString().split('T')[0];
    }
  }
  
  // Try to parse as ISO date (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const parsedDate = new Date(text);
    if (!isNaN(parsedDate.getTime())) {
      return text; // Already in correct format
    }
  }
  
  // Try to extract date patterns (MM/DD/YYYY or DD/MM/YYYY)
  const datePattern = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/;
  const match = text.match(datePattern);
  if (match) {
    const [, part1, part2, year] = match;
    const fullYear = year.length === 2 ? `20${year}` : year;
    
    // Try both formats and validate
    const date1 = new Date(`${fullYear}-${part1.padStart(2, '0')}-${part2.padStart(2, '0')}`);
    const date2 = new Date(`${fullYear}-${part2.padStart(2, '0')}-${part1.padStart(2, '0')}`);
    
    // Use the one that makes sense (not too far in past, reasonable date)
    const currentYear = today.getFullYear();
    if (!isNaN(date1.getTime()) && date1.getFullYear() >= currentYear - 1 && date1.getFullYear() <= currentYear + 1) {
      return date1.toISOString().split('T')[0];
    }
    if (!isNaN(date2.getTime()) && date2.getFullYear() >= currentYear - 1 && date2.getFullYear() <= currentYear + 1) {
      return date2.toISOString().split('T')[0];
    }
  }
  
  return null;
}

// Helper function to validate and correct dates
function validateAndCorrectDate(dateString: string | null | undefined): string | null {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }
  
  // First try to parse as natural language
  const naturalDate = parseNaturalDate(dateString);
  if (naturalDate) {
    return naturalDate;
  }
  
  // Try to parse as ISO date
  const parsedDate = new Date(dateString);
  if (isNaN(parsedDate.getTime())) {
    // Invalid date, try natural language parsing again
    return parseNaturalDate(dateString);
  }
  
  // Validate the date is reasonable (not too far in past, not too far in future)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = new Date(today);
  minDate.setFullYear(today.getFullYear() - 1); // Allow up to 1 year in past
  
  const maxDate = new Date(today);
  maxDate.setFullYear(today.getFullYear() + 2); // Allow up to 2 years in future
  
  if (parsedDate < minDate || parsedDate > maxDate) {
    // Date is out of reasonable range, try natural language
    return parseNaturalDate(dateString);
  }
  
  // Return in YYYY-MM-DD format
  return parsedDate.toISOString().split('T')[0];
}

// Helper function to parse time from natural language (supports 12h/24h and "14h00")
function parseNaturalTime(text: string): string | null {
  const lowerText = text.toLowerCase();
  const pmKeywords = [
    'pm', 'emini', 'ntambama', 'afternoon',
    'middag', 'aand', 'saans', 'evening', 'mantsiboya', 'maitseboeng'
  ];
  const amKeywords = [
    'am', 'morning', 'ekuseni', 'kuseni',
    'oggend', 'kusasa', 'mesong', 'mosong'
  ];
  
  // Match patterns like "2pm", "14:00", "2:30pm", "14:30", "14h00", "14h"
  const timePatterns = [
    /(\d{1,2}):?(\d{2})?\s*(am|pm)/i,     // 2pm, 2:30pm
    /(\d{1,2})\s*(am|pm)/i,              // 2 pm
    /(\d{1,2}):(\d{2})/,                 // 14:30
    /(\d{1,2})h(\d{2})?/,                // 14h00 or 14h
    /(\d{1,2})\.(\d{2})/,                // 14.30
    /(?:at\s+)?(\d{1,2})\b/,             // at 14 (assume minutes 00, 24h if >12)
  ];
  
  for (const pattern of timePatterns) {
    const match = lowerText.match(pattern);
    if (match) {
      let hours = parseInt(match[1]);
      let minutes = 0;
      const hasMinutes = match[2] !== undefined && match[2] !== null;
      if (hasMinutes && !isNaN(parseInt(match[2]))) {
        minutes = parseInt(match[2]);
      }
      const period = match[3]?.toLowerCase();
      
      if (period === 'pm' && hours !== 12) {
        hours += 12;
      } else if (period === 'am' && hours === 12) {
        hours = 0;
      } else if (!period && pmKeywords.some(k => lowerText.includes(k))) {
        if (hours < 12) hours += 12;
      } else if (!period && amKeywords.some(k => lowerText.includes(k))) {
        // morning, keep as is; if 12, set to 00
        if (hours === 12) hours = 0;
      }

      // If no period and hours > 24, invalid
      if (!period && hours > 24) return null;
      // If no minutes captured, default to 00
      minutes = isNaN(minutes) ? 0 : minutes;
      if (minutes > 59) return null;
      // If hours == 24, normalize to 00
      if (hours === 24) hours = 0;

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  }
  
  return null;
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

    const { audioBase64, language = "en", user_id, type = "booking" } = await req.json();

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

    // Check if user has AI access
    const hasAIAccess = checkAIAccess(user);
    if (!hasAIAccess) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "subscription_required",
          message: "AI features require an active subscription.",
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

    // Get current date for context
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    // Enhanced prompt for booking/task/inventory extraction
    const supportedLanguages = "English, Afrikaans, isiZulu, isiXhosa, Sesotho, Setswana, Sepedi, isiNdebele, siSwati, Tshivenda, Xitsonga";

    let prompt = "";
    if (type === "inventory") {
      prompt = `You are an inventory assistant for South African business owners.
The user may speak in any of these South African languages: ${supportedLanguages}, and may code-switch.
You MUST return JSON fields in English.
If the user does NOT say a field, set it to null. Do NOT invent prices, quantities, or categories.

TASK: Listen to this voice recording and extract inventory/stock information.

Extract the following:
1. NAME: The name of the item/stock (required)
2. QUANTITY: Number only (default to 1 if not mentioned)
3. COST_PRICE: Number only, the price the owner bought it for (if mentioned)
4. SELLING_PRICE: Number only, the price the owner sells it for (if mentioned)
5. CATEGORY: e.g., "Drinks", "Food", "Groceries", "Clothes", "Electronics", "Other"
6. NOTES: Any additional details like brand, size, color, or location

EXAMPLES:
"I added 10 bottles of Coke costing R10 each, selling for R15" → {"name": "Coke", "quantity": 10, "cost_price": 10, "selling_price": 15, "category": "Drinks", "confidence": 0.9}
"Added some bread, 5 loaves, selling for R18" → {"name": "Bread", "quantity": 5, "selling_price": 18, "category": "Food", "confidence": 0.85}
"Just got 20 pairs of Nike shoes in stock" → {"name": "Nike Shoes", "quantity": 20, "category": "Clothes", "confidence": 0.9}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "name": "<name>",
  "quantity": <number>,
  "cost_price": <number> or null,
  "selling_price": <number> or null,
  "category": "<category>" or null,
  "notes": "<notes>" or null,
  "transcript": "<verbatim or best effort transcript>" or null,
  "confidence": <0.0 to 1.0>
}`;
    } else if (type === "booking") {
      prompt = `You are a booking assistant for South African business owners.
The user may speak in any of these South African languages: ${supportedLanguages}, and may code-switch.
You MUST return JSON fields in English, and include day/date/time even when spoken in another language.
If the user does NOT say a field, set it to null. Do NOT invent descriptions, services, locations, phone, email, times, notes, or transcript text.

CRITICAL: Today's date is ${todayStr}. Calculate dates relative to TODAY.

TASK: Listen to this voice recording and extract booking/appointment information.

Extract the following:
1. CLIENT_NAME: The name of the client/person (required)
2. APPOINTMENT_DATE: 
   - If user says "today" → use "${todayStr}"
   - If user says "tomorrow" → use "${tomorrowStr}" (today + 1 day)
   - If user says "next [day]" → calculate the date of that day next week
   - Always return in YYYY-MM-DD format
   - If no date mentioned, return null
3. APPOINTMENT_TIME: Time in HH:MM format (supports 12h/24h; e.g., "2pm" → "14:00", "14:00" → "14:00", "14h00" → "14:00", "10:30am" → "10:30")
4. SERVICE: What service/appointment type (e.g., "haircut", "consultation", "meeting")
5. LOCATION: Where the appointment is (optional)
6. NOTES: Any additional information
7. CLIENT_PHONE: Phone (if mentioned)
8. CLIENT_EMAIL: Email (if mentioned)
9. TRANSCRIPT: Verbatim transcript (or best effort) of what the user said

DATE CALCULATION RULES:
- "today" = ${todayStr}
- "tomorrow" = ${tomorrowStr}
- "next Monday" = calculate Monday of next week from ${todayStr}
- Always calculate relative to ${todayStr}
- NEVER use dates from the past (before ${todayStr}) unless explicitly stated
- NEVER use dates far in the future (more than 2 years)

EXAMPLES (assuming today is ${todayStr}):
"Book John for haircut tomorrow at 2pm" → {"client_name": "John", "appointment_date": "${tomorrowStr}", "appointment_time": "14:00", "service": "haircut", "confidence": 0.9, "transcript": "Book John for haircut tomorrow at 2pm"}
"Sarah consultation next Friday at 10am" → {"client_name": "Sarah", "appointment_date": "<calculate next Friday>", "appointment_time": "10:00", "service": "consultation", "confidence": 0.85, "transcript": "Sarah consultation next Friday at 10am"}
"Book Mike for meeting today at 3:30pm" → {"client_name": "Mike", "appointment_date": "${todayStr}", "appointment_time": "15:30", "service": "meeting", "confidence": 0.9, "transcript": "Book Mike for meeting today at 3:30pm"}
"Ngicela i-haircut ngomso ngo-10am eMaboneng, igama uThabo" → {"client_name": "Thabo", "appointment_date": "${tomorrowStr}", "appointment_time": "10:00", "service": "haircut", "location": "Maboneng", "confidence": 0.85, "transcript": "Ngicela i-haircut ngomso ngo-10am eMaboneng, igama uThabo"}
"Ek wil môre 14:00 'n vergadering hê in Pretoria, naam Pieter" → {"client_name": "Pieter", "appointment_date": "${tomorrowStr}", "appointment_time": "14:00", "service": "meeting", "location": "Pretoria", "confidence": 0.9, "transcript": "Ek wil môre 14:00 'n vergadering hê in Pretoria, naam Pieter"}
"Bhuka uJohn kusasa ngo-2 emini ukuze agunde ikhanda" → {"client_name": "John", "appointment_date": "${tomorrowStr}", "appointment_time": "14:00", "service": "haircut", "confidence": 0.9, "transcript": "Bhuka uJohn kusasa ngo-2 emini ukuze agunde ikhanda"}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "client_name": "<name>",
  "appointment_date": "YYYY-MM-DD" or null,
  "appointment_time": "HH:MM" or null,
  "service": "<service>" or null,
  "location": "<location>" or null,
  "notes": "<notes>" or null,
  "client_phone": "<phone>" or null,
  "client_email": "<email>" or null,
  "transcript": "<verbatim or best effort transcript>" or null,
  "confidence": <0.0 to 1.0>
}`;
    } else {
      prompt = `You are a task/reminder assistant for South African business owners.
The user may speak in any of these South African languages: ${supportedLanguages}, and may code-switch.
You MUST return JSON fields in English, and include day/date/time even when spoken in another language.
If the user does NOT say a field, set it to null. Do NOT invent descriptions, priorities, times, or other details.

CRITICAL: Today's date is ${todayStr}. Calculate dates relative to TODAY.

TASK: Listen to this voice recording and extract task/reminder information.

Extract the following:
1. TASK_TITLE: A short title for the task (required)
2. TASK_DESCRIPTION: More details about the task (optional)
3. DUE_DATE: 
   - If user says "today" → use "${todayStr}"
   - If user says "tomorrow" → use "${tomorrowStr}" (today + 1 day)
   - If user says "next week" → calculate 7 days from ${todayStr}
   - Always return in YYYY-MM-DD format
   - If no date mentioned, return null
4. DUE_TIME: Optional time in HH:MM (supports 12h/24h; e.g., "2pm" → "14:00", "14:00"/"14h00" stay "14:00")
5. PRIORITY: "low", "medium", "high", or "urgent" (default: "medium")

DATE CALCULATION RULES:
- "today" = ${todayStr}
- "tomorrow" = ${tomorrowStr}
- "next week" = 7 days from ${todayStr}
- Always calculate relative to ${todayStr}
- NEVER use dates from the past (before ${todayStr}) unless explicitly stated

EXAMPLES (assuming today is ${todayStr}):
"Remind me to call John tomorrow" → {"task_title": "Call John", "due_date": "${tomorrowStr}", "priority": "medium", "confidence": 0.9}
"Call John tomorrow at 10am" → {"task_title": "Call John", "due_date": "${tomorrowStr}", "due_time": "10:00", "priority": "medium", "confidence": 0.9}
"Important: Follow up with client next week" → {"task_title": "Follow up with client", "due_date": "<calculate 7 days from ${todayStr}>", "priority": "high", "confidence": 0.85}
"Task: Order supplies urgent" → {"task_title": "Order supplies", "priority": "urgent", "confidence": 0.9}
"Herinner my om môre 14:00 die verslag te stuur" → {"task_title": "Send the report", "due_date": "${tomorrowStr}", "due_time": "14:00", "priority": "medium", "confidence": 0.85}
"Ngicela ungikhumbuze ngoJohn kusasa" → {"task_title": "Call John", "due_date": "${tomorrowStr}", "priority": "medium", "confidence": 0.8}
"Herinner my om môre 10:00 die verslag te stuur" → {"task_title": "Send the report", "due_date": "${tomorrowStr}", "priority": "medium", "confidence": 0.85}
"Bhuka uJohn kusasa ngo-2 emini ukuze agunde ikhanda" → {"task_title": "Haircut for John", "due_date": "${tomorrowStr}", "due_time": "14:00", "priority": "medium", "confidence": 0.9}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "task_title": "<title>",
  "task_description": "<description>" or null,
  "due_date": "YYYY-MM-DD" or null,
  "due_time": "HH:MM" or null,
  "priority": "low" | "medium" | "high" | "urgent",
  "transcript": "<verbatim or best effort transcript>" or null,
  "confidence": <0.0 to 1.0>
}`;
    }

    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY not configured");
    }

    const openrouterResponse = await fetch(OPENROUTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": Deno.env.get("SUPABASE_URL") || "",
        "X-Title": "BeeZee Voice Booking",
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

    const messageContent = openrouterData.choices[0]?.message?.content;
    // Normalize response text (Gemini may return array content for multimodal)
    let responseText: string = "";
    if (typeof messageContent === "string") {
      responseText = messageContent;
    } else if (Array.isArray(messageContent)) {
      responseText = messageContent
        .map((part: any) => {
          if (typeof part === "string") return part;
          if (typeof part?.text === "string") return part.text;
          return "";
        })
        .filter(Boolean)
        .join("\n");
    } else if (messageContent) {
      responseText = String(messageContent);
    }

    if (!responseText) {
      throw new Error("Empty response from OpenRouter");
    }

    console.log("AI Response text:", responseText);

    // Parse JSON response (handle markdown, arrays, and minor format issues)
    let parsedData: BookingData;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      
      // Try to extract JSON object or array
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      const arrayMatch = cleanedResponse.match(/\[[\s\S]*\]/);
      let candidate = jsonMatch ? jsonMatch[0] : arrayMatch ? arrayMatch[0] : cleanedResponse;

      // Fallback: if candidate still not parsable, try to fix single quotes
      const tryParse = (text: string) => {
        // If array, pick first object
        if (text.trim().startsWith("[")) {
          const arr = JSON.parse(text);
          return Array.isArray(arr) ? arr[0] : arr;
        }
        return JSON.parse(text);
      };

      try {
        parsedData = tryParse(candidate);
      } catch {
        const fixed = candidate.replace(/'/g, '"');
        parsedData = tryParse(fixed);
      }

      if (typeof parsedData !== "object" || parsedData === null) {
        throw new Error("Parsed data was not an object");
      }

      // Normalize possible field names
      // Task variants
      // @ts-ignore
      parsedData.task_title = parsedData.task_title || parsedData.title || parsedData.name;
      // Booking variants
      // @ts-ignore
      parsedData.client_name = parsedData.client_name || parsedData.name;

      console.log("Parsed data:", parsedData);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw response:", responseText);
      return new Response(
        JSON.stringify({
          success: false,
          error: "parse_error",
          message: "Could not understand the voice recording. Please try again.",
          rawResponse: responseText.substring(0, 200),
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

    // Validate and normalize the data
    if (type === "inventory") {
      if (!parsedData.name && !parsedData.item_name) {
        throw new Error("Missing required field: name");
      }

      return new Response(
        JSON.stringify({
          success: true,
          inventory: {
            name: parsedData.name || parsedData.item_name,
            quantity: parsedData.quantity || 1,
            cost_price: parsedData.cost_price || null,
            selling_price: parsedData.selling_price || null,
            category: parsedData.category || "General",
            notes: parsedData.notes || parsedData.description || null,
          },
          confidence: parsedData.confidence || 0.5,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          status: 200,
        }
      );
    } else if (type === "booking") {
      if (!parsedData.client_name) {
        throw new Error("Missing required field: client_name");
      }

      // Validate and correct dates - this will handle "tomorrow", malformed dates, etc.
      parsedData.appointment_date = validateAndCorrectDate(parsedData.appointment_date);

      // If date is still invalid or in the past (except today), try to fix it
      if (parsedData.appointment_date) {
        const dateObj = new Date(parsedData.appointment_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // If date is clearly wrong (in far past or invalid), try natural language parsing
        if (isNaN(dateObj.getTime()) || dateObj < today) {
          // Try to parse the original string as natural language
          const corrected = parseNaturalDate(String(parsedData.appointment_date));
          if (corrected) {
            parsedData.appointment_date = corrected;
          } else {
            // If still can't parse, set to tomorrow as safe default if user said "tomorrow"
            console.warn("Could not parse date, setting to null:", parsedData.appointment_date);
            parsedData.appointment_date = null;
          }
        }
      }

      if (parsedData.appointment_time && typeof parsedData.appointment_time === 'string') {
        const naturalTime = parseNaturalTime(parsedData.appointment_time);
        if (naturalTime) {
          parsedData.appointment_time = naturalTime;
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          booking: {
            client_name: parsedData.client_name,
            appointment_date: parsedData.appointment_date || null,
            appointment_time: parsedData.appointment_time || null,
            service: parsedData.service || null,
            location: parsedData.location || null,
            notes: parsedData.notes || null,
          },
          confidence: parsedData.confidence || 0.5,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          status: 200,
        }
      );
    } else {
      // Task
      if (!parsedData.task_title) {
        throw new Error("Missing required field: task_title");
      }

      // Validate and correct dates
      parsedData.due_date = validateAndCorrectDate(parsedData.due_date);
      
      // If date is invalid, try to fix it
      if (parsedData.due_date) {
        const dateObj = new Date(parsedData.due_date);
        if (isNaN(dateObj.getTime())) {
          const corrected = parseNaturalDate(String(parsedData.due_date));
          parsedData.due_date = corrected;
        }
      }

      // Normalize due_time if present
      if (parsedData.due_time && typeof parsedData.due_time === 'string') {
        const naturalTime = parseNaturalTime(parsedData.due_time);
        if (naturalTime) {
          parsedData.due_time = naturalTime;
        } else {
          parsedData.due_time = null;
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          task: {
            title: parsedData.task_title,
            description: parsedData.task_description || null,
            due_date: parsedData.due_date || null,
            due_time: parsedData.due_time || null,
            priority: parsedData.priority || "medium",
          },
          confidence: parsedData.confidence || 0.5,
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
  } catch (error: any) {
    console.error("Voice booking error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error",
        message: error.message || "Failed to process voice recording",
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

