import { NextResponse } from 'next/server'
import { updateAllLeadScores } from '@/lib/automation/lead-management'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`
    
    console.log('Cron auth check:', {
      hasAuthHeader: !!authHeader,
      hasCronSecret: !!process.env.CRON_SECRET,
      authHeaderMatch: authHeader === expectedAuth
    })
    
    if (authHeader !== expectedAuth) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        details: {
          hasAuthHeader: !!authHeader,
          hasCronSecret: !!process.env.CRON_SECRET,
          expectedFormat: 'Bearer [CRON_SECRET]'
        }
      }, { status: 401 })
    }

    console.log('[CRON] Running lead scoring automation...')
    await updateAllLeadScores()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Lead scoring completed',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[CRON] Lead scoring error:', error)
    return NextResponse.json(
      { error: 'Failed to score leads' },
      { status: 500 }
    )
  }
}

