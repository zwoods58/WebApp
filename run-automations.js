#!/usr/bin/env node

/**
 * Run CRM Automations Locally
 * 
 * Usage:
 *   node run-automations.js              // Run all automations
 *   node run-automations.js score        // Run lead scoring
 *   node run-automations.js assign       // Run lead assignment
 *   node run-automations.js metrics      // Update dashboard metrics
 *   node run-automations.js followup     // Send follow-up emails
 *   node run-automations.js escalate     // Escalate old leads
 *   node run-automations.js daily        // Generate daily report
 *   node run-automations.js weekly       // Generate weekly report
 */

const { scoreAllLeads, assignUnassignedLeads, followUpStaleLeads, escalateOldLeads } = require('./src/lib/automation/lead-management')
const { updateDashboardMetrics, generateDailyReport, generateWeeklyReport } = require('./src/lib/automation/analytics')

const automations = {
  score: {
    name: 'Lead Scoring',
    fn: scoreAllLeads
  },
  assign: {
    name: 'Lead Assignment',
    fn: assignUnassignedLeads
  },
  metrics: {
    name: 'Dashboard Metrics Update',
    fn: updateDashboardMetrics
  },
  followup: {
    name: 'Follow-up Stale Leads',
    fn: followUpStaleLeads
  },
  escalate: {
    name: 'Escalate Old Leads',
    fn: escalateOldLeads
  },
  daily: {
    name: 'Daily Report',
    fn: generateDailyReport
  },
  weekly: {
    name: 'Weekly Report',
    fn: generateWeeklyReport
  }
}

async function runAutomation(type) {
  const automation = automations[type]
  if (!automation) {
    console.error(`❌ Unknown automation: ${type}`)
    console.log('\nAvailable automations:')
    Object.keys(automations).forEach(key => {
      console.log(`  - ${key}: ${automations[key].name}`)
    })
    process.exit(1)
  }

  console.log(`\n🤖 Running: ${automation.name}...`)
  console.log('━'.repeat(50))
  
  try {
    await automation.fn()
    console.log('━'.repeat(50))
    console.log(`✅ ${automation.name} completed successfully!\n`)
  } catch (error) {
    console.log('━'.repeat(50))
    console.error(`❌ ${automation.name} failed:`, error.message)
    console.error(error)
    process.exit(1)
  }
}

async function runAllAutomations() {
  console.log('\n🚀 Running ALL CRM Automations...')
  console.log('═'.repeat(50))
  
  for (const [key, automation] of Object.entries(automations)) {
    console.log(`\n📋 ${automation.name}...`)
    try {
      await automation.fn()
      console.log(`✅ ${automation.name} - Done`)
    } catch (error) {
      console.error(`❌ ${automation.name} - Failed:`, error.message)
    }
  }
  
  console.log('\n═'.repeat(50))
  console.log('✅ All automations completed!\n')
}

// Main execution
const args = process.argv.slice(2)

if (args.length === 0) {
  runAllAutomations().catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
} else {
  runAutomation(args[0]).catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
}

