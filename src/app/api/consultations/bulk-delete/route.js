import { NextResponse } from 'next/server'
const { deleteConsultation } = require('../../../../lib/consultations-storage')

export async function POST(req) {
  try {
    const { ids } = await req.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Array of consultation IDs is required' },
        { status: 400 }
      )
    }

    const results = {
      deleted: [],
      failed: []
    }

    for (const id of ids) {
      const deleted = deleteConsultation(id)
      if (deleted) {
        results.deleted.push(id)
      } else {
        results.failed.push(id)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${results.deleted.length} consultations`,
      deleted: results.deleted,
      failed: results.failed
    })

  } catch (error) {
    console.error('Error bulk deleting consultations:', error)
    return NextResponse.json(
      { error: 'Failed to bulk delete consultations' },
      { status: 500 }
    )
  }
}
