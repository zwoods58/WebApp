/**
 * Pre-Application Validator
 * P0 Feature 4: Fix Validation System - Pre-Validation
 */

import { FixSuggestion, ValidationCheck } from './fix-validator'
import { getCodeValidator } from '../error-detection/static-analyzer'

/**
 * Validate fix before applying
 */
export async function validateBeforeApplication(
  fix: FixSuggestion,
  currentCode: string
): Promise<{
  valid: boolean
  checks: ValidationCheck[]
  warnings: string[]
}> {
  const checks: ValidationCheck[] = []
  const warnings: string[] = []

  // 1. Check that oldCode matches current code (if replace operation)
  if (fix.fixType === 'replace' && fix.oldCode) {
    if (!currentCode.includes(fix.oldCode)) {
      checks.push({
        name: 'Code Match Check',
        passed: false,
        critical: true,
        message: 'Old code does not match current code'
      })
      return { valid: false, checks, warnings }
    }
  }

  // 2. Validate new code syntax
  const codeValidator = getCodeValidator()
  const syntaxCheck = await codeValidator.validateJavaScript(
    fix.newCode,
    fix.targetFile,
    { autoFix: false }
  )

  if (syntaxCheck.errors.length > 0) {
    checks.push({
      name: 'Syntax Check',
      passed: false,
      critical: true,
      message: `Syntax errors: ${syntaxCheck.errors.map(e => e.message).join(', ')}`
    })
  } else {
    checks.push({
      name: 'Syntax Check',
      passed: true,
      critical: true
    })
  }

  // 3. Check code size (prevent huge changes)
  const sizeIncrease = fix.newCode.length - (fix.oldCode?.length || 0)
  if (sizeIncrease > 10000) {
    warnings.push('Fix increases code size significantly')
  }

  // 4. Check confidence threshold
  if (fix.confidence < 0.5) {
    warnings.push('Low confidence fix - review carefully')
  }

  const valid = checks.every(c => c.passed)

  return {
    valid,
    checks,
    warnings
  }
}





