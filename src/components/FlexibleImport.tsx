'use client'

import { useState, useRef } from 'react'
import { Upload, FileSpreadsheet, X, Download, Check, AlertCircle } from 'lucide-react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

interface ImportResult {
  success: boolean
  message: string
  imported: number
  duplicates: number
  errors: string[]
}

interface Lead {
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
}

interface ColumnMapping {
  [key: string]: string // column name -> field name
}

interface FlexibleImportProps {
  onImportComplete?: (result: ImportResult) => void
}

export default function FlexibleImport({ onImportComplete }: FlexibleImportProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({})
  const [availableColumns, setAvailableColumns] = useState<string[]>([])
  const [showMapping, setShowMapping] = useState(false)
  const [importMode, setImportMode] = useState<'file' | 'text'>('file')
  const [textData, setTextData] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Define the expected lead fields and their possible column names
  const fieldMappings = {
    firstName: ['first name', 'firstname', 'first_name', 'fname', 'given name', 'name', 'email 1 full name', 'email 2 full name', 'full name'],
    lastName: ['last name', 'lastname', 'last_name', 'lname', 'surname', 'family name'],
    email: ['email', 'email address', 'e-mail', 'mail', 'email 1', 'email 2', 'primary email', 'contact email'],
    phone: ['phone', 'phone number', 'telephone', 'mobile', 'cell', 'contact number', 'phone number 1', 'phone number 2', 'email 1 phone', 'email 2 phone number'],
    company: ['company', 'organization', 'org', 'business', 'firm', 'business name', 'company name'],
    title: ['title', 'job title', 'position', 'role', 'designation', 'email 1 title', 'email 2 title'],
    source: ['source', 'lead source', 'origin', 'referral source', 'website', 'referral'],
    industry: ['industry', 'business type', 'sector', 'category'],
    website: ['website', 'web site', 'url', 'homepage', 'domain'],
    address: ['address', 'street address', 'location', 'full address'],
    city: ['city', 'town', 'municipality'],
    state: ['state', 'province', 'region', 'territory'],
    zipCode: ['zip code', 'zipcode', 'postal code', 'postcode', 'zip'],
    timeZone: ['time zone', 'timezone', 'tz'],
    status: ['status', 'email status', 'email 1 status', 'email 2 status', 'lead status'],
    statusDetail: ['status detail', 'email status detail', 'email 1 status detail', 'email 2 status detail'],
    notes: ['notes', 'comments', 'description', 'remarks', 'additional info', 'memo']
  }

  const handleFileSelect = (file: File) => {
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      setSelectedFile(file)
      setImportResult(null)
      parseFile(file)
    } else {
      alert('Please select a valid CSV or Excel file.')
    }
  }

  const handleTextDataChange = (value: string) => {
    setTextData(value)
    setImportResult(null)
    if (value.trim()) {
      parseTextData(value)
    } else {
      setPreviewData([])
      setShowPreview(false)
      setShowMapping(false)
      setAvailableColumns([])
      setColumnMapping({})
    }
  }

  const parseTextData = (text: string) => {
    try {
      // Try to detect if it's tab-separated (Google Sheets) or comma-separated
      const lines = text.trim().split('\n')
      if (lines.length < 2) return

      // Check if first line has tabs (Google Sheets format)
      const hasTabs = lines[0].includes('\t')
      const delimiter = hasTabs ? '\t' : ','

      const headers = lines[0].split(delimiter).map(h => h.trim().replace(/"/g, ''))
      const data: any[] = []

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        const values = line.split(delimiter).map(v => v.trim().replace(/"/g, ''))
        if (values.length === headers.length) {
          const row: any = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ''
          })
          data.push(row)
        }
      }

      if (data.length > 0) {
        setPreviewData(data)
        setAvailableColumns(headers)
        setShowPreview(true)
        setShowMapping(true)
        setColumnMapping(autoMapColumns(headers))
      }
    } catch (error) {
      console.error('Error parsing text data:', error)
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
      let data: any[] = []
      let headers: string[] = []

      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        // Parse Excel file
        const arrayBuffer = await file.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        if (jsonData.length === 0) {
          alert('The Excel file appears to be empty.')
          return
        }

        headers = jsonData[0] as string[]
        data = jsonData.slice(1).map((row: unknown) => {
          const rowArray = row as any[]
          const obj: any = {}
          headers.forEach((header, index) => {
            obj[header] = rowArray[index] || ''
          })
          return obj
        })
      } else {
        // Parse CSV file
        const text = await file.text()
        const result = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim()
        })
        
        if (result.errors.length > 0) {
          console.warn('CSV parsing warnings:', result.errors)
        }

        headers = result.meta.fields || []
        data = result.data as any[]
      }

      if (data.length === 0) {
        alert('No data found in the file.')
        return
      }

      // Clean up headers and data
      headers = headers.map(h => h.trim())
      data = data.map(row => {
        const cleanRow: any = {}
        Object.keys(row).forEach(key => {
          cleanRow[key.trim()] = typeof row[key] === 'string' ? row[key].trim() : row[key]
        })
        return cleanRow
      })

      setAvailableColumns(headers)
      setPreviewData(data)
      setShowPreview(true)
      
      // Auto-detect column mappings
      const autoMapping = autoDetectColumns(headers)
      setColumnMapping(autoMapping)
      setShowMapping(true)

    } catch (error) {
      console.error('Error parsing file:', error)
      alert('Error parsing file. Please check the format.')
    }
  }

  const autoDetectColumns = (headers: string[]): ColumnMapping => {
    const mapping: ColumnMapping = {}
    
    headers.forEach(header => {
      const lowerHeader = header.toLowerCase()
      
      // Find the best match for each field
      Object.entries(fieldMappings).forEach(([field, possibleNames]) => {
        const match = possibleNames.find(name => 
          lowerHeader.includes(name) || name.includes(lowerHeader)
        )
        if (match && !mapping[header]) {
          mapping[header] = field
        }
      })
    })
    
    return mapping
  }

  const handleMappingChange = (columnName: string, fieldName: string) => {
    setColumnMapping(prev => ({
      ...prev,
      [columnName]: fieldName
    }))
  }

  const transformData = (): Lead[] => {
    return previewData.map((row, index) => {
      const lead: Lead = {
        firstName: '',
        lastName: '',
        email: undefined,
        phone: undefined,
        company: undefined,
        title: undefined,
        source: 'Import',
        industry: undefined,
        website: undefined,
        address: undefined,
        city: undefined,
        state: undefined,
        zipCode: undefined,
        timeZone: undefined,
        status: 'NEW',
        statusDetail: undefined,
        score: 50,
        notes: undefined
      }

      // Map columns to lead fields
      Object.entries(columnMapping).forEach(([columnName, fieldName]) => {
        const value = row[columnName]
        if (value && value.toString().trim()) {
          switch (fieldName) {
            case 'firstName':
              lead.firstName = value.toString().trim()
              break
            case 'lastName':
              lead.lastName = value.toString().trim()
              break
            case 'email':
              lead.email = value.toString().trim()
              break
            case 'phone':
              lead.phone = value.toString().trim()
              break
            case 'company':
              lead.company = value.toString().trim()
              break
            case 'title':
              lead.title = value.toString().trim()
              break
            case 'source':
              lead.source = value.toString().trim()
              break
            case 'industry':
              lead.industry = value.toString().trim()
              break
            case 'website':
              lead.website = value.toString().trim()
              break
            case 'address':
              lead.address = value.toString().trim()
              break
            case 'city':
              lead.city = value.toString().trim()
              break
            case 'state':
              lead.state = value.toString().trim()
              break
            case 'zipCode':
              lead.zipCode = value.toString().trim()
              break
            case 'timeZone':
              lead.timeZone = value.toString().trim()
              break
            case 'status':
              lead.status = value.toString().trim() as Lead['status']
              break
            case 'statusDetail':
              lead.statusDetail = value.toString().trim()
              break
            case 'notes':
              lead.notes = value.toString().trim()
              break
          }
        }
      })

      // If no firstName/lastName found, try to split a "Name" field
      if (!lead.firstName && !lead.lastName) {
        const nameFields = Object.keys(row).filter(key => 
          key.toLowerCase().includes('name') && !key.toLowerCase().includes('last') && !key.toLowerCase().includes('first')
        )
        if (nameFields.length > 0) {
          const fullName = row[nameFields[0]]?.toString().trim() || ''
          const nameParts = fullName.split(' ')
          if (nameParts.length >= 2) {
            lead.firstName = nameParts[0]
            lead.lastName = nameParts.slice(1).join(' ')
          } else {
            lead.firstName = fullName
            lead.lastName = ''
          }
        }
      }

      return lead
    }).filter(lead => lead.firstName || lead.lastName) // Only include leads with at least a name
  }

  const handleImport = async () => {
    if (previewData.length === 0) return

    setIsImporting(true)
    setImportResult(null)

    try {
      const transformedData = transformData()
      
      if (transformedData.length === 0) {
        alert('No valid leads found after mapping. Please check your column mappings.')
        setIsImporting(false)
        return
      }

      let response;
      
      if (importMode === 'file' && selectedFile) {
        // File import - use the existing multipart form data approach
        const formData = new FormData()
        formData.append('file', selectedFile)
        formData.append('assignedTo', 'sales')
        
        response = await fetch('/api/leads/import', {
          method: 'POST',
          body: formData,
        })
      } else {
        // Text import - use direct API calls
        const results = []
        let imported = 0
        let duplicates = 0
        let errors: string[] = []
        
        for (const lead of transformedData) {
          try {
            const leadResponse = await fetch('/api/leads', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(lead),
            })
            
            if (leadResponse.ok) {
              imported++
            } else {
              const errorData = await leadResponse.json()
              errors.push(`Failed to import ${lead.firstName} ${lead.lastName}: ${errorData.error || 'Unknown error'}`)
            }
          } catch (error) {
            errors.push(`Failed to import ${lead.firstName} ${lead.lastName}: ${error instanceof Error ? error.message : 'Unknown error'}`)
          }
        }
        
        const result = {
          success: errors.length === 0,
          message: `Successfully imported ${imported} leads and assigned to sales team`,
          imported,
          duplicates,
          errors
        }
        
        setImportResult(result)
        
        if (result.success) {
          setShowPreview(false)
          setShowMapping(false)
          setPreviewData([])
          setColumnMapping({})
          setAvailableColumns([])
          setTextData('')
        }

        if (onImportComplete) {
          onImportComplete(result)
        }
        
        setIsImporting(false)
        return
      }

      const result = await response.json()
      setImportResult(result)
      
      if (result.success) {
        setShowPreview(false)
        setShowMapping(false)
        setPreviewData([])
        setColumnMapping({})
        setAvailableColumns([])
        setTextData('')
      }

      if (onImportComplete) {
        onImportComplete(result)
      }

    } catch (error) {
      console.error('Import error:', error)
      setImportResult({
        success: false,
        message: 'Failed to import leads',
        imported: 0,
        duplicates: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      })
    } finally {
      setIsImporting(false)
    }
  }

  const downloadTemplate = () => {
    const templateData = [
      ['First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Title', 'Source', 'Notes'],
      ['John', 'Doe', 'john@example.com', '+1-555-0123', 'Acme Corp', 'Manager', 'Website', 'Interested in our services'],
      ['Jane', 'Smith', 'jane@example.com', '+1-555-0124', 'Tech Inc', 'Director', 'Referral', 'Referred by John']
    ]

    const csv = Papa.unparse(templateData)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'leads-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const getFieldOptions = () => {
    return [
      { value: '', label: '-- Skip Column --' },
      { value: 'firstName', label: 'First Name' },
      { value: 'lastName', label: 'Last Name' },
      { value: 'email', label: 'Email' },
      { value: 'phone', label: 'Phone' },
      { value: 'company', label: 'Company' },
      { value: 'title', label: 'Title' },
      { value: 'source', label: 'Source' },
      { value: 'industry', label: 'Industry' },
      { value: 'website', label: 'Website' },
      { value: 'address', label: 'Address' },
      { value: 'city', label: 'City' },
      { value: 'state', label: 'State' },
      { value: 'zipCode', label: 'Zip Code' },
      { value: 'timeZone', label: 'Time Zone' },
      { value: 'status', label: 'Status' },
      { value: 'statusDetail', label: 'Status Detail' },
      { value: 'notes', label: 'Notes' }
    ]
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-4">Import Leads</h2>
        <div className="text-slate-300 space-y-2">
          <p>• Upload a CSV or Excel file with lead information</p>
          <p>• Or paste data directly from Google Sheets</p>
          <p>• The system will automatically detect and map columns</p>
          <p>• You can manually adjust column mappings if needed</p>
          <p>• Required: At least First Name or Last Name</p>
          <p>• All leads will be automatically assigned to sales team</p>
        </div>
        <button
          onClick={downloadTemplate}
          className="btn-secondary mt-4 flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Download Template</span>
        </button>
      </div>

      {/* Import Mode Toggle */}
      <div className="card">
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

      {/* Text Area for Google Sheets */}
      {importMode === 'text' && (
        <div className="card">
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
                <p>4. The system will automatically detect columns and map them</p>
              </div>
            </div>
            <textarea
              value={textData}
              onChange={(e) => handleTextDataChange(e.target.value)}
              placeholder="Paste your Google Sheets data here...
firstName	lastName	email	company	phone
John	Doe	john@example.com	Acme Corp	555-0123
Jane	Smith	jane@example.com	Tech Inc	555-0456"
              className="w-full h-48 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={10}
            />
            {textData && (
              <div className="text-sm text-slate-400">
                {previewData.length > 0 ? (
                  <span className="text-green-400">✓ {previewData.length} rows detected</span>
                ) : (
                  <span className="text-yellow-400">⚠ No valid data detected</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* File Upload Area */}
      {importMode === 'file' && (
        <div className="card">
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
                  setShowMapping(false)
                  setImportResult(null)
                  setColumnMapping({})
                  setAvailableColumns([])
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
                accept=".csv,.xlsx,.xls"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          )}
        </div>
        </div>
      )}

      {/* Column Mapping */}
      {showMapping && availableColumns.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Map Columns</h2>
          <p className="text-slate-300 mb-4">
            Map your file columns to lead fields. The system has auto-detected some mappings.
          </p>
          <div className="space-y-3">
            {availableColumns.map(column => (
              <div key={column} className="flex items-center space-x-4">
                <div className="w-1/3 text-slate-300 font-medium">{column}</div>
                <div className="w-1/3">
                  <select
                    value={columnMapping[column] || ''}
                    onChange={(e) => handleMappingChange(column, e.target.value)}
                    className="input"
                  >
                    {getFieldOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-1/3 text-slate-400 text-sm">
                  {columnMapping[column] ? '✓ Mapped' : 'Not mapped'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Data */}
      {showPreview && previewData.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">
            Preview Data ({previewData.length} rows)
          </h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  {availableColumns.map(column => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.slice(0, 10).map((row, index) => (
                  <tr key={index}>
                    {availableColumns.map(column => (
                      <td key={column} className="text-slate-300">
                        {row[column] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {previewData.length > 10 && (
              <p className="text-slate-400 text-sm mt-2">
                Showing first 10 rows of {previewData.length} total rows
              </p>
            )}
          </div>
        </div>
      )}

      {/* Import Button */}
      {showPreview && (
        <div className="card">
          <button
            onClick={handleImport}
            disabled={isImporting}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {isImporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Importing...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Import {previewData.length} Leads</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Import Result */}
      {importResult && (
        <div className={`card ${importResult.success ? 'border-green-500' : 'border-red-500'}`}>
          <div className="flex items-center space-x-2 mb-4">
            {importResult.success ? (
              <Check className="h-5 w-5 text-green-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-400" />
            )}
            <h2 className="text-xl font-semibold text-white">
              {importResult.success ? 'Import Successful' : 'Import Failed'}
            </h2>
          </div>
          <p className="text-slate-300 mb-4">{importResult.message}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-green-400">
              <strong>Imported:</strong> {importResult.imported}
            </div>
            <div className="text-yellow-400">
              <strong>Duplicates:</strong> {importResult.duplicates}
            </div>
          </div>
          {importResult.errors && importResult.errors.length > 0 && (
            <div className="mt-4">
              <h3 className="text-red-400 font-medium mb-2">Errors:</h3>
              <ul className="text-red-300 text-sm space-y-1">
                {importResult.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
