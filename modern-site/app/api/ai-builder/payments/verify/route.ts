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
    const { txRef, type, projectId } = await request.json()

    if (!txRef || !type) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    // Try SDK first, then REST API with sandbox endpoint
    let response: any
    
    const flw = getFlutterwaveClient()
    if (flw && flw.Transaction && typeof flw.Transaction.verify === 'function') {
      try {
        response = await flw.Transaction.verify({ tx_ref: txRef })
        if (response.status === 'success') {
          // Continue with verification logic below
        } else {
          throw new Error('SDK verification failed')
        }
      } catch (error) {
        console.warn('SDK failed, trying REST API...')
        // Fall through to REST API
      }
    }
    
    // Fallback to REST API with sandbox endpoint
    if (!response || response.status !== 'success') {
      const secretKey = process.env.FLUTTERWAVE_SECRET_KEY
      const verifyResponse = await fetch(`https://developersandbox-api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${txRef}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        }
      })
      response = await verifyResponse.json()
    }

    if (response.status !== 'success' || response.data.status !== 'successful') {
      return NextResponse.json({
        success: false,
        error: 'Payment verification failed',
        details: response
      }, { status: 400 })
    }

    const transaction = response.data

    // Get user from transaction metadata or by email
    let userId: string | null = null

    if (transaction.customer?.email) {
      const { data: account } = await supabase
        .from('user_accounts')
        .select('id')
        .eq('email', transaction.customer.email)
        .single()

      if (account) {
        userId = account.id
      }
    }

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    if (type === 'pro') {
      // Activate Pro subscription
      const { error } = await supabase
        .from('user_accounts')
        .update({
          account_tier: 'pro_subscription',
          subscription_status: 'active',
          subscription_started_at: new Date().toISOString(),
          subscription_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        })
        .eq('id', userId)

      if (error) {
        console.error('Error updating subscription:', error)
        return NextResponse.json({
          success: false,
          error: 'Failed to activate subscription'
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Pro subscription activated'
      })
    } else if (type === 'buyout' && projectId) {
      // Activate buyout for project
      const { error } = await supabase
        .from('draft_projects')
        .update({
          has_buyout: true,
          buyout_purchased_at: new Date().toISOString(),
          buyout_transaction_id: transaction.id.toString()
        })
        .eq('id', projectId)
        .eq('user_id', userId)

      if (error) {
        console.error('Error updating buyout:', error)
        return NextResponse.json({
          success: false,
          error: 'Failed to activate buyout'
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Buyout activated'
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid payment type'
    }, { status: 400 })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

