import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react'
import { Button } from './ui/button'
import { useFavorites, useAuth, useCart } from '../contexts'
import OptimizedImage from './OptimizedImage'
import SaleBadge from './SaleBadge'
import SalePrice from './SalePrice'

const Favorites = () => {
  const { favorites, loading, removeFromFavorites, isFavorite } = useFavorites()
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [addingToCart, setAddingToCart] = useState({})
  const [removingFromFavorites, setRemovingFromFavorites] = useState({})

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  const handleAddToCart = async (product) => {
    setAddingToCart(prev => ({ ...prev, [product.id]: true }))
    
    try {
      // For products with variants, use first available variant
      let color = null
      let size = null
      
      if (product.variants && product.variants.length > 0) {
        const firstVariant = product.variants[0]
        color = firstVariant.color
        size = firstVariant.size
      }

      await addToCart(product, color, size, 1)
      alert('Product added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert(error.message || 'Failed to add product to cart')
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }))
    }
  }

  const handleRemoveFromFavorites = async (productId) => {
    setRemovingFromFavorites(prev => ({ ...prev, [productId]: true }))
    
    try {
      await removeFromFavorites(productId)
    } catch (error) {
      console.error('Error removing from favorites:', error)
      alert(error.message || 'Failed to remove from favorites')
    } finally {
      setRemovingFromFavorites(prev => ({ ...prev, [productId]: false }))
    }
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          </div>
          <p className="text-gray-600">
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} in your favorites
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-8">Start adding products to your favorites to see them here</p>
            <Button onClick={() => navigate('/home')}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((favorite) => {
              const product = favorite.product
              const imageUrl = product.images && product.images.length > 0
                ? product.images[0].url.startsWith('http')
                  ? product.images[0].url
                  : `http://localhost:3000${product.images[0].url}`
                : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=400&fit=crop'

              return (
                <div key={favorite.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <Link to={`/product/${product.id}`}>
                      <OptimizedImage
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    
                    {/* Sale Badge */}
                    <div className="absolute top-2 left-2">
                      <SaleBadge product={product} size="default" />
                    </div>
                    
                    {/* Remove from favorites button */}
                    <button
                      onClick={() => handleRemoveFromFavorites(product.id)}
                      disabled={removingFromFavorites[product.id]}
                      className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors disabled:opacity-50"
                    >
                      {removingFromFavorites[product.id] ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      )}
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 hover:text-gray-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <SalePrice product={product} size="default" />
                      </div>
                      {product.category && (
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {product.category.name}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={addingToCart[product.id]}
                        className="w-full"
                      >
                        {addingToCart[product.id] ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <ShoppingCart className="w-4 h-4 mr-2" />
                        )}
                        Add to Cart
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => handleRemoveFromFavorites(product.id)}
                        disabled={removingFromFavorites[product.id]}
                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites
