// Automation Helper Functions
import { mockDb } from '@/lib/mock-db'

// Date helpers
export function getDaysAgo(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

export function getDaysSince(dateString: string): number {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Lead scoring algorithm
export function calculateLeadScore(lead: any): number {
  let score = 0
  
  // Base score
  score += 10
  
  // Contact information
  if (lead.email) score += 15
  if (lead.phone) score += 15
  
  // Company information
  if (lead.company) score += 10
  if (lead.title) score += 5
  if (lead.website) score += 5
  
  // Industry scoring
  const highValueIndustries = ['Technology', 'Finance', 'Healthcare', 'E-commerce']
  if (lead.industry && highValueIndustries.includes(lead.industry)) {
    score += 20
  }
  
  // Location data
  if (lead.city && lead.state) score += 5
  
  // Source scoring
  if (lead.source === 'Referral') score += 15
  if (lead.source === 'Website') score += 10
  if (lead.source === 'Import') score += 5
  
  return Math.min(score, 100) // Cap at 100
}

// Round-robin assignment helper
let lastAssignedIndex = 0

export async function getNextSalesRep() {
  const salesReps = await mockDb.user.findMany()
  const salesUsers = salesReps.filter(u => u.role === 'SALES')
  
  if (salesUsers.length === 0) {
    return { id: '2', name: 'Default Sales', email: 'sales@atarwebb.com' }
  }
  
  const rep = salesUsers[lastAssignedIndex % salesUsers.length]
  lastAssignedIndex++
  
  return rep
}

// Email template helpers
export function getFollowUpEmailTemplate(lead: any) {
  return {
    subject: `Following up on your inquiry`,
    html: `
      <h2>Hi ${lead.firstName},</h2>
      <p>I wanted to follow up on your recent inquiry about our services.</p>
      <p>At AtarWebb, we specialize in creating custom web applications that transform businesses.</p>
      <p>Would you be available for a quick 15-minute call this week to discuss your needs?</p>
      <br>
      <p>Best regards,<br>
      AtarWebb Team</p>
    `
  }
}

export function getWelcomeEmailTemplate(lead: any) {
  return {
    subject: `Welcome to AtarWebb!`,
    html: `
      <h2>Welcome ${lead.firstName}!</h2>
      <p>Thank you for your interest in AtarWebb.</p>
      <p>We're excited to help you transform your business with custom web solutions.</p>
      <p>A member of our team will reach out to you shortly to discuss your specific needs.</p>
      <br>
      <p>In the meantime, feel free to check out our portfolio at <a href="https://atarwebb.com/portfolio">atarwebb.com/portfolio</a></p>
      <br>
      <p>Best regards,<br>
      The AtarWebb Team</p>
    `
  }
}

// Notification helpers (Email instead of Slack)
export async function sendSlackNotification(message: string) {
  // Log to console for development
  console.log(`[CRM ALERT]: ${message}`)
  
  // Send email notification to admin
  await sendAutomationEmail(
    'admin@atarwebb.com',
    '🤖 CRM Automation Alert',
    `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #2563eb;">CRM Notification</h2>
        <p style="font-size: 16px; line-height: 1.5;">${message}</p>
        <hr style="margin: 20px 0; border: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          This is an automated notification from your CRM system.
        </p>
      </div>
    `
  )
}

// Email sending helper
export async function sendAutomationEmail(to: string, subject: string, html: string) {
  console.log(`[EMAIL]: Sending to ${to} - ${subject}`)
  
  // Get API key from environment
  const apiKey = process.env.SENDGRID_API_KEY
  
  if (!apiKey) {
    console.warn('[EMAIL]: SENDGRID_API_KEY not found - email not sent (development mode)')
    return
  }
  
  try {
    // Use SendGrid API (same as consultation submit)
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }]
        }],
        from: {
          email: 'noreply@atarwebb.com',
          name: 'AtarWebb CRM'
        },
        subject: subject,
        content: [{
          type: 'text/html',
          value: html
        }]
      })
    })
    
    if (response.ok) {
      console.log(`[EMAIL]: Successfully sent to ${to}`)
    } else {
      const error = await response.text()
      console.error(`[EMAIL ERROR]: ${response.status} - ${error}`)
    }
  } catch (error) {
    console.error('[EMAIL ERROR]:', error)
  }
}

