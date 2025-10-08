import { NextResponse } from 'next/server'
import { stripe } from '../../../../lib/stripe'
const { getConsultationById } = require('../../../../lib/consultations-storage')

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const consultationId = searchParams.get('consultationId')

    if (!consultationId) {
      return NextResponse.json(
        { error: 'Consultation ID is required' },
        { status: 400 }
      )
    }

    // Get consultation details
    const consultation = getConsultationById(consultationId)
    if (!consultation) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      )
    }

    let paymentIntent = null
    let invoice = null

    // Get payment intent details if exists
    if (consultation.paymentIntentId) {
      try {
        paymentIntent = await stripe.paymentIntents.retrieve(consultation.paymentIntentId)
      } catch (error) {
        console.error('Error retrieving payment intent:', error)
      }
    }

    // Get invoice details if exists
    if (consultation.invoiceId) {
      try {
        invoice = await stripe.invoices.retrieve(consultation.invoiceId)
      } catch (error) {
        console.error('Error retrieving invoice:', error)
      }
    }

    return NextResponse.json({
      success: true,
      consultation: {
        id: consultation.id,
        status: consultation.status,
        paymentStatus: consultation.paymentStatus,
        totalAmount: consultation.totalAmount,
        depositAmount: consultation.depositAmount,
        remainingAmount: consultation.remainingAmount,
        paidAt: consultation.paidAt,
        paymentError: consultation.paymentError
      },
      paymentIntent: paymentIntent ? {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        created: paymentIntent.created
      } : null,
      invoice: invoice ? {
        id: invoice.id,
        status: invoice.status,
        amount: invoice.amount_due,
        hosted_invoice_url: invoice.hosted_invoice_url,
        created: invoice.created
      } : null
    })

  } catch (error) {
    console.error('Error checking payment status:', error)
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    )
  }
}
