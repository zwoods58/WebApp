import { NextRequest, NextResponse } from 'next/server'
import { fileDb } from '@/lib/file-db'
import { productionDb } from '@/lib/production-db'

// Use production database in production, file-db in development
const db = process.env.NODE_ENV === 'production' ? productionDb : fileDb

// PUT /api/tasks/[id] - Update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskData = await request.json()
    const taskId = params.id
    
    const updatedTask = await db.task.update(taskId, {
      ...taskData,
      updatedAt: new Date().toISOString()
    })
    
    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id
    
    await db.task.delete(taskId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
