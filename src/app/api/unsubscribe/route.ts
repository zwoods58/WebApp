import { NextRequest, NextResponse } from 'next/server'
import { fileDb } from '@/lib/file-db'
import { productionDb } from '@/lib/production-db'

// Use production database in production, file-db in development
const db = process.env.NODE_ENV === 'production' ? productionDb : fileDb

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find the lead by email
    const leads = await db.lead.findMany()
    const lead = leads.find((l: any) => l.email === email)

    if (!lead) {
      return NextResponse.json(
        { error: 'Email not found in our system' },
        { status: 404 }
      )
    }

    // Mark as unsubscribed
    const updatedLead = await db.lead.update(lead.id, {
      unsubscribed: true,
      status: 'NOT_INTERESTED',
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from all emails',
      lead: {
        firstName: updatedLead.firstName,
        lastName: updatedLead.lastName,
        email: updatedLead.email
      }
    })

  } catch (error) {
    console.error('Error processing unsubscribe:', error)
    return NextResponse.json(
      { error: 'Failed to process unsubscribe request' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // Find the lead by email
    const leads = await db.lead.findMany()
    const lead = leads.find((l: any) => l.email === email)

    if (!lead) {
      return NextResponse.json(
        { error: 'Email not found in our system' },
        { status: 404 }
      )
    }

    // Mark as unsubscribed
    const updatedLead = await db.lead.update(lead.id, {
      unsubscribed: true,
      status: 'NOT_INTERESTED',
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from all emails',
      lead: {
        firstName: updatedLead.firstName,
        lastName: updatedLead.lastName,
        email: updatedLead.email
      }
    })

  } catch (error) {
    console.error('Error processing unsubscribe:', error)
    return NextResponse.json(
      { error: 'Failed to process unsubscribe request' },
      { status: 500 }
    )
  }
}
