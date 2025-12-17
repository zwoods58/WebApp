/**
 * In-Browser Bundler using esbuild-wasm
 * P0 Feature 2: Enhanced Live Preview - Bundling
 */

// Dynamic import of esbuild-wasm
let esbuild: any = null
let esbuildInitialized = false

async function initializeEsbuild() {
  if (esbuildInitialized) return

  try {
    // @ts-ignore - esbuild-wasm is loaded dynamically
    esbuild = await import('esbuild-wasm')
    await esbuild.initialize({
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.19.0/esbuild.wasm'
    })
    esbuildInitialized = true
    console.log('✅ esbuild-wasm initialized')
  } catch (error) {
    console.error('Failed to initialize esbuild-wasm:', error)
    throw error
  }
}

export interface BundleOptions {
  entryPoint: string
  files: Record<string, string>
  dependencies?: Record<string, string>
  format?: 'esm' | 'cjs' | 'iife'
  minify?: boolean
  sourcemap?: boolean
}

export interface BundleResult {
  code: string
  map?: string
  errors: Array<{
    text: string
    location?: {
      file: string
      line: number
      column: number
    }
  }>
  warnings: Array<{
    text: string
    location?: {
      file: string
      line: number
      column: number
    }
  }>
}

/**
 * Bundle code using esbuild-wasm
 */
export async function bundleCode(options: BundleOptions): Promise<BundleResult> {
  await initializeEsbuild()

  try {
    // Create a virtual file system plugin
    const virtualFiles: Record<string, string> = {}
    
    // Add all files to virtual FS
    Object.entries(options.files).forEach(([path, content]) => {
      virtualFiles[path] = content
    })

    // Build with esbuild
    const result = await esbuild.build({
      entryPoints: [options.entryPoint],
      bundle: true,
      format: options.format || 'iife',
      minify: options.minify || false,
      sourcemap: options.sourcemap || false,
      write: false,
      plugins: [
        {
          name: 'virtual-fs',
          setup(build: any) {
            // Resolve virtual files
            build.onResolve({ filter: /.*/ }, (args: any) => {
              if (virtualFiles[args.path]) {
                return { path: args.path, namespace: 'virtual' }
              }
              // External dependencies
              if (options.dependencies?.[args.path]) {
                return { path: args.path, external: true }
              }
              return null
            })

            // Load virtual files
            build.onLoad({ filter: /.*/, namespace: 'virtual' }, (args: any) => {
              const content = virtualFiles[args.path]
              if (content) {
                return { contents: content, loader: 'tsx' }
              }
              return null
            })
          }
        }
      ]
    })

    return {
      code: result.outputFiles[0]?.text || '',
      map: result.outputFiles[1]?.text,
      errors: result.errors.map(err => ({
        text: err.text,
        location: err.location ? {
          file: err.location.file || '',
          line: err.location.line || 0,
          column: err.location.column || 0
        } : undefined
      })),
      warnings: result.warnings.map(warn => ({
        text: warn.text,
        location: warn.location ? {
          file: warn.location.file || '',
          line: warn.location.line || 0,
          column: warn.location.column || 0
        } : undefined
      }))
    }
  } catch (error: any) {
    return {
      code: '',
      errors: [{
        text: error.message || 'Bundling failed',
        location: undefined
      }],
      warnings: []
    }
  }
}

/**
 * Transpile TypeScript/JSX to JavaScript
 */
export async function transpileCode(
  code: string,
  options: {
    loader?: 'ts' | 'tsx' | 'js' | 'jsx'
    target?: string
  } = {}
): Promise<{ code: string; errors: string[] }> {
  await initializeEsbuild()

  try {
    const result = await esbuild.transform(code, {
      loader: options.loader || 'tsx',
      target: options.target || 'es2020',
      format: 'iife'
    })

    return {
      code: result.code,
      errors: []
    }
  } catch (error: any) {
    return {
      code: '',
      errors: [error.message || 'Transpilation failed']
    }
  }
}





