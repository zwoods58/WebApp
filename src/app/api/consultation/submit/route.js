import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import jsPDF from 'jspdf'
import { addConsultation } from '../../../../lib/consultations-supabase-storage'

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

// Rate limiting storage
const rateLimitStore = new Map()

function checkRateLimit(ip) {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 5

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  const data = rateLimitStore.get(ip)
  
  if (now > data.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (data.count >= maxRequests) {
    return false
  }

  data.count++
  return true
}

function getClientIP(req) {
  return req.ip || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1'
}

export async function POST(req) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(req)
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { 
          error: 'Too many consultation requests. Please try again later.'
        },
        { 
          status: 429
        }
      )
    }

    // Parse form data - handle both multipart/form-data and application/x-www-form-urlencoded
    let consultationData
    
    const contentType = req.headers.get('content-type') || ''
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      consultationData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        company: formData.get('company'),
        projectDetails: formData.get('projectDetails'),
        preferredDate: formData.get('preferredDate'),
        preferredTime: formData.get('preferredTime'),
        uploadedFile: formData.get('uploadedFile')
      }
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData()
      consultationData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        company: formData.get('company'),
        projectDetails: formData.get('projectDetails'),
        preferredDate: formData.get('preferredDate'),
        preferredTime: formData.get('preferredTime'),
        uploadedFile: null // No file upload with URLSearchParams
      }
    } else {
      return NextResponse.json(
        { error: 'Unsupported content type' },
        { status: 400 }
      )
    }

    console.log('Received consultation data:', consultationData)

    // Validate required fields
    if (!consultationData.name || !consultationData.email || !consultationData.preferredDate || !consultationData.preferredTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Format consultation time properly
    const consultationDateTime = new Date(`${consultationData.preferredDate}T${consultationData.preferredTime}`)
    const formattedDateTime = consultationDateTime.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    })

        // Store consultation data first
        const storedConsultation = await addConsultation({
          name: consultationData.name,
          email: consultationData.email,
          phone: consultationData.phone,
          company: consultationData.company,
          projectDetails: consultationData.projectDetails,
          preferredDate: consultationData.preferredDate,
          preferredTime: consultationData.preferredTime,
          hasFileUpload: !!consultationData.uploadedFile
        })

    console.log('Stored consultation successfully:', storedConsultation.id)

    // Generate PDF for email attachment
    console.log('Generating PDF...')
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    const quoteNumber = (storedConsultation.id || `CONS-${Date.now().toString().slice(-6)}`).substring(0, 8)
    
    // Create PDF using jsPDF directly
    const pdf = new jsPDF()
    pdf.setFontSize(12)
    
    // Add content to PDF
    pdf.text('AtarWeb Professional Quote', 50, 30)
    pdf.text(`Quote #: ${quoteNumber}`, 50, 50)
    pdf.text(`Date: ${currentDate}`, 50, 70)
    pdf.text(`Client: ${storedConsultation.name}`, 50, 90)
    pdf.text(`Email: ${storedConsultation.email}`, 50, 110)
    pdf.text(`Company: ${storedConsultation.company || 'Not provided'}`, 50, 130)
    pdf.text(`Preferred Time: ${formattedDateTime}`, 50, 150)
    pdf.text('Project Details:', 50, 170)
    pdf.text(storedConsultation.projectDetails || 'No details provided', 50, 190)
    
    console.log('PDF generated successfully')
    
    // Convert to buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))
    
    // Send email to admin using SendGrid (optional)
    console.log('Starting email sending process...')
    let adminEmailResult = { success: true }
    let clientEmailResult = { success: true }
    
    if (process.env.SENDGRID_API_KEY) {
      console.log('SendGrid API key found, sending emails...')
      console.log('API Key (first 10 chars):', process.env.SENDGRID_API_KEY.substring(0, 10) + '...')
      try {
        adminEmailResult = await sgMail.send({
          to: 'admin@atarweb.com',
          from: process.env.SENDGRID_FROM_EMAIL || 'your-gmail@gmail.com',
          subject: 'New Consultation Request - AtarWeb',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">New Consultation Request - AtarWeb</h2>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${consultationData.name}</p>
                <p><strong>Email:</strong> ${consultationData.email}</p>
                <p><strong>Phone:</strong> ${consultationData.phone || 'Not provided'}</p>
                <p><strong>Company:</strong> ${consultationData.company || 'Not provided'}</p>
                <p><strong>Preferred Time:</strong> ${formattedDateTime}</p>
                <p><strong>Project Details:</strong></p>
                <p style="background: white; padding: 10px; border-radius: 4px; border-left: 4px solid #2563eb;">${consultationData.projectDetails || 'No details provided'}</p>
                <p><strong>File Uploaded:</strong> ${consultationData.uploadedFile ? 'Yes' : 'No'}</p>
              </div>
              <p style="color: #64748b;">Please contact the client to confirm the consultation time.</p>
              <p style="color: #64748b; margin-top: 20px;"><strong>Quote PDF:</strong> See attached quote document for client details.</p>
            </div>
          `,
          attachments: [
            {
              content: pdfBuffer.toString('base64'),
              filename: `AtarWeb-Quote-${storedConsultation.id.substring(0, 8)}.pdf`,
              type: 'application/pdf',
              disposition: 'attachment'
            }
          ]
        }).then(() => ({ success: true })).catch(error => ({ success: false, error: error.message }))

        // Send confirmation email to client using SendGrid
        clientEmailResult = await sgMail.send({
          to: consultationData.email,
          from: process.env.SENDGRID_FROM_EMAIL || 'your-gmail@gmail.com',
          subject: 'AtarWeb - Your Consultation Request & Quote',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Thank You for Your Consultation Request!</h2>
              <p>Dear ${consultationData.name},</p>
              <p>Thank you for reaching out to AtarWeb. We have received your consultation request and are excited to learn more about your project.</p>
              <p>We have scheduled your consultation for <strong>${formattedDateTime}</strong>. We will contact you shortly to confirm the details and prepare for our discussion.</p>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #2563eb; margin-bottom: 15px;">Your Project Details:</h3>
                <p><strong>Project:</strong> ${consultationData.projectDetails || 'No details provided'}</p>
                <p><strong>Company:</strong> ${consultationData.company || 'Not provided'}</p>
                <p><strong>Phone:</strong> ${consultationData.phone || 'Not provided'}</p>
              </div>
              <p>Please find attached your personalized quote for the services discussed.</p>
              <p>If you have any questions or need to reschedule, please don't hesitate to contact us at <a href="mailto:admin@atarweb.com">admin@atarweb.com</a>.</p>
              <p>We look forward to working with you!</p>
              <p>Best regards,<br>The AtarWeb Team</p>
            </div>
          `,
          attachments: [
            {
              content: pdfBuffer.toString('base64'),
              filename: `AtarWeb-Quote-${storedConsultation.id.substring(0, 8)}.pdf`,
              type: 'application/pdf',
              disposition: 'attachment'
            }
          ]
        }).then(() => ({ success: true })).catch(error => ({ success: false, error: error.message }))

        console.log('Emails sent successfully:', { adminEmailResult, clientEmailResult })
      } catch (error) {
        console.error('Email sending error:', error)
        adminEmailResult = { success: false, error: error.message }
        clientEmailResult = { success: false, error: error.message }
      }
    } else {
      console.log('SendGrid API key not configured, skipping email sending')
    }

    if (!adminEmailResult.success || !clientEmailResult.success) {
      console.error('Email sending failed:', { adminEmailResult, clientEmailResult })
      // Don't fail the request if email fails, just log it
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Consultation request submitted successfully',
      consultationId: storedConsultation.id
    })

  } catch (error) {
    console.error('Consultation submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit consultation request' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(req) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
