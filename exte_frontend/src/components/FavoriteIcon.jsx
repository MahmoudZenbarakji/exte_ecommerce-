import { useState } from 'react'
import { Heart } from 'lucide-react'
import { useAuth, useFavorites } from '../contexts'

const FavoriteIcon = ({ 
  productId, 
  size = 'default',
  className = '',
  showText = false,
  onToggle = null
}) => {
  const { isAuthenticated } = useAuth()
  const { toggleFavorite, isFavorite } = useFavorites()
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      // Redirect to login page
      window.location.href = '/login'
      return
    }

    setIsLoading(true)
    try {
      if (onToggle) {
        await onToggle(productId)
      } else {
        await toggleFavorite(productId)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert(error.message || 'Failed to update favorites')
    } finally {
      setIsLoading(false)
    }
  }

  const isProductFavorite = isFavorite(productId)

  // Size variants
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  }

  const buttonSizeClasses = {
    sm: 'p-1.5',
    default: 'p-2',
    lg: 'p-2.5',
    xl: 'p-3'
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`
        ${buttonSizeClasses[size]}
        bg-white rounded-full shadow-lg border-2 transition-all duration-200 
        hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
        ${isProductFavorite 
          ? 'border-red-500 text-red-500 hover:border-red-600' 
          : 'border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-500'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      title={isProductFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart 
        className={`
          ${sizeClasses[size]}
          transition-colors duration-200
          ${isProductFavorite ? 'fill-current' : ''}
        `}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {showText && (
        <span className="ml-1 text-xs font-medium">
          {isProductFavorite ? 'Favorited' : 'Favorite'}
        </span>
      )}
    </button>
  )
}

export default FavoriteIcon
