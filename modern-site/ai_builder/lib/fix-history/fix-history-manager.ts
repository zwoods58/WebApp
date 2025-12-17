/**
 * Fix History Manager
 * P2 Feature 17: Fix History Tracking
 */

import { getSupabaseClient } from '../supabase/client-db'
import { FixSuggestion } from '../fix-validation/fix-validator'
import { AppliedFix } from '../fix-application/fix-applicator'

export interface FixHistoryEntry {
  id: string
  projectId: string
  errorId: string
  errorMessage: string
  errorType: string
  fix: FixSuggestion
  appliedFix?: AppliedFix
  success: boolean
  attempts: number
  timestamp: Date
  userId?: string
}

class FixHistoryManager {
  /**
   * Record fix attempt
   */
  async recordFixAttempt(
    projectId: string,
    error: Error,
    fix: FixSuggestion,
    success: boolean,
    attempts: number = 1
  ): Promise<string> {
    try {
      const supabase = getSupabaseClient()
      
      const entry: Omit<FixHistoryEntry, 'id' | 'timestamp'> = {
        projectId,
        errorId: `error_${Date.now()}`,
        errorMessage: error.message,
        errorType: error.name,
        fix,
        success,
        attempts
      }

      // Would insert into fix_history table
      // For now, return mock ID
      const id = `fix_history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      console.log('Recording fix attempt:', id)
      
      return id
    } catch (error: any) {
      throw new Error(`Failed to record fix attempt: ${error.message}`)
    }
  }

  /**
   * Get fix history for project
   */
  async getFixHistory(projectId: string, limit: number = 50): Promise<FixHistoryEntry[]> {
    try {
      // Would query fix_history table
      // For now, return empty array
      return []
    } catch (error) {
      console.error('Failed to get fix history:', error)
      return []
    }
  }

  /**
   * Get success rate by error type
   */
  async getSuccessRateByErrorType(projectId: string): Promise<Record<string, number>> {
    const history = await this.getFixHistory(projectId)
    const grouped: Record<string, { total: number; success: number }> = {}

    history.forEach(entry => {
      if (!grouped[entry.errorType]) {
        grouped[entry.errorType] = { total: 0, success: 0 }
      }
      grouped[entry.errorType].total++
      if (entry.success) {
        grouped[entry.errorType].success++
      }
    })

    const result: Record<string, number> = {}
    Object.entries(grouped).forEach(([type, data]) => {
      result[type] = data.total > 0 ? data.success / data.total : 0
    })

    return result
  }

  /**
   * Get failed fixes
   */
  async getFailedFixes(projectId: string): Promise<FixHistoryEntry[]> {
    const history = await this.getFixHistory(projectId)
    return history.filter(entry => !entry.success)
  }
}

// Singleton instance
let fixHistoryManager: FixHistoryManager | null = null

export function getFixHistoryManager(): FixHistoryManager {
  if (!fixHistoryManager) {
    fixHistoryManager = new FixHistoryManager()
  }
  return fixHistoryManager
}





