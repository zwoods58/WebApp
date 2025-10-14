// Lead Management Automations
import { fileDb } from '@/lib/file-db'
import { productionDb } from '@/lib/production-db'

// Use production database in production, file-db in development
const db = process.env.NODE_ENV === 'production' ? productionDb : fileDb
import { 
  calculateLeadScore, 
  getNextSalesRep, 
  getDaysAgo,
  getDaysSince,
  sendSlackNotification,
  sendAutomationEmail,
  getWelcomeEmailTemplate,
  getFollowUpEmailTemplate
} from './helpers'

interface Lead {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
  title?: string
  source?: string
  industry?: string
  website?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  timeZone?: string
  status: 'NEW' | 'NOT_INTERESTED' | 'FOLLOW_UP' | 'QUALIFIED' | 'APPOINTMENT_BOOKED' | 'CLOSED_WON'
  statusDetail?: string
  score: number
  notes?: string
  lastContact?: string
  userId: string
  unsubscribed: boolean
  createdAt: string
  updatedAt: string
}

// AUTO 1: New Lead Processing
export async function processNewLead(leadId: string) {
  console.log(`[AUTOMATION] Processing new lead: ${leadId}`)
  
  const lead = await fileDb.lead.findUnique({ where: { id: leadId } })
  if (!lead) return
  
  // 1. Calculate and assign lead score
  const score = calculateLeadScore(lead)
  await fileDb.lead.update(leadId, {
    score,
    updatedAt: new Date().toISOString()
  })
  
  // 2. Auto-assign to sales rep if not assigned
  if (!lead.userId || lead.userId === '1') {
    const salesRep = await getNextSalesRep()
    await fileDb.lead.update(leadId, {
      userId: salesRep.id,
      updatedAt: new Date().toISOString()
    })
    
    // Notify sales rep
    await sendSlackNotification(
      `🎯 New lead assigned to ${salesRep.name}: ${lead.firstName} ${lead.lastName} (Score: ${score})`
    )
  }
  
  // 3. Send welcome email using dynamic generation
  const emailTemplate = getWelcomeEmailTemplate(lead)
  if (lead.email) {
    await sendAutomationEmail(lead.email, emailTemplate.subject, emailTemplate.html)
  }
  
  // 4. Create follow-up task for sales rep
      await db.task.create({
    title: `Call ${lead.firstName} ${lead.lastName}`,
    description: `Initial outreach call for new lead from ${lead.source}`,
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    priority: score > 70 ? 'HIGH' : score > 50 ? 'MEDIUM' : 'LOW',
    status: 'PENDING',
    category: 'Sales',
    assignedTo: lead.userId || '2'
  })
  
  console.log(`[AUTOMATION] New lead processed successfully: ${leadId}`)
}

// AUTO 2: Auto Lead Scoring (for all existing leads)
export async function updateAllLeadScores() {
  console.log('[AUTOMATION] Updating all lead scores...')
  
  const leads = await db.lead.findMany()
  let updated = 0
  
  for (const lead of leads) {
    const newScore = calculateLeadScore(lead)
    if (newScore !== lead.score) {
      await db.lead.update(lead.id, {
        score: newScore,
        updatedAt: new Date().toISOString()
      })
      updated++
    }
  }
  
  console.log(`[AUTOMATION] Updated ${updated} lead scores`)
  await sendSlackNotification(`📊 Lead scoring complete: ${updated} leads updated`)
}

// AUTO 3: Auto Follow-up for Stale Leads
export async function followUpStaleLeads() {
  console.log('[AUTOMATION] Following up with stale leads...')
  
  const leads: Lead[] = await db.lead.findMany()
  const staleLeads = leads.filter((lead: Lead) => {
    const daysSince = getDaysSince(lead.updatedAt)
    return (lead.status === 'FOLLOW_UP' || lead.status === 'NEW') && daysSince >= 3
  })
  
  for (const lead of staleLeads) {
    if (!lead.email || lead.unsubscribed) continue
    
    // Send follow-up email using dynamic generation
    const emailTemplate = getFollowUpEmailTemplate(lead)
    await sendAutomationEmail(lead.email, emailTemplate.subject, emailTemplate.html)
    
    // Update lead
      await db.lead.update(lead.id, {
      notes: `${lead.notes || ''}\n[AUTO] Follow-up email sent on ${new Date().toLocaleDateString()}`,
      updatedAt: new Date().toISOString()
    })
  }
  
  console.log(`[AUTOMATION] Sent ${staleLeads.length} follow-up emails`)
  await sendSlackNotification(`📧 Follow-up automation complete: ${staleLeads.length} emails sent`)
}

// AUTO 4: Auto-assign Unassigned Leads
export async function assignUnassignedLeads() {
  console.log('[AUTOMATION] Assigning unassigned leads...')
  
  const leads: Lead[] = await db.lead.findMany()
  const unassigned = leads.filter((lead: Lead) => !lead.userId || lead.userId === '1')
  
  for (const lead of unassigned) {
    const salesRep = await getNextSalesRep()
      await db.lead.update(lead.id, {
      userId: salesRep.id,
      updatedAt: new Date().toISOString()
    })
    
    await sendSlackNotification(
      `🎯 Lead auto-assigned to ${salesRep.name}: ${lead.firstName} ${lead.lastName}`
    )
  }
  
  console.log(`[AUTOMATION] Assigned ${unassigned.length} leads`)
}

// AUTO 5: Escalate Old Leads
export async function escalateOldLeads() {
  console.log('[AUTOMATION] Escalating old leads...')
  
  const leads: Lead[] = await db.lead.findMany()
  const oldLeads = leads.filter((lead: Lead) => {
    const daysSince = getDaysSince(lead.createdAt)
    return lead.status === 'NEW' && daysSince >= 7
  })
  
  for (const lead of oldLeads) {
    await sendSlackNotification(
      `⚠️ ESCALATION: Lead ${lead.firstName} ${lead.lastName} has been NEW for ${getDaysSince(lead.createdAt)} days!`
    )
    
    // Update status to FOLLOW_UP
      await db.lead.update(lead.id, {
      status: 'FOLLOW_UP',
      notes: `${lead.notes || ''}\n[AUTO] Escalated due to age on ${new Date().toLocaleDateString()}`,
      updatedAt: new Date().toISOString()
    })
  }
  
  console.log(`[AUTOMATION] Escalated ${oldLeads.length} old leads`)
}

