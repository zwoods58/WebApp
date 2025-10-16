import { NextResponse } from 'next/server'
import { productionDb } from '@/lib/production-db'

export async function GET() {
  try {
    // Test Supabase connection
    const leads = await productionDb.lead.findMany()
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection working',
      leadCount: leads.length,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
