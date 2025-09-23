import { NextResponse } from 'next/server'
import { stripe, PAYMENT_CONFIG, calculateDeposit, calculateApplicationFee } from '../../../../lib/stripe'

export async function POST(req) {
  try {
    const { amount, consultationId, clientEmail, clientName, serviceType, paymentType = 'deposit' } = await req.json()

    // Validate required fields
    if (!amount || !consultationId || !clientEmail || !clientName || !serviceType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let paymentAmount, description, metadata

    if (paymentType === 'final') {
      // For final payment, use the remaining amount
      paymentAmount = amount
      description = `Final payment for ${serviceType} - ${clientName}`
      metadata = {
        consultationId,
        clientEmail,
        clientName,
        serviceType,
        totalAmount: amount.toString(),
        type: 'final_payment'
      }
    } else {
      // For deposit payment, calculate 50% of total
      paymentAmount = calculateDeposit(amount)
      description = `Deposit for ${serviceType} - ${clientName}`
      metadata = {
        consultationId,
        clientEmail,
        clientName,
        serviceType,
        totalAmount: amount.toString(),
        depositAmount: paymentAmount.toString(),
        remainingAmount: (amount - paymentAmount).toString(),
        type: 'deposit'
      }
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: paymentAmount,
      currency: PAYMENT_CONFIG.currency,
      metadata,
      description,
      receipt_email: clientEmail,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      paymentAmount,
      paymentType
    })

  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}