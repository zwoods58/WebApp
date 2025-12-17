import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Flutterwave from 'flutterwave-node-v3'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing')
  }
  return createClient(supabaseUrl, supabaseKey)
}

// Lazy initialization of Flutterwave SDK
function getFlutterwaveClient() {
  const publicKey = process.env.FLUTTERWAVE_PUBLIC_KEY
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY
  
  if (!publicKey || !secretKey) {
    return null
  }
  
  try {
    return new Flutterwave(publicKey, secretKey)
  } catch (error) {
    console.error('Failed to initialize Flutterwave SDK:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { transactionId, reason } = await request.json()

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID required' }, { status: 400 })
    }

    // Get current user (admin only)
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

    // Check if user is admin
    const { data: account } = await supabase
      .from('user_accounts')
      .select('account_tier')
      .eq('id', user.id)
      .single()

    if (account?.account_tier !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get payment details
    const { data: payment } = await supabase
      .from('payments')
      .select('*')
      .eq('transaction_id', transactionId)
      .single()

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Process refund through Flutterwave
    const refundData = {
      transaction_id: transactionId,
      amount: payment.amount,
      comments: reason || 'Refund requested by admin'
    }

    const flw = getFlutterwaveClient()
    if (!flw) {
      return NextResponse.json({ error: 'Flutterwave not configured' }, { status: 500 })
    }

    const response = await flw.Refund.create(refundData)

    if (response.status === 'success') {
      // Update payment status
      await supabase
        .from('payments')
        .update({
          status: 'refunded',
          refunded_at: new Date().toISOString(),
          refund_reason: reason || null
        })
        .eq('transaction_id', transactionId)

      // If subscription payment, downgrade user
      if (payment.payment_type === 'subscription') {
        await supabase
          .from('user_accounts')
          .update({
            account_tier: 'default_draft',
            subscription_status: 'expired'
          })
          .eq('id', payment.user_id)
      }

      return NextResponse.json({
        success: true,
        message: 'Refund processed successfully',
        refundId: response.data.id
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to process refund'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error processing refund:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

