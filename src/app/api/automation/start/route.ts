import { NextResponse } from 'next/server'
import { initializeAutomations } from '@/lib/automation/scheduler'

// Global flag to ensure automations only start once
let automationsStarted = false

export async function GET() {
  if (automationsStarted) {
    return NextResponse.json({ 
      message: 'Automations are already running',
      status: 'active'
    })
  }
  
  try {
    initializeAutomations()
    automationsStarted = true
    
    return NextResponse.json({ 
      message: 'CRM Automations started successfully!',
      status: 'started',
      schedule: {
        hourly: [
          'Update lead scores (:00)',
          'Assign unassigned leads (:15)',
          'Update dashboard metrics (:30)'
        ],
        daily: [
          'Follow up stale leads (09:00 AM)',
          'Escalate old leads (10:00 AM)',
          'Generate daily report (06:00 PM)'
        ],
        weekly: [
          'Generate weekly report (Monday 09:00 AM)'
        ]
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to start automations',
      details: error
    }, { status: 500 })
  }
}

