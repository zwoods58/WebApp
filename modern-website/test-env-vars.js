// Test script to verify environment variables
// Run this in your production environment or locally to debug

console.log('=== Environment Variables Test ===');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log('URL length:', process.env.NEXT_PUBLIC_SUPABASE_URL.length);
    console.log('URL starts with https:', process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://'));
}

if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('Key length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length);
    console.log('Key format correct:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.startsWith('eyJ'));
}

console.log('=== Test Complete ===');
