import { useState } from 'react'
import { useCart, useAuth, useFavorites } from '../contexts'
import { Heart } from 'lucide-react'

function SimpleProductCard({ product }) {
  const { addToCart, cartCount } = useCart()
  const { isAuthenticated } = useAuth()
  const { toggleFavorite, isFavorite } = useFavorites()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  const handleClick = async () => {
    console.log('SimpleProductCard: Button clicked!')
    console.log('Product:', product)
    console.log('Is authenticated:', isAuthenticated)
    console.log('Cart count:', cartCount)

    if (!isAuthenticated) {
      setMessage('Please login first!')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      console.log('Calling addToCart with real product:', product)
      
      // Check if product has variants and handle them properly
      if (product.variants && product.variants.length > 0) {
        const variant = product.variants[0]
        await addToCart(product, variant.color, variant.size, 1)
        setMessage(`SUCCESS: Product "${product.name}" (${variant.color}, ${variant.size}) added to cart!`)
      } else {
        await addToCart(product, null, null, 1)
        setMessage(`SUCCESS: Product "${product.name}" added to cart!`)
      }
      
      console.log('SUCCESS: Product added to cart!')
    } catch (error) {
      console.error('ERROR:', error)
      setMessage(`ERROR: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      setMessage('Please login to add favorites!')
      return
    }

    setFavoriteLoading(true)
    try {
      const wasFavorite = isFavorite(product.id)
      await toggleFavorite(product.id)
      
      if (!wasFavorite) {
        setMessage('Product added to favorites! ❤️')
      } else {
        setMessage('Product removed from favorites')
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      setMessage(error.message || 'Failed to update favorites')
    } finally {
      setFavoriteLoading(false)
    }
  }

  return (
    <div style={{ 
      border: '1px solid #ccc', 
      padding: '20px', 
      margin: '10px',
      borderRadius: '8px',
      maxWidth: '300px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <h3 style={{ margin: 0, flex: 1 }}>{product.name}</h3>
        <button
          onClick={handleToggleFavorite}
          disabled={favoriteLoading}
          className="p-3 bg-white rounded-full shadow-xl border-2 border-gray-300 hover:border-red-400 transition-all duration-300 hover:scale-125"
          title={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
          style={{ 
            backgroundColor: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: isFavorite(product.id) ? '2px solid #ef4444' : '2px solid #d1d5db'
          }}
        >
          <Heart 
            size={24} 
            color={isFavorite(product.id) ? '#ef4444' : '#374151'}
            fill={isFavorite(product.id) ? '#ef4444' : 'none'}
          />
        </button>
      </div>
      <p>Price: ${product.price}</p>
      <p>Cart Count: {cartCount}</p>
      <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
      
      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%',
          marginTop: '10px'
        }}
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>

      {message && (
        <div style={{ 
          marginTop: '10px',
          padding: '10px',
          backgroundColor: message.includes('SUCCESS') ? '#d4edda' : '#f8d7da',
          color: message.includes('SUCCESS') ? '#155724' : '#721c24',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}
    </div>
  )
}

export default SimpleProductCard
