/**
 * Magic Link Authentication Route
 * P1 Feature 7: Enhanced Authentication - Magic Links
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '../../../../src/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const supabase = getSupabaseClient()
    
    // Send magic link via Supabase Auth
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        shouldCreateUser: true
      }
    })

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Failed to send magic link' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Magic link sent to your email'
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to send magic link' },
      { status: 500 }
    )
  }
}





