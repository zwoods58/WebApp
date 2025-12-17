import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing')
  }
  return createClient(supabaseUrl, supabaseKey)
}

export async function GET(
  request: NextRequest,
  { params }: { params: { draftId: string } }
) {
  try {
    const supabase = getSupabaseClient()
    const { draftId } = params

    // Get draft project
    const { data: draft, error } = await supabase
      .from('draft_projects')
      .select('metadata, preview_expires_at, business_name')
      .eq('id', draftId)
      .single()

    if (error || !draft) {
      return new NextResponse('Preview not found', { status: 404 })
    }

    // Check if preview has expired (for FREE tier)
    if (draft.preview_expires_at) {
      const expiryDate = new Date(draft.preview_expires_at)
      if (expiryDate < new Date()) {
        return new NextResponse(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Preview Expired - ${draft.business_name}</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  margin: 0;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                }
                .container {
                  text-align: center;
                  padding: 2rem;
                }
                h1 { font-size: 2rem; margin-bottom: 1rem; }
                p { font-size: 1.1rem; opacity: 0.9; }
                a {
                  display: inline-block;
                  margin-top: 1.5rem;
                  padding: 0.75rem 2rem;
                  background: white;
                  color: #667eea;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: 600;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Preview Expired</h1>
                <p>This preview link has expired. Please upgrade to Pro for unlimited preview access.</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/ai-builder/upgrade">Upgrade to Pro</a>
              </div>
            </body>
          </html>
        `, {
          headers: { 'Content-Type': 'text/html' }
        })
      }
    }

    // Get HTML code from metadata
    const htmlCode = draft.metadata?.html_code

    if (!htmlCode) {
      return new NextResponse('Preview not available', { status: 404 })
    }

    // Return HTML with proper headers
    return new NextResponse(htmlCode, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Frame-Options': 'SAMEORIGIN',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Error serving preview:', error)
    return new NextResponse('Error loading preview', { status: 500 })
  }
}
