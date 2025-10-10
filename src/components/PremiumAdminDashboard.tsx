'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Briefcase, 
  MessageSquare, 
  BarChart3, 
  Plus, 
  Filter,
  FileText,
  Bell,
  DollarSign,
  Phone,
  Mail,
  Calendar,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings,
  Home,
  FolderOpen,
  CreditCard,
  MessageCircle,
  TrendingUp,
  X,
  User,
  LogOut,
  RefreshCw,
  Activity,
  Shield,
  Database,
  HardDrive,
  ChevronDown
} from 'lucide-react'
import { 
  ProjectRequestService, 
  ClientService, 
  ProjectService, 
  FileService, 
  InvoiceService, 
  NotificationService,
  AnalyticsService 
} from '@/lib/data-services'
import { 
  UserManagementService, 
  ActivityLogService, 
  SystemMonitoringService 
} from '@/lib/user-management'
import { useAuth } from '@/contexts/AuthContext'
import CRUDModal from './CRUDModal'
import SearchFilter from './SearchFilter'
import BulkOperations from './BulkOperations'
import EmailComposer from './EmailComposer'
import FileManager from './FileManager'
import AnalyticsDashboard from './AnalyticsDashboard'
import PDFReportGenerator from './PDFReportGenerator'
import DynamicDataService from '@/lib/dynamic-data-service'
import CalendarService, { CalendarEvent, CalendarStats } from '@/lib/calendar-service'
import CommunicationsService, { Communication, CommunicationStats } from '@/lib/communications-service'

interface ProjectRequest {
  id: string
  name: string
  email: string
  company: string | null
  project_type: string
  status: string
  created_at: string
}

interface Consultation {
  id: string
  name: string
  email: string
  company: string | null
  projectType: string
  budget: string
  timeline: string
  preferredDate: string
  preferredTime: string
  message: string
  status: string
  createdAt: string
  hasFileUpload: boolean
}

interface Client {
  id: string
  name: string
  email: string
  company: string | null
  status: string
  created_at: string
}

interface Project {
  id: string
  title: string
  status: string
  priority: string
  start_date: string | null
  end_date: string | null
  created_at: string
}

interface File {
  id: string
  filename: string
  original_filename: string
  file_size: number
  file_type: string
  created_at: string
}

interface Notification {
  id: string
  title: string
  message: string
  status: string
  created_at: string
}

interface Invoice {
  id: string
  invoice_number: string
  amount: number
  status: string
  due_date: string
  created_at: string
}

export default function PremiumAdminDashboard() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsSidebarOpen, setSettingsSidebarOpen] = useState(false)
  const [projectRequests, setProjectRequests] = useState<ProjectRequest[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch consultations
  const fetchConsultations = async () => {
    try {
      const response = await fetch('/api/consultations')
      const data = await response.json()
      if (data.success) {
        setConsultations(data.consultations)
      }
    } catch (error) {
      console.error('Error fetching consultations:', error)
    }
  }
  
  // New state for additional features
  const [adminUsers, setAdminUsers] = useState<any[]>([])
  const [activityLogs, setActivityLogs] = useState<any[]>([])
  const [systemHealth, setSystemHealth] = useState<any>(null)
  const [systemStats, setSystemStats] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  // CRUD Modal states
  const [crudModal, setCrudModal] = useState<{
    isOpen: boolean
    type: 'create' | 'edit' | 'delete' | null
    data: any
    title: string
  }>({
    isOpen: false,
    type: null,
    data: null,
    title: ''
  })

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [filteredData, setFilteredData] = useState({
    projectRequests: [] as ProjectRequest[],
    consultations: [] as Consultation[],
    clients: [] as Client[],
    projects: [] as Project[]
  })

  // Bulk Operations states
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [bulkActionLoading, setBulkActionLoading] = useState(false)

  // PDF Report Generator state
  const [pdfReportOpen, setPdfReportOpen] = useState(false)
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [calendarStats, setCalendarStats] = useState<CalendarStats>({
    thisWeek: 0,
    completed: 0,
    upcoming: 0,
    overdue: 0
  })
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [communications, setCommunications] = useState<Communication[]>([])
  const [communicationStats, setCommunicationStats] = useState<CommunicationStats>({
    totalMessages: 0,
    emails: 0,
    calls: 0,
    meetings: 0,
    pending: 0,
    completed: 0
  })

  // Email Composer states
  const [emailComposer, setEmailComposer] = useState<{
    isOpen: boolean
    recipients: Array<{ id: string; name: string; email: string }>
    template?: string
    subject?: string
    message?: string
  }>({
    isOpen: false,
    recipients: []
  })

  const loadData = async () => {
    try {
      setError(null)
      
      // Load all data in parallel with proper error handling
      const [
        projectRequestsData,
        clientsData,
        projectsData,
        filesData,
        notificationsData,
        invoicesData,
        usersData,
        healthData,
        statsData,
        calendarEventsData,
        calendarStatsData,
        communicationsData,
        communicationStatsData
      ] = await Promise.all([
        ProjectRequestService.getAll().catch((err) => {
          console.error('Error loading project requests:', err)
          return []
        }),
        ClientService.getAll().catch((err) => {
          console.error('Error loading clients:', err)
          return []
        }),
        ProjectService.getAll().catch((err) => {
          console.error('Error loading projects:', err)
          return []
        }),
        FileService.getAll().catch((err) => {
          console.error('Error loading files:', err)
          return []
        }),
        NotificationService.getAll().catch((err) => {
          console.error('Error loading notifications:', err)
          return []
        }),
        InvoiceService.getAll().catch((err) => {
          console.error('Error loading invoices:', err)
          return []
        }),
        UserManagementService.getAllUsers().catch((err) => {
          console.error('Error loading users:', err)
          return []
        }),
        SystemMonitoringService.getSystemHealth().catch((err) => {
          console.error('Error loading system health:', err)
          return null
        }),
        SystemMonitoringService.getSystemStats().catch((err) => {
          console.error('Error loading system stats:', err)
          return null
        }),
        CalendarService.getAllEvents().catch((err) => {
          console.error('Error loading calendar events:', err)
          return []
        }),
        CalendarService.getCalendarStats().catch((err) => {
          console.error('Error loading calendar stats:', err)
          return { thisWeek: 0, completed: 0, upcoming: 0, overdue: 0 }
        }),
        CommunicationsService.getAllCommunications().catch((err) => {
          console.error('Error loading communications:', err)
          return []
        }),
        CommunicationsService.getCommunicationStats().catch((err) => {
          console.error('Error loading communication stats:', err)
          return { totalMessages: 0, emails: 0, calls: 0, meetings: 0, pending: 0, completed: 0 }
        })
      ])

      setProjectRequests(projectRequestsData)
      setClients(clientsData)
      setProjects(projectsData)
      setFiles(filesData)
      setNotifications(notificationsData)
      setInvoices(invoicesData)
      setAdminUsers(usersData)
      setSystemHealth(healthData)
      setSystemStats(statsData)
      setCalendarEvents(calendarEventsData)
      setCalendarStats(calendarStatsData)
      setCommunications(communicationsData)
      setCommunicationStats(communicationStatsData)
      
      // Initialize filtered data
      setFilteredData({
        projectRequests: projectRequestsData,
        consultations: consultations,
        clients: clientsData,
        projects: projectsData
      })
      
      // Track page view
      await AnalyticsService.trackEvent('/admin', 'page_view', { 
        timestamp: new Date().toISOString(),
        user_id: user?.id
      }).catch((err) => {
        console.error('Error tracking page view:', err)
      })
      
    } catch (err) {
      console.error('Error loading data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const handleGenerateCalendarEvents = async () => {
    try {
      await CalendarService.generateEventsFromProjects()
      // Reload calendar data
      const [events, stats] = await Promise.all([
        CalendarService.getAllEvents(),
        CalendarService.getCalendarStats()
      ])
      setCalendarEvents(events)
      setCalendarStats(stats)
      alert('Calendar events generated successfully!')
    } catch (error) {
      console.error('Error generating calendar events:', error)
      alert('Error generating calendar events. Check console for details.')
    }
  }

  const handleGenerateCommunications = async () => {
    try {
      await CommunicationsService.generateCommunicationsFromActivities()
      // Reload communications data
      const [comms, stats] = await Promise.all([
        CommunicationsService.getAllCommunications(),
        CommunicationsService.getCommunicationStats()
      ])
      setCommunications(comms)
      setCommunicationStats(stats)
      alert('Communications generated successfully!')
    } catch (error) {
      console.error('Error generating communications:', error)
      alert('Error generating communications. Check console for details.')
    }
  }


  // Search and Filter functions
  const filterData = (data: any[], query: string, filters: Record<string, any>, type: string) => {
    let filtered = [...data]

    // Apply search query
    if (query) {
      filtered = filtered.filter(item => {
        const searchFields = type === 'projectRequest' 
          ? ['name', 'email', 'company', 'project_type', 'description']
          : type === 'consultation'
          ? ['name', 'email', 'company', 'projectType', 'message']
          : type === 'client'
          ? ['name', 'email', 'company', 'status']
          : ['title', 'description', 'status']
        
        return searchFields.some(field => 
          item[field]?.toString().toLowerCase().includes(query.toLowerCase())
        )
      })
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        filtered = filtered.filter(item => {
          if (key === 'status') {
            return item.status === value
          } else if (key === 'priority') {
            return item.priority === value
          } else if (key === 'budget') {
            return item.budget === value
          } else if (key === 'timeline') {
            return item.timeline === value
          } else if (key === 'date_from') {
            return new Date(item.created_at || item.createdAt) >= new Date(value)
          } else if (key === 'date_to') {
            return new Date(item.created_at || item.createdAt) <= new Date(value)
          } else if (key === 'projectType') {
            return item.projectType === value
          } else if (key === 'hasFileUpload') {
            return item.hasFileUpload === (value === 'true')
          }
          return true
        })
      }
    })

    return filtered
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const filtered = {
      projectRequests: filterData(projectRequests, query, filters, 'projectRequest'),
      consultations: filterData(consultations, query, filters, 'consultation'),
      clients: filterData(clients, query, filters, 'client'),
      projects: filterData(projects, query, filters, 'project')
    }
    setFilteredData(filtered)
  }

  const handleFilter = (newFilters: Record<string, any>) => {
    setFilters(newFilters)
    const filtered = {
      projectRequests: filterData(projectRequests, searchQuery, newFilters, 'projectRequest'),
      consultations: filterData(consultations, searchQuery, newFilters, 'consultation'),
      clients: filterData(clients, searchQuery, newFilters, 'client'),
      projects: filterData(projects, searchQuery, newFilters, 'project')
    }
    setFilteredData(filtered)
  }

  // Bulk Operations functions
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedItems(filteredData.projectRequests.map(item => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (itemId: string, selected: boolean) => {
    if (selected) {
      setSelectedItems(prev => [...prev, itemId])
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId))
    }
  }

  const handleClearSelection = () => {
    setSelectedItems([])
  }

  const handleBulkAction = async (action: string, items: string[]) => {
    setBulkActionLoading(true)
    try {
      switch (action) {
        case 'delete':
          await Promise.all(items.map(id => ProjectRequestService.delete(id)))
          break
        case 'edit':
          // For now, just show a message - in a real app, you'd open a bulk edit modal
          alert(`Bulk edit ${items.length} items - Feature coming soon!`)
          break
        case 'email':
          // Open email composer with selected recipients
          const selectedRecipients = filteredData.projectRequests
            .filter(item => items.includes(item.id))
            .map(item => ({
              id: item.id,
              name: item.name,
              email: item.email
            }))
          
          setEmailComposer({
            isOpen: true,
            recipients: selectedRecipients,
            template: 'custom'
          })
          break
        case 'export':
          // For now, just show a message - in a real app, you'd generate and download a file
          alert(`Export ${items.length} items - Feature coming soon!`)
          break
      }
      await loadData() // Refresh data
      setSelectedItems([]) // Clear selection
    } catch (error) {
      console.error('Error performing bulk action:', error)
      setError('Failed to perform bulk action')
    } finally {
      setBulkActionLoading(false)
    }
  }

  // CRUD Operations
  const handleCreate = (type: string) => {
    const configs = {
      projectRequest: {
        title: 'Create New Project Request',
        fields: [
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'phone', label: 'Phone', type: 'tel' },
          { name: 'company', label: 'Company', type: 'text' },
          { name: 'project_type', label: 'Project Type', type: 'text', required: true },
          { name: 'budget', label: 'Budget', type: 'select', options: [
            { value: 'Under $5,000', label: 'Under $5,000' },
            { value: '$5,000 - $10,000', label: '$5,000 - $10,000' },
            { value: '$10,000 - $25,000', label: '$10,000 - $25,000' },
            { value: '$25,000+', label: '$25,000+' }
          ]},
          { name: 'timeline', label: 'Timeline', type: 'select', options: [
            { value: 'ASAP', label: 'ASAP' },
            { value: '1-2 weeks', label: '1-2 weeks' },
            { value: '1 month', label: '1 month' },
            { value: '2-3 months', label: '2-3 months' },
            { value: '3+ months', label: '3+ months' }
          ]},
          { name: 'description', label: 'Description', type: 'textarea', required: true },
          { name: 'requirements', label: 'Requirements', type: 'textarea' }
        ]
      },
      client: {
        title: 'Create New Client',
        fields: [
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'phone', label: 'Phone', type: 'tel' },
          { name: 'company', label: 'Company', type: 'text' },
          { name: 'status', label: 'Status', type: 'select', required: true, options: [
            { value: 'lead', label: 'Lead' },
            { value: 'client', label: 'Client' },
            { value: 'inactive', label: 'Inactive' }
          ]},
          { name: 'source', label: 'Source', type: 'text' },
          { name: 'notes', label: 'Notes', type: 'textarea' }
        ]
      },
      project: {
        title: 'Create New Project',
        fields: [
          { name: 'title', label: 'Title', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'textarea', required: true },
          { name: 'status', label: 'Status', type: 'select', required: true, options: [
            { value: 'planning', label: 'Planning' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'review', label: 'Review' },
            { value: 'completed', label: 'Completed' },
            { value: 'on_hold', label: 'On Hold' }
          ]},
          { name: 'priority', label: 'Priority', type: 'select', required: true, options: [
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'urgent', label: 'Urgent' }
          ]},
          { name: 'budget', label: 'Budget', type: 'number' },
          { name: 'start_date', label: 'Start Date', type: 'date' },
          { name: 'end_date', label: 'End Date', type: 'date' }
        ]
      }
    }

    const config = configs[type as keyof typeof configs]
    if (config) {
      setCrudModal({
        isOpen: true,
        type: 'create',
        data: {},
        title: config.title
      })
    }
  }

  const handleEdit = (type: string, data: any) => {
    const configs = {
      projectRequest: {
        title: 'Edit Project Request',
        fields: [
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'phone', label: 'Phone', type: 'tel' },
          { name: 'company', label: 'Company', type: 'text' },
          { name: 'project_type', label: 'Project Type', type: 'text', required: true },
          { name: 'budget', label: 'Budget', type: 'select', options: [
            { value: 'Under $5,000', label: 'Under $5,000' },
            { value: '$5,000 - $10,000', label: '$5,000 - $10,000' },
            { value: '$10,000 - $25,000', label: '$10,000 - $25,000' },
            { value: '$25,000+', label: '$25,000+' }
          ]},
          { name: 'timeline', label: 'Timeline', type: 'select', options: [
            { value: 'ASAP', label: 'ASAP' },
            { value: '1-2 weeks', label: '1-2 weeks' },
            { value: '1 month', label: '1 month' },
            { value: '2-3 months', label: '2-3 months' },
            { value: '3+ months', label: '3+ months' }
          ]},
          { name: 'description', label: 'Description', type: 'textarea', required: true },
          { name: 'requirements', label: 'Requirements', type: 'textarea' },
          { name: 'status', label: 'Status', type: 'select', required: true, options: [
            { value: 'new', label: 'New' },
            { value: 'contacted', label: 'Contacted' },
            { value: 'quoted', label: 'Quoted' },
            { value: 'accepted', label: 'Accepted' },
            { value: 'rejected', label: 'Rejected' }
          ]},
          { name: 'notes', label: 'Notes', type: 'textarea' }
        ]
      }
    }

    const config = configs[type as keyof typeof configs]
    if (config) {
      setCrudModal({
        isOpen: true,
        type: 'edit',
        data: data,
        title: config.title
      })
    }
  }

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      switch (type) {
        case 'projectRequest':
          await ProjectRequestService.delete(id)
          break
        case 'client':
          await ClientService.delete(id)
          break
        case 'project':
          await ProjectService.delete(id)
          break
      }
      await loadData() // Refresh data
    } catch (error) {
      console.error('Error deleting item:', error)
      setError('Failed to delete item')
    }
  }

  const handleSave = async (data: any) => {
    try {
      if (crudModal.type === 'create') {
        // Add user_id to the data
        const dataWithUser = { ...data, user_id: user?.id }
        
        switch (crudModal.title) {
          case 'Create New Project Request':
            await ProjectRequestService.create(dataWithUser)
            break
          case 'Create New Client':
            await ClientService.create(dataWithUser)
            break
          case 'Create New Project':
            await ProjectService.create(dataWithUser)
            break
        }
      } else if (crudModal.type === 'edit') {
        switch (crudModal.title) {
          case 'Edit Project Request':
            await ProjectRequestService.update(crudModal.data.id, data)
            break
          case 'Edit Client':
            await ClientService.update(crudModal.data.id, data)
            break
          case 'Edit Project':
            await ProjectService.update(crudModal.data.id, data)
            break
        }
      }
      
      await loadData() // Refresh data
      setCrudModal({ isOpen: false, type: null, data: null, title: '' })
    } catch (error) {
      console.error('Error saving data:', error)
      setError('Failed to save data')
    }
  }

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true)
      await loadData()
      await fetchConsultations()
      setLoading(false)
    }
    
    initializeData()
  }, [])


      const stats = [
        { label: 'Total Clients', value: clients.length, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { label: 'Active Projects', value: projects.filter(p => p.status === 'in_progress').length, icon: Briefcase, color: 'text-green-600', bgColor: 'bg-green-50' },
        { label: 'New Requests', value: projectRequests.filter(r => r.status === 'new').length + consultations.filter(c => c.status === 'pending').length, icon: MessageSquare, color: 'text-orange-600', bgColor: 'bg-orange-50' },
        { label: 'Consultations', value: consultations.length, icon: MessageSquare, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
        { label: 'Unread Notifications', value: notifications.filter(n => n.status === 'unread').length, icon: Bell, color: 'text-purple-600', bgColor: 'bg-purple-50' },
        { label: 'Total Revenue', value: `$${invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-50' },
        { label: 'Files Uploaded', value: files.length, icon: FileText, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
        { label: 'Completed Projects', value: projects.filter(p => p.status === 'completed').length, icon: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
        { label: 'Pending Invoices', value: invoices.filter(inv => inv.status === 'sent').length, icon: CreditCard, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
        { label: 'Team Members', value: adminUsers.length, icon: User, color: 'text-pink-600', bgColor: 'bg-pink-50' },
        { label: 'System Status', value: systemHealth?.status === 'healthy' ? 'Online' : 'Offline', icon: systemHealth?.status === 'healthy' ? CheckCircle : AlertCircle, color: systemHealth?.status === 'healthy' ? 'text-green-600' : 'text-red-600', bgColor: systemHealth?.status === 'healthy' ? 'bg-green-50' : 'bg-red-50' },
        { label: 'Database', value: systemHealth?.database === 'connected' ? 'Connected' : 'Error', icon: Database, color: systemHealth?.database === 'connected' ? 'text-green-600' : 'text-red-600', bgColor: systemHealth?.database === 'connected' ? 'bg-green-50' : 'bg-red-50' },
        { label: 'Storage', value: systemHealth?.storage === 'connected' ? 'Connected' : 'Error', icon: HardDrive, color: systemHealth?.storage === 'connected' ? 'text-green-600' : 'text-red-600', bgColor: systemHealth?.storage === 'connected' ? 'bg-green-50' : 'bg-red-50' }
      ]

  const navigation = [
    { name: 'Overview', icon: Home, tab: 'overview', current: activeTab === 'overview' },
    { name: 'Project Requests', icon: MessageSquare, tab: 'requests', current: activeTab === 'requests' },
    { name: 'Analytics/Invoice', icon: TrendingUp, tab: 'analytics', current: activeTab === 'analytics' },
    { name: 'Settings', icon: Settings, tab: 'settings', current: activeTab === 'settings' }
  ]

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'planning': return 'bg-yellow-100 text-yellow-800'
      case 'on_hold': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadData}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex overflow-x-auto">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 shadow-2xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex-shrink-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div className="ml-3">
              <span className="text-xl font-bold text-white">Admin</span>
              <p className="text-xs text-gray-400">Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-10 px-6">
          <div className="space-y-2">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  if (item.name === 'Settings') {
                    setSettingsSidebarOpen(true)
                  } else {
                    setActiveTab(item.tab)
                  }
                }}
                className={`w-full flex items-center px-6 py-4 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  item.current
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className={`h-5 w-5 mr-4 ${item.current ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                {item.name}
              </button>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="mt-auto p-6 border-t border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-3">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{user?.email || 'Admin User'}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>

      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {/* Content based on active tab */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-visible">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="p-10 lg:p-12 xl:p-16">
                {/* Dashboard Overview Header - Moved to top */}
                <div className="relative mb-12">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 via-purple-100/50 to-pink-100/50 rounded-2xl"></div>
                  <div className="relative p-8 lg:p-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                      <div className="flex-1">
                        <div className="flex items-center mb-6">
                          <div className="p-5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl mr-6">
                            <BarChart3 className="h-10 w-10 text-white" />
                          </div>
                          <div>
                            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-3 tracking-tight">Dashboard Overview</h2>
                            <p className="text-xl text-gray-600 font-semibold">Welcome back! Here's what's happening with your business.</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl border-2 border-indigo-200 shadow-xl">
                          <div className="flex items-center space-x-4">
                            <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"></div>
                            <div>
                              <p className="text-sm font-bold text-gray-700">Last updated</p>
                              <p className="text-lg font-black text-gray-900">{new Date().toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={refreshData}
                          disabled={refreshing}
                          className={`bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-2xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 ${refreshing ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center">
                            <RefreshCw className={`h-6 w-6 mr-3 ${refreshing ? 'animate-spin' : ''}`} />
                            {refreshing ? 'Refreshing...' : 'Refresh Data'}
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats - Analytics section below header */}
                <div className="mb-20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {stats.map((stat, index) => (
                      <div key={index} className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden">
                        <div className="p-6">
                          {/* Header with icon and label */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <div className={`p-2 rounded-lg ${stat.bgColor} shadow-sm group-hover:shadow-md transition-all duration-300`}>
                                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                                <div className="ml-3">
                                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
                                  <div className="flex items-center">
                                    <div className="w-1 h-1 bg-emerald-500 rounded-full mr-1 animate-pulse"></div>
                                    <span className="text-xs font-medium text-emerald-600">Live</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Main value */}
                          <div className="mb-5">
                            <p className="text-2xl font-black text-gray-900 mb-1 tracking-tight">{stat.value}</p>
                            <div className="flex items-center text-xs text-gray-600">
                              <span className="font-semibold text-emerald-600">+12%</span>
                              <span className="ml-2 text-gray-500">vs last month</span>
                            </div>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="mb-3">
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full transition-all duration-1000 ${stat.bgColor.replace('bg-', 'bg-').replace('-50', '-400')} group-hover:animate-pulse`} style={{width: '75%'}}></div>
                            </div>
                          </div>
                          
                          {/* Footer info */}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="font-medium">2m ago</span>
                            <div className="flex items-center">
                              <div className="w-1 h-1 bg-emerald-500 rounded-full mr-1"></div>
                              <span className="font-semibold">Online</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
              </div>
            )}

            {/* Project Requests Tab */}
            {activeTab === 'requests' && (
              <div className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Project Requests</h2>
                    <p className="text-gray-600 mt-2">Manage and track incoming project requests from potential clients</p>
                  </div>
                  <div className="flex space-x-3">
                        <button 
                          onClick={() => handleCreate('projectRequest')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          New Request
                        </button>
                  </div>
                </div>

                {/* Search and Filter */}
                <SearchFilter
                  onSearch={handleSearch}
                  onFilter={handleFilter}
                  searchPlaceholder="Search project requests..."
                  filterOptions={[
                    {
                      key: 'status',
                      label: 'Status',
                      type: 'select',
                      options: [
                        { value: 'new', label: 'New' },
                        { value: 'contacted', label: 'Contacted' },
                        { value: 'quoted', label: 'Quoted' },
                        { value: 'accepted', label: 'Accepted' },
                        { value: 'rejected', label: 'Rejected' }
                      ]
                    },
                    {
                      key: 'budget',
                      label: 'Budget',
                      type: 'select',
                      options: [
                        { value: 'Under $5,000', label: 'Under $5,000' },
                        { value: '$5,000 - $10,000', label: '$5,000 - $10,000' },
                        { value: '$10,000 - $25,000', label: '$10,000 - $25,000' },
                        { value: '$25,000+', label: '$25,000+' }
                      ]
                    },
                    {
                      key: 'timeline',
                      label: 'Timeline',
                      type: 'select',
                      options: [
                        { value: 'ASAP', label: 'ASAP' },
                        { value: '1-2 weeks', label: '1-2 weeks' },
                        { value: '1 month', label: '1 month' },
                        { value: '2-3 months', label: '2-3 months' },
                        { value: '3+ months', label: '3+ months' }
                      ]
                    },
                    {
                      key: 'date_from',
                      label: 'From Date',
                      type: 'date'
                    },
                    {
                      key: 'date_to',
                      label: 'To Date',
                      type: 'date'
                    }
                  ]}
                  className="mb-6"
                />

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-orange-500 rounded-lg">
                        <MessageSquare className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-orange-600">New Requests</p>
                        <p className="text-2xl font-bold text-orange-900">
                          {projectRequests.filter(r => r.status === 'new').length + consultations.filter(c => c.status === 'pending').length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-500 rounded-lg">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">Contacted</p>
                        <p className="text-2xl font-bold text-blue-900">{projectRequests.filter(r => r.status === 'contacted').length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-500 rounded-lg">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">Quoted</p>
                        <p className="text-2xl font-bold text-green-900">{projectRequests.filter(r => r.status === 'quoted').length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-purple-500 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-purple-600">Accepted</p>
                        <p className="text-2xl font-bold text-purple-900">{projectRequests.filter(r => r.status === 'accepted').length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructions and Help */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                  <div className="flex items-start">
                    <div className="p-2 bg-blue-100 rounded-lg mr-4">
                      <MessageSquare className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Manage Project Requests</h3>
                      <div className="text-blue-800 space-y-2">
                        <p>• <strong>New Requests:</strong> Review incoming requests and determine if they align with your services</p>
                        <p>• <strong>Contacted:</strong> Reach out to potential clients to discuss their project requirements</p>
                        <p>• <strong>Quoted:</strong> Send detailed project proposals and pricing information</p>
                        <p>• <strong>Accepted:</strong> Convert successful quotes into active projects</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bulk Operations */}
                <BulkOperations
                  selectedItems={selectedItems}
                  totalItems={filteredData.projectRequests.length + filteredData.consultations.length}
                  onSelectAll={handleSelectAll}
                  onClearSelection={handleClearSelection}
                  onBulkAction={handleBulkAction}
                  className="mb-4"
                />

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">All Project Requests & Consultations</h3>
                    <p className="text-sm text-gray-600">Click on any request to view full details and manage the client relationship</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <input
                              type="checkbox"
                              checked={selectedItems.length === filteredData.projectRequests.length && filteredData.projectRequests.length > 0}
                              onChange={(e) => handleSelectAll(e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {/* Project Requests */}
                        {filteredData.projectRequests.map((request) => (
                          <tr key={`pr-${request.id}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(request.id)}
                                onChange={(e) => handleSelectItem(request.id, e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{request.name}</div>
                                <div className="text-sm text-gray-500">{request.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                Project Request
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.project_type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.company || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                request.status === 'new' ? 'bg-orange-100 text-orange-800' :
                                request.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {request.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(request.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-900" title="View Details">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleEdit('projectRequest', request)}
                                  className="text-green-600 hover:text-green-900" 
                                  title="Edit Request"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleDelete('projectRequest', request.id)}
                                  className="text-red-600 hover:text-red-900" 
                                  title="Delete Request"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        
                        {/* Consultations */}
                        {filteredData.consultations.map((consultation) => (
                          <tr key={`cons-${consultation.id}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(consultation.id)}
                                onChange={(e) => handleSelectItem(consultation.id, e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{consultation.name}</div>
                                <div className="text-sm text-gray-500">{consultation.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                Consultation
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{consultation.projectType}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{consultation.company || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                consultation.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                                consultation.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {consultation.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(consultation.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-900" title="View Details">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleEdit('consultation', consultation)}
                                  className="text-green-600 hover:text-green-900" 
                                  title="Edit Consultation"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleDelete('consultation', consultation.id)}
                                  className="text-red-600 hover:text-red-900" 
                                  title="Delete Consultation"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Empty State */}
                {filteredData.projectRequests.length === 0 && filteredData.consultations.length === 0 && (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Requests Yet</h3>
                    <p className="text-gray-600 mb-6">When clients submit project requests through your website, they'll appear here for you to review and manage.</p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                      View Website Contact Form
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Clients Tab */}
            {activeTab === 'clients' && (
              <div className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Clients</h2>
                    <p className="text-gray-600 mt-2">Manage your client relationships and track their project history</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Client
                  </button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-500 rounded-lg">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">Total Clients</p>
                        <p className="text-2xl font-bold text-blue-900">{clients.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-500 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">Active Clients</p>
                        <p className="text-2xl font-bold text-green-900">{clients.filter(c => c.status === 'client').length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-500 rounded-lg">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-yellow-600">Leads</p>
                        <p className="text-2xl font-bold text-yellow-900">{clients.filter(c => c.status === 'lead').length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-red-500 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-red-600">Inactive</p>
                        <p className="text-2xl font-bold text-red-900">{clients.filter(c => c.status === 'inactive').length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructions and Help */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                  <div className="flex items-start">
                    <div className="p-2 bg-green-100 rounded-lg mr-4">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-900 mb-2">Client Management Best Practices</h3>
                      <div className="text-green-800 space-y-2">
                        <p>• <strong>Active Clients:</strong> Clients with ongoing projects or regular communication</p>
                        <p>• <strong>Leads:</strong> Potential clients who have shown interest but haven't committed yet</p>
                        <p>• <strong>Inactive:</strong> Clients who haven't been in contact for an extended period</p>
                        <p>• <strong>Regular Updates:</strong> Keep client information current and track all interactions</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {clients.map((client) => (
                    <div key={client.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-200">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                          <p className="text-sm text-gray-500">{client.email}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          client.status === 'client' ? 'bg-green-100 text-green-800' :
                          client.status === 'lead' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {client.status}
                        </span>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium w-20">Company:</span>
                          <span className="text-gray-900">{client.company || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium w-20">Joined:</span>
                          <span className="text-gray-900">{new Date(client.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium w-20">Projects:</span>
                          <span className="text-gray-900">{projects.filter(p => p.id.includes('p')).length} active</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                          <div className="flex items-center justify-center">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </div>
                        </button>
                        <button className="flex-1 bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                          <div className="flex items-center justify-center">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </div>
                        </button>
                        <button className="flex-1 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm hover:bg-green-100 transition-colors">
                          <div className="flex items-center justify-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Contact
                          </div>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {clients.length === 0 && (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Users className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Clients Yet</h3>
                    <p className="text-gray-600 mb-6">Start building your client base by adding your first client or converting project requests into clients.</p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                      Add Your First Client
                    </button>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="mt-8 bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <Plus className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Add New Client</p>
                          <p className="text-sm text-gray-500">Create a new client profile</p>
                        </div>
                      </div>
                    </button>
                    <button className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                          <MessageSquare className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Send Newsletter</p>
                          <p className="text-sm text-gray-500">Email all active clients</p>
                        </div>
                      </div>
                    </button>
                    <button className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg mr-3">
                          <BarChart3 className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Client Analytics</p>
                          <p className="text-sm text-gray-500">View client insights</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Projects</h2>
                    <p className="text-gray-600 mt-2">Track and manage all your active and completed projects</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-500 rounded-lg">
                        <Briefcase className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">Total Projects</p>
                        <p className="text-2xl font-bold text-blue-900">{projects.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-500 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">Completed</p>
                        <p className="text-2xl font-bold text-green-900">{projects.filter(p => p.status === 'completed').length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-500 rounded-lg">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-yellow-600">In Progress</p>
                        <p className="text-2xl font-bold text-yellow-900">{projects.filter(p => p.status === 'in_progress').length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-red-500 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-red-600">On Hold</p>
                        <p className="text-2xl font-bold text-red-900">{projects.filter(p => p.status === 'on_hold').length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructions and Help */}
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
                  <div className="flex items-start">
                    <div className="p-2 bg-purple-100 rounded-lg mr-4">
                      <Briefcase className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-purple-900 mb-2">Project Management Guidelines</h3>
                      <div className="text-purple-800 space-y-2">
                        <p>• <strong>Planning:</strong> Projects in initial planning and setup phase</p>
                        <p>• <strong>In Progress:</strong> Active development and implementation</p>
                        <p>• <strong>Review:</strong> Projects under client review or testing</p>
                        <p>• <strong>Completed:</strong> Successfully delivered and closed projects</p>
                        <p>• <strong>On Hold:</strong> Temporarily paused projects awaiting decisions</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Cards */}
                <div className="space-y-6">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-purple-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                              <Briefcase className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 mb-1">{project.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>Start: {project.start_date && new Date(project.start_date).toLocaleDateString()}</span>
                                <span>End: {project.end_date && new Date(project.end_date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(project.status)}`}>
                                {project.status.replace('_', ' ')}
                              </span>
                              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(project.priority)}`}>
                                {project.priority}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Project Details</h4>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p><span className="font-medium">Status:</span> {project.status.replace('_', ' ')}</p>
                                <p><span className="font-medium">Priority:</span> {project.priority}</p>
                                <p><span className="font-medium">Timeline:</span> {project.start_date && project.end_date ? 
                                  `${Math.ceil((new Date(project.end_date).getTime() - new Date(project.start_date).getTime()) / (1000 * 60 * 60 * 24))} days` : 
                                  'TBD'
                                }</p>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Progress</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Completion</span>
                                  <span className="font-medium text-gray-900">
                                    {project.status === 'completed' ? '100%' : 
                                     project.status === 'in_progress' ? '65%' : 
                                     project.status === 'review' ? '90%' : '25%'}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className={`h-2 rounded-full ${
                                    project.status === 'completed' ? 'bg-green-500' :
                                    project.status === 'in_progress' ? 'bg-blue-500' :
                                    project.status === 'review' ? 'bg-yellow-500' : 'bg-gray-400'
                                  }`} style={{
                                    width: project.status === 'completed' ? '100%' : 
                                           project.status === 'in_progress' ? '65%' : 
                                           project.status === 'review' ? '90%' : '25%'
                                  }}></div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Next Steps</h4>
                              <div className="text-sm text-gray-600">
                                {project.status === 'planning' && <p>Begin development phase</p>}
                                {project.status === 'in_progress' && <p>Continue development</p>}
                                {project.status === 'review' && <p>Address client feedback</p>}
                                {project.status === 'completed' && <p>Project delivered</p>}
                                {project.status === 'on_hold' && <p>Awaiting client decision</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3 pt-4 border-t border-gray-100">
                        <button className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </div>
                        </button>
                        <button className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                          <div className="flex items-center">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Project
                          </div>
                        </button>
                        <button className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm hover:bg-green-100 transition-colors">
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Client Chat
                          </div>
                        </button>
                        <button className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg text-sm hover:bg-purple-100 transition-colors">
                          <div className="flex items-center">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analytics
                          </div>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {projects.length === 0 && (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Briefcase className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
                    <p className="text-gray-600 mb-6">Start your first project by converting a project request or creating a new project from scratch.</p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                      Create Your First Project
                    </button>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="mt-8 bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <button className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <Plus className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">New Project</p>
                          <p className="text-sm text-gray-500">Start a new project</p>
                        </div>
                      </div>
                    </button>
                    <button className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                          <Calendar className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Project Timeline</p>
                          <p className="text-sm text-gray-500">View project calendar</p>
                        </div>
                      </div>
                    </button>
                    <button className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg mr-3">
                          <BarChart3 className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Project Reports</p>
                          <p className="text-sm text-gray-500">Generate reports</p>
                        </div>
                      </div>
                    </button>
                    <button className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left">
                      <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                          <Settings className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Project Settings</p>
                          <p className="text-sm text-gray-500">Manage templates</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Project Management Tab */}
            {activeTab === 'project-management' && (
              <div className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Project Management</h2>
                    <p className="text-gray-600 mt-2">Manage client projects, payments, and project lifecycle</p>
                  </div>
                </div>
                
                {/* Project Management Component */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="text-center py-12">
                    <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Project Management Dashboard</h3>
                    <p className="text-gray-600 mb-6">
                      Access the full project management interface to handle client projects, payments, and project lifecycle.
                    </p>
                    <a
                      href="/admin/projects"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Open Project Management
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Calendar Tab */}
            {activeTab === 'calendar' && (
              <div className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Project Calendar</h2>
                    <p className="text-gray-600 mt-2">Track project deadlines, milestones, and important dates</p>
                  </div>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Today
                    </button>
                    <button 
                      onClick={handleGenerateCalendarEvents}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Events
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Event
                    </button>
                  </div>
                </div>

                {/* Calendar Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-500 rounded-lg">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">This Week</p>
                        <p className="text-2xl font-bold text-blue-900">{calendarStats.thisWeek}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-500 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">Completed</p>
                        <p className="text-2xl font-bold text-green-900">{calendarStats.completed}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-500 rounded-lg">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-yellow-600">Upcoming</p>
                        <p className="text-2xl font-bold text-yellow-900">{calendarStats.upcoming}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-red-500 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-red-600">Overdue</p>
                        <p className="text-2xl font-bold text-red-900">{calendarStats.overdue}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-indigo-500 rounded-lg">
                        <MessageSquare className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-indigo-600">Consultations</p>
                        <p className="text-2xl font-bold text-indigo-900">{consultations.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calendar View */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-7 gap-4 mb-4">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-4">
                      {(() => {
                        const year = currentMonth.getFullYear()
                        const month = currentMonth.getMonth()
                        const firstDay = new Date(year, month, 1)
                        const lastDay = new Date(year, month + 1, 0)
                        const daysInMonth = lastDay.getDate()
                        const startingDayOfWeek = firstDay.getDay()
                        
                        // Get events for this month
                        const monthEvents = calendarEvents.filter(event => {
                          const eventDate = new Date(event.date)
                          return eventDate.getMonth() === month && eventDate.getFullYear() === year
                        })
                        
                        // Add consultation events
                        const consultationEvents = consultations.map(consultation => ({
                          id: `cons-${consultation.id}`,
                          title: `Consultation - ${consultation.name}`,
                          date: consultation.preferredDate,
                          type: 'consultation',
                          time: consultation.preferredTime,
                          status: consultation.status
                        }))
                        
                        const allMonthEvents = [...monthEvents, ...consultationEvents.filter(event => {
                          const eventDate = new Date(event.date)
                          return eventDate.getMonth() === month && eventDate.getFullYear() === year
                        })]
                        
                        // Create calendar cells
                        const cells = []
                        
                        // Add empty cells for days before the first day of the month
                        for (let i = 0; i < startingDayOfWeek; i++) {
                          cells.push(
                            <div key={`empty-${i}`} className="h-20 border border-gray-200 rounded-lg p-2"></div>
                          )
                        }
                        
                        // Add days of the month
                        for (let day = 1; day <= daysInMonth; day++) {
                          const dayEvents = allMonthEvents.filter(event => {
                            const eventDate = new Date(event.date)
                            return eventDate.getDate() === day
                          })
                          
                          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()
                          
                          cells.push(
                            <div 
                              key={day} 
                              className={`h-20 border border-gray-200 rounded-lg p-2 cursor-pointer transition-colors ${
                                isToday ? 'bg-blue-50 border-blue-300' : 
                                dayEvents.length > 0 ? 'bg-gray-50 border-gray-300' : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className={`text-sm font-medium ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
                                {day}
                              </div>
                              {dayEvents.slice(0, 2).map((event, index) => (
                                <div 
                                  key={index}
                                  className={`text-xs mt-1 truncate ${
                                    event.type === 'consultation' ? 'text-indigo-600' :
                                    (event as any).color === 'blue' ? 'text-blue-600' :
                                    (event as any).color === 'green' ? 'text-green-600' :
                                    (event as any).color === 'red' ? 'text-red-600' :
                                    (event as any).color === 'yellow' ? 'text-yellow-600' :
                                    (event as any).color === 'orange' ? 'text-orange-600' :
                                    (event as any).color === 'purple' ? 'text-purple-600' : 'text-gray-600'
                                  }`}
                                >
                                  {event.title}
                                </div>
                              ))}
                              {dayEvents.length > 2 && (
                                <div className="text-xs text-gray-500 mt-1">
                                  +{dayEvents.length - 2} more
                                </div>
                              )}
                            </div>
                          )
                        }
                        
                        return cells
                      })()}
                    </div>
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
                  <div className="space-y-4">
                    {/* Regular Calendar Events */}
                    {calendarEvents.slice(0, 10).map((event, index) => (
                      <div key={index} className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className={`w-3 h-3 rounded-full mr-4 ${
                          event.color === 'blue' ? 'bg-blue-500' :
                          event.color === 'green' ? 'bg-green-500' :
                          event.color === 'purple' ? 'bg-purple-500' :
                          event.color === 'red' ? 'bg-red-500' :
                          event.color === 'yellow' ? 'bg-yellow-500' :
                          event.color === 'orange' ? 'bg-orange-500' : 'bg-gray-500'
                        }`}></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          event.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                          event.color === 'green' ? 'bg-green-100 text-green-800' :
                          event.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                          event.color === 'red' ? 'bg-red-100 text-red-800' :
                          event.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                          event.color === 'orange' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.type}
                        </span>
                      </div>
                    ))}
                    
                    {/* Consultation Events */}
                    {consultations.slice(0, 5).map((consultation, index) => (
                      <div key={`cons-${consultation.id}`} className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="w-3 h-3 rounded-full mr-4 bg-indigo-500"></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Consultation - {consultation.name}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(consultation.preferredDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })} at {consultation.preferredTime}
                          </p>
                          <p className="text-xs text-gray-500">{consultation.projectType}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          consultation.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                          consultation.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                          consultation.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {consultation.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Files Tab */}
            {activeTab === 'files' && (
              <div className="p-6 lg:p-8">
                <FileManager />
              </div>
            )}

            {/* Invoices Tab */}
            {activeTab === 'invoices' && (
              <div className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Invoices</h2>
                    <p className="text-gray-600 mt-2">Manage client invoices, payments, and billing</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Invoice
                  </button>
                </div>

                {/* Invoice Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-500 rounded-lg">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-blue-900">${invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-500 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">Paid</p>
                        <p className="text-2xl font-bold text-green-900">{invoices.filter(inv => inv.status === 'paid').length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-500 rounded-lg">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-yellow-600">Pending</p>
                        <p className="text-2xl font-bold text-yellow-900">{invoices.filter(inv => inv.status === 'sent').length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-red-500 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-red-600">Overdue</p>
                        <p className="text-2xl font-bold text-red-900">0</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoices Table */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">All Invoices</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {invoices.map((invoice) => (
                          <tr key={invoice.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {invoice.invoice_number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              Client Name
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${invoice.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                                invoice.status === 'sent' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {invoice.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(invoice.due_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-900" title="View">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="text-green-600 hover:text-green-900" title="Edit">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="text-purple-600 hover:text-purple-900" title="Send">
                                  <Mail className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Communications Tab */}
            {activeTab === 'communications' && (
              <div className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Communications</h2>
                    <p className="text-gray-600 mt-2">Track all client communications, emails, and meetings</p>
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      onClick={handleGenerateCommunications}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Communications
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      New Communication
                    </button>
                  </div>
                </div>

                {/* Communication Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-500 rounded-lg">
                        <MessageCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">Total Messages</p>
                        <p className="text-2xl font-bold text-blue-900">{communicationStats.totalMessages}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-500 rounded-lg">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">Emails</p>
                        <p className="text-2xl font-bold text-green-900">{communicationStats.emails}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-purple-500 rounded-lg">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-purple-600">Calls</p>
                        <p className="text-2xl font-bold text-purple-900">{communicationStats.calls}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-500 rounded-lg">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-yellow-600">Meetings</p>
                        <p className="text-2xl font-bold text-yellow-900">{communicationStats.meetings}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-indigo-500 rounded-lg">
                        <MessageSquare className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-indigo-600">Consultations</p>
                        <p className="text-2xl font-bold text-indigo-900">{consultations.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Communications */}
                <div className="space-y-4">
                  {/* Regular Communications */}
                  {communications.slice(0, 10).map((comm, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className={`p-3 rounded-lg mr-4 ${
                            comm.type === 'email' ? 'bg-green-100' :
                            comm.type === 'call' ? 'bg-purple-100' : 'bg-yellow-100'
                          }`}>
                            {comm.type === 'email' ? <Mail className="h-5 w-5 text-green-600" /> :
                             comm.type === 'call' ? <Phone className="h-5 w-5 text-purple-600" /> :
                             <Calendar className="h-5 w-5 text-yellow-600" />}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{comm.subject}</h4>
                            <p className="text-sm text-gray-600">{comm.recipient_email || 'No recipient'}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(comm.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            comm.status === 'sent' ? 'bg-green-100 text-green-800' :
                            comm.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            comm.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                            comm.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                            comm.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {comm.status}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Consultation Requests */}
                  {consultations.slice(0, 5).map((consultation, index) => (
                    <div key={`cons-${consultation.id}`} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className="p-3 rounded-lg mr-4 bg-indigo-100">
                            <MessageSquare className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Consultation Request - {consultation.projectType}</h4>
                            <p className="text-sm text-gray-600">{consultation.name} ({consultation.email})</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {consultation.company && `${consultation.company} • `}
                              Preferred: {consultation.preferredDate} at {consultation.preferredTime}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(consultation.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            consultation.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                            consultation.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                            consultation.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {consultation.status}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="p-6 lg:p-8">
                <AnalyticsDashboard onGenerateReport={() => setPdfReportOpen(true)} />
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">User Management</h2>
                    <p className="text-gray-600 mt-2">Manage admin users and their permissions</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </button>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-500 rounded-lg">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">Total Users</p>
                        <p className="text-2xl font-bold text-blue-900">{adminUsers.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-500 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">Active Users</p>
                        <p className="text-2xl font-bold text-green-900">{adminUsers.filter(u => u.is_active).length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-purple-500 rounded-lg">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-purple-600">Admins</p>
                        <p className="text-2xl font-bold text-purple-900">{adminUsers.filter(u => u.role === 'admin').length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-500 rounded-lg">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-yellow-600">Sales</p>
                        <p className="text-2xl font-bold text-yellow-900">{adminUsers.filter(u => u.role === 'sales').length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {adminUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mr-3">
                                  <User className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-900" title="Edit">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-900" title="Delete">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Logs Tab */}
            {activeTab === 'activity' && (
              <div className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Activity Logs</h2>
                    <p className="text-gray-600 mt-2">Track all admin actions and system activities</p>
                  </div>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Activity Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-500 rounded-lg">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">Total Activities</p>
                        <p className="text-2xl font-bold text-blue-900">{activityLogs.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-500 rounded-lg">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">Today</p>
                        <p className="text-2xl font-bold text-green-900">{activityLogs.filter(log => {
                          const today = new Date()
                          const logDate = new Date(log.timestamp)
                          return logDate.toDateString() === today.toDateString()
                        }).length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-purple-500 rounded-lg">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-purple-600">Active Users</p>
                        <p className="text-2xl font-bold text-purple-900">{new Set(activityLogs.map(log => log.user_id)).size}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-500 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-yellow-600">Errors</p>
                        <p className="text-2xl font-bold text-yellow-900">{activityLogs.filter(log => log.action.includes('error')).length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Logs List */}
                <div className="space-y-4">
                  {activityLogs.map((log, index) => (
                    <div key={log.id || index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className="p-3 rounded-lg bg-gray-100 mr-4">
                            <Activity className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{log.action}</h4>
                            <p className="text-sm text-gray-600">
                              {log.user?.name || 'System'} • {log.resource_type}
                              {log.resource_id && ` • ID: ${log.resource_id}`}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(log.timestamp).toLocaleString()}
                            </p>
                            {log.details && (
                              <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                {JSON.stringify(log.details, null, 2)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            log.action.includes('create') ? 'bg-green-100 text-green-800' :
                            log.action.includes('update') ? 'bg-blue-100 text-blue-800' :
                            log.action.includes('delete') ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {log.action.split('_')[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Logs Tab */}
            {activeTab === 'activity' && (
              <div className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Activity Logs</h2>
                    <p className="text-gray-600 mt-2">Track all admin actions and system activities</p>
                  </div>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Activity Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-500 rounded-lg">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">Total Activities</p>
                        <p className="text-2xl font-bold text-blue-900">0</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-500 rounded-lg">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">Today</p>
                        <p className="text-2xl font-bold text-green-900">0</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-purple-500 rounded-lg">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-purple-600">Active Users</p>
                        <p className="text-2xl font-bold text-purple-900">0</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-500 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-yellow-600">Errors</p>
                        <p className="text-2xl font-bold text-yellow-900">0</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Empty State */}
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Activity className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity Logs Yet</h3>
                  <p className="text-gray-600 mb-6">System activities and admin actions will be tracked here for audit and monitoring purposes.</p>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                    View System Documentation
                  </button>
                </div>
              </div>
            )}

            {/* System Health Tab */}
            {activeTab === 'system' && (
              <div className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">System Health</h2>
                    <p className="text-gray-600 mt-2">Monitor system performance and health status</p>
                  </div>
                  <button 
                    onClick={refreshData}
                    disabled={refreshing}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                {/* System Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className={`rounded-xl p-6 border ${
                    systemHealth?.status === 'healthy' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${
                        systemHealth?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Overall Status</p>
                        <p className={`text-2xl font-bold ${
                          systemHealth?.status === 'healthy' ? 'text-green-900' : 'text-red-900'
                        }`}>
                          {systemHealth?.status === 'healthy' ? 'Healthy' : 'Unhealthy'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`rounded-xl p-6 border ${
                    systemHealth?.database === 'connected' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${
                        systemHealth?.database === 'connected' ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        <Database className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Database</p>
                        <p className={`text-2xl font-bold ${
                          systemHealth?.database === 'connected' ? 'text-green-900' : 'text-red-900'
                        }`}>
                          {systemHealth?.database === 'connected' ? 'Connected' : 'Error'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`rounded-xl p-6 border ${
                    systemHealth?.storage === 'connected' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${
                        systemHealth?.storage === 'connected' ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        <HardDrive className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Storage</p>
                        <p className={`text-2xl font-bold ${
                          systemHealth?.storage === 'connected' ? 'text-green-900' : 'text-red-900'
                        }`}>
                          {systemHealth?.storage === 'connected' ? 'Connected' : 'Error'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Consultations */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Recent Consultations</h3>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {consultations.length} Total
                    </span>
                  </div>
                  
                  {consultations.length > 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preferred Time</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {consultations.slice(0, 5).map((consultation) => (
                              <tr key={consultation.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                      <User className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{consultation.name}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consultation.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consultation.company || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {consultation.preferredDate && consultation.preferredTime 
                                    ? new Date(`${consultation.preferredDate}T${consultation.preferredTime}`).toLocaleString()
                                    : 'Not specified'
                                  }
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    consultation.status === 'pending' 
                                      ? 'bg-yellow-100 text-yellow-800' 
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {consultation.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(consultation.createdAt).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations yet</h3>
                      <p className="text-gray-500">Consultation requests will appear here when clients submit them.</p>
                    </div>
                  )}
                </div>

                {/* System Statistics */}
                {systemStats && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Overview</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Clients</span>
                          <span className="font-semibold">{systemStats.clients}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Projects</span>
                          <span className="font-semibold">{systemStats.projects}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Project Requests</span>
                          <span className="font-semibold">{systemStats.projectRequests}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Files</span>
                          <span className="font-semibold">{systemStats.files}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Invoices</span>
                          <span className="font-semibold">{systemStats.invoices}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Users</span>
                          <span className="font-semibold">{systemStats.users}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Info</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Check</span>
                          <span className="font-semibold">
                            {systemHealth?.timestamp ? new Date(systemHealth.timestamp).toLocaleString() : 'Never'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Uptime</span>
                          <span className="font-semibold">99.9%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Response Time</span>
                          <span className="font-semibold">~200ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Version</span>
                          <span className="font-semibold">v1.0.0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-center">
                      <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold text-red-900">System Error</h3>
                        <p className="text-red-700 mt-1">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Settings</h2>
                    <p className="text-gray-600 mt-2">Manage your account settings, preferences, and system configuration</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Account Settings */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" defaultValue="Admin User" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" defaultValue="admin@atarwebb.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" defaultValue="+1 (555) 123-4567" />
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Save Changes
                      </button>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Email Notifications</p>
                          <p className="text-sm text-gray-600">Receive email updates for new project requests</p>
                        </div>
                        <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">SMS Notifications</p>
                          <p className="text-sm text-gray-600">Get text messages for urgent updates</p>
                        </div>
                        <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Project Updates</p>
                          <p className="text-sm text-gray-600">Notifications for project status changes</p>
                        </div>
                        <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                      </div>
                    </div>
                  </div>

                  {/* System Settings */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" defaultValue="AtarWebb Solutions" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>Eastern Time (ET)</option>
                          <option>Central Time (CT)</option>
                          <option>Mountain Time (MT)</option>
                          <option>Pacific Time (PT)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                          <option>GBP (£)</option>
                          <option>CAD (C$)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs would go here... */}
          </div>
        </main>
      </div>

      {/* Settings Popup Modal */}
      {settingsSidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50 bg-gray-600 bg-opacity-75"
            onClick={() => setSettingsSidebarOpen(false)}
          />
          
          {/* Settings Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <Settings className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                    <p className="text-sm text-gray-600">Manage your admin preferences and system configuration</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettingsSidebarOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Settings Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* General Settings */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <Settings className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
                        <p className="text-sm text-gray-600">Basic application configuration</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('settings')
                        setSettingsSidebarOpen(false)
                      }}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Open General Settings
                    </button>
                  </div>

                  {/* User Management */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                        <p className="text-sm text-gray-600">Manage admin users and permissions</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('users')
                        setSettingsSidebarOpen(false)
                      }}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Open User Management
                    </button>
                  </div>

                  {/* Activity Logs */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <Activity className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Activity Logs</h3>
                        <p className="text-sm text-gray-600">View system activity and audit trails</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('activity')
                        setSettingsSidebarOpen(false)
                      }}
                      className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Open Activity Logs
                    </button>
                  </div>

                  {/* System Health */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                        <Shield className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
                        <p className="text-sm text-gray-600">Monitor system performance and status</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('system')
                        setSettingsSidebarOpen(false)
                      }}
                      className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Open System Health
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Download className="h-5 w-5 text-gray-600 mr-3" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Export Data</p>
                        <p className="text-sm text-gray-600">Download system data</p>
                      </div>
                    </button>
                    <button className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Settings className="h-5 w-5 text-gray-600 mr-3" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">System Preferences</p>
                        <p className="text-sm text-gray-600">Advanced settings</p>
                      </div>
                    </button>
                    <button className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Shield className="h-5 w-5 text-gray-600 mr-3" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Security Settings</p>
                        <p className="text-sm text-gray-600">Security configuration</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Email Composer */}
      <EmailComposer
        isOpen={emailComposer.isOpen}
        onClose={() => setEmailComposer({ isOpen: false, recipients: [] })}
        recipients={emailComposer.recipients}
        template={emailComposer.template as any}
        subject={emailComposer.subject}
        message={emailComposer.message}
      />

      {/* CRUD Modal */}
      {crudModal.isOpen && (
        <CRUDModal
          isOpen={crudModal.isOpen}
          onClose={() => setCrudModal({ isOpen: false, type: null, data: null, title: '' })}
          onSave={handleSave}
          title={crudModal.title}
          fields={crudModal.type === 'create' ? 
            (crudModal.title === 'Create New Project Request' ? [
              { name: 'name', label: 'Name', type: 'text', required: true },
              { name: 'email', label: 'Email', type: 'email', required: true },
              { name: 'phone', label: 'Phone', type: 'tel' },
              { name: 'company', label: 'Company', type: 'text' },
              { name: 'project_type', label: 'Project Type', type: 'text', required: true },
              { name: 'budget', label: 'Budget', type: 'select', options: [
                { value: 'Under $5,000', label: 'Under $5,000' },
                { value: '$5,000 - $10,000', label: '$5,000 - $10,000' },
                { value: '$10,000 - $25,000', label: '$10,000 - $25,000' },
                { value: '$25,000+', label: '$25,000+' }
              ]},
              { name: 'timeline', label: 'Timeline', type: 'select', options: [
                { value: 'ASAP', label: 'ASAP' },
                { value: '1-2 weeks', label: '1-2 weeks' },
                { value: '1 month', label: '1 month' },
                { value: '2-3 months', label: '2-3 months' },
                { value: '3+ months', label: '3+ months' }
              ]},
              { name: 'description', label: 'Description', type: 'textarea', required: true },
              { name: 'requirements', label: 'Requirements', type: 'textarea' }
            ] : []) :
            (crudModal.title === 'Edit Project Request' ? [
              { name: 'name', label: 'Name', type: 'text', required: true },
              { name: 'email', label: 'Email', type: 'email', required: true },
              { name: 'phone', label: 'Phone', type: 'tel' },
              { name: 'company', label: 'Company', type: 'text' },
              { name: 'project_type', label: 'Project Type', type: 'text', required: true },
              { name: 'budget', label: 'Budget', type: 'select', options: [
                { value: 'Under $5,000', label: 'Under $5,000' },
                { value: '$5,000 - $10,000', label: '$5,000 - $10,000' },
                { value: '$10,000 - $25,000', label: '$10,000 - $25,000' },
                { value: '$25,000+', label: '$25,000+' }
              ]},
              { name: 'timeline', label: 'Timeline', type: 'select', options: [
                { value: 'ASAP', label: 'ASAP' },
                { value: '1-2 weeks', label: '1-2 weeks' },
                { value: '1 month', label: '1 month' },
                { value: '2-3 months', label: '2-3 months' },
                { value: '3+ months', label: '3+ months' }
              ]},
              { name: 'description', label: 'Description', type: 'textarea', required: true },
              { name: 'requirements', label: 'Requirements', type: 'textarea' },
              { name: 'status', label: 'Status', type: 'select', required: true, options: [
                { value: 'new', label: 'New' },
                { value: 'contacted', label: 'Contacted' },
                { value: 'quoted', label: 'Quoted' },
                { value: 'accepted', label: 'Accepted' },
                { value: 'rejected', label: 'Rejected' }
              ]},
              { name: 'notes', label: 'Notes', type: 'textarea' }
            ] : [])
          }
          initialData={crudModal.data}
        />
      )}

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* PDF Report Generator */}
      <PDFReportGenerator
        isOpen={pdfReportOpen}
        onClose={() => setPdfReportOpen(false)}
      />
    </div>
  )
}