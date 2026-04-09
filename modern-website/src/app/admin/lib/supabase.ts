
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables in admin lib');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
    }
});

// Admin credentials for reference
export const ADMIN_CREDENTIALS = {
    email: 'admin@atarwebb.com',
    business_name: 'BeeZee Admin',
    business_id: '7750a352-8ecf-436e-8959-c4241b1285c0',
    country: 'KE',
    industry: 'system'
};
