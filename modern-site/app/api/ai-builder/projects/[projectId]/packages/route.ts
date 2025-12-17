/**
 * Get Project Packages API Route
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '../../../../../../src/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const supabase = getSupabaseClient()
    const { projectId } = params

    // Get project metadata
    const { data: draft } = await supabase
      .from('draft_projects')
      .select('metadata')
      .eq('id', projectId)
      .single()

    if (!draft) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Extract packages from package.json
    const fileTree = draft.metadata?.file_tree || {}
    const packageJsonPath = 'package.json'
    
    if (!fileTree[packageJsonPath]) {
      return NextResponse.json({ packages: [] })
    }

    let packageJson: any
    try {
      packageJson = JSON.parse(fileTree[packageJsonPath])
    } catch {
      return NextResponse.json({ packages: [] })
    }

    const packages = [
      ...Object.entries(packageJson.dependencies || {}).map(([name, version]) => ({
        name,
        version: String(version),
        type: 'dependency' as const
      })),
      ...Object.entries(packageJson.devDependencies || {}).map(([name, version]) => ({
        name,
        version: String(version),
        type: 'devDependency' as const
      }))
    ]

    return NextResponse.json({ packages })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get packages' },
      { status: 500 }
    )
  }
}





