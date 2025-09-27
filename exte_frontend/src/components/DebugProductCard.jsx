import { useState, useCallback } from 'react'
import { useCart, useAuth, useFavorites } from '../contexts'
import { Heart } from 'lucide-react'

function DebugProductCard({ product }) {
  const { addToCart, cartCount } = useCart()
  const { isAuthenticated, user } = useAuth()
  const { toggleFavorite, isFavorite } = useFavorites()
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  const handleToggleFavorite = useCallback(async () => {
    if (!isAuthenticated) {
      setMessage('❌ Please login first to add favorites!')
      return
    }

    setFavoriteLoading(true)
    setMessage('')

    try {
      await toggleFavorite(product.id)
      setMessage(`✅ ${isFavorite(product.id) ? 'Removed from' : 'Added to'} favorites!`)
    } catch (error) {
      console.error('Error toggling favorite:', error)
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setFavoriteLoading(false)
    }
  }, [product.id, isAuthenticated, toggleFavorite, isFavorite])

  const handleAddToCart = useCallback(async () => {
    console.log('DebugProductCard handleAddToCart called')
    console.log('Product:', product)
    console.log('Is authenticated:', isAuthenticated)
    console.log('User:', user)
    console.log('Selected variant:', selectedVariant)
    
    if (!isAuthenticated) {
      setMessage('❌ Please login first!')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      // Check if product has variants and if color/size is selected
      if (product.variants && product.variants.length > 0) {
        if (!selectedVariant || !selectedVariant.color || !selectedVariant.size) {
          setMessage('❌ Please select both color and size before adding to cart')
          return
        }
      }

      console.log('Calling addToCart with:', {
        product,
        color: selectedVariant?.color,
        size: selectedVariant?.size,
        quantity: 1
      })

      await addToCart(
        product, 
        selectedVariant?.color, 
        selectedVariant?.size, 
        1
      )
      
      setMessage('✅ Product added to cart successfully!')
      console.log('Product added to cart successfully!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }, [product, addToCart, isAuthenticated, selectedVariant])

  return (
    <div style={{ 
      border: '2px solid #007bff', 
      padding: '20px', 
      margin: '20px',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa'
    }}>
      <h3>Debug Product Card</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
          <h4 style={{ margin: 0, flex: 1 }}>{product.name}</h4>
          <button
            onClick={handleToggleFavorite}
            disabled={favoriteLoading}
            className="p-2 bg-white rounded-full shadow-md border-2 border-gray-200 hover:border-red-300 transition-all duration-300 hover:scale-110"
            title={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              size={20} 
              color={isFavorite(product.id) ? '#ef4444' : '#6b7280'}
              fill={isFavorite(product.id) ? '#ef4444' : 'none'}
            />
          </button>
        </div>
        <p>Price: ${product.price}</p>
        <p>Variants: {product.variants ? product.variants.length : 0}</p>
        <p>Cart Count: {cartCount}</p>
        <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        <p>User: {user ? user.email : 'None'}</p>
        <p>Is Favorite: {isFavorite(product.id) ? 'Yes' : 'No'}</p>
      </div>

      {/* Color Selection */}
      {product.variants && product.variants.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <h5>Select Color:</h5>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[...new Set(product.variants.map(v => v.color))].map(color => (
              <button
                key={color}
                onClick={() => {
                  const availableSizes = product.variants
                    .filter(v => v.color === color)
                    .map(v => v.size)
                  const firstSize = availableSizes[0]
                  setSelectedVariant({ color, size: firstSize })
                }}
                style={{
                  padding: '5px 10px',
                  backgroundColor: selectedVariant?.color === color ? '#007bff' : '#e9ecef',
                  color: selectedVariant?.color === color ? 'white' : 'black',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {selectedVariant?.color && (
        <div style={{ marginBottom: '15px' }}>
          <h5>Select Size:</h5>
          <div style={{ display: 'flex', gap: '10px' }}>
            {product.variants
              .filter(v => v.color === selectedVariant.color)
              .map(variant => (
                <button
                  key={variant.size}
                  onClick={() => setSelectedVariant(prev => ({ ...prev, size: variant.size }))}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: selectedVariant.size === variant.size ? '#007bff' : '#e9ecef',
                    color: selectedVariant.size === variant.size ? 'white' : 'black',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {variant.size}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={loading || (product.variants && product.variants.length > 0 && (!selectedVariant || !selectedVariant.color || !selectedVariant.size))}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '10px',
          width: '100%'
        }}
      >
        {loading ? 'Adding to Cart...' : 'Add to Cart'}
      </button>

      {/* Message */}
      {message && (
        <div style={{ 
          padding: '10px', 
          borderRadius: '4px',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24'
        }}>
          {message}
        </div>
      )}

      {/* Selected Variant Info */}
      {selectedVariant && (
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          <p>Selected: {selectedVariant.color} - {selectedVariant.size}</p>
        </div>
      )}
    </div>
  )
}

export default DebugProductCard
