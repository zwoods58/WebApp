import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is missing')
}

// Use service role key for admin operations (bypasses RLS)
const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service role key not configured' },
        { status: 500 }
      )
    }

    const adminEmail = 'admin@atarwebb.com'

    // Check if user exists in auth.users
    const { data: authUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      return NextResponse.json({ error: `Failed to list users: ${listError.message}` }, { status: 500 })
    }

    const adminUser = authUsers?.users?.find(u => u.email === adminEmail)

    if (!adminUser) {
      return NextResponse.json({
        exists: false,
        message: 'Admin user not found in auth.users',
        email: adminEmail
      })
    }

    // Check user_accounts
    const { data: account, error: accountError } = await supabaseAdmin
      .from('user_accounts')
      .select('email, account_tier, id, created_at')
      .eq('id', adminUser.id)
      .maybeSingle()

    if (accountError && accountError.code !== 'PGRST116') {
      return NextResponse.json({ error: `Failed to check account: ${accountError.message}` }, { status: 500 })
    }

    const isAdmin = account?.account_tier === 'admin'
    const emailMatches = account?.email === adminEmail

    return NextResponse.json({
      exists: true,
      verified: isAdmin && emailMatches,
      details: {
        auth: {
          id: adminUser.id,
          email: adminUser.email,
          emailConfirmed: adminUser.email_confirmed_at !== null,
          createdAt: adminUser.created_at
        },
        account: account ? {
          id: account.id,
          email: account.email,
          accountTier: account.account_tier,
          createdAt: account.created_at,
          isAdmin: isAdmin,
          emailMatches: emailMatches
        } : null
      },
      issues: [
        !adminUser && 'User not found in auth.users',
        !account && 'Account not found in user_accounts',
        !isAdmin && `Account tier is '${account?.account_tier}' but should be 'admin'`,
        !emailMatches && `Email mismatch: account has '${account?.email}' but should be '${adminEmail}'`
      ].filter(Boolean)
    })

  } catch (error: any) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify admin user' },
      { status: 500 }
    )
  }
}



