/**
 * Web Workers for Code Execution
 * P1 Feature 16: Code Execution Engine - Web Workers
 */

export interface WorkerMessage {
  type: 'execute' | 'result' | 'error' | 'progress'
  id: string
  payload?: any
}

/**
 * Execute code in Web Worker
 */
export function executeInWorker(code: string, dependencies: Record<string, any> = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const workerCode = `
      // Import dependencies
      ${Object.entries(dependencies).map(([name, value]) => {
        if (typeof value === 'string') {
          return `importScripts('${value}');`
        }
        return `const ${name} = ${JSON.stringify(value)};`
      }).join('\n')}

      // Listen for messages
      self.onmessage = function(e) {
        const { id, code } = e.data;
        
        try {
          // Execute code in isolated context
          const result = eval(code);
          self.postMessage({
            type: 'result',
            id,
            payload: result
          });
        } catch (error) {
          self.postMessage({
            type: 'error',
            id,
            payload: {
              message: error.message,
              stack: error.stack
            }
          });
        }
      };
    `

    const blob = new Blob([workerCode], { type: 'application/javascript' })
    const worker = new Worker(URL.createObjectURL(blob))
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    worker.onmessage = (e) => {
      const message: WorkerMessage = e.data
      if (message.id === messageId) {
        if (message.type === 'result') {
          resolve(message.payload)
        } else if (message.type === 'error') {
          reject(new Error(message.payload.message))
        }
        worker.terminate()
        URL.revokeObjectURL(blob.url)
      }
    }

    worker.onerror = (error) => {
      reject(error)
      worker.terminate()
      URL.revokeObjectURL(blob.url)
    }

    worker.postMessage({
      id: messageId,
      code
    })
  })
}

/**
 * Create dedicated worker for heavy computations
 */
export function createComputationWorker(): Worker {
  const workerCode = `
    self.onmessage = function(e) {
      const { type, payload } = e.data;
      
      switch (type) {
        case 'COMPUTE':
          try {
            const result = payload.fn(payload.data);
            self.postMessage({
              type: 'RESULT',
              payload: result
            });
          } catch (error) {
            self.postMessage({
              type: 'ERROR',
              payload: { message: error.message }
            });
          }
          break;
      }
    };
  `

  const blob = new Blob([workerCode], { type: 'application/javascript' })
  return new Worker(URL.createObjectURL(blob))
}





