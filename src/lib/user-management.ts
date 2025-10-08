import { supabase } from './supabase'

// User Management Service
export class UserManagementService {
  static async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async createUser(user: {
    email: string
    name: string
    role?: 'admin' | 'sales'
    phone?: string
    avatar_url?: string
  }) {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        ...user,
        role: user.role || 'admin',
        is_active: true
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateUser(id: string, updates: {
    name?: string
    email?: string
    role?: 'admin' | 'sales'
    phone?: string
    avatar_url?: string
    is_active?: boolean
  }) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteUser(id: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  static async updateLastLogin(id: string) {
    const { error } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', id)
    
    if (error) throw error
  }

  static async getActiveUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_active', true)
      .order('last_login', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async getUserStats() {
    const { data, error } = await supabase
      .from('users')
      .select('role, is_active, last_login')
    
    if (error) throw error
    
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    const stats = {
      total: data.length,
      active: data.filter(u => u.is_active).length,
      admins: data.filter(u => u.role === 'admin').length,
      sales: data.filter(u => u.role === 'sales').length,
      online: data.filter(u => u.last_login && new Date(u.last_login) > oneDayAgo).length
    }
    
    return stats
  }
}

// Activity Logging Service
export class ActivityLogService {
  static async logActivity(activity: {
    user_id: string
    action: string
    resource_type: string
    resource_id?: string
    details?: any
    ip_address?: string
    user_agent?: string
  }) {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert([{
        ...activity,
        timestamp: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getActivityLogs(limit = 50) {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        user:users(name, email)
      `)
      .order('timestamp', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  }

  static async getActivityLogsByUser(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        user:users(name, email)
      `)
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  }

  static async getRecentActivity(limit = 10) {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        user:users(name, email)
      `)
      .order('timestamp', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  }
}

// System Monitoring Service
export class SystemMonitoringService {
  static async getSystemHealth() {
    try {
      // Check database connection
      const { data: dbCheck, error: dbError } = await supabase
        .from('users')
        .select('count')
        .limit(1)
      
      if (dbError) throw dbError

      // Check storage
      const { data: storageCheck, error: storageError } = await supabase.storage
        .from('files')
        .list('', { limit: 1 })
      
      if (storageError) throw storageError

      return {
        status: 'healthy',
        database: 'connected',
        storage: 'connected',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        database: 'error',
        storage: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }
  }

  static async getSystemStats() {
    try {
      // Get counts from all major tables
      const [clients, projects, projectRequests, files, invoices, users] = await Promise.all([
        supabase.from('clients').select('count', { count: 'exact' }),
        supabase.from('projects').select('count', { count: 'exact' }),
        supabase.from('project_requests').select('count', { count: 'exact' }),
        supabase.from('files').select('count', { count: 'exact' }),
        supabase.from('invoices').select('count', { count: 'exact' }),
        supabase.from('users').select('count', { count: 'exact' })
      ])

      return {
        clients: clients.count || 0,
        projects: projects.count || 0,
        projectRequests: projectRequests.count || 0,
        files: files.count || 0,
        invoices: invoices.count || 0,
        users: users.count || 0,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      throw new Error(`Failed to get system stats: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  static async getStorageUsage() {
    try {
      const { data, error } = await supabase.storage
        .from('files')
        .list('', { limit: 1000 })
      
      if (error) throw error

      const totalSize = data.reduce((sum, file) => sum + (file.metadata?.size || 0), 0)
      const fileCount = data.length

      return {
        totalSize,
        fileCount,
        averageSize: fileCount > 0 ? totalSize / fileCount : 0,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      throw new Error(`Failed to get storage usage: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
