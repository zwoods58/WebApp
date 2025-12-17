import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase configuration missing')
  }
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Note: Stripe integration is optional
// If STRIPE_SECRET_KEY is not set, checkout will use Flutterwave instead
const stripeKey = process.env.STRIPE_SECRET_KEY

let stripe: any = null
if (stripeKey) {
  try {
    const Stripe = require('stripe')
    stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' })
  } catch (error) {
    console.warn('Stripe not available, will use Flutterwave for checkout')
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const body = await request.json()
    const { items, customerEmail, customerName, projectId } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid cart items' },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    const tax = subtotal * 0.1 // 10% tax
    const shipping = subtotal >= 100 ? 0 : 10
    const total = subtotal + tax + shipping

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        total_amount: total,
        status: 'pending',
        project_id: projectId || null,
        customer_email: customerEmail,
        customer_name: customerName,
      })
      .select()
      .single()

    if (orderError) {
      // If orders table doesn't exist, continue without saving order
      console.warn('Orders table not found, continuing without order record:', orderError)
    }

    // If Stripe is configured, use Stripe checkout
    if (stripe && order) {
      try {
        // Create order items
        const orderItems = items.map((item: any) => ({
          order_id: order.id,
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
        }))

        try {
          await supabase.from('order_items').insert(orderItems)
        } catch {
          // Table might not exist, ignore error
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: items.map((item: any) => ({
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.name,
                images: item.image ? [item.image] : [],
              },
              unit_amount: Math.round(item.price * 100), // Convert to cents
            },
            quantity: item.quantity,
          })),
          mode: 'payment',
          success_url: `${request.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${request.headers.get('origin')}/checkout/cancel`,
          customer_email: customerEmail,
          metadata: {
            order_id: order.id,
            project_id: projectId || '',
          },
        })

        // Update order with Stripe session ID
        await supabase
          .from('orders')
          .update({ payment_reference: session.id })
          .eq('id', order.id)

        return NextResponse.json({
          success: true,
          sessionId: session.id,
          url: session.url,
          orderId: order.id,
        })
      } catch (stripeError: any) {
        console.error('Stripe error:', stripeError)
        // Fall through to Flutterwave
      }
    }

    // Fallback: Use Flutterwave for checkout
    const Flutterwave = require('flutterwave-node-v3')
    const flw = new Flutterwave(
      process.env.FLUTTERWAVE_PUBLIC_KEY!,
      process.env.FLUTTERWAVE_SECRET_KEY!
    )

    const txRef = `checkout-${Date.now()}-${Math.random().toString(36).substring(7)}`
    
    const paymentData = {
      tx_ref: txRef,
      amount: total,
      currency: 'USD',
      redirect_url: `${request.headers.get('origin')}/checkout/success?session_id=${txRef}`,
      payment_options: 'card,account,ussd',
      customer: {
        email: customerEmail || 'customer@example.com',
        name: customerName || 'Customer',
      },
      customizations: {
        title: 'Checkout',
        description: 'Complete your purchase',
      },
      meta: {
        order_id: order?.id || '',
        project_id: projectId || '',
        type: 'ecommerce_checkout',
      },
    }

    const response = await flw.Payment.initiate(paymentData)

    if (response.status === 'success') {
      return NextResponse.json({
        success: true,
        sessionId: txRef,
        url: response.data.link,
        orderId: order?.id || null,
      })
    } else {
      throw new Error(response.message || 'Failed to create checkout session')
    }
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        message: error.message || 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}

