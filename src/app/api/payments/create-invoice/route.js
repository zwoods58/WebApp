import { NextResponse } from 'next/server'
import { stripe, calculateApplicationFee } from '../../../../lib/stripe'
const { getConsultationById, updateConsultation } = require('../../../../lib/consultations-storage')

export async function POST(req) {
  try {
    const { consultationId } = await req.json()

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

    if (consultation.paymentStatus !== 'deposit_paid') {
      return NextResponse.json(
        { error: 'Deposit must be paid before creating invoice' },
        { status: 400 }
      )
    }

    const { remainingAmount, clientEmail, clientName, serviceType } = consultation
    const applicationFee = calculateApplicationFee(remainingAmount)

    // Create invoice
    const invoice = await stripe.invoices.create({
      customer_email: clientEmail,
      description: `Final payment for ${serviceType} - ${clientName}`,
      metadata: {
        consultationId,
        clientEmail,
        clientName,
        serviceType,
        type: 'final_payment'
      },
      collection_method: 'send_invoice',
      days_until_due: 7
    })

    // Add invoice item
    await stripe.invoiceItems.create({
      invoice: invoice.id,
      amount: remainingAmount,
      currency: 'usd',
      description: `Remaining balance for ${serviceType}`,
    })

    // Finalize and send invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id)
    await stripe.invoices.sendInvoice(invoice.id)

    // Update consultation with invoice details
    updateConsultation(consultationId, {
      invoiceId: invoice.id,
      invoiceStatus: 'sent',
      invoiceSentAt: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      invoiceId: invoice.id,
      invoiceUrl: finalizedInvoice.hosted_invoice_url,
      amount: remainingAmount
    })

  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    )
  }
}
