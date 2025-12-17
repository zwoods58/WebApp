/**
 * Templates API Route
 * P2 Feature 1: Template System
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '../../../src/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    
    // Get templates from database
    const { data: templates, error } = await supabase
      .from('templates')
      .select('*')
      .order('downloads', { ascending: false })
      .limit(100)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      templates: templates || []
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { templateId, projectId, variables } = await request.json()

    if (!templateId || !projectId) {
      return NextResponse.json(
        { error: 'Template ID and Project ID required' },
        { status: 400 }
      )
    }

    // Get template
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single()

    if (templateError || !template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Render template with variables
    const { renderTemplate } = await import('../../ai_builder/lib/templates/template-engine')
    const renderedFiles = renderTemplate(template as any, variables || {})

    // Update project with rendered files
    const { data: draft } = await supabase
      .from('draft_projects')
      .select('metadata')
      .eq('id', projectId)
      .single()

    if (!draft) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const fileTree = draft.metadata?.file_tree || {}
    for (const [filePath, content] of Object.entries(renderedFiles)) {
      fileTree[filePath] = content
    }

    await supabase
      .from('draft_projects')
      .update({
        metadata: {
          ...draft.metadata,
          file_tree: fileTree
        }
      })
      .eq('id', projectId)

    return NextResponse.json({
      success: true,
      message: 'Template applied successfully'
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to apply template' },
      { status: 500 }
    )
  }
}





