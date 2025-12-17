/**
 * Uninstall Package API Route
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '../../../../../src/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { projectId, packageName } = await request.json()

    if (!projectId || !packageName) {
      return NextResponse.json({ error: 'Project ID and package name required' }, { status: 400 })
    }

    // Get user authentication
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

    // Get current draft
    const { data: draft } = await supabase
      .from('draft_projects')
      .select('metadata')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (!draft) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get package.json from file tree
    const fileTree = draft.metadata?.file_tree || {}
    const packageJsonPath = 'package.json'
    
    if (!fileTree[packageJsonPath]) {
      return NextResponse.json({ error: 'package.json not found' }, { status: 404 })
    }

    let packageJson: any
    try {
      packageJson = JSON.parse(fileTree[packageJsonPath])
    } catch {
      return NextResponse.json({ error: 'Invalid package.json' }, { status: 400 })
    }

    // Remove package from dependencies or devDependencies
    let removed = false
    if (packageJson.dependencies?.[packageName]) {
      delete packageJson.dependencies[packageName]
      removed = true
    }
    if (packageJson.devDependencies?.[packageName]) {
      delete packageJson.devDependencies[packageName]
      removed = true
    }

    if (!removed) {
      return NextResponse.json({ error: 'Package not found in dependencies' }, { status: 404 })
    }

    // Update package.json in file tree
    fileTree[packageJsonPath] = JSON.stringify(packageJson, null, 2)

    // Update draft metadata
    const { error: updateError } = await supabase
      .from('draft_projects')
      .update({
        metadata: {
          ...draft.metadata,
          file_tree: fileTree
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)

    if (updateError) {
      return NextResponse.json(
        { error: `Failed to uninstall package: ${updateError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Package ${packageName} uninstalled successfully`
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to uninstall package' },
      { status: 500 }
    )
  }
}





