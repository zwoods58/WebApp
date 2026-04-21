export async function GET() {
  return Response.json({ 
    message: 'Debug endpoint working',
    timestamp: new Date().toISOString(),
    envVars: {
      NODE_ENV: process.env.NODE_ENV,
      HAS_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      HAS_SUPABASE_ANON: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      HAS_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    }
  });
}
