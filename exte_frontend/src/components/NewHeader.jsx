import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu as Bars3Icon, Heart as HeartIcon } from 'lucide-react'
import { FiX as XMarkIcon } from 'react-icons/fi'
import { useCart, useAuth, useFavorites } from '../contexts.jsx'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function NewHeader({ setSidebarOpen, sidebarOpen, setMobileMenuOpen }) {
  const cartContext = useCart()
  const { cartCount = 0 } = cartContext || {}
  const { isAuthenticated, user } = useAuth()
  const { favorites } = useFavorites()

  return (
    <header className={classNames(
      "sticky top-0 z-40 bg-white border-b border-gray-200 transition-all duration-300",
      sidebarOpen ? "lg:pl-64" : "lg:pl-0"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Desktop sidebar toggle button */}
          <button
            className="hidden lg:block p-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>

          {/* Logo - hidden on mobile since it's in sidebar */}
          <div className="hidden lg:flex lg:flex-shrink-0">
            <Link to="/" className="text-2xl font-bold tracking-wider">
              <em>extē</em>
            </Link>
          </div>

          {/* Right side - Favorites and Cart */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <Link
                to="/favorites"
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <HeartIcon className="h-6 w-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default NewHeader
