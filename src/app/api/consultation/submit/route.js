import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import { createReadStream } from 'fs'
import { writeFileSync, unlinkSync } from 'fs'
import { join } from 'path'
import jsPDF from 'jspdf'
const { addConsultation } = require('../../../../lib/consultations-storage')

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

// Function to generate quote PDF
function generateQuotePDF(consultationData, formattedDateTime) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  const consultationId = consultationData.id || `CONS-${Date.now().toString().slice(-6)}`
  const quoteNumber = `ATW-${Date.now().toString().slice(-6)}`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>AtarWeb Professional Quote</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.4; 
          color: #333; 
          background: #ffffff;
        }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        
        /* Header */
        .header { 
          margin-bottom: 30px;
        }
        .logo-section { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start; 
          margin-bottom: 20px;
        }
        .logo { 
          font-size: 12px; 
          font-weight: 700; 
          color: #000; 
          letter-spacing: -0.5px;
        }
        .quote-meta {
          text-align: right;
          color: #666;
        }
        .quote-number { 
          font-size: 12px; 
          font-weight: 600; 
          color: #000; 
          margin-bottom: 4px;
        }
        .quote-date { font-size: 12px; }
        
        .header-title {
          text-align: left;
          margin-top: 0px;
        }
        .header-title h1 { 
          font-size: 12px; 
          color: #000; 
          margin-bottom: 8px;
          font-weight: 700;
        }
        .header-title p { 
          color: #666; 
          font-size: 12px;
        }
        
        /* Service Details */
        .service-details { 
          margin-bottom: 30px;
        }
        .service-details h3 { 
          color: #000; 
          margin-bottom: 15px; 
          font-size: 12px;
          font-weight: 700;
        }
        .service-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .service-table th {
          text-align: left;
          padding: 12px 0;
          border-bottom: 1px solid #e5e5e5;
          font-weight: 600;
          font-size: 12px;
          color: #666;
        }
        .service-table td {
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
          font-size: 12px;
        }
        .service-table .description {
          color: #000;
        }
        .service-table .qty {
          text-align: center;
          color: #666;
        }
        .service-table .unit-price {
          text-align: right;
          color: #666;
        }
        .service-table .amount {
          text-align: right;
          font-weight: 600;
          color: #000;
        }
        .service-table .total-row {
          border-top: 2px solid #000;
          font-weight: 700;
        }
        
        /* Payment Summary */
        .payment-summary {
          margin-bottom: 30px;
        }
        .payment-amount {
          font-size: 12px;
          font-weight: 700;
          color: #000;
          margin-bottom: 20px;
        }
        .payment-details {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .payment-row {
          display: flex;
          justify-content: space-between;
          width: 200px;
          padding: 4px 0;
          font-size: 12px;
        }
        .payment-row.total {
          font-weight: 700;
          border-top: 1px solid #e5e5e5;
          padding-top: 8px;
          margin-top: 4px;
        }
        
        /* Project Details */
        .project-details { 
          margin-bottom: 8px; 
        }
        .project-details h3 { 
          color: #1e293b; 
          margin-bottom: 6px; 
          font-size: 12px;
          font-weight: 600;
        }
        .project-description { 
          background: #ffffff; 
          padding: 6px; 
          border-radius: 4px; 
          border: 1px solid #e2e8f0;
          margin-bottom: 6px;
          font-style: italic;
          color: #475569;
          font-size: 12px;
        }
        .consultation-time {
          background: #dbeafe;
          padding: 6px;
          border-radius: 4px;
          border-left: 3px solid #2563eb;
          font-size: 12px;
        }
        .consultation-time strong {
          color: #1e40af;
        }
        
        
        /* Pricing Section */
        .pricing-section {
          background: #f8fafc;
          padding: 8px;
          border-radius: 6px;
          margin: 8px 0;
          border: 1px solid #e2e8f0;
        }
        .pricing-section h3 {
          color: #1e293b;
          margin-bottom: 6px;
          font-size: 12px;
          font-weight: 600;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }
        .pricing-item {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          border-bottom: 1px solid #e2e8f0;
          font-size: 12px;
        }
        .pricing-item:last-child {
          border-bottom: none;
          font-weight: 600;
          font-size: 12px;
          color: #2563eb;
        }
        
        /* Footer */
        .footer { 
          margin-top: 8px; 
          text-align: center; 
          color: #64748b; 
          font-size: 12px;
          border-top: 1px solid #e2e8f0;
          padding-top: 6px;
        }
        .footer-brand {
          font-size: 12px;
          font-weight: 700;
          color: #2563eb;
          margin-bottom: 3px;
        }
        .footer-contact {
          margin-bottom: 3px;
        }
        .footer-contact a {
          color: #2563eb;
          text-decoration: none;
        }
        .footer-note {
          font-style: italic;
          color: #94a3b8;
          font-size: 12px;
        }
        
        /* Responsive */
        @media (max-width: 600px) {
          .container { padding: 20px; }
          .client-grid, .quote-grid, .pricing-grid { grid-template-columns: 1fr; }
          .logo-section { flex-direction: column; align-items: flex-start; }
          .quote-meta { text-align: left; margin-top: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="logo-section">
            <div class="logo">AtarWeb</div>
            <div class="quote-meta">
              <div class="quote-number">Quote #${(consultationData.id || `CONS-${Date.now().toString().slice(-6)}`).substring(0, 8)}</div>
              <div class="quote-date">${currentDate}</div>
            </div>
          </div>
          <div class="header-title">
            <h1>Professional Web Development Quote</h1>
            <p>Custom Solutions for Your Business Success</p>
          </div>
        </div>
        
        <!-- Service Details -->
        <div class="service-details">
          <h3>Line Items</h3>
          <table class="service-table">
            <thead>
              <tr>
                <th>Description</th>
                <th class="qty">Qty</th>
                <th class="unit-price">Unit price</th>
                <th class="amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="description">Web Development - Base Service</td>
                <td class="qty">1</td>
                <td class="unit-price">$600.00</td>
                <td class="amount">$600.00</td>
              </tr>
              <tr>
                <td class="description">+ API Integration</td>
                <td class="qty">1</td>
                <td class="unit-price">$60.00</td>
                <td class="amount">$60.00</td>
              </tr>
              <tr class="total-row">
                <td class="description">Total</td>
                <td class="qty"></td>
                <td class="unit-price"></td>
                <td class="amount">$660.00</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Payment Summary -->
        <div class="payment-summary">
          <div class="payment-amount">
            <strong>$660.00 paid on ${currentDate}</strong>
          </div>
          <div class="payment-details">
            <div class="payment-row">
              <span>Subtotal</span>
              <span>$660.00</span>
            </div>
            <div class="payment-row">
              <span>Total</span>
              <span>$660.00</span>
            </div>
            <div class="payment-row total">
              <span>Amount paid</span>
              <span>$660.00</span>
            </div>
          </div>
        </div>
        
        
        <!-- Pricing Information -->
        <!-- Footer -->
        <div class="footer">
          <div class="footer-brand">AtarWeb</div>
          <div class="footer-contact">
            <a href="mailto:admin@atarweb.com">admin@atarweb.com</a> | 
            <a href="https://atarweb.com">atarweb.com</a>
          </div>
          <div class="footer-note">
            Thank you for considering AtarWeb for your digital transformation needs.<br>
            We look forward to helping you achieve your business goals.
          </div>
        </div>
      </div>
    </body>
    </html>
  `
  
  return html
}

// Simple rate limiting (in production, use proper rate limiting)
const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW = 3600000 // 1 hour
const RATE_LIMIT_MAX = 3 // 3 requests per hour

function checkRateLimit(ip) {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, [])
  }
  
  const requests = rateLimitMap.get(ip).filter(time => time > windowStart)
  
  if (requests.length >= RATE_LIMIT_MAX) {
    return false
  }
  
  requests.push(now)
  rateLimitMap.set(ip, requests)
  return true
}

function getClientIP(req) {
  const xForwardedFor = req.headers.get('x-forwarded-for')
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim()
  }
  return req.ip || '127.0.0.1'
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

    // Parse form data
    const formData = await req.formData()
    
    const consultationData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      company: formData.get('company'),
      projectDetails: formData.get('projectDetails'),
      preferredDate: formData.get('preferredDate'),
      preferredTime: formData.get('preferredTime'),
      uploadedFile: formData.get('uploadedFile')
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
    const storedConsultation = addConsultation({
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

    // Use the same PDF generation as the downloadable version
    const quoteHTML = generateQuotePDF(storedConsultation, formattedDateTime)
    
    // Convert the HTML to a proper PDF using the same method as QuoteConfirmationModal
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    const quoteNumber = (storedConsultation.id || `CONS-${Date.now().toString().slice(-6)}`).substring(0, 8)
    
    // Create the same HTML structure as the downloadable PDF
    const htmlForPDF = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>AtarWeb Professional Quote</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.4; 
            color: #333; 
            background: #ffffff;
          }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          
          /* Header */
          .header { 
            margin-bottom: 30px;
          }
          .logo-section { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; 
            margin-bottom: 20px;
          }
          .logo { 
            font-size: 12px; 
            font-weight: 700; 
            color: #000; 
            letter-spacing: -0.5px;
          }
          .quote-meta {
            text-align: right;
            color: #666;
          }
          .quote-number { 
            font-size: 12px; 
            font-weight: 600; 
            color: #000; 
            margin-bottom: 4px;
          }
          .quote-date { font-size: 12px; }
          
          .header-title {
            text-align: left;
            margin-top: 0px;
          }
          .header-title h1 { 
            font-size: 12px; 
            color: #000; 
            margin-bottom: 8px;
            font-weight: 700;
          }
          .header-title p { 
            color: #666; 
            font-size: 12px;
          }
          
          /* Service Details */
          .service-details { 
            margin-bottom: 30px;
          }
          .service-details h3 { 
            color: #000; 
            margin-bottom: 15px; 
            font-size: 12px;
            font-weight: 700;
          }
          .service-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .service-table th {
            text-align: left;
            padding: 12px 0;
            border-bottom: 1px solid #e5e5e5;
            font-weight: 600;
            font-size: 12px;
            color: #666;
          }
          .service-table td {
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;
            font-size: 12px;
          }
          .service-table .description {
            color: #000;
          }
          .service-table .qty {
            text-align: center;
            color: #666;
          }
          .service-table .unit-price {
            text-align: right;
            color: #666;
          }
          .service-table .amount {
            text-align: right;
            font-weight: 600;
            color: #000;
          }
          .service-table .total-row {
            border-top: 2px solid #000;
            font-weight: 700;
          }
          
          /* Payment Summary */
          .payment-summary {
            margin-bottom: 30px;
          }
          .payment-amount {
            font-size: 12px;
            font-weight: 700;
            color: #000;
            margin-bottom: 20px;
          }
          .payment-details {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          }
          .payment-row {
            display: flex;
            justify-content: space-between;
            width: 200px;
            padding: 4px 0;
            font-size: 12px;
          }
          .payment-row.total {
            font-weight: 700;
            border-top: 1px solid #e5e5e5;
            padding-top: 8px;
            margin-top: 4px;
          }
          
          /* Footer */
          .footer { 
            margin-top: 30px; 
            text-align: center; 
            color: #666; 
            font-size: 12px;
            border-top: 1px solid #e5e5e5;
            padding-top: 20px;
          }
          .footer-brand {
            font-size: 12px;
            font-weight: 700;
            color: #000;
            margin-bottom: 8px;
          }
          .footer-contact {
            margin-bottom: 8px;
          }
          .footer-contact a {
            color: #2563eb;
            text-decoration: none;
          }
          .footer-note {
            font-style: italic;
            color: #999;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <div class="logo-section">
              <div class="logo">AtarWeb</div>
              <div class="quote-meta">
                <div class="quote-number">Quote #${quoteNumber}</div>
                <div class="quote-date">${currentDate}</div>
              </div>
            </div>
            <div class="header-title">
              <h1>Professional Web Development Quote</h1>
              <p>Custom Solutions for Your Business Success</p>
            </div>
          </div>
          
          <!-- Service Details -->
          <div class="service-details">
            <h3>Line Items</h3>
            <table class="service-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th class="qty">Qty</th>
                  <th class="unit-price">Unit price</th>
                  <th class="amount">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="description">Web Development - Base Service</td>
                  <td class="qty">1</td>
                  <td class="unit-price">$600.00</td>
                  <td class="amount">$600.00</td>
                </tr>
                <tr>
                  <td class="description">+ API Integration</td>
                  <td class="qty">1</td>
                  <td class="unit-price">$60.00</td>
                  <td class="amount">$60.00</td>
                </tr>
                <tr class="total-row">
                  <td class="description">Total</td>
                  <td class="qty"></td>
                  <td class="unit-price"></td>
                  <td class="amount">$660.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Payment Summary -->
          <div class="payment-summary">
            <div class="payment-amount">
              <strong>$660.00 paid on ${currentDate}</strong>
            </div>
            <div class="payment-details">
              <div class="payment-row">
                <span>Subtotal</span>
                <span>$660.00</span>
              </div>
              <div class="payment-row">
                <span>Total</span>
                <span>$660.00</span>
              </div>
              <div class="payment-row total">
                <span>Amount paid</span>
                <span>$660.00</span>
              </div>
            </div>
          </div>
      
          <!-- Footer -->
          <div class="footer">
            <div class="footer-brand">AtarWeb</div>
            <div class="footer-contact">
              <a href="mailto:admin@atarweb.com">admin@atarweb.com</a> | 
              <a href="https://atarweb.com">atarweb.com</a>
            </div>
            <div class="footer-note">
              Thank you for considering AtarWeb for your digital transformation needs.<br>
              We look forward to helping you achieve your business goals.
            </div>
          </div>
        </div>
      </body>
      </html>
    `
    
    // Generate proper PDF using jsPDF
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: [612, 792], // Letter size
    })
    
    // Header section (top of page)
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('AtarWeb', 50, 50)
    
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Quote #${quoteNumber}`, 400, 50)
    pdf.text(currentDate, 400, 70)
    
    pdf.setFont('helvetica', 'bold')
    pdf.text('Professional Web Development Quote', 50, 100)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Custom Solutions for Your Business Success', 50, 120)
    
    // Line Items section
    pdf.setFont('helvetica', 'bold')
    pdf.text('Line Items', 50, 160)
    
    // Table headers
    pdf.setFontSize(10)
    pdf.text('Description', 50, 190)
    pdf.text('Qty', 350, 190)
    pdf.text('Unit price', 400, 190)
    pdf.text('Amount', 500, 190)
    
    // Draw line under headers
    pdf.line(50, 200, 550, 200)
    
    // Table content
    pdf.setFont('helvetica', 'normal')
    pdf.text('Web Development - Base Service', 50, 220)
    pdf.text('1', 350, 220)
    pdf.text('$600.00', 400, 220)
    pdf.text('$600.00', 500, 220)
    
    pdf.text('+ API Integration', 50, 240)
    pdf.text('1', 350, 240)
    pdf.text('$60.00', 400, 240)
    pdf.text('$60.00', 500, 240)
    
    // Draw line above total
    pdf.line(50, 260, 550, 260)
    
    // Total row
    pdf.setFont('helvetica', 'bold')
    pdf.text('Total', 50, 280)
    pdf.text('$660.00', 500, 280)
    
    // Payment Summary
    pdf.setFont('helvetica', 'bold')
    pdf.text('Payment Summary', 50, 320)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`$660.00 paid on ${currentDate}`, 50, 340)
    pdf.text('Subtotal: $660.00', 50, 360)
    pdf.text('Total: $660.00', 50, 380)
    pdf.text('Amount paid: $660.00', 50, 400)
    
    // Footer
    pdf.setFont('helvetica', 'bold')
    pdf.text('AtarWeb', 50, 450)
    pdf.setFont('helvetica', 'normal')
    pdf.text('admin@atarweb.com | atarweb.com', 50, 470)
    pdf.text('Thank you for considering AtarWeb for your digital transformation needs.', 50, 490)
    pdf.text('We look forward to helping you achieve your business goals.', 50, 510)
    
    // Convert to buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))
    
    // Send email to admin using SendGrid (optional)
    let adminEmailResult = { success: true }
    let clientEmailResult = { success: true }
    
    if (process.env.SENDGRID_API_KEY) {
      try {
        adminEmailResult = await sgMail.send({
      to: 'admin@atarweb.com',
      from: process.env.SENDGRID_FROM_EMAIL || 'admin@atarweb.com',
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
      from: process.env.SENDGRID_FROM_EMAIL || 'admin@atarweb.com',
      subject: 'AtarWeb - Your Consultation Request & Quote',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank You for Your Consultation Request!</h2>
          <p>Dear ${consultationData.name},</p>
          <p>Thank you for reaching out to AtarWeb. We have received your consultation request and are excited to learn more about your project.</p>
          <p>We have scheduled your consultation for <strong>${formattedDateTime}</strong>. We will contact you shortly to confirm the details and prepare for our discussion.</p>
          <p>Attached to this email is a preliminary quote PDF based on your selections. This document outlines our proposed services and estimated investment.</p>
          <p>We look forward to speaking with you soon!</p>
          <p>Best regards,<br>The AtarWeb Team</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 0.8em; color: #777;">AtarWeb | <a href="https://atarweb.com" style="color: #2563eb;">atarweb.com</a></p>
        </div>
      `,
      attachments: [
        {
          content: pdfBuffer.toString('base64'),
          filename: `AtarWeb-Quote-${storedConsultation.id.substring(0, 8)}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
        }).then(() => ({ success: true })).catch(error => ({ success: false, error: error.message }))
        
      } catch (error) {
        console.error('Error sending emails:', error)
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
