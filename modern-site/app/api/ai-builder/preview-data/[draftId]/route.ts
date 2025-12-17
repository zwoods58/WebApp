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

export async function GET(
  request: NextRequest,
  { params }: { params: { draftId: string } }
) {
  try {
    const supabase = getSupabaseClient()
    const { draftId } = params

    // Get draft project
    const { data: draft, error } = await supabase
      .from('draft_projects')
      .select('metadata, preview_expires_at, business_name')
      .eq('id', draftId)
      .single()

    if (error || !draft) {
      return NextResponse.json(
        { error: 'Preview not found' },
        { status: 404 }
      )
    }

    // Check if preview has expired (for FREE tier)
    if (draft.preview_expires_at) {
      const expiryDate = new Date(draft.preview_expires_at)
      if (expiryDate < new Date()) {
        return NextResponse.json(
          { 
            error: 'Preview expired',
            expired: true,
            businessName: draft.business_name
          },
          { status: 403 }
        )
      }
    }

    // Get React component code from metadata (preferred) or fallback to HTML
    // Check for new file tree structure first (agentic architecture)
    const fileTree = draft.metadata?.file_tree
    let componentCode = draft.metadata?.component_code || draft.metadata?.react_code
    const htmlCode = draft.metadata?.html_code

    // If file tree exists, extract main component
    if (fileTree && typeof fileTree === 'object') {
      // Priority order for finding main component
      const priorityPaths = [
        'src/components/LandingPage.tsx',
        'src/App.tsx',
        'src/pages/index.tsx',
        'src/index.tsx'
      ]
      
      for (const path of priorityPaths) {
        if (fileTree[path]) {
          componentCode = fileTree[path]
          break
        }
      }
      
      // Fallback: find first .tsx or .jsx file
      if (!componentCode) {
        for (const [path, content] of Object.entries(fileTree)) {
          if (path.match(/\.(tsx|jsx)$/)) {
            componentCode = content as string
            break
          }
        }
      }
    }

    if (!componentCode && !htmlCode) {
      return NextResponse.json(
        { error: 'Preview not available' },
        { status: 404 }
      )
    }

    // Return component code (prefer React, fallback to HTML for backward compatibility)
    return NextResponse.json({
      componentCode: componentCode || htmlCode,
      isReact: !!componentCode,
      businessName: draft.business_name,
      fileTree: fileTree || undefined // Include file tree if available
    })
  } catch (error) {
    console.error('Error serving preview data:', error)
    return NextResponse.json(
      { error: 'Error loading preview' },
      { status: 500 }
    )
  }
}

// PATCH endpoint to update component code (for self-healing)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { draftId: string } }
) {
  try {
    const supabase = getSupabaseClient()
    const { draftId } = params
    const { componentCode } = await request.json()

    if (!componentCode) {
      return NextResponse.json(
        { error: 'componentCode is required' },
        { status: 400 }
      )
    }

    // Get current draft to preserve other metadata
    const { data: draft, error: fetchError } = await supabase
      .from('draft_projects')
      .select('metadata')
      .eq('id', draftId)
      .single()

    if (fetchError || !draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      )
    }

    // Update metadata with new component code
    const currentMetadata = draft.metadata || {}
    const updatedMetadata = {
      ...currentMetadata,
      component_code: componentCode,
      react_code: componentCode, // Also update react_code for backward compatibility
      // If file_tree exists, update the main component in file tree
      ...(currentMetadata.file_tree && {
        file_tree: {
          ...currentMetadata.file_tree,
          // Update the main component file
          'src/components/LandingPage.tsx': componentCode,
        }
      })
    }

    const { error: updateError } = await supabase
      .from('draft_projects')
      .update({
        metadata: updatedMetadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', draftId)

    if (updateError) {
      console.error('Error updating draft:', updateError)
      return NextResponse.json(
        { error: 'Failed to update code' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Code updated successfully'
    })
  } catch (error) {
    console.error('Error updating preview code:', error)
    return NextResponse.json(
      { error: 'Error updating code' },
      { status: 500 }
    )
  }
}
