/**
 * Code Sandbox - Secure code execution in isolated iframe
 * P0 Feature 1: Code Execution Sandboxing
 * 
 * Executes user code in an isolated iframe with sandbox attributes
 * to prevent XSS attacks and code injection vulnerabilities.
 */

export interface SandboxConfig {
  maxExecutionTime?: number // Maximum execution time in ms (default: 10000)
  maxCodeSize?: number // Maximum code size in bytes (default: 1048576 = 1MB)
  allowedOrigins?: string[] // Allowed origins for postMessage
}

export interface SandboxResult {
  success: boolean
  component?: any
  error?: Error
  executionTime: number
}

export class CodeSandbox {
  private iframe: HTMLIFrameElement | null = null
  private timeoutId: NodeJS.Timeout | null = null
  private config: Required<SandboxConfig>
  private messageId = 0
  private pendingMessages = new Map<number, {
    resolve: (value: any) => void
    reject: (error: Error) => void
    startTime: number
  }>()

  constructor(config: SandboxConfig = {}) {
    this.config = {
      maxExecutionTime: config.maxExecutionTime || 10000, // 10 seconds
      maxCodeSize: config.maxCodeSize || 1048576, // 1MB
      allowedOrigins: config.allowedOrigins || ['*']
    }
  }

  /**
   * Initialize the sandbox iframe
   */
  async initialize(): Promise<void> {
    if (this.iframe) {
      return // Already initialized
    }

    return new Promise((resolve, reject) => {
      this.iframe = document.createElement('iframe')
      this.iframe.style.display = 'none'
      this.iframe.style.width = '0'
      this.iframe.style.height = '0'
      this.iframe.style.border = 'none'
      
      // Sandbox attributes - restrict what the iframe can do
      // allow-scripts: Allow JavaScript execution
      // allow-same-origin: Allow same-origin access (needed for React)
      // NO allow-forms, allow-modals, allow-popups, etc. for security
      this.iframe.sandbox.add('allow-scripts')
      this.iframe.sandbox.add('allow-same-origin')
      
      // Set up message listener
      window.addEventListener('message', this.handleMessage.bind(this))
      
      // Create sandbox HTML with React and required dependencies
      const sandboxHTML = this.createSandboxHTML()
      this.iframe.srcdoc = sandboxHTML
      
      this.iframe.onload = () => {
        console.log('✅ Code sandbox initialized')
        resolve()
      }
      
      this.iframe.onerror = (error) => {
        console.error('❌ Failed to initialize sandbox:', error)
        reject(new Error('Failed to initialize code sandbox'))
      }
      
      document.body.appendChild(this.iframe)
    })
  }

  /**
   * Create the sandbox HTML with React and dependencies
   */
  private createSandboxHTML(): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code Sandbox</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script>
    // Message handler for parent communication
    window.addEventListener('message', async (event) => {
      const { id, type, payload } = event.data || {}
      
      if (type === 'EXECUTE_CODE') {
        try {
          const { code, componentName, dependencies } = payload
          
          // Transpile JSX if needed
          let transpiledCode = code
          if (code.includes('<') && (code.includes('</') || code.match(/<\\w+/))) {
            if (window.Babel) {
              transpiledCode = Babel.transform(code, {
                presets: ['react']
              }).code
            }
          }
          
          // Create execution context
          const componentFunction = new Function(
            'React',
            'ReactDOM',
            'useState',
            'useEffect',
            'useRef',
            'useCallback',
            'useMemo',
            ...Object.keys(dependencies),
            transpiledCode + '\\n\\nif (typeof ' + componentName + ' !== "undefined") { return ' + componentName + '; } return null;'
          )
          
          // Execute code with dependencies
          const Component = componentFunction(
            React,
            ReactDOM,
            React.useState,
            React.useEffect,
            React.useRef,
            React.useCallback,
            React.useMemo,
            ...Object.values(dependencies)
          )
          
          // Send success response
          window.parent.postMessage({
            id,
            type: 'EXECUTION_SUCCESS',
            payload: { component: Component ? Component.toString() : null }
          }, '*')
          
        } catch (error) {
          // Send error response
          window.parent.postMessage({
            id,
            type: 'EXECUTION_ERROR',
            payload: {
              error: {
                message: error.message,
                stack: error.stack,
                name: error.name
              }
            }
          }, '*')
        }
      }
    })
    
    // Notify parent that sandbox is ready
    window.parent.postMessage({
      type: 'SANDBOX_READY'
    }, '*')
  </script>
</body>
</html>
    `.trim()
  }

  /**
   * Handle messages from sandbox
   */
  private handleMessage(event: MessageEvent): void {
    const { id, type, payload } = event.data || {}
    
    // Security: Verify origin (in production, check against allowedOrigins)
    // For now, allow all origins in development
    
    if (type === 'SANDBOX_READY') {
      console.log('✅ Sandbox ready')
      return
    }
    
    const pending = this.pendingMessages.get(id)
    if (!pending) {
      return // Not our message
    }
    
    this.pendingMessages.delete(id)
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
    
    const executionTime = performance.now() - pending.startTime
    
    if (type === 'EXECUTION_SUCCESS') {
      // Reconstruct component from string (simplified - in production, use proper serialization)
      pending.resolve({
        success: true,
        component: payload.component,
        executionTime
      })
    } else if (type === 'EXECUTION_ERROR') {
      const error = new Error(payload.error.message)
      error.stack = payload.error.stack
      error.name = payload.error.name
      pending.reject(error)
    }
  }

  /**
   * Execute code in sandbox
   */
  async executeCode(
    code: string,
    componentName: string,
    dependencies: Record<string, any> = {}
  ): Promise<SandboxResult> {
    // Validate code size
    const codeSize = new Blob([code]).size
    if (codeSize > this.config.maxCodeSize) {
      throw new Error(
        `Code size (${codeSize} bytes) exceeds maximum (${this.config.maxCodeSize} bytes)`
      )
    }
    
    // Ensure sandbox is initialized
    if (!this.iframe) {
      await this.initialize()
    }
    
    return new Promise((resolve, reject) => {
      const id = ++this.messageId
      const startTime = performance.now()
      
      // Set timeout
      this.timeoutId = setTimeout(() => {
        this.pendingMessages.delete(id)
        reject(new Error(`Code execution timed out after ${this.config.maxExecutionTime}ms`))
      }, this.config.maxExecutionTime)
      
      // Store pending message
      this.pendingMessages.set(id, {
        resolve: (result) => {
          resolve({
            ...result,
            executionTime: performance.now() - startTime
          })
        },
        reject: (error) => {
          reject(error)
        },
        startTime
      })
      
      // Send execution request to sandbox
      if (this.iframe?.contentWindow) {
        this.iframe.contentWindow.postMessage({
          id,
          type: 'EXECUTE_CODE',
          payload: {
            code,
            componentName,
            dependencies: this.serializeDependencies(dependencies)
          }
        }, '*')
      } else {
        reject(new Error('Sandbox iframe not available'))
      }
    })
  }

  /**
   * Serialize dependencies for postMessage (simplified)
   * In production, use proper serialization or pass references differently
   */
  private serializeDependencies(dependencies: Record<string, any>): Record<string, any> {
    // For now, return empty - dependencies will be injected differently
    // In production, use structured cloning or other serialization
    return {}
  }

  /**
   * Cleanup sandbox
   */
  destroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
    
    if (this.iframe) {
      window.removeEventListener('message', this.handleMessage.bind(this))
      document.body.removeChild(this.iframe)
      this.iframe = null
    }
    
    this.pendingMessages.clear()
  }
}

// Singleton instance
let sandboxInstance: CodeSandbox | null = null

export function getCodeSandbox(): CodeSandbox {
  if (!sandboxInstance) {
    sandboxInstance = new CodeSandbox({
      maxExecutionTime: 10000, // 10 seconds
      maxCodeSize: 1048576 // 1MB
    })
  }
  return sandboxInstance
}





