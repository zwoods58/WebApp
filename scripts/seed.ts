import { PrismaClient } from '../src/generated/prisma/index'
import crypto from 'crypto'

const prisma = new PrismaClient()

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

async function main() {
  console.log('Starting database seed...')
  
  try {
    // Create admin user
    console.log('Creating admin user...')
    const adminPassword = hashPassword('admin123')
    const admin = await prisma.user.upsert({
      where: { email: 'admin@atarwebb.com' },
      update: {},
      create: {
        email: 'admin@atarwebb.com',
        password: adminPassword,
        name: 'Admin User',
        role: 'ADMIN'
      }
    })
    console.log('Admin user created:', admin.email)

    // Create sales user
    console.log('Creating sales user...')
    const salesPassword = hashPassword('sales123')
    const sales = await prisma.user.upsert({
      where: { email: 'sales@atarwebb.com' },
      update: {},
      create: {
        email: 'sales@atarwebb.com',
        password: salesPassword,
        name: 'Sales Rep',
        role: 'SALES'
      }
    })
    console.log('Sales user created:', sales.email)

    console.log('Database seeded successfully!')
    console.log('Admin login: admin@atarwebb.com / admin123')
    console.log('Sales login: sales@atarwebb.com / sales123')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

const prisma = new PrismaClient()

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

async function main() {
  console.log('Starting database seed...')
  
  try {
    // Create admin user
    console.log('Creating admin user...')
    const adminPassword = hashPassword('admin123')
    const admin = await prisma.user.upsert({
      where: { email: 'admin@atarwebb.com' },
      update: {},
      create: {
        email: 'admin@atarwebb.com',
        password: adminPassword,
        name: 'Admin User',
        role: 'ADMIN'
      }
    })
    console.log('Admin user created:', admin.email)

    // Create sales user
    console.log('Creating sales user...')
    const salesPassword = hashPassword('sales123')
    const sales = await prisma.user.upsert({
      where: { email: 'sales@atarwebb.com' },
      update: {},
      create: {
        email: 'sales@atarwebb.com',
        password: salesPassword,
        name: 'Sales Rep',
        role: 'SALES'
      }
    })
    console.log('Sales user created:', sales.email)

    console.log('Database seeded successfully!')
    console.log('Admin login: admin@atarwebb.com / admin123')
    console.log('Sales login: sales@atarwebb.com / sales123')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

