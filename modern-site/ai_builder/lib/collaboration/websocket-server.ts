/**
 * WebSocket Server for Real-time Collaboration
 * P1 Feature 11: Real-time Collaboration - WebSocket
 */

// Note: This is a client-side WebSocket client
// For server-side WebSocket server, you'd use Socket.io or similar

export interface CollaborationMessage {
  type: 'cursor' | 'edit' | 'presence' | 'chat' | 'comment'
  userId: string
  projectId: string
  payload: any
  timestamp: number
}

class CollaborationClient {
  private ws: WebSocket | null = null
  private listeners: Map<string, Array<(message: CollaborationMessage) => void>> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  /**
   * Connect to WebSocket server
   */
  connect(projectId: string, userId: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || `ws://localhost:3001`
    this.ws = new WebSocket(`${wsUrl}/collaboration/${projectId}?userId=${userId}`)

    this.ws.onopen = () => {
      console.log('✅ WebSocket connected')
      this.reconnectAttempts = 0
      this.send({
        type: 'presence',
        userId,
        projectId,
        payload: { action: 'join' },
        timestamp: Date.now()
      })
    }

    this.ws.onmessage = (event) => {
      try {
        const message: CollaborationMessage = JSON.parse(event.data)
        this.handleMessage(message)
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    this.ws.onclose = () => {
      console.log('WebSocket disconnected')
      this.attemptReconnect(projectId, userId)
    }
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect(projectId: string, userId: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    setTimeout(() => {
      console.log(`Reconnecting... (attempt ${this.reconnectAttempts})`)
      this.connect(projectId, userId)
    }, this.reconnectDelay * this.reconnectAttempts)
  }

  /**
   * Handle incoming message
   */
  private handleMessage(message: CollaborationMessage): void {
    const listeners = this.listeners.get(message.type) || []
    listeners.forEach(listener => listener(message))
  }

  /**
   * Send message
   */
  send(message: CollaborationMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
  }

  /**
   * Subscribe to message type
   */
  on(type: CollaborationMessage['type'], listener: (message: CollaborationMessage) => void): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, [])
    }
    this.listeners.get(type)!.push(listener)

    return () => {
      const listeners = this.listeners.get(type) || []
      this.listeners.set(type, listeners.filter(l => l !== listener))
    }
  }

  /**
   * Broadcast cursor position
   */
  broadcastCursor(projectId: string, userId: string, position: { line: number; column: number }): void {
    this.send({
      type: 'cursor',
      userId,
      projectId,
      payload: position,
      timestamp: Date.now()
    })
  }

  /**
   * Broadcast edit
   */
  broadcastEdit(
    projectId: string,
    userId: string,
    edit: { fileId: string; change: any }
  ): void {
    this.send({
      type: 'edit',
      userId,
      projectId,
      payload: edit,
      timestamp: Date.now()
    })
  }

  /**
   * Send chat message
   */
  sendChatMessage(projectId: string, userId: string, content: string): void {
    this.send({
      type: 'chat',
      userId,
      projectId,
      payload: { content },
      timestamp: Date.now()
    })
  }

  /**
   * Disconnect
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.listeners.clear()
  }
}

// Singleton instance
let collaborationClient: CollaborationClient | null = null

export function getCollaborationClient(): CollaborationClient {
  if (!collaborationClient && typeof window !== 'undefined') {
    collaborationClient = new CollaborationClient()
  }
  return collaborationClient!
}





