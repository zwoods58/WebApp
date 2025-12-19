/**
 * Accessibility Utilities
 * ARIA helpers, keyboard navigation, screen reader support, focus management
 */

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Trap focus within a modal or container
 * @param {HTMLElement} container - Container element
 * @param {HTMLElement} firstFocusable - First focusable element
 * @param {HTMLElement} lastFocusable - Last focusable element
 */
export function trapFocus(container, firstFocusable, lastFocusable) {
  const handleTab = (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };
  
  container.addEventListener('keydown', handleTab);
  
  return () => {
    container.removeEventListener('keydown', handleTab);
  };
}

/**
 * Get all focusable elements within a container
 * @param {HTMLElement} container - Container element
 * @returns {HTMLElement[]} Array of focusable elements
 */
export function getFocusableElements(container) {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');
  
  return Array.from(container.querySelectorAll(focusableSelectors));
}

/**
 * Set up focus trap for modal
 * @param {HTMLElement} modal - Modal element
 */
export function setupModalFocusTrap(modal) {
  const focusableElements = getFocusableElements(modal);
  if (focusableElements.length === 0) return null;
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  // Focus first element
  firstFocusable.focus();
  
  // Set up trap
  return trapFocus(modal, firstFocusable, lastFocusable);
}

/**
 * Restore focus to previously focused element
 * @param {HTMLElement} element - Element to restore focus to
 */
export function restoreFocus(element) {
  if (element && typeof element.focus === 'function') {
    element.focus();
  }
}

/**
 * Store current focus for restoration
 * @returns {HTMLElement} Currently focused element
 */
export function storeCurrentFocus() {
  return document.activeElement;
}

/**
 * Set ARIA attributes for loading state
 * @param {HTMLElement} element - Element to update
 * @param {boolean} isLoading - Loading state
 */
export function setLoadingState(element, isLoading) {
  if (!element) return;
  
  element.setAttribute('aria-busy', isLoading.toString());
  element.setAttribute('aria-live', 'polite');
  
  if (isLoading) {
    element.setAttribute('aria-label', 'Loading...');
  }
}

/**
 * Set ARIA attributes for error state
 * @param {HTMLElement} element - Element to update
 * @param {string} errorMessage - Error message
 */
export function setErrorState(element, errorMessage) {
  if (!element) return;
  
  element.setAttribute('aria-invalid', 'true');
  element.setAttribute('aria-describedby', `error-${element.id || 'field'}`);
  
  // Create or update error message element
  let errorElement = document.getElementById(`error-${element.id || 'field'}`);
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.id = `error-${element.id || 'field'}`;
    errorElement.className = 'sr-only';
    errorElement.setAttribute('role', 'alert');
    element.parentNode.appendChild(errorElement);
  }
  
  errorElement.textContent = errorMessage;
}

/**
 * Clear error state
 * @param {HTMLElement} element - Element to update
 */
export function clearErrorState(element) {
  if (!element) return;
  
  element.removeAttribute('aria-invalid');
  element.removeAttribute('aria-describedby');
  
  const errorElement = document.getElementById(`error-${element.id || 'field'}`);
  if (errorElement) {
    errorElement.remove();
  }
}

/**
 * Set ARIA label for icon-only buttons
 * @param {HTMLElement} button - Button element
 * @param {string} label - Accessible label
 */
export function setIconButtonLabel(button, label) {
  if (!button) return;
  
  button.setAttribute('aria-label', label);
  
  // Add visually hidden text for better screen reader support
  const text = document.createElement('span');
  text.className = 'sr-only';
  text.textContent = label;
  button.appendChild(text);
}

/**
 * Set ARIA attributes for expandable/collapsible elements
 * @param {HTMLElement} trigger - Trigger button
 * @param {HTMLElement} content - Content element
 * @param {boolean} isExpanded - Expanded state
 */
export function setExpandedState(trigger, content, isExpanded) {
  if (!trigger || !content) return;
  
  trigger.setAttribute('aria-expanded', isExpanded.toString());
  trigger.setAttribute('aria-controls', content.id || 'content');
  content.setAttribute('aria-hidden', (!isExpanded).toString());
}

/**
 * Set ARIA attributes for progress indicator
 * @param {HTMLElement} element - Progress element
 * @param {number} current - Current value
 * @param {number} max - Maximum value
 * @param {string} label - Label for progress
 */
export function setProgressState(element, current, max, label) {
  if (!element) return;
  
  element.setAttribute('role', 'progressbar');
  element.setAttribute('aria-valuenow', current.toString());
  element.setAttribute('aria-valuemin', '0');
  element.setAttribute('aria-valuemax', max.toString());
  element.setAttribute('aria-label', label);
  
  const percentage = Math.round((current / max) * 100);
  element.setAttribute('aria-valuetext', `${percentage}%`);
}

/**
 * Set ARIA attributes for live region (for dynamic content)
 * @param {HTMLElement} element - Element to update
 * @param {string} priority - 'polite' or 'assertive'
 */
export function setLiveRegion(element, priority = 'polite') {
  if (!element) return;
  
  element.setAttribute('role', 'status');
  element.setAttribute('aria-live', priority);
  element.setAttribute('aria-atomic', 'true');
}

/**
 * Keyboard navigation helpers
 */
export const KeyboardKeys = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  SPACE: ' ',
};

/**
 * Handle keyboard navigation for list items
 * @param {KeyboardEvent} e - Keyboard event
 * @param {HTMLElement[]} items - Array of list items
 * @param {number} currentIndex - Current focused index
 * @returns {number} New focused index
 */
export function handleListNavigation(e, items, currentIndex) {
  let newIndex = currentIndex;
  
  switch (e.key) {
    case KeyboardKeys.ARROW_DOWN:
      e.preventDefault();
      newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      break;
    case KeyboardKeys.ARROW_UP:
      e.preventDefault();
      newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      break;
    case KeyboardKeys.HOME:
      e.preventDefault();
      newIndex = 0;
      break;
    case KeyboardKeys.END:
      e.preventDefault();
      newIndex = items.length - 1;
      break;
    default:
      return currentIndex;
  }
  
  items[newIndex]?.focus();
  return newIndex;
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers dark mode
 * @returns {boolean}
 */
export function prefersDarkMode() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Set page title for screen readers
 * @param {string} title - Page title
 */
export function setPageTitle(title) {
  document.title = title;
  announceToScreenReader(`Navigated to ${title}`, 'polite');
}

/**
 * Skip to main content link (for keyboard navigation)
 */
export function createSkipLink() {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--color-powder-blue);
    color: var(--color-text-primary);
    padding: 8px 16px;
    text-decoration: none;
    z-index: 1000;
  `;
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
  
  document.body.insertBefore(skipLink, document.body.firstChild);
}






