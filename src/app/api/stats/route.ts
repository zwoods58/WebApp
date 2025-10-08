import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/mock-db'

export async function GET() {
  try {
    const [totalLeads, totalCalls, totalDeals] = await Promise.all([
      mockDb.lead.count(),
      mockDb.call.count(),
      mockDb.deal.count()
    ])

    // Calculate conversion rate (leads that became deals)
    const conversionRate = totalLeads > 0 ? Math.round((totalDeals / totalLeads) * 100) : 0

    return NextResponse.json({
      totalLeads,
      totalCalls,
      totalDeals,
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

export async function GET() {
  try {
    const [totalLeads, totalCalls, totalDeals] = await Promise.all([
      mockDb.lead.count(),
      mockDb.call.count(),
      mockDb.deal.count()
    ])

    // Calculate conversion rate (leads that became deals)
    const conversionRate = totalLeads > 0 ? Math.round((totalDeals / totalLeads) * 100) : 0

    return NextResponse.json({
      totalLeads,
      totalCalls,
      totalDeals,
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

