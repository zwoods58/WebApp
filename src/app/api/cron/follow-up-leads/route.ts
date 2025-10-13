import { NextResponse } from 'next/server'
import { followUpStaleLeads } from '@/lib/automation/lead-management'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[CRON] Running follow-up automation...')
    await followUpStaleLeads()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Follow-up emails sent',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[CRON] Follow-up error:', error)
    return NextResponse.json(
      { error: 'Failed to send follow-ups' },
      { status: 500 }
    )
  }
}

