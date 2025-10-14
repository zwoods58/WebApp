import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const assignedTo = formData.get('assignedTo') as string || 'sales'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Parse CSV file
    const csvText = await file.text()
    console.log('=== DEBUG IMPORT ===')
    console.log('Raw CSV text:', JSON.stringify(csvText))
    
    // Clean up carriage returns and split by lines
    const lines = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim())
    const leads: any[] = []

    console.log('CSV Headers:', headers)
    console.log('CSV Lines count:', lines.length)

    // Parse CSV data
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue // Skip empty lines
      
      const values: string[] = []
      let current = ''
      let inQuotes = false
      
      // Parse CSV line handling quoted fields
      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim()) // Add the last field
      
      console.log(`Parsing line ${i}:`, { line, values, headersLength: headers.length, valuesLength: values.length })
      
      if (values.length === headers.length) {
        const lead: any = {}
        headers.forEach((header, index) => {
          const value = values[index]
          switch (header.toLowerCase()) {
            case 'firstname':
              lead.firstName = value || ''
              break
            case 'lastname':
              lead.lastName = value || ''
              break
            case 'email':
              lead.email = value
              break
            case 'phone':
              lead.phone = value
              break
            case 'company':
              lead.company = value
              break
            case 'industry':
              lead.industry = value
              break
            case 'source':
              lead.source = value
              break
          }
        })
        
        console.log('Parsed lead:', lead)
        leads.push(lead)
      } else {
        console.log('Skipping line - length mismatch')
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Debug import completed',
      headers,
      linesCount: lines.length,
      parsedLeads: leads,
      assignedTo
    })
  } catch (error) {
    console.error('Debug import error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
