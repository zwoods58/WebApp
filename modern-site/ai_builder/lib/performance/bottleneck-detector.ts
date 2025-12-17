/**
 * Bottleneck Detector
 * P1 Feature 14: Performance-Based Fixes - Bottleneck Detection
 */

export interface Bottleneck {
  type: 'render' | 'computation' | 'network' | 'memory'
  location: {
    file: string
    line: number
  }
  severity: 'high' | 'medium' | 'low'
  suggestion: string
}

/**
 * Detect performance bottlenecks in code
 */
export function detectBottlenecks(code: string): Bottleneck[] {
  const bottlenecks: Bottleneck[] = []

  const lines = code.split('\n')

  lines.forEach((line, index) => {
    // Detect expensive operations in render
    if (line.includes('render') || line.includes('return')) {
      if (line.includes('.map(') && !line.includes('useMemo')) {
        bottlenecks.push({
          type: 'render',
          location: {
            file: 'component.tsx',
            line: index + 1
          },
          severity: 'medium',
          suggestion: 'Use useMemo for expensive map operations'
        })
      }

      if (line.includes('.filter(') && !line.includes('useMemo')) {
        bottlenecks.push({
          type: 'computation',
          location: {
            file: 'component.tsx',
            line: index + 1
          },
          severity: 'low',
          suggestion: 'Consider memoizing filter operations'
        })
      }
    }

    // Detect memory leaks
    if (line.includes('useEffect') && !line.includes('return')) {
      bottlenecks.push({
        type: 'memory',
        location: {
          file: 'component.tsx',
          line: index + 1
        },
        severity: 'high',
        suggestion: 'Add cleanup function to useEffect'
      })
    }
  })

  return bottlenecks
}





