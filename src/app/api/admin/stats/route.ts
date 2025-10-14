import { NextResponse } from 'next/server'
import { fileDb } from '@/lib/file-db'
import { productionDb } from '@/lib/production-db'

// Use production database in production, file-db in development
const db = process.env.NODE_ENV === 'production' ? productionDb : fileDb

interface Lead {
  id: string
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
  lastContact?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export async function GET() {
  try {
    // Get all leads
    const allLeads: Lead[] = await db.lead.findMany()
    
    // Calculate stats
    const totalLeads = allLeads.length
    const newLeads = allLeads.filter((lead: Lead) => lead.status === 'NEW').length
    const notInterested = allLeads.filter((lead: Lead) => lead.status === 'NOT_INTERESTED').length
    const followUp = allLeads.filter((lead: Lead) => lead.status === 'FOLLOW_UP').length
    const appointments = allLeads.filter((lead: Lead) => lead.status === 'APPOINTMENT_BOOKED').length
    
    // Calculate conversion rate
    const conversionRate = totalLeads > 0 ? (appointments / totalLeads) * 100 : 0
    
    // Calculate pipeline value (assuming average deal value)
    const averageDealValue = 5000 // You can adjust this based on your business
    const pipelineValue = appointments * averageDealValue
    
    // Get recent activity (last 5 leads)
    const recentLeads = allLeads
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(lead => ({
        id: lead.id,
        type: 'lead',
        description: `New lead added: ${lead.firstName} ${lead.lastName} from ${lead.company || 'Unknown Company'}${lead.industry ? ` (${lead.industry})` : ''}`,
        user: 'Sales Rep',
        timestamp: lead.createdAt,
        status: 'info' as const
      }))

    // Calculate industry breakdown
    const industryBreakdown = allLeads.reduce((acc: any, lead: Lead) => {
      const industry = lead.industry || 'Unknown'
      acc[industry] = (acc[industry] || 0) + 1
      return acc
    }, {})

    // Calculate source breakdown
    const sourceBreakdown = allLeads.reduce((acc: any, lead: Lead) => {
      const source = lead.source || 'Import'
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {})

    // Calculate growth percentages (mock for now, but dynamic)
    const leadGrowth = totalLeads > 0 ? Math.random() * 20 - 10 : 0 // -10% to +10%
    const dealGrowth = appointments > 0 ? Math.random() * 15 + 5 : 0 // 5% to 20%
    const pipelineGrowth = pipelineValue > 0 ? Math.random() * 25 + 10 : 0 // 10% to 35%
    const conversionGrowth = conversionRate > 0 ? Math.random() * 10 - 5 : 0 // -5% to +5%

    const stats = {
      totalLeads,
      totalDeals: appointments, // Appointments are considered deals
      pipelineValue,
      conversionRate: Math.round(conversionRate * 100) / 100,
      monthlyGrowth: leadGrowth,
      weeklyGrowth: dealGrowth,
      activeUsers: 1, // You can implement user tracking
      completedTasks: 0, // You can implement task tracking
      newLeadsThisMonth: newLeads,
      dealsClosedThisMonth: appointments,
      tasksDueToday: 0,
      leadGrowth: Math.round(leadGrowth * 10) / 10,
      dealGrowth: Math.round(dealGrowth * 10) / 10,
      pipelineGrowth: Math.round(pipelineGrowth * 10) / 10,
      conversionGrowth: Math.round(conversionGrowth * 10) / 10
    }

    return NextResponse.json({
      stats,
      recentActivity: recentLeads,
      industryBreakdown,
      sourceBreakdown
    })

  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    )
  }
}
