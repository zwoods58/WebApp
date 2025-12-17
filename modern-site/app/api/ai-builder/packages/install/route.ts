/**
 * Install Package API Route
 * P1 Feature 9: Enhanced Package Management
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '../../../../../src/lib/supabase'
import { installPackageTool } from '../../../../../ai_builder/lib/ai/tools/install-package'

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { projectId, packageName, version, dev } = await request.json()

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

    // Use install package tool
    const result = await installPackageTool.execute({
      packageName,
      version: version || 'latest',
      dev: dev || false,
      projectId
    })

    return NextResponse.json({
      success: true,
      result
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to install package' },
      { status: 500 }
    )
  }
}





