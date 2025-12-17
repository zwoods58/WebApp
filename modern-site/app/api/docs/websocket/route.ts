/**
 * WebSocket Events Documentation API Route
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAPIDocumentation } from '../../../../ai_builder/lib/api/api-documentation'

export async function GET(request: NextRequest) {
  try {
    const documentation = getAPIDocumentation()
    const docs = documentation.generateWebSocketDocs()

    return NextResponse.json(docs)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate WebSocket documentation' },
      { status: 500 }
    )
  }
}





