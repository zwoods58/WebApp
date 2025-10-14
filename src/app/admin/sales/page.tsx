'use client'

import { useState, useEffect } from 'react'
import { Plus, Users, TrendingUp, Calendar, Clock, Target, CheckCircle, DollarSign, FileText } from 'lucide-react'
import TaskFormModal from '@/components/TaskFormModal'
import NotesModal from '@/components/NotesModal'

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
  title?: string
  source?: string
  industry?: string
  website?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  timeZone?: string
  status: 'NEW' | 'NOT_INTERESTED' | 'FOLLOW_UP' | 'QUALIFIED' | 'APPOINTMENT_BOOKED' | 'CLOSED_WON'
  statusDetail?: string
  score: number
  notes?: string
  lastContact?: string
  userId: string
  createdAt: string
  updatedAt: string
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
  leadId?: string
  leadName?: string
  createdAt: string
  updatedAt: string
}

export default function SalesDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [activeTab, setActiveTab] = useState('leads')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Fetch leads
  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads')
      if (response.ok) {
        const data = await response.json()
        setLeads(data)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    }
  }

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  useEffect(() => {
    fetchLeads()
    fetchTasks()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchLeads()
      fetchTasks()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const handleStatusChange = async (leadId: string, newStatus: Lead['status']) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: leadId,
          status: newStatus,
          updatedAt: new Date().toISOString()
        })
      })

      if (response.ok) {
        setLeads(prev => prev.map(lead =>
          lead.id === leadId
            ? { ...lead, status: newStatus, updatedAt: new Date().toISOString() }
            : lead
        ))
        setSuccessMessage('Lead status updated successfully!')
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        setErrorMessage('Failed to update lead status')
      }
    } catch (error) {
      console.error('Error updating lead status:', error)
      setErrorMessage('Failed to update lead status')
    }
  }

  const handleNotesSave = async (notes: string) => {
    try {
      // 1. Update lead notes
      const response = await fetch(`/api/leads`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedLead!.id,
          notes
        })
      })

      if (response.ok) {
        setLeads(prev => prev.map(lead =>
          lead.id === selectedLead!.id
            ? { ...lead, notes }
            : lead
        ))
        
        // 2. Create/update task with notes
        await fetch('/api/tasks/sync-notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId: selectedLead!.id,
            leadName: `${selectedLead!.firstName} ${selectedLead!.lastName}`,
            notes
          })
        })
        
        // 3. Refresh tasks to show the new/updated task
        await fetchTasks()
        
        setShowNotesModal(false)
        setSuccessMessage('Notes saved successfully!')
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        setErrorMessage('Failed to save notes')
      }
    } catch (error) {
      console.error('Error saving notes:', error)
      setErrorMessage('Failed to save notes')
    }
  }

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      })

      if (response.ok) {
        const newTask = await response.json()
        setTasks(prev => [...prev, newTask])
        setShowTaskModal(false)
        setSuccessMessage('Task created successfully!')
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        setErrorMessage('Failed to create task')
      }
    } catch (error) {
      console.error('Error creating task:', error)
      setErrorMessage('Failed to create task')
    }
  }

  const handleClearAllLeads = async () => {
    try {
      const response = await fetch('/api/leads/clear-all', {
        method: 'DELETE'
      })

      if (response.ok) {
        setLeads([])
        setSuccessMessage('All leads cleared successfully!')
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        setErrorMessage('Failed to clear leads')
      }
    } catch (error) {
      console.error('Error clearing leads:', error)
      setErrorMessage('Failed to clear leads')
    }
  }

  const handleClearAllTasks = async () => {
    try {
      const response = await fetch('/api/tasks/clear-all', {
        method: 'DELETE'
      })

      if (response.ok) {
        setTasks([])
        setSuccessMessage('All tasks cleared successfully!')
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        setErrorMessage('Failed to clear tasks')
      }
    } catch (error) {
      console.error('Error clearing tasks:', error)
      setErrorMessage('Failed to clear tasks')
    }
  }

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800'
      case 'FOLLOW_UP': return 'bg-yellow-100 text-yellow-800'
      case 'QUALIFIED': return 'bg-green-100 text-green-800'
      case 'APPOINTMENT_BOOKED': return 'bg-purple-100 text-purple-800'
      case 'CLOSED_WON': return 'bg-emerald-100 text-emerald-800'
      case 'NOT_INTERESTED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'URGENT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTaskStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'OVERDUE': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const myLeads = leads.filter(lead => lead.userId === '2')
  // Show all leads in outbound pipeline, not just assigned to sales user
  const outboundLeads = leads.filter(lead => 
    lead.status !== 'CLOSED_WON' && 
    lead.status !== 'NOT_INTERESTED'
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Sales Dashboard</h1>
          <p className="text-slate-300 mt-2">Manage your leads and track your sales pipeline</p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-900/20 border border-green-500/30 text-green-400 rounded-lg">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 rounded-lg shadow-xl">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-300">Total Leads</p>
                <p className="text-2xl font-bold text-white">{myLeads.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 rounded-lg shadow-xl">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-300">Qualified</p>
                <p className="text-2xl font-bold text-white">
                  {myLeads.filter(lead => lead.status === 'QUALIFIED').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 rounded-lg shadow-xl">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-300">Appointments</p>
                <p className="text-2xl font-bold text-white">
                  {myLeads.filter(lead => lead.status === 'APPOINTMENT_BOOKED').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 rounded-lg shadow-xl">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-300">Closed Won</p>
                <p className="text-2xl font-bold text-white">
                  {myLeads.filter(lead => lead.status === 'CLOSED_WON').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('leads')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'leads'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
              }`}
            >
              My Leads ({myLeads.length})
            </button>
            <button
              onClick={() => setActiveTab('outbound')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'outbound'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
              }`}
            >
              Outbound Pipeline ({outboundLeads.length})
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
              }`}
            >
              Tasks ({tasks.length})
            </button>
          </nav>
        </div>

        {/* My Leads Tab */}
        {activeTab === 'leads' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg shadow-xl">
            <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-white">My Leads</h2>
              <button
                onClick={handleClearAllLeads}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Clear All Leads
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800/30 divide-y divide-slate-700">
                  {myLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-700/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {lead.firstName} {lead.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {lead.company || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {lead.email || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                          {lead.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {lead.score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedLead(lead)
                            setShowNotesModal(true)
                          }}
                          className="text-blue-400 hover:text-blue-300 mr-3 transition-colors"
                        >
                          Add Notes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Outbound Pipeline Tab */}
        {activeTab === 'outbound' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg shadow-xl">
            <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-white">Outbound Pipeline</h2>
              <button
                onClick={handleClearAllLeads}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Clear All Leads
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {['NEW', 'FOLLOW_UP', 'QUALIFIED', 'APPOINTMENT_BOOKED'].map((status) => {
                  // Map the expected statuses to actual statuses in the data
                  const statusMapping: { [key: string]: string[] } = {
                    'NEW': ['NEW', 'Email Sent', 'New Lead'],
                    'FOLLOW_UP': ['FOLLOW_UP', 'Follow-Up Sent', 'Follow Up'],
                    'QUALIFIED': ['QUALIFIED', 'Engaged', 'Qualified'],
                    'APPOINTMENT_BOOKED': ['APPOINTMENT_BOOKED', 'Appointment Booked', 'Meeting Scheduled']
                  }
                  
                  const matchingLeads = outboundLeads.filter(lead => 
                    statusMapping[status].includes(lead.status)
                  )
                  
                  return (
                  <div key={status} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                    <h3 className="text-sm font-medium text-slate-300 mb-4">
                      {status.replace('_', ' ')} ({matchingLeads.length})
                    </h3>
                    <div className="space-y-3">
                      {matchingLeads.map((lead) => (
                          <div key={lead.id} className="bg-slate-800/50 p-3 rounded border border-slate-600 hover:bg-slate-700/50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-sm font-medium text-white">
                                  {lead.firstName} {lead.lastName}
                                </p>
                                <p className="text-xs text-slate-400">{lead.company}</p>
                              </div>
                              <span className="text-xs text-slate-500">Score: {lead.score}</span>
                            </div>
                            
                            <div className="mb-3">
                              <select
                                value={lead.status}
                                onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                                className="w-full text-xs bg-slate-700 border border-slate-600 text-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="NEW">New</option>
                                <option value="FOLLOW_UP">Follow Up</option>
                                <option value="QUALIFIED">Qualified</option>
                                <option value="APPOINTMENT_BOOKED">Appointment Booked</option>
                                <option value="CLOSED_WON">Closed Won</option>
                                <option value="NOT_INTERESTED">Not Interested</option>
                              </select>
                            </div>
                            
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedLead(lead)
                                  setShowNotesModal(true)
                                }}
                                className="flex-1 text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded hover:bg-blue-600/30 transition-colors border border-blue-500/30"
                              >
                                Notes
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg shadow-xl">
            <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-white">Tasks</h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleClearAllTasks}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Clear All Tasks
                </button>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Lead</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800/30 divide-y divide-slate-700">
                  {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-700/30">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {task.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {task.description ? (
                          <p className="text-slate-300 text-sm mb-2">{task.description}</p>
                        ) : (
                          <span className="text-slate-500">No description</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTaskStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {task.leadName || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Notes Modal */}
      <NotesModal
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        onSave={handleNotesSave}
        initialNotes={selectedLead?.notes || ''}
        leadName={selectedLead ? `${selectedLead.firstName} ${selectedLead.lastName}` : ''}
        leadId={selectedLead?.id || ''}
      />

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSave={handleSaveTask}
      />
    </div>
  )
}
