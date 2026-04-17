import { withPWA } from "next-pwa-pack";
import { NextResponse } from "next/server";

// Your existing middleware logic (if any)
function originalMiddleware(request: Request) {
  // Add any existing middleware logic here
  return NextResponse.next();
}

// Wrap with PWA
export default withPWA(originalMiddleware, {
  webhookPath: '/api/webhooks/pwa',
  sseEndpoint: '/api/pwa/events',
  revalidationSecret: process.env.REVALIDATION_SECRET || 'default-secret',
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
