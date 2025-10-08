'use client'

import { useState } from 'react'
import { 
  CheckCircle, 
  Clock, 
  DollarSign, 
  FileText, 
  CreditCard,
  Mail,
  Calendar,
  User,
  Building2,
  ArrowRight
} from 'lucide-react'
import StripeProvider from './StripeProvider'
import DepositPaymentModal from './DepositPaymentModal'
import FinalInvoiceModal from './FinalInvoiceModal'

interface Project {
  id: string
  name: string
  customer: {
    name: string
    email: string
    company: string
  }
  totalPrice: number
  depositAmount: number
  remainingAmount: number
  depositPaid: boolean
  finalInvoicePaid: boolean
  status: 'consultation' | 'deposit_pending' | 'in_progress' | 'completed' | 'final_invoice_pending' | 'finished'
  consultationDate: string
  startDate?: string
  completionDate?: string
  description: string
}

const mockProjects: Project[] = []

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showFinalInvoiceModal, setShowFinalInvoiceModal] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'consultation': return 'bg-blue-100 text-blue-800'
      case 'deposit_pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'final_invoice_pending': return 'bg-orange-100 text-orange-800'
      case 'finished': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'consultation': return 'Consultation Scheduled'
      case 'deposit_pending': return 'Deposit Pending'
      case 'in_progress': return 'In Progress'
      case 'completed': return 'Completed'
      case 'final_invoice_pending': return 'Final Invoice Pending'
      case 'finished': return 'Finished'
      default: return 'Unknown'
    }
  }

  const handleDepositPayment = (project: Project) => {
    setSelectedProject(project)
    setShowDepositModal(true)
  }

  const handleFinalInvoicePayment = (project: Project) => {
    setSelectedProject(project)
    setShowFinalInvoiceModal(true)
  }

  const handleDepositSuccess = (paymentIntent: any) => {
    if (selectedProject) {
      setProjects(prev => prev.map(project => 
        project.id === selectedProject.id 
          ? { ...project, depositPaid: true, status: 'in_progress' as const }
          : project
      ))
    }
    setShowDepositModal(false)
    setSelectedProject(null)
  }

  const handleFinalInvoiceSuccess = (paymentIntent: any) => {
    if (selectedProject) {
      setProjects(prev => prev.map(project => 
        project.id === selectedProject.id 
          ? { ...project, finalInvoicePaid: true, status: 'finished' as const }
          : project
      ))
    }
    setShowFinalInvoiceModal(false)
    setSelectedProject(null)
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600 mt-2">Manage client projects and payments</p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl shadow-lg p-6">
              {/* Project Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-500">#{project.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
              </div>

              {/* Customer Info */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                  <User className="h-4 w-4" />
                  <span>{project.customer.name}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                  <Mail className="h-4 w-4" />
                  <span>{project.customer.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Building2 className="h-4 w-4" />
                  <span>{project.customer.company}</span>
                </div>
              </div>

              {/* Project Description */}
              <p className="text-sm text-gray-600 mb-4">{project.description}</p>

              {/* Pricing */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total Price</span>
                  <span className="font-semibold">{formatAmount(project.totalPrice)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Deposit (50%)</span>
                  <span className={`text-sm ${project.depositPaid ? 'text-green-600' : 'text-gray-600'}`}>
                    {project.depositPaid ? '✓ Paid' : formatAmount(project.depositAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Remaining</span>
                  <span className={`text-sm ${project.finalInvoicePaid ? 'text-green-600' : 'text-gray-600'}`}>
                    {project.finalInvoicePaid ? '✓ Paid' : formatAmount(project.remainingAmount)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {!project.depositPaid && (
                  <button
                    onClick={() => handleDepositPayment(project)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Pay Deposit</span>
                  </button>
                )}
                
                {project.depositPaid && !project.finalInvoicePaid && project.status === 'completed' && (
                  <button
                    onClick={() => handleFinalInvoicePayment(project)}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Pay Final Invoice</span>
                  </button>
                )}

                {project.status === 'in_progress' && (
                  <button
                    onClick={() => {
                      // Mark as completed
                      setProjects(prev => prev.map(p => 
                        p.id === project.id 
                          ? { ...p, status: 'completed' as const, completionDate: new Date().toISOString().split('T')[0] }
                          : p
                      ))
                    }}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Mark as Completed</span>
                  </button>
                )}
              </div>

              {/* Project Timeline */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>Consultation: {new Date(project.consultationDate).toLocaleDateString()}</span>
                </div>
                {project.startDate && (
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                    <Clock className="h-3 w-3" />
                    <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                )}
                {project.completionDate && (
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>Completed: {new Date(project.completionDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deposit Payment Modal */}
      {selectedProject && (
        <StripeProvider>
          <DepositPaymentModal
            isOpen={showDepositModal}
            onClose={() => setShowDepositModal(false)}
            onSuccess={handleDepositSuccess}
            onError={(error) => console.error('Deposit payment error:', error)}
            service={{
              name: selectedProject.name,
              totalPrice: selectedProject.totalPrice,
              depositAmount: selectedProject.depositAmount,
              remainingAmount: selectedProject.remainingAmount
            }}
            customer={selectedProject.customer}
          />
        </StripeProvider>
      )}

      {/* Final Invoice Modal */}
      {selectedProject && (
        <StripeProvider>
          <FinalInvoiceModal
            isOpen={showFinalInvoiceModal}
            onClose={() => setShowFinalInvoiceModal(false)}
            onSuccess={handleFinalInvoiceSuccess}
            onError={(error) => console.error('Final invoice payment error:', error)}
            service={{
              name: selectedProject.name,
              totalPrice: selectedProject.totalPrice,
              depositAmount: selectedProject.depositAmount,
              remainingAmount: selectedProject.remainingAmount,
              projectId: selectedProject.id
            }}
            customer={selectedProject.customer}
          />
        </StripeProvider>
      )}
    </div>
  )
}
