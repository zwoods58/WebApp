'use client'

import { useState } from 'react'
import FlexibleImport from '@/components/FlexibleImport'
import AdminLayout from '@/components/AdminLayout'
import { Users, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

interface ImportResult {
  success: boolean
  message: string
  imported: number
  errors: string[]
  duplicates: number
}

export default function ImportPage() {
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [importMode, setImportMode] = useState<'file' | 'text'>('file')
  const [textData, setTextData] = useState('')

  const handleImportComplete = (result: ImportResult) => {
    setImportResult(result)
  }

  const handleTextImport = async () => {
    if (!textData.trim()) return

    try {
      // Parse the pasted data
      const lines = textData.trim().split('\n')
      if (lines.length < 2) {
        alert('Please paste data with headers and at least one row')
        return
      }

      // Check if first line has tabs (Google Sheets format)
      const hasTabs = lines[0].includes('\t')
      const delimiter = hasTabs ? '\t' : ','
      
      const headers = lines[0].split(delimiter).map(h => h.trim().replace(/"/g, ''))
      const leads = []

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        const values = line.split(delimiter).map(v => v.trim().replace(/"/g, ''))
        if (values.length === headers.length) {
          const lead: any = {}
          headers.forEach((header, index) => {
            lead[header.toLowerCase()] = values[index] || ''
          })
          leads.push(lead)
        }
      }

      if (leads.length === 0) {
        alert('No valid data found. Please check your format.')
        return
      }

      // Transform data to match API format
      const transformedLeads = leads.map(lead => ({
        firstName: lead.firstname || lead.first_name || lead.name?.split(' ')[0] || '',
        lastName: lead.lastname || lead.last_name || lead.name?.split(' ').slice(1).join(' ') || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        source: 'Google Sheets Import',
        industry: lead.industry || '',
        status: 'NEW',
        score: 50,
        userId: '00000000-0000-0000-0000-000000000002'
      })).filter(lead => lead.firstName || lead.lastName)

      if (transformedLeads.length === 0) {
        alert('No valid leads found. Please ensure you have firstName/lastName data.')
        return
      }

      // Import each lead
      let imported = 0
      let errors = []

      for (const lead of transformedLeads) {
        try {
          const response = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lead)
          })
          
          if (response.ok) {
            imported++
          } else {
            const errorData = await response.json()
            errors.push(`Failed to import ${lead.firstName} ${lead.lastName}: ${errorData.error || 'Unknown error'}`)
          }
        } catch (error) {
          errors.push(`Failed to import ${lead.firstName} ${lead.lastName}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }

      const result = {
        success: errors.length === 0,
        message: `Successfully imported ${imported} leads from Google Sheets`,
        imported,
        duplicates: 0,
        errors
      }

      setImportResult(result)
      
      if (result.success) {
        setTextData('')
      }

    } catch (error) {
      setImportResult({
        success: false,
        message: 'Failed to import leads',
        imported: 0,
        duplicates: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      })
    }
  }

  return (
    <AdminLayout currentPage="import">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Import Leads
          </h1>
          <p className="text-slate-300 text-center max-w-2xl mx-auto">
            Import leads from CSV or Excel files. The system will automatically detect and map columns to the appropriate lead fields.
          </p>
        </div>

        {/* Import Statistics */}
        {importResult && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card text-center">
              <div className="text-2xl font-bold text-green-400">{importResult.imported}</div>
              <div className="text-slate-400 text-sm">Successfully Imported</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-yellow-400">{importResult.duplicates}</div>
              <div className="text-slate-400 text-sm">Duplicates Skipped</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-red-400">{importResult.errors?.length || 0}</div>
              <div className="text-slate-400 text-sm">Errors</div>
            </div>
          </div>
        )}

        {/* Import Method Toggle */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Choose Import Method</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setImportMode('file')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                importMode === 'file'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setImportMode('text')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                importMode === 'text'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Paste from Google Sheets
            </button>
          </div>
        </div>

        {/* Google Sheets Text Area */}
        {importMode === 'text' && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Paste Data from Google Sheets</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Instructions:
                </label>
                <div className="text-sm text-slate-400 space-y-1">
                  <p>1. Select your data in Google Sheets (including headers)</p>
                  <p>2. Copy the data (Ctrl+C or Cmd+C)</p>
                  <p>3. Paste it in the text area below</p>
                  <p>4. Click "Import to CRM" to process the data</p>
                </div>
              </div>
              <textarea
                value={textData}
                onChange={(e) => setTextData(e.target.value)}
                placeholder="Paste your Google Sheets data here...
firstName	lastName	email	company	phone
John	Doe	john@example.com	Acme Corp	555-0123
Jane	Smith	jane@example.com	Tech Inc	555-0456"
                className="w-full h-48 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={10}
              />
              {textData && (
                <div className="text-sm text-slate-400">
                  <span className="text-green-400">✓ Data pasted successfully</span>
                </div>
              )}
              <button
                onClick={handleTextImport}
                disabled={!textData.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Import to CRM
              </button>
            </div>
          </div>
        )}

        {/* File Upload Component */}
        {importMode === 'file' && (
          <FlexibleImport onImportComplete={handleImportComplete} />
        )}

        {/* Success Message */}
        {importResult?.success && (
          <div className="card border-green-500 bg-green-900/20 mt-8">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <div>
                <h3 className="text-lg font-semibold text-green-400">Import Completed Successfully!</h3>
                <p className="text-slate-300 mt-1">
                  {importResult.imported} leads have been imported and assigned to the sales team.
                </p>
              </div>
            </div>
            <div className="mt-4 flex space-x-4">
              <a
                href="/admin/leads"
                className="btn-primary flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>View Leads</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}

        {/* Error Message */}
        {importResult && !importResult.success && (
          <div className="card border-red-500 bg-red-900/20 mt-8">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-400" />
              <div>
                <h3 className="text-lg font-semibold text-red-400">Import Failed</h3>
                <p className="text-slate-300 mt-1">{importResult.message}</p>
              </div>
            </div>
            {importResult.errors && importResult.errors.length > 0 && (
              <div className="mt-4">
                <h4 className="text-red-400 font-medium mb-2">Error Details:</h4>
                <ul className="text-red-300 text-sm space-y-1">
                  {importResult.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="card mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Import Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-blue-400 mb-2">Supported File Formats</h3>
              <ul className="text-slate-300 space-y-1">
                <li>• CSV files (.csv)</li>
                <li>• Excel files (.xlsx, .xls)</li>
                <li>• Files up to 10MB in size</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-400 mb-2">Column Mapping</h3>
              <ul className="text-slate-300 space-y-1">
                <li>• System auto-detects common column names</li>
                <li>• You can manually adjust mappings if needed</li>
                <li>• Only First Name or Last Name is required</li>
                <li>• All other fields are optional</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-400 mb-2">Data Quality</h3>
              <ul className="text-slate-300 space-y-1">
                <li>• Duplicate emails are automatically skipped</li>
                <li>• Empty rows are ignored</li>
                <li>• Invalid data is reported in errors</li>
                <li>• All leads are assigned to sales team</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-400 mb-2">Common Column Names</h3>
              <ul className="text-slate-300 space-y-1">
                <li>• First Name: "first name", "fname", "given name"</li>
                <li>• Last Name: "last name", "lname", "surname"</li>
                <li>• Email: "email", "email address", "e-mail"</li>
                <li>• Phone: "phone", "phone number", "mobile"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}