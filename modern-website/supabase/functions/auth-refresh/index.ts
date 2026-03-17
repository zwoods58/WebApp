/**
 * Token Refresh Endpoint
 * 
 * Exchange refresh token for new access token
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, handleCors } from "../_shared/auth-middleware.ts";
import { RefreshTokenSchema } from "../_shared/validators.ts";
import { refreshAccessToken } from "../_shared/jwt.ts";

serve(async (req: Request) => {
    // Handle CORS
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? '',
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ''
    );

    try {
        const body = await req.json();
        const { refreshToken } = RefreshTokenSchema.parse(body);

        const result = await refreshAccessToken(refreshToken, supabase);

        return new Response(
            JSON.stringify(result),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Token refresh error:', error);

        return new Response(
            JSON.stringify({ error: 'Invalid or expired refresh token' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
