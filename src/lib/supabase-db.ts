import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database service layer to replace mock-db
export const supabaseDb = {
  // Users
  user: {
    findMany: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    },

    findUnique: async ({ where }: { where: { email: string } }) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', where.email)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return data || null
    },

    create: async (data: any) => {
      const { data: result, error } = await supabase
        .from('users')
        .insert(data)
        .select()
        .single()
      
      if (error) throw error
      return result
    },

    update: async ({ where, data }: { where: { id: string }, data: any }) => {
      const { data: result, error } = await supabase
        .from('users')
        .update(data)
        .eq('id', where.id)
        .select()
        .single()
      
      if (error) throw error
      return result
    },

    delete: async ({ where }: { where: { id: string } }) => {
      const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', where.id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    count: async () => {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
      
      if (error) throw error
      return count || 0
    }
  },

  // Leads
  lead: {
    findMany: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    },

    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      let query = supabase.from('leads').select('*')
      
      if (where.email) {
        query = query.eq('email', where.email)
      } else if (where.id) {
        query = query.eq('id', where.id)
      }
      
      const { data, error } = await query.single()
      
      if (error && error.code !== 'PGRST116') throw error
      return data || null
    },

    create: async (data: any) => {
      const { data: result, error } = await supabase
        .from('leads')
        .insert(data)
        .select()
        .single()
      
      if (error) throw error
      return result
    },

    update: async ({ where, data }: { where: { id: string }, data: any }) => {
      const { data: result, error } = await supabase
        .from('leads')
        .update(data)
        .eq('id', where.id)
        .select()
        .single()
      
      if (error) throw error
      return result
    },

    delete: async ({ where }: { where: { id: string } }) => {
      const { data, error } = await supabase
        .from('leads')
        .delete()
        .eq('id', where.id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    deleteMany: async () => {
      const { data, error } = await supabase
        .from('leads')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
        .select()
      
      if (error) throw error
      return { count: data?.length || 0 }
    },

    count: async () => {
      const { count, error } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
      
      if (error) throw error
      return count || 0
    }
  },

  // Tasks
  task: {
    findMany: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    },

    findUnique: async ({ where }: { where: { id: string } }) => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', where.id)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return data || null
    },

    create: async (data: any) => {
      const { data: result, error } = await supabase
        .from('tasks')
        .insert(data)
        .select()
        .single()
      
      if (error) throw error
      return result
    },

    update: async ({ where, data }: { where: { id: string }, data: any }) => {
      const { data: result, error } = await supabase
        .from('tasks')
        .update(data)
        .eq('id', where.id)
        .select()
        .single()
      
      if (error) throw error
      return result
    },

    delete: async ({ where }: { where: { id: string } }) => {
      const { data, error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', where.id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    deleteMany: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
        .select()
      
      if (error) throw error
      return { count: data?.length || 0 }
    },

    count: async () => {
      const { count, error } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
      
      if (error) throw error
      return count || 0
    }
  },

  // Bookings
  booking: {
    findMany: async ({ where }: { where?: { date?: string; status?: string } } = {}) => {
      let query = supabase.from('bookings').select('*')
      
      if (where?.date) {
        query = query.eq('date', where.date)
      }
      if (where?.status) {
        query = query.eq('status', where.status)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    },

    findUnique: async ({ where }: { where: { id: string } }) => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', where.id)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return data || null
    },

    create: async (data: any) => {
      const { data: result, error } = await supabase
        .from('bookings')
        .insert(data)
        .select()
        .single()
      
      if (error) throw error
      return result
    },

    update: async ({ where, data }: { where: { id: string }, data: any }) => {
      const { data: result, error } = await supabase
        .from('bookings')
        .update(data)
        .eq('id', where.id)
        .select()
        .single()
      
      if (error) throw error
      return result
    },

    delete: async ({ where }: { where: { id: string } }) => {
      const { data, error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', where.id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    count: async () => {
      const { count, error } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
      
      if (error) throw error
      return count || 0
    }
  }
}
