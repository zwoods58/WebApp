/**
 * Search API Route
 * P2 Feature 2: Search & Discovery
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSearchEngine } from '../../../ai_builder/lib/search/search-engine'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') as 'project' | 'file' | 'code' | 'template' | undefined
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!query.trim()) {
      return NextResponse.json({ results: [] })
    }

    const searchEngine = getSearchEngine()
    const results = searchEngine.search({
      query,
      type,
      limit,
      offset
    })

    return NextResponse.json({
      success: true,
      results,
      total: results.length
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Search failed' },
      { status: 500 }
    )
  }
}





