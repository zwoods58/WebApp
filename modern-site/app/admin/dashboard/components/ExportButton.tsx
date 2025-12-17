'use client'

import { Download } from 'lucide-react'

export function ExportButton({ data, filename, headers }: { 
  data: Array<Record<string, unknown>>, 
  filename: string,
  headers: string[]
}) {
  const exportToCSV = () => {
    if (!data || data.length === 0) return

    // Create CSV content
    const csvHeaders = headers.join(',')
    const csvRows = data.map(row => {
      return headers.map(header => {
        // Try multiple key formats
        const key = header.toLowerCase().replace(/\s+/g, '_')
        const value = row[key] || row[header] || row[header.toLowerCase()] || ''
        // Escape commas and quotes
        return `"${String(value).replace(/"/g, '""')}"`
      }).join(',')
    })

    const csvContent = [csvHeaders, ...csvRows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button
      onClick={exportToCSV}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
    >
      <Download className="w-4 h-4" />
      Export CSV
    </button>
  )
}

