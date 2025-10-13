'use client'

import { useState, useEffect } from 'react'
import FlexibleLeadsTable from '@/components/FlexibleLeadsTable'
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

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('/api/leads')
        if (response.ok) {
          const data = await response.json()
          setLeads(data) // Show all leads, not just appointments
        } else {
          console.error('Failed to fetch leads')
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

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(prev => prev.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ))
  }

  const handleDeleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== leadId))
  }

  if (isLoading) {
    return (
      <AdminLayout currentPage="leads">
        <div className="min-h-screen flex items-center justify-center text-white">
          Loading Leads...
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout currentPage="leads">
      <div className="p-8">
        <FlexibleLeadsTable
          leads={leads}
          onUpdateLead={handleUpdateLead}
          onDeleteLead={handleDeleteLead}
          showAllLeads={true}
          title="All Leads"
          description="Manage all your leads and track their progress through the sales pipeline"
        />
      </div>
    </AdminLayout>
  )
}