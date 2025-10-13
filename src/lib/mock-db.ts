interface User {
  id: string
  email: string
  password: string
  name: string
  role: 'ADMIN' | 'SALES'
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
  createdAt: string
  updatedAt: string
}

interface Task {
  id: string
  title: string
  description?: string
  dueDate: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE'
  category: string
  assignedTo: string
  createdAt: string
  updatedAt: string
}

// In-memory storage
const users: User[] = [
  {
    id: '1',
    email: 'admin@atarwebb.com',
    password: '$2b$10$rQZ8K9XvY7H2pL3mN6qQe.8vB1cD4fG7hI0jK3lM5nP8qR1sT4uV7wX0yZ2a',
    name: 'Admin User',
    role: 'ADMIN'
  },
  {
    id: '2',
    email: 'sales@atarwebb.com',
    password: '$2b$10$rQZ8K9XvY7H2pL3mN6qQe.8vB1cD4fG7hI0jK3lM5nP8qR1sT4uV7wX0yZ2a',
    name: 'Sales Rep',
    role: 'SALES'
  }
]
const leads: Lead[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0123',
    company: 'Acme Corp',
    title: 'CEO',
    source: 'Website',
    status: 'NEW',
    score: 85,
    notes: 'Interested in web development services',
    userId: '2',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@techstart.com',
    phone: '+1-555-0456',
    company: 'TechStart Inc',
    title: 'CTO',
    source: 'Referral',
    status: 'NEW',
    score: 92,
    notes: 'Looking for mobile app development',
    userId: '2',
    createdAt: '2024-01-16T14:30:00.000Z',
    updatedAt: '2024-01-16T14:30:00.000Z'
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.j@business.com',
    phone: '+1-555-0789',
    company: 'Business Solutions',
    title: 'Marketing Director',
    source: 'Cold Call',
    status: 'FOLLOW_UP',
    score: 78,
    notes: 'Needs follow-up on pricing',
    userId: '2',
    createdAt: '2024-01-17T09:15:00.000Z',
    updatedAt: '2024-01-17T09:15:00.000Z'
  },
  {
    id: '4',
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.w@startup.io',
    phone: '+1-555-0321',
    company: 'StartupIO',
    title: 'Founder',
    source: 'Website',
    status: 'APPOINTMENT_BOOKED',
    score: 95,
    notes: 'Appointment scheduled for next week',
    userId: '2',
    createdAt: '2024-01-18T11:45:00.000Z',
    updatedAt: '2024-01-18T11:45:00.000Z'
  }
]

const tasks: Task[] = [
  {
    id: '1',
    title: 'Follow up with John Doe',
    description: 'Call John about web development services',
    dueDate: '2024-12-31',
    priority: 'HIGH',
    status: 'PENDING',
    category: 'Sales',
    assignedTo: 'Sales Rep',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z'
  },
  {
    id: '2',
    title: 'Send proposal to Jane Smith',
    description: 'Prepare and send detailed proposal for mobile app development',
    dueDate: '2024-12-25',
    priority: 'MEDIUM',
    status: 'PENDING',
    category: 'Sales',
    assignedTo: 'Sales Rep',
    createdAt: '2024-01-16T14:30:00.000Z',
    updatedAt: '2024-01-16T14:30:00.000Z'
  }
]

export const mockDb = {
  user: {
    findUnique: async ({ where }: { where: { email: string } }): Promise<User | null> => {
      return users.find(u => u.email === where.email) || null
    },
    upsert: async ({ where, create, update }: { where: { email: string }, create: User, update: Partial<User> }): Promise<User> => {
      let user = users.find(u => u.email === where.email)
      if (user) {
        Object.assign(user, update)
      } else {
        user = { ...create, id: (users.length + 1).toString() }
        users.push(user)
      }
      return user
    },
    count: async (): Promise<number> => {
      return users.length
    }
  },
  lead: {
    findMany: async (): Promise<Lead[]> => {
      return leads
    },
    findUnique: async ({ where }: { where: { email: string } }): Promise<Lead | null> => {
      return leads.find(l => l.email === where.email) || null
    },
    create: async (data: { data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> & { id?: string, createdAt?: string, updatedAt?: string } }): Promise<Lead> => {
      const newLead: Lead = {
        id: data.data.id || (leads.length + 1).toString(),
        createdAt: data.data.createdAt || new Date().toISOString(),
        updatedAt: data.data.updatedAt || new Date().toISOString(),
        ...data.data
      }
      leads.push(newLead)
      return newLead
    },
    update: async ({ where, data }: { where: { id: string }, data: Partial<Lead> }): Promise<Lead | null> => {
      const index = leads.findIndex(l => l.id === where.id)
      if (index !== -1) {
        leads[index] = { ...leads[index], ...data, updatedAt: new Date().toISOString() }
        return leads[index]
      }
      return null
    },
    delete: async ({ where }: { where: { id: string } }): Promise<Lead | null> => {
      const index = leads.findIndex(l => l.id === where.id)
      if (index !== -1) {
        const [deletedLead] = leads.splice(index, 1)
        return deletedLead
      }
      return null
    },
    deleteMany: async (): Promise<{ count: number }> => {
      const count = leads.length
      leads.length = 0 // Clear the array
      return { count }
    },
    count: async ({ where }: { where?: { status?: Lead['status'] } } = {}): Promise<number> => {
      if (where?.status) {
        return leads.filter(l => l.status === where.status).length
      }
      return leads.length
    }
  },
  task: {
    findMany: async (): Promise<Task[]> => {
      return tasks
    },
    findUnique: async ({ where }: { where: { id: string } }): Promise<Task | null> => {
      return tasks.find(t => t.id === where.id) || null
    },
    create: async ({ data }: { data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { id?: string, createdAt?: string, updatedAt?: string } }): Promise<Task> => {
      const newTask: Task = {
        id: data.id || (tasks.length + 1).toString(),
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
        ...data
      }
      tasks.push(newTask)
      return newTask
    },
    update: async ({ where, data }: { where: { id: string }, data: Partial<Task> }): Promise<Task | null> => {
      const index = tasks.findIndex(t => t.id === where.id)
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...data, updatedAt: new Date().toISOString() }
        return tasks[index]
      }
      return null
    },
    delete: async ({ where }: { where: { id: string } }): Promise<Task | null> => {
      const index = tasks.findIndex(t => t.id === where.id)
      if (index !== -1) {
        const [deletedTask] = tasks.splice(index, 1)
        return deletedTask
      }
      return null
    },
    count: async (): Promise<number> => {
      return tasks.length
    }
  }
}