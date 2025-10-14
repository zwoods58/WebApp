import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const protectedRoutes = [
  '/admin',
  '/api/admin',
  '/api/leads',
  '/api/tasks',
  '/api/cron',
  '/api/notifications',
  '/api/stats',
  '/api/seed'
]

// Define admin-only routes
const adminOnlyRoutes = [
  '/admin',
  '/api/admin',
  '/api/leads/clear-all',
  '/api/tasks/clear-all',
  '/api/seed',
  '/api/cron'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute) {
    // Check for authentication token
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      // Redirect to login if no token
      const loginUrl = new URL('/admin', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // For admin-only routes, check if user is admin
    const isAdminOnlyRoute = adminOnlyRoutes.some(route => pathname.startsWith(route))
    
    if (isAdminOnlyRoute) {
      try {
        // Decode JWT token to check role
        const payload = JSON.parse(atob(token.split('.')[1]))
        
        if (payload.role !== 'ADMIN') {
          // Redirect to unauthorized page or back to login
          const loginUrl = new URL('/admin', request.url)
          loginUrl.searchParams.set('error', 'unauthorized')
          return NextResponse.redirect(loginUrl)
        }
      } catch (error) {
        // Invalid token, redirect to login
        const loginUrl = new URL('/admin', request.url)
        return NextResponse.redirect(loginUrl)
      }
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    // Temporarily disable API protection for testing
    // '/api/leads/:path*',
    // '/api/tasks/:path*',
    '/api/cron/:path*',
    '/api/notifications/:path*',
    '/api/stats/:path*',
    '/api/seed/:path*'
  ]
}
