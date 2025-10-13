import { NextResponse } from 'next/server'
import {
  updateAllLeadScores,
  followUpStaleLeads,
  assignUnassignedLeads,
  escalateOldLeads,
  generateDailyReport,
  generateWeeklyReport,
  updateDashboardMetrics
} from '@/lib/automation/scheduler'

export async function POST(request: Request) {
  try {
    const { automation } = await request.json()
    
    let result
    
    switch (automation) {
      case 'lead-scoring':
        await updateAllLeadScores()
        result = 'Lead scoring completed'
        break
        
      case 'follow-up':
        await followUpStaleLeads()
        result = 'Follow-up emails sent'
        break
        
      case 'assignment':
        await assignUnassignedLeads()
        result = 'Leads assigned'
        break
        
      case 'escalation':
        await escalateOldLeads()
        result = 'Old leads escalated'
        break
        
      case 'daily-report':
        await generateDailyReport()
        result = 'Daily report generated'
        break
        
      case 'weekly-report':
        await generateWeeklyReport()
        result = 'Weekly report generated'
        break
        
      case 'dashboard-metrics':
        await updateDashboardMetrics()
        result = 'Dashboard metrics updated'
        break
        
      case 'all':
        await updateAllLeadScores()
        await assignUnassignedLeads()
        await followUpStaleLeads()
        await escalateOldLeads()
        await updateDashboardMetrics()
        result = 'All automations completed'
        break
        
      default:
        return NextResponse.json({ 
          error: 'Invalid automation type',
          available: [
            'lead-scoring',
            'follow-up',
            'assignment',
            'escalation',
            'daily-report',
            'weekly-report',
            'dashboard-metrics',
            'all'
          ]
        }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: true,
      message: result,
      automation,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Automation trigger error:', error)
    return NextResponse.json({ 
      error: 'Failed to trigger automation',
      details: error
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Automation Trigger API',
    usage: 'POST with { automation: "type" }',
    availableAutomations: {
      'lead-scoring': 'Update all lead scores',
      'follow-up': 'Send follow-up emails to stale leads',
      'assignment': 'Assign unassigned leads to sales reps',
      'escalation': 'Escalate old leads',
      'daily-report': 'Generate daily sales report',
      'weekly-report': 'Generate weekly performance report',
      'dashboard-metrics': 'Update dashboard metrics',
      'all': 'Run all automations'
    }
  })
}

