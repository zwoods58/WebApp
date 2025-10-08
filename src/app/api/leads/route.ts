import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/mock-db'

export async function GET() {
  try {
    const leads = await mockDb.lead.findMany()
    return NextResponse.json(leads)
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const leadData = await request.json()
    
    const newLead = await mockDb.lead.create({
      data: {
        firstName: leadData.firstName,
        lastName: leadData.lastName,
        email: leadData.email,
        phone: leadData.phone,
        company: leadData.company,
        title: leadData.title,
        source: leadData.source || 'Manual Entry',
        status: leadData.status || 'NEW',
        score: leadData.score || 50,
        notes: leadData.notes,
        userId: leadData.userId || '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    })

    return NextResponse.json(newLead, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}