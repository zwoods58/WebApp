import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/mock-db'

export async function DELETE() {
  try {
    // Clear all leads from the database
    await mockDb.lead.deleteMany()
    
    return NextResponse.json({
      success: true,
      message: 'All leads have been cleared successfully',
      cleared: true
    })

  } catch (error) {
    console.error('Clear leads error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to clear leads',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
