/**
 * Predictive Error Detection
 * P1 Feature 10: Proactive Error Prevention - Predictive Detection
 */

export interface PredictiveSuggestion {
  type: 'error' | 'warning' | 'suggestion'
  message: string
  line: number
  column: number
  suggestion: string
  confidence: number
}

class PredictiveDetector {
  /**
   * Detect potential errors before they occur
   */
  async detectPotentialErrors(code: string): Promise<PredictiveSuggestion[]> {
    const suggestions: PredictiveSuggestion[] = []

    const lines = code.split('\n')

    lines.forEach((line, index) => {
      // Check for common error patterns
      const lineSuggestions = this.checkLineForPatterns(line, index + 1)
      suggestions.push(...lineSuggestions)
    })

    return suggestions.sort((a, b) => b.confidence - a.confidence)
  }

  /**
   * Check line for error patterns
   */
  private checkLineForPatterns(line: string, lineNumber: number): PredictiveSuggestion[] {
    const suggestions: PredictiveSuggestion[] = []

    // Pattern 1: Missing dependency check
    if (line.includes('import') && line.includes('from')) {
      const importMatch = line.match(/from\s+['"](.+?)['"]/)
      if (importMatch && !importMatch[1].startsWith('.')) {
        suggestions.push({
          type: 'warning',
          message: `Potential missing dependency: ${importMatch[1]}`,
          line: lineNumber,
          column: line.indexOf('import'),
          suggestion: `Ensure ${importMatch[1]} is installed`,
          confidence: 0.7
        })
      }
    }

    // Pattern 2: Undefined variable usage
    if (line.match(/\b(undefined|null)\b/)) {
      suggestions.push({
        type: 'warning',
        message: 'Potential undefined/null reference',
        line: lineNumber,
        column: 0,
        suggestion: 'Add null check before using',
        confidence: 0.6
      })
    }

    // Pattern 3: Missing return statement
    if (line.includes('function') && !line.includes('return') && !line.includes('=>')) {
      suggestions.push({
        type: 'suggestion',
        message: 'Function may need return statement',
        line: lineNumber,
        column: 0,
        suggestion: 'Add return statement if function should return a value',
        confidence: 0.5
      })
    }

    // Pattern 4: Unclosed brackets
    const openBrackets = (line.match(/\{/g) || []).length
    const closeBrackets = (line.match(/\}/g) || []).length
    if (openBrackets > closeBrackets) {
      suggestions.push({
        type: 'error',
        message: 'Unclosed bracket detected',
        line: lineNumber,
        column: line.lastIndexOf('{'),
        suggestion: 'Add closing bracket',
        confidence: 0.9
      })
    }

    return suggestions
  }
}

// Singleton instance
let predictiveDetector: PredictiveDetector | null = null

export function getPredictiveDetector(): PredictiveDetector {
  if (!predictiveDetector) {
    predictiveDetector = new PredictiveDetector()
  }
  return predictiveDetector
}





