
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zruprmhkcqhgzydjfhrk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ';

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
