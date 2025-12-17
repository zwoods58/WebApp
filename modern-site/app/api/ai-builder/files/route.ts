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

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const filePath = searchParams.get('path')

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
    }

    // Get current user
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    const files = draft.metadata?.files || {}
    
    if (filePath) {
      return NextResponse.json({ content: files[filePath] || '' })
    }

    return NextResponse.json({ files })
  } catch (error) {
    console.error('Error fetching files:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { projectId, filePath, content, action } = await request.json()

    if (!projectId || !filePath) {
      return NextResponse.json({ error: 'Project ID and file path required' }, { status: 400 })
    }

    // Get current user
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    const files = draft.metadata?.files || {}

    if (action === 'delete') {
      delete files[filePath]
    } else if (action === 'create' || action === 'update') {
      files[filePath] = content || ''
    }

    // Update project
    await supabase
      .from('draft_projects')
      .update({
        metadata: {
          ...draft.metadata,
          files
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error managing files:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

