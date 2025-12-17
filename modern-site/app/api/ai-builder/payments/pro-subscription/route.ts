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

// OAuth token cache (valid for 10 minutes)
let cachedToken: { token: string; expiresAt: number } | null = null

// Get or refresh OAuth token (cached for performance)
async function getFlutterwaveToken(): Promise<string> {
  // Check if cached token is still valid (with 1 minute buffer)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return cachedToken.token
  }

  // Fetch new token - try sandbox OAuth endpoint first
  // Sandbox might use different OAuth endpoint
  const oauthEndpoints = [
    'https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token',
    'https://developersandbox-idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token'
  ]
  
  let tokenResponse: Response | null = null
  let lastError: any = null
  
  for (const endpoint of oauthEndpoints) {
    try {
      console.log(`Trying OAuth endpoint: ${endpoint}`)
      tokenResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.FLUTTERWAVE_PUBLIC_KEY!,
          client_secret: process.env.FLUTTERWAVE_SECRET_KEY!,
          grant_type: 'client_credentials'
        })
      })
      
      if (tokenResponse.ok) {
        console.log(`✅ OAuth token obtained from: ${endpoint}`)
        break
      } else {
        const errorText = await tokenResponse.text()
        console.warn(`OAuth endpoint failed: ${endpoint} - ${tokenResponse.status}`)
        lastError = { endpoint, status: tokenResponse.status, error: errorText }
        continue
      }
    } catch (error: any) {
      console.warn(`OAuth endpoint error: ${endpoint} - ${error.message}`)
      lastError = error
      continue
    }
  }
  
  if (!tokenResponse || !tokenResponse.ok) {
    console.error('All OAuth endpoints failed:', lastError)
    const errorText = tokenResponse ? await tokenResponse.text() : 'No response'
    throw new Error(`Failed to get OAuth token from any endpoint: ${errorText}`)
  }

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text()
    console.error('OAuth token request failed:', {
      status: tokenResponse.status,
      statusText: tokenResponse.statusText,
      body: errorText
    })
    throw new Error(`Failed to get OAuth token: ${tokenResponse.status} ${tokenResponse.statusText}`)
  }

  const tokenData = await tokenResponse.json()
  
  if (!tokenData.access_token) {
    console.error('OAuth token response missing access_token:', tokenData)
    throw new Error(`Failed to get Flutterwave OAuth token: ${JSON.stringify(tokenData)}`)
  }

  // Cache token (expires in 10 minutes, but we'll refresh at 9 minutes)
  cachedToken = {
    token: tokenData.access_token,
    expiresAt: Date.now() + (tokenData.expires_in || 600) * 1000 - 60000 // 1 min buffer
  }

  return cachedToken.token
}

// Optimized payment initiation using REST API with sandbox
// Sandbox requires OAuth token, not Client Secret directly
async function initiatePaymentViaREST(paymentData: any) {
  try {
    // Sandbox requires OAuth token from Client ID/Secret
    console.log('Getting OAuth token for sandbox authentication...')
    const accessToken = await getFlutterwaveToken()
    
    if (!accessToken) {
      throw new Error('Failed to obtain OAuth token for sandbox')
    }

    // Try different sandbox endpoint paths
    // Sandbox API might not use /v3 prefix (based on docs showing /customers not /v3/customers)
    const sandboxEndpoints = [
      'https://developersandbox-api.flutterwave.com/payments', // No /v3 prefix
      'https://developersandbox-api.flutterwave.com/v3/payments', // With /v3 prefix
      'https://api.flutterwave.com/v3/payments' // Fallback to production endpoint
    ]
    
    console.log('Attempting payment with sandbox OAuth token...')
    
    let paymentResponse: Response | null = null
    let response: any = null
    
    for (const endpoint of sandboxEndpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`)
        paymentResponse = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentData)
        })
        
        const responseText = await paymentResponse.text()
        
        try {
          response = JSON.parse(responseText)
        } catch (e) {
          console.error('Failed to parse response:', responseText)
          continue
        }
        
        // If successful or not 404, use this response
        if (response.status === 'success' || paymentResponse.status !== 404) {
          console.log(`✅ Endpoint worked: ${endpoint}`)
          break
        } else if (paymentResponse.status === 404) {
          console.log(`❌ Endpoint returned 404: ${endpoint}, trying next...`)
          continue
        }
      } catch (error: any) {
        console.warn(`Error with endpoint ${endpoint}:`, error.message)
        continue
      }
    }
    
    if (!paymentResponse || !response) {
      throw new Error('All endpoints failed - no valid response received')
    }

    console.log('Flutterwave payment response:', {
      status: paymentResponse.status,
      responseStatus: response.status,
      message: response.message,
      hasLink: !!response.data?.link
    })

    if (response.status === 'success' && response.data?.link) {
      return NextResponse.json({
        success: true,
        paymentLink: response.data.link,
        txRef: paymentData.tx_ref
      })
    } else {
      console.error('Flutterwave payment failed:', {
        status: paymentResponse.status,
        response: response
      })
      return NextResponse.json({
        success: false,
        error: response.message || 'Failed to initialize payment',
        details: response.data || response
      }, { status: paymentResponse.status || 500 })
    }
  } catch (error: any) {
    console.error('Error in initiatePaymentViaREST:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { projectId, context } = await request.json()

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

    // Get user account (only needed fields for faster query)
    const { data: account } = await supabase
      .from('user_accounts')
      .select('id, email, full_name, phone, account_tier, subscription_status')
      .eq('id', user.id)
      .single()

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Check if already Pro (fail fast)
    if (account.account_tier === 'pro_subscription' && account.subscription_status === 'active') {
      return NextResponse.json({ 
        success: false, 
        error: 'Already subscribed to Pro' 
      }, { status: 400 })
    }

    // Create Flutterwave payment link
    const amount = 20 // $20/month
    const currency = 'USD'
    
    const paymentData = {
      tx_ref: `pro_sub_${user.id}_${Date.now()}`,
      amount: amount,
      currency: currency,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/ai-builder/payment/success?type=pro&tx_ref=${encodeURIComponent(`pro_sub_${user.id}_${Date.now()}`)}`,
      payment_options: 'card,mpesa,mobilemoney,ussd',
      customer: {
        email: account.email,
        name: account.full_name || account.email,
        phone_number: account.phone || ''
      },
      customizations: {
        title: 'AtarWebb Pro Subscription',
        description: 'Upgrade to Pro Plan - $20/month',
        logo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/favicom.png`
      },
      meta: {
        user_id: user.id,
        project_id: projectId || null,
        context: context || 'general',
        type: 'pro_subscription'
      }
    }

    // Try SDK first (might work with sandbox Client ID/Secret)
    // If SDK fails, fallback to REST API
    const flw = getFlutterwaveClient()
    if (flw && flw.Payment && typeof flw.Payment.initiate === 'function') {
      try {
        console.log('Attempting payment via Flutterwave SDK...')
        const response = await flw.Payment.initiate(paymentData)
        
        if (response.status === 'success' && response.data?.link) {
          console.log('✅ Payment initiated successfully via SDK!')
          return NextResponse.json({
            success: true,
            paymentLink: response.data.link,
            txRef: paymentData.tx_ref
          })
        } else {
          console.warn('SDK returned non-success status, trying REST API fallback...')
        }
      } catch (sdkError: any) {
        console.warn('SDK failed, trying REST API fallback:', sdkError.message)
      }
    }
    
    // Fallback to REST API
    console.log('Using REST API fallback...')
    return await initiatePaymentViaREST(paymentData)
  } catch (error: any) {
    console.error('Error initiating Pro subscription:', error)
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      response: error?.response?.data
    })
    return NextResponse.json({
      success: false,
      error: error?.message || 'Internal server error',
      details: error?.response?.data || error?.message
    }, { status: 500 })
  }
}

