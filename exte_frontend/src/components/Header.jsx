import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Search, ShoppingBag, User, Heart } from 'lucide-react'
import { FiX } from 'react-icons/fi'
import { useCart, useAuth } from '../contexts.jsx'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cartCount } = useCart()
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleUserClick = () => {
    if (isAuthenticated) {
      logout()
    } else {
      navigate('/login')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-4xl font-bold tracking-wider"><em>extē</em></Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/category/woman" className="text-sm font-medium hover:text-gray-600 transition-colors">WOMAN</Link>
            <Link to="/category/man" className="text-sm font-medium hover:text-gray-600 transition-colors">MAN</Link>
            <Link to="/category/kids" className="text-sm font-medium hover:text-gray-600 transition-colors">KIDS</Link>
            <Link to="/category/home" className="text-sm font-medium hover:text-gray-600 transition-colors">HOME</Link>
            <a href="#" className="text-sm font-medium hover:text-gray-600 transition-colors">SALE</a>
            {isAuthenticated && (
              <>
                <Link to="/profile" className="text-sm font-medium hover:text-gray-600 transition-colors">PROFILE</Link>
                <Link to="/orders" className="text-sm font-medium hover:text-gray-600 transition-colors">MY ORDERS</Link>
              </>
            )}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Search className="h-5 w-5 cursor-pointer hover:text-gray-600 transition-colors" />
            <div className="relative">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <User 
                    className="h-5 w-5 cursor-pointer hover:text-gray-600 transition-colors" 
                    onClick={handleUserClick}
                    title={`Logout (${user?.firstName} ${user?.lastName})`}
                  />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              ) : (
                <User 
                  className="h-5 w-5 cursor-pointer hover:text-gray-600 transition-colors" 
                  onClick={handleUserClick}
                  title="Login"
                />
              )}
            </div>
            <Heart className="h-5 w-5 cursor-pointer hover:text-gray-600 transition-colors" />
            <Link to="/cart" className="relative">
              <ShoppingBag className="h-5 w-5 cursor-pointer hover:text-gray-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-2">
            <Link to="/category/woman" className="block py-2 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>WOMAN</Link>
            <Link to="/category/man" className="block py-2 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>MAN</Link>
            <Link to="/category/kids" className="block py-2 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>KIDS</Link>
            <Link to="/category/home" className="block py-2 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>HOME</Link>
            <a href="#" className="block py-2 text-sm font-medium">SALE</a>
            {isAuthenticated && (
              <>
                <Link to="/profile" className="block py-2 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>PROFILE</Link>
                <Link to="/orders" className="block py-2 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>MY ORDERS</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header 