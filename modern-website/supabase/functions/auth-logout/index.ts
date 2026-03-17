/**
 * Session Revocation Endpoint (Kill Switch)
 * 
 * Revoke specific session or all sessions for a user
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { withAuth, corsHeaders } from "../_shared/auth-middleware.ts";
import { RevokeSessionSchema } from "../_shared/validators.ts";
import { revokeSessions } from "../_shared/jwt.ts";
import { logAuditEvent, getIpAddress, getUserAgent } from "../_shared/audit.ts";

serve(async (req: Request) => {
    const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? '',
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ''
    );

    return withAuth(req, supabase, async (userId: string, currentSessionId: string, request: Request) => {
        try {
            const body = await request.json();
            const { sessionId, exceptCurrent } = RevokeSessionSchema.parse(body);

            // Revoke session(s)
            await revokeSessions(
                supabase,
                userId,
                sessionId,
                exceptCurrent ? currentSessionId : undefined,
                'user_initiated'
            );

            // Log event
            await logAuditEvent(supabase, {
                userId,
                eventType: 'session_revoked',
                ipAddress: getIpAddress(request),
                userAgent: getUserAgent(request),
                metadata: {
                    sessionId: sessionId || 'all',
                    exceptCurrent: exceptCurrent || false
                }
            });

            const message = sessionId
                ? 'Session revoked successfully'
                : exceptCurrent
                    ? 'All other sessions revoked'
                    : 'All sessions revoked';

            return new Response(
                JSON.stringify({ success: true, message }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        } catch (error) {
            console.error('Session revocation error:', error);

            return new Response(
                JSON.stringify({ error: 'Failed to revoke session' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }
    });
});
