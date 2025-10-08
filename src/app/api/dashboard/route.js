import { NextResponse } from 'next/server'
const { getConsultations } = require('../../../lib/consultations-storage')

export async function GET() {
  try {
    // Get real consultations
    const consultations = getConsultations()
    
    // Generate projects based on accepted consultations
    const acceptedConsultations = consultations.filter(c => c.status === 'accepted')
    const projects = acceptedConsultations.map((consultation, index) => ({
      id: `PROJ-${index + 1}`,
      name: consultation.projectDetails || `Project for ${consultation.name}`,
      client: consultation.name,
      status: index % 3 === 0 ? 'completed' : index % 3 === 1 ? 'in_progress' : 'planning',
      priority: index % 3 === 0 ? 'high' : index % 3 === 1 ? 'medium' : 'low',
      dueDate: new Date(Date.now() + (30 + index * 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: index % 3 === 0 ? 100 : index % 3 === 1 ? 65 : 20,
      budget: 1000 + (index * 500),
      createdAt: consultation.createdAt
    }))

    // Generate invoices based on projects
    const invoices = projects.map((project, index) => ({
      id: `INV-${String(index + 1).padStart(3, '0')}`,
      client: project.client,
      amount: project.budget,
      status: project.status === 'completed' ? 'paid' : project.status === 'in_progress' ? 'sent' : 'draft',
      dueDate: project.dueDate,
      createdAt: project.createdAt
    }))

    // Calculate comprehensive stats
    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    const thisMonthInvoices = invoices.filter(i => {
      const invoiceDate = new Date(i.createdAt)
      return invoiceDate >= thisMonth && invoiceDate <= thisMonthEnd
    })
    
    const lastMonthInvoices = invoices.filter(i => {
      const invoiceDate = new Date(i.createdAt)
      return invoiceDate >= lastMonth && invoiceDate < thisMonth
    })

    const stats = {
      pendingRequests: consultations.filter(c => c.status === 'pending').length,
      activeProjects: projects.filter(p => p.status === 'in_progress').length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      totalRevenue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
      outstandingAmount: invoices.filter(i => i.status === 'sent').reduce((sum, i) => sum + i.amount, 0),
      thisMonthRevenue: thisMonthInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
      lastMonthRevenue: lastMonthInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
      totalConsultations: consultations.length,
      totalProjects: projects.length,
      totalInvoices: invoices.length,
      acceptedConsultations: consultations.filter(c => c.status === 'accepted').length,
      rejectedConsultations: consultations.filter(c => c.status === 'rejected').length
    }

    return NextResponse.json({
      success: true,
      data: {
        consultations,
        projects,
        invoices,
        stats
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
