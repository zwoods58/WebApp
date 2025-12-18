/**
 * Performance Optimization Utilities
 * Debouncing, throttling, lazy loading, virtualization helpers
 */

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy load images with Intersection Observer
 * @param {string} selector - Image selector
 * @param {Object} options - Intersection Observer options
 */
export function lazyLoadImages(selector = 'img[data-src]', options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
    ...options,
  };
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      }
    });
  }, defaultOptions);
  
  const images = document.querySelectorAll(selector);
  images.forEach(img => imageObserver.observe(img));
  
  return imageObserver;
}

/**
 * Lazy load components with dynamic import
 * @param {Function} importFunc - Dynamic import function
 * @returns {Promise} Component promise
 */
export async function lazyLoadComponent(importFunc) {
  try {
    const module = await importFunc();
    return module.default || module;
  } catch (error) {
    console.error('Failed to lazy load component:', error);
    throw error;
  }
}

/**
 * Virtualize list items (for long lists)
 * @param {HTMLElement} container - Container element
 * @param {Array} items - Array of items
 * @param {Function} renderItem - Function to render each item
 * @param {Object} options - Virtualization options
 */
export function virtualizeList(container, items, renderItem, options = {}) {
  const {
    itemHeight = 60,
    overscan = 5,
    onScroll,
  } = options;
  
  let startIndex = 0;
  let endIndex = Math.ceil(container.clientHeight / itemHeight) + overscan;
  
  const updateVisibleItems = () => {
    const scrollTop = container.scrollTop;
    startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    endIndex = Math.min(
      items.length,
      Math.ceil((scrollTop + container.clientHeight) / itemHeight) + overscan
    );
    
    const visibleItems = items.slice(startIndex, endIndex);
    const offsetY = startIndex * itemHeight;
    
    // Render visible items
    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.style.transform = `translateY(${offsetY}px)`;
    
    visibleItems.forEach((item, index) => {
      const element = renderItem(item, startIndex + index);
      wrapper.appendChild(element);
    });
    
    container.appendChild(wrapper);
    
    // Update container height
    container.style.height = `${items.length * itemHeight}px`;
    
    if (onScroll) {
      onScroll({ startIndex, endIndex, visibleItems });
    }
  };
  
  container.addEventListener('scroll', throttle(updateVisibleItems, 16));
  updateVisibleItems();
  
  return {
    update: updateVisibleItems,
    destroy: () => {
      container.removeEventListener('scroll', updateVisibleItems);
    },
  };
}

/**
 * Optimize gradient rendering
 * @param {HTMLElement} element - Element with gradient
 * @param {string} gradient - CSS gradient string
 */
export function optimizeGradient(element, gradient) {
  // Use will-change for better performance
  element.style.willChange = 'background-image';
  element.style.backgroundImage = gradient;
  
  // Remove will-change after animation
  requestAnimationFrame(() => {
    setTimeout(() => {
      element.style.willChange = 'auto';
    }, 1000);
  });
}

/**
 * Batch DOM updates
 * @param {Function} callback - Callback with DOM updates
 */
export function batchDOMUpdates(callback) {
  requestAnimationFrame(() => {
    callback();
  });
}

/**
 * Preload critical resources
 * @param {string[]} urls - Array of URLs to preload
 * @param {string} type - Resource type ('script', 'style', 'image')
 */
export function preloadResources(urls, type = 'script') {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    
    switch (type) {
      case 'script':
        link.as = 'script';
        break;
      case 'style':
        link.as = 'style';
        break;
      case 'image':
        link.as = 'image';
        break;
      default:
        link.as = type;
    }
    
    document.head.appendChild(link);
  });
}

/**
 * Memoize function results
 * @param {Function} func - Function to memoize
 * @param {Function} keyGenerator - Key generator function
 * @returns {Function} Memoized function
 */
export function memoize(func, keyGenerator = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  
  return function(...args) {
    const key = keyGenerator(...args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func.apply(this, args);
    cache.set(key, result);
    
    return result;
  };
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} threshold - Threshold percentage
 * @returns {boolean}
 */
export function isInViewport(element, threshold = 0) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= windowHeight + threshold &&
    rect.right <= windowWidth + threshold
  );
}

/**
 * Intersection Observer wrapper for performance
 * @param {HTMLElement|HTMLElement[]} elements - Elements to observe
 * @param {Function} callback - Callback function
 * @param {Object} options - Observer options
 * @returns {IntersectionObserver}
 */
export function observeElements(elements, callback, options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options,
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      callback(entry);
    });
  }, defaultOptions);
  
  const elementsArray = Array.isArray(elements) ? elements : [elements];
  elementsArray.forEach(el => {
    if (el) observer.observe(el);
  });
  
  return observer;
}

/**
 * Request idle callback wrapper
 * @param {Function} callback - Callback function
 * @param {Object} options - Options
 */
export function requestIdleCallback(callback, options = {}) {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }
  
  // Fallback for browsers without requestIdleCallback
  const timeout = options.timeout || 5000;
  return setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => 5,
    });
  }, timeout);
}

/**
 * Cancel idle callback
 * @param {number} id - Callback ID
 */
export function cancelIdleCallback(id) {
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

/**
 * Measure performance
 * @param {string} name - Performance mark name
 * @returns {Function} Function to end measurement
 */
export function measurePerformance(name) {
  const startMark = `${name}-start`;
  const endMark = `${name}-end`;
  
  if ('performance' in window && 'mark' in window.performance) {
    performance.mark(startMark);
  }
  
  return () => {
    if ('performance' in window && 'mark' in window.performance) {
      performance.mark(endMark);
      performance.measure(name, startMark, endMark);
      
      const measure = performance.getEntriesByName(name)[0];
      console.log(`${name}: ${measure.duration.toFixed(2)}ms`);
    }
  };
}

/**
 * Optimize scroll performance
 * @param {HTMLElement} element - Scrollable element
 * @param {Function} callback - Scroll callback
 * @returns {Function} Cleanup function
 */
export function optimizeScroll(element, callback) {
  let ticking = false;
  
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback(element.scrollTop, element.scrollLeft);
        ticking = false;
      });
      ticking = true;
    }
  };
  
  element.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    element.removeEventListener('scroll', handleScroll);
  };
}




