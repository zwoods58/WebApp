'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Edit, Trash2, Eye, Phone, Mail, MoreHorizontal, Trash, MapPin, Building, Clock } from 'lucide-react'
import LeadFormModal from '@/components/LeadFormModal'
import ClearLeadsModal from '@/components/ClearLeadsModal'

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
  createdAt: string
  updatedAt: string
  [key: string]: any // Allow additional fields
}

interface FlexibleLeadsTableProps {
  leads: Lead[]
  onUpdateLead?: (lead: Lead) => void
  onDeleteLead?: (leadId: string) => void
  onClearAllLeads?: () => void
  showAllLeads?: boolean
  title?: string
  description?: string
}

export default function FlexibleLeadsTable({ 
  leads, 
  onUpdateLead, 
  onDeleteLead, 
  onClearAllLeads,
  showAllLeads = false,
  title = "Leads",
  description = "Manage your leads and track their progress"
}: FlexibleLeadsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [visibleColumns, setVisibleColumns] = useState<string[]>([])
  const [availableColumns, setAvailableColumns] = useState<string[]>([])
  const [showClearModal, setShowClearModal] = useState(false)

  // Get all possible columns from leads data
  useEffect(() => {
    if (leads.length > 0) {
      const allColumns = new Set<string>()
      leads.forEach(lead => {
        Object.keys(lead).forEach(key => {
          if (key !== 'id' && typeof lead[key] === 'string' || typeof lead[key] === 'number') {
            allColumns.add(key)
          }
        })
      })
      
      const columns = Array.from(allColumns)
      setAvailableColumns(columns)
      
      // Set default visible columns
      const defaultColumns = ['firstName', 'lastName', 'email', 'phone', 'company', 'status', 'score']
      const visible = defaultColumns.filter(col => columns.includes(col))
      setVisibleColumns(visible)
    }
  }, [leads])

  const handleSaveLead = (leadData: Lead) => {
    if (editingLead) {
      // Update existing lead
      const updatedLead = { ...leadData, id: editingLead.id, updatedAt: new Date().toISOString() }
      if (onUpdateLead) {
        onUpdateLead(updatedLead)
      }
    } else {
      // Add new lead
      const newLead: Lead = {
        ...leadData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      if (onUpdateLead) {
        onUpdateLead(newLead)
      }
    }
    setEditingLead(null)
    setShowAddModal(false)
  }

  const handleDeleteLead = (leadId: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      if (onDeleteLead) {
        onDeleteLead(leadId)
      }
    }
  }

  const handleClearAllLeads = async () => {
    if (onClearAllLeads) {
      await onClearAllLeads()
    }
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === '' ||
                          lead.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.phone?.includes(searchTerm)
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

  const formatColumnName = (column: string) => {
    return column
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' ')
  }

  const formatCellValue = (value: any, column: string) => {
    if (value === null || value === undefined || value === '') {
      return 'N/A'
    }
    
    if (column === 'status') {
      return getStatusBadge(value)
    }
    
    if (column === 'score') {
      return <span className={getScoreColor(value)}>{value}</span>
    }
    
    if (column === 'email' && value.includes('@')) {
      return (
        <a href={`mailto:${value}`} className="text-cyan-400 hover:text-cyan-300">
          {value}
        </a>
      )
    }
    
    if (column === 'phone' && value) {
      return (
        <a href={`tel:${value}`} className="text-blue-400 hover:text-blue-300">
          {value}
        </a>
      )
    }
    
    if (column === 'website' && value) {
      const url = value.startsWith('http') ? value : `https://${value}`
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
          {value}
        </a>
      )
    }
    
    if (column === 'createdAt' || column === 'updatedAt') {
      return new Date(value).toLocaleDateString()
    }
    
    return value.toString()
  }

  const toggleColumn = (column: string) => {
    setVisibleColumns(prev => 
      prev.includes(column) 
        ? prev.filter(col => col !== column)
        : [...prev, column]
    )
  }

  const getColumnIcon = (column: string) => {
    if (column === 'email') return <Mail className="h-4 w-4" />
    if (column === 'phone') return <Phone className="h-4 w-4" />
    if (column === 'website') return <Eye className="h-4 w-4" />
    if (column === 'address' || column === 'city' || column === 'state' || column === 'zipCode') return <MapPin className="h-4 w-4" />
    if (column === 'industry') return <Building className="h-4 w-4" />
    if (column === 'timeZone') return <Clock className="h-4 w-4" />
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          {title}
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-400">{leads.length}</div>
          <div className="text-slate-400 text-sm">Total Leads</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-400">
            {leads.filter(l => l.status === 'APPOINTMENT_BOOKED').length}
          </div>
          <div className="text-slate-400 text-sm">Appointments</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {leads.filter(l => l.status === 'QUALIFIED').length}
          </div>
          <div className="text-slate-400 text-sm">Qualified</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-400">
            {leads.filter(l => l.status === 'CLOSED_WON').length}
          </div>
          <div className="text-slate-400 text-sm">Converted</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search leads..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="APPOINTMENT_BOOKED">Appointment Booked</option>
            <option value="CLOSED_WON">Closed Won</option>
            <option value="NOT_INTERESTED">Not Interested</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => { setEditingLead(null); setShowAddModal(true); }}
            className="btn-primary flex items-center space-x-2"
          >
            <span>Add Lead</span>
          </button>
          {leads.length > 0 && onClearAllLeads && (
            <button 
              onClick={() => setShowClearModal(true)}
              className="btn-danger flex items-center space-x-2"
            >
              <Trash className="h-4 w-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Column Visibility Controls */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Visible Columns</h3>
        <div className="flex flex-wrap gap-2">
          {availableColumns.map(column => (
            <button
              key={column}
              onClick={() => toggleColumn(column)}
              className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${
                visibleColumns.includes(column)
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {getColumnIcon(column)}
              <span>{formatColumnName(column)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              {visibleColumns.map(column => (
                <th key={column} className="whitespace-nowrap">
                  {formatColumnName(column)}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + 1} className="text-center py-8 text-slate-400">
                  No leads found.
                </td>
              </tr>
            ) : (
              filteredLeads.map(lead => (
                <tr key={lead.id}>
                  {visibleColumns.map(column => (
                    <td key={column} className="whitespace-nowrap">
                      {formatCellValue(lead[column], column)}
                    </td>
                  ))}
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

      <ClearLeadsModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearAllLeads}
        leadCount={leads.length}
      />
    </div>
  )
}
