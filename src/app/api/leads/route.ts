import { NextRequest, NextResponse } from 'next/server'
import { fileDb } from '@/lib/file-db'
import { productionDb } from '@/lib/production-db'

// Use production database (Supabase) for both development and production
const db = productionDb

export async function GET() {
  try {
    const leads = await db.lead.findMany()
    return NextResponse.json(leads)
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const leadData = await request.json()
    
    const newLead = await db.lead.create({
      firstName: leadData.firstName,
      lastName: leadData.lastName,
      email: leadData.email,
      phone: leadData.phone,
      company: leadData.company,
      title: leadData.title,
      source: leadData.source || 'Manual',
      industry: leadData.industry,
      website: leadData.website,
      address: leadData.address,
      city: leadData.city,
      state: leadData.state,
      zipCode: leadData.zipCode,
      timeZone: leadData.timeZone,
      status: leadData.status || 'NEW',
      statusDetail: leadData.statusDetail,
      score: leadData.score || 50,
      notes: leadData.notes,
      lastContact: leadData.lastContact,
      userId: leadData.userId || '00000000-0000-0000-0000-000000000002', // Default to sales user
      unsubscribed: leadData.unsubscribed || false
    })

    return NextResponse.json(newLead)
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    const updatedLead = await db.lead.update(id, {
      ...updateData,
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json(updatedLead)
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    await db.lead.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    )
  }
}