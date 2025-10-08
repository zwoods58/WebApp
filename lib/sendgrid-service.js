// SendGrid email service for consultation notifications
import sgMail from '@sendgrid/mail'

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export async function sendConsultationEmail({ to, subject, html, text }) {
  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL || 'admin@atarwebb.com',
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML for text version
    }

    const result = await sgMail.send(msg)
    console.log('✅ Email sent successfully via SendGrid:', result[0].statusCode)
    return { success: true, messageId: result[0].headers['x-message-id'] }
  } catch (error) {
    console.error('❌ SendGrid error:', error)
    if (error.response) {
      console.error('Error details:', error.response.body)
    }
    return { success: false, error: error.message }
  }
}

export async function sendAdminNotification(consultationData) {
  const { name, email, phone, company, preferredDate, preferredTime, projectDetails, hasFileUpload } = consultationData
  
  // Format consultation time
  const consultationDateTime = new Date(`${preferredDate}T${preferredTime}:00`)
  const formattedDateTime = consultationDateTime.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  })

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Consultation Request - AtarWebb</h2>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Company:</strong> ${company || 'Not provided'}</p>
        <p><strong>Preferred Time:</strong> ${formattedDateTime}</p>
        <p><strong>Project Details:</strong></p>
        <p style="background: white; padding: 10px; border-radius: 4px; border-left: 4px solid #2563eb;">${projectDetails || 'No details provided'}</p>
        <p><strong>File Uploaded:</strong> ${hasFileUpload ? 'Yes' : 'No'}</p>
      </div>
      <p style="color: #64748b;">Please contact the client to confirm the consultation time.</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;">
      <p style="font-size: 12px; color: #94a3b8;">This email was sent from the AtarWebb consultation system.</p>
    </div>
  `

  return await sendConsultationEmail({
    to: 'admin@atarwebb.com',
    subject: 'New Consultation Request - AtarWebb',
    html
  })
}

export async function sendClientConfirmation(consultationData) {
  const { name, email, preferredDate, preferredTime } = consultationData
  
  // Format consultation time
  const consultationDateTime = new Date(`${preferredDate}T${preferredTime}:00`)
  const formattedDateTime = consultationDateTime.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  })

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Thank you for your consultation request!</h2>
      <p>Hi ${name},</p>
      <p>We've received your consultation request and will contact you soon to confirm your preferred time:</p>
      <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
        <p><strong>Requested Time:</strong> ${formattedDateTime}</p>
      </div>
      <p>Our team will review your project details and get back to you within 24 hours to schedule your consultation.</p>
      <p>If you have any questions, please don't hesitate to contact us at <a href="mailto:admin@atarwebb.com" style="color: #2563eb;">admin@atarwebb.com</a></p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;">
      <p style="font-size: 12px; color: #94a3b8;">Best regards,<br>The AtarWebb Team</p>
    </div>
  `

  return await sendConsultationEmail({
    to: email,
    subject: 'Consultation Request Received - AtarWebb',
    html
  })
}
