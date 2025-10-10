'use client'

import { useState, useRef } from 'react'
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, X, Users, ArrowRight } from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'

interface ImportResult {
  success: boolean
  message: string
  imported: number
  errors: string[]
  duplicates: number
}

interface Lead {
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
}

export default function ImportPage() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [previewData, setPreviewData] = useState<Lead[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      setSelectedFile(file)
      setImportResult(null)
      parseFile(file)
    } else {
      alert('Please select a valid CSV or Excel file.')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const parseFile = async (file: File) => {
    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      
      if (lines.length < 2) {
        alert('File must contain at least a header row and one data row.')
        return
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim())
        const lead: Lead = {
          firstName: values[0] || '',
          lastName: values[1] || '',
          email: values[2] || undefined,
          phone: values[3] || undefined,
          company: values[4] || undefined,
          title: values[5] || undefined,
          source: values[6] || 'Import',
          status: 'NEW' as const,
          score: 50,
          notes: values[7] || undefined
        }
        return lead
      })

      setPreviewData(data)
      setShowPreview(true)
    } catch (error) {
      console.error('Error parsing file:', error)
      alert('Error parsing file. Please check the format.')
    }
  }

  const handleImport = async () => {
    if (!selectedFile || previewData.length === 0) return

    setIsImporting(true)
    setImportResult(null)

    try {
      // Call the import API
      const response = await fetch('/api/leads/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leads: previewData,
          assignedTo: 'sales' // Automatically assign to sales team
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setImportResult({
          success: true,
          message: `Successfully imported ${result.imported} leads and assigned to sales team`,
          imported: result.imported,
          errors: result.errors || [],
          duplicates: result.duplicates || 0
        })
        setShowPreview(false)
        setSelectedFile(null)
        setPreviewData([])
      } else {
        setImportResult({
          success: false,
          message: result.error || 'Import failed. Please try again.',
          imported: 0,
          errors: result.errors || ['Failed to import leads'],
          duplicates: 0
        })
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Import failed. Please try again.',
        imported: 0,
        errors: ['Failed to import leads'],
        duplicates: 0
      })
    } finally {
      setIsImporting(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = 'First Name,Last Name,Email,Phone,Company,Title,Source,Notes\nJohn,Doe,john@example.com,555-1234,Acme Corp,CEO,Website,Interested in web development\nJane,Smith,jane@company.com,555-5678,Tech Solutions,CTO,Referral,Looking for mobile app'
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'leads_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <AdminLayout currentPage="import">
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          Import Leads to Sales Team
        </h1>

        {/* Import Flow Info */}
        <div className="card mb-8 bg-blue-900/20 border-blue-500/30">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Automatic Sales Assignment</h3>
              <p className="text-slate-300">
                All imported leads will be automatically assigned to the sales team for immediate follow-up and management.
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Import Instructions</h2>
          <div className="space-y-3 text-slate-300">
            <p>• Upload a CSV or Excel file with lead information</p>
            <p>• Required columns: First Name, Last Name</p>
            <p>• Optional columns: Email, Phone, Company, Title, Source, Notes</p>
            <p>• All leads will be automatically assigned to sales team</p>
            <p>• Download our template to ensure proper formatting</p>
          </div>
          <button
            onClick={downloadTemplate}
            className="btn-secondary mt-4 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download Template</span>
          </button>
        </div>

        {/* File Upload Area */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Upload File</h2>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-blue-400 bg-blue-900/20'
                : 'border-slate-600 hover:border-slate-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <FileSpreadsheet className="h-8 w-8" />
                  <span className="font-medium">{selectedFile.name}</span>
                </div>
                <p className="text-slate-400">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
                <button
                  onClick={() => {
                    setSelectedFile(null)
                    setPreviewData([])
                    setShowPreview(false)
                    setImportResult(null)
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 mx-auto text-slate-400" />
                <div>
                  <p className="text-lg font-medium text-white mb-2">
                    Drop your file here or click to browse
                  </p>
                  <p className="text-slate-400">
                    Supports CSV and Excel files up to 10MB
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary"
                >
                  Choose File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>

        {/* Preview Data */}
        {showPreview && previewData.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Preview Data ({previewData.length} leads)
            </h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Company</th>
                    <th>Title</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.slice(0, 10).map((lead, index) => (
                    <tr key={index}>
                      <td className="text-white">{lead.firstName}</td>
                      <td className="text-slate-300">{lead.lastName}</td>
                      <td className="text-slate-300">{lead.email || 'N/A'}</td>
                      <td className="text-slate-300">{lead.phone || 'N/A'}</td>
                      <td className="text-slate-300">{lead.company || 'N/A'}</td>
                      <td className="text-slate-300">{lead.title || 'N/A'}</td>
                      <td className="text-slate-300">{lead.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewData.length > 10 && (
                <p className="text-slate-400 text-sm mt-2">
                  Showing first 10 rows of {previewData.length} total leads
                </p>
              )}
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleImport}
                disabled={isImporting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isImporting ? 'Importing to Sales Team...' : 'Import to Sales Team'}
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Import Result */}
        {importResult && (
          <div className="card">
            <div className={`flex items-center space-x-3 mb-4 ${
              importResult.success ? 'text-green-400' : 'text-red-400'
            }`}>
              {importResult.success ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <AlertCircle className="h-6 w-6" />
              )}
              <h2 className="text-xl font-semibold">
                {importResult.success ? 'Import Successful' : 'Import Failed'}
              </h2>
            </div>
            
            <div className="space-y-3">
              <p className="text-slate-300">{importResult.message}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{importResult.imported}</div>
                  <div className="text-slate-400 text-sm">Imported to Sales</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{importResult.duplicates}</div>
                  <div className="text-slate-400 text-sm">Duplicates Skipped</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">{importResult.errors.length}</div>
                  <div className="text-slate-400 text-sm">Errors</div>
                </div>
              </div>

              {importResult.success && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-green-400">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">Leads are now available in the Sales Dashboard</span>
                  </div>
                  <p className="text-slate-300 text-sm mt-1">
                    Sales team can now view, call, and manage these leads immediately.
                  </p>
                </div>
              )}

              {importResult.errors.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Errors:</h3>
                  <ul className="space-y-1">
                    {importResult.errors.map((error, index) => (
                      <li key={index} className="text-red-400 text-sm">• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => setImportResult(null)}
                className="btn-secondary mt-4"
              >
                Import More Leads
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

