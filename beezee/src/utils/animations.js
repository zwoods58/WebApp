/**
 * Animation Utilities and Presets
 * Centralized animation definitions and helpers
 */

import { prefersReducedMotion } from './accessibility';

/**
 * Animation presets
 */
export const animations = {
  // Page transitions
  pageTransition: {
    out: {
      duration: 200,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      properties: {
        opacity: [1, 0],
        transform: ['translateX(0)', 'translateX(-20px)'],
      },
    },
    in: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      properties: {
        opacity: [0, 1],
        transform: ['translateX(20px)', 'translateX(0)'],
      },
    },
  },

  // Modal entry
  modalEntry: {
    backdrop: {
      duration: 200,
      easing: 'ease-out',
      properties: {
        opacity: [0, 1],
      },
    },
    content: {
      duration: 300,
      delay: 100,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      properties: {
        opacity: [0, 1],
        transform: ['scale(0.9)', 'scale(1)'],
      },
    },
  },

  // Button press
  buttonPress: {
    press: {
      duration: 100,
      easing: 'ease-out',
      properties: {
        transform: ['scale(1)', 'scale(0.95)'],
      },
    },
    release: {
      duration: 200,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      properties: {
        transform: ['scale(0.95)', 'scale(1)'],
      },
    },
  },

  // Card interactions
  cardLift: {
    hover: {
      duration: 200,
      easing: 'ease-out',
      properties: {
        transform: ['translateY(0)', 'translateY(-2px)'],
        boxShadow: [
          '0 2px 8px rgba(44, 44, 46, 0.04)',
          '0 4px 16px rgba(44, 44, 46, 0.08)',
        ],
      },
    },
  },

  // Number count-up
  countUp: {
    duration: 800,
    easing: 'ease-out',
  },

  // List items
  listItem: {
    stagger: 50,
    entry: {
      duration: 300,
      easing: 'ease-out',
      properties: {
        opacity: [0, 1],
        transform: ['translateY(10px)', 'translateY(0)'],
      },
    },
    exit: {
      duration: 200,
      easing: 'ease-in',
      properties: {
        opacity: [1, 0],
        transform: ['translateY(0)', 'translateY(-10px)'],
      },
    },
  },

  // Shimmer
  shimmer: {
    duration: 1500,
    easing: 'linear',
    iteration: 'infinite',
  },

  // Pulse
  pulse: {
    duration: 2000,
    easing: 'ease-in-out',
    iteration: 'infinite',
    properties: {
      opacity: [1, 0.5, 1],
    },
  },

  // Bounce
  bounce: {
    duration: 600,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    properties: {
      transform: ['scale(1)', 'scale(1.1)', 'scale(1)'],
    },
  },

  // Fade
  fade: {
    in: {
      duration: 200,
      easing: 'ease-out',
      properties: {
        opacity: [0, 1],
      },
    },
    out: {
      duration: 200,
      easing: 'ease-in',
      properties: {
        opacity: [1, 0],
      },
    },
  },

  // Slide
  slide: {
    up: {
      duration: 400,
      easing: 'ease-out',
      properties: {
        transform: ['translateY(100%)', 'translateY(0)'],
      },
    },
    down: {
      duration: 300,
      easing: 'ease-out',
      properties: {
        transform: ['translateY(-100%)', 'translateY(0)'],
      },
    },
  },
};

/**
 * Get animation CSS
 * @param {Object} animation - Animation config
 * @returns {string} CSS string
 */
export function getAnimationCSS(animation) {
  if (prefersReducedMotion()) {
    return 'none';
  }

  const {
    duration = 300,
    easing = 'ease',
    delay = 0,
    iteration = 1,
  } = animation;

  return `${duration}ms ${easing} ${delay}ms ${iteration === 'infinite' ? 'infinite' : iteration}`;
}

/**
 * Animate number count-up
 * @param {HTMLElement} element - Element to animate
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} duration - Duration in ms
 */
export function animateCountUp(element, start, end, duration = 800) {
  if (prefersReducedMotion()) {
    element.textContent = formatNumber(end);
    return;
  }

  const startTime = performance.now();
  const difference = end - start;

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out)
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + difference * eased;
    
    element.textContent = formatNumber(Math.floor(current));
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      element.textContent = formatNumber(end);
    }
  };

  requestAnimationFrame(animate);
}

/**
 * Format number for display
 * @param {number} num - Number to format
 * @returns {string}
 */
function formatNumber(num) {
  return new Intl.NumberFormat('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Stagger animation for list items
 * @param {HTMLElement[]} elements - Elements to animate
 * @param {Object} animation - Animation config
 * @param {number} staggerDelay - Delay between items
 */
export function staggerAnimation(elements, animation, staggerDelay = 50) {
  elements.forEach((element, index) => {
    setTimeout(() => {
      animateElement(element, animation);
    }, index * staggerDelay);
  });
}

/**
 * Animate element with config
 * @param {HTMLElement} element - Element to animate
 * @param {Object} animation - Animation config
 */
export function animateElement(element, animation) {
  if (prefersReducedMotion()) return;

  const {
    duration = 300,
    easing = 'ease',
    delay = 0,
    properties = {},
  } = animation;

  const keyframes = [];
  const timing = {
    duration,
    easing,
    delay,
    fill: 'forwards',
  };

  // Convert properties to keyframes
  Object.keys(properties).forEach(prop => {
    const values = properties[prop];
    if (Array.isArray(values)) {
      keyframes.push({ [prop]: values[0] });
      keyframes.push({ [prop]: values[1] });
    }
  });

  if (keyframes.length > 0) {
    element.animate(keyframes, timing);
  }
}

/**
 * Create ripple effect
 * @param {MouseEvent|TouchEvent} event - Event
 * @param {HTMLElement} element - Element to add ripple to
 */
export function createRipple(event, element) {
  if (prefersReducedMotion()) return;

  const ripple = document.createElement('span');
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = (event.clientX || event.touches[0].clientX) - rect.left - size / 2;
  const y = (event.clientY || event.touches[0].clientY) - rect.top - size / 2;

  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    border-radius: 50%;
    background: rgba(168, 213, 226, 0.3);
    transform: scale(0);
    animation: ripple 600ms ease-out;
    pointer-events: none;
  `;

  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Add ripple keyframes to document if not exists
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}







