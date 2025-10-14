import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for CRM system
export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          company: string | null
          title: string | null
          source: string | null
          industry: string | null
          website: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          time_zone: string | null
          status: 'NEW' | 'NOT_INTERESTED' | 'FOLLOW_UP' | 'QUALIFIED' | 'APPOINTMENT_BOOKED' | 'CLOSED_WON'
          status_detail: string | null
          score: number
          notes: string | null
          last_contact: string | null
          user_id: string | null
          unsubscribed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          company?: string | null
          title?: string | null
          source?: string | null
          industry?: string | null
          website?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          time_zone?: string | null
          status?: 'NEW' | 'NOT_INTERESTED' | 'FOLLOW_UP' | 'QUALIFIED' | 'APPOINTMENT_BOOKED' | 'CLOSED_WON'
          status_detail?: string | null
          score?: number
          notes?: string | null
          last_contact?: string | null
          user_id?: string | null
          unsubscribed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          company?: string | null
          title?: string | null
          source?: string | null
          industry?: string | null
          website?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          time_zone?: string | null
          status?: 'NEW' | 'NOT_INTERESTED' | 'FOLLOW_UP' | 'QUALIFIED' | 'APPOINTMENT_BOOKED' | 'CLOSED_WON'
          status_detail?: string | null
          score?: number
          notes?: string | null
          last_contact?: string | null
          user_id?: string | null
          unsubscribed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          password: string
          name: string
          role: 'ADMIN' | 'SALES'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          name: string
          role: 'ADMIN' | 'SALES'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          name?: string
          role?: 'ADMIN' | 'SALES'
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          due_date: string
          priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          status: 'PENDING' | 'COMPLETED' | 'OVERDUE'
          category: string
          assigned_to: string | null
          lead_id: string | null
          lead_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          due_date: string
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          status?: 'PENDING' | 'COMPLETED' | 'OVERDUE'
          category: string
          assigned_to?: string | null
          lead_id?: string | null
          lead_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          due_date?: string
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          status?: 'PENDING' | 'COMPLETED' | 'OVERDUE'
          category?: string
          assigned_to?: string | null
          lead_id?: string | null
          lead_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          date: string
          time: string
          duration: number
          type: 'CONSULTATION' | 'CONTACT'
          status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          date: string
          time: string
          duration?: number
          type?: 'CONSULTATION' | 'CONTACT'
          status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          date?: string
          time?: string
          duration?: number
          type?: 'CONSULTATION' | 'CONTACT'
          status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
}
