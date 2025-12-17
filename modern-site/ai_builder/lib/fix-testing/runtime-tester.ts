/**
 * Runtime Tester - Puppeteer Integration
 * P0 Feature 5: Post-Application Testing - Runtime Testing
 */

// Note: Requires puppeteer: npm install puppeteer

export interface RuntimeTestResult {
  passed: boolean
  errors: Array<{
    type: string
    message: string
    stack?: string
  }>
  consoleErrors: string[]
  duration: number
}

/**
 * Test runtime in headless browser
 */
export async function testRuntime(
  previewUrl: string,
  timeout: number = 5000
): Promise<RuntimeTestResult> {
  const startTime = Date.now()
  const errors: Array<{ type: string; message: string; stack?: string }> = []
  const consoleErrors: string[] = []

  // Dynamic import to avoid bundling in client
  if (typeof window !== 'undefined') {
    // Client-side: return mock result
    return {
      passed: true,
      errors: [],
      consoleErrors: [],
      duration: Date.now() - startTime
    }
  }

  try {
    const puppeteer = await import('puppeteer')
    const browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()

    // Capture errors
    page.on('pageerror', (error) => {
      errors.push({
        type: 'pageerror',
        message: error.message,
        stack: error.stack
      })
    })

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // Navigate to preview
    await page.goto(previewUrl, {
      waitUntil: 'networkidle0',
      timeout
    })

    // Wait for app to load
    try {
      await page.waitForSelector('#root', { timeout: 5000 })
    } catch {
      // Root element might not exist, continue
    }

    // Wait a bit for any async errors
    await page.waitForTimeout(2000)

    await browser.close()

    return {
      passed: errors.length === 0 && consoleErrors.length === 0,
      errors,
      consoleErrors,
      duration: Date.now() - startTime
    }
  } catch (error: any) {
    return {
      passed: false,
      errors: [{
        type: 'test-error',
        message: error.message || 'Runtime test failed'
      }],
      consoleErrors: [],
      duration: Date.now() - startTime
    }
  }
}





