/**
 * GitHub OAuth Route
 * P1 Feature 7: Enhanced Authentication - GitHub OAuth
 */

import { NextRequest, NextResponse } from 'next/server'

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/github/callback`

export async function GET(request: NextRequest) {
  try {
    if (!GITHUB_CLIENT_ID) {
      return NextResponse.json({ error: 'GitHub OAuth not configured' }, { status: 500 })
    }

    // Generate state for CSRF protection
    const state = crypto.randomUUID()
    
    // Store state in session/cookie
    const response = NextResponse.redirect(
      `https://github.com/login/oauth/authorize?` +
      `client_id=${GITHUB_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `scope=user:email&` +
      `state=${state}`
    )

    // Store state in cookie
    response.cookies.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600 // 10 minutes
    })

    return response
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'OAuth initiation failed' },
      { status: 500 }
    )
  }
}





