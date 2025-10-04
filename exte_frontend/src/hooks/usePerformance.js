import { useEffect, useCallback } from 'react'
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

export function usePerformance() {
  const reportMetric = useCallback((metric) => {
    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`[Performance] ${metric.name}:`, metric.value)
    }
    
    // Send to analytics service in production
    if (import.meta.env.PROD) {
      // Example: Send to Google Analytics
      // gtag('event', metric.name, {
      //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      //   event_category: 'Web Vitals',
      //   event_label: metric.id,
      //   non_interaction: true,
      // })
    }
  }, [])

  useEffect(() => {
    // Measure Core Web Vitals
    onCLS(reportMetric)
    onINP(reportMetric) // INP replaced FID in web-vitals v3+
    onFCP(reportMetric)
    onLCP(reportMetric)
    onTTFB(reportMetric)
  }, [reportMetric])

  // Custom performance measurement
  const measurePerformance = useCallback((name, fn) => {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    
    const duration = end - start
    reportMetric({
      name: `Custom-${name}`,
      value: duration,
      id: `${name}-${Date.now()}`,
    })
    
    return result
  }, [reportMetric])

  // Measure component render time
  const measureRender = useCallback((componentName, renderFn) => {
    return measurePerformance(`Render-${componentName}`, renderFn)
  }, [measurePerformance])

  return {
    measurePerformance,
    measureRender,
  }
}

// Hook to measure API call performance
export function useApiPerformance() {
  const measureApiCall = useCallback(async (apiName, apiCall) => {
    const start = performance.now()
    
    try {
      const result = await apiCall()
      const end = performance.now()
      
      console.log(`[API Performance] ${apiName}: ${end - start}ms`)
      
      return result
    } catch (error) {
      const end = performance.now()
      console.error(`[API Performance] ${apiName} failed after ${end - start}ms:`, error)
      throw error
    }
  }, [])

  return { measureApiCall }
}
