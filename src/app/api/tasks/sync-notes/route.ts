import { NextResponse } from 'next/server'
import { fileDb } from '@/lib/file-db'
import { productionDb } from '@/lib/production-db'

// Use production database in production, file-db in development
const db = process.env.NODE_ENV === 'production' ? productionDb : fileDb

interface Task {
  id: string
  title: string
  description?: string
  dueDate: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE'
  category: string
  assignedTo: string
  leadId?: string
  leadName?: string
  createdAt: string
  updatedAt: string
}

export async function POST(request: Request) {
  try {
    const { leadId, leadName, notes, assignedTo } = await request.json()

    if (!leadId || !notes) {
      return NextResponse.json(
        { error: 'leadId and notes are required' },
        { status: 400 }
      )
    }

    // Check if a task already exists for this lead
    const existingTasks: Task[] = await db.task.findMany()
    const existingTask = existingTasks.find((task: Task) => task.leadId === leadId)

    if (existingTask) {
      // Update existing task with new notes
      const updatedTask = await db.task.update(existingTask.id, {
        description: notes,
        updatedAt: new Date().toISOString()
      })
      return NextResponse.json({ 
        success: true, 
        message: 'Task updated with new notes',
        task: updatedTask 
      })
    } else {
      // Create new task with the notes
      const newTask = await db.task.create({
        title: `Follow up: ${leadName}`,
        description: notes,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        priority: 'MEDIUM',
        status: 'PENDING',
        category: 'Sales Notes',
        assignedTo: assignedTo || '2', // Default to sales user
        leadId: leadId,
        leadName: leadName
      })
      return NextResponse.json({ 
        success: true, 
        message: 'Task created with notes',
        task: newTask 
      })
    }
  } catch (error) {
    console.error('Error syncing notes to task:', error)
    return NextResponse.json(
      { error: 'Failed to sync notes to task' },
      { status: 500 }
    )
  }
}

