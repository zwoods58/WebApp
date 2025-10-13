import { NextResponse } from 'next/server'
import { sendAutomationEmail } from '@/lib/automation/helpers'

export async function GET() {
  try {
    // Send a test email to admin
    await sendAutomationEmail(
      'admin@atarwebb.com',
      '🧪 CRM Automation Test Email',
      `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2563eb;">✅ Your CRM Automation is Working!</h2>
          <p style="font-size: 16px; line-height: 1.5;">
            This is a test email from your AtarWebb CRM automation system.
          </p>
          <p style="font-size: 16px; line-height: 1.5;">
            <strong>Email Provider:</strong> Brevo SMTP<br>
            <strong>Status:</strong> Active ✅<br>
            <strong>Sent at:</strong> ${new Date().toLocaleString()}
          </p>
          <hr style="margin: 20px 0; border: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Your automation is ready to send:<br>
            • Welcome emails to new leads<br>
            • Follow-up reminders<br>
            • Daily & weekly reports<br>
          </p>
        </div>
      `
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent to admin@atarwebb.com! Check your inbox.' 
    })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

