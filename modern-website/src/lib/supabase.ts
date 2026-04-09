import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables');
}

// Single client instance to avoid multiple GoTrueClient instances
// This uses the anon key which respects RLS policies
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: {
            getItem: (key) => {
                if (typeof window === 'undefined') return null;
                try {
                    return window.localStorage.getItem(key);
                } catch {
                    return null;
                }
            },
            setItem: (key, value) => {
                if (typeof window === 'undefined') return;
                try {
                    window.localStorage.setItem(key, value);
                } catch {
                    // Silently fail if localStorage is full or disabled
                }
            },
            removeItem: (key) => {
                if (typeof window === 'undefined') return;
                try {
                    window.localStorage.removeItem(key);
                } catch {
                    // Silently fail if localStorage is disabled
                }
            },
        },
    },
    realtime: {
        params: {
            eventsPerSecond: 10, // Limit realtime events to reduce load
        },
    },
    db: {
        schema: 'public',
    },
    global: {
        headers: {
            'x-application-name': 'beezee-web',
            'x-client-version': '1.0.0',
        },
    },
});
