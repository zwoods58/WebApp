/**
 * Accessibility Utilities - a11y support
 * P1 Feature 5: Accessibility (a11y)
 * 
 * ARIA labels, keyboard navigation, screen reader support
 */

'use client'

import React from 'react'

export interface A11yButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label'?: string
  'aria-busy'?: boolean
  'aria-live'?: 'polite' | 'assertive' | 'off'
  'aria-describedby'?: string
}

/**
 * Create accessible button props
 */
export function createA11yButtonProps(
  label: string,
  props: Partial<A11yButtonProps> = {}
): A11yButtonProps {
  return {
    'aria-label': label,
    'aria-live': 'polite',
    role: 'button',
    tabIndex: 0,
    ...props
  }
}

/**
 * Create accessible input props
 */
export function createA11yInputProps(
  label: string,
  props: Partial<React.InputHTMLAttributes<HTMLInputElement>> = {}
): React.InputHTMLAttributes<HTMLInputElement> {
  const id = `input-${label.toLowerCase().replace(/\s+/g, '-')}`
  return {
    id,
    'aria-label': label,
    'aria-describedby': `${id}-description`,
    ...props
  }
}

/**
 * Announce to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  if (typeof window === 'undefined') {
    return
  }

  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Focus management utilities
 */
export class FocusManager {
  /**
   * Trap focus within an element
   */
  static trapFocus(element: HTMLElement): () => void {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') {
        return
      }

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    element.addEventListener('keydown', handleTab)
    firstElement?.focus()

    return () => {
      element.removeEventListener('keydown', handleTab)
    }
  }

  /**
   * Return focus to previous element
   */
  static returnFocus(previousElement: HTMLElement | null): void {
    if (previousElement && typeof previousElement.focus === 'function') {
      previousElement.focus()
    }
  }

  /**
   * Skip to main content
   */
  static skipToMain(): void {
    const main = document.querySelector('main') || document.querySelector('[role="main"]')
    if (main) {
      (main as HTMLElement).focus()
      (main as HTMLElement).scrollIntoView()
    }
  }
}

/**
 * Keyboard shortcut handler
 */
export function useKeyboardShortcut(
  key: string,
  handler: (e: KeyboardEvent) => void,
  deps: React.DependencyList = []
): void {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === key || (e.ctrlKey && e.key === key) || (e.metaKey && e.key === key)) {
        handler(e)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, deps)
}

// Import React conditionally
let React: any = null
if (typeof window !== 'undefined') {
  try {
    React = require('react')
  } catch {
    // React not available
  }
}





