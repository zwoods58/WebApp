/**
 * Protected Endpoint Example
 * 
 * Demonstrates how to use the auth middleware to protect any endpoint.
 * This example returns the user's profile data.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { withAuth, corsHeaders } from "../_shared/auth-middleware.ts";

serve(async (req: Request) => {
    const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? '',
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ''
    );

    return withAuth(req, supabase, async (userId: string, _sessionId: string) => {
        try {
            // Fetch user data
            const { data: user, error } = await supabase
                .from('business_users')
                .select('id, phone_number, business_name, backup_email, country_code, created_at, last_login')
                .eq('id', userId)
                .single();

            if (error || !user) {
                return new Response(
                    JSON.stringify({ error: 'User not found' }),
                    { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }

            // Fetch active sessions
            const { data: sessions } = await supabase
                .from('user_sessions')
                .select('id, device_name, device_fingerprint, created_at, last_used')
                .eq('user_id', userId)
                .eq('revoked', false)
                .order('last_used', { ascending: false });

            return new Response(
                JSON.stringify({
                    user: {
                        id: user.id,
                        phone: user.phone_number,
                        businessName: user.business_name,
                        email: user.backup_email,
                        country: user.country_code,
                        createdAt: user.created_at,
                        lastLogin: user.last_login
                    },
                    activeSessions: sessions || []
                }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        } catch (error) {
            console.error('Profile fetch error:', error);

            return new Response(
                JSON.stringify({ error: 'Failed to fetch profile' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }
    });
});
