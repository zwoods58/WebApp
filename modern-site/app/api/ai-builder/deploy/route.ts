import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
// import { Vercel } from '@vercel/client' // TODO: Install @vercel/client if needed

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing')
  }
  return createClient(supabaseUrl, supabaseKey)
}

const vercelToken = process.env.VERCEL_TOKEN
const vercelTeamId = process.env.VERCEL_TEAM_ID

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    
    const { projectId, customDomain } = await request.json()

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

    // Get draft project
    const { data: draft, error: draftError } = await supabase
      .from('draft_projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (draftError || !draft) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if user has Pro subscription
    const { data: account } = await supabase
      .from('user_accounts')
      .select('account_tier, subscription_status')
      .eq('id', user.id)
      .single()

    if (account?.account_tier !== 'pro_subscription' || account?.subscription_status !== 'active') {
      return NextResponse.json({ 
        error: 'Pro subscription required for deployment' 
      }, { status: 403 })
    }

    const htmlCode = draft.metadata?.html_code
    if (!htmlCode) {
      return NextResponse.json({ error: 'No code to deploy' }, { status: 400 })
    }

    // Deploy to Vercel
    if (vercelToken) {
      try {
        const deployment = await deployToVercel(draft, htmlCode, customDomain)
        
        // Update draft with deployment info
        await supabase
          .from('draft_projects')
          .update({
            deployment_url: deployment.url,
            deployment_id: deployment.id,
            deployed_at: new Date().toISOString(),
            status: 'deployed'
          })
          .eq('id', projectId)

        return NextResponse.json({
          success: true,
          deploymentUrl: deployment.url,
          deploymentId: deployment.id
        })
      } catch (vercelError: any) {
        console.error('Vercel deployment error:', vercelError)
        return NextResponse.json({
          success: false,
          error: vercelError.message || 'Deployment failed'
        }, { status: 500 })
      }
    } else {
      // Fallback: Store deployment info without Vercel
      const deploymentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/preview/${projectId}`
      
      await supabase
        .from('draft_projects')
        .update({
          deployment_url: deploymentUrl,
          deployed_at: new Date().toISOString(),
          status: 'deployed'
        })
        .eq('id', projectId)

      return NextResponse.json({
        success: true,
        deploymentUrl,
        note: 'Vercel token not configured. Using preview URL.'
      })
    }
  } catch (error: any) {
    console.error('Deployment error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

async function deployToVercel(draft: any, htmlCode: string, customDomain?: string) {
  if (!vercelToken) {
    throw new Error('Vercel token not configured')
  }

  // Create a simple Next.js project structure
  const projectName = `atarwebb-${draft.id.slice(0, 8)}`
  
  // For now, return a mock deployment
  // TODO: Implement actual Vercel API deployment
  // This requires:
  // 1. Create Vercel project
  // 2. Upload files via Vercel API
  // 3. Configure custom domain if provided
  // 4. Return deployment URL

  return {
    id: `deployment-${Date.now()}`,
    url: customDomain || `https://${projectName}.vercel.app`,
    state: 'READY'
  }
}

