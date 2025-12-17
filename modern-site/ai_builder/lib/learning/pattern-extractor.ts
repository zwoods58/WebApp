/**
 * Pattern Extractor
 * P1 Feature 9: Learning & Improvement System - Pattern Extraction
 */

import { FixFeedback } from '../feedback/feedback-collector'

export interface ExtractedPattern {
  pattern: string
  successRate: number
  frequency: number
  context: string[]
}

/**
 * Extract patterns from successful fixes
 */
export function extractSuccessPatterns(feedback: FixFeedback[]): ExtractedPattern[] {
  const patterns: Map<string, { success: number; total: number; contexts: Set<string> }> = new Map()

  feedback.forEach(f => {
    if (f.worked) {
      // Would extract patterns from fix explanations, error types, etc.
      const pattern = 'success_pattern' // Would extract actual pattern
      
      if (!patterns.has(pattern)) {
        patterns.set(pattern, { success: 0, total: 0, contexts: new Set() })
      }

      const p = patterns.get(pattern)!
      p.success++
      p.total++
      p.contexts.add(f.fixId)
    }
  })

  const result: ExtractedPattern[] = []
  patterns.forEach((data, pattern) => {
    result.push({
      pattern,
      successRate: data.total > 0 ? data.success / data.total : 0,
      frequency: data.total,
      context: Array.from(data.contexts)
    })
  })

  return result.sort((a, b) => b.successRate - a.successRate)
}





