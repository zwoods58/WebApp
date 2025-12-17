/**
 * OpenAPI/Swagger Documentation API Route
 * P1 Feature 15: API Design - API Documentation
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAPIDocumentation } from '../../../../ai_builder/lib/api/api-documentation'

export async function GET(request: NextRequest) {
  try {
    const documentation = getAPIDocumentation()
    const spec = documentation.generateOpenAPISpec()

    return NextResponse.json(spec)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate API documentation' },
      { status: 500 }
    )
  }
}





