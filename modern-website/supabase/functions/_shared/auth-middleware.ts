/**
 * Authentication Middleware
 * 
 * Wrapper for protecting Edge Function endpoints.
 * Verifies JWT and checks session status in database (stateful check).
 */

import { verifyAccessToken } from "./jwt";

/**
 * Protect an endpoint with authentication
 * 
 * Usage:
 * ```typescript
 * serve(async (req) => {
 *   return withAuth(req, supabase, async (userId) => {
 *     // Your protected logic here
 *     return new Response(JSON.stringify({ userId }));
 *   });
 * });
 * ```
 * 
 * @param req - Request object
 * @param supabase - Supabase client
 * @param handler - Handler function that receives userId
 * @returns Response
 */
export async function withAuth(
    req: Request,
    supabase: any,
    handler: (userId: string, sessionId: string, req: Request) => Promise<Response>
): Promise<Response> {
    try {
        // 1. Extract token from header
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new Response(
                JSON.stringify({ error: "Missing or invalid authorization header" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        const token = authHeader.replace("Bearer ", "");

        // 2. Verify token and check session (THE STATEFUL CHECK)
        const { userId, sessionId } = await verifyAccessToken(token, supabase);

        // 3. Call protected handler
        return await handler(userId, sessionId, req);
    } catch (error) {
        console.error('Auth middleware error:', error);
        return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401, headers: { "Content-Type": "application/json" } }
        );
    }
}

/**
 * CORS headers for Edge Functions
 */
export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
    'Access-Control-Max-Age': '86400',
};

/**
 * Handle CORS preflight requests
 * 
 * @param req - Request object
 * @returns Response or null if not OPTIONS
 */
export function handleCors(req: Request): Response | null {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }
    return null;
}
