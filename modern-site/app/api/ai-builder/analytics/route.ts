import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing')
  }
  return createClient(supabaseUrl, supabaseKey)
}

export async function POST(request: NextRequest) {
  try {
    const { projectId, analyticsId } = await request.json()

    if (!projectId || !analyticsId) {
      return NextResponse.json({ error: 'Project ID and Analytics ID required' }, { status: 400 })
    }

    // Get current user
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check Pro subscription
    const { data: account } = await supabase
      .from('user_accounts')
      .select('account_tier, subscription_status')
      .eq('id', user.id)
      .single()

    if (account?.account_tier !== 'pro_subscription' || account?.subscription_status !== 'active') {
      return NextResponse.json({ error: 'Pro subscription required' }, { status: 403 })
    }

    // Verify project ownership
    const { data: draft } = await supabase
      .from('draft_projects')
      .select('metadata')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (!draft) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Update analytics ID
    await supabase
      .from('draft_projects')
      .update({
        metadata: {
          ...draft.metadata,
          analytics: {
            googleAnalyticsId: analyticsId
          }
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

