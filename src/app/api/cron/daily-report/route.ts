import { NextResponse } from 'next/server'
import { generateDailyReport } from '@/lib/automation/analytics'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[CRON] Generating daily report...')
    await generateDailyReport()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Daily report generated',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[CRON] Daily report error:', error)
    return NextResponse.json(
      { error: 'Failed to generate daily report' },
      { status: 500 }
    )
  }
}

