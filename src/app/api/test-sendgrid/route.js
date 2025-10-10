import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

export async function GET() {
  try {
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
    const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL
    
    if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        SENDGRID_API_KEY: !!SENDGRID_API_KEY,
        SENDGRID_FROM_EMAIL: !!SENDGRID_FROM_EMAIL
      })
    }
    
    // Initialize SendGrid
    sgMail.setApiKey(SENDGRID_API_KEY)
    
    // Send a test email
    const result = await sgMail.send({
      to: 'admin@atarwebb.com',
      from: SENDGRID_FROM_EMAIL,
      subject: 'SendGrid Test Email',
      text: 'This is a test email to verify SendGrid is working.',
      html: '<p>This is a test email to verify SendGrid is working.</p>'
    })
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      result: result[0]?.statusCode
    })
    
  } catch (error) {
    console.error('SendGrid test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.response?.body
    }, { status: 500 })
  }
}
