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

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
    }

    // Get current user
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get project
    const { data: draft } = await supabase
      .from('draft_projects')
      .select('metadata')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (!draft) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const pages = draft.metadata?.pages || []
    return NextResponse.json({ pages })
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { projectId, pageId, pageName, pageSlug, htmlCode, action } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
    }

    // Get current user
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current project
    const { data: draft } = await supabase
      .from('draft_projects')
      .select('metadata')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (!draft) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    let pages = draft.metadata?.pages || []
    const files = draft.metadata?.files || {}

    if (action === 'create') {
      // Create new page
      const newPage = {
        id: pageId || `page-${Date.now()}`,
        name: pageName || 'New Page',
        slug: pageSlug || `page-${Date.now()}`,
        htmlCode: htmlCode || ''
      }
      pages.push(newPage)
      files[`${newPage.slug}.html`] = htmlCode || ''
    } else if (action === 'update') {
      // Update existing page
      pages = pages.map((p: any) => 
        p.id === pageId 
          ? { ...p, name: pageName || p.name, slug: pageSlug || p.slug, htmlCode: htmlCode || p.htmlCode }
          : p
      )
      if (htmlCode) {
        const page = pages.find((p: any) => p.id === pageId)
        if (page) {
          files[`${page.slug}.html`] = htmlCode
        }
      }
    } else if (action === 'delete') {
      // Delete page
      const pageToDelete = pages.find((p: any) => p.id === pageId)
      pages = pages.filter((p: any) => p.id !== pageId)
      if (pageToDelete) {
        delete files[`${pageToDelete.slug}.html`]
      }
    }

    // Update project
    await supabase
      .from('draft_projects')
      .update({
        metadata: {
          ...draft.metadata,
          pages,
          files,
          currentPage: action === 'delete' && draft.metadata?.currentPage === pageId ? 'index' : draft.metadata?.currentPage
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)

    return NextResponse.json({ success: true, pages })
  } catch (error) {
    console.error('Error managing pages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

