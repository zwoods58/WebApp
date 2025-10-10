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
  ChevronDown,
  Trash
} from 'lucide-react'

interface Consultation {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  projectDetails?: string
  preferredDate: string
  preferredTime: string
  status: 'pending' | 'accepted' | 'rejected' | 'paid_deposit' | 'payment_failed' | 'fully_paid' | 'completed'
  paymentStatus?: 'pending' | 'deposit_paid' | 'fully_paid' | 'failed'
  totalAmount?: number
  depositAmount?: number
  remainingAmount?: number
  paymentIntentId?: string
  invoiceId?: string
  paidAt?: string
  paymentError?: string
  createdAt: string
  completedAt?: string
  hasFileUpload: boolean
}

interface Project {
  id: string
  name: string
  client: string
  status: 'planning' | 'in_progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  progress: number
  budget: number
  createdAt: string
}

interface Invoice {
  id: string
  client: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  dueDate: string
  createdAt: string
}

export default function SimplifiedAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [stats, setStats] = useState({
    pendingRequests: 0,
    activeProjects: 0,
    totalRevenue: 0,
    outstandingAmount: 0,
    totalConsultations: 0,
    totalProjects: 0,
    totalInvoices: 0,
    completedProjects: 0,
    thisMonthRevenue: 0,
    lastMonthRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [selectedConsultations, setSelectedConsultations] = useState<string[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteMode, setDeleteMode] = useState<'single' | 'bulk'>('single')
  const [consultationToDelete, setConsultationToDelete] = useState<string | null>(null)

  // Fetch real data
  const fetchData = async () => {
    try {
      // Fetch all data from the comprehensive dashboard API
      const response = await fetch('/api/dashboard')
      const data = await response.json()
      
      if (data.success) {
        setConsultations(data.data.consultations)
        setProjects(data.data.projects)
        setInvoices(data.data.invoices)
        setStats(data.data.stats)
        setLastUpdated(new Date())
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchData()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setLoading(true)
    fetchData()
  }

  const navigation = [
    { name: 'Overview', icon: Home, tab: 'overview' },
    { name: 'Project Requests', icon: MessageSquare, tab: 'requests' },
    { name: 'Analytics/Invoice', icon: TrendingUp, tab: 'analytics' },
    { name: 'Settings', icon: Settings, tab: 'settings' }
  ]

  const handleAcceptConsultation = async (id: string) => {
    try {
      const response = await fetch('/api/consultations/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          alert('Consultation accepted! You can now manually send the deposit payment link via email to the client.')
          setConsultations(prev => 
            prev.map(consultation => 
              consultation.id === id 
                ? { ...consultation, status: 'accepted' as const }
                : consultation
            )
          )
        }
      }
    } catch (error) {
      console.error('Error accepting consultation:', error)
    }
  }

  const handleRejectConsultation = async (id: string) => {
    try {
      const response = await fetch('/api/consultations/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setConsultations(prev => 
            prev.map(consultation => 
              consultation.id === id 
                ? { ...consultation, status: 'rejected' as const }
                : consultation
            )
          )
        }
      }
    } catch (error) {
      console.error('Error rejecting consultation:', error)
    }
  }

  const handleCreateInvoice = async (id: string) => {
    try {
      const response = await fetch('/api/payments/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ consultationId: id }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          alert(`Invoice created successfully! Invoice ID: ${data.invoiceId}`)
          // Refresh data to show updated status
          fetchData()
        }
      } else {
        const errorData = await response.json()
        alert(`Failed to create invoice: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error creating invoice:', error)
      alert('Failed to create invoice. Please try again.')
    }
  }

  const handleCompleteProject = async (consultationId: string) => {
    try {
      const response = await fetch('/api/consultations/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ consultationId }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          alert('Project completed! You can now manually send the payment link via email to the client.')
          fetchData() // Refresh dashboard data
        }
      } else {
        const errorData = await response.json()
        alert(`Failed to complete project: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error completing project:', error)
      alert('Failed to complete project. Please try again.')
    }
  }

  const generateTestData = async () => {
    try {
      const response = await fetch('/api/test/generate-consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: 5 }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          alert(`Generated ${data.consultations.length} test consultations!`)
          // Refresh data to show new consultations
          fetchData()
        }
      } else {
        const errorData = await response.json()
        alert(`Failed to generate test data: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error generating test data:', error)
      alert('Failed to generate test data. Please try again.')
    }
  }

  const handleDeleteConsultation = async (id: string) => {
    try {
      const response = await fetch('/api/consultations/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          alert('Consultation deleted successfully!')
          fetchData()
        }
      } else {
        const errorData = await response.json()
        alert(`Failed to delete consultation: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error deleting consultation:', error)
      alert('Failed to delete consultation. Please try again.')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedConsultations.length === 0) {
      alert('Please select consultations to delete.')
      return
    }

    try {
      const response = await fetch('/api/consultations/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedConsultations }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          alert(`Deleted ${data.deleted.length} consultations successfully!`)
          setSelectedConsultations([])
          fetchData()
        }
      } else {
        const errorData = await response.json()
        alert(`Failed to bulk delete: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error bulk deleting consultations:', error)
      alert('Failed to bulk delete consultations. Please try again.')
    }
  }


  const toggleConsultationSelection = (id: string) => {
    setSelectedConsultations(prev => 
      prev.includes(id) 
        ? prev.filter(consultationId => consultationId !== id)
        : [...prev, id]
    )
  }

  const selectAllConsultations = () => {
    setSelectedConsultations(consultations.map(c => c.id))
  }

  const deselectAllConsultations = () => {
    setSelectedConsultations([])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-purple-900 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-700">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">AtarWebb</span>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-300 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Stats */}
            <div className="px-4 py-4 border-b border-purple-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-600/20 p-3 rounded-xl text-center border border-blue-500/30">
                  <div className="text-2xl font-bold text-white">
                    {stats.pendingRequests}
                  </div>
                  <div className="text-xs text-blue-200 font-medium">Pending</div>
                </div>
                <div className="bg-green-600/20 p-3 rounded-xl text-center border border-green-500/30">
                  <div className="text-2xl font-bold text-white">
                    {stats.activeProjects}
                  </div>
                  <div className="text-xs text-green-200 font-medium">Active</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="bg-yellow-600/20 p-3 rounded-xl text-center border border-yellow-500/30">
                  <div className="text-lg font-bold text-white">
                    ${stats.outstandingAmount.toLocaleString()}
                  </div>
                  <div className="text-xs text-yellow-200 font-medium">Outstanding</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.tab)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group ${
                    activeTab === item.tab
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-purple-800'
                  }`}
                >
                  <item.icon className={`h-4 w-4 mr-3 transition-colors ${
                    activeTab === item.tab ? 'text-white' : 'text-gray-400 group-hover:text-white'
                  }`} />
                  {item.name}
                </button>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="px-4 py-4 border-b border-purple-700 space-y-2">
              <button 
                onClick={generateTestData}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate Test Data
              </button>
              <button 
                onClick={() => {
                  setDeleteMode('bulk')
                  setShowDeleteConfirm(true)
                }}
                disabled={selectedConsultations.length === 0}
                className="w-full flex items-center justify-center px-4 py-3 bg-orange-600 text-white text-sm font-semibold rounded-xl hover:bg-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Selected ({selectedConsultations.length})
              </button>
              <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-all duration-200">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4">
              <div className="flex items-center space-x-3 p-3 bg-purple-800 rounded-xl">
                <div className="bg-green-500 p-2 rounded-full">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">Admin User</p>
                  <p className="text-xs text-gray-300">admin@atarwebb.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 p-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Settings className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">AtarWebb Admin</h1>
              <button 
                onClick={handleRefresh}
                disabled={loading}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Tab Content */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-10 lg:p-12 xl:p-16">
              {/* Dashboard Overview Header */}
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 via-purple-100/50 to-pink-100/50 rounded-2xl"></div>
                <div className="relative p-8 lg:p-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                          Welcome to AtarWebb Admin
                        </h2>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-green-600 font-medium">Live</span>
                        </div>
                      </div>
                      <p className="text-lg text-gray-600">
                        Manage your business operations and track performance
                      </p>
                    </div>
                    <div className="hidden lg:flex items-center space-x-4">
                      <div className="text-right mr-4">
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {lastUpdated.toLocaleTimeString()}
                        </p>
                      </div>
                      <button 
                        onClick={handleRefresh}
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RefreshCw className={`h-4 w-4 inline mr-2 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Loading...' : 'Refresh'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-200 group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">Pending Requests</p>
                      <p className="text-4xl font-bold text-blue-900 mt-2 group-hover:scale-105 transition-transform duration-200">
                        {loading ? '...' : stats.pendingRequests}
                      </p>
                      <p className="text-blue-600 text-sm mt-1">Awaiting your decision</p>
                      <div className="mt-2 text-xs text-blue-500">
                        {stats.totalConsultations} total consultations
                      </div>
                    </div>
                    <div className="bg-blue-500 p-3 rounded-xl group-hover:bg-blue-600 transition-colors duration-200">
                      <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200 shadow-lg hover:shadow-xl transition-all duration-200 group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-semibold uppercase tracking-wide">Active Projects</p>
                      <p className="text-4xl font-bold text-green-900 mt-2 group-hover:scale-105 transition-transform duration-200">
                        {loading ? '...' : stats.activeProjects}
                      </p>
                      <p className="text-green-600 text-sm mt-1">Currently in progress</p>
                      <div className="mt-2 text-xs text-green-500">
                        {stats.completedProjects} completed
                      </div>
                    </div>
                    <div className="bg-green-500 p-3 rounded-xl group-hover:bg-green-600 transition-colors duration-200">
                      <Briefcase className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-200 group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-semibold uppercase tracking-wide">Total Revenue</p>
                      <p className="text-4xl font-bold text-purple-900 mt-2 group-hover:scale-105 transition-transform duration-200">
                        {loading ? '...' : `$${stats.totalRevenue.toLocaleString()}`}
                      </p>
                      <p className="text-purple-600 text-sm mt-1">All time</p>
                      <div className="mt-2 text-xs text-purple-500">
                        ${stats.thisMonthRevenue.toLocaleString()} this month
                      </div>
                    </div>
                    <div className="bg-purple-500 p-3 rounded-xl group-hover:bg-purple-600 transition-colors duration-200">
                      <DollarSign className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl border border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-200 group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-600 text-sm font-semibold uppercase tracking-wide">Outstanding</p>
                      <p className="text-4xl font-bold text-yellow-900 mt-2 group-hover:scale-105 transition-transform duration-200">
                        {loading ? '...' : `$${stats.outstandingAmount.toLocaleString()}`}
                      </p>
                      <p className="text-yellow-600 text-sm mt-1">Pending payments</p>
                      <div className="mt-2 text-xs text-yellow-500">
                        {stats.totalInvoices} total invoices
                      </div>
                    </div>
                    <div className="bg-yellow-500 p-3 rounded-xl group-hover:bg-yellow-600 transition-colors duration-200">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-gray-900">Recent Project Requests</h3>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('requests')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                    >
                      View All ({consultations.length})
                    </button>
                  </div>
                  <div className="space-y-4">
                    {consultations.slice(0, 3).map((consultation) => (
                      <div key={consultation.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 group">
                        <div className="flex items-center space-x-4">
                          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{consultation.name}</p>
                            <p className="text-sm text-gray-600">{consultation.company}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(consultation.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(consultation.status)}`}>
                          {consultation.status}
                        </span>
                      </div>
                    ))}
                    {consultations.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No consultation requests yet</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-gray-900">Active Projects</h3>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('analytics')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                    >
                      View All ({projects.length})
                    </button>
                  </div>
                  <div className="space-y-4">
                    {projects.slice(0, 3).map((project) => (
                      <div key={project.id} className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-br from-green-500 to-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
                              <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{project.name}</p>
                              <p className="text-sm text-gray-600">{project.client}</p>
                              <p className="text-xs text-gray-500">
                                Due: {new Date(project.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-3 mr-3">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{project.progress}%</span>
                        </div>
                      </div>
                    ))}
                    {projects.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Briefcase className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No active projects yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Project Requests Tab */}
          {activeTab === 'requests' && (
            <div className="p-6 lg:p-8 xl:p-10 max-h-screen overflow-y-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Project Requests</h2>
                  <p className="text-base text-gray-600 mt-1">Manage consultation requests and make decisions</p>
                </div>
                <div className="flex space-x-3">
                  <button className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl text-sm">
                    <Filter className="h-4 w-4 inline mr-2" />
                    Filter
                  </button>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <h3 className="text-lg font-bold text-gray-900">All Consultation Requests</h3>
                  <p className="text-sm text-gray-600 mt-1">Review and manage incoming project requests</p>
                </div>
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                  <input
                                    type="checkbox"
                                    checked={selectedConsultations.length === consultations.length && consultations.length > 0}
                                    onChange={selectedConsultations.length === consultations.length ? deselectAllConsultations : selectAllConsultations}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client Information</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Project Details</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Preferred Time</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {consultations.map((consultation) => (
                        <tr key={consultation.id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200">
                          <td className="px-2 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedConsultations.includes(consultation.id)}
                              onChange={() => toggleConsultationSelection(consultation.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                                <User className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">{consultation.name}</div>
                                <div className="text-xs text-gray-600">{consultation.email}</div>
                                <div className="text-xs text-gray-500">{consultation.company}</div>
                                {consultation.phone && (
                                  <div className="text-xs text-gray-500">{consultation.phone}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="max-w-xs">
                              <div className="text-sm text-gray-900 mb-2">
                                {consultation.projectDetails || 'No details provided'}
                              </div>
                              {consultation.hasFileUpload && (
                                <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium">
                                  <Upload className="h-3 w-3 mr-1" />
                                  File attached
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {new Date(consultation.preferredDate).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-600">{consultation.preferredTime}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex px-4 py-2 text-xs font-bold rounded-full ${getStatusColor(consultation.status)}`}>
                              {consultation.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className={`w-2 h-2 rounded-full ${
                                  consultation.paymentStatus === 'deposit_paid' ? 'bg-green-500' :
                                  consultation.paymentStatus === 'fully_paid' ? 'bg-blue-500' :
                                  consultation.paymentStatus === 'failed' ? 'bg-red-500' :
                                  'bg-gray-400'
                                }`}></span>
                                <span className="text-sm font-medium text-gray-900">
                                  {consultation.paymentStatus === 'deposit_paid' ? 'Deposit Paid' :
                                   consultation.paymentStatus === 'fully_paid' ? 'Fully Paid' :
                                   consultation.paymentStatus === 'failed' ? 'Payment Failed' :
                                   'Pending Payment'}
                                </span>
                              </div>
                              {consultation.totalAmount && (
                                <div className="text-xs text-gray-500">
                                  ${consultation.totalAmount?.toLocaleString()}
                                  {consultation.depositAmount && (
                                    <span className="text-green-600"> (${consultation.depositAmount} paid)</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {consultation.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleAcceptConsultation(consultation.id)}
                                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleRejectConsultation(consultation.id)}
                                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                  Reject
                                </button>
                                <button 
                                  onClick={() => {
                                    setConsultationToDelete(consultation.id)
                                    setDeleteMode('single')
                                    setShowDeleteConfirm(true)
                                  }}
                                  className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                  <Trash className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                            {consultation.status === 'accepted' && consultation.paymentStatus === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleCompleteProject(consultation.id)}
                                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                  Complete Project
                                </button>
                                <button className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                                  <Eye className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                            {consultation.status === 'accepted' && consultation.paymentStatus === 'deposit_paid' && !consultation.completedAt && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleCompleteProject(consultation.id)}
                                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                  Complete Project
                                </button>
                                <button className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                                  <Eye className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                            {consultation.status === 'completed' && (
                              <div className="flex space-x-2">
                                <span className="text-green-600 text-xs font-semibold px-3 py-1 bg-green-100 rounded-lg">
                                  Project Completed
                                </span>
                                <button className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                                  <Eye className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                            {consultation.status !== 'pending' && consultation.paymentStatus !== 'deposit_paid' && (
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                    setConsultationToDelete(consultation.id)
                                    setDeleteMode('single')
                                    setShowDeleteConfirm(true)
                                  }}
                                  className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                  <Trash className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Analytics/Invoice Tab */}
          {activeTab === 'analytics' && (
            <div className="p-10 lg:p-12 xl:p-16">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Analytics & Invoices</h2>
                  <p className="text-lg text-gray-600 mt-2">Track revenue, manage invoices, and analyze performance</p>
                </div>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <Plus className="h-4 w-4 inline mr-2" />
                  Create Invoice
                </button>
              </div>

              {/* Pending Payments Section */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 mb-8 border border-yellow-200 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-3 rounded-xl">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Pending Payments</h3>
                      <p className="text-gray-600">Outstanding invoices and deposits awaiting payment</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-yellow-600">${stats.outstandingAmount.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Outstanding</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/80 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="font-semibold text-gray-900">Pending Deposits</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {consultations.filter(c => c.status === 'pending' && c.paymentStatus === 'pending').length}
                    </div>
                    <div className="text-sm text-gray-600">Awaiting payment</div>
                  </div>

                  <div className="bg-white/80 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="font-semibold text-gray-900">Sent Invoices</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {invoices.filter(i => i.status === 'sent').length}
                    </div>
                    <div className="text-sm text-gray-600">Awaiting payment</div>
                  </div>

                  <div className="bg-white/80 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="font-semibold text-gray-900">Overdue</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {invoices.filter(i => i.status === 'overdue').length}
                    </div>
                    <div className="text-sm text-gray-600">Past due date</div>
                  </div>
                </div>
              </div>

              {/* Revenue Chart Placeholder */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-12 mb-8 border border-indigo-200 shadow-xl">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <BarChart3 className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Revenue Analytics</h3>
                  <p className="text-gray-600 text-lg">Interactive charts and advanced analytics coming soon</p>
                  <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                    <p className="text-sm text-gray-700">Real-time revenue tracking, client analytics, and performance metrics will be available here.</p>
                  </div>
                </div>
              </div>

              {/* Invoice List */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <h3 className="text-xl font-bold text-gray-900">Recent Invoices</h3>
                  <p className="text-gray-600 mt-1">Manage and track all your invoices</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice #</th>
                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                                <FileText className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-lg font-bold text-gray-900">{invoice.id}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-lg font-semibold text-gray-900">{invoice.client}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-lg font-bold text-gray-900">${invoice.amount.toLocaleString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex px-4 py-2 text-xs font-bold rounded-full ${getStatusColor(invoice.status)}`}>
                              {invoice.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-700">
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-purple-600 hover:text-purple-800 p-2 rounded-lg hover:bg-purple-50 transition-colors">
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

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="p-10 lg:p-12 xl:p-16">
              <div className="mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Settings</h2>
                <p className="text-lg text-gray-600 mt-2">Configure your business settings and preferences</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">General Settings</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Company Name</label>
                      <input
                        type="text"
                        defaultValue="AtarWebb"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Email</label>
                      <input
                        type="email"
                        defaultValue="admin@atarwebb.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Phone</label>
                      <input
                        type="tel"
                        defaultValue="+1 (555) 123-4567"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-gradient-to-br from-green-500 to-blue-600 p-3 rounded-xl">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Business Settings</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Default Consultation Duration</label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                        <option>30 minutes</option>
                        <option>45 minutes</option>
                        <option>1 hour</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Business Hours</label>
                      <input
                        type="text"
                        defaultValue="9:00 AM - 5:00 PM CST"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Timezone</label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                        <option>Central Time (CST)</option>
                        <option>Eastern Time (EST)</option>
                        <option>Pacific Time (PST)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Save Settings
                </button>
              </div>
            </div>
          )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <Trash className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {deleteMode === 'bulk' ? 'Delete Selected Consultations' : 
                 'Delete Consultation'}
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              {deleteMode === 'bulk' ? 
                `Are you sure you want to delete ${selectedConsultations.length} selected consultations? This action cannot be undone.` :
                'Are you sure you want to delete this consultation? This action cannot be undone.'
              }
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setConsultationToDelete(null)
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteMode === 'bulk') {
                    handleBulkDelete()
                  } else if (consultationToDelete) {
                    handleDeleteConsultation(consultationToDelete)
                  }
                  setShowDeleteConfirm(false)
                  setConsultationToDelete(null)
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
