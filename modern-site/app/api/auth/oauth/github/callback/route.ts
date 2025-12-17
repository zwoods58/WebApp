/**
 * GitHub OAuth Callback Route
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '../../../../../src/lib/supabase'

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/github/callback`

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const storedState = request.cookies.get('oauth_state')?.value

    if (!code || !state || state !== storedState) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/error?error=invalid_state`)
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI
      })
    })

    if (!tokenResponse.ok) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/error?error=token_exchange_failed`)
    }

    const tokens = await tokenResponse.json()

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`
      }
    })

    if (!userResponse.ok) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/error?error=user_info_failed`)
    }

    const githubUser = await userResponse.json()

    // Get user email
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`
      }
    })

    const emails = await emailResponse.ok ? await emailResponse.json() : []
    const primaryEmail = emails.find((e: any) => e.primary)?.email || githubUser.email

    // Sign in or create user with Supabase
    const supabase = getSupabaseClient()
    
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('user_accounts')
      .select('id, email')
      .eq('email', primaryEmail)
      .single()

    if (existingUser) {
      // Sign in existing user
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/ai-builder?oauth=success`)
    } else {
      // Create new user
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/signup?email=${primaryEmail}&oauth=github`)
    }
  } catch (error: any) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/error?error=${encodeURIComponent(error.message)}`)
  }
}





