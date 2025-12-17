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

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { projectId, command } = await request.json()

    if (!projectId || !command) {
      return NextResponse.json({ error: 'Project ID and command required' }, { status: 400 })
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

    // Check Pro subscription
    const { data: account } = await supabase
      .from('user_accounts')
      .select('account_tier, subscription_status')
      .eq('id', user.id)
      .single()

    if (account?.account_tier !== 'pro_subscription' || account?.subscription_status !== 'active') {
      return NextResponse.json({ error: 'Pro subscription required' }, { status: 403 })
    }

    // Verify project ownership
    const { data: draft } = await supabase
      .from('draft_projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (!draft) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Execute command (safe subset only)
    const safeCommands = ['ls', 'pwd', 'cat', 'echo', 'npm', 'git']
    const commandParts = command.trim().split(' ')
    const baseCommand = commandParts[0]

    if (!safeCommands.includes(baseCommand)) {
      return NextResponse.json({ 
        error: `Command "${baseCommand}" not allowed. Allowed commands: ${safeCommands.join(', ')}` 
      }, { status: 400 })
    }

    // For now, return mock output
    // TODO: Implement actual command execution in secure sandbox
    const output = `$ ${command}\n[Terminal output for: ${command}]\n[Note: Terminal execution requires secure sandbox environment]`

    return NextResponse.json({
      success: true,
      output,
      exitCode: 0
    })
  } catch (error) {
    console.error('Terminal error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

