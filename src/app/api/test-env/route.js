import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envCheck = {
      SENDGRID_API_KEY: !!process.env.SENDGRID_API_KEY,
      SENDGRID_FROM_EMAIL: !!process.env.SENDGRID_FROM_EMAIL,
      SENDGRID_API_KEY_LENGTH: process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.length : 0,
      SENDGRID_FROM_EMAIL_VALUE: process.env.SENDGRID_FROM_EMAIL || 'NOT_SET',
      NODE_ENV: process.env.NODE_ENV
    }
    
    return NextResponse.json({
      success: true,
      environment: envCheck,
      message: 'Environment check completed'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
