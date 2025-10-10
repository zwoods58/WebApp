import { supabase } from './supabase'

export interface Communication {
  id: string
  type: 'email' | 'call' | 'meeting' | 'message' | 'notification'
  client_id?: string
  project_id?: string
  subject: string
  content: string
  status: 'sent' | 'received' | 'scheduled' | 'completed' | 'pending' | 'failed'
  priority: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
  user_id?: string
  recipient_email?: string
  scheduled_at?: string
  duration?: number // in minutes for calls/meetings
  notes?: string
}

export interface CommunicationStats {
  totalMessages: number
  emails: number
  calls: number
  meetings: number
  pending: number
  completed: number
}

export class CommunicationsService {
  // Get all communications
  static async getAllCommunications(): Promise<Communication[]> {
    try {
      const { data, error } = await supabase
        .from('communications')
        .select(`
          *,
          clients:client_id(name, company),
          projects:project_id(title)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data?.map(comm => ({
        id: comm.id,
        type: comm.type,
        client_id: comm.client_id,
        project_id: comm.project_id,
        subject: comm.subject,
        content: comm.content,
        status: comm.status,
        priority: comm.priority,
        created_at: comm.created_at,
        updated_at: comm.updated_at,
        user_id: comm.user_id,
        recipient_email: comm.recipient_email,
        scheduled_at: comm.scheduled_at,
        duration: comm.duration,
        notes: comm.notes
      })) || []
    } catch (error) {
      console.error('Error fetching communications:', error)
      return []
    }
  }

  // Get communication statistics
  static async getCommunicationStats(): Promise<CommunicationStats> {
    try {
      const { data, error } = await supabase
        .from('communications')
        .select('type, status')

      if (error) throw error

      const communications = data || []
      
      const totalMessages = communications.length
      const emails = communications.filter(c => c.type === 'email').length
      const calls = communications.filter(c => c.type === 'call').length
      const meetings = communications.filter(c => c.type === 'meeting').length
      const pending = communications.filter(c => c.status === 'pending' || c.status === 'scheduled').length
      const completed = communications.filter(c => c.status === 'completed' || c.status === 'sent').length

      return {
        totalMessages,
        emails,
        calls,
        meetings,
        pending,
        completed
      }
    } catch (error) {
      console.error('Error fetching communication stats:', error)
      return {
        totalMessages: 0,
        emails: 0,
        calls: 0,
        meetings: 0,
        pending: 0,
        completed: 0
      }
    }
  }

  // Create a new communication
  static async createCommunication(communication: Omit<Communication, 'id' | 'created_at' | 'updated_at'>): Promise<Communication | null> {
    try {
      const { data, error } = await supabase
        .from('communications')
        .insert([communication])
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        type: data.type,
        client_id: data.client_id,
        project_id: data.project_id,
        subject: data.subject,
        content: data.content,
        status: data.status,
        priority: data.priority,
        created_at: data.created_at,
        updated_at: data.updated_at,
        user_id: data.user_id,
        recipient_email: data.recipient_email,
        scheduled_at: data.scheduled_at,
        duration: data.duration,
        notes: data.notes
      }
    } catch (error) {
      console.error('Error creating communication:', error)
      return null
    }
  }

  // Update a communication
  static async updateCommunication(id: string, updates: Partial<Communication>): Promise<Communication | null> {
    try {
      const { data, error } = await supabase
        .from('communications')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        type: data.type,
        client_id: data.client_id,
        project_id: data.project_id,
        subject: data.subject,
        content: data.content,
        status: data.status,
        priority: data.priority,
        created_at: data.created_at,
        updated_at: data.updated_at,
        user_id: data.user_id,
        recipient_email: data.recipient_email,
        scheduled_at: data.scheduled_at,
        duration: data.duration,
        notes: data.notes
      }
    } catch (error) {
      console.error('Error updating communication:', error)
      return null
    }
  }

  // Delete a communication
  static async deleteCommunication(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('communications')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting communication:', error)
      return false
    }
  }

  // Generate communications from project activities
  static async generateCommunicationsFromActivities(): Promise<void> {
    try {
      // Get recent project requests for follow-up communications
      const { data: requests, error: requestsError } = await supabase
        .from('project_requests')
        .select('id, name, company, email, created_at, status')
        .eq('status', 'new')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

      if (requestsError) throw requestsError

      for (const request of requests || []) {
        const communicationData = {
          type: 'email' as const,
          client_id: request.id,
          subject: `Welcome ${request.name} - Next Steps for Your Project`,
          content: `Hi ${request.name},\n\nThank you for your interest in our services. We've received your project request and will be in touch within 24 hours to discuss the next steps.\n\nBest regards,\nThe AtarWebb Team`,
          status: 'sent' as const,
          priority: 'medium' as const,
          recipient_email: request.email,
          user_id: undefined
        }

        // Check if communication already exists
        const { data: existingComm } = await supabase
          .from('communications')
          .select('id')
          .eq('client_id', request.id)
          .eq('subject', communicationData.subject)
          .single()

        if (!existingComm) {
          await this.createCommunication(communicationData)
        }
      }

      // Get completed projects for follow-up communications
      const { data: completedProjects, error: projectsError } = await supabase
        .from('projects')
        .select('id, title, client_id, completed_at')
        .eq('status', 'completed')
        .not('completed_at', 'is', null)
        .gte('completed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

      if (projectsError) throw projectsError

      for (const project of completedProjects || []) {
        const communicationData = {
          type: 'email' as const,
          client_id: project.client_id,
          project_id: project.id,
          subject: `Project ${project.title} - Completion Follow-up`,
          content: `Hi there,\n\nWe hope you're satisfied with the completed ${project.title} project. We'd love to hear your feedback and discuss any future projects you might have.\n\nBest regards,\nThe AtarWebb Team`,
          status: 'sent' as const,
          priority: 'low' as const,
          user_id: undefined
        }

        // Check if communication already exists
        const { data: existingComm } = await supabase
          .from('communications')
          .select('id')
          .eq('project_id', project.id)
          .eq('subject', communicationData.subject)
          .single()

        if (!existingComm) {
          await this.createCommunication(communicationData)
        }
      }

      // Get overdue invoices for payment reminders
      const { data: overdueInvoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('id, amount, due_date, client_id')
        .eq('status', 'sent')
        .lt('due_date', new Date().toISOString())

      if (invoicesError) throw invoicesError

      for (const invoice of overdueInvoices || []) {
        const communicationData = {
          type: 'email' as const,
          client_id: invoice.client_id,
          subject: `Payment Reminder - Invoice #${invoice.id}`,
          content: `Hi there,\n\nThis is a friendly reminder that invoice #${invoice.id} for $${invoice.amount} was due on ${new Date(invoice.due_date).toLocaleDateString()}.\n\nPlease let us know if you have any questions or need to discuss payment arrangements.\n\nBest regards,\nThe AtarWebb Team`,
          status: 'sent' as const,
          priority: 'high' as const,
          user_id: undefined
        }

        // Check if communication already exists
        const { data: existingComm } = await supabase
          .from('communications')
          .select('id')
          .eq('client_id', invoice.client_id)
          .eq('subject', communicationData.subject)
          .single()

        if (!existingComm) {
          await this.createCommunication(communicationData)
        }
      }
    } catch (error) {
      console.error('Error generating communications from activities:', error)
    }
  }
}

export default CommunicationsService
