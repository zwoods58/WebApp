import { NextResponse } from 'next/server'
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

    const consultation = getConsultationById(consultationId)
    
    if (!consultation) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      )
    }

    if (consultation.status !== 'accepted') {
      return NextResponse.json(
        { error: 'Project must be accepted before completion' },
        { status: 400 }
      )
    }

    // Update consultation status to completed
    const updatedConsultation = updateConsultation(consultationId, {
      status: 'completed',
      completedAt: new Date().toISOString()
    })

    if (updatedConsultation) {
      return NextResponse.json({
        success: true,
        message: 'Project completed successfully',
        consultation: updatedConsultation
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to update consultation' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error completing project:', error)
    return NextResponse.json(
      { error: 'Failed to complete project' },
      { status: 500 }
    )
  }
}
