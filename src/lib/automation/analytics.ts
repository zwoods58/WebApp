// Analytics & Reporting Automations
import { fileDb } from '@/lib/file-db'
import { productionDb } from '@/lib/production-db'

// Use production database in production, file-db in development
const db = process.env.NODE_ENV === 'production' ? productionDb : fileDb
import { getDaysAgo, sendSlackNotification, sendAutomationEmail } from './helpers'

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

// AUTO 6: Daily Sales Report
export async function generateDailyReport() {
  console.log('[AUTOMATION] Generating daily sales report...')
  
  const today = new Date()
  const yesterday = getDaysAgo(1)
  
  const allLeads: Lead[] = await db.lead.findMany()
  
  // Calculate metrics
  const newLeadsToday = allLeads.filter((l: Lead) => 
    new Date(l.createdAt) >= new Date(yesterday)
  ).length
  
  const closedDealsToday = allLeads.filter((l: Lead) => 
    l.status === 'CLOSED_WON' && 
    new Date(l.updatedAt) >= new Date(yesterday)
  ).length
  
  const totalLeads = allLeads.length
  const newLeads = allLeads.filter((l: Lead) => l.status === 'NEW').length
  const followUpLeads = allLeads.filter((l: Lead) => l.status === 'FOLLOW_UP').length
  const qualifiedLeads = allLeads.filter((l: Lead) => l.status === 'QUALIFIED').length
  const appointmentLeads = allLeads.filter((l: Lead) => l.status === 'APPOINTMENT_BOOKED').length
  const closedLeads = allLeads.filter((l: Lead) => l.status === 'CLOSED_WON').length
  
  const conversionRate = totalLeads > 0 
    ? ((closedLeads / totalLeads) * 100).toFixed(2) 
    : '0.00'
  
  // Industry breakdown
  const industryMap: { [key: string]: number } = {}
  allLeads.forEach(lead => {
    const industry = lead.industry || 'Unknown'
    industryMap[industry] = (industryMap[industry] || 0) + 1
  })
  
  // Source breakdown
  const sourceMap: { [key: string]: number } = {}
  allLeads.forEach(lead => {
    const source = lead.source || 'Unknown'
    sourceMap[source] = (sourceMap[source] || 0) + 1
  })
  
  // Build report
  const report = `
📊 *Daily CRM Report* - ${today.toLocaleDateString()}

*Today's Activity:*
• New Leads: ${newLeadsToday}
• Closed Deals: ${closedDealsToday}

*Pipeline Overview:*
• Total Leads: ${totalLeads}
• NEW: ${newLeads}
• FOLLOW_UP: ${followUpLeads}
• QUALIFIED: ${qualifiedLeads}
• APPOINTMENTS: ${appointmentLeads}
• CLOSED WON: ${closedLeads}
• Conversion Rate: ${conversionRate}%

*Top Industries:*
${Object.entries(industryMap)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 3)
  .map(([industry, count]) => `• ${industry}: ${count}`)
  .join('\n')}

*Lead Sources:*
${Object.entries(sourceMap)
  .sort((a, b) => b[1] - a[1])
  .map(([source, count]) => `• ${source}: ${count}`)
  .join('\n')}
  `.trim()
  
  // Send to Slack
  await sendSlackNotification(report)
  
  // Send email report
  const htmlReport = `
    <h2>Daily CRM Report - ${today.toLocaleDateString()}</h2>
    
    <h3>Today's Activity:</h3>
    <ul>
      <li>New Leads: <strong>${newLeadsToday}</strong></li>
      <li>Closed Deals: <strong>${closedDealsToday}</strong></li>
    </ul>
    
    <h3>Pipeline Overview:</h3>
    <ul>
      <li>Total Leads: ${totalLeads}</li>
      <li>NEW: ${newLeads}</li>
      <li>FOLLOW_UP: ${followUpLeads}</li>
      <li>QUALIFIED: ${qualifiedLeads}</li>
      <li>APPOINTMENTS: ${appointmentLeads}</li>
      <li>CLOSED WON: ${closedLeads}</li>
      <li>Conversion Rate: ${conversionRate}%</li>
    </ul>
    
    <h3>Top Industries:</h3>
    <ul>
      ${Object.entries(industryMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([industry, count]) => `<li>${industry}: ${count}</li>`)
        .join('')}
    </ul>
  `
  
  await sendAutomationEmail(
    'admin@atarwebb.com', 
    `Daily CRM Report - ${today.toLocaleDateString()}`,
    htmlReport
  )
  
  console.log('[AUTOMATION] Daily report sent successfully')
}

// AUTO 7: Weekly Performance Report
export async function generateWeeklyReport() {
  console.log('[AUTOMATION] Generating weekly performance report...')
  
  const now = new Date()
  const weekAgo = getDaysAgo(7)
  
  const allLeads = await fileDb.lead.findMany()
  
  // This week's metrics
  const newLeadsThisWeek = allLeads.filter((l: Lead) => 
    new Date(l.createdAt) >= new Date(weekAgo)
  ).length
  
  const closedDealsThisWeek = allLeads.filter((l: Lead) => 
    l.status === 'CLOSED_WON' && 
    new Date(l.updatedAt) >= new Date(weekAgo)
  ).length
  
  // Calculate average score
  const avgScore = allLeads.length > 0
    ? (allLeads.reduce((sum: number, lead: Lead) => sum + (lead.score || 0), 0) / allLeads.length).toFixed(1)
    : '0.0'
  
  const report = `
📈 *Weekly Performance Report*

*This Week:*
• New Leads: ${newLeadsThisWeek}
• Closed Deals: ${closedDealsThisWeek}
• Average Lead Score: ${avgScore}

*Total Pipeline:*
• Total Leads: ${allLeads.length}
• Active Leads: ${allLeads.filter((l: Lead) => l.status !== 'CLOSED_WON' && l.status !== 'NOT_INTERESTED').length}
  `.trim()
  
  await sendSlackNotification(report)
  console.log('[AUTOMATION] Weekly report sent successfully')
}

// AUTO 8: Real-time Dashboard Metrics Update
export async function updateDashboardMetrics() {
  console.log('[AUTOMATION] Updating dashboard metrics...')
  
  // This function can be called frequently to keep dashboard data fresh
  // In a real implementation, you'd update a cache or database table
  
  const allLeads = await fileDb.lead.findMany()
  
  const metrics = {
    totalLeads: allLeads.length,
    newLeads: allLeads.filter((l: Lead) => l.status === 'NEW').length,
    qualifiedLeads: allLeads.filter((l: Lead) => l.status === 'QUALIFIED').length,
    closedWonLeads: allLeads.filter((l: Lead) => l.status === 'CLOSED_WON').length,
    averageScore: allLeads.length > 0
      ? allLeads.reduce((sum: number, l: Lead) => sum + (l.score || 0), 0) / allLeads.length
      : 0,
    lastUpdated: new Date().toISOString()
  }
  
  // In a real app, store these metrics somewhere accessible
  console.log('[AUTOMATION] Dashboard metrics updated:', metrics)
  
  return metrics
}

