/**
 * Usage Analytics API Route
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '../../../../src/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get AI requests
    const { data: aiRequests } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('user_id', userId)
      .eq('event_name', 'ai_request')
      .gte('timestamp', startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .lte('timestamp', endDate || new Date().toISOString())

    // Get projects created
    const { data: projectsCreated } = await supabase
      .from('draft_projects')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .lte('created_at', endDate || new Date().toISOString())

    // Get deployments
    const { data: deployments } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('user_id', userId)
      .eq('event_name', 'deployment')
      .gte('timestamp', startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .lte('timestamp', endDate || new Date().toISOString())

    // Calculate storage (would need actual storage calculation)
    const storageUsed = 0

    return NextResponse.json({
      success: true,
      metrics: {
        aiRequests: aiRequests?.length || 0,
        projectsCreated: projectsCreated?.length || 0,
        deployments: deployments?.length || 0,
        storageUsed,
        apiCalls: (aiRequests?.length || 0) + (deployments?.length || 0)
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get usage metrics' },
      { status: 500 }
    )
  }
}





