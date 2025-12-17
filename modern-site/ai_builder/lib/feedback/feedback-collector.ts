/**
 * Feedback Collector
 * P1 Feature 8: User Feedback Loop - Feedback Collection
 */

import { AppliedFix } from '../fix-application/fix-applicator'
import { getSupabaseClient } from '../supabase/client-db'

export interface FixFeedback {
  fixId: string
  accepted: boolean
  worked: boolean
  userRating?: number // 1-5
  userComments?: string
  timeToDecision: number // ms
  modifiedBeforeAccepting: boolean
  timestamp: Date
}

class FeedbackCollector {
  /**
   * Collect feedback for a fix
   */
  async collectFeedback(fix: AppliedFix, feedback: Partial<FixFeedback>): Promise<void> {
    const fullFeedback: FixFeedback = {
      fixId: fix.id,
      accepted: feedback.accepted ?? false,
      worked: feedback.worked ?? false,
      userRating: feedback.userRating,
      userComments: feedback.userComments,
      timeToDecision: feedback.timeToDecision ?? 0,
      modifiedBeforeAccepting: feedback.modifiedBeforeAccepting ?? false,
      timestamp: new Date()
    }

    // Store feedback
    await this.storeFeedback(fullFeedback)

    // Queue for training/improvement
    await this.queueForTraining(fullFeedback)
  }

  /**
   * Store feedback in database
   */
  private async storeFeedback(feedback: FixFeedback): Promise<void> {
    try {
      const supabase = getSupabaseClient()
      
      // Would insert into fix_feedback table
      // For now, log
      console.log('Storing feedback:', feedback)
    } catch (error) {
      console.error('Failed to store feedback:', error)
    }
  }

  /**
   * Queue feedback for model training
   */
  private async queueForTraining(feedback: FixFeedback): Promise<void> {
    // Would queue for prompt optimization
    // For now, log
    console.log('Queuing feedback for training:', feedback.fixId)
  }

  /**
   * Get feedback statistics
   */
  async getFeedbackStats(fixId: string): Promise<{
    totalFeedback: number
    acceptanceRate: number
    successRate: number
    averageRating: number
  }> {
    // Would query database
    // For now, return mock data
    return {
      totalFeedback: 0,
      acceptanceRate: 0,
      successRate: 0,
      averageRating: 0
    }
  }
}

// Singleton instance
let feedbackCollector: FeedbackCollector | null = null

export function getFeedbackCollector(): FeedbackCollector {
  if (!feedbackCollector) {
    feedbackCollector = new FeedbackCollector()
  }
  return feedbackCollector
}





