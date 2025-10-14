'use client'

import { useState } from 'react'
import TestImport from '@/components/TestImport'
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

  const handleImportComplete = (result: ImportResult) => {
    setImportResult(result)
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

        {/* Import Component */}
        <TestImport />

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