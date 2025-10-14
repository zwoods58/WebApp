import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

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

  data.count++
  return data.count <= maxRequests
}

export async function POST(req) {
  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    
    // Check rate limiting
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse form data
    const formData = await req.formData()
    
    const projectData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      company: formData.get('company'),
      projectType: formData.get('projectType'),
      budget: formData.get('budget'),
      timeline: formData.get('timeline'),
      description: formData.get('description'),
      requirements: formData.get('requirements')
    }

    // Validate required fields
    if (!projectData.name || !projectData.email || !projectData.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate project ID
    const projectId = `PROJ-${Date.now().toString().slice(-6)}`

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
        
        // Send admin email
        const adminEmail = {
          from: 'admin@atarwebb.com',
          to: 'admin@atarwebb.com',
          subject: `New Project Request - ${projectId}`,
          text: `NEW PROJECT REQUEST
==================

CLIENT INFORMATION:
------------------
Name: ${projectData.name}
Email: ${projectData.email}
Phone: ${projectData.phone || 'Not provided'}
Company: ${projectData.company || 'Not provided'}

PROJECT DETAILS:
----------------
Project Type: ${projectData.projectType || 'Not specified'}
Budget: ${projectData.budget || 'Not specified'}
Timeline: ${projectData.timeline || 'Not specified'}

DESCRIPTION:
------------
${projectData.description}

REQUIREMENTS:
-------------
${projectData.requirements || 'No specific requirements provided'}

ACTION REQUIRED:
---------------
Please contact the client to discuss project details and provide a quote.

Project ID: ${projectId}
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
          to: projectData.email,
          subject: 'Thank you for your project request - AtarWebb',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Thank You for Your Project Request!</h2>
              <p>Dear ${projectData.name},</p>
              <p>Thank you for reaching out to AtarWebb. We have received your project request and are excited to learn more about your vision.</p>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #2563eb; margin-bottom: 15px;">Your Project Details:</h3>
                <p><strong>Project Type:</strong> ${projectData.projectType || 'Not specified'}</p>
                <p><strong>Budget:</strong> ${projectData.budget || 'Not specified'}</p>
                <p><strong>Timeline:</strong> ${projectData.timeline || 'Not specified'}</p>
                <p><strong>Description:</strong> ${projectData.description}</p>
                ${projectData.requirements ? `<p><strong>Requirements:</strong> ${projectData.requirements}</p>` : ''}
              </div>
              <p>We will review your project details and contact you within 24 hours to discuss next steps and provide a detailed quote.</p>
              <p>If you have any questions or need to provide additional information, please don't hesitate to contact us at <a href="mailto:admin@atarwebb.com">admin@atarwebb.com</a>.</p>
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
      
      adminEmailResult = { success: false, error: 'Brevo SMTP credentials not configured' }
      clientEmailResult = { success: false, error: 'Brevo SMTP credentials not configured' }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Project request submitted successfully!',
      projectId: projectId,
      emailSent: adminEmailResult.success && clientEmailResult.success,
      emailErrors: {
        admin: adminEmailResult.error,
        client: clientEmailResult.error
      }
    })

  } catch (error) {
    console.error('Project request submission error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to submit project request',
        details: error.message 
      },
      { status: 500 }
    )
  }
}