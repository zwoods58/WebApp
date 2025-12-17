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
  
  return new Flutterwave(publicKey, secretKey)
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { projectId } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
    }

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

    // Verify project belongs to user
    const { data: project, error: projectError } = await supabase
      .from('draft_projects')
      .select('id, user_id, has_buyout')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if already bought out
    if (project.has_buyout) {
      return NextResponse.json({ 
        success: false, 
        error: 'This project already has buyout access' 
      }, { status: 400 })
    }

    // Get user account
    const { data: account } = await supabase
      .from('user_accounts')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Create Flutterwave payment link
    const amount = 150 // $150 one-time
    const currency = 'USD'
    
    const paymentData = {
      tx_ref: `buyout_${projectId}_${Date.now()}`,
      amount: amount,
      currency: currency,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/ai-builder/payment/success?type=buyout&project_id=${projectId}&tx_ref=${encodeURIComponent(`buyout_${projectId}_${Date.now()}`)}`,
      payment_options: 'card,mpesa,mobilemoney,ussd',
      customer: {
        email: account.email,
        name: account.full_name || account.email,
        phone_number: account.phone || ''
      },
      customizations: {
        title: 'AtarWebb Code Buyout',
        description: 'Purchase code ownership for this project - $150 one-time',
        logo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/favicom.png`
      },
      meta: {
        user_id: user.id,
        project_id: projectId,
        type: 'buyout'
      }
    }

    // Try SDK first, then REST API with sandbox endpoint
    let response: any
    
    const flw = getFlutterwaveClient()
    if (flw && flw.Payment && typeof flw.Payment.initiate === 'function') {
      try {
        response = await flw.Payment.initiate(paymentData)
        if (response.status === 'success') {
          return NextResponse.json({
            success: true,
            paymentLink: response.data.link,
            txRef: paymentData.tx_ref
          })
        }
      } catch (error) {
        console.warn('SDK failed, trying REST API...')
      }
    }
    
    // Fallback to REST API with sandbox endpoint
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY
    const paymentResponse = await fetch('https://developersandbox-api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    })
    
    response = await paymentResponse.json()

    if (response.status === 'success') {
      return NextResponse.json({
        success: true,
        paymentLink: response.data.link,
        txRef: paymentData.tx_ref
      })
    } else {
      console.error('Flutterwave payment initiation failed:', response)
      return NextResponse.json({
        success: false,
        error: response.message || 'Failed to initialize payment',
        details: response.data
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error initiating buyout:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

