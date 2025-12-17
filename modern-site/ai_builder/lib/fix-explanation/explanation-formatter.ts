/**
 * Fix Explanation Formatter
 * P2 Feature 21: Fix Explanation System
 */

import { FixSuggestion } from '../fix-validation/fix-validator'

export interface FormattedExplanation {
  summary: string
  details: string[]
  codeChanges: {
    before: string
    after: string
    reason: string
  }[]
  impact: string
}

/**
 * Format fix explanation
 */
export function formatFixExplanation(fix: FixSuggestion): FormattedExplanation {
  const details: string[] = []
  const codeChanges: Array<{ before: string; after: string; reason: string }> = []

  // Parse explanation
  const explanation = fix.explanation

  // Extract details
  if (fix.oldCode && fix.newCode) {
    codeChanges.push({
      before: fix.oldCode,
      after: fix.newCode,
      reason: explanation
    })
  }

  // Add fix type details
  details.push(`Fix Type: ${fix.fixType}`)
  details.push(`Target File: ${fix.targetFile}`)
  details.push(`Confidence: ${Math.round(fix.confidence * 100)}%`)

  return {
    summary: explanation,
    details,
    codeChanges,
    impact: getImpactDescription(fix)
  }
}

/**
 * Get impact description
 */
function getImpactDescription(fix: FixSuggestion): string {
  switch (fix.fixType) {
    case 'replace':
      return 'Replaces existing code with fixed version'
    case 'insert':
      return 'Inserts new code at specified position'
    case 'delete':
      return 'Removes problematic code'
    case 'install_package':
      return `Installs missing package: ${fix.package}`
    case 'update_import':
      return 'Updates import statement'
    default:
      return 'Applies fix to resolve error'
  }
}





