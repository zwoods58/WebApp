import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envCheck = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasSendGridKey: !!process.env.SENDGRID_API_KEY,
      hasSendGridEmail: !!process.env.SENDGRID_FROM_EMAIL,
      supabaseUrlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      supabaseKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
      sendGridKeyLength: process.env.SENDGRID_API_KEY?.length || 0,
      sendGridEmailLength: process.env.SENDGRID_FROM_EMAIL?.length || 0
    }

    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      envCheck
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
