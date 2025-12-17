import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing')
  }
  return createClient(supabaseUrl, supabaseKey)
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    // Get current user
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user account
    const { data: account, error: accountError } = await supabase
      .from('user_accounts')
      .select('*')
      .eq('id', user.id)
      .single()

    if (accountError || !account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Check if user has active subscription
    if (account.account_tier !== 'pro_subscription' || account.subscription_status !== 'active') {
      return NextResponse.json({ 
        success: false, 
        error: 'No active subscription to cancel' 
      }, { status: 400 })
    }

    // Cancel subscription - set status to canceled but keep access until period ends
    const subscriptionEndsAt = account.subscription_ends_at 
      ? new Date(account.subscription_ends_at)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default to 30 days if not set

    const { error: updateError } = await supabase
      .from('user_accounts')
      .update({
        subscription_status: 'canceled',
        subscription_ends_at: subscriptionEndsAt.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error canceling subscription:', updateError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to cancel subscription' 
      }, { status: 500 })
    }

    // Update subscriptions table if exists
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(1)

    if (subscriptions && subscriptions.length > 0) {
      await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          canceled_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptions[0].id)
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription canceled successfully',
      accessUntil: subscriptionEndsAt.toISOString()
    })
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

