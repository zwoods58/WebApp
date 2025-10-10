import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/mock-db'

export async function GET() {
  try {
    const [totalLeads, totalTasks] = await Promise.all([
      mockDb.lead.count(),
      mockDb.task.count()
    ])

    // Calculate conversion rate (mock data for now)
    const conversionRate = totalLeads > 0 ? Math.round((Math.min(totalLeads * 0.3, 10) / totalLeads) * 100) : 0

    return NextResponse.json({
      totalLeads,
      totalCalls: 0, // Mock data
      totalDeals: Math.min(totalLeads * 0.3, 10), // Mock data
      totalTasks,
      conversionRate
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

