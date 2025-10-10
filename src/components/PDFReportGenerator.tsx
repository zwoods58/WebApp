'use client'

import { useState, useRef } from 'react'
import { 
  Download, 
  FileText, 
  BarChart3, 
  Users, 
  DollarSign, 
  Calendar,
  Settings,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  Mail,
  Share2,
  X
} from 'lucide-react'
import PDFReportService, { ReportData } from '@/lib/pdf-service'

interface PDFReportGeneratorProps {
  isOpen: boolean
  onClose: () => void
  data?: Partial<ReportData>
}

const reportTemplates = [
  {
    id: 'analytics',
    name: 'Analytics Report',
    description: 'Website performance and user behavior metrics',
    icon: BarChart3,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'client',
    name: 'Client Report',
    description: 'Individual client project and billing summary',
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 'financial',
    name: 'Financial Report',
    description: 'Revenue, expenses, and profit analysis',
    icon: DollarSign,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'project',
    name: 'Project Report',
    description: 'Project status, timeline, and deliverables',
    icon: FileText,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    id: 'monthly',
    name: 'Monthly Summary',
    description: 'Comprehensive monthly business overview',
    icon: Calendar,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  }
]

export default function PDFReportGenerator({ isOpen, onClose, data }: PDFReportGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('analytics')
  const [customization, setCustomization] = useState({
    includeCharts: true,
    includeClientInfo: true,
    includeProjectDetails: true,
    includeFinancialData: true,
    includeTopPages: true,
    includeRevenueAnalysis: true,
    period: '30d',
    format: 'pdf'
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [previewMode, setPreviewMode] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const generateMockData = (template: string): ReportData => {
    const baseData: ReportData = {
      title: 'Business Analytics Report',
      subtitle: 'Comprehensive performance analysis',
      date: new Date().toLocaleDateString(),
      period: customization.period,
      company: {
        name: 'AtarWebb Solutions',
        address: '123 Business St, San Francisco, CA 94105',
        phone: '+1 (555) 123-4567',
        email: 'admin@atarwebb.com',
        website: 'https://atarwebb.com'
      },
      client: customization.includeClientInfo ? {
        name: 'John Smith',
        company: 'TechCorp Inc.',
        email: 'john@techcorp.com',
        phone: '+1 (555) 987-6543'
      } : undefined,
      summary: {
        totalRevenue: Math.floor(Math.random() * 100000) + 50000,
        totalProjects: Math.floor(Math.random() * 20) + 10,
        completedProjects: Math.floor(Math.random() * 15) + 8,
        activeClients: Math.floor(Math.random() * 25) + 15,
        newClients: Math.floor(Math.random() * 10) + 3
      },
      metrics: {
        pageViews: Math.floor(Math.random() * 50000) + 25000,
        uniqueVisitors: Math.floor(Math.random() * 10000) + 5000,
        conversionRate: Math.floor(Math.random() * 5) + 2,
        bounceRate: Math.floor(Math.random() * 30) + 20,
        avgSessionDuration: Math.floor(Math.random() * 300) + 120
      },
      projects: Array.from({ length: 8 }, (_, i) => ({
        name: `Project ${i + 1}`,
        status: ['Active', 'Completed', 'On Hold', 'Planning'][Math.floor(Math.random() * 4)],
        startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        budget: Math.floor(Math.random() * 50000) + 10000,
        progress: Math.floor(Math.random() * 100)
      })),
      clients: Array.from({ length: 8 }, (_, i) => ({
        name: `Client ${i + 1}`,
        company: `Company ${i + 1}`,
        email: `client${i + 1}@company.com`,
        status: ['Active', 'Inactive', 'Lead'][Math.floor(Math.random() * 3)],
        joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        totalSpent: Math.floor(Math.random() * 100000) + 5000
      })),
      topPages: [
        { page: '/', views: 2450, bounceRate: '45%' },
        { page: '/services', views: 1890, bounceRate: '38%' },
        { page: '/portfolio', views: 1560, bounceRate: '52%' },
        { page: '/about', views: 980, bounceRate: '41%' },
        { page: '/contact', views: 720, bounceRate: '28%' }
      ],
      revenue: Array.from({ length: 12 }, (_, i) => {
        const month = new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' })
        const revenue = Math.floor(Math.random() * 30000) + 15000
        const expenses = Math.floor(Math.random() * 15000) + 8000
        return {
          month,
          revenue,
          expenses,
          profit: revenue - expenses
        }
      })
    }

    // Customize based on template
    switch (template) {
      case 'client':
        baseData.title = 'Client Project Report'
        baseData.subtitle = 'Individual client project summary'
        break
      case 'financial':
        baseData.title = 'Financial Analysis Report'
        baseData.subtitle = 'Revenue and expense breakdown'
        break
      case 'project':
        baseData.title = 'Project Status Report'
        baseData.subtitle = 'Current project overview and timeline'
        break
      case 'monthly':
        baseData.title = 'Monthly Business Report'
        baseData.subtitle = 'Comprehensive monthly overview'
        break
    }

    return baseData
  }

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    setGenerationStatus('idle')
    setErrorMessage('')

    try {
      const reportData = generateMockData(selectedTemplate)
      const pdfService = new PDFReportService()
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const filename = `${selectedTemplate}-report-${new Date().toISOString().split('T')[0]}.pdf`
      pdfService.downloadReport(reportData, filename)
      
      setGenerationStatus('success')
      setTimeout(() => {
        setGenerationStatus('idle')
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Error generating PDF:', error)
      setGenerationStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to generate PDF')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePreview = () => {
    setPreviewMode(!previewMode)
  }

  const handleEmailReport = async () => {
    // This would integrate with your email service
    console.log('Emailing report...')
  }

  const handleShareReport = () => {
    // This would generate a shareable link
    console.log('Sharing report...')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Generate PDF Report</h3>
              <p className="text-gray-600 text-sm">Create professional reports for your business</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {!previewMode ? (
            <div className="space-y-8">
              {/* Template Selection */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Report Template</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reportTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <div className={`p-2 rounded-lg ${template.bgColor} mr-3`}>
                          <template.icon className={`h-5 w-5 ${template.color}`} />
                        </div>
                        <span className="font-medium text-gray-900">{template.name}</span>
                      </div>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customization Options */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Customize Report</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                      <select
                        value={customization.period}
                        onChange={(e) => setCustomization(prev => ({ ...prev, period: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="1y">Last year</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Report Format</label>
                      <select
                        value={customization.format}
                        onChange={(e) => setCustomization(prev => ({ ...prev, format: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="pdf">PDF Document</option>
                        <option value="excel">Excel Spreadsheet</option>
                        <option value="csv">CSV Data</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-900">Include Sections</h5>
                    {[
                      { key: 'includeCharts', label: 'Charts and Graphs' },
                      { key: 'includeClientInfo', label: 'Client Information' },
                      { key: 'includeProjectDetails', label: 'Project Details' },
                      { key: 'includeFinancialData', label: 'Financial Data' },
                      { key: 'includeTopPages', label: 'Top Pages' },
                      { key: 'includeRevenueAnalysis', label: 'Revenue Analysis' }
                    ].map((option) => (
                      <label key={option.key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={customization[option.key as keyof typeof customization] as boolean}
                          onChange={(e) => setCustomization(prev => ({ 
                            ...prev, 
                            [option.key]: e.target.checked 
                          }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button
                    onClick={handlePreview}
                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </button>
                  <button
                    onClick={handleEmailReport}
                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </button>
                  <button
                    onClick={handleShareReport}
                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGeneratePDF}
                    disabled={isGenerating}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Generate PDF
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status Messages */}
              {generationStatus === 'success' && (
                <div className="flex items-center p-4 bg-green-50 text-green-700 rounded-lg">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <p className="text-sm">Report generated successfully!</p>
                </div>
              )}

              {generationStatus === 'error' && (
                <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-lg">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Report Preview</h4>
                <button
                  onClick={handlePreview}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Back to Editor
                </button>
              </div>
              
              <div ref={previewRef} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {reportTemplates.find(t => t.id === selectedTemplate)?.name}
                  </h1>
                  <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900">Total Revenue</h3>
                      <p className="text-2xl font-bold text-blue-600">$75,432</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-900">Active Projects</h3>
                      <p className="text-2xl font-bold text-green-600">12</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-900">Clients</h3>
                      <p className="text-2xl font-bold text-purple-600">28</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-orange-900">Conversion</h3>
                      <p className="text-2xl font-bold text-orange-600">3.2%</p>
                    </div>
                  </div>
                  
                  <div className="text-center text-gray-500 py-8">
                    <FileText className="h-12 w-12 mx-auto mb-2" />
                    <p>This is a preview of your report. The actual PDF will contain detailed charts, tables, and formatted content.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
