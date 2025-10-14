import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          email: string
          phone: string | null
          company: string | null
          status: 'lead' | 'client' | 'inactive'
          source: string | null
          notes: string | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          email: string
          phone?: string | null
          company?: string | null
          status?: 'lead' | 'client' | 'inactive'
          source?: string | null
          notes?: string | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          email?: string
          phone?: string | null
          company?: string | null
          status?: 'lead' | 'client' | 'inactive'
          source?: string | null
          notes?: string | null
          user_id?: string
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          budget: number | null
          start_date: string | null
          end_date: string | null
          client_id: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          status?: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          budget?: number | null
          start_date?: string | null
          end_date?: string | null
          client_id: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          status?: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          budget?: number | null
          start_date?: string | null
          end_date?: string | null
          client_id?: string
          user_id?: string
        }
      }
      tasks: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'review' | 'completed'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          due_date: string | null
          project_id: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'review' | 'completed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          due_date?: string | null
          project_id: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'review' | 'completed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          due_date?: string | null
          project_id?: string
          user_id?: string
        }
      }
      project_requests: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          email: string
          phone: string | null
          company: string | null
          project_type: string
          budget: string | null
          timeline: string | null
          description: string
          requirements: string | null
          status: 'new' | 'contacted' | 'quoted' | 'accepted' | 'rejected'
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          email: string
          phone?: string | null
          company?: string | null
          project_type: string
          budget?: string | null
          timeline?: string | null
          description: string
          requirements?: string | null
          status?: 'new' | 'contacted' | 'quoted' | 'accepted' | 'rejected'
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          email?: string
          phone?: string | null
          company?: string | null
          project_type?: string
          budget?: string | null
          timeline?: string | null
          description?: string
          requirements?: string | null
          status?: 'new' | 'contacted' | 'quoted' | 'accepted' | 'rejected'
          notes?: string | null
        }
      }
      analytics: {
        Row: {
          id: string
          created_at: string
          page: string
          event: string
          user_id: string | null
          session_id: string | null
          metadata: any | null
        }
        Insert: {
          id?: string
          created_at?: string
          page: string
          event: string
          user_id?: string | null
          session_id?: string | null
          metadata?: any | null
        }
        Update: {
          id?: string
          created_at?: string
          page?: string
          event?: string
          user_id?: string | null
          session_id?: string | null
          metadata?: any | null
        }
      }
      bookings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          email: string
          phone: string | null
          date: string
          time: string
          duration: number
          type: string
          status: string
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          email: string
          phone?: string | null
          date: string
          time: string
          duration?: number
          type?: string
          status?: string
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          email?: string
          phone?: string | null
          date?: string
          time?: string
          duration?: number
          type?: string
          status?: string
          notes?: string | null
        }
      }
    }
  }
}
