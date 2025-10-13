// Main Automation Scheduler
import cron from 'node-cron'
import {
  updateAllLeadScores,
  followUpStaleLeads,
  assignUnassignedLeads,
  escalateOldLeads
} from './lead-management'
import {
  generateDailyReport,
  generateWeeklyReport,
  updateDashboardMetrics
} from './analytics'

// Initialize all scheduled automations
export function initializeAutomations() {
  console.log('🤖 Initializing CRM Automations...')
  
  // HOURLY AUTOMATIONS
  
  // Every hour: Update lead scores
  cron.schedule('0 * * * *', async () => {
    console.log('[CRON] Running hourly lead scoring...')
    await updateAllLeadScores()
  })
  
  // Every hour: Assign unassigned leads
  cron.schedule('15 * * * *', async () => {
    console.log('[CRON] Running lead assignment...')
    await assignUnassignedLeads()
  })
  
  // Every hour: Update dashboard metrics
  cron.schedule('30 * * * *', async () => {
    console.log('[CRON] Updating dashboard metrics...')
    await updateDashboardMetrics()
  })
  
  // DAILY AUTOMATIONS
  
  // Every day at 9:00 AM: Follow up with stale leads
  cron.schedule('0 9 * * *', async () => {
    console.log('[CRON] Running daily follow-up automation...')
    await followUpStaleLeads()
  })
  
  // Every day at 10:00 AM: Escalate old leads
  cron.schedule('0 10 * * *', async () => {
    console.log('[CRON] Running lead escalation...')
    await escalateOldLeads()
  })
  
  // Every day at 6:00 PM: Generate daily report
  cron.schedule('0 18 * * *', async () => {
    console.log('[CRON] Generating daily report...')
    await generateDailyReport()
  })
  
  // WEEKLY AUTOMATIONS
  
  // Every Monday at 9:00 AM: Generate weekly report
  cron.schedule('0 9 * * 1', async () => {
    console.log('[CRON] Generating weekly report...')
    await generateWeeklyReport()
  })
  
  console.log('✅ All automations initialized successfully!')
  console.log('\n📅 Automation Schedule:')
  console.log('  HOURLY:')
  console.log('    - :00 - Update lead scores')
  console.log('    - :15 - Assign unassigned leads')
  console.log('    - :30 - Update dashboard metrics')
  console.log('\n  DAILY:')
  console.log('    - 09:00 AM - Follow up stale leads')
  console.log('    - 10:00 AM - Escalate old leads')
  console.log('    - 06:00 PM - Generate daily report')
  console.log('\n  WEEKLY:')
  console.log('    - Monday 09:00 AM - Generate weekly report')
  console.log('\n')
}

// Manual trigger functions (for testing or on-demand execution)
export async function runAllAutomations() {
  console.log('🚀 Running all automations manually...')
  
  await updateAllLeadScores()
  await assignUnassignedLeads()
  await followUpStaleLeads()
  await escalateOldLeads()
  await updateDashboardMetrics()
  await generateDailyReport()
  
  console.log('✅ All automations completed!')
}

// Export individual automation triggers
export {
  updateAllLeadScores,
  followUpStaleLeads,
  assignUnassignedLeads,
  escalateOldLeads,
  generateDailyReport,
  generateWeeklyReport,
  updateDashboardMetrics
}

