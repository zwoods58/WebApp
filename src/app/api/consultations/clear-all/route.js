import { NextResponse } from 'next/server'
const fs = require('fs')
const path = require('path')

const DATA_FILE = path.join(process.cwd(), 'data', 'consultations.json')

export async function POST(req) {
  try {
    // Clear all consultations by writing empty array
    const dataDir = path.dirname(DATA_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2))

    return NextResponse.json({
      success: true,
      message: 'All consultations cleared successfully'
    })

  } catch (error) {
    console.error('Error clearing all consultations:', error)
    return NextResponse.json(
      { error: 'Failed to clear all consultations' },
      { status: 500 }
    )
  }
}
