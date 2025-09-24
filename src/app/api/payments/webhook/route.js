import { NextResponse } from 'next/server'
import { stripe } from '../../../../lib/stripe'
const { updateConsultation } = require('../../../../lib/consultations-storage')

export async function POST(req) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        const { consultationId, paymentType, clientName, clientEmail } = session.metadata

        if (paymentType === 'final') {
          // Final payment - mark as fully paid
          updateConsultation(consultationId, {
            status: 'fully_paid',
            paymentStatus: 'fully_paid',
            finalPaymentAt: new Date().toISOString(),
            stripeSessionId: session.id
          })

          console.log('Final payment completed via checkout:', {
            consultationId: intentConsultationId,
            clientName,
            amount: session.amount_total / 100,
            sessionId: session.id
          })
        } else {
          // Deposit payment - mark as deposit paid
          updateConsultation(consultationId, {
            status: 'paid_deposit',
            paymentStatus: 'deposit_paid',
            paidAt: new Date().toISOString(),
            stripeSessionId: session.id
          })

          console.log('Deposit payment completed via checkout:', {
            consultationId: intentConsultationId,
            clientName,
            amount: session.amount_total / 100,
            sessionId: session.id
          })
        }
        break

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        const { consultationId: intentConsultationId, clientEmail: intentClientEmail, clientName: intentClientName, serviceType, totalAmount, depositAmount, remainingAmount, type } = paymentIntent.metadata

        if (type === 'final_payment') {
          // Final payment - mark as fully paid
          const updatedConsultation = updateConsultation(intentConsultationId, {
            status: 'fully_paid',
            paymentIntentId: paymentIntent.id,
            paymentStatus: 'fully_paid',
            finalPaymentAt: new Date().toISOString()
          })

          console.log('Final payment succeeded:', {
            consultationId: intentConsultationId,
            clientName,
            amount: paymentIntent.amount,
            paymentIntentId: paymentIntent.id
          })
        } else {
          // Deposit payment - mark as deposit paid
          const updatedConsultation = updateConsultation(intentConsultationId, {
            status: 'paid_deposit',
            paymentIntentId: paymentIntent.id,
            depositAmount: parseInt(depositAmount),
            remainingAmount: parseInt(remainingAmount),
            totalAmount: parseInt(totalAmount),
            paymentStatus: 'deposit_paid',
            paidAt: new Date().toISOString()
          })

          console.log('Deposit payment succeeded:', {
            consultationId: intentConsultationId,
            clientName,
            amount: depositAmount,
            paymentIntentId: paymentIntent.id
          })
        }

        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        const { consultationId: failedConsultationId } = failedPayment.metadata

        // Update consultation status to 'payment_failed'
        updateConsultation(failedConsultationId, {
          status: 'payment_failed',
          paymentStatus: 'failed',
          paymentError: failedPayment.last_payment_error?.message || 'Payment failed'
        })

        console.log('Payment failed:', {
          consultationId: failedConsultationId,
          error: failedPayment.last_payment_error?.message
        })

        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object
        const { consultationId: invoiceConsultationId } = invoice.metadata

        // Update consultation status to 'fully_paid'
        updateConsultation(invoiceConsultationId, {
          status: 'fully_paid',
          paymentStatus: 'fully_paid',
          finalPaymentAt: new Date().toISOString()
        })

        console.log('Final payment succeeded:', {
          consultationId: invoiceConsultationId,
          amount: invoice.amount_paid
        })

        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
