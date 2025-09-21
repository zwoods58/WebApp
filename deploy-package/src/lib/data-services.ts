import { supabase } from './supabase'

// Project Requests Service
export class ProjectRequestService {
  static async getAll() {
    const { data, error } = await supabase
      .from('project_requests')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from('project_requests')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(request: any) {
    const { data, error } = await supabase
      .from('project_requests')
      .insert([request])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('project_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('project_requests')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  static async getStats() {
    const { data, error } = await supabase
      .from('project_requests')
      .select('status')
    
    if (error) throw error
    
    const stats = {
      total: data.length,
      new: data.filter(r => r.status === 'new').length,
      contacted: data.filter(r => r.status === 'contacted').length,
      quoted: data.filter(r => r.status === 'quoted').length,
      accepted: data.filter(r => r.status === 'accepted').length,
      rejected: data.filter(r => r.status === 'rejected').length
    }
    
    return stats
  }
}

// Clients Service
export class ClientService {
  static async getAll() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(client: any) {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  static async getStats() {
    const { data, error } = await supabase
      .from('clients')
      .select('status')
    
    if (error) throw error
    
    const stats = {
      total: data.length,
      active: data.filter(c => c.status === 'client').length,
      leads: data.filter(c => c.status === 'lead').length,
      inactive: data.filter(c => c.status === 'inactive').length
    }
    
    return stats
  }
}

// Projects Service
export class ProjectService {
  static async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(project: any) {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  static async getStats() {
    const { data, error } = await supabase
      .from('projects')
      .select('status')
    
    if (error) throw error
    
    const stats = {
      total: data.length,
      planning: data.filter(p => p.status === 'planning').length,
      in_progress: data.filter(p => p.status === 'in_progress').length,
      review: data.filter(p => p.status === 'review').length,
      completed: data.filter(p => p.status === 'completed').length,
      on_hold: data.filter(p => p.status === 'on_hold').length
    }
    
    return stats
  }
}

// Files Service
export class FileService {
  static async getAll() {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async upload(file: File, metadata: any) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `uploads/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('files')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data, error } = await supabase
      .from('files')
      .insert([{
        filename: fileName,
        original_filename: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        file_type: metadata.file_type || 'other',
        ...metadata
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async delete(id: string) {
    // Get file info first
    const { data: fileData, error: fetchError } = await supabase
      .from('files')
      .select('file_path')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('files')
      .remove([fileData.file_path])

    if (storageError) throw storageError

    // Delete from database
    const { error } = await supabase
      .from('files')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  static async getStats() {
    const { data, error } = await supabase
      .from('files')
      .select('file_type')
    
    if (error) throw error
    
    const stats = {
      total: data.length,
      documents: data.filter(f => f.file_type === 'document').length,
      images: data.filter(f => f.file_type === 'image').length,
      contracts: data.filter(f => f.file_type === 'contract').length,
      other: data.filter(f => f.file_type === 'other').length
    }
    
    return stats
  }
}

// Invoices Service
export class InvoiceService {
  static async getAll() {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async create(invoice: any) {
    const { data, error } = await supabase
      .from('invoices')
      .insert([invoice])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  static async getStats() {
    const { data, error } = await supabase
      .from('invoices')
      .select('status, amount')
    
    if (error) throw error
    
    const totalRevenue = data.reduce((sum, inv) => sum + parseFloat(inv.amount), 0)
    
    const stats = {
      total: data.length,
      totalRevenue,
      paid: data.filter(inv => inv.status === 'paid').length,
      sent: data.filter(inv => inv.status === 'sent').length,
      overdue: data.filter(inv => inv.status === 'overdue').length,
      draft: data.filter(inv => inv.status === 'draft').length
    }
    
    return stats
  }
}

// Notifications Service
export class NotificationService {
  static async getAll() {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async create(notification: any) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async markAsRead(id: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ status: 'read' })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getStats() {
    const { data, error } = await supabase
      .from('notifications')
      .select('status')
    
    if (error) throw error
    
    const stats = {
      total: data.length,
      unread: data.filter(n => n.status === 'unread').length,
      read: data.filter(n => n.status === 'read').length,
      archived: data.filter(n => n.status === 'archived').length
    }
    
    return stats
  }
}

// Analytics Service
export class AnalyticsService {
  static async trackEvent(page: string, event: string, metadata?: any) {
    const { data, error } = await supabase
      .from('analytics')
      .insert([{
        page,
        event,
        metadata: metadata || {}
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getPageViews(page?: string) {
    let query = supabase
      .from('analytics')
      .select('*')
      .eq('event', 'page_view')
    
    if (page) {
      query = query.eq('page', page)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data
  }

  static async getStats() {
    const { data, error } = await supabase
      .from('analytics')
      .select('page, event, created_at')
    
    if (error) throw error
    
    const pageViews = data.filter(a => a.event === 'page_view')
    const uniquePages = Array.from(new Set(pageViews.map(p => p.page)))
    
    const stats = {
      totalEvents: data.length,
      pageViews: pageViews.length,
      uniquePages: uniquePages.length,
      topPages: uniquePages.map(page => ({
        page,
        views: pageViews.filter(p => p.page === page).length
      })).sort((a, b) => b.views - a.views)
    }
    
    return stats
  }
}
