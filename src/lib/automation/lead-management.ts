// Lead Management Automations
import { mockDb } from '@/lib/mock-db'
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

// AUTO 1: New Lead Processing
export async function processNewLead(leadId: string) {
  console.log(`[AUTOMATION] Processing new lead: ${leadId}`)
  
  const lead = await mockDb.lead.findUnique({ where: { id: leadId } })
  if (!lead) return
  
  // 1. Calculate and assign lead score
  const score = calculateLeadScore(lead)
  await mockDb.lead.update({
    where: { id: leadId },
    data: { score }
  })
  
  // 2. Auto-assign to sales rep if not assigned
  if (!lead.userId || lead.userId === '1') {
    const salesRep = await getNextSalesRep()
    await mockDb.lead.update({
      where: { id: leadId },
      data: { userId: salesRep.id }
    })
    
    // Notify sales rep
    await sendSlackNotification(
      `🎯 New lead assigned to ${salesRep.name}: ${lead.firstName} ${lead.lastName} (Score: ${score})`
    )
  }
  
  // 3. Send welcome email
  const emailTemplate = getWelcomeEmailTemplate(lead)
  if (lead.email) {
    await sendAutomationEmail(lead.email, emailTemplate.subject, emailTemplate.html)
  }
  
  // 4. Create follow-up task for sales rep
  await mockDb.task.create({
    data: {
      id: `task-${Date.now()}`,
      title: `Call ${lead.firstName} ${lead.lastName}`,
      description: `Initial outreach call for new lead from ${lead.source}`,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
      priority: score > 70 ? 'HIGH' : score > 50 ? 'MEDIUM' : 'LOW',
      status: 'PENDING',
      category: 'Sales',
      assignedTo: lead.userId || '2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  })
  
  console.log(`[AUTOMATION] New lead processed successfully: ${leadId}`)
}

// AUTO 2: Auto Lead Scoring (for all existing leads)
export async function updateAllLeadScores() {
  console.log('[AUTOMATION] Updating all lead scores...')
  
  const leads = await mockDb.lead.findMany()
  let updated = 0
  
  for (const lead of leads) {
    const newScore = calculateLeadScore(lead)
    if (newScore !== lead.score) {
      await mockDb.lead.update({
        where: { id: lead.id },
        data: { score: newScore }
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
  
  const leads = await mockDb.lead.findMany()
  const staleLeads = leads.filter(lead => {
    const daysSince = getDaysSince(lead.updatedAt)
    return (lead.status === 'FOLLOW_UP' || lead.status === 'NEW') && daysSince >= 3
  })
  
  for (const lead of staleLeads) {
    if (!lead.email) continue
    
    // Send follow-up email
    const emailTemplate = getFollowUpEmailTemplate(lead)
    await sendAutomationEmail(lead.email, emailTemplate.subject, emailTemplate.html)
    
    // Update lead
    await mockDb.lead.update({
      where: { id: lead.id },
      data: {
        notes: `${lead.notes || ''}\n[AUTO] Follow-up email sent on ${new Date().toLocaleDateString()}`,
        updatedAt: new Date().toISOString()
      }
    })
  }
  
  console.log(`[AUTOMATION] Sent ${staleLeads.length} follow-up emails`)
  await sendSlackNotification(`📧 Follow-up automation complete: ${staleLeads.length} emails sent`)
}

// AUTO 4: Auto-assign Unassigned Leads
export async function assignUnassignedLeads() {
  console.log('[AUTOMATION] Assigning unassigned leads...')
  
  const leads = await mockDb.lead.findMany()
  const unassigned = leads.filter(lead => !lead.userId || lead.userId === '1')
  
  for (const lead of unassigned) {
    const salesRep = await getNextSalesRep()
    await mockDb.lead.update({
      where: { id: lead.id },
      data: { userId: salesRep.id }
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
  
  const leads = await mockDb.lead.findMany()
  const oldLeads = leads.filter(lead => {
    const daysSince = getDaysSince(lead.createdAt)
    return lead.status === 'NEW' && daysSince >= 7
  })
  
  for (const lead of oldLeads) {
    await sendSlackNotification(
      `⚠️ ESCALATION: Lead ${lead.firstName} ${lead.lastName} has been NEW for ${getDaysSince(lead.createdAt)} days!`
    )
    
    // Update status to FOLLOW_UP
    await mockDb.lead.update({
      where: { id: lead.id },
      data: { 
        status: 'FOLLOW_UP',
        notes: `${lead.notes || ''}\n[AUTO] Escalated due to age on ${new Date().toLocaleDateString()}`
      }
    })
  }
  
  console.log(`[AUTOMATION] Escalated ${oldLeads.length} old leads`)
}

