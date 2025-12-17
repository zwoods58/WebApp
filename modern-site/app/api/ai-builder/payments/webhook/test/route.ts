import { NextRequest, NextResponse } from 'next/server'

/**
 * Test endpoint to verify webhook URL is accessible
 * Flutterwave validates webhook URLs before saving them
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'Webhook endpoint is accessible',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'Webhook endpoint is ready',
    timestamp: new Date().toISOString()
  })
}

