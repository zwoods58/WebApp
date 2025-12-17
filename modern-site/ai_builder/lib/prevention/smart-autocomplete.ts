/**
 * Smart Autocomplete
 * P1 Feature 10: Proactive Error Prevention - Smart Autocomplete
 */

export interface AutocompleteSuggestion {
  text: string
  type: 'import' | 'variable' | 'function' | 'component'
  description?: string
  avoidCommonErrors?: boolean
}

class SmartAutocomplete {
  private commonErrors: Set<string> = new Set([
    'undefined',
    'null',
    'Cannot read property',
    'is not a function'
  ])

  /**
   * Get smart autocomplete suggestions
   */
  getSuggestions(
    prefix: string,
    context: {
      imports: string[]
      variables: string[]
      functions: string[]
    }
  ): AutocompleteSuggestion[] {
    const suggestions: AutocompleteSuggestion[] = []

    // Filter suggestions to avoid common errors
    const filteredImports = context.imports.filter(imp => 
      !this.wouldCauseError(imp, context)
    )

    filteredImports.forEach(imp => {
      suggestions.push({
        text: imp,
        type: 'import',
        description: `Import from ${imp}`,
        avoidCommonErrors: true
      })
    })

    // Add variable suggestions
    context.variables.forEach(variable => {
      if (variable.startsWith(prefix)) {
        suggestions.push({
          text: variable,
          type: 'variable',
          avoidCommonErrors: true
        })
      }
    })

    return suggestions
  }

  /**
   * Check if suggestion would cause error
   */
  private wouldCauseError(suggestion: string, context: any): boolean {
    // Check against common error patterns
    return this.commonErrors.has(suggestion.toLowerCase())
  }
}

// Singleton instance
let smartAutocomplete: SmartAutocomplete | null = null

export function getSmartAutocomplete(): SmartAutocomplete {
  if (!smartAutocomplete) {
    smartAutocomplete = new SmartAutocomplete()
  }
  return smartAutocomplete
}





