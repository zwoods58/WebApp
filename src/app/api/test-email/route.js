import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function GET() {
  try {
    const BREVO_SMTP_USER = process.env.BREVO_SMTP_USER
    const BREVO_SMTP_PASSWORD = process.env.BREVO_SMTP_PASSWORD
    
    if (!BREVO_SMTP_USER || !BREVO_SMTP_PASSWORD) {
      return NextResponse.json({
        success: false,
        error: 'Missing Brevo SMTP credentials',
        BREVO_SMTP_USER: !!BREVO_SMTP_USER,
        BREVO_SMTP_PASSWORD: !!BREVO_SMTP_PASSWORD
      })
    }
    
    // Create Brevo SMTP transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: BREVO_SMTP_USER,
        pass: BREVO_SMTP_PASSWORD
      }
    })
    
    // Send a test email
    const mailOptions = {
      from: BREVO_SMTP_USER,
      to: 'admin@atarwebb.com',
      subject: 'Brevo SMTP Test Email',
      text: 'This is a test email to verify Brevo SMTP is working.',
      html: '<p>This is a test email to verify Brevo SMTP is working.</p>'
    }
    
    const result = await transporter.sendMail(mailOptions)
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully via Brevo SMTP',
      messageId: result.messageId
    })
    
  } catch (error) {
    console.error('Brevo SMTP test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.response || error.code
    }, { status: 500 })
  }
}