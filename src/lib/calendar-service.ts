import { supabase } from './supabase'

export interface CalendarEvent {
  id: string
  title: string
  date: string
  type: 'deadline' | 'meeting' | 'planning' | 'delivery' | 'milestone' | 'review'
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'orange'
  description?: string
  project_id?: string
  client_id?: string
  status: 'upcoming' | 'completed' | 'overdue'
  priority: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
}

export interface CalendarStats {
  thisWeek: number
  completed: number
  upcoming: number
  overdue: number
}

export class CalendarService {
  // Get all calendar events
  static async getAllEvents(): Promise<CalendarEvent[]> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('date', { ascending: true })

      if (error) throw error

      return data?.map(event => ({
        id: event.id,
        title: event.title,
        date: event.date,
        type: event.type,
        color: event.color,
        description: event.description,
        project_id: event.project_id,
        client_id: event.client_id,
        status: event.status,
        priority: event.priority,
        created_at: event.created_at,
        updated_at: event.updated_at
      })) || []
    } catch (error) {
      console.error('Error fetching calendar events:', error)
      return []
    }
  }

  // Get calendar statistics
  static async getCalendarStats(): Promise<CalendarStats> {
    try {
      const now = new Date()
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      const { data, error } = await supabase
        .from('calendar_events')
        .select('status, date')

      if (error) throw error

      const events = data || []
      
      const thisWeek = events.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate >= startOfWeek && eventDate <= endOfWeek
      }).length

      const completed = events.filter(event => event.status === 'completed').length
      const upcoming = events.filter(event => event.status === 'upcoming').length
      const overdue = events.filter(event => event.status === 'overdue').length

      return {
        thisWeek,
        completed,
        upcoming,
        overdue
      }
    } catch (error) {
      console.error('Error fetching calendar stats:', error)
      return {
        thisWeek: 0,
        completed: 0,
        upcoming: 0,
        overdue: 0
      }
    }
  }

  // Get events for a specific month
  static async getEventsForMonth(year: number, month: number): Promise<CalendarEvent[]> {
    try {
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0)

      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: true })

      if (error) throw error

      return data?.map(event => ({
        id: event.id,
        title: event.title,
        date: event.date,
        type: event.type,
        color: event.color,
        description: event.description,
        project_id: event.project_id,
        client_id: event.client_id,
        status: event.status,
        priority: event.priority,
        created_at: event.created_at,
        updated_at: event.updated_at
      })) || []
    } catch (error) {
      console.error('Error fetching monthly events:', error)
      return []
    }
  }

  // Create a new calendar event
  static async createEvent(event: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>): Promise<CalendarEvent | null> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert([event])
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        title: data.title,
        date: data.date,
        type: data.type,
        color: data.color,
        description: data.description,
        project_id: data.project_id,
        client_id: data.client_id,
        status: data.status,
        priority: data.priority,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error) {
      console.error('Error creating calendar event:', error)
      return null
    }
  }

  // Update a calendar event
  static async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        title: data.title,
        date: data.date,
        type: data.type,
        color: data.color,
        description: data.description,
        project_id: data.project_id,
        client_id: data.client_id,
        status: data.status,
        priority: data.priority,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error) {
      console.error('Error updating calendar event:', error)
      return null
    }
  }

  // Delete a calendar event
  static async deleteEvent(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting calendar event:', error)
      return false
    }
  }

  // Generate calendar events from projects
  static async generateEventsFromProjects(): Promise<void> {
    try {
      // Get all projects with deadlines
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, title, end_date, status, client_id')
        .not('end_date', 'is', null)

      if (projectsError) throw projectsError

      // Create events for project deadlines
      for (const project of projects || []) {
        const eventData = {
          title: `${project.title} - Project Deadline`,
          date: project.end_date,
          type: 'deadline' as const,
          color: (project.status === 'completed' ? 'green' : 
                 project.status === 'in_progress' ? 'blue' : 'yellow') as 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'orange',
          description: `Project deadline for ${project.title}`,
          project_id: project.id,
          client_id: project.client_id,
          status: project.status === 'completed' ? 'completed' as const : 'upcoming' as const,
          priority: 'high' as const
        }

        // Check if event already exists
        const { data: existingEvent } = await supabase
          .from('calendar_events')
          .select('id')
          .eq('project_id', project.id)
          .eq('type', 'deadline')
          .single()

        if (!existingEvent) {
          await this.createEvent(eventData)
        }
      }

      // Get all project requests with deadlines
      const { data: requests, error: requestsError } = await supabase
        .from('project_requests')
        .select('id, name, company, created_at, status')
        .eq('status', 'new')

      if (requestsError) throw requestsError

      // Create events for new project requests (follow-up in 3 days)
      for (const request of requests || []) {
        const followUpDate = new Date(request.created_at)
        followUpDate.setDate(followUpDate.getDate() + 3)

        const eventData = {
          title: `Follow up - ${request.name} (${request.company})`,
          date: followUpDate.toISOString().split('T')[0],
          type: 'meeting' as const,
          color: 'orange' as 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'orange',
          description: `Follow up on project request from ${request.name}`,
          client_id: request.id,
          status: 'upcoming' as const,
          priority: 'medium' as const
        }

        // Check if event already exists
        const { data: existingEvent } = await supabase
          .from('calendar_events')
          .select('id')
          .eq('client_id', request.id)
          .eq('type', 'meeting')
          .single()

        if (!existingEvent) {
          await this.createEvent(eventData)
        }
      }
    } catch (error) {
      console.error('Error generating events from projects:', error)
    }
  }
}

export default CalendarService
