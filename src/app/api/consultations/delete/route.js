import { NextResponse } from 'next/server'
const { deleteConsultation } = require('../../../../lib/consultations-storage')

export async function DELETE(req) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Consultation ID is required' },
        { status: 400 }
      )
    }

    const deleted = deleteConsultation(id)

    if (deleted) {
      return NextResponse.json({
        success: true,
        message: 'Consultation deleted successfully'
      })
    } else {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error deleting consultation:', error)
    return NextResponse.json(
      { error: 'Failed to delete consultation' },
      { status: 500 }
    )
  }
}
