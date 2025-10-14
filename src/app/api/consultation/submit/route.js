import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { ConsultationPDFService } from '../../../../lib/consultation-pdf-service'

// Initialize Brevo SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASSWORD
    }
  })
}

// Rate limiting storage
const rateLimitStore = new Map()

function checkRateLimit(ip) {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 5 // Max 5 requests per 15 minutes per IP

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { count: 1, firstRequest: now })
    return true
  }

  const record = rateLimitStore.get(ip)
  
  // Reset if window has passed
  if (now - record.firstRequest > windowMs) {
    rateLimitStore.set(ip, { count: 1, firstRequest: now })
    return true
  }

  // Check if under limit
  if (record.count < maxRequests) {
    record.count++
    return true
  }

  return false
}

export async function POST(req) {
  console.log('=== CONSULTATION API CALLED ===')
  console.log('Request method:', req.method)
  console.log('Request headers:', Object.fromEntries(req.headers.entries()))
  
  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    console.log('Client IP:', clientIP)
    
    // Check rate limiting
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Get content type
    const contentType = req.headers.get('content-type') || ''
    console.log('Content-Type:', contentType)
    console.log('Content-Length:', req.headers.get('content-length'))

    let consultationData = {}

    // Parse form data based on content type
    if (contentType.includes('multipart/form-data')) {
      console.log('Parsing multipart/form-data...')
      try {
        const formData = await req.formData()
        console.log('FormData parsed successfully')
        console.log('FormData entries:', Array.from(formData.entries()).map(([key, value]) => [key, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value]))
        console.log('Additional services from formData:', formData.get('additionalServices'))
        console.log('Total price from formData:', formData.get('totalPrice'))
        
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
          serviceDescription: formData.get('serviceDescription'),
          selectedAddOns: formData.get('selectedAddOns'),
          additionalServices: formData.get('additionalServices'),
          totalPrice: formData.get('totalPrice'),
          currency: formData.get('currency')
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
        serviceDescription: formData.get('serviceDescription'),
        selectedAddOns: formData.get('selectedAddOns'),
        additionalServices: formData.get('additionalServices'),
        totalPrice: formData.get('totalPrice'),
        currency: formData.get('currency')
      }
    } else {
      console.log('Unsupported content type:', contentType)
      return NextResponse.json(
        { error: 'Unsupported content type. Please use multipart/form-data or application/x-www-form-urlencoded.' },
        { status: 400 }
      )
    }

    console.log('=== FORM DATA PARSED ===')
    console.log('Received consultation data:', consultationData)
    console.log('Form data keys:', Object.keys(consultationData))
    console.log('Additional services raw:', consultationData.additionalServices)
    console.log('Total price raw:', consultationData.totalPrice)

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

    // Skip PDF generation - emails will be text/HTML only
    console.log('Skipping PDF generation - using text/HTML emails only')
    
    // Send emails using Brevo SMTP
    console.log('Starting email sending process with Brevo...')
    let adminEmailResult = { success: true }
    let clientEmailResult = { success: true }
    
    console.log('=== BREVO EMAIL SENDING DEBUG ===')
    console.log('Environment check:')
    console.log('BREVO_SMTP_USER exists:', !!process.env.BREVO_SMTP_USER)
    console.log('BREVO_SMTP_PASSWORD exists:', !!process.env.BREVO_SMTP_PASSWORD)
    
    if (process.env.BREVO_SMTP_USER && process.env.BREVO_SMTP_PASSWORD) {
      console.log('Brevo SMTP credentials found, sending emails...')
      
      try {
        const transporter = createTransporter()
        
        // Parse additional services and add-ons
        let selectedAddOns = []
        let selectedAdditionalServices = []
        let totalPrice = 0
        let currency = 'USD'
        
        try {
          if (consultationData.selectedAddOns) {
            selectedAddOns = JSON.parse(consultationData.selectedAddOns)
          }
        } catch (e) {
          console.log('Error parsing selectedAddOns:', e.message)
        }
        
        try {
          if (consultationData.additionalServices) {
            console.log('Raw additionalServices data:', consultationData.additionalServices)
            const serviceIds = JSON.parse(consultationData.additionalServices)
            console.log('Parsed service IDs:', serviceIds)
            // Map service IDs to service objects with names and prices
            const serviceMap = {
              'domain-registration': { name: 'Domain Registration', price: 15 },
              'hosting': { name: 'Web Hosting (1 Year)', price: 35 },
              'ssl-certificate': { name: 'SSL Certificate', price: 25 },
              'email-setup': { name: 'Email Setup', price: 20 },
              'backup-service': { name: 'Backup Service', price: 30 },
              'maintenance': { name: 'Monthly Maintenance', price: 50 },
              'seo-optimization': { name: 'SEO Optimization', price: 100 },
              'analytics-setup': { name: 'Analytics Setup', price: 25 },
              'social-media': { name: 'Social Media Integration', price: 40 },
              'payment-integration': { name: 'Payment Integration', price: 75 },
              'logo-design': { name: 'Logo Design', price: 50 }
            }
            selectedAdditionalServices = serviceIds.map(id => serviceMap[id] || { name: id, price: 0 })
            console.log('Mapped additional services:', selectedAdditionalServices)
          }
        } catch (e) {
          console.log('Error parsing additionalServices:', e.message)
        }
        
        try {
          if (consultationData.totalPrice) {
            totalPrice = parseFloat(consultationData.totalPrice) || 0
          }
        } catch (e) {
          console.log('Error parsing totalPrice:', e.message)
        }
        
        try {
          if (consultationData.currency) {
            currency = consultationData.currency
          }
        } catch (e) {
          console.log('Error parsing currency:', e.message)
        }

        // Helper function to format prices
        const formatPrice = (price, currency) => {
          if (!price || price === 0) return 'Contact for Pricing'
          const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'
          return `${symbol}${price.toFixed(2)}`
        }

        // Send admin email
        const adminEmail = {
          from: 'admin@atarwebb.com',
          to: 'admin@atarwebb.com',
          subject: `New Consultation Request - ${consultationId}`,
          text: `NEW CONSULTATION REQUEST
====================

CLIENT INFORMATION:
------------------
Name: ${consultationData.name}
Email: ${consultationData.email}
Phone: ${consultationData.phone || 'Not provided'}
Company: ${consultationData.company || 'Not provided'}

CONSULTATION DETAILS:
--------------------
Preferred Date: ${consultationData.preferredDate}
Preferred Time: ${consultationData.preferredTime}
Formatted Time: ${formattedDateTime}

PROJECT DETAILS:
----------------
${consultationData.projectDetails || 'No details provided'}

SERVICE SELECTION:
------------------
Service Type: ${consultationData.serviceType || 'Not specified'}
Service Tier: ${consultationData.serviceTier || 'Not specified'}
Service Price: ${formatPrice(parseFloat(consultationData.servicePrice || 0), currency)}
Service Description: ${consultationData.serviceDescription || 'Not provided'}

${selectedAddOns.length > 0 ? `SELECTED ADD-ONS:
${selectedAddOns.map(addon => `- ${addon.name}: ${formatPrice(addon.price, currency)}`).join('\n')}

` : ''}${selectedAdditionalServices.length > 0 ? `ADDITIONAL SERVICES:
${selectedAdditionalServices.map(service => `- ${service.name}: ${formatPrice(service.price, currency)}`).join('\n')}

` : ''}TOTAL QUOTE: ${formatPrice(totalPrice, currency)}
${currency !== 'USD' ? `Approximate USD: $${totalPrice.toFixed(2)}

` : ''}ACTION REQUIRED:
---------------
Please contact the client to confirm the consultation time and discuss project details.

Consultation ID: ${consultationId}
Submitted: ${new Date().toLocaleString()}

CONTACT INFORMATION:
-------------------
Visit our contact page: https://atarwebb.com/contact`
        }
        
        console.log('Sending admin email...')
        await transporter.sendMail(adminEmail)
        adminEmailResult = { success: true }
        console.log('Admin email sent successfully')
        
        // Send client email
        const clientEmail = {
          from: 'admin@atarwebb.com',
          to: consultationData.email,
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
              <p>We have received your consultation request and will contact you soon to confirm the details and prepare for our discussion.</p>
              <p>If you have any questions or need to reschedule, please don't hesitate to contact us at <a href="mailto:admin@atarwebb.com">admin@atarwebb.com</a>.</p>
              <p>You can also visit our <a href="https://atarwebb.com/contact" style="color: #2563eb;">contact page</a> for more information.</p>
              <p>We look forward to working with you!</p>
              <p>Best regards,<br>The AtarWebb Team</p>
            </div>
          `
        }
        
        console.log('Sending client email...')
        await transporter.sendMail(clientEmail)
        clientEmailResult = { success: true }
        console.log('Client email sent successfully')
        
        console.log('Emails sent successfully:', { adminEmailResult, clientEmailResult })
      } catch (error) {
        console.error('Email sending error:', error)
        adminEmailResult = { success: false, error: error.message }
        clientEmailResult = { success: false, error: error.message }
      }
    } else {
      console.log('=== BREVO SMTP CREDENTIALS NOT FOUND ===')
      console.log('Brevo SMTP credentials not configured, skipping email sending')
      console.log('Available environment variables:', Object.keys(process.env).filter(key => key.includes('BREVO')))
      
      adminEmailResult = { success: false, error: 'Brevo SMTP credentials not configured' }
      clientEmailResult = { success: false, error: 'Brevo SMTP credentials not configured' }
    }

    // Create booking if date and time are provided
    if (consultationData.preferredDate && consultationData.preferredTime) {
      try {
        console.log('Creating booking for consultation...')
        
        // Import fileDb for booking creation
        const { fileDb } = await import('@/lib/file-db')
        
        const booking = await fileDb.booking.create({
          name: consultationData.name,
          email: consultationData.email,
          phone: consultationData.phone || '',
          date: consultationData.preferredDate,
          time: consultationData.preferredTime,
          duration: 30, // Default 30 minutes
          type: 'CONSULTATION',
          status: 'PENDING',
          notes: `Consultation for: ${consultationData.serviceType || 'General Inquiry'}\nProject Details: ${consultationData.projectDetails}`
        })
        
        console.log('Booking created successfully:', booking.id)
      } catch (bookingError) {
        console.error('Error creating booking:', bookingError)
        // Don't fail the request if booking creation fails
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Consultation request submitted successfully!',
      consultationId: consultationId,
      emailSent: adminEmailResult.success && clientEmailResult.success,
      emailErrors: {
        admin: adminEmailResult.error,
        client: clientEmailResult.error
      }
    })

  } catch (error) {
    console.error('Consultation submission error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to submit consultation request',
        details: error.message 
      },
      { status: 500 }
    )
  }
}