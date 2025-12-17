import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Middleware currently not blocking any routes
  // AI Builder is now accessible
  return NextResponse.next()
}

export const config = {
  matcher: [],
}

