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

export async function GET(request: NextRequest) {
  // Verify cron secret (if using Vercel Cron)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getSupabaseClient()
    // Find subscriptions expiring in 7 days
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    const now = new Date().toISOString()

    const { data: expiringSoon } = await supabase
      .from('user_accounts')
      .select('id, email, subscription_ends_at')
      .eq('account_tier', 'pro_subscription')
      .eq('subscription_status', 'active')
      .gte('subscription_ends_at', now)
      .lte('subscription_ends_at', sevenDaysFromNow)

    // Find expired subscriptions
    const { data: expired } = await supabase
      .from('user_accounts')
      .select('id, email')
      .eq('account_tier', 'pro_subscription')
      .eq('subscription_status', 'active')
      .lt('subscription_ends_at', now)

    // Downgrade expired subscriptions
    if (expired && expired.length > 0) {
      for (const account of expired) {
        await supabase
          .from('user_accounts')
          .update({
            account_tier: 'default_draft',
            subscription_status: 'expired',
            updated_at: new Date().toISOString()
          })
          .eq('id', account.id)

        // Update subscriptions table
        await supabase
          .from('subscriptions')
          .update({
            status: 'expired',
            ended_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', account.id)
          .eq('status', 'active')
      }
    }

    return NextResponse.json({
      success: true,
      expiringSoon: expiringSoon?.length || 0,
      expired: expired?.length || 0,
      downgraded: expired?.length || 0
    })
  } catch (error) {
    console.error('Error checking subscriptions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

