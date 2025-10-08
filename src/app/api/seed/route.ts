import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/mock-db'
import { hashPassword } from '@/lib/auth'

export async function POST() {
  try {
    // Create admin user
    const adminPassword = await hashPassword('admin123')
    const admin = await mockDb.user.upsert({
      where: { email: 'admin@atarwebb.com' },
      update: {},
      create: {
        email: 'admin@atarwebb.com',
        password: adminPassword,
        name: 'Admin User',
        role: 'ADMIN'
      }
    })

    // Create sales user
    const salesPassword = await hashPassword('sales123')
    const sales = await mockDb.user.upsert({
      where: { email: 'sales@atarwebb.com' },
      update: {},
      create: {
        email: 'sales@atarwebb.com',
        password: salesPassword,
        name: 'Sales Rep',
        role: 'SALES'
      }
    })

    return NextResponse.json({
      message: 'Database seeded successfully!',
      users: {
        admin: { email: admin.email, name: admin.name },
        sales: { email: sales.email, name: sales.name }
      }
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}

