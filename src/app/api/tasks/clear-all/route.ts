import { NextResponse } from 'next/server'
import { fileDb } from '@/lib/file-db'
import { productionDb } from '@/lib/production-db'

// Use production database in production, file-db in development
const db = process.env.NODE_ENV === 'production' ? productionDb : fileDb

export async function DELETE() {
  try {
    await db.task.deleteMany()
    
    return NextResponse.json({ 
      success: true, 
      message: 'All tasks cleared successfully' 
    })
  } catch (error) {
    console.error('Error clearing all tasks:', error)
    return NextResponse.json(
      { error: 'Failed to clear all tasks' },
      { status: 500 }
    )
  }
}
