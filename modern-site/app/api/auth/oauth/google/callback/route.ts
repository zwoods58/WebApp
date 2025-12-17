/**
 * Google OAuth Callback Route
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '../../../../../src/lib/supabase'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/google/callback`

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const storedState = request.cookies.get('oauth_state')?.value

    if (!code || !state || state !== storedState) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/error?error=invalid_state`)
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    })

    if (!tokenResponse.ok) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/error?error=token_exchange_failed`)
    }

    const tokens = await tokenResponse.json()

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`
      }
    })

    if (!userResponse.ok) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/error?error=user_info_failed`)
    }

    const googleUser = await userResponse.json()

    // Sign in or create user with Supabase
    const supabase = getSupabaseClient()
    
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('user_accounts')
      .select('id, email')
      .eq('email', googleUser.email)
      .single()

    if (existingUser) {
      // Sign in existing user
      // In production, you'd create a session token
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/ai-builder?oauth=success`)
    } else {
      // Create new user
      // In production, create user account and sign them in
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/signup?email=${googleUser.email}&oauth=google`)
    }
  } catch (error: any) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/error?error=${encodeURIComponent(error.message)}`)
  }
}





