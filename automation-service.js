#!/usr/bin/env node

/**
 * CRM Automation Service
 * 
 * Runs all CRM automations on a schedule in the background
 * 
 * Usage:
 *   npm run automate:start       // Start the automation service
 *   npm run automate:stop        // Stop it (Ctrl+C)
 */

const cron = require('node-cron')
const { scoreAllLeads, assignUnassignedLeads, followUpStaleLeads, escalateOldLeads } = require('./src/lib/automation/lead-management')
const { updateDashboardMetrics, generateDailyReport, generateWeeklyReport } = require('./src/lib/automation/analytics')

console.log('\n🤖 CRM Automation Service Starting...\n')

// Track running status
let isRunning = true

// --- HOURLY AUTOMATIONS ---

// Update lead scores every hour at :00
cron.schedule('0 * * * *', async () => {
  if (!isRunning) return
  console.log('\n⏰ [HOURLY] Running lead scoring...')
  try {
    await scoreAllLeads()
    console.log('✅ Lead scoring completed\n')
  } catch (error) {
    console.error('❌ Lead scoring failed:', error.message)
  }
})

// Assign unassigned leads every hour at :15
cron.schedule('15 * * * *', async () => {
  if (!isRunning) return
  console.log('\n⏰ [HOURLY] Running lead assignment...')
  try {
    await assignUnassignedLeads()
    console.log('✅ Lead assignment completed\n')
  } catch (error) {
    console.error('❌ Lead assignment failed:', error.message)
  }
})

// Update dashboard metrics every hour at :30
cron.schedule('30 * * * *', async () => {
  if (!isRunning) return
  console.log('\n⏰ [HOURLY] Updating dashboard metrics...')
  try {
    await updateDashboardMetrics()
    console.log('✅ Dashboard metrics updated\n')
  } catch (error) {
    console.error('❌ Dashboard metrics update failed:', error.message)
  }
})

// --- DAILY AUTOMATIONS ---

// Follow up stale leads every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  if (!isRunning) return
  console.log('\n⏰ [DAILY 9AM] Running stale lead follow-up...')
  try {
    await followUpStaleLeads()
    console.log('✅ Follow-up emails sent\n')
  } catch (error) {
    console.error('❌ Follow-up failed:', error.message)
  }
})

// Escalate old leads every day at 10 AM
cron.schedule('0 10 * * *', async () => {
  if (!isRunning) return
  console.log('\n⏰ [DAILY 10AM] Running lead escalation...')
  try {
    await escalateOldLeads()
    console.log('✅ Lead escalation completed\n')
  } catch (error) {
    console.error('❌ Lead escalation failed:', error.message)
  }
})

// Generate daily report every day at 6 PM
cron.schedule('0 18 * * *', async () => {
  if (!isRunning) return
  console.log('\n⏰ [DAILY 6PM] Generating daily report...')
  try {
    await generateDailyReport()
    console.log('✅ Daily report sent\n')
  } catch (error) {
    console.error('❌ Daily report failed:', error.message)
  }
})

// --- WEEKLY AUTOMATIONS ---

// Generate weekly report every Monday at 9 AM
cron.schedule('0 9 * * 1', async () => {
  if (!isRunning) return
  console.log('\n⏰ [WEEKLY MONDAY 9AM] Generating weekly report...')
  try {
    await generateWeeklyReport()
    console.log('✅ Weekly report sent\n')
  } catch (error) {
    console.error('❌ Weekly report failed:', error.message)
  }
})

// Display schedule
console.log('✅ All automation schedules initialized!\n')
console.log('📅 Automation Schedule:')
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
console.log('\n🚀 Automation service is now running!')
console.log('💡 Press Ctrl+C to stop\n')
console.log('━'.repeat(60))

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down automation service...')
  isRunning = false
  console.log('✅ Automation service stopped\n')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Shutting down automation service...')
  isRunning = false
  console.log('✅ Automation service stopped\n')
  process.exit(0)
})

// Keep the process running
process.stdin.resume()

// Run initial automations on startup (optional - uncomment if you want)
// console.log('\n🔄 Running initial automation cycle...\n')
// setTimeout(async () => {
//   try {
//     await scoreAllLeads()
//     await assignUnassignedLeads()
//     await updateDashboardMetrics()
//     console.log('\n✅ Initial automation cycle completed!\n')
//   } catch (error) {
//     console.error('❌ Initial automation failed:', error)
//   }
// }, 1000)

