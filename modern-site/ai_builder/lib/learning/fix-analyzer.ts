/**
 * Fix Analyzer - Learning & Improvement System
 * P1 Feature 9: Learning & Improvement System
 */

import { FixFeedback } from '../feedback/feedback-collector'

export interface FixAnalytics {
  overallSuccessRate: number
  successRateByErrorType: Record<string, number>
  successRateByConfidence: Record<string, number>
  mostCommonErrors: ErrorPattern[]
  mostSuccessfulFixTypes: string[]
  averageAttemptsToSuccess: number
  acceptanceRate: number
  averageTimeToDecision: number
  modificationRate: number
}

export interface ErrorPattern {
  type: string
  frequency: number
  successRate: number
  averageConfidence: number
}

export interface DateRange {
  start: Date
  end: Date
}

class FixAnalyzer {
  /**
   * Analyze fix performance
   */
  async analyzeFixPerformance(timeRange: DateRange): Promise<FixAnalytics> {
    // Would get fixes from database
    const fixes = await this.getFixesInRange(timeRange)

    return {
      overallSuccessRate: this.calculateSuccessRate(fixes),
      successRateByErrorType: this.groupByErrorType(fixes),
      successRateByConfidence: this.groupByConfidence(fixes),
      mostCommonErrors: this.findCommonPatterns(fixes),
      mostSuccessfulFixTypes: this.rankFixTypes(fixes),
      averageAttemptsToSuccess: this.calculateAvgAttempts(fixes),
      acceptanceRate: this.calculateAcceptanceRate(fixes),
      averageTimeToDecision: this.calculateAvgDecisionTime(fixes),
      modificationRate: this.calculateModificationRate(fixes)
    }
  }

  /**
   * Get fixes in time range
   */
  private async getFixesInRange(timeRange: DateRange): Promise<any[]> {
    // Would query database
    // For now, return empty array
    return []
  }

  /**
   * Calculate overall success rate
   */
  private calculateSuccessRate(fixes: any[]): number {
    if (fixes.length === 0) return 0
    const successful = fixes.filter(f => f.success).length
    return successful / fixes.length
  }

  /**
   * Group success rate by error type
   */
  private groupByErrorType(fixes: any[]): Record<string, number> {
    const grouped: Record<string, { total: number; success: number }> = {}

    fixes.forEach(fix => {
      const type = fix.errorType || 'unknown'
      if (!grouped[type]) {
        grouped[type] = { total: 0, success: 0 }
      }
      grouped[type].total++
      if (fix.success) {
        grouped[type].success++
      }
    })

    const result: Record<string, number> = {}
    Object.entries(grouped).forEach(([type, data]) => {
      result[type] = data.total > 0 ? data.success / data.total : 0
    })

    return result
  }

  /**
   * Group success rate by confidence
   */
  private groupByConfidence(fixes: any[]): Record<string, number> {
    const grouped: Record<string, { total: number; success: number }> = {}

    fixes.forEach(fix => {
      const confidence = fix.confidence || 0
      const bucket = confidence >= 0.8 ? 'high' : confidence >= 0.6 ? 'medium' : 'low'
      
      if (!grouped[bucket]) {
        grouped[bucket] = { total: 0, success: 0 }
      }
      grouped[bucket].total++
      if (fix.success) {
        grouped[bucket].success++
      }
    })

    const result: Record<string, number> = {}
    Object.entries(grouped).forEach(([bucket, data]) => {
      result[bucket] = data.total > 0 ? data.success / data.total : 0
    })

    return result
  }

  /**
   * Find common error patterns
   */
  private findCommonPatterns(fixes: any[]): ErrorPattern[] {
    const patterns: Map<string, { count: number; success: number; confidence: number[] }> = new Map()

    fixes.forEach(fix => {
      const type = fix.errorType || 'unknown'
      if (!patterns.has(type)) {
        patterns.set(type, { count: 0, success: 0, confidence: [] })
      }

      const pattern = patterns.get(type)!
      pattern.count++
      if (fix.success) pattern.success++
      pattern.confidence.push(fix.confidence || 0)
    })

    const result: ErrorPattern[] = []
    patterns.forEach((data, type) => {
      result.push({
        type,
        frequency: data.count,
        successRate: data.count > 0 ? data.success / data.count : 0,
        averageConfidence: data.confidence.reduce((a, b) => a + b, 0) / data.confidence.length
      })
    })

    return result.sort((a, b) => b.frequency - a.frequency).slice(0, 10)
  }

  /**
   * Rank fix types by success
   */
  private rankFixTypes(fixes: any[]): string[] {
    const grouped: Record<string, { total: number; success: number }> = {}

    fixes.forEach(fix => {
      const type = fix.fixType || 'unknown'
      if (!grouped[type]) {
        grouped[type] = { total: 0, success: 0 }
      }
      grouped[type].total++
      if (fix.success) {
        grouped[type].success++
      }
    })

    return Object.entries(grouped)
      .map(([type, data]) => ({
        type,
        rate: data.total > 0 ? data.success / data.total : 0
      }))
      .sort((a, b) => b.rate - a.rate)
      .map(item => item.type)
  }

  /**
   * Calculate average attempts to success
   */
  private calculateAvgAttempts(fixes: any[]): number {
    const successfulFixes = fixes.filter(f => f.success && f.attempts)
    if (successfulFixes.length === 0) return 0

    const totalAttempts = successfulFixes.reduce((sum, f) => sum + (f.attempts || 1), 0)
    return totalAttempts / successfulFixes.length
  }

  /**
   * Calculate acceptance rate
   */
  private calculateAcceptanceRate(fixes: any[]): number {
    const withFeedback = fixes.filter(f => f.feedback)
    if (withFeedback.length === 0) return 0

    const accepted = withFeedback.filter(f => f.feedback?.accepted).length
    return accepted / withFeedback.length
  }

  /**
   * Calculate average decision time
   */
  private calculateAvgDecisionTime(fixes: any[]): number {
    const withFeedback = fixes.filter(f => f.feedback?.timeToDecision)
    if (withFeedback.length === 0) return 0

    const totalTime = withFeedback.reduce((sum, f) => sum + (f.feedback?.timeToDecision || 0), 0)
    return totalTime / withFeedback.length
  }

  /**
   * Calculate modification rate
   */
  private calculateModificationRate(fixes: any[]): number {
    const withFeedback = fixes.filter(f => f.feedback)
    if (withFeedback.length === 0) return 0

    const modified = withFeedback.filter(f => f.feedback?.modifiedBeforeAccepting).length
    return modified / withFeedback.length
  }
}

// Singleton instance
let fixAnalyzer: FixAnalyzer | null = null

export function getFixAnalyzer(): FixAnalyzer {
  if (!fixAnalyzer) {
    fixAnalyzer = new FixAnalyzer()
  }
  return fixAnalyzer
}





