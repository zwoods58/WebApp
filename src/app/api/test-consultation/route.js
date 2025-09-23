import { NextResponse } from 'next/server'
const { addConsultation } = require('../../../lib/consultations-storage')

export async function POST(req) {
  try {
    const body = await req.json()
    console.log('Received consultation data:', body)
    
    // Store consultation data
    const storedConsultation = addConsultation({
      name: body.name,
      email: body.email,
      company: body.company,
      projectType: body.projectType,
      budget: body.budget,
      timeline: body.timeline,
      preferredDate: body.preferredDate,
      preferredTime: body.preferredTime,
      message: body.message,
      hasFileUpload: false
    })
    
    console.log('Stored consultation:', storedConsultation)
    
    return NextResponse.json({
      success: true,
      message: 'Test consultation stored successfully',
      consultationId: storedConsultation.id
    })
  } catch (error) {
    console.error('Test consultation error:', error)
    return NextResponse.json(
      { error: 'Failed to store test consultation', details: error.message },
      { status: 500 }
    )
  }
}
