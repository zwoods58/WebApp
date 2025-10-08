import { NextRequest, NextResponse } from 'next/server'
import { mockDb } from '@/lib/mock-db'

// GET /api/tasks - Fetch all tasks
export async function GET() {
  try {
    const tasks = await mockDb.task.findMany()
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const taskData = await request.json()
    
    const newTask = await mockDb.task.create({
      data: {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    })
    
    return NextResponse.json(newTask)
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
