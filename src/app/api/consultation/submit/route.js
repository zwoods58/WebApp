import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import { ConsultationPDFService } from '../../../../lib/consultation-pdf-service'

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
  console.log('=== CONSULTATION API CALLED ===')
  console.log('Request method:', req.method)
  console.log('Request headers:', Object.fromEntries(req.headers.entries()))
  
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(req)
    console.log('Client IP:', clientIP)
    
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
    console.log('Content-Type:', contentType)
    
    try {
      if (contentType.includes('multipart/form-data')) {
        console.log('Parsing multipart/form-data...')
        console.log('Content-Type header:', contentType)
        
        // Check if the request has a body
        const contentLength = req.headers.get('content-length')
        console.log('Content-Length:', contentLength)
        
        try {
          const formData = await req.formData()
          console.log('FormData parsed successfully')
          console.log('FormData entries:', Array.from(formData.entries()).map(([key, value]) => [key, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value]))
          
          consultationData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            company: formData.get('company'),
            projectDetails: formData.get('projectDetails'),
            preferredDate: formData.get('preferredDate'),
            preferredTime: formData.get('preferredTime'),
            uploadedFile: formData.get('uploadedFile'),
            serviceType: formData.get('serviceType'),
            serviceTier: formData.get('serviceTier'),
            servicePrice: formData.get('servicePrice'),
            serviceDescription: formData.get('serviceDescription')
          }
        } catch (formDataError) {
          console.error('FormData parsing failed, trying alternative approach:', formDataError)
          
          // Try to read the raw body and parse manually as a fallback
          const body = await req.text()
          console.log('Raw body length:', body.length)
          console.log('Body preview:', body.substring(0, 200))
          
          // For now, return a more helpful error
          throw new Error(`FormData parsing failed: ${formDataError.message}. This might be due to malformed multipart data.`)
        }
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        console.log('Parsing application/x-www-form-urlencoded...')
        const formData = await req.formData()
        consultationData = {
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          company: formData.get('company'),
          projectDetails: formData.get('projectDetails'),
          preferredDate: formData.get('preferredDate'),
          preferredTime: formData.get('preferredTime'),
          uploadedFile: null, // No file upload with URLSearchParams
          serviceType: formData.get('serviceType'),
          serviceTier: formData.get('serviceTier'),
          servicePrice: formData.get('servicePrice'),
          serviceDescription: formData.get('serviceDescription')
        }
      } else {
        console.log('Unsupported content type:', contentType)
        return NextResponse.json(
          { error: 'Unsupported content type. Please use multipart/form-data or application/x-www-form-urlencoded.' },
          { status: 400 }
        )
      }
    } catch (parseError) {
      console.error('Error parsing form data:', parseError)
      console.error('Parse error details:', {
        message: parseError.message,
        stack: parseError.stack,
        contentType: contentType
      })
      return NextResponse.json(
        { error: `Failed to parse form data: ${parseError.message}. The request may be too large or malformed.` },
        { status: 400 }
      )
    }

    console.log('=== FORM DATA PARSED ===')
    console.log('Received consultation data:', consultationData)
    console.log('Form data keys:', Object.keys(consultationData))

    // Validate required fields
    if (!consultationData.name || !consultationData.email || !consultationData.preferredDate || !consultationData.preferredTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate file size (max 4MB due to Vercel limits)
    if (consultationData.uploadedFile && consultationData.uploadedFile.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large. Please upload a file smaller than 4MB. For larger files, please email us directly at admin@atarwebb.com.' },
        { status: 413 }
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

        // Generate a simple consultation ID
        const consultationId = `CONS-${Date.now().toString().slice(-6)}`
        console.log('Generated consultation ID:', consultationId)

    // Generate PDF for email attachment using unified service
    console.log('Generating PDF...')
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    // Use uploaded PDF file if available, otherwise generate a simple consultation PDF
    let pdfBuffer
    if (consultationData.uploadedFile) {
      // Return the exact uploaded PDF file without any modifications
      const arrayBuffer = await consultationData.uploadedFile.arrayBuffer()
      pdfBuffer = Buffer.from(arrayBuffer)
      console.log('Using uploaded PDF file - sending exact same file')
    } else {
      // Generate a simple consultation PDF if no file uploaded
      const pdfService = new ConsultationPDFService()
      const pdfData = {
        consultationId: consultationId,
        name: consultationData.name,
        email: consultationData.email,
        company: consultationData.company || undefined,
        phone: consultationData.phone || undefined,
        preferredDate: consultationData.preferredDate,
        preferredTime: consultationData.preferredTime,
        projectDetails: consultationData.projectDetails || undefined,
        serviceType: consultationData.serviceType || undefined,
        budget: consultationData.budget || undefined,
        timeline: consultationData.timeline || undefined,
        additionalNotes: consultationData.additionalNotes || undefined,
        date: currentDate,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        totalAmount: 250, // Consultation fee
        currency: consultationData.currency || 'USD'
      }
      
      pdfBuffer = await pdfService.getPDFBuffer(pdfData)
      console.log('PDF generated successfully using unified service')
    }
    
    // Send email to admin using SendGrid (optional)
    console.log('Starting email sending process...')
    let adminEmailResult = { success: true }
    let clientEmailResult = { success: true }
    
    // Environment variables - try multiple sources
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || ''
    const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'admin@atarwebb.com'
    
    console.log('=== EMAIL SENDING DEBUG ===')
    console.log('Environment check:')
    console.log('SENDGRID_API_KEY exists:', !!SENDGRID_API_KEY)
    console.log('SENDGRID_FROM_EMAIL exists:', !!SENDGRID_FROM_EMAIL)
    console.log('SENDGRID_FROM_EMAIL value:', SENDGRID_FROM_EMAIL)
    console.log('About to check if SENDGRID_API_KEY exists...')
    
    if (SENDGRID_API_KEY && SENDGRID_API_KEY.length > 0) {
      console.log('SendGrid API key found, sending emails...')
      console.log('API Key (first 10 chars):', SENDGRID_API_KEY.substring(0, 10) + '...')
      
      try {
        adminEmailResult = await sgMail.send({
          to: 'admin@atarwebb.com',
          from: SENDGRID_FROM_EMAIL,
          subject: 'New Consultation Request - AtarWebb',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">New Consultation Request - AtarWebb</h2>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${consultationData.name}</p>
                <p><strong>Email:</strong> ${consultationData.email}</p>
                <p><strong>Phone:</strong> ${consultationData.phone || 'Not provided'}</p>
                <p><strong>Company:</strong> ${consultationData.company || 'Not provided'}</p>
                <p><strong>Preferred Time:</strong> ${formattedDateTime}</p>
                ${consultationData.serviceType ? `
                <p><strong>Selected Service:</strong> ${consultationData.serviceType}</p>
                <p><strong>Service Tier:</strong> ${consultationData.serviceTier}</p>
                <p><strong>Service Price:</strong> $${consultationData.servicePrice}</p>
                <p><strong>Service Description:</strong> ${consultationData.serviceDescription}</p>
                ` : ''}
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
              filename: consultationData.uploadedFile ? consultationData.uploadedFile.name : `AtarWebb-Quote-${consultationId.substring(0, 8)}.pdf`,
              type: 'application/pdf',
              disposition: 'attachment'
            }
           ]
         }).then(() => {
           console.log('Admin email sent successfully')
           return { success: true }
         }).catch(error => {
           console.error('Admin email failed:', error)
           return { success: false, error: error.message }
         })

         // Send confirmation email to client using SendGrid
        clientEmailResult = await sgMail.send({
          to: consultationData.email,
          from: SENDGRID_FROM_EMAIL,
          subject: 'AtarWebb - Your Consultation Request & Quote',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Thank You for Your Consultation Request!</h2>
              <p>Dear ${consultationData.name},</p>
              <p>Thank you for reaching out to AtarWebb. We have received your consultation request and are excited to learn more about your project.</p>
              <p>We have scheduled your consultation for <strong>${formattedDateTime}</strong>. We will contact you shortly to confirm the details and prepare for our discussion.</p>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #2563eb; margin-bottom: 15px;">Your Project Details:</h3>
                ${consultationData.serviceType ? `
                <p><strong>Selected Service:</strong> ${consultationData.serviceType}</p>
                <p><strong>Service Tier:</strong> ${consultationData.serviceTier}</p>
                <p><strong>Service Price:</strong> $${consultationData.servicePrice}</p>
                ` : ''}
                <p><strong>Project:</strong> ${consultationData.projectDetails || 'No details provided'}</p>
                <p><strong>Company:</strong> ${consultationData.company || 'Not provided'}</p>
                <p><strong>Phone:</strong> ${consultationData.phone || 'Not provided'}</p>
              </div>
              <p>Please find attached your personalized quote for the services discussed.</p>
              <p>If you have any questions or need to reschedule, please don't hesitate to contact us at <a href="mailto:admin@atarwebb.com">admin@atarwebb.com</a>.</p>
              <p>We look forward to working with you!</p>
              <p>Best regards,<br>The AtarWebb Team</p>
            </div>
          `,
          attachments: [
            {
              content: pdfBuffer.toString('base64'),
              filename: consultationData.uploadedFile ? consultationData.uploadedFile.name : `AtarWebb-Quote-${consultationId.substring(0, 8)}.pdf`,
              type: 'application/pdf',
              disposition: 'attachment'
            }
           ]
         }).then(() => {
           console.log('Client email sent successfully')
           return { success: true }
         }).catch(error => {
           console.error('Client email failed:', error)
           return { success: false, error: error.message }
         })

         console.log('Emails sent successfully:', { adminEmailResult, clientEmailResult })
      } catch (error) {
        console.error('Email sending error:', error)
        console.error('Error details:', {
          message: error.message,
          response: error.response?.body,
          statusCode: error.code
        })
        adminEmailResult = { success: false, error: error.message }
        clientEmailResult = { success: false, error: error.message }
      }
     } else {
       console.log('=== SENDGRID API KEY NOT FOUND ===')
       console.log('SendGrid API key not configured, skipping email sending')
       console.log('Available environment variables:', Object.keys(process.env).filter(key => key.includes('SENDGRID')))
       console.log('SENDGRID_API_KEY value:', SENDGRID_API_KEY)
       
       // Log email content for testing purposes
       console.log('=== EMAIL CONTENT (FOR TESTING) ===')
       console.log('ADMIN EMAIL WOULD BE SENT TO: admin@atarwebb.com')
       console.log('CLIENT EMAIL WOULD BE SENT TO:', consultationData.email)
       console.log('CONSULTATION ID:', consultationId)
       console.log('CLIENT NAME:', consultationData.name)
       console.log('SERVICE TYPE:', consultationData.serviceType)
       console.log('PREFERRED DATE/TIME:', formattedDateTime)
       console.log('FILE UPLOADED:', consultationData.uploadedFile ? `${consultationData.uploadedFile.name} (${consultationData.uploadedFile.size} bytes)` : 'No file')
       console.log('=== END EMAIL CONTENT ===')
     }

    if (!adminEmailResult.success || !clientEmailResult.success) {
      console.error('Email sending failed:', { adminEmailResult, clientEmailResult })
      // Don't fail the request if email fails, just log it
    }

    // Return success response
    console.log('=== RETURNING SUCCESS RESPONSE ===')
    console.log('Consultation ID:', consultationId)
    console.log('Admin email result:', adminEmailResult)
    console.log('Client email result:', clientEmailResult)
    
    return NextResponse.json({
      success: true,
      message: 'Consultation request submitted successfully',
      consultationId: consultationId
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
