import { NextResponse } from 'next/server'
import { updateDashboardMetrics } from '@/lib/automation/analytics'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[CRON] Running dashboard metrics update...')
    await updateDashboardMetrics()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Dashboard metrics updated',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[CRON] Metrics update error:', error)
    return NextResponse.json(
      { error: 'Failed to update metrics' },
      { status: 500 }
    )
  }
}

