/**
 * Analytics Tracking API Route
 * P1 Feature 13: Analytics & Monitoring
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '../../../../src/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const event = await request.json()

    // Store event in database for analytics
    const supabase = getSupabaseClient()
    
    await supabase.from('analytics_events').insert({
      event_name: event.name,
      properties: event.properties || {},
      user_id: event.properties?.userId,
      project_id: event.properties?.projectId,
      timestamp: new Date(event.timestamp).toISOString()
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    // Don't fail requests if analytics fails
    console.error('Analytics tracking error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}





