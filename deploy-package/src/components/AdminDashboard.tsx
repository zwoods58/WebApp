'use client'

import { useState, useEffect } from 'react'
import { Users, Briefcase, MessageSquare, BarChart3, Plus, Search, Filter } from 'lucide-react'

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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [projectRequests, setProjectRequests] = useState<ProjectRequest[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
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
      
      setLoading(false)
    }, 1000)
  }, [])

  const stats = [
    { label: 'Total Clients', value: clients.length, icon: Users, color: 'text-blue-600' },
    { label: 'Active Projects', value: projects.filter(p => p.status === 'in_progress').length, icon: Briefcase, color: 'text-green-600' },
    { label: 'New Requests', value: projectRequests.filter(r => r.status === 'new').length, icon: MessageSquare, color: 'text-orange-600' },
    { label: 'Completed Projects', value: projects.filter(p => p.status === 'completed').length, icon: BarChart3, color: 'text-purple-600' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-secondary-900">Admin Dashboard</h1>
            <button className="btn-primary flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-gray-100 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
          <div className="border-b border-secondary-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'requests', label: 'Project Requests' },
                { id: 'clients', label: 'Clients' },
                { id: 'projects', label: 'Projects' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
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
                <h2 className="text-lg font-semibold text-secondary-900">Recent Activity</h2>
                <div className="space-y-4">
                  {projectRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                      <div>
                        <p className="font-medium text-secondary-900">{request.name}</p>
                        <p className="text-sm text-secondary-600">{request.project_type}</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                        {request.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Requests Tab */}
            {activeTab === 'requests' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-secondary-900">Project Requests</h2>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
                      <input
                        type="text"
                        placeholder="Search requests..."
                        className="pl-10 pr-4 py-2 border border-secondary-300 rounded-lg text-sm"
                      />
                    </div>
                    <button className="btn-secondary flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-secondary-200">
                    <thead className="bg-secondary-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                          Project Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-secondary-200">
                      {projectRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-secondary-900">{request.name}</div>
                            <div className="text-sm text-secondary-500">{request.company}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                            {request.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                            {request.project_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              request.status === 'new' ? 'bg-orange-100 text-orange-800' :
                              request.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                              request.status === 'quoted' ? 'bg-yellow-100 text-yellow-800' :
                              request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                            {new Date(request.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-primary-600 hover:text-primary-900 mr-3">
                              View
                            </button>
                            <button className="text-secondary-600 hover:text-secondary-900">
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

            {/* Clients Tab */}
            {activeTab === 'clients' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-secondary-900">Clients</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clients.map((client) => (
                    <div key={client.id} className="card">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-secondary-900">{client.name}</p>
                          <p className="text-sm text-secondary-600">{client.email}</p>
                          <p className="text-sm text-secondary-500">{client.company}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-secondary-900">Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <div key={project.id} className="card">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-secondary-900">{project.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          project.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                          project.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          project.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-600">
                        Started: {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
