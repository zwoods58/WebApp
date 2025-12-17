/**
 * Yjs Integration for CRDT-based Collaboration
 * P1 Feature 11: Real-time Collaboration - Yjs/CRDT
 */

// Note: This requires installing 'yjs' and 'y-websocket' packages
// npm install yjs y-websocket

import * as Y from 'yjs'

export interface YjsDocument {
  ydoc: Y.Doc
  ytext: Y.Text
  ymap: Y.Map<any>
}

class YjsManager {
  private documents: Map<string, YjsDocument> = new Map()

  /**
   * Create or get Yjs document for project
   */
  getDocument(projectId: string): YjsDocument {
    if (this.documents.has(projectId)) {
      return this.documents.get(projectId)!
    }

    const ydoc = new Y.Doc()
    const ytext = ydoc.getText('code')
    const ymap = ydoc.getMap('metadata')

    const document: YjsDocument = { ydoc, ytext, ymap }
    this.documents.set(projectId, document)

    return document
  }

  /**
   * Initialize Yjs with WebSocket provider
   */
  async initializeProvider(
    projectId: string,
    wsUrl: string
  ): Promise<void> {
    // Dynamic import to avoid bundling in server-side code
    if (typeof window === 'undefined') {
      return
    }

    try {
      const { WebsocketProvider } = await import('y-websocket')
      const doc = this.getDocument(projectId)

      const provider = new WebsocketProvider(wsUrl, `project-${projectId}`, doc.ydoc)

      provider.on('status', (event: any) => {
        console.log('Yjs provider status:', event.status)
      })

      return new Promise((resolve) => {
        provider.once('synced', () => {
          console.log('Yjs document synced')
          resolve()
        })
      })
    } catch (error) {
      console.error('Failed to initialize Yjs provider:', error)
      throw error
    }
  }

  /**
   * Get text content from Yjs document
   */
  getText(projectId: string): string {
    const doc = this.getDocument(projectId)
    return doc.ytext.toString()
  }

  /**
   * Update text content
   */
  updateText(projectId: string, text: string): void {
    const doc = this.getDocument(projectId)
    doc.ytext.delete(0, doc.ytext.length)
    doc.ytext.insert(0, text)
  }

  /**
   * Subscribe to text changes
   */
  onTextChange(
    projectId: string,
    callback: (text: string) => void
  ): () => void {
    const doc = this.getDocument(projectId)

    const handler = () => {
      callback(doc.ytext.toString())
    }

    doc.ytext.observe(handler)

    return () => {
      doc.ytext.unobserve(handler)
    }
  }

  /**
   * Get metadata
   */
  getMetadata(projectId: string): Record<string, any> {
    const doc = this.getDocument(projectId)
    return doc.ymap.toJSON()
  }

  /**
   * Update metadata
   */
  updateMetadata(projectId: string, key: string, value: any): void {
    const doc = this.getDocument(projectId)
    doc.ymap.set(key, value)
  }

  /**
   * Destroy document
   */
  destroy(projectId: string): void {
    const doc = this.documents.get(projectId)
    if (doc) {
      doc.ydoc.destroy()
      this.documents.delete(projectId)
    }
  }
}

// Singleton instance
let yjsManager: YjsManager | null = null

export function getYjsManager(): YjsManager {
  if (!yjsManager) {
    yjsManager = new YjsManager()
  }
  return yjsManager
}





