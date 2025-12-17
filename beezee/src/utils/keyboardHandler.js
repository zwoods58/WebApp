/**
 * Keyboard Handling Utilities
 * Prevents layout shifts and handles mobile keyboard behavior
 */

/**
 * Set dynamic viewport height to prevent layout shift on keyboard open
 */
export function setupViewportHeight() {
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', setVH);

  return () => {
    window.removeEventListener('resize', setVH);
    window.removeEventListener('orientationchange', setVH);
  };
}

/**
 * Scroll input into view when focused (for mobile keyboards)
 */
export function handleInputFocus(e) {
  setTimeout(() => {
    e.target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  }, 300); // Wait for keyboard animation
}

/**
 * Prevent iOS zoom on input focus
 * Inputs should have font-size: 16px minimum
 */
export function preventIOSZoom(input) {
  if (input) {
    const style = window.getComputedStyle(input);
    const fontSize = parseFloat(style.fontSize);
    if (fontSize < 16) {
      input.style.fontSize = '16px';
    }
  }
}

/**
 * Handle Android back button
 */
export function handleAndroidBack(callback) {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    callback?.();
  }
}



