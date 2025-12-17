/**
 * API Documentation Generator
 * P1 Feature 15: API Design - API Documentation
 */

export interface APIEndpoint {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  description: string
  parameters?: Array<{
    name: string
    type: string
    required: boolean
    description: string
    location: 'query' | 'path' | 'body' | 'header'
  }>
  requestBody?: {
    contentType: string
    schema: any
  }
  responses: Array<{
    status: number
    description: string
    schema?: any
  }>
  authRequired: boolean
  rateLimit?: {
    requests: number
    window: string
  }
}

export interface WebSocketEvent {
  event: string
  description: string
  payload?: any
  direction: 'client-to-server' | 'server-to-client' | 'bidirectional'
}

class APIDocumentation {
  private endpoints: Map<string, APIEndpoint> = new Map()
  private websocketEvents: Map<string, WebSocketEvent> = new Map()

  /**
   * Register API endpoint
   */
  registerEndpoint(endpoint: APIEndpoint): void {
    const key = `${endpoint.method}:${endpoint.path}`
    this.endpoints.set(key, endpoint)
  }

  /**
   * Register WebSocket event
   */
  registerWebSocketEvent(event: WebSocketEvent): void {
    this.websocketEvents.set(event.event, event)
  }

  /**
   * Generate OpenAPI/Swagger specification
   */
  generateOpenAPISpec(): any {
    const paths: Record<string, any> = {}

    this.endpoints.forEach((endpoint) => {
      if (!paths[endpoint.path]) {
        paths[endpoint.path] = {}
      }

      const operation: any = {
        summary: endpoint.description,
        operationId: `${endpoint.method.toLowerCase()}_${endpoint.path.replace(/\//g, '_').replace(/:/g, '')}`,
        tags: [endpoint.path.split('/')[1] || 'default'],
        responses: {}
      }

      // Add parameters
      if (endpoint.parameters) {
        operation.parameters = endpoint.parameters.map(param => ({
          name: param.name,
          in: param.location,
          required: param.required,
          description: param.description,
          schema: { type: param.type }
        }))
      }

      // Add request body
      if (endpoint.requestBody) {
        operation.requestBody = {
          content: {
            [endpoint.requestBody.contentType]: {
              schema: endpoint.requestBody.schema
            }
          }
        }
      }

      // Add responses
      endpoint.responses.forEach(response => {
        operation.responses[response.status] = {
          description: response.description,
          content: response.schema ? {
            'application/json': {
              schema: response.schema
            }
          } : undefined
        }
      })

      // Add security
      if (endpoint.authRequired) {
        operation.security = [{ bearerAuth: [] }]
      }

      paths[endpoint.path][endpoint.method.toLowerCase()] = operation
    })

    return {
      openapi: '3.0.0',
      info: {
        title: 'AI Builder API',
        version: '1.0.0',
        description: 'API documentation for AI Website Builder'
      },
      servers: [
        {
          url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          description: 'Production server'
        }
      ],
      paths,
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    }
  }

  /**
   * Generate WebSocket events documentation
   */
  generateWebSocketDocs(): any {
    const events: Record<string, any> = {}

    this.websocketEvents.forEach((event) => {
      events[event.event] = {
        description: event.description,
        direction: event.direction,
        payload: event.payload
      }
    })

    return {
      version: '1.0.0',
      events
    }
  }

  /**
   * Get all endpoints
   */
  getAllEndpoints(): APIEndpoint[] {
    return Array.from(this.endpoints.values())
  }

  /**
   * Get all WebSocket events
   */
  getAllWebSocketEvents(): WebSocketEvent[] {
    return Array.from(this.websocketEvents.values())
  }
}

// Singleton instance
let apiDocumentation: APIDocumentation | null = null

export function getAPIDocumentation(): APIDocumentation {
  if (!apiDocumentation) {
    apiDocumentation = new APIDocumentation()
  }
  return apiDocumentation
}





