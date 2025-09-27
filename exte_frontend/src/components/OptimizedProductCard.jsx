import { memo, useCallback, useMemo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, Plus, Eye } from 'lucide-react'
import OptimizedImage from './OptimizedImage'
import ColorPicker from './ColorPicker'
import { Button } from './ui/button'
import { useCart, useAuth, useFavorites } from '../contexts'
import SaleBadge from './SaleBadge'
import SalePrice from './SalePrice'

const OptimizedProductCard = memo(function OptimizedProductCard({ 
  product, 
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
  addingToCart = false 
}) {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { toggleFavorite, isFavorite: isProductFavorite } = useFavorites()
  const navigate = useNavigate()
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState('')

  // Automatically select the first available variant when component loads
  useEffect(() => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      const firstVariant = product.variants[0]
      setSelectedVariant({
        color: firstVariant.color,
        size: firstVariant.size
      })
    }
  }, [product.variants, selectedVariant])

  // Memoize the current image URL
  const currentImageUrl = useMemo(() => {
    if (product.images && product.images.length > 0) {
      const imageUrl = product.images[currentImageIndex]?.url || product.images[0].url
      return imageUrl.startsWith('http') 
        ? imageUrl 
        : `http://localhost:3000${imageUrl}`
    }
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=400&fit=crop'
  }, [product.images, currentImageIndex])

  // Handle image navigation
  const handleImageNavigation = useCallback((direction) => {
    if (!product.images || product.images.length <= 1) return

    if (direction === 'next') {
      setCurrentImageIndex(prev => (prev + 1) % product.images.length)
    } else if (direction === 'prev') {
      setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1)
    }
  }, [product.images])

  // Image modal functions
  const openImageModal = useCallback((imageUrl) => {
    setSelectedImageUrl(imageUrl)
    setIsImageModalOpen(true)
  }, [])

  const closeImageModal = useCallback(() => {
    setIsImageModalOpen(false)
    setSelectedImageUrl('')
  }, [])

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isImageModalOpen) {
        closeImageModal()
      }
    }

    if (isImageModalOpen) {
      document.addEventListener('keydown', handleEscKey)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [isImageModalOpen, closeImageModal])

  // Check if product has multiple images
  const hasMultipleImages = useMemo(() => {
    return product.images && product.images.length > 1
  }, [product.images])

  // Memoize the product link
  const productLink = useMemo(() => `/product/${product.id}`, [product.id])

  // Memoize the formatted price
  const formattedPrice = useMemo(() => `$${product.price}`, [product.price])

  // Memoize the product name
  const productName = useMemo(() => product.name, [product.name])

  // Memoize the product description
  const productDescription = useMemo(() => 
    product.description?.length > 100 
      ? `${product.description.substring(0, 100)}...` 
      : product.description, 
    [product.description]
  )

  // Memoize the handleAddToCart function
  const handleAddToCart = useCallback(async () => {
    console.log('OptimizedProductCard: Add to cart clicked')
    console.log('Product:', product)
    console.log('Selected variant:', selectedVariant)
    console.log('Is authenticated:', isAuthenticated)

    if (!isAuthenticated) {
      navigate('/register')
      return
    }

    if (onAddToCart) {
      await onAddToCart(product)
    } else {
      try {
        // For products with variants, use selected variant or first available
        let color = null
        let size = null
        
        if (product.variants && product.variants.length > 0) {
          if (selectedVariant) {
            color = selectedVariant.color
            size = selectedVariant.size
          } else {
            // Fallback to first variant if none selected
            const firstVariant = product.variants[0]
            color = firstVariant.color
            size = firstVariant.size
          }
        }

        console.log('Adding to cart with:', { product: product.id, color, size, quantity: 1 })
        
        await addToCart(
          product, 
          color, 
          size, 
          1
        )
        alert('Product added to cart!')
      } catch (error) {
        console.error('Error adding to cart:', error)
        alert(error.message || 'Failed to add product to cart')
      }
    }
  }, [product, onAddToCart, addToCart, isAuthenticated, navigate, selectedVariant])

  // Memoize the handleToggleFavorite function
  const handleToggleFavorite = useCallback(async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      if (onToggleFavorite) {
        onToggleFavorite(product.id)
      } else {
        const wasFavorite = isProductFavorite(product.id)
        await toggleFavorite(product.id)
        
        // Show success message
        if (!wasFavorite) {
          alert('✅ Product added to favorites! ❤️\n\nClick "View in Favorites" below to see your favorites.')
        } else {
          alert('❌ Product removed from favorites')
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert(error.message || 'Failed to update favorites')
    }
  }, [product.id, onToggleFavorite, toggleFavorite, isAuthenticated, navigate, isProductFavorite])

  // Determine if product is favorite
  const isProductInFavorites = isFavorite || isProductFavorite(product.id)

  // Image Modal Component
  const ImageModal = () => {
    if (!isImageModalOpen || !selectedImageUrl) return null

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300 ease-in-out"
        onClick={closeImageModal}
      >
        <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
          {/* Close Button */}
          <button
            onClick={closeImageModal}
            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10 bg-black bg-opacity-50 rounded-full p-2"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Image Container */}
          <div 
            className="relative bg-white rounded-lg shadow-2xl overflow-hidden max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImageUrl}
              alt="Product image"
              className="w-full h-auto max-h-[80vh] object-contain"
              onError={(e) => {
                e.target.src = '/placeholder-image.png'
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <OptimizedImage
          src={currentImageUrl}
          alt={productName}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          onClick={() => openImageModal(currentImageUrl)}
        />
          
          {/* Image navigation arrows - only show if multiple images */}
          {hasMultipleImages && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleImageNavigation('prev')
                }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleImageNavigation('next')
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image indicators - only show if multiple images */}
          {hasMultipleImages && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {product.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    currentImageIndex === index 
                      ? 'bg-white' 
                      : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Sale Badge */}
          <div className="absolute top-2 left-2 z-20">
            <SaleBadge product={product} size="default" />
          </div>

          {/* Favorite button - Always visible and prominent */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleToggleFavorite()
            }}
            className="absolute top-2 right-2 p-3 bg-white rounded-full shadow-xl border-2 border-gray-300 hover:border-red-400 transition-all duration-300 hover:scale-125 z-30"
            title={isProductInFavorites ? "Remove from favorites" : "Add to favorites"}
            style={{ 
              backgroundColor: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: isProductInFavorites ? '2px solid #ef4444' : '2px solid #d1d5db'
            }}
          >
            <Heart className={`h-6 w-6 transition-colors duration-200 ${isProductInFavorites ? 'fill-red-500 text-red-500' : 'text-gray-700 hover:text-red-500'}`} />
          </button>
        </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={productLink} className="block flex-1">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors">
              {productName}
            </h3>
          </Link>
          {hasMultipleImages && (
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full ml-2">
              {product.images.length} photos
            </span>
          )}
        </div>
        <Link to={productLink} className="block">
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {productDescription}
          </p>
        </Link>
        
        <div className="mb-4">
          <SalePrice product={product} size="default" />
        </div>

        {/* Color Picker */}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-3">
            <ColorPicker
              colors={[...new Set(product.variants.map(v => v.color))]}
              selectedColor={selectedVariant?.color}
              onColorSelect={(color) => {
                // Find the first available size for the selected color
                const availableSizes = product.variants
                  .filter(v => v.color === color)
                  .map(v => v.size)
                const firstSize = availableSizes[0]
                setSelectedVariant({ color, size: firstSize })
              }}
              size="sm"
              showLabels={true}
              maxDisplay={4}
            />
            
            {/* Size Selector */}
            {selectedVariant?.color && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Size:</p>
                <div className="flex space-x-2">
                  {product.variants
                    .filter(v => v.color === selectedVariant.color)
                    .map(variant => (
                      <button
                        key={variant.size}
                        onClick={() => setSelectedVariant(prev => ({ ...prev, size: variant.size }))}
                        className={`px-2 py-1 text-xs border rounded ${
                          selectedVariant.size === variant.size
                            ? 'border-gray-800 bg-gray-100'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {variant.size}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* View Details Button */}
          <Link
            to={productLink}
            className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-900 rounded-md font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors text-center block"
          >
            View Details
          </Link>
          
          {/* View Favorites Link - Only show if product is favorited */}
          {isProductInFavorites && (
            <Link
              to="/favorites"
              className="w-full py-2 px-4 bg-red-50 border border-red-200 text-red-600 rounded-md font-medium hover:bg-red-100 hover:border-red-300 transition-colors text-center block text-sm"
            >
              <Eye className="w-4 h-4 inline mr-1" />
              View in Favorites
            </Link>
          )}
          
          {/* Add to Cart and Favorite */}
          <div className="flex items-center justify-between">
            <Button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="flex-1 mr-2"
            >
              {addingToCart ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add to Cart
                </>
              )}
            </Button>
            
            {isAuthenticated && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleFavorite}
                className={`transition-all duration-200 ${
                  isProductInFavorites 
                    ? 'text-red-500 border-red-500 hover:bg-red-50 hover:scale-105' 
                    : 'hover:text-red-500 hover:border-red-300 hover:scale-105'
                }`}
                title={isProductInFavorites ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`w-4 h-4 ${isProductInFavorites ? 'fill-current' : ''}`} />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Image Modal */}
      <ImageModal />
    </div>
  )
})

export default OptimizedProductCard
