import { NextResponse } from 'next/server'
const { getConsultationById } = require('../../../../lib/consultations-storage')

export async function GET(req, { params }) {
  try {
    const { id } = params
    
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

    return NextResponse.json({
      success: true,
      consultation
    })
  } catch (error) {
    console.error('Error fetching consultation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch consultation' },
      { status: 500 }
    )
  }
}
