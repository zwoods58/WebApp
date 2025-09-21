'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Briefcase, 
  MessageSquare, 
  BarChart3, 
  Plus, 
  Search, 
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
  AlertCircle
} from 'lucide-react'

interface ProjectRequest {
  id: string
  name: string
  email: string
  company: string | null
  project_type: string
  status: string
  created_at: string
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
  client_id: string
  created_at: string
}

interface File {
  id: string
  filename: string
  original_filename: string
  file_size: number
  mime_type: string
  file_type: string
  created_at: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: string
  status: string
  created_at: string
}

interface Invoice {
  id: string
  invoice_number: string
  client_id: string
  amount: number
  status: string
  due_date: string
  created_at: string
}

export default function EnhancedAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [projectRequests, setProjectRequests] = useState<ProjectRequest[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setProjectRequests([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          company: 'Tech Corp',
          project_type: 'Custom Web Application',
          status: 'new',
          created_at: '2024-01-15'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          company: 'Startup Inc',
          project_type: 'E-commerce Platform',
          status: 'contacted',
          created_at: '2024-01-14'
        }
      ])
      
      setClients([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          company: 'Tech Corp',
          status: 'client',
          created_at: '2024-01-10'
        }
      ])
      
      setProjects([
        {
          id: '1',
          title: 'E-commerce Platform',
          status: 'in_progress',
          client_id: '1',
          created_at: '2024-01-12'
        }
      ])

      setFiles([
        {
          id: '1',
          filename: 'contract_tech_corp.pdf',
          original_filename: 'Tech Corp Contract.pdf',
          file_size: 245760,
          mime_type: 'application/pdf',
          file_type: 'contract',
          created_at: '2024-01-15'
        },
        {
          id: '2',
          filename: 'design_mockup.png',
          original_filename: 'Homepage Design.png',
          file_size: 1024000,
          mime_type: 'image/png',
          file_type: 'image',
          created_at: '2024-01-14'
        }
      ])

      setNotifications([
        {
          id: '1',
          title: 'New Project Request',
          message: 'John Doe submitted a new project request for Custom Web Application',
          type: 'project',
          status: 'unread',
          created_at: '2024-01-15'
        },
        {
          id: '2',
          title: 'Payment Received',
          message: 'Payment of $5,000 received from Tech Corp',
          type: 'payment',
          status: 'read',
          created_at: '2024-01-14'
        }
      ])

      setInvoices([
        {
          id: '1',
          invoice_number: 'INV-001',
          client_id: '1',
          amount: 5000,
          status: 'paid',
          due_date: '2024-01-20',
          created_at: '2024-01-10'
        }
      ])
      
      setLoading(false)
    }, 1000)
  }, [])

  const stats = [
    { label: 'Total Clients', value: clients.length, icon: Users, color: 'text-blue-600' },
    { label: 'Active Projects', value: projects.filter(p => p.status === 'in_progress').length, icon: Briefcase, color: 'text-green-600' },
    { label: 'New Requests', value: projectRequests.filter(r => r.status === 'new').length, icon: MessageSquare, color: 'text-orange-600' },
    { label: 'Unread Notifications', value: notifications.filter(n => n.status === 'unread').length, icon: Bell, color: 'text-purple-600' },
    { label: 'Total Revenue', value: `$${invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-600' },
    { label: 'Files Uploaded', value: files.length, icon: FileText, color: 'text-indigo-600' }
  ]

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-gray-100 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'requests', label: 'Project Requests' },
                { id: 'clients', label: 'Clients' },
                { id: 'projects', label: 'Projects' },
                { id: 'files', label: 'Files' },
                { id: 'notifications', label: 'Notifications' },
                { id: 'invoices', label: 'Invoices' },
                { id: 'communications', label: 'Communications' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <div className="space-y-4">
                  {projectRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{request.name}</p>
                        <p className="text-sm text-gray-600">{request.project_type}</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                        {request.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Files</h3>
                    <div className="space-y-2">
                      {files.slice(0, 3).map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{file.original_filename}</span>
                          </div>
                          <span className="text-xs text-gray-500">{formatFileSize(file.file_size)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h3>
                    <div className="space-y-2">
                      {notifications.slice(0, 3).map((notification) => (
                        <div key={notification.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-600">{notification.message}</p>
                          </div>
                          {notification.status === 'unread' && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Files Tab */}
            {activeTab === 'files' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">File Management</h2>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.map((file) => (
                    <div key={file.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <div className="flex space-x-2">
                          <button className="text-gray-400 hover:text-gray-600">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-medium text-gray-900 truncate">{file.original_filename}</h3>
                      <p className="text-sm text-gray-500">{formatFileSize(file.file_size)}</p>
                      <p className="text-xs text-gray-400 capitalize">{file.file_type}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                    Mark All Read
                  </button>
                </div>

                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 rounded-lg border ${
                      notification.status === 'unread' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{notification.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {notification.status === 'unread' && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                          <button className="text-gray-400 hover:text-gray-600">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Invoices Tab */}
            {activeTab === 'invoices' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Invoices</h2>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Invoice
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Invoice #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {invoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {invoice.invoice_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {clients.find(c => c.id === invoice.client_id)?.name || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${invoice.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                              invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                              invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {invoice.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(invoice.due_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              View
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Other tabs would go here... */}
          </div>
        </div>
      </div>
    </div>
  )
}
