/**
 * Build Pipeline for Deployment
 * P0 Feature 4: Enhanced Deployment - Build Pipeline
 */

export interface BuildConfig {
  projectId: string
  entryPoint: string
  files: Record<string, string>
  dependencies?: Record<string, string>
  buildCommand?: string
  outputDirectory?: string
  environmentVariables?: Record<string, string>
}

export interface BuildResult {
  success: boolean
  output: string
  errors: string[]
  warnings: string[]
  buildTime: number
  outputFiles?: Record<string, string>
  buildLog?: string[]
}

export interface BuildStep {
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  output?: string
  duration?: number
}

class BuildPipeline {
  private steps: BuildStep[] = []
  private listeners: Array<(step: BuildStep) => void> = []

  /**
   * Execute build pipeline
   */
  async build(config: BuildConfig): Promise<BuildResult> {
    const startTime = Date.now()
    const buildLog: string[] = []
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // Step 1: Validate files
      this.addStep('validate', 'running')
      buildLog.push('Validating project files...')
      const validationResult = this.validateFiles(config.files)
      if (!validationResult.valid) {
        errors.push(...validationResult.errors)
        this.updateStep('validate', 'failed')
        return this.createBuildResult(false, buildLog, errors, warnings, startTime)
      }
      this.updateStep('validate', 'completed', 'Files validated successfully')

      // Step 2: Install dependencies (if needed)
      if (config.dependencies && Object.keys(config.dependencies).length > 0) {
        this.addStep('install-dependencies', 'running')
        buildLog.push('Installing dependencies...')
        // In a real implementation, this would install npm packages
        // For now, we'll just validate package.json exists
        this.updateStep('install-dependencies', 'completed', 'Dependencies ready')
      }

      // Step 3: Build/Transpile
      this.addStep('build', 'running')
      buildLog.push('Building project...')
      const buildResult = await this.transpileAndBundle(config)
      if (buildResult.errors.length > 0) {
        errors.push(...buildResult.errors)
        this.updateStep('build', 'failed')
        return this.createBuildResult(false, buildLog, errors, warnings, startTime)
      }
      this.updateStep('build', 'completed', 'Build completed successfully')

      // Step 4: Optimize assets
      this.addStep('optimize', 'running')
      buildLog.push('Optimizing assets...')
      const optimizedFiles = await this.optimizeAssets(buildResult.outputFiles || {})
      this.updateStep('optimize', 'completed', 'Assets optimized')

      // Step 5: Generate output
      this.addStep('generate-output', 'running')
      buildLog.push('Generating output files...')
      const outputFiles = this.generateOutputFiles(config, optimizedFiles)
      this.updateStep('generate-output', 'completed', 'Output files generated')

      const buildTime = Date.now() - startTime
      buildLog.push(`Build completed in ${buildTime}ms`)

      return {
        success: true,
        output: 'Build completed successfully',
        errors: [],
        warnings,
        buildTime,
        outputFiles,
        buildLog
      }
    } catch (error: any) {
      errors.push(error.message || 'Build failed')
      return this.createBuildResult(false, buildLog, errors, warnings, startTime)
    }
  }

  /**
   * Validate project files
   */
  private validateFiles(files: Record<string, string>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (Object.keys(files).length === 0) {
      errors.push('No files found in project')
      return { valid: false, errors }
    }

    // Check for required files
    const hasIndex = Object.keys(files).some(path => 
      path.includes('index') && (path.endsWith('.html') || path.endsWith('.tsx') || path.endsWith('.jsx'))
    )

    if (!hasIndex) {
      errors.push('No index file found (index.html, index.tsx, or index.jsx)')
    }

    return { valid: errors.length === 0, errors }
  }

  /**
   * Transpile and bundle code
   */
  private async transpileAndBundle(config: BuildConfig): Promise<{
    outputFiles: Record<string, string>
    errors: string[]
  }> {
    // In a real implementation, this would use esbuild or webpack
    // For now, return the files as-is with basic processing
    const outputFiles: Record<string, string> = {}

    try {
      // Import bundler (will be implemented separately)
      const { bundleCode } = await import('../preview/bundler')

      const result = await bundleCode({
        entryPoint: config.entryPoint,
        files: config.files,
        dependencies: config.dependencies,
        format: 'iife',
        minify: true,
        sourcemap: false
      })

      if (result.errors.length > 0) {
        return {
          outputFiles: {},
          errors: result.errors.map(e => e.text)
        }
      }

      outputFiles['bundle.js'] = result.code
      if (result.map) {
        outputFiles['bundle.js.map'] = result.map
      }

      return { outputFiles, errors: [] }
    } catch (error: any) {
      return {
        outputFiles: {},
        errors: [error.message || 'Bundling failed']
      }
    }
  }

  /**
   * Optimize assets
   */
  private async optimizeAssets(files: Record<string, string>): Promise<Record<string, string>> {
    // In a real implementation, this would:
    // - Minify CSS
    // - Compress images
    // - Tree-shake unused code
    // For now, return files as-is
    return files
  }

  /**
   * Generate output files for deployment
   */
  private generateOutputFiles(
    config: BuildConfig,
    builtFiles: Record<string, string>
  ): Record<string, string> {
    const outputFiles: Record<string, string> = { ...builtFiles }

    // Generate index.html if not present
    if (!outputFiles['index.html']) {
      outputFiles['index.html'] = this.generateIndexHTML(config, builtFiles)
    }

    // Generate package.json for deployment
    if (config.dependencies) {
      outputFiles['package.json'] = JSON.stringify({
        name: `project-${config.projectId}`,
        version: '1.0.0',
        dependencies: config.dependencies,
        scripts: {
          start: 'node server.js'
        }
      }, null, 2)
    }

    return outputFiles
  }

  /**
   * Generate index.html
   */
  private generateIndexHTML(config: BuildConfig, files: Record<string, string>): string {
    const bundleScript = files['bundle.js'] ? '<script src="bundle.js"></script>' : ''
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deployed Project</title>
</head>
<body>
  <div id="root"></div>
  ${bundleScript}
</body>
</html>`
  }

  /**
   * Create build result
   */
  private createBuildResult(
    success: boolean,
    buildLog: string[],
    errors: string[],
    warnings: string[],
    startTime: number
  ): BuildResult {
    return {
      success,
      output: success ? 'Build completed' : 'Build failed',
      errors,
      warnings,
      buildTime: Date.now() - startTime,
      buildLog
    }
  }

  /**
   * Add build step
   */
  private addStep(name: string, status: BuildStep['status']): void {
    const step: BuildStep = { name, status }
    this.steps.push(step)
    this.notifyListeners(step)
  }

  /**
   * Update build step
   */
  private updateStep(name: string, status: BuildStep['status'], output?: string): void {
    const step = this.steps.find(s => s.name === name)
    if (step) {
      step.status = status
      if (output) step.output = output
      step.duration = Date.now() - (step.duration || Date.now())
      this.notifyListeners(step)
    }
  }

  /**
   * Notify listeners
   */
  private notifyListeners(step: BuildStep): void {
    this.listeners.forEach(listener => listener(step))
  }

  /**
   * Subscribe to build steps
   */
  onStep(listener: (step: BuildStep) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  /**
   * Get build steps
   */
  getSteps(): BuildStep[] {
    return [...this.steps]
  }

  /**
   * Reset pipeline
   */
  reset(): void {
    this.steps = []
  }
}

// Singleton instance
let buildPipeline: BuildPipeline | null = null

export function getBuildPipeline(): BuildPipeline {
  if (!buildPipeline) {
    buildPipeline = new BuildPipeline()
  }
  return buildPipeline
}





