import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/mock-db'

export async function POST() {
  try {
    // Clear existing leads
    const existingLeads = await mockDb.lead.findMany()
    
    // Return empty response - no mock data
    return NextResponse.json({
      success: true,
      message: 'Mock data cleared - CRM is now empty',
      count: 0
    })

  } catch (error) {
    console.error('Error clearing leads:', error)
    return NextResponse.json(
      { error: 'Failed to clear leads' },
      { status: 500 }
    )
  }
}
