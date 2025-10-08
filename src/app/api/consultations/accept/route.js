import { NextResponse } from 'next/server'
const { acceptConsultation, getConsultationById } = require('../../../../lib/consultations-storage')

export async function POST(req) {
  try {
    const { id } = await req.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Consultation ID is required' },
        { status: 400 }
      )
    }

    const consultation = getConsultationById(id)
    
    if (!consultation) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      )
    }

    // Calculate amounts if not already set
    const totalAmount = consultation.totalAmount || 1000
    const depositAmount = Math.round(totalAmount * 0.5)
    const remainingAmount = totalAmount - depositAmount

    // Update consultation with calculated amounts
    const updatedConsultation = acceptConsultation(id, {
      totalAmount,
      depositAmount,
      remainingAmount,
      paymentStatus: 'pending'
    })

    if (updatedConsultation) {
      return NextResponse.json({
        success: true,
        message: 'Consultation accepted successfully',
        consultation: updatedConsultation
      })
    } else {
      return NextResponse.json(
        { error: 'Consultation not found or failed to update' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error accepting consultation:', error)
    return NextResponse.json(
      { error: 'Failed to accept consultation' },
      { status: 500 }
    )
  }
}
