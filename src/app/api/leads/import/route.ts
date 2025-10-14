import { NextResponse } from 'next/server'
import { fileDb } from '@/lib/file-db'
import { productionDb } from '@/lib/production-db'
import { processNewLead } from '@/lib/automation/lead-management'

// Use production database (Supabase) for both development and production
const db = productionDb

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
    const formData = await request.formData()
    const file = formData.get('file') as File
    const assignedTo = formData.get('assignedTo') as string || 'sales'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Parse CSV file
    const csvText = await file.text()
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim())
    const leads: Lead[] = []

    // Parse CSV data
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      const values: string[] = []
      let current = ''
      let inQuotes = false
      
      // Parse CSV line handling quoted fields
      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim()) // Add the last field
      
      if (values.length === headers.length) {
        const lead: any = {}
        headers.forEach((header, index) => {
          const value = values[index]
          switch (header.toLowerCase()) {
            case 'firstname':
              lead.firstName = value || ''
              break
            case 'lastname':
              lead.lastName = value || ''
              break
            case 'name':
              const nameParts = value.split(' ')
              lead.firstName = nameParts[0] || ''
              lead.lastName = nameParts.slice(1).join(' ') || ''
              break
            case 'email':
              lead.email = value
              break
            case 'phone':
              lead.phone = value
              break
            case 'company':
              lead.company = value
              break
            case 'industry':
              lead.industry = value
              break
            case 'website':
              lead.website = value
              break
            default:
              lead[header.toLowerCase()] = value
          }
        })
        
        // Set default values
        lead.status = 'NEW'
        lead.score = 50
        lead.source = 'Import'
        lead.userId = assignedTo === 'sales' ? '2' : '1'
        lead.unsubscribed = false
        
        leads.push(lead)
      }
    }

    if (leads.length === 0) {
      return NextResponse.json(
        { error: 'No valid leads found in CSV' },
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
          const existingLead = await db.lead.findUnique({ where: { email: leadData.email } })
          
          if (existingLead) {
            duplicates++
            continue
          }
        }

        // Create new lead
        const userId = assignedTo === 'sales' ? '00000000-0000-0000-0000-000000000002' : '00000000-0000-0000-0000-000000000001'
        
        console.log('Creating lead with data:', {
          firstName: leadData.firstName,
          lastName: leadData.lastName,
          email: leadData.email,
          userId: userId
        })
        
        const newLead = await db.lead.create({
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
          userId: userId, // Use proper UUID
          unsubscribed: false // Default to not unsubscribed
        })
        
        console.log('Lead created successfully:', newLead.id)

        imported++
        
        // 🤖 AUTOMATION: Process new lead (score, assign, welcome email, create task)
        await processNewLead(newLead.id)
        
      } catch (error) {
        console.error('Import error for lead:', leadData, 'Error:', error)
        errors.push(`Failed to import ${leadData.firstName} ${leadData.lastName}: ${error instanceof Error ? error.message : String(error)}`)
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

