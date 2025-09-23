import { NextResponse } from 'next/server'
const { getConsultations } = require('../../../lib/consultations-storage')

export async function GET() {
  try {
    const consultations = getConsultations()
    return NextResponse.json({
      success: true,
      consultations
    })
  } catch (error) {
    console.error('Error fetching consultations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch consultations' },
      { status: 500 }
    )
  }
}
