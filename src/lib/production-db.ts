// Production Database Service using Supabase
import { supabase } from './supabase'

// Lead interface for production
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
  lastContact?: string
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
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE'
  category: string
  assignedTo: string
  leadId?: string
  leadName?: string
  createdAt: string
  updatedAt: string
}

interface User {
  id: string
  email: string
  password: string
  name: string
  role: 'ADMIN' | 'SALES'
  createdAt: string
  updatedAt: string
}

interface Booking {
  id: string
  leadId: string
  leadName: string
  leadEmail: string
  date: string
  time: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  notes?: string
  createdAt: string
  updatedAt: string
}

// Production database service
export const productionDb = {
  // Lead operations
  lead: {
    async findMany(): Promise<Lead[]> {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching leads:', error)
        return []
      }
      
      return data?.map(lead => ({
        id: lead.id,
        firstName: lead.first_name,
        lastName: lead.last_name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        title: lead.title,
        source: lead.source,
        industry: lead.industry,
        website: lead.website,
        address: lead.address,
        city: lead.city,
        state: lead.state,
        zipCode: lead.zip_code,
        timeZone: lead.time_zone,
        status: lead.status,
        statusDetail: lead.status_detail,
        score: lead.score || 50,
        notes: lead.notes,
        lastContact: lead.last_contact,
        userId: lead.user_id,
        unsubscribed: lead.unsubscribed || false,
        createdAt: lead.created_at,
        updatedAt: lead.updated_at
      })) || []
    },

    async findUnique({ where }: { where: { id?: string; email?: string } }): Promise<Lead | null> {
      let query = supabase.from('leads').select('*')
      
      if (where.id) {
        query = query.eq('id', where.id)
      } else if (where.email) {
        query = query.eq('email', where.email)
      } else {
        return null
      }
      
      const { data, error } = await query.single()
      
      if (error || !data) return null
      
      return {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        title: data.title,
        source: data.source,
        industry: data.industry,
        website: data.website,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        timeZone: data.time_zone,
        status: data.status,
        statusDetail: data.status_detail,
        score: data.score || 50,
        notes: data.notes,
        lastContact: data.last_contact,
        userId: data.user_id,
        unsubscribed: data.unsubscribed || false,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    },

    async create(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
      const { data, error } = await supabase
        .from('leads')
        .insert({
          first_name: leadData.firstName,
          last_name: leadData.lastName,
          email: leadData.email,
          phone: leadData.phone,
          company: leadData.company,
          title: leadData.title,
          source: leadData.source,
          industry: leadData.industry,
          website: leadData.website,
          address: leadData.address,
          city: leadData.city,
          state: leadData.state,
          zip_code: leadData.zipCode,
          time_zone: leadData.timeZone,
          status: leadData.status,
          status_detail: leadData.statusDetail,
          score: leadData.score,
          notes: leadData.notes,
          last_contact: leadData.lastContact,
          user_id: leadData.userId,
          unsubscribed: leadData.unsubscribed
        })
        .select()
        .single()
      
      if (error) {
        console.error('Error creating lead:', error)
        throw new Error('Failed to create lead')
      }
      
      return {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        title: data.title,
        source: data.source,
        industry: data.industry,
        website: data.website,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        timeZone: data.time_zone,
        status: data.status,
        statusDetail: data.status_detail,
        score: data.score || 50,
        notes: data.notes,
        lastContact: data.last_contact,
        userId: data.user_id,
        unsubscribed: data.unsubscribed || false,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    },

    async update(id: string, updates: Partial<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Lead> {
      const updateData: any = {}
      
      if (updates.firstName) updateData.first_name = updates.firstName
      if (updates.lastName) updateData.last_name = updates.lastName
      if (updates.email !== undefined) updateData.email = updates.email
      if (updates.phone !== undefined) updateData.phone = updates.phone
      if (updates.company !== undefined) updateData.company = updates.company
      if (updates.title !== undefined) updateData.title = updates.title
      if (updates.source !== undefined) updateData.source = updates.source
      if (updates.industry !== undefined) updateData.industry = updates.industry
      if (updates.website !== undefined) updateData.website = updates.website
      if (updates.address !== undefined) updateData.address = updates.address
      if (updates.city !== undefined) updateData.city = updates.city
      if (updates.state !== undefined) updateData.state = updates.state
      if (updates.zipCode !== undefined) updateData.zip_code = updates.zipCode
      if (updates.timeZone !== undefined) updateData.time_zone = updates.timeZone
      if (updates.status !== undefined) updateData.status = updates.status
      if (updates.statusDetail !== undefined) updateData.status_detail = updates.statusDetail
      if (updates.score !== undefined) updateData.score = updates.score
      if (updates.notes !== undefined) updateData.notes = updates.notes
      if (updates.lastContact !== undefined) updateData.last_contact = updates.lastContact
      if (updates.userId !== undefined) updateData.user_id = updates.userId
      if (updates.unsubscribed !== undefined) updateData.unsubscribed = updates.unsubscribed
      
      updateData.updated_at = new Date().toISOString()
      
      const { data, error } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating lead:', error)
        throw new Error('Failed to update lead')
      }
      
      return {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        title: data.title,
        source: data.source,
        industry: data.industry,
        website: data.website,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        timeZone: data.time_zone,
        status: data.status,
        statusDetail: data.status_detail,
        score: data.score || 50,
        notes: data.notes,
        lastContact: data.last_contact,
        userId: data.user_id,
        unsubscribed: data.unsubscribed || false,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    },

    async delete(id: string): Promise<Lead | null> {
      const { data, error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id)
        .select()
        .single()
      
      if (error) return null
      
      return {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        title: data.title,
        source: data.source,
        industry: data.industry,
        website: data.website,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        timeZone: data.time_zone,
        status: data.status,
        statusDetail: data.status_detail,
        score: data.score || 50,
        notes: data.notes,
        lastContact: data.last_contact,
        userId: data.user_id,
        unsubscribed: data.unsubscribed || false,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    },

    async deleteMany(): Promise<void> {
      const { error } = await supabase
        .from('leads')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
      
      if (error) {
        console.error('Error deleting all leads:', error)
        throw new Error('Failed to delete all leads')
      }
    }
  },

  // Task operations
  task: {
    async findMany(): Promise<Task[]> {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching tasks:', error)
        return []
      }
      
      return data?.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        dueDate: task.due_date,
        priority: task.priority,
        status: task.status,
        category: task.category,
        assignedTo: task.assigned_to,
        leadId: task.lead_id,
        leadName: task.lead_name,
        createdAt: task.created_at,
        updatedAt: task.updated_at
      })) || []
    },

    async create(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description,
          due_date: taskData.dueDate,
          priority: taskData.priority,
          status: taskData.status,
          category: taskData.category,
          assigned_to: taskData.assignedTo,
          lead_id: taskData.leadId,
          lead_name: taskData.leadName
        })
        .select()
        .single()
      
      if (error) {
        console.error('Error creating task:', error)
        throw new Error('Failed to create task')
      }
      
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        dueDate: data.due_date,
        priority: data.priority,
        status: data.status,
        category: data.category,
        assignedTo: data.assigned_to,
        leadId: data.lead_id,
        leadName: data.lead_name,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    },

    async update(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Task> {
      const updateData: any = {}
      
      if (updates.title !== undefined) updateData.title = updates.title
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate
      if (updates.priority !== undefined) updateData.priority = updates.priority
      if (updates.status !== undefined) updateData.status = updates.status
      if (updates.category !== undefined) updateData.category = updates.category
      if (updates.assignedTo !== undefined) updateData.assigned_to = updates.assignedTo
      if (updates.leadId !== undefined) updateData.lead_id = updates.leadId
      if (updates.leadName !== undefined) updateData.lead_name = updates.leadName
      
      updateData.updated_at = new Date().toISOString()
      
      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating task:', error)
        throw new Error('Failed to update task')
      }
      
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        dueDate: data.due_date,
        priority: data.priority,
        status: data.status,
        category: data.category,
        assignedTo: data.assigned_to,
        leadId: data.lead_id,
        leadName: data.lead_name,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    },

    async delete(id: string): Promise<Task | null> {
      const { data, error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .select()
        .single()
      
      if (error) return null
      
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        dueDate: data.due_date,
        priority: data.priority,
        status: data.status,
        category: data.category,
        assignedTo: data.assigned_to,
        leadId: data.lead_id,
        leadName: data.lead_name,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    },

    async deleteMany(): Promise<void> {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
      
      if (error) {
        console.error('Error deleting all tasks:', error)
        throw new Error('Failed to delete all tasks')
      }
    }
  },

  // User operations
  user: {
    async findMany(): Promise<User[]> {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching users:', error)
        return []
      }
      
      return data?.map(user => ({
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      })) || []
    },

    async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          password: userData.password,
          name: userData.name,
          role: userData.role
        })
        .select()
        .single()
      
      if (error) {
        console.error('Error creating user:', error)
        throw new Error('Failed to create user')
      }
      
      return {
        id: data.id,
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    }
  },

  // Booking operations
  booking: {
    async findMany(): Promise<Booking[]> {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching bookings:', error)
        return []
      }
      
      return data?.map(booking => ({
        id: booking.id,
        leadId: booking.lead_id,
        leadName: booking.lead_name,
        leadEmail: booking.lead_email,
        date: booking.date,
        time: booking.time,
        status: booking.status,
        notes: booking.notes,
        createdAt: booking.created_at,
        updatedAt: booking.updated_at
      })) || []
    },

    async create(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          lead_id: bookingData.leadId,
          lead_name: bookingData.leadName,
          lead_email: bookingData.leadEmail,
          date: bookingData.date,
          time: bookingData.time,
          status: bookingData.status,
          notes: bookingData.notes
        })
        .select()
        .single()
      
      if (error) {
        console.error('Error creating booking:', error)
        throw new Error('Failed to create booking')
      }
      
      return {
        id: data.id,
        leadId: data.lead_id,
        leadName: data.lead_name,
        leadEmail: data.lead_email,
        date: data.date,
        time: data.time,
        status: data.status,
        notes: data.notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    }
  }
}
