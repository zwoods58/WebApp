import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/mock-db'

interface Lead {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
  title?: string
  source?: string
  industry?: string
  website?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  timeZone?: string
  status: 'NEW' | 'NOT_INTERESTED' | 'FOLLOW_UP' | 'QUALIFIED' | 'APPOINTMENT_BOOKED' | 'CLOSED_WON'
  statusDetail?: string
  score: number
  notes?: string
}

export async function POST(request: Request) {
  try {
    const { leads, assignedTo = 'sales' } = await request.json()

    if (!leads || !Array.isArray(leads)) {
      return NextResponse.json(
        { error: 'Invalid leads data' },
        { status: 400 }
      )
    }

    let imported = 0
    let duplicates = 0
    const errors: string[] = []

    // Process each lead
    for (const leadData of leads) {
      try {
        // Check for duplicates by email
        if (leadData.email) {
          const existingLead = await mockDb.lead.findUnique({
            where: { email: leadData.email }
          })
          
          if (existingLead) {
            duplicates++
            continue
          }
        }

        // Create new lead
        const newLead = await mockDb.lead.create({
          data: {
            firstName: leadData.firstName,
            lastName: leadData.lastName,
            email: leadData.email,
            phone: leadData.phone,
            company: leadData.company,
            title: leadData.title,
            source: leadData.source || 'Import',
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
            userId: assignedTo === 'sales' ? '2' : '1', // Assign to sales user (ID: 2)
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        })

        imported++
      } catch (error) {
        errors.push(`Failed to import ${leadData.firstName} ${leadData.lastName}: ${error}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${imported} leads and assigned to sales team`,
      imported,
      duplicates,
      errors
    })

  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: 'Failed to import leads' },
      { status: 500 }
    )
  }
}

