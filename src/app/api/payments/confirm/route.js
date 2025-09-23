import { NextResponse } from 'next/server'
import { confirmPaymentIntent } from '../../../../lib/stripe.js'
import { validateRequest, paymentSchemas } from '../../../../lib/validation.js'
import { requireAuth } from '../../../../lib/auth.js'
import { rateLimit, getClientIP } from '../../../../lib/security.js'

// Rate limiting: 5 requests per minute per IP
const rateLimitCheck = rateLimit(5, 60000)

export async function POST(req) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(req)
    
    // Check rate limit
    const rateLimitResult = rateLimitCheck(clientIP)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many requests',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
          }
        }
      )
    }

    // Parse request body
    const body = await req.json()
    
    // Validate input
    const { error, value } = validateRequest(paymentSchemas.confirmPayment)(body)
    if (error) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.details },
        { status: 400 }
      )
    }

    const { paymentIntentId, paymentMethodId } = value

    // Confirm payment intent
    const result = await confirmPaymentIntent(paymentIntentId, paymentMethodId)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to confirm payment', details: result.error },
        { status: 500 }
      )
    }

    // Return success response
    return NextResponse.json({
      success: true,
      paymentIntent: result.paymentIntent
    })

  } catch (error) {
    console.error('Confirm payment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(req) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
