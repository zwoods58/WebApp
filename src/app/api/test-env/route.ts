import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    SMTP_HOST: process.env.SMTP_HOST || 'NOT FOUND',
    SMTP_PORT: process.env.SMTP_PORT || 'NOT FOUND',
    SMTP_USER: process.env.SMTP_USER || 'NOT FOUND',
    SMTP_PASSWORD: process.env.SMTP_PASSWORD ? '***HIDDEN***' : 'NOT FOUND',
    SMTP_FROM: process.env.SMTP_FROM || 'NOT FOUND',
    SMTP_SECURE: process.env.SMTP_SECURE || 'NOT FOUND',
  })
}

