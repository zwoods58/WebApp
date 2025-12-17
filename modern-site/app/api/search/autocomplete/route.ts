/**
 * Search Autocomplete API Route
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSearchEngine } from '../../../../ai_builder/lib/search/search-engine'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '5')

    if (!query.trim()) {
      return NextResponse.json({ suggestions: [] })
    }

    const searchEngine = getSearchEngine()
    const suggestions = searchEngine.getAutocomplete(query, limit)

    return NextResponse.json({
      success: true,
      suggestions
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Autocomplete failed' },
      { status: 500 }
    )
  }
}





