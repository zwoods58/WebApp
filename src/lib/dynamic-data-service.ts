import { supabase } from './supabase'

export interface DashboardStats {
  totalProjectRequests: number
  activeProjectRequests: number
  completedProjectRequests: number
  totalClients: number
  activeClients: number
  newClientsThisMonth: number
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalRevenue: number
  monthlyRevenue: number
  pendingInvoices: number
  totalFiles: number
  totalNotifications: number
  unreadNotifications: number
  pageViews: number
  uniqueVisitors: number
  conversionRate: number
  bounceRate: number
  avgSessionDuration: number
}

export interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  bounceRate: number
  avgSessionDuration: number
  conversionRate: number
  revenue: number
  newClients: number
  activeProjects: number
  completedProjects: number
  pendingInvoices: number
}

export interface TimeSeriesData {
  date: string
  visitors: number
  pageViews: number
  revenue: number
  conversions: number
}

export interface DeviceData {
  device: string
  visitors: number
  percentage: number
  color: string
  name: string
  value: number
}

export interface ProjectStatusData {
  status: string
  count: number
  color: string
}

export interface RevenueData {
  month: string
  revenue: number
  expenses: number
  profit: number
}

export interface ClientAcquisitionData {
  source: string
  clients: number
  conversion: number
  color: string
}

export class DynamicDataService {
  // Get comprehensive dashboard statistics
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [
        projectRequestsResult,
        clientsResult,
        projectsResult,
        invoicesResult,
        filesResult,
        notificationsResult,
        analyticsResult
      ] = await Promise.all([
        supabase.from('project_requests').select('id, status, created_at'),
        supabase.from('clients').select('id, status, created_at'),
        supabase.from('projects').select('id, status, created_at'),
        supabase.from('invoices').select('id, amount, status, created_at'),
        supabase.from('files').select('id, created_at'),
        supabase.from('notifications').select('id, status, created_at'),
        supabase.from('analytics').select('page_views, unique_visitors, bounce_rate, avg_session_duration, conversion_rate, created_at')
      ])

      const projectRequests = projectRequestsResult.data || []
      const clients = clientsResult.data || []
      const projects = projectsResult.data || []
      const invoices = invoicesResult.data || []
      const files = filesResult.data || []
      const notifications = notificationsResult.data || []
      const analytics = analyticsResult.data || []

      // Calculate current month
      const currentMonth = new Date()
      currentMonth.setDate(1)
      const currentMonthISO = currentMonth.toISOString()

      // Calculate totals
      const totalProjectRequests = projectRequests.length
      const activeProjectRequests = projectRequests.filter(pr => pr.status === 'active' || pr.status === 'pending').length
      const completedProjectRequests = projectRequests.filter(pr => pr.status === 'completed').length

      const totalClients = clients.length
      const activeClients = clients.filter(c => c.status === 'active').length
      const newClientsThisMonth = clients.filter(c => new Date(c.created_at) >= currentMonth).length

      const totalProjects = projects.length
      const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'in_progress').length
      const completedProjects = projects.filter(p => p.status === 'completed').length

      const totalRevenue = invoices.reduce((sum, invoice) => sum + (invoice.amount || 0), 0)
      const monthlyRevenue = invoices
        .filter(invoice => new Date(invoice.created_at) >= currentMonth)
        .reduce((sum, invoice) => sum + (invoice.amount || 0), 0)

      const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending').length
      const totalFiles = files.length
      const totalNotifications = notifications.length
      const unreadNotifications = notifications.filter(n => n.status === 'unread').length

      // Calculate analytics averages
      const avgPageViews = analytics.length > 0 
        ? analytics.reduce((sum, a) => sum + (a.page_views || 0), 0) / analytics.length 
        : 0
      const avgUniqueVisitors = analytics.length > 0 
        ? analytics.reduce((sum, a) => sum + (a.unique_visitors || 0), 0) / analytics.length 
        : 0
      const avgBounceRate = analytics.length > 0 
        ? analytics.reduce((sum, a) => sum + (a.bounce_rate || 0), 0) / analytics.length 
        : 0
      const avgSessionDuration = analytics.length > 0 
        ? analytics.reduce((sum, a) => sum + (a.avg_session_duration || 0), 0) / analytics.length 
        : 0
      const avgConversionRate = analytics.length > 0 
        ? analytics.reduce((sum, a) => sum + (a.conversion_rate || 0), 0) / analytics.length 
        : 0

      return {
        totalProjectRequests,
        activeProjectRequests,
        completedProjectRequests,
        totalClients,
        activeClients,
        newClientsThisMonth,
        totalProjects,
        activeProjects,
        completedProjects,
        totalRevenue,
        monthlyRevenue,
        pendingInvoices,
        totalFiles,
        totalNotifications,
        unreadNotifications,
        pageViews: Math.round(avgPageViews),
        uniqueVisitors: Math.round(avgUniqueVisitors),
        conversionRate: Math.round(avgConversionRate * 100) / 100,
        bounceRate: Math.round(avgBounceRate * 100) / 100,
        avgSessionDuration: Math.round(avgSessionDuration)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      // Return default values if there's an error
      return {
        totalProjectRequests: 0,
        activeProjectRequests: 0,
        completedProjectRequests: 0,
        totalClients: 0,
        activeClients: 0,
        newClientsThisMonth: 0,
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        pendingInvoices: 0,
        totalFiles: 0,
        totalNotifications: 0,
        unreadNotifications: 0,
        pageViews: 0,
        uniqueVisitors: 0,
        conversionRate: 0,
        bounceRate: 0,
        avgSessionDuration: 0
      }
    }
  }

  // Get analytics data for charts
  static async getAnalyticsData(): Promise<AnalyticsData> {
    try {
      const stats = await this.getDashboardStats()
      
      return {
        pageViews: stats.pageViews,
        uniqueVisitors: stats.uniqueVisitors,
        bounceRate: stats.bounceRate,
        avgSessionDuration: stats.avgSessionDuration,
        conversionRate: stats.conversionRate,
        revenue: stats.monthlyRevenue,
        newClients: stats.newClientsThisMonth,
        activeProjects: stats.activeProjects,
        completedProjects: stats.completedProjects,
        pendingInvoices: stats.pendingInvoices
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      return {
        pageViews: 0,
        uniqueVisitors: 0,
        bounceRate: 0,
        avgSessionDuration: 0,
        conversionRate: 0,
        revenue: 0,
        newClients: 0,
        activeProjects: 0,
        completedProjects: 0,
        pendingInvoices: 0
      }
    }
  }

  // Get time series data for charts
  static async getTimeSeriesData(days: number = 30): Promise<TimeSeriesData[]> {
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data: analyticsData, error } = await supabase
        .from('analytics')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: true })

      if (error) throw error

      // Group data by date and aggregate
      const groupedData = new Map<string, TimeSeriesData>()
      
      for (let i = 0; i < days; i++) {
        const date = new Date()
        date.setDate(date.getDate() - (days - 1 - i))
        const dateStr = date.toISOString().split('T')[0]
        groupedData.set(dateStr, {
          date: dateStr,
          visitors: 0,
          pageViews: 0,
          revenue: 0,
          conversions: 0
        })
      }

      // Aggregate data
      analyticsData?.forEach(record => {
        const date = record.created_at.split('T')[0]
        const existing = groupedData.get(date)
        if (existing) {
          existing.visitors += record.unique_visitors || 0
          existing.pageViews += record.page_views || 0
          existing.revenue += record.revenue || 0
          existing.conversions += record.conversions || 0
        }
      })

      return Array.from(groupedData.values())
    } catch (error) {
      console.error('Error fetching time series data:', error)
      return []
    }
  }

  // Get device data
  static async getDeviceData(): Promise<DeviceData[]> {
    try {
      const { data, error } = await supabase
        .from('analytics')
        .select('device_type, unique_visitors')
        .not('device_type', 'is', null)

      if (error) throw error

      // Group by device type
      const deviceMap = new Map<string, number>()
      data?.forEach(record => {
        const device = record.device_type || 'Unknown'
        deviceMap.set(device, (deviceMap.get(device) || 0) + (record.unique_visitors || 0))
      })

      const total = Array.from(deviceMap.values()).reduce((sum, count) => sum + count, 0)
      const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00']

      return Array.from(deviceMap.entries()).map(([device, visitors], index) => ({
        device,
        visitors,
        percentage: total > 0 ? Math.round((visitors / total) * 100) : 0,
        color: colors[index % colors.length],
        name: device,
        value: visitors
      }))
    } catch (error) {
      console.error('Error fetching device data:', error)
      return [
        { device: 'Desktop', visitors: 0, percentage: 0, color: '#8884d8', name: 'Desktop', value: 0 },
        { device: 'Mobile', visitors: 0, percentage: 0, color: '#82ca9d', name: 'Mobile', value: 0 },
        { device: 'Tablet', visitors: 0, percentage: 0, color: '#ffc658', name: 'Tablet', value: 0 }
      ]
    }
  }

  // Get project status data
  static async getProjectStatusData(): Promise<ProjectStatusData[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('status')

      if (error) throw error

      // Count by status
      const statusMap = new Map<string, number>()
      data?.forEach(project => {
        const status = project.status || 'Unknown'
        statusMap.set(status, (statusMap.get(status) || 0) + 1)
      })

      const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300']
      return Array.from(statusMap.entries()).map(([status, count], index) => ({
        status,
        count,
        color: colors[index % colors.length]
      }))
    } catch (error) {
      console.error('Error fetching project status data:', error)
      return []
    }
  }

  // Get revenue data
  static async getRevenueData(): Promise<RevenueData[]> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('amount, created_at, status')
        .gte('created_at', new Date(new Date().getFullYear(), 0, 1).toISOString())

      if (error) throw error

      // Group by month
      const monthlyData = new Map<string, { revenue: number; expenses: number }>()
      
      data?.forEach(invoice => {
        const date = new Date(invoice.created_at)
        const month = date.toLocaleDateString('en-US', { month: 'short' })
        
        const existing = monthlyData.get(month) || { revenue: 0, expenses: 0 }
        
        if (invoice.status === 'paid') {
          existing.revenue += invoice.amount || 0
        } else {
          existing.expenses += (invoice.amount || 0) * 0.1 // Assume 10% of invoice amount as expenses
        }
        
        monthlyData.set(month, existing)
      })

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return months.map(month => {
        const data = monthlyData.get(month) || { revenue: 0, expenses: 0 }
        return {
          month,
          revenue: data.revenue,
          expenses: data.expenses,
          profit: data.revenue - data.expenses
        }
      })
    } catch (error) {
      console.error('Error fetching revenue data:', error)
      return []
    }
  }

  // Get client acquisition data
  static async getClientAcquisitionData(): Promise<ClientAcquisitionData[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('source, created_at')

      if (error) throw error

      // Group by source
      const sourceMap = new Map<string, number>()
      data?.forEach(client => {
        const source = client.source || 'Direct'
        sourceMap.set(source, (sourceMap.get(source) || 0) + 1)
      })

      const total = Array.from(sourceMap.values()).reduce((sum, count) => sum + count, 0)
      const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00']

      return Array.from(sourceMap.entries()).map(([source, clients], index) => ({
        source,
        clients,
        conversion: total > 0 ? Math.round((clients / total) * 100 * 10) / 10 : 0,
        color: colors[index % colors.length]
      }))
    } catch (error) {
      console.error('Error fetching client acquisition data:', error)
      return []
    }
  }

  // Track page view
  static async trackPageView(page: string, userId?: string) {
    try {
      await supabase.from('analytics').insert({
        page,
        event: 'page_view',
        user_id: userId,
        page_views: 1,
        unique_visitors: 1,
        created_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error tracking page view:', error)
    }
  }

  // Track event
  static async trackEvent(event: string, properties: any = {}, userId?: string) {
    try {
      await supabase.from('analytics').insert({
        event,
        properties,
        user_id: userId,
        created_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error tracking event:', error)
    }
  }
}

export default DynamicDataService
