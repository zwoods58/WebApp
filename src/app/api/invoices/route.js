import { NextResponse } from 'next/server'

// Mock invoices data - replace with real database calls
const invoices = [
  {
    id: 'INV-001',
    client: 'John Doe',
    amount: 2500,
    status: 'paid',
    dueDate: '2024-01-20',
    createdAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'INV-002',
    client: 'Jane Smith',
    amount: 4000,
    status: 'sent',
    dueDate: '2024-02-01',
    createdAt: '2024-01-16T10:00:00Z'
  },
  {
    id: 'INV-003',
    client: 'Mike Johnson',
    amount: 12000,
    status: 'paid',
    dueDate: '2024-01-10',
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'INV-004',
    client: 'Sarah Wilson',
    amount: 3500,
    status: 'overdue',
    dueDate: '2024-01-05',
    createdAt: '2023-12-20T14:30:00Z'
  }
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      invoices
    })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}
