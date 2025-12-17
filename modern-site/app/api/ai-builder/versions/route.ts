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
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (!draft) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get versions (fallback to metadata if versions table doesn't exist)
    let versions = null
    try {
      const { data } = await supabase
        .from('project_versions')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(50)
      versions = data
    } catch {
      // Table might not exist yet, ignore error
    }

    if (versions) {
      return NextResponse.json({ versions })
    }

    // Fallback: return current version only
    const { data: current } = await supabase
      .from('draft_projects')
      .select('metadata, updated_at')
      .eq('id', projectId)
      .single()

    return NextResponse.json({
      versions: current ? [{
        id: 'current',
        project_id: projectId,
        html_code: current.metadata?.html_code,
        created_at: current.updated_at
      }] : []
    })
  } catch (error) {
    console.error('Error fetching versions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { projectId, versionId } = await request.json()

    if (!projectId || !versionId) {
      return NextResponse.json({ error: 'Project ID and version ID required' }, { status: 400 })
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
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (!draft) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get version
    let version = null
    try {
      const { data } = await supabase
        .from('project_versions')
        .select('*')
        .eq('id', versionId)
        .eq('project_id', projectId)
        .single()
      version = data
    } catch {
      // Version not found or table doesn't exist
    }

    if (!version) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    // Restore version
    await supabase
      .from('draft_projects')
      .update({
        metadata: {
          html_code: version.html_code,
          files: version.files || {}
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error restoring version:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

