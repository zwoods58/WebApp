// File-based Database for CRM
// Saves data to local JSON files for persistence

import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const LEADS_FILE = path.join(DATA_DIR, 'leads.json')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json')
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Helper functions
function readJsonFile(filePath: string, defaultValue: any[] = []) {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue
    }
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error)
    return defaultValue
  }
}

function writeJsonFile(filePath: string, data: any[]) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error)
    throw error
  }
}

// Database interfaces
interface User {
  id: string
  email: string
  password: string
  name: string
  role: 'ADMIN' | 'SALES'
  createdAt: string
  updatedAt: string
}

interface Lead {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
  title?: string
  source?: string
  industry?: string
  website?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  timeZone?: string
  status: 'NEW' | 'NOT_INTERESTED' | 'FOLLOW_UP' | 'QUALIFIED' | 'APPOINTMENT_BOOKED' | 'CLOSED_WON'
  statusDetail?: string
  score: number
  notes?: string
  userId: string
  unsubscribed: boolean
  createdAt: string
  updatedAt: string
}

interface Task {
  id: string
  title: string
  description?: string
  dueDate: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  category: string
  assignedTo: string
  leadId?: string
  leadName?: string
  createdAt: string
  updatedAt: string
}

interface Booking {
  id: string
  name: string
  email: string
  phone?: string
  date: string
  time: string
  duration: number
  type: string
  status: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// Database service
export const fileDb = {
  user: {
    async findMany() {
      return readJsonFile(USERS_FILE, [])
    },
    
    async findUnique({ where }: { where: { id?: string; email?: string } }) {
      const users = readJsonFile(USERS_FILE, [])
      return users.find((user: User) => 
        (where.id && user.id === where.id) || 
        (where.email && user.email === where.email)
      ) || null
    },
    
    async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
      const users = readJsonFile(USERS_FILE, [])
      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      users.push(newUser)
      writeJsonFile(USERS_FILE, users)
      return newUser
    },
    
    async update(id: string, userData: Partial<User>) {
      const users = readJsonFile(USERS_FILE, [])
      const index = users.findIndex((user: User) => user.id === id)
      if (index === -1) throw new Error('User not found')
      
      users[index] = { ...users[index], ...userData, updatedAt: new Date().toISOString() }
      writeJsonFile(USERS_FILE, users)
      return users[index]
    },
    
    async delete(id: string) {
      const users = readJsonFile(USERS_FILE, [])
      const filteredUsers = users.filter((user: User) => user.id !== id)
      writeJsonFile(USERS_FILE, filteredUsers)
    }
  },

  lead: {
    async findMany() {
      return readJsonFile(LEADS_FILE, [])
    },
    
    async findUnique({ where }: { where: { id?: string; email?: string } }) {
      const leads = readJsonFile(LEADS_FILE, [])
      return leads.find((lead: Lead) => 
        (where.id && lead.id === where.id) || 
        (where.email && lead.email === where.email)
      ) || null
    },
    
    async create(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) {
      const leads = readJsonFile(LEADS_FILE, [])
      const newLead: Lead = {
        ...leadData,
        id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      leads.push(newLead)
      writeJsonFile(LEADS_FILE, leads)
      return newLead
    },
    
    async update(id: string, leadData: Partial<Lead>) {
      const leads = readJsonFile(LEADS_FILE, [])
      const index = leads.findIndex((lead: Lead) => lead.id === id)
      if (index === -1) throw new Error('Lead not found')
      
      leads[index] = { ...leads[index], ...leadData, updatedAt: new Date().toISOString() }
      writeJsonFile(LEADS_FILE, leads)
      return leads[index]
    },
    
    async delete(id: string) {
      const leads = readJsonFile(LEADS_FILE, [])
      const filteredLeads = leads.filter((lead: Lead) => lead.id !== id)
      writeJsonFile(LEADS_FILE, filteredLeads)
    },
    
    async deleteMany() {
      writeJsonFile(LEADS_FILE, [])
    }
  },

  task: {
    async findMany() {
      return readJsonFile(TASKS_FILE, [])
    },
    
    async findUnique({ where }: { where: { id: string } }) {
      const tasks = readJsonFile(TASKS_FILE, [])
      return tasks.find((task: Task) => task.id === where.id) || null
    },
    
    async create(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
      const tasks = readJsonFile(TASKS_FILE, [])
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      tasks.push(newTask)
      writeJsonFile(TASKS_FILE, tasks)
      return newTask
    },
    
    async update(id: string, taskData: Partial<Task>) {
      const tasks = readJsonFile(TASKS_FILE, [])
      const index = tasks.findIndex((task: Task) => task.id === id)
      if (index === -1) throw new Error('Task not found')
      
      tasks[index] = { ...tasks[index], ...taskData, updatedAt: new Date().toISOString() }
      writeJsonFile(TASKS_FILE, tasks)
      return tasks[index]
    },
    
    async delete(id: string) {
      const tasks = readJsonFile(TASKS_FILE, [])
      const filteredTasks = tasks.filter((task: Task) => task.id !== id)
      writeJsonFile(TASKS_FILE, filteredTasks)
    },
    
    async deleteMany() {
      writeJsonFile(TASKS_FILE, [])
    }
  },

  booking: {
    async findMany() {
      return readJsonFile(BOOKINGS_FILE, [])
    },
    
    async findUnique({ where }: { where: { id: string } }) {
      const bookings = readJsonFile(BOOKINGS_FILE, [])
      return bookings.find((booking: Booking) => booking.id === where.id) || null
    },
    
    async create(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) {
      const bookings = readJsonFile(BOOKINGS_FILE, [])
      const newBooking: Booking = {
        ...bookingData,
        id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      bookings.push(newBooking)
      writeJsonFile(BOOKINGS_FILE, bookings)
      return newBooking
    },
    
    async update(id: string, bookingData: Partial<Booking>) {
      const bookings = readJsonFile(BOOKINGS_FILE, [])
      const index = bookings.findIndex((booking: Booking) => booking.id === id)
      if (index === -1) throw new Error('Booking not found')
      
      bookings[index] = { ...bookings[index], ...bookingData, updatedAt: new Date().toISOString() }
      writeJsonFile(BOOKINGS_FILE, bookings)
      return bookings[index]
    },
    
    async delete(id: string) {
      const bookings = readJsonFile(BOOKINGS_FILE, [])
      const filteredBookings = bookings.filter((booking: Booking) => booking.id !== id)
      writeJsonFile(BOOKINGS_FILE, filteredBookings)
    }
  }
}

// Initialize with default users if they don't exist
async function initializeDefaultUsers() {
  const users = await fileDb.user.findMany()
  if (users.length === 0) {
    await fileDb.user.create({
      email: 'admin@atarwebb.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'ADMIN'
    })
    
    await fileDb.user.create({
      email: 'sales@atarwebb.com',
      password: 'sales123',
      name: 'Sales Rep',
      role: 'SALES'
    })
    
    console.log('✅ Default users created')
  }
}

// Initialize on module load
initializeDefaultUsers()
