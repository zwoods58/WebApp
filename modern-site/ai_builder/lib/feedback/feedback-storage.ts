/**
 * Feedback Storage
 * P1 Feature 8: User Feedback Loop - Feedback Storage
 */

import { FixFeedback } from './feedback-collector'
import { getSupabaseClient } from '../supabase/client-db'

/**
 * Store feedback in database
 */
export async function storeFeedback(feedback: FixFeedback): Promise<void> {
  try {
    const supabase = getSupabaseClient()
    
    // Would insert into fix_feedback table
    // Table structure:
    // - id (uuid)
    // - fix_id (uuid)
    // - accepted (boolean)
    // - worked (boolean)
    // - user_rating (integer 1-5)
    // - user_comments (text)
    // - time_to_decision (integer ms)
    // - modified_before_accepting (boolean)
    // - created_at (timestamp)

    console.log('Storing feedback:', feedback)
  } catch (error) {
    console.error('Failed to store feedback:', error)
    throw error
  }
}

/**
 * Get feedback for a fix
 */
export async function getFeedback(fixId: string): Promise<FixFeedback[]> {
  try {
    const supabase = getSupabaseClient()
    
    // Would query fix_feedback table
    // For now, return empty array
    return []
  } catch (error) {
    console.error('Failed to get feedback:', error)
    return []
  }
}





