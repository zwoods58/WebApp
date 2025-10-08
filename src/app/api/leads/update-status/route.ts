import { NextRequest, NextResponse } from 'next/server'
import { mockDb } from '@/lib/mock-db'

export async function PUT(request: NextRequest) {
  try {
    const { leadId, status } = await request.json()
    console.log('Updating lead status:', { leadId, status })

    if (!leadId || !status) {
      console.log('Missing required fields:', { leadId, status })
      return NextResponse.json(
        { error: 'Lead ID and status are required' },
        { status: 400 }
      )
    }

    // Get all leads before update for debugging
    const allLeads = await mockDb.lead.findMany()
    console.log('All leads before update:', allLeads.length)

    // Update the lead status in the mock database
    const updatedLead = await mockDb.lead.update({
      where: { id: leadId },
      data: { status }
    })

    console.log('Updated lead result:', updatedLead)
    console.log('Lead ID searched:', leadId)
    console.log('Status to update:', status)

    if (!updatedLead) {
      console.log('Lead not found with ID:', leadId)
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Get all leads after update for debugging
    const allLeadsAfter = await mockDb.lead.findMany()
    console.log('All leads after update:', allLeadsAfter.length)

    return NextResponse.json({ 
      success: true, 
      lead: updatedLead 
    })

  } catch (error) {
    console.error('Error updating lead status:', error)
    return NextResponse.json(
      { error: 'Failed to update lead status' },
      { status: 500 }
    )
  }
}
