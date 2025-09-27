import { Suspense, lazy } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
)

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
    <h2 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h2>
    <p className="text-gray-600 text-center mb-4">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
    >
      Try again
    </button>
  </div>
)

// Higher-order component for lazy loading
export function withLazyLoading(importFunc, fallback = LoadingSpinner) {
  const LazyComponent = lazy(importFunc)
  
  return function LazyWrapper(props) {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={fallback}>
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    )
  }
}

// Pre-configured lazy components
export const LazyDashboard = withLazyLoading(() => import('../dashboard/dashboard'))
export const LazyProductPage = withLazyLoading(() => import('./productPage'))
export const LazyCategoryPage = withLazyLoading(() => import('./categoryPage'))
export const LazySubcategoryPage = withLazyLoading(() => import('./SubcategoryPage'))
export const LazyCheckout = withLazyLoading(() => import('./checkout'))
export const LazyGuestCheckout = withLazyLoading(() => import('./guestCheckout'))
export const LazyCart = withLazyLoading(() => import('./cart'))
export const LazyProfile = withLazyLoading(() => import('./Profile'))
export const LazyFavorites = withLazyLoading(() => import('./Favorites'))
export const LazyCollection = withLazyLoading(() => import('./collection'))
export const LazyOrderConfirmation = withLazyLoading(() => import('./orderConfirmation'))
export const LazyUserOrders = withLazyLoading(() => import('./Orders'))

// Lazy loading for dashboard components
export const LazyProductManagement = withLazyLoading(() => import('../dashboard/product'))
export const LazyCategoryManagement = withLazyLoading(() => import('../dashboard/category'))
export const LazyOrderManagement = withLazyLoading(() => import('../dashboard/order'))
export const LazyUserManagement = withLazyLoading(() => import('../dashboard/users'))
export const LazyCollections = withLazyLoading(() => import('../dashboard/collections'))
export const LazySales = withLazyLoading(() => import('../dashboard/sales'))
export const LazyVideoManagement = withLazyLoading(() => import('../dashboard/video'))
