// Automation Helper Functions
import { fileDb } from '@/lib/file-db'
import { productionDb } from '@/lib/production-db'

// Use production database in production, file-db in development
const db = process.env.NODE_ENV === 'production' ? productionDb : fileDb
import { generateDynamicEmail, selectEmailType } from './dynamic-email-generator'

// Lead scoring algorithm
export function calculateLeadScore(lead: any): number {
  let score = 50 // Base score
  
  // Industry scoring
  const industryScores: { [key: string]: number } = {
    'Technology': 20,
    'Healthcare': 18,
    'Finance': 16,
    'E-commerce': 15,
    'Real Estate': 14,
    'Manufacturing': 12,
    'Education': 10,
    'Restaurant': 8,
    'Retail': 6
  }
  
  if (lead.industry && industryScores[lead.industry]) {
    score += industryScores[lead.industry]
  }
  
  // Company size indicators
  if (lead.company) {
    const company = lead.company.toLowerCase()
    if (company.includes('inc') || company.includes('corp') || company.includes('llc')) {
      score += 10
    }
    if (company.includes('group') || company.includes('enterprises')) {
      score += 8
    }
  }
  
  // Contact completeness
  if (lead.email) score += 5
  if (lead.phone) score += 5
  if (lead.website) score += 10
  
  // Source quality
  const sourceScores: { [key: string]: number } = {
    'Website': 15,
    'Referral': 20,
    'LinkedIn': 12,
    'Google': 10,
    'Import': 5
  }
  
  if (lead.source && sourceScores[lead.source]) {
    score += sourceScores[lead.source]
  }
  
  // Cap the score between 0-100
  return Math.min(Math.max(score, 0), 100)
}

// Get next available sales rep
export async function getNextSalesRep() {
  const salesReps = await db.user.findMany()
  const salesUser = salesReps.find((user: any) => user.role === 'SALES')
  
  if (!salesUser) {
    // Create default sales user if none exists
    return await db.user.create({
      email: 'sales@atarwebb.com',
      password: 'sales123',
      name: 'Sales Team',
      role: 'SALES'
    })
  }
  
  return salesUser
}

// Date helper functions
export function getDaysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

export function getDaysSince(dateString: string): number {
  const date = new Date(dateString)
  const now = new Date()
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
}

// Slack notification (placeholder - you can implement actual Slack integration later)
export async function sendSlackNotification(message: string) {
  console.log(`[SLACK] ${message}`)
  // TODO: Implement actual Slack webhook
}

// Email sending function
// Check if a lead is unsubscribed
export async function isLeadUnsubscribed(email: string): Promise<boolean> {
  try {
    const leads = await fileDb.lead.findMany()
    const lead = leads.find((l: any) => l.email === email)
    return lead ? lead.unsubscribed === true : false
  } catch (error) {
    console.error('Error checking unsubscribe status:', error)
    return false
  }
}

export async function sendAutomationEmail(to: string, subject: string, html: string) {
  try {
    // Check if lead is unsubscribed
    const isUnsubscribed = await isLeadUnsubscribed(to)
    if (isUnsubscribed) {
      console.log(`[EMAIL]: ⏭️ Skipping email to ${to} - lead has unsubscribed`)
      return
    }

    // Check if we have email credentials
    if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASSWORD) {
      console.log(`[EMAIL]: ❌ No email credentials found - using console logging only`)
      console.log(`[EMAIL] To: ${to}`)
      console.log(`[EMAIL] Subject: ${subject}`)
      console.log(`[EMAIL] Body: ${html.substring(0, 200)}...`)
      return
    }

    const nodemailer = await import('nodemailer')
    
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASSWORD
      }
    })

    const mailOptions = {
      from: 'admin@atarwebb.com',
      to: to,
      subject: subject,
      html: html
    }

    await transporter.sendMail(mailOptions)
    console.log(`[EMAIL]: ✅ Sent to ${to}`)
  } catch (error) {
    console.error(`[EMAIL]: ❌ Failed to send to ${to}:`, error)
  }
}

// Email template helpers - now using dynamic generation
export function getFollowUpEmailTemplate(lead: any) {
  return generateDynamicEmail(lead, 'followup')
}

export function getWelcomeEmailTemplate(lead: any) {
  return generateDynamicEmail(lead, 'welcome')
}

// New function to get the best email type for a lead
export function getBestEmailTemplate(lead: any) {
  const emailType = selectEmailType(lead)
  return generateDynamicEmail(lead, emailType)
}
