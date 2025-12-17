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

const FLUTTERWAVE_SECRET_HASH = process.env.FLUTTERWAVE_SECRET_HASH || ''

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const body = await request.json()
    const signature = request.headers.get('verif-hash')

    // Verify webhook signature
    if (FLUTTERWAVE_SECRET_HASH && signature !== FLUTTERWAVE_SECRET_HASH) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const { event, data } = body

    // Handle successful payment
    if (event === 'charge.completed' && data.status === 'successful') {
      await handleSuccessfulPayment(data)
      return NextResponse.json({ status: 'success' })
    }

    // Handle failed payment
    if (event === 'charge.completed' && data.status === 'failed') {
      await handleFailedPayment(data)
      return NextResponse.json({ status: 'success' })
    }

    // Handle subscription renewal (if using recurring payments)
    if (event === 'subscription.charged') {
      await handleSubscriptionRenewal(data)
      return NextResponse.json({ status: 'success' })
    }

    // Handle subscription cancellation
    if (event === 'subscription.cancelled') {
      await handleSubscriptionCancellation(data)
      return NextResponse.json({ status: 'success' })
    }

    return NextResponse.json({ status: 'ignored' })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleSuccessfulPayment(data: any) {
  try {
    const txRef = data.tx_ref
    const transactionId = data.id.toString()

    // Determine payment type from tx_ref
    let type: 'pro' | 'buyout' | null = null
    let projectId: string | null = null

    if (txRef.startsWith('pro_sub_')) {
      type = 'pro'
    } else if (txRef.startsWith('buyout_')) {
      type = 'buyout'
      const parts = txRef.split('_')
      if (parts.length >= 2) {
        projectId = parts[1]
      }
    }

    if (!type) {
      console.error('Unknown payment type for tx_ref:', txRef)
      return
    }

    // Get user from transaction
    const customerEmail = data.customer?.email
    if (!customerEmail) {
      console.error('Customer email not found in webhook data')
      return
    }

    const supabase = getSupabaseClient()
    const { data: account } = await supabase
      .from('user_accounts')
      .select('id')
      .eq('email', customerEmail)
      .single()

    if (!account) {
      console.error('User not found for email:', customerEmail)
      return
    }

    if (type === 'pro') {
      // Activate Pro subscription
      const { error } = await supabase
        .from('user_accounts')
        .update({
          account_tier: 'pro_subscription',
          subscription_status: 'active',
          subscription_started_at: new Date().toISOString(),
          subscription_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', account.id)

      if (error) {
        console.error('Error updating subscription:', error)
        throw error
      }

      // Log payment
      await logPayment(account.id, transactionId, 20, 'completed', 'subscription', txRef)
    } else if (type === 'buyout' && projectId) {
      // Activate buyout
      const { error } = await supabase
        .from('draft_projects')
        .update({
          has_buyout: true,
          buyout_purchased_at: new Date().toISOString(),
          buyout_transaction_id: transactionId
        })
        .eq('id', projectId)
        .eq('user_id', account.id)

      if (error) {
        console.error('Error updating buyout:', error)
        throw error
      }

      // Log payment
      await logPayment(account.id, transactionId, 150, 'completed', 'buyout', txRef, projectId)
    }
  } catch (error) {
    console.error('Error handling successful payment:', error)
    throw error
  }
}

async function handleFailedPayment(data: any) {
  try {
    const supabase = getSupabaseClient()
    const txRef = data.tx_ref
    const transactionId = data.id.toString()
    const customerEmail = data.customer?.email

    if (!customerEmail) return

    const { data: account } = await supabase
      .from('user_accounts')
      .select('id')
      .eq('email', customerEmail)
      .single()

    if (!account) return

    // Determine payment type
    let type: 'pro' | 'buyout' = 'pro'
    let projectId: string | null = null
    let amount = 20

    if (txRef.startsWith('buyout_')) {
      type = 'buyout'
      amount = 150
      const parts = txRef.split('_')
      if (parts.length >= 2) {
        projectId = parts[1]
      }
    }

    // Log failed payment
    await logPayment(account.id, transactionId, amount, 'failed', type === 'pro' ? 'subscription' : 'buyout', txRef, projectId || undefined)

    // If subscription payment failed, set grace period
    if (type === 'pro') {
      const { data: userAccount } = await supabase
        .from('user_accounts')
        .select('subscription_status, subscription_ends_at')
        .eq('id', account.id)
        .single()

      if (userAccount?.subscription_status === 'active') {
        // Set grace period (7 days)
        const gracePeriodEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        await supabase
          .from('user_accounts')
          .update({
            subscription_status: 'past_due',
            subscription_ends_at: gracePeriodEnd.toISOString()
          })
          .eq('id', account.id)
      }
    }
  } catch (error) {
    console.error('Error handling failed payment:', error)
  }
}

async function handleSubscriptionRenewal(data: any) {
  try {
    const supabase = getSupabaseClient()
    const subscriptionId = data.subscription_id
    const transactionId = data.id.toString()
    const customerEmail = data.customer?.email

    if (!customerEmail) return

    const { data: account } = await supabase
      .from('user_accounts')
      .select('id')
      .eq('email', customerEmail)
      .single()

    if (!account) return

    // Renew subscription
    const { error } = await supabase
      .from('user_accounts')
      .update({
        subscription_status: 'active',
        subscription_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        last_payment_at: new Date().toISOString()
      })
      .eq('id', account.id)

    if (error) {
      console.error('Error renewing subscription:', error)
      return
    }

    // Log payment
    await logPayment(account.id, transactionId, 20, 'completed', 'subscription', `renewal_${subscriptionId}`)
  } catch (error) {
    console.error('Error handling subscription renewal:', error)
  }
}

async function handleSubscriptionCancellation(data: any) {
  try {
    const supabase = getSupabaseClient()
    const customerEmail = data.customer?.email

    if (!customerEmail) return

    const { data: account } = await supabase
      .from('user_accounts')
      .select('id, subscription_ends_at')
      .eq('email', customerEmail)
      .single()

    if (!account) return

    // Cancel subscription but keep access until period ends
    const subscriptionEndsAt = account.subscription_ends_at 
      ? new Date(account.subscription_ends_at)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    await supabase
      .from('user_accounts')
      .update({
        subscription_status: 'canceled',
        subscription_ends_at: subscriptionEndsAt.toISOString()
      })
      .eq('id', account.id)
  } catch (error) {
    console.error('Error handling subscription cancellation:', error)
  }
}

async function logPayment(
  userId: string,
  transactionId: string,
  amount: number,
  status: string,
  type: string,
  txRef: string,
  projectId?: string
) {
  try {
    const supabase = getSupabaseClient()
    await supabase
      .from('payments')
      .insert({
        user_id: userId,
        transaction_id: transactionId,
        amount: amount,
        status: status,
        payment_type: type,
        tx_ref: txRef,
        project_id: projectId || null,
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Error logging payment:', error)
  }
}
