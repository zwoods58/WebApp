/**
 * Network Inspector for Live Preview
 * P0 Feature 2: Enhanced Live Preview - Network Inspection
 */

export interface NetworkRequest {
  id: string
  url: string
  method: string
  headers: Record<string, string>
  body?: any
  timestamp: number
  status?: number
  statusText?: string
  response?: any
  responseHeaders?: Record<string, string>
  duration?: number
  error?: string
}

class NetworkInspector {
  private requests: NetworkRequest[] = []
  private listeners: Array<(request: NetworkRequest) => void> = []
  private maxRequests = 500
  private originalFetch: typeof fetch

  constructor() {
    this.originalFetch = window.fetch
  }

  /**
   * Start intercepting network requests
   */
  start(): void {
    // Intercept fetch
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
      const method = init?.method || 'GET'
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const startTime = Date.now()

      const request: NetworkRequest = {
        id: requestId,
        url,
        method,
        headers: init?.headers as Record<string, string> || {},
        body: init?.body,
        timestamp: startTime
      }

      try {
        const response = await this.originalFetch(input, init)
        const endTime = Date.now()
        const duration = endTime - startTime

        // Clone response to read body
        const clonedResponse = response.clone()
        let responseBody: any = null

        try {
          const contentType = response.headers.get('content-type') || ''
          if (contentType.includes('application/json')) {
            responseBody = await clonedResponse.json()
          } else if (contentType.includes('text/')) {
            responseBody = await clonedResponse.text()
          }
        } catch {
          // Failed to parse response body
        }

        const headers: Record<string, string> = {}
        response.headers.forEach((value, key) => {
          headers[key] = value
        })

        const completedRequest: NetworkRequest = {
          ...request,
          status: response.status,
          statusText: response.statusText,
          response: responseBody,
          responseHeaders: headers,
          duration
        }

        this.addRequest(completedRequest)
        return response
      } catch (error: any) {
        const endTime = Date.now()
        const failedRequest: NetworkRequest = {
          ...request,
          error: error.message || 'Request failed',
          duration: endTime - startTime
        }
        this.addRequest(failedRequest)
        throw error
      }
    }
  }

  /**
   * Stop intercepting network requests
   */
  stop(): void {
    window.fetch = this.originalFetch
  }

  /**
   * Add a network request
   */
  private addRequest(request: NetworkRequest): void {
    this.requests.push(request)

    // Limit request count
    if (this.requests.length > this.maxRequests) {
      this.requests.shift()
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(request))
  }

  /**
   * Get all network requests
   */
  getRequests(): NetworkRequest[] {
    return [...this.requests]
  }

  /**
   * Clear all requests
   */
  clear(): void {
    this.requests = []
  }

  /**
   * Subscribe to new requests
   */
  onRequest(listener: (request: NetworkRequest) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  /**
   * Get requests filtered by status
   */
  getRequestsByStatus(status: number): NetworkRequest[] {
    return this.requests.filter(r => r.status === status)
  }

  /**
   * Get failed requests
   */
  getFailedRequests(): NetworkRequest[] {
    return this.requests.filter(r => r.error || (r.status && r.status >= 400))
  }
}

// Singleton instance
let networkInspector: NetworkInspector | null = null

export function getNetworkInspector(): NetworkInspector {
  if (!networkInspector && typeof window !== 'undefined') {
    networkInspector = new NetworkInspector()
  }
  return networkInspector!
}





