import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const lang = searchParams.get('lang') || 'en'

  // Search suggestions based on query
  const suggestions = [
    'web development services',
    'portfolio projects',
    'contact information',
    'about our team',
    'pricing packages',
    'consultation booking',
    'custom solutions',
    'responsive design',
    'e-commerce websites',
    'mobile applications'
  ].filter(suggestion => 
    suggestion.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5)

  // Return JSONP format for browser compatibility
  const callback = searchParams.get('callback') || 'callback'
  const response = JSON.stringify(suggestions)
  
  return new NextResponse(`${callback}(${response})`, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
