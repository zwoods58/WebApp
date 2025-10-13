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

// Slack notification helpers
export async function sendSlackNotification(message: string) {
  // TODO: Implement actual Slack webhook
  console.log(`[SLACK NOTIFICATION]: ${message}`)
  // Example implementation:
  // await fetch(process.env.SLACK_WEBHOOK_URL, {
  //   method: 'POST',
  //   body: JSON.stringify({ text: message })
  // })
}

// Email sending helper
export async function sendAutomationEmail(to: string, subject: string, html: string) {
  // TODO: Integrate with actual SendGrid API
  console.log(`[EMAIL SENT]: To: ${to}, Subject: ${subject}`)
  // Example implementation:
  // await sendgrid.send({
  //   to,
  //   from: 'noreply@atarwebb.com',
  //   subject,
  //   html
  // })
}

