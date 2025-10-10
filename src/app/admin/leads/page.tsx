'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Eye, Phone, Mail } from 'lucide-react'
import LeadFormModal from '@/components/LeadFormModal'
import AdminLayout from '@/components/AdminLayout'

interface Lead {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
  title?: string
  source?: string
  status: 'NEW' | 'NOT_INTERESTED' | 'FOLLOW_UP' | 'QUALIFIED' | 'APPOINTMENT_BOOKED' | 'CLOSED_WON'
  score: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('/api/leads')
        if (response.ok) {
          const data = await response.json()
          // Only show leads with APPOINTMENT_BOOKED status
          const appointmentLeads = data.filter((lead: Lead) => lead.status === 'APPOINTMENT_BOOKED')
          setLeads(appointmentLeads)
        }
      } catch (error) {
        console.error('Error fetching leads:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeads()
  }, [])

  const handleSaveLead = (leadData: Lead) => {
    if (editingLead) {
      // Update existing lead
      setLeads(prev => prev.map(lead => 
        lead.id === editingLead.id 
          ? { ...leadData, id: editingLead.id, updatedAt: new Date().toISOString() }
          : lead
      ))
    } else {
      // Add new lead
      const newLead: Lead = {
        ...leadData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setLeads(prev => [newLead, ...prev])
    }
    setEditingLead(null)
    setShowAddModal(false)
  }

  const handleDeleteLead = (leadId: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      setLeads(prev => prev.filter(lead => lead.id !== leadId))
    }
  }

  // Fetch leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('/api/leads')
        if (response.ok) {
          const data = await response.json()
          // Only show leads with APPOINTMENT_BOOKED status
          const appointmentLeads = data.filter((lead: Lead) => lead.status === 'APPOINTMENT_BOOKED')
          setLeads(appointmentLeads)
        } else {
          console.error('Failed to fetch leads')
          // Fallback to empty array
          setLeads([])
        }
      } catch (error) {
        console.error('Error fetching leads:', error)
        setLeads([])
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
                          lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: Lead['status']) => {
    const statusClasses = {
      NEW: 'bg-red-100 text-red-800',
      NOT_INTERESTED: 'bg-yellow-100 text-yellow-800',
      FOLLOW_UP: 'bg-yellow-100 text-yellow-800',
      QUALIFIED: 'bg-blue-100 text-blue-800',
      APPOINTMENT_BOOKED: 'bg-green-100 text-green-800',
      CLOSED_WON: 'bg-emerald-100 text-emerald-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status.replace('_', ' ')}
      </span>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Leads...
      </div>
    )
  }

  return (
    <AdminLayout currentPage="leads">
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          Appointment Bookings
        </h1>

        {/* Appointment Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-400">{leads.length}</div>
            <div className="text-slate-400 text-sm">Total Appointments</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-400">
              {leads.filter(l => l.status === 'APPOINTMENT_BOOKED').length}
            </div>
            <div className="text-slate-400 text-sm">Booked Appointments</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {leads.filter(l => l.status === 'APPOINTMENT_BOOKED' && new Date(l.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
            </div>
            <div className="text-slate-400 text-sm">This Week</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-400">
              {leads.filter(l => l.status === 'CLOSED_WON').length}
            </div>
            <div className="text-slate-400 text-sm">Converted</div>
          </div>
        </div>

        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search appointments..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={() => { setEditingLead(null); setShowAddModal(true); }}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Appointment</span>
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="card overflow-x-auto mb-8">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Status</th>
                <th>Score</th>
                <th>Contact</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-slate-400">
                    No appointments booked yet.
                  </td>
                </tr>
              ) : (
                filteredLeads.map(lead => (
                  <tr key={lead.id}>
                    <td className="font-medium text-white">
                      {lead.firstName} {lead.lastName}
                    </td>
                    <td>{lead.company || 'N/A'}</td>
                    <td>
                      {getStatusBadge(lead.status)}
                    </td>
                    <td className={getScoreColor(lead.score)}>{lead.score}</td>
                    <td>
                      <div className="flex items-center space-x-2">
                        {lead.phone && (
                          <a href={`tel:${lead.phone}`} className="text-blue-400 hover:text-blue-300" title="Call">
                            <Phone className="h-4 w-4" />
                          </a>
                        )}
                        {lead.email && (
                          <a href={`mailto:${lead.email}`} className="text-cyan-400 hover:text-cyan-300" title="Email">
                            <Mail className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td>{new Date(lead.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingLead(lead)}
                          className="text-yellow-400 hover:text-yellow-300 p-1"
                          title="Edit Lead"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modals */}
        <LeadFormModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveLead}
        />
        
        <LeadFormModal
          isOpen={!!editingLead}
          onClose={() => setEditingLead(null)}
          onSave={handleSaveLead}
          lead={editingLead}
        />
      </div>
    </AdminLayout>
  )
}