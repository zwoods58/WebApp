'use client'

import { useState, useEffect } from 'react'
import { Plus, Phone, Calendar, Target, Edit, Trash2, Eye, Filter, Clock, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'
import CallLogModal from '@/components/CallLogModal'
import AppointmentModal from '@/components/AppointmentModal'
import NotesModal from '@/components/NotesModal'

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
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE'
  followUpDate?: string
  lastContactDate?: string
  notes?: string
  appointmentDate?: string
  appointmentType?: 'PHONE' | 'VIDEO' | 'IN_PERSON'
  score?: number
  userId: string
  createdAt: string
  updatedAt: string
}

interface CallLog {
  id: string
  leadId: string
  date: string
  duration: number
  outcome: 'INTERESTED' | 'NOT_INTERESTED' | 'CALLBACK' | 'VOICEMAIL' | 'NO_ANSWER' | 'WRONG_NUMBER'
  notes: string
  nextAction?: string
  nextFollowUpDate?: string
}

export default function OutboundPipeline() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [callLogs, setCallLogs] = useState<CallLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  const [showCallModal, setShowCallModal] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  // Fetch leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('/api/leads')
        if (response.ok) {
          const data = await response.json()
          // Filter leads assigned to current user (sales team)
          const userLeads = data.filter((lead: any) => lead.userId === '2')
          setLeads(userLeads)
        }
      } catch (error) {
        console.error('Error fetching leads:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchLeads()
  }, [])

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === '' ||
                          lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter
    const matchesPriority = priorityFilter === 'ALL' || lead.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'NEW':
        return 'bg-red-100 text-red-800'
      case 'NOT_INTERESTED':
        return 'bg-gray-100 text-gray-800'
      case 'FOLLOW_UP':
        return 'bg-yellow-100 text-yellow-800'
      case 'QUALIFIED':
        return 'bg-blue-100 text-blue-800'
      case 'APPOINTMENT_BOOKED':
        return 'bg-green-100 text-green-800'
      case 'CLOSED_WON':
        return 'bg-emerald-100 text-emerald-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: Lead['priority']) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'LOW':
        return 'bg-green-100 text-green-800'
      case 'NONE':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: Lead['status']) => {
    switch (status) {
      case 'NEW':
        return <AlertCircle className="h-4 w-4" />
      case 'NOT_INTERESTED':
        return <XCircle className="h-4 w-4" />
      case 'FOLLOW_UP':
        return <Clock className="h-4 w-4" />
      case 'QUALIFIED':
        return <Phone className="h-4 w-4" />
      case 'APPOINTMENT_BOOKED':
        return <Calendar className="h-4 w-4" />
      case 'CLOSED_WON':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const handleStatusChange = async (leadId: string, newStatus: Lead['status']) => {
    try {
      const response = await fetch(`/api/leads`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: newStatus })
      })
      
      if (response.ok) {
        setLeads(prev => prev.map(lead => 
          lead.id === leadId 
            ? { ...lead, status: newStatus, updatedAt: new Date().toISOString() }
            : lead
        ))
      }
    } catch (error) {
      console.error('Error updating lead status:', error)
    }
  }

  const handlePriorityChange = async (leadId: string, newPriority: Lead['priority']) => {
    try {
      const response = await fetch(`/api/leads`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, priority: newPriority })
      })
      
      if (response.ok) {
        setLeads(prev => prev.map(lead => 
          lead.id === leadId 
            ? { ...lead, priority: newPriority, updatedAt: new Date().toISOString() }
            : lead
        ))
      }
    } catch (error) {
      console.error('Error updating lead priority:', error)
    }
  }

  const handleCallClick = (lead: Lead) => {
    setSelectedLead(lead)
    setShowCallModal(true)
  }

  const handleAppointmentClick = (lead: Lead) => {
    setSelectedLead(lead)
    setShowAppointmentModal(true)
  }

  const handleNotesClick = (lead: Lead) => {
    setSelectedLead(lead)
    setShowNotesModal(true)
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
            ? { ...lead, notes, updatedAt: new Date().toISOString() }
            : lead
        ))

        // 2. Create/update task with the notes for admin visibility
        const taskResponse = await fetch('/api/tasks/sync-notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId: selectedLead!.id,
            leadName: `${selectedLead!.firstName} ${selectedLead!.lastName}`,
            notes: notes,
            assignedTo: '2' // Sales user ID
          })
        })

        if (!taskResponse.ok) {
          console.error('Failed to sync notes to task')
        }
      }
    } catch (error) {
      console.error('Error saving notes:', error)
    }
  }

  const handleCallSave = async (callData: any) => {
    try {
      // Here you would typically save to an API
      console.log('Call logged:', callData)
      // For now, just close the modal
      setShowCallModal(false)
    } catch (error) {
      console.error('Error saving call:', error)
    }
  }

  const handleAppointmentSave = async (appointmentData: any) => {
    try {
      // Update lead status to APPOINTMENT_BOOKED
      await handleStatusChange(selectedLead!.id, 'APPOINTMENT_BOOKED')
      
      // Send notification to admin
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'APPOINTMENT_BOOKED',
          title: 'New Appointment Booked!',
          message: `Sales rep booked an appointment with ${selectedLead!.firstName} ${selectedLead!.lastName}`,
          salesRepName: 'Sales Rep', // In real app, get from user context
          leadName: `${selectedLead!.firstName} ${selectedLead!.lastName}`,
          leadCompany: selectedLead!.company || 'Unknown Company',
          appointmentDate: appointmentData.appointmentDate,
          appointmentType: appointmentData.appointmentType
        })
      })
      
      // Update lead with appointment details
      setLeads(prev => prev.map(lead => 
        lead.id === selectedLead!.id 
          ? { 
              ...lead, 
              status: 'APPOINTMENT_BOOKED',
              appointmentDate: appointmentData.appointmentDate,
              appointmentType: appointmentData.appointmentType,
              updatedAt: new Date().toISOString()
            }
          : lead
      ))
      
      setShowAppointmentModal(false)
    } catch (error) {
      console.error('Error saving appointment:', error)
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
    <AdminLayout currentPage="outbound">
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          Outbound Pipeline
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-red-400">
              {leads.filter(l => l.status === 'NEW').length}
            </div>
            <div className="text-slate-400 text-sm">New Leads</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {leads.filter(l => ['QUALIFIED', 'FOLLOW_UP'].includes(l.status)).length}
            </div>
            <div className="text-slate-400 text-sm">In Progress</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-400">
              {leads.filter(l => l.status === 'APPOINTMENT_BOOKED').length}
            </div>
            <div className="text-slate-400 text-sm">Appointments Booked</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-400">
              {leads.filter(l => l.status === 'CLOSED_WON').length}
            </div>
            <div className="text-slate-400 text-sm">Closed Won</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search leads..."
                className="input w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <select
                className="input w-48"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="NEW">New Lead</option>
                <option value="NOT_INTERESTED">Not Interested</option>
                <option value="FOLLOW_UP">Follow-up</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="APPOINTMENT_BOOKED">Appointment Booked</option>
                <option value="CLOSED_WON">Closed Won</option>
              </select>
              <select
                className="input w-32"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="ALL">All Priority</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
                <option value="NONE">None</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leads Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLeads.length === 0 ? (
            <div className="col-span-full card text-center py-12">
              <div className="text-slate-400 mb-4">
                <Target className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg">No leads found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            </div>
          ) : (
            filteredLeads.map(lead => (
              <div 
                key={lead.id} 
                className="card cursor-pointer hover:bg-slate-800/70 transition-all duration-200 relative"
                onClick={() => handleNotesClick(lead)}
                title="Click to add/view notes"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      {lead.firstName} {lead.lastName}
                      <FileText className="h-4 w-4 text-purple-400" />
                    </h3>
                    <p className="text-slate-300">{lead.company}</p>
                  </div>
                  <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleCallClick(lead)}
                      className="text-blue-400 hover:text-blue-300 p-1"
                      title="Log Call"
                    >
                      <Phone className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleAppointmentClick(lead)}
                      className="text-green-400 hover:text-green-300 p-1"
                      title="Book Appointment"
                    >
                      <Calendar className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                      className={`input text-sm ${getStatusColor(lead.status)}`}
                    >
                      <option value="NEW">New Lead</option>
                      <option value="NOT_INTERESTED">Not Interested</option>
                      <option value="FOLLOW_UP">Follow-up</option>
                      <option value="QUALIFIED">Qualified</option>
                      <option value="APPOINTMENT_BOOKED">Appointment Booked</option>
                      <option value="CLOSED_WON">Closed Won</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                    <select
                      value={lead.priority}
                      onChange={(e) => handlePriorityChange(lead.id, e.target.value as Lead['priority'])}
                      className={`input text-sm ${getPriorityColor(lead.priority)}`}
                    >
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                      <option value="NONE">None</option>
                    </select>
                  </div>

                  {/* Contact Info */}
                  <div className="text-sm text-slate-300">
                    {lead.email && <div>📧 {lead.email}</div>}
                    {lead.phone && <div>📞 {lead.phone}</div>}
                    {lead.website && <div>🌐 <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">{lead.website}</a></div>}
                  </div>

                  {/* Additional Info */}
                  <div className="text-sm text-slate-400">
                    {lead.industry && <div>🏢 {lead.industry}</div>}
                    {lead.source && <div>📍 Source: {lead.source}</div>}
                    {lead.city && lead.state && <div>📍 {lead.city}, {lead.state}</div>}
                  </div>

                  {/* Follow-up Date */}
                  {lead.followUpDate && (
                    <div className="text-sm text-slate-400">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Follow-up: {new Date(lead.followUpDate).toLocaleDateString()}
                    </div>
                  )}

                  {/* Appointment Date */}
                  {lead.appointmentDate && (
                    <div className="text-sm text-green-400">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Appointment: {new Date(lead.appointmentDate).toLocaleDateString()}
                    </div>
                  )}

                  {/* Notes */}
                  {lead.notes && (
                    <div className="text-sm text-slate-400 bg-slate-700/30 p-2 rounded">
                      {lead.notes}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modals */}
        <NotesModal
          isOpen={showNotesModal}
          onClose={() => setShowNotesModal(false)}
          leadId={selectedLead?.id || ''}
          leadName={selectedLead ? `${selectedLead.firstName} ${selectedLead.lastName}` : ''}
          initialNotes={selectedLead?.notes || ''}
          onSave={handleNotesSave}
        />

        <CallLogModal
          isOpen={showCallModal}
          onClose={() => setShowCallModal(false)}
          onSave={handleCallSave}
          lead={selectedLead}
        />

        <AppointmentModal
          isOpen={showAppointmentModal}
          onClose={() => setShowAppointmentModal(false)}
          onSave={handleAppointmentSave}
          lead={selectedLead}
        />
      </div>
    </AdminLayout>
  )
}
