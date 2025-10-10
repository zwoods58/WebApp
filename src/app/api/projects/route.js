import { NextResponse } from 'next/server'

// Mock projects data - replace with real database calls
const projects = [
  {
    id: '1',
    name: 'E-commerce Platform',
    client: 'John Doe',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2024-02-15',
    progress: 65,
    budget: 5000,
    createdAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    name: 'Mobile Banking App',
    client: 'Jane Smith',
    status: 'planning',
    priority: 'medium',
    dueDate: '2024-03-01',
    progress: 20,
    budget: 8000,
    createdAt: '2024-01-16T10:00:00Z'
  },
  {
    id: '3',
    name: 'Healthcare Management System',
    client: 'Mike Johnson',
    status: 'completed',
    priority: 'high',
    dueDate: '2024-01-10',
    progress: 100,
    budget: 12000,
    createdAt: '2024-01-01T08:00:00Z'
  }
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      projects
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
