/**
 * P0 Feature 3: Real-Time Preview Updates
 * SSE endpoint for live preview updates
 */

import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase configuration missing')
  }
  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function GET(request: NextRequest) {
  const supabase = getSupabaseClient()
  const searchParams = request.nextUrl.searchParams
  const draftId = searchParams.get('draftId')

  if (!draftId) {
    return new Response('draftId required', { status: 400 })
  }

  // Create SSE stream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      
      // Send initial connection message
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', draftId })}\n\n`))

      // Set up Supabase realtime subscription
      const channel = supabase
        .channel(`preview-updates-${draftId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'draft_projects',
            filter: `id=eq.${draftId}`
          },
          (payload) => {
            // Send code update to client
            const metadata = payload.new.metadata
            if (metadata?.component_code) {
              controller.enqueue(encoder.encode(
                `data: ${JSON.stringify({
                  type: 'code_update',
                  code: metadata.component_code,
                  timestamp: new Date().toISOString()
                })}\n\n`
              ))
            }
          }
        )
        .subscribe()

      // Keep connection alive with heartbeat
      const heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'heartbeat' })}\n\n`))
        } catch (e) {
          // Connection closed
          clearInterval(heartbeatInterval)
          channel.unsubscribe()
        }
      }, 30000) // Every 30 seconds

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeatInterval)
        channel.unsubscribe()
        controller.close()
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no' // Disable buffering for nginx
    }
  })
}





