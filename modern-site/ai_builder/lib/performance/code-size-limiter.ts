/**
 * Code Size Limiter - Prevent performance issues
 * P1 Feature 9: Code Size Limits
 * 
 * Limits code size and provides warnings
 */

export interface CodeSizeLimits {
  maxSize: number // Maximum code size in bytes (default: 1MB)
  warningSize: number // Warning threshold in bytes (default: 500KB)
}

export interface CodeSizeResult {
  valid: boolean
  size: number
  maxSize: number
  warningSize: number
  warning?: string
  error?: string
}

const DEFAULT_LIMITS: CodeSizeLimits = {
  maxSize: 1048576, // 1MB
  warningSize: 512000 // 500KB
}

export function checkCodeSize(code: string, limits: CodeSizeLimits = DEFAULT_LIMITS): CodeSizeResult {
  const size = new Blob([code]).size
  const sizeKB = size / 1024
  const maxSizeKB = limits.maxSize / 1024
  const warningSizeKB = limits.warningSize / 1024

  if (size > limits.maxSize) {
    return {
      valid: false,
      size,
      maxSize: limits.maxSize,
      warningSize: limits.warningSize,
      error: `Code size (${sizeKB.toFixed(2)}KB) exceeds maximum (${maxSizeKB.toFixed(2)}KB). Please reduce code size.`
    }
  }

  if (size > limits.warningSize) {
    return {
      valid: true,
      size,
      maxSize: limits.maxSize,
      warningSize: limits.warningSize,
      warning: `Code size (${sizeKB.toFixed(2)}KB) is approaching maximum (${maxSizeKB.toFixed(2)}KB). Consider optimizing your code.`
    }
  }

  return {
    valid: true,
    size,
    maxSize: limits.maxSize,
    warningSize: limits.warningSize
  }
}

export function formatCodeSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }
}





