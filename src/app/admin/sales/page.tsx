'use client'

import { useState, useEffect } from 'react'
import { Plus, Phone, Users, TrendingUp, Calendar, Clock, Target, CheckCircle, DollarSign } from 'lucide-react'
import CallLogModal from '@/components/CallLogModal'
import TaskFormModal from '@/components/TaskFormModal'

interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'SALES'
}

interface Lead {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
  status: 'NEW' | 'NOT_INTERESTED' | 'FOLLOW_UP' | 'QUALIFIED' | 'APPOINTMENT_BOOKED' | 'CLOSED_WON'
  score: number
  lastContact?: string
  userId: string
  createdAt: string
  updatedAt: string
}

interface Call {
  id: string
  leadId: string
  leadName: string
  phoneNumber: string
  outcome: string
  duration: number
  notes: string
  callTime: string
  nextAction?: string
  nextFollowUpDate?: string
  createdAt: string
}

interface Task {
  id: string
  title: string
  description?: string
  dueDate: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE'
  category: string
  assignedTo: string
  createdAt: string
  updatedAt: string
}

export default function SalesDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const [leads, setLeads] = useState<Lead[]>([])
  const [previousLeadCount, setPreviousLeadCount] = useState(0)
  const [showNewLeadsNotification, setShowNewLeadsNotification] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NEW' | 'NOT_INTERESTED' | 'FOLLOW_UP' | 'APPOINTMENT_BOOKED' | 'IN_PROGRESS'>('ALL')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showCallLogModal, setShowCallLogModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const [calls, setCalls] = useState<Call[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    // Check if user is logged in (only on client side)
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        setUser(user)
      }
    }
    setIsLoading(false)
  }, [])

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      console.log('Sales: Fetching tasks...')
      const response = await fetch('/api/tasks')
      console.log('Sales: Response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Sales: Fetched tasks:', data)
        setTasks(data)
      } else {
        console.error('Sales: Failed to fetch tasks, status:', response.status)
      }
    } catch (error) {
      console.error('Sales: Error fetching tasks:', error)
    }
  }

  // Fetch leads assigned to sales team
  const fetchLeads = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setIsRefreshing(true)
    }
    
    try {
      const response = await fetch('/api/leads')
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched leads from API:', data.length, 'leads')
        console.log('Lead IDs:', data.map((l: any) => l.id))
        // Filter leads assigned to sales team (userId: '2')
        const salesLeads = data.filter((lead: any) => lead.userId === '2')
        console.log('Sales leads after filtering:', salesLeads.length, 'leads')
        console.log('Sales lead IDs:', salesLeads.map((l: any) => l.id))
        
        // Check for new leads
        if (previousLeadCount > 0 && salesLeads.length > previousLeadCount) {
          const newLeadsCount = salesLeads.length - previousLeadCount
          setShowNewLeadsNotification(true)
          
          // Auto-hide notification after 5 seconds
          setTimeout(() => {
            setShowNewLeadsNotification(false)
          }, 5000)
        }
        
        setLeads(salesLeads)
        setPreviousLeadCount(salesLeads.length)
        setLastRefresh(new Date())
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      if (showRefreshIndicator) {
        setIsRefreshing(false)
      }
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchLeads()
    fetchTasks()
    
    // Set up polling for new leads every 30 seconds
    const interval = setInterval(fetchLeads, 30000)
    
    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/admin'
  }

  const handleStatusChange = async (leadId: string, newStatus: Lead['status']) => {
    console.log('Attempting to update lead:', leadId, 'to status:', newStatus)
    console.log('Current leads in state:', leads.map(l => ({ id: l.id, name: l.firstName + ' ' + l.lastName })))
    
    // Store the original status in case we need to revert
    const originalLead = leads.find(l => l.id === leadId)
    if (!originalLead) {
      console.error('Lead not found in state:', leadId)
      console.error('Available lead IDs:', leads.map(l => l.id))
      return
    }

    try {
      // Update the lead status in the local state immediately for better UX
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      )

      // Make API call to persist the change
      const response = await fetch('/api/leads/update-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadId, status: newStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update lead status')
      }

      console.log(`Updated lead ${leadId} status to ${newStatus}`)
      
    } catch (error) {
      console.error('Error updating lead status:', error)
      // Revert the change if there was an error
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId ? { ...lead, status: originalLead.status } : lead
        )
      )
      setErrorMessage('Failed to update lead status. Please try again.')
      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  // Filter leads based on status filter
  const getFilteredLeads = () => {
    if (statusFilter === 'ALL') {
      return leads
    }
    if (statusFilter === 'IN_PROGRESS') {
      return leads.filter(lead => ['NOT_INTERESTED', 'FOLLOW_UP', 'QUALIFIED'].includes(lead.status))
    }
    return leads.filter(lead => lead.status === statusFilter)
  }

  const getStatusBadge = (status: Lead['status']) => {
    const statusClasses = {
      NEW: 'bg-blue-100 text-blue-800',
      NOT_INTERESTED: 'bg-gray-100 text-gray-800',
      FOLLOW_UP: 'bg-yellow-100 text-yellow-800',
      QUALIFIED: 'bg-green-100 text-green-800',
      APPOINTMENT_BOOKED: 'bg-purple-100 text-purple-800',
      CLOSED_WON: 'bg-emerald-100 text-emerald-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status.replace('_', ' ')}
      </span>
    )
  }

  const getPriorityColor = (priority: Task['priority']) => {
    const priorityClasses = {
      LOW: 'text-slate-400',
      MEDIUM: 'text-yellow-400',
      HIGH: 'text-orange-400',
      URGENT: 'text-red-400'
    }
    return priorityClasses[priority]
  }

  const handleSaveCall = (callData: {
    leadId: string
    duration: number
    outcome: 'INTERESTED' | 'NOT_INTERESTED' | 'CALLBACK' | 'VOICEMAIL' | 'NO_ANSWER' | 'WRONG_NUMBER'
    notes: string
    nextAction?: string
    nextFollowUpDate?: string
  }) => {
    const lead = leads.find(l => l.id === callData.leadId)
    const newCall: Call = {
      id: Date.now().toString(),
      leadId: callData.leadId,
      leadName: lead ? `${lead.firstName} ${lead.lastName}` : 'Unknown',
      phoneNumber: lead?.phone || 'Unknown',
      duration: callData.duration,
      outcome: callData.outcome,
      notes: callData.notes,
      callTime: new Date().toISOString(),
      nextAction: callData.nextAction,
      nextFollowUpDate: callData.nextFollowUpDate,
      createdAt: new Date().toISOString()
    }
    setCalls(prev => [newCall, ...prev])
    setShowCallLogModal(false)
  }

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('Sales: Creating task with data:', taskData)
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      console.log('Sales: Response status:', response.status)
      if (response.ok) {
        const newTask = await response.json()
        console.log('Sales: Created task:', newTask)
        setTasks(prev => [newTask, ...prev])
        setShowTaskModal(false)
      } else {
        console.error('Sales: Failed to create task, status:', response.status)
        const errorData = await response.json()
        console.error('Sales: Error data:', errorData)
      }
    } catch (error) {
      console.error('Sales: Error creating task:', error)
    }
  }


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16">
                <img src="/Logo.png" alt="AtarWebb CRM" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Sales Dashboard</h1>
                <p className="text-slate-400 text-sm">Welcome back!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Refresh Status */}
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                {isRefreshing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                    <span>Refreshing...</span>
                  </div>
                ) : lastRefresh ? (
                  <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
                ) : null}
              </div>
              
              {/* Manual Refresh Button */}
              <button
                onClick={() => fetchLeads(true)}
                disabled={isRefreshing}
                className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
                title="Refresh leads"
              >
                <div className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <span>Refresh</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
            <div className="flex items-center justify-between">
              <span>{errorMessage}</span>
              <button 
                onClick={() => setErrorMessage(null)}
                className="text-red-400 hover:text-red-300 ml-4"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Import Info */}
        <div className="card mb-8 bg-green-900/20 border-green-500/30">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Your Assigned Leads</h3>
              <p className="text-slate-300">
                These leads have been imported by the admin and assigned to you for follow-up and management.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-slate-800/50 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'leads', label: 'Leads', icon: Users },
            { id: 'outbound', label: 'Outbound Pipeline', icon: Target },
            { id: 'calls', label: 'Calls', icon: Phone },
            { id: 'tasks', label: 'Tasks', icon: Calendar }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="card text-center">
                  <div className="text-2xl font-bold text-white">{leads.length}</div>
                  <div className="text-slate-400 text-sm">Total Leads</div>
                </div>
                <div className="card text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {leads.filter(l => l.status === 'CLOSED_WON').length}
                  </div>
                  <div className="text-slate-400 text-sm">Closed Won</div>
                </div>
                <div className="card text-center">
                  <div className="text-2xl font-bold text-blue-400">{calls.length}</div>
                  <div className="text-slate-400 text-sm">Calls Made</div>
                </div>
                <div className="card text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {tasks.filter(t => t.status === 'PENDING').length}
                  </div>
                  <div className="text-slate-400 text-sm">Pending Tasks</div>
                </div>
              </div>

              {/* Recent Leads */}
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Leads</h3>
                <div className="space-y-3">
                  {leads.slice(0, 3).map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div>
                        <div className="font-medium text-white">{lead.firstName} {lead.lastName}</div>   
                        <div className="text-sm text-slate-400">{lead.company}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(lead.status)}
                        <span className="text-sm text-slate-400">Score: {lead.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Tasks */}
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">Today's Tasks</h3>
                <div className="space-y-3">
                  {tasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <button className={`w-4 h-4 rounded border-2 flex items-center justify-center ${ 
                          task.status === 'COMPLETED'
                            ? 'bg-green-600 border-green-600'
                            : 'border-slate-400'
                        }`}>
                          {task.status === 'COMPLETED' && <CheckCircle className="h-3 w-3 text-white" />}
                        </button>
                        <div>
                          <div className="font-medium text-white">{task.title}</div>
                          <div className="text-sm text-slate-400">Due: {task.dueDate}</div>
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>        
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">My Leads</h3>
                <button className="btn-primary flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Lead</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Company</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Score</th>
                      <th>Last Contact</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id}>
                        <td>
                          <div className="font-medium text-white">
                            {lead.firstName} {lead.lastName}
                          </div>
                        </td>
                        <td className="text-slate-300">{lead.company}</td>
                        <td>
                          <div className="text-sm text-slate-300">
                            {lead.email && <div>{lead.email}</div>}
                            {lead.phone && <div>{lead.phone}</div>}
                          </div>
                        </td>
                        <td>{getStatusBadge(lead.status)}</td>
                        <td>
                          <span className="font-semibold text-white">{lead.score}</span>
                        </td>
                        <td className="text-slate-300">{lead.lastContact || new Date(lead.updatedAt).toLocaleDateString()}</td>
                        <td>
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-400 hover:text-blue-300 p-1">
                              <Phone className="h-4 w-4" />
                            </button>
                            <button className="text-yellow-400 hover:text-yellow-300 p-1">
                              <Users className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'outbound' && (
            <div className="space-y-6">
              {/* Outbound Pipeline Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setStatusFilter('NEW')}
                  className={`card text-center cursor-pointer transition-all duration-200 ${
                    statusFilter === 'NEW' ? 'ring-2 ring-red-400 bg-red-900/20' : 'hover:bg-slate-700/50'
                  }`}
                >
                  <div className="text-2xl font-bold text-red-400">
                    {leads.filter(l => l.status === 'NEW').length}
                  </div>
                  <div className="text-slate-400 text-sm">New Leads</div>
                </button>
                <button 
                  onClick={() => setStatusFilter('IN_PROGRESS')}
                  className={`card text-center cursor-pointer transition-all duration-200 ${
                    statusFilter === 'IN_PROGRESS' ? 'ring-2 ring-yellow-400 bg-yellow-900/20' : 'hover:bg-slate-700/50'
                  }`}
                >
                  <div className="text-2xl font-bold text-yellow-400">
                    {leads.filter(l => ['NOT_INTERESTED', 'FOLLOW_UP', 'QUALIFIED'].includes(l.status)).length}
                  </div>
                  <div className="text-slate-400 text-sm">In Progress</div>
                </button>
                <button 
                  onClick={() => setStatusFilter('APPOINTMENT_BOOKED')}
                  className={`card text-center cursor-pointer transition-all duration-200 ${
                    statusFilter === 'APPOINTMENT_BOOKED' ? 'ring-2 ring-green-400 bg-green-900/20' : 'hover:bg-slate-700/50'
                  }`}
                >
                  <div className="text-2xl font-bold text-green-400">
                    {leads.filter(l => l.status === 'APPOINTMENT_BOOKED').length}
                  </div>
                  <div className="text-slate-400 text-sm">Appointments</div>
                </button>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    statusFilter === 'ALL' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  All Leads
                </button>
                <button
                  onClick={() => setStatusFilter('NEW')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    statusFilter === 'NEW' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  New Leads ({leads.filter(l => l.status === 'NEW').length})
                </button>
                <button
                  onClick={() => setStatusFilter('NOT_INTERESTED')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    statusFilter === 'NOT_INTERESTED' 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Not Interested ({leads.filter(l => l.status === 'NOT_INTERESTED').length})
                </button>
                <button
                  onClick={() => setStatusFilter('FOLLOW_UP')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    statusFilter === 'FOLLOW_UP' 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Follow Up ({leads.filter(l => l.status === 'FOLLOW_UP').length})
                </button>
                <button
                  onClick={() => setStatusFilter('APPOINTMENT_BOOKED')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    statusFilter === 'APPOINTMENT_BOOKED' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Appointments ({leads.filter(l => l.status === 'APPOINTMENT_BOOKED').length})
                </button>
              </div>

              {/* Lead Pipeline Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {getFilteredLeads().length === 0 ? (
                  <div className="col-span-full card text-center py-8">
                    <Target className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-400">
                      {leads.length === 0 
                        ? 'No leads assigned to you yet' 
                        : `No leads found in ${statusFilter.toLowerCase().replace('_', ' ')} filter`
                      }
                    </p>
                    <p className="text-sm mt-2">
                      {leads.length === 0 
                        ? 'Contact your admin to get leads assigned.' 
                        : 'Try selecting a different filter or check back later.'
                      }
                    </p>
                  </div>
                ) : (
                  getFilteredLeads().map(lead => (
                    <div key={lead.id} className="card">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-white">
                            {lead.firstName} {lead.lastName}
                          </h4>
                          <p className="text-slate-300 text-sm">{lead.company}</p>
                        </div>
                        <div className="flex space-x-1">
                          <button className="text-blue-400 hover:text-blue-300 p-1" title="Call">
                            <Phone className="h-4 w-4" />
                          </button>
                          <button className="text-green-400 hover:text-green-300 p-1" title="Book Appointment">
                            <Calendar className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {/* Status */}
                        <div>
                          <select 
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                            className={`w-full px-2 py-1 rounded text-xs ${
                              lead.status === 'NEW' ? 'bg-red-100 text-red-800' :
                              lead.status === 'NOT_INTERESTED' ? 'bg-yellow-100 text-yellow-800' :
                              lead.status === 'FOLLOW_UP' ? 'bg-yellow-100 text-yellow-800' :
                              lead.status === 'QUALIFIED' ? 'bg-blue-100 text-blue-800' :
                              lead.status === 'APPOINTMENT_BOOKED' ? 'bg-green-100 text-green-800' :
                              lead.status === 'CLOSED_WON' ? 'bg-emerald-100 text-emerald-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <option value="NEW">New Lead</option>
                            <option value="NOT_INTERESTED">Not Interested</option>
                            <option value="FOLLOW_UP">Follow Up</option>
                            <option value="APPOINTMENT_BOOKED">Appointment Booked</option>
                          </select>
                        </div>

                        {/* Contact Info */}
                        <div className="text-xs text-slate-400">
                          {lead.email && <div>📧 {lead.email}</div>}
                          {lead.phone && <div>📞 {lead.phone}</div>}
                        </div>

                        {/* Last Contact */}
                        {lead.lastContact && (
                          <div className="text-xs text-slate-400">
                            Last: {lead.lastContact}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'calls' && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Call Log</h3>
                <button 
                  onClick={() => {
                    if (leads.length > 0) {
                      setSelectedLead(leads[0])
                      setShowCallLogModal(true)
                    } else {
                      alert('No leads available to log calls for')
                    }
                  }}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Log Call</span>
                </button>
              </div>
              <div className="space-y-4">
                {calls.map((call) => (
                  <div key={call.id} className="p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-white">{call.leadName}</div>
                      <div className="text-sm text-slate-400">{call.callTime}</div>
                    </div>
                    <div className="text-sm text-slate-300 mb-2">
                      {call.phoneNumber} • {call.outcome} • {Math.floor(call.duration / 60)}m {call.duration % 60}s
                    </div>
                    <div className="text-sm text-slate-400">{call.notes}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">My Tasks</h3>
                <button 
                  onClick={() => setShowTaskModal(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Task</span>
                </button>
              </div>
              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                    <p>No tasks yet</p>
                    <p className="text-sm mt-2">Click "Add Task" to create your first task</p>
                  </div>
                ) : (
                  tasks.map(task => (
                    <div key={task.id} className="p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">{task.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          task.priority === 'LOW' ? 'bg-slate-100 text-slate-800' :
                          task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          task.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-slate-300 text-sm mb-2">{task.description}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded ${
                          task.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Leads Notification */}
      {showNewLeadsNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-in">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="font-medium">New leads imported!</span>
          <button
            onClick={() => setShowNewLeadsNotification(false)}
            className="text-white hover:text-gray-200 ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Modals */}
      <CallLogModal
        isOpen={showCallLogModal}
        onClose={() => setShowCallLogModal(false)}
        onSave={handleSaveCall}
        lead={selectedLead}
      />
      
      <TaskFormModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSave={handleSaveTask}
      />
    </div>
  )
}