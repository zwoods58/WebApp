import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * CORS configuration for API routes
 * Handles preflight OPTIONS requests and adds CORS headers to responses
 */

// Allowed origins based on environment
const getAllowedOrigins = (): string[] => {
  const baseOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL || 'https://web-app1-dsvkfjaqz-zwoods58s-projects.vercel.app',
  ];

  // Add development origins in non-production
  if (process.env.NODE_ENV !== 'production') {
    baseOrigins.push(
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000'
    );
  }

  // Add any additional allowed origins from environment variable
  const additionalOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  
  return [...baseOrigins, ...additionalOrigins].filter(Boolean);
};

// Allowed methods
const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

// Allowed headers
const ALLOWED_HEADERS = [
  'X-CSRF-Token',
  'X-Requested-With',
  'Accept',
  'Accept-Version',
  'Content-Length',
  'Content-MD5',
  'Content-Type',
  'Date',
  'X-Api-Version',
  'Authorization',
];

/**
 * Check if origin is allowed
 */
export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  
  const allowedOrigins = getAllowedOrigins();
  
  // Exact match
  if (allowedOrigins.includes(origin)) {
    return true;
  }
  
  // Check for wildcard subdomain match (e.g., *.vercel.app)
  return allowedOrigins.some(allowed => {
    if (allowed.includes('*')) {
      const pattern = allowed.replace(/\*/g, '.*');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(origin);
    }
    return false;
  });
}

/**
 * Add CORS headers to response
 */
export function addCorsHeaders(
  response: NextResponse,
  origin: string | null
): NextResponse {
  if (origin && isOriginAllowed(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  response.headers.set('Access-Control-Allow-Methods', ALLOWED_METHODS.join(','));
  response.headers.set('Access-Control-Allow-Headers', ALLOWED_HEADERS.join(', '));
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  return response;
}

/**
 * Handle preflight OPTIONS request
 */
export function handlePreflight(request: NextRequest): NextResponse {
  const origin = request.headers.get('origin');
  
  const response = new NextResponse(null, {
    status: 204,
    headers: {
      'Content-Length': '0',
    },
  });

  return addCorsHeaders(response, origin);
}

/**
 * CORS middleware wrapper for API routes
 * Usage in API route:
 * 
 * export async function OPTIONS(request: NextRequest) {
 *   return handlePreflight(request);
 * }
 * 
 * export async function POST(request: NextRequest) {
 *   const response = await yourHandler(request);
 *   return addCorsHeaders(response, request.headers.get('origin'));
 * }
 */
export function withCors(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Handle preflight
    if (request.method === 'OPTIONS') {
      return handlePreflight(request);
    }

    // Execute handler
    const response = await handler(request);

    // Add CORS headers
    const origin = request.headers.get('origin');
    return addCorsHeaders(response, origin);
  };
}
