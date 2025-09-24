import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import { createClient } from '@supabase/supabase-js'

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

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
          error: 'Too many project requests. Please try again later.'
        },
        { 
          status: 429
        }
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

    console.log('Received project request data:', projectData)

    // Validate required fields
    if (!projectData.name || !projectData.email || !projectData.projectType || !projectData.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Store project request in Supabase
    const { data: storedProject, error: dbError } = await supabase
      .from('project_requests')
      .insert([
        {
          name: projectData.name,
          email: projectData.email,
          phone: projectData.phone,
          company: projectData.company,
          project_type: projectData.projectType,
          budget: projectData.budget,
          timeline: projectData.timeline,
          description: projectData.description,
          requirements: projectData.requirements,
          status: 'new'
        }
      ])
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to store project request' },
        { status: 500 }
      )
    }

    console.log('Stored project request successfully:', storedProject.id)

    // Send email to admin using SendGrid
    console.log('Starting email sending process...')
    let adminEmailResult = { success: true }
    let clientEmailResult = { success: true }
    
    if (process.env.SENDGRID_API_KEY) {
      console.log('SendGrid API key found, sending emails...')
      try {
        // Send email to admin
        adminEmailResult = await sgMail.send({
          to: 'admin@atarweb.com',
          from: process.env.SENDGRID_FROM_EMAIL || 'admin@atarweb.com',
          subject: 'New Project Request - AtarWeb',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">New Project Request - AtarWeb</h2>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${projectData.name}</p>
                <p><strong>Email:</strong> ${projectData.email}</p>
                <p><strong>Phone:</strong> ${projectData.phone || 'Not provided'}</p>
                <p><strong>Company:</strong> ${projectData.company || 'Not provided'}</p>
                <p><strong>Project Type:</strong> ${projectData.projectType}</p>
                <p><strong>Budget:</strong> ${projectData.budget || 'Not specified'}</p>
                <p><strong>Timeline:</strong> ${projectData.timeline || 'Not specified'}</p>
                <p><strong>Description:</strong></p>
                <p style="background: white; padding: 10px; border-radius: 4px; border-left: 4px solid #2563eb;">${projectData.description}</p>
                ${projectData.requirements ? `<p><strong>Requirements:</strong></p><p style="background: white; padding: 10px; border-radius: 4px; border-left: 4px solid #2563eb;">${projectData.requirements}</p>` : ''}
              </div>
              <p style="color: #64748b;">Please review this project request in your admin dashboard.</p>
            </div>
          `
        }).then(() => ({ success: true })).catch(error => ({ success: false, error: error.message }))

        // Send confirmation email to client
        clientEmailResult = await sgMail.send({
          to: projectData.email,
          from: process.env.SENDGRID_FROM_EMAIL || 'admin@atarweb.com',
          subject: 'Project Request Received - AtarWeb',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Project Request Received!</h2>
              <p>Dear ${projectData.name},</p>
              <p>Thank you for your project request for <strong>${projectData.projectType}</strong>.</p>
              <p>We have received your request and will review it carefully. Our team will contact you within 24 hours to discuss your project requirements and next steps.</p>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #2563eb; margin-bottom: 15px;">Your Project Details:</h3>
                <p><strong>Project Type:</strong> ${projectData.projectType}</p>
                <p><strong>Budget:</strong> ${projectData.budget || 'To be discussed'}</p>
                <p><strong>Timeline:</strong> ${projectData.timeline || 'To be discussed'}</p>
                <p><strong>Company:</strong> ${projectData.company || 'Not provided'}</p>
                <p><strong>Phone:</strong> ${projectData.phone || 'Not provided'}</p>
              </div>
              <p>If you have any immediate questions, please don't hesitate to contact us at <a href="mailto:admin@atarweb.com">admin@atarweb.com</a>.</p>
              <p>We look forward to working with you!</p>
              <p>Best regards,<br>The AtarWeb Team</p>
            </div>
          `
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
      message: 'Project request submitted successfully',
      projectId: storedProject.id
    })

  } catch (error) {
    console.error('Project request submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit project request' },
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
