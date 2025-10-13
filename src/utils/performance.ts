// Performance monitoring utilities
export const performanceMonitor = {
  // Measure component render time
  measureRender: (componentName: string) => {
    const start = performance.now()
    return () => {
      const end = performance.now()
      const duration = end - start
      if (duration > 100) { // Log if render takes more than 100ms
        console.warn(`Slow render detected: ${componentName} took ${duration.toFixed(2)}ms`)
      }
    }
  },

  // Measure API call performance
  measureApiCall: async (apiName: string, apiCall: () => Promise<any>) => {
    const start = performance.now()
    try {
      const result = await apiCall()
      const end = performance.now()
      const duration = end - start
      if (duration > 1000) { // Log if API call takes more than 1s
        console.warn(`Slow API call detected: ${apiName} took ${duration.toFixed(2)}ms`)
      }
      return result
    } catch (error) {
      const end = performance.now()
      const duration = end - start
      console.error(`API call failed: ${apiName} took ${duration.toFixed(2)}ms`, error)
      throw error
    }
  },

  // Measure page load time
  measurePageLoad: (pageName: string) => {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        const loadTime = navigation.loadEventEnd - navigation.fetchStart
        if (loadTime > 3000) { // Log if page takes more than 3s to load
          console.warn(`Slow page load detected: ${pageName} took ${loadTime.toFixed(2)}ms`)
        }
      })
    }
  }
}

// React hook for performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  const endMeasure = performanceMonitor.measureRender(componentName)
  
  // Cleanup on unmount
  return () => {
    endMeasure()
  }
}
