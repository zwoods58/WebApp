// Analytics & Reporting Automations
import { mockDb } from '@/lib/mock-db'
import { getDaysAgo, sendSlackNotification, sendAutomationEmail } from './helpers'

// AUTO 6: Daily Sales Report
export async function generateDailyReport() {
  console.log('[AUTOMATION] Generating daily sales report...')
  
  const today = new Date()
  const yesterday = getDaysAgo(1)
  
  const allLeads = await mockDb.lead.findMany()
  
  // Calculate metrics
  const newLeadsToday = allLeads.filter(l => 
    new Date(l.createdAt) >= yesterday
  ).length
  
  const closedDealsToday = allLeads.filter(l => 
    l.status === 'CLOSED_WON' && 
    new Date(l.updatedAt) >= yesterday
  ).length
  
  const totalLeads = allLeads.length
  const newLeads = allLeads.filter(l => l.status === 'NEW').length
  const followUpLeads = allLeads.filter(l => l.status === 'FOLLOW_UP').length
  const qualifiedLeads = allLeads.filter(l => l.status === 'QUALIFIED').length
  const appointmentLeads = allLeads.filter(l => l.status === 'APPOINTMENT_BOOKED').length
  const closedLeads = allLeads.filter(l => l.status === 'CLOSED_WON').length
  
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
  
  const allLeads = await mockDb.lead.findMany()
  
  // This week's metrics
  const newLeadsThisWeek = allLeads.filter(l => 
    new Date(l.createdAt) >= weekAgo
  ).length
  
  const closedDealsThisWeek = allLeads.filter(l => 
    l.status === 'CLOSED_WON' && 
    new Date(l.updatedAt) >= weekAgo
  ).length
  
  // Calculate average score
  const avgScore = allLeads.length > 0
    ? (allLeads.reduce((sum, lead) => sum + (lead.score || 0), 0) / allLeads.length).toFixed(1)
    : '0.0'
  
  const report = `
📈 *Weekly Performance Report*

*This Week:*
• New Leads: ${newLeadsThisWeek}
• Closed Deals: ${closedDealsThisWeek}
• Average Lead Score: ${avgScore}

*Total Pipeline:*
• Total Leads: ${allLeads.length}
• Active Leads: ${allLeads.filter(l => l.status !== 'CLOSED_WON' && l.status !== 'NOT_INTERESTED').length}
  `.trim()
  
  await sendSlackNotification(report)
  console.log('[AUTOMATION] Weekly report sent successfully')
}

// AUTO 8: Real-time Dashboard Metrics Update
export async function updateDashboardMetrics() {
  console.log('[AUTOMATION] Updating dashboard metrics...')
  
  // This function can be called frequently to keep dashboard data fresh
  // In a real implementation, you'd update a cache or database table
  
  const allLeads = await mockDb.lead.findMany()
  
  const metrics = {
    totalLeads: allLeads.length,
    newLeads: allLeads.filter(l => l.status === 'NEW').length,
    qualifiedLeads: allLeads.filter(l => l.status === 'QUALIFIED').length,
    closedWonLeads: allLeads.filter(l => l.status === 'CLOSED_WON').length,
    averageScore: allLeads.length > 0
      ? allLeads.reduce((sum, l) => sum + (l.score || 0), 0) / allLeads.length
      : 0,
    lastUpdated: new Date().toISOString()
  }
  
  // In a real app, store these metrics somewhere accessible
  console.log('[AUTOMATION] Dashboard metrics updated:', metrics)
  
  return metrics
}

