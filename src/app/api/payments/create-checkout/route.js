import { NextResponse } from 'next/server'
import { stripe } from '../../../../lib/stripe'
const { getConsultationById } = require('../../../../lib/consultations-storage')

export async function POST(req) {
  try {
    const { consultationId, paymentType = 'deposit' } = await req.json()
    
    if (!consultationId) {
      return NextResponse.json(
        { error: 'Consultation ID is required' },
        { status: 400 }
      )
    }

    const consultation = getConsultationById(consultationId)
    
    if (!consultation) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      )
    }

    let amount, description, successUrl, cancelUrl

    if (paymentType === 'final') {
      amount = consultation.remainingAmount || 500
      description = `Final payment for ${consultation.projectDetails || 'Web Development'}`
      successUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment-success?consultationId=${consultationId}&type=final`
      cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment?consultationId=${consultationId}&type=final`
    } else {
      amount = consultation.depositAmount || 500
      description = `Deposit for ${consultation.projectDetails || 'Web Development'}`
      successUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment-success?consultationId=${consultationId}`
      cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment?consultationId=${consultationId}`
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: description,
              description: `Project: ${consultation.projectDetails || 'Custom Web Development'}`,
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: consultation.email,
      metadata: {
        consultationId,
        clientName: consultation.name,
        clientEmail: consultation.email,
        serviceType: consultation.serviceType || 'Web Development',
        paymentType,
        totalAmount: consultation.totalAmount?.toString() || '1000',
        depositAmount: consultation.depositAmount?.toString() || '500',
        remainingAmount: consultation.remainingAmount?.toString() || '500'
      },
    })

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id
    })

  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
