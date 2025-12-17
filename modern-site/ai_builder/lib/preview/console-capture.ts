/**
 * Console Capture for Live Preview
 * P0 Feature 2: Enhanced Live Preview - Console Capture
 */

export interface ConsoleMessage {
  type: 'log' | 'error' | 'warn' | 'info' | 'debug'
  message: string
  args: any[]
  timestamp: number
  stack?: string
}

class ConsoleCapture {
  private originalConsole: Console
  private messages: ConsoleMessage[] = []
  private listeners: Array<(message: ConsoleMessage) => void> = []
  private maxMessages = 1000

  constructor() {
    this.originalConsole = console
  }

  /**
   * Start capturing console messages
   */
  start(): void {
    // Override console methods
    console.log = (...args: any[]) => {
      this.capture('log', args)
      this.originalConsole.log(...args)
    }

    console.error = (...args: any[]) => {
      this.capture('error', args)
      this.originalConsole.error(...args)
    }

    console.warn = (...args: any[]) => {
      this.capture('warn', args)
      this.originalConsole.warn(...args)
    }

    console.info = (...args: any[]) => {
      this.capture('info', args)
      this.originalConsole.info(...args)
    }

    console.debug = (...args: any[]) => {
      this.capture('debug', args)
      this.originalConsole.debug(...args)
    }
  }

  /**
   * Stop capturing console messages
   */
  stop(): void {
    console.log = this.originalConsole.log
    console.error = this.originalConsole.error
    console.warn = this.originalConsole.warn
    console.info = this.originalConsole.info
    console.debug = this.originalConsole.debug
  }

  /**
   * Capture a console message
   */
  private capture(type: ConsoleMessage['type'], args: any[]): void {
    const message: ConsoleMessage = {
      type,
      message: args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2)
          } catch {
            return String(arg)
          }
        }
        return String(arg)
      }).join(' '),
      args,
      timestamp: Date.now(),
      stack: type === 'error' ? new Error().stack : undefined
    }

    this.messages.push(message)

    // Limit message count
    if (this.messages.length > this.maxMessages) {
      this.messages.shift()
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(message))
  }

  /**
   * Get all captured messages
   */
  getMessages(): ConsoleMessage[] {
    return [...this.messages]
  }

  /**
   * Clear all messages
   */
  clear(): void {
    this.messages = []
  }

  /**
   * Subscribe to new messages
   */
  onMessage(listener: (message: ConsoleMessage) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  /**
   * Get messages filtered by type
   */
  getMessagesByType(type: ConsoleMessage['type']): ConsoleMessage[] {
    return this.messages.filter(m => m.type === type)
  }
}

// Singleton instance
let consoleCapture: ConsoleCapture | null = null

export function getConsoleCapture(): ConsoleCapture {
  if (!consoleCapture) {
    consoleCapture = new ConsoleCapture()
  }
  return consoleCapture
}





