import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    console.log('PWA cache events: GET request received');
    
    // Check if this is an SSE request (EventSource)
    const acceptHeader = req.headers.get('accept');
    const isSSE = acceptHeader?.includes('text/event-stream');
    
    if (isSSE) {
      console.log('PWA cache events: SSE connection requested');
      
      // Create a Server-Sent Events response
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          // Send initial connection event
          const data = {
            type: 'connected',
            timestamp: new Date().toISOString(),
            message: 'PWA cache events SSE connection established'
          };
          
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          
          // Send periodic heartbeat
          const heartbeat = setInterval(() => {
            const heartbeatData = {
              type: 'heartbeat',
              timestamp: new Date().toISOString()
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(heartbeatData)}\n\n`));
          }, 30000); // 30 seconds
          
          // Cleanup on connection close
          req.signal.addEventListener('abort', () => {
            clearInterval(heartbeat);
            controller.close();
          });
        }
      });
      
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Cache-Control',
        },
      });
    }
    
    // Regular JSON response for non-SSE requests
    const response = {
      success: true,
      message: 'PWA cache events endpoint working',
      timestamp: new Date().toISOString(),
      events: [],
      sse: false
    };
    
    console.log('PWA cache events: JSON response prepared:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('PWA cache events error:', error);
    console.error('PWA cache events stack:', error instanceof Error ? error.stack : 'No stack available');
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('PWA cache event received:', body);
    
    // Handle cache events (e.g., cache updates, sync events)
    return NextResponse.json({
      success: true,
      message: 'Cache event processed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('PWA cache event processing error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process cache event' },
      { status: 500 }
    );
  }
}
