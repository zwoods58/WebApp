// Completely isolated test - no imports at all
export async function GET() {
  console.log('test-isolated: Called at', new Date().toISOString());
  
  return new Response(JSON.stringify({
    success: true,
    message: 'Isolated test works',
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    platform: process.platform,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
