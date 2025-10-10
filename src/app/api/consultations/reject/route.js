import { NextResponse } from 'next/server'
const { rejectConsultation } = require('../../../../lib/consultations-storage')

export async function POST(req) {
  try {
    const { id } = await req.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Consultation ID is required' },
        { status: 400 }
      )
    }

    const updatedConsultation = rejectConsultation(id)
    
    if (!updatedConsultation) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Consultation rejected successfully',
      consultation: updatedConsultation
    })
  } catch (error) {
    console.error('Error rejecting consultation:', error)
    return NextResponse.json(
      { error: 'Failed to reject consultation' },
      { status: 500 }
    )
  }
}
