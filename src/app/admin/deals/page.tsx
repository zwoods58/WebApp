'use client'

import { useState, useEffect } from 'react'
import { Plus, DollarSign, TrendingUp, Calendar, Target, Edit, Trash2, Eye } from 'lucide-react'
import DealFormModal from '@/components/DealFormModal'
import AdminLayout from '@/components/AdminLayout'

interface Deal {
  id: string
  title: string
  value: number
  stage: 'PROSPECT' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST'
  probability: number
  expectedCloseDate: string
  company: string
  contactPerson: string
  description?: string
  assignedTo: string
  createdAt: string
  updatedAt: string
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [stageFilter, setStageFilter] = useState('ALL')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)

  const handleSaveDeal = (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingDeal) {
      // Update existing deal
      setDeals(prev => prev.map(deal => 
        deal.id === editingDeal.id 
          ? { ...dealData, id: editingDeal.id, createdAt: deal.createdAt, updatedAt: new Date().toISOString() }
          : deal
      ))
    } else {
      // Add new deal
      const newDeal: Deal = {
        ...dealData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setDeals(prev => [newDeal, ...prev])
    }
    setEditingDeal(null)
    setShowAddModal(false)
  }

  const handleDeleteDeal = (dealId: string) => {
    if (confirm('Are you sure you want to delete this deal?')) {
      setDeals(prev => prev.filter(deal => deal.id !== dealId))
    }
  }

  // Mock data
  useEffect(() => {
    const mockDeals: Deal[] = [
      {
        id: '1',
        title: 'E-commerce Website Development',
        value: 25000,
        stage: 'PROPOSAL',
        probability: 75,
        expectedCloseDate: '2024-02-15',
        company: 'TechCorp Inc',
        contactPerson: 'John Smith',
        description: 'Full-stack e-commerce solution with payment integration',
        assignedTo: 'Sales Rep',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-15T14:00:00Z'
      },
      {
        id: '2',
        title: 'Mobile App Development',
        value: 45000,
        stage: 'NEGOTIATION',
        probability: 60,
        expectedCloseDate: '2024-02-28',
        company: 'StartupXYZ',
        contactPerson: 'Sarah Johnson',
        description: 'iOS and Android app for food delivery service',
        assignedTo: 'Sales Rep',
        createdAt: '2024-01-05T09:00:00Z',
        updatedAt: '2024-01-18T16:00:00Z'
      },
      {
        id: '3',
        title: 'SEO Optimization Package',
        value: 8000,
        stage: 'CLOSED_WON',
        probability: 100,
        expectedCloseDate: '2024-01-20',
        company: 'Local Business Co',
        contactPerson: 'Mike Davis',
        description: '6-month SEO optimization and content strategy',
        assignedTo: 'Sales Rep',
        createdAt: '2023-12-15T11:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z'
      },
      {
        id: '4',
        title: 'Web Application Redesign',
        value: 18000,
        stage: 'QUALIFIED',
        probability: 40,
        expectedCloseDate: '2024-03-10',
        company: 'Enterprise Solutions',
        contactPerson: 'Lisa Wilson',
        description: 'Complete UI/UX redesign of existing web application',
        assignedTo: 'Sales Rep',
        createdAt: '2024-01-12T13:00:00Z',
        updatedAt: '2024-01-12T13:00:00Z'
      },
      {
        id: '5',
        title: 'Cloud Migration Project',
        value: 35000,
        stage: 'CLOSED_LOST',
        probability: 0,
        expectedCloseDate: '2024-01-25',
        company: 'DataCorp',
        contactPerson: 'Robert Brown',
        description: 'Migration from on-premise to cloud infrastructure',
        assignedTo: 'Sales Rep',
        createdAt: '2023-12-20T15:00:00Z',
        updatedAt: '2024-01-25T12:00:00Z'
      }
    ]
    setDeals(mockDeals)
    setIsLoading(false)
  }, [])

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = searchTerm === '' ||
                          deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          deal.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStage = stageFilter === 'ALL' || deal.stage === stageFilter
    return matchesSearch && matchesStage
  })

  const getStageBadge = (stage: Deal['stage']) => {
    const stageClasses = {
      PROSPECT: 'bg-blue-100 text-blue-800',
      QUALIFIED: 'bg-green-100 text-green-800',
      PROPOSAL: 'bg-purple-100 text-purple-800',
      NEGOTIATION: 'bg-orange-100 text-orange-800',
      CLOSED_WON: 'bg-emerald-100 text-emerald-800',
      CLOSED_LOST: 'bg-red-100 text-red-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stageClasses[stage]}`}>
        {stage.replace('_', ' ')}
      </span>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getTotalValue = () => {
    return deals.reduce((sum, deal) => sum + deal.value, 0)
  }

  const getWonValue = () => {
    return deals
      .filter(deal => deal.stage === 'CLOSED_WON')
      .reduce((sum, deal) => sum + deal.value, 0)
  }

  const getPipelineValue = () => {
    return deals
      .filter(deal => !['CLOSED_WON', 'CLOSED_LOST'].includes(deal.stage))
      .reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Deals...
      </div>
    )
  }

  return (
    <AdminLayout currentPage="deals">
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          Deals Pipeline
        </h1>

        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search deals..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          </div>

          <div className="flex space-x-4">
            <select
              className="input w-48"
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
            >
              <option value="ALL">All Stages</option>
              <option value="PROSPECT">Prospect</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="PROPOSAL">Proposal</option>
              <option value="NEGOTIATION">Negotiation</option>
              <option value="CLOSED_WON">Closed Won</option>
              <option value="CLOSED_LOST">Closed Lost</option>
            </select>
            <button 
              onClick={() => { setEditingDeal(null); setShowAddModal(true); }}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Deal</span>
            </button>
          </div>
        </div>

        {/* Deals Table */}
        <div className="card overflow-x-auto mb-8">
          <table className="table">
            <thead>
              <tr>
                <th>Deal</th>
                <th>Company</th>
                <th>Value</th>
                <th>Stage</th>
                <th>Probability</th>
                <th>Expected Close</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-slate-400">
                    No deals found.
                  </td>
                </tr>
              ) : (
                filteredDeals.map(deal => (
                  <tr key={deal.id}>
                    <td>
                      <div>
                        <div className="font-medium text-white">{deal.title}</div>
                        <div className="text-sm text-slate-400">{deal.contactPerson}</div>
                      </div>
                    </td>
                    <td className="text-slate-300">{deal.company}</td>
                    <td className="font-medium text-green-400">{formatCurrency(deal.value)}</td>
                    <td>{getStageBadge(deal.stage)}</td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${deal.probability}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-300">{deal.probability}%</span>
                      </div>
                    </td>
                    <td className="text-slate-300">{new Date(deal.expectedCloseDate).toLocaleDateString()}</td>
                    <td className="text-slate-300">{deal.assignedTo}</td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingDeal(deal)}
                          className="text-yellow-400 hover:text-yellow-300 p-1"
                          title="Edit Deal"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDeal(deal.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Delete Deal"
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

        {/* Deal Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-400">{deals.length}</div>
            <div className="text-slate-400 text-sm">Total Deals</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-400">{formatCurrency(getTotalValue())}</div>
            <div className="text-slate-400 text-sm">Total Value</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-emerald-400">{formatCurrency(getWonValue())}</div>
            <div className="text-slate-400 text-sm">Won Value</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-400">{formatCurrency(getPipelineValue())}</div>
            <div className="text-slate-400 text-sm">Pipeline Value</div>
          </div>
        </div>

        {/* Modals */}
        <DealFormModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveDeal}
        />
        
        <DealFormModal
          isOpen={!!editingDeal}
          onClose={() => setEditingDeal(null)}
          onSave={handleSaveDeal}
          deal={editingDeal}
        />
      </div>
    </AdminLayout>
  )
}