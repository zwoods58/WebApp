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

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service role key not configured. Please set SUPABASE_SERVICE_ROLE_KEY in .env.local' },
        { status: 500 }
      )
    }

    const adminEmail = 'admin@atarwebb.com'
    const adminPassword = 'Royalblue#28'

    console.log('Setting up admin user...')

    // Step 1: Check if user exists in auth.users
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      console.error('Error listing users:', listError)
      return NextResponse.json({ error: `Failed to list users: ${listError.message}` }, { status: 500 })
    }

    const existingUser = existingUsers?.users?.find(u => u.email === adminEmail)
    let userId: string

    if (existingUser) {
      console.log('Admin user exists, updating password...')
      userId = existingUser.id

      // Update password
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: adminPassword,
        email_confirm: true
      })

      if (updateError) {
        console.error('Error updating password:', updateError)
        return NextResponse.json({ error: `Failed to update password: ${updateError.message}` }, { status: 500 })
      }
      console.log('✓ Password updated')
    } else {
      // Create new user
      console.log('Creating new admin user...')
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: 'AtarWebb Admin'
        }
      })

      if (createError) {
        console.error('Error creating user:', createError)
        return NextResponse.json({ error: `Failed to create user: ${createError.message}` }, { status: 500 })
      }

      userId = newUser.user.id
      console.log('✓ Admin user created in auth.users')
    }

    // Step 2: Wait a bit for the trigger to create user_accounts record
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Step 3: Ensure user_accounts record exists with admin tier
    const { data: existingAccount, error: accountCheckError } = await supabaseAdmin
      .from('user_accounts')
      .select('id, account_tier')
      .eq('id', userId)
      .maybeSingle()

    if (accountCheckError && accountCheckError.code !== 'PGRST116') {
      console.error('Error checking account:', accountCheckError)
      return NextResponse.json({ error: `Failed to check account: ${accountCheckError.message}` }, { status: 500 })
    }

    if (existingAccount) {
      // Update account tier to admin
      const { error: updateError } = await supabaseAdmin
        .from('user_accounts')
        .update({ 
          account_tier: 'admin',
          email: adminEmail,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) {
        console.error('Error updating account tier:', updateError)
        return NextResponse.json({ error: `Failed to update account tier: ${updateError.message}` }, { status: 500 })
      }
      console.log('✓ Admin account tier updated')
    } else {
      // Create user_accounts record
      const { error: insertError } = await supabaseAdmin
        .from('user_accounts')
        .insert({
          id: userId,
          email: adminEmail,
          account_tier: 'admin',
          full_name: 'AtarWebb Admin'
        })

      if (insertError) {
        console.error('Error creating account:', insertError)
        return NextResponse.json({ error: `Failed to create account: ${insertError.message}` }, { status: 500 })
      }
      console.log('✓ Admin account created')
    }

    // Step 4: Verify setup - check both auth.users and user_accounts
    const { data: verifyAuthUser, error: verifyAuthError } = await supabaseAdmin.auth.admin.getUserById(userId)
    
    const { data: verifyAccount, error: verifyError } = await supabaseAdmin
      .from('user_accounts')
      .select('email, account_tier, id')
      .eq('id', userId)
      .single()

    // Verify auth user exists and email matches
    if (verifyAuthError || !verifyAuthUser?.user || verifyAuthUser.user.email !== adminEmail) {
      return NextResponse.json({ 
        error: `Auth verification failed: ${verifyAuthError?.message || 'Email mismatch'}`,
        details: {
          authUser: verifyAuthUser?.user?.email,
          expectedEmail: adminEmail
        }
      }, { status: 500 })
    }

    // Verify account tier is admin
    if (verifyError || !verifyAccount) {
      return NextResponse.json({ 
        error: `Account verification failed: ${verifyError?.message || 'Account not found'}` 
      }, { status: 500 })
    }

    if (verifyAccount.account_tier !== 'admin') {
      return NextResponse.json({ 
        error: `Account tier is '${verifyAccount.account_tier}' but should be 'admin'`,
        details: {
          currentTier: verifyAccount.account_tier,
          expectedTier: 'admin'
        }
      }, { status: 500 })
    }

    // Final verification: email matches in both places
    if (verifyAccount.email !== adminEmail) {
      return NextResponse.json({ 
        error: `Email mismatch: account has '${verifyAccount.email}' but should be '${adminEmail}'` 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Admin user setup complete and verified!',
      details: {
        email: verifyAccount.email,
        userId: userId,
        accountTier: verifyAccount.account_tier,
        authEmail: verifyAuthUser.user.email,
        verified: true
      }
    })

  } catch (error: any) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to setup admin user' },
      { status: 500 }
    )
  }
}

