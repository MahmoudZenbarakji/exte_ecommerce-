import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useState, Suspense } from 'react'
import './index.css'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Import providers
import QueryProvider from './providers/QueryProvider'

// Import lazy components
import {
  LazyDashboard,
  LazyProductPage,
  LazyCategoryPage,
  LazySubcategoryPage,
  LazyCheckout,
  LazyGuestCheckout,
  LazyCart,
  LazyProfile,
  LazyFavorites,
  LazyCollection,
  LazyOrderConfirmation,
  LazyUserOrders,
  LazyProductManagement,
  LazyCategoryManagement,
  LazyOrderManagement,
  LazyUserManagement,
  LazyCollections,
  LazySales,
  LazyVideoManagement
} from './components/LazyWrapper'

// Import non-lazy components (small components that don't need lazy loading)
import NewHeader from './components/NewHeader'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import Home from './components/home'
import OptimizedHome from './components/OptimizedHome'
import Login from './components/login.jsx'
import Register from './components/register'
import DebugProductCard from './components/DebugProductCard'
import DebugCartPage from './components/DebugCartPage'
import WebsiteProductsTest from './components/WebsiteProductsTest'
import IntroductionPage from './components/IntroductionPage'
import LoginAdmin from './dashboard/loginAdmin'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import DashboardLayout from './dashboard/dashboardLayout'
// Import contexts
import { AuthProvider, CartProvider, CategoriesProvider, FavoritesProvider } from './contexts'

// Component to conditionally render header and footer
function AppContent() {
  const location = useLocation()
  const isDashboardRoute = location.pathname.startsWith('/dashboard')
  const isAdminLoginRoute = location.pathname === '/admin/login'
  const isIntroRoute = location.pathname === '/intro' || location.pathname === '/'
  const [sidebarOpen, setSidebarOpen] = useState(true) // Start with sidebar open on desktop
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false) // Mobile menu state

  return (
    <div>
      {!isDashboardRoute && !isAdminLoginRoute && !isIntroRoute && (
        <>
          <Sidebar 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />
          <NewHeader 
            setSidebarOpen={setSidebarOpen} 
            sidebarOpen={sidebarOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />
        </>
      )}
      <main className={classNames(
        !isDashboardRoute && !isAdminLoginRoute && !isIntroRoute ? 'transition-all duration-300' : '',
        !isDashboardRoute && !isAdminLoginRoute && !isIntroRoute && sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'
      )}>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div></div>}>
          <Routes>
            {/* Landing page routes */}
            <Route path="/" element={<IntroductionPage />} />
            <Route path="/home" element={<OptimizedHome />} />
            <Route path="/intro" element={<IntroductionPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<LoginAdmin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<LazyProfile />} />
            <Route path="/orders" element={<LazyUserOrders />} />
            <Route path="/cart" element={<LazyCart />} />
            <Route path="/favorites" element={<LazyFavorites />} />
            <Route path="/checkout" element={<LazyCheckout />} />
            <Route path="/order-confirmation/:orderId" element={<LazyOrderConfirmation />} />
            <Route path="/category/:categoryName" element={<LazyCategoryPage />} />
            <Route path="/collection/:collectionName" element={<LazyCollection />} />
            <Route path="/subcategory/:id" element={<LazySubcategoryPage />} />
            <Route path="/product/:productId" element={<LazyProductPage />} />
            <Route path="/debug-cart" element={<DebugCartPage />} />
            <Route path="/website-products-test" element={<WebsiteProductsTest />} />
          
            {/* Dashboard routes */}
            <Route path="/dashboard" element={
              <AdminProtectedRoute>
                <DashboardLayout />
              </AdminProtectedRoute>
            }>
                <Route index element={<LazyDashboard />} />
                <Route path="collections" element={<LazyCollections />} />
                <Route path="categories" element={<LazyCategoryManagement />} />
                <Route path="products" element={<LazyProductManagement />} />
                <Route path="sales" element={<LazySales />} />
                <Route path="orders" element={<LazyOrderManagement />} />
                <Route path="users" element={<LazyUserManagement />} />
                <Route path="videos" element={<LazyVideoManagement />} />
            </Route>

          </Routes>
        </Suspense>
        {/* dashboard routed */}

      </main>
      {!isDashboardRoute && !isAdminLoginRoute && !isIntroRoute && <Footer />}
    </div>
  )
}

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <CategoriesProvider>
              <Router>
                <AppContent />
              </Router>
            </CategoriesProvider>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </QueryProvider>
  )
}

export default App

// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
