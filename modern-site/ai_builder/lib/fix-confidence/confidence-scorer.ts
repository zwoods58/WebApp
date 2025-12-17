/**
 * Fix Confidence Scorer
 * P2 Feature 20: Fix Confidence Scoring
 */

import { FixSuggestion } from '../fix-validation/fix-validator'
import { ValidationResult } from '../fix-validation/fix-validator'

export interface ConfidenceFactors {
  errorType: number // 0.0-1.0
  codeMatch: number // 0.0-1.0
  validationScore: number // 0.0-1.0
  historicalSuccess: number // 0.0-1.0
  fixComplexity: number // 0.0-1.0 (lower is better)
}

class ConfidenceScorer {
  /**
   * Calculate confidence score for fix
   */
  calculateConfidence(
    fix: FixSuggestion,
    validationResult: ValidationResult,
    historicalSuccessRate: number = 0.5
  ): number {
    const factors: ConfidenceFactors = {
      errorType: this.getErrorTypeConfidence(fix),
      codeMatch: this.getCodeMatchConfidence(fix),
      validationScore: validationResult.checks.filter(c => c.passed).length / validationResult.checks.length,
      historicalSuccess: historicalSuccessRate,
      fixComplexity: this.getFixComplexity(fix)
    }

    // Weighted average
    const confidence = (
      factors.errorType * 0.2 +
      factors.codeMatch * 0.2 +
      factors.validationScore * 0.3 +
      factors.historicalSuccess * 0.2 +
      (1 - factors.fixComplexity) * 0.1
    )

    return Math.max(0, Math.min(1, confidence))
  }

  /**
   * Get confidence based on error type
   */
  private getErrorTypeConfidence(fix: FixSuggestion): number {
    // Syntax errors are easier to fix
    if (fix.explanation.toLowerCase().includes('syntax')) {
      return 0.9
    }
    // Type errors are medium
    if (fix.explanation.toLowerCase().includes('type')) {
      return 0.7
    }
    // Logic errors are harder
    if (fix.explanation.toLowerCase().includes('logic')) {
      return 0.5
    }
    return 0.6
  }

  /**
   * Get confidence based on code match
   */
  private getCodeMatchConfidence(fix: FixSuggestion): number {
    if (!fix.oldCode) return 0.5

    // Check if oldCode is a reasonable match
    // Would compare with actual code
    return 0.8
  }

  /**
   * Get fix complexity score
   */
  private getFixComplexity(fix: FixSuggestion): number {
    // Simple fixes (replace) are less complex
    if (fix.fixType === 'replace') {
      return 0.3
    }
    // Multi-file fixes are more complex
    if (fix.fixType === 'install_package') {
      return 0.5
    }
    return 0.7
  }

  /**
   * Get confidence badge level
   */
  getConfidenceBadge(confidence: number): 'high' | 'medium' | 'low' {
    if (confidence >= 0.8) return 'high'
    if (confidence >= 0.6) return 'medium'
    return 'low'
  }

  /**
   * Should retry based on confidence
   */
  shouldRetry(confidence: number, attempt: number): boolean {
    if (confidence >= 0.8) return false // High confidence, don't retry
    if (confidence >= 0.6 && attempt < 2) return true // Medium confidence, retry once
    if (confidence < 0.6 && attempt < 3) return true // Low confidence, retry twice
    return false
  }
}

// Singleton instance
let confidenceScorer: ConfidenceScorer | null = null

export function getConfidenceScorer(): ConfidenceScorer {
  if (!confidenceScorer) {
    confidenceScorer = new ConfidenceScorer()
  }
  return confidenceScorer
}





