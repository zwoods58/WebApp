'use client'

import React, { useMemo, useState, useEffect } from 'react'
// Import components from the library
import Header from '../../../ai_builder/library/components/generic/header/Header'
import Hero from '../../../ai_builder/library/components/generic/hero/Hero'
import Features from '../../../ai_builder/library/components/generic/features/Features'
import Pricing from '../../../ai_builder/library/components/generic/pricing/Pricing'
import Testimonial from '../../../ai_builder/library/components/generic/testimonials/Testimonial'
import Footer from '../../../ai_builder/library/components/generic/footer/Footer'
// Import default siteData
import { defaultSiteData } from '../../../ai_builder/library/sitedata/defaultSiteData'

interface ComponentRendererProps {
  componentCode: string
}

export default function ComponentRenderer({ componentCode }: ComponentRendererProps) {
  const [babelLoaded, setBabelLoaded] = useState(false)

  // Load Babel standalone from CDN
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).Babel) {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/@babel/standalone/babel.min.js'
      script.async = true
      script.onload = () => {
        console.log('✅ Babel standalone loaded')
        setBabelLoaded(true)
      }
      script.onerror = () => {
        console.error('❌ Failed to load Babel standalone')
        setBabelLoaded(true) // Continue anyway
      }
      document.head.appendChild(script)
    } else if ((window as any).Babel) {
      setBabelLoaded(true)
    }
  }, [])

  const RenderedComponent = useMemo(() => {
    try {
      // Extract the component code from markdown code blocks if present
      let code = componentCode.trim()
      
      // Remove markdown code block markers more aggressively
      // First, try to match full code blocks
      const codeBlockMatch = code.match(/```(?:jsx|js|tsx|ts|javascript|typescript)?\s*\n([\s\S]*?)\n```/)
      if (codeBlockMatch) {
        code = codeBlockMatch[1].trim()
      } else {
        // If no match, try removing any remaining markers
        code = code.replace(/^```(?:jsx|js|tsx|ts|javascript|typescript)?\s*\n?/gm, '')
        code = code.replace(/\n?```\s*$/gm, '')
        code = code.trim()
      }

      // Remove component imports (we'll provide them)
      code = code.replace(/import\s+\{[^}]*\}\s+from\s+['"]\.\/components['"];?\s*/g, '')
      code = code.replace(/import\s+\{[^}]*\}\s+from\s+['"]\.\/components\/index['"];?\s*/g, '')
      
      // Remove React imports (we'll provide React hooks)
      code = code.replace(/import\s+\{([^}]*)\}\s+from\s+['"]react['"];?\s*/g, '')
      code = code.replace(/import\s+React\s+from\s+['"]react['"];?\s*/g, '')
      
      // Extract component function name
      let componentName = 'LandingPage'
      const nameMatch = code.match(/(?:export\s+default\s+)?function\s+(\w+)\s*\(/)
      if (nameMatch) {
        componentName = nameMatch[1]
      }
      
      // CRITICAL FIX: Strip export default and convert to variable assignment
      // This allows the code to be executed in a Function context
      if (code.includes('export default function')) {
        // Replace: export default function ComponentName() { ... }
        // With: const ComponentName = function() { ... }
        code = code.replace(
          /export\s+default\s+function\s+(\w+)\s*\(/g,
          'const $1 = function('
        )
      } else if (code.includes('export default')) {
        // Handle: export default ComponentName or export default { ... }
        code = code.replace(/export\s+default\s+/g, '')
        // If it's just a function name, wrap it
        if (!code.includes('function') && !code.includes('const') && !code.includes('=')) {
          code = `const ${componentName} = ${code}`
        }
      }
      
      // Fix unterminated strings (common AI cut-off issue)
      // Check for unterminated strings and try to fix them
      const stringPattern = /(["'`])((?:(?!\1)[^\\]|\\.)*)$/gm
      const lines = code.split('\n')
      let fixedLines: string[] = []
      
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        const openQuotes = (line.match(/["'`]/g) || []).length
        const closeQuotes = (line.match(/["'`]/g) || []).length
        
        // Check if line has unmatched quotes (simple heuristic)
        if (line.includes('className=') || line.includes('title=') || line.includes('description=')) {
          // Check for unterminated strings in common attribute positions
          const attrMatch = line.match(/(\w+)=["']([^"']*)$/)
          if (attrMatch && !line.match(/["']\s*\/?>?$/)) {
            // String appears to be unterminated, close it
            line = line.replace(/(["'])([^"']*)$/, '$1$2$1')
            console.warn(`⚠️ Fixed unterminated string on line ${i + 1}`)
          }
        }
        
        fixedLines.push(line)
      }
      
      code = fixedLines.join('\n')
      
      // Prepare the code for transpilation (without adding useState declaration)
      // The hooks will be available as function parameters
      const fullCode = code
      
      // Transpile JSX to React.createElement using Babel (if available)
      let transpiledCode = fullCode
      if (typeof window !== 'undefined' && (window as any).Babel) {
        try {
          const result = (window as any).Babel.transform(fullCode, {
            presets: ['react'],
            plugins: []
          })
          transpiledCode = result.code
          console.log('✅ JSX transpiled successfully')
        } catch (babelError: any) {
          console.warn('⚠️ Babel transpilation failed:', babelError.message)
          // Try to extract more context from the error
          if (babelError.message.includes('Unterminated')) {
            console.warn('⚠️ Code appears to be incomplete (unterminated string/comment)')
            // Try to fix common issues
            // Remove incomplete lines at the end
            const lines = transpiledCode.split('\n')
            let fixedCode = ''
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i]
              // Skip lines that look incomplete
              if (line.trim() && !line.match(/["'`]$/) && !line.includes('//') && !line.includes('/*')) {
                fixedCode += line + '\n'
              } else if (i < lines.length - 5) {
                // Keep lines that aren't near the end
                fixedCode += line + '\n'
              }
            }
            transpiledCode = fixedCode.trim() || fullCode
          }
          // Continue without transpilation - might work if code is already valid JS
        }
      }
      
      // Use default siteData (injected into component context)
      const siteData = defaultSiteData
      
      // Create execution context
      // Hooks are passed as parameters and will be available in the component scope
      // siteData is injected as a global variable
      const componentFunction = new Function(
        'React',
        'useState',
        'useEffect',
        'useRef',
        'useCallback',
        'useMemo',
        'Header',
        'Hero',
        'Features',
        'Pricing',
        'Testimonial',
        'Footer',
        'siteData',
        `
        // React is available as ReactLib to avoid conflicts
        const ReactLib = React;
        
        // Hooks are available directly from function parameters
        // Component code can use: useState, useEffect, useRef, useCallback, useMemo
        // Component code can use: Header, Hero, Features, Pricing, Testimonial, Footer
        // siteData is globally available - no need to import or define it
        
        ${transpiledCode}
        
        // Return the component (handle both function and const declarations)
        if (typeof ${componentName} !== 'undefined') {
          return ${componentName};
        }
        
        // Fallback: try to find any exported function or const component
        const componentNames = ['${componentName}', 'LandingPage', 'App', 'Component'];
        for (const name of componentNames) {
          if (typeof eval(name) !== 'undefined') {
            return eval(name);
          }
        }
        
        return null;
        `
      )

      const Component = componentFunction(
        React,
        React.useState,
        React.useEffect,
        React.useRef,
        React.useCallback,
        React.useMemo,
        Header,
        Hero,
        Features,
        Pricing,
        Testimonial,
        Footer,
        siteData
      )

      if (!Component || typeof Component !== 'function') {
        console.error('❌ Component function is not valid:', typeof Component)
        return null
      }

      console.log('✅ Component created successfully:', componentName)
      return Component
    } catch (error: any) {
      console.error('❌ Error rendering component:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      if (error.message) {
        console.error('Component code length:', componentCode.length)
        console.error('Component code preview:', componentCode.substring(0, 500))
      }
      return null
    }
  }, [componentCode, babelLoaded])

  // Show loading state while Babel loads (only on first render)
  if (!babelLoaded && typeof window !== 'undefined' && !(window as any).Babel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Loading component renderer...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!RenderedComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <p className="text-red-600 mb-4 font-semibold">Error rendering component</p>
          <p className="text-gray-600 text-sm mb-4">
            The component code couldn't be parsed. Check the browser console (F12) for details.
          </p>
          <details className="text-left">
            <summary className="cursor-pointer text-sm text-gray-600 mb-2 hover:text-gray-900">
              Show code ({componentCode.length} chars)
            </summary>
            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96 border border-gray-300 font-mono">
              {componentCode.substring(0, 2000)}
              {componentCode.length > 2000 && '\n\n... (truncated)'}
            </pre>
          </details>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <RenderedComponent />
    </div>
  )
}
