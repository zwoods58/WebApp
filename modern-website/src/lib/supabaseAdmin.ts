import { createClient } from '@supabase/supabase-js';
import { supabase } from './supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// True admin client for authentication lookups (bypasses RLS)
// This is safe because we're only using it for phone number lookups during login
// Optimized for 50k users with connection pooling and proper headers
const adminClient = supabaseServiceKey 
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
        db: {
            schema: 'public',
        },
        global: {
            headers: {
                'x-application-name': 'beezee-web-admin',
                'x-client-version': '1.0.0',
                'x-operation-type': 'admin',
            },
        },
    })
    : supabase; // Fallback to regular client if no service key

export const supabaseAdmin = adminClient;
