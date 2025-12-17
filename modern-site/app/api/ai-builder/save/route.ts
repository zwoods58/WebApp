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
    const supabase = getSupabaseClient()
    const { projectId, htmlCode, files, metadata } = await request.json()

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
    const { data: draft, error: draftError } = await supabase
      .from('draft_projects')
      .select('id, user_id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (draftError || !draft) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Create version snapshot before saving
    const { data: currentDraft } = await supabase
      .from('draft_projects')
      .select('metadata')
      .eq('id', projectId)
      .single()

    // Save version history
    if (currentDraft?.metadata?.html_code) {
      try {
        await supabase
          .from('project_versions')
          .insert({
            project_id: projectId,
            html_code: currentDraft.metadata.html_code,
            files: currentDraft.metadata.files || {},
            created_at: new Date().toISOString()
          })
      } catch {
        // Table might not exist yet, ignore error
      }
    }

    // Update project with new code
    const updateData: any = {
      updated_at: new Date().toISOString(),
      metadata: {
        ...(currentDraft?.metadata || {}),
        html_code: htmlCode || currentDraft?.metadata?.html_code,
        files: files || currentDraft?.metadata?.files || {},
        ...metadata
      }
    }

    const { error: updateError } = await supabase
      .from('draft_projects')
      .update(updateData)
      .eq('id', projectId)

    if (updateError) {
      console.error('Error saving project:', updateError)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Save error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

